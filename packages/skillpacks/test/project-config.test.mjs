import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, it } from 'node:test';
import { runSkillpacksCli } from '../src/cli/run-pack-script.mjs';
import { discoverProjectRoots } from '../src/cli/project-config.mjs';

const tmpDirs = [];

function makeTempProject() {
  const dir = mkdtempSync(join(tmpdir(), 'skillpacks-project-config-'));
  tmpDirs.push(dir);
  return dir;
}

function writeProjectConfig(projectRoot, config) {
  const filePath = join(projectRoot, '.agents/project.json');
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(config, null, 2)}\n`);
}

function projectConfigPath(projectRoot) {
  return join(projectRoot, '.agents/project.json');
}

function readProjectConfig(projectRoot) {
  return JSON.parse(readFileSync(projectConfigPath(projectRoot), 'utf8'));
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

async function runSkillpacks(projectRoot, args) {
  const result = await runSkillpacksRaw(projectRoot, args);
  assert.equal(result.exitCode, 0, result.stderr || result.stdout);
  return result.stdout;
}

afterEach(() => {
  for (const dir of tmpDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  tmpDirs.length = 0;
});

describe('Node project config commands', () => {
  it('prints enabled packs without bash or jq', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: ['devtool', 'code-quality'],
      skill_pack_version: 1
    });

    assert.equal(await runSkillpacks(dir, ['list-packs']), 'devtool\ncode-quality\n');
  });

  it('prints project status and individually installed skills without bash or jq', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: ['product-design'],
      skill_pack_version: 1,
      enabled_skills: {
        'design-system': 'product-design'
      }
    });
    mkdirSync(join(dir, '.claude/skills/design-system'), { recursive: true });
    mkdirSync(join(dir, '.codex/skills/design-system'), { recursive: true });

    const output = await runSkillpacks(dir, ['status']);

    assert.match(output, /Project designation:/);
    assert.match(output, /"enabled_packs": \[/);
    assert.match(output, /Installed local pack skills:/);
    assert.match(output, /\.claude\/skills\/design-system/);
    assert.match(output, /\.codex\/skills\/design-system/);
    assert.match(output, /Individually installed skills:/);
    assert.match(output, /design-system \(from pack: product-design\)/);
  });

  it('sets and unsets agent mode while preserving existing project fields', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: ['devtool'],
      skill_pack_version: 1,
      enabled_skills: {
        investigate: 'code-debug'
      },
      pinned_versions: {
        investigate: 'v0.0'
      },
      skill_updates: {
        mode: 'warn',
        channel: 'stable'
      },
      notes: ['keep me']
    });

    assert.equal(await runSkillpacks(dir, ['set-mode', 'hybrid']), 'Updated .agents/project.json\n');
    let config = readProjectConfig(dir);
    assert.equal(config.agent_mode, 'hybrid');
    assert.deepEqual(config.enabled_packs, ['devtool']);
    assert.deepEqual(config.enabled_skills, { investigate: 'code-debug' });
    assert.deepEqual(config.pinned_versions, { investigate: 'v0.0' });
    assert.deepEqual(config.skill_updates, { mode: 'warn', channel: 'stable' });
    assert.deepEqual(config.notes, ['keep me']);
    assert.equal(existsSync(join(dir, '.agents/.pack.lock')), false);

    assert.equal(await runSkillpacks(dir, ['set-mode', 'unset']), 'Updated .agents/project.json\n');
    config = readProjectConfig(dir);
    assert.equal(Object.hasOwn(config, 'agent_mode'), false);
    assert.deepEqual(config.notes, ['keep me']);
  });

  it('creates project config for set-mode when no project file exists', async () => {
    const dir = makeTempProject();

    assert.equal(await runSkillpacks(dir, ['set-mode', 'codex-only']), 'Updated .agents/project.json\n');

    const config = readProjectConfig(dir);
    assert.equal(config.project_type, 'business-app');
    assert.deepEqual(config.enabled_packs, []);
    assert.equal(config.skill_pack_version, 1);
    assert.equal(config.agent_mode, 'codex-only');
  });

  it('sets and unsets update mode while preserving sibling update fields', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: ['devtool'],
      skill_pack_version: 1,
      skill_updates: {
        channel: 'stable'
      }
    });

    assert.equal(await runSkillpacks(dir, ['set-update-mode', 'auto']), 'Set skill_updates.mode to auto\n');
    let config = readProjectConfig(dir);
    assert.deepEqual(config.skill_updates, { channel: 'stable', mode: 'auto' });
    assert.equal(existsSync(join(dir, '.agents/.pack.lock')), false);

    assert.equal(await runSkillpacks(dir, ['set-update-mode', 'unset']), 'Set skill_updates.mode to unset\n');
    config = readProjectConfig(dir);
    assert.equal(Object.hasOwn(config, 'skill_updates'), false);
  });

  it('only changes skill_updates when setting update mode on an existing project file', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      custom_field: 'preserved'
    });

    assert.equal(await runSkillpacks(dir, ['set-update-mode', 'warn']), 'Set skill_updates.mode to warn\n');

    const config = readProjectConfig(dir);
    assert.deepEqual(config, {
      custom_field: 'preserved',
      skill_updates: {
        mode: 'warn'
      }
    });
  });

  it('rejects deprecated build-in-public config commands without mutating project config', async () => {
    const dir = makeTempProject();
    const original = {
      project_type: 'devtool',
      enabled_packs: ['devtool'],
      skill_pack_version: 1,
      alignment: {
        review_depth: 'full',
        build_in_public: true,
        bip_platforms: ['linkedin'],
        bip_prompt_dismissed: true
      },
      notes: ['keep me']
    };
    writeProjectConfig(dir, original);

    for (const args of [
      ['set-bip', 'on'],
      ['set-bip', 'off', '--all'],
      ['set-bip', 'unset', '--all', '--dry-run'],
      ['set-bip-platforms', 'LinkedIn', 'x'],
      ['set-bip-platforms', 'unset'],
      ['set-bip-prompt', 'dismiss'],
      ['set-bip-prompt', 'reset']
    ]) {
      await assert.rejects(
        () => runSkillpacks(dir, args),
        /Build-In-Public has been removed\. Run skillpacks cleanup to remove stale alignment\.build_in_public, alignment\.bip_platforms, and alignment\.bip_prompt_dismissed config\./
      );
      assert.deepEqual(readProjectConfig(dir), original, `${args.join(' ')} should not mutate config`);
      assert.equal(existsSync(join(dir, '.agents/.pack.lock')), false);
    }
  });

  it('does not advertise deprecated build-in-public config commands in CLI help text', async () => {
    const dir = makeTempProject();

    const output = await runSkillpacks(dir, ['help']);

    assert.match(output, /cleanup \[--all\|--global\] \[--reinstall-base\] \[--dry-run\]/);
    assert.match(output, /uninstall-global \[--reinstall-base\] \[--dry-run\]/);
    assert.match(output, /Deprecated alias for cleanup --global/);
    assert.doesNotMatch(output, /set-bip <mode>/);
    assert.doesNotMatch(output, /set-bip-platforms/);
    assert.doesNotMatch(output, /set-bip-prompt/);
  });
});

describe('discoverProjectRoots', () => {
  it('includes the root project and descends into nested projects', () => {
    const parent = makeTempProject();
    writeProjectConfig(parent, { enabled_packs: [] });
    const a = join(parent, 'a');
    const b = join(parent, 'nested', 'b');
    writeProjectConfig(a, { enabled_packs: [] });
    writeProjectConfig(b, { enabled_packs: [] });

    const roots = discoverProjectRoots(parent);

    assert.deepEqual(roots, [parent, a, b].sort());
  });

  it('finds sibling projects under a non-project parent', () => {
    const parent = makeTempProject();
    const a = join(parent, 'a');
    const b = join(parent, 'b');
    writeProjectConfig(a, { enabled_packs: [] });
    writeProjectConfig(b, { enabled_packs: [] });

    const roots = discoverProjectRoots(parent);

    assert.deepEqual(roots, [a, b].sort());
  });

  it('skips node_modules, .git, dot-dirs, and archive', () => {
    const parent = makeTempProject();
    const a = join(parent, 'a');
    writeProjectConfig(a, { enabled_packs: [] });
    writeProjectConfig(join(parent, 'node_modules', 'x'), { enabled_packs: [] });
    writeProjectConfig(join(parent, '.git', 'y'), { enabled_packs: [] });
    writeProjectConfig(join(parent, '.cache', 'z'), { enabled_packs: [] });
    writeProjectConfig(join(parent, 'archive', 'old'), { enabled_packs: [] });

    const roots = discoverProjectRoots(parent);

    assert.deepEqual(roots, [a]);
  });

  it('does not descend past a found project root', () => {
    const parent = makeTempProject();
    const a = join(parent, 'a');
    writeProjectConfig(a, { enabled_packs: [] });
    // A nested project inside an already-found root is not a separate project.
    writeProjectConfig(join(a, 'sub'), { enabled_packs: [] });

    const roots = discoverProjectRoots(parent);

    assert.deepEqual(roots, [a]);
  });
});
