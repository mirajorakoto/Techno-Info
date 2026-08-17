/* ============================================================
   DATA-LABS-2.js — Windows Server + Active Directory
   ============================================================ */

const LABS_WIN_AD = [

/* ============================================================
   WINDOWS SERVER
   ============================================================ */
{
  id: "win-01",
  categorie: "windows",
  niveau: 2,
  numero: "LAB Windows 01",
  titre: "Installation et configuration réseau de Windows Server",
  objectif: "Installer Windows Server, lui attribuer une IP statique cohérente avec le plan d'adressage du lab et fixer un hostname explicite.",
  prerequis: ["LAB 01 (Virtualisation) terminé", "Adressage IP (théorie)"],
  machines: [{ nom: "VM01 — Windows Server", role: "Futur contrôleur de domaine / serveur de fichiers" }],
  architecture: `<div class="ascii-diagram">VM01 Windows Server -- carte réseau interne --> LAN-SERVERS (192.168.50.0/24)
IP cible : 192.168.50.1  (deviendra aussi le futur serveur DNS)</div>`,
  ressources: { iso: ["Windows Server 2022 Evaluation (180 jours)"], ram: "4 Go minimum (8 recommandés une fois AD installé)", cpu: "2-4 vCPU", disque: "40-60 Go", reseau: "Carte réseau sur LAN-SERVERS", logiciels: [] },
  etapes: [
    { titre: "Installer Windows Server", texte: "Crée VM01, monte l'ISO, choisis 'Windows Server 2022 Standard (Desktop Experience)' pour garder une interface graphique dans ce premier lab, et termine l'installation en définissant le mot de passe administrateur local." },
    { titre: "Configurer l'IP statique", texte: "Panneau de configuration > Réseau et Internet > Centre Réseau et partage > Modifier les paramètres de la carte > Propriétés IPv4. Fixe : IP 192.168.50.1, masque 255.255.255.0, passerelle 192.168.50.254 (ta box/routeur), DNS préféré 127.0.0.1 (car ce serveur hébergera bientôt son propre DNS)." },
    { titre: "Renommer le serveur", texte: "Propriétés système > Modifier > Nom de l'ordinateur : SRV-AD-01. Un redémarrage est nécessaire pour appliquer le changement." },
    { titre: "Activer le Bureau à distance (RDP) pour la suite du parcours", texte: "Propriétés système > Bureau à distance > Autoriser les connexions. Note l'IP pour t'y connecter depuis ton PC client dans les labs suivants." }
  ],
  verification: ["`ipconfig /all` en console confirme l'IP statique et le hostname", "Ping vers la passerelle réussi", "Connexion RDP réussie depuis l'hôte ou une autre VM du réseau"],
  erreurs: [
    { probleme: "Pas d'accès Internet depuis le serveur", cause: "DNS mis à 127.0.0.1 avant qu'un service DNS ne soit réellement installé", diagnostic: "Temporairement, mettre un DNS externe (8.8.8.8) le temps que le rôle DNS soit installé au LAB DNS-01, puis repasser en 127.0.0.1." }
  ],
  challenge: "Configure deux cartes réseau sur VM01 : une sur le réseau interne LAN-SERVERS (IP fixe 192.168.50.1) et une seconde sur le réseau NAT pour garder un accès Internet direct pendant les phases d'installation de rôles. Justifie pourquoi on sépare souvent ces deux usages en entreprise.",
  validation: ["Windows Server installé", "IP statique et hostname définis", "RDP activé et testé"]
},
{
  id: "win-02",
  categorie: "windows",
  niveau: 2,
  numero: "LAB Windows 02",
  titre: "Utilisateurs et groupes locaux",
  objectif: "Créer des comptes utilisateurs locaux et des groupes, avant de basculer vers Active Directory dans les labs suivants.",
  prerequis: ["LAB Windows 01 terminé"],
  machines: [{ nom: "VM01 — Windows Server", role: "Serveur cible" }],
  architecture: `<div class="ascii-diagram">Groupes locaux : Compta, RH, IT
Utilisateurs : mrasolo (Compta), hravel (RH), jrakoto (IT)</div>`,
  ressources: { iso: [], ram: "4 Go", cpu: "2 vCPU", disque: "40 Go", reseau: "RDP actif", logiciels: [] },
  etapes: [
    { titre: "Ouvrir la gestion des utilisateurs locaux", texte: "Exécuter `lusrmgr.msc` (Win+R). C'est l'outil graphique de gestion des comptes et groupes locaux." },
    { titre: "Créer les groupes", texte: "Clic droit sur Groupes > Nouveau groupe. Crée Compta, RH et IT, un par un, sans membre pour l'instant." },
    { titre: "Créer les utilisateurs et les rattacher", texte: "Clic droit sur Utilisateurs > Nouvel utilisateur. Crée mrasolo, hravel, jrakoto avec mot de passe complexe. Puis dans les propriétés de chaque groupe, onglet Membres > Ajouter, rattache l'utilisateur correspondant." },
    {
      titre: "Refaire la même chose en PowerShell (plus rapide et scriptable)",
      commandes: [
        { commande: "New-LocalUser", objectif: "Créer un utilisateur local en ligne de commande", syntaxe: "New-LocalUser -Name <nom> -Password (ConvertTo-SecureString '<mdp>' -AsPlainText -Force)", exemple: "New-LocalUser -Name \"jrakoto\" -Password (ConvertTo-SecureString \"P@ssw0rd!\" -AsPlainText -Force) -FullName \"Jean Rakoto\"", resultat: "Utilisateur créé instantanément", explication: "PowerShell permet de scripter la création de dizaines de comptes d'un coup, ce qui devient indispensable en entreprise.", erreur: "Mot de passe ne respectant pas la politique de complexité par défaut = erreur explicite." },
        { commande: "Add-LocalGroupMember", objectif: "Ajouter un utilisateur à un groupe local", syntaxe: "Add-LocalGroupMember -Group <groupe> -Member <utilisateur>", exemple: "Add-LocalGroupMember -Group \"IT\" -Member \"jrakoto\"", resultat: "L'utilisateur apparaît dans les membres du groupe", explication: "Équivalent en une ligne de l'ajout manuel via lusrmgr.msc.", erreur: "Le groupe doit exister avant, sinon erreur 'group not found'." }
      ]
    }
  ],
  verification: ["Chaque utilisateur apparaît dans le bon groupe via lusrmgr.msc", "`Get-LocalGroupMember IT` en PowerShell confirme l'appartenance"],
  erreurs: [{ probleme: "New-LocalUser échoue avec une erreur de politique de mot de passe", cause: "Mot de passe trop simple par rapport à la politique locale par défaut", diagnostic: "Utiliser un mot de passe avec majuscule, minuscule, chiffre et caractère spécial, 8+ caractères." }],
  challenge: "Écris un script PowerShell qui crée automatiquement 5 utilisateurs à partir d'une liste (nom, prénom, groupe) définie directement dans le script, sans répéter la commande 5 fois manuellement (indice : boucle `foreach`).",
  validation: ["3 groupes créés", "3 utilisateurs créés et rattachés au bon groupe", "Même résultat obtenu une fois en GUI et une fois en PowerShell"]
},
{
  id: "win-03",
  categorie: "windows",
  niveau: 2,
  numero: "LAB Windows 03",
  titre: "Serveur de fichiers, permissions NTFS et partages SMB",
  objectif: "Créer un serveur de fichiers accessible sur le réseau avec des permissions NTFS et de partage cohérentes.",
  prerequis: ["LAB Windows 02 terminé"],
  machines: [{ nom: "VM01 — Windows Server", role: "Serveur de fichiers" }, { nom: "VM03 — PC Windows client", role: "Poste testant l'accès au partage" }],
  architecture: `<div class="ascii-diagram">VM01 : D:\\Partages\\Compta  (NTFS: Compta=Modifier, autres=aucun accès)
                              (Partage SMB: \\\\SRV-AD-01\\Compta)
VM03 --SMB--> \\\\192.168.50.1\\Compta</div>`,
  ressources: { iso: [], ram: "4 Go", cpu: "2 vCPU", disque: "40 Go + dossier de partage", reseau: "SMB (port 445) accessible entre VM01 et VM03", logiciels: ["Rôle 'Services de fichiers et de stockage' (souvent déjà présent par défaut)"] },
  etapes: [
    { titre: "Créer l'arborescence locale", texte: "Sur VM01, crée D:\\Partages\\Compta et D:\\Partages\\Commun." },
    { titre: "Configurer les permissions NTFS", texte: "Clic droit sur le dossier Compta > Propriétés > Sécurité > Modifier. Retire l'héritage si besoin (Avancé > Désactiver l'héritage > Convertir), puis ajoute le groupe Compta avec le droit Modifier, et retire Utilisateurs authentifiés si tu veux restreindre strictement." },
    { titre: "Créer le partage réseau (SMB)", texte: "Clic droit sur le dossier > Propriétés > Partage > Partage avancé > Partager ce dossier. Nom de partage : Compta. Onglet Autorisations de partage : laisse Tout le monde en Lecture/Modification, car ce sont les permissions NTFS qui feront le vrai filtrage (bonne pratique : le partage ouvert + NTFS restrictif)." },
    { titre: "Tester depuis le client Windows", texte: "Sur VM03, ouvre l'explorateur et tape \\\\192.168.50.1\\Compta. Connecte-toi avec un compte membre du groupe Compta, puis avec un compte qui n'en fait pas partie, pour comparer le résultat." }
  ],
  verification: ["Un utilisateur du groupe Compta peut créer/modifier des fichiers dans le partage", "Un utilisateur hors groupe reçoit un refus d'accès", "Le partage est listé via `net share` sur VM01"],
  erreurs: [
    { probleme: "Accès refusé même pour un membre autorisé du groupe", cause: "Permission de partage (onglet Partage) plus restrictive que la permission NTFS, ou héritage NTFS mal retiré", diagnostic: "Le droit réel appliqué est toujours le PLUS restrictif entre partage et NTFS : vérifier les deux niveaux séparément." },
    { probleme: "Le partage n'apparaît pas du tout sur le réseau", cause: "Pare-feu Windows bloquant le partage de fichiers et d'imprimantes", diagnostic: "Pare-feu Windows Defender > Autoriser une application > cocher 'Partage de fichiers et d'imprimantes' pour le profil réseau concerné." }
  ],
  challenge: "Ajoute un dossier D:\\Partages\\Direction visible et modifiable uniquement par un nouveau groupe 'Direction', tout en gardant Compta et Commun inchangés, puis vérifie qu'aucun débordement de droit n'existe entre les trois dossiers.",
  validation: ["Arborescence de partages créée", "NTFS + partage SMB cohérents", "Accès testé avec un compte autorisé ET un compte non autorisé"]
},
{
  id: "win-04",
  categorie: "windows",
  niveau: 3,
  numero: "LAB Windows 04",
  titre: "Bureau à distance, services Windows et Event Viewer",
  objectif: "Administrer le serveur à distance, comprendre le cycle de vie des services Windows et diagnostiquer via l'Observateur d'événements.",
  prerequis: ["LAB Windows 03 terminé"],
  machines: [{ nom: "VM01 — Windows Server", role: "Serveur administré à distance" }, { nom: "VM03 — PC Windows client", role: "Poste d'administration" }],
  architecture: `<div class="ascii-diagram">VM03 --RDP (port 3389)--> VM01</div>`,
  ressources: { iso: [], ram: "4 Go", cpu: "2 vCPU", disque: "40 Go", reseau: "Port 3389 ouvert entre les deux VM", logiciels: [] },
  etapes: [
    { titre: "Connexion RDP depuis le client", texte: "Sur VM03, lance 'Connexion Bureau à distance', saisis l'IP de VM01 et connecte-toi avec un compte administrateur." },
    { titre: "Explorer les services Windows", texte: "Sur VM01 (en RDP), ouvre `services.msc`. Repère un service comme 'Spouleur d'impression', observe son état, son type de démarrage (Automatique/Manuel/Désactivé) et son compte d'exécution." },
    { titre: "Arrêter puis relancer un service volontairement", texte: "Clic droit sur un service non critique > Arrêter, constate l'effet (ex. plus d'impression possible), puis relance-le et repasse son démarrage en Automatique s'il ne l'était pas." },
    { titre: "Ouvrir l'Observateur d'événements", texte: "Exécuter `eventvwr.msc`. Explore Journaux Windows > Système et > Application. Filtre sur les événements de type Erreur pour repérer un problème récent." }
  ],
  verification: ["Connexion RDP stable depuis VM03 vers VM01", "Un service arrêté/relancé montre le bon état dans services.msc", "Un événement d'erreur précis est identifié et son ID noté"],
  erreurs: [{ probleme: "Connexion RDP refusée", cause: "Bureau à distance non activé, pare-feu bloquant le port 3389, ou compte utilisateur non autorisé dans les paramètres RDP", diagnostic: "Vérifier les 3 causes dans l'ordre : Propriétés système > Bureau à distance, puis pare-feu, puis groupe 'Utilisateurs du Bureau à distance'." }],
  challenge: "Trouve dans l'Observateur d'événements un événement lié à un échec de connexion (Event ID 4625 dans le journal Sécurité) et explique ce qu'il indique concrètement (compte, heure, source).",
  validation: ["RDP fonctionnel et testé", "Cycle arrêt/démarrage d'un service maîtrisé", "Un événement pertinent identifié dans l'Event Viewer avec son ID"]
},
{
  id: "win-05",
  categorie: "windows",
  niveau: 3,
  numero: "LAB Windows 05",
  titre: "PowerShell pour l'administration",
  objectif: "Automatiser des tâches d'administration courantes (utilisateurs, services, réseau) via PowerShell plutôt que la GUI.",
  prerequis: ["LAB Windows 04 terminé"],
  machines: [{ nom: "VM01 — Windows Server", role: "Cible des commandes" }],
  architecture: `<div class="ascii-diagram">GUI (lusrmgr, services.msc, ...) == PowerShell (cmdlets) — même résultat, PowerShell = scriptable et répétable</div>`,
  ressources: { iso: [], ram: "4 Go", cpu: "2 vCPU", disque: "40 Go", reseau: "RDP actif", logiciels: [] },
  etapes: [
    {
      titre: "Cmdlets système essentielles",
      commandes: [
        { commande: "Get-Service", objectif: "Lister l'état de tous les services", syntaxe: "Get-Service | Where-Object {$_.Status -eq 'Running'}", exemple: "Get-Service | Where-Object {$_.Status -eq 'Running'}", resultat: "Liste uniquement les services actuellement démarrés", explication: "Le pipe `|` chaîne les cmdlets, comme les pipes Linux — la logique est très transférable.", erreur: "Nom de propriété mal orthographié (`Status` avec majuscule respectée en PowerShell, sensible à l'orthographe mais pas à la casse)." },
        { commande: "Restart-Service", objectif: "Redémarrer un service par script", syntaxe: "Restart-Service -Name <nom>", exemple: "Restart-Service -Name Spooler", resultat: "Le service redémarre sans passer par services.msc", explication: "Base de nombreux scripts de maintenance planifiée.", erreur: "Nécessite des droits administrateur, sinon 'Access is denied'." },
        { commande: "Get-NetIPConfiguration", objectif: "Afficher la configuration IP complète", syntaxe: "Get-NetIPConfiguration", exemple: "Get-NetIPConfiguration", resultat: "IP, passerelle, DNS pour chaque interface", explication: "Équivalent PowerShell moderne de `ipconfig /all`, mais avec une sortie manipulable en objets.", erreur: "Aucun risque, lecture seule." },
        { commande: "Test-NetConnection", objectif: "Tester la connectivité réseau vers un hôte et un port précis", syntaxe: "Test-NetConnection -ComputerName <cible> -Port <port>", exemple: "Test-NetConnection -ComputerName 192.168.50.1 -Port 445", resultat: "TcpTestSucceeded : True/False", explication: "Plus précis qu'un simple `ping` car il teste un port applicatif spécifique (ex. SMB sur 445).", erreur: "Un port bloqué par le pare-feu renverra False même si l'hôte répond au ping." }
      ]
    },
    {
      titre: "Script combiné : audit rapide du serveur",
      texte: "Écris un script `audit.ps1` qui affiche successivement : le hostname, l'IP, les 5 derniers événements Erreur du journal Système, et la liste des services arrêtés qui étaient censés démarrer automatiquement (`Get-Service | Where-Object {$_.StartType -eq 'Automatic' -and $_.Status -eq 'Stopped'}`)."
    }
  ],
  verification: ["Le script audit.ps1 s'exécute sans erreur et affiche un résultat cohérent", "`Test-NetConnection` confirme un port ouvert et un port fermé correctement identifiés"],
  erreurs: [{ probleme: "Le script .ps1 refuse de s'exécuter", cause: "Politique d'exécution PowerShell restrictive par défaut", diagnostic: "`Get-ExecutionPolicy` puis, si besoin en environnement de lab uniquement, `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`." }],
  challenge: "Étends le script audit.ps1 pour qu'il exporte son résultat dans un fichier texte horodaté (`audit-$(Get-Date -Format 'yyyy-MM-dd').txt`) — c'est exactement ce que fait un vrai script de supervision en entreprise.",
  validation: ["4 cmdlets de base maîtrisées et testées", "Script d'audit combiné fonctionnel", "Export de résultat vers un fichier réalisé"]
},

/* ============================================================
   ACTIVE DIRECTORY
   ============================================================ */
{
  id: "ad-01",
  categorie: "ad",
  niveau: 3,
  numero: "LAB AD 01",
  titre: "Installer le rôle AD DS et promouvoir le Domain Controller",
  objectif: "Transformer VM01 en contrôleur de domaine pour le domaine de lab lab.local.",
  prerequis: ["LAB Windows 01 terminé (IP statique fixée)", "Active Directory (théorie)"],
  machines: [{ nom: "VM01 — Windows Server", role: "Futur Domain Controller (SRV-AD-01)" }],
  architecture: `<div class="ascii-diagram">Avant : VM01 = serveur autonome (workgroup)
Après : VM01 = Domain Controller du domaine lab.local</div>`,
  ressources: { iso: [], ram: "4-8 Go", cpu: "2-4 vCPU", disque: "60 Go", reseau: "IP statique 192.168.50.1, DNS pointant sur lui-même (127.0.0.1)", logiciels: [] },
  etapes: [
    { titre: "Installer le rôle AD DS", texte: "Gestionnaire de serveur > Ajouter des rôles et fonctionnalités > coche 'Services AD DS' (Active Directory Domain Services) > suivant jusqu'à Installer. Ne redémarre pas encore." },
    { titre: "Promouvoir le serveur en contrôleur de domaine", texte: "Après l'installation du rôle, clique sur le lien 'Promouvoir ce serveur en contrôleur de domaine' (ou via l'icône drapeau du Gestionnaire de serveur). Choisis 'Ajouter une nouvelle forêt', nom de domaine racine : lab.local." },
    { titre: "Définir le mot de passe DSRM et finaliser", texte: "Renseigne un mot de passe de restauration des services d'annuaire (DSRM), laisse le niveau fonctionnel de forêt/domaine par défaut, laisse DNS coché (le rôle DNS sera installé automatiquement), puis termine l'assistant. Le serveur redémarre automatiquement." },
    { titre: "Vérifier après redémarrage", texte: "Reconnecte-toi avec le compte LAB\\Administrateur (le compte local est devenu un compte de domaine). Ouvre 'Utilisateurs et ordinateurs Active Directory' (dsa.msc) pour confirmer que le domaine existe." }
  ],
  verification: ["`dsa.msc` s'ouvre et affiche lab.local avec les conteneurs par défaut (Users, Computers, Domain Controllers)", "`nslookup lab.local` depuis le serveur résout sur lui-même", "`Get-ADDomain` en PowerShell renvoie les infos du domaine"],
  erreurs: [
    { probleme: "L'assistant de promotion échoue à l'étape de vérification des prérequis", cause: "Le serveur DNS n'est pas encore configuré sur lui-même (127.0.0.1) avant la promotion", diagnostic: "Revérifier la configuration IP du serveur : DNS préféré doit pointer vers sa propre IP." }
  ],
  challenge: "Une fois promu, ouvre PowerShell et exécute `Get-ADDomainController` pour retrouver toutes les informations du contrôleur sans passer par la GUI. Compare avec ce qu'affiche dsa.msc.",
  validation: ["Rôle AD DS installé", "Serveur promu en DC pour lab.local", "dsa.msc opérationnel après redémarrage", "Résolution DNS interne fonctionnelle"]
},
{
  id: "ad-02",
  categorie: "ad",
  niveau: 3,
  numero: "LAB AD 02",
  titre: "Unités d'organisation, utilisateurs, groupes et ordinateurs",
  objectif: "Structurer l'annuaire avec des OU représentant les services de l'entreprise, puis peupler avec des comptes réels.",
  prerequis: ["LAB AD 01 terminé"],
  machines: [{ nom: "VM01 — Windows Server (SRV-AD-01)", role: "Domain Controller" }],
  architecture: `<div class="ascii-diagram">lab.local
 ├── OU=Direction
 ├── OU=RH
 ├── OU=Comptabilite
 ├── OU=IT
 │     └── Groupe: GG-IT (Global)
 └── OU=Ordinateurs-Entreprise</div>`,
  ressources: { iso: [], ram: "4-8 Go", cpu: "2-4 vCPU", disque: "60 Go", reseau: "", logiciels: [] },
  etapes: [
    { titre: "Créer les unités d'organisation (OU)", texte: "Dans dsa.msc, clic droit sur lab.local > Nouveau > Unité d'organisation. Crée Direction, RH, Comptabilite, IT et Ordinateurs-Entreprise. Ne coche pas 'protéger contre une suppression accidentelle' pour ce lab (facilite le nettoyage), mais retiens que c'est une bonne pratique en production." },
    { titre: "Créer des groupes de sécurité par service", texte: "Clic droit sur l'OU IT > Nouveau > Groupe. Nom : GG-IT, étendue : Globale, type : Sécurité. Répète pour GG-RH et GG-Comptabilite dans leurs OU respectives." },
    { titre: "Créer des utilisateurs et les placer dans la bonne OU", texte: "Clic droit sur l'OU concernée > Nouveau > Utilisateur. Renseigne prénom/nom, nom d'ouverture de session (ex. jrakoto), puis définis un mot de passe et décoche 'L'utilisateur doit changer le mot de passe' uniquement pour ce lab de test." },
    {
      titre: "Refaire une partie en PowerShell (scalable)",
      commandes: [
        { commande: "New-ADOrganizationalUnit", objectif: "Créer une OU en script", syntaxe: "New-ADOrganizationalUnit -Name <nom> -Path <DN parent>", exemple: "New-ADOrganizationalUnit -Name \"IT\" -Path \"DC=lab,DC=local\"", resultat: "L'OU apparaît immédiatement dans dsa.msc", explication: "Le chemin DN (Distinguished Name) décrit la position exacte dans l'arborescence AD.", erreur: "Erreur si l'OU existe déjà avec le même nom au même niveau." },
        { commande: "New-ADUser", objectif: "Créer un utilisateur de domaine en script", syntaxe: "New-ADUser -Name <nom> -SamAccountName <login> -Path <DN OU> -AccountPassword (ConvertTo-SecureString ...) -Enabled $true", exemple: "New-ADUser -Name \"Jean Rakoto\" -SamAccountName \"jrakoto\" -Path \"OU=IT,DC=lab,DC=local\" -AccountPassword (ConvertTo-SecureString \"P@ssw0rd!\" -AsPlainText -Force) -Enabled $true", resultat: "Utilisateur créé et activé directement dans la bonne OU", explication: "-Enabled $true est indispensable : par défaut un compte créé en PowerShell est désactivé.", erreur: "Oublier -Enabled $true laisse un compte créé mais inutilisable, source de confusion fréquente." },
        { commande: "Add-ADGroupMember", objectif: "Ajouter un utilisateur à un groupe de domaine", syntaxe: "Add-ADGroupMember -Identity <groupe> -Members <utilisateur>", exemple: "Add-ADGroupMember -Identity \"GG-IT\" -Members \"jrakoto\"", resultat: "jrakoto apparaît dans les membres de GG-IT", explication: "Peut prendre plusieurs membres séparés par des virgules en une seule commande.", erreur: "Le SamAccountName doit correspondre exactement, sensible à l'orthographe." }
      ]
    }
  ],
  verification: ["Chaque OU contient les bons utilisateurs/groupes dans dsa.msc", "`Get-ADUser -Filter * -SearchBase \"OU=IT,DC=lab,DC=local\"` liste bien les utilisateurs IT uniquement", "`Get-ADGroupMember GG-IT` confirme les membres"],
  erreurs: [{ probleme: "New-ADUser réussit mais le compte apparaît désactivé (flèche rouge)", cause: "Paramètre -Enabled $true omis", diagnostic: "`Enable-ADAccount -Identity <login>` pour activer un compte existant sans le recréer." }],
  challenge: "Écris un script PowerShell qui lit une liste de 5 employés (nom, service) et crée automatiquement leur compte AD dans la bonne OU avec le bon groupe, en une seule exécution (boucle `foreach` sur un tableau d'objets).",
  validation: ["Au moins 4 OU créées", "Au moins 3 groupes de sécurité créés", "Au moins 5 utilisateurs répartis dans les bonnes OU et groupes", "Une partie du travail reproduite en PowerShell"]
},
{
  id: "ad-03",
  categorie: "ad",
  niveau: 3,
  numero: "LAB AD 03",
  titre: "Joindre un PC Windows au domaine",
  objectif: "Intégrer une machine cliente au domaine lab.local et se connecter avec un compte de domaine.",
  prerequis: ["LAB AD 02 terminé"],
  machines: [{ nom: "VM01 — SRV-AD-01", role: "Domain Controller" }, { nom: "VM03 — PC Windows client", role: "Poste à joindre au domaine" }],
  architecture: `<div class="ascii-diagram">VM03 (workgroup) --jonction--> VM03 (membre du domaine lab.local)</div>`,
  ressources: { iso: [], ram: "4 Go pour VM03", cpu: "2 vCPU", disque: "40 Go", reseau: "VM03 doit utiliser VM01 comme serveur DNS", logiciels: [] },
  etapes: [
    { titre: "Configurer le DNS du client AVANT la jonction", texte: "Sur VM03, dans les propriétés IPv4, mets le serveur DNS préféré à 192.168.50.1 (l'IP du DC). Sans ça, le client ne pourra jamais localiser le domaine — c'est l'erreur la plus fréquente de ce lab." },
    { titre: "Lancer la jonction au domaine", texte: "Propriétés système > Modifier > sélectionner 'Domaine' et saisir lab.local. Windows demande alors des identifiants : utilise un compte administrateur du domaine (ex. LAB\\Administrateur)." },
    { titre: "Redémarrer et se connecter avec un compte de domaine", texte: "Après redémarrage, sur l'écran de connexion, choisis 'Autre utilisateur' et connecte-toi avec LAB\\jrakoto (ou juste jrakoto@lab.local)." }
  ],
  verification: ["Le message 'Bienvenue dans le domaine lab.local' apparaît après la jonction", "L'ordinateur VM03 apparaît automatiquement dans dsa.msc (dans le conteneur Computers ou l'OU Ordinateurs-Entreprise si redirigé)", "Connexion réussie avec un compte de domaine sur VM03"],
  erreurs: [
    { probleme: "'Un domaine contrôleur pour le domaine lab.local n'a pas pu être contacté'", cause: "DNS du client mal configuré (ne pointe pas vers le DC)", diagnostic: "`ipconfig /all` sur le client : le champ 'Serveurs DNS' doit être l'IP du DC, pas la box Internet ni 8.8.8.8." },
    { probleme: "Jonction acceptée mais connexion au domaine impossible ensuite", cause: "Horloge du client trop décalée par rapport au DC (Kerberos tolère 5 minutes d'écart max)", diagnostic: "Synchroniser l'heure des deux VM, idéalement sur la même source NTP." }
  ],
  challenge: "Après la jonction, déplace l'objet ordinateur de VM03 depuis le conteneur 'Computers' par défaut vers l'OU 'Ordinateurs-Entreprise' que tu as créée au LAB AD 02, sans rejoindre le domaine à nouveau (juste un déplacement dans dsa.msc).",
  validation: ["Client joint au domaine avec succès", "Objet ordinateur visible dans AD", "Connexion avec un compte de domaine réussie"]
},
{
  id: "ad-04",
  categorie: "ad",
  niveau: 4,
  numero: "LAB AD 04",
  titre: "Group Policy Objects (GPO)",
  objectif: "Créer et appliquer des stratégies de groupe pour imposer des règles de sécurité et de configuration centralisées.",
  prerequis: ["LAB AD 03 terminé"],
  machines: [{ nom: "VM01 — SRV-AD-01", role: "Gestion des GPO" }, { nom: "VM03 — PC client joint au domaine", role: "Cible d'application" }],
  architecture: `<div class="ascii-diagram">GPO "Politique-Mot-de-passe" --liée à--> Domaine lab.local (toutes les OU)
GPO "Restriction-Panneau-Config" --liée à--> OU=IT uniquement</div>`,
  ressources: { iso: [], ram: "4-8 Go", cpu: "2-4 vCPU", disque: "60 Go", reseau: "", logiciels: ["GPMC (Group Policy Management Console, inclus avec AD DS)"] },
  etapes: [
    { titre: "Ouvrir la console de gestion des stratégies de groupe", texte: "Exécuter `gpmc.msc` sur le DC." },
    { titre: "Créer une GPO de politique de mot de passe", texte: "Clic droit sur 'Objets de stratégie de groupe' > Nouveau. Nomme-la 'Politique-Mot-de-passe'. Modifie-la : Configuration ordinateur > Stratégies > Paramètres Windows > Paramètres de sécurité > Stratégies de compte > Stratégie de mot de passe. Fixe par exemple longueur minimale = 10, historique = 5 mots de passe mémorisés." },
    { titre: "Lier la GPO au domaine entier", texte: "Fais un clic droit sur le domaine lab.local dans l'arborescence GPMC > 'Lier un objet de stratégie de groupe existant' > sélectionne 'Politique-Mot-de-passe'." },
    { titre: "Créer une GPO de restriction ciblée sur une OU", texte: "Crée une seconde GPO 'Restriction-Panneau-Config', configure Configuration utilisateur > Modèles d'administration > Panneau de configuration > 'Interdire l'accès au Panneau de configuration'. Lie-la uniquement à l'OU IT (pas au domaine entier)." },
    { titre: "Forcer l'application côté client et vérifier", texte: "Sur VM03, exécute `gpupdate /force` (Windows applique normalement les GPO au démarrage/toutes les 90 min, mais on force ici pour tester immédiatement)." }
  ],
  verification: ["`gpresult /r` sur VM03 liste bien les GPO appliquées", "Un nouveau mot de passe trop court est refusé, conforme à la politique définie", "Le Panneau de configuration est bien inaccessible pour un utilisateur de l'OU IT connecté sur VM03"],
  erreurs: [
    { probleme: "La GPO ne s'applique pas malgré `gpupdate /force`", cause: "GPO liée au mauvais niveau (OU au lieu du domaine, ou inversement), ou filtrage de sécurité excluant l'utilisateur/l'ordinateur testé", diagnostic: "`gpresult /r` indique explicitement les GPO refusées et la raison (filtrage WMI, filtrage de sécurité, portée)." }
  ],
  challenge: "Crée une troisième GPO qui déploie automatiquement un lecteur réseau (le partage \\\\SRV-AD-01\\Compta du LAB Windows 03) pour les membres du groupe GG-Comptabilite uniquement, sans toucher aux autres utilisateurs.",
  validation: ["Au moins 2 GPO créées et configurées", "GPO liées au bon périmètre (domaine vs OU spécifique)", "Application vérifiée avec gpupdate + gpresult"]
},
{
  id: "ad-05",
  categorie: "ad",
  niveau: 4,
  numero: "LAB AD 05",
  titre: "DNS intégré à Active Directory et diagnostic",
  objectif: "Comprendre et vérifier l'intégration DNS/AD (indispensable au bon fonctionnement du domaine), puis diagnostiquer les pannes les plus courantes.",
  prerequis: ["LAB AD 04 terminé", "LAB DNS-01 recommandé"],
  machines: [{ nom: "VM01 — SRV-AD-01", role: "DC + serveur DNS intégré" }],
  architecture: `<div class="ascii-diagram">Zone AD-intégrée : lab.local
  Enregistrements SRV automatiques : _ldap._tcp, _kerberos._tcp
  (indispensables pour que les clients localisent le contrôleur de domaine)</div>`,
  ressources: { iso: [], ram: "4-8 Go", cpu: "2-4 vCPU", disque: "60 Go", reseau: "", logiciels: [] },
  etapes: [
    { titre: "Explorer les enregistrements SRV générés automatiquement", texte: "Ouvre le Gestionnaire DNS (dnsmgmt.msc), déroule Zones de recherche directe > lab.local > _msdcs > dc > _tcp. Observe les enregistrements SRV _ldap et _kerberos : ce sont eux qui permettent à un client de 'découvrir' le contrôleur de domaine automatiquement, sans IP codée en dur." },
    {
      titre: "Diagnostiquer la bonne santé DNS/AD avec dcdiag",
      commandes: [
        { commande: "dcdiag", objectif: "Lancer un diagnostic complet de la santé du contrôleur de domaine", syntaxe: "dcdiag /v", exemple: "dcdiag /v", resultat: "Une série de tests (Connectivity, Advertising, NetLogons, DNS...) avec PASS/FAIL pour chacun", explication: "Outil de référence pour diagnostiquer un DC qui a des comportements étranges (authentification lente, réplication en échec...).", erreur: "Ignorer un FAIL sur le test DNS est la cause n°1 de problèmes en cascade sur un domaine AD." },
        { commande: "nslookup", objectif: "Vérifier manuellement la résolution d'un enregistrement SRV", syntaxe: "nslookup -type=SRV _ldap._tcp.lab.local", exemple: "nslookup -type=SRV _ldap._tcp.lab.local", resultat: "Doit renvoyer le nom du DC et son IP", explication: "Si cette requête échoue, aucun client ne pourra localiser le domaine, même avec un DNS 'qui marche' pour les sites web normaux.", erreur: "Confondre une résolution de nom de domaine classique (qui peut marcher) avec la résolution SRV spécifique à AD (qui peut échouer indépendamment)." }
      ]
    },
    { titre: "Provoquer puis diagnostiquer une panne volontaire", texte: "Change temporairement le DNS préféré de VM03 pour 8.8.8.8 au lieu de l'IP du DC. Constate que `gpupdate /force` échoue et que la connexion avec un compte de domaine devient impossible ou très lente." }
  ],
  verification: ["`dcdiag` renvoie PASS sur les tests principaux (Connectivity, Advertising, DNS)", "`nslookup -type=SRV _ldap._tcp.lab.local` renvoie une réponse correcte", "Après correction du DNS sur VM03, `gpupdate /force` fonctionne de nouveau normalement"],
  erreurs: [
    { probleme: "dcdiag signale un échec sur le test 'DNS'", cause: "Zone DNS mal intégrée à AD, ou enregistrements SRV manquants suite à une modification manuelle malheureuse", diagnostic: "`dcdiag /test:dns /v` pour un rapport détaillé ; en dernier recours, `ipconfig /registerdns` puis redémarrer le service Netlogon pour régénérer les enregistrements." }
  ],
  challenge: "Retire volontairement le DC de son propre rôle DNS préféré (mets un DNS externe sur lui-même), observe précisément ce qui casse (essaie de créer un utilisateur, de faire un gpupdate depuis un client...), puis corrige et documente en 3 lignes pourquoi 'un DC doit toujours être son propre DNS préféré'.",
  validation: ["Enregistrements SRV identifiés et compris", "dcdiag exécuté avec un résultat globalement sain", "Panne DNS/AD provoquée puis résolue avec méthode"]
}
];
