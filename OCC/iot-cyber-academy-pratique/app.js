/* ============================================================
   APP — routing, rendering, progress tracking (localStorage)
   Version pratique : remplace le quiz par une checklist
   d'auto-vérification, et ajoute le rendu des étapes / blocs
   de code des ateliers.
   ============================================================ */
const STORE_KEY = "iotcyber_practice_progress_v1";
const ICONS = {
  cpu:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>',
  wifi:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 8.5a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8.5 15.5a6 6 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></svg>',
  shield:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z"/></svg>',
  network:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="4" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 6v6M12 12 6 17M12 12l6 5"/></svg>',
  key:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="14" r="4"/><path d="M11 11 20 2M17 5l2 2M14 8l2 2"/></svg>',
  server:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/><circle cx="7" cy="7" r=".6" fill="currentColor"/><circle cx="7" cy="17" r=".6" fill="currentColor"/></svg>',
  database:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>',
};

function loadProgress(){
  try{ return JSON.parse(localStorage.getItem(STORE_KEY)) || { done:{}, checklists:{} }; }
  catch(e){ return { done:{}, checklists:{} }; }
}
function saveProgress(p){ localStorage.setItem(STORE_KEY, JSON.stringify(p)); }
let PROGRESS = loadProgress();

function allModules(){ return CATEGORIES.flatMap(c => c.modules.map(m => ({...m, catId:c.id, catName:c.name}))); }
function isAuthored(id){ return !!LABS[id]; }
function isDone(id){ return !!PROGRESS.done[id]; }
function markDone(id){ PROGRESS.done[id] = Date.now(); saveProgress(PROGRESS); }

function categoryProgress(cat){
  const total = cat.modules.length;
  const done = cat.modules.filter(m => isDone(m.id)).length;
  return { total, done, pct: total? Math.round(done/total*100) : 0 };
}
function globalProgress(){
  const mods = allModules();
  const done = mods.filter(m => isDone(m.id)).length;
  return { total: mods.length, done, pct: mods.length? Math.round(done/mods.length*100) : 0 };
}

/* ---------- routing ---------- */
function route(){
  const hash = location.hash.replace(/^#\/?/, "") || "dashboard";
  const [view, id] = hash.split("/");
  renderSidebar(view === "lab" ? id : (view === "category" ? id : null));
  if(view === "dashboard") renderDashboard();
  else if(view === "lab") renderLab(id);
  else if(view === "category") renderCategory(id);
  else if(view === "glossary") renderGlossary();
  else renderDashboard();
  window.scrollTo(0,0);
}
window.addEventListener("hashchange", route);

/* ---------- sidebar ---------- */
function renderSidebar(currentId){
  const nav = document.getElementById("nav-tree");
  nav.innerHTML = "";
  CATEGORIES.forEach(cat => {
    const containsCurrent = cat.modules.some(m => m.id === currentId) || cat.id === currentId;
    const group = document.createElement("div");
    group.className = "nav-group" + (containsCurrent ? " open active" : "");
    const prog = categoryProgress(cat);
    group.innerHTML = `
      <button class="nav-group-btn" data-cat="${cat.id}">
        <span class="dot"></span>
        ${ICONS[cat.icon]||""}
        <span>${cat.name}</span>
        <span style="margin-left:auto;font-family:var(--font-mono);font-size:10px;color:var(--text-faint)">${prog.done}/${prog.total}</span>
        <svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6 6 6-6 6"/></svg>
      </button>
      <div class="nav-items">
        ${cat.modules.map(m => `
          <a href="#/lab/${m.id}" class="nav-item ${m.id===currentId?"current":""} ${isDone(m.id)?"done":""}">
            <svg class="prog-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>
            <span>${m.name}</span>
            ${!isAuthored(m.id) ? '<span class="badge-soon">à venir</span>' : ""}
          </a>`).join("")}
      </div>`;
    group.querySelector(".nav-group-btn").addEventListener("click", () => group.classList.toggle("open"));
    nav.appendChild(group);
  });
}

document.getElementById("nav-search").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll(".nav-item").forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(q) ? "" : "none";
  });
  if(q) document.querySelectorAll(".nav-group").forEach(g => g.classList.add("open"));
});

/* ---------- dashboard ---------- */
function renderDashboard(){
  const g = globalProgress();
  const domains = CATEGORIES.map(c => ({...c, prog: categoryProgress(c)}));
  const recentIds = Object.entries(PROGRESS.done).sort((a,b)=>b[1]-a[1]).slice(0,5).map(x=>x[0]);
  const mods = allModules();
  const findMod = id => mods.find(m=>m.id===id);

  main().innerHTML = `
    <div class="topbar"><div class="crumbs"><b>ACADEMY · PRATIQUE</b> / dashboard</div></div>

    <div class="hero">
      <div class="hero-eyebrow">IoT &amp; Cybersecurity Academy — ateliers pratiques (TP)</div>
      <h1>Manipuler pour comprendre, dans un environnement que vous contrôlez</h1>
      <p>Complément hands-on de la version théorique : ${mods.length} ateliers, chacun réalisé en local, sur VM ou conteneur — jamais sur un système tiers.</p>
      <div class="hero-global">
        <div class="hero-global-top"><span>PROGRESSION GLOBALE</span><b>${g.pct}%</b></div>
        <div class="signalbar"><span style="width:${g.pct}%"></span></div>
      </div>
    </div>

    <div class="callout legal"><strong>Cadre d'utilisation :</strong> chaque atelier se déroule dans un environnement isolé vous appartenant (VM, conteneur, réseau privé). Aucun atelier ne doit être reproduit contre un système, un réseau ou un service que vous ne possédez pas ou n'êtes pas explicitement autorisé à tester.</div>

    <div class="stat-row">
      <div class="stat-card"><div class="num">${g.done}/${g.total}</div><div class="lbl">Ateliers terminés</div></div>
      <div class="stat-card"><div class="num">${Object.keys(LABS).length}</div><div class="lbl">Ateliers disponibles à ce jour</div></div>
      <div class="stat-card"><div class="num">${CATEGORIES.length}</div><div class="lbl">Domaines pratiques</div></div>
      <div class="stat-card"><div class="num">${Object.keys(PROGRESS.checklists).length}</div><div class="lbl">Checklists validées</div></div>
    </div>

    <div class="section-title">Progression par domaine</div>
    <div class="domain-grid">
      ${domains.map(d => `
        <a href="#/category/${d.id}" class="domain-card">
          <div class="domain-icon">${ICONS[d.icon]||""}</div>
          <div style="flex:1">
            <div class="dname">${d.name}</div>
            <div class="signalbar"><span style="width:${d.prog.pct}%"></span></div>
          </div>
          <div class="dpct">${d.prog.pct}%</div>
        </a>`).join("")}
    </div>

    <div class="section-title">Derniers ateliers consultés</div>
    <div class="recent-list">
      ${recentIds.length ? recentIds.map(id => {
        const m = findMod(id);
        if(!m) return "";
        return `<a href="#/lab/${id}" class="recent-item">
          <span class="ri-dot"></span>
          <span class="ri-title">${m.name}</span>
          <span class="ri-sub">${m.catName}</span>
        </a>`;
      }).join("") : `<div class="callout">Aucun atelier terminé pour l'instant. Commencez par <a href="#/lab/m-lab-reseau-local" style="color:var(--amber)">Monter un mini-réseau local de test</a>.</div>`}
    </div>

    <div class="section-title">Référence</div>
    <div class="module-grid">
      <a href="#/glossary" class="module-card"><div class="mc-index">RÉFÉRENCE</div><h3>Glossaire pratique</h3><p>${GLOSSARY.length} termes liés directement aux outils et manipulations des ateliers.</p><div class="mc-cta">Consulter →</div></a>
      <div class="module-card locked"><div class="mc-index">COMPLÉMENT</div><h3>Version théorique</h3><p>Chaque atelier renvoie aux modules conceptuels de la plateforme théorique IoT &amp; Cybersecurity Academy.</p><div class="mc-cta">Voir le zip théorique →</div></div>
    </div>
  `;
}

/* ---------- category landing ---------- */
function renderCategory(catId){
  const cat = CATEGORIES.find(c => c.id === catId);
  if(!cat) return renderDashboard();
  const prog = categoryProgress(cat);
  main().innerHTML = `
    <div class="topbar"><div class="crumbs"><a href="#/dashboard"><b>ACADEMY · PRATIQUE</b></a> / ${cat.name}</div></div>
    <div class="lesson-head">
      <div class="lh-tag">Domaine pratique</div>
      <h1>${cat.name}</h1>
      <p class="lh-desc">${prog.done} sur ${prog.total} ateliers terminés dans ce domaine.</p>
      <div class="signalbar" style="max-width:320px;margin-top:10px"><span style="width:${prog.pct}%"></span></div>
    </div>
    <div class="module-grid">
      ${cat.modules.map((m,i) => `
        <a href="#/lab/${m.id}" class="module-card ${!isAuthored(m.id)?"locked":""}">
          ${!isAuthored(m.id) ? '<span class="soon-tag">à venir</span>' : `<span class="diff-tag">${LABS[m.id].difficulty}</span>`}
          <div class="mc-index">${String(i+1).padStart(2,"0")}${isDone(m.id) ? " · ✓ terminé":""}</div>
          <h3>${m.name}</h3>
          <p>${isAuthored(m.id) ? (LABS[m.id].desc || "") : "Cet atelier est planifié dans le parcours pratique et sera bientôt disponible."}</p>
          <div class="mc-cta">${isAuthored(m.id) ? "Ouvrir l'atelier →" : "Voir la place dans le parcours →"}</div>
        </a>`).join("")}
    </div>
  `;
}

/* ---------- lab page ---------- */
function renderLab(id){
  const mods = allModules();
  const modMeta = mods.find(m => m.id === id);
  const lab = LABS[id];

  if(!lab){
    main().innerHTML = `
      <div class="topbar"><div class="crumbs"><a href="#/dashboard"><b>ACADEMY · PRATIQUE</b></a> / ${modMeta?modMeta.catName:""} / ${modMeta?modMeta.name:id}</div></div>
      <div class="lesson-head">
        <div class="lh-tag">Atelier en préparation</div>
        <h1>${modMeta ? modMeta.name : id}</h1>
        <p class="lh-desc">Cet atelier fait partie du parcours pratique complet mais son contenu n'est pas encore rédigé. Il reste visible ici pour que la progression et la structure du parcours restent cohérentes de bout en bout.</p>
      </div>
      <div class="callout">Revenez bientôt, ou explorez un autre atelier déjà disponible dans le menu de gauche.</div>
    `;
    return;
  }

  const cat = CATEGORIES.find(c => c.id === lab.category);
  const tocBlocks = lab.blocks.filter(b => b.h !== "Ce que vous avez appris");

  main().innerHTML = `
    <div class="topbar"><div class="crumbs"><a href="#/dashboard"><b>ACADEMY · PRATIQUE</b></a> / <a href="#/category/${lab.category}">${cat?cat.name:""}</a> / ${lab.title}</div></div>

    <div class="lesson-head">
      <div class="lh-tag">${lab.tag}</div>
      <h1>${lab.title}</h1>
      <p class="lh-desc">${lab.desc}</p>
      <div class="meta-row">
        <span class="meta-chip">🎚️ Niveau : <b>${lab.difficulty}</b></span>
        <span class="meta-chip">⏱️ Durée estimée : <b>${lab.duration}</b></span>
        ${lab.tools.map(t => `<span class="meta-chip">🧰 ${t}</span>`).join("")}
      </div>
    </div>

    <div class="lesson-toc">
      ${tocBlocks.map((b,i) => `<a href="#blk-${i}">${b.emoji} ${b.h}</a>`).join("")}
      <a href="#check-block">✅ Auto-vérification</a>
    </div>

    ${lab.blocks.map((b,i) => renderBlock(b,i)).join("")}

    <div class="retain-box">
      <h3>🧠 Ce que vous avez appris</h3>
      <ul>${(lab.blocks.find(b=>b.h==="Ce que vous avez appris")||{list:[]}).list.map(x=>`<li>${x}</li>`).join("")}</ul>
    </div>

    <div class="block" id="check-block">
      <div class="block-h"><span class="emoji">✅</span><h2>Auto-vérification</h2></div>
      <div id="checklist-mount"></div>
    </div>

    ${lab.related && lab.related.length ? `
    <div class="section-title">Ateliers associés</div>
    <div class="chip-row">
      ${lab.related.map(rid => {
        const rm = mods.find(m=>m.id===rid);
        return rm ? `<a href="#/lab/${rid}" class="chip">${rm.name}</a>` : "";
      }).join("")}
    </div>` : ""}

    <div class="footer-nav">
      <a href="#/category/${lab.category}" class="btn ghost">← Retour au domaine</a>
      <button class="btn" id="mark-done-btn">${isDone(id) ? "✓ Atelier marqué comme terminé" : "Marquer cet atelier comme terminé"}</button>
    </div>
  `;

  document.getElementById("mark-done-btn").addEventListener("click", () => {
    markDone(id);
    renderSidebar(id);
    document.getElementById("mark-done-btn").textContent = "✓ Atelier marqué comme terminé";
  });

  // wire copy buttons
  document.querySelectorAll(".cb-copy").forEach(btn => {
    btn.addEventListener("click", () => {
      const code = btn.parentElement.querySelector("pre").textContent;
      navigator.clipboard.writeText(code).then(() => {
        const old = btn.textContent;
        btn.textContent = "copié !";
        setTimeout(() => btn.textContent = old, 1200);
      });
    });
  });

  const checklistBlock = lab.blocks.find(b => b.checklist);
  if(checklistBlock) renderChecklist(id, checklistBlock.checklist);
}

function renderBlock(b, i){
  if(b.h === "Ce que vous avez appris") return "";
  let inner = "";
  if(b.body) inner += `<div class="block-body">${b.body}</div>`;
  if(b.legal) inner += `<div class="callout legal"><strong>⚠️ </strong>${b.legal}</div>`;
  if(b.diagram) inner += `<div class="diagram">${b.diagram}</div>`;
  if(b.table) inner += `<table class="cmp"><thead><tr>${b.table.head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${b.table.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  if(b.list) inner += `<div class="block-body"><ul>${b.list.map(x=>`<li>${x}</li>`).join("")}</ul></div>`;
  if(b.steps){
    inner += `<div class="steps">${b.steps.map(s => `
      <div class="step">
        <h4>${s.t}</h4>
        <div class="step-body">
          ${s.body||""}
          ${s.code ? renderCode(s.code) : ""}
        </div>
      </div>`).join("")}</div>`;
  }
  if(b.checklist){
    inner += `<div id="checklist-placeholder-${i}"></div>`; // actual checklist rendered separately into #checklist-mount
  }
  return `<div class="block" id="blk-${i}">
    <div class="block-h"><span class="emoji">${b.emoji}</span><h2>${b.h}</h2></div>
    ${inner}
  </div>`;
}

function renderCode(code){
  return `<div class="codeblock">
    <span class="cb-label">${code.label||code.lang}</span>
    <button class="cb-copy">copier</button>
    <pre><code>${escapeHtml(code.text)}</code></pre>
  </div>`;
}
function escapeHtml(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

/* ---------- checklist (auto-vérification) ---------- */
function renderChecklist(labId, items){
  const mount = document.getElementById("checklist-mount");
  const saved = PROGRESS.checklists[labId] || {};
  mount.innerHTML = `<div class="checklist">
    ${items.map((it,i) => `
      <div class="check-item ${saved[i]?"checked":""}">
        <input type="checkbox" id="ck-${i}" ${saved[i]?"checked":""}/>
        <label for="ck-${i}">${it}</label>
      </div>`).join("")}
    <div class="checklist-footer">
      <span class="checklist-score" id="ck-score">${Object.values(saved).filter(Boolean).length}/${items.length} validés</span>
      <button class="btn ghost" id="ck-reset">Réinitialiser</button>
    </div>
  </div>`;

  function persist(){
    const state = {};
    items.forEach((_,i) => state[i] = document.getElementById(`ck-${i}`).checked);
    PROGRESS.checklists[labId] = state;
    saveProgress(PROGRESS);
    document.getElementById("ck-score").textContent = `${Object.values(state).filter(Boolean).length}/${items.length} validés`;
  }

  items.forEach((_,i) => {
    document.getElementById(`ck-${i}`).addEventListener("change", (e) => {
      e.target.closest(".check-item").classList.toggle("checked", e.target.checked);
      persist();
    });
  });
  document.getElementById("ck-reset").addEventListener("click", () => {
    delete PROGRESS.checklists[labId];
    saveProgress(PROGRESS);
    renderChecklist(labId, items);
  });
}

/* ---------- glossary ---------- */
function renderGlossary(){
  main().innerHTML = `
    <div class="topbar"><div class="crumbs"><a href="#/dashboard"><b>ACADEMY · PRATIQUE</b></a> / Glossaire</div></div>
    <div class="lesson-head">
      <div class="lh-tag">Référence</div>
      <h1>Glossaire pratique</h1>
      <p class="lh-desc">${GLOSSARY.length} termes directement liés aux outils et manipulations des ateliers.</p>
    </div>
    <div class="nav-search" style="max-width:360px;margin:0 0 20px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      <input id="gloss-search" placeholder="Rechercher un terme…"/>
    </div>
    <div id="gloss-list"></div>
  `;
  const listEl = document.getElementById("gloss-list");
  function draw(filter){
    const f = (filter||"").toLowerCase();
    const items = GLOSSARY.filter(([t,d]) => t.toLowerCase().includes(f) || d.toLowerCase().includes(f));
    listEl.innerHTML = items.sort((a,b)=>a[0].localeCompare(b[0])).map(([t,d]) => `
      <div class="gterm"><span class="gt-name">${t}</span><div class="gt-def">${d}</div></div>
    `).join("") || `<div class="callout">Aucun terme ne correspond à « ${filter} ».</div>`;
  }
  draw("");
  document.getElementById("gloss-search").addEventListener("input", e => draw(e.target.value));
}

/* ---------- helpers ---------- */
function main(){ return document.getElementById("main"); }

/* ---------- init ---------- */
route();
