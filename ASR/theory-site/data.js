/* ============================================================
   DATA.JS — Contenu pédagogique de la plateforme
   Administration Système & Réseaux — Parcours théorique
   ============================================================ */

const PLATFORM = {
  titre: "Administration Système & Réseaux",
  sousTitre: "Du premier octet à l'architecture d'entreprise",
  objectifPro: "Devenir capable d'occuper un poste junior d'administrateur système, réseau ou infrastructure en entreprise."
};

/* ------------------------------------------------------------
   MODULES — chaque module correspond à un "Niveau" du parcours
   ------------------------------------------------------------ */
const MODULES = [

  // ============================================================
  // NIVEAU 0 — FONDAMENTAUX INFORMATIQUES
  // ============================================================
  {
    id: "n0",
    niveau: 0,
    phase: "Fondations",
    titre: "Fondamentaux informatiques",
    tag: "FDN",
    resume: "Les briques matérielles et logicielles avant tout réseau.",
    lessons: [
      {
        id: "n0-l1",
        titre: "L'ordinateur : matériel et rôle de chaque composant",
        objectifs: [
          "Nommer les composants matériels essentiels d'un ordinateur",
          "Comprendre le rôle du CPU, de la RAM et du stockage",
          "Distinguer carte réseau, BIOS/UEFI et périphériques"
        ],
        intro: "Avant de comprendre un réseau, il faut comprendre ce qui communique sur ce réseau : l'ordinateur (poste de travail ou serveur). Un serveur n'est jamais qu'un ordinateur optimisé pour rendre un service à d'autres machines.",
        theorie: [
          { titre: "CPU (processeur)", texte: "Le CPU exécute les instructions des programmes. C'est le \"cerveau\" de la machine : il calcule, compare, décide. Sa puissance se mesure en fréquence (GHz) et en nombre de cœurs. En entreprise, un serveur de base de données a souvent besoin de nombreux cœurs pour traiter des requêtes en parallèle." },
          { titre: "RAM (mémoire vive)", texte: "La RAM stocke temporairement les données que le CPU utilise activement. Elle est très rapide mais volatile : tout son contenu disparaît à l'extinction. Un serveur sous-dimensionné en RAM devient lent car il doit sans cesse échanger des données avec le disque (swap)." },
          { titre: "Stockage HDD / SSD", texte: "Le disque stocke les données de façon permanente. Le HDD (mécanique, à plateaux) est peu coûteux mais lent ; le SSD (mémoire flash) est rapide mais plus cher au gigaoctet. En entreprise, les serveurs critiques utilisent presque toujours des SSD, souvent en RAID." },
          { titre: "Carte réseau (NIC)", texte: "La carte réseau (Network Interface Card) permet à la machine d'émettre et de recevoir des données sur un réseau. Chaque carte réseau possède une adresse physique unique appelée adresse MAC, gravée par le fabricant." },
          { titre: "BIOS / UEFI", texte: "C'est le tout premier programme exécuté au démarrage, avant même le système d'exploitation. Il initialise le matériel et démarre le système d'exploitation (boot). UEFI est la version moderne du BIOS, plus rapide et plus sécurisée (Secure Boot)." }
        ],
        exemple: "Un serveur web d'entreprise typique : CPU 8 cœurs pour gérer de nombreuses requêtes simultanées, 32 Go de RAM pour mettre en cache les pages fréquemment demandées, 2 SSD en RAID 1 pour la tolérance de panne, et deux cartes réseau pour la redondance.",
        schema: `
          <div class="diagram-row">
            <div class="diagram-box">CPU</div><div class="diagram-arrow">↔</div>
            <div class="diagram-box">RAM</div><div class="diagram-arrow">↔</div>
            <div class="diagram-box">Stockage</div>
          </div>
          <div class="diagram-row" style="margin-top:12px">
            <div class="diagram-box accent">Carte réseau</div><div class="diagram-arrow">→</div>
            <div class="diagram-box ghost">Réseau / Internet</div>
          </div>`,
        vocabulaire: [
          { terme: "CPU", def: "Central Processing Unit — unité centrale de traitement, exécute les instructions." },
          { terme: "RAM", def: "Random Access Memory — mémoire vive temporaire et rapide." },
          { terme: "NIC", def: "Network Interface Card — carte réseau, point d'entrée/sortie sur le réseau." },
          { terme: "Boot", def: "Processus de démarrage d'une machine, de la mise sous tension au système d'exploitation." }
        ],
        erreurs: [
          "Confondre la RAM (temporaire) avec le stockage (permanent).",
          "Croire qu'un GHz élevé suffit à juger la performance d'un serveur, sans regarder le nombre de cœurs ni la RAM."
        ],
        resume: "Un ordinateur (client ou serveur) repose sur quatre briques : CPU (calcul), RAM (mémoire temporaire), stockage (mémoire permanente) et carte réseau (communication). Le BIOS/UEFI démarre la machine avant le système d'exploitation.",
        quiz: [
          {
            q: "Que se passe-t-il si on éteint un serveur dont la RAM contient des données non enregistrées ?",
            options: ["Les données sont automatiquement sauvegardées sur le SSD", "Les données sont perdues car la RAM est volatile", "Les données restent en RAM indéfiniment", "Le CPU les conserve"],
            correct: 1,
            explanations: [
              "Faux : la RAM ne sauvegarde jamais automatiquement sur le disque.",
              "Correct : la RAM est une mémoire volatile, son contenu disparaît sans alimentation électrique.",
              "Faux : sans alimentation, la RAM perd tout son contenu.",
              "Faux : le CPU ne stocke pas de données, il les traite."
            ]
          },
          {
            q: "Quel composant possède une adresse MAC unique ?",
            options: ["Le CPU", "La RAM", "La carte réseau", "Le BIOS"],
            correct: 2,
            explanations: [
              "Faux, le CPU n'a pas d'adresse MAC.",
              "Faux, la RAM n'a pas d'adresse MAC.",
              "Correct : chaque carte réseau a une adresse MAC unique gravée par le fabricant.",
              "Faux, le BIOS initialise le matériel mais n'a pas d'adresse MAC."
            ]
          }
        ],
        plusLoin: ["Le système d'exploitation et le noyau (leçon suivante)", "Les architectures RAID (Niveau 14 — Stockage)"]
      },
      {
        id: "n0-l2",
        titre: "Système d'exploitation, noyau, processus et services",
        objectifs: [
          "Expliquer le rôle du système d'exploitation et du kernel",
          "Différencier un processus et un service",
          "Comprendre la notion de client et de serveur logiciel"
        ],
        intro: "Le matériel seul ne fait rien : il faut un logiciel pour l'orchestrer. C'est le rôle du système d'exploitation (OS), avec en son cœur le noyau (kernel).",
        theorie: [
          { titre: "Système d'exploitation (OS)", texte: "Logiciel qui gère les ressources matérielles (CPU, RAM, disque, réseau) et les met à disposition des applications. Exemples : Windows Server, Linux (Debian, Ubuntu, RedHat, CentOS)." },
          { titre: "Kernel (noyau)", texte: "Cœur de l'OS, il communique directement avec le matériel via des pilotes (drivers), gère la mémoire, planifie l'exécution des processus (ordonnanceur) et contrôle les accès aux périphériques." },
          { titre: "Processus", texte: "Un programme en cours d'exécution. Chaque processus possède un identifiant (PID), consomme du CPU et de la RAM, et peut être arrêté, mis en pause ou surveillé." },
          { titre: "Service (daemon)", texte: "Un processus particulier qui s'exécute en arrière-plan, sans interface, souvent démarré automatiquement au démarrage du système, pour rendre un service en continu (ex : un serveur web, un serveur DNS)." },
          { titre: "Client / Serveur", texte: "Le modèle client/serveur oppose une machine qui demande un service (le client) à une machine qui le fournit (le serveur). Un navigateur web est un client ; Apache ou Nginx sont des serveurs." }
        ],
        exemple: "Sur un serveur Linux d'entreprise, le service `sshd` tourne en permanence pour accepter les connexions d'administration à distance, tandis que le service `nginx` répond aux requêtes des navigateurs des visiteurs du site web de l'entreprise.",
        schema: `
          <div class="diagram-row">
            <div class="diagram-box ghost">Applications</div>
          </div>
          <div class="diagram-arrow down">↓</div>
          <div class="diagram-row"><div class="diagram-box accent">Système d'exploitation (kernel)</div></div>
          <div class="diagram-arrow down">↓</div>
          <div class="diagram-row"><div class="diagram-box">Matériel (CPU / RAM / Disque / Réseau)</div></div>`,
        vocabulaire: [
          { terme: "Kernel", def: "Noyau du système d'exploitation, interface directe entre logiciel et matériel." },
          { terme: "PID", def: "Process ID — identifiant unique d'un processus en cours d'exécution." },
          { terme: "Daemon", def: "Service qui s'exécute en arrière-plan sans interaction directe avec l'utilisateur." },
          { terme: "Client", def: "Machine ou programme qui envoie une demande à un serveur." },
          { terme: "Serveur", def: "Machine ou programme qui répond aux demandes d'un ou plusieurs clients." }
        ],
        erreurs: [
          "Confondre \"serveur\" (rôle logiciel) et \"serveur\" (machine physique) : un même serveur physique peut héberger plusieurs services serveurs.",
          "Croire qu'un service et un processus sont deux choses différentes : un service EST un processus, mais tourne en arrière-plan et en continu."
        ],
        resume: "Le système d'exploitation, via son noyau, gère le matériel et exécute des processus. Les services sont des processus permanents qui rendent un service réseau. Le modèle client/serveur structure la quasi-totalité des échanges informatiques en entreprise.",
        quiz: [
          {
            q: "Qu'est-ce qui distingue un service d'un simple processus ?",
            options: ["Un service consomme moins de mémoire", "Un service tourne en arrière-plan en continu, souvent depuis le démarrage", "Un service n'a pas de PID", "Un service ne peut pas être un processus"],
            correct: 1,
            explanations: ["Faux, la consommation mémoire n'est pas le critère.", "Correct : un service est un processus d'arrière-plan démarré automatiquement pour fonctionner en continu.", "Faux, tout processus a un PID, y compris un service.", "Faux, un service est justement un type particulier de processus."]
          }
        ],
        plusLoin: ["Utilisateurs, groupes et permissions", "Les fichiers et répertoires"]
      },
      {
        id: "n0-l3",
        titre: "Fichiers, répertoires, utilisateurs, groupes et permissions",
        objectifs: [
          "Comprendre l'organisation des fichiers en arborescence",
          "Expliquer la notion d'utilisateur et de groupe",
          "Comprendre pourquoi les permissions existent"
        ],
        intro: "Toute donnée sur un serveur est un fichier, rangé dans des répertoires. Mais qui a le droit de lire, modifier ou exécuter ce fichier ? C'est tout l'enjeu des permissions.",
        theorie: [
          { titre: "Fichiers et répertoires", texte: "Un fichier contient des données ; un répertoire (dossier) organise les fichiers en arborescence. Sous Linux, tout part de la racine `/` ; sous Windows, chaque disque a sa propre lettre (C:\\, D:\\...)." },
          { titre: "Utilisateurs", texte: "Chaque personne (ou service) qui utilise le système possède un compte utilisateur, identifié par un nom et, en interne, par un identifiant numérique unique (UID sous Linux, SID sous Windows)." },
          { titre: "Groupes", texte: "Un groupe rassemble plusieurs utilisateurs pour leur attribuer des droits communs en une seule fois. En entreprise, on crée par exemple un groupe \"Comptabilité\" plutôt que d'attribuer les droits utilisateur par utilisateur." },
          { titre: "Permissions", texte: "Elles définissent qui peut lire, écrire ou exécuter un fichier. C'est le fondement de la sécurité d'un système : sans permissions, n'importe quel utilisateur pourrait lire ou supprimer les données de n'importe qui." }
        ],
        exemple: "Dans une entreprise, le dossier \"Contrats RH\" n'est accessible qu'au groupe \"Ressources Humaines\". Un employé du service commercial, même connecté au même serveur, ne peut ni le voir ni l'ouvrir : c'est la permission qui l'en empêche.",
        schema: `
          <div class="diagram-row">
            <div class="diagram-box">Utilisateur</div><div class="diagram-arrow">appartient à</div>
            <div class="diagram-box accent">Groupe</div><div class="diagram-arrow">a des droits sur</div>
            <div class="diagram-box">Fichier / Dossier</div>
          </div>`,
        vocabulaire: [
          { terme: "UID", def: "User ID — identifiant numérique unique d'un utilisateur sous Linux." },
          { terme: "Permission", def: "Droit accordé (lecture, écriture, exécution) sur un fichier ou dossier." },
          { terme: "Arborescence", def: "Organisation hiérarchique des dossiers et fichiers, en forme d'arbre." }
        ],
        erreurs: [
          "Penser que les permissions ne concernent que les fichiers sensibles : en réalité tout fichier a des permissions, même si elles sont ouvertes.",
          "Oublier qu'un utilisateur peut appartenir à plusieurs groupes en même temps."
        ],
        resume: "Les données sont organisées en fichiers et répertoires. Chaque utilisateur, éventuellement regroupé dans des groupes, se voit attribuer des permissions précises sur ces ressources : c'est la base du contrôle d'accès.",
        quiz: [
          {
            q: "Pourquoi utilise-t-on des groupes plutôt que d'attribuer des droits à chaque utilisateur individuellement ?",
            options: ["Parce que les groupes sont plus rapides à créer", "Pour simplifier et centraliser la gestion des droits", "Parce qu'un utilisateur ne peut pas avoir de droits propres", "Ce n'est qu'une convention sans réel avantage"],
            correct: 1,
            explanations: ["Ce n'est pas la raison principale.", "Correct : gérer les droits par groupe évite de répéter la même configuration pour chaque utilisateur et facilite les changements.", "Faux, un utilisateur peut aussi avoir des droits propres en plus de ceux de ses groupes.", "Faux, c'est une pratique essentielle en administration système."]
          }
        ],
        plusLoin: ["Administration Linux (Niveau 7)", "Active Directory et gestion centralisée des utilisateurs (Niveau 9)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 1 — INTRODUCTION AUX RÉSEAUX
  // ============================================================
  {
    id: "n1",
    niveau: 1,
    phase: "Réseaux",
    titre: "Introduction aux réseaux",
    tag: "NET",
    resume: "Qu'est-ce qu'un réseau et comment les machines s'organisent-elles entre elles ?",
    lessons: [
      {
        id: "n1-l1",
        titre: "Qu'est-ce qu'un réseau ? LAN, WAN, MAN",
        objectifs: [
          "Définir ce qu'est un réseau informatique",
          "Distinguer LAN, MAN et WAN",
          "Comprendre Internet, Intranet et Extranet"
        ],
        intro: "Un réseau, c'est simplement un ensemble de machines reliées entre elles pour échanger des informations. La différence entre les types de réseaux tient surtout à leur étendue géographique.",
        theorie: [
          { titre: "LAN (Local Area Network)", texte: "Réseau local, limité à un bâtiment ou un site : les postes d'un même étage, reliés par un switch. C'est le réseau le plus rapide et le moins coûteux à mettre en œuvre." },
          { titre: "MAN (Metropolitan Area Network)", texte: "Réseau à l'échelle d'une ville, reliant par exemple plusieurs bâtiments d'une même entreprise ou d'une université dans une agglomération." },
          { titre: "WAN (Wide Area Network)", texte: "Réseau étendu, à l'échelle d'un pays ou du monde. Internet est le plus grand WAN existant. Une entreprise avec des filiales dans plusieurs pays relie ses LAN via un WAN (souvent en VPN)." },
          { titre: "Internet, Intranet, Extranet", texte: "Internet est le réseau public mondial. Un Intranet est un réseau privé interne à une organisation, basé sur les mêmes technologies qu'Internet mais inaccessible depuis l'extérieur. Un Extranet est une extension contrôlée de l'intranet, ouverte à des partenaires externes précis (fournisseurs, clients)." }
        ],
        exemple: "Une entreprise a un LAN dans chaque agence, connectés entre eux via un WAN loué à un opérateur télécom, et son Intranet héberge les documents internes accessibles uniquement aux employés authentifiés.",
        schema: `
          <div class="diagram-row">
            <div class="diagram-box">LAN Agence A</div>
            <div class="diagram-arrow">↔ WAN ↔</div>
            <div class="diagram-box">LAN Agence B</div>
          </div>`,
        vocabulaire: [
          { terme: "LAN", def: "Réseau local à échelle réduite (bâtiment, site)." },
          { terme: "WAN", def: "Réseau étendu reliant des sites distants, potentiellement à l'échelle mondiale." },
          { terme: "Intranet", def: "Réseau privé interne à une organisation, non accessible depuis l'extérieur." }
        ],
        erreurs: ["Confondre Internet (le réseau public mondial) avec un simple navigateur ou un site web.", "Croire qu'un WAN est nécessairement plus lent : cela dépend de la technologie et du lien utilisés."],
        resume: "Un réseau relie des machines pour échanger des données. Sa portée définit son type : LAN (local), MAN (ville), WAN (étendu, dont Internet). Intranet et Extranet sont des usages privés de ces technologies.",
        quiz: [
          { q: "Quel type de réseau relie typiquement les postes d'un même étage de bureau ?", options: ["WAN", "LAN", "Internet", "Extranet"], correct: 1, explanations: ["Faux, le WAN couvre de longues distances.", "Correct : le LAN est le réseau local d'un site ou d'un bâtiment.", "Faux, Internet est le réseau public mondial.", "Faux, l'Extranet concerne l'accès de partenaires externes."] }
        ],
        plusLoin: ["Les topologies réseau", "Le modèle client/serveur vs pair-à-pair"]
      },
      {
        id: "n1-l2",
        titre: "Topologies réseau et modèles d'architecture",
        objectifs: [
          "Identifier les principales topologies physiques",
          "Comparer le modèle client/serveur et le pair-à-pair"
        ],
        intro: "La topologie décrit la façon dont les câbles et les équipements sont physiquement (ou logiquement) organisés entre eux.",
        theorie: [
          { titre: "Topologie en étoile", texte: "Tous les postes sont reliés à un point central (un switch). C'est la topologie la plus utilisée aujourd'hui : si un câble tombe en panne, seul ce poste est affecté." },
          { titre: "Topologie en bus", texte: "Tous les postes partagent un même câble central. Ancienne technologie : une coupure du câble principal isole tout le réseau." },
          { titre: "Topologie en anneau", texte: "Chaque machine est reliée à exactement deux voisines, formant une boucle. Les données circulent dans un sens autour de l'anneau." },
          { titre: "Topologie en maillage (mesh)", texte: "Chaque nœud est relié à plusieurs autres, offrant une forte redondance : utilisée pour les infrastructures critiques (cœur de réseau des opérateurs, datacenters)." },
          { titre: "Client/serveur vs pair-à-pair", texte: "Dans le modèle client/serveur, un serveur centralise la ressource et de nombreux clients la consomment (majorité des usages en entreprise). Dans le pair-à-pair (P2P), chaque machine peut être à la fois client et serveur, sans centralisation." }
        ],
        exemple: "Dans une salle serveur, les switchs de cœur de réseau (core switches) sont souvent maillés entre eux pour qu'aucune panne d'un seul lien ne coupe l'ensemble du datacenter.",
        schema: `
          <div class="diagram-row"><div class="diagram-box ghost">Étoile</div><div class="diagram-box ghost">Bus</div><div class="diagram-box ghost">Anneau</div><div class="diagram-box ghost">Maillage</div></div>`,
        vocabulaire: [
          { terme: "Topologie", def: "Organisation physique ou logique des connexions entre équipements réseau." },
          { terme: "P2P", def: "Peer-to-peer — modèle où chaque machine agit à la fois comme client et serveur." }
        ],
        erreurs: ["Confondre la topologie physique (câblage réel) et la topologie logique (façon dont les données circulent)."],
        resume: "Étoile, bus, anneau et maillage sont les quatre topologies réseau de référence. En entreprise, le modèle client/serveur domine, tandis que le maillage sécurise les infrastructures critiques.",
        quiz: [
          { q: "Quelle topologie est aujourd'hui la plus répandue dans les réseaux d'entreprise ?", options: ["Bus", "Anneau", "Étoile", "Aucune des réponses"], correct: 2, explanations: ["Faux, le bus est une technologie ancienne peu résiliente.", "Faux, peu utilisée en entreprise moderne.", "Correct : la topologie en étoile, centrée sur un switch, est le standard actuel.", "Faux."] }
        ],
        plusLoin: ["Le modèle OSI (Niveau 2)", "Le switching (Niveau 5)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 2 — MODÈLES RÉSEAU (OSI / TCP-IP)
  // ============================================================
  {
    id: "n2",
    niveau: 2,
    phase: "Réseaux",
    titre: "Modèles OSI et TCP/IP",
    tag: "OSI",
    resume: "Le langage commun qui permet de décrire et diagnostiquer n'importe quelle communication réseau.",
    lessons: [
      {
        id: "n2-l1",
        titre: "Le modèle OSI en 7 couches",
        objectifs: [
          "Lister les 7 couches du modèle OSI",
          "Associer un rôle et des exemples à chaque couche",
          "Utiliser le modèle OSI pour raisonner sur une panne réseau"
        ],
        intro: "Le modèle OSI (Open Systems Interconnection) découpe la communication réseau en 7 couches. C'est une carte mentale : elle permet de savoir \"à quel niveau\" se situe un problème ou un protocole.",
        theorie: [
          { titre: "Pourquoi découper en couches ?", texte: "Chaque couche a une responsabilité précise et ne dépend que de la couche immédiatement inférieure. Cela permet de faire évoluer une couche (ex : remplacer le câble cuivre par de la fibre) sans toucher aux autres." },
          { titre: "Couche 1 — Physique", texte: "Transmission des bits sous forme de signaux électriques, lumineux ou radio. Équipements : câbles, hub, répéteurs, prises RJ45. Unité : le bit." },
          { titre: "Couche 2 — Liaison de données", texte: "Organise les bits en trames (frames), gère les adresses MAC et la détection d'erreurs sur un même segment local. Équipement clé : le switch." },
          { titre: "Couche 3 — Réseau", texte: "Achemine les paquets d'un réseau à un autre grâce aux adresses IP et au routage. Équipement clé : le routeur. Protocole clé : IP." },
          { titre: "Couche 4 — Transport", texte: "Découpe les données en segments, assure (ou non) la fiabilité de la transmission. Protocoles clés : TCP (fiable) et UDP (rapide, non fiable)." },
          { titre: "Couche 5 — Session", texte: "Ouvre, maintient et ferme les sessions de communication entre deux applications (ex : une session d'authentification)." },
          { titre: "Couche 6 — Présentation", texte: "Met en forme les données : chiffrement (TLS), compression, encodage de caractères, pour que les deux systèmes se comprennent." },
          { titre: "Couche 7 — Application", texte: "Couche la plus proche de l'utilisateur : les protocoles qu'il utilise directement, comme HTTP, FTP, SMTP, DNS." }
        ],
        exemple: "Quand un technicien dit \"le problème est niveau 1\", il veut dire que le câble ou la carte réseau est probablement en cause — pas la configuration logicielle. Ce vocabulaire commun accélère le diagnostic en entreprise.",
        schema: `
          <div class="osi-stack">
            <div class="osi-layer">7 · Application <span>HTTP, DNS, FTP</span></div>
            <div class="osi-layer">6 · Présentation <span>TLS, chiffrement</span></div>
            <div class="osi-layer">5 · Session <span>Ouverture/fermeture de session</span></div>
            <div class="osi-layer">4 · Transport <span>TCP, UDP</span></div>
            <div class="osi-layer">3 · Réseau <span>IP, routeurs</span></div>
            <div class="osi-layer">2 · Liaison de données <span>MAC, switch</span></div>
            <div class="osi-layer">1 · Physique <span>Câbles, signaux</span></div>
          </div>`,
        vocabulaire: [
          { terme: "Trame", def: "Unité de données de la couche 2 (liaison de données)." },
          { terme: "Paquet", def: "Unité de données de la couche 3 (réseau)." },
          { terme: "Segment", def: "Unité de données de la couche 4 (transport)." }
        ],
        erreurs: [
          "Apprendre les 7 couches par cœur sans comprendre leur rôle : le modèle OSI est un outil de raisonnement, pas une liste à réciter.",
          "Confondre trame, paquet et segment, qui désignent la même donnée mais à des couches différentes."
        ],
        resume: "Le modèle OSI structure toute communication réseau en 7 couches, de la transmission physique des bits (couche 1) jusqu'aux applications utilisateur (couche 7). C'est l'outil de référence pour localiser une panne réseau.",
        quiz: [
          { q: "À quelle couche OSI appartient un switch ?", options: ["Couche 1 — Physique", "Couche 2 — Liaison de données", "Couche 3 — Réseau", "Couche 4 — Transport"], correct: 1, explanations: ["Faux, un simple hub est couche 1, pas le switch.", "Correct : le switch travaille avec les adresses MAC, donc en couche 2.", "Faux, c'est le rôle du routeur.", "Faux."] },
          { q: "Quel protocole appartient à la couche Transport ?", options: ["HTTP", "IP", "TCP", "Ethernet"], correct: 2, explanations: ["Faux, HTTP est couche 7 (Application).", "Faux, IP est couche 3 (Réseau).", "Correct : TCP (et UDP) sont les protocoles de la couche 4.", "Faux, Ethernet est couche 2."] }
        ],
        plusLoin: ["Le modèle TCP/IP et sa comparaison avec OSI", "L'adressage IP (Niveau 3)"]
      },
      {
        id: "n2-l2",
        titre: "Le modèle TCP/IP et comparaison avec OSI",
        objectifs: [
          "Décrire les 4 couches du modèle TCP/IP",
          "Mettre en correspondance TCP/IP et OSI"
        ],
        intro: "Le modèle OSI est théorique. Dans la pratique, c'est le modèle TCP/IP, plus simple avec 4 couches, qui est réellement implémenté sur Internet et dans les réseaux d'entreprise.",
        theorie: [
          { titre: "Couche Accès réseau", texte: "Regroupe les couches OSI 1 et 2 : transmission physique et adressage MAC local." },
          { titre: "Couche Internet", texte: "Correspond à la couche OSI 3 : adressage IP et routage entre réseaux." },
          { titre: "Couche Transport", texte: "Identique à la couche OSI 4 : TCP et UDP." },
          { titre: "Couche Application", texte: "Regroupe les couches OSI 5, 6 et 7 : toutes les applications et leurs protocoles (HTTP, DNS, SMTP...)." }
        ],
        exemple: "Quand un développeur ouvre les outils réseau de son navigateur, il travaille avec des concepts TCP/IP (adresse IP, port TCP) bien plus qu'avec les 7 couches OSI théoriques.",
        schema: `
          <table class="compare-table">
            <thead><tr><th>Modèle OSI (7 couches)</th><th>Modèle TCP/IP (4 couches)</th></tr></thead>
            <tbody>
              <tr><td>7. Application / 6. Présentation / 5. Session</td><td rowspan="1">Application</td></tr>
              <tr><td>4. Transport</td><td>Transport</td></tr>
              <tr><td>3. Réseau</td><td>Internet</td></tr>
              <tr><td>2. Liaison de données / 1. Physique</td><td>Accès réseau</td></tr>
            </tbody>
          </table>`,
        vocabulaire: [
          { terme: "TCP/IP", def: "Suite de protocoles réellement utilisée sur Internet, organisée en 4 couches." }
        ],
        erreurs: ["Croire que OSI et TCP/IP s'opposent : OSI est un modèle de référence pédagogique, TCP/IP est le modèle réellement implémenté."],
        resume: "Le modèle TCP/IP condense les 7 couches OSI en 4 couches pratiques : Accès réseau, Internet, Transport et Application. C'est ce modèle qui fait fonctionner Internet au quotidien.",
        quiz: [
          { q: "La couche \"Application\" du modèle TCP/IP correspond à quelles couches OSI ?", options: ["1, 2 et 3", "Uniquement 7", "5, 6 et 7", "3 et 4"], correct: 2, explanations: ["Faux.", "Incomplet : elle regroupe aussi Session et Présentation.", "Correct : Application TCP/IP fusionne Session, Présentation et Application OSI.", "Faux, cela correspond à Internet et Transport."] }
        ],
        plusLoin: ["L'adressage IP (Niveau 3)", "Les protocoles réseau en détail (Niveau 4)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 3 — ADRESSAGE IP
  // ============================================================
  {
    id: "n3",
    niveau: 3,
    phase: "Réseaux",
    titre: "Adressage IP",
    tag: "IP",
    resume: "Comprendre IPv4, IPv6, les masques réseau et le découpage en sous-réseaux.",
    lessons: [
      {
        id: "n3-l1",
        titre: "Adresse IP, masque réseau et notion réseau/hôte",
        objectifs: [
          "Expliquer ce qu'est une adresse IPv4",
          "Comprendre le rôle du masque de sous-réseau",
          "Distinguer partie réseau et partie hôte d'une adresse IP"
        ],
        intro: "Une adresse IP est comme une adresse postale : elle permet de savoir où envoyer les données sur un réseau. Contrairement à l'adresse MAC (fixe, liée au matériel), l'adresse IP est logique et peut changer.",
        theorie: [
          { titre: "Adresse IPv4", texte: "Une adresse IPv4 s'écrit sous forme de 4 nombres de 0 à 255 séparés par des points (ex : 192.168.1.10), soit 32 bits au total. Elle identifie de façon unique une interface réseau sur un réseau IP." },
          { titre: "Masque de sous-réseau", texte: "Le masque indique quelle partie de l'adresse IP désigne le réseau, et quelle partie désigne l'hôte (la machine) dans ce réseau. Exemple : avec le masque 255.255.255.0, les 3 premiers nombres identifient le réseau, le dernier identifie la machine." },
          { titre: "Partie réseau / partie hôte", texte: "Pour l'adresse 192.168.1.10 avec le masque 255.255.255.0 : la partie réseau est 192.168.1.0, la partie hôte est .10. Toutes les machines partageant la même partie réseau peuvent communiquer directement, sans passer par un routeur." },
          { titre: "Passerelle (gateway)", texte: "C'est l'adresse IP du routeur auquel une machine envoie ses paquets lorsqu'elle veut joindre un réseau différent du sien." },
          { titre: "Adresse de broadcast", texte: "Adresse spéciale permettant d'envoyer un message à toutes les machines d'un réseau en une seule fois (tous les bits hôtes à 1)." }
        ],
        exemple: "Un poste avec l'IP 192.168.1.10 et le masque 255.255.255.0 peut parler directement à 192.168.1.20 (même réseau), mais doit passer par la passerelle pour joindre 192.168.2.5 (réseau différent).",
        schema: `
          <div class="ip-breakdown">
            <div class="ip-part net">192.168.1</div><div class="ip-dot">.</div><div class="ip-part host">10</div>
          </div>
          <div class="ip-legend"><span class="dot net"></span> Partie RÉSEAU <span class="dot host"></span> Partie HÔTE</div>`,
        vocabulaire: [
          { terme: "Adresse IP", def: "Identifiant logique d'une interface réseau, permettant l'acheminement des données." },
          { terme: "Masque de sous-réseau", def: "Valeur définissant la limite entre la partie réseau et la partie hôte d'une adresse IP." },
          { terme: "Gateway", def: "Passerelle : adresse du routeur utilisée pour sortir du réseau local." },
          { terme: "Broadcast", def: "Adresse permettant d'envoyer un message à toutes les machines d'un réseau." }
        ],
        erreurs: [
          "Confondre l'adresse IP (logique, peut changer) et l'adresse MAC (physique, fixe).",
          "Oublier que sans masque, une adresse IP seule ne veut rien dire : c'est le couple adresse + masque qui définit le réseau."
        ],
        resume: "Une adresse IPv4 identifie une machine sur un réseau. Le masque de sous-réseau définit la frontière entre la partie réseau (commune à toutes les machines du même réseau) et la partie hôte (propre à chaque machine).",
        quiz: [
          { q: "Avec le masque 255.255.255.0, combien de nombres de l'adresse IP identifient le réseau ?", options: ["1", "2", "3", "4"], correct: 2, explanations: ["Faux.", "Faux.", "Correct : les 3 premiers octets (255.255.255) désignent le réseau, le dernier désigne l'hôte.", "Faux, sinon aucune machine ne pourrait être identifiée individuellement."] },
          { q: "Que doit faire une machine pour joindre une IP hors de son propre réseau ?", options: ["Envoyer directement le paquet, cela fonctionne toujours", "Passer par sa passerelle (gateway)", "Utiliser l'adresse de broadcast", "Ce n'est pas possible"], correct: 1, explanations: ["Faux, une machine hors réseau local n'est jamais jointe directement.", "Correct : le paquet est envoyé au routeur (gateway) qui se charge de l'acheminer.", "Faux, le broadcast ne sert pas à cela.", "Faux, c'est justement le rôle du routage."] }
        ],
        plusLoin: ["Le subnetting et le CIDR", "IPv6 et adresses privées/publiques"]
      },
      {
        id: "n3-l2",
        titre: "CIDR, subnetting, IPv6 et adresses privées",
        objectifs: [
          "Comprendre la notation CIDR",
          "Comprendre le principe du découpage en sous-réseaux (subnetting)",
          "Différencier IPv4 privée / publique et introduire IPv6"
        ],
        intro: "Découper un grand réseau en plusieurs petits sous-réseaux permet d'organiser le trafic, de limiter les pannes et de renforcer la sécurité. C'est le rôle du subnetting.",
        theorie: [
          { titre: "Notation CIDR", texte: "Le CIDR (Classless Inter-Domain Routing) écrit le masque sous forme de /nombre de bits réseau. Exemple : 192.168.1.0/24 signifie que les 24 premiers bits (soit 255.255.255.0) forment la partie réseau." },
          { titre: "Classes historiques A / B / C", texte: "Avant le CIDR, les réseaux étaient répartis en classes fixes : A (grands réseaux, masque /8), B (réseaux moyens, /16), C (petits réseaux, /24). Ce système, rigide, a été remplacé par le CIDR, plus flexible." },
          { titre: "Subnetting", texte: "Le subnetting consiste à emprunter des bits à la partie hôte pour créer plusieurs sous-réseaux plus petits à partir d'un seul grand réseau, afin de séparer par exemple les services, les étages ou les départements d'une entreprise." },
          { titre: "Adresses privées / publiques", texte: "Les adresses privées (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) ne sont routables que sur les réseaux internes. Les adresses publiques sont uniques mondialement et routables sur Internet." },
          { titre: "Loopback et APIPA", texte: "127.0.0.1 est l'adresse de bouclage (loopback) : elle désigne toujours \"la machine elle-même\". Une adresse APIPA (169.254.x.x) est attribuée automatiquement quand une machine ne parvient pas à obtenir d'adresse via DHCP." },
          { titre: "IPv6", texte: "IPv6 remplace progressivement IPv4 pour répondre à la pénurie d'adresses. Elle s'écrit en hexadécimal sur 128 bits (ex : 2001:0db8::1), offrant un nombre d'adresses quasiment illimité." }
        ],
        exemple: "Une entreprise reçoit le réseau 192.168.0.0/24 et le découpe en 192.168.0.0/26 (service RH), 192.168.0.64/26 (service technique) et 192.168.0.128/26 (invités Wi-Fi), pour isoler le trafic de chaque service.",
        schema: `<div class="diagram-row"><div class="diagram-box">192.168.0.0/24</div><div class="diagram-arrow">divisé en</div><div class="diagram-box accent">4 sous-réseaux /26</div></div>`,
        vocabulaire: [
          { terme: "CIDR", def: "Notation du masque réseau sous forme de nombre de bits (ex : /24)." },
          { terme: "Subnetting", def: "Découpage d'un réseau IP en plusieurs sous-réseaux plus petits." },
          { terme: "APIPA", def: "Adresse IP attribuée automatiquement (169.254.x.x) en l'absence de serveur DHCP." },
          { terme: "Loopback", def: "Adresse (127.0.0.1) qui désigne toujours la machine locale elle-même." }
        ],
        erreurs: [
          "Croire qu'une adresse privée peut être jointe directement depuis Internet : elle nécessite une traduction NAT.",
          "Confondre /24 (CIDR) avec \"24 adresses possibles\" : /24 signifie 24 bits réseau, soit 254 adresses hôtes utilisables."
        ],
        resume: "Le CIDR remplace les classes historiques pour définir des masques flexibles. Le subnetting permet de découper un réseau en plusieurs sous-réseaux. Les adresses privées circulent en interne, les publiques sur Internet, et IPv6 répond à la pénurie d'adresses IPv4.",
        quiz: [
          { q: "Que signifie /24 en notation CIDR ?", options: ["24 adresses IP disponibles", "24 bits dédiés à la partie réseau", "24 sous-réseaux possibles", "La 24e adresse du réseau"], correct: 1, explanations: ["Faux.", "Correct : /24 indique que les 24 premiers bits de l'adresse forment la partie réseau.", "Faux.", "Faux."] },
          { q: "Laquelle de ces adresses est une adresse privée ?", options: ["8.8.8.8", "192.168.1.1", "1.1.1.1", "142.250.0.1"], correct: 1, explanations: ["Faux, c'est une adresse publique connue (Google DNS).", "Correct : la plage 192.168.0.0/16 est réservée aux réseaux privés.", "Faux, adresse publique (Cloudflare DNS).", "Faux, adresse publique."] }
        ],
        plusLoin: ["Les protocoles ARP et ICMP (Niveau 4)", "Le routage (Niveau 6)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 4 — PROTOCOLES RÉSEAU
  // ============================================================
  {
    id: "n4",
    niveau: 4,
    phase: "Réseaux",
    titre: "Protocoles réseau",
    tag: "PROTO",
    resume: "Fiches pratiques sur les protocoles utilisés au quotidien en entreprise.",
    lessons: [
      {
        id: "n4-l1",
        titre: "TCP vs UDP, HTTP/HTTPS, SSH et FTP/SFTP",
        objectifs: [
          "Comparer TCP et UDP et savoir quand chacun est utilisé",
          "Connaître le rôle et le port par défaut des protocoles applicatifs courants"
        ],
        intro: "Chaque application utilise un protocole précis, avec un port par défaut standardisé. Connaître ces fiches est indispensable pour configurer un pare-feu ou diagnostiquer une panne.",
        theorie: [
          { titre: "TCP (Transmission Control Protocol)", texte: "Protocole de transport fiable : il garantit que les données arrivent complètes, dans l'ordre, avec accusés de réception. Plus lent que UDP à cause de ces vérifications. Utilisé pour tout ce qui exige la fiabilité : web, email, transfert de fichiers." },
          { titre: "UDP (User Datagram Protocol)", texte: "Protocole de transport rapide mais non fiable : aucune garantie de livraison ni d'ordre. Utilisé quand la vitesse prime sur la fiabilité : streaming vidéo, jeux en ligne, DNS, VoIP." },
          { titre: "HTTP / HTTPS", texte: "HTTP (port 80) transfère les pages web en clair. HTTPS (port 443) fait de même mais chiffre les échanges via TLS, protégeant contre l'espionnage et la falsification des données. Couche OSI : Application (7)." },
          { titre: "SSH (Secure Shell)", texte: "Port 22. Permet une administration à distance sécurisée et chiffrée d'un serveur (ligne de commande). Norme incontournable en administration Linux." },
          { titre: "FTP / SFTP", texte: "FTP (ports 20/21) transfère des fichiers mais en clair, sans chiffrement — donc risqué. SFTP (port 22, via SSH) réalise le même transfert mais de façon chiffrée et sécurisée." }
        ],
        exemple: "Un administrateur système se connecte à un serveur Linux distant en SSH (port 22) pour l'administrer, et configure ensuite le pare-feu pour n'autoriser HTTPS (443) que depuis Internet, tout en bloquant HTTP (80) non chiffré.",
        schema: `
          <table class="proto-table">
            <thead><tr><th>Protocole</th><th>Port</th><th>Transport</th><th>Usage</th></tr></thead>
            <tbody>
              <tr><td>HTTP</td><td>80</td><td>TCP</td><td>Pages web (non chiffré)</td></tr>
              <tr><td>HTTPS</td><td>443</td><td>TCP</td><td>Pages web chiffrées (TLS)</td></tr>
              <tr><td>SSH</td><td>22</td><td>TCP</td><td>Administration distante sécurisée</td></tr>
              <tr><td>FTP</td><td>20/21</td><td>TCP</td><td>Transfert de fichiers (non chiffré)</td></tr>
            </tbody>
          </table>`,
        vocabulaire: [
          { terme: "TCP", def: "Protocole de transport fiable avec accusé de réception." },
          { terme: "UDP", def: "Protocole de transport rapide sans garantie de livraison." },
          { terme: "TLS", def: "Transport Layer Security — protocole de chiffrement utilisé notamment par HTTPS." }
        ],
        erreurs: [
          "Penser qu'UDP est \"mauvais\" parce qu'il n'est pas fiable : il est simplement adapté à d'autres usages que TCP.",
          "Utiliser encore FTP en entreprise pour des données sensibles, alors que SFTP doit être préféré."
        ],
        resume: "TCP privilégie la fiabilité, UDP privilégie la vitesse. HTTP/HTTPS servent au web, SSH à l'administration sécurisée, FTP/SFTP au transfert de fichiers — SFTP étant la version chiffrée à privilégier en entreprise.",
        quiz: [
          { q: "Pourquoi le streaming vidéo utilise-t-il souvent UDP plutôt que TCP ?", options: ["Parce qu'UDP est plus sécurisé", "Parce que la vitesse prime sur la fiabilité totale pour ce type d'usage", "Parce que TCP ne fonctionne pas sur Internet", "Ce n'est jamais le cas"], correct: 1, explanations: ["Faux, UDP n'est pas plus sécurisé.", "Correct : perdre quelques paquets vidéo est moins gênant qu'un ralentissement dû aux vérifications de TCP.", "Faux, TCP fonctionne très bien sur Internet.", "Faux, c'est un cas réel et fréquent."] },
          { q: "Quel port utilise SSH par défaut ?", options: ["21", "22", "80", "443"], correct: 1, explanations: ["Faux, c'est FTP.", "Correct.", "Faux, c'est HTTP.", "Faux, c'est HTTPS."] }
        ],
        plusLoin: ["DNS et DHCP (Niveaux 10 et 11)", "La sécurité réseau et TLS/PKI (Niveau 15)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 5 — COMMUTATION (SWITCHING) ET VLAN
  // ============================================================
  {
    id: "n5",
    niveau: 5,
    phase: "Réseaux",
    titre: "Commutation et VLAN",
    tag: "SW",
    resume: "Comment un switch fait circuler les trames, et comment segmenter logiquement un réseau avec les VLAN.",
    lessons: [
      {
        id: "n5-l1",
        titre: "Le commutateur (switch) et la commutation Ethernet",
        objectifs: [
          "Expliquer comment un switch apprend et utilise les adresses MAC",
          "Différencier hub, switch et pont",
          "Comprendre le rôle du spanning tree face aux boucles réseau"
        ],
        intro: "Le switch est l'équipement central de tout réseau local moderne : il relie les machines entre elles et décide, trame par trame, où envoyer chaque donnée.",
        theorie: [
          { titre: "Table d'adresses MAC (CAM table)", texte: "Un switch apprend automatiquement quelle adresse MAC se trouve derrière quel port en observant le trafic entrant. Il construit ainsi une table qui lui permet, par la suite, d'envoyer une trame uniquement vers le bon port au lieu de la diffuser partout." },
          { titre: "Unicast, broadcast, multicast", texte: "Une trame unicast a un destinataire unique et précis. Une trame broadcast (adresse FF:FF:FF:FF:FF:FF) est envoyée à toutes les machines du réseau local. Une trame multicast cible un groupe défini de machines. Trop de broadcast ralentit un réseau : c'est une des raisons de segmenter avec des VLAN." },
          { titre: "Domaine de collision vs domaine de broadcast", texte: "Un switch élimine les collisions en isolant chaque port (contrairement à un ancien hub, où toutes les machines partageaient le même domaine de collision). En revanche, toutes les machines connectées à un même switch (sans VLAN) restent dans le même domaine de broadcast." },
          { titre: "Boucles réseau et Spanning Tree Protocol (STP)", texte: "Relier deux switches par plusieurs câbles pour la redondance crée une boucle, qui peut provoquer une tempête de broadcast et paralyser le réseau. Le protocole STP détecte ces boucles et bloque automatiquement les liens redondants tant qu'ils ne sont pas nécessaires, tout en les réactivant en cas de panne du lien principal." }
        ],
        exemple: "Dans un bureau, un switch de 24 ports relie tous les postes, l'imprimante et le point d'accès Wi-Fi. Quand un PC envoie un fichier à l'imprimante, le switch consulte sa table MAC et transmet la trame uniquement sur le port de l'imprimante, sans déranger les autres postes.",
        schema: `
          <div class="diagram-row">
            <div class="diagram-box">PC A</div>
            <div class="diagram-box accent">Switch (table MAC)</div>
            <div class="diagram-box">PC B</div>
          </div>
          <div class="diagram-row" style="margin-top:10px">
            <div class="diagram-box ghost">Port 1: MAC-A</div><div class="diagram-box ghost">Port 2: MAC-B</div>
          </div>`,
        vocabulaire: [
          { terme: "CAM Table", def: "Table associant chaque adresse MAC apprise à un port physique du switch." },
          { terme: "STP", def: "Spanning Tree Protocol — protocole évitant les boucles réseau en bloquant dynamiquement des liens redondants." },
          { terme: "Domaine de broadcast", def: "Ensemble des machines qui reçoivent une même trame broadcast." }
        ],
        erreurs: ["Croire qu'un switch élimine aussi les broadcasts, alors qu'il ne fait qu'éliminer les collisions — seul un VLAN ou un routeur segmente les domaines de broadcast."],
        resume: "Un switch apprend les adresses MAC pour acheminer les trames port par port, réduisant les collisions mais partageant toujours le même domaine de broadcast. STP protège le réseau contre les boucles créées par des liens redondants.",
        quiz: [
          { q: "Que fait un switch qui reçoit une trame dont l'adresse MAC de destination est inconnue dans sa table ?", options: ["Il la détruit", "Il la diffuse sur tous les ports sauf celui d'origine (flooding)", "Il attend indéfiniment", "Il la renvoie à l'expéditeur"], correct: 1, explanations: ["Faux, il tente de la livrer.", "Correct : c'est le comportement de secours appelé flooding, en attendant d'apprendre la bonne association.", "Faux.", "Faux."] }
        ],
        plusLoin: ["La segmentation logique avec les VLAN (leçon suivante)", "Le routage inter-VLAN (Niveau 6)"]
      },
      {
        id: "n5-l2",
        titre: "VLAN : segmentation logique d'un réseau physique",
        objectifs: [
          "Expliquer l'intérêt de segmenter un réseau avec des VLAN",
          "Différencier un port access et un port trunk",
          "Comprendre l'encapsulation 802.1Q"
        ],
        intro: "Un VLAN (Virtual LAN) permet de découper logiquement un même switch physique en plusieurs réseaux locaux indépendants, sans câblage supplémentaire.",
        theorie: [
          { titre: "Pourquoi segmenter", texte: "Séparer les services d'une entreprise (RH, comptabilité, IT, invités) réduit la taille des domaines de broadcast, améliore la sécurité (un VLAN ne voit pas le trafic d'un autre par défaut) et simplifie l'administration des droits réseau." },
          { titre: "Port access", texte: "Un port configuré en mode access appartient à un seul VLAN. C'est le mode utilisé pour brancher un poste de travail ou une imprimante." },
          { titre: "Port trunk et 802.1Q", texte: "Un port trunk transporte le trafic de plusieurs VLAN sur un seul lien physique, généralement entre deux switches ou vers un routeur. Chaque trame est marquée d'un tag 802.1Q indiquant son VLAN d'origine, retiré avant livraison finale au poste destinataire." },
          { titre: "Isolation par défaut", texte: "Deux machines dans des VLAN différents ne peuvent pas communiquer sans un équipement de niveau 3 (routeur ou switch de niveau 3) pour faire l'inter-VLAN routing — le sujet du niveau suivant." }
        ],
        exemple: "Une PME segmente son réseau en VLAN 10 (Administration), VLAN 20 (Comptabilité) et VLAN 50 (Invités Wi-Fi). Même si tous les ports sont sur le même switch physique, un visiteur connecté au VLAN Invités ne peut absolument pas atteindre le serveur de comptabilité du VLAN 20.",
        schema: `
          <div class="diagram-row">
            <div class="diagram-box accent">VLAN 10</div><div class="diagram-box accent">VLAN 20</div><div class="diagram-box accent">VLAN 50</div>
          </div>
          <div class="diagram-row" style="margin-top:10px">
            <div class="diagram-box ghost">Isolés par défaut, un seul switch physique</div>
          </div>`,
        vocabulaire: [
          { terme: "VLAN", def: "Virtual LAN — réseau local virtuel permettant de segmenter logiquement un réseau physique." },
          { terme: "Trunk", def: "Lien transportant plusieurs VLAN simultanément, chaque trame étant marquée par un tag 802.1Q." },
          { terme: "802.1Q", def: "Norme définissant le marquage (tagging) des trames Ethernet pour identifier leur VLAN d'appartenance." }
        ],
        erreurs: ["Relier deux ports access de VLAN différents et s'attendre à ce qu'ils communiquent : sans routage inter-VLAN, c'est impossible par conception."],
        resume: "Les VLAN segmentent logiquement un réseau physique en domaines de broadcast isolés. Les ports access rattachent une machine à un VLAN unique, tandis que les ports trunk (avec tagging 802.1Q) transportent plusieurs VLAN sur un même lien.",
        quiz: [
          { q: "À quoi sert un port trunk ?", options: ["À brancher un PC utilisateur", "À transporter plusieurs VLAN sur un seul lien physique", "À couper l'accès Internet", "À dupliquer une adresse IP"], correct: 1, explanations: ["Faux, c'est le rôle d'un port access.", "Correct.", "Faux.", "Faux."] }
        ],
        plusLoin: ["Le routage inter-VLAN (Niveau 6)", "L'adressage IP par VLAN (Niveau 3, à revoir si besoin)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 6 — ROUTAGE
  // ============================================================
  {
    id: "n6",
    niveau: 6,
    phase: "Réseaux",
    titre: "Routage",
    tag: "RTG",
    resume: "Comment les paquets voyagent entre réseaux différents, et comment un routeur choisit le chemin.",
    lessons: [
      {
        id: "n6-l1",
        titre: "Principes du routage et routes statiques",
        objectifs: [
          "Expliquer le rôle d'un routeur et d'une table de routage",
          "Différencier routage statique et dynamique",
          "Comprendre la notion de route par défaut"
        ],
        intro: "Un switch fait circuler des trames à l'intérieur d'un même réseau ; un routeur fait circuler des paquets ENTRE réseaux différents. C'est lui qui rend Internet possible.",
        theorie: [
          { titre: "Table de routage", texte: "Chaque routeur maintient une table indiquant, pour chaque réseau de destination connu, par quelle interface et vers quel prochain routeur (next-hop) envoyer le paquet. Sans entrée correspondante, un paquet est rejeté." },
          { titre: "Route statique", texte: "Route configurée manuellement par un administrateur. Simple et prévisible, mais qui ne s'adapte pas automatiquement en cas de panne d'un lien — adaptée aux petites infrastructures stables." },
          { titre: "Route par défaut (default route)", texte: "Route \"passe-partout\" (0.0.0.0/0) utilisée quand aucune route plus spécifique ne correspond à la destination. C'est typiquement la route vers Internet." },
          { titre: "Routage inter-VLAN", texte: "Pour permettre à deux VLAN de communiquer, un routeur (ou un switch de niveau 3) doit posséder une interface — ou une sous-interface — dans chacun des VLAN concernés et appliquer les mêmes principes de routage." }
        ],
        exemple: "Le routeur d'une PME possède une route statique vers le réseau du siège social distant (via une liaison dédiée) et une route par défaut vers le fournisseur d'accès Internet pour tout le reste du trafic.",
        schema: `<div class="diagram-row"><div class="diagram-box">Réseau A</div><div class="diagram-arrow">→</div><div class="diagram-box accent">Routeur (table de routage)</div><div class="diagram-arrow">→</div><div class="diagram-box">Réseau B</div></div>`,
        vocabulaire: [
          { terme: "Next-hop", def: "Adresse du routeur suivant vers lequel un paquet doit être envoyé pour atteindre sa destination." },
          { terme: "Route par défaut", def: "Route générique (0.0.0.0/0) utilisée en l'absence de route plus spécifique." }
        ],
        erreurs: ["Configurer une route statique dans un seul sens : sans la route retour équivalente sur l'autre routeur, la communication échoue silencieusement."],
        resume: "Un routeur choisit le chemin d'un paquet grâce à sa table de routage. Les routes statiques sont configurées manuellement, la route par défaut absorbe tout trafic non spécifiquement décrit ailleurs.",
        quiz: [
          { q: "Que se passe-t-il si un paquet ne correspond à aucune route de la table (ni spécifique, ni par défaut) ?", options: ["Il est mis en attente indéfiniment", "Il est rejeté (destination injoignable)", "Il est automatiquement dupliqué sur tous les ports", "Il devient une trame broadcast"], correct: 1, explanations: ["Faux.", "Correct : sans route correspondante, le routeur ne peut pas l'acheminer.", "Faux, ce comportement est propre au switch en cas d'adresse MAC inconnue.", "Faux."] }
        ],
        plusLoin: ["Le routage dynamique et NAT (leçon suivante)", "L'adressage IP (Niveau 3, pour revoir les bases)"]
      },
      {
        id: "n6-l2",
        titre: "Routage dynamique (aperçu) et NAT/PAT",
        objectifs: [
          "Comprendre à quoi sert un protocole de routage dynamique comme OSPF",
          "Expliquer le principe du NAT et du PAT",
          "Différencier NAT statique et PAT (surcharge)"
        ],
        intro: "Au-delà de quelques routes statiques, les grandes infrastructures utilisent des protocoles qui calculent et adaptent automatiquement les routes. Et pour sortir vers Internet, la traduction d'adresses devient indispensable.",
        theorie: [
          { titre: "Routage dynamique (OSPF)", texte: "Les routeurs échangent automatiquement des informations sur les réseaux qu'ils connaissent et recalculent le meilleur chemin en cas de panne, sans intervention manuelle. OSPF (Open Shortest Path First) est l'un des protocoles de routage dynamique les plus utilisés en entreprise." },
          { titre: "NAT (Network Address Translation)", texte: "Mécanisme qui traduit des adresses IP privées (non routables sur Internet) en une adresse IP publique, et inversement. Il permet à un réseau interne entier de partager une poignée d'adresses publiques." },
          { titre: "PAT (Port Address Translation / NAT overload)", texte: "Variante du NAT où de nombreuses machines internes partagent UNE SEULE adresse IP publique, différenciées par leur port source. C'est le mécanisme utilisé par la quasi-totalité des box Internet grand public et des routeurs d'entreprise." },
          { titre: "NAT statique", texte: "Association fixe et permanente entre une IP privée et une IP publique, utilisée typiquement pour exposer un serveur interne (ex. serveur web) de façon prévisible sur Internet." }
        ],
        exemple: "Tous les postes d'une entreprise (adressage privé 192.168.10.0/24) sortent vers Internet via une seule adresse IP publique grâce au PAT configuré sur le routeur périphérique — exactement comme une box internet à la maison.",
        schema: `<div class="diagram-row"><div class="diagram-box">LAN privé 192.168.10.0/24</div><div class="diagram-arrow">NAT/PAT</div><div class="diagram-box accent">1 IP publique</div><div class="diagram-arrow">→</div><div class="diagram-box ghost">Internet</div></div>`,
        vocabulaire: [
          { terme: "OSPF", def: "Open Shortest Path First — protocole de routage dynamique calculant automatiquement le meilleur chemin." },
          { terme: "PAT", def: "Port Address Translation — partage d'une seule IP publique entre plusieurs machines internes, différenciées par le port source." }
        ],
        erreurs: ["Confondre NAT statique (association fixe, pour exposer un serveur) et PAT (partage dynamique d'une IP par de nombreux postes sortants)."],
        resume: "Le routage dynamique (OSPF) automatise le calcul des routes et s'adapte aux pannes. Le NAT et sa variante PAT permettent à un réseau privé de communiquer avec Internet en traduisant les adresses, PAT étant le mécanisme de partage massif d'une IP publique unique.",
        quiz: [
          { q: "Quel mécanisme permet à des centaines de postes internes de sortir sur Internet avec une seule adresse IP publique ?", options: ["Le routage statique", "Le PAT (NAT overload)", "Le VLAN", "Le Spanning Tree"], correct: 1, explanations: ["Faux, sans lien direct.", "Correct : PAT différencie les postes par leur port source tout en partageant une IP unique.", "Faux, le VLAN segmente en interne.", "Faux, STP évite les boucles."] }
        ],
        plusLoin: ["L'administration des serveurs Linux et Windows (Niveaux 7 et 8)", "La virtualisation (Niveau 9)"]
      }
    ]
  },
  // ============================================================
  // NIVEAU 7 — ADMINISTRATION LINUX
  // ============================================================
  {
    id: "n7",
    niveau: 7,
    phase: "Administration",
    titre: "Administration Linux",
    tag: "LNX",
    resume: "Utilisateurs, permissions, processus et services sur un serveur Linux.",
    lessons: [
      {
        id: "n7-l1",
        titre: "Utilisateurs, groupes et permissions Unix",
        objectifs: [
          "Comprendre le modèle de permissions Unix (lecture/écriture/exécution)",
          "Différencier utilisateur, groupe et permissions \"autres\"",
          "Expliquer le rôle de sudo et du compte root"
        ],
        intro: "Un serveur Linux d'entreprise héberge souvent plusieurs services et plusieurs utilisateurs : la gestion rigoureuse des comptes et des droits est la base de sa sécurité.",
        theorie: [
          { titre: "Le compte root", texte: "Compte super-utilisateur disposant de tous les droits sur le système. En production, on évite de s'y connecter directement : on utilise plutôt un compte nominal avec la commande `sudo` pour élever ponctuellement ses privilèges, ce qui laisse une trace claire de qui a fait quoi." },
          { titre: "Permissions rwx", texte: "Chaque fichier ou dossier possède trois permissions (lecture r, écriture w, exécution x) appliquées à trois niveaux : le propriétaire, le groupe propriétaire, et tous les autres utilisateurs. La commande `chmod 750` par exemple donne tous les droits au propriétaire, lecture/exécution au groupe, rien aux autres." },
          { titre: "Groupes", texte: "Un groupe régroupe plusieurs utilisateurs pour leur appliquer collectivement des droits (ex. un groupe \"compta\" avec accès à un dossier partagé), plutôt que de gérer chaque utilisateur individuellement." },
          { titre: "Propriétaire et groupe propriétaire", texte: "Chaque fichier appartient à un utilisateur et à un groupe précis, modifiables avec `chown`. C'est cette double appartenance combinée aux permissions rwx qui détermine qui peut faire quoi." }
        ],
        exemple: "Sur un serveur de fichiers Linux, le dossier /data/compta appartient au groupe \"compta\" avec des droits 770 : seuls les membres de ce groupe peuvent lire et écrire dedans, personne d'autre n'y a accès.",
        schema: `<div class="diagram-row"><div class="diagram-box">Propriétaire (rwx)</div><div class="diagram-box">Groupe (rwx)</div><div class="diagram-box ghost">Autres (rwx)</div></div>`,
        vocabulaire: [
          { terme: "chmod", def: "Commande Linux modifiant les permissions (lecture/écriture/exécution) d'un fichier ou dossier." },
          { terme: "chown", def: "Commande Linux modifiant le propriétaire et/ou le groupe propriétaire d'un fichier." },
          { terme: "sudo", def: "Commande permettant à un utilisateur autorisé d'exécuter une action avec les privilèges du superutilisateur, de façon tracée." }
        ],
        erreurs: ["Donner les droits 777 (accès total à tout le monde) pour \"régler rapidement\" un problème de permission, ce qui ouvre une faille de sécurité durable."],
        resume: "Linux organise les droits autour de trois niveaux (propriétaire, groupe, autres) et trois permissions (lecture, écriture, exécution). sudo permet d'élever ponctuellement ses privilèges de façon tracée, sans se connecter en root en permanence.",
        quiz: [
          { q: "Que signifie une permission de fichier fixée à 770 ?", options: ["Tout le monde a tous les droits", "Le propriétaire et le groupe ont tous les droits, les autres n'ont rien", "Seul le propriétaire a des droits", "Le fichier est en lecture seule pour tous"], correct: 1, explanations: ["Faux, ce serait 777.", "Correct : 7 (rwx) pour le propriétaire, 7 (rwx) pour le groupe, 0 pour les autres.", "Faux, le groupe a aussi tous les droits ici.", "Faux."] }
        ],
        plusLoin: ["Processus et services (leçon suivante)", "Le stockage et LVM (Niveau 13)"]
      },
      {
        id: "n7-l2",
        titre: "Processus, services (systemd) et gestion des paquets",
        objectifs: [
          "Différencier un processus et un service géré par systemd",
          "Comprendre le rôle d'un gestionnaire de paquets",
          "Savoir consulter les journaux système pour diagnostiquer"
        ],
        intro: "Un serveur Linux fait tourner en permanence des dizaines de processus, dont certains sont des services essentiels qu'il faut savoir superviser et dépanner.",
        theorie: [
          { titre: "systemd", texte: "Système d'initialisation moderne de la plupart des distributions Linux. Il démarre, arrête, redémarre et supervise les services (unités systemd), et gère leur démarrage automatique au boot." },
          { titre: "Gestionnaires de paquets", texte: "Outils comme apt (Debian/Ubuntu), yum/dnf (RedHat/CentOS) ou pacman (Arch) permettent d'installer, mettre à jour et désinstaller des logiciels de façon fiable, en gérant automatiquement les dépendances." },
          { titre: "Journaux système (logs)", texte: "Chaque service consigne son activité et ses erreurs dans des journaux consultables (via journalctl sous systemd, ou des fichiers dans /var/log). C'est la première ressource à consulter face à un service qui refuse de démarrer." },
          { titre: "Cron", texte: "Planificateur de tâches permettant d'exécuter automatiquement une commande à intervalle régulier (ex. une sauvegarde nocturne), selon une syntaxe précise (minute, heure, jour, mois, jour de la semaine)." }
        ],
        exemple: "Un administrateur installe un serveur web avec le gestionnaire de paquets, l'active pour qu'il démarre automatiquement au boot, puis, face à un souci d'accès, consulte directement les journaux du service pour identifier la cause exacte.",
        schema: `<div class="diagram-row"><div class="diagram-box">Paquet installé</div><div class="diagram-arrow">→</div><div class="diagram-box accent">Service (systemd)</div><div class="diagram-arrow">→</div><div class="diagram-box ghost">Journaux (logs)</div></div>`,
        vocabulaire: [
          { terme: "systemd", def: "Système d'initialisation et de supervision des services sur la plupart des distributions Linux modernes." },
          { terme: "Cron", def: "Planificateur permettant d'exécuter automatiquement des tâches à intervalle régulier." }
        ],
        erreurs: ["Redémarrer un service en boucle sans consulter ses journaux : cela masque temporairement le symptôme sans jamais traiter la cause réelle."],
        resume: "systemd gère le cycle de vie des services Linux (démarrage, arrêt, démarrage automatique). Les gestionnaires de paquets installent et mettent à jour les logiciels avec leurs dépendances, et les journaux systèmes sont la première ressource de diagnostic face à une panne de service.",
        quiz: [
          { q: "Quel est le rôle principal de systemd ?", options: ["Gérer les adresses IP", "Démarrer, arrêter et superviser les services du système", "Chiffrer les communications réseau", "Sauvegarder automatiquement les fichiers"], correct: 1, explanations: ["Faux.", "Correct.", "Faux.", "Faux, ce n'est pas son rôle direct, même si des services de sauvegarde peuvent être gérés par lui."] }
        ],
        plusLoin: ["Windows Server et Active Directory (Niveau 8)", "La virtualisation (Niveau 9)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 8 — WINDOWS SERVER ET ACTIVE DIRECTORY
  // ============================================================
  {
    id: "n8",
    niveau: 8,
    phase: "Administration",
    titre: "Windows Server et Active Directory",
    tag: "WIN",
    resume: "L'administration centralisée des postes et utilisateurs dans un environnement Windows d'entreprise.",
    lessons: [
      {
        id: "n8-l1",
        titre: "Windows Server : rôles, fonctionnalités et administration",
        objectifs: [
          "Comprendre la notion de rôle et de fonctionnalité sous Windows Server",
          "Différencier administration en GUI et en PowerShell",
          "Connaître les briques de base : services de fichiers, RDP, stratégies locales"
        ],
        intro: "Windows Server est le système d'exploitation serveur de Microsoft, conçu pour héberger des rôles (DNS, DHCP, AD, fichiers...) au service d'un réseau d'entreprise.",
        theorie: [
          { titre: "Rôles et fonctionnalités", texte: "Un rôle représente une fonction majeure du serveur (ex. Services de domaine Active Directory, Serveur DNS, Serveur DHCP, Services de fichiers). Une fonctionnalité est un complément plus ponctuel (ex. un outil d'administration). Le Gestionnaire de serveur centralise leur installation." },
          { titre: "Bureau à distance (RDP)", texte: "Protocole permettant d'administrer graphiquement un serveur Windows à distance, comme si on était physiquement devant. Indispensable dès que le serveur n'a plus d'écran directement accessible." },
          { titre: "PowerShell", texte: "Interpréteur de commandes et langage de script orienté objets, permettant d'automatiser des tâches d'administration répétitives (création d'utilisateurs, gestion de services...) bien plus rapidement qu'en interface graphique." },
          { titre: "Services de fichiers et permissions NTFS", texte: "Windows Server permet de partager des dossiers sur le réseau (partages SMB) avec des permissions NTFS précises par utilisateur ou groupe, appliquées en complément des permissions de partage elles-mêmes." }
        ],
        exemple: "Un administrateur installe le rôle \"Services de fichiers\" sur un serveur, crée un partage pour le service comptabilité, puis script en PowerShell la création automatique de dizaines de comptes utilisateurs pour la rentrée.",
        schema: `<div class="diagram-row"><div class="diagram-box accent">Windows Server</div><div class="diagram-arrow">rôles</div><div class="diagram-box">DNS / DHCP / AD / Fichiers</div></div>`,
        vocabulaire: [
          { terme: "RDP", def: "Remote Desktop Protocol — protocole d'administration graphique à distance d'un serveur ou poste Windows." },
          { terme: "PowerShell", def: "Interpréteur de commandes et langage de script Windows orienté objets, utilisé pour l'automatisation." },
          { terme: "NTFS", def: "Système de fichiers Windows gérant notamment des permissions fines par utilisateur et par groupe." }
        ],
        erreurs: ["Confondre les permissions de partage (accès réseau) et les permissions NTFS (accès au système de fichiers) : le droit réellement appliqué est toujours le plus restrictif des deux."],
        resume: "Windows Server s'administre via des rôles installables (DNS, DHCP, AD, fichiers...), en graphique via RDP ou en scripté via PowerShell. Les permissions NTFS, combinées aux permissions de partage, contrôlent finement l'accès aux données.",
        quiz: [
          { q: "Pourquoi utiliser PowerShell plutôt que l'interface graphique pour créer 50 comptes utilisateurs ?", options: ["PowerShell est le seul moyen possible", "Un script permet d'automatiser et de répéter l'opération sans erreur de saisie", "L'interface graphique est plus rapide", "PowerShell ne fonctionne que sur les postes clients"], correct: 1, explanations: ["Faux, la GUI le permet aussi mais un par un.", "Correct : c'est l'intérêt principal du scripting pour les tâches répétitives.", "Faux dans ce cas précis.", "Faux, PowerShell fonctionne aussi bien sur serveur."] }
        ],
        plusLoin: ["Active Directory en détail (leçon suivante)", "La virtualisation (Niveau 9)"]
      },
      {
        id: "n8-l2",
        titre: "Active Directory : annuaire, domaine et stratégies de groupe",
        objectifs: [
          "Expliquer le rôle d'un annuaire Active Directory et d'un contrôleur de domaine",
          "Comprendre les unités d'organisation (OU) et les GPO",
          "Différencier authentification locale et authentification de domaine"
        ],
        intro: "Active Directory est le service d'annuaire central de la plupart des réseaux d'entreprise sous Windows : il centralise comptes, groupes, ordinateurs et règles de sécurité.",
        theorie: [
          { titre: "Contrôleur de domaine (DC)", texte: "Serveur hébergeant la base Active Directory pour un domaine donné (ex. entreprise.local). C'est lui qui authentifie les utilisateurs et applique les règles centralisées à tous les postes joints au domaine." },
          { titre: "Unités d'organisation (OU)", texte: "Conteneurs permettant de structurer l'annuaire de façon logique, généralement par service ou site géographique (ex. OU=RH, OU=IT), afin d'appliquer des règles différenciées à chaque groupe d'utilisateurs ou d'ordinateurs." },
          { titre: "Group Policy Objects (GPO)", texte: "Stratégies de groupe permettant d'imposer automatiquement des configurations (politique de mot de passe, restrictions, déploiement de lecteurs réseau...) à un ensemble d'utilisateurs ou d'ordinateurs, sans intervention manuelle poste par poste." },
          { titre: "Kerberos et authentification de domaine", texte: "Active Directory utilise le protocole Kerberos pour authentifier les utilisateurs par ticket, de façon sécurisée, une fois connectés au domaine — plus robuste qu'une authentification purement locale poste par poste." }
        ],
        exemple: "Une entreprise structure son annuaire avec une OU par service, applique une GPO de politique de mot de passe à tout le domaine, et une GPO plus restrictive limitant l'accès au panneau de configuration uniquement pour l'OU des postes utilisateurs standards.",
        schema: `
          <div class="diagram-row">
            <div class="diagram-box accent">Domaine entreprise.local</div>
          </div>
          <div class="diagram-row" style="margin-top:10px">
            <div class="diagram-box">OU=RH</div><div class="diagram-box">OU=IT</div><div class="diagram-box">OU=Direction</div>
          </div>`,
        vocabulaire: [
          { terme: "Active Directory", def: "Service d'annuaire Microsoft centralisant utilisateurs, groupes et ressources d'un réseau Windows." },
          { terme: "OU", def: "Organizational Unit — conteneur structurant logiquement l'annuaire, permettant d'y appliquer des règles ciblées." },
          { terme: "GPO", def: "Group Policy Object — stratégie de groupe imposant automatiquement une configuration à un ensemble d'objets AD." }
        ],
        erreurs: ["Appliquer une GPO restrictive directement au domaine entier alors qu'elle ne devrait concerner qu'un seul service, impactant par erreur toute l'entreprise."],
        resume: "Active Directory centralise l'authentification et la gestion des comptes via un contrôleur de domaine. Les OU structurent logiquement l'annuaire et les GPO permettent d'appliquer automatiquement des règles de sécurité et de configuration à grande échelle.",
        quiz: [
          { q: "À quoi sert une GPO ?", options: ["À créer une adresse IP statique", "À imposer automatiquement une configuration à un ensemble d'utilisateurs ou d'ordinateurs", "À chiffrer un disque dur", "À installer un rôle Windows Server"], correct: 1, explanations: ["Faux.", "Correct.", "Faux, ce serait BitLocker par exemple.", "Faux, cela passe par le Gestionnaire de serveur."] }
        ],
        plusLoin: ["La virtualisation (Niveau 9)", "Le VPN et l'accès distant (Niveau 12)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 9 — VIRTUALISATION
  // ============================================================
  {
    id: "n9",
    niveau: 9,
    phase: "Administration",
    titre: "Virtualisation",
    tag: "VIRT",
    resume: "Faire tourner plusieurs machines virtuelles sur un seul serveur physique.",
    lessons: [
      {
        id: "n9-l1",
        titre: "Hyperviseurs, machines virtuelles et réseaux virtuels",
        objectifs: [
          "Différencier hyperviseur de type 1 et de type 2",
          "Comprendre l'intérêt de la virtualisation en entreprise",
          "Connaître les concepts de snapshot et de clone"
        ],
        intro: "La virtualisation permet de faire tourner plusieurs systèmes d'exploitation indépendants sur un même serveur physique, en partageant intelligemment ses ressources.",
        theorie: [
          { titre: "Hyperviseur type 1 (bare-metal)", texte: "S'installe directement sur le matériel, sans système d'exploitation hôte intermédiaire (ex. VMware ESXi, Proxmox, Hyper-V en mode serveur). Utilisé en production pour ses meilleures performances et sa stabilité." },
          { titre: "Hyperviseur type 2 (hébergé)", texte: "S'installe comme une application au-dessus d'un système d'exploitation existant (ex. VirtualBox, VMware Workstation). Pratique pour un usage de test ou de laboratoire sur un poste personnel." },
          { titre: "Pourquoi virtualiser en entreprise", texte: "Mutualisation des ressources matérielles (un seul serveur physique héberge plusieurs services isolés), économies d'énergie et d'espace, et surtout flexibilité : créer, dupliquer ou déplacer une VM prend quelques minutes contre plusieurs jours pour un serveur physique." },
          { titre: "Snapshot et clone", texte: "Un snapshot capture l'état exact d'une VM à un instant donné, permettant d'y revenir en cas de problème après une manipulation risquée. Un clone crée une copie indépendante complète d'une VM existante, sans avoir à tout réinstaller." },
          { titre: "Réseaux virtuels (NAT, Bridge, Host-only)", texte: "Une VM peut être reliée au réseau de différentes façons : NAT (accès Internet via l'hôte, invisible depuis l'extérieur), Bridge/Pont (la VM apparaît comme une machine à part entière sur le réseau physique), ou Host-only/Interne (réseau isolé entre VM et hôte uniquement)." }
        ],
        exemple: "Une entreprise remplace 6 anciens serveurs physiques sous-utilisés par un unique serveur puissant équipé d'un hyperviseur de type 1, hébergeant 6 machines virtuelles indépendantes, réduisant coûts matériels et consommation électrique.",
        schema: `
          <div class="diagram-row">
            <div class="diagram-box ghost">VM 1</div><div class="diagram-box ghost">VM 2</div><div class="diagram-box ghost">VM 3</div>
          </div>
          <div class="diagram-arrow down">↓</div>
          <div class="diagram-row"><div class="diagram-box accent">Hyperviseur</div></div>
          <div class="diagram-arrow down">↓</div>
          <div class="diagram-row"><div class="diagram-box">Serveur physique</div></div>`,
        vocabulaire: [
          { terme: "Hypervisor", def: "Logiciel permettant de créer et gérer des machines virtuelles." },
          { terme: "VM", def: "Machine virtuelle — ordinateur simulé par logiciel au sein d'un hôte physique." },
          { terme: "Snapshot", def: "Capture de l'état complet d'une VM à un instant donné, permettant d'y revenir ultérieurement." }
        ],
        erreurs: ["Confondre snapshot (retour arrière rapide, temporaire par nature) et sauvegarde complète (protection long terme) : un snapshot n'est pas une stratégie de sauvegarde en soi."],
        resume: "Les hyperviseurs de type 1 (production) et de type 2 (poste personnel) permettent de mutualiser un serveur physique entre plusieurs VM isolées. Snapshots et clones apportent flexibilité et sécurité pour les manipulations, tandis que les réseaux virtuels (NAT/Bridge/Host-only) définissent comment chaque VM communique.",
        quiz: [
          { q: "Quelle est la différence principale entre un hyperviseur de type 1 et de type 2 ?", options: ["Le type 1 s'installe directement sur le matériel, le type 2 au-dessus d'un OS existant", "Le type 2 est toujours plus rapide", "Le type 1 ne fonctionne que sur Mac", "Il n'y a aucune différence"], correct: 0, explanations: ["Correct.", "Faux, c'est l'inverse en général.", "Faux.", "Faux."] }
        ],
        plusLoin: ["Le stockage (Niveau 13)", "Le cloud computing (Niveau 17)"]
      }
    ]
  },
  // ============================================================
  // NIVEAU 10 — DNS
  // ============================================================
  {
    id: "n10",
    niveau: 10,
    phase: "Administration",
    titre: "DNS",
    tag: "DNS",
    resume: "L'annuaire téléphonique d'Internet : traduire les noms de domaine en adresses IP.",
    lessons: [
      {
        id: "n10-l1",
        titre: "Fonctionnement du DNS et types d'enregistrements",
        objectifs: [
          "Expliquer le rôle du DNS avec une analogie simple",
          "Décrire le processus de résolution d'un nom de domaine",
          "Connaître les principaux types d'enregistrements DNS"
        ],
        intro: "DNS est comme l'annuaire téléphonique d'Internet : il permet de retrouver l'adresse IP correspondant à un nom de domaine, pour que l'utilisateur n'ait jamais besoin de mémoriser des suites de chiffres.",
        theorie: [
          { titre: "Pourquoi le DNS existe", texte: "Les machines communiquent par adresses IP, mais les humains retiennent mieux des noms (exemple.com) que des adresses (203.0.113.10). Le DNS (Domain Name System) fait le lien entre les deux." },
          { titre: "Resolver et serveur autoritaire", texte: "Le resolver est le serveur DNS interrogé en premier par le client (souvent celui du fournisseur d'accès ou de l'entreprise). S'il ne connaît pas la réponse, il interroge en cascade d'autres serveurs jusqu'au serveur autoritaire, celui qui détient officiellement la réponse pour ce domaine." },
          { titre: "Requête récursive", texte: "Lorsqu'un client demande une résolution complète à son resolver et attend une réponse finale (adresse IP), sans avoir à interroger lui-même d'autres serveurs : c'est le resolver qui fait tout le travail de proche en proche." },
          { titre: "Zone DNS", texte: "Une zone est la portion de l'espace de noms de domaine gérée par un serveur DNS particulier (ex : la zone \"entreprise.local\")." },
          { titre: "Forward lookup / Reverse lookup", texte: "Le forward lookup traduit un nom en adresse IP (le cas le plus courant). Le reverse lookup fait l'inverse : à partir d'une adresse IP, retrouver le nom de domaine associé — utile notamment pour les serveurs de messagerie." }
        ],
        exemple: "Quand un utilisateur tape \"intranet.entreprise.com\" dans son navigateur, son poste interroge le serveur DNS interne de l'entreprise, qui répond avec l'adresse IP du serveur intranet, permettant au navigateur de s'y connecter.",
        schema: `
          <div class="diagram-row">
            <div class="diagram-box">Client</div><div class="diagram-arrow">→ demande</div>
            <div class="diagram-box accent">Serveur DNS</div><div class="diagram-arrow">→ répond IP</div>
            <div class="diagram-box">Serveur web demandé</div>
          </div>`,
        vocabulaire: [
          { terme: "DNS", def: "Domain Name System — système traduisant les noms de domaine en adresses IP." },
          { terme: "Resolver", def: "Serveur DNS chargé de résoudre une requête pour le compte d'un client." },
          { terme: "Zone", def: "Portion de l'espace de noms gérée par un serveur DNS donné." }
        ],
        erreurs: ["Croire que le DNS \"héberge\" les sites web : il ne fait que traduire un nom en adresse, il n'héberge aucun contenu."],
        resume: "Le DNS traduit les noms de domaine en adresses IP grâce à des serveurs organisés en resolvers et serveurs autoritaires, interrogés en cascade jusqu'à obtenir la réponse officielle pour un domaine.",
        quiz: [
          { q: "Quel est le rôle principal du DNS ?", options: ["Attribuer automatiquement une adresse IP", "Traduire les noms de domaine en adresses IP", "Chiffrer les communications", "Filtrer le trafic réseau"], correct: 1, explanations: ["Faux, c'est le rôle du DHCP.", "Correct : c'est exactement la fonction du DNS.", "Faux, ce n'est pas le rôle du DNS (voir TLS).", "Faux, c'est le rôle d'un pare-feu."] }
        ],
        plusLoin: ["Les types d'enregistrements DNS en détail", "DHCP (Niveau 11)"]
      },
      {
        id: "n10-l2",
        titre: "Les types d'enregistrements DNS (A, AAAA, CNAME, MX...)",
        objectifs: ["Connaître le rôle de chaque type d'enregistrement DNS courant"],
        intro: "Une zone DNS ne contient pas qu'une seule information : elle regroupe plusieurs types d'enregistrements, chacun avec un rôle précis.",
        theorie: [
          { titre: "A / AAAA", texte: "L'enregistrement A associe un nom à une adresse IPv4. L'enregistrement AAAA fait la même chose pour une adresse IPv6." },
          { titre: "CNAME", texte: "Alias : fait pointer un nom de domaine vers un autre nom de domaine plutôt que directement vers une IP (ex : www.entreprise.com → entreprise.com)." },
          { titre: "MX", texte: "Indique quel serveur est responsable de la réception des emails pour un domaine (Mail Exchange)." },
          { titre: "NS", texte: "Indique quels serveurs DNS font autorité pour un domaine donné." },
          { titre: "PTR", texte: "Utilisé pour la résolution inverse : associe une adresse IP à un nom de domaine." },
          { titre: "TXT", texte: "Enregistrement libre, souvent utilisé pour la vérification de domaine ou la sécurité des emails (SPF, DKIM)." },
          { titre: "SRV", texte: "Indique l'emplacement (hôte + port) d'un service spécifique, par exemple utilisé par Active Directory pour localiser ses contrôleurs de domaine." }
        ],
        exemple: "Le domaine d'une entreprise a un enregistrement A pointant vers son site web, un enregistrement MX pointant vers son serveur de messagerie, et un enregistrement TXT contenant sa politique SPF anti-spam.",
        schema: `
          <table class="proto-table">
            <thead><tr><th>Type</th><th>Rôle</th></tr></thead>
            <tbody>
              <tr><td>A</td><td>Nom → IPv4</td></tr>
              <tr><td>AAAA</td><td>Nom → IPv6</td></tr>
              <tr><td>CNAME</td><td>Nom → autre nom (alias)</td></tr>
              <tr><td>MX</td><td>Nom → serveur de messagerie</td></tr>
              <tr><td>NS</td><td>Nom → serveur DNS autoritaire</td></tr>
              <tr><td>PTR</td><td>IP → nom (résolution inverse)</td></tr>
            </tbody>
          </table>`,
        vocabulaire: [
          { terme: "MX", def: "Enregistrement DNS indiquant le serveur de messagerie d'un domaine." },
          { terme: "CNAME", def: "Enregistrement DNS créant un alias vers un autre nom de domaine." }
        ],
        erreurs: ["Confondre CNAME (alias vers un nom) et A (association directe vers une IP)."],
        resume: "Une zone DNS combine plusieurs types d'enregistrements : A/AAAA pour les adresses, CNAME pour les alias, MX pour le courrier, NS pour l'autorité, PTR pour la résolution inverse, TXT et SRV pour des usages spécifiques.",
        quiz: [
          { q: "Quel enregistrement DNS indique le serveur de messagerie d'un domaine ?", options: ["A", "MX", "CNAME", "PTR"], correct: 1, explanations: ["Faux, A associe un nom à une IPv4.", "Correct : MX (Mail Exchange) désigne le serveur de messagerie.", "Faux, CNAME crée un alias.", "Faux, PTR sert à la résolution inverse."] }
        ],
        plusLoin: ["DHCP et le processus DORA (Niveau 11)", "Active Directory et son intégration DNS (Niveau 9)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 11 — DHCP
  // ============================================================
  {
    id: "n11",
    niveau: 11,
    phase: "Administration",
    titre: "DHCP",
    tag: "DHCP",
    resume: "L'attribution automatique des adresses IP sur un réseau.",
    lessons: [
      {
        id: "n11-l1",
        titre: "DHCP et le processus DORA",
        objectifs: [
          "Expliquer le rôle du DHCP",
          "Décrire les 4 étapes du processus DORA",
          "Comprendre les notions de scope, bail et réservation"
        ],
        intro: "Configurer manuellement l'adresse IP de chaque poste d'une entreprise serait long et source d'erreurs. Le DHCP automatise cette tâche.",
        theorie: [
          { titre: "DHCP (Dynamic Host Configuration Protocol)", texte: "Protocole qui attribue automatiquement une adresse IP, un masque, une passerelle et des serveurs DNS à chaque machine qui rejoint le réseau, sans intervention manuelle." },
          { titre: "Scope (étendue)", texte: "Plage d'adresses IP que le serveur DHCP est autorisé à distribuer (ex : de 192.168.1.100 à 192.168.1.200)." },
          { titre: "Bail (lease)", texte: "Une adresse IP n'est pas attribuée définitivement : elle est prêtée pour une durée limitée (le bail). À l'expiration, la machine doit la renouveler ou en recevoir une nouvelle." },
          { titre: "Réservation", texte: "Permet d'associer une adresse MAC à une adresse IP fixe au sein de la plage DHCP, pour qu'une machine reçoive toujours la même IP (utile pour les imprimantes ou serveurs)." },
          { titre: "Processus DORA", texte: "Discover : le client diffuse une demande d'adresse IP. Offer : un serveur DHCP propose une adresse. Request : le client confirme qu'il accepte cette offre. Acknowledgment : le serveur confirme et enregistre l'attribution." }
        ],
        exemple: "Un employé branche son ordinateur portable sur le réseau de l'entreprise. En quelques secondes, le processus DORA lui attribue automatiquement une adresse IP valide, sans qu'il ait à saisir la moindre information réseau.",
        schema: `
          <div class="dora-flow">
            <div class="dora-step"><b>D</b>iscover<span>Client → tous les serveurs DHCP</span></div>
            <div class="dora-step"><b>O</b>ffer<span>Serveur → Client</span></div>
            <div class="dora-step"><b>R</b>equest<span>Client → Serveur choisi</span></div>
            <div class="dora-step"><b>A</b>cknowledgment<span>Serveur → Client</span></div>
          </div>`,
        vocabulaire: [
          { terme: "DHCP", def: "Protocole d'attribution automatique de la configuration IP." },
          { terme: "Scope", def: "Plage d'adresses IP disponibles à la distribution par un serveur DHCP." },
          { terme: "Bail (lease)", def: "Durée pendant laquelle une adresse IP attribuée reste valide." },
          { terme: "DORA", def: "Discover, Offer, Request, Acknowledgment — les 4 étapes de l'attribution DHCP." }
        ],
        erreurs: ["Confondre DHCP (qui attribue l'IP) et DNS (qui traduit les noms) : ce sont deux services complémentaires mais distincts.", "Croire qu'une IP obtenue par DHCP est permanente : elle est prêtée pour la durée du bail."],
        resume: "Le DHCP automatise l'attribution des adresses IP via le processus DORA (Discover, Offer, Request, Acknowledgment). Un scope définit la plage distribuée, un bail sa durée, et une réservation permet de fixer une IP pour une machine précise.",
        quiz: [
          { q: "Que signifie la lettre \"O\" dans le processus DORA ?", options: ["Open", "Offer", "Operation", "Origin"], correct: 1, explanations: ["Faux.", "Correct : le serveur DHCP propose (Offer) une adresse IP au client.", "Faux.", "Faux."] },
          { q: "À quoi sert une réservation DHCP ?", options: ["À bloquer un utilisateur du réseau", "À attribuer toujours la même IP à une machine précise", "À augmenter la vitesse du réseau", "À chiffrer les échanges DHCP"], correct: 1, explanations: ["Faux, ce n'est pas son rôle.", "Correct : une réservation lie une adresse MAC à une IP fixe dans la plage DHCP.", "Faux.", "Faux."] }
        ],
        plusLoin: ["Les serveurs d'entreprise et leurs rôles (Niveau 12)", "Active Directory (Niveau 9)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 12 — VPN ET ACCÈS DISTANT
  // ============================================================
  {
    id: "n12",
    niveau: 12,
    phase: "Administration",
    titre: "VPN et accès distant",
    tag: "VPN",
    resume: "Permettre un accès distant sécurisé au réseau de l'entreprise.",
    lessons: [
      {
        id: "n12-l1",
        titre: "Le VPN : tunnel chiffré et accès distant sécurisé",
        objectifs: [
          "Expliquer le principe d'un tunnel VPN",
          "Différencier VPN site-à-site et VPN accès distant (client-to-site)",
          "Connaître les grands protocoles VPN"
        ],
        intro: "Avec le télétravail et les sites distants, permettre un accès sécurisé au réseau interne de l'entreprise depuis l'extérieur est devenu une nécessité quotidienne.",
        theorie: [
          { titre: "Principe du tunnel VPN", texte: "Un VPN (Virtual Private Network) crée un tunnel chiffré entre deux points à travers un réseau non sécurisé (typiquement Internet), comme s'ils étaient directement connectés sur le même réseau local, tout en protégeant la confidentialité et l'intégrité des données échangées." },
          { titre: "VPN accès distant (client-to-site)", texte: "Un utilisateur individuel (télétravailleur, technicien en déplacement) se connecte depuis son poste vers le réseau de l'entreprise via un logiciel client VPN. C'est le cas le plus courant pour le télétravail." },
          { titre: "VPN site-à-site", texte: "Relie en permanence deux réseaux distants (ex. deux agences d'une même entreprise) comme s'ils ne formaient qu'un seul réseau, sans intervention utilisateur — la connexion est établie entre les équipements réseau eux-mêmes." },
          { titre: "Protocoles VPN courants", texte: "OpenVPN (open-source, très répandu, basé sur SSL/TLS), IPSec (souvent utilisé pour les VPN site-à-site entre équipements réseau), et WireGuard (plus récent, réputé pour sa simplicité et ses performances)." },
          { titre: "Authentification VPN", texte: "L'accès VPN peut être sécurisé par mot de passe, certificat numérique, ou une combinaison des deux (voire une authentification multifacteur), afin de s'assurer que seule une personne autorisée peut établir la connexion." }
        ],
        exemple: "Un commercial en déplacement active son client VPN sur son ordinateur portable pour accéder en toute sécurité au serveur de fichiers de l'entreprise, exactement comme s'il était physiquement au bureau.",
        schema: `<div class="diagram-row"><div class="diagram-box">Utilisateur distant</div><div class="diagram-arrow">tunnel chiffré</div><div class="diagram-box accent">Firewall / Serveur VPN</div><div class="diagram-arrow">→</div><div class="diagram-box ghost">Réseau entreprise</div></div>`,
        vocabulaire: [
          { terme: "VPN", def: "Virtual Private Network — tunnel chiffré pour un accès distant sécurisé." },
          { terme: "IPSec", def: "Suite de protocoles sécurisant les communications IP, souvent utilisée pour les VPN site-à-site." },
          { terme: "OpenVPN", def: "Solution VPN open-source basée sur SSL/TLS, largement utilisée pour l'accès distant." }
        ],
        erreurs: ["Exposer directement des services internes sur Internet sans VPN \"pour simplifier\" l'accès distant, ce qui élargit considérablement la surface d'attaque de l'entreprise."],
        resume: "Un VPN chiffre les échanges entre un point distant et le réseau de l'entreprise. Le VPN accès distant (client-to-site) sert aux utilisateurs individuels, le VPN site-à-site relie en permanence deux réseaux distants. OpenVPN, IPSec et WireGuard sont les protocoles les plus répandus.",
        quiz: [
          { q: "Quel type de VPN utiliserait-on pour relier en permanence deux agences d'une même entreprise ?", options: ["VPN accès distant (client-to-site)", "VPN site-à-site", "Aucun VPN n'est nécessaire", "Un simple partage de fichiers"], correct: 1, explanations: ["Faux, adapté à un utilisateur individuel.", "Correct.", "Faux, un VPN reste recommandé pour sécuriser cette liaison inter-sites.", "Faux."] }
        ],
        plusLoin: ["Le stockage (Niveau 13)", "La sécurité réseau (Niveau 15)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 13 — STOCKAGE
  // ============================================================
  {
    id: "n13",
    niveau: 13,
    phase: "Administration",
    titre: "Stockage",
    tag: "STO",
    resume: "RAID, LVM, NAS et SAN : organiser et protéger les données d'entreprise.",
    lessons: [
      {
        id: "n13-l1",
        titre: "RAID, LVM, NAS et SAN",
        objectifs: [
          "Différencier les principaux niveaux de RAID et leur usage",
          "Comprendre l'intérêt de LVM pour la flexibilité du stockage",
          "Différencier NAS et SAN"
        ],
        intro: "Les données d'entreprise doivent être à la fois performantes à accéder et résistantes à la panne d'un disque. Plusieurs technologies de stockage répondent à ces besoins.",
        theorie: [
          { titre: "RAID 0 (striping)", texte: "Répartit les données sur plusieurs disques pour améliorer les performances, mais sans aucune tolérance de panne : la perte d'un seul disque entraîne la perte de toutes les données. Réservé à des usages où la performance prime sur la sécurité." },
          { titre: "RAID 1 (mirroring)", texte: "Duplique intégralement les données sur deux disques. Si l'un tombe en panne, l'autre continue de fonctionner sans interruption. Simple et fiable, mais divise par deux la capacité utile." },
          { titre: "RAID 5 et RAID 6", texte: "Répartissent les données ET des informations de parité sur plusieurs disques (3 minimum pour RAID 5), permettant de reconstruire les données en cas de panne d'un disque (RAID 5) ou de deux disques (RAID 6), avec un bon compromis capacité/tolérance de panne." },
          { titre: "LVM (Logical Volume Manager)", texte: "Couche d'abstraction sous Linux qui permet de regrouper des disques physiques en volumes logiques extensibles à chaud, sans interruption de service — bien plus flexible qu'un partitionnement classique figé." },
          { titre: "NAS vs SAN", texte: "Un NAS (Network Attached Storage) est un espace de stockage accessible via le réseau au niveau fichier (comme un partage réseau classique, ex. via SMB/NFS). Un SAN (Storage Area Network) est un réseau dédié à haute performance donnant accès au stockage au niveau bloc, comme s'il s'agissait d'un disque local — typiquement utilisé pour héberger les VM ou les bases de données critiques." }
        ],
        exemple: "Un serveur de base de données critique utilise du RAID 6 pour tolérer la panne de deux disques simultanément, tandis qu'un simple serveur de fichiers pour les documents bureautiques se contente d'un RAID 1, suffisant pour ce niveau de criticité.",
        schema: `<div class="diagram-row"><div class="diagram-box">Disque 1</div><div class="diagram-box">Disque 2</div><div class="diagram-box accent">RAID (contrôleur)</div><div class="diagram-arrow">→</div><div class="diagram-box ghost">Volume unique tolérant aux pannes</div></div>`,
        vocabulaire: [
          { terme: "RAID", def: "Technologie combinant plusieurs disques pour la performance et/ou la tolérance de panne." },
          { terme: "NAS", def: "Network Attached Storage — serveur de stockage accessible via le réseau au niveau fichier." },
          { terme: "SAN", def: "Storage Area Network — réseau dédié au stockage à haute performance, au niveau bloc." },
          { terme: "LVM", def: "Logical Volume Manager — gestion flexible de volumes logiques extensibles à chaud sous Linux." }
        ],
        erreurs: ["Croire que le RAID remplace une sauvegarde : le RAID protège contre la panne matérielle d'un disque, pas contre une suppression accidentelle, un ransomware ou un incendie du datacenter."],
        resume: "Les différents niveaux de RAID (0, 1, 5, 6) offrent des compromis entre performance et tolérance de panne. LVM apporte de la flexibilité pour redimensionner le stockage sans interruption. NAS et SAN diffèrent par leur niveau d'accès (fichier vs bloc) et leur usage typique.",
        quiz: [
          { q: "Pourquoi le RAID ne remplace-t-il jamais une sauvegarde ?", options: ["Le RAID est trop lent", "Le RAID protège seulement contre la panne matérielle d'un disque, pas contre une suppression accidentelle ou un sinistre", "Le RAID coûte plus cher qu'une sauvegarde", "Il n'y a aucune différence entre RAID et sauvegarde"], correct: 1, explanations: ["Faux, sans rapport.", "Correct.", "Faux, sans rapport direct avec la question.", "Faux, ce sont deux protections très différentes et complémentaires."] }
        ],
        plusLoin: ["La sauvegarde et le plan de reprise d'activité (Niveau 14)", "La virtualisation (Niveau 9, pour revoir le lien avec le SAN)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 14 — SAUVEGARDE ET PLAN DE REPRISE D'ACTIVITÉ
  // ============================================================
  {
    id: "n14",
    niveau: 14,
    phase: "Administration",
    titre: "Sauvegarde et PRA",
    tag: "BCK",
    resume: "Protéger les données de l'entreprise et se préparer à un sinistre majeur.",
    lessons: [
      {
        id: "n14-l1",
        titre: "Stratégies de sauvegarde et plan de reprise d'activité",
        objectifs: [
          "Différencier sauvegarde complète, incrémentale et différentielle",
          "Comprendre les notions de RPO et RTO",
          "Connaître la règle 3-2-1 de sauvegarde"
        ],
        intro: "Une infrastructure, aussi bien conçue soit-elle, finira un jour par subir un incident : panne matérielle, erreur humaine ou cyberattaque. Seule une stratégie de sauvegarde solide permet de s'en relever.",
        theorie: [
          { titre: "Sauvegarde complète", texte: "Copie intégrale de toutes les données à chaque exécution. Simple à restaurer (un seul jeu de sauvegarde suffit) mais coûteuse en temps et en espace de stockage si répétée trop souvent." },
          { titre: "Sauvegarde incrémentale", texte: "Ne sauvegarde que les données modifiées depuis la DERNIÈRE sauvegarde (complète ou incrémentale précédente). Très économe en espace, mais la restauration nécessite de rejouer toute la chaîne de sauvegardes dans l'ordre." },
          { titre: "Sauvegarde différentielle", texte: "Sauvegarde les données modifiées depuis la dernière sauvegarde COMPLÈTE (pas depuis la dernière différentielle). Restauration plus simple qu'en incrémental (seulement 2 jeux nécessaires : la complète + la dernière différentielle), mais plus volumineuse au fil des jours." },
          { titre: "RPO et RTO", texte: "Le RPO (Recovery Point Objective) définit la quantité de données qu'on accepte de perdre, mesurée en temps (ex. \"1 heure de données perdues au maximum\"). Le RTO (Recovery Time Objective) définit le délai maximal acceptable pour restaurer le service après un incident. Ces deux indicateurs guident le choix de la stratégie de sauvegarde." },
          { titre: "Règle 3-2-1", texte: "Bonne pratique largement adoptée : conserver au moins 3 copies des données, sur 2 supports de types différents, dont 1 copie hors site (pour survivre à un sinistre physique comme un incendie ou un vol touchant le site principal)." }
        ],
        exemple: "Une PME applique la règle 3-2-1 : une copie sur le serveur de production, une copie sur un NAS local, et une copie chiffrée répliquée automatiquement vers un espace de stockage cloud hors site chaque nuit.",
        schema: `<div class="diagram-row"><div class="diagram-box">Complète (lundi)</div><div class="diagram-arrow">→</div><div class="diagram-box ghost">Incrémentale (mardi)</div><div class="diagram-arrow">→</div><div class="diagram-box ghost">Incrémentale (mercredi)</div></div>`,
        vocabulaire: [
          { terme: "RPO", def: "Recovery Point Objective — quantité maximale de données qu'on accepte de perdre lors d'un incident." },
          { terme: "RTO", def: "Recovery Time Objective — délai maximal acceptable pour restaurer un service après un incident." },
          { terme: "Règle 3-2-1", def: "Bonne pratique de sauvegarde : 3 copies, 2 supports différents, 1 copie hors site." }
        ],
        erreurs: ["Mettre en place des sauvegardes automatiques sans jamais tester une restauration réelle : une sauvegarde non testée n'est pas une garantie de récupération."],
        resume: "Les sauvegardes complètes, incrémentales et différentielles offrent des compromis entre temps de sauvegarde, espace utilisé et simplicité de restauration. RPO et RTO cadrent les objectifs de perte de données et de délai de reprise, et la règle 3-2-1 reste la référence pour se prémunir d'un sinistre majeur.",
        quiz: [
          { q: "Que mesure le RTO (Recovery Time Objective) ?", options: ["La quantité de données qu'on accepte de perdre", "Le délai maximal acceptable pour restaurer le service après un incident", "Le nombre de copies de sauvegarde nécessaires", "La vitesse du réseau de l'entreprise"], correct: 1, explanations: ["Faux, c'est le RPO.", "Correct.", "Faux, c'est plutôt lié à la règle 3-2-1.", "Faux."] }
        ],
        plusLoin: ["La sécurité réseau (Niveau 15)", "Le monitoring et la supervision (Niveau 16)"]
      }
    ]
  },
  // ============================================================
  // NIVEAU 15 — SÉCURITÉ RÉSEAU (extrait)
  // ============================================================
  {
    id: "n15",
    niveau: 15,
    phase: "Sécurité & Cloud",
    titre: "Sécurité réseau",
    tag: "SEC",
    resume: "Défenses de périmètre, chiffrement et principales familles de menaces — approche uniquement défensive.",
    lessons: [
      {
        id: "n15-l1",
        titre: "Firewall, DMZ, VPN et principes Zero Trust",
        objectifs: [
          "Expliquer le rôle d'un pare-feu et d'une DMZ",
          "Comprendre le principe d'un VPN",
          "Introduire le concept de Zero Trust"
        ],
        intro: "La sécurité réseau repose sur un principe simple : limiter au strict nécessaire ce qui peut entrer, sortir ou circuler sur le réseau.",
        theorie: [
          { titre: "Firewall (pare-feu)", texte: "Filtre le trafic réseau selon des règles précises (adresses IP, ports, protocoles autorisés). C'est la première ligne de défense d'un réseau d'entreprise, positionnée entre Internet et le réseau interne." },
          { titre: "IDS / IPS", texte: "Un IDS (Intrusion Detection System) détecte une activité suspecte et alerte. Un IPS (Intrusion Prevention System) va plus loin : il bloque automatiquement le trafic identifié comme malveillant." },
          { titre: "DMZ (zone démilitarisée)", texte: "Sous-réseau isolé qui héberge les services exposés à Internet (site web public, serveur mail) séparément du réseau interne, pour que la compromission d'un service public ne donne pas directement accès aux données internes." },
          { titre: "VPN (Virtual Private Network)", texte: "Crée un tunnel chiffré entre deux points (un employé en télétravail et le réseau de l'entreprise, par exemple), permettant d'accéder aux ressources internes en toute confidentialité, même via Internet." },
          { titre: "Zero Trust", texte: "Modèle de sécurité moderne selon lequel aucune machine ni utilisateur n'est considéré comme fiable par défaut, même à l'intérieur du réseau : chaque accès doit être vérifié et authentifié explicitement." },
          { titre: "MFA (authentification multifacteur)", texte: "Exige au moins deux preuves d'identité différentes (mot de passe + code temporaire, par exemple) pour réduire fortement le risque lié à un mot de passe compromis." }
        ],
        exemple: "Une entreprise place son serveur web public dans une DMZ protégée par un firewall, tandis que ses employés en télétravail accèdent aux ressources internes uniquement via un VPN chiffré et une authentification à deux facteurs.",
        schema: `
          <div class="diagram-row">
            <div class="diagram-box ghost">Internet</div><div class="diagram-arrow">→</div>
            <div class="diagram-box accent">Firewall</div><div class="diagram-arrow">→</div>
            <div class="diagram-box">DMZ (serveurs publics)</div><div class="diagram-arrow">→</div>
            <div class="diagram-box accent">Firewall</div><div class="diagram-arrow">→</div>
            <div class="diagram-box">Réseau interne</div>
          </div>`,
        vocabulaire: [
          { terme: "Firewall", def: "Équipement ou logiciel filtrant le trafic réseau selon des règles définies." },
          { terme: "DMZ", def: "Sous-réseau isolé hébergeant les services exposés publiquement." },
          { terme: "VPN", def: "Tunnel chiffré permettant un accès distant sécurisé à un réseau privé." },
          { terme: "Zero Trust", def: "Modèle de sécurité où aucun accès n'est fiable par défaut, même en interne." },
          { terme: "MFA", def: "Authentification exigeant plusieurs preuves d'identité indépendantes." }
        ],
        erreurs: ["Croire qu'un firewall protège contre toutes les menaces : il filtre le trafic réseau, mais ne remplace ni l'antivirus, ni la sensibilisation des utilisateurs, ni les mises à jour."],
        resume: "Le firewall filtre le trafic, la DMZ isole les services publics, le VPN sécurise les accès distants, et le modèle Zero Trust généralise la vérification systématique de chaque accès, même interne.",
        quiz: [
          { q: "Quel est l'intérêt principal d'une DMZ ?", options: ["Accélérer le réseau", "Isoler les services exposés à Internet du réseau interne", "Remplacer le firewall", "Chiffrer les mots de passe"], correct: 1, explanations: ["Faux, ce n'est pas son objectif.", "Correct : la DMZ limite l'impact d'une compromission d'un service public sur le réseau interne.", "Faux, la DMZ est généralement encadrée par des firewalls, elle ne les remplace pas.", "Faux."] }
        ],
        plusLoin: ["Le chiffrement TLS et la PKI", "Les attaques courantes et leur prévention (leçon suivante)"]
      },
      {
        id: "n15-l2",
        titre: "Principales menaces réseau (approche défensive)",
        objectifs: ["Reconnaître les grandes familles de menaces réseau pour mieux s'en prémunir"],
        intro: "Comprendre les menaces courantes permet de mieux comprendre pourquoi certaines protections (firewall, MFA, mises à jour) existent. Cette leçon reste volontairement générale et défensive : aucune procédure d'attaque n'est fournie.",
        theorie: [
          { titre: "Phishing (hameçonnage)", texte: "Technique visant à tromper un utilisateur pour lui faire révéler des informations sensibles (mot de passe, données bancaires), souvent via un email ou site frauduleux imitant un service légitime. Défense : sensibilisation, filtrage email, MFA." },
          { titre: "Malware et ransomware", texte: "Un malware est un logiciel malveillant. Un ransomware chiffre les données de la victime et exige une rançon pour les déchiffrer. Défense : antivirus à jour, sauvegardes régulières et isolées, restriction des droits utilisateurs." },
          { titre: "Attaques par force brute", texte: "Tentative de deviner un mot de passe en essayant de nombreuses combinaisons. Défense : mots de passe complexes, verrouillage de compte après plusieurs échecs, MFA." },
          { titre: "DDoS", texte: "Attaque par déni de service distribué : submerger un serveur de requêtes pour le rendre indisponible. Défense : services anti-DDoS, répartition de charge, filtrage en amont." },
          { titre: "Man-in-the-middle", texte: "Un attaquant s'interpose entre deux parties pour intercepter ou modifier leurs échanges. Défense : chiffrement systématique (HTTPS, VPN), vérification des certificats." },
          { titre: "ARP spoofing / DNS spoofing", texte: "Techniques consistant à falsifier des réponses ARP ou DNS pour rediriger le trafic vers une machine malveillante. Défense : surveillance réseau, sécurisation des équipements de switching." }
        ],
        exemple: "Une entreprise victime d'une tentative de phishing ciblant son service comptable limite les dégâts grâce à la sensibilisation de ses employés, au filtrage anti-spam et à l'authentification multifacteur sur les comptes financiers.",
        schema: `<div class="diagram-row"><div class="diagram-box">Attaquant</div><div class="diagram-arrow">≠→</div><div class="diagram-box accent">Défenses : firewall, MFA, sauvegardes, sensibilisation</div><div class="diagram-arrow">→</div><div class="diagram-box">Entreprise</div></div>`,
        vocabulaire: [
          { terme: "Phishing", def: "Technique de tromperie visant à obtenir des informations sensibles." },
          { terme: "Ransomware", def: "Logiciel malveillant qui chiffre des données contre rançon." },
          { terme: "DDoS", def: "Attaque visant à rendre un service indisponible en le submergeant de requêtes." }
        ],
        erreurs: ["Penser que la sécurité repose uniquement sur des outils techniques : la sensibilisation des utilisateurs est tout aussi essentielle."],
        resume: "Phishing, malware/ransomware, force brute, DDoS, man-in-the-middle et spoofing sont les grandes familles de menaces réseau. Chacune appelle des défenses précises : sensibilisation, MFA, chiffrement, sauvegardes et surveillance.",
        quiz: [
          { q: "Quelle est la meilleure défense générale contre un ransomware ?", options: ["Payer immédiatement la rançon", "Des sauvegardes régulières et isolées du réseau", "Désactiver le pare-feu", "Aucune défense n'existe"], correct: 1, explanations: ["Faux, cela ne garantit rien et encourage les attaquants.", "Correct : des sauvegardes saines permettent de restaurer les données sans payer.", "Faux, cela aggraverait la situation.", "Faux, plusieurs défenses réduisent significativement le risque."] }
        ],
        plusLoin: ["Le monitoring réseau (Niveau 16)", "L'architecture d'entreprise complète (Niveau 19)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 16 — MONITORING ET SUPERVISION
  // ============================================================
  {
    id: "n16",
    niveau: 16,
    phase: "Sécurité & Cloud",
    titre: "Monitoring et supervision",
    tag: "MON",
    resume: "Détecter un problème avant qu'il ne devienne une panne majeure.",
    lessons: [
      {
        id: "n16-l1",
        titre: "Superviser une infrastructure : métriques, dashboards et alertes",
        objectifs: [
          "Comprendre l'intérêt du monitoring proactif face au dépannage réactif",
          "Connaître les principales métriques à surveiller",
          "Comprendre le principe d'une alerte bien calibrée"
        ],
        intro: "Attendre qu'un utilisateur signale un problème, c'est déjà être en retard. Le monitoring permet de détecter et souvent résoudre un incident avant qu'il n'impacte réellement les utilisateurs.",
        theorie: [
          { titre: "Métriques système", texte: "CPU, RAM, espace disque, charge réseau : des métriques de base qui, surveillées en continu, révèlent une dérive avant la panne complète (ex. un disque qui se remplit progressivement sur plusieurs jours)." },
          { titre: "Disponibilité (uptime) des services", texte: "Au-delà des ressources matérielles, il faut vérifier que les services eux-mêmes répondent réellement (un serveur web \"up\" en CPU/RAM mais dont le service web est planté est toujours en panne pour l'utilisateur)." },
          { titre: "Outils de supervision", texte: "Prometheus (collecte de métriques) associé à Grafana (visualisation en dashboards) forme une combinaison très répandue en entreprise. Zabbix est une alternative tout-en-un plus traditionnelle, combinant collecte, alerte et visualisation." },
          { titre: "Alertes bien calibrées", texte: "Une alerte doit prévenir suffisamment tôt pour agir, sans pour autant déclencher en permanence pour des variations normales (le \"bruit d'alerte\" pousse à ignorer les notifications, ce qui est pire que l'absence d'alerte). Un bon seuil se calibre progressivement avec l'expérience réelle de l'infrastructure." }
        ],
        exemple: "Une alerte se déclenche automatiquement quand l'espace disque d'un serveur dépasse 85%, laissant à l'équipe le temps d'agir avant que le disque ne soit totalement plein et ne provoque une panne de service en cascade.",
        schema: `<div class="diagram-row"><div class="diagram-box">Serveurs (métriques)</div><div class="diagram-arrow">→</div><div class="diagram-box accent">Prometheus</div><div class="diagram-arrow">→</div><div class="diagram-box">Grafana (dashboard)</div><div class="diagram-arrow">→</div><div class="diagram-box ghost">Alerte</div></div>`,
        vocabulaire: [
          { terme: "Uptime", def: "Durée pendant laquelle un service ou système reste disponible et fonctionnel." },
          { terme: "Dashboard", def: "Tableau de bord visuel regroupant les métriques clés d'une infrastructure en temps réel." }
        ],
        erreurs: ["Configurer des seuils d'alerte trop sensibles, générant tellement de fausses alertes que l'équipe finit par toutes les ignorer, y compris les vraies."],
        resume: "Le monitoring proactif surveille en continu les métriques système et la disponibilité réelle des services, via des outils comme Prometheus/Grafana ou Zabbix. Des alertes bien calibrées permettent d'agir avant l'incident majeur, sans noyer l'équipe sous de fausses alertes.",
        quiz: [
          { q: "Pourquoi surveiller la disponibilité d'un SERVICE et pas seulement les ressources (CPU/RAM) du serveur qui l'héberge ?", options: ["Ce n'est pas nécessaire, les ressources suffisent", "Un serveur peut avoir des ressources normales alors que le service lui-même est planté", "Les services ne consomment jamais de ressources", "C'est la même chose"], correct: 1, explanations: ["Faux.", "Correct : c'est un cas fréquent qui échappe à une supervision uniquement matérielle.", "Faux.", "Faux."] }
        ],
        plusLoin: ["Le cloud computing (Niveau 17)", "L'architecture d'entreprise complète (Niveau 19)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 17 — CLOUD COMPUTING
  // ============================================================
  {
    id: "n17",
    niveau: 17,
    phase: "Sécurité & Cloud",
    titre: "Cloud computing",
    tag: "CLD",
    resume: "IaaS, PaaS, SaaS : louer de l'infrastructure plutôt que la posséder.",
    lessons: [
      {
        id: "n17-l1",
        titre: "Modèles de service cloud et principaux fournisseurs",
        objectifs: [
          "Différencier IaaS, PaaS et SaaS",
          "Comprendre les avantages et limites du cloud par rapport à l'infrastructure sur site",
          "Connaître les principaux fournisseurs cloud"
        ],
        intro: "Le cloud computing consiste à consommer des ressources informatiques (calcul, stockage, réseau, logiciels) à la demande, via Internet, plutôt que de posséder et maintenir soi-même le matériel.",
        theorie: [
          { titre: "IaaS (Infrastructure as a Service)", texte: "Le fournisseur cloud met à disposition l'infrastructure brute (machines virtuelles, stockage, réseau), et le client garde la responsabilité de tout ce qui tourne dessus (OS, mises à jour, applications). Exemple : une VM louée sur AWS EC2 ou Azure." },
          { titre: "PaaS (Platform as a Service)", texte: "Le fournisseur gère aussi le système d'exploitation et l'environnement d'exécution ; le client ne s'occupe que du déploiement de son application. Exemple : une base de données managée, où les sauvegardes et mises à jour sont automatiquement gérées par le fournisseur." },
          { titre: "SaaS (Software as a Service)", texte: "Le client consomme directement une application complète via un navigateur, sans se soucier d'aucune couche technique sous-jacente. Exemple : une messagerie en ligne ou un CRM accessible par abonnement." },
          { titre: "Avantages et limites", texte: "Avantages : élasticité (ajuster les ressources à la demande), pas d'investissement matériel initial, haute disponibilité intégrée. Limites : dépendance au fournisseur, coûts qui peuvent devenir importants à grande échelle, questions de souveraineté et de localisation des données selon les secteurs réglementés." },
          { titre: "Principaux fournisseurs", texte: "Amazon Web Services (AWS), Microsoft Azure et Google Cloud Platform (GCP) dominent le marché mondial, chacun proposant une large gamme de services IaaS, PaaS et SaaS." }
        ],
        exemple: "Une startup héberge son application sur des VM IaaS pour garder un contrôle fin de l'environnement, tandis qu'elle utilise une base de données PaaS managée pour éviter d'avoir à gérer elle-même les sauvegardes et les correctifs de sécurité du SGBD.",
        schema: `
          <div class="diagram-row">
            <div class="diagram-box">IaaS</div><div class="diagram-box">PaaS</div><div class="diagram-box accent">SaaS</div>
          </div>
          <div class="diagram-row" style="margin-top:8px">
            <div class="diagram-box ghost">Responsabilité client décroissante →</div>
          </div>`,
        vocabulaire: [
          { terme: "IaaS", def: "Infrastructure as a Service — infrastructure virtualisée (calcul, stockage, réseau) louée à la demande." },
          { terme: "PaaS", def: "Platform as a Service — plateforme d'exécution managée, le client ne gère que son application." },
          { terme: "SaaS", def: "Software as a Service — application complète consommée directement en ligne." }
        ],
        erreurs: ["Croire que migrer vers le cloud dispense automatiquement de toute responsabilité de sécurité : le modèle de responsabilité partagée laisse toujours une part de sécurisation (comptes, configuration, données) à la charge du client."],
        resume: "Le cloud computing propose trois grands modèles de service — IaaS (infrastructure brute), PaaS (plateforme managée) et SaaS (application complète) — chacun déplaçant une part croissante de responsabilité vers le fournisseur, moyennant une dépendance accrue à celui-ci.",
        quiz: [
          { q: "Dans quel modèle le client ne gère-t-il ni l'OS, ni le matériel, ni même l'application elle-même ?", options: ["IaaS", "PaaS", "SaaS", "Aucun de ces modèles"], correct: 2, explanations: ["Faux, le client gère l'OS en IaaS.", "Faux, le client gère encore son application en PaaS.", "Correct : en SaaS, tout est géré par le fournisseur, le client consomme directement le service.", "Faux."] }
        ],
        plusLoin: ["Les conteneurs et le DevOps (Niveau 18)", "L'architecture d'entreprise complète (Niveau 19)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 18 — CONTENEURS ET DEVOPS
  // ============================================================
  {
    id: "n18",
    niveau: 18,
    phase: "Sécurité & Cloud",
    titre: "Conteneurs et DevOps",
    tag: "OPS",
    resume: "Docker, Kubernetes et l'automatisation des déploiements.",
    lessons: [
      {
        id: "n18-l1",
        titre: "Conteneurisation, orchestration et intégration continue",
        objectifs: [
          "Différencier une VM et un conteneur",
          "Comprendre le rôle de Docker et de Kubernetes",
          "Comprendre les principes du CI/CD"
        ],
        intro: "Le monde applicatif moderne s'appuie de plus en plus sur les conteneurs, plus légers et plus rapides à déployer que des machines virtuelles complètes, et sur l'automatisation de leur mise en production.",
        theorie: [
          { titre: "Conteneur vs machine virtuelle", texte: "Une VM embarque un système d'exploitation complet et virtualise le matériel. Un conteneur, lui, partage le noyau du système hôte et n'embarque que l'application et ses dépendances directes — beaucoup plus léger et rapide à démarrer (secondes contre minutes pour une VM)." },
          { titre: "Docker", texte: "Plateforme de référence pour créer, distribuer et exécuter des conteneurs. Une image Docker décrit précisément l'environnement nécessaire à une application (dépendances, configuration), garantissant qu'elle fonctionnera identiquement partout où elle est déployée." },
          { titre: "Kubernetes", texte: "Système d'orchestration qui gère automatiquement le déploiement, la mise à l'échelle et la résilience de nombreux conteneurs à travers plusieurs serveurs — redémarre un conteneur en panne, répartit la charge, et permet de faire évoluer le nombre d'instances selon la demande." },
          { titre: "CI/CD (intégration et déploiement continus)", texte: "Ensemble de pratiques automatisant le test et le déploiement du code à chaque modification : l'intégration continue (CI) vérifie automatiquement que le nouveau code fonctionne, le déploiement continu (CD) le met en production automatiquement une fois validé, réduisant fortement le risque d'erreur humaine et accélérant les livraisons." },
          { titre: "Culture DevOps", texte: "Au-delà des outils, le DevOps est une philosophie de collaboration rapprochée entre les équipes de développement et d'exploitation, visant à livrer plus vite et plus fiablement, avec une responsabilité partagée sur la stabilité en production." }
        ],
        exemple: "Une équipe de développement pousse une modification de code ; un pipeline CI/CD la teste automatiquement, construit une nouvelle image Docker, et Kubernetes déploie progressivement les nouveaux conteneurs sans interruption de service pour les utilisateurs.",
        schema: `<div class="diagram-row"><div class="diagram-box">Code</div><div class="diagram-arrow">CI/CD</div><div class="diagram-box">Image Docker</div><div class="diagram-arrow">→</div><div class="diagram-box accent">Kubernetes (orchestration)</div></div>`,
        vocabulaire: [
          { terme: "Docker", def: "Plateforme de conteneurisation permettant d'empaqueter une application avec ses dépendances." },
          { terme: "Kubernetes", def: "Système d'orchestration de conteneurs à grande échelle." },
          { terme: "CI/CD", def: "Intégration et déploiement continus — automatisation des tests et de la mise en production du code." }
        ],
        erreurs: ["Croire qu'un conteneur est \"une VM plus légère\" au sens strict : un conteneur partage le noyau de l'hôte, ce qui change fondamentalement son modèle d'isolation par rapport à une VM."],
        resume: "Les conteneurs (Docker) offrent une alternative légère et rapide aux VM pour empaqueter des applications, tandis que Kubernetes orchestre leur déploiement à grande échelle. Le CI/CD automatise le test et la mise en production du code, au cœur de la culture DevOps.",
        quiz: [
          { q: "Quelle est la différence fondamentale entre un conteneur et une machine virtuelle ?", options: ["Aucune, ce sont des synonymes", "Le conteneur partage le noyau du système hôte, la VM virtualise du matériel complet avec son propre OS", "Un conteneur est toujours plus lent qu'une VM", "Une VM ne peut pas héberger d'application web"], correct: 1, explanations: ["Faux.", "Correct.", "Faux, c'est l'inverse en général.", "Faux."] }
        ],
        plusLoin: ["L'architecture d'entreprise complète (leçon suivante, Niveau 19)", "Les métiers et compétences (Niveau 20)"]
      }
    ]
  },

  // ============================================================
  // NIVEAU 19 — ARCHITECTURE D'ENTREPRISE COMPLÈTE
  // ============================================================
  {
    id: "n19",
    niveau: 19,
    phase: "Sécurité & Cloud",
    titre: "Architecture d'entreprise complète",
    tag: "ARC",
    resume: "Synthèse : assembler tous les niveaux précédents en une infrastructure d'entreprise cohérente.",
    lessons: [
      {
        id: "n19-l1",
        titre: "Assembler une infrastructure d'entreprise de bout en bout",
        objectifs: [
          "Relier entre eux tous les blocs vus dans les niveaux précédents",
          "Comprendre comment s'articulent réseau, sécurité, systèmes et services dans une architecture réelle",
          "Identifier les points de défaillance critiques d'une infrastructure type"
        ],
        intro: "Ce niveau ne présente pas de notion nouvelle : il relie entre eux tous les concepts vus depuis le Niveau 0, pour former la vision d'ensemble d'une infrastructure d'entreprise réelle.",
        theorie: [
          { titre: "La chaîne complète", texte: "Un utilisateur qui ouvre un fichier partagé mobilise en réalité toute la chaîne étudiée : sa carte réseau (N0) envoie une trame via le switch et son VLAN (N5), routée si besoin vers le bon segment (N6), après avoir obtenu son adresse par DHCP (N11) et résolu le nom du serveur par DNS (N10), authentifié via Active Directory (N8), pour finalement accéder à un partage protégé par des permissions NTFS, le tout potentiellement hébergé sur une VM (N9) protégée par un firewall (N15) et sauvegardée régulièrement (N14)." },
          { titre: "Segmentation par zones", texte: "Une architecture d'entreprise type sépare généralement : la zone Internet (non fiable), le firewall périmétrique, une éventuelle DMZ pour les services exposés, le LAN utilisateurs segmenté par VLAN métier, et un VLAN serveurs regroupant les services critiques (AD, DNS, DHCP, fichiers)." },
          { titre: "Redondance et points de défaillance uniques (SPOF)", texte: "Un \"Single Point Of Failure\" est un élément dont la panne interrompt tout le service (ex. un seul contrôleur de domaine, un seul lien Internet). Une architecture mature identifie ces points et prévoit une redondance là où la criticité le justifie (second DC, double lien Internet, cluster de virtualisation)." },
          { titre: "Documentation d'infrastructure", texte: "Schéma réseau à jour, plan d'adressage IP, inventaire des comptes et serveurs, procédures de sauvegarde/restauration testées : une infrastructure qui fonctionne bien aujourd'hui mais n'est pas documentée devient un risque majeur le jour où la personne qui la connaît par cœur n'est plus disponible." }
        ],
        exemple: "Le schéma d'une PME type : Internet → Firewall → Core Switch → VLAN par service (Admin, RH, Compta, IT, Invités) → VLAN Serveurs hébergeant Active Directory, DNS, DHCP, serveur de fichiers et serveur web, le tout sauvegardé quotidiennement et supervisé par un outil de monitoring.",
        schema: `
          <div class="ascii-diagram" style="white-space:pre; font-family:monospace;">
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
      AD         DNS        DHCP     FILE      WEB
    Server      Server      Server   Server   Server
          </div>`,
        vocabulaire: [
          { terme: "SPOF", def: "Single Point Of Failure — élément unique dont la panne interrompt tout ou partie du service." },
          { terme: "DMZ", def: "Zone démilitarisée — sous-réseau isolé hébergeant les services exposés à Internet, sans accès direct au LAN interne." }
        ],
        erreurs: ["Concevoir une infrastructure impressionnante sur le papier sans jamais la documenter ni tester ses procédures de restauration en conditions réelles."],
        resume: "Une architecture d'entreprise complète assemble réseau segmenté (VLAN, routage), sécurité périmétrique (firewall, DMZ), systèmes (Windows/Linux, Active Directory), services (DNS, DHCP, fichiers), stockage et sauvegarde, le tout supervisé et documenté. C'est l'intégration cohérente de tous les niveaux précédents.",
        quiz: [
          { q: "Qu'est-ce qu'un SPOF (Single Point Of Failure) ?", options: ["Un protocole de sécurité", "Un élément unique dont la panne interrompt tout ou partie du service", "Un type de VLAN", "Un outil de sauvegarde"], correct: 1, explanations: ["Faux.", "Correct.", "Faux.", "Faux."] }
        ],
        plusLoin: ["Les métiers et compétences pour la suite (Niveau 20)", "Mettre cette architecture en pratique dans la plateforme Practice Lab"]
      }
    ]
  },
  // ============================================================
  // NIVEAU 20 — MÉTIERS ET COMPÉTENCES
  // ============================================================
  {
    id: "n20",
    niveau: 20,
    phase: "Carrière",
    titre: "Métiers et compétences",
    tag: "JOB",
    resume: "Quels métiers exercer avec ces compétences, et comment progresser.",
    lessons: [
      {
        id: "n20-l1",
        titre: "Panorama des métiers de l'administration système et réseau",
        objectifs: ["Identifier les métiers accessibles selon le niveau de compétence", "Comprendre les responsabilités typiques de chaque poste"],
        intro: "Les compétences acquises dans ce parcours ouvrent vers plusieurs métiers, du support technique jusqu'à l'ingénierie infrastructure.",
        theorie: [
          { titre: "Technicien Helpdesk / Support", texte: "Premier niveau de contact avec les utilisateurs. Compétences : bases réseau, Windows/Linux, résolution de problèmes courants. Évolution naturelle vers administrateur système ou réseau." },
          { titre: "Administrateur systèmes", texte: "Gère les serveurs (Windows Server / Linux), les comptes utilisateurs, les sauvegardes, les mises à jour. Compétences : Active Directory, scripting, virtualisation." },
          { titre: "Administrateur réseau", texte: "Gère les équipements réseau (switchs, routeurs, firewalls), le câblage, le VLAN, le VPN. Compétences : routage, switching, sécurité réseau." },
          { titre: "Ingénieur infrastructure", texte: "Conçoit et fait évoluer l'ensemble de l'architecture technique d'une entreprise (serveurs, réseau, stockage, virtualisation, cloud). Poste plus senior, avec une vision globale et transversale." },
          { titre: "Cloud Engineer", texte: "Conçoit et administre des infrastructures hébergées sur AWS, Azure ou Google Cloud. Compétences : IaaS/PaaS, Infrastructure as Code, sécurité cloud." },
          { titre: "DevOps Engineer", texte: "Fait le lien entre développement et exploitation : automatisation, intégration et déploiement continus (CI/CD), conteneurs (Docker, Kubernetes)." },
          { titre: "Security Engineer", texte: "Spécialisé dans la protection des systèmes et réseaux : audits, durcissement (hardening), réponse aux incidents, veille sur les menaces." }
        ],
        exemple: "Un parcours de carrière typique : Technicien Helpdesk (0-2 ans) → Administrateur systèmes ou réseau (2-5 ans) → Ingénieur infrastructure ou Cloud/DevOps Engineer (5 ans et plus).",
        schema: `
          <div class="career-path">
            <div class="career-step">Helpdesk</div><div class="diagram-arrow">→</div>
            <div class="career-step">Administrateur Système / Réseau</div><div class="diagram-arrow">→</div>
            <div class="career-step accent">Ingénieur Infrastructure / Cloud / DevOps</div>
          </div>`,
        vocabulaire: [
          { terme: "Helpdesk", def: "Service de support technique de premier niveau auprès des utilisateurs." },
          { terme: "Hardening", def: "Ensemble des actions visant à durcir la sécurité d'un système." }
        ],
        erreurs: ["Croire qu'il faut absolument commencer par le cloud ou le DevOps : les fondamentaux systèmes et réseau restent le socle indispensable de tous ces métiers."],
        resume: "Du Helpdesk à l'ingénierie infrastructure, en passant par l'administration système, réseau, le cloud, le DevOps ou la sécurité, tous ces métiers reposent sur les mêmes fondamentaux enseignés dans ce parcours.",
        quiz: [
          { q: "Quel métier se concentre le plus sur Docker, Kubernetes et le CI/CD ?", options: ["Technicien Helpdesk", "Administrateur réseau", "DevOps Engineer", "Aucun de ces métiers"], correct: 2, explanations: ["Faux.", "Faux, plutôt orienté switching/routage/firewall.", "Correct : ce sont des outils caractéristiques du métier DevOps.", "Faux."] }
        ],
        plusLoin: ["Revoir l'architecture d'entreprise (Niveau 19)", "Explorer le glossaire complet"]
      }
    ]
  }

];

/* ------------------------------------------------------------
   GLOSSAIRE
   ------------------------------------------------------------ */
const GLOSSAIRE = [
  { terme: "IP", def: "Internet Protocol — protocole d'adressage et d'acheminement des paquets sur un réseau." },
  { terme: "MAC", def: "Media Access Control — adresse physique unique d'une carte réseau." },
  { terme: "DNS", def: "Domain Name System — traduit les noms de domaine en adresses IP." },
  { terme: "DHCP", def: "Dynamic Host Configuration Protocol — attribue automatiquement une configuration IP." },
  { terme: "TCP", def: "Protocole de transport fiable, avec accusé de réception et ordre garanti." },
  { terme: "UDP", def: "Protocole de transport rapide, sans garantie de livraison." },
  { terme: "HTTP", def: "Protocole de transfert des pages web, non chiffré." },
  { terme: "HTTPS", def: "Version chiffrée (TLS) du protocole HTTP." },
  { terme: "VLAN", def: "Virtual LAN — réseau local virtuel permettant de segmenter logiquement un réseau physique." },
  { terme: "VPN", def: "Virtual Private Network — tunnel chiffré pour un accès distant sécurisé." },
  { terme: "NAT", def: "Network Address Translation — traduit des adresses IP privées en adresse publique et inversement." },
  { terme: "Firewall", def: "Pare-feu — filtre le trafic réseau selon des règles définies." },
  { terme: "Router", def: "Routeur — équipement qui achemine les paquets entre différents réseaux." },
  { terme: "Switch", def: "Commutateur — équipement qui relie les machines d'un même réseau local via les adresses MAC." },
  { terme: "Serveur", def: "Machine ou programme qui fournit un service à un ou plusieurs clients." },
  { terme: "Client", def: "Machine ou programme qui consomme un service fourni par un serveur." },
  { terme: "Domain", def: "Domaine — regroupement logique de comptes et ressources gérés de façon centralisée (Active Directory)." },
  { terme: "Active Directory", def: "Service d'annuaire Microsoft centralisant utilisateurs, groupes et ressources d'un réseau Windows." },
  { terme: "LDAP", def: "Lightweight Directory Access Protocol — protocole d'interrogation d'annuaires (dont Active Directory)." },
  { terme: "Kerberos", def: "Protocole d'authentification réseau sécurisé basé sur des tickets, utilisé notamment par Active Directory." },
  { terme: "Linux", def: "Système d'exploitation open-source largement utilisé pour les serveurs." },
  { terme: "Windows Server", def: "Système d'exploitation serveur de Microsoft." },
  { terme: "Hypervisor", def: "Logiciel permettant de créer et gérer des machines virtuelles." },
  { terme: "VM", def: "Machine virtuelle — ordinateur simulé par logiciel au sein d'un hôte physique." },
  { terme: "RAID", def: "Technologie combinant plusieurs disques pour la performance et/ou la tolérance de panne." },
  { terme: "NAS", def: "Network Attached Storage — serveur de stockage accessible via le réseau." },
  { terme: "SAN", def: "Storage Area Network — réseau dédié au stockage à haute performance." },
  { terme: "Cloud", def: "Ensemble de ressources informatiques (calcul, stockage, réseau) fournies à la demande via Internet." },
  { terme: "Docker", def: "Plateforme de conteneurisation permettant d'empaqueter une application avec ses dépendances." },
  { terme: "Kubernetes", def: "Système d'orchestration de conteneurs à grande échelle." },
  { terme: "DevOps", def: "Ensemble de pratiques reliant développement et exploitation, visant l'automatisation et la fiabilité des déploiements." }
];
