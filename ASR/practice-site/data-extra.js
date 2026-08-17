/* ============================================================
   DATA-EXTRA.js — Mode Panne, Mode Entretien, Projets, Projet Final
   ============================================================ */

/* ------------------------------------------------------------
   MODE PANNE — DIAGNOSTIC D'INCIDENT
   Indices donnés progressivement, jamais la solution d'un coup.
   ------------------------------------------------------------ */
const INCIDENTS = [
  {
    id: "inc-01",
    titre: "Le PC n'obtient plus d'adresse IP",
    domaine: "dhcp",
    symptome: "Un utilisateur signale que son PC affiche une adresse IP en 169.254.x.x et n'accède à rien sur le réseau.",
    indices: [
      "Une adresse en 169.254.x.x est une adresse APIPA : elle signifie que Windows n'a reçu AUCUNE réponse à sa demande DHCP.",
      "Vérifie d'abord la couche la plus basse : le câble virtuel / la carte réseau de la VM est-elle bien connectée au bon réseau ?",
      "Si la connectivité physique est bonne, vérifie côté serveur : le service DHCP tourne-t-il ? L'étendue est-elle activée et non épuisée ?"
    ],
    causePossible: "Service DHCP arrêté sur le serveur, étendue désactivée/épuisée, ou VM connectée au mauvais réseau virtuel.",
    solutionResume: "Vérifier dans l'ordre : connectivité de la carte réseau → état du service DHCP (services.msc) → statut et disponibilité de l'étendue dans la console DHCP."
  },
  {
    id: "inc-02",
    titre: "DNS inaccessible",
    domaine: "dns",
    symptome: "Les utilisateurs ne peuvent plus accéder à aucun site ni ressource par nom, mais les adresses IP directes fonctionnent.",
    indices: [
      "Si l'accès par IP fonctionne mais pas par nom, le problème se situe précisément au niveau de la résolution de noms, pas du réseau en général.",
      "Le serveur DNS configuré côté client est-il joignable (`ping <ip-dns>`) ?",
      "Si le serveur DNS est joignable, le service DNS tourne-t-il réellement dessus ?"
    ],
    causePossible: "Service DNS arrêté sur le serveur, ou IP DNS mal configurée côté client/DHCP.",
    solutionResume: "`nslookup <nom> <ip-dns-attendue>` pour isoler la cause, puis vérifier le service DNS côté serveur (`systemctl status` ou `services.msc`)."
  },
  {
    id: "inc-03",
    titre: "DHCP arrêté",
    domaine: "dhcp",
    symptome: "Aucun nouveau poste n'obtient d'adresse IP depuis ce matin, mais les postes déjà connectés continuent de fonctionner normalement.",
    indices: [
      "Les postes déjà connectés gardent leur bail en cours (souvent plusieurs jours) : c'est pour ça qu'ils fonctionnent encore, ce n'est pas une contradiction.",
      "Regarde le statut du service DHCP directement sur le serveur, pas seulement côté client.",
      "En environnement AD, un service DHCP peut tourner mais ne rien distribuer s'il n'est pas 'autorisé' dans l'annuaire."
    ],
    causePossible: "Service DHCP arrêté, ou serveur DHCP non autorisé dans Active Directory.",
    solutionResume: "`services.msc` sur le serveur pour l'état du service, puis vérifier le statut d'autorisation dans la console DHCP (icône verte/rouge)."
  },
  {
    id: "inc-04",
    titre: "Mauvais VLAN",
    domaine: "reseau",
    symptome: "Un poste reconnecté sur un nouveau port switch ne peut plus joindre aucune ressource, alors que sa configuration IP semble correcte.",
    indices: [
      "Une IP 'correcte' ne veut rien dire si elle ne correspond pas au VLAN réellement affecté au port physique utilisé.",
      "Vérifie sur le switch à quel VLAN appartient réellement le port où le câble est branché (`show vlan brief` ou équivalent GUI).",
      "Compare ce VLAN avec le réseau IP attendu pour ce poste."
    ],
    causePossible: "Port switch affecté à un VLAN différent de celui prévu pour ce poste/service.",
    solutionResume: "Confirmer l'affectation réelle du port au VLAN attendu, corriger l'affectation ou déplacer le poste sur le bon port."
  },
  {
    id: "inc-05",
    titre: "Mauvaise passerelle (gateway)",
    domaine: "reseau",
    symptome: "Le poste communique parfaitement avec les autres machines de son propre réseau local, mais ne peut joindre ni Internet ni les autres VLAN.",
    indices: [
      "Communication locale OK + rien au-delà du réseau local = très probablement un problème de passerelle par défaut, pas de câblage ni de DNS.",
      "Vérifie l'adresse de passerelle configurée sur le poste (`ipconfig`/`ip route`) et compare-la à l'IP réelle du routeur pour ce réseau.",
      "Une passerelle qui appartient à un autre sous-réseau ne fonctionnera jamais, même si elle 'ressemble' à la bonne adresse."
    ],
    causePossible: "Passerelle par défaut incorrecte ou appartenant à un autre sous-réseau.",
    solutionResume: "Corriger l'adresse de passerelle pour qu'elle corresponde exactement à l'interface du routeur sur ce même sous-réseau."
  },
  {
    id: "inc-06",
    titre: "Mauvais masque de sous-réseau",
    domaine: "reseau",
    symptome: "Deux postes qui devraient être sur le même réseau ne se pinguent pas, alors que leurs adresses IP semblent proches (ex. 192.168.10.5 et 192.168.10.130).",
    indices: [
      "Deux IP 'proches' peuvent appartenir à des sous-réseaux totalement différents selon le masque appliqué.",
      "Calcule la plage réelle couverte par le masque configuré sur chaque poste (ex. /25 découpe 192.168.10.0/24 en deux blocs distincts).",
      "Un masque incohérent entre deux postes censés être sur le même LAN est presque toujours la cause d'une 'fausse' impossibilité de communication."
    ],
    causePossible: "Masque de sous-réseau mal configuré, créant deux plages logiquement séparées bien que les IP semblent voisines.",
    solutionResume: "Recalculer et harmoniser le masque de sous-réseau sur les deux postes pour qu'ils appartiennent réellement au même réseau logique."
  },
  {
    id: "inc-07",
    titre: "Route absente",
    domaine: "routage",
    symptome: "Le ping part correctement (aucune erreur immédiate) mais aucune réponse n'arrive jamais, en particulier vers un réseau distant précis.",
    indices: [
      "Un ping qui 'part sans erreur' mais sans réponse suggère souvent un problème sur le CHEMIN RETOUR, pas sur l'aller.",
      "Vérifie la table de routage sur CHAQUE routeur impliqué dans le chemin, pas uniquement celui le plus proche de la source.",
      "Une route existe-t-elle en sens inverse, depuis le réseau distant vers le réseau source ?"
    ],
    causePossible: "Route statique manquante sur le chemin retour, sur un routeur intermédiaire.",
    solutionResume: "`show ip route` sur chaque routeur du chemin (source ET destination) pour localiser précisément où la route manque."
  },
  {
    id: "inc-08",
    titre: "Firewall bloquant",
    domaine: "firewall",
    symptome: "Une application ne parvient plus à contacter un serveur précis sur un port précis, alors que le ping ICMP vers ce même serveur fonctionne parfaitement.",
    indices: [
      "Le ping (ICMP) et une connexion applicative (TCP sur un port précis) sont deux choses différentes : l'un peut marcher sans l'autre.",
      "Teste spécifiquement le port applicatif concerné, pas seulement la joignabilité générale (`Test-NetConnection -Port` ou `nc -zv`).",
      "Si le port précis échoue alors que le ping réussit, une règle de filtrage bloque très probablement ce port spécifiquement."
    ],
    causePossible: "Règle de pare-feu (local ou périmétrique) bloquant spécifiquement le port applicatif requis.",
    solutionResume: "Identifier le port exact requis par l'application, puis vérifier/ajouter la règle correspondante sur le pare-feu concerné (local UFW/Windows Defender, ou périmétrique)."
  },
  {
    id: "inc-09",
    titre: "Service arrêté",
    domaine: "windows",
    symptome: "Une application signale 'impossible de se connecter au serveur' alors que le serveur répond bien au ping et le réseau semble normal.",
    indices: [
      "Le serveur 'répond' au réseau (ping OK) ne veut pas dire que le SERVICE applicatif attendu tourne dessus.",
      "Vérifie l'état exact du service concerné (base de données, web, partage...) directement sur le serveur.",
      "Regarde aussi les logs du service (Event Viewer ou journalctl) pour comprendre pourquoi il s'est arrêté, pas juste le redémarrer aveuglément."
    ],
    causePossible: "Service applicatif arrêté ou planté sur le serveur cible.",
    solutionResume: "`Get-Service`/`systemctl status` pour confirmer l'arrêt, consulter les logs pour la cause racine, puis redémarrer le service en connaissance de cause."
  },
  {
    id: "inc-10",
    titre: "Disque plein",
    domaine: "stockage",
    symptome: "Un service qui fonctionnait normalement commence à planter aléatoirement, avec des erreurs d'écriture dans ses logs.",
    indices: [
      "Des erreurs d'écriture aléatoires évoquent souvent une ressource système saturée, pas un bug applicatif.",
      "Vérifie l'espace disque disponible sur le volume utilisé par ce service (`df -h` ou l'explorateur de fichiers).",
      "Identifie ensuite QUEL dossier/fichier a grossi anormalement pour comprendre la cause racine, pas seulement libérer de l'espace au hasard."
    ],
    causePossible: "Volume disque saturé, empêchant le service d'écrire ses données ou ses logs.",
    solutionResume: "`df -h` pour confirmer la saturation, `du -sh` pour localiser le gros consommateur, libérer/étendre l'espace puis surveiller pour éviter la récidive."
  },
  {
    id: "inc-11",
    titre: "Serveur inaccessible",
    domaine: "reseau",
    symptome: "Impossible de joindre un serveur précis, ni en ping ni en RDP/SSH, alors que d'autres serveurs du même réseau répondent normalement.",
    indices: [
      "Si SEUL ce serveur est injoignable et pas les autres du même réseau, le problème est très probablement localisé sur cette machine précise, pas sur le réseau global.",
      "Le serveur est-il physiquement/virtuellement démarré ? (vérifier depuis la console de l'hyperviseur, pas seulement le réseau)",
      "Si la VM tourne, sa propre configuration réseau (IP, pare-feu local) a-t-elle changé récemment ?"
    ],
    causePossible: "VM éteinte/plantée, ou pare-feu local du serveur bloquant tout le trafic entrant suite à une modification récente.",
    solutionResume: "Vérifier l'état de la VM via la console de l'hyperviseur en priorité, puis sa configuration réseau et son pare-feu local une fois confirmé qu'elle tourne."
  },
  {
    id: "inc-12",
    titre: "Utilisateur sans permission",
    domaine: "ad",
    symptome: "Un utilisateur ne peut plus accéder à un dossier partagé qu'il utilisait normalement la semaine dernière.",
    indices: [
      "Un accès qui fonctionnait 'la semaine dernière' et plus maintenant évoque un changement récent, pas une mauvaise configuration d'origine.",
      "Vérifie l'appartenance actuelle de l'utilisateur au groupe qui donne ce droit — a-t-il pu être retiré du groupe récemment (ex. via une réorganisation) ?",
      "Vérifie aussi les permissions NTFS ET les permissions de partage séparément : le droit appliqué est toujours le plus restrictif des deux."
    ],
    causePossible: "Utilisateur retiré du groupe de sécurité concerné, ou permission NTFS modifiée récemment.",
    solutionResume: "`Get-ADGroupMember` (ou dsa.msc) pour confirmer l'appartenance actuelle au groupe, puis revérifier les permissions NTFS et de partage sur le dossier concerné."
  },
  {
    id: "inc-13",
    titre: "Problème Active Directory",
    domaine: "ad",
    symptome: "Les connexions au domaine deviennent très lentes pour tous les utilisateurs, sans message d'erreur clair.",
    indices: [
      "Une lenteur généralisée d'authentification, sans erreur explicite, oriente souvent vers un problème DNS lié au domaine plutôt qu'AD lui-même.",
      "Lance un diagnostic de santé complet du contrôleur de domaine plutôt que de chercher au hasard.",
      "Regarde en particulier si les tests liés au DNS échouent dans ce diagnostic."
    ],
    causePossible: "Résolution DNS défaillante pour les enregistrements SRV nécessaires à la localisation du contrôleur de domaine.",
    solutionResume: "`dcdiag /v` pour un diagnostic complet, puis `nslookup -type=SRV _ldap._tcp.<domaine>` pour confirmer/infirmer la piste DNS."
  },
  {
    id: "inc-14",
    titre: "Problème SSH",
    domaine: "linux",
    symptome: "Impossible de se connecter en SSH à un serveur Linux qui répond pourtant au ping, alors que la connexion fonctionnait hier.",
    indices: [
      "Le ping fonctionne, donc ce n'est pas un problème réseau global — la piste doit être cherchée sur le service SSH lui-même ou son filtrage.",
      "Le service SSH tourne-t-il toujours sur le serveur ?",
      "Un pare-feu local (UFW) ou un outil comme fail2ban a-t-il pu bannir ton IP suite à des tentatives échouées récentes ?"
    ],
    causePossible: "Service SSH arrêté, port bloqué par UFW, ou IP bannie par fail2ban après plusieurs échecs de connexion.",
    solutionResume: "Depuis la console locale de la VM : `systemctl status ssh`, `ufw status`, puis `fail2ban-client status sshd` pour vérifier un éventuel bannissement."
  }
];

/* ------------------------------------------------------------
   MODE ENTRETIEN D'EMBAUCHE
   ------------------------------------------------------------ */
const INTERVIEW_QUESTIONS = [
  {
    id: "int-01",
    question: "Un utilisateur dit qu'il n'a plus Internet. Que vérifiez-vous ?",
    methodologie: [
      "Vérifier le problème physique (câble, wifi, voyants de la carte réseau)",
      "Vérifier l'adresse IP obtenue (ipconfig/ifconfig — IP valide ou APIPA 169.254.x.x ?)",
      "Vérifier la passerelle par défaut configurée",
      "Vérifier la résolution DNS (nslookup)",
      "Tester la connectivité par IP directe (ping vers une IP publique connue, ex. 8.8.8.8)",
      "Vérifier l'état général du réseau (autres utilisateurs impactés ou cas isolé ?)",
      "Vérifier le pare-feu (local ou périmétrique) pour un blocage récent",
      "Vérifier l'état du service concerné si applicable"
    ]
  },
  {
    id: "int-02",
    question: "Un serveur de fichiers devient très lent pour tous les utilisateurs en fin de journée. Comment procédez-vous ?",
    methodologie: [
      "Confirmer l'ampleur : tous les utilisateurs ou un sous-ensemble ? À quelle heure exactement ça commence ?",
      "Vérifier les ressources du serveur (CPU, RAM, disque) au moment de la lenteur — via le monitoring si disponible, sinon en direct",
      "Vérifier la charge réseau (bande passante saturée, beaucoup de transferts simultanés)",
      "Vérifier les logs applicatifs et système pour des erreurs corrélées à l'horaire",
      "Identifier si une tâche planifiée (sauvegarde, antivirus, mise à jour) tourne à ce moment précis",
      "Documenter la cause trouvée et proposer une action corrective (replanification, montée en ressources, etc.)"
    ]
  },
  {
    id: "int-03",
    question: "Comment expliqueriez-vous la différence entre TCP et UDP à un collègue non technique ?",
    methodologie: [
      "Utiliser une analogie simple : TCP = lettre recommandée avec accusé de réception, UDP = carte postale sans garantie",
      "Préciser que TCP est plus fiable mais plus lent (vérifications, accusés de réception)",
      "Préciser qu'UDP est plus rapide mais peut perdre des données en route",
      "Donner un exemple concret pour chacun : TCP pour un transfert de fichier ou une page web, UDP pour un appel vidéo ou du streaming en direct où la vitesse prime sur la perte occasionnelle d'un paquet"
    ]
  },
  {
    id: "int-04",
    question: "Un utilisateur ne peut plus accéder à un dossier partagé qu'il utilisait la semaine dernière. Quelle est votre démarche ?",
    methodologie: [
      "Confirmer précisément le message d'erreur obtenu par l'utilisateur",
      "Vérifier l'appartenance actuelle de l'utilisateur au groupe de sécurité donnant ce droit",
      "Vérifier les permissions NTFS ET les permissions de partage séparément",
      "Vérifier si un changement récent a eu lieu (réorganisation, changement de service, GPO récente)",
      "Tester avec un compte de test connu pour isoler si le problème est spécifique à l'utilisateur ou plus large",
      "Corriger et documenter la résolution pour référence future"
    ]
  },
  {
    id: "int-05",
    question: "Quelle est votre méthodologie générale face à un incident dont vous ne connaissez pas immédiatement la cause ?",
    methodologie: [
      "Observer et documenter précisément le symptôme (qui, quoi, quand, depuis quand, ampleur)",
      "Formuler des hypothèses par ordre de probabilité, de la cause la plus simple à la plus complexe",
      "Tester chaque hypothèse une par une, sans tout changer en même temps",
      "Identifier la cause racine, pas seulement le symptôme visible",
      "Corriger et vérifier que le problème est réellement résolu, pas juste masqué",
      "Documenter l'incident et la solution pour la base de connaissance de l'équipe"
    ]
  },
  {
    id: "int-06",
    question: "Comment sécuriseriez-vous l'accès distant à une infrastructure d'entreprise pour des salariés en télétravail ?",
    methodologie: [
      "Mettre en place un VPN chiffré plutôt qu'un accès direct exposé sur Internet",
      "Utiliser une authentification forte (certificat et/ou MFA) plutôt qu'un simple mot de passe",
      "Segmenter les accès : un télétravailleur ne doit accéder qu'aux ressources dont il a réellement besoin",
      "Journaliser et superviser les connexions distantes pour détecter une activité anormale",
      "Maintenir les postes distants à jour (antivirus, patchs) comme condition d'accès si possible"
    ]
  },
  {
    id: "int-07",
    question: "Pourquoi utiliser des VLAN plutôt que des switches physiques séparés pour isoler des services d'entreprise ?",
    methodologie: [
      "Coût : un seul switch physique peut gérer plusieurs réseaux logiques, pas besoin d'un switch par service",
      "Flexibilité : réaffecter un port à un autre VLAN se fait par configuration, sans recâblage physique",
      "Sécurité : la segmentation logique limite la propagation d'un incident (ex. VLAN invités isolé des VLAN serveurs)",
      "Évolutivité : ajouter un nouveau service/VLAN ne nécessite pas de nouveau matériel réseau"
    ]
  },
  {
    id: "int-08",
    question: "Un serveur critique tombe en panne matérielle un vendredi soir. Décrivez votre plan d'action.",
    methodologie: [
      "Évaluer immédiatement l'impact réel (services concernés, utilisateurs impactés, criticité métier)",
      "Communiquer rapidement et clairement en interne sur l'incident et le délai estimé",
      "Vérifier la disponibilité et l'intégrité de la dernière sauvegarde avant toute action",
      "Basculer vers une solution de secours si elle existe (redondance, réplication, VM de restauration)",
      "Restaurer le service selon la procédure documentée, en testant avant de considérer l'incident clos",
      "Rédiger un post-mortem : cause racine, actions correctives, comment éviter la récidive"
    ]
  },
  {
    id: "int-09",
    question: "Qu'est-ce qui différencie selon vous un bon technicien support d'un bon administrateur système ?",
    methodologie: [
      "Le technicien support résout des incidents individuels au quotidien ; l'administrateur conçoit et fait évoluer l'infrastructure globale",
      "L'administrateur anticipe (capacité, sécurité, évolutivité) plutôt que de seulement réagir",
      "L'administrateur documente et automatise pour que les incidents récurrents deviennent rares",
      "Les deux rôles partagent la même exigence de méthode et de rigueur dans le diagnostic"
    ]
  },
  {
    id: "int-10",
    question: "Comment justifieriez-vous auprès d'une direction le coût d'une solution de monitoring et de sauvegarde ?",
    methodologie: [
      "Chiffrer le coût d'une heure/journée d'indisponibilité pour l'entreprise (perte de productivité, image, contrats)",
      "Comparer ce coût au coût de la solution proposée sur une base annuelle",
      "Mettre en avant la détection précoce des problèmes (monitoring) qui évite l'incident majeur",
      "Rappeler qu'une sauvegarde non testée n'est pas une garantie — inclure le coût des tests de restauration réguliers dans l'argumentaire"
    ]
  }
];

/* ------------------------------------------------------------
   PROJETS PROGRESSIFS (1 à 7)
   ------------------------------------------------------------ */
const PROJECTS = [
  { id: "proj-01", numero: "Projet 1", titre: "Petit réseau domestique", niveau: 1, description: "Un routeur, quelques postes, un accès Wi-Fi partagé et un NAS simple pour du stockage familial.", contraintes: ["1 seul réseau logique", "Pas de segmentation VLAN nécessaire", "Objectif : maîtriser adressage IP + partage de fichiers de base"] },
  { id: "proj-02", numero: "Projet 2", titre: "Petite entreprise de 10 utilisateurs", niveau: 2, description: "Un réseau plat avec un serveur de fichiers central, une imprimante partagée et un accès Internet sécurisé par un pare-feu basique.", contraintes: ["10 postes, 1 serveur de fichiers", "Sauvegarde quotidienne obligatoire", "Pare-feu périmétrique minimal"] },
  { id: "proj-03", numero: "Projet 3", titre: "PME de 50 utilisateurs", niveau: 3, description: "Introduction d'Active Directory pour centraliser les comptes, DHCP/DNS internes, et premiers VLAN par service.", contraintes: ["Active Directory obligatoire", "Au moins 3 VLAN distincts", "Politique de mot de passe centralisée via GPO"] },
  { id: "proj-04", numero: "Projet 4", titre: "Entreprise multi-départements", niveau: 3, description: "Extension du projet 3 avec des OU dédiées par département, des GPO différenciées et un routage inter-VLAN complet.", contraintes: ["5+ départements avec OU et GPO dédiées", "Routage inter-VLAN fonctionnel", "Permissions NTFS différenciées par service"] },
  { id: "proj-05", numero: "Projet 5", titre: "Infrastructure avec DMZ", niveau: 4, description: "Ajout d'une zone démilitarisée pour héberger des services exposés (site web, messagerie) sans exposer le réseau interne.", contraintes: ["Firewall avec 3 interfaces (WAN/LAN/DMZ)", "Aucune communication directe DMZ → LAN", "Services exposés limités aux ports strictement nécessaires"] },
  { id: "proj-06", numero: "Projet 6", titre: "Infrastructure hybride Windows + Linux", niveau: 4, description: "Coexistence d'un domaine Active Directory Windows et de serveurs Linux intégrés (authentification, partages SMB/NFS croisés).", contraintes: ["Au moins 1 serveur Linux joint/authentifié via AD", "Interopérabilité de partages testée dans les deux sens"] },
  { id: "proj-07", numero: "Projet 7", titre: "Infrastructure avec monitoring et backup", niveau: 5, description: "Ajout d'une couche complète de supervision (Prometheus/Grafana) et d'une politique de sauvegarde formalisée avec tests de restauration réguliers.", contraintes: ["Dashboard de supervision couvrant tous les serveurs critiques", "Au moins une alerte fonctionnelle testée", "Procédure de restauration documentée et testée au moins une fois"] }
];

/* ------------------------------------------------------------
   PROJET FINAL — INFRASTRUCTURE PME COMPLÈTE
   ------------------------------------------------------------ */
const FINAL_PROJECT = {
  titre: "Infrastructure informatique complète d'une PME",
  entreprise: {
    nom: "TechCorp",
    employes: 50,
    services: ["Direction", "RH", "Comptabilité", "Commercial", "IT"]
  },
  architecture: `
    <div class="ascii-diagram">
                         INTERNET
                            |
                         FIREWALL
                            |
                     CORE SWITCH
                            |
          --------------------------------
          |       |       |       |       |
        VLAN10  VLAN20  VLAN30  VLAN40  VLAN50
        ADMIN     RH    COMPTA   IT     GUEST
                            |
                     SERVER VLAN
                            |
       -----------------------------------------
       |          |          |        |        |
      AD         DNS        DHCP     FILE    WEB
    Server      Server      Server   Server   Server
    </div>`,
  missions: [
    { numero: 1, titre: "Créer les machines virtuelles", description: "Provisionner l'ensemble des VM nécessaires (serveurs + postes clients) avec les ressources dimensionnées pour chaque rôle.", checklist: ["VM serveurs créées (AD/DNS/DHCP/Fichiers/Web)", "VM clients Windows et Linux créées", "Ressources CPU/RAM/disque cohérentes avec le rôle de chaque VM"] },
    { numero: 2, titre: "Construire le réseau", description: "Mettre en place les réseaux virtuels correspondant à l'architecture cible (WAN, LAN par VLAN, SERVER VLAN).", checklist: ["Réseaux virtuels créés dans l'hyperviseur", "Câblage logique conforme au schéma"] },
    { numero: 3, titre: "Configurer les VLAN", description: "Créer les 5 VLAN métier (Admin, RH, Compta, IT, Guest) plus un VLAN serveurs, avec ports access et trunk.", checklist: ["6 VLAN créés et nommés", "Ports access affectés correctement", "Trunk fonctionnel vers le core switch"] },
    { numero: 4, titre: "Configurer le routage", description: "Mettre en place le routage inter-VLAN pour permettre aux services autorisés de communiquer entre eux.", checklist: ["Sous-interfaces ou SVI configurées pour chaque VLAN", "Communication inter-VLAN testée et fonctionnelle"] },
    { numero: 5, titre: "Installer le serveur Windows", description: "Installer et configurer le serveur Windows Server destiné à devenir le contrôleur de domaine.", checklist: ["Windows Server installé", "IP statique et hostname définis"] },
    { numero: 6, titre: "Créer Active Directory", description: "Promouvoir le serveur en contrôleur de domaine pour un domaine dédié à TechCorp.", checklist: ["Rôle AD DS installé", "Serveur promu en DC", "Domaine opérationnel et vérifié"] },
    { numero: 7, titre: "Créer les utilisateurs et groupes", description: "Structurer l'annuaire avec une OU par service de TechCorp et un groupe de sécurité associé, puis peupler avec les 50 employés (ou un échantillon représentatif).", checklist: ["1 OU par service (5 minimum)", "1 groupe de sécurité par service", "Comptes utilisateurs créés et rattachés correctement"] },
    { numero: 8, titre: "Configurer DNS", description: "Vérifier/compléter la zone DNS intégrée à AD, créer les enregistrements nécessaires aux autres serveurs (fichiers, web).", checklist: ["Zone directe et inverse opérationnelles", "Enregistrements A pour chaque serveur applicatif"] },
    { numero: 9, titre: "Configurer DHCP", description: "Mettre en place une étendue DHCP par VLAN utilisateur, avec passerelle et DNS corrects distribués automatiquement.", checklist: ["Étendues créées et activées pour chaque VLAN utilisateur", "Options passerelle/DNS correctement distribuées"] },
    { numero: 10, titre: "Créer le serveur de fichiers", description: "Mettre en place un serveur de fichiers avec une arborescence de partages correspondant aux services de TechCorp.", checklist: ["Arborescence de partages créée", "Un dossier par service au minimum"] },
    { numero: 11, titre: "Configurer les permissions", description: "Appliquer des permissions NTFS et de partage cohérentes, garantissant qu'un service ne peut pas accéder aux dossiers d'un autre sans autorisation.", checklist: ["Permissions NTFS différenciées par groupe/service", "Aucun débordement de droit constaté lors des tests"] },
    { numero: 12, titre: "Installer un serveur Linux", description: "Ajouter un serveur Linux à l'infrastructure (ex. serveur applicatif ou web) et le sécuriser (IP statique, SSH durci, pare-feu local).", checklist: ["Serveur Linux installé et configuré", "SSH sécurisé", "UFW actif avec les ports strictement nécessaires"] },
    { numero: 13, titre: "Installer le serveur Web", description: "Déployer un serveur web accessible en interne (et potentiellement exposé via la DMZ si le projet l'intègre).", checklist: ["Serveur web installé et fonctionnel", "Site accessible depuis le réseau interne"] },
    { numero: 14, titre: "Configurer le firewall", description: "Mettre en place les règles de filtrage entre les VLAN, vers Internet, et éventuellement vers une DMZ si un service est exposé.", checklist: ["Règles de filtrage définies entre VLAN sensibles", "Accès Internet fonctionnel pour les VLAN autorisés"] },
    { numero: 15, titre: "Configurer le VPN", description: "Mettre en place un accès VPN pour permettre un accès distant sécurisé à l'infrastructure TechCorp.", checklist: ["VPN opérationnel", "Accès distant testé avec succès depuis un poste externe simulé"] },
    { numero: 16, titre: "Mettre en place le monitoring", description: "Superviser les serveurs critiques de l'infrastructure avec au moins un dashboard et une alerte fonctionnelle.", checklist: ["Outils de monitoring installés", "Dashboard couvrant les serveurs critiques", "Au moins une alerte testée en conditions réelles"] },
    { numero: 17, titre: "Mettre en place les sauvegardes", description: "Définir et appliquer une politique de sauvegarde (fréquence, rétention, type) pour les données critiques de TechCorp.", checklist: ["Politique de sauvegarde définie et documentée", "Sauvegarde automatisée fonctionnelle"] },
    { numero: 18, titre: "Tester les pannes", description: "Provoquer volontairement plusieurs pannes (voir Mode Panne) sur l'infrastructure construite et vérifier la résilience mise en place.", checklist: ["Au moins 3 scénarios de panne testés sur l'infrastructure réelle du projet", "Chaque panne corrigée avec succès"] },
    { numero: 19, titre: "Diagnostiquer les problèmes", description: "Pour chaque panne testée, appliquer la méthodologie de troubleshooting complète (observation → hypothèses → test → correction → vérification).", checklist: ["Méthodologie appliquée et documentée pour chaque incident", "Cause racine identifiée, pas seulement le symptôme"] },
    { numero: 20, titre: "Documenter toute l'infrastructure", description: "Rédiger une documentation complète : schéma réseau final, plan d'adressage, comptes créés, procédures de sauvegarde/restauration, et incidents rencontrés avec leur résolution.", checklist: ["Schéma réseau à jour", "Plan d'adressage IP documenté", "Procédures de sauvegarde/restauration écrites", "Journal des incidents rencontrés pendant le projet"] }
  ]
};
