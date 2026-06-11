import assert from 'node:assert/strict';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
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

async function runSkillpacks(projectRoot, args) {
  const result = await runSkillpacksRaw(projectRoot, args);
  assert.equal(result.exitCode, 0, result.stderr);
  return result;
}

async function runSkillpacksRaw(projectRoot, args) {
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
    process.env.PATH = '';
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

afterEach(() => {
  for (const dir of tmpDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  tmpDirs.length = 0;
});

describe('Node lifecycle commands', () => {
  it('installs active packs without bash or jq and writes managed markers', async () => {
    const dir = makeTempProject();

    const { stdout } = await runSkillpacks(dir, ['install', 'quality']);

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
    assert.equal(stdout.includes(`Refreshed project skills to skillpacks@${packageVersion}.`), true);
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
    assert.match(stdout, /Fix: scripts\/pack\.sh refresh/);
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

  it('keeps pack.sh-compatible extra args ignored for doctor, pin, and unpin', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1
    });

    const doctor = await runSkillpacks(dir, ['doctor', 'ignored']);
    assert.match(doctor.stdout, /Skill install drift/);

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

    const dryRun = await runSkillpacks(dir, ['prune', '--dry-run']);

    assert.match(dryRun.stdout, /would remove  \.claude\/skills\/orphan-skill \(pack not enabled\)/);
    assert.match(dryRun.stdout, /would remove  \.codex\/skills\/missing-source-skill \(source no longer exists\)/);
    assert.match(dryRun.stdout, /2 orphan\(s\) found\. Run without --dry-run to remove\./);
    assert.equal(existsSync(skillPath(dir, 'claude', 'orphan-skill')), true);
    assert.equal(existsSync(skillPath(dir, 'claude', 'local-skill')), true);

    const pruned = await runSkillpacks(dir, ['prune']);

    assert.match(pruned.stdout, /removed  \.claude\/skills\/orphan-skill \(pack not enabled\)/);
    assert.match(pruned.stdout, /removed  \.codex\/skills\/missing-source-skill \(source no longer exists\)/);
    assert.match(pruned.stdout, /2 orphan\(s\) removed\./);
    assert.match(pruned.stdout, /Skill installs changed/);
    assert.equal(existsSync(skillPath(dir, 'claude', 'orphan-skill')), false);
    assert.equal(existsSync(skillPath(dir, 'codex', 'missing-source-skill')), false);
    assert.equal(existsSync(skillPath(dir, 'claude', 'local-skill')), true);
  });
});
