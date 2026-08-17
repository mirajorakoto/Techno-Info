/* ============================================================
   DATA-META.JS — Catégories, niveaux, environnements de lab
   Plateforme PRATIQUE — Administration Système & Réseaux
   ============================================================ */

const PLATFORM_PRACTICE = {
  titre: "Practice Lab",
  sousTitre: "De la théorie à l'infrastructure réelle",
  baseline: "Tu connais la théorie. Ici, tu apprends à faire."
};

/* ------------------------------------------------------------
   ENVIRONNEMENTS DE LABORATOIRE
   ------------------------------------------------------------ */
const ENVIRONMENTS = [
  {
    id: "virtualbox",
    nom: "VirtualBox",
    editeur: "Oracle (gratuit)",
    pourQui: "Débutant, PC personnel, Windows/Linux/Mac",
    particularites: "Interface simple, réseau Host-only et NAT faciles à configurer, snapshots gratuits illimités. Légèrement moins performant que les alternatives.",
  },
  {
    id: "vmware",
    nom: "VMware Workstation / Player",
    editeur: "Broadcom",
    pourQui: "Utilisateur voulant plus de stabilité réseau et de performance",
    particularites: "Réseau virtuel plus proche du monde pro (VMnet), meilleure gestion des ressources. Version Player gratuite pour usage non commercial, Workstation payante.",
  },
  {
    id: "hyperv",
    nom: "Hyper-V",
    editeur: "Microsoft (intégré à Windows Pro/Entreprise)",
    pourQui: "Déjà sous Windows 10/11 Pro, veut rester 100% Microsoft",
    particularites: "Intégré à Windows, pas d'install supplémentaire. Switches virtuels un peu plus techniques à comprendre au début (External/Internal/Private).",
  },
  {
    id: "proxmox",
    nom: "Proxmox VE",
    editeur: "Proxmox Server Solutions (open-source)",
    pourQui: "Veut simuler un vrai serveur d'entreprise / futur métier virtualisation",
    particularites: "S'installe sur une machine dédiée (ou en VM imbriquée), interface web façon hyperviseur d'entreprise, le plus proche de ce qu'on trouve en PME/ESN. Plus exigeant à mettre en place au départ.",
  }
];

/* ------------------------------------------------------------
   CATÉGORIES DE LABS
   ------------------------------------------------------------ */
const CATEGORIES = [
  { id: "virtualisation", label: "Virtualisation", tag: "VIRT", groupe: "Fondations lab" },
  { id: "linux",          label: "Linux Server",    tag: "LX",   groupe: "Systèmes" },
  { id: "windows",        label: "Windows Server",  tag: "WIN",  groupe: "Systèmes" },
  { id: "ad",             label: "Active Directory", tag: "AD",  groupe: "Systèmes" },
  { id: "dns",            label: "DNS",              tag: "DNS", groupe: "Services réseau" },
  { id: "dhcp",           label: "DHCP",             tag: "DHCP",groupe: "Services réseau" },
  { id: "reseau",         label: "Réseaux & VLAN",   tag: "NET", groupe: "Réseau" },
  { id: "routage",        label: "Routage",          tag: "RTG", groupe: "Réseau" },
  { id: "firewall",       label: "Firewall & VPN",   tag: "SEC", groupe: "Sécurité" },
  { id: "serveurs",       label: "Serveurs applicatifs", tag: "SRV", groupe: "Services" },
  { id: "stockage",       label: "Stockage & Backup", tag: "STO", groupe: "Services" },
  { id: "monitoring",     label: "Monitoring",       tag: "MON", groupe: "Exploitation" }
];

function findCategory(id){ return CATEGORIES.find(c => c.id === id); }

/* ------------------------------------------------------------
   NIVEAUX DE PROGRESSION GLOBALE
   ------------------------------------------------------------ */
const LEVELS = [
  { id: 1, label: "Débutant",                 seuil: 0  },
  { id: 2, label: "Technicien",                seuil: 6  },
  { id: 3, label: "Administrateur",            seuil: 14 },
  { id: 4, label: "Administrateur confirmé",   seuil: 22 },
  { id: 5, label: "Infrastructure Engineer",   seuil: 28 }
];

function computeLevel(labsDone){
  let current = LEVELS[0];
  LEVELS.forEach(l => { if(labsDone >= l.seuil) current = l; });
  return current;
}
