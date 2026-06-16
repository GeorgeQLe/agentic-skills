import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  formatPackageStatus,
  printPackageStatus,
  shouldPrintPackageStatus
} from '../src/cli/update-check.mjs';

describe('skillpacks package status output', () => {
  it('formats current, update-available, and unavailable states', () => {
    assert.equal(formatPackageStatus('0.1.4', '0.1.4'), 'skillpacks 0.1.4 (latest)');
    assert.equal(
      formatPackageStatus('0.1.4', '0.1.5'),
      'skillpacks 0.1.4 (latest 0.1.5 available; run: npx skillpacks@latest)'
    );
    assert.equal(
      formatPackageStatus('0.1.4', null),
      'skillpacks 0.1.4 (update check unavailable)'
    );
  });

  it('prints only for human-facing commands', () => {
    assert.equal(shouldPrintPackageStatus([]), true);
    assert.equal(shouldPrintPackageStatus(['help']), true);
    assert.equal(shouldPrintPackageStatus(['list']), true);
    assert.equal(shouldPrintPackageStatus(['install', 'quality-sweep']), true);
    assert.equal(shouldPrintPackageStatus(['alignment', 'pages', 'audit']), true);

    assert.equal(shouldPrintPackageStatus(['--version']), false);
    assert.equal(shouldPrintPackageStatus(['-v']), false);
    assert.equal(shouldPrintPackageStatus(['list', '--json']), false);
  });

  it('writes package status to stderr when enabled', async () => {
    const originalWrite = process.stderr.write;
    let stderr = '';
    process.stderr.write = (chunk) => {
      stderr += chunk;
      return true;
    };

    try {
      await printPackageStatus(Promise.resolve('0.1.5'), '0.1.4', { enabled: true });
      assert.equal(
        stderr,
        'skillpacks 0.1.4 (latest 0.1.5 available; run: npx skillpacks@latest)\n'
      );

      stderr = '';
      await printPackageStatus(Promise.resolve('0.1.5'), '0.1.4', { enabled: false });
      assert.equal(stderr, '');
    } finally {
      process.stderr.write = originalWrite;
    }
  });
});
