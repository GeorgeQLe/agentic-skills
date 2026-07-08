import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, it } from 'node:test';
import {
  resolveAlignmentCommand,
  resolveBriefingCommand,
  resolveInterrogationCommand,
  resolvePrototypeCommand,
  runSkillpacksCli
} from '../src/cli/run-pack-script.mjs';

const packageRoot = resolve(new URL('..', import.meta.url).pathname);
const repoRoot = resolve(packageRoot, '../..');
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
    assert.match(stdout, /alignment bundles \[--dry-run\] \[--check\] \[--legacy-bundles\]/);
    assert.match(stdout, /alignment pages audit/);
    assert.match(stdout, /alignment pages open <alignment\/page.html\|briefing-slides\/page.html>/);
    assert.match(stdout, /alignment pages serve \[--port <port>\]/);
    assert.match(stdout, /alignment pages inject-tts \[--force\]/);
    assert.match(stdout, /alignment pages scaffold <skill> <topic> --out alignment\/<skill>-<topic>\.html/);
    assert.match(stdout, /alignment verify/);
  });

  it('prints help for the page opener subcommand', async () => {
    const { exitCode, stdout } = await captureCli(['alignment', 'pages', 'open', '--help']);

    assert.equal(exitCode, 0);
    assert.match(stdout, /gskp alignment/);
    assert.match(stdout, /alignment pages open <alignment\/page.html\|briefing-slides\/page.html>/);
  });

  it('wraps bundle generation with --root set to the target project', () => {
    const projectRoot = makeTempProject();

    const command = resolveAlignmentCommand(['bundles', '--check', '--legacy-bundles'], { projectRoot });

    assert.equal(command.kind, 'run');
    assert.equal(command.command, process.execPath);
    assert.deepEqual(command.args.slice(1), ['--root', projectRoot, '--check', '--legacy-bundles']);
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

  it('allows briefing-slide decks through the packaged HTML opener', () => {
    const projectRoot = makeTempProject();

    const command = resolveAlignmentCommand(
      ['pages', 'open', 'briefing-slides/example.html', '--dry-run'],
      { projectRoot }
    );

    assert.equal(command.kind, 'run');
    assert.equal(command.command, process.execPath);
    assert.deepEqual(command.args.slice(1), ['briefing-slides/example.html', '--dry-run']);
    assert.equal(command.args[0].endsWith('scripts/open-html-page.mjs'), true);
  });

  it('wraps alignment serving through the packaged server script with the project root', () => {
    const projectRoot = makeTempProject();

    const command = resolveAlignmentCommand(['pages', 'serve'], { projectRoot });

    assert.equal(command.kind, 'run');
    assert.equal(command.command, process.execPath);
    assert.deepEqual(command.args.slice(1), [projectRoot]);
    assert.equal(command.args[0].endsWith('scripts/serve-alignment.mjs'), true);
    assert.equal(command.env.PORT, '8907');
  });

  it('sets PORT for alignment serving with either --port spelling', () => {
    const projectRoot = makeTempProject();

    const splitFlag = resolveAlignmentCommand(['pages', 'serve', '--port', '9000'], { projectRoot });
    const equalsFlag = resolveAlignmentCommand(['pages', 'serve', '--port=9001'], { projectRoot });

    assert.equal(splitFlag.env.PORT, '9000');
    assert.equal(equalsFlag.env.PORT, '9001');
    assert.deepEqual(splitFlag.args.slice(1), [projectRoot]);
    assert.deepEqual(equalsFlag.args.slice(1), [projectRoot]);
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
      /expected an alignment or briefing-slides HTML page path/
    );
    assert.throws(
      () => resolveAlignmentCommand(['pages', 'open', 'docs/example.html']),
      /expected an alignment or briefing-slides HTML page path/
    );
    assert.throws(
      () => resolveAlignmentCommand(['pages', 'open', 'briefing-slides/nested/example.html']),
      /expected an alignment or briefing-slides HTML page path/
    );
    assert.throws(
      () => resolveAlignmentCommand(['pages', 'open', 'alignment/example.html', '--browser', 'firefox']),
      /unsupported browser 'firefox'/
    );
  });

  it('rejects invalid alignment server arguments', () => {
    for (const args of [
      ['pages', 'serve', '--port'],
      ['pages', 'serve', '--port='],
      ['pages', 'serve', '--port', '0'],
      ['pages', 'serve', '--port', '65536'],
      ['pages', 'serve', '--port', '90.5'],
      ['pages', 'serve', '--port', 'abc']
    ]) {
      assert.throws(() => resolveAlignmentCommand(args), /alignment pages serve: .*port/);
    }

    assert.throws(
      () => resolveAlignmentCommand(['pages', 'serve', '--host', '127.0.0.1']),
      /unsupported flag '--host'/
    );
    assert.throws(
      () => resolveAlignmentCommand(['pages', 'serve', 'alignment/example.html']),
      /unexpected argument 'alignment\/example.html'/
    );
    assert.throws(
      () => resolveAlignmentCommand(['pages', 'serve', '--port', '9000', '--port=9001']),
      /--port can only be provided once/
    );
  });

  it('resolves alignment scaffold commands and rejects unsafe output paths', () => {
    const projectRoot = makeTempProject();

    const command = resolveAlignmentCommand(
      ['pages', 'scaffold', 'investigate', 'template-test', '--out', 'alignment/investigate-template-test.html'],
      { projectRoot }
    );

    assert.equal(command.kind, 'scaffold');
    assert.equal(command.projectRoot, projectRoot);
    assert.deepEqual(command.scaffold, {
      kind: 'alignment',
      skill: 'investigate',
      topic: 'template-test',
      out: 'alignment/investigate-template-test.html'
    });
    assert.equal(command.templatePath.endsWith('assets/templates/alignment-page.html'), true);

    assert.throws(
      () => resolveAlignmentCommand(['pages', 'scaffold', 'Investigate', 'template-test', '--out', 'alignment/Investigate-template-test.html']),
      /skill must be a lowercase slug/
    );
    assert.throws(
      () => resolveAlignmentCommand(['pages', 'scaffold', 'investigate', 'template-test', '--out', '../alignment/investigate-template-test.html']),
      /dot path segments/
    );
    assert.throws(
      () => resolveAlignmentCommand(['pages', 'scaffold', 'investigate', 'template-test', '--out', 'alignment/other-template-test.html']),
      /--out must be alignment\/investigate-template-test\.html/
    );
  });

  it('scaffolds an alignment page and index that pass the active-page audit', async () => {
    const projectRoot = makeTempProject();
    const originalCwd = process.cwd();
    process.chdir(projectRoot);
    try {
      const { exitCode, stdout } = await captureCli([
        'alignment',
        'pages',
        'scaffold',
        'investigate',
        'template-test',
        '--out',
        'alignment/investigate-template-test.html'
      ]);

      assert.equal(exitCode, 0);
      assert.match(stdout, /Scaffolded alignment\/investigate-template-test\.html/);
      assert.match(stdout, /Created alignment\/index\.html/);
    } finally {
      process.chdir(originalCwd);
    }

    const audit = spawnSync(process.execPath, ['scripts/audit-alignment-pages.mjs', '--root', projectRoot], {
      cwd: repoRoot,
      encoding: 'utf8'
    });
    assert.equal(audit.status, 0, [audit.stdout, audit.stderr].filter(Boolean).join('\n'));
  });
});

describe('skillpacks briefing command parsing', () => {
  it('prints briefing-specific help', async () => {
    const { exitCode, stdout } = await captureCli(['briefing', '--help']);

    assert.equal(exitCode, 0);
    assert.match(stdout, /gskp briefing/);
    assert.match(stdout, /briefing slides audit/);
  });

  it('prints help for the slides audit subcommand', async () => {
    const { exitCode, stdout } = await captureCli(['briefing', 'slides', 'audit', '--help']);

    assert.equal(exitCode, 0);
    assert.match(stdout, /gskp briefing/);
    assert.match(stdout, /briefing slides audit/);
  });

  it('wraps briefing-slide audit with --root set to the target project', () => {
    const projectRoot = makeTempProject();

    const command = resolveBriefingCommand(['slides', 'audit'], { projectRoot });

    assert.equal(command.kind, 'run');
    assert.equal(command.command, process.execPath);
    assert.deepEqual(command.args.slice(1), ['--root', projectRoot]);
    assert.equal(command.args[0].endsWith('scripts/audit-briefing-slides.mjs'), true);
  });

  it('rejects unknown briefing subcommands', () => {
    assert.throws(
      () => resolveBriefingCommand(['pages', 'audit']),
      /briefing: unknown command 'pages'/
    );
    assert.throws(
      () => resolveBriefingCommand(['slides', 'repair']),
      /briefing slides: unknown command 'repair'/
    );
    assert.throws(
      () => resolveBriefingCommand(['slides', 'audit', '--root', '/tmp/project']),
      /briefing slides audit does not accept arguments/
    );
  });
});

describe('skillpacks interrogation command parsing', () => {
  it('prints interrogation-specific help', async () => {
    const { exitCode, stdout } = await captureCli(['interrogation', '--help']);

    assert.equal(exitCode, 0);
    assert.match(stdout, /gskp interrogation/);
    assert.match(stdout, /interrogation pages scaffold <skill> <round> <branch> --out interrogation\/<skill>-r<round>-<branch>\.html/);
  });

  it('resolves interrogation scaffold commands and rejects invalid arguments', () => {
    const projectRoot = makeTempProject();

    const command = resolveInterrogationCommand(
      ['pages', 'scaffold', 'customer-discovery', '2', 'acme', '--out', 'interrogation/customer-discovery-r2-acme.html'],
      { projectRoot }
    );

    assert.equal(command.kind, 'scaffold');
    assert.equal(command.projectRoot, projectRoot);
    assert.deepEqual(command.scaffold, {
      kind: 'interrogation',
      skill: 'customer-discovery',
      round: '2',
      branch: 'acme',
      out: 'interrogation/customer-discovery-r2-acme.html'
    });
    assert.equal(command.templatePath.endsWith('assets/templates/interrogation-page.html'), true);

    assert.throws(
      () => resolveInterrogationCommand(['pages', 'scaffold', 'customer-discovery', '0', 'acme', '--out', 'interrogation/customer-discovery-r0-acme.html']),
      /round must be a positive integer/
    );
    assert.throws(
      () => resolveInterrogationCommand(['pages', 'scaffold', 'customer-discovery', '2', 'acme', '--out', 'interrogation/customer-discovery-r3-acme.html']),
      /--out must be interrogation\/customer-discovery-r2-acme\.html/
    );
    assert.throws(
      () => resolveInterrogationCommand(['pages', 'repair']),
      /interrogation pages: unknown command 'repair'/
    );
  });

  it('scaffolds an interrogation page that passes the active-page audit', async () => {
    const projectRoot = makeTempProject();
    const originalCwd = process.cwd();
    process.chdir(projectRoot);
    try {
      const { exitCode, stdout } = await captureCli([
        'interrogation',
        'pages',
        'scaffold',
        'customer-discovery',
        '1',
        'acme',
        '--out',
        'interrogation/customer-discovery-r1-acme.html'
      ]);

      assert.equal(exitCode, 0);
      assert.match(stdout, /Scaffolded interrogation\/customer-discovery-r1-acme\.html/);
    } finally {
      process.chdir(originalCwd);
    }

    const audit = spawnSync(process.execPath, ['scripts/audit-interrogation-pages.mjs', '--root', projectRoot], {
      cwd: repoRoot,
      encoding: 'utf8'
    });
    assert.equal(audit.status, 0, [audit.stdout, audit.stderr].filter(Boolean).join('\n'));
  });
});

describe('skillpacks prototype command parsing', () => {
  it('prints prototype-specific help', async () => {
    const { exitCode, stdout } = await captureCli(['prototype', '--help']);

    assert.equal(exitCode, 0);
    assert.match(stdout, /gskp prototype/);
    assert.match(stdout, /prototype bundles \[--dry-run\] \[--check\]/);
  });

  it('wraps prototype bundle generation with --root set to the target project', () => {
    const projectRoot = makeTempProject();

    const command = resolvePrototypeCommand(['bundles', '--check'], { projectRoot });

    assert.equal(command.kind, 'run');
    assert.equal(command.command, process.execPath);
    assert.deepEqual(command.args.slice(1), ['--root', projectRoot, '--check']);
    assert.equal(command.args[0].endsWith('scripts/upgrade-design-tree-loop.mjs'), true);
  });

  it('rejects unknown prototype subcommands and conflicting bundle flags', () => {
    assert.throws(() => resolvePrototypeCommand(['pages', 'audit']), /prototype: unknown command/);
    assert.throws(
      () => resolvePrototypeCommand(['bundles', '--dry-run', '--check']),
      /prototype bundles accepts either --dry-run or --check/,
    );
  });
});
