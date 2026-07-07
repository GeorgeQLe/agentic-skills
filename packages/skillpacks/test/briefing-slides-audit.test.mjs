import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { after, describe, it } from 'node:test';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(packageRoot, '../..');
const auditScript = resolve(repoRoot, 'scripts/audit-briefing-slides.mjs');
const templatePath = resolve(packageRoot, 'assets/templates/briefing-slides.html');
const tmpRoot = resolve(packageRoot, 'test/.tmp-briefing-slides-audit');

function repoRelative(absolutePath) {
  return relative(repoRoot, absolutePath).split('\\').join('/');
}

function runAudit(relativePath) {
  return spawnSync(process.execPath, [auditScript, relativePath], {
    cwd: repoRoot,
    encoding: 'utf8'
  });
}

function assertAuditPasses(relativePath) {
  const result = runAudit(relativePath);
  assert.equal(result.status, 0, [result.stdout, result.stderr].filter(Boolean).join('\n'));
  assert.match(result.stdout, /Briefing slides audit passed/);
}

function assertAuditFails(relativePath, label) {
  const result = runAudit(relativePath);
  assert.notEqual(result.status, 0, `${relativePath} should fail`);
  assert.match(result.stderr, new RegExp(label));
}

function writeMutatedDeck(name, mutate) {
  mkdirSync(tmpRoot, { recursive: true });
  const target = resolve(tmpRoot, `${name}.html`);
  writeFileSync(target, mutate(readFileSync(templatePath, 'utf8')));
  return repoRelative(target);
}

after(() => {
  rmSync(tmpRoot, { recursive: true, force: true });
});

describe('briefing slides audit', () => {
  it('accepts the canonical briefing slides template', () => {
    assertAuditPasses(repoRelative(templatePath));
  });

  it('rejects downstream-style stacked document decks', () => {
    assertAuditFails(
      'packages/skillpacks/test/fixtures/briefing-slides/legacy-stacked.html',
      'slide-by-slide stage'
    );
  });

  for (const [name, label, mutate] of [
    ['missing-briefing-slides', 'YAML briefing contract', (text) => text.replaceAll('briefing_slides:', 'briefing_slide_path:')],
    ['missing-slide-feedback', 'YAML briefing contract', (text) => text.replaceAll('slide_feedback:', 'slide_notes:')],
    ['missing-annotations', 'slide-scoped feedback sidebar', (text) => text.replaceAll('sidebarAnnotation', 'sidebarNote')],
    ['missing-marked-slides', 'YAML briefing contract', (text) => text.replaceAll('marked_slides:', 'slide_marks:')],
    ['missing-print-css', 'print CSS', (text) => text.replace('@media print', '@media screen')],
    ['missing-keyboard-navigation', 'keyboard navigation', (text) => text.replaceAll("addEventListener('keydown'", "addEventListener('keyup'")],
    ['missing-filmstrip', 'filmstrip navigation', (text) => text.replaceAll('filmstrip', 'thumbstrip')]
  ]) {
    it(`rejects decks with ${name.replaceAll('-', ' ')}`, () => {
      assertAuditFails(writeMutatedDeck(name, mutate), label);
    });
  }
});
