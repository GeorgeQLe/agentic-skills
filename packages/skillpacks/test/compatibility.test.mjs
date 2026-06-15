import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(packageRoot, '..', '..');

const expectedMatrix = new Map([
  ['help / --help / --version', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['list --json', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['list-packs', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['status', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['set-mode <mode>', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['set-update-mode <mode>', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['init', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['uninstall-global', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['install <name...>', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['remove <name...>', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['refresh', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['doctor', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['doctor --fix', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['doctor --fix --agent-docs [--dry-run]', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['alignment bundles [--dry-run] [--check]', { owner: 'Node-owned wrapper', bash: 'No', jq: 'No' }],
  ['alignment pages audit', { owner: 'Node-owned wrapper', bash: 'No', jq: 'No' }],
  ['alignment pages open <alignment/page.html> [--browser <browser>]', { owner: 'Node-owned wrapper', bash: 'No', jq: 'No' }],
  ['alignment pages serve [--port <port>]', { owner: 'Node-owned wrapper', bash: 'No', jq: 'No' }],
  ['alignment pages inject-tts [--force] [alignment/<page>.html]', { owner: 'Node-owned wrapper', bash: 'No', jq: 'No' }],
  ['alignment verify', { owner: 'Node-owned wrapper', bash: 'No', jq: 'No' }],
  ['prune [--dry-run]', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['pin <skill> <version>', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['unpin <skill>', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['list', { owner: 'Shell-backed', bash: 'Yes', jq: 'No' }],
  ['recommend', { owner: 'Shell-backed', bash: 'Yes', jq: 'No' }],
  ['which <skill>', { owner: 'Shell-backed', bash: 'Yes', jq: 'Optional' }],
  ['install-deck <deck> [--full]', { owner: 'Hybrid shell materialization', bash: 'Yes', jq: 'Yes' }]
]);

function readCompatibilityMatrix() {
  const doc = readFileSync(join(repoRoot, 'docs/skillpacks-npm-distribution.md'), 'utf8');
  const start = '<!-- gskp-compatibility-matrix:start -->';
  const end = '<!-- gskp-compatibility-matrix:end -->';
  const startIndex = doc.indexOf(start);
  const endIndex = doc.indexOf(end);

  assert.notEqual(startIndex, -1, 'compatibility matrix start marker missing');
  assert.notEqual(endIndex, -1, 'compatibility matrix end marker missing');

  const rows = new Map();
  const table = doc.slice(startIndex + start.length, endIndex);
  for (const line of table.split('\n')) {
    if (!line.startsWith('| `')) {
      continue;
    }
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());
    const command = cells[0].replaceAll('`', '');
    rows.set(command, {
      owner: cells[1],
      backend: cells[2],
      bash: cells[3],
      jq: cells[4],
      notes: cells[5]
    });
  }
  return rows;
}

describe('skillpacks compatibility matrix', () => {
  it('documents the current command ownership and dependency split', () => {
    const actual = readCompatibilityMatrix();

    assert.deepEqual([...actual.keys()].sort(), [...expectedMatrix.keys()].sort());
    for (const [command, expected] of expectedMatrix) {
      const row = actual.get(command);
      assert.equal(row.owner, expected.owner, `${command} owner`);
      assert.equal(row.bash, expected.bash, `${command} bash dependency`);
      assert.equal(row.jq, expected.jq, `${command} jq dependency`);
    }
  });

  it('keeps documented commands aligned with the CLI help surface', () => {
    const cliSource = readFileSync(
      join(packageRoot, 'src/cli/run-pack-script.mjs'),
      'utf8'
    );
    const usageStart = cliSource.indexOf('Commands:');
    const usageEnd = cliSource.indexOf('Project-local commands write');
    const usageBlock = cliSource.slice(usageStart, usageEnd);

    for (const command of expectedMatrix.keys()) {
      if (command === 'help / --help / --version') {
        continue;
      }
      assert.match(usageBlock, new RegExp(`  ${command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s`));
    }

    assert.match(
      cliSource,
      /return runCommand\('bash', \[packScriptPath, command, \.\.\.rest\]\);/,
      'shell-backed fallback should still execute packaged pack.sh'
    );
    assert.match(
      cliSource,
      /if \(command === 'install-deck'\) \{[\s\S]*requireCommand\(\s*'bash'[\s\S]*requireCommand\(\s*'jq'/,
      'install-deck should remain explicitly documented as hybrid shell materialization'
    );
    assert.match(
      cliSource,
      /if \(command === 'uninstall-global'\) \{[\s\S]*return uninstallGlobal\(\)/,
      'uninstall-global should be a Node-owned command that cleans legacy user-home installs'
    );
    assert.doesNotMatch(
      cliSource,
      /init --global|init-global|runGlobalInit/,
      'the retired user-home global init path should be fully removed from the CLI'
    );
  });
});

describe('skillpacks Phase 4 release-readiness docs', () => {
  it('documents npm usage alongside the source-checkout path', () => {
    const readme = readFileSync(join(repoRoot, 'README.md'), 'utf8');
    const quickstart = readFileSync(join(repoRoot, 'docs/QUICKSTART.md'), 'utf8');
    const packs = readFileSync(join(repoRoot, 'docs/packs.md'), 'utf8');
    const decks = readFileSync(join(repoRoot, 'docs/decks.md'), 'utf8');

    for (const [label, doc] of [
      ['README.md', readme],
      ['docs/QUICKSTART.md', quickstart],
      ['docs/packs.md', packs]
    ]) {
      assert.match(doc, /scripts\/pack\.sh install/, `${label} should keep the checkout install path`);
      assert.match(doc, /npx skillpacks install/, `${label} should document npm install usage`);
    }

    assert.match(decks, /npx skillpacks install-deck vard/, 'decks doc should document npm deck installs');
    assert.match(decks, /npx skillpacks install-deck business-afps/, 'decks doc should use install-deck for canonical decks');
    assert.doesNotMatch(decks, /npx skillpacks install <deck>/, 'decks doc must not model decks as generic pack installs');
    assert.match(readme, /npx skillpacks alignment bundles --check/, 'README should document npm alignment bundle checks');
    assert.match(quickstart, /npx skillpacks alignment pages audit/, 'quickstart should document npm alignment page audits');
  });

  it('documents migration and package-semver vs skill-version pinning', () => {
    const docs = [
      readFileSync(join(repoRoot, 'README.md'), 'utf8'),
      readFileSync(join(repoRoot, 'docs/QUICKSTART.md'), 'utf8'),
      readFileSync(join(repoRoot, 'docs/packs.md'), 'utf8'),
      readFileSync(join(repoRoot, 'docs/skillpacks-npm-distribution.md'), 'utf8')
    ].join('\n');

    assert.match(docs, /npx skillpacks refresh/, 'migration should tell users how to refresh from npm');
    assert.match(docs, /skillpacks@<semver>|skillpacks@0\.1\.0/, 'docs should explain npm package semver');
    assert.match(docs, /npx @glexcorp\/gskp init/, 'docs should mention the scoped alias package');
    assert.match(docs, /skill(?:'s)? `version:`|skill frontmatter versions/, 'docs should explain skill-level versions');
    assert.match(docs, /archive\/<version>\/SKILL\.md/, 'docs should explain archive availability for pins');
    assert.match(docs, /Phase 4 prepares the package for a dry-run release only/, 'release prep should not imply publish');
  });
});

describe('skillpacks npm package metadata', () => {
  it('keeps public publish metadata in the package manifest', () => {
    const packageJson = JSON.parse(
      readFileSync(join(packageRoot, 'package.json'), 'utf8')
    );

    assert.equal(packageJson.name, 'skillpacks');
    assert.equal(packageJson.bin.gskp, 'bin/skillpacks.mjs');
    assert.equal(packageJson.bin.skillpacks, 'bin/skillpacks.mjs');
    assert.equal(packageJson.license, 'MIT');
    assert.equal(
      packageJson.repository.url,
      'git+https://github.com/GeorgeQLe/agentic-skills.git'
    );
    assert.equal(packageJson.repository.directory, 'packages/skillpacks');
    assert.equal(
      packageJson.bugs.url,
      'https://github.com/GeorgeQLe/agentic-skills/issues'
    );
    assert.equal(
      packageJson.homepage,
      'https://github.com/GeorgeQLe/agentic-skills#readme'
    );
    assert.ok(packageJson.files.includes('LICENSE'), 'npm files should include LICENSE');
  });
});
