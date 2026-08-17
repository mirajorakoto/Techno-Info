/* ============================================================
   DATA-LABS-4.js — Firewall/VPN, Serveurs, Stockage/Backup, Monitoring
   ============================================================ */

const LABS_SEC_SRV = [

/* ============================================================
   FIREWALL & VPN
   ============================================================ */
{
  id: "fw-01",
  categorie: "firewall",
  niveau: 4,
  numero: "TP Firewall 01",
  titre: "Pare-feu périmétrique avec DMZ (pfSense/OPNsense)",
  objectif: "Mettre en place un firewall en périphérie du réseau avec une zone démilitarisée (DMZ) pour héberger un service exposé.",
  prerequis: ["Théorie firewall/DMZ", "LAB 01 (réseaux virtuels)"],
  machines: [{ nom: "VM Firewall", role: "pfSense ou OPNsense (3 interfaces)" }, { nom: "VM Serveur Web (DMZ)", role: "Service exposé" }, { nom: "PC client LAN", role: "Poste interne" }],
  architecture: `
    <div class="ascii-diagram">
Internet
   |
Firewall (pfSense/OPNsense)
   |--- WAN  (réseau NAT hyperviseur)
   |--- LAN  (192.168.10.0/24, postes internes)
   |--- DMZ  (192.168.20.0/24, serveur web exposé)
    </div>`,
  ressources: { iso: ["pfSense CE ou OPNsense (ISO gratuite)"], ram: "2 Go pour le firewall", cpu: "2 vCPU", disque: "20 Go", reseau: "3 cartes réseau virtuelles distinctes (WAN/LAN/DMZ)", logiciels: [] },
  etapes: [
    { titre: "Installer le firewall avec 3 interfaces", texte: "Crée la VM pare-feu avec 3 cartes réseau : une sur le réseau NAT (WAN), une sur un réseau interne LAN, une sur un réseau interne distinct DMZ. Installe pfSense/OPNsense et assigne les interfaces pendant l'installation console." },
    { titre: "Configurer les interfaces via l'interface web", texte: "Depuis un PC du LAN, accède à l'interface web du firewall (https://192.168.10.1). Assigne les plages IP : LAN 192.168.10.0/24, DMZ 192.168.20.0/24." },
    { titre: "Créer les règles de base LAN → Internet", texte: "Onglet Firewall > Rules > LAN. Autorise le trafic sortant du LAN vers Internet (souvent autorisé par défaut sur l'interface LAN, à vérifier explicitement)." },
    { titre: "Créer les règles Internet → DMZ", texte: "Onglet Firewall > Rules > WAN. Ajoute une règle n'autorisant QUE le port 80/443 depuis Internet vers l'IP du serveur web en DMZ (via NAT de redirection de port). Aucun autre port ne doit être ouvert depuis l'extérieur." },
    { titre: "Bloquer DMZ → LAN", texte: "Onglet Firewall > Rules > DMZ. Ajoute une règle de blocage explicite du trafic DMZ vers le réseau LAN. C'est le principe même de la DMZ : si le serveur exposé est compromis, il ne doit pas pouvoir rebondir vers le réseau interne." }
  ],
  verification: ["Le PC du LAN accède normalement à Internet", "Depuis 'Internet' (réseau WAN), seul le port 80/443 du serveur DMZ est joignable, tout le reste est bloqué (`Test-NetConnection` ou `nc -zv` sur d'autres ports)", "Le serveur DMZ ne peut PAS initier de connexion vers un poste du LAN"],
  erreurs: [
    { probleme: "Le serveur DMZ n'est pas accessible depuis l'extérieur", cause: "Redirection de port (NAT) manquante ou mal ciblée vers l'IP interne du serveur", diagnostic: "Onglet Firewall > NAT > Port Forward : vérifier l'IP de destination et le port exact configurés." },
    { probleme: "Le LAN et la DMZ communiquent librement dans les deux sens", cause: "Règle de blocage DMZ → LAN absente ou mal positionnée (l'ordre des règles compte, la première règle qui matche s'applique)", diagnostic: "Revoir l'ordre des règles sur l'interface DMZ : les règles de blocage explicites doivent être positionnées avant toute règle permissive large." }
  ],
  challenge: "Ajoute une règle temporaire permettant à UN SEUL poste précis du LAN (par IP) d'administrer le serveur DMZ en SSH/RDP, sans ouvrir ce même accès à tout le LAN ni à Internet.",
  validation: ["3 interfaces configurées (WAN/LAN/DMZ)", "Redirection de port fonctionnelle vers la DMZ", "Isolation DMZ → LAN confirmée", "Accès LAN → Internet fonctionnel"]
},
{
  id: "vpn-01",
  categorie: "firewall",
  niveau: 4,
  numero: "TP VPN 01",
  titre: "Accès distant sécurisé par VPN",
  objectif: "Configurer un accès VPN permettant à un utilisateur distant de rejoindre le réseau d'entreprise de façon chiffrée et authentifiée.",
  prerequis: ["TP Firewall 01 terminé"],
  machines: [{ nom: "VM Firewall (pfSense/OPNsense)", role: "Serveur VPN" }, { nom: "PC client distant", role: "Simule un utilisateur hors de l'entreprise" }],
  architecture: `
    <div class="ascii-diagram">
Utilisateur distant (PC client VPN)
       |
    Tunnel VPN chiffré
       |
Firewall (serveur VPN)
       |
Réseau entreprise (LAN 192.168.10.0/24)
    </div>`,
  ressources: { iso: [], ram: "", cpu: "", disque: "", reseau: "", logiciels: ["Package OpenVPN (intégré à pfSense/OPNsense)", "Client OpenVPN sur le poste distant"] },
  etapes: [
    { titre: "Créer une autorité de certification locale", texte: "Onglet System > Cert Manager > CAs > Add. Cette CA interne signera les certificats du serveur et des clients VPN." },
    { titre: "Générer le certificat serveur et le certificat client", texte: "Cert Manager > Certificates > Add. Crée un certificat 'server' pour le firewall, puis un certificat par utilisateur distant autorisé." },
    { titre: "Configurer le serveur OpenVPN", texte: "VPN > OpenVPN > Servers > Add. Choisis l'authentification par certificat (+ éventuellement login/mot de passe en plus), définis la plage d'IP virtuelles distribuées aux clients VPN (ex. 10.8.0.0/24), et le réseau local accessible une fois connecté (192.168.10.0/24)." },
    { titre: "Exporter la configuration client", texte: "Utilise le package 'OpenVPN Client Export' pour générer un fichier .ovpn prêt à l'emploi incluant certificat et paramètres, à installer sur le poste distant." },
    { titre: "Créer les règles firewall sur l'interface VPN", texte: "Firewall > Rules > OpenVPN. Autorise explicitement le trafic nécessaire depuis les clients VPN vers le LAN (par défaut, rien n'est autorisé)." }
  ],
  verification: ["Le client distant établit le tunnel avec succès (statut connecté dans le client OpenVPN)", "Une fois connecté, le client obtient une IP virtuelle dans la plage VPN", "Le client distant peut pinguer et accéder à des ressources du LAN interne (ex. le partage SMB du LAB Windows 03)", "Sans le VPN actif, ces mêmes ressources sont injoignables depuis l'extérieur"],
  erreurs: [
    { probleme: "Le tunnel s'établit mais aucune ressource du LAN n'est accessible", cause: "Règle firewall manquante sur l'interface OpenVPN autorisant le trafic vers le LAN", diagnostic: "Vérifier Firewall > Rules > OpenVPN : par défaut, une interface VPN nouvellement créée n'autorise rien." },
    { probleme: "Le client échoue à se connecter (handshake TLS échoué)", cause: "Certificat client expiré, révoqué, ou généré avec une CA différente de celle du serveur", diagnostic: "Vérifier la correspondance exacte entre la CA utilisée côté serveur et celle ayant signé le certificat client." }
  ],
  challenge: "Restreins l'accès VPN pour qu'un utilisateur distant ne puisse joindre QUE le serveur de fichiers (pas l'ensemble du LAN), en combinant règles firewall sur l'interface OpenVPN et une plage réseau ciblée.",
  validation: ["CA et certificats créés", "Serveur OpenVPN opérationnel", "Connexion client distante réussie et vérifiée", "Accès aux ressources internes confirmé uniquement via le VPN actif"]
},

/* ============================================================
   SERVEURS APPLICATIFS
   ============================================================ */
{
  id: "srv-01",
  categorie: "serveurs",
  niveau: 3,
  numero: "TP Serveur 01",
  titre: "Serveur web (Apache/Nginx) et hébergement d'un site",
  objectif: "Installer et configurer un serveur web accessible sur le réseau, avec un premier site fonctionnel.",
  prerequis: ["LAB Linux 03 terminé"],
  machines: [{ nom: "VM02 — Ubuntu Server", role: "Serveur web" }],
  architecture: `<div class="ascii-diagram">Client --HTTP:80--> Nginx/Apache (VM02) --sert--> /var/www/monsite</div>`,
  ressources: { iso: [], ram: "2 Go", cpu: "2 vCPU", disque: "20 Go", reseau: "Port 80 ouvert dans UFW", logiciels: ["nginx ou apache2"] },
  etapes: [
    {
      titre: "Installer et démarrer le serveur web",
      commandes: [
        { commande: "apt install nginx", objectif: "Installer Nginx", syntaxe: "sudo apt install -y nginx", exemple: "sudo apt install -y nginx", resultat: "Nginx est installé et démarré automatiquement", explication: "Nginx est réputé plus léger et performant pour du contenu statique/reverse proxy ; Apache reste très répandu pour son écosystème de modules (.htaccess).", erreur: "Le port 80 peut déjà être occupé par un autre service (rare mais possible)." },
        { commande: "ufw allow 'Nginx Full'", objectif: "Ouvrir les ports HTTP/HTTPS dans le pare-feu local", syntaxe: "sudo ufw allow 'Nginx Full'", exemple: "sudo ufw allow 'Nginx Full'", resultat: "Ports 80 et 443 autorisés", explication: "Nginx enregistre un profil UFW pratique lors de son installation.", erreur: "Oublier cette étape rend le site inaccessible depuis un autre poste alors qu'il fonctionne en local sur le serveur." }
      ]
    },
    { titre: "Déployer un site statique simple", texte: "Crée /var/www/monsite/index.html avec un contenu de test, puis configure un nouveau 'server block' Nginx dans /etc/nginx/sites-available/monsite pointant root vers ce dossier. Active-le avec un lien symbolique dans sites-enabled, puis `sudo nginx -t` pour valider la syntaxe avant `sudo systemctl reload nginx`." }
  ],
  verification: ["`curl http://localhost` depuis le serveur affiche le contenu attendu", "Depuis un autre poste du réseau, http://<ip-serveur> affiche bien le site", "`nginx -t` ne renvoie aucune erreur de syntaxe"],
  erreurs: [{ probleme: "Erreur 502/504 ou page par défaut au lieu du site", cause: "Server block non activé (lien symbolique manquant dans sites-enabled) ou racine (root) pointant vers le mauvais dossier", diagnostic: "`sudo nginx -t` pour valider la config, puis `ls -la /etc/nginx/sites-enabled/` pour confirmer l'activation." }],
  challenge: "Héberge un second site sur le même serveur, accessible via un nom différent (server_name distinct), sans conflit avec le premier — c'est le principe de l'hébergement virtuel (virtual hosting).",
  validation: ["Serveur web installé et démarré", "Site accessible depuis un poste distant", "Configuration validée sans erreur de syntaxe"]
},
{
  id: "srv-02",
  categorie: "serveurs",
  niveau: 3,
  numero: "TP Serveur 02",
  titre: "Serveur de base de données et serveur SSH durci",
  objectif: "Installer un SGBD accessible depuis une application, et renforcer la sécurité de l'accès SSH déjà en place.",
  prerequis: ["LAB Linux 04 terminé"],
  machines: [{ nom: "VM02 — Ubuntu Server", role: "Serveur applicatif" }],
  architecture: `<div class="ascii-diagram">Application --3306/5432--> MySQL/PostgreSQL (VM02)</div>`,
  ressources: { iso: [], ram: "2-4 Go", cpu: "2 vCPU", disque: "20 Go", reseau: "Port DB restreint au réseau interne uniquement", logiciels: ["mysql-server ou postgresql"] },
  etapes: [
    {
      titre: "Installer PostgreSQL",
      commandes: [
        { commande: "apt install postgresql", objectif: "Installer le SGBD", syntaxe: "sudo apt install -y postgresql", exemple: "sudo apt install -y postgresql", resultat: "Service postgresql actif, écoute par défaut sur localhost uniquement", explication: "Par défaut, PostgreSQL n'écoute que sur 127.0.0.1 : une modification explicite est nécessaire pour un accès réseau, c'est volontaire pour la sécurité.", erreur: "Oublier ce comportement par défaut fait perdre du temps à chercher pourquoi 'ça ne marche pas depuis un autre poste' alors que c'est voulu." },
        { commande: "createuser / createdb", objectif: "Créer un utilisateur et une base applicative", syntaxe: "sudo -u postgres createuser <user> --pwprompt && sudo -u postgres createdb -O <user> <base>", exemple: "sudo -u postgres createuser appuser --pwprompt && sudo -u postgres createdb -O appuser appdb", resultat: "Utilisateur et base créés, prêts pour une application", explication: "-O définit le propriétaire de la base, ce qui simplifie ensuite les droits.", erreur: "Créer la base avant l'utilisateur inverse l'ordre logique mais fonctionne aussi tant que -O est correct." }
      ]
    },
    { titre: "Autoriser l'accès réseau (avec restriction)", texte: "Édite postgresql.conf (`listen_addresses = '*'`) et pg_hba.conf pour n'autoriser QUE le sous-réseau LAN-SERVERS en authentification par mot de passe, jamais 'trust' ni ouvert à 0.0.0.0/0." },
    { titre: "Durcir davantage l'accès SSH déjà configuré au LAB Linux 04", texte: "Ajoute une limitation supplémentaire : `sudo apt install fail2ban` pour bannir automatiquement une IP après plusieurs tentatives échouées de connexion SSH." }
  ],
  verification: ["Connexion à la base depuis un autre poste du LAN réussie avec le bon utilisateur", "Connexion refusée depuis un réseau non autorisé (test avec une IP hors plage si possible)", "`sudo fail2ban-client status sshd` montre le jail actif"],
  erreurs: [{ probleme: "Connexion refusée malgré listen_addresses='*'", cause: "pg_hba.conf non mis à jour (le fichier qui définit RÉELLEMENT les autorisations par plage IP)", diagnostic: "Les deux fichiers (postgresql.conf pour écouter, pg_hba.conf pour autoriser) doivent être cohérents ensemble — l'un sans l'autre ne suffit pas." }],
  challenge: "Configure fail2ban pour bannir une IP après 3 tentatives SSH échouées en 5 minutes, pendant 1 heure, puis teste toi-même la règle en te trompant volontairement de mot de passe 3 fois depuis un autre poste.",
  validation: ["SGBD installé, base et utilisateur applicatif créés", "Accès réseau restreint au bon sous-réseau uniquement", "fail2ban actif et testé sur le service SSH"]
},

/* ============================================================
   STOCKAGE & BACKUP
   ============================================================ */
{
  id: "sto-01",
  categorie: "stockage",
  niveau: 4,
  numero: "TP Stockage 01",
  titre: "Stratégie de sauvegarde et scénario de restauration après panne",
  objectif: "Mettre en œuvre les 3 types de sauvegarde (complète, incrémentale, différentielle) puis restaurer un service après une panne disque simulée.",
  prerequis: ["LAB Linux 05 terminé", "Théorie sauvegarde/RAID"],
  machines: [{ nom: "VM02 — Ubuntu Server", role: "Serveur source (données à protéger)" }, { nom: "Stockage de sauvegarde", role: "Répertoire ou disque distinct" }],
  architecture: `
    <div class="ascii-diagram">
Lundi    : Sauvegarde COMPLETE (tout /data)
Mardi    : Sauvegarde INCREMENTALE (change depuis lundi)
Mercredi : Sauvegarde INCREMENTALE (change depuis mardi)
   -- vs --
Lundi    : Sauvegarde COMPLETE
Mardi    : Sauvegarde DIFFERENTIELLE (change depuis lundi)
Mercredi : Sauvegarde DIFFERENTIELLE (change depuis lundi, pas mardi)
    </div>`,
  ressources: { iso: [], ram: "2 Go", cpu: "2 vCPU", disque: "Espace de sauvegarde séparé (idéalement un second disque/VM)", reseau: "", logiciels: ["tar", "rsync"] },
  etapes: [
    {
      titre: "Sauvegarde complète",
      commandes: [
        { commande: "tar -czf", objectif: "Créer une archive complète compressée", syntaxe: "tar -czf <archive>.tar.gz <dossier>", exemple: "tar -czf /backup/full-lundi.tar.gz /data", resultat: "Une archive contenant l'intégralité de /data", explication: "Base de toute stratégie de sauvegarde : un point de restauration complet et autonome.", erreur: "Une sauvegarde complète quotidienne sur un gros volume peut vite saturer l'espace de stockage dédié aux backups." }
      ]
    },
    {
      titre: "Sauvegarde incrémentale (avec rsync)",
      commandes: [
        { commande: "rsync --link-dest", objectif: "Copier uniquement les fichiers modifiés depuis la dernière sauvegarde, en créant des liens vers les fichiers inchangés", syntaxe: "rsync -a --link-dest=<backup_precedent> <source>/ <nouveau_backup>/", exemple: "rsync -a --link-dest=/backup/lundi/ /data/ /backup/mardi/", resultat: "Seuls les fichiers modifiés sont réellement dupliqués, économisant l'espace disque", explication: "--link-dest crée des hardlinks pour les fichiers inchangés : chaque sauvegarde 'semble' complète à la restauration mais n'occupe que l'espace des vrais changements.", erreur: "Confondre incrémentale (basée sur la sauvegarde N-1) et différentielle (toujours basée sur la complète initiale) mène à une mauvaise stratégie de restauration." }
      ]
    },
    { titre: "Simuler la panne : suppression accidentelle", texte: "Sur VM02, supprime volontairement une partie du contenu de /data avec `rm -rf`, comme si un service ou un utilisateur l'avait fait par erreur." },
    { titre: "Restaurer depuis la sauvegarde", texte: "Restaure le contenu depuis la dernière sauvegarde disponible (`tar -xzf` pour une complète, ou copie depuis le dossier rsync le plus récent) vers /data, puis relance le service qui en dépend." }
  ],
  verification: ["Après suppression volontaire, /data est bien vide/incomplet", "Après restauration, le contenu de /data correspond exactement à l'état sauvegardé", "Le service applicatif redémarre normalement avec les données restaurées"],
  erreurs: [{ probleme: "La restauration réussit mais le service ne redémarre pas correctement", cause: "Permissions/propriétaire perdus lors de la restauration (tar/rsync mal utilisés sans -p pour préserver les attributs)", diagnostic: "`ls -la` avant/après restauration pour comparer propriétaire, groupe et permissions ; toujours utiliser `-p` (tar) ou `-a` (rsync, qui l'inclut déjà)." }],
  challenge: "Calcule et documente, pour un volume de données donné (ex. 10 Go avec 5% de changement quotidien), l'espace de stockage nécessaire sur 7 jours pour une stratégie 100% complètes quotidiennes VS une stratégie complète hebdomadaire + incrémentales quotidiennes. Compare les deux approches.",
  validation: ["Sauvegarde complète réalisée", "Sauvegarde incrémentale réalisée et comprise", "Panne simulée puis restauration réussie avec intégrité des données vérifiée"]
},

/* ============================================================
   MONITORING
   ============================================================ */
{
  id: "mon-01",
  categorie: "monitoring",
  niveau: 4,
  numero: "TP Monitoring 01",
  titre: "Supervision d'infrastructure avec Prometheus et Grafana",
  objectif: "Mettre en place une supervision centralisée de CPU/RAM/disque/services avec visualisation et une première alerte.",
  prerequis: ["LAB Linux 03 terminé", "Théorie monitoring"],
  machines: [{ nom: "VM Monitoring", role: "Prometheus + Grafana" }, { nom: "VM02 — Ubuntu Server", role: "Serveur supervisé (node_exporter)" }],
  architecture: `
    <div class="ascii-diagram">
VM02 (node_exporter, port 9100) --scrapé par--> Prometheus (VM Monitoring, port 9090)
                                                        |
                                                    Grafana (port 3000) -- dashboards --
    </div>`,
  ressources: { iso: [], ram: "2 Go pour la VM monitoring", cpu: "2 vCPU", disque: "20 Go", reseau: "Ports 9090 (Prometheus), 3000 (Grafana), 9100 (node_exporter) accessibles entre les VM", logiciels: ["prometheus", "grafana", "prometheus-node-exporter"] },
  etapes: [
    { titre: "Installer node_exporter sur le serveur à superviser", texte: "Sur VM02 : `sudo apt install -y prometheus-node-exporter`. Ce composant expose les métriques système (CPU, RAM, disque, réseau) sur le port 9100." },
    { titre: "Installer Prometheus sur la VM Monitoring", texte: "`sudo apt install -y prometheus`. Édite /etc/prometheus/prometheus.yml pour ajouter une cible de scraping pointant vers VM02:9100, puis redémarre le service." },
    { titre: "Installer Grafana", texte: "Suis l'installation officielle du dépôt Grafana (apt), démarre le service, puis connecte-toi à http://<ip-monitoring>:3000 (identifiants par défaut admin/admin, à changer immédiatement)." },
    { titre: "Connecter Grafana à Prometheus et créer un dashboard", texte: "Dans Grafana, ajoute une source de données Prometheus (URL http://localhost:9090), puis importe ou crée un dashboard affichant CPU, RAM, espace disque et disponibilité (uptime) de VM02." },
    { titre: "Créer une première alerte", texte: "Configure une règle d'alerte dans Grafana (ou Prometheus Alertmanager) déclenchée si l'usage disque dépasse 85%, ou si node_exporter cesse de répondre (service down)." }
  ],
  verification: ["http://<ip-monitoring>:9090/targets montre VM02 en état 'UP'", "Le dashboard Grafana affiche des données en temps réel cohérentes avec l'état réel du serveur", "En arrêtant node_exporter sur VM02, l'alerte 'service down' se déclenche après le délai configuré"],
  erreurs: [
    { probleme: "La cible reste 'DOWN' dans Prometheus", cause: "Pare-feu bloquant le port 9100, ou mauvaise IP dans prometheus.yml", diagnostic: "Depuis la VM Monitoring : `curl http://<ip-vm02>:9100/metrics` pour tester directement l'accessibilité du endpoint." }
  ],
  challenge: "Remplis volontairement le disque de VM02 (comme au LAB Linux 05) et observe le délai réel entre l'événement et le déclenchement de l'alerte configurée. Ajuste le seuil ou le délai d'évaluation si tu le juges trop lent pour un contexte de production.",
  validation: ["node_exporter opérationnel et scrapé par Prometheus", "Dashboard Grafana fonctionnel avec données réelles", "Au moins une alerte configurée et testée en conditions réelles"]
}
];
