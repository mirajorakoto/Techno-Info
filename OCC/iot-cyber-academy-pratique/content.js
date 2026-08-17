/* ============================================================
   CONTENT MODEL — VERSION PRATIQUE (TP / hands-on)

   Règle absolue reprise de la version théorique : tous les
   ateliers se déroulent dans un environnement que l'apprenant
   contrôle entièrement (VM locale, conteneur Docker, réseau
   isolé, matériel personnel). Aucun atelier ne cible un système
   tiers réel, un réseau public, ou un service en production
   qui ne vous appartient pas.
   ============================================================ */

const CATEGORIES = [
  { id:"fondamentaux", name:"Fondamentaux réseau", icon:"cpu", modules:[
    { id:"m-lab-reseau-local", name:"Monter un mini-réseau local de test" },
  ]},
  { id:"iot-labs", name:"Ateliers IoT", icon:"wifi", modules:[
    { id:"m-lab-mqtt", name:"Broker MQTT local avec Mosquitto" },
    { id:"m-lab-capteur-simule", name:"Simuler capteur + actionneur en Python" },
    { id:"m-lab-nodered", name:"Tableau de bord IoT avec Node-RED" },
  ]},
  { id:"iot-security-labs", name:"Ateliers IoT Security", icon:"shield", modules:[
    { id:"m-lab-hardening-iot", name:"Durcir un objet IoT simulé" },
    { id:"m-lab-tls-mqtt", name:"Sécuriser MQTT avec TLS" },
  ]},
  { id:"reseau-labs", name:"Ateliers Sécurité Réseau", icon:"network", modules:[
    { id:"m-lab-firewall", name:"Pare-feu et segmentation avec UFW" },
    { id:"m-lab-vpn", name:"Monter un VPN WireGuard local" },
  ]},
  { id:"crypto-labs", name:"Ateliers Cryptographie", icon:"key", modules:[
    { id:"m-lab-tls-cert", name:"Générer un certificat TLS avec OpenSSL" },
    { id:"m-lab-hash", name:"Vérifier l'intégrité d'un fichier par hash" },
  ]},
  { id:"systeme-labs", name:"Ateliers Sécurité Système", icon:"server", modules:[
    { id:"m-lab-hardening-linux", name:"Durcir un serveur Linux (VM)" },
  ]},
  { id:"soc-labs", name:"Ateliers Supervision", icon:"database", modules:[
    { id:"m-lab-logs", name:"Centraliser et lire des journaux (logs)" },
  ]},
];

/* ---------- LABS ---------- */
const LABS = {

/* ===================================================== */
"m-lab-reseau-local": {
  category:"fondamentaux",
  tag:"Atelier 1 · Fondamentaux réseau",
  title:"Monter un mini-réseau local de test",
  desc:"Créer deux machines virtuelles isolées, les relier sur un réseau privé, et vérifier la connectivité — le socle de tous les ateliers suivants.",
  difficulty:"Débutant",
  duration:"45 min",
  tools:["VirtualBox ou VMware","2 VM Linux (ex. Debian/Ubuntu Server)"],
  blocks:[
    { emoji:"🎯", h:"Objectifs", body:`<ul>
      <li>Créer un réseau privé isolé entre deux machines virtuelles</li>
      <li>Configurer des adresses IP statiques</li>
      <li>Vérifier la connectivité avec <code>ping</code> et <code>ip a</code></li>
    </ul>` },
    { emoji:"🧰", h:"Prérequis & environnement", body:`<p>Ce TP se déroule entièrement dans des machines virtuelles sur votre propre poste. Aucune connexion à un réseau tiers n'est nécessaire.</p>
    <div class="chip-row"><span class="chip">VirtualBox / VMware</span><span class="chip">2× VM Debian ou Ubuntu Server</span><span class="chip">Réseau « privé hôte » (Host-only)</span></div>` },
    { emoji:"📋", h:"Étapes", steps:[
      { t:"Créer le réseau privé hôte", body:`<p>Dans les paramètres réseau de votre hyperviseur, créez un réseau de type <em>Host-only</em> (VirtualBox) ou <em>Host-only/Internal</em> (VMware). Ce réseau ne sort jamais vers Internet ni vers votre réseau physique — c'est un bac à sable isolé.</p>` },
      { t:"Attacher les deux VM à ce réseau", body:`<p>Sur chaque VM, ajoutez une carte réseau reliée au réseau privé créé à l'étape 1. Démarrez les deux VM.</p>` },
      { t:"Configurer des adresses IP statiques", code:{lang:"bash", label:"vm1 — /etc/network/interfaces (ou netplan)",
        text:`# VM1
sudo ip addr add 192.168.56.10/24 dev eth1
sudo ip link set eth1 up

# VM2
sudo ip addr add 192.168.56.11/24 dev eth1
sudo ip link set eth1 up`}, body:`<p>Adaptez <code>eth1</code> au nom réel de l'interface (vérifiable avec <code>ip a</code>).</p>` },
      { t:"Vérifier la connectivité", code:{lang:"bash", label:"depuis vm1",
        text:`ping -c 4 192.168.56.11`}, body:`<p>Vous devez voir 4 réponses sans perte de paquet. C'est la preuve que les deux machines communiquent sur le réseau isolé.</p>` },
    ]},
    { emoji:"✅", h:"Vérification", checklist:[
      "Le réseau privé hôte est créé et ne route pas vers Internet",
      "Les deux VM ont chacune une IP statique dans le même sous-réseau",
      "Le ping entre les deux VM aboutit sans perte de paquet",
      "La commande `ip a` confirme l'interface et l'adresse attendues",
    ]},
    { emoji:"⚠️", h:"Cadre légal et sécurité", legal:`<strong>Restez dans votre environnement.</strong> Ce type de manipulation réseau ne doit être réalisé que sur des machines et des réseaux vous appartenant ou pour lesquels vous avez une autorisation explicite — jamais sur un réseau public ou celui d'un tiers.` },
    { emoji:"🧠", h:"Ce que vous avez appris", list:[
      "Isoler un réseau de test protège votre machine hôte et tout réseau externe pendant l'apprentissage.",
      "Une adresse IP statique garantit une communication reproductible entre deux machines.",
      "`ping` et `ip a` sont les deux premiers réflexes de diagnostic réseau.",
    ]},
  ],
  related:["m-lab-mqtt","m-lab-firewall"],
},

/* ===================================================== */
"m-lab-mqtt": {
  category:"iot-labs",
  tag:"Atelier 2 · IoT",
  title:"Broker MQTT local avec Mosquitto",
  desc:"Installer un broker MQTT sur votre machine et faire dialoguer un publisher et un subscriber — la base de toute architecture IoT événementielle.",
  difficulty:"Débutant",
  duration:"40 min",
  tools:["Mosquitto (broker + clients)","Terminal"],
  blocks:[
    { emoji:"🎯", h:"Objectifs", body:`<ul><li>Installer et démarrer un broker MQTT local</li><li>Publier et recevoir un message sur un topic</li><li>Comprendre concrètement publisher / subscriber / topic</li></ul>` },
    { emoji:"🧰", h:"Prérequis & environnement", body:`<p>Ce TP fonctionne sur votre machine ou une VM locale, sans aucune dépendance à un service cloud tiers.</p>
    <div class="chip-row"><span class="chip">Debian/Ubuntu (ou WSL)</span><span class="chip">mosquitto</span><span class="chip">mosquitto-clients</span></div>` },
    { emoji:"📋", h:"Étapes", steps:[
      { t:"Installer Mosquitto", code:{lang:"bash", label:"terminal",
        text:`sudo apt update
sudo apt install -y mosquitto mosquitto-clients
sudo systemctl enable --now mosquitto`} },
      { t:"Vérifier que le broker écoute", code:{lang:"bash", label:"terminal",
        text:`sudo ss -ltnp | grep 1883`}, body:`<p>Le port 1883 (MQTT non chiffré) doit apparaître en écoute. Nous le sécuriserons avec TLS dans l'atelier « Sécuriser MQTT avec TLS ».</p>` },
      { t:"Ouvrir un abonné (subscriber) dans un premier terminal", code:{lang:"bash", label:"terminal 1",
        text:`mosquitto_sub -h localhost -t "maison/salon/temperature"`} },
      { t:"Publier un message dans un second terminal", code:{lang:"bash", label:"terminal 2",
        text:`mosquitto_pub -h localhost -t "maison/salon/temperature" -m "21.4"`}, body:`<p>Le message <code>21.4</code> doit apparaître instantanément dans le terminal 1 : vous venez de reproduire le schéma <em>Sensor → Publisher → Broker → Subscriber</em> vu dans la partie théorique.</p>` },
    ]},
    { emoji:"✅", h:"Vérification", checklist:[
      "Le service mosquitto est actif (`systemctl status mosquitto`)",
      "Le port 1883 est bien en écoute en local",
      "Un message publié sur un topic est reçu instantanément par l'abonné",
      "Vous pouvez expliquer avec vos mots les rôles broker / publisher / subscriber / topic",
    ]},
    { emoji:"⚠️", h:"Cadre légal et sécurité", legal:`Ce broker tourne uniquement en local, sans mot de passe ni chiffrement : <strong>ne l'exposez jamais sur Internet en l'état.</strong> C'est volontaire à ce stade pour comprendre le protocole ; la sécurisation fait l'objet d'un atelier dédié.` },
    { emoji:"🧠", h:"Ce que vous avez appris", list:[
      "Un broker MQTT fait transiter des messages entre publishers et subscribers sans qu'ils se connaissent directement.",
      "Un topic est une simple chaîne hiérarchique (`maison/salon/temperature`) utilisée comme filtre.",
      "Le port 1883 est le port MQTT non chiffré par défaut — à ne jamais exposer tel quel.",
    ]},
  ],
  related:["m-lab-capteur-simule","m-lab-tls-mqtt"],
},

/* ===================================================== */
"m-lab-capteur-simule": {
  category:"iot-labs",
  tag:"Atelier 3 · IoT",
  title:"Simuler un capteur et un actionneur en Python",
  desc:"Écrire un script Python qui simule un capteur de température, publie sur MQTT, et déclenche un actionneur virtuel selon un seuil — le cycle observation → décision → action, en code.",
  difficulty:"Intermédiaire",
  duration:"55 min",
  tools:["Python 3","paho-mqtt","le broker Mosquitto de l'atelier précédent"],
  blocks:[
    { emoji:"🎯", h:"Objectifs", body:`<ul><li>Simuler un capteur avec des données générées aléatoirement</li><li>Publier ces données sur MQTT</li><li>Écrire un « cerveau » qui décide et déclenche un actionneur virtuel</li></ul>` },
    { emoji:"🧰", h:"Prérequis & environnement", body:`<p>Nécessite le broker MQTT local de l'atelier précédent, actif sur <code>localhost:1883</code>.</p>` },
    { emoji:"📋", h:"Étapes", steps:[
      { t:"Installer la librairie client MQTT pour Python", code:{lang:"bash", label:"terminal",
        text:`pip install paho-mqtt`} },
      { t:"Script du capteur simulé (publisher)", code:{lang:"python", label:"capteur.py",
        text:`import time, random, json
import paho.mqtt.client as mqtt

client = mqtt.Client()
client.connect("localhost", 1883)

while True:
    temperature = round(random.uniform(15, 35), 1)
    payload = json.dumps({"temperature": temperature})
    client.publish("maison/salon/temperature", payload)
    print(f"[capteur] publié: {payload}")
    time.sleep(2)`} },
      { t:"Script de décision + actionneur virtuel (subscriber)", code:{lang:"python", label:"actionneur.py",
        text:`import json
import paho.mqtt.client as mqtt

SEUIL = 28.0

def on_message(client, userdata, msg):
    data = json.loads(msg.payload)
    temp = data["temperature"]
    if temp > SEUIL:
        print(f"[décision] {temp}°C > seuil → ACTIONNEUR: ventilation ON")
    else:
        print(f"[décision] {temp}°C ≤ seuil → ventilation OFF")

client = mqtt.Client()
client.on_message = on_message
client.connect("localhost", 1883)
client.subscribe("maison/salon/temperature")
client.loop_forever()`} },
      { t:"Lancer les deux scripts", code:{lang:"bash", label:"deux terminaux",
        text:`# terminal 1
python3 actionneur.py

# terminal 2
python3 capteur.py`}, body:`<p>Observez le terminal « actionneur » : quand la température simulée dépasse 28°C, il affiche la décision de déclenchement — vous venez de reproduire tout le cycle <strong>capteur → donnée → décision → actionneur</strong> vu en théorie.</p>` },
    ]},
    { emoji:"✅", h:"Vérification", checklist:[
      "Le script capteur.py publie une nouvelle valeur toutes les 2 secondes",
      "Le script actionneur.py reçoit chaque message et affiche une décision",
      "Une valeur au-dessus du seuil déclenche bien le message « ventilation ON »",
      "Vous pouvez modifier le seuil et observer le changement de comportement",
    ]},
    { emoji:"⚠️", h:"Cadre légal et sécurité", legal:`Ce script se connecte uniquement à votre broker local. Si vous l'adaptez plus tard pour un vrai microcontrôleur (ESP32, Raspberry Pi), gardez la même discipline : réseau isolé, pas d'exposition directe sur Internet.` },
    { emoji:"🧠", h:"Ce que vous avez appris", list:[
      "Le cycle observation → décision → action peut se coder en quelques dizaines de lignes avec MQTT.",
      "Séparer capteur et logique de décision en deux processus distincts reflète une architecture IoT réelle.",
      "Un seuil de décision doit être documenté et ajustable, pas codé « en dur » sans réflexion.",
    ]},
  ],
  related:["m-lab-mqtt","m-lab-nodered"],
},

/* ===================================================== */
"m-lab-hardening-iot": {
  category:"iot-security-labs",
  tag:"Atelier 4 · IoT Security",
  title:"Durcir un objet IoT simulé",
  desc:"Appliquer, sur votre broker et vos scripts, les principes défensifs vus dans le module théorique Sécurité IoT : identifiants, comptes dédiés, surface d'exposition réduite.",
  difficulty:"Intermédiaire",
  duration:"50 min",
  tools:["Le broker Mosquitto des ateliers précédents"],
  blocks:[
    { emoji:"🎯", h:"Objectifs", body:`<ul><li>Remplacer un accès anonyme par une authentification par identifiants</li><li>Créer un compte dédié à privilèges limités</li><li>Réduire la surface d'exposition du broker</li></ul>` },
    { emoji:"🧰", h:"Prérequis & environnement", body:`<p>Reprend le broker Mosquitto installé dans l'atelier « Broker MQTT local ».</p>` },
    { emoji:"📋", h:"Étapes", steps:[
      { t:"Créer un fichier de mots de passe dédié", code:{lang:"bash", label:"terminal",
        text:`sudo mosquitto_passwd -c /etc/mosquitto/passwd capteur_salon
# saisissez un mot de passe fort quand demandé`} },
      { t:"Désactiver l'accès anonyme et pointer vers ce fichier", code:{lang:"bash", label:"/etc/mosquitto/conf.d/auth.conf",
        text:`allow_anonymous false
password_file /etc/mosquitto/passwd`} },
      { t:"Redémarrer le broker et tester", code:{lang:"bash", label:"terminal",
        text:`sudo systemctl restart mosquitto

# doit maintenant échouer sans identifiants :
mosquitto_pub -h localhost -t test -m "hello"

# doit réussir avec les bons identifiants :
mosquitto_pub -h localhost -u capteur_salon -P <votre_mot_de_passe> -t test -m "hello"`} },
      { t:"Documenter l'inventaire de l'appareil simulé", body:`<p>Dans un fichier <code>inventaire.md</code>, notez : nom de l'appareil, identifiant, version du firmware simulé, date de dernière mise à jour, personne responsable. Ce simple réflexe correspond à la capacité NIST « identification du dispositif » vue en théorie.</p>` },
    ]},
    { emoji:"✅", h:"Vérification", checklist:[
      "Une publication sans identifiants est désormais refusée",
      "Une publication avec les bons identifiants fonctionne",
      "Le mot de passe utilisé est unique et suffisamment complexe",
      "Un fichier d'inventaire minimal existe pour l'appareil simulé",
    ]},
    { emoji:"⚠️", h:"Cadre légal et sécurité", legal:`Cet atelier applique des mesures <strong>défensives</strong> sur un service que vous contrôlez entièrement. Ne réutilisez jamais ces techniques pour tenter de casser l'authentification d'un service qui ne vous appartient pas.` },
    { emoji:"🧠", h:"Ce que vous avez appris", list:[
      "Désactiver l'accès anonyme est souvent le changement de configuration le plus rentable en sécurité IoT.",
      "Un compte dédié par appareil facilite la traçabilité et la révocation ciblée.",
      "Documenter un inventaire, même simple, est la première brique d'une vraie posture de sécurité IoT.",
    ]},
  ],
  related:["m-lab-tls-mqtt","m-lab-mqtt"],
},

/* ===================================================== */
"m-lab-tls-mqtt": {
  category:"iot-security-labs",
  tag:"Atelier 5 · IoT Security",
  title:"Sécuriser MQTT avec TLS",
  desc:"Générer un certificat auto-signé et configurer Mosquitto pour chiffrer les communications — mettre en pratique le module théorique Cryptographie.",
  difficulty:"Avancé",
  duration:"60 min",
  tools:["OpenSSL","Mosquitto"],
  blocks:[
    { emoji:"🎯", h:"Objectifs", body:`<ul><li>Générer une autorité de certification locale et un certificat serveur</li><li>Configurer Mosquitto pour n'accepter que des connexions TLS</li><li>Vérifier qu'une connexion non chiffrée est refusée</li></ul>` },
    { emoji:"🧰", h:"Prérequis & environnement", body:`<p>Utilisé exclusivement en local — ce certificat auto-signé ne doit jamais servir sur un service public.</p>` },
    { emoji:"📋", h:"Étapes", steps:[
      { t:"Créer une autorité de certification locale", code:{lang:"bash", label:"terminal",
        text:`mkdir ~/mqtt-tls && cd ~/mqtt-tls
openssl req -new -x509 -days 365 -extensions v3_ca \\
  -keyout ca.key -out ca.crt -subj "/CN=Academy-Lab-CA"`} },
      { t:"Générer la clé et le certificat du serveur", code:{lang:"bash", label:"terminal",
        text:`openssl genrsa -out server.key 2048
openssl req -new -out server.csr -key server.key -subj "/CN=localhost"
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \\
  -CAcreateserial -out server.crt -days 365`} },
      { t:"Configurer Mosquitto pour TLS", code:{lang:"bash", label:"/etc/mosquitto/conf.d/tls.conf",
        text:`listener 8883
cafile /home/USER/mqtt-tls/ca.crt
certfile /home/USER/mqtt-tls/server.crt
keyfile /home/USER/mqtt-tls/server.key
require_certificate false`}, body:`<p>Remplacez <code>USER</code> par votre nom d'utilisateur. Redémarrez ensuite : <code>sudo systemctl restart mosquitto</code>.</p>` },
      { t:"Tester la connexion chiffrée", code:{lang:"bash", label:"terminal",
        text:`mosquitto_sub -h localhost -p 8883 --cafile ~/mqtt-tls/ca.crt -t test

# dans un autre terminal :
mosquitto_pub -h localhost -p 8883 --cafile ~/mqtt-tls/ca.crt -t test -m "chiffré !"`} },
    ]},
    { emoji:"✅", h:"Vérification", checklist:[
      "Le port 8883 (MQTT sur TLS) accepte les connexions avec le certificat CA fourni",
      "Un message publié en TLS est bien reçu par l'abonné",
      "Une tentative de connexion en clair sur 8883 (sans `--cafile`) échoue",
      "Vous pouvez expliquer le rôle de chacun des trois fichiers : CA, certificat, clé privée",
    ]},
    { emoji:"⚠️", h:"Cadre légal et sécurité", legal:`Un certificat auto-signé n'est <strong>pas reconnu par défaut</strong> par les navigateurs ou systèmes tiers : il convient à un labo, jamais à un service exposé publiquement sans une autorité de certification reconnue.` },
    { emoji:"🧠", h:"Ce que vous avez appris", list:[
      "TLS protège la confidentialité et l'intégrité du trafic MQTT en transit.",
      "Une PKI minimale repose sur trois éléments : autorité (CA), certificat, clé privée.",
      "Séparer le port 1883 (clair) du port 8883 (TLS) permet une migration progressive et contrôlée.",
    ]},
  ],
  related:["m-lab-tls-cert","m-lab-hardening-iot"],
},

/* ===================================================== */
"m-lab-firewall": {
  category:"reseau-labs",
  tag:"Atelier 6 · Sécurité Réseau",
  title:"Pare-feu et segmentation avec UFW",
  desc:"Configurer un pare-feu simple sur une VM Linux pour n'autoriser que le trafic strictement nécessaire — le principe de moindre exposition en pratique.",
  difficulty:"Débutant",
  duration:"35 min",
  tools:["UFW (Uncomplicated Firewall) sur la VM de l'atelier 1"],
  blocks:[
    { emoji:"🎯", h:"Objectifs", body:`<ul><li>Activer un pare-feu et définir une politique par défaut restrictive</li><li>N'ouvrir que les ports réellement utilisés</li><li>Vérifier concrètement l'effet des règles</li></ul>` },
    { emoji:"🧰", h:"Prérequis & environnement", body:`<p>À réaliser sur la VM Linux montée dans l'atelier « Monter un mini-réseau local de test ».</p>` },
    { emoji:"📋", h:"Étapes", steps:[
      { t:"Installer et activer UFW", code:{lang:"bash", label:"terminal",
        text:`sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing`} },
      { t:"Autoriser uniquement les ports nécessaires", code:{lang:"bash", label:"terminal",
        text:`sudo ufw allow 22/tcp        # SSH
sudo ufw allow 1883/tcp      # MQTT (labo uniquement)
sudo ufw enable`} },
      { t:"Vérifier l'état et les règles actives", code:{lang:"bash", label:"terminal",
        text:`sudo ufw status verbose`} },
      { t:"Tester depuis la seconde VM", code:{lang:"bash", label:"terminal (vm2)",
        text:`nc -zv 192.168.56.10 1883   # doit réussir
nc -zv 192.168.56.10 23     # doit échouer (port fermé)`} },
    ]},
    { emoji:"✅", h:"Vérification", checklist:[
      "La politique par défaut refuse tout le trafic entrant non explicitement autorisé",
      "Seuls les ports 22 et 1883 (dans cet exemple) sont accessibles depuis vm2",
      "`ufw status verbose` liste exactement les règles attendues, sans surprise",
      "Un port non ouvert échoue bien au test de connexion",
    ]},
    { emoji:"⚠️", h:"Cadre légal et sécurité", legal:`Testez uniquement entre vos propres machines virtuelles sur le réseau isolé créé précédemment. Scanner ou sonder des ports sur un réseau ou une machine qui ne vous appartient pas peut être illégal, même à des fins d'apprentissage.` },
    { emoji:"🧠", h:"Ce que vous avez appris", list:[
      "Une politique « tout refuser par défaut, autoriser explicitement » réduit fortement la surface d'attaque.",
      "Chaque port ouvert doit être justifié par un besoin réel documenté.",
      "Vérifier une règle de pare-feu ne se limite pas à la lire : il faut la tester activement.",
    ]},
  ],
  related:["m-lab-reseau-local","m-lab-vpn"],
},

};

/* ---------- GLOSSARY (pratique) ---------- */
const GLOSSARY = [
  ["Broker","Serveur central qui relaie les messages MQTT entre publishers et subscribers."],
  ["Topic","Chaîne hiérarchique utilisée en MQTT pour classer et filtrer les messages (ex. `maison/salon/temperature`)."],
  ["TLS","Protocole qui chiffre et authentifie une communication réseau — utilisé ici pour sécuriser MQTT."],
  ["Certificat auto-signé","Certificat généré localement sans passer par une autorité de certification publique reconnue — adapté à un labo, pas à la production publique."],
  ["UFW","Uncomplicated Firewall — surcouche simplifiée d'iptables pour gérer un pare-feu sous Linux."],
  ["Host-only network","Type de réseau virtuel isolé qui relie des VM entre elles sans sortir vers Internet."],
  ["paho-mqtt","Librairie Python permettant à un script de publier et s'abonner à un broker MQTT."],
  ["VM","Machine virtuelle — environnement isolé simulant un ordinateur complet, idéal pour s'entraîner sans risque."],
  ["Inventaire d'appareil","Registre documentant chaque objet connecté déployé (identifiant, version, responsable) — première brique de la sécurité IoT."],
  ["Politique par défaut (firewall)","Règle appliquée à tout trafic non explicitement traité par une règle plus spécifique."],
];

/* ---------- CAREERS reused for context (kept short, links back to the theory platform) ---------- */
const CAREERS = [
  { name:"IoT Security Engineer", skills:"Mise en œuvre pratique du hardening et de la sécurisation des communications IoT", level:"Confirmé" },
  { name:"SOC Analyst", skills:"Exploitation d'outils de supervision et lecture de journaux au quotidien", level:"Junior à Confirmé" },
  { name:"Network Security Engineer", skills:"Configuration concrète de pare-feux, VPN et segmentation", level:"Confirmé" },
];
