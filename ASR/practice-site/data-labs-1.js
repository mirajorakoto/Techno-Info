/* ============================================================
   DATA-LABS-1.js — Virtualisation + Linux Server
   ============================================================ */

const LABS_VIRT_LINUX = [

/* ============================================================
   VIRTUALISATION
   ============================================================ */
{
  id: "virt-01",
  categorie: "virtualisation",
  niveau: 1,
  numero: "LAB 01",
  titre: "Création de mon infrastructure virtuelle",
  objectif: "Choisir un hyperviseur, créer les réseaux virtuels nécessaires et poser le squelette de l'infrastructure qui servira de base à tous les labs suivants.",
  prerequis: ["Notions de virtualisation (théorie)", "Adressage IP de base"],
  machines: [
    { nom: "Hôte", role: "Ta machine physique (hyperviseur installé dessus)" }
  ],
  architecture: `
    <div class="ascii-diagram">
INTERNET
   |
ROUTER (ta box / NAT hyperviseur)
   |
FIREWALL (à construire — LAB FW-01)
   |
   +------------------+------------------+
   |                                     |
LAN USERS                          LAN SERVERS
   |                                     |
PC Windows / PC Linux         Linux Server / Windows Server
                                          |
                                 Active Directory (à venir)
    </div>`,
  ressources: {
    iso: ["Ubuntu Server 22.04/24.04 LTS", "Windows Server 2022 (éval 180 jours)", "Windows 10/11 (éval)"],
    ram: "Hôte : 16 Go recommandés (8 Go minimum en réduisant le nombre de VM actives)",
    cpu: "4 cœurs minimum, virtualisation matérielle activée dans le BIOS (VT-x/AMD-V)",
    disque: "80-120 Go libres pour l'ensemble du lab",
    reseau: "1 réseau NAT (accès Internet), 1 réseau interne/host-only (LAN SERVERS)",
    logiciels: ["Un hyperviseur au choix (VirtualBox / VMware / Hyper-V / Proxmox)"]
  },
  etapes: [
    {
      titre: "Choisir et installer ton hyperviseur",
      texte: "Choisis un environnement dans la liste ci-dessus selon ton contexte (voir comparatif). Installe-le sur ta machine hôte. Vérifie dans le BIOS/UEFI que la virtualisation matérielle (Intel VT-x ou AMD-V) est activée, sinon les VM 64 bits ne démarreront pas."
    },
    {
      titre: "Créer les réseaux virtuels",
      texte: "Crée deux réseaux virtuels distincts : un réseau NAT (les VM sortent vers Internet via ton hôte, mais ne sont pas visibles depuis l'extérieur) et un réseau interne/host-only nommé LAN-SERVERS qui simulera ton réseau d'entreprise isolé. VirtualBox : Fichier > Gestionnaire de réseau hôte. VMware : Éditeur de réseaux virtuels. Hyper-V : Gestionnaire de commutateur virtuel. Proxmox : onglet Réseau du nœud."
    },
    {
      titre: "Réserver l'arborescence de VM",
      texte: "Prépare (sans forcément toutes les créer tout de suite) : VM01 Windows Server, VM02 Ubuntu Server, VM03 Windows Client, VM04 Linux Client. Nomme-les clairement dès le départ, ça te servira dans tous les labs suivants."
    }
  ],
  verification: [
    "L'hyperviseur démarre sans erreur",
    "Les deux réseaux virtuels (NAT + interne) apparaissent dans le gestionnaire réseau",
    "Une VM de test créée sur le réseau NAT arrive à pinguer 8.8.8.8"
  ],
  erreurs: [
    { probleme: "La VM ne démarre pas / erreur VT-x", cause: "Virtualisation matérielle désactivée dans le BIOS, ou Hyper-V de Windows qui entre en conflit avec VirtualBox/VMware", diagnostic: "Vérifier le BIOS ; sous Windows, désactiver la fonctionnalité Hyper-V si tu utilises VirtualBox/VMware." },
    { probleme: "Pas d'accès Internet depuis la VM", cause: "Mauvais mode réseau sélectionné (Host-only au lieu de NAT)", diagnostic: "Revérifier le type de carte réseau assignée à la VM." }
  ],
  challenge: "Objectif : avoir 2 réseaux virtuels opérationnels et une VM Ubuntu qui pingue à la fois Internet (8.8.8.8) et une autre VM du réseau interne. Contraintes : aucune VM ne doit être exposée directement à Internet. Trouve seul la combinaison de cartes réseau nécessaire sur chaque VM.",
  validation: [
    "Hyperviseur installé et fonctionnel",
    "Réseau NAT créé",
    "Réseau interne LAN-SERVERS créé",
    "Une VM de test pingue Internet",
    "Deux VM du réseau interne se pinguent entre elles"
  ]
},
{
  id: "virt-02",
  categorie: "virtualisation",
  niveau: 1,
  numero: "LAB 02",
  titre: "Snapshots, clones et gestion des ressources",
  objectif: "Savoir protéger et dupliquer une VM avant une manipulation risquée, et calibrer CPU/RAM/disque correctement.",
  prerequis: ["LAB 01 terminé"],
  machines: [{ nom: "VM04 — Linux Client", role: "VM de test jetable" }],
  architecture: `<div class="ascii-diagram">VM (état propre) --snapshot--> [checkpoint] --manipulation risquée--> restauration possible si échec</div>`,
  ressources: { iso: ["Ubuntu Desktop/Server (VM déjà créée au LAB 01)"], ram: "2 Go pour la VM de test", cpu: "1-2 vCPU", disque: "20 Go", reseau: "Réseau interne", logiciels: [] },
  etapes: [
    { titre: "Créer un snapshot avant modification", texte: "Sur une VM fraîchement installée et fonctionnelle, crée un snapshot nommé 'etat-propre'. C'est ton point de retour en cas de casse volontaire ou accidentelle (utile pour le mode Panne plus loin)." },
    { titre: "Casser volontairement la VM", texte: "Modifie un fichier de configuration réseau critique pour rendre la VM inutilisable (ex. désactive l'interface réseau), puis constate la panne." },
    { titre: "Restaurer le snapshot", texte: "Reviens à l'état 'etat-propre' via la fonction de restauration de ton hyperviseur et vérifie que tout fonctionne à nouveau." },
    { titre: "Cloner la VM", texte: "Crée un clone complet (full clone, pas lié) de ta VM Linux pour obtenir une deuxième machine indépendante sans tout réinstaller." }
  ],
  verification: ["Le snapshot apparaît dans l'arborescence de snapshots", "Après restauration, la panne provoquée a disparu", "Le clone démarre indépendamment de l'original"],
  erreurs: [
    { probleme: "Le clone a le même hostname/IP que l'original", cause: "Clone non régénéré (adresse MAC, machine-id, hostname dupliqués)", diagnostic: "Régénérer le machine-id (`sudo rm /etc/machine-id && sudo systemd-machine-id-setup`) et changer le hostname du clone." }
  ],
  challenge: "Simule une mise à jour système ratée : prends un snapshot, effectue une opération destructrice, puis restaure. Mesure le temps que ça t'a pris — c'est ce delta que les snapshots te font gagner en entreprise.",
  validation: ["Snapshot créé et restauré avec succès", "Clone fonctionnel avec hostname/IP différents de l'original"]
},

/* ============================================================
   LINUX SERVER
   ============================================================ */
{
  id: "lx-01",
  categorie: "linux",
  niveau: 1,
  numero: "LAB Linux 01",
  titre: "Installation d'une VM Linux Server",
  objectif: "Installer Ubuntu Server dans l'hyperviseur, obtenir un accès console fonctionnel et faire le premier point réseau.",
  prerequis: ["LAB 01 terminé", "Notions Linux de base (théorie)"],
  machines: [{ nom: "VM02 — Ubuntu Server", role: "Serveur Linux principal du lab" }],
  architecture: `<div class="ascii-diagram">Hyperviseur --> VM02 Ubuntu Server --carte réseau interne--> LAN-SERVERS</div>`,
  ressources: { iso: ["Ubuntu Server 22.04/24.04 LTS"], ram: "2 Go minimum (4 recommandés)", cpu: "2 vCPU", disque: "20-25 Go", reseau: "Carte réseau sur LAN-SERVERS", logiciels: ["openssh-server (à cocher pendant l'installation)"] },
  etapes: [
    { titre: "Créer la VM et monter l'ISO", texte: "Crée VM02 avec les ressources indiquées, monte l'ISO Ubuntu Server et démarre l'installation." },
    { titre: "Suivre l'installateur", texte: "Choisis la disposition clavier, laisse le partitionnement automatique (LVM) par défaut pour ce premier lab, crée un utilisateur (ex. admin), et surtout coche l'installation d'OpenSSH Server à l'étape dédiée." },
    { titre: "Premier démarrage et connexion", texte: "Après redémarrage, connecte-toi avec ton utilisateur. Relève l'adresse IP attribuée automatiquement par DHCP." },
    {
      titre: "Commandes de vérification de base",
      texte: "Utilise ces commandes pour explorer ton nouveau serveur.",
      commandes: [
        { commande: "ip a", objectif: "Afficher les interfaces réseau et leurs adresses IP", syntaxe: "ip a", exemple: "ip a", resultat: "Liste des interfaces (lo, eth0/ens18...) avec leur adresse IPv4/IPv6", explication: "Remplace l'ancien `ifconfig`, standard sur les distributions modernes.", erreur: "Si aucune adresse n'apparaît sur l'interface principale, le câble virtuel ou le réseau NAT/interne n'est pas correctement relié." },
        { commande: "hostnamectl", objectif: "Afficher les informations système et le nom de machine", syntaxe: "hostnamectl", exemple: "hostnamectl", resultat: "Nom d'hôte, OS, kernel, architecture", explication: "Utile pour confirmer que le hostname choisi à l'installation est bien appliqué.", erreur: "Aucun risque particulier, commande en lecture seule." },
        { commande: "lsb_release -a", objectif: "Vérifier la version exacte de la distribution", syntaxe: "lsb_release -a", exemple: "lsb_release -a", resultat: "Distributor ID, Description, Release, Codename", explication: "Confirme que la version installée correspond à l'ISO utilisée.", erreur: "Peut être absent sur certaines installations minimales : `sudo apt install lsb-release`." }
      ]
    }
  ],
  verification: ["`ip a` affiche une adresse IP sur l'interface principale", "`ping 8.8.8.8` fonctionne (accès Internet via NAT)", "Connexion SSH réussie depuis l'hôte : `ssh admin@<ip-vm>`"],
  erreurs: [
    { probleme: "Impossible de se connecter en SSH depuis l'hôte", cause: "openssh-server non installé, ou pare-feu UFW actif sans règle pour le port 22", diagnostic: "`sudo systemctl status ssh` pour vérifier que le service tourne ; `sudo ufw status` pour vérifier le pare-feu." }
  ],
  challenge: "Sans réinstaller la VM, active le service SSH s'il n'a pas été coché à l'installation (`sudo apt install openssh-server`), puis connecte-toi en SSH depuis ta machine hôte en moins de 3 commandes.",
  validation: ["VM Ubuntu Server installée et démarrée", "Adresse IP obtenue et relevée", "Connexion SSH fonctionnelle depuis l'hôte"]
},
{
  id: "lx-02",
  categorie: "linux",
  niveau: 2,
  numero: "LAB Linux 02",
  titre: "Utilisateurs, groupes et permissions",
  objectif: "Créer des comptes utilisateurs et des groupes, et appliquer des permissions cohérentes sur des fichiers/répertoires partagés.",
  prerequis: ["LAB Linux 01 terminé", "Notions de permissions Unix (théorie)"],
  machines: [{ nom: "VM02 — Ubuntu Server", role: "Serveur sur lequel travailler" }],
  architecture: `<div class="ascii-diagram">/data/compta (groupe: compta, droits 770)
/data/commun (tous les utilisateurs, droits 775)</div>`,
  ressources: { iso: [], ram: "2 Go", cpu: "2 vCPU", disque: "20 Go", reseau: "SSH actif", logiciels: [] },
  etapes: [
    {
      titre: "Créer des groupes métier",
      texte: "Crée deux groupes représentant des services d'entreprise.",
      commandes: [
        { commande: "groupadd", objectif: "Créer un nouveau groupe", syntaxe: "sudo groupadd <nom_groupe>", exemple: "sudo groupadd compta", resultat: "Aucune sortie si succès (silence = succès sous Linux)", explication: "Un groupe permet de gérer les droits collectivement plutôt que par utilisateur.", erreur: "`groupadd: group 'compta' already exists` si le groupe existe déjà." }
      ]
    },
    {
      titre: "Créer des utilisateurs et les rattacher aux groupes",
      texte: "Crée des utilisateurs correspondant à des employés fictifs.",
      commandes: [
        { commande: "useradd -m -G", objectif: "Créer un utilisateur avec répertoire personnel et l'ajouter à un groupe secondaire", syntaxe: "sudo useradd -m -G <groupe> <utilisateur>", exemple: "sudo useradd -m -G compta jrakoto", resultat: "L'utilisateur est créé, /home/jrakoto est généré", explication: "-m crée le répertoire personnel, -G ajoute au groupe secondaire sans écraser le groupe primaire.", erreur: "Oublier -m laisse l'utilisateur sans /home, ce qui casse beaucoup d'usages courants." },
        { commande: "passwd", objectif: "Définir le mot de passe de l'utilisateur", syntaxe: "sudo passwd <utilisateur>", exemple: "sudo passwd jrakoto", resultat: "Invite à saisir puis confirmer le mot de passe", explication: "Sans mot de passe défini, le compte ne peut pas se connecter en authentification par mot de passe.", erreur: "Mot de passe jugé trop simple : avertissement mais accepté en root." }
      ]
    },
    {
      titre: "Créer l'arborescence partagée et appliquer les droits",
      texte: "Structure les répertoires et applique propriétaire/groupe/permissions.",
      commandes: [
        { commande: "mkdir -p", objectif: "Créer une arborescence de répertoires", syntaxe: "sudo mkdir -p /data/compta /data/commun", exemple: "sudo mkdir -p /data/compta /data/commun", resultat: "Les deux répertoires sont créés", explication: "-p crée les répertoires parents manquants sans erreur s'ils existent déjà.", erreur: "Permission denied si exécuté sans sudo à la racine." },
        { commande: "chown", objectif: "Changer le propriétaire et le groupe d'un répertoire", syntaxe: "sudo chown -R root:compta /data/compta", exemple: "sudo chown -R root:compta /data/compta", resultat: "Le groupe propriétaire de /data/compta devient 'compta'", explication: "-R applique récursivement à tout le contenu du répertoire.", erreur: "Erreur si le groupe n'existe pas encore : créer le groupe avant." },
        { commande: "chmod", objectif: "Définir les permissions lecture/écriture/exécution", syntaxe: "sudo chmod 770 /data/compta", exemple: "sudo chmod 770 /data/compta", resultat: "rwxrwx--- : le propriétaire et le groupe ont tous les droits, les autres n'ont rien", explication: "770 = lecture(4)+écriture(2)+exécution(1) pour propriétaire et groupe, 0 pour les autres.", erreur: "Confondre 770 (privé au groupe) avec 777 (accès total à tout le monde, à éviter en production)." }
      ]
    }
  ],
  verification: [
    "`id jrakoto` montre bien l'appartenance au groupe compta",
    "Un utilisateur du groupe compta peut écrire dans /data/compta, un utilisateur hors groupe ne peut pas (`ls -la /data` pour vérifier les droits affichés)",
    "`getent group compta` liste bien les membres du groupe"
  ],
  erreurs: [
    { probleme: "L'utilisateur ne peut pas accéder au répertoire malgré le bon groupe", cause: "L'utilisateur doit se reconnecter (ou relancer `newgrp`) pour que l'appartenance au groupe soit prise en compte dans sa session", diagnostic: "`groups` dans la session active pour voir les groupes réellement chargés." }
  ],
  challenge: "Crée un troisième groupe 'direction' avec accès en lecture seule (mais pas écriture) sur /data/compta, sans modifier les droits déjà donnés au groupe compta. Indice : les permissions Unix classiques ont une limite ici — regarde du côté des ACL (`setfacl`).",
  validation: ["2 groupes créés", "Au moins 2 utilisateurs créés et rattachés", "Permissions 770/775 appliquées et vérifiées avec un autre utilisateur test"]
},
{
  id: "lx-03",
  categorie: "linux",
  niveau: 2,
  numero: "LAB Linux 03",
  titre: "Processus, services et gestion des paquets",
  objectif: "Superviser les processus en cours, gérer le cycle de vie des services avec systemd et installer/désinstaller des paquets proprement.",
  prerequis: ["LAB Linux 02 terminé"],
  machines: [{ nom: "VM02 — Ubuntu Server", role: "Serveur cible" }],
  architecture: `<div class="ascii-diagram">apt (gestionnaire de paquets) --installe--> service --géré par--> systemd</div>`,
  ressources: { iso: [], ram: "2 Go", cpu: "2 vCPU", disque: "20 Go", reseau: "SSH actif", logiciels: ["apache2 (pour l'exercice de service)"] },
  etapes: [
    {
      titre: "Explorer les processus",
      commandes: [
        { commande: "ps aux", objectif: "Lister tous les processus en cours", syntaxe: "ps aux", exemple: "ps aux | grep ssh", resultat: "Liste des processus avec PID, utilisateur, %CPU, %MEM", explication: "aux = tous les processus (a), y compris ceux sans terminal (x), avec détail utilisateur (u).", erreur: "Sortie très longue sans filtre : toujours combiner avec `grep` sur un système chargé." },
        { commande: "top / htop", objectif: "Voir la consommation CPU/RAM en temps réel", syntaxe: "top", exemple: "top", resultat: "Tableau rafraîchi en continu des processus les plus consommateurs", explication: "`htop` (à installer) est une version plus lisible et interactive de `top`.", erreur: "Quitter avec 'q', pas Ctrl+C qui peut laisser le terminal dans un état inattendu." }
      ]
    },
    {
      titre: "Installer et gérer un service avec systemd",
      texte: "Installe un serveur web comme exemple concret de service géré par systemd.",
      commandes: [
        { commande: "apt update && apt install", objectif: "Mettre à jour la liste des paquets puis installer un logiciel", syntaxe: "sudo apt update && sudo apt install -y apache2", exemple: "sudo apt update && sudo apt install -y apache2", resultat: "Apache est téléchargé, installé et démarré automatiquement", explication: "`apt update` rafraîchit la liste des paquets disponibles, indispensable avant une installation.", erreur: "Oublier `apt update` peut faire échouer l'installation si le cache est trop ancien." },
        { commande: "systemctl status", objectif: "Vérifier l'état d'un service", syntaxe: "sudo systemctl status apache2", exemple: "sudo systemctl status apache2", resultat: "active (running) en vert si le service tourne", explication: "Donne aussi les derniers logs du service directement dans la sortie.", erreur: "'inactive (dead)' signifie que le service ne tourne pas — pas forcément une erreur si volontaire." },
        { commande: "systemctl enable/disable", objectif: "Activer ou désactiver le démarrage automatique au boot", syntaxe: "sudo systemctl enable apache2", exemple: "sudo systemctl enable apache2", resultat: "Symlink créé vers /etc/systemd/system/multi-user.target.wants/", explication: "'enable' ne démarre pas le service immédiatement, seulement au prochain boot ; combiner avec `start` pour un effet immédiat.", erreur: "Confondre enable (démarrage auto) et start (démarrage immédiat) est l'erreur la plus fréquente chez les débutants." },
        { commande: "systemctl stop/start/restart", objectif: "Contrôler l'exécution immédiate du service", syntaxe: "sudo systemctl restart apache2", exemple: "sudo systemctl restart apache2", resultat: "Le service redémarre, prend en compte une nouvelle config", explication: "`restart` est nécessaire après modification d'un fichier de configuration.", erreur: "Un `restart` sur un service mal configuré peut le faire échouer au redémarrage — toujours vérifier `status` après." }
      ]
    },
    {
      titre: "Nettoyer",
      texte: "Désinstalle proprement le paquet pour laisser le serveur propre pour la suite.",
      commandes: [
        { commande: "apt remove --purge", objectif: "Désinstaller un paquet et sa configuration", syntaxe: "sudo apt remove --purge -y apache2", exemple: "sudo apt remove --purge -y apache2 && sudo apt autoremove -y", resultat: "Le paquet et ses fichiers de config sont supprimés", explication: "`remove` seul laisse les fichiers de config ; `--purge` les supprime aussi.", erreur: "`autoremove` oublié laisse des dépendances orphelines qui s'accumulent avec le temps." }
      ]
    }
  ],
  verification: ["`systemctl status apache2` affichait bien 'active (running)' pendant le test", "Une requête `curl http://localhost` renvoyait la page par défaut Apache pendant le test", "Après purge, `systemctl status apache2` renvoie 'could not be found'"],
  erreurs: [
    { probleme: "Le service refuse de démarrer après modification d'un fichier de config", cause: "Erreur de syntaxe dans le fichier modifié", diagnostic: "`sudo journalctl -xeu apache2` pour lire les logs détaillés du service et localiser la ligne fautive." }
  ],
  challenge: "Installe un service de ton choix (ex. `nginx`), configure-le pour démarrer automatiquement au boot, redémarre la VM entière, et vérifie sans te reconnecter en SSH avant que le service ait eu le temps de démarrer que tout est bien opérationnel.",
  validation: ["Un service installé, démarré et vérifié fonctionnel", "enable/disable testés et compris", "Paquet proprement désinstallé (purge + autoremove)"]
},
{
  id: "lx-04",
  categorie: "linux",
  niveau: 3,
  numero: "LAB Linux 04",
  titre: "Réseau, IP statique, hostname, SSH et firewall local",
  objectif: "Passer un serveur Linux d'une IP dynamique à une IP statique fiable, sécuriser l'accès SSH et activer un pare-feu local minimal.",
  prerequis: ["LAB Linux 03 terminé", "Adressage IP (théorie)"],
  machines: [{ nom: "VM02 — Ubuntu Server", role: "Serveur à figer en IP statique" }],
  architecture: `<div class="ascii-diagram">Avant : VM02 (DHCP, IP variable)
Après : VM02 (192.168.50.10/24, gateway 192.168.50.1, DNS 192.168.50.1)</div>`,
  ressources: { iso: [], ram: "2 Go", cpu: "2 vCPU", disque: "20 Go", reseau: "LAN-SERVERS", logiciels: ["ufw"] },
  etapes: [
    {
      titre: "Identifier le fichier de configuration réseau (Netplan)",
      commandes: [
        { commande: "ls /etc/netplan/", objectif: "Localiser le fichier de config réseau utilisé par Ubuntu", syntaxe: "ls /etc/netplan/", exemple: "ls /etc/netplan/", resultat: "Un fichier .yaml, ex. 00-installer-config.yaml", explication: "Ubuntu 18.04+ utilise Netplan comme surcouche de configuration réseau.", erreur: "Modifier le mauvais fichier ou en créer un second en conflit avec le premier." }
      ]
    },
    {
      titre: "Passer en IP statique",
      texte: "Édite le fichier Netplan (`sudo nano /etc/netplan/00-installer-config.yaml`) pour fixer l'adresse, la passerelle et le DNS, par exemple :\n\nnetwork:\n  version: 2\n  ethernets:\n    eth0:\n      dhcp4: no\n      addresses: [192.168.50.10/24]\n      routes:\n        - to: default\n          via: 192.168.50.1\n      nameservers:\n        addresses: [192.168.50.1, 8.8.8.8]\n\nAttention à l'indentation YAML (espaces, jamais de tabulation).",
      commandes: [
        { commande: "netplan apply", objectif: "Appliquer la nouvelle configuration réseau", syntaxe: "sudo netplan apply", exemple: "sudo netplan apply", resultat: "La nouvelle IP est appliquée immédiatement, sans reboot", explication: "Netplan traduit le YAML en configuration réseau système et l'applique à chaud.", erreur: "Une erreur de syntaxe YAML fait échouer la commande avec un message d'erreur explicite — corriger avant de réessayer." }
      ]
    },
    {
      titre: "Fixer le hostname",
      commandes: [
        { commande: "hostnamectl set-hostname", objectif: "Définir un nom de machine explicite", syntaxe: "sudo hostnamectl set-hostname <nom>", exemple: "sudo hostnamectl set-hostname srv-lin-01", resultat: "Le hostname est changé immédiatement", explication: "Un hostname clair facilite énormément le diagnostic quand plusieurs serveurs sont en jeu.", erreur: "Oublier de mettre aussi à jour /etc/hosts peut provoquer des avertissements 'unable to resolve host' avec sudo." }
      ]
    },
    {
      titre: "Sécuriser SSH",
      texte: "Édite /etc/ssh/sshd_config pour désactiver la connexion root directe et forcer un port non standard si souhaité, puis redémarre le service.",
      commandes: [
        { commande: "systemctl restart ssh", objectif: "Recharger la configuration SSH modifiée", syntaxe: "sudo systemctl restart ssh", exemple: "sudo systemctl restart ssh", resultat: "Le service SSH redémarre avec la nouvelle config", explication: "Ne jamais fermer la session SSH en cours avant d'avoir testé une nouvelle connexion dans un second terminal — risque de se retrouver bloqué dehors.", erreur: "Désactiver PasswordAuthentication sans avoir configuré une clé SSH au préalable = verrouillage total du serveur." }
      ]
    },
    {
      titre: "Activer un pare-feu local minimal (UFW)",
      commandes: [
        { commande: "ufw allow / enable", objectif: "N'autoriser que les ports nécessaires puis activer le pare-feu", syntaxe: "sudo ufw allow 22/tcp && sudo ufw enable", exemple: "sudo ufw allow 22/tcp && sudo ufw enable", resultat: "UFW s'active, seul le port 22 (SSH) reste ouvert par défaut", explication: "Toujours autoriser explicitement SSH AVANT d'activer ufw, sinon la session en cours peut être coupée.", erreur: "Activer ufw sans avoir autorisé le port SSH = perte d'accès distant immédiate." }
      ]
    }
  ],
  verification: ["`ip a` affiche bien la nouvelle IP statique après reboot complet", "`hostnamectl` affiche le nouveau hostname", "`sudo ufw status` liste le port 22 en ALLOW", "Connexion SSH toujours fonctionnelle après toutes les modifications"],
  erreurs: [
    { probleme: "Plus d'accès SSH après activation d'UFW", cause: "Port 22 non autorisé avant `ufw enable`", diagnostic: "Depuis la console locale de la VM (pas SSH) : `sudo ufw allow 22/tcp` puis `sudo ufw reload`." },
    { probleme: "Netplan apply échoue silencieusement, l'IP ne change pas", cause: "Erreur d'indentation YAML", diagnostic: "`sudo netplan try` (Ubuntu récents) qui affiche l'erreur précise et revient en arrière automatiquement si rien n'est confirmé." }
  ],
  challenge: "Configure SSH pour n'accepter que l'authentification par clé (désactive PasswordAuthentication), en ayant préalablement généré et déployé une clé SSH depuis ta machine hôte. Vérifie que la connexion par mot de passe est bien refusée avant de considérer le lab terminé.",
  validation: ["IP statique appliquée et persistante après reboot", "Hostname explicite défini", "UFW actif avec uniquement les ports nécessaires ouverts", "Accès SSH toujours garanti à la fin du lab"]
},
{
  id: "lx-05",
  categorie: "linux",
  niveau: 3,
  numero: "LAB Linux 05",
  titre: "Stockage : partitions, LVM, RAID logiciel et sauvegarde",
  objectif: "Ajouter un disque virtuel, le partitionner, le gérer avec LVM pour permettre l'extension à chaud, et mettre en place une sauvegarde planifiée.",
  prerequis: ["LAB Linux 04 terminé", "Notions de stockage RAID/LVM (théorie)"],
  machines: [{ nom: "VM02 — Ubuntu Server", role: "Serveur avec un second disque virtuel ajouté" }],
  architecture: `<div class="ascii-diagram">Disque physique virtuel (/dev/sdb)
   -> Partition (/dev/sdb1)
      -> Physical Volume (PV)
         -> Volume Group (VG: vgdata)
            -> Logical Volume (LV: lvdata) -> monté sur /data</div>`,
  ressources: { iso: [], ram: "2 Go", cpu: "2 vCPU", disque: "+10 Go de disque supplémentaire à ajouter à la VM", reseau: "SSH actif", logiciels: ["lvm2", "cron (déjà présent)"] },
  etapes: [
    { titre: "Ajouter un second disque virtuel", texte: "Depuis l'hyperviseur (VM éteinte), ajoute un second disque virtuel de 10 Go à VM02, puis redémarre la VM." },
    {
      titre: "Identifier et partitionner le nouveau disque",
      commandes: [
        { commande: "lsblk", objectif: "Lister les disques et partitions détectés par le système", syntaxe: "lsblk", exemple: "lsblk", resultat: "Le nouveau disque apparaît, ex. sdb, sans partition", explication: "Toujours vérifier lsblk avant de partitionner pour ne pas se tromper de disque.", erreur: "Travailler sur le mauvais disque (ex. sda, le disque système) peut détruire l'installation." },
        { commande: "fdisk", objectif: "Créer une nouvelle partition", syntaxe: "sudo fdisk /dev/sdb", exemple: "sudo fdisk /dev/sdb (puis n, p, 1, Entrée, Entrée, w)", resultat: "/dev/sdb1 est créé", explication: "n=nouvelle partition, p=primaire, w=écrire les changements sur le disque.", erreur: "Oublier 'w' final = aucune modification n'est réellement écrite." }
      ]
    },
    {
      titre: "Mettre en place LVM",
      commandes: [
        { commande: "pvcreate", objectif: "Transformer la partition en Physical Volume LVM", syntaxe: "sudo pvcreate /dev/sdb1", exemple: "sudo pvcreate /dev/sdb1", resultat: "Physical volume créé", explication: "Le PV est la brique de base que LVM va ensuite regrouper en Volume Group.", erreur: "Exécuter sur une partition déjà utilisée efface son contenu." },
        { commande: "vgcreate", objectif: "Créer un Volume Group regroupant un ou plusieurs PV", syntaxe: "sudo vgcreate vgdata /dev/sdb1", exemple: "sudo vgcreate vgdata /dev/sdb1", resultat: "Volume group 'vgdata' créé", explication: "Un VG peut regrouper plusieurs disques physiques comme un seul espace logique.", erreur: "Nom de VG déjà utilisé sur le système." },
        { commande: "lvcreate", objectif: "Créer un Logical Volume dans le VG", syntaxe: "sudo lvcreate -L 8G -n lvdata vgdata", exemple: "sudo lvcreate -L 8G -n lvdata vgdata", resultat: "Logical volume 'lvdata' créé (8 Go sur les 10 disponibles)", explication: "Garder une marge dans le VG permet d'étendre le LV plus tard sans ajouter de disque.", erreur: "Allouer 100% du VG dès le départ empêche toute extension future sans nouveau disque." },
        { commande: "mkfs.ext4 / mount", objectif: "Formater et monter le volume logique", syntaxe: "sudo mkfs.ext4 /dev/vgdata/lvdata && sudo mkdir /data && sudo mount /dev/vgdata/lvdata /data", exemple: "sudo mkfs.ext4 /dev/vgdata/lvdata", resultat: "/data est monté et utilisable, visible via `df -h`", explication: "Sans entrée dans /etc/fstab, le montage ne survit pas à un redémarrage.", erreur: "Oublier /etc/fstab = /data redevient un dossier vide après reboot." }
      ]
    },
    {
      titre: "Étendre le volume à chaud (le vrai intérêt de LVM)",
      commandes: [
        { commande: "lvextend + resize2fs", objectif: "Agrandir un volume logique sans interruption de service", syntaxe: "sudo lvextend -L +2G /dev/vgdata/lvdata && sudo resize2fs /dev/vgdata/lvdata", exemple: "sudo lvextend -L +2G /dev/vgdata/lvdata && sudo resize2fs /dev/vgdata/lvdata", resultat: "L'espace disponible sur /data augmente sans démontage", explication: "C'est l'avantage majeur de LVM face à un partitionnement classique : extension à chaud, sans interruption.", erreur: "Oublier `resize2fs` après `lvextend` : le volume LVM est agrandi mais le système de fichiers ne le voit pas encore." }
      ]
    },
    {
      titre: "Sauvegarde planifiée avec cron",
      commandes: [
        { commande: "crontab -e", objectif: "Planifier une tâche automatique de sauvegarde", syntaxe: "crontab -e", exemple: "0 2 * * * tar -czf /backup/data-$(date +\\%F).tar.gz /data", resultat: "Une archive compressée de /data est créée chaque nuit à 2h", explication: "Format cron : minute heure jour mois jour-semaine. Ici : tous les jours à 2h00.", erreur: "Chemin relatif dans la commande cron : toujours utiliser des chemins absolus, l'environnement cron est minimal." }
      ]
    }
  ],
  verification: ["`df -h` montre /data monté avec la bonne taille", "Après reboot, /data reste monté (entrée /etc/fstab vérifiée)", "Une extension test avec lvextend augmente bien l'espace visible", "Une archive de sauvegarde test s'exécute sans erreur en lançant la commande cron manuellement"],
  erreurs: [
    { probleme: "/data disparaît après redémarrage", cause: "Montage non déclaré dans /etc/fstab", diagnostic: "`sudo blkid` pour récupérer l'UUID du volume, puis ajouter la ligne correspondante dans /etc/fstab." },
    { probleme: "Le disque est plein malgré l'extension", cause: "`resize2fs` non exécuté après `lvextend`", diagnostic: "`df -h` vs `lvs` : si LVM montre plus d'espace que `df`, le filesystem n'a pas été redimensionné." }
  ],
  challenge: "Simule une panne réelle : le service qui écrit dans /data plante parce que le disque est plein (remplis-le volontairement avec `dd`). Diagnostique la cause avec `df -h` et `du -sh /data/*`, libère de l'espace ou étends le volume, puis documente la procédure de résolution.",
  validation: ["Disque supplémentaire ajouté et partitionné", "LVM opérationnel (PV/VG/LV) avec montage persistant", "Extension à chaud testée avec succès", "Sauvegarde cron fonctionnelle et vérifiée manuellement"]
}
];
