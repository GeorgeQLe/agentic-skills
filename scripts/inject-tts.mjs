#!/usr/bin/env node
/**
 * Injects the alignment TTS module tag into existing alignment HTML pages.
 * Idempotent — skips pages that already have the Kokoro TTS module.
 *
 * Usage: node scripts/inject-tts.mjs [--root <path>] [--dir <subdir>] [--dry-run] [--force] [<subdir>/specific-page.html]
 *        Default: processes all alignment/*.html except index.html
 *        --dir interrogation: batch-process interrogation/*.html instead
 *
 * --force: replaces any existing TTS code (old inline IIFE or prior module tag)
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
const scriptBlock = `\n${KOKORO_TAG}`;

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
  // Remove old Kokoro module tag if present
  const kokoroTagRe = /<script[^>]*src="[^"]*alignment-tts-kokoro\.js"><\/script>\s*/g;
  html = html.replace(kokoroTagRe, '');
  return html;
}

function inject(filePath) {
  const rel = path.relative(ROOT, filePath);
  let html = readFileSync(filePath, 'utf8');

  const hasKokoro = html.includes('alignment-tts-kokoro.js');
  const hasOldTTS = html.includes('alignTTS');

  if (hasKokoro && !force) {
    console.log(`  skip (already has Kokoro TTS): ${rel}`);
    return false;
  }

  if ((hasKokoro || hasOldTTS) && force) {
    html = stripOldTTS(html);
  } else if (hasOldTTS && !force) {
    console.log(`  skip (has old TTS, use --force to replace): ${rel}`);
    return false;
  }

  const insertPoint = html.lastIndexOf('</body>');
  if (insertPoint === -1) {
    console.log(`  skip (no </body>): ${rel}`);
    return false;
  }

  html = html.slice(0, insertPoint) + scriptBlock + '\n' + html.slice(insertPoint);

  if (dryRun) {
    console.log(`  would inject: ${rel}`);
  } else {
    writeFileSync(filePath, html, 'utf8');
    console.log(`  injected: ${rel}`);
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

console.log(`${dryRun ? '[DRY RUN] ' : ''}Injecting Kokoro TTS into ${files.length} page(s)...`);
let count = 0;
for (const f of files) {
  if (inject(f)) count++;
}
console.log(`Done. ${dryRun ? 'Would inject' : 'Injected'}: ${count}, Skipped: ${files.length - count}`);
