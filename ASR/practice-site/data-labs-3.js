/* ============================================================
   DATA-LABS-3.js — DNS, DHCP, Réseaux/VLAN, Routage
   ============================================================ */

const LABS_NET = [

/* ============================================================
   DNS
   ============================================================ */
{
  id: "dns-01",
  categorie: "dns",
  niveau: 2,
  numero: "LAB DNS 01",
  titre: "Créer des zones et enregistrements DNS",
  objectif: "Mettre en place une zone directe et une zone inverse, et créer les enregistrements courants (A, CNAME, MX, PTR).",
  prerequis: ["LAB AD 01 terminé (DNS installé avec AD)", "Théorie DNS"],
  machines: [{ nom: "VM01 — SRV-AD-01", role: "Serveur DNS" }, { nom: "VM04 — Linux Client", role: "Poste de test de résolution" }],
  architecture: `
    <div class="ascii-diagram">
client.lab.local
     |
DNS Server (SRV-AD-01, 192.168.50.1)
     |
server.lab.local -> 192.168.50.20 (A)
www.lab.local -> server.lab.local (CNAME)
mail.lab.local -> 192.168.50.25 (A) + enregistrement MX
    </div>`,
  ressources: { iso: [], ram: "", cpu: "", disque: "", reseau: "", logiciels: ["Gestionnaire DNS (dnsmgmt.msc)"] },
  etapes: [
    { titre: "Vérifier la zone directe existante", texte: "Ouvre dnsmgmt.msc. La zone lab.local a été créée automatiquement lors de la promotion AD (LAB AD 01). C'est une zone de recherche directe (nom → IP)." },
    { titre: "Créer la zone de recherche inversée", texte: "Clic droit sur 'Zones de recherche inversée' > Nouvelle zone > Zone principale intégrée à Active Directory > IPv4 > saisir l'ID réseau 192.168.50 (pour /24). Cette zone permettra la résolution IP → nom." },
    { titre: "Créer un enregistrement A", texte: "Clic droit sur lab.local > Nouvel hôte (A). Nom : server, IP : 192.168.50.20. Coche 'Créer l'enregistrement de pointeur associé (PTR)' pour peupler automatiquement la zone inverse." },
    { titre: "Créer un enregistrement CNAME (alias)", texte: "Clic droit sur lab.local > Nouvel alias (CNAME). Nom : www, nom de domaine complet cible : server.lab.local. Un CNAME pointe vers un autre nom, jamais directement vers une IP." },
    { titre: "Créer un enregistrement MX", texte: "Clic droit sur lab.local > Nouvel échangeur de courrier (MX). Serveur de messagerie : mail.lab.local (crée d'abord son enregistrement A si besoin), priorité : 10." }
  ],
  verification: [
    "Depuis VM04 : `nslookup server.lab.local 192.168.50.1` renvoie 192.168.50.20",
    "`nslookup www.lab.local 192.168.50.1` renvoie bien server.lab.local puis son IP (résolution du CNAME)",
    "`nslookup -type=PTR 192.168.50.20 192.168.50.1` renvoie server.lab.local",
    "`nslookup -type=MX lab.local 192.168.50.1` liste bien mail.lab.local"
  ],
  erreurs: [
    { probleme: "La résolution inverse (PTR) ne fonctionne pas", cause: "Zone inverse non créée avant l'enregistrement A, ou case 'créer PTR associé' non cochée", diagnostic: "Créer manuellement l'enregistrement PTR dans la zone inverse si l'automatisme n'a pas fonctionné." },
    { probleme: "nslookup renvoie 'server can't find'", cause: "Le client interrogé n'utilise pas le bon serveur DNS, ou tape une requête sans préciser le serveur", diagnostic: "Toujours préciser le serveur DNS explicitement dans nslookup pendant les tests (`nslookup <nom> <ip-dns>`) pour isoler le problème du cache DNS local du client." }
  ],
  challenge: "Ajoute un enregistrement SRV pour un service fictif (ex. _sip._tcp.lab.local) et explique en une phrase à quoi sert concrètement ce type d'enregistrement (indice : c'est le même mécanisme que _ldap vu au LAB AD 05).",
  validation: ["Zone inverse créée", "Enregistrement A + PTR fonctionnels", "CNAME fonctionnel", "MX créé et interrogeable"]
},
{
  id: "dns-02",
  categorie: "dns",
  niveau: 3,
  numero: "LAB DNS 02",
  titre: "Diagnostic DNS",
  objectif: "Savoir méthodiquement identifier la cause d'un problème de résolution de noms.",
  prerequis: ["LAB DNS 01 terminé"],
  machines: [{ nom: "VM01 — SRV-AD-01", role: "Serveur DNS" }, { nom: "VM03/VM04 — Clients", role: "Postes de test" }],
  architecture: `<div class="ascii-diagram">client.lab.local
        |
   [PANNE ICI ?]
        |
DNS Server ---- Forwarder (8.8.8.8, résolution Internet)
        |
server.lab.local</div>`,
  ressources: { iso: [], ram: "", cpu: "", disque: "", reseau: "", logiciels: [] },
  etapes: [
    {
      titre: "Boîte à outils de diagnostic DNS",
      commandes: [
        { commande: "nslookup", objectif: "Interroger un serveur DNS précis sur un nom précis", syntaxe: "nslookup <nom> <serveur>", exemple: "nslookup server.lab.local 192.168.50.1", resultat: "IP résolue ou message d'erreur explicite", explication: "Préciser le serveur permet d'isoler si le problème vient du DNS lui-même ou de la config du client.", erreur: "Sans préciser de serveur, on teste le DNS configuré localement, ce qui peut masquer la vraie cause." },
        { commande: "ipconfig /flushdns", objectif: "Vider le cache DNS local du client Windows", syntaxe: "ipconfig /flushdns", exemple: "ipconfig /flushdns", resultat: "Cache DNS resolver successfully flushed", explication: "Un cache DNS périmé peut donner l'impression qu'un enregistrement modifié côté serveur ne 'passe pas'.", erreur: "Sous Linux, la commande équivalente dépend du service utilisé (`systemd-resolve --flush-caches` ou redémarrage de nscd/systemd-resolved)." },
        { commande: "dig", objectif: "Interroger un serveur DNS en détail (Linux)", syntaxe: "dig @<serveur> <nom>", exemple: "dig @192.168.50.1 server.lab.local", resultat: "Réponse détaillée avec TTL, section ANSWER, temps de requête", explication: "Plus verbeux que nslookup, très utilisé en environnement Linux/production.", erreur: "Peut nécessiter `sudo apt install dnsutils` s'il n'est pas déjà présent." }
      ]
    },
    { titre: "Provoquer 3 pannes DNS différentes", texte: "Sans regarder la solution : 1) change le DNS du client vers une IP qui n'existe pas sur le réseau, 2) arrête le service DNS Server sur VM01 (services.msc), 3) supprime volontairement l'enregistrement A de server.lab.local. Pour chaque cas, note le message d'erreur exact obtenu côté client." }
  ],
  verification: ["Les 3 pannes ont été provoquées et documentées avec le message d'erreur exact associé", "Chaque panne a été corrigée et la résolution redevient fonctionnelle"],
  erreurs: [
    { probleme: "'DNS request timed out'", cause: "Le serveur DNS configuré est injoignable (mauvaise IP, service arrêté, pare-feu)", diagnostic: "`ping <ip-dns>` pour vérifier la joignabilité réseau avant même de soupçonner le service DNS lui-même." },
    { probleme: "'Non-existent domain'", cause: "Le serveur DNS répond mais l'enregistrement demandé n'existe pas (faute de frappe ou enregistrement supprimé)", diagnostic: "Vérifier l'orthographe exacte et l'existence de l'enregistrement dans dnsmgmt.msc." }
  ],
  challenge: "Un utilisateur dit : 'Internet ne marche plus mais je peux quand même accéder aux serveurs internes par IP'. Sans autre indice, explique en 3 étapes ta démarche de diagnostic pour confirmer qu'il s'agit bien d'un problème DNS et pas d'un problème réseau plus large.",
  validation: ["Boîte à outils nslookup/dig maîtrisée", "3 pannes DNS provoquées, diagnostiquées et corrigées avec méthode"]
},

/* ============================================================
   DHCP
   ============================================================ */
{
  id: "dhcp-01",
  categorie: "dhcp",
  niveau: 2,
  numero: "LAB DHCP 01",
  titre: "Installation du rôle DHCP et création d'un scope",
  objectif: "Installer le rôle DHCP et configurer une étendue (scope) distribuant automatiquement des adresses IP au réseau LAN-USERS.",
  prerequis: ["Théorie DHCP", "LAB Windows 01"],
  machines: [{ nom: "VM01 — SRV-AD-01", role: "Serveur DHCP" }],
  architecture: `<div class="ascii-diagram">Scope DHCP : 192.168.50.100 - 192.168.50.200
Gateway distribuée : 192.168.50.254
DNS distribué : 192.168.50.1
Bail (lease) : 8 jours</div>`,
  ressources: { iso: [], ram: "", cpu: "", disque: "", reseau: "", logiciels: ["Rôle DHCP Server"] },
  etapes: [
    { titre: "Installer le rôle DHCP", texte: "Gestionnaire de serveur > Ajouter des rôles > Serveur DHCP. Termine l'installation." },
    { titre: "Autoriser le serveur DHCP dans Active Directory", texte: "Dans la console DHCP, clic droit sur le serveur > Autoriser. Sans cette étape (spécifique à un environnement AD), le service DHCP démarre mais ne distribuera aucun bail — sécurité intégrée contre les serveurs DHCP non autorisés ('rogue DHCP')." },
    { titre: "Créer une étendue (scope)", texte: "Clic droit sur IPv4 > Nouvelle étendue. Nom : Scope-LAN-Users. Plage : 192.168.50.100 à 192.168.50.200. Masque : 255.255.255.0. Exclusions éventuelles (ex. .150-.155 réservées pour des serveurs manuels). Configure la passerelle (192.168.50.254) et le DNS (192.168.50.1) dans les options de l'étendue. Active l'étendue à la fin de l'assistant." }
  ],
  verification: ["L'étendue apparaît en vert (activée) dans la console DHCP", "Une VM client configurée en DHCP obtient bien une IP dans la plage 100-200", "`ipconfig /all` côté client montre la bonne passerelle et le bon DNS reçus automatiquement"],
  erreurs: [{ probleme: "Aucun client n'obtient d'IP malgré l'étendue active", cause: "Serveur DHCP non autorisé dans AD (statut visible par une icône rouge dans la console)", diagnostic: "Clic droit sur le serveur dans la console DHCP > Autoriser, puis attendre quelques secondes que le statut passe au vert." }],
  challenge: "Configure une seconde étendue pour un réseau différent (simule un futur VLAN, ex. 192.168.60.0/24) sur la même interface via le 'DHCP Relay' conceptuel — documente pourquoi un routeur/relay est nécessaire pour qu'un scope DHCP serve un réseau différent de celui du serveur.",
  validation: ["Rôle DHCP installé", "Serveur autorisé dans AD", "Étendue créée, activée et distribuant des IP valides testées sur un client réel"]
},
{
  id: "dhcp-02",
  categorie: "dhcp",
  niveau: 3,
  numero: "LAB DHCP 02",
  titre: "Réservations et diagnostic DHCP",
  objectif: "Réserver une IP fixe pour un poste précis via son adresse MAC, et savoir diagnostiquer un problème d'attribution DHCP.",
  prerequis: ["LAB DHCP 01 terminé"],
  machines: [{ nom: "VM01 — SRV-AD-01", role: "Serveur DHCP" }, { nom: "VM03 — PC client", role: "Poste à réserver" }],
  architecture: `<div class="ascii-diagram">MAC 08:00:27:XX:XX:XX (VM03) --toujours--> 192.168.50.120 (réservation)</div>`,
  ressources: { iso: [], ram: "", cpu: "", disque: "", reseau: "", logiciels: [] },
  etapes: [
    { titre: "Relever l'adresse MAC du client", texte: "Sur VM03 : `ipconfig /all`, note la ligne 'Adresse physique'." },
    { titre: "Créer la réservation", texte: "Dans la console DHCP > Étendue > Réservations > Nouvelle réservation. Renseigne le nom, l'IP souhaitée (dans la plage du scope), l'adresse MAC relevée, puis valide." },
    { titre: "Forcer le client à reprendre un bail", texte: "Sur VM03, en admin : `ipconfig /release` puis `ipconfig /renew`. Le client doit désormais obtenir systématiquement l'IP réservée." }
  ],
  verification: ["Après release/renew, VM03 obtient toujours la même IP réservée", "La réservation apparaît listée dans la console DHCP avec le bon statut"],
  erreurs: [
    { probleme: "Le client garde son ancienne IP après la réservation", cause: "Bail en cours non libéré, le client n'a pas redemandé d'adresse", diagnostic: "`ipconfig /release` puis `/renew` obligatoires pour forcer une nouvelle négociation DHCP." },
    { probleme: "\"Le PC n'obtient plus d'adresse IP\" (panne générale)", cause: "Étendue épuisée (plus d'IP disponible), service DHCP arrêté, ou câble/carte réseau virtuelle déconnectée", diagnostic: "Dans l'ordre : vérifier la connectivité de la carte réseau, vérifier `services.msc` sur le serveur DHCP, vérifier le pourcentage d'utilisation de l'étendue dans la console DHCP." }
  ],
  challenge: "Simule une étendue presque épuisée en réduisant volontairement la plage à seulement 3 adresses, connecte 4 VM clientes DHCP, et observe/documente ce qui se passe pour la 4e machine qui ne peut pas obtenir de bail.",
  validation: ["Réservation créée et confirmée fonctionnelle après release/renew", "Panne DHCP générale diagnostiquée avec méthode (3 causes possibles vérifiées dans l'ordre)"]
},

/* ============================================================
   RÉSEAUX & VLAN
   ============================================================ */
{
  id: "net-01",
  categorie: "reseau",
  niveau: 3,
  numero: "TP Réseau 01",
  titre: "Création des VLAN et affectation des ports",
  objectif: "Segmenter un réseau d'entreprise en VLAN distincts et configurer les ports d'accès et de trunk sur un switch simulé.",
  prerequis: ["Théorie VLAN", "Choix d'un simulateur : Packet Tracer, GNS3 ou EVE-NG"],
  machines: [{ nom: "Switch virtuel (Packet Tracer/GNS3)", role: "Commutateur niveau 2" }, { nom: "PC1 à PC5", role: "Postes de test, un par service" }],
  architecture: `
    <div class="ascii-diagram">
VLAN 10 — ADMINISTRATION   (ports Fa0/1-2)
VLAN 20 — RH               (ports Fa0/3-4)
VLAN 30 — IT               (ports Fa0/5-6)
VLAN 40 — SERVEURS         (ports Fa0/7-8)
VLAN 50 — INVITES          (ports Fa0/9-10)
Port Fa0/24 = TRUNK (vers le routeur/switch central)
    </div>`,
  ressources: { iso: [], ram: "", cpu: "", disque: "", reseau: "", logiciels: ["Packet Tracer (simple, pédagogique, Cisco) ou GNS3/EVE-NG (plus réaliste, IOS réel ou images constructeur)"] },
  etapes: [
    {
      titre: "Créer les VLAN sur le switch",
      commandes: [
        { commande: "vlan / name", objectif: "Créer un VLAN et le nommer", syntaxe: "Switch(config)# vlan <id>\\nSwitch(config-vlan)# name <nom>", exemple: "Switch(config)# vlan 10\\nSwitch(config-vlan)# name ADMINISTRATION", resultat: "Le VLAN 10 apparaît dans `show vlan brief`", explication: "Le nommage n'est pas obligatoire techniquement mais indispensable pour la lisibilité en exploitation réelle.", erreur: "Créer le VLAN sans sortir du mode config-vlan avant de passer à l'affectation de port (`exit` nécessaire)." }
      ]
    },
    {
      titre: "Affecter les ports en mode access",
      commandes: [
        { commande: "switchport access vlan", objectif: "Rattacher un port à un VLAN précis", syntaxe: "Switch(config-if)# switchport mode access\\nSwitch(config-if)# switchport access vlan <id>", exemple: "Switch(config)# interface fa0/1\\nSwitch(config-if)# switchport mode access\\nSwitch(config-if)# switchport access vlan 10", resultat: "Le port Fa0/1 appartient désormais au VLAN 10", explication: "Un port en mode access ne transporte le trafic que d'un seul VLAN — c'est le mode utilisé pour connecter un PC.", erreur: "Oublier `switchport mode access` peut laisser le port en mode 'dynamic' ambigu selon les modèles." }
      ]
    },
    {
      titre: "Configurer le port trunk",
      commandes: [
        { commande: "switchport mode trunk", objectif: "Faire transporter plusieurs VLAN sur un seul lien (vers le routeur ou un autre switch)", syntaxe: "Switch(config-if)# switchport mode trunk", exemple: "Switch(config)# interface fa0/24\\nSwitch(config-if)# switchport mode trunk", resultat: "Le port Fa0/24 transporte tous les VLAN autorisés (par défaut, tous)", explication: "Un trunk est indispensable dès qu'un seul lien physique doit transporter plusieurs VLAN, typiquement vers le routeur du inter-VLAN routing.", erreur: "Relier deux ports en mode access appartenant à des VLAN différents ne permettra jamais la communication — c'est le trunk qui les fait cohabiter sur un même câble." }
      ]
    },
    { titre: "Vérifier la configuration", texte: "`show vlan brief` pour voir la répartition des ports par VLAN. `show interfaces trunk` pour confirmer le port trunk et les VLAN autorisés dessus." }
  ],
  verification: ["`show vlan brief` montre les 5 VLAN avec les bons ports affectés", "Deux PC dans le même VLAN se pinguent", "Deux PC dans des VLAN différents NE se pinguent PAS (c'est le comportement normal et attendu à ce stade, avant le routage inter-VLAN)"],
  erreurs: [{ probleme: "Deux PC du même VLAN ne se pinguent pas", cause: "IP/masque incohérents entre les deux PC, ou port mal affecté au VLAN", diagnostic: "`show vlan brief` pour confirmer l'affectation réelle du port, puis vérifier la config IP de chaque PC." }],
  challenge: "Ajoute un 6e VLAN 'Visio' pour des équipements IoT/caméras, sans toucher à la configuration des 5 VLAN existants, et vérifie qu'il est bien isolé de tous les autres.",
  validation: ["5 VLAN créés et nommés", "Ports access correctement affectés", "Port trunk fonctionnel", "Isolation inter-VLAN confirmée (pas de communication sans routage)"]
},
{
  id: "net-02",
  categorie: "reseau",
  niveau: 3,
  numero: "TP Réseau 02",
  titre: "Inter-VLAN routing et vérification de communication",
  objectif: "Permettre la communication entre VLAN grâce à un routeur (ou switch de niveau 3), avec le modèle router-on-a-stick.",
  prerequis: ["TP Réseau 01 terminé"],
  machines: [{ nom: "Routeur virtuel", role: "Routage inter-VLAN (router-on-a-stick)" }, { nom: "Switch (du TP précédent)", role: "" }],
  architecture: `
    <div class="ascii-diagram">
Routeur
  Fa0/0.10 -> 192.168.10.1/24 (VLAN 10)
  Fa0/0.20 -> 192.168.20.1/24 (VLAN 20)
  Fa0/0.30 -> 192.168.30.1/24 (VLAN 30)
     |
Fa0/0 (trunk unique) --- Switch Fa0/24 (trunk)
    </div>`,
  ressources: { iso: [], ram: "", cpu: "", disque: "", reseau: "", logiciels: [] },
  etapes: [
    {
      titre: "Configurer les sous-interfaces sur le routeur",
      commandes: [
        { commande: "interface .sub / encapsulation dot1Q", objectif: "Créer une sous-interface associée à un VLAN encapsulé en 802.1Q", syntaxe: "Router(config)# interface fa0/0.10\\nRouter(config-subif)# encapsulation dot1Q 10\\nRouter(config-subif)# ip address 192.168.10.1 255.255.255.0", exemple: "interface fa0/0.10 / encapsulation dot1Q 10 / ip address 192.168.10.1 255.255.255.0", resultat: "La sous-interface devient la passerelle du VLAN 10", explication: "'Router-on-a-stick' : un seul lien physique (trunk) porte plusieurs sous-interfaces logiques, une par VLAN.", erreur: "Le numéro dans `encapsulation dot1Q <id>` doit correspondre exactement à l'ID du VLAN configuré sur le switch." },
        { commande: "no shutdown", objectif: "Activer l'interface physique parente", syntaxe: "Router(config-if)# no shutdown", exemple: "interface fa0/0 / no shutdown", resultat: "L'interface physique passe en 'up'", explication: "Les sous-interfaces ne fonctionnent que si l'interface physique parente est active.", erreur: "Oublier ce `no shutdown` sur l'interface physique est une erreur très fréquente qui bloque tout le routeur." }
      ]
    },
    { titre: "Définir les passerelles côté PC", texte: "Sur chaque PC, configure la passerelle par défaut vers la sous-interface correspondant à son VLAN (ex. PC du VLAN 10 → passerelle 192.168.10.1)." },
    { titre: "Tester la communication inter-VLAN", texte: "Depuis un PC du VLAN 10, pingue un PC du VLAN 20. Ça doit maintenant fonctionner, contrairement au TP précédent." }
  ],
  verification: ["`show ip route` sur le routeur montre les réseaux connectés pour chaque VLAN", "Un PC du VLAN 10 pingue avec succès un PC du VLAN 30", "`show ip interface brief` confirme que toutes les sous-interfaces sont 'up/up'"],
  erreurs: [
    { probleme: "Ping inter-VLAN échoue toujours", cause: "Passerelle mal configurée côté PC, ou `no shutdown` oublié sur l'interface physique", diagnostic: "`show ip interface brief` sur le routeur : toute interface 'administratively down' doit être activée avec `no shutdown`." }
  ],
  challenge: "Le VLAN 50 (Invités) ne doit JAMAIS pouvoir joindre le VLAN 40 (Serveurs), même avec le routage inter-VLAN en place. Trouve seul le mécanisme approprié pour bloquer spécifiquement ce flux sans bloquer les autres (indice : ACL sur le routeur).",
  validation: ["Sous-interfaces configurées pour tous les VLAN", "Passerelles correctement définies côté PC", "Communication inter-VLAN fonctionnelle et vérifiée"]
},

/* ============================================================
   ROUTAGE
   ============================================================ */
{
  id: "rtg-01",
  categorie: "routage",
  niveau: 3,
  numero: "TP Routage 01",
  titre: "Routes statiques et route par défaut",
  objectif: "Configurer manuellement des routes entre plusieurs réseaux non directement connectés.",
  prerequis: ["TP Réseau 02 terminé", "Théorie routage"],
  machines: [{ nom: "Routeur A", role: "Relié au LAN interne" }, { nom: "Routeur B", role: "Relié à Internet (simulé)" }],
  architecture: `
    <div class="ascii-diagram">
LAN (192.168.10.0/24) -- RouterA -- 10.0.0.0/30 -- RouterB -- Internet (simulé)
    </div>`,
  ressources: { iso: [], ram: "", cpu: "", disque: "", reseau: "", logiciels: [] },
  etapes: [
    {
      titre: "Configurer une route statique",
      commandes: [
        { commande: "ip route", objectif: "Ajouter une route manuelle vers un réseau distant", syntaxe: "Router(config)# ip route <réseau> <masque> <next-hop>", exemple: "RouterA(config)# ip route 172.16.0.0 255.255.255.0 10.0.0.2", resultat: "RouterA sait désormais joindre 172.16.0.0/24 en passant par 10.0.0.2", explication: "Une route statique doit être répétée sur chaque routeur du chemin dans les deux sens (aller et retour) pour que la communication fonctionne complètement.", erreur: "Configurer la route dans un seul sens (aller) sans la route retour équivalente : le ping part mais la réponse ne revient jamais." }
      ]
    },
    {
      titre: "Configurer une route par défaut",
      commandes: [
        { commande: "ip route 0.0.0.0 0.0.0.0", objectif: "Définir la route utilisée quand aucune route plus précise ne correspond", syntaxe: "Router(config)# ip route 0.0.0.0 0.0.0.0 <next-hop>", exemple: "RouterA(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.2", resultat: "Tout trafic sans route spécifique part vers 10.0.0.2", explication: "C'est l'équivalent routeur de la 'passerelle par défaut' côté PC — indispensable pour sortir vers Internet.", erreur: "Une route par défaut mal orientée peut créer une boucle de routage difficile à diagnostiquer." }
      ]
    }
  ],
  verification: ["`show ip route` affiche les routes statiques marquées 'S'", "Ping bout-en-bout réussi entre les deux LAN distants", "`traceroute`/`tracert` montre le bon chemin emprunté"],
  erreurs: [{ probleme: "Ping part mais 'Request timed out' côté source", cause: "Route retour absente sur le routeur distant", diagnostic: "Vérifier `show ip route` sur CHAQUE routeur du chemin, pas seulement celui d'où part le ping." }],
  challenge: "Ajoute un troisième réseau et une troisième route statique en cascade (Réseau A → Routeur A → Routeur B → Réseau C), puis simplifie la config en remplaçant les routes spécifiques par une seule route par défaut là où c'est pertinent.",
  validation: ["Route statique configurée et fonctionnelle dans les deux sens", "Route par défaut configurée", "Connectivité bout-en-bout vérifiée avec ping et traceroute"]
},
{
  id: "rtg-02",
  categorie: "routage",
  niveau: 4,
  numero: "TP Routage 02",
  titre: "NAT, PAT et accès Internet simulé",
  objectif: "Comprendre et configurer la traduction d'adresses pour permettre à un réseau privé de sortir vers un réseau public simulé.",
  prerequis: ["TP Routage 01 terminé"],
  machines: [{ nom: "Routeur périphérique", role: "Frontière LAN privé / réseau public simulé" }],
  architecture: `<div class="ascii-diagram">LAN privé 192.168.10.0/24 --NAT/PAT--> IP publique unique (simulée) 203.0.113.5</div>`,
  ressources: { iso: [], ram: "", cpu: "", disque: "", reseau: "", logiciels: [] },
  etapes: [
    {
      titre: "Définir les interfaces inside/outside",
      commandes: [
        { commande: "ip nat inside / outside", objectif: "Indiquer au routeur quelle interface est privée et laquelle est publique", syntaxe: "Router(config-if)# ip nat inside  /  ip nat outside", exemple: "interface fa0/0 -> ip nat inside ; interface fa0/1 -> ip nat outside", resultat: "Le routeur sait sur quelle direction appliquer la traduction", explication: "Sans cette déclaration, la commande NAT elle-même ne produit aucun effet.", erreur: "Inverser inside/outside est une erreur fréquente qui rend le NAT totalement inopérant sans message d'erreur explicite." }
      ]
    },
    {
      titre: "Configurer le PAT (NAT avec surcharge)",
      commandes: [
        { commande: "ip nat inside source list ... interface ... overload", objectif: "Traduire toutes les IP privées vers l'unique IP publique de l'interface externe", syntaxe: "Router(config)# access-list 1 permit 192.168.10.0 0.0.0.255\\nRouter(config)# ip nat inside source list 1 interface fa0/1 overload", exemple: "access-list 1 permit 192.168.10.0 0.0.0.255 / ip nat inside source list 1 interface fa0/1 overload", resultat: "Tous les postes du LAN sortent avec la même IP publique, différenciés par leur port source", explication: "C'est exactement le mécanisme utilisé par une box Internet grand public pour partager une seule IP publique entre tous les appareils du foyer.", erreur: "Access-list mal formulée (wildcard mask 0.0.0.255 souvent confondu avec un masque classique 255.255.255.0)." }
      ]
    }
  ],
  verification: ["`show ip nat translations` liste les traductions actives pendant un test de ping/accès", "Un PC du LAN privé accède à une ressource simulée côté 'Internet' via l'IP publique unique"],
  erreurs: [{ probleme: "Aucune traduction n'apparaît dans `show ip nat translations`", cause: "Interfaces inside/outside non déclarées, ou access-list ne correspondant pas au bon réseau source", diagnostic: "`show ip interface fa0/0 | include NAT` pour confirmer que le NAT est bien actif sur l'interface attendue." }],
  challenge: "Mets en place un NAT statique en plus du PAT pour exposer un serveur web interne (192.168.10.50) sur un port spécifique de l'IP publique, en gardant le PAT actif pour tout le reste du trafic sortant.",
  validation: ["Interfaces inside/outside déclarées", "PAT fonctionnel avec overload", "Traductions visibles et vérifiées pendant un test réel"]
}
];
