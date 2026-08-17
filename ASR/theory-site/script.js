/* ============================================================
   SCRIPT.JS — Administration Système & Réseaux
   ============================================================ */

const STORAGE_KEY = "sysnet_state_v1";

const state = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return Object.assign(defaultState(), JSON.parse(raw));
  }catch(e){ /* ignore */ }
  return defaultState();
}
function defaultState(){
  return {
    theme: "dark",
    completed: {},       // lessonId -> true
    favorites: {},        // lessonId -> true
    quizScores: {},        // moduleId -> {correct, total, pct}
    recent: [],             // [{lessonId, moduleId, ts}]
    notes: {}                // lessonId -> text (reserved for future use)
  };
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ------------------------------------------------------------
   HELPERS — flatten data
   ------------------------------------------------------------ */
function allLessons(){
  const out = [];
  MODULES.forEach(m => m.lessons.forEach(l => out.push({...l, moduleId: m.id, moduleTitre: m.titre, moduleTag: m.tag, moduleNiveau: m.niveau})));
  return out;
}
function findModule(id){ return MODULES.find(m => m.id === id); }
function findLesson(id){ return allLessons().find(l => l.id === id); }

function moduleProgress(mod){
  const total = mod.lessons.length;
  const done = mod.lessons.filter(l => state.completed[l.id]).length;
  return { total, done, pct: total ? Math.round((done/total)*100) : 0 };
}
function globalProgress(){
  const total = allLessons().length;
  const done = allLessons().filter(l => state.completed[l.id]).length;
  return { total, done, pct: total ? Math.round((done/total)*100) : 0 };
}
function modulesCompletedCount(){
  return MODULES.filter(m => moduleProgress(m).pct === 100).length;
}
function averageQuizScore(){
  const scores = Object.values(state.quizScores);
  if(!scores.length) return 0;
  const sum = scores.reduce((a,s) => a + (s.pct||0), 0);
  return Math.round(sum / scores.length);
}

/* ------------------------------------------------------------
   THEME
   ------------------------------------------------------------ */
function applyTheme(){
  document.body.setAttribute("data-theme", state.theme);
  document.getElementById("themeLabel").textContent = state.theme === "dark" ? "Sombre" : "Clair";
  document.getElementById("themeIcon").innerHTML = state.theme === "dark"
    ? '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'
    : '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
}
document.getElementById("themeToggle").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  saveState(); applyTheme();
});

/* ------------------------------------------------------------
   SIDEBAR NAV — build from MODULES grouped by phase
   ------------------------------------------------------------ */
function renderSidebarNav(){
  const nav = document.getElementById("sidebarNav");
  const phases = [];
  MODULES.forEach(m => { if(!phases.includes(m.phase)) phases.push(m.phase); });

  let html = `<div class="nav-item" data-nav="dashboard"><span class="nav-led"></span><span>Dashboard</span></div>`;

  phases.forEach(phase => {
    html += `<div class="nav-phase"><div class="nav-phase-label">${phase}</div>`;
    MODULES.filter(m => m.phase === phase).forEach(m => {
      const p = moduleProgress(m);
      const ledClass = p.pct === 100 ? "done" : (p.done > 0 ? "progress" : "");
      html += `<div class="nav-item" data-nav="module" data-id="${m.id}">
        <span class="nav-led ${ledClass}"></span>
        <span>${m.titre}</span>
        <span class="nav-item-tag">${m.tag}</span>
      </div>`;
    });
    html += `</div>`;
  });

  html += `<div class="nav-static">
    <div class="nav-item" data-nav="quiz"><span class="nav-led"></span><span>Quiz</span></div>
    <div class="nav-item" data-nav="glossaire"><span class="nav-led"></span><span>Glossaire</span></div>
    <div class="nav-item" data-nav="progression"><span class="nav-led"></span><span>Progression</span></div>
    <div class="nav-item" data-nav="favoris"><span class="nav-led"></span><span>Favoris</span></div>
  </div>`;

  nav.innerHTML = html;
  nav.querySelectorAll("[data-nav]").forEach(el => {
    el.addEventListener("click", () => {
      const nav_ = el.getAttribute("data-nav");
      if(nav_ === "module") goModule(el.getAttribute("data-id"));
      else goView(nav_);
      closeSidebarMobile();
    });
  });
}

function updateSidebarProgress(){
  const g = globalProgress();
  document.getElementById("sidebarPct").textContent = g.pct + "%";
  document.getElementById("sidebarProgressFill").style.width = g.pct + "%";
}

function highlightActiveNav(kind, id){
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  if(kind === "module"){
    const el = document.querySelector(`.nav-item[data-nav="module"][data-id="${id}"]`);
    if(el) el.classList.add("active");
  } else {
    const el = document.querySelector(`.nav-item[data-nav="${kind}"]`);
    if(el) el.classList.add("active");
  }
}

/* ------------------------------------------------------------
   VIEW ROUTER
   ------------------------------------------------------------ */
const VIEWS = ["dashboard","module","lesson","quiz","quiz-run","glossaire","progression","favoris"];
function showView(name){
  VIEWS.forEach(v => {
    const el = document.getElementById("view-" + v);
    if(el) el.hidden = (v !== name);
  });
  window.scrollTo({top:0, behavior:"instant" in window ? "instant" : "auto"});
}
function setBreadcrumb(html){ document.getElementById("breadcrumb").innerHTML = html; }

function goView(name){
  if(name === "dashboard"){ renderDashboard(); showView("dashboard"); setBreadcrumb("<b>Dashboard</b>"); highlightActiveNav("dashboard"); }
  else if(name === "quiz"){ renderQuizHub(); showView("quiz"); setBreadcrumb("<b>Quiz</b>"); highlightActiveNav("quiz"); }
  else if(name === "glossaire"){ renderGlossary(); showView("glossaire"); setBreadcrumb("<b>Glossaire</b>"); highlightActiveNav("glossaire"); }
  else if(name === "progression"){ renderProgression(); showView("progression"); setBreadcrumb("<b>Progression</b>"); highlightActiveNav("progression"); }
  else if(name === "favoris"){ renderFavorites(); showView("favoris"); setBreadcrumb("<b>Favoris</b>"); highlightActiveNav("favoris"); }
}

function goModule(moduleId){
  const mod = findModule(moduleId);
  if(!mod) return;
  document.getElementById("moduleEyebrow").textContent = "NIVEAU " + mod.niveau;
  document.getElementById("moduleTitle").textContent = mod.titre;
  document.getElementById("moduleDesc").textContent = mod.resume;

  const list = document.getElementById("lessonList");
  list.innerHTML = mod.lessons.map((l, i) => {
    const done = !!state.completed[l.id];
    return `<div class="lesson-card ${done ? "done":""}" data-lesson="${l.id}">
      <div class="lesson-num">${done ? "✓" : (i+1)}</div>
      <div>
        <div class="lesson-title">${l.titre}</div>
        <div class="lesson-meta">${l.objectifs.length} objectifs · Quiz inclus</div>
      </div>
      <div class="lesson-arrow">→</div>
    </div>`;
  }).join("");
  list.querySelectorAll("[data-lesson]").forEach(el => {
    el.addEventListener("click", () => goLesson(el.getAttribute("data-lesson")));
  });

  showView("module");
  setBreadcrumb(`<span>Niveau ${mod.niveau}</span> › <b>${mod.titre}</b>`);
  highlightActiveNav("module", mod.id);
}

function goLesson(lessonId){
  const l = findLesson(lessonId);
  if(!l) return;

  // track recent
  state.recent = state.recent.filter(r => r.lessonId !== lessonId);
  state.recent.unshift({lessonId, moduleId: l.moduleId, ts: Date.now()});
  state.recent = state.recent.slice(0, 6);
  saveState();

  document.getElementById("lessonTag").textContent = `NIVEAU ${l.moduleNiveau} · ${l.moduleTitre}`;
  document.getElementById("lessonTitle").textContent = l.titre;

  const favBtn = document.getElementById("favLessonBtn");
  const doneBtn = document.getElementById("doneLessonBtn");
  const isFav = !!state.favorites[lessonId];
  const isDone = !!state.completed[lessonId];
  favBtn.textContent = isFav ? "★ Retiré des favoris" : "☆ Ajouter aux favoris";
  favBtn.className = "pill-btn" + (isFav ? " on" : "");
  doneBtn.textContent = isDone ? "✓ Terminé" : "○ Marquer comme terminé";
  doneBtn.className = "pill-btn" + (isDone ? " done-on" : "");

  favBtn.onclick = () => {
    if(state.favorites[lessonId]) delete state.favorites[lessonId];
    else state.favorites[lessonId] = true;
    saveState(); goLesson(lessonId);
  };
  doneBtn.onclick = () => {
    if(state.completed[lessonId]) delete state.completed[lessonId];
    else state.completed[lessonId] = true;
    saveState(); goLesson(lessonId); renderSidebarNav(); updateSidebarProgress();
  };

  document.getElementById("lessonBody").innerHTML = renderLessonBody(l);

  // wire inline quiz
  wireQuiz(document.getElementById("lessonBody"), l.quiz, `lesson-${l.id}`, null);

  showView("lesson");
  setBreadcrumb(`<span>${l.moduleTitre}</span> › <b>${l.titre}</b>`);
  renderSidebarNav(); // refresh active state after possible completion changes elsewhere
  highlightActiveNav("module", l.moduleId);
}

function renderLessonBody(l){
  const section = (num, title, bodyHtml) => `
    <div class="lesson-section">
      <div class="lesson-section-head"><div class="lesson-section-num">${num}</div><h3>${title}</h3></div>
      <div class="lesson-section-body">${bodyHtml}</div>
    </div>`;

  const objectifsHtml = `<ul class="objectifs-list">${l.objectifs.map(o => `<li>${o}</li>`).join("")}</ul>`;
  const introHtml = `<p>${l.intro}</p>`;
  const theorieHtml = l.theorie.map(t => `<div class="theory-block"><h4>${t.titre}</h4><p>${t.texte}</p></div>`).join("");
  const exempleHtml = `<div class="callout exemple"><b>Cas d'entreprise</b>${l.exemple}</div>`;
  const schemaHtml = `<div style="overflow-x:auto; padding:6px 0;">${l.schema}</div>`;
  const vocabHtml = `<div class="vocab-grid">${l.vocabulaire.map(v => `<div class="vocab-card"><div class="vocab-term">${v.terme}</div><div class="vocab-def">${v.def}</div></div>`).join("")}</div>`;
  const erreursHtml = `<ul class="erreurs-list">${l.erreurs.map(e => `<li>${e}</li>`).join("")}</ul>`;
  const resumeHtml = `<div class="callout"><b>À retenir</b>${l.resume}</div>`;
  const plusLoinHtml = `<div class="plusloin-list">${l.plusLoin.map(p => `<div class="plusloin-item">${p}</div>`).join("")}</div>`;

  return [
    section(1, "Objectifs", objectifsHtml),
    section(2, "Introduction", introHtml),
    section(3, "Théorie", theorieHtml),
    section(4, "Exemple", exempleHtml),
    section(5, "Schéma", schemaHtml),
    section(6, "Vocabulaire", vocabHtml),
    section(7, "Erreurs fréquentes", erreursHtml),
    section(8, "Résumé", resumeHtml),
    `<div class="lesson-section"><div class="lesson-section-head"><div class="lesson-section-num">9</div><h3>Quiz</h3></div><div class="lesson-section-body" id="quiz-container-lesson-${l.id}"></div></div>`,
    section(10, "Pour aller plus loin", plusLoinHtml)
  ].join("");
}

/* ------------------------------------------------------------
   QUIZ ENGINE (reused for lesson quiz + quiz hub)
   ------------------------------------------------------------ */
function wireQuiz(container, questions, key, onFinish){
  const target = container.querySelector(`#quiz-container-${key}`) || container;
  const state_local = { answered: new Array(questions.length).fill(-1) };

  function render(){
    let html = questions.map((q, qi) => {
      const answered = state_local.answered[qi];
      const optsHtml = q.options.map((opt, oi) => {
        let cls = "quiz-option";
        if(answered !== -1){
          cls += " locked";
          if(oi === q.correct) cls += " correct";
          else if(oi === answered) cls += " wrong";
        }
        return `<button class="${cls}" data-qi="${qi}" data-oi="${oi}" ${answered !== -1 ? "disabled" : ""}>${opt}</button>`;
      }).join("");
      const explainHtml = answered !== -1
        ? `<div class="quiz-explain show">${q.explanations[answered]}</div>`
        : "";
      return `<div class="quiz-card">
        <div class="quiz-q">${qi+1}. ${q.q}</div>
        <div class="quiz-options">${optsHtml}</div>
        ${explainHtml}
      </div>`;
    }).join("");

    const allAnswered = state_local.answered.every(a => a !== -1);
    if(allAnswered){
      const correctCount = state_local.answered.filter((a,i) => a === questions[i].correct).length;
      const pct = Math.round((correctCount/questions.length)*100);
      html += `<div class="quiz-score"><div class="big">${pct}%</div><div style="color:var(--text-dim); font-size:12.5px; margin-top:6px;">${correctCount} / ${questions.length} bonnes réponses</div></div>`;
      if(onFinish) onFinish(correctCount, questions.length, pct);
    }

    target.innerHTML = html;
    target.querySelectorAll(".quiz-option:not([disabled])").forEach(btn => {
      btn.addEventListener("click", () => {
        const qi = parseInt(btn.getAttribute("data-qi"));
        const oi = parseInt(btn.getAttribute("data-oi"));
        state_local.answered[qi] = oi;
        render();
      });
    });
  }
  render();
}

function renderQuizHub(){
  const list = document.getElementById("quizModuleList");
  list.innerHTML = MODULES.map(m => {
    const totalQ = m.lessons.reduce((a,l) => a + l.quiz.length, 0);
    const score = state.quizScores[m.id];
    return `<div class="lesson-card ${score && score.pct === 100 ? "done":""}" data-quizmod="${m.id}">
      <div class="lesson-num">${m.tag}</div>
      <div>
        <div class="lesson-title">${m.titre}</div>
        <div class="lesson-meta">${totalQ} questions ${score ? "· Dernier score : " + score.pct + "%" : ""}</div>
      </div>
      <div class="lesson-arrow">→</div>
    </div>`;
  }).join("");
  list.querySelectorAll("[data-quizmod]").forEach(el => {
    el.addEventListener("click", () => runModuleQuiz(el.getAttribute("data-quizmod")));
  });
}

function runModuleQuiz(moduleId){
  const mod = findModule(moduleId);
  if(!mod) return;
  const questions = [];
  mod.lessons.forEach(l => l.quiz.forEach(q => questions.push(q)));

  document.getElementById("quizRunEyebrow").textContent = "QUIZ · NIVEAU " + mod.niveau;
  document.getElementById("quizRunTitle").textContent = mod.titre;
  const body = document.getElementById("quizRunBody");
  body.innerHTML = `<div id="quiz-container-modrun-${mod.id}"></div>`;

  wireQuiz(body, questions, `modrun-${mod.id}`, (correct, total, pct) => {
    state.quizScores[mod.id] = { correct, total, pct };
    saveState();
  });

  showView("quiz-run");
  setBreadcrumb(`<span>Quiz</span> › <b>${mod.titre}</b>`);
  highlightActiveNav("quiz");
}

/* ------------------------------------------------------------
   GLOSSARY
   ------------------------------------------------------------ */
function renderGlossary(filter){
  const grid = document.getElementById("glossaryGrid");
  const q = (filter||"").toLowerCase().trim();
  const items = GLOSSAIRE.filter(g => !q || g.terme.toLowerCase().includes(q) || g.def.toLowerCase().includes(q));
  grid.innerHTML = items.length ? items.map(g => `<div class="vocab-card"><div class="vocab-term">${g.terme}</div><div class="vocab-def">${g.def}</div></div>`).join("")
    : `<div class="empty-state"><div class="glyph">∅</div>Aucun terme trouvé.</div>`;
}
document.getElementById("glossarySearch").addEventListener("input", (e) => renderGlossary(e.target.value));

/* ------------------------------------------------------------
   DASHBOARD
   ------------------------------------------------------------ */
function renderDashboard(){
  const g = globalProgress();
  document.getElementById("statPct").textContent = g.pct + "%";
  document.getElementById("statModules").textContent = modulesCompletedCount() + " / " + MODULES.length;
  document.getElementById("statQuiz").textContent = averageQuizScore() + "%";

  const backbone = document.getElementById("dashBackbone");
  backbone.innerHTML = MODULES.map(m => {
    const p = moduleProgress(m);
    const cls = p.pct === 100 ? "done" : (p.done > 0 ? "progress" : "");
    return `<div class="backbone-node ${cls}" data-id="${m.id}">
      <div class="backbone-node-row">
        <div>
          <div class="backbone-node-title">N${m.niveau} · ${m.titre}</div>
          <div class="backbone-node-sub">${p.done}/${p.total} leçons</div>
        </div>
        <div class="backbone-node-pct">${p.pct}%</div>
      </div>
    </div>`;
  }).join("");
  backbone.querySelectorAll("[data-id]").forEach(el => el.addEventListener("click", () => goModule(el.getAttribute("data-id"))));

  const recentList = document.getElementById("recentList");
  if(!state.recent.length){
    recentList.innerHTML = `<div class="empty-state" style="padding:24px 10px;"><div class="glyph">◇</div>Aucun cours consulté pour l'instant.</div>`;
  } else {
    recentList.innerHTML = state.recent.map(r => {
      const l = findLesson(r.lessonId);
      if(!l) return "";
      return `<div class="recent-item" data-lesson="${l.id}" style="cursor:pointer;">
        <div class="recent-icon">${l.moduleTag}</div>
        <div><div class="recent-title">${l.titre}</div><div class="recent-sub">${l.moduleTitre}</div></div>
      </div>`;
    }).join("");
    recentList.querySelectorAll("[data-lesson]").forEach(el => el.addEventListener("click", () => goLesson(el.getAttribute("data-lesson"))));
  }

  document.querySelectorAll(".quick-link[data-nav]").forEach(el => {
    el.onclick = () => goView(el.getAttribute("data-nav"));
  });
}

/* ------------------------------------------------------------
   PROGRESSION VIEW
   ------------------------------------------------------------ */
function renderProgression(){
  const container = document.getElementById("progressModules");
  container.innerHTML = MODULES.map(m => {
    const p = moduleProgress(m);
    return `<div class="progress-module-row">
      <div class="progress-module-top"><span class="name">N${m.niveau} · ${m.titre}</span><span class="pct">${p.pct}% (${p.done}/${p.total})</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${p.pct}%"></div></div>
    </div>`;
  }).join("");

  const g = globalProgress();
  const badges = [
    { id:"start", label:"Premier pas", earned: g.done >= 1 },
    { id:"five", label:"5 leçons terminées", earned: g.done >= 5 },
    { id:"ten", label:"10 leçons terminées", earned: g.done >= 10 },
    { id:"module", label:"1 module complet", earned: modulesCompletedCount() >= 1 },
    { id:"quiz", label:"Premier quiz réussi", earned: Object.keys(state.quizScores).length >= 1 },
    { id:"all", label:"Parcours complet", earned: g.pct === 100 }
  ];
  document.getElementById("badgesRow").innerHTML = badges.map(b =>
    `<div class="badge ${b.earned ? "earned":""}">${b.earned ? "✓" : "○"} ${b.label}</div>`
  ).join("");
}

/* ------------------------------------------------------------
   FAVORITES VIEW
   ------------------------------------------------------------ */
function renderFavorites(){
  const ids = Object.keys(state.favorites);
  const list = document.getElementById("favList");
  if(!ids.length){
    list.innerHTML = `<div class="empty-state"><div class="glyph">☆</div>Aucun favori pour l'instant. Ouvre une leçon et clique sur "Ajouter aux favoris".</div>`;
    return;
  }
  list.innerHTML = ids.map(id => {
    const l = findLesson(id);
    if(!l) return "";
    return `<div class="lesson-card" data-lesson="${l.id}">
      <div class="lesson-num">${l.moduleTag}</div>
      <div><div class="lesson-title">${l.titre}</div><div class="lesson-meta">${l.moduleTitre}</div></div>
      <div class="lesson-arrow">→</div>
    </div>`;
  }).join("");
  list.querySelectorAll("[data-lesson]").forEach(el => el.addEventListener("click", () => goLesson(el.getAttribute("data-lesson"))));
}

/* ------------------------------------------------------------
   GLOBAL SEARCH
   ------------------------------------------------------------ */
const searchInput = document.getElementById("globalSearch");
const searchResults = document.getElementById("searchResults");
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase().trim();
  if(!q){ searchResults.innerHTML = ""; return; }

  const lessonMatches = allLessons().filter(l => l.titre.toLowerCase().includes(q)).slice(0,5);
  const glossMatches = GLOSSAIRE.filter(g => g.terme.toLowerCase().includes(q)).slice(0,4);

  if(!lessonMatches.length && !glossMatches.length){
    searchResults.innerHTML = `<div class="search-results"><div class="search-result-item"><div class="srs">Aucun résultat</div></div></div>`;
    return;
  }

  let html = `<div class="search-results">`;
  lessonMatches.forEach(l => {
    html += `<div class="search-result-item" data-goto-lesson="${l.id}"><div class="srt">${l.titre}</div><div class="srs">Cours · ${l.moduleTitre}</div></div>`;
  });
  glossMatches.forEach(g => {
    html += `<div class="search-result-item" data-goto-gloss="${g.terme}"><div class="srt">${g.terme}</div><div class="srs">Glossaire</div></div>`;
  });
  html += `</div>`;
  searchResults.innerHTML = html;

  searchResults.querySelectorAll("[data-goto-lesson]").forEach(el => {
    el.addEventListener("click", () => {
      goLesson(el.getAttribute("data-goto-lesson"));
      searchResults.innerHTML = ""; searchInput.value = "";
      closeSidebarMobile();
    });
  });
  searchResults.querySelectorAll("[data-goto-gloss]").forEach(el => {
    el.addEventListener("click", () => {
      goView("glossaire");
      document.getElementById("glossarySearch").value = el.getAttribute("data-goto-gloss");
      renderGlossary(el.getAttribute("data-goto-gloss"));
      searchResults.innerHTML = ""; searchInput.value = "";
      closeSidebarMobile();
    });
  });
});
document.addEventListener("click", (e) => {
  if(!e.target.closest(".sidebar-search")) searchResults.innerHTML = "";
});

/* ------------------------------------------------------------
   MOBILE SIDEBAR
   ------------------------------------------------------------ */
const sidebar = document.getElementById("sidebar");
const scrim = document.getElementById("scrim");
document.getElementById("menuBtn").addEventListener("click", () => {
  sidebar.classList.add("open"); scrim.classList.add("open");
});
scrim.addEventListener("click", closeSidebarMobile);
function closeSidebarMobile(){
  sidebar.classList.remove("open"); scrim.classList.remove("open");
}

/* ------------------------------------------------------------
   FAVORITES BUTTON IN TOPBAR
   ------------------------------------------------------------ */
document.getElementById("favBtn").addEventListener("click", () => goView("favoris"));

/* ------------------------------------------------------------
   INIT
   ------------------------------------------------------------ */
applyTheme();
renderSidebarNav();
updateSidebarProgress();
goView("dashboard");
