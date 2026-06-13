import assert from 'node:assert/strict';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, it } from 'node:test';
import { withProjectLock } from '../src/cli/project-config.mjs';
import { runSkillpacksCli } from '../src/cli/run-pack-script.mjs';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(packageRoot, '..', '..');
const tmpDirs = [];

function makeTempProject() {
  const dir = mkdtempSync(join(tmpdir(), 'skillpacks-lifecycle-'));
  tmpDirs.push(dir);
  return dir;
}

function projectConfigPath(projectRoot) {
  return join(projectRoot, '.agents/project.json');
}

function writeProjectConfig(projectRoot, config) {
  const filePath = projectConfigPath(projectRoot);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(config, null, 2)}\n`);
}

function readProjectConfig(projectRoot) {
  return JSON.parse(readFileSync(projectConfigPath(projectRoot), 'utf8'));
}

async function runSkillpacks(projectRoot, args, options = {}) {
  const result = await runSkillpacksRaw(projectRoot, args, options);
  assert.equal(result.exitCode, 0, result.stderr);
  return result;
}

async function runSkillpacksRaw(projectRoot, args, options = {}) {
  const originalCwd = process.cwd();
  const originalPath = process.env.PATH;
  const originalLog = console.log;
  const originalError = console.error;
  let stdout = '';
  let stderr = '';

  console.log = (...parts) => {
    stdout += `${parts.join(' ')}\n`;
  };
  console.error = (...parts) => {
    stderr += `${parts.join(' ')}\n`;
  };

  try {
    process.chdir(projectRoot);
    process.env.PATH = options.path ?? '';
    const exitCode = await runSkillpacksCli(args);
    return { exitCode, stdout, stderr };
  } finally {
    process.chdir(originalCwd);
    if (originalPath === undefined) {
      delete process.env.PATH;
    } else {
      process.env.PATH = originalPath;
    }
    console.log = originalLog;
    console.error = originalError;
  }
}

async function runSkillpacksExpectError(projectRoot, args) {
  const originalCwd = process.cwd();
  const originalPath = process.env.PATH;

  try {
    process.chdir(projectRoot);
    process.env.PATH = '';
    await runSkillpacksCli(args);
    assert.fail(`Expected skillpacks ${args.join(' ')} to fail`);
  } catch (error) {
    return error;
  } finally {
    process.chdir(originalCwd);
    if (originalPath === undefined) {
      delete process.env.PATH;
    } else {
      process.env.PATH = originalPath;
    }
  }
}

function marker(projectRoot, tool, skill) {
  return readFileSync(
    join(projectRoot, `.${tool}/skills/${skill}/.agentic-skills-managed`),
    'utf8'
  );
}

function skillPath(projectRoot, tool, skill) {
  return join(projectRoot, `.${tool}/skills/${skill}`);
}

function writeManagedInstall(projectRoot, tool, skill, source, options = {}) {
  const target = skillPath(projectRoot, tool, skill);
  mkdirSync(target, { recursive: true });
  const markerLines = [
    `source=${source}`,
    'managed_by=agentic-skills',
    `source_version=${options.sourceVersion ?? 'v0.0'}`
  ];
  if (options.sourceSha !== null) {
    markerLines.push(`source_sha=${options.sourceSha ?? 'stale'}`);
  }
  writeFileSync(join(target, '.agentic-skills-managed'), markerLines.join('\n') + '\n');
  writeFileSync(join(target, 'SKILL.md'), 'stale\n');
}

function lockDir(projectRoot) {
  return join(projectRoot, '.agents/.pack.lock');
}

function writeStaleLock(projectRoot) {
  const dir = lockDir(projectRoot);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'pid'), '999999999\n');
  writeFileSync(join(dir, 'started_at'), '2026-01-01T00:00:00.000Z\n');
  writeFileSync(join(dir, 'command'), 'skillpacks install stale\n');
}

function provisionNote(fileName) {
  return `Provisioned artifact: ./${fileName}. Source: workflow.md. Verification: block appears exactly once.`;
}

function provisionDoc(fileName, options = {}) {
  const version = options.version ?? 'v0.5';
  const body = options.body ?? 'legacy generated line';
  return [
    options.prefix ?? '',
    `<!-- provision-agentic-config ${version} -->`,
    '## Workflow Orchestration',
    body,
    provisionNote(fileName),
    '',
    options.suffix ?? ''
  ].join('\n');
}

function writeAgentDocs(projectRoot, options = {}) {
  writeFileSync(
    join(projectRoot, 'AGENTS.md'),
    provisionDoc('AGENTS.md', {
      prefix: options.agentsPrefix,
      suffix: options.agentsSuffix,
      body: options.agentsBody,
      version: options.agentsVersion
    })
  );
  writeFileSync(
    join(projectRoot, 'CLAUDE.md'),
    provisionDoc('CLAUDE.md', {
      prefix: options.claudePrefix,
      suffix: options.claudeSuffix,
      body: options.claudeBody,
      version: options.claudeVersion
    })
  );
}

function backupFiles(projectRoot) {
  const backupDir = join(projectRoot, '.agents/backups');
  if (!existsSync(backupDir)) {
    return [];
  }
  return readdirSync(backupDir).sort();
}

afterEach(() => {
  for (const dir of tmpDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  tmpDirs.length = 0;
});

describe('Node lifecycle commands', () => {
  it('initializes project-local base skills without installing user-home globals', async () => {
    const dir = makeTempProject();

    const { stdout } = await runSkillpacks(dir, ['init']);

    assert.match(stdout, /Installed \.claude\/skills\/codebase-status/);
    assert.match(stdout, /Installed \.codex\/skills\/afps-status/);
    assert.match(stdout, /Updated \.agents\/project\.json \(base skills enabled\)/);
    assert.match(stdout, /Initialized project base skills to gskp@/);
    assert.equal(existsSync(skillPath(dir, 'claude', 'codebase-status')), true);
    assert.equal(existsSync(skillPath(dir, 'codex', 'pack')), true);
    assert.equal(existsSync(skillPath(dir, 'codex', 'afps-status')), true);
    assert.equal(existsSync(skillPath(dir, 'claude', 'afps-status')), true);
    assert.match(marker(dir, 'claude', 'codebase-status'), /source=.*global\/claude\/codebase-status/);
    assert.equal(readProjectConfig(dir).base_skills, true);
    assert.deepEqual(readProjectConfig(dir).enabled_packs, []);
  });

  it('routes init --global through packaged init.sh and forwards remaining args', async () => {
    const dir = makeTempProject();
    const fakeBin = join(dir, 'bin');
    const argsFile = join(dir, 'bash-args.txt');
    mkdirSync(fakeBin, { recursive: true });
    writeFileSync(
      join(fakeBin, 'bash'),
      [
        '#!/bin/sh',
        'if [ "$1" = "--version" ]; then',
        '  exit 0',
        'fi',
        'printf "%s\\n" "$@" > "$SKILLPACKS_FAKE_BASH_ARGS"'
      ].join('\n') + '\n',
      { mode: 0o755 }
    );

    const originalArgsFile = process.env.SKILLPACKS_FAKE_BASH_ARGS;
    process.env.SKILLPACKS_FAKE_BASH_ARGS = argsFile;
    try {
      await runSkillpacks(dir, ['init', '--global', '--help'], { path: fakeBin });
    } finally {
      if (originalArgsFile === undefined) {
        delete process.env.SKILLPACKS_FAKE_BASH_ARGS;
      } else {
        process.env.SKILLPACKS_FAKE_BASH_ARGS = originalArgsFile;
      }
    }

    assert.deepEqual(readFileSync(argsFile, 'utf8').trim().split('\n'), [
      join(repoRoot, 'init.sh'),
      '--help'
    ]);
    assert.equal(existsSync(projectConfigPath(dir)), false);
  });

  it('rejects unsupported init arguments', async () => {
    const dir = makeTempProject();

    const error = await runSkillpacksExpectError(dir, ['init', '--bad']);

    assert.match(error.message, /init does not accept arguments/);
    assert.match(error.message, /--global/);
    assert.equal(existsSync(projectConfigPath(dir)), false);
  });

  it('installs active packs without bash or jq and writes managed markers', async () => {
    const dir = makeTempProject();

    const { stdout } = await runSkillpacks(dir, ['install', 'code-quality']);

    assert.match(stdout, /Installed \.claude\/skills\/quality-sweep/);
    assert.match(stdout, /Installed \.codex\/skills\/quality-sweep/);
    assert.doesNotMatch(stdout, / -> /);
    assert.match(stdout, /Updated \.agents\/project\.json/);
    assert.match(stdout, /Skill installs changed/);
    assert.equal(existsSync(skillPath(dir, 'claude', 'extract-shared-types')), true);
    assert.equal(existsSync(skillPath(dir, 'codex', 'quality-sweep')), true);
    assert.match(marker(dir, 'claude', 'quality-sweep'), /^managed_by=agentic-skills$/m);
    assert.match(marker(dir, 'claude', 'quality-sweep'), /^source_version=v0\.1$/m);
    assert.match(marker(dir, 'claude', 'quality-sweep'), /^source_sha=[a-f0-9]{64}$/m);
    assert.deepEqual(readProjectConfig(dir).enabled_packs, ['code-quality']);
    assert.equal(existsSync(join(dir, '.agents/.pack.lock')), false);
  });

  it('installs the exact exec skill without enabling the exec-loop pack', async () => {
    const dir = makeTempProject();

    const { stdout } = await runSkillpacks(dir, ['install', 'exec']);

    assert.match(stdout, /Installed \.claude\/skills\/exec/);
    assert.match(stdout, /Installed \.codex\/skills\/exec/);
    assert.doesNotMatch(stdout, /Installed \.claude\/skills\/ship/);
    assert.doesNotMatch(stdout, /Installed \.codex\/skills\/ship/);
    assert.equal(existsSync(skillPath(dir, 'claude', 'exec')), true);
    assert.equal(existsSync(skillPath(dir, 'codex', 'exec')), true);
    assert.equal(existsSync(skillPath(dir, 'claude', 'ship')), false);
    assert.equal(existsSync(skillPath(dir, 'codex', 'ship-end')), false);
    assert.deepEqual(readProjectConfig(dir).enabled_packs, []);
    assert.deepEqual(readProjectConfig(dir).enabled_skills, { exec: 'exec-loop' });
  });

  it('installs individual pinned skills as archive symlinks and tracks enabled skills', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      pinned_versions: {
        'quality-sweep': 'v0.0'
      }
    });

    const { stdout } = await runSkillpacks(dir, ['install', 'quality-sweep']);

    assert.match(stdout, /Installed \.claude\/skills\/quality-sweep \(pinned v0\.0\)/);
    assert.doesNotMatch(stdout, / -> /);
    assert.match(stdout, /Updated \.agents\/project\.json \(skill: quality-sweep from pack: code-quality\)/);
    assert.equal(lstatSync(skillPath(dir, 'claude', 'quality-sweep')).isSymbolicLink(), true);
    assert.match(readlinkSync(skillPath(dir, 'claude', 'quality-sweep')), /packs\/code-quality\/claude\/quality-sweep\/archive\/v0\.0$/);
    assert.deepEqual(readProjectConfig(dir).enabled_skills, { 'quality-sweep': 'code-quality' });
    assert.deepEqual(readProjectConfig(dir).pinned_versions, { 'quality-sweep': 'v0.0' });
  });

  it('removes active packs without deleting unmanaged local skill directories', async () => {
    const dir = makeTempProject();
    await runSkillpacks(dir, ['install', 'code-quality']);
    unlinkSync(join(skillPath(dir, 'claude', 'quality-sweep'), '.agentic-skills-managed'));

    const { stdout } = await runSkillpacks(dir, ['remove', 'code-quality']);

    assert.match(stdout, /Removed \.codex\/skills\/quality-sweep/);
    assert.equal(existsSync(skillPath(dir, 'claude', 'quality-sweep')), true);
    assert.equal(existsSync(skillPath(dir, 'codex', 'quality-sweep')), false);
    assert.deepEqual(readProjectConfig(dir).enabled_packs, []);
  });

  it('removes individual skills and clears empty enabled skill maps', async () => {
    const dir = makeTempProject();
    await runSkillpacks(dir, ['install', 'quality-sweep']);

    const { stdout } = await runSkillpacks(dir, ['remove', 'quality-sweep']);

    assert.match(stdout, /Removed \.claude\/skills\/quality-sweep/);
    assert.match(stdout, /Updated \.agents\/project\.json \(removed skill: quality-sweep\)/);
    assert.equal(existsSync(skillPath(dir, 'claude', 'quality-sweep')), false);
    assert.equal(Object.hasOwn(readProjectConfig(dir), 'enabled_skills'), false);
  });

  it('removes hibernated stale pack designations using managed marker ownership', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: ['devtool-kanban'],
      skill_pack_version: 1
    });
    writeManagedInstall(
      dir,
      'claude',
      'exec-kanban',
      join(repoRoot, 'packs/devtool-kanban/claude/exec-kanban')
    );
    writeManagedInstall(
      dir,
      'codex',
      'exec-kanban',
      join(repoRoot, 'packs/devtool-kanban/codex/exec-kanban')
    );

    const { stdout } = await runSkillpacks(dir, ['remove', 'dev-kanban']);

    assert.match(stdout, /Removed \.claude\/skills\/exec-kanban/);
    assert.match(stdout, /Removed \.codex\/skills\/exec-kanban/);
    assert.equal(existsSync(skillPath(dir, 'claude', 'exec-kanban')), false);
    assert.deepEqual(readProjectConfig(dir).enabled_packs, []);
  });

  it('refreshes enabled packs and individually enabled skills without bash or jq', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: ['code-quality'],
      skill_pack_version: 1,
      enabled_skills: {
        'devtool-adoption': 'devtool'
      }
    });
    writeManagedInstall(
      dir,
      'claude',
      'quality-sweep',
      join(repoRoot, 'packs/code-quality/claude/quality-sweep')
    );

    const { stdout } = await runSkillpacks(dir, ['refresh']);

    const packageVersion = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8')).version;
    assert.equal(stdout.includes(`Refreshed project skills to gskp@${packageVersion}.`), true);
    assert.match(stdout, /Installed \.claude\/skills\/quality-sweep/);
    assert.match(stdout, /Installed \.codex\/skills\/devtool-adoption/);
    assert.doesNotMatch(stdout, / -> /);
    assert.equal(existsSync(skillPath(dir, 'claude', 'extract-shared-types')), true);
    assert.equal(existsSync(skillPath(dir, 'codex', 'devtool-adoption')), true);
    assert.notEqual(
      readFileSync(join(skillPath(dir, 'claude', 'quality-sweep'), 'SKILL.md'), 'utf8'),
      'stale\n'
    );
    assert.deepEqual(readProjectConfig(dir).enabled_packs, ['code-quality']);
    assert.deepEqual(readProjectConfig(dir).enabled_skills, { 'devtool-adoption': 'devtool' });
  });

  it('refresh reconciles a renamed enabled pack alias before installing', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'business-app',
      enabled_packs: ['business-discovery'],
      skill_pack_version: 1
    });

    const { stdout } = await runSkillpacks(dir, ['refresh']);

    assert.match(stdout, /Reconciled \.agents\/project\.json pack names/);
    assert.match(stdout, /Installed \.claude\/skills\/customer-discovery/);
    assert.match(stdout, /Installed \.codex\/skills\/customer-discovery/);
    assert.deepEqual(readProjectConfig(dir).enabled_packs, ['business-research']);
    assert.equal(existsSync(skillPath(dir, 'claude', 'customer-discovery')), true);
    assert.equal(existsSync(skillPath(dir, 'codex', 'customer-discovery')), true);
  });

  it('refresh de-duplicates renamed pack aliases while preserving order', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'business-app',
      enabled_packs: ['business-discovery', 'business-research'],
      skill_pack_version: 1
    });

    const { stdout } = await runSkillpacks(dir, ['refresh']);

    assert.match(stdout, /Reconciled \.agents\/project\.json pack names/);
    assert.deepEqual(readProjectConfig(dir).enabled_packs, ['business-research']);
  });

  it('refresh reconciles stale enabled-skill pack values when the skill still exists', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'business-app',
      enabled_packs: [],
      skill_pack_version: 1,
      enabled_skills: {
        'customer-discovery': 'business-discovery'
      }
    });

    const { stdout } = await runSkillpacks(dir, ['refresh']);

    assert.match(stdout, /Reconciled \.agents\/project\.json pack names/);
    assert.match(stdout, /Installed \.claude\/skills\/customer-discovery/);
    assert.match(stdout, /Updated \.agents\/project\.json \(skill: customer-discovery from pack: business-research\)/);
    assert.deepEqual(readProjectConfig(dir).enabled_packs, []);
    assert.deepEqual(readProjectConfig(dir).enabled_skills, { 'customer-discovery': 'business-research' });
    assert.equal(existsSync(skillPath(dir, 'codex', 'customer-discovery')), true);
  });

  it('doctor --fix reconciles renamed enabled pack aliases before cleanup', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'business-app',
      enabled_packs: ['business-discovery'],
      skill_pack_version: 1
    });

    const { stdout } = await runSkillpacks(dir, ['doctor', '--fix']);

    assert.match(stdout, /Doctor fix: generated skill-root cleanup/);
    assert.match(stdout, /Reconciled \.agents\/project\.json pack names/);
    assert.deepEqual(readProjectConfig(dir).enabled_packs, ['business-research']);
    assert.equal(existsSync(skillPath(dir, 'claude', 'customer-discovery')), true);
  });

  it('refreshes enabled base skills from the current package snapshot', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      base_skills: true
    });
    writeManagedInstall(
      dir,
      'claude',
      'codebase-status',
      join(repoRoot, 'global/claude/codebase-status')
    );

    const { stdout } = await runSkillpacks(dir, ['refresh']);

    assert.match(stdout, /Installed \.claude\/skills\/codebase-status/);
    assert.match(stdout, /Installed \.codex\/skills\/pack/);
    assert.match(stdout, /Refreshed project skills to gskp@/);
    assert.notEqual(
      readFileSync(join(skillPath(dir, 'claude', 'codebase-status'), 'SKILL.md'), 'utf8'),
      'stale\n'
    );
    assert.equal(existsSync(skillPath(dir, 'codex', 'afps-status')), true);
    assert.equal(readProjectConfig(dir).base_skills, true);
  });

  it('keeps base skills during prune only while base skills are enabled', async () => {
    const dir = makeTempProject();
    await runSkillpacks(dir, ['init']);

    const kept = await runSkillpacks(dir, ['prune']);

    assert.match(kept.stdout, /Nothing to prune\./);
    assert.equal(existsSync(skillPath(dir, 'claude', 'codebase-status')), true);

    const config = readProjectConfig(dir);
    delete config.base_skills;
    writeProjectConfig(dir, config);

    const pruned = await runSkillpacks(dir, ['prune']);

    assert.match(pruned.stdout, /removed  \.claude\/skills\/codebase-status \(pack not enabled\)/);
    assert.match(pruned.stdout, /orphan\(s\) removed\./);
    assert.equal(existsSync(skillPath(dir, 'claude', 'codebase-status')), false);
    assert.equal(existsSync(skillPath(dir, 'codex', 'afps-status')), false);
  });

  it('rejects hibernated enabled pack refresh with pack.sh safety language', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: ['devtool-kanban'],
      skill_pack_version: 1
    });

    const error = await runSkillpacksExpectError(dir, ['refresh']);

    assert.match(error.message, /PoketoWork kanban pack 'devtool-kanban' is hibernated/);
    assert.match(error.message, /Archive: archive\/hibernated-packs\/2026-06-poketowork-rebuild\/devtool-kanban/);
    assert.match(error.message, /Reactivation requires a stable service\/API/);
    assert.match(error.message, /scripts\/pack\.sh remove devtool-kanban/);
  });

  it('rejects unknown stale enabled pack refresh with cleanup guidance', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: ['not-a-real-pack'],
      skill_pack_version: 1
    });

    const error = await runSkillpacksExpectError(dir, ['refresh']);

    assert.match(error.message, /Stale pack entry 'not-a-real-pack' in \.agents\/project\.json enabled_packs/);
    assert.match(error.message, /npx gskp remove not-a-real-pack/);
    assert.match(error.message, /edit \.agents\/project\.json/);
  });

  it('records lock command labels and releases locks after errors', async () => {
    const dir = makeTempProject();

    await assert.rejects(
      () => withProjectLock(dir, 'pin quality-sweep v0.0', async () => {
        assert.equal(
          readFileSync(join(lockDir(dir), 'command'), 'utf8'),
          'skillpacks pin quality-sweep v0.0\n'
        );
        throw new Error('forced lock release check');
      }),
      /forced lock release check/
    );

    assert.equal(existsSync(lockDir(dir)), false);
  });

  it('cleans stale locks before lifecycle writes', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1
    });
    writeStaleLock(dir);

    const { stdout, stderr } = await runSkillpacks(dir, ['pin', 'quality-sweep', 'v0.0']);

    assert.match(stderr, /Removing stale project pack lock/);
    assert.match(stdout, /Pinned quality-sweep to v0\.0/);
    assert.deepEqual(readProjectConfig(dir).pinned_versions, { 'quality-sweep': 'v0.0' });
    assert.equal(existsSync(lockDir(dir)), false);
  });

  it('reports doctor drift states without bash or jq', async () => {
    const dir = makeTempProject();
    await runSkillpacks(dir, ['install', 'quality-sweep']);

    const staleSource = join(dir, 'canonical/stale-skill');
    mkdirSync(staleSource, { recursive: true });
    writeFileSync(join(staleSource, 'SKILL.md'), '---\nversion: v9.0\n---\n');
    writeManagedInstall(dir, 'claude', 'stale-skill', staleSource, {
      sourceVersion: 'v0.0',
      sourceSha: 'outdated'
    });
    writeManagedInstall(dir, 'codex', 'unknown-skill', staleSource, {
      sourceVersion: 'v0.0',
      sourceSha: null
    });
    writeManagedInstall(dir, 'claude', 'missing-skill', join(dir, 'missing-source'), {
      sourceVersion: 'v0.0'
    });
    symlinkSync(
      join(repoRoot, 'packs/code-quality/claude/quality-sweep/archive/v0.0'),
      skillPath(dir, 'codex', 'pinned-skill'),
      'dir'
    );

    const { exitCode, stdout } = await runSkillpacksRaw(dir, ['doctor']);

    assert.equal(exitCode, 1);
    assert.match(stdout, /Project skill update mode: warn \(default\)/);
    assert.match(stdout, /ok       \.claude\/skills\/quality-sweep/);
    assert.match(stdout, /pinned   \.codex\/skills\/pinned-skill \(frozen v0\.0\)/);
    assert.match(stdout, /unknown  \.codex\/skills\/unknown-skill — run refresh to enable drift tracking/);
    assert.match(stdout, /missing  \.claude\/skills\/missing-skill — canonical source no longer exists/);
    assert.match(stdout, /STALE    \.claude\/skills\/stale-skill \(v0\.0 -> v9\.0\)/);
    assert.match(stdout, /Fix: npx gskp refresh \(or scripts\/pack\.sh refresh from a source checkout\)/);
  });

  it('keeps plain doctor read-only for skill roots and agent docs', async () => {
    const dir = makeTempProject();
    await runSkillpacks(dir, ['install', 'quality-sweep']);
    writeAgentDocs(dir);
    const beforeAgents = readFileSync(join(dir, 'AGENTS.md'), 'utf8');
    const beforeClaude = readFileSync(join(dir, 'CLAUDE.md'), 'utf8');
    writeFileSync(join(skillPath(dir, 'claude', 'quality-sweep'), 'SKILL.md'), 'stale\n');
    const beforeSkill = readFileSync(join(skillPath(dir, 'claude', 'quality-sweep'), 'SKILL.md'), 'utf8');
    const markerPath = join(skillPath(dir, 'claude', 'quality-sweep'), '.agentic-skills-managed');
    const beforeMarker = readFileSync(markerPath, 'utf8').replace(/^source_sha=.*$/m, 'source_sha=outdated');
    writeFileSync(markerPath, beforeMarker);

    const { exitCode, stdout } = await runSkillpacksRaw(dir, ['doctor']);

    assert.equal(exitCode, 1);
    assert.match(stdout, /STALE    \.claude\/skills\/quality-sweep/);
    assert.equal(readFileSync(join(dir, 'AGENTS.md'), 'utf8'), beforeAgents);
    assert.equal(readFileSync(join(dir, 'CLAUDE.md'), 'utf8'), beforeClaude);
    assert.equal(readFileSync(join(skillPath(dir, 'claude', 'quality-sweep'), 'SKILL.md'), 'utf8'), beforeSkill);
    assert.equal(readFileSync(markerPath, 'utf8'), beforeMarker);
    assert.deepEqual(backupFiles(dir), []);
  });

  it('doctor --fix cleans generated skill roots without touching agent docs', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: ['code-quality'],
      skill_pack_version: 1,
      pinned_versions: {
        'quality-sweep': 'v0.0'
      }
    });
    writeAgentDocs(dir);
    const beforeAgents = readFileSync(join(dir, 'AGENTS.md'), 'utf8');
    const beforeClaude = readFileSync(join(dir, 'CLAUDE.md'), 'utf8');
    mkdirSync(join(dir, '.claude/skills'), { recursive: true });
    symlinkSync(
      join(repoRoot, 'packs/code-quality/claude/quality-sweep/archive/v0.0'),
      skillPath(dir, 'claude', 'quality-sweep'),
      'dir'
    );
    symlinkSync(
      join(repoRoot, 'packs/code-quality/claude/extract-shared-types'),
      skillPath(dir, 'claude', 'extract-shared-types'),
      'dir'
    );
    writeManagedInstall(
      dir,
      'codex',
      'orphan-skill',
      join(repoRoot, 'packs/code-quality/codex/quality-sweep')
    );
    mkdirSync(skillPath(dir, 'codex', 'local-skill'), { recursive: true });
    const localLinkSource = join(dir, 'local-link-source');
    mkdirSync(localLinkSource, { recursive: true });
    symlinkSync(localLinkSource, skillPath(dir, 'codex', 'local-link'), 'dir');

    const { stdout } = await runSkillpacks(dir, ['doctor', '--fix']);

    assert.match(stdout, /Doctor fix: generated skill-root cleanup/);
    assert.equal(lstatSync(skillPath(dir, 'claude', 'quality-sweep')).isSymbolicLink(), true);
    assert.equal(lstatSync(skillPath(dir, 'claude', 'extract-shared-types')).isSymbolicLink(), false);
    assert.match(marker(dir, 'claude', 'extract-shared-types'), /^managed_by=agentic-skills$/m);
    assert.equal(existsSync(skillPath(dir, 'codex', 'orphan-skill')), false);
    assert.equal(existsSync(skillPath(dir, 'codex', 'local-skill')), true);
    assert.equal(lstatSync(skillPath(dir, 'codex', 'local-link')).isSymbolicLink(), true);
    assert.equal(readlinkSync(skillPath(dir, 'codex', 'local-link')), localLinkSource);
    assert.equal(readFileSync(join(dir, 'AGENTS.md'), 'utf8'), beforeAgents);
    assert.equal(readFileSync(join(dir, 'CLAUDE.md'), 'utf8'), beforeClaude);
    assert.deepEqual(backupFiles(dir), []);
  });

  it('doctor --fix --agent-docs --dry-run prints diffs and writes nothing', async () => {
    const dir = makeTempProject();
    writeAgentDocs(dir);
    const beforeAgents = readFileSync(join(dir, 'AGENTS.md'), 'utf8');
    const beforeClaude = readFileSync(join(dir, 'CLAUDE.md'), 'utf8');

    const { stdout } = await runSkillpacks(dir, ['doctor', '--fix', '--agent-docs', '--dry-run']);

    assert.match(stdout, /--- AGENTS\.md/);
    assert.match(stdout, /\+\+\+ CLAUDE\.md/);
    assert.match(stdout, /Dry run: no files written\./);
    assert.equal(readFileSync(join(dir, 'AGENTS.md'), 'utf8'), beforeAgents);
    assert.equal(readFileSync(join(dir, 'CLAUDE.md'), 'utf8'), beforeClaude);
    assert.deepEqual(backupFiles(dir), []);
  });

  it('doctor --fix --agent-docs backs up and replaces only marked provision blocks', async () => {
    const dir = makeTempProject();
    writeAgentDocs(dir, {
      agentsPrefix: 'agents prefix byte-for-byte',
      agentsSuffix: 'agents suffix byte-for-byte',
      claudePrefix: 'claude prefix byte-for-byte',
      claudeSuffix: 'claude suffix byte-for-byte'
    });

    const { stdout } = await runSkillpacks(dir, ['doctor', '--fix', '--agent-docs']);

    assert.match(stdout, /Agent docs changed:/);
    assert.match(stdout, /AGENTS\.md \(backup: \.agents\/backups\/AGENTS\.md\./);
    assert.match(stdout, /CLAUDE\.md \(backup: \.agents\/backups\/CLAUDE\.md\./);
    const agents = readFileSync(join(dir, 'AGENTS.md'), 'utf8');
    const claude = readFileSync(join(dir, 'CLAUDE.md'), 'utf8');
    assert.equal(agents.startsWith('agents prefix byte-for-byte\n'), true);
    assert.equal(agents.endsWith('agents suffix byte-for-byte'), true);
    assert.equal(claude.startsWith('claude prefix byte-for-byte\n'), true);
    assert.equal(claude.endsWith('claude suffix byte-for-byte'), true);
    assert.doesNotMatch(agents, /legacy generated line/);
    assert.doesNotMatch(claude, /legacy generated line/);
    assert.match(agents, /npx gskp install <pack-or-skill>/);
    assert.match(claude, /npx gskp install <pack-or-skill>/);
    assert.deepEqual(
      backupFiles(dir).map((file) => file.replace(/\.\d{8}T\d{6}Z\.bak$/, '.TIMESTAMP.bak')),
      ['AGENTS.md.TIMESTAMP.bak', 'CLAUDE.md.TIMESTAMP.bak']
    );
  });

  it('doctor --fix --agent-docs refuses unsafe provision marker states without backups', async () => {
    const cases = [
      {
        name: 'missing marker',
        agents: 'no generated block\n',
        message: /AGENTS\.md: missing provision-agentic-config marker/
      },
      {
        name: 'duplicate markers',
        agents: `${provisionDoc('AGENTS.md')}\n<!-- provision-agentic-config v0.5 -->\n`,
        message: /AGENTS\.md: duplicate provision-agentic-config markers/
      },
      {
        name: 'malformed boundary',
        agents: '<!-- provision-agentic-config v0.5 -->\n## Workflow Orchestration\nmissing footer\n',
        message: /AGENTS\.md: malformed provision block boundary/
      },
      {
        name: 'unknown marker',
        agents: provisionDoc('AGENTS.md', { version: 'v9.9' }),
        message: /AGENTS\.md: unknown provision-agentic-config version v9\.9/
      }
    ];

    for (const testCase of cases) {
      const dir = makeTempProject();
      writeFileSync(join(dir, 'AGENTS.md'), testCase.agents);
      writeFileSync(join(dir, 'CLAUDE.md'), provisionDoc('CLAUDE.md'));
      const beforeAgents = readFileSync(join(dir, 'AGENTS.md'), 'utf8');
      const beforeClaude = readFileSync(join(dir, 'CLAUDE.md'), 'utf8');

      const error = await runSkillpacksExpectError(dir, ['doctor', '--fix', '--agent-docs']);

      assert.match(error.message, testCase.message, testCase.name);
      assert.equal(readFileSync(join(dir, 'AGENTS.md'), 'utf8'), beforeAgents);
      assert.equal(readFileSync(join(dir, 'CLAUDE.md'), 'utf8'), beforeClaude);
      assert.deepEqual(backupFiles(dir), []);
    }
  });

  it('pins and unpins skills without bash or jq while preserving project config fields', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      notes: ['preserve me']
    });
    await runSkillpacks(dir, ['install', 'quality-sweep']);

    const pinned = await runSkillpacks(dir, ['pin', 'quality-sweep', 'v0.0']);

    assert.match(pinned.stdout, /Pinned \.claude\/skills\/quality-sweep \(v0\.0\)/);
    assert.match(pinned.stdout, /Pinned quality-sweep to v0\.0/);
    assert.doesNotMatch(pinned.stdout, / -> /);
    assert.equal(lstatSync(skillPath(dir, 'claude', 'quality-sweep')).isSymbolicLink(), true);
    assert.match(readlinkSync(skillPath(dir, 'claude', 'quality-sweep')), /archive\/v0\.0$/);
    assert.deepEqual(readProjectConfig(dir).pinned_versions, { 'quality-sweep': 'v0.0' });
    assert.deepEqual(readProjectConfig(dir).notes, ['preserve me']);

    const unpinned = await runSkillpacks(dir, ['unpin', 'quality-sweep']);

    assert.match(unpinned.stdout, /Unpinned \.claude\/skills\/quality-sweep \(latest\)/);
    assert.match(unpinned.stdout, /Unpinned quality-sweep \(reverted to latest\)/);
    assert.doesNotMatch(unpinned.stdout, / -> /);
    assert.equal(lstatSync(skillPath(dir, 'claude', 'quality-sweep')).isSymbolicLink(), false);
    assert.match(marker(dir, 'claude', 'quality-sweep'), /^source_version=v0\.1$/m);
    assert.equal(Object.hasOwn(readProjectConfig(dir), 'pinned_versions'), false);
    assert.deepEqual(readProjectConfig(dir).notes, ['preserve me']);
  });

  it('rejects unsupported doctor args while keeping pack.sh-compatible pin and unpin extras', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1
    });

    const doctorError = await runSkillpacksExpectError(dir, ['doctor', 'ignored']);
    assert.match(doctorError.message, /doctor: unknown option 'ignored'/);

    await runSkillpacks(dir, ['pin', 'quality-sweep', 'v0.0', 'ignored']);
    assert.deepEqual(readProjectConfig(dir).pinned_versions, { 'quality-sweep': 'v0.0' });

    await runSkillpacks(dir, ['unpin', 'quality-sweep', 'ignored']);
    assert.equal(Object.hasOwn(readProjectConfig(dir), 'pinned_versions'), false);
  });

  it('prunes orphaned managed installs without deleting unmanaged directories', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: ['code-quality'],
      skill_pack_version: 1,
      enabled_skills: {
        'devtool-adoption': 'devtool'
      }
    });
    writeManagedInstall(
      dir,
      'claude',
      'orphan-skill',
      join(repoRoot, 'packs/code-quality/claude/quality-sweep')
    );
    writeManagedInstall(dir, 'codex', 'missing-source-skill', join(dir, 'missing-source'));
    mkdirSync(skillPath(dir, 'claude', 'local-skill'), { recursive: true });
    const localLinkSource = join(dir, 'local-link-source');
    mkdirSync(localLinkSource, { recursive: true });
    symlinkSync(localLinkSource, skillPath(dir, 'claude', 'local-link'), 'dir');

    const dryRun = await runSkillpacks(dir, ['prune', '--dry-run']);

    assert.match(dryRun.stdout, /would remove  \.claude\/skills\/orphan-skill \(pack not enabled\)/);
    assert.match(dryRun.stdout, /would remove  \.codex\/skills\/missing-source-skill \(source no longer exists\)/);
    assert.match(dryRun.stdout, /2 orphan\(s\) found\. Run without --dry-run to remove\./);
    assert.doesNotMatch(dryRun.stdout, /local-link/);
    assert.equal(existsSync(skillPath(dir, 'claude', 'orphan-skill')), true);
    assert.equal(existsSync(skillPath(dir, 'claude', 'local-skill')), true);
    assert.equal(lstatSync(skillPath(dir, 'claude', 'local-link')).isSymbolicLink(), true);

    const pruned = await runSkillpacks(dir, ['prune']);

    assert.match(pruned.stdout, /removed  \.claude\/skills\/orphan-skill \(pack not enabled\)/);
    assert.match(pruned.stdout, /removed  \.codex\/skills\/missing-source-skill \(source no longer exists\)/);
    assert.match(pruned.stdout, /2 orphan\(s\) removed\./);
    assert.match(pruned.stdout, /Skill installs changed/);
    assert.equal(existsSync(skillPath(dir, 'claude', 'orphan-skill')), false);
    assert.equal(existsSync(skillPath(dir, 'codex', 'missing-source-skill')), false);
    assert.equal(existsSync(skillPath(dir, 'claude', 'local-skill')), true);
    assert.equal(lstatSync(skillPath(dir, 'claude', 'local-link')).isSymbolicLink(), true);
    assert.equal(readlinkSync(skillPath(dir, 'claude', 'local-link')), localLinkSource);
  });
});
