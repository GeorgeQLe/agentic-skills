import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const scanScript = resolve(repoRoot, 'packs/base/codex/workflow-backfill/scripts/scan.mjs');

function fixtureRepo() {
  return mkdtempSync(resolve(tmpdir(), 'workflow-backfill-'));
}

function write(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

function runScan(root) {
  const result = spawnSync(process.execPath, [scanScript, root, '--json'], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024
  });
  assert.equal(result.status, 0, [result.stdout, result.stderr].filter(Boolean).join('\n'));
  return JSON.parse(result.stdout);
}

function installSkill(root, platform, name, { version = 'v0.26', conventions = ['briefing-slides'], marker = {} } = {}) {
  const skillRoot = resolve(root, `.${platform}/skills/${name}`);
  write(
    resolve(skillRoot, 'SKILL.md'),
    [
      '---',
      `name: ${name}`,
      `version: ${version}`,
      `required_conventions: [${conventions.join(', ')}]`,
      '---',
      '',
      `# ${name}`
    ].join('\n')
  );
  write(
    resolve(skillRoot, '.agentic-skills-managed'),
    [
      `source=${marker.source || `packs/customer-lifecycle/${platform}/${name}`}`,
      'managed_by=agentic-skills',
      `source_version=${marker.source_version || version}`,
      `source_sha=${marker.source_sha || 'a'.repeat(64)}`,
      marker.source_package ? `source_package=${marker.source_package}` : null
    ].filter(Boolean).join('\n') + '\n'
  );
}

describe('workflow-backfill scanner', () => {
  it('reports stale-marker evidence and a missing briefing deck candidate', () => {
    const root = fixtureRepo();
    installSkill(root, 'codex', 'journey-map', {
      version: 'v0.26',
      marker: { source_package: 'skillpacks@0.1.21' }
    });
    write(resolve(root, '.agents/project.json'), JSON.stringify({
      enabled_skills: { 'journey-map': 'customer-lifecycle' },
      enabled_skill_dependencies: { 'create-briefing-slides': ['briefing-slides'] }
    }, null, 2));
    write(resolve(root, 'alignment/journey-map-acme.html'), '<button>Compile Responses</button>');

    const scan = runScan(root);
    const skill = scan.installed_skills.find((entry) => entry.platform === 'codex' && entry.name === 'journey-map');
    const page = scan.pages.find((entry) => entry.source_path === 'alignment/journey-map-acme.html');

    assert.equal(skill.marker.source_package, 'skillpacks@0.1.21');
    assert.equal(skill.marker.source_version, 'v0.26');
    assert.equal(skill.marker_status, 'recorded');
    assert.deepEqual(scan.dependency_gaps, [
      {
        platform: 'codex',
        missing_skill: 'create-briefing-slides',
        reason: 'installed-skill-requires-briefing-slides'
      }
    ]);
    assert.equal(page.expected_deck, 'briefing-slides/journey-map-acme.html');
    assert.equal(page.deck_exists, false);
    assert.equal(page.review_gate_present, true);
  });

  it('flags canonical target hints without creating canonical research files', () => {
    const root = fixtureRepo();
    installSkill(root, 'codex', 'journey-map');
    write(
      resolve(root, 'alignment/journey-map-synthesis.html'),
      '<pre>approval_status: not-approved\ntarget_path: research/acme/journey-map.md</pre>'
    );

    const scan = runScan(root);
    const page = scan.pages.find((entry) => entry.source_path === 'alignment/journey-map-synthesis.html');

    assert.equal(page.review_gate_present, true);
    assert.equal(page.canonical_target_hint, true);
    assert.equal(page.deck_exists, false);
  });

  it('reports existing decks as conflicts instead of replacement work', () => {
    const root = fixtureRepo();
    installSkill(root, 'codex', 'journey-map');
    write(resolve(root, 'alignment/journey-map-acme.html'), '<button>Compile Responses</button>');
    write(resolve(root, 'briefing-slides/journey-map-acme.html'), '<!doctype html><title>Existing</title>');

    const scan = runScan(root);
    const page = scan.pages.find((entry) => entry.source_path === 'alignment/journey-map-acme.html');

    assert.equal(page.expected_deck, 'briefing-slides/journey-map-acme.html');
    assert.equal(page.deck_exists, true);
  });
});
