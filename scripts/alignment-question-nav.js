/**
 * Question navigator — prev/next "unanswered question" pager for alignment
 * review pages and interrogation round pages.
 *
 * Loaded as <script src="..."> from alignment/interrogation pages (not
 * type="module", because module scripts are blocked by CORS on file:// URLs).
 * The pager carries NO compile/copy/answer semantics — it is pure navigation —
 * so it is exempt from the sticky-controls prohibition even when rendered
 * inline beside questions.
 *
 * Behavior: discover answerable question blocks in document order, inject a
 * compact "‹ prev · N left · next ›" nav-only pager into each block and into
 * the bottom compile section, and keep the "N left" count live via delegated
 * input/change listeners. Next/prev jump to the next/previous unanswered block
 * (wrapping), scroll it into view, and briefly highlight it. When zero remain,
 * the pager reads "All answered" and its buttons disable.
 */

(function () {
'use strict';

// Guard against double-init (e.g. tag included twice).
if (window.__alignmentQuestionNavInit) return;
window.__alignmentQuestionNavInit = true;

var HIGHLIGHT_MS = 1500;
var blocks = [];
var pagers = [];

function reducedMotion() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Answer fields that count as a written answer. Read-only/disabled fields (the
// compiled-YAML output textareas) never count.
function answerFields(el) {
  return el.querySelectorAll(
    'textarea:not([readonly]):not([disabled]), input[type="text"]:not([readonly]):not([disabled]), input:not([type]):not([readonly]):not([disabled])'
  );
}

function choiceInputs(el) {
  return el.querySelectorAll('input[type="radio"], input[type="checkbox"]');
}

// A block is answerable if it offers any choice input or any writable answer
// field. Read-only record gates (no inputs) are skipped.
function isAnswerable(el) {
  return choiceInputs(el).length > 0 || answerFields(el).length > 0;
}

// Answered = a choice is checked OR some writable answer field is non-empty.
// Unanswered is the negation, matching the convention's "no radio checked AND
// its text/textarea answer field is empty/whitespace" test.
function isAnswered(el) {
  var choices = choiceInputs(el);
  for (var i = 0; i < choices.length; i += 1) {
    if (choices[i].checked) return true;
  }
  var fields = answerFields(el);
  for (var j = 0; j < fields.length; j += 1) {
    if (fields[j].value && fields[j].value.trim()) return true;
  }
  return false;
}

// Discover answerable blocks in document order. Prefer the finest-grained
// question containers (.question / [data-question-block] on alignment pages,
// [data-open-question] on interrogation pages); fall back to a .gate wrapper
// only when it holds inputs directly and wraps no finer-grained block, so a
// gate and its nested questions are never both counted.
function gatherBlocks() {
  var seen = [];
  var found = [];
  var candidates = document.querySelectorAll(
    '[data-open-question], [data-question-block], .question, .gate'
  );
  for (var i = 0; i < candidates.length; i += 1) {
    var el = candidates[i];
    if (el.matches('.gate') &&
      el.querySelector('[data-open-question], [data-question-block], .question')) {
      continue;
    }
    if (!isAnswerable(el)) continue;
    if (seen.indexOf(el) !== -1) continue;
    seen.push(el);
    found.push(el);
  }
  found.sort(function (a, b) {
    var pos = a.compareDocumentPosition(b);
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });
  return found;
}

function unansweredIndices() {
  var out = [];
  for (var i = 0; i < blocks.length; i += 1) {
    if (!isAnswered(blocks[i])) out.push(i);
  }
  return out;
}

function focusBlock(idx) {
  var el = blocks[idx];
  if (!el) return;
  el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
  document.querySelectorAll('.qnav-target').forEach(function (n) {
    n.classList.remove('qnav-target');
  });
  el.classList.add('qnav-target');
  setTimeout(function () { el.classList.remove('qnav-target'); }, HIGHLIGHT_MS);
}

// position is the block index of the clicked pager, or blocks.length for the
// bottom compile pager (an anchor past the last block). Forward finds the first
// unanswered block after position and wraps to the first; backward finds the
// last unanswered block before position and wraps to the last.
function navigate(position, dir) {
  var u = unansweredIndices();
  if (!u.length) return;
  var target;
  if (dir > 0) {
    target = undefined;
    for (var i = 0; i < u.length; i += 1) {
      if (u[i] > position) { target = u[i]; break; }
    }
    if (target === undefined) target = u[0];
  } else {
    var before = u.filter(function (j) { return j < position; });
    target = before.length ? before[before.length - 1] : u[u.length - 1];
  }
  focusBlock(target);
}

function makePager(position) {
  var nav = document.createElement('div');
  nav.className = 'qnav';
  nav.setAttribute('data-qnav', '');
  var prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'qnav-btn';
  prev.setAttribute('data-qnav-prev', '');
  prev.textContent = '‹ prev unanswered';
  prev.title = 'Jump to the previous unanswered question';
  var count = document.createElement('span');
  count.className = 'qnav-count';
  count.setAttribute('data-qnav-count', '');
  var next = document.createElement('button');
  next.type = 'button';
  next.className = 'qnav-btn';
  next.setAttribute('data-qnav-next', '');
  next.textContent = 'next unanswered ›';
  next.title = 'Jump to the next unanswered question';
  nav.appendChild(prev);
  nav.appendChild(count);
  nav.appendChild(next);
  prev.addEventListener('click', function (e) { e.preventDefault(); navigate(position, -1); });
  next.addEventListener('click', function (e) { e.preventDefault(); navigate(position, 1); });
  pagers.push({ prev: prev, next: next, count: count });
  return nav;
}

function refresh() {
  var remaining = unansweredIndices().length;
  var allDone = remaining === 0;
  var label = allDone ? 'All answered' : remaining + ' left';
  for (var i = 0; i < pagers.length; i += 1) {
    var p = pagers[i];
    p.count.textContent = label;
    p.count.classList.toggle('qnav-done', allDone);
    p.prev.disabled = allDone;
    p.next.disabled = allDone;
  }
}

function injectStyles() {
  var style = document.createElement('style');
  style.textContent = [
    '.qnav{display:flex;align-items:center;gap:10px;flex-wrap:wrap;',
    'margin:12px 0 0;padding:6px 0;font-size:0.85rem}',
    '.qnav-btn{min-height:36px;padding:6px 12px;margin:0;',
    'border:1px solid var(--border,#30363d);border-radius:6px;',
    'background:var(--bg,#0d1117);color:var(--accent,#58a6ff);',
    'font-size:0.85rem;cursor:pointer}',
    '.qnav-btn:hover:not(:disabled){border-color:var(--accent,#58a6ff)}',
    '.qnav-btn:disabled{opacity:0.5;cursor:default;color:var(--text-muted,#8b949e)}',
    '.qnav-count{color:var(--text-muted,#8b949e);font-variant-numeric:tabular-nums}',
    '.qnav-count.qnav-done{color:var(--green,#3fb950)}',
    '.qnav-target{outline:2px solid var(--accent,#58a6ff);outline-offset:4px;',
    'transition:outline-color 0.3s}',
    '@media (prefers-reduced-motion: reduce){.qnav-target{transition:none}}',
  ].join('');
  document.head.appendChild(style);
}

function init() {
  blocks = gatherBlocks();
  if (!blocks.length) return;
  injectStyles();
  for (var i = 0; i < blocks.length; i += 1) {
    blocks[i].appendChild(makePager(i));
  }
  var compile = document.querySelector(
    '#compile, .compile-section, .compile, [data-answer-sidecar]'
  );
  if (compile) compile.appendChild(makePager(blocks.length));
  refresh();
  document.addEventListener('input', refresh, true);
  document.addEventListener('change', refresh, true);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
