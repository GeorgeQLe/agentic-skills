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
  ['install <name...>', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['remove <name...>', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['refresh', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['doctor', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['prune [--dry-run]', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['pin <skill> <version>', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['unpin <skill>', { owner: 'Node-owned', bash: 'No', jq: 'No' }],
  ['list', { owner: 'Shell-backed', bash: 'Yes', jq: 'No' }],
  ['recommend', { owner: 'Shell-backed', bash: 'Yes', jq: 'No' }],
  ['which <skill>', { owner: 'Shell-backed', bash: 'Yes', jq: 'Optional' }],
  ['install-deck <deck> [--full]', { owner: 'Hybrid shell materialization', bash: 'Yes', jq: 'Yes' }],
  ['init-global [args...]', { owner: 'External script-backed', bash: 'Yes', jq: 'Optional' }]
]);

function readCompatibilityMatrix() {
  const doc = readFileSync(join(repoRoot, 'docs/skillpacks-npm-distribution.md'), 'utf8');
  const start = '<!-- skillpacks-compatibility-matrix:start -->';
  const end = '<!-- skillpacks-compatibility-matrix:end -->';
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
      /if \(command === 'init-global'\) \{[\s\S]*requireCommand\('bash'/,
      'init-global should remain explicitly documented as external script-backed'
    );
  });
});
