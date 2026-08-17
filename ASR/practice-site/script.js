/* ============================================================
   SCRIPT.JS — Practice Lab (Admin Système & Réseaux — Pratique)
   ============================================================ */

/* ------------------------------------------------------------
   ÉTAT & STORAGE
   ------------------------------------------------------------ */
const LABS = [].concat(LABS_VIRT_LINUX, LABS_WIN_AD, LABS_NET, LABS_SEC_SRV);

const STORE_KEY = "practicelab_state_v1";
function loadState(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return {
    theme: "dark",
    doneLabs: {},        // labId -> true
    checklists: {},      // labId -> { "0": true, "1": true, ... }
    challengesDone: {},  // labId -> true
    incidentHints: {},   // incidentId -> revealed count
    incidentSolved: {},  // incidentId -> true
    interviewSeen: {},   // questionId -> true
    finalMissionItems: {}, // "missionNum-itemIdx" -> true
    recent: []            // array of labId, most recent first
  };
}
let STATE = loadState();
function saveState(){ localStorage.setItem(STORE_KEY, JSON.stringify(STATE)); }

/* ------------------------------------------------------------
   HELPERS DE PROGRESSION
   ------------------------------------------------------------ */
function labsInCategory(catId){ return LABS.filter(l => l.categorie === catId); }
function doneCountInCategory(catId){ return labsInCategory(catId).filter(l => STATE.doneLabs[l.id]).length; }
function pctInCategory(catId){
  const total = labsInCategory(catId).length;
  if(total === 0) return 0;
  return Math.round((doneCountInCategory(catId) / total) * 100);
}
function totalLabsDone(){ return Object.keys(STATE.doneLabs).filter(id => STATE.doneLabs[id]).length; }
function totalChallengesDone(){ return Object.keys(STATE.challengesDone).filter(id => STATE.challengesDone[id]).length; }
function globalPct(){
  if(LABS.length === 0) return 0;
  return Math.round((totalLabsDone() / LABS.length) * 100);
}
function pushRecent(labId){
  STATE.recent = [labId, ...STATE.recent.filter(id => id !== labId)].slice(0, 5);
}

/* ------------------------------------------------------------
   ROUTING
   ------------------------------------------------------------ */
let CURRENT_VIEW = "dashboard";
let CURRENT_PARAM = null;

function nav(view, param){
  CURRENT_VIEW = view;
  CURRENT_PARAM = param || null;
  document.querySelectorAll(".view").forEach(v => v.hidden = true);
  closeSidebarMobile();
  render();
  window.scrollTo(0,0);
}

function render(){
  renderSidebar();
  updateBreadcrumb();
  switch(CURRENT_VIEW){
    case "dashboard": renderDashboard(); show("view-dashboard"); break;
    case "category": renderCategory(CURRENT_PARAM); show("view-category"); break;
    case "lab": renderLab(CURRENT_PARAM); show("view-lab"); break;
    case "troubleshoot-hub": renderTroubleshootHub(); show("view-troubleshoot-hub"); break;
    case "incident": renderIncident(CURRENT_PARAM); show("view-incident"); break;
    case "interview-hub": renderInterviewHub(); show("view-interview-hub"); break;
    case "interview": renderInterview(CURRENT_PARAM); show("view-interview"); break;
    case "projects": renderProjects(); show("view-projects"); break;
    case "final-project": renderFinalProject(); show("view-final-project"); break;
    case "challenges": renderChallenges(); show("view-challenges"); break;
    case "progression": renderProgression(); show("view-progression"); break;
    case "environments": renderEnvironments(); show("view-environments"); break;
    default: renderDashboard(); show("view-dashboard");
  }
}
function show(id){ document.getElementById(id).hidden = false; }

function updateBreadcrumb(){
  const labels = {
    dashboard: "Dashboard", category: "Domaine", lab: "TP", "troubleshoot-hub": "Mode Panne",
    incident: "Incident", "interview-hub": "Entretien", interview: "Question",
    projects: "Projets", "final-project": "Projet Final", challenges: "Challenges",
    progression: "Progression", environments: "Environnements"
  };
  document.getElementById("breadcrumb").innerHTML = `<b>${labels[CURRENT_VIEW] || ""}</b>`;
}

/* ------------------------------------------------------------
   SIDEBAR
   ------------------------------------------------------------ */
function renderSidebar(){
  document.getElementById("sidebarPct").textContent = globalPct() + "%";
  document.getElementById("sidebarProgressFill").style.width = globalPct() + "%";

  const groups = {};
  CATEGORIES.forEach(c => { if(!groups[c.groupe]) groups[c.groupe] = []; groups[c.groupe].push(c); });

  let html = `<div class="nav-item ${CURRENT_VIEW==='dashboard'?'active':''}" onclick="nav('dashboard')">
    <span class="nav-led"></span> Dashboard</div>`;

  html += `<div class="nav-item ${CURRENT_VIEW==='environments'?'active':''}" onclick="nav('environments')">
    <span class="nav-led"></span> Environnements de lab</div>`;

  Object.keys(groups).forEach(groupName => {
    html += `<div class="nav-phase"><div class="nav-phase-label">${groupName}</div>`;
    groups[groupName].forEach(cat => {
      const pct = pctInCategory(cat.id);
      const ledClass = pct === 100 ? "done" : (pct > 0 ? "progress" : "");
      const active = CURRENT_VIEW === "category" && CURRENT_PARAM === cat.id;
      html += `<div class="nav-item ${active?'active':''}" onclick="nav('category','${cat.id}')">
        <span class="nav-led ${ledClass}"></span> ${cat.label}
        <span class="nav-item-tag">${pct}%</span></div>`;
    });
    html += `</div>`;
  });

  html += `<div class="nav-static">
    <div class="nav-item ${CURRENT_VIEW==='projects'?'active':''}" onclick="nav('projects')"><span class="nav-led"></span> Projets</div>
    <div class="nav-item ${CURRENT_VIEW==='final-project'?'active':''}" onclick="nav('final-project')"><span class="nav-led"></span> Projet Final PME</div>
    <div class="nav-item ${CURRENT_VIEW==='challenges'?'active':''}" onclick="nav('challenges')"><span class="nav-led"></span> Challenges</div>
    <div class="nav-item ${CURRENT_VIEW==='troubleshoot-hub'?'active':''}" onclick="nav('troubleshoot-hub')"><span class="nav-led"></span> Mode Panne</div>
    <div class="nav-item ${CURRENT_VIEW==='interview-hub'?'active':''}" onclick="nav('interview-hub')"><span class="nav-led"></span> Entretien d'embauche</div>
    <div class="nav-item ${CURRENT_VIEW==='progression'?'active':''}" onclick="nav('progression')"><span class="nav-led"></span> Progression détaillée</div>
  </div>`;

  document.getElementById("sidebarNav").innerHTML = html;
}

/* ------------------------------------------------------------
   DASHBOARD
   ------------------------------------------------------------ */
function renderDashboard(){
  const done = totalLabsDone();
  const level = computeLevel(done);
  document.getElementById("statPct").textContent = globalPct() + "%";
  document.getElementById("statLabs").textContent = done + " / " + LABS.length;
  document.getElementById("statChallenges").textContent = totalChallengesDone() + " / " + LABS.length;
  document.getElementById("levelLabel").textContent = level.label;
  const nextLevel = LEVELS.find(l => l.seuil > done);
  document.getElementById("levelNext").textContent = nextLevel
    ? `Prochain niveau — ${nextLevel.label} à ${nextLevel.seuil} TP terminés (encore ${nextLevel.seuil - done})`
    : "Niveau maximum atteint";

  // domaines
  let domHtml = "";
  CATEGORIES.forEach(c => {
    const pct = pctInCategory(c.id);
    domHtml += `<div class="domain-row">
      <div class="domain-row-top"><span class="name">${c.label}</span><span class="pct">${doneCountInCategory(c.id)}/${labsInCategory(c.id).length}</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>`;
  });
  document.getElementById("dashDomains").innerHTML = domHtml;

  // recents
  let recentHtml = "";
  if(STATE.recent.length === 0){
    recentHtml = `<div class="empty-state"><div class="glyph">◌</div>Aucun TP consulté pour l'instant.<br>Commence par le LAB 01 dans Virtualisation.</div>`;
  } else {
    STATE.recent.forEach(id => {
      const lab = LABS.find(l => l.id === id);
      if(!lab) return;
      const cat = findCategory(lab.categorie);
      recentHtml += `<div class="recent-item" onclick="nav('lab','${lab.id}')">
        <span class="recent-icon">${cat.tag}</span>
        <div><div class="recent-title">${lab.titre}</div><div class="recent-sub">${lab.numero}</div></div>
      </div>`;
    });
  }
  document.getElementById("recentList").innerHTML = recentHtml;
}

/* ------------------------------------------------------------
   ENVIRONMENTS VIEW
   ------------------------------------------------------------ */
function renderEnvironments(){
  let html = "";
  ENVIRONMENTS.forEach(e => {
    html += `<div class="env-card">
      <h3>${e.nom}</h3>
      <div class="env-editeur">${e.editeur}</div>
      <div class="env-pourqui">Pour qui : ${e.pourQui}</div>
      <div class="env-detail">${e.particularites}</div>
    </div>`;
  });
  document.getElementById("envGrid").innerHTML = html;
}

/* ------------------------------------------------------------
   CATEGORY VIEW
   ------------------------------------------------------------ */
function renderCategory(catId){
  const cat = findCategory(catId);
  if(!cat) return;
  document.getElementById("categoryEyebrow").textContent = cat.groupe;
  document.getElementById("categoryTitle").textContent = cat.label;
  document.getElementById("categoryDesc").textContent = `${labsInCategory(catId).length} TP disponibles dans ce domaine — progression : ${pctInCategory(catId)}%`;

  let html = "";
  labsInCategory(catId).forEach((lab, idx) => {
    const done = STATE.doneLabs[lab.id];
    html += `<div class="lesson-card ${done?'done':''}" onclick="nav('lab','${lab.id}')">
      <div class="lesson-num">${done ? '✓' : (idx+1)}</div>
      <div style="flex:1">
        <div class="lesson-title">${lab.titre}</div>
        <div class="lesson-meta">${lab.numero}</div>
      </div>
      <span class="lesson-level-tag">Niveau ${lab.niveau}</span>
      <span class="lesson-arrow">→</span>
    </div>`;
  });
  document.getElementById("categoryLabList").innerHTML = html || `<div class="empty-state">Aucun TP dans ce domaine pour l'instant.</div>`;
}

/* ------------------------------------------------------------
   LAB DETAIL VIEW
   ------------------------------------------------------------ */
function renderLab(labId){
  const lab = LABS.find(l => l.id === labId);
  if(!lab) return;
  pushRecent(lab.id); saveState();

  const cat = findCategory(lab.categorie);
  document.getElementById("labNumero").textContent = `${lab.numero} · ${cat.label}`;
  document.getElementById("labTitle").textContent = lab.titre;

  const done = STATE.doneLabs[lab.id];
  document.getElementById("doneLabBtn").textContent = done ? "✓ TP marqué comme terminé" : "○ Marquer comme terminé";
  document.getElementById("doneLabBtn").className = "pill-btn done-toggle" + (done ? " done" : "");
  document.getElementById("doneLabBtn").onclick = () => toggleLabDone(lab.id);

  const challengeDone = STATE.challengesDone[lab.id];
  document.getElementById("challengeLabBtn").textContent = challengeDone ? "✓ Challenge relevé" : "◆ Marquer le challenge comme relevé";
  document.getElementById("challengeLabBtn").className = "pill-btn done-toggle" + (challengeDone ? " done" : "");
  document.getElementById("challengeLabBtn").onclick = () => toggleChallengeDone(lab.id);

  let body = "";

  // OBJECTIF
  body += section("🎯", "Objectif", `<p>${lab.objectif}</p>`);

  // PRÉREQUIS
  body += section("🧠", "Prérequis", `<p>${lab.prerequis.join(" · ")}</p>`);

  // MACHINES
  let machinesHtml = `<div class="machines-list">`;
  lab.machines.forEach(m => { machinesHtml += `<div class="machine-item"><b>${m.nom}</b> — ${m.role}</div>`; });
  machinesHtml += `</div>`;
  body += section("🖥️", "Machines nécessaires", machinesHtml);

  // ARCHITECTURE
  body += section("🌐", "Architecture réseau", lab.architecture);

  // RESSOURCES
  const r = lab.ressources;
  let resHtml = `<div class="res-grid">`;
  if(r.iso && r.iso.length) resHtml += resItem("ISO", r.iso.join(" · "));
  if(r.ram) resHtml += resItem("RAM", r.ram);
  if(r.cpu) resHtml += resItem("CPU", r.cpu);
  if(r.disque) resHtml += resItem("Disque", r.disque);
  if(r.reseau) resHtml += resItem("Réseau", r.reseau);
  if(r.logiciels && r.logiciels.length) resHtml += resItem("Logiciels", r.logiciels.join(" · "));
  resHtml += `</div>`;
  body += section("📦", "Ressources nécessaires", resHtml);

  // ÉTAPES
  let etapesHtml = "";
  lab.etapes.forEach((etape, i) => {
    etapesHtml += `<div class="etape-block">
      <div class="etape-title">Étape ${i+1} — ${etape.titre}</div>
      ${etape.texte ? `<div class="etape-text">${escapeHtml(etape.texte)}</div>` : ""}`;
    if(etape.commandes){
      etape.commandes.forEach(c => {
        etapesHtml += `<div class="cmd-card">
          <div class="cmd-card-head">$ ${c.commande}</div>
          <div class="cmd-card-body">
            <div class="cmd-row"><span class="lbl">Objectif</span><span class="val">${c.objectif}</span></div>
            <div class="cmd-row"><span class="lbl">Syntaxe</span><span class="val code">${escapeHtml(c.syntaxe)}</span></div>
            <div class="cmd-row"><span class="lbl">Exemple</span><span class="val code">${escapeHtml(c.exemple)}</span></div>
            <div class="cmd-row"><span class="lbl">Résultat</span><span class="val">${c.resultat}</span></div>
            <div class="cmd-row"><span class="lbl">Explication</span><span class="val">${c.explication}</span></div>
            <div class="cmd-row err"><span class="lbl">Erreur poss.</span><span class="val">${c.erreur}</span></div>
          </div>
        </div>`;
      });
    }
    etapesHtml += `</div>`;
  });
  body += section("📝", "Étapes", etapesHtml);

  // VÉRIFICATION
  let verifHtml = `<ul style="margin:0;padding-left:18px;">`;
  lab.verification.forEach(v => verifHtml += `<li style="margin-bottom:6px;">${v}</li>`);
  verifHtml += `</ul>`;
  body += section("🔎", "Vérification", verifHtml);

  // ERREURS FRÉQUENTES
  let errHtml = "";
  lab.erreurs.forEach(e => {
    errHtml += `<div class="error-card">
      <div class="probleme">${e.probleme}</div>
      <div class="cause">Cause probable : ${e.cause}</div>
      <div class="diag"><b>Diagnostic —</b> ${e.diagnostic}</div>
    </div>`;
  });
  body += section("❌", "Erreurs fréquentes & diagnostic", errHtml);

  // CHALLENGE
  body += section("🧪", "Challenge", `<div class="challenge-card">${lab.challenge}</div>`);

  // VALIDATION (checklist persistante)
  const saved = STATE.checklists[lab.id] || {};
  let valHtml = `<div class="checklist">`;
  lab.validation.forEach((item, idx) => {
    const checked = !!saved[idx];
    valHtml += `<div class="checklist-item ${checked?'checked':''}" onclick="toggleChecklistItem('${lab.id}',${idx})">
      <span class="checklist-box">${checked?'✓':''}</span><span>${item}</span>
    </div>`;
  });
  valHtml += `</div>`;
  body += section("🏆", "Validation", valHtml);

  document.getElementById("labBody").innerHTML = body;
}

function section(icon, title, bodyHtml){
  return `<div class="lab-section">
    <div class="lab-section-title"><span class="ic">${icon}</span> ${title}</div>
    <div class="lab-section-body">${bodyHtml}</div>
  </div>`;
}
function resItem(k,v){ return `<div class="res-item"><div class="k">${k}</div><div>${v}</div></div>`; }
function escapeHtml(s){ return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function toggleLabDone(labId){
  STATE.doneLabs[labId] = !STATE.doneLabs[labId];
  saveState(); renderLab(labId); renderSidebar();
}
function toggleChallengeDone(labId){
  STATE.challengesDone[labId] = !STATE.challengesDone[labId];
  saveState(); renderLab(labId);
}
function toggleChecklistItem(labId, idx){
  if(!STATE.checklists[labId]) STATE.checklists[labId] = {};
  STATE.checklists[labId][idx] = !STATE.checklists[labId][idx];
  saveState(); renderLab(labId);
}

/* ------------------------------------------------------------
   MODE PANNE — TROUBLESHOOTING
   ------------------------------------------------------------ */
function renderTroubleshootHub(){
  let html = "";
  INCIDENTS.forEach(inc => {
    const solved = STATE.incidentSolved[inc.id];
    html += `<div class="incident-card ${solved?'solved':''}" onclick="nav('incident','${inc.id}')">
      <div class="incident-top">
        <div class="incident-title">${solved?'✓ ':''}${inc.titre}</div>
        <span class="incident-domain">${(findCategory(inc.domaine)||{tag:inc.domaine.toUpperCase()}).tag}</span>
      </div>
      <div class="incident-symptome">${inc.symptome}</div>
    </div>`;
  });
  document.getElementById("incidentList").innerHTML = html;
  const solvedCount = Object.keys(STATE.incidentSolved).filter(k=>STATE.incidentSolved[k]).length;
  document.getElementById("incidentStat").textContent = `${solvedCount} / ${INCIDENTS.length} incidents résolus`;
}

function renderIncident(incId){
  const inc = INCIDENTS.find(i => i.id === incId);
  if(!inc) return;
  document.getElementById("incidentTitle").textContent = inc.titre;
  document.getElementById("incidentSymptome").textContent = inc.symptome;

  const revealed = STATE.incidentHints[inc.id] || 0;
  let hintsHtml = "";
  for(let i=0; i<revealed; i++){
    hintsHtml += `<div class="hint-block"><b>Indice ${i+1}</b>${inc.indices[i]}</div>`;
  }
  document.getElementById("incidentHints").innerHTML = hintsHtml;

  const revealBtn = document.getElementById("revealHintBtn");
  if(revealed < inc.indices.length){
    revealBtn.style.display = "inline-block";
    revealBtn.textContent = `Révéler l'indice ${revealed+1} / ${inc.indices.length}`;
    revealBtn.onclick = () => { STATE.incidentHints[inc.id] = revealed+1; saveState(); renderIncident(inc.id); };
  } else {
    revealBtn.style.display = "none";
  }

  const solved = STATE.incidentSolved[inc.id];
  const solveBtn = document.getElementById("solveIncidentBtn");
  solveBtn.textContent = solved ? "✓ Incident résolu" : "Marquer comme résolu";
  solveBtn.className = "pill-btn done-toggle" + (solved?" done":"");
  solveBtn.onclick = () => { STATE.incidentSolved[inc.id] = !STATE.incidentSolved[inc.id]; saveState(); renderIncident(inc.id); renderTroubleshootHub(); };

  const solutionBox = document.getElementById("incidentSolution");
  if(solved){
    solutionBox.style.display = "block";
    solutionBox.innerHTML = `<b>Cause & Résolution</b>${inc.causePossible}<br><br>${inc.solutionResume}`;
  } else {
    solutionBox.style.display = "none";
  }
  saveState();
}

/* ------------------------------------------------------------
   MODE ENTRETIEN D'EMBAUCHE
   ------------------------------------------------------------ */
function renderInterviewHub(){
  let html = "";
  INTERVIEW_QUESTIONS.forEach(q => {
    const seen = STATE.interviewSeen[q.id];
    html += `<div class="interview-card" onclick="nav('interview','${q.id}')">
      <div class="interview-q">${seen?'✓ ':''}${q.question}</div>
    </div>`;
  });
  document.getElementById("interviewList").innerHTML = html;
}
function renderInterview(qId){
  const q = INTERVIEW_QUESTIONS.find(i => i.id === qId);
  if(!q) return;
  document.getElementById("interviewQuestion").textContent = q.question;
  document.getElementById("interviewMethodo").hidden = true;

  const btn = document.getElementById("revealMethodoBtn");
  btn.style.display = "inline-block";
  btn.onclick = () => {
    STATE.interviewSeen[q.id] = true; saveState();
    let li = "";
    q.methodologie.forEach(m => li += `<li>${m}</li>`);
    document.getElementById("interviewMethodo").innerHTML = `<ul class="methodo-list">${li}</ul>`;
    document.getElementById("interviewMethodo").hidden = false;
    btn.style.display = "none";
  };
}

/* ------------------------------------------------------------
   PROJETS PROGRESSIFS
   ------------------------------------------------------------ */
function renderProjects(){
  let html = "";
  PROJECTS.forEach(p => {
    html += `<div class="project-card">
      <div class="project-top">
        <div><div class="project-num">${p.numero}</div><div class="project-title">${p.titre}</div></div>
        <span class="project-level">Niveau ${p.niveau}</span>
      </div>
      <div class="project-desc">${p.description}</div>
      <div class="project-desc"><b style="color:var(--text)">Contraintes :</b> ${p.contraintes.join(" · ")}</div>
    </div>`;
  });
  document.getElementById("projectsList").innerHTML = html;
}

/* ------------------------------------------------------------
   PROJET FINAL — PME COMPLÈTE
   ------------------------------------------------------------ */
function renderFinalProject(){
  document.getElementById("finalTitle").textContent = FINAL_PROJECT.titre;
  document.getElementById("finalEntreprise").innerHTML =
    `<b>${FINAL_PROJECT.entreprise.nom}</b> — ${FINAL_PROJECT.entreprise.employes} employés · Services : ${FINAL_PROJECT.entreprise.services.join(", ")}`;
  document.getElementById("finalArchitecture").innerHTML = FINAL_PROJECT.architecture;

  let totalItems = 0, doneItems = 0;
  let html = "";
  FINAL_PROJECT.missions.forEach(m => {
    const key = m.numero;
    let missionDone = 0;
    html += `<div class="mission-row" id="mission-${key}">
      <div class="mission-head" onclick="toggleMissionOpen(${key})">
        <div class="mission-num">${m.numero}</div>
        <div class="mission-title">${m.titre}</div>
        <div class="mission-pct" id="missionPct-${key}"></div>
      </div>
      <div class="mission-body" id="missionBody-${key}" hidden>
        <div class="mission-desc">${m.description}</div>
        <div class="checklist">`;
    m.checklist.forEach((item, idx) => {
      totalItems++;
      const ck = STATE.finalMissionItems[key+"-"+idx];
      if(ck){ doneItems++; missionDone++; }
      html += `<div class="checklist-item ${ck?'checked':''}" onclick="toggleFinalItem(${key},${idx})">
        <span class="checklist-box">${ck?'✓':''}</span><span>${item}</span>
      </div>`;
    });
    html += `</div></div></div>`;
  });
  document.getElementById("finalMissions").innerHTML = html;

  FINAL_PROJECT.missions.forEach(m => {
    const key = m.numero;
    const done = m.checklist.filter((_,idx) => STATE.finalMissionItems[key+"-"+idx]).length;
    document.getElementById("missionPct-"+key).textContent = `${done}/${m.checklist.length}`;
  });

  const globalFinalPct = totalItems ? Math.round((doneItems/totalItems)*100) : 0;
  document.getElementById("finalGlobalPct").textContent = globalFinalPct + "%";
  document.getElementById("finalGlobalFill").style.width = globalFinalPct + "%";
}
function toggleMissionOpen(num){
  const body = document.getElementById("missionBody-"+num);
  body.hidden = !body.hidden;
}
function toggleFinalItem(missionNum, idx){
  const key = missionNum+"-"+idx;
  STATE.finalMissionItems[key] = !STATE.finalMissionItems[key];
  saveState(); renderFinalProject();
  document.getElementById("missionBody-"+missionNum).hidden = false;
}

/* ------------------------------------------------------------
   CHALLENGES (vue globale de tous les challenges)
   ------------------------------------------------------------ */
function renderChallenges(){
  let html = "";
  LABS.forEach(lab => {
    const done = STATE.challengesDone[lab.id];
    const cat = findCategory(lab.categorie);
    html += `<div class="lesson-card ${done?'done':''}" onclick="nav('lab','${lab.id}')">
      <div class="lesson-num">${done?'✓':'◆'}</div>
      <div style="flex:1">
        <div class="lesson-title">${lab.titre}</div>
        <div class="lesson-meta">${lab.numero} · ${cat.label}</div>
      </div>
      <span class="lesson-arrow">→</span>
    </div>`;
  });
  document.getElementById("challengesList").innerHTML = html;
  document.getElementById("challengesStat").textContent = `${totalChallengesDone()} / ${LABS.length} challenges relevés`;
}

/* ------------------------------------------------------------
   PROGRESSION DÉTAILLÉE + BADGES
   ------------------------------------------------------------ */
const BADGES = [
  { id:"b1", label:"Premier TP", check: () => totalLabsDone() >= 1 },
  { id:"b2", label:"Technicien", check: () => totalLabsDone() >= LEVELS[1].seuil },
  { id:"b3", label:"Administrateur", check: () => totalLabsDone() >= LEVELS[2].seuil },
  { id:"b4", label:"Maître Linux", check: () => pctInCategory("linux") === 100 },
  { id:"b5", label:"Maître Active Directory", check: () => pctInCategory("ad") === 100 },
  { id:"b6", label:"Maître Réseau", check: () => pctInCategory("reseau") === 100 && pctInCategory("routage") === 100 },
  { id:"b7", label:"10 challenges relevés", check: () => totalChallengesDone() >= 10 },
  { id:"b8", label:"Chasseur de pannes", check: () => Object.keys(STATE.incidentSolved).filter(k=>STATE.incidentSolved[k]).length >= INCIDENTS.length },
  { id:"b9", label:"Infrastructure Engineer", check: () => totalLabsDone() >= LEVELS[4].seuil }
];

function renderProgression(){
  let html = "";
  CATEGORIES.forEach(c => {
    const pct = pctInCategory(c.id);
    html += `<div class="domain-row">
      <div class="domain-row-top"><span class="name">${c.label}</span><span class="pct">${doneCountInCategory(c.id)}/${labsInCategory(c.id).length} — ${pct}%</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>`;
  });
  document.getElementById("progressDomains").innerHTML = html;

  let badgeHtml = "";
  BADGES.forEach(b => {
    const earned = b.check();
    badgeHtml += `<div class="badge ${earned?'earned':''}">${earned?'★ ':'☆ '}${b.label}</div>`;
  });
  document.getElementById("badgesRow").innerHTML = badgeHtml;
}

/* ------------------------------------------------------------
   RECHERCHE GLOBALE
   ------------------------------------------------------------ */
function setupSearch(){
  const input = document.getElementById("globalSearch");
  const resultsBox = document.getElementById("searchResults");
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if(q.length < 2){ resultsBox.innerHTML = ""; resultsBox.style.display="none"; return; }
    let matches = LABS.filter(l => l.titre.toLowerCase().includes(q) || l.numero.toLowerCase().includes(q));
    matches = matches.slice(0, 8);
    if(matches.length === 0){
      resultsBox.innerHTML = `<div class="search-result-item"><div class="srs">Aucun résultat</div></div>`;
    } else {
      resultsBox.innerHTML = matches.map(l => {
        const cat = findCategory(l.categorie);
        return `<div class="search-result-item" onclick="selectSearchResult('${l.id}')">
          <div class="srt">${l.titre}</div><div class="srs">${l.numero} · ${cat.label}</div>
        </div>`;
      }).join("");
    }
    resultsBox.style.display = "block";
  });
  document.addEventListener("click", (e) => {
    if(!e.target.closest(".sidebar-search")){ resultsBox.style.display = "none"; }
  });
}
function selectSearchResult(labId){
  document.getElementById("globalSearch").value = "";
  document.getElementById("searchResults").style.display = "none";
  nav("lab", labId);
}

/* ------------------------------------------------------------
   THEME
   ------------------------------------------------------------ */
function setupTheme(){
  document.body.setAttribute("data-theme", STATE.theme);
  updateThemeLabel();
  document.getElementById("themeToggle").addEventListener("click", () => {
    STATE.theme = STATE.theme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", STATE.theme);
    updateThemeLabel();
    saveState();
  });
}
function updateThemeLabel(){
  document.getElementById("themeLabel").textContent = STATE.theme === "dark" ? "Sombre" : "Clair";
}

/* ------------------------------------------------------------
   MOBILE SIDEBAR
   ------------------------------------------------------------ */
function closeSidebarMobile(){
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("scrim").classList.remove("open");
}
function setupMobileNav(){
  document.getElementById("menuBtn").addEventListener("click", () => {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("scrim").classList.add("open");
  });
  document.getElementById("scrim").addEventListener("click", closeSidebarMobile);
}

/* ------------------------------------------------------------
   INIT
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  setupTheme();
  setupSearch();
  setupMobileNav();
  nav("dashboard");
});
