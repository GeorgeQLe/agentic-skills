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

  it('sets, clears, and unsets build-in-public mode while preserving sibling alignment fields', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: ['devtool'],
      skill_pack_version: 1,
      alignment: {
        review_depth: 'full'
      },
      notes: ['keep me']
    });

    assert.equal(await runSkillpacks(dir, ['set-bip', 'on']), 'Set alignment.build_in_public to on\n');
    let config = readProjectConfig(dir);
    assert.deepEqual(config.alignment, { review_depth: 'full', build_in_public: true });
    assert.deepEqual(config.enabled_packs, ['devtool']);
    assert.deepEqual(config.notes, ['keep me']);
    assert.equal(existsSync(join(dir, '.agents/.pack.lock')), false);

    assert.equal(await runSkillpacks(dir, ['set-bip', 'off']), 'Set alignment.build_in_public to off\n');
    config = readProjectConfig(dir);
    assert.deepEqual(config.alignment, { review_depth: 'full', build_in_public: false });
    assert.deepEqual(config.notes, ['keep me']);

    assert.equal(await runSkillpacks(dir, ['set-bip', 'unset']), 'Set alignment.build_in_public to unset\n');
    config = readProjectConfig(dir);
    assert.deepEqual(config.alignment, { review_depth: 'full' });
    assert.deepEqual(config.notes, ['keep me']);
  });

  it('dismisses and resets the build-in-public suggestion prompt without clobbering siblings', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      enabled_packs: ['devtool'],
      skill_pack_version: 1,
      alignment: {
        build_in_public: false
      },
      notes: ['keep me']
    });

    assert.equal(
      await runSkillpacks(dir, ['set-bip-prompt', 'dismiss']),
      'Set alignment.bip_prompt_dismissed to dismiss\n'
    );
    let config = readProjectConfig(dir);
    assert.deepEqual(config.alignment, { build_in_public: false, bip_prompt_dismissed: true });
    assert.deepEqual(config.enabled_packs, ['devtool']);
    assert.deepEqual(config.notes, ['keep me']);
    assert.equal(existsSync(join(dir, '.agents/.pack.lock')), false);

    assert.equal(
      await runSkillpacks(dir, ['set-bip-prompt', 'reset']),
      'Set alignment.bip_prompt_dismissed to reset\n'
    );
    config = readProjectConfig(dir);
    assert.deepEqual(config.alignment, { build_in_public: false });
    assert.deepEqual(config.notes, ['keep me']);
  });

  it('removes an empty alignment object when resetting the build-in-public prompt', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      custom_field: 'preserved',
      alignment: {
        bip_prompt_dismissed: true
      }
    });

    assert.equal(
      await runSkillpacks(dir, ['set-bip-prompt', 'reset']),
      'Set alignment.bip_prompt_dismissed to reset\n'
    );

    const config = readProjectConfig(dir);
    assert.deepEqual(config, {
      custom_field: 'preserved',
      project_type: 'business-app',
      enabled_packs: [],
      skill_pack_version: 1
    });
  });

  it('rejects an invalid build-in-public prompt action', async () => {
    const dir = makeTempProject();
    await assert.rejects(
      () => runSkillpacks(dir, ['set-bip-prompt', 'bogus']),
      /set-bip-prompt requires an action: dismiss or reset/
    );
  });

  it('removes an empty alignment object when unsetting build-in-public mode', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      custom_field: 'preserved',
      alignment: {
        build_in_public: true
      }
    });

    assert.equal(await runSkillpacks(dir, ['set-bip', 'unset']), 'Set alignment.build_in_public to unset\n');

    const config = readProjectConfig(dir);
    assert.deepEqual(config, {
      custom_field: 'preserved',
      project_type: 'business-app',
      enabled_packs: [],
      skill_pack_version: 1
    });
  });

  it('sets build-in-public mode across discovered projects only', async () => {
    const parent = makeTempProject();
    const a = join(parent, 'a');
    const b = join(parent, 'b');
    const ignoredNodeModules = join(parent, 'node_modules', 'ignored');
    const ignoredDotDir = join(parent, '.cache', 'ignored');
    writeProjectConfig(a, {
      project_type: 'devtool',
      enabled_packs: ['devtool'],
      skill_pack_version: 1
    });
    writeProjectConfig(b, {
      project_type: 'business-app',
      enabled_packs: [],
      skill_pack_version: 1,
      alignment: {
        build_in_public: false
      }
    });
    writeProjectConfig(ignoredNodeModules, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1
    });
    writeProjectConfig(ignoredDotDir, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1
    });

    const output = await runSkillpacks(parent, ['set-bip', 'on', '--all']);

    assert.match(output, /=== a ===/);
    assert.match(output, /=== b ===/);
    assert.doesNotMatch(output, /node_modules/);
    assert.doesNotMatch(output, /\.cache/);
    assert.match(output, /Summary \(set-bip on --all\): 2 ok, 0 flagged, 0 failed across 2 project\(s\)\./);
    assert.equal(readProjectConfig(a).alignment.build_in_public, true);
    assert.equal(readProjectConfig(b).alignment.build_in_public, true);
    assert.equal(Object.hasOwn(readProjectConfig(ignoredNodeModules), 'alignment'), false);
    assert.equal(Object.hasOwn(readProjectConfig(ignoredDotDir), 'alignment'), false);
  });

  it('unsets build-in-public mode across projects while preserving sibling alignment fields', async () => {
    const parent = makeTempProject();
    const a = join(parent, 'a');
    const b = join(parent, 'b');
    writeProjectConfig(a, {
      project_type: 'devtool',
      enabled_packs: ['devtool'],
      skill_pack_version: 1,
      alignment: {
        review_depth: 'full',
        build_in_public: true
      }
    });
    writeProjectConfig(b, {
      project_type: 'business-app',
      enabled_packs: [],
      skill_pack_version: 1,
      alignment: {
        build_in_public: false
      }
    });

    const output = await runSkillpacks(parent, ['set-bip', 'unset', '--all']);

    assert.match(output, /Summary \(set-bip unset --all\): 2 ok, 0 flagged, 0 failed across 2 project\(s\)\./);
    assert.deepEqual(readProjectConfig(a).alignment, { review_depth: 'full' });
    assert.equal(Object.hasOwn(readProjectConfig(b), 'alignment'), false);
  });

  it('dry-runs build-in-public mode changes across projects without mutating files', async () => {
    const parent = makeTempProject();
    const a = join(parent, 'a');
    const b = join(parent, 'b');
    writeProjectConfig(a, {
      project_type: 'devtool',
      enabled_packs: ['devtool'],
      skill_pack_version: 1,
      alignment: {
        build_in_public: true
      }
    });
    writeProjectConfig(b, {
      project_type: 'business-app',
      enabled_packs: [],
      skill_pack_version: 1
    });
    const beforeA = readFileSync(projectConfigPath(a), 'utf8');
    const beforeB = readFileSync(projectConfigPath(b), 'utf8');

    const result = await runSkillpacksRaw(parent, ['set-bip', 'off', '--all', '--dry-run']);

    assert.equal(result.exitCode, 0, result.stderr);
    assert.match(result.stdout, /=== a ===\n  would change alignment\.build_in_public from on to off/);
    assert.match(result.stdout, /=== b ===\n  would set alignment\.build_in_public to off/);
    assert.match(result.stdout, /Summary \(set-bip off --all --dry-run\): 2 project\(s\) scanned\./);
    assert.match(result.stdout, /Safe to run: yes/);
    assert.match(result.stdout, /Recommended command: skillpacks set-bip off --all/);
    assert.equal(readFileSync(projectConfigPath(a), 'utf8'), beforeA);
    assert.equal(readFileSync(projectConfigPath(b), 'utf8'), beforeB);
    assert.equal(existsSync(join(a, '.agents/.pack.lock')), false);
    assert.equal(existsSync(join(b, '.agents/.pack.lock')), false);
  });

  it('reports invalid JSON as unsafe during build-in-public dry-run without mutating other projects', async () => {
    const parent = makeTempProject();
    const good = join(parent, 'good');
    const bad = join(parent, 'bad');
    writeProjectConfig(good, {
      project_type: 'devtool',
      enabled_packs: ['devtool'],
      skill_pack_version: 1
    });
    mkdirSync(dirname(projectConfigPath(bad)), { recursive: true });
    writeFileSync(projectConfigPath(bad), '{ invalid json\n');
    const beforeGood = readFileSync(projectConfigPath(good), 'utf8');
    const beforeBad = readFileSync(projectConfigPath(bad), 'utf8');

    const result = await runSkillpacksRaw(parent, ['set-bip', 'off', '--all', '--dry-run']);

    assert.equal(result.exitCode, 1);
    assert.match(result.stdout, /=== good ===\n  would set alignment\.build_in_public to off/);
    assert.match(result.stdout, /=== bad ===\n  failed: failed to parse /);
    assert.match(result.stdout, /Failures:/);
    assert.match(result.stdout, /bad: failed to parse /);
    assert.match(result.stdout, /Safe to run: no/);
    assert.doesNotMatch(result.stdout, /Recommended command:/);
    assert.equal(readFileSync(projectConfigPath(good), 'utf8'), beforeGood);
    assert.equal(readFileSync(projectConfigPath(bad), 'utf8'), beforeBad);
  });

  it('rejects build-in-public dry-run without all-project mode', async () => {
    const dir = makeTempProject();
    await assert.rejects(
      () => runSkillpacks(dir, ['set-bip', 'on', '--dry-run']),
      /set-bip --dry-run requires --all/
    );
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
