#!/usr/bin/env node
/**
 * Injects the alignment TTS snippet into existing alignment HTML pages.
 * Idempotent — skips pages that already have the TTS code.
 *
 * Usage: node scripts/inject-tts.mjs [--dry-run] [alignment/specific-page.html]
 *        Default: processes all alignment/*.html except index.html
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ALIGNMENT_DIR = path.join(ROOT, 'alignment');

const dryRun = process.argv.includes('--dry-run');
const specificFile = process.argv.find(a => a.endsWith('.html'));

const ttsSnippet = readFileSync(path.join(__dirname, 'alignment-tts-snippet.js'), 'utf8');
const scriptBlock = `\n<script>\n// --- Brief Me TTS ---\n${ttsSnippet}\n</script>`;

function inject(filePath) {
  const rel = path.relative(ROOT, filePath);
  let html = readFileSync(filePath, 'utf8');

  if (html.includes('alignTTS')) {
    console.log(`  skip (already has TTS): ${rel}`);
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
  const full = path.resolve(specificFile);
  files = [full];
} else {
  files = readdirSync(ALIGNMENT_DIR)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .map(f => path.join(ALIGNMENT_DIR, f));
}

console.log(`${dryRun ? '[DRY RUN] ' : ''}Injecting TTS into ${files.length} alignment page(s)...`);
let count = 0;
for (const f of files) {
  if (inject(f)) count++;
}
console.log(`Done. ${dryRun ? 'Would inject' : 'Injected'}: ${count}, Skipped: ${files.length - count}`);
