/* ==========================================================================
   Briefing Deck — runtime chrome (nav, filmstrip, theme, feedback sidebar,
   inline gates, YAML compilers). Self-contained, no external deps; works from
   file://. Reads per-deck config from window.__BRIEFING_DECK__.
   Authored directly and injected verbatim by generate-briefing-decks.mjs.
   ========================================================================== */
(function () {
  "use strict";
  var CFG = window.__BRIEFING_DECK__ || {};
  var COMMAND = CFG.command || "$create-briefing-slides";
  var DECK_PATH = CFG.briefingPath || "briefing-slides/deck.html";
  var REFERENCES = CFG.references || [];
  var SOURCES = CFG.sourceArtifacts || REFERENCES;
  var SLUG = CFG.slug || "briefing-deck";
  var STATE_KEY = "briefing:" + SLUG + ":state";
  var POS_KEY = "briefing:" + SLUG + ":pos";
  var THEME_KEY = "briefing:theme";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var slides = $$("[data-briefing-slide]");
  var counters = $$("[data-slide-counter]");
  var progressFill = $("[data-slide-progress] > span");
  var filmstrip = $("[data-filmstrip]");
  var panel = $("[data-slide-feedback-panel]");
  var topbar = $(".deck-topbar");
  var footer = $(".deck-footer");
  var state = readJSON(STATE_KEY, {});
  var current = 0;
  var fitFrame = 0;
  var mq = window.matchMedia("(max-width: 860px)");

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "null") || fallback; }
    catch (e) { return fallback; }
  }
  function persist() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
      localStorage.setItem(POS_KEY, String(current));
    } catch (e) {}
  }

  slides.forEach(function (slide, i) {
    if (!slide.id) slide.id = "slide-" + (i + 1);
  });

  function slideId(i) { return slides[i].id; }
  function slideTitle(i) { return slides[i].getAttribute("data-slide-title") || slides[i].id; }
  function slideState(id) { state[id] = state[id] || {}; return state[id]; }

  /* --- Theme --------------------------------------------------------------- */
  function currentTheme() {
    var explicit = document.documentElement.getAttribute("data-theme");
    if (explicit) return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    $$("[data-theme-toggle]").forEach(function (btn) {
      btn.textContent = theme === "dark" ? "☀ Light" : "☽ Dark";
      btn.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " theme");
    });
  }
  (function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved) applyTheme(saved);
    else applyTheme(currentTheme());
  })();
  $$("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  });

  /* --- Navigation ---------------------------------------------------------- */
  function showSlide(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach(function (slide, i) { slide.classList.toggle("active", i === current); });
    counters.forEach(function (c) { c.textContent = (current + 1) + " / " + slides.length; });
    if (progressFill) progressFill.style.width = (((current + 1) / slides.length) * 100) + "%";
    if (filmstrip) {
      Array.prototype.forEach.call(filmstrip.children, function (btn, i) {
        btn.classList.toggle("active", i === current);
      });
    }
    try { history.replaceState(null, "", "#slide-" + (current + 1)); } catch (e) {}
    persist();
    syncPanel();
    scheduleFit();
  }

  function initialIndex() {
    var fromHash = parseInt(String(location.hash).replace("#slide-", ""), 10);
    if (fromHash && fromHash >= 1 && fromHash <= slides.length) return fromHash - 1;
    var saved = parseInt(localStorage.getItem(POS_KEY) || "0", 10);
    return isNaN(saved) ? 0 : saved;
  }

  $$("[data-slide-prev]").forEach(function (b) { b.addEventListener("click", function () { showSlide(current - 1); }); });
  $$("[data-slide-next]").forEach(function (b) { b.addEventListener("click", function () { showSlide(current + 1); }); });

  function isEditing(el) {
    return el && (["INPUT", "TEXTAREA", "SELECT"].indexOf(el.tagName) !== -1 || el.isContentEditable);
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel && panel.classList.contains("open")) { e.preventDefault(); closePanel(); return; }
    if (isEditing(e.target)) return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var k = e.key.toLowerCase();
    if (k === "arrowleft" || k === "a") { e.preventDefault(); showSlide(current - 1); }
    else if (k === "arrowright" || k === "d" || e.key === " ") { e.preventDefault(); showSlide(current + 1); }
    else if (k === "home") { e.preventDefault(); showSlide(0); }
    else if (k === "end") { e.preventDefault(); showSlide(slides.length - 1); }
  });

  var stage = $(".deck-stage");
  if (stage) {
    stage.addEventListener("click", function (e) {
      var activeSlide = e.target.closest("[data-briefing-slide].active");
      if (!activeSlide && e.target !== stage) return;
      if (e.target.closest(".slide-card")) return;
      showSlide(current + 1);
    });
  }

  /* --- Filmstrip (only when > 5 slides) ------------------------------------ */
  if (filmstrip) {
    if (slides.length > 5) {
      slides.forEach(function (slide, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = String(i + 1);
        b.title = slideTitle(i);
        b.setAttribute("aria-label", "Go to slide " + (i + 1) + ": " + slideTitle(i));
        b.addEventListener("click", function () { showSlide(i); });
        filmstrip.appendChild(b);
      });
    } else {
      filmstrip.style.display = "none";
    }
  }

  /* --- Inline gates -------------------------------------------------------- */
  function gateGroupsIn(slide) {
    var names = {};
    $$("[data-gate-answer]", slide).forEach(function (input) {
      if (input.name) names[input.name] = true;
    });
    return Object.keys(names);
  }
  function gateAnswer(name) { return (state.gates || {})[name] || ""; }
  function refreshGateStatus(slide) {
    if (!slide.hasAttribute("data-required-gate-slide")) return;
    var groups = gateGroupsIn(slide);
    var answered = groups.length > 0 && groups.every(function (n) { return !!gateAnswer(n); });
    slide.setAttribute("data-gate-status", answered ? "answered" : "unanswered");
    if (filmstrip && filmstrip.children.length) {
      var idx = slides.indexOf(slide);
      var btn = filmstrip.children[idx];
      if (btn) {
        btn.classList.toggle("gate-answered", answered);
        btn.classList.toggle("gate-unanswered", !answered);
      }
    }
  }
  $$("[data-gate-answer]").forEach(function (input) {
    if (input.type === "radio" && gateAnswer(input.name) === input.value) input.checked = true;
    input.addEventListener("change", function () {
      state.gates = state.gates || {};
      state.gates[input.name] = input.value;
      persist();
      var slide = input.closest("[data-briefing-slide]");
      if (slide) refreshGateStatus(slide);
    });
  });
  slides.forEach(refreshGateStatus);

  /* --- Feedback sidebar ---------------------------------------------------- */
  var pMeta = panel && $("[data-fb-meta]", panel);
  var pTitle = panel && $("[data-fb-title]", panel);
  var pFeedback = panel && $("[data-fb-feedback]", panel);
  var pMark = panel && $("[data-fb-mark]", panel);
  var pNote = panel && $("[data-fb-note]", panel);
  var pYaml = panel && $("[data-slide-feedback-yaml]", panel);

  function syncPanel() {
    if (!panel) return;
    var id = slideId(current);
    var s = slideState(id);
    if (pMeta) pMeta.textContent = "Slide " + (current + 1) + " / " + slides.length;
    if (pTitle) pTitle.textContent = slideTitle(current);
    if (pFeedback) pFeedback.value = s.feedback || "";
    if (pMark) pMark.value = s.mark || "";
    if (pNote) pNote.value = s.annotation || "";
  }
  function openPanel() {
    if (!panel) return;
    syncPanel();
    document.body.classList.add("fb-open");
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    scheduleFit();
  }
  function closePanel() {
    if (!panel) return;
    document.body.classList.remove("fb-open");
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    scheduleFit();
  }
  $$("[data-feedback-trigger]").forEach(function (t) {
    t.addEventListener("click", function () {
      var slide = t.closest("[data-briefing-slide]");
      if (slide) { var i = slides.indexOf(slide); if (i !== -1 && i !== current) showSlide(i); }
      openPanel();
    });
  });
  $$("[data-fb-close]").forEach(function (b) { b.addEventListener("click", closePanel); });
  function updateReview(key, value) { slideState(slideId(current))[key] = value; persist(); }
  if (pFeedback) pFeedback.addEventListener("input", function () { updateReview("feedback", pFeedback.value); });
  if (pMark) pMark.addEventListener("input", function () { updateReview("mark", pMark.value); });
  if (pNote) pNote.addEventListener("input", function () { updateReview("annotation", pNote.value); });

  /* --- Slide-fit scaling when sidebar open --------------------------------- */
  function num(styles, prop) { return parseFloat(styles.getPropertyValue(prop)) || 0; }
  function recalcFit() {
    if (!panel) return;
    var open = document.body.classList.contains("fb-open");
    if (!open || mq.matches) { document.documentElement.style.setProperty("--slide-scale", "1"); return; }
    var slide = slides[current];
    var card = slide && slide.querySelector(".slide-card");
    if (!card) return;
    var cs = getComputedStyle(slide);
    var padX = num(cs, "padding-left") + num(cs, "padding-right");
    var padY = num(cs, "padding-top") + num(cs, "padding-bottom");
    var pw = panel.getBoundingClientRect().width;
    var th = topbar ? topbar.getBoundingClientRect().height : 0;
    var fh = footer ? footer.getBoundingClientRect().height : 0;
    var availW = Math.max(1, window.innerWidth - pw - padX);
    var availH = Math.max(1, window.innerHeight - th - fh - padY);
    var cw = Math.max(1, card.offsetWidth);
    var ch = Math.max(1, card.offsetHeight);
    var scale = Math.min(1, availW / cw, availH / ch);
    document.documentElement.style.setProperty("--slide-scale", scale.toFixed(4));
  }
  function scheduleFit() { window.cancelAnimationFrame(fitFrame); fitFrame = window.requestAnimationFrame(recalcFit); }
  window.addEventListener("resize", scheduleFit);
  mq.addEventListener("change", scheduleFit);

  /* --- Clipboard ----------------------------------------------------------- */
  function copyText(text, fallback) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (fallback) fallback.style.display = "none";
      }, function () { showFallback(text, fallback); });
    } else { showFallback(text, fallback); }
  }
  function showFallback(text, fallback) {
    if (!fallback) return;
    fallback.value = text; fallback.style.display = "block"; fallback.focus(); fallback.select();
  }

  /* --- YAML compilers ------------------------------------------------------ */
  function yq(v) { return JSON.stringify(String(v == null ? "" : v)); }

  function compileSlideYaml() {
    var id = slideId(current);
    var s = slideState(id);
    var lines = [
      "# Invoke with: " + COMMAND,
      "command: " + yq(COMMAND),
      "briefing_slides: " + DECK_PATH,
      "slide: " + yq(id),
      "slide_title: " + yq(slideTitle(current)),
      "slide_feedback:",
      "  status: " + yq(s.feedback || ""),
      "  mark: " + yq(s.mark || ""),
      "  annotation: " + yq(s.annotation || ""),
      "approval_status: " + (s.feedback && ["revise", "needs-clarification"].indexOf(s.feedback) !== -1 ? "not-approved" : "review-pending")
    ];
    return lines.join("\n");
  }

  function allGateEntries() {
    var out = [];
    slides.forEach(function (slide) {
      gateGroupsIn(slide).forEach(function (name) { out.push({ gate: name, answer: gateAnswer(name) }); });
    });
    return out;
  }
  function stateEntries(field) {
    return Object.keys(state).filter(function (id) {
      return id.indexOf("slide-") === 0 && state[id] && state[id][field];
    }).map(function (id) { return { id: id, value: state[id][field] }; });
  }
  function titleForId(id) {
    var el = document.getElementById(id);
    return el ? (el.getAttribute("data-slide-title") || id) : id;
  }

  function compileDeckYaml() {
    var gates = allGateEntries();
    var unanswered = gates.filter(function (g) { return !g.answer; }).map(function (g) { return g.gate; });
    var blocking = Object.keys(state).some(function (id) {
      return state[id] && ["revise", "needs-clarification"].indexOf(state[id].feedback) !== -1;
    });
    var approved = gates.length > 0 && unanswered.length === 0 &&
      gates.every(function (g) { return g.answer === "approve"; }) && !blocking;
    var fb = stateEntries("feedback");
    var notes = stateEntries("annotation");
    var marks = stateEntries("mark");
    var lines = [
      "# Invoke with: " + COMMAND,
      "command: " + yq(COMMAND),
      "briefing_slides: " + DECK_PATH,
      "reference_pages:"
    ];
    REFERENCES.forEach(function (r) { lines.push("  - " + r); });
    if (!REFERENCES.length) lines.push("  []");
    lines.push("source_artifacts:");
    SOURCES.forEach(function (r) { lines.push("  - " + r); });
    if (!SOURCES.length) lines.push("  []");
    lines.push("gate_answers:");
    if (gates.length) gates.forEach(function (g) { lines.push("  " + g.gate + ": " + yq(g.answer)); });
    else lines.push("  []");
    lines.push("slide_feedback:");
    if (fb.length) fb.forEach(function (e) {
      lines.push("  - slide: " + yq(e.id));
      lines.push("    slide_title: " + yq(titleForId(e.id)));
      lines.push("    feedback: " + yq(e.value));
    }); else lines.push("  []");
    lines.push("annotations:");
    if (notes.length) notes.forEach(function (e) {
      lines.push("  - slide: " + yq(e.id));
      lines.push("    note: " + yq(e.value));
    }); else lines.push("  []");
    lines.push("marked_slides:");
    if (marks.length) marks.forEach(function (e) {
      lines.push("  - slide: " + yq(e.id));
      lines.push("    status: " + yq(e.value));
    }); else lines.push("  []");
    lines.push("unanswered_required_questions:");
    if (unanswered.length) unanswered.forEach(function (q) { lines.push("  - " + q); });
    else lines.push("  []");
    lines.push("approval_status: " + (approved ? "ready-for-agent-review" : "not-approved"));
    return lines.join("\n");
  }

  // Per-slide feedback YAML controls in the sidebar.
  $$("[data-fb-compile]").forEach(function (b) {
    b.addEventListener("click", function () { if (pYaml) pYaml.textContent = compileSlideYaml(); });
  });
  $$("[data-fb-copy]").forEach(function (b) {
    b.addEventListener("click", function () { copyText(compileSlideYaml(), $("[data-fb-fallback]")); });
  });
  $$("[data-fb-copy-title]").forEach(function (b) {
    b.addEventListener("click", function () { copyText(slideTitle(current), $("[data-fb-fallback]")); });
  });
  $$("[data-fb-copy-refs]").forEach(function (b) {
    b.addEventListener("click", function () { copyText(REFERENCES.join("\n"), $("[data-fb-fallback]")); });
  });

  // Full-deck compiler on the response slide.
  var deckYamlOut = $("[data-full-deck-yaml]");
  $$("[data-deck-compile]").forEach(function (b) {
    b.addEventListener("click", function () { if (deckYamlOut) deckYamlOut.textContent = compileDeckYaml(); });
  });
  $$("[data-deck-copy]").forEach(function (b) {
    b.addEventListener("click", function () { copyText(compileDeckYaml(), $("[data-deck-fallback]")); });
  });

  /* --- Boot ---------------------------------------------------------------- */
  showSlide(initialIndex());
})();
