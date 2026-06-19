import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { SKILL_CONVENTIONS } from '../../../scripts/skill-convention-registry.mjs';

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
      'scripts/skill-convention-bundle-audit.mjs',
      'scripts/skill-convention-registry.mjs',
      'scripts/upgrade-alignment-page.mjs',
      'scripts/upgrade-interrogation-page.mjs',
      'scripts/upgrade-prototype-session-loop.mjs',
      'scripts/audit-alignment-pages.mjs',
      'scripts/inject-tts.mjs',
      'scripts/alignment-tts-kokoro.js',
      'assets/alignment-page-convention.md',
      'assets/interrogation-page-convention.md',
      'assets/prototype-session-loop-convention.md',
      'base/codex/pack/SKILL.md',
      'packs/release-ops/codex/release/SKILL.md',
      'packs/release-ops/codex/release/ALIGNMENT-PAGE.md',
      'base/codex/idea-scope-brief/INTERROGATION-PAGE.md',
      'packs/product-design/codex/user-flow-map/PROTOTYPE-SESSION-LOOP.md',
      'packs/product-testing/codex/uat/PROTOTYPE-SESSION-LOOP.md',
      'packs/code-quality/PACK.md'
    ]) {
      assert.equal(paths.has(requiredPath), true, `${requiredPath} should be published`);
    }

    for (const [id, convention] of Object.entries(SKILL_CONVENTIONS)) {
      assert.equal(paths.has(convention.generatorScript), true, `${id} generator should be published`);
      assert.equal(paths.has(convention.packageAsset), true, `${id} package asset should be published`);
    }
  });
});
