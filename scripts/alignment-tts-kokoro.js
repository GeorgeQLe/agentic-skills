/**
 * Alignment TTS — Kokoro-powered "Brief Me" narration for alignment pages.
 *
 * Loaded as <script src="..."> from alignment pages (not type="module",
 * because module scripts are blocked by CORS on file:// URLs).
 * Uses kokoro-js for natural-sounding client-side TTS via WebGPU/WASM.
 * Falls back to Web Speech API if Kokoro fails to load.
 */

(function() {
'use strict';

const KOKORO_CDN = 'https://esm.sh/kokoro-js@1.2.1';
const MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';
const VOICES = [
  { id: 'af_heart', label: 'Heart' },
  { id: 'af_sky', label: 'Sky' },
  { id: 'af_nicole', label: 'Nicole' },
  { id: 'am_michael', label: 'Michael' },
  { id: 'af_bella', label: 'Bella' },
  { id: 'bf_emma', label: 'Emma' },
];
const LS_VOICE_KEY = 'tts-kokoro-voice';
const LS_SPEED_KEY = 'tts-kokoro-speed';

let ttsInstance = null;
let loadingTTS = false;
let usingFallback = false;
let audioCtx = null;
let sections = [];
let currentIdx = -1;
let speed = parseFloat(localStorage.getItem(LS_SPEED_KEY) || '1');
let paused = false;
let active = false;
let bar = null;
let skipId = 0;
let currentSource = null;
let currentStream = null;
let briefBtn = null;

function getSelectedVoice() {
  return localStorage.getItem(LS_VOICE_KEY) || VOICES[0].id;
}

function extractText(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('.section-feedback, .question-block, .gate, .compile-box, .radio-group, .answer-notes, .local-yaml, .local-yaml-actions, .compile-actions, button, textarea, input, .tts-bar').forEach(n => n.remove());
  clone.querySelectorAll('.chart-container, .table-wrap, .stat-grid').forEach(n => {
    const narrative = n.getAttribute('data-tts-narrative');
    if (narrative) {
      const span = document.createElement('span');
      span.textContent = ' ' + narrative + ' ';
      n.replaceWith(span);
    } else {
      n.remove();
    }
  });
  let text = clone.textContent.replace(/\s+/g, ' ').trim();
  return text;
}

function gatherSections() {
  sections = [];
  const header = document.querySelector('header');
  const h1 = document.querySelector('h1');
  const lead = document.querySelector('.lead');
  const title = h1?.textContent?.trim() || 'Alignment Page';
  const leadText = lead?.textContent?.trim() || '';
  const introEl = header || h1?.parentElement || document.querySelector('main') || document.body;
  if (title) {
    sections.push({ el: introEl, label: 'Introduction', text: `${title}. ${leadText}` });
  }
  document.querySelectorAll('section').forEach(sec => {
    const id = sec.id;
    if (id === 'compile' || id === 'review-gates') return;
    const heading = sec.querySelector('h2')?.textContent?.trim() || 'Section';
    const text = extractText(sec);
    if (text.length > 10) sections.push({ el: sec, label: heading, text: `${heading}. ${text}` });
  });
  if (sections.length <= 1) {
    const container = document.querySelector('main') || document.body;
    const h2s = container.querySelectorAll('h2');
    h2s.forEach(h2 => {
      const heading = h2.textContent.trim();
      const tempDiv = document.createElement('div');
      tempDiv.appendChild(h2.cloneNode(true));
      let sib = h2.nextElementSibling;
      while (sib && sib.tagName !== 'H2') {
        tempDiv.appendChild(sib.cloneNode(true));
        sib = sib.nextElementSibling;
      }
      const text = extractText(tempDiv);
      if (text.length > 10) {
        sections.push({ el: h2.parentElement || h2, label: heading, text: `${heading}. ${text}` });
      }
    });
  }
  if (!sections.length) {
    const body = extractText(document.querySelector('main') || document.body);
    if (body.length > 10) sections.push({ el: document.body, label: 'Page', text: body });
  }
}

function highlight(el) {
  document.querySelectorAll('.tts-active-section').forEach(e => e.classList.remove('tts-active-section'));
  if (el) {
    el.classList.add('tts-active-section');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function updateStatus() {
  if (!bar) return;
  const label = bar.querySelector('.tts-status');
  if (!label) return;
  const sec = sections[currentIdx];
  const state = paused ? 'Paused' : 'Reading';
  label.textContent = sec ? `${state}: ${sec.label} (${currentIdx + 1}/${sections.length})` : '';
}

function updateButtonLabel(text) {
  if (briefBtn) briefBtn.textContent = text;
}

// --- Web Speech API fallback ---

const fallback = {
  synth: typeof speechSynthesis !== 'undefined' ? speechSynthesis : null,

  speak(text, onEnd) {
    if (!this.synth) { onEnd(); return; }
    this.synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = speed;
    utt.onend = onEnd;
    utt.onerror = (e) => { if (e.error !== 'canceled') onEnd(); };
    this.synth.speak(utt);
  },

  pause() { this.synth?.pause(); },
  resume() { this.synth?.resume(); },
  cancel() { this.synth?.cancel(); },
};

// --- Kokoro engine ---

async function loadKokoro(onProgress) {
  const { KokoroTTS } = await import(KOKORO_CDN);
  const dtype = navigator.gpu ? 'fp32' : 'q8';
  const device = navigator.gpu ? 'webgpu' : 'wasm';
  const instance = await KokoroTTS.from_pretrained(MODEL_ID, {
    dtype,
    device,
    progress_callback: (progress) => {
      if (progress.status === 'progress' && progress.total) {
        const pct = Math.round((progress.loaded / progress.total) * 100);
        onProgress(pct);
      }
    },
  });
  return instance;
}

async function ensureTTS(onProgress) {
  if (ttsInstance) return ttsInstance;
  if (loadingTTS) return null;
  loadingTTS = true;
  try {
    ttsInstance = await loadKokoro(onProgress);
    usingFallback = false;
    return ttsInstance;
  } catch (err) {
    console.warn('Kokoro TTS failed to load, falling back to Web Speech API:', err);
    usingFallback = true;
    return null;
  } finally {
    loadingTTS = false;
  }
}

function stopCurrentAudio() {
  if (currentStream) {
    currentStream.abort = true;
    currentStream = null;
  }
  if (currentSource) {
    try { currentSource.stop(); } catch (_) {}
    currentSource = null;
  }
  if (usingFallback) fallback.cancel();
}

function chunkText(text, maxLen) {
  maxLen = maxLen || 1000;
  if (text.length <= maxLen) return [text];
  var chunks = [];
  var remaining = text;
  while (remaining.length > maxLen) {
    var cut = -1;
    var seps = ['. ', '? ', '! '];
    for (var i = 0; i < seps.length; i++) {
      var idx = remaining.lastIndexOf(seps[i], maxLen);
      if (idx > cut) cut = idx + seps[i].length;
    }
    if (cut <= 0) cut = maxLen;
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

async function speakKokoro(text, id, onEnd) {
  if (audioCtx.state === 'suspended') await audioCtx.resume();

  const voice = getSelectedVoice();
  const streamState = { abort: false };
  currentStream = streamState;

  const chunks = chunkText(text);

  try {
    for (let ci = 0; ci < chunks.length; ci++) {
      if (streamState.abort || id !== skipId) return;

      const rawAudio = await ttsInstance.generate(chunks[ci], { voice, speed });
      if (streamState.abort || id !== skipId) return;

      const samples = rawAudio.audio;
      if (!samples || samples.length === 0) continue;

      const sampleRate = rawAudio.sampling_rate || 24000;
      const buf = audioCtx.createBuffer(1, samples.length, sampleRate);
      buf.getChannelData(0).set(samples);

      await new Promise((resolve) => {
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        src.connect(audioCtx.destination);
        src.onended = resolve;
        src.start();
        currentSource = src;
      });

      if (streamState.abort || id !== skipId) return;
    }
    onEnd();
  } catch (err) {
    if (!streamState.abort) {
      console.warn('Kokoro generate error:', err);
      onEnd();
    }
  }
}

function speakSection(idx) {
  if (idx < 0 || idx >= sections.length) { stop(); return; }
  stopCurrentAudio();
  currentIdx = idx;
  const id = ++skipId;
  const sec = sections[idx];
  highlight(sec.el);
  updateStatus();

  const onEnd = () => {
    if (id === skipId && !paused && active) speakSection(currentIdx + 1);
  };

  if (usingFallback) {
    fallback.speak(sec.text, onEnd);
  } else {
    speakKokoro(sec.text, id, onEnd);
  }
}

async function play() {
  if (!audioCtx) audioCtx = new AudioContext();

  gatherSections();
  if (!sections.length) return;

  if (!ttsInstance && !usingFallback) {
    updateButtonLabel('Loading voice model...');
    showBar();
    const statusEl = bar?.querySelector('.tts-status');
    if (statusEl) statusEl.textContent = 'Downloading voice model...';

    await ensureTTS((pct) => {
      if (statusEl) statusEl.textContent = `Loading voice model... ${pct}%`;
      updateButtonLabel(`Loading... ${pct}%`);
    });
    updateButtonLabel('Brief Me');
  }

  active = true;
  paused = false;
  if (currentIdx < 0) currentIdx = 0;
  showBar();
  speakSection(currentIdx);
}

function togglePause() {
  if (!active) { play(); return; }
  if (paused) {
    paused = false;
    if (usingFallback) {
      fallback.resume();
    } else if (audioCtx?.state === 'suspended') {
      audioCtx.resume();
    }
    updateStatus();
  } else {
    paused = true;
    if (usingFallback) {
      fallback.pause();
    } else if (audioCtx) {
      audioCtx.suspend();
    }
    updateStatus();
  }
}

function stop() {
  stopCurrentAudio();
  active = false;
  paused = false;
  currentIdx = -1;
  skipId = 0;
  highlight(null);
  hideBar();
}

function skipForward() {
  if (!active) return;
  paused = false;
  if (audioCtx?.state === 'suspended') audioCtx.resume();
  speakSection(currentIdx + 1);
}

function skipBack() {
  if (!active) return;
  paused = false;
  if (audioCtx?.state === 'suspended') audioCtx.resume();
  speakSection(Math.max(0, currentIdx - 1));
}

function setSpeed(s) {
  speed = s;
  localStorage.setItem(LS_SPEED_KEY, String(s));
  if (active && !paused) speakSection(currentIdx);
}

function setVoice(v) {
  localStorage.setItem(LS_VOICE_KEY, v);
  if (active && !paused && !usingFallback) speakSection(currentIdx);
}

// --- UI ---

function createBar() {
  const el = document.createElement('div');
  el.className = 'tts-bar';

  const savedVoice = getSelectedVoice();
  const voiceOpts = VOICES.map(v =>
    `<option value="${v.id}"${v.id === savedVoice ? ' selected' : ''}>${v.label}</option>`
  ).join('');

  const speedOpts = [0.8, 1, 1.25, 1.5, 2].map(s =>
    `<option value="${s}"${s === speed ? ' selected' : ''}>${s}x</option>`
  ).join('');

  el.innerHTML = `
    <button class="tts-btn" data-action="back" title="Previous section" aria-label="Previous section">&#9664;&#9664;</button>
    <button class="tts-btn" data-action="toggle" title="Play / Pause" aria-label="Play or Pause">&#9208;</button>
    <button class="tts-btn" data-action="stop" title="Stop" aria-label="Stop">&#9632;</button>
    <button class="tts-btn" data-action="forward" title="Next section" aria-label="Next section">&#9654;&#9654;</button>
    <span class="tts-status"></span>
    <select class="tts-voice" title="Voice" aria-label="Voice">${voiceOpts}</select>
    <select class="tts-speed" title="Playback speed" aria-label="Playback speed">${speedOpts}</select>
  `;

  el.querySelectorAll('.tts-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      if (action === 'toggle') togglePause();
      else if (action === 'stop') stop();
      else if (action === 'forward') skipForward();
      else if (action === 'back') skipBack();
    });
  });
  el.querySelector('.tts-speed').addEventListener('change', (e) => {
    setSpeed(parseFloat(e.target.value));
  });
  el.querySelector('.tts-voice').addEventListener('change', (e) => {
    setVoice(e.target.value);
  });
  return el;
}

function showBar() {
  if (bar) { bar.style.display = 'flex'; return; }
  bar = createBar();
  document.body.appendChild(bar);
}

function hideBar() {
  if (bar) bar.style.display = 'none';
}

function injectButton() {
  const btn = document.createElement('button');
  btn.className = 'tts-brief-btn';
  btn.textContent = 'Brief Me';
  btn.title = 'Read this page aloud section by section';
  btn.setAttribute('aria-label', 'Brief Me — read this page aloud');
  btn.addEventListener('click', () => {
    if (active) { stop(); return; }
    play();
  });
  briefBtn = btn;

  const header = document.querySelector('header');
  if (header) { header.appendChild(btn); return; }
  const anchor = document.querySelector('.status') || document.querySelector('.lead') || document.querySelector('h1');
  if (anchor && anchor.parentNode) { anchor.parentNode.insertBefore(btn, anchor.nextSibling); return; }
  const main = document.querySelector('main');
  if (main) { main.insertBefore(btn, main.querySelector('nav, section')); }
}

function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .tts-brief-btn {
      display: inline-flex; align-items: center; gap: 6px;
      min-height: 44px; padding: 10px 20px; border-radius: 6px;
      border: 1px solid var(--accent, #58a6ff); background: transparent;
      color: var(--accent, #58a6ff); font-size: 0.95rem; font-weight: 600;
      cursor: pointer; margin: 12px 0; transition: background 0.15s, color 0.15s;
    }
    .tts-brief-btn:hover { background: var(--accent, #58a6ff); color: #fff; }

    .tts-bar {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;
      display: flex; align-items: center; gap: 8px;
      padding: 10px 16px; background: #161b22; border-top: 1px solid var(--border, #30363d);
      box-shadow: 0 -2px 12px rgba(0,0,0,0.4); flex-wrap: wrap;
    }
    .tts-btn {
      min-height: 44px; min-width: 44px; padding: 8px 12px;
      border: 1px solid var(--border, #30363d); border-radius: 6px;
      background: var(--bg, #0d1117); color: var(--text, #c9d1d9);
      cursor: pointer; font-size: 1rem;
    }
    .tts-btn:hover { border-color: var(--accent, #58a6ff); }
    .tts-status {
      flex: 1; min-width: 120px; color: var(--text-muted, #8b949e);
      font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .tts-voice, .tts-speed {
      min-height: 44px; padding: 8px 12px; border: 1px solid var(--border, #30363d);
      border-radius: 6px; background: var(--bg, #0d1117); color: var(--text, #c9d1d9);
      font-size: 0.85rem; cursor: pointer;
    }
    .tts-active-section {
      outline: 2px solid var(--accent, #58a6ff); outline-offset: 4px;
      transition: outline-color 0.3s;
    }
    @media (max-width: 560px) {
      .tts-bar { gap: 4px; padding: 8px; }
      .tts-status { min-width: 80px; font-size: 0.8rem; }
    }
  `;
  document.head.appendChild(style);
}

function init() {
  injectStyles();
  injectButton();
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea, select')) return;
    if (e.key === ' ' && active) { e.preventDefault(); togglePause(); }
    else if (e.key === 'Escape' && active) { stop(); }
    else if (e.key === 'ArrowRight' && active) { skipForward(); }
    else if (e.key === 'ArrowLeft' && active) { skipBack(); }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
