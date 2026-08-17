/* ============================================================
   APP — routing, rendering, progress tracking (localStorage)
   ============================================================ */
const STORE_KEY = "iotcyber_progress_v1";
const ICONS = {
  cpu:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>',
  wifi:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 8.5a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8.5 15.5a6 6 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></svg>',
  layers:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
  share:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="5" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M7.2 10.8 15.8 7.2M7.2 13.2l8.6 3.6"/></svg>',
  cloud:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 18a4.5 4.5 0 0 1-.4-9A5.5 5.5 0 0 1 17.4 7 4 4 0 0 1 17 18H7Z"/></svg>',
  shield:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z"/></svg>',
  lock:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="10" width="16" height="10" rx="1.5"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>',
  network:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="4" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 6v6M12 12 6 17M12 12l6 5"/></svg>',
  server:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/><circle cx="7" cy="7" r=".6" fill="currentColor"/><circle cx="7" cy="17" r=".6" fill="currentColor"/></svg>',
  code:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 6-6 6 6 6M15 6l6 6-6 6"/></svg>',
  key:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="14" r="4"/><path d="M11 11 20 2M17 5l2 2M14 8l2 2"/></svg>',
  "user-check":'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 10l2 2 4-4"/></svg>',
  "alert-triangle":'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 2 20h20L12 3ZM12 10v4M12 17h.01"/></svg>',
  database:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>',
  factory:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21V10l5 3V10l5 3V10l6 3v8H3Z"/></svg>',
  gavel:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m13 6 5 5M2 21h9M5 15l4-4 5 5-4 4-5-5ZM17 3l4 4-3 3-4-4 3-3Z"/></svg>',
  "file-check":'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M9 14l2 2 4-4"/></svg>',
  briefcase:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="13" rx="1.5"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
};

function loadProgress(){
  try{ return JSON.parse(localStorage.getItem(STORE_KEY)) || { done:{}, quizScores:{} }; }
  catch(e){ return { done:{}, quizScores:{} }; }
}
function saveProgress(p){ localStorage.setItem(STORE_KEY, JSON.stringify(p)); }
let PROGRESS = loadProgress();

function allModules(){ return CATEGORIES.flatMap(c => c.modules.map(m => ({...m, catId:c.id, catName:c.name}))); }
function isAuthored(id){ return !!LESSONS[id]; }
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
  renderSidebar(view === "lesson" ? id : (view === "category" ? id : null));
  if(view === "dashboard") renderDashboard();
  else if(view === "lesson") renderLesson(id);
  else if(view === "category") renderCategory(id);
  else if(view === "glossary") renderGlossary();
  else if(view === "metiers") renderMetiers();
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
          <a href="#/lesson/${m.id}" class="nav-item ${m.id===currentId?"current":""} ${isDone(m.id)?"done":""}">
            <svg class="prog-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>
            <span>${m.name}</span>
            ${!isAuthored(m.id) ? '<span class="badge-soon">à venir</span>' : ""}
          </a>`).join("")}
      </div>`;
    group.querySelector(".nav-group-btn").addEventListener("click", () => {
      group.classList.toggle("open");
    });
    nav.appendChild(group);
  });
}

document.getElementById("nav-search").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll(".nav-item").forEach(el => {
    const match = el.textContent.toLowerCase().includes(q);
    el.style.display = match ? "" : "none";
  });
  if(q){
    document.querySelectorAll(".nav-group").forEach(g => g.classList.add("open"));
  }
});

/* ---------- dashboard ---------- */
function renderDashboard(){
  const g = globalProgress();
  const domains = CATEGORIES.map(c => ({...c, prog: categoryProgress(c)}));
  const recentIds = Object.entries(PROGRESS.done).sort((a,b)=>b[1]-a[1]).slice(0,5).map(x=>x[0]);
  const mods = allModules();
  const findMod = id => mods.find(m=>m.id===id);
  const quizCount = Object.keys(PROGRESS.quizScores).length;
  const avgScore = quizCount ? Math.round(Object.values(PROGRESS.quizScores).reduce((a,b)=>a+b.pct,0)/quizCount) : 0;

  main().innerHTML = `
    <div class="topbar">
      <div class="crumbs"><b>ACADEMY</b> / dashboard</div>
    </div>

    <div class="hero">
      <div class="hero-eyebrow">IoT &amp; Cybersecurity Academy — parcours théorique</div>
      <h1>Comprendre, analyser et sécuriser les systèmes connectés</h1>
      <p>De l'informatique de base jusqu'à l'architecture IoT sécurisée en entreprise : ${mods.length} modules structurés, 100&nbsp;% théoriques et défensifs.</p>
      <div class="hero-global">
        <div class="hero-global-top"><span>PROGRESSION GLOBALE</span><b>${g.pct}%</b></div>
        <div class="signalbar"><span style="width:${g.pct}%"></span></div>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat-card"><div class="num">${g.done}/${g.total}</div><div class="lbl">Cours terminés</div></div>
      <div class="stat-card"><div class="num">${quizCount}</div><div class="lbl">Quiz complétés</div></div>
      <div class="stat-card"><div class="num">${avgScore}%</div><div class="lbl">Score moyen aux quiz</div></div>
      <div class="stat-card"><div class="num">${Object.keys(LESSONS).length}</div><div class="lbl">Cours rédigés à ce jour</div></div>
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

    <div class="section-title">Derniers cours consultés</div>
    <div class="recent-list">
      ${recentIds.length ? recentIds.map(id => {
        const m = findMod(id);
        if(!m) return "";
        return `<a href="#/lesson/${id}" class="recent-item">
          <span class="ri-dot"></span>
          <span class="ri-title">${m.name}</span>
          <span class="ri-sub">${m.catName}</span>
        </a>`;
      }).join("") : `<div class="callout">Aucun cours terminé pour l'instant. Commencez par <a href="#/lesson/m-informatique" style="color:var(--teal)">Les bases de l'informatique</a>.</div>`}
    </div>

    <div class="section-title">Glossaire &amp; métiers</div>
    <div class="module-grid">
      <a href="#/glossary" class="module-card"><div class="mc-index">RÉFÉRENCE</div><h3>Glossaire</h3><p>${GLOSSARY.length} termes clés de l'IoT et de la cybersécurité, avec recherche.</p><div class="mc-cta">Consulter →</div></a>
      <a href="#/metiers" class="module-card"><div class="mc-index">CARRIÈRE</div><h3>Quels métiers viser ?</h3><p>${CAREERS.length} métiers du domaine, compétences et niveaux associés.</p><div class="mc-cta">Explorer →</div></a>
    </div>
  `;
}

/* ---------- category landing ---------- */
function renderCategory(catId){
  const cat = CATEGORIES.find(c => c.id === catId);
  if(!cat) return renderDashboard();
  const prog = categoryProgress(cat);
  main().innerHTML = `
    <div class="topbar"><div class="crumbs"><a href="#/dashboard"><b>ACADEMY</b></a> / ${cat.name}</div></div>
    <div class="lesson-head">
      <div class="lh-tag">Domaine</div>
      <h1>${cat.name}</h1>
      <p class="lh-desc">${prog.done} sur ${prog.total} cours terminés dans ce domaine.</p>
      <div class="signalbar" style="max-width:320px;margin-top:10px"><span style="width:${prog.pct}%"></span></div>
    </div>
    <div class="module-grid">
      ${cat.modules.map((m,i) => `
        <a href="#/lesson/${m.id}" class="module-card ${!isAuthored(m.id)?"locked":""}">
          ${!isAuthored(m.id) ? '<span class="soon-tag">à venir</span>' : ""}
          <div class="mc-index">${String(i+1).padStart(2,"0")}${isDone(m.id) ? " · ✓ terminé":""}</div>
          <h3>${m.name}</h3>
          <p>${isAuthored(m.id) ? (LESSONS[m.id].desc || "") : "Ce cours est planifié dans la progression du parcours et sera bientôt disponible."}</p>
          <div class="mc-cta">${isAuthored(m.id) ? "Ouvrir le cours →" : "Voir la place dans le parcours →"}</div>
        </a>`).join("")}
    </div>
  `;
}

/* ---------- lesson ---------- */
function renderLesson(id){
  const mods = allModules();
  const modMeta = mods.find(m => m.id === id);
  const lesson = LESSONS[id];

  if(!lesson){
    main().innerHTML = `
      <div class="topbar"><div class="crumbs"><a href="#/dashboard"><b>ACADEMY</b></a> / ${modMeta? modMeta.catName : ""} / ${modMeta?modMeta.name:id}</div></div>
      <div class="lesson-head">
        <div class="lh-tag">Cours en préparation</div>
        <h1>${modMeta ? modMeta.name : id}</h1>
        <p class="lh-desc">Ce module fait partie du parcours complet mais son contenu n'est pas encore rédigé. Il reste visible ici pour que la progression et la structure du parcours restent cohérentes de bout en bout.</p>
      </div>
      <div class="callout">Revenez bientôt, ou explorez un autre module déjà disponible dans le menu de gauche.</div>
    `;
    return;
  }

  const cat = CATEGORIES.find(c => c.id === lesson.category);
  main().innerHTML = `
    <div class="topbar"><div class="crumbs"><a href="#/dashboard"><b>ACADEMY</b></a> / <a href="#/category/${lesson.category}">${cat?cat.name:""}</a> / ${lesson.title}</div></div>

    <div class="lesson-head">
      <div class="lh-tag">${lesson.tag}</div>
      <h1>${lesson.title}</h1>
      <p class="lh-desc">${lesson.desc}</p>
    </div>

    <div class="lesson-toc">
      ${lesson.blocks.map((b,i) => `<a href="#blk-${i}">${b.emoji} ${b.h}</a>`).join("")}
      <a href="#quiz-block">❓ Quiz</a>
    </div>

    ${lesson.blocks.map((b,i) => renderBlock(b,i)).join("")}

    <div class="retain-box">
      <h3>🧠 À retenir</h3>
      <ul>${(lesson.blocks.find(b=>b.h==="À retenir")||{list:[]}).list.map(x=>`<li>${x}</li>`).join("")}</ul>
    </div>

    <div class="block" id="quiz-block">
      <div class="block-h"><span class="emoji">❓</span><h2>Quiz</h2></div>
      <div id="quiz-mount"></div>
    </div>

    ${lesson.related && lesson.related.length ? `
    <div class="section-title">Concepts associés</div>
    <div class="chip-row">
      ${lesson.related.map(rid => {
        const rm = mods.find(m=>m.id===rid);
        return rm ? `<a href="#/lesson/${rid}" class="chip">${rm.name}</a>` : "";
      }).join("")}
    </div>` : ""}

    <div class="footer-nav">
      <a href="#/category/${lesson.category}" class="btn ghost">← Retour au domaine</a>
      <button class="btn" id="mark-done-btn">${isDone(id) ? "✓ Cours marqué comme terminé" : "Marquer ce cours comme terminé"}</button>
    </div>
  `;

  document.getElementById("mark-done-btn").addEventListener("click", () => {
    markDone(id);
    renderSidebar(id);
    document.getElementById("mark-done-btn").textContent = "✓ Cours marqué comme terminé";
  });

  renderQuiz(id, lesson.quiz);
}

function renderBlock(b, i){
  let inner = "";
  if(b.body) inner += `<div class="block-body">${b.body}</div>`;
  if(b.diagram) inner += `<div class="diagram">${b.diagram}</div>`;
  if(b.table) inner += `<table class="cmp"><thead><tr>${b.table.head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${b.table.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  if(b.list) inner += `<div class="block-body"><ul>${b.list.map(x=>`<li>${x}</li>`).join("")}</ul></div>`;
  if(b.h === "À retenir") return ""; // rendered separately in the retain box
  return `<div class="block" id="blk-${i}">
    <div class="block-h"><span class="emoji">${b.emoji}</span><h2>${b.h}</h2></div>
    ${inner}
  </div>`;
}

/* ---------- quiz ---------- */
function renderQuiz(lessonId, questions){
  const mount = document.getElementById("quiz-mount");
  let answered = 0, correctCount = 0;
  mount.innerHTML = `<div class="quiz">
    ${questions.map((q,qi) => `
      <div class="quiz-q" data-qi="${qi}">
        <div class="qn">Question ${qi+1}/${questions.length}</div>
        <div class="qtext">${q.q}</div>
        <div class="quiz-opts">
          ${q.opts.map((opt,oi) => `<button class="quiz-opt" data-oi="${oi}">${opt}</button>`).join("")}
        </div>
        <div class="quiz-explain"></div>
      </div>`).join("")}
    <div class="quiz-footer">
      <span class="quiz-score" id="quiz-score-${lessonId}">0/${questions.length} répondues</span>
      <button class="btn ghost" id="quiz-reset">Recommencer</button>
    </div>
  </div>`;

  function updateScore(){
    document.getElementById(`quiz-score-${lessonId}`).textContent = `${answered}/${questions.length} répondues · ${correctCount} correctes`;
    if(answered === questions.length){
      const pct = Math.round(correctCount/questions.length*100);
      PROGRESS.quizScores[lessonId] = { pct, at: Date.now() };
      saveProgress(PROGRESS);
    }
  }

  mount.querySelectorAll(".quiz-q").forEach(qEl => {
    const qi = +qEl.dataset.qi;
    const q = questions[qi];
    qEl.querySelectorAll(".quiz-opt").forEach(btn => {
      btn.addEventListener("click", () => {
        if(qEl.dataset.answered) return;
        qEl.dataset.answered = "1";
        const oi = +btn.dataset.oi;
        qEl.querySelectorAll(".quiz-opt").forEach(b => b.setAttribute("disabled","true"));
        if(oi === q.correct){ btn.classList.add("correct"); correctCount++; }
        else{
          btn.classList.add("wrong");
          qEl.querySelector(`.quiz-opt[data-oi="${q.correct}"]`).classList.add("correct");
        }
        const ex = qEl.querySelector(".quiz-explain");
        ex.textContent = q.explain;
        ex.classList.add("show");
        answered++;
        updateScore();
      });
    });
  });

  mount.querySelector("#quiz-reset").addEventListener("click", () => {
    answered = 0; correctCount = 0;
    renderQuiz(lessonId, questions);
  });
}

/* ---------- glossary ---------- */
function renderGlossary(){
  main().innerHTML = `
    <div class="topbar"><div class="crumbs"><a href="#/dashboard"><b>ACADEMY</b></a> / Glossaire</div></div>
    <div class="lesson-head">
      <div class="lh-tag">Référence</div>
      <h1>Glossaire</h1>
      <p class="lh-desc">${GLOSSARY.length} termes essentiels de l'IoT et de la cybersécurité.</p>
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

/* ---------- métiers ---------- */
function renderMetiers(){
  main().innerHTML = `
    <div class="topbar"><div class="crumbs"><a href="#/dashboard"><b>ACADEMY</b></a> / Métiers</div></div>
    <div class="lesson-head">
      <div class="lh-tag">Débouchés</div>
      <h1>Quels métiers puis-je viser ?</h1>
      <p class="lh-desc">Un aperçu des métiers accessibles en progressant dans ce parcours IoT &amp; Cybersécurité.</p>
    </div>
    <table class="cmp">
      <thead><tr><th>Métier</th><th>Compétences clés</th><th>Niveau</th></tr></thead>
      <tbody>
        ${CAREERS.map(c => `<tr><td><strong>${c.name}</strong></td><td>${c.skills}</td><td>${c.level}</td></tr>`).join("")}
      </tbody>
    </table>
  `;
}

/* ---------- helpers ---------- */
function main(){ return document.getElementById("main"); }

/* ---------- init ---------- */
route();
