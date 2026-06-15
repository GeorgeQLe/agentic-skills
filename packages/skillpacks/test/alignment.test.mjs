import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, it } from 'node:test';
import { resolveAlignmentCommand, runSkillpacksCli } from '../src/cli/run-pack-script.mjs';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(packageRoot, '..', '..');
const tmpDirs = [];

function makeTempProject() {
  const dir = mkdtempSync(join(tmpdir(), 'skillpacks-alignment-'));
  tmpDirs.push(dir);
  return dir;
}

async function captureCli(args) {
  const originalLog = console.log;
  let stdout = '';
  console.log = (...parts) => {
    stdout += `${parts.join(' ')}\n`;
  };
  try {
    const exitCode = await runSkillpacksCli(args);
    return { exitCode, stdout };
  } finally {
    console.log = originalLog;
  }
}

afterEach(() => {
  for (const dir of tmpDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  tmpDirs.length = 0;
});

describe('skillpacks alignment command parsing', () => {
  it('prints alignment-specific help', async () => {
    const { exitCode, stdout } = await captureCli(['alignment', '--help']);

    assert.equal(exitCode, 0);
    assert.match(stdout, /gskp alignment/);
    assert.match(stdout, /alignment bundles \[--dry-run\] \[--check\]/);
    assert.match(stdout, /alignment pages audit/);
    assert.match(stdout, /alignment pages open <alignment\/page.html>/);
    assert.match(stdout, /alignment pages inject-tts \[--force\]/);
    assert.match(stdout, /alignment verify/);
  });

  it('wraps bundle generation with --root set to the target project', () => {
    const projectRoot = makeTempProject();

    const command = resolveAlignmentCommand(['bundles', '--check'], { projectRoot });

    assert.equal(command.kind, 'run');
    assert.equal(command.command, process.execPath);
    assert.deepEqual(command.args.slice(1), ['--root', projectRoot, '--check']);
    assert.equal(command.args[0].endsWith('scripts/upgrade-alignment-page.mjs'), true);
  });

  it('wraps active-page audit with --root set to the target project', () => {
    const projectRoot = makeTempProject();

    const command = resolveAlignmentCommand(['pages', 'audit'], { projectRoot });

    assert.equal(command.kind, 'run');
    assert.deepEqual(command.args.slice(1), ['--root', projectRoot]);
    assert.equal(command.args[0].endsWith('scripts/audit-alignment-pages.mjs'), true);
  });

  it('wraps page opening through the packaged opener script', () => {
    const projectRoot = makeTempProject();

    const command = resolveAlignmentCommand(
      ['pages', 'open', 'alignment/example.html', '--browser', 'brave'],
      { projectRoot }
    );

    assert.equal(command.kind, 'run');
    assert.equal(command.command, process.execPath);
    assert.deepEqual(command.args.slice(1), ['alignment/example.html', '--browser', 'brave']);
    assert.equal(command.args[0].endsWith('scripts/open-html-page.mjs'), true);
  });

  it('passes opener dry-run and json flags through unchanged', () => {
    const projectRoot = makeTempProject();

    const command = resolveAlignmentCommand(
      ['pages', 'open', '--dry-run', '--json', '--browser=chrome', 'alignment/example.html'],
      { projectRoot }
    );

    assert.equal(command.kind, 'run');
    assert.deepEqual(command.args.slice(1), [
      '--dry-run',
      '--json',
      '--browser=chrome',
      'alignment/example.html'
    ]);
  });

  it('wraps TTS injection and marks real runs for asset installation', () => {
    const projectRoot = makeTempProject();

    const command = resolveAlignmentCommand(
      ['pages', 'inject-tts', '--force', 'alignment/example.html'],
      { projectRoot }
    );

    assert.equal(command.kind, 'run');
    assert.equal(command.ensureTtsAsset, true);
    assert.deepEqual(command.args.slice(1), [
      '--root',
      projectRoot,
      '--force',
      'alignment/example.html'
    ]);
    assert.equal(command.args[0].endsWith('scripts/inject-tts.mjs'), true);
  });

  it('does not install the TTS asset for dry-run injection previews', () => {
    const projectRoot = makeTempProject();

    const command = resolveAlignmentCommand(
      ['pages', 'inject-tts', '--dry-run', 'alignment/example.html'],
      { projectRoot }
    );

    assert.equal(command.ensureTtsAsset, false);
  });

  it('rejects unknown alignment subcommands and unsafe page paths', () => {
    assert.throws(
      () => resolveAlignmentCommand(['pages', 'repair']),
      /alignment pages: unknown command 'repair'/
    );
    assert.throws(
      () => resolveAlignmentCommand(['pages', 'inject-tts', '../alignment/example.html']),
      /expected an alignment HTML page path/
    );
    assert.throws(
      () => resolveAlignmentCommand(['pages', 'open', 'alignment/../example.html']),
      /expected an alignment HTML page path/
    );
    assert.throws(
      () => resolveAlignmentCommand(['pages', 'open', 'docs/example.html']),
      /expected an alignment HTML page path/
    );
    assert.throws(
      () => resolveAlignmentCommand(['pages', 'open', 'alignment/example.html', '--browser', 'firefox']),
      /unsupported browser 'firefox'/
    );
  });
});

describe('skillpacks package staging boundary for alignment commands', () => {
  it('stages alignment scripts and assets while keeping denied paths out', async () => {
    const { spawnSync } = await import('node:child_process');
    const result = spawnSync(process.execPath, ['scripts/build-package.mjs', '--check'], {
      cwd: packageRoot,
      encoding: 'utf8'
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);

    for (const relativePath of [
      'scripts/upgrade-alignment-page.mjs',
      'scripts/audit-alignment-pages.mjs',
      'scripts/open-html-page.mjs',
      'scripts/inject-tts.mjs',
      'scripts/alignment-tts-kokoro.js',
      'scripts/alignment-chart-snippets.js',
      'scripts/alignment-skip-list.txt',
      'scripts/alignment-bespoke-list.txt',
      'docs/alignment-page-convention.md'
    ]) {
      assert.equal(
        existsSync(join(packageRoot, 'build', relativePath)),
        true,
        `${relativePath} should be staged`
      );
    }

    for (const deniedPath of ['alignment', 'tasks', 'prompts']) {
      assert.equal(
        existsSync(join(packageRoot, 'build', deniedPath)),
        false,
        `${deniedPath} should remain outside the package`
      );
    }
  });
});
