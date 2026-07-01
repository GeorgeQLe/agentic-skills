#!/usr/bin/env node
/**
 * Injects the shared Brief Me TTS and question-nav src tags into existing
 * alignment/interrogation HTML pages. Idempotent — skips pages that already
 * carry every include they need. The Kokoro TTS tag goes on every page; the
 * question-nav tag goes on nav-eligible pages (all interrogation round pages
 * and non-confirmed alignment review pages that carry answerable questions).
 *
 * Usage: node scripts/inject-tts.mjs [--root <path>] [--dir <subdir>] [--dry-run] [--force] [<subdir>/specific-page.html]
 *        Default: processes all alignment/*.html except index.html
 *        --dir interrogation: batch-process interrogation/*.html instead
 *
 * --force: replaces any existing include code (old inline IIFE or prior tags)
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
let rootOverride = null;
let dirOverride = null;
const passthroughArgs = [];
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i] === '--root') {
    rootOverride = argv[i + 1];
    i += 1;
    if (!rootOverride) {
      console.error('--root requires a path argument');
      process.exit(1);
    }
    continue;
  }
  if (argv[i] === '--dir') {
    dirOverride = argv[i + 1];
    i += 1;
    if (!dirOverride) {
      console.error('--dir requires a path argument');
      process.exit(1);
    }
    continue;
  }
  passthroughArgs.push(argv[i]);
}
const ROOT = rootOverride ? path.resolve(rootOverride) : path.resolve(__dirname, '..');
// Default to alignment/; --dir interrogation batch-processes interrogation/.
const TARGET_DIR = path.join(ROOT, dirOverride ?? 'alignment');

const dryRun = passthroughArgs.includes('--dry-run');
const force = passthroughArgs.includes('--force');
const specificFile = passthroughArgs.find(a => a.endsWith('.html'));

const KOKORO_TAG = '<script src="../scripts/alignment-tts-kokoro.js"></script>';
const NAV_TAG = '<script src="../scripts/alignment-question-nav.js"></script>';
const isInterrogation = dirOverride === 'interrogation';

// The question-nav pager only belongs on pages that have answerable questions:
// every interrogation round page, and alignment review pages (not confirmed
// records). Confirmed alignment pages omit it — the convention keeps them as
// read-only approval records, and the nav script would find no blocks anyway.
const CONFIRMED_RE = /data-alignment-status=["']confirmed["']|alignment_status:\s*confirmed/i;
// The review "Compile Responses" control is the definitive marker of an active
// review alignment page — mandated on every review page, forbidden on confirmed
// records — so it precisely scopes the nav include without matching stray radios
// (chart toggles, filters) on non-review pages.
const ANSWERABLE_RE = /\bCompile Responses\b/;

function isNavEligible(html) {
  if (isInterrogation) return true;
  if (CONFIRMED_RE.test(html)) return false;
  return ANSWERABLE_RE.test(html);
}

function stripOldTTS(html) {
  // Remove old inline IIFE TTS block
  const marker = '// --- Brief Me TTS ---';
  const markerIdx = html.indexOf(marker);
  if (markerIdx !== -1) {
    const scriptStart = html.lastIndexOf('<script>', markerIdx);
    const scriptEnd = html.indexOf('</script>', markerIdx);
    if (scriptStart !== -1 && scriptEnd !== -1) {
      html = html.slice(0, scriptStart) + html.slice(scriptEnd + '</script>'.length);
    }
  }
  // Remove existing Kokoro and question-nav src tags if present
  const kokoroTagRe = /<script[^>]*src="[^"]*alignment-tts-kokoro\.js"><\/script>\s*/g;
  const navTagRe = /<script[^>]*src="[^"]*alignment-question-nav\.js"><\/script>\s*/g;
  html = html.replace(kokoroTagRe, '').replace(navTagRe, '');
  return html;
}

function inject(filePath) {
  const rel = path.relative(ROOT, filePath);
  let html = readFileSync(filePath, 'utf8');

  const hasKokoro = html.includes('alignment-tts-kokoro.js');
  const hasNav = html.includes('alignment-question-nav.js');
  const hasOldTTS = html.includes('alignTTS');
  const navEligible = isNavEligible(html);

  // Desired end-state: the Kokoro tag on every page, plus the nav tag on
  // nav-eligible pages. Nothing to do when both already hold (without --force).
  const navSatisfied = navEligible ? hasNav : true;
  if (hasKokoro && navSatisfied && !hasOldTTS && !force) {
    console.log(`  skip (includes present): ${rel}`);
    return false;
  }

  if (force) {
    html = stripOldTTS(html);
  } else if (hasOldTTS) {
    console.log(`  skip (has old TTS, use --force to replace): ${rel}`);
    return false;
  }

  const tags = [];
  if (!html.includes('alignment-tts-kokoro.js')) tags.push(KOKORO_TAG);
  if (navEligible && !html.includes('alignment-question-nav.js')) tags.push(NAV_TAG);
  if (!tags.length) {
    console.log(`  skip (includes present): ${rel}`);
    return false;
  }

  const insertPoint = html.lastIndexOf('</body>');
  if (insertPoint === -1) {
    console.log(`  skip (no </body>): ${rel}`);
    return false;
  }

  const scriptBlock = '\n' + tags.join('\n');
  html = html.slice(0, insertPoint) + scriptBlock + '\n' + html.slice(insertPoint);

  if (dryRun) {
    console.log(`  would inject (${tags.length} tag${tags.length > 1 ? 's' : ''}): ${rel}`);
  } else {
    writeFileSync(filePath, html, 'utf8');
    console.log(`  injected (${tags.length} tag${tags.length > 1 ? 's' : ''}): ${rel}`);
  }
  return true;
}

let files;
if (specificFile) {
  const full = path.resolve(ROOT, specificFile);
  files = [full];
} else {
  files = readdirSync(TARGET_DIR)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .map(f => path.join(TARGET_DIR, f));
}

console.log(`${dryRun ? '[DRY RUN] ' : ''}Injecting Brief Me + question-nav includes into ${files.length} page(s)...`);
let count = 0;
for (const f of files) {
  if (inject(f)) count++;
}
console.log(`Done. ${dryRun ? 'Would inject' : 'Injected'}: ${count}, Skipped: ${files.length - count}`);
