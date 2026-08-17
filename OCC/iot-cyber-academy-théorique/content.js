/* ============================================================
   CONTENT MODEL
   - CATEGORIES: full navigation tree (matches the requested
     47-module architecture) so the site's structure is complete
     even before every lesson is written.
   - LESSONS: fully authored lessons (id must match a module id
     below). Un-authored modules render as "in progress" but are
     still browsable and countable in the progress system.
   - GLOSSARY / CAREERS: supporting reference data.
   ============================================================ */

const CATEGORIES = [
  { id:"fondamentaux", name:"Fondamentaux", icon:"cpu", modules:[
    { id:"m-informatique", name:"Bases de l'informatique" },
  ]},
  { id:"iot-intro", name:"Internet des Objets", icon:"wifi", modules:[
    { id:"m-iot-intro", name:"Introduction à l'IoT" },
    { id:"m-capteurs", name:"Capteurs et actionneurs" },
    { id:"m-hardware", name:"Hardware IoT" },
  ]},
  { id:"architecture", name:"Architecture IoT", icon:"layers", modules:[
    { id:"m-architecture", name:"Architecture IoT" },
    { id:"m-donnees", name:"Données IoT" },
  ]},
  { id:"protocoles", name:"Protocoles IoT", icon:"share", modules:[
    { id:"m-connectivite", name:"Connectivité IoT" },
    { id:"m-protocoles", name:"Protocoles applicatifs" },
    { id:"m-mqtt", name:"MQTT en profondeur" },
  ]},
  { id:"cloud-edge", name:"Cloud & Edge Computing", icon:"cloud", modules:[
    { id:"m-edge", name:"Edge Computing" },
    { id:"m-cloud-iot", name:"Cloud IoT" },
  ]},
  { id:"iot-security", name:"IoT Security", icon:"shield", modules:[
    { id:"m-iot-security", name:"Sécurité IoT — vue d'ensemble" },
    { id:"m-threat-modeling", name:"IoT Threat Modeling" },
    { id:"m-etudes-cas-iot", name:"Études de cas IoT" },
  ]},
  { id:"cyber", name:"Cybersécurité", icon:"lock", modules:[
    { id:"m-cyber-intro", name:"Introduction à la cybersécurité" },
    { id:"m-menaces", name:"Menaces" },
    { id:"m-vulnerabilites", name:"Vulnérabilités" },
    { id:"m-cyber-entreprise", name:"Cybersécurité d'entreprise" },
  ]},
  { id:"reseau", name:"Sécurité Réseau", icon:"network", modules:[
    { id:"m-secu-reseau", name:"Sécurité réseau" },
    { id:"m-zero-trust", name:"Zero Trust" },
  ]},
  { id:"systeme", name:"Sécurité Système", icon:"server", modules:[
    { id:"m-secu-systeme", name:"Sécurité système" },
  ]},
  { id:"app-sec", name:"Sécurité Applicative", icon:"code", modules:[
    { id:"m-owasp", name:"OWASP" },
  ]},
  { id:"crypto", name:"Cryptographie", icon:"key", modules:[
    { id:"m-crypto", name:"Cryptographie" },
  ]},
  { id:"iam", name:"Identité & Accès", icon:"user-check", modules:[
    { id:"m-auth", name:"Authentification & IAM" },
  ]},
  { id:"risque", name:"Gestion des risques", icon:"alert-triangle", modules:[
    { id:"m-risques", name:"Gestion des risques" },
    { id:"m-incident", name:"Incident Response" },
    { id:"m-soc", name:"SOC & SIEM" },
  ]},
  { id:"data-privacy", name:"Sécurité des données", icon:"database", modules:[
    { id:"m-privacy", name:"Privacy & données personnelles" },
  ]},
  { id:"industriel", name:"Sécurité industrielle", icon:"factory", modules:[
    { id:"m-ot-ics", name:"OT, ICS & SCADA" },
  ]},
  { id:"gouvernance", name:"Gouvernance", icon:"gavel", modules:[
    { id:"m-secure-by-design", name:"Secure by Design" },
    { id:"m-supply-chain", name:"Supply Chain Security" },
  ]},
  { id:"normes", name:"Normes & Frameworks", icon:"file-check", modules:[
    { id:"m-frameworks", name:"NIST, ISO 27001, CIS, MITRE ATT&CK" },
  ]},
  { id:"metiers", name:"Métiers", icon:"briefcase", modules:[
    { id:"m-metiers", name:"Quels métiers viser ?" },
  ]},
];

/* ---------- LESSONS ---------- */
const LESSONS = {

/* ===================================================== */
"m-informatique": {
  category:"fondamentaux",
  tag:"Module 1 · Fondamentaux",
  title:"Les bases de l'informatique",
  desc:"Avant de parler d'objets connectés ou de cybersécurité, il faut un socle solide : ce qu'est une machine, un réseau, une donnée.",
  blocks:[
    { emoji:"🎯", h:"Objectifs", body:`<ul>
      <li>Comprendre ce qu'est un ordinateur et comment il traite l'information</li>
      <li>Distinguer matériel (hardware) et logiciel (software)</li>
      <li>Comprendre les notions de réseau, client, serveur et protocole</li>
      <li>Se familiariser avec le vocabulaire utilisé dans tout le reste du parcours</li>
    </ul>` },
    { emoji:"📖", h:"Explication simple", body:`<p>Un ordinateur, c'est une machine qui reçoit des instructions, les exécute, et produit un résultat. Imaginez une cuisine : le <strong>processeur</strong> est le cuisinier qui exécute les recettes, la <strong>mémoire vive (RAM)</strong> est le plan de travail où il pose les ingrédients qu'il utilise tout de suite, et le <strong>stockage</strong> (disque dur, SSD) est le garde-manger où tout reste rangé même quand la cuisine ferme (l'ordinateur s'éteint).</p>
    <p>Un <strong>réseau</strong>, c'est simplement plusieurs machines reliées entre elles pour échanger des messages. Internet est le plus grand réseau de réseaux au monde.</p>` },
    { emoji:"🔬", h:"Explication technique", body:`<p>Le <strong>système d'exploitation</strong> (Windows, Linux, macOS) est le logiciel qui gère les ressources matérielles et permet aux applications de s'exécuter. Chaque machine connectée à un réseau possède une <strong>adresse IP</strong> (son identifiant logique, comme une adresse postale) et une <strong>adresse MAC</strong> (l'identifiant physique de sa carte réseau).</p>
    <p>Un <strong>protocole</strong> est un ensemble de règles qui définit comment deux machines communiquent — un peu comme une langue commune. Les échanges se font sur des <strong>ports</strong>, des numéros qui identifient quel service est visé sur une machine (le port 443 pour le HTTPS, par exemple).</p>
    <p>Un <strong>serveur</strong> est une machine qui fournit un service (pages web, fichiers, données) ; un <strong>client</strong> est la machine qui consomme ce service. Une <strong>API</strong> (Application Programming Interface) est la porte d'entrée normalisée qu'une application expose pour que d'autres programmes puissent l'utiliser sans en connaître les détails internes.</p>` },
    { emoji:"🏢", h:"Exemple d'entreprise", body:`<p>Quand vous consultez le site d'une banque, votre téléphone (le <strong>client</strong>) envoie une requête via le protocole <strong>HTTPS</strong> à un <strong>serveur</strong> hébergé dans un datacenter. Ce serveur interroge une base de <strong>données</strong>, puis renvoie une réponse. Chaque étape utilise une adresse IP, un port, et un protocole précis — c'est ce socle qui rendra possible tout ce que vous apprendrez sur l'IoT et la cybersécurité.</p>` },
    { emoji:"🧩", h:"Schéma", diagram:
`CLIENT (votre appareil)
     │  requête HTTPS (port 443)
     ▼
SERVEUR ────────► BASE DE DONNÉES
     │
     │  réponse
     ▼
CLIENT (affichage du résultat)` },
    { emoji:"📊", h:"Tableau comparatif", table:{
      head:["Notion","Rôle","Analogie"],
      rows:[
        ["Processeur (CPU)","Exécute les instructions","Le cuisinier"],
        ["Mémoire (RAM)","Espace de travail temporaire","Le plan de travail"],
        ["Stockage","Conserve les données durablement","Le garde-manger"],
        ["Système d'exploitation","Gère le matériel et les logiciels","Le chef de cuisine"],
        ["Réseau","Relie les machines entre elles","Les routes entre les maisons"],
      ]
    }},
    { emoji:"⚠️", h:"Risques", body:`<div class="callout risk"><strong>À retenir :</strong> chaque brique de ce socle (OS, réseau, protocole) est aussi une surface potentielle de faiblesse. Comprendre comment un système fonctionne normalement est la première étape pour comprendre comment il peut être mal utilisé ou mal protégé — c'est le fil conducteur de tout ce parcours.</div>` },
    { emoji:"🛡️", h:"Mesures de protection", body:`<p>À ce stade, retenez surtout une discipline : nommer précisément les choses. La suite du parcours s'appuie sur ce vocabulaire (IP, port, protocole, client/serveur, API) pour décrire des architectures et des risques de façon rigoureuse.</p>` },
    { emoji:"🧠", h:"À retenir", list:[
      "Un ordinateur traite de l'information grâce au processeur, à la mémoire et au stockage.",
      "Un réseau relie des machines qui communiquent via des protocoles.",
      "Adresse IP = identifiant logique ; adresse MAC = identifiant physique.",
      "Client consomme un service ; serveur le fournit ; une API est la porte d'entrée normalisée.",
    ]},
  ],
  quiz:[
    { q:"Quel composant exécute les instructions d'un programme ?", opts:["La RAM","Le processeur (CPU)","Le disque dur","Le port réseau"], correct:1, explain:"Le processeur est l'unité qui exécute les instructions ; la RAM ne fait que stocker temporairement les données en cours d'utilisation." },
    { q:"Qu'est-ce qu'un protocole réseau ?", opts:["Un type de câble","Un ensemble de règles de communication entre machines","Un logiciel antivirus","Un fournisseur d'accès Internet"], correct:1, explain:"Un protocole définit les règles que deux machines suivent pour échanger des messages de façon compréhensible pour les deux parties." },
    { q:"Quelle affirmation décrit correctement une API ?", opts:["C'est l'adresse physique d'une carte réseau","C'est une porte d'entrée normalisée pour qu'un programme en utilise un autre","C'est un protocole de chiffrement","C'est un type de mémoire"], correct:1, explain:"Une API expose des fonctionnalités d'une application à d'autres programmes, sans exposer les détails internes." },
  ],
  related:["m-iot-intro","m-connectivite"],
},

/* ===================================================== */
"m-iot-intro": {
  category:"iot-intro",
  tag:"Module 2 · Internet des Objets",
  title:"Introduction à l'IoT",
  desc:"Ce qu'est un objet connecté, en quoi il diffère d'un ordinateur classique, et pourquoi ce marché explose.",
  blocks:[
    { emoji:"🎯", h:"Objectifs", body:`<ul>
      <li>Définir précisément l'IoT (Internet of Things)</li>
      <li>Distinguer capteur, actionneur, microcontrôleur et gateway</li>
      <li>Reconnaître les grandes familles d'objets connectés</li>
    </ul>` },
    { emoji:"📖", h:"Explication simple", body:`<p>Un objet connecté est un objet du quotidien — une ampoule, une montre, une voiture — auquel on a ajouté la capacité de mesurer quelque chose, de communiquer sur un réseau, et parfois d'agir sur son environnement. L'IoT (Internet of Things, ou « Internet des Objets ») désigne l'ensemble de ces objets et des systèmes qui les relient à Internet ou à des réseaux locaux.</p>` },
    { emoji:"🔬", h:"Explication technique", body:`<p>Un objet IoT typique combine :</p>
    <ul>
      <li><strong>Un ou plusieurs capteurs</strong> — ils mesurent une grandeur physique (température, mouvement, luminosité…)</li>
      <li><strong>Un microcontrôleur ou microprocesseur</strong> — le cerveau qui lit les capteurs et décide quoi faire</li>
      <li><strong>Un module de communication</strong> — Wi-Fi, Bluetooth, LoRa… pour transmettre les données</li>
      <li><strong>Éventuellement un actionneur</strong> — pour agir physiquement (ouvrir une vanne, allumer une LED)</li>
    </ul>
    <p>Les données remontent ensuite souvent vers une <strong>gateway</strong> (passerelle) puis vers un <strong>serveur ou une plateforme cloud IoT</strong>, où elles sont stockées, analysées, et rendues accessibles via une <strong>application</strong>.</p>` },
    { emoji:"🏢", h:"Exemple d'entreprise", body:`<p>Une entreprise agricole installe des capteurs d'humidité du sol dans ses champs. Chaque capteur envoie ses mesures par LoRaWAN à une gateway installée sur le site, qui les transmet à une plateforme cloud. Un algorithme y détecte que le sol est trop sec et déclenche automatiquement un système d'irrigation (l'actionneur) — sans intervention humaine.</p>` },
    { emoji:"🧩", h:"Schéma", diagram:
`Exemples d'objets connectés

  Montre connectée    →  santé, activité physique
  Caméra IP            →  surveillance
  Thermostat            →  maison intelligente
  Capteur industriel     →  usine 4.0 (IIoT)
  Véhicule connecté       →  navigation, diagnostic
  Dispositif médical       →  suivi de patients à distance
  Capteur agricole          →  agriculture de précision
  Éclairage urbain            →  ville intelligente` },
    { emoji:"⚠️", h:"Risques", body:`<div class="callout risk"><strong>Ce qui rend l'IoT différent d'un ordinateur classique :</strong> ressources limitées (mémoire, calcul, batterie), cycles de mise à jour souvent négligés, et déploiement massif dans des environnements physiques peu surveillés. Ces contraintes créent des risques spécifiques que nous détaillerons dans le module « Sécurité IoT ».</div>` },
    { emoji:"🛡️", h:"Mesures de protection", body:`<p>Retenez dès maintenant le principe directeur : un objet connecté n'est jamais « juste un capteur ». C'est un petit système informatique complet — avec un OS, un firmware, des communications — et il doit donc être pensé avec les mêmes exigences de sécurité qu'un serveur, adaptées à ses contraintes.</p>` },
    { emoji:"🧠", h:"À retenir", list:[
      "IoT = objets physiques + capacité de mesurer/communiquer/agir + connexion réseau.",
      "Chaîne typique : capteur → microcontrôleur → communication → gateway → cloud → application.",
      "Un capteur observe, un actionneur agit ; ce sont deux rôles complémentaires.",
      "Les contraintes de ressources des objets IoT créent des enjeux de sécurité propres à ce domaine.",
    ]},
  ],
  quiz:[
    { q:"Quel est le rôle principal d'un capteur ?", opts:["Agir sur l'environnement","Mesurer une information physique","Chiffrer une communication","Authentifier un utilisateur"], correct:1, explain:"Un capteur observe et mesure une grandeur physique (température, mouvement…) ; c'est l'actionneur qui agit ensuite sur l'environnement." },
    { q:"Quel élément relie généralement les objets IoT locaux au cloud ?", opts:["Le firewall","La gateway (passerelle)","Le SIEM","Le certificat TLS"], correct:1, explain:"La gateway agrège les données des objets connectés à proximité et les relaie vers le réseau plus large ou le cloud." },
    { q:"Pourquoi l'IoT pose-t-il des défis de sécurité particuliers ?", opts:["Parce que les objets sont toujours filaires","Parce que les objets ont des ressources limitées et sont peu mis à jour","Parce que les objets n'ont jamais d'adresse réseau","Parce que les objets fonctionnent sans électricité"], correct:1, explain:"Les contraintes de mémoire, de calcul et de batterie, combinées à des mises à jour souvent négligées, créent des risques spécifiques à l'IoT." },
  ],
  related:["m-informatique","m-capteurs","m-architecture"],
},

/* ===================================================== */
"m-capteurs": {
  category:"iot-intro",
  tag:"Module 3 · Internet des Objets",
  title:"Capteurs et actionneurs",
  desc:"Comment un objet connecté perçoit le monde et agit dessus.",
  blocks:[
    { emoji:"🎯", h:"Objectifs", body:`<ul><li>Distinguer capteur et actionneur</li><li>Connaître les principaux types de capteurs et d'actionneurs</li><li>Comprendre le cycle observation → décision → action</li></ul>` },
    { emoji:"📖", h:"Explication simple", body:`<p>Un capteur, c'est un œil ou une oreille : il observe le monde et transforme ce qu'il perçoit en donnée numérique. Un actionneur, c'est une main : il reçoit un ordre et agit physiquement sur le monde.</p>` },
    { emoji:"🔬", h:"Explication technique", body:`<p><strong>Capteurs courants :</strong> température, humidité, pression, luminosité, mouvement (PIR), distance (ultrason/infrarouge), GPS, caméra, microphone, capteur de gaz.</p>
    <p><strong>Actionneurs courants :</strong> moteur, relais, LED, serrure électronique, électrovanne, pompe, système de chauffage.</p>
    <p>Le cycle complet d'un système IoT réactif suit toujours la même logique : le capteur observe, la donnée est transmise, un système (local ou cloud) prend une décision, et l'actionneur exécute cette décision.</p>` },
    { emoji:"🏢", h:"Exemple d'entreprise", body:`<p>Dans un entrepôt logistique, un capteur de température surveille une chambre froide. Si la température dépasse un seuil, le système déclenche automatiquement un relais qui renforce la ventilation, et envoie une alerte à l'équipe technique.</p>` },
    { emoji:"🧩", h:"Schéma", diagram:
`CAPTEUR                         ACTIONNEUR
observe le monde                agit sur le monde
      │                               ▲
      ▼                               │
   DONNÉE ───────► SYSTÈME ───────► DÉCISION` },
    { emoji:"📊", h:"Tableau comparatif", table:{ head:["Capteur","Grandeur mesurée","Exemple d'usage"], rows:[
      ["Température (DHT22, DS18B20)","Chaleur ambiante","Chaîne du froid"],
      ["PIR (mouvement)","Présence humaine","Sécurité, éclairage automatique"],
      ["Gaz (MQ-2, etc.)","Concentration de gaz","Détection de fuite industrielle"],
      ["GPS","Position géographique","Suivi de flotte de véhicules"],
    ]}},
    { emoji:"⚠️", h:"Risques", body:`<div class="callout risk"><strong>Un capteur falsifié ou un actionneur détourné a un impact physique réel</strong> — contrairement à une donnée informatique classique. Manipuler la lecture d'un capteur de température dans une chaîne du froid, ou déclencher à distance un actionneur (serrure, vanne), peut avoir des conséquences directes sur la sécurité des personnes et des biens.</div>` },
    { emoji:"🛡️", h:"Mesures de protection", body:`<p>Vérifier la plausibilité des mesures (une donnée aberrante peut signaler une manipulation), limiter qui peut envoyer des commandes à un actionneur, et journaliser chaque action déclenchée à distance.</p>` },
    { emoji:"🧠", h:"À retenir", list:[
      "Capteur = observation ; actionneur = action.",
      "Le cycle observation → décision → action est au cœur de tout système IoT réactif.",
      "Un actionneur compromis a un impact physique, pas seulement numérique.",
    ]},
  ],
  quiz:[
    { q:"Lequel de ces éléments est un actionneur ?", opts:["Capteur de température","Électrovanne","GPS","Microphone"], correct:1, explain:"Une électrovanne agit physiquement (elle ouvre ou ferme un flux) : c'est un actionneur." },
    { q:"Pourquoi la sécurité d'un actionneur est-elle particulièrement sensible ?", opts:["Parce qu'il consomme plus de batterie","Parce qu'un détournement a un impact physique réel","Parce qu'il n'a jamais d'adresse réseau","Parce qu'il ne peut pas être mis à jour"], correct:1, explain:"Un actionneur compromis peut agir physiquement sur le monde réel (ouvrir une serrure, couper un système), ce qui va au-delà d'un simple risque numérique." },
  ],
  related:["m-iot-intro","m-hardware"],
},

/* ===================================================== */
"m-iot-security": {
  category:"iot-security",
  tag:"Module 22 · IoT Security (module majeur)",
  title:"Sécurité IoT — vue d'ensemble",
  desc:"Les risques propres aux objets connectés, et les grandes familles de mesures de protection — en s'appuyant notamment sur les capacités de cybersécurité IoT identifiées par le NIST.",
  blocks:[
    { emoji:"🎯", h:"Objectifs", body:`<ul>
      <li>Identifier les faiblesses les plus fréquentes des objets connectés</li>
      <li>Comprendre pourquoi la sécurité IoT diffère de la sécurité informatique classique</li>
      <li>Connaître les grandes catégories de protection recommandées (inspirées du NIST)</li>
    </ul>` },
    { emoji:"📖", h:"Explication simple", body:`<p>Un objet connecté est un petit ordinateur, souvent peu puissant, déployé en très grand nombre, parfois dans des lieux physiquement accessibles à tous, et rarement mis à jour par son propriétaire. C'est cette combinaison — ressources limitées + déploiement massif + maintenance négligée — qui rend la sécurité IoT particulièrement délicate.</p>` },
    { emoji:"🔬", h:"Explication technique", body:`<p>Les faiblesses les plus fréquemment observées sur les objets connectés :</p>
    <ul>
      <li><strong>Mots de passe par défaut</strong> jamais changés par l'utilisateur ou l'intégrateur</li>
      <li><strong>Firmware vulnérable</strong> ou obsolète, parfois jamais patché</li>
      <li><strong>Absence de mécanisme de mise à jour</strong> (pas d'OTA — Over-The-Air)</li>
      <li><strong>Interfaces exposées</strong> (ports de debug, API non protégées, interfaces web accessibles depuis Internet)</li>
      <li><strong>Communications non chiffrées</strong>, interceptables sur le réseau</li>
      <li><strong>Stockage non sécurisé</strong> des identifiants ou des clés sur l'appareil</li>
      <li><strong>Ressources matérielles faibles</strong>, limitant l'usage de chiffrement robuste</li>
      <li><strong>Chaîne d'approvisionnement</strong> — composants ou logiciels tiers déjà compromis avant l'achat</li>
      <li><strong>Fin de support</strong> — l'appareil continue de fonctionner après l'arrêt des mises à jour du fabricant</li>
      <li><strong>Mauvaise segmentation réseau</strong> — l'objet IoT partage le même réseau que des systèmes sensibles</li>
      <li><strong>Collecte excessive de données</strong>, au-delà du strict nécessaire au service rendu</li>
    </ul>` },
    { emoji:"🏢", h:"Exemple d'entreprise", body:`<p>Une entreprise installe des dizaines de caméras IP pour la vidéosurveillance de ses locaux, en conservant le mot de passe administrateur par défaut et en les plaçant sur le même réseau que les postes de travail du personnel. Un attaquant qui identifie une seule caméra vulnérable dispose alors potentiellement d'un point d'entrée vers l'ensemble du réseau interne — c'est un exemple classique de mauvaise segmentation combinée à une configuration par défaut non corrigée.</p>` },
    { emoji:"🧩", h:"Schéma — cycle de protection", diagram:
`IDENTIFICATION DE L'APPAREIL
        │
CONFIGURATION SÉCURISÉE
        │
PROTECTION DES DONNÉES
        │
CONTRÔLE DES INTERFACES
        │
MISES À JOUR (OTA sécurisées)
        │
SURVEILLANCE (état de cybersécurité)
        │
PROTECTION PHYSIQUE DE L'APPAREIL` },
    { emoji:"📊", h:"Tableau comparatif", table:{ head:["Capacité NIST","Question qu'elle pose","Exemple de mesure"], rows:[
      ["Identification du dispositif","Peut-on savoir précisément quel appareil est sur le réseau ?","Inventaire des équipements, identifiants uniques"],
      ["Configuration","L'appareil peut-il être configuré de façon sûre ?","Changer les mots de passe par défaut, désactiver les services inutiles"],
      ["Protection des données","Les données sont-elles protégées au repos et en transit ?","Chiffrement TLS, stockage chiffré"],
      ["Contrôle des interfaces","Qui peut communiquer avec l'appareil ?","Fermeture des ports inutiles, authentification des API"],
      ["Mises à jour logicielles","L'appareil peut-il être corrigé après déploiement ?","Mécanisme OTA signé et vérifié"],
      ["État de cybersécurité","Peut-on savoir si l'appareil est compromis ?","Journalisation, supervision, alertes"],
    ]}},
    { emoji:"⚠️", h:"Risques", body:`<div class="callout risk"><strong>Ce module reste volontairement au niveau conceptuel et défensif.</strong> L'objectif est de savoir reconnaître une faiblesse et en comprendre l'impact — pas de fournir une méthode d'exploitation utilisable contre un système réel.</div>` },
    { emoji:"🛡️", h:"Mesures de protection", body:`<p>Ces recommandations correspondent globalement aux capacités de cybersécurité IoT que le NIST met en avant pour guider fabricants et organisations : identification des dispositifs, configuration sécurisée, protection des données, contrôle des interfaces, gestion des mises à jour, et visibilité sur l'état de cybersécurité de chaque appareil. Elles seront reprises et approfondies dans le module « IoT Threat Modeling ».</p>` },
    { emoji:"🧠", h:"À retenir", list:[
      "La sécurité IoT combine des enjeux informatiques classiques et des contraintes physiques/matérielles propres aux objets connectés.",
      "Les faiblesses les plus fréquentes sont souvent liées à la configuration (mots de passe, mises à jour) plus qu'à des failles techniques complexes.",
      "Le NIST structure la réflexion autour de capacités : identification, configuration, protection des données, contrôle des interfaces, mise à jour, état de cybersécurité.",
      "La segmentation réseau limite l'impact d'un objet IoT compromis sur le reste du système d'information.",
    ]},
  ],
  quiz:[
    { q:"Quelle est la faiblesse IoT la plus fréquemment citée en premier ?", opts:["L'absence de GPS","Les mots de passe par défaut non changés","La couleur du boîtier","La taille de l'écran"], correct:1, explain:"Les identifiants par défaut, jamais modifiés, restent l'une des causes les plus courantes de compromission des objets connectés." },
    { q:"Pourquoi la segmentation réseau est-elle recommandée pour les objets IoT ?", opts:["Pour améliorer le débit Wi-Fi","Pour limiter l'impact d'un objet compromis sur le reste du réseau","Pour réduire la consommation électrique","Pour augmenter la portée Bluetooth"], correct:1, explain:"En isolant les objets IoT sur un réseau dédié, un appareil compromis ne peut pas facilement atteindre les systèmes sensibles de l'entreprise." },
    { q:"Que permet un mécanisme OTA (Over-The-Air) sécurisé ?", opts:["De connecter l'objet en Bluetooth","De mettre à jour le firmware à distance de façon vérifiée","De chiffrer uniquement les mots de passe","De remplacer physiquement le capteur"], correct:1, explain:"L'OTA sécurisé permet de corriger les vulnérabilités du firmware après déploiement, à condition que les mises à jour soient authentifiées et vérifiées." },
    { q:"Ce module vise à faire acquérir…", opts:["Des techniques d'attaque prêtes à l'emploi","Une compréhension conceptuelle et défensive des risques IoT","Un accès root sur des objets réels","Un outil de scan de vulnérabilités"], correct:1, explain:"L'ensemble de la plateforme reste théorique et défensif : comprendre les risques pour mieux protéger, jamais pour attaquer un système réel." },
  ],
  related:["m-iot-intro","m-threat-modeling","m-frameworks"],
},

/* ===================================================== */
"m-cyber-intro": {
  category:"cyber",
  tag:"Module 12 · Cybersécurité",
  title:"Introduction à la cybersécurité",
  desc:"Les fondations de la discipline : ce qu'elle protège, et ses trois objectifs fondamentaux (la triade CIA).",
  blocks:[
    { emoji:"🎯", h:"Objectifs", body:`<ul><li>Définir la cybersécurité et ses branches (réseau, système, applicative, données, physique)</li><li>Comprendre la triade CIA</li></ul>` },
    { emoji:"📖", h:"Explication simple", body:`<p>La cybersécurité, c'est l'ensemble des pratiques qui visent à protéger les systèmes informatiques et les données contre un usage non autorisé, une altération, ou une indisponibilité. Elle se décline en plusieurs branches : sécurité réseau, sécurité système, sécurité applicative, sécurité des données, et sécurité physique.</p>` },
    { emoji:"🔬", h:"Explication technique", body:`<p>Les trois objectifs fondamentaux de la sécurité de l'information forment la <strong>triade CIA</strong> :</p>
    <ul>
      <li><strong>Confidentiality (Confidentialité)</strong> — seules les personnes autorisées accèdent à l'information</li>
      <li><strong>Integrity (Intégrité)</strong> — l'information n'est pas altérée de façon non autorisée</li>
      <li><strong>Availability (Disponibilité)</strong> — l'information et les services restent accessibles quand on en a besoin</li>
    </ul>` },
    { emoji:"🏢", h:"Exemple d'entreprise", body:`<p>Pour une clinique qui utilise des dispositifs médicaux connectés : la <strong>confidentialité</strong> protège les dossiers patients contre un accès non autorisé, l'<strong>intégrité</strong> garantit qu'une mesure de glycémie transmise n'est pas altérée en chemin, et la <strong>disponibilité</strong> assure que le moniteur reste fonctionnel en continu, y compris en cas d'attaque par déni de service.</p>` },
    { emoji:"🧩", h:"Schéma", diagram:
`        CONFIDENTIALITY
             ▲
             │
INTEGRITY ◄──┴──► AVAILABILITY

     (triade CIA)` },
    { emoji:"⚠️", h:"Risques", body:`<div class="callout risk">La grande majorité des incidents de sécurité peuvent se lire comme une atteinte à l'un de ces trois piliers — voire aux trois à la fois. C'est une grille de lecture à garder en tête pour tout le reste du parcours.</div>` },
    { emoji:"🛡️", h:"Mesures de protection", body:`<p>Chaque mesure de sécurité peut être reliée à un ou plusieurs piliers : le chiffrement protège la confidentialité, les signatures numériques protègent l'intégrité, la redondance protège la disponibilité.</p>` },
    { emoji:"🧠", h:"À retenir", list:[
      "La triade CIA (Confidentialité, Intégrité, Disponibilité) structure tous les objectifs de sécurité.",
      "La cybersécurité couvre le réseau, le système, les applications, les données et le physique.",
    ]},
  ],
  quiz:[
    { q:"Que protège le pilier « Intégrité » de la triade CIA ?", opts:["L'accès exclusif aux personnes autorisées","La non-altération non autorisée de l'information","La disponibilité continue du service","La rapidité du réseau"], correct:1, explain:"L'intégrité garantit qu'une donnée n'a pas été modifiée de façon non autorisée, accidentelle ou malveillante." },
    { q:"Une attaque par déni de service (DDoS) vise principalement…", opts:["La confidentialité","L'intégrité","La disponibilité","Aucun des trois piliers"], correct:2, explain:"Un DDoS cherche à rendre un service indisponible en le submergeant de requêtes : c'est une atteinte à la disponibilité." },
  ],
  related:["m-menaces","m-secu-reseau"],
},

/* ===================================================== */
"m-menaces": {
  category:"cyber",
  tag:"Module 13 · Cybersécurité",
  title:"Menaces",
  desc:"Panorama conceptuel des grandes familles de menaces — comment elles fonctionnent, quel est leur impact, comment les prévenir. Aucune procédure offensive utilisable ici.",
  blocks:[
    { emoji:"🎯", h:"Objectifs", body:`<ul><li>Reconnaître les grandes familles de menaces</li><li>Comprendre leur objectif et leur impact, au niveau conceptuel</li><li>Connaître les indicateurs et les mesures de protection associées</li></ul>` },
    { emoji:"📖", h:"Explication simple", body:`<p>Une menace, c'est tout ce qui peut exploiter une faiblesse pour causer un dommage à un système ou à une organisation. Certaines menaces sont automatisées (malware), d'autres reposent sur la manipulation humaine (ingénierie sociale), d'autres encore visent à rendre un service indisponible (DDoS).</p>` },
    { emoji:"🔬", h:"Explication technique", body:`<p><strong>Malware</strong> — logiciel conçu pour nuire : le <em>virus</em> s'attache à un programme hôte, le <em>ver (worm)</em> se propage seul sur un réseau, le <em>ransomware</em> chiffre les données et exige une rançon pour les restituer, le <em>spyware</em> collecte discrètement des informations.</p>
    <p><strong>Phishing (hameçonnage)</strong> et <strong>ingénierie sociale</strong> — manipulation psychologique visant à obtenir des informations sensibles ou à faire agir la victime (cliquer un lien, transmettre un mot de passe).</p>
    <p><strong>Brute force</strong> — tentative systématique de deviner un mot de passe ou une clé par essais successifs.</p>
    <p><strong>DDoS (Distributed Denial of Service)</strong> — submersion d'un service par un très grand nombre de requêtes, souvent depuis un réseau d'appareils compromis (botnet), afin de le rendre indisponible.</p>
    <p><strong>Interception et spoofing</strong> — écoute non autorisée d'une communication, ou usurpation d'identité d'une machine ou d'un utilisateur.</p>
    <p><strong>Menace interne (insider threat)</strong> — provient d'une personne ayant déjà un accès légitime au système.</p>
    <p><strong>Attaque de la chaîne d'approvisionnement (supply-chain attack)</strong> — compromission d'un composant ou d'un logiciel avant même qu'il n'atteigne l'organisation cible.</p>` },
    { emoji:"🏢", h:"Exemple d'entreprise", body:`<p>Un employé reçoit un courriel qui imite parfaitement celui de son service informatique, lui demandant de « vérifier son mot de passe » sur un lien. C'est du <strong>phishing</strong> : l'attaque ne cible pas une faille technique, mais la confiance humaine.</p>` },
    { emoji:"🧩", h:"Schéma", diagram:
`Pour chaque menace :

DÉFINITION → OBJECTIF → FONCTIONNEMENT
   CONCEPTUEL → IMPACT → INDICATEURS
        → PROTECTION` },
    { emoji:"📊", h:"Tableau comparatif", table:{ head:["Menace","Objectif typique","Protection principale"], rows:[
      ["Ransomware","Extorsion via chiffrement des données","Sauvegardes hors-ligne, EDR, sensibilisation"],
      ["Phishing","Vol d'identifiants ou de données","Formation, filtrage des courriels, MFA"],
      ["DDoS","Rendre un service indisponible","Répartition de charge, filtrage, services anti-DDoS"],
      ["Insider threat","Abus d'un accès légitime","Principe du moindre privilège, journalisation"],
      ["Supply-chain attack","Compromission en amont","Vérification des fournisseurs, signatures logicielles"],
    ]}},
    { emoji:"⚠️", h:"Risques", body:`<div class="callout risk">Ce module décrit <strong>comment fonctionne une menace</strong>, pas comment l'exécuter contre une cible réelle. Aucune procédure offensive utilisable n'est fournie ici, conformément à l'approche 100 % théorique et défensive de cette plateforme.</div>` },
    { emoji:"🛡️", h:"Mesures de protection", body:`<p>La défense contre la majorité de ces menaces repose sur un socle commun : mises à jour régulières, sauvegardes testées, authentification forte (MFA), sensibilisation des utilisateurs, et surveillance des journaux pour détecter les comportements anormaux.</p>` },
    { emoji:"🧠", h:"À retenir", list:[
      "Les menaces se répartissent en familles : logicielles (malware), humaines (ingénierie sociale), réseau (DDoS, interception) et organisationnelles (insider, supply-chain).",
      "Comprendre le fonctionnement conceptuel d'une menace permet de bâtir une protection adaptée.",
      "La majorité des défenses efficaces reposent sur des mesures simples appliquées de façon rigoureuse et continue.",
    ]},
  ],
  quiz:[
    { q:"Quelle menace exige une rançon en échange de la restitution des données ?", opts:["Le ransomware","Le phishing","Le DDoS","Le spoofing"], correct:0, explain:"Le ransomware chiffre les données de la victime puis exige un paiement pour fournir la clé de déchiffrement." },
    { q:"Le phishing repose principalement sur…", opts:["Une faille logicielle","La manipulation psychologique de la victime","Une surcharge réseau","Un défaut matériel"], correct:1, explain:"Le phishing est une forme d'ingénierie sociale : il cible la confiance humaine plutôt qu'une vulnérabilité technique." },
    { q:"Une attaque de la chaîne d'approvisionnement (supply-chain) compromet…", opts:["Un composant ou logiciel avant même son arrivée chez la cible","Uniquement le réseau Wi-Fi","Le mot de passe administrateur","Le certificat TLS du site"], correct:0, explain:"Ce type d'attaque compromet un fournisseur, un composant ou une dépendance logicielle en amont de la chaîne, avant qu'ils n'atteignent l'organisation visée." },
  ],
  related:["m-cyber-intro","m-vulnerabilites","m-incident"],
},

/* ===================================================== */
"m-crypto": {
  category:"crypto",
  tag:"Module 16 · Cryptographie",
  title:"Cryptographie — les fondations",
  desc:"Chiffrement symétrique, asymétrique, hachage, signature numérique et PKI : les briques qui protègent la confidentialité et l'intégrité des données.",
  blocks:[
    { emoji:"🎯", h:"Objectifs", body:`<ul><li>Distinguer chiffrement symétrique et asymétrique</li><li>Comprendre le rôle du hachage et de la signature numérique</li><li>Comprendre à quoi sert une PKI et le protocole TLS</li></ul>` },
    { emoji:"📖", h:"Explication simple", body:`<p>Chiffrer, c'est transformer une information lisible en un message illisible pour qui n'a pas la bonne clé. Déchiffrer, c'est l'opération inverse. Un hash, lui, ne se déchiffre pas : c'est une empreinte unique qui permet de vérifier qu'une donnée n'a pas changé.</p>` },
    { emoji:"🔬", h:"Explication technique", body:`<p><strong>Cryptographie symétrique</strong> — la même clé sert à chiffrer et déchiffrer. Rapide, mais nécessite de partager la clé de façon sécurisée au préalable.</p>
    <p><strong>Cryptographie asymétrique</strong> — une paire de clés (publique/privée) : ce que la clé publique chiffre, seule la clé privée correspondante peut le déchiffrer. Plus lente, mais résout le problème de partage de clé.</p>
    <p><strong>Hash</strong> — fonction à sens unique qui produit une empreinte de taille fixe à partir de n'importe quelle donnée ; utile pour vérifier l'intégrité (deux fichiers identiques produisent le même hash).</p>
    <p><strong>Signature numérique</strong> — combine hash et cryptographie asymétrique pour prouver l'authenticité et l'intégrité d'un message.</p>
    <p><strong>PKI (Public Key Infrastructure)</strong> — l'ensemble des <strong>certificats</strong> et des autorités qui permettent de faire confiance à une clé publique. C'est ce mécanisme qui rend possible <strong>TLS</strong>, le protocole derrière <strong>HTTPS</strong>.</p>` },
    { emoji:"🏢", h:"Exemple d'entreprise", body:`<p>Quand vous vous connectez à un site en HTTPS, votre navigateur vérifie le <strong>certificat</strong> du serveur (délivré par une autorité de certification reconnue), puis établit une session <strong>TLS</strong> qui combine cryptographie asymétrique (pour l'échange initial de clés) et symétrique (pour chiffrer le trafic ensuite, plus rapide).</p>` },
    { emoji:"📊", h:"Tableau comparatif", table:{ head:["Type","Clé(s)","Vitesse","Usage typique"], rows:[
      ["Symétrique","Une seule clé partagée","Rapide","Chiffrement de gros volumes de données"],
      ["Asymétrique","Paire clé publique / clé privée","Plus lente","Échange de clés, signature numérique"],
      ["Hash","Aucune (fonction à sens unique)","Très rapide","Vérification d'intégrité, stockage de mots de passe"],
    ]}},
    { emoji:"⚠️", h:"Risques", body:`<div class="callout risk">Une mauvaise gestion des clés (clé faible, clé exposée, absence de rotation) annule les bénéfices de la cryptographie, même avec un algorithme robuste. Dans l'IoT en particulier, les ressources limitées des appareils compliquent l'implémentation d'une cryptographie forte — un point central du module Sécurité IoT.</div>` },
    { emoji:"🛡️", h:"Mesures de protection", body:`<p>Utiliser des algorithmes reconnus et à jour, ne jamais stocker de clé privée en clair, privilégier TLS pour toute communication sensible, et prévoir la rotation régulière des clés et certificats.</p>` },
    { emoji:"🧠", h:"À retenir", list:[
      "Symétrique = une clé, rapide ; asymétrique = deux clés, résout le partage de clé.",
      "Le hash vérifie l'intégrité, il ne chiffre pas pour permettre un déchiffrement.",
      "La PKI et les certificats rendent possible la confiance dans une clé publique — c'est le socle de HTTPS/TLS.",
    ]},
  ],
  quiz:[
    { q:"Quelle est la particularité du hachage (hash) ?", opts:["Il peut être déchiffré avec la bonne clé","C'est une fonction à sens unique servant à vérifier l'intégrité","Il chiffre les données pour les rendre confidentielles","Il remplace le certificat TLS"], correct:1, explain:"Un hash ne se déchiffre pas : il sert à produire une empreinte vérifiable, pas à protéger la confidentialité d'un message." },
    { q:"En cryptographie asymétrique, que fait la clé privée ?", opts:["Elle est partagée publiquement","Elle déchiffre ce que la clé publique correspondante a chiffré","Elle sert uniquement au hachage","Elle remplace le mot de passe"], correct:1, explain:"La clé privée reste secrète et est la seule à pouvoir déchiffrer un message chiffré avec la clé publique correspondante." },
  ],
  related:["m-auth","m-secu-reseau"],
},

};

/* ---------- GLOSSARY ---------- */
const GLOSSARY = [
  ["IoT","Internet of Things — l'ensemble des objets physiques connectés capables de mesurer, communiquer et parfois agir."],
  ["IIoT","Industrial IoT — l'application de l'IoT aux environnements industriels (usines, chaînes de production)."],
  ["Edge","Traitement des données au plus près de l'endroit où elles sont produites, plutôt que dans un cloud distant."],
  ["Gateway","Passerelle qui relaie les données des objets connectés locaux vers un réseau plus large ou le cloud."],
  ["Sensor","Capteur — composant qui mesure une grandeur physique et la transforme en donnée numérique."],
  ["Actuator","Actionneur — composant qui agit physiquement sur l'environnement à partir d'une décision reçue."],
  ["MQTT","Protocole de messagerie léger basé sur un modèle publish/subscribe, très utilisé en IoT."],
  ["CoAP","Constrained Application Protocol — protocole conçu pour les appareils à ressources très limitées."],
  ["BLE","Bluetooth Low Energy — variante du Bluetooth optimisée pour une faible consommation d'énergie."],
  ["LoRaWAN","Protocole de communication longue portée et basse consommation, adapté à l'IoT étendu."],
  ["Zigbee","Protocole de communication maillé à courte portée, courant dans la domotique."],
  ["Firmware","Logiciel embarqué qui contrôle directement le matériel d'un appareil."],
  ["OTA","Over-The-Air — mise à jour d'un appareil à distance, sans intervention physique."],
  ["TLS","Transport Layer Security — protocole qui chiffre et authentifie les communications réseau (base de HTTPS)."],
  ["PKI","Public Key Infrastructure — infrastructure de certificats et d'autorités permettant de faire confiance à des clés publiques."],
  ["Firewall","Pare-feu — système qui filtre le trafic réseau selon des règles définies."],
  ["IDS","Intrusion Detection System — système qui détecte une activité suspecte sur un réseau ou un système."],
  ["IPS","Intrusion Prevention System — comme l'IDS, mais capable de bloquer activement la menace détectée."],
  ["SIEM","Security Information and Event Management — plateforme qui centralise et corrèle les journaux de sécurité."],
  ["SOC","Security Operations Center — équipe et infrastructure dédiées à la surveillance et à la réponse aux incidents."],
  ["Zero Trust","Modèle de sécurité fondé sur le principe « ne jamais faire confiance, toujours vérifier »."],
  ["MFA","Multi-Factor Authentication — authentification combinant plusieurs facteurs (mot de passe + code, biométrie…)."],
  ["IAM","Identity and Access Management — gestion des identités et des droits d'accès."],
  ["Risk","Risque — la combinaison d'une menace, d'une vulnérabilité exploitable, et de leur impact potentiel."],
  ["Threat","Menace — ce qui pourrait exploiter une vulnérabilité pour causer un dommage."],
  ["Vulnerability","Vulnérabilité — une faiblesse dans un système, exploitable par une menace."],
  ["Exploit","Méthode ou code qui met en œuvre l'exploitation d'une vulnérabilité spécifique."],
  ["Malware","Logiciel malveillant conçu pour nuire à un système ou à ses utilisateurs."],
  ["Phishing","Hameçonnage — technique d'ingénierie sociale visant à obtenir des informations sensibles par tromperie."],
  ["Ransomware","Logiciel malveillant qui chiffre les données d'une victime et exige une rançon."],
  ["Encryption","Chiffrement — transformation d'une donnée pour la rendre illisible sans la clé appropriée."],
  ["Hash","Empreinte à sens unique d'une donnée, utilisée pour vérifier son intégrité."],
  ["Certificate","Certificat numérique attestant, via une autorité de confiance, qu'une clé publique appartient bien à une entité donnée."],
  ["API","Application Programming Interface — interface normalisée permettant à des programmes de communiquer entre eux."],
  ["Cloud","Ensemble de ressources informatiques (calcul, stockage) accessibles à distance via Internet."],
  ["SCADA","Supervisory Control and Data Acquisition — systèmes de supervision et de contrôle d'infrastructures industrielles."],
  ["ICS","Industrial Control Systems — systèmes de contrôle industriel, dont SCADA fait partie."],
  ["OT","Operational Technology — technologies utilisées pour surveiller et contrôler des équipements physiques industriels."],
  ["IT","Information Technology — technologies de l'information, par opposition à l'OT."],
  ["EDR","Endpoint Detection and Response — solution de détection et réponse aux menaces sur les postes et serveurs."],
  ["XDR","Extended Detection and Response — extension de l'EDR à plusieurs sources de données (réseau, cloud, identité)."],
];

/* ---------- CAREERS ---------- */
const CAREERS = [
  { name:"IoT Engineer", skills:"Développement embarqué, protocoles IoT, architecture capteur→cloud", level:"Junior à Confirmé" },
  { name:"IoT Security Engineer", skills:"Threat modeling IoT, hardening firmware, sécurité des communications", level:"Confirmé" },
  { name:"Cybersecurity Analyst", skills:"Surveillance des menaces, analyse de logs, réponse de premier niveau", level:"Junior à Confirmé" },
  { name:"SOC Analyst", skills:"SIEM, détection d'incidents, triage d'alertes", level:"Junior à Confirmé" },
  { name:"Security Engineer", skills:"Durcissement système, gestion des vulnérabilités, architecture sécurisée", level:"Confirmé" },
  { name:"Network Security Engineer", skills:"Firewall, VPN, segmentation, Zero Trust", level:"Confirmé" },
  { name:"Security Architect", skills:"Conception d'architectures sécurisées de bout en bout", level:"Senior" },
  { name:"Cloud Security Engineer", skills:"Sécurité des plateformes cloud, IAM, chiffrement des données", level:"Confirmé à Senior" },
  { name:"Application Security Engineer", skills:"OWASP, revue de code sécurisé, tests de sécurité applicative", level:"Confirmé" },
  { name:"Security Consultant", skills:"Audit, recommandations, accompagnement organisationnel", level:"Confirmé à Senior" },
  { name:"GRC Analyst", skills:"Gouvernance, conformité, gestion des risques (NIST, ISO 27001)", level:"Junior à Confirmé" },
  { name:"Cybersecurity Engineer", skills:"Conception et mise en œuvre de contrôles de sécurité transverses", level:"Confirmé" },
];
