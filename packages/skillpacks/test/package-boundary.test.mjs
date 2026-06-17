import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: packageRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024
  });

  assert.equal(
    result.status,
    0,
    [result.stdout, result.stderr].filter(Boolean).join('\n')
  );
  return result.stdout;
}

function packedPaths() {
  run(process.execPath, ['scripts/build-package.mjs', '--check']);
  const stdout = run('npm', ['pack', './build', '--dry-run', '--json', '--silent']);
  const [packument] = JSON.parse(stdout);

  assert.ok(packument, 'npm pack should return package metadata');
  return new Set(
    packument.files.map((file) => file.path.replace(/^package\//, ''))
  );
}

function hasPathClass(paths, deniedPath) {
  return [...paths].some((filePath) => {
    return filePath === deniedPath || filePath.startsWith(`${deniedPath}/`);
  });
}

describe('skillpacks npm publish target boundary', () => {
  it('publishes only runtime package content and npm metadata', () => {
    const paths = packedPaths();

    for (const deniedPath of [
      'docs',
      'AGENTS.md',
      'CLAUDE.md',
      'prompts',
      'apps',
      'alignment',
      'tasks',
      'tests'
    ]) {
      assert.equal(
        hasPathClass(paths, deniedPath),
        false,
        `${deniedPath} should not be published`
      );
    }

    for (const requiredPath of [
      'package.json',
      'README.md',
      'CHANGELOG.md',
      'LICENSE',
      'bin/skillpacks.mjs',
      'dist/skillpacks-manifest.json',
      'src/cli/run-pack-script.mjs',
      'scripts/pack.sh',
      'scripts/skill-links.sh',
      'scripts/upgrade-alignment-page.mjs',
      'scripts/audit-alignment-pages.mjs',
      'scripts/inject-tts.mjs',
      'scripts/alignment-tts-kokoro.js',
      'assets/alignment-page-convention.md',
      'base/codex/pack/SKILL.md',
      'packs/release-ops/codex/release/SKILL.md',
      'packs/release-ops/codex/release/ALIGNMENT-PAGE.md',
      'packs/code-quality/PACK.md'
    ]) {
      assert.equal(paths.has(requiredPath), true, `${requiredPath} should be published`);
    }
  });
});
