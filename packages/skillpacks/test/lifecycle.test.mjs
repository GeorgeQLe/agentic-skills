import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
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
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, it } from 'node:test';
import { withProjectLock } from '../src/cli/project-config.mjs';
import { installResolved, refreshAllProjects, uninstallGlobal } from '../src/cli/lifecycle.mjs';
import { runSkillpacksCli } from '../src/cli/run-pack-script.mjs';
import {
  SKILL_CONVENTIONS,
  managedConventionDocEntries
} from '../../../scripts/skill-convention-registry.mjs';

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

function readManifest() {
  return JSON.parse(readFileSync(join(packageRoot, 'dist/skillpacks-manifest.json'), 'utf8'));
}

async function runSkillpacks(projectRoot, args, options = {}) {
  const result = await runSkillpacksRaw(projectRoot, args, options);
  assert.equal(result.exitCode, 0, result.stderr);
  return result;
}

async function runSkillpacksRaw(projectRoot, args, options = {}) {
  const originalCwd = process.cwd();
  const originalPath = process.env.PATH;
  const originalHome = process.env.HOME;
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
    if (options.home) {
      process.env.HOME = options.home;
    }
    const exitCode = await runSkillpacksCli(args);
    return { exitCode, stdout, stderr };
  } finally {
    process.chdir(originalCwd);
    if (originalPath === undefined) {
      delete process.env.PATH;
    } else {
      process.env.PATH = originalPath;
    }
    if (originalHome === undefined) {
      delete process.env.HOME;
    } else {
      process.env.HOME = originalHome;
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

function runPackSh(projectRoot, args) {
  return execFileSync('bash', [join(repoRoot, 'scripts/pack.sh'), ...args], {
    cwd: projectRoot,
    env: process.env,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024
  });
}

function marker(projectRoot, tool, skill) {
  return readFileSync(markerPath(projectRoot, tool, skill), 'utf8');
}

function markerPath(projectRoot, tool, skill) {
  return join(projectRoot, `.${tool}/skills/${skill}/.agentic-skills-managed`);
}

function markerFieldText(text, field) {
  const prefix = `${field}=`;
  const line = text.split(/\r?\n/).find((candidate) => candidate.startsWith(prefix));
  return line ? line.slice(prefix.length) : '';
}

function markerField(projectRoot, tool, skill, field) {
  return markerFieldText(marker(projectRoot, tool, skill), field);
}

function rewriteMarkerSource(projectRoot, tool, skill, source) {
  const filePath = markerPath(projectRoot, tool, skill);
  const current = readFileSync(filePath, 'utf8');
  assert.match(current, /^source=.*$/m);
  writeFileSync(filePath, current.replace(/^source=.*$/m, `source=${source}`));
}

function skillPath(projectRoot, tool, skill) {
  return join(projectRoot, `.${tool}/skills/${skill}`);
}

function writeDanglingSkillLink(projectRoot, tool, skill, source) {
  const target = skillPath(projectRoot, tool, skill);
  mkdirSync(dirname(target), { recursive: true });
  symlinkSync(source, target, 'dir');
  assert.equal(existsSync(target), false, `${target} should be dangling`);
  assert.equal(lstatSync(target).isSymbolicLink(), true);
  return target;
}

function installStateSnapshot(projectRoot, skill) {
  const relPaths = ['.agents/project.json'];
  for (const tool of ['claude', 'codex']) {
    const skillRoot = skillPath(projectRoot, tool, skill);
    relPaths.push(relative(projectRoot, skillRoot));
    for (const file of installedSkillFiles(projectRoot, tool, skill)) {
      relPaths.push(relative(projectRoot, join(skillRoot, file)));
    }
  }

  return Object.fromEntries(relPaths.sort().map((relPath) => {
    const fullPath = join(projectRoot, relPath);
    const stats = lstatSync(fullPath, { bigint: true });
    return [relPath, {
      mtimeNs: stats.mtimeNs.toString(),
      content: stats.isFile() ? readFileSync(fullPath, 'utf8') : null,
      link: stats.isSymbolicLink() ? readlinkSync(fullPath) : null
    }];
  }));
}

function waitForMtimeTick() {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, 20));
}

function installedSkillFiles(projectRoot, tool, skill) {
  const root = skillPath(projectRoot, tool, skill);
  const files = [];

  function visit(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile()) {
        files.push(relative(root, fullPath));
      }
    }
  }

  visit(root);
  return files.sort();
}

function requiredConventionIds(projectRoot, tool, skill) {
  const skillMarkdown = readFileSync(join(skillPath(projectRoot, tool, skill), 'SKILL.md'), 'utf8');
  const match = skillMarkdown.match(/^required_conventions:\s*\[([^\]]*)\]\s*$/m);
  if (!match) return [];
  return match[1]
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function assertDeclaredBundlesInstalled(projectRoot, tool, skill) {
  const required = requiredConventionIds(projectRoot, tool, skill);
  assert.notEqual(required.length, 0, `${tool}/${skill} should declare required conventions`);
  for (const id of required) {
    const convention = SKILL_CONVENTIONS[id];
    assert.ok(convention, `${tool}/${skill} declares known convention ${id}`);
    if (!convention.bundleFile) continue;
    assert.equal(
      existsSync(join(skillPath(projectRoot, tool, skill), convention.bundleFile)),
      true,
      `${tool}/${skill} should install ${convention.bundleFile}`
    );
  }
}

function managedConventionDocPath(projectRoot, installPath) {
  return join(projectRoot, '.agents/skillpacks/docs', installPath);
}

function assertManagedConventionDocsInstalled(projectRoot) {
  for (const entry of managedConventionDocEntries(repoRoot)) {
    const target = managedConventionDocPath(projectRoot, entry.installPath);
    assert.equal(existsSync(target), true, `${entry.installPath} should be installed`);
    assert.equal(
      readFileSync(target, 'utf8'),
      readFileSync(join(repoRoot, entry.canonicalDoc), 'utf8'),
      `${entry.installPath} should match canonical doc`
    );
  }
  const metadata = JSON.parse(readFileSync(join(projectRoot, '.agents/skillpacks/docs/.skillpacks-managed.json'), 'utf8'));
  assert.equal(metadata.managed_by, 'agentic-skills');
  assert.deepEqual(
    metadata.docs.map((entry) => entry.path).sort(),
    managedConventionDocEntries(repoRoot).map((entry) => entry.installPath).sort()
  );
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

function writeManagedSkillDir(target, source) {
  mkdirSync(target, { recursive: true });
  writeFileSync(
    join(target, '.agentic-skills-managed'),
    ['source=' + source, 'managed_by=agentic-skills', 'source_version=v0.0', 'source_sha=stale'].join('\n') + '\n'
  );
  writeFileSync(join(target, 'SKILL.md'), 'managed\n');
}

async function captureConsole(fn) {
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
    const exitCode = await fn();
    return { exitCode, stdout, stderr };
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
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

function assertProvisionedShippingContract(doc, fileName) {
  assert.match(doc, /### Shipping Contract Convention/, `${fileName} should include shipping contract heading`);
  assert.match(
    doc,
    /Follow the shared shipping contract convention/,
    `${fileName} should define the shared shipping contract pointer`
  );
  assert.match(doc, /Default next-step routing/, `${fileName} should include next-step routing`);
  assert.match(doc, /committing and pushing all intended changes/, `${fileName} should include commit and push rule`);
  assert.match(doc, /Do not leave tracked changes or unpushed commits behind/, `${fileName} should include clean tracked tree rule`);
  assert.match(doc, /does not override stricter safety rules/, `${fileName} should include safety exceptions`);
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
  it('initializes project-local base skills without installing user-home skills', async () => {
    const dir = makeTempProject();

    const { stdout } = await runSkillpacks(dir, ['init']);

    assert.match(stdout, /Installed \.claude\/skills\/codebase-status/);
    assert.match(stdout, /Installed \.codex\/skills\/afps-status/);
    assert.match(stdout, /Updated \.agents\/project\.json \(base skills enabled\)/);
    assert.match(stdout, /Initialized project base skills to skillpacks@/);
    assert.equal(existsSync(skillPath(dir, 'claude', 'codebase-status')), true);
    assert.equal(existsSync(skillPath(dir, 'codex', 'afps-status')), true);
    assert.equal(existsSync(skillPath(dir, 'claude', 'afps-status')), true);
    assert.match(marker(dir, 'claude', 'codebase-status'), /source=.*packs\/base\/claude\/codebase-status/);
    assert.equal(readProjectConfig(dir).base_skills, true);
    assert.deepEqual(readProjectConfig(dir).enabled_packs, []);
  });

  it('rejects unsupported init arguments', async () => {
    const dir = makeTempProject();

    const error = await runSkillpacksExpectError(dir, ['init', '--bad']);

    assert.match(error.message, /init does not accept arguments/);
    assert.equal(existsSync(projectConfigPath(dir)), false);
  });

  it('uninstall-global removes only repo-managed installs from the user-home skill roots', async () => {
    const home = makeTempProject();
    const claudeRoot = join(home, '.claude/skills');
    const codexRoot = join(home, '.codex/skills');
    mkdirSync(claudeRoot, { recursive: true });
    mkdirSync(codexRoot, { recursive: true });

    // Repo-managed installs (source owned by skillpacks) — must be removed.
    writeManagedSkillDir(join(claudeRoot, 'codebase-status'), join(repoRoot, 'base/claude/codebase-status'));
    writeManagedSkillDir(join(codexRoot, 'afps-status'), join(repoRoot, 'base/codex/afps-status'));
    writeManagedSkillDir(join(claudeRoot, 'legacy-claude'), join(repoRoot, 'global/claude/legacy-claude'));
    writeManagedSkillDir(join(codexRoot, 'legacy-codex'), join(repoRoot, 'global/codex/legacy-codex'));

    // Unmanaged installs — must be left untouched.
    const unmanagedDir = join(claudeRoot, 'my-local-skill');
    mkdirSync(unmanagedDir, { recursive: true });
    writeFileSync(join(unmanagedDir, 'SKILL.md'), 'local\n');
    const foreignSource = join(home, 'somewhere-else');
    mkdirSync(foreignSource, { recursive: true });
    writeManagedSkillDir(join(codexRoot, 'foreign-managed'), foreignSource);
    const unmanagedMarkerDir = join(claudeRoot, 'suspicious-unmanaged-marker');
    mkdirSync(unmanagedMarkerDir, { recursive: true });
    writeFileSync(
      join(unmanagedMarkerDir, '.agentic-skills-managed'),
      ['source=' + join(repoRoot, 'global/claude/suspicious-unmanaged-marker'), 'managed_by=someone-else'].join('\n') + '\n'
    );
    writeFileSync(join(unmanagedMarkerDir, 'SKILL.md'), 'foreign marker owner\n');

    const { stdout, exitCode } = await captureConsole(() => uninstallGlobal({ homeRoot: home }));

    assert.equal(exitCode, 0);
    assert.match(stdout, /Removed \.claude\/skills\/codebase-status/);
    assert.match(stdout, /Removed \.codex\/skills\/afps-status/);
    assert.match(stdout, /Removed \.claude\/skills\/legacy-claude/);
    assert.match(stdout, /Removed \.codex\/skills\/legacy-codex/);
    assert.match(stdout, /Removed 4 repo-managed base skill install\(s\)/);
    assert.equal(existsSync(join(claudeRoot, 'codebase-status')), false);
    assert.equal(existsSync(join(codexRoot, 'afps-status')), false);
    assert.equal(existsSync(join(claudeRoot, 'legacy-claude')), false);
    assert.equal(existsSync(join(codexRoot, 'legacy-codex')), false);
    assert.equal(existsSync(unmanagedDir), true);
    assert.equal(existsSync(join(codexRoot, 'foreign-managed')), true);
    assert.equal(existsSync(unmanagedMarkerDir), true);
  });

  it('uninstall-global removes legacy managed globals sourced from older agentic-skills checkouts', async () => {
    const home = makeTempProject();
    const codexRoot = join(home, '.codex/skills');
    mkdirSync(codexRoot, { recursive: true });

    const oldCheckout = join(home, 'old-agentic-skills-checkout', 'agentic-skills');
    writeManagedSkillDir(
      join(codexRoot, 'codebase-status'),
      join(oldCheckout, 'base/codex/codebase-status')
    );
    writeManagedSkillDir(
      join(codexRoot, 'not-codebase-status'),
      join(oldCheckout, 'base/codex/codebase-status')
    );

    const { stdout, exitCode } = await captureConsole(() => uninstallGlobal({ homeRoot: home }));

    assert.equal(exitCode, 0);
    assert.match(stdout, /Removed \.codex\/skills\/codebase-status/);
    assert.match(stdout, /Removed 1 repo-managed base skill install\(s\)/);
    assert.doesNotMatch(stdout, /not-codebase-status/);
    assert.equal(existsSync(join(codexRoot, 'codebase-status')), false);
    assert.equal(existsSync(join(codexRoot, 'not-codebase-status')), true);
  });

  it('uninstall-global --dry-run previews only repo-managed installs without removing them', async () => {
    const home = makeTempProject();
    const claudeRoot = join(home, '.claude/skills');
    const codexRoot = join(home, '.codex/skills');
    mkdirSync(claudeRoot, { recursive: true });
    mkdirSync(codexRoot, { recursive: true });

    writeManagedSkillDir(join(claudeRoot, 'codebase-status'), join(repoRoot, 'base/claude/codebase-status'));
    writeManagedSkillDir(join(codexRoot, 'afps-status'), join(repoRoot, 'base/codex/afps-status'));
    writeManagedSkillDir(join(claudeRoot, 'legacy-claude'), join(repoRoot, 'global/claude/legacy-claude'));
    writeManagedSkillDir(join(codexRoot, 'legacy-codex'), join(repoRoot, 'global/codex/legacy-codex'));

    const unmanagedDir = join(claudeRoot, 'my-local-skill');
    mkdirSync(unmanagedDir, { recursive: true });
    writeFileSync(join(unmanagedDir, 'SKILL.md'), 'local\n');
    const foreignSource = join(home, 'somewhere-else');
    mkdirSync(foreignSource, { recursive: true });
    writeManagedSkillDir(join(codexRoot, 'foreign-managed'), foreignSource);

    const { stdout, exitCode } = await captureConsole(() => uninstallGlobal({
      homeRoot: home,
      dryRun: true
    }));

    assert.equal(exitCode, 0);
    assert.match(stdout, /Would remove \.claude\/skills\/codebase-status/);
    assert.match(stdout, /Would remove \.codex\/skills\/afps-status/);
    assert.match(stdout, /Would remove \.claude\/skills\/legacy-claude/);
    assert.match(stdout, /Would remove \.codex\/skills\/legacy-codex/);
    assert.match(stdout, /Dry run\. Would remove 4 repo-managed base skill install\(s\)/);
    assert.doesNotMatch(stdout, /foreign-managed/);
    assert.doesNotMatch(stdout, /my-local-skill/);
    assert.equal(existsSync(join(claudeRoot, 'codebase-status')), true);
    assert.equal(existsSync(join(codexRoot, 'afps-status')), true);
    assert.equal(existsSync(join(claudeRoot, 'legacy-claude')), true);
    assert.equal(existsSync(join(codexRoot, 'legacy-codex')), true);
    assert.equal(existsSync(unmanagedDir), true);
    assert.equal(existsSync(join(codexRoot, 'foreign-managed')), true);
  });

  it('cleanup removes Build-In-Public config from discovered projects while preserving siblings', async () => {
    const root = makeTempProject();
    const home = makeTempProject();
    const projectA = join(root, 'project-a');
    const projectB = join(root, 'nested/project-b');
    const projectC = join(root, 'project-c');
    writeProjectConfig(projectA, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      alignment: {
        build_in_public: true,
        bip_platforms: ['linkedin'],
        bip_prompt_dismissed: true,
        review_depth: 'full'
      },
      notes: ['keep me']
    });
    writeProjectConfig(projectB, {
      project_type: 'business-app',
      enabled_packs: [],
      skill_pack_version: 1,
      alignment: {
        build_in_public: false
      }
    });
    writeProjectConfig(projectC, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      alignment: {
        review_depth: 'light'
      }
    });

    const { exitCode, stdout } = await runSkillpacks(root, ['cleanup'], { home });

    assert.equal(exitCode, 0);
    assert.match(stdout, /Done\. Removed 0 repo-managed base skill install\(s\)/);
    assert.match(stdout, /Removed alignment\.build_in_public, alignment\.bip_platforms, alignment\.bip_prompt_dismissed from project-a\/\.agents\/project\.json/);
    assert.match(stdout, /Removed alignment\.build_in_public from nested\/project-b\/\.agents\/project\.json/);
    assert.match(stdout, /Removed Build-In-Public config from 2 project\(s\)/);
    assert.deepEqual(readProjectConfig(projectA).alignment, { review_depth: 'full' });
    assert.deepEqual(readProjectConfig(projectA).notes, ['keep me']);
    assert.equal(Object.hasOwn(readProjectConfig(projectB), 'alignment'), false);
    assert.deepEqual(readProjectConfig(projectC).alignment, { review_depth: 'light' });
  });

  it('cleanup --dry-run previews Build-In-Public config removal without mutating projects', async () => {
    const root = makeTempProject();
    const home = makeTempProject();
    const project = join(root, 'project-a');
    writeProjectConfig(project, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      alignment: {
        build_in_public: true,
        bip_prompt_dismissed: true
      }
    });
    const before = readFileSync(projectConfigPath(project), 'utf8');

    const { exitCode, stdout } = await runSkillpacks(root, ['cleanup', '--dry-run'], { home });

    assert.equal(exitCode, 0);
    assert.match(stdout, /Would remove alignment\.build_in_public, alignment\.bip_prompt_dismissed from project-a\/\.agents\/project\.json/);
    assert.match(stdout, /Dry run\. Would remove Build-In-Public config from 1 project\(s\)/);
    assert.equal(readFileSync(projectConfigPath(project), 'utf8'), before);
    assert.equal(existsSync(join(project, '.agents/.pack.lock')), false);
  });

  it('cleanup --all --dry-run scans current-directory projects and nested projects only', async () => {
    const root = makeTempProject();
    const home = makeTempProject();
    const projectA = join(root, 'project-a');
    const projectB = join(root, 'nested/project-b');
    const homeProject = join(home, 'home-project');
    for (const project of [projectA, projectB, homeProject]) {
      writeProjectConfig(project, {
        project_type: 'devtool',
        enabled_packs: [],
        skill_pack_version: 1,
        alignment: { build_in_public: true }
      });
    }

    const { exitCode, stdout } = await runSkillpacks(root, ['cleanup', '--all', '--dry-run'], { home });

    assert.equal(exitCode, 0);
    assert.match(stdout, /Would remove alignment\.build_in_public from project-a\/\.agents\/project\.json/);
    assert.match(stdout, /Would remove alignment\.build_in_public from nested\/project-b\/\.agents\/project\.json/);
    assert.doesNotMatch(stdout, /home-project/);
    assert.match(stdout, /Dry run\. Would remove Build-In-Public config from 2 project\(s\)/);
    assert.equal(readProjectConfig(projectA).alignment.build_in_public, true);
    assert.equal(readProjectConfig(projectB).alignment.build_in_public, true);
    assert.equal(readProjectConfig(homeProject).alignment.build_in_public, true);
  });

  it('cleanup --global --dry-run scans user-home projects and previews legacy globals', async () => {
    const root = makeTempProject();
    const home = makeTempProject();
    const cwdProject = join(root, 'cwd-project');
    const homeProject = join(home, 'home-project');
    writeProjectConfig(cwdProject, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      alignment: { build_in_public: true }
    });
    writeProjectConfig(homeProject, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      alignment: { build_in_public: true }
    });
    writeManagedSkillDir(
      join(home, '.claude/skills/codebase-status'),
      join(repoRoot, 'base/claude/codebase-status')
    );

    const { exitCode, stdout } = await runSkillpacks(root, ['cleanup', '--global', '--dry-run'], { home });

    assert.equal(exitCode, 0);
    assert.match(stdout, /Would remove \.claude\/skills\/codebase-status/);
    assert.match(stdout, /Would remove alignment\.build_in_public from home-project\/\.agents\/project\.json/);
    assert.doesNotMatch(stdout, /cwd-project/);
    assert.match(stdout, /Dry run\. Would remove Build-In-Public config from 1 project\(s\)/);
    assert.equal(existsSync(join(home, '.claude/skills/codebase-status')), true);
    assert.equal(readProjectConfig(cwdProject).alignment.build_in_public, true);
    assert.equal(readProjectConfig(homeProject).alignment.build_in_public, true);
  });

  it('cleanup --dry-run previews managed deprecated product-design alias removals without deleting them', async () => {
    const root = makeTempProject();
    const home = makeTempProject();
    const project = join(root, 'project-a');
    writeProjectConfig(project, {
      project_type: 'business-app',
      enabled_packs: ['product-design'],
      skill_pack_version: 1
    });

    writeManagedSkillDir(
      skillPath(project, 'claude', 'prototype'),
      join(repoRoot, 'packs/product-design/claude/prototype')
    );
    writeManagedSkillDir(
      skillPath(project, 'codex', 'create-ui-experiment'),
      join(repoRoot, 'packs/product-design/codex/create-ui-experiment')
    );
    writeManagedSkillDir(
      skillPath(project, 'codex', 'consolidate-variations'),
      join(repoRoot, 'packs/product-design/codex/consolidate-variations')
    );

    const unmanaged = skillPath(project, 'claude', 'create-ui-experiment');
    mkdirSync(unmanaged, { recursive: true });
    writeFileSync(join(unmanaged, 'SKILL.md'), 'local alias override\n');

    const { exitCode, stdout } = await runSkillpacks(root, ['cleanup', '--dry-run'], { home });

    assert.equal(exitCode, 0);
    assert.match(stdout, /Would remove project-a\/\.claude\/skills\/prototype \(deprecated alias replaced by logic-wiring\)/);
    assert.match(stdout, /Would remove project-a\/\.codex\/skills\/create-ui-experiment \(deprecated alias replaced by build-ui-screens\)/);
    assert.match(stdout, /Would remove project-a\/\.codex\/skills\/consolidate-variations \(deprecated alias replaced by consolidate-prototypes\)/);
    assert.match(stdout, /Dry run\. Would remove 3 deprecated alias skill install\(s\)/);
    assert.equal(existsSync(skillPath(project, 'claude', 'prototype')), true);
    assert.equal(existsSync(skillPath(project, 'codex', 'create-ui-experiment')), true);
    assert.equal(existsSync(skillPath(project, 'codex', 'consolidate-variations')), true);
    assert.equal(existsSync(unmanaged), true);
  });

  it('cleanup removes managed deprecated product-design alias installs while preserving unmanaged directories', async () => {
    const root = makeTempProject();
    const home = makeTempProject();
    const project = join(root, 'project-a');
    writeProjectConfig(project, {
      project_type: 'business-app',
      enabled_packs: ['product-design'],
      skill_pack_version: 1
    });

    writeManagedSkillDir(
      skillPath(project, 'claude', 'prototype'),
      join(repoRoot, 'packs/product-design/claude/prototype')
    );
    writeManagedSkillDir(
      skillPath(project, 'codex', 'create-ui-experiment'),
      join(repoRoot, 'packs/product-design/codex/create-ui-experiment')
    );
    writeManagedSkillDir(
      skillPath(project, 'codex', 'consolidate-variations'),
      join(repoRoot, 'packs/product-design/codex/consolidate-variations')
    );
    writeManagedSkillDir(
      skillPath(project, 'codex', 'logic-wiring'),
      join(repoRoot, 'packs/product-design/codex/logic-wiring')
    );

    const unmanaged = skillPath(project, 'claude', 'create-ui-experiment');
    mkdirSync(unmanaged, { recursive: true });
    writeFileSync(join(unmanaged, 'SKILL.md'), 'local alias override\n');

    const { exitCode, stdout } = await runSkillpacks(root, ['cleanup'], { home });

    assert.equal(exitCode, 0);
    assert.match(stdout, /Removed project-a\/\.claude\/skills\/prototype \(deprecated alias replaced by logic-wiring\)/);
    assert.match(stdout, /Removed project-a\/\.codex\/skills\/create-ui-experiment \(deprecated alias replaced by build-ui-screens\)/);
    assert.match(stdout, /Removed project-a\/\.codex\/skills\/consolidate-variations \(deprecated alias replaced by consolidate-prototypes\)/);
    assert.match(stdout, /Removed 3 deprecated alias skill install\(s\)/);
    assert.equal(existsSync(skillPath(project, 'claude', 'prototype')), false);
    assert.equal(existsSync(skillPath(project, 'codex', 'create-ui-experiment')), false);
    assert.equal(existsSync(skillPath(project, 'codex', 'consolidate-variations')), false);
    assert.equal(existsSync(skillPath(project, 'codex', 'logic-wiring')), true);
    assert.equal(existsSync(unmanaged), true);
  });

  it('keeps uninstall-global as a compatibility alias for cleanup', async () => {
    const root = makeTempProject();
    const home = makeTempProject();
    const homeProject = join(home, 'home-project');
    writeProjectConfig(homeProject, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      alignment: {
        build_in_public: true
      }
    });

    const { stdout, exitCode } = await runSkillpacks(root, ['uninstall-global'], { home });

    assert.equal(exitCode, 0);
    assert.match(stdout, /Removed alignment\.build_in_public from home-project\/\.agents\/project\.json/);
    assert.equal(Object.hasOwn(readProjectConfig(homeProject), 'alignment'), false);
  });

  it('uninstall-global compatibility alias also removes managed deprecated project-local aliases', async () => {
    const root = makeTempProject();
    const home = makeTempProject();
    const homeProject = join(home, 'home-project');
    writeProjectConfig(homeProject, {
      project_type: 'business-app',
      enabled_packs: ['product-design'],
      skill_pack_version: 1
    });
    writeManagedSkillDir(
      skillPath(homeProject, 'claude', 'prototype'),
      join(repoRoot, 'packs/product-design/claude/prototype')
    );

    const { stdout, exitCode } = await runSkillpacks(root, ['uninstall-global'], { home });

    assert.equal(exitCode, 0);
    assert.match(stdout, /Removed home-project\/\.claude\/skills\/prototype \(deprecated alias replaced by logic-wiring\)/);
    assert.equal(existsSync(skillPath(homeProject, 'claude', 'prototype')), false);
  });

  it('rejects arguments to cleanup', async () => {
    const dir = makeTempProject();

    const error = await runSkillpacksExpectError(dir, ['cleanup', 'extra']);

    assert.match(error.message, /cleanup: unexpected argument 'extra'/);
  });

  it('rejects unsupported cleanup flags', async () => {
    const dir = makeTempProject();

    const error = await runSkillpacksExpectError(dir, ['cleanup', '--bad']);

    assert.match(error.message, /cleanup: unsupported flag '--bad'/);
  });

  it('rejects incompatible cleanup scope flags', async () => {
    const dir = makeTempProject();

    const error = await runSkillpacksExpectError(dir, ['cleanup', '--all', '--global']);

    assert.match(error.message, /cleanup: --all and --global cannot be used together/);
  });

  it('accepts cleanup dry-run and reinstall flags with explicit scopes in any order', async () => {
    const first = makeTempProject();
    const second = makeTempProject();
    const third = makeTempProject();
    const thirdHome = makeTempProject();

    const firstResult = await runSkillpacksRaw(first, ['cleanup', '--dry-run', '--reinstall-base']);
    const secondResult = await runSkillpacksRaw(second, ['cleanup', '--all', '--reinstall-base', '--dry-run']);
    const thirdResult = await runSkillpacksRaw(third, ['cleanup', '--reinstall-base', '--global', '--dry-run'], { home: thirdHome });

    assert.equal(firstResult.exitCode, 0, firstResult.stderr);
    assert.equal(secondResult.exitCode, 0, secondResult.stderr);
    assert.equal(thirdResult.exitCode, 0, thirdResult.stderr);
    assert.match(firstResult.stdout, /Would initialize current directory with base skills/);
    assert.match(secondResult.stdout, /Would initialize current directory with base skills/);
    assert.match(thirdResult.stdout, /Would initialize user-home scan root with base skills/);
    assert.match(thirdResult.stdout, /Dry run\. Would initialize project base skills/);
    assert.equal(existsSync(projectConfigPath(first)), false);
    assert.equal(existsSync(projectConfigPath(second)), false);
    assert.equal(existsSync(projectConfigPath(thirdHome)), false);
  });

  it('refresh --all flags legacy user-home installs while still refreshing projects', async () => {
    const root = makeTempProject();
    const home = makeTempProject();
    const project = join(root, 'project-a');
    mkdirSync(project, { recursive: true });
    writeProjectConfig(project, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      base_skills: true
    });
    writeManagedSkillDir(
      join(home, '.claude/skills/codebase-status'),
      join(repoRoot, 'base/claude/codebase-status')
    );

    const { exitCode, stdout } = await captureConsole(() => refreshAllProjects({
      manifest: readManifest(),
      rootDir: root,
      homeRoot: home
    }));

    assert.equal(exitCode, 1);
    assert.match(stdout, /WARNING: Found 1 legacy user-home skillpacks install\(s\)/);
    assert.match(stdout, /\.claude\/skills\/codebase-status/);
    assert.match(stdout, /Recommended cleanup: npx skillpacks cleanup --global/);
    assert.match(stdout, /=== project-a ===/);
    assert.match(stdout, /Refreshed project skills to skillpacks@/);
    assert.match(stdout, /Summary \(refresh --all\): 1 ok, 0 flagged, 0 failed across 1 project\(s\)\./);
    assert.equal(existsSync(skillPath(project, 'claude', 'codebase-status')), true);
  });

  it('refresh --all --dry-run flags legacy user-home installs without mutating projects', async () => {
    const root = makeTempProject();
    const home = makeTempProject();
    const project = join(root, 'project-a');
    mkdirSync(project, { recursive: true });
    writeProjectConfig(project, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      base_skills: true
    });
    writeManagedSkillDir(
      join(home, '.codex/skills/afps-status'),
      join(repoRoot, 'base/codex/afps-status')
    );

    const { exitCode, stdout } = await captureConsole(() => refreshAllProjects({
      manifest: readManifest(),
      rootDir: root,
      homeRoot: home,
      dryRun: true
    }));

    assert.equal(exitCode, 1);
    assert.match(stdout, /WARNING: Found 1 legacy user-home skillpacks install\(s\)/);
    assert.match(stdout, /Summary \(refresh --all --dry-run\): 1 project\(s\) scanned\./);
    assert.match(stdout, /Unsafe reasons:/);
    assert.match(stdout, /Found 1 legacy user-home skillpacks install\(s\) under /);
    assert.match(stdout, /Cleanup: npx skillpacks cleanup --global/);
    assert.match(stdout, /Safe to run: no/);
    assert.equal(existsSync(skillPath(project, 'claude', 'codebase-status')), false);
    assert.equal(existsSync(skillPath(project, 'codex', 'afps-status')), false);
  });

  it('uninstall-global --reinstall-base removes owned globals and enables local base skills in discovered projects', async () => {
    const root = makeTempProject();
    const home = makeTempProject();
    const projectA = join(root, 'project-a');
    const projectB = join(root, 'nested/project-b');
    mkdirSync(projectA, { recursive: true });
    mkdirSync(projectB, { recursive: true });
    writeProjectConfig(projectA, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      notes: ['preserve me']
    });
    writeProjectConfig(projectB, {
      project_type: 'business-app',
      enabled_packs: [],
      skill_pack_version: 1,
      skill_updates: { mode: 'warn' }
    });

    const claudeRoot = join(home, '.claude/skills');
    const codexRoot = join(home, '.codex/skills');
    writeManagedSkillDir(join(claudeRoot, 'codebase-status'), join(repoRoot, 'base/claude/codebase-status'));
    writeManagedSkillDir(join(codexRoot, 'legacy-codex'), join(repoRoot, 'global/codex/legacy-codex'));
    const unmanagedDir = join(claudeRoot, 'my-local-skill');
    mkdirSync(unmanagedDir, { recursive: true });
    writeFileSync(join(unmanagedDir, 'SKILL.md'), 'local\n');
    const foreignSource = join(home, 'foreign-source');
    mkdirSync(foreignSource, { recursive: true });
    writeManagedSkillDir(join(codexRoot, 'foreign-managed'), foreignSource);

    const { exitCode, stdout } = await captureConsole(() => uninstallGlobal({
      homeRoot: home,
      manifest: readManifest(),
      reinstallBase: true,
      rootDir: root
    }));

    assert.equal(exitCode, 0);
    assert.match(stdout, /Removed \.claude\/skills\/codebase-status/);
    assert.match(stdout, /Removed \.codex\/skills\/legacy-codex/);
    assert.match(stdout, /Reinstalling project-local base skills in 2 project\(s\)/);
    assert.match(stdout, /=== project-a ===/);
    assert.match(stdout, /=== nested\/project-b ===/);
    assert.equal(existsSync(join(claudeRoot, 'codebase-status')), false);
    assert.equal(existsSync(join(codexRoot, 'legacy-codex')), false);
    assert.equal(existsSync(unmanagedDir), true);
    assert.equal(existsSync(join(codexRoot, 'foreign-managed')), true);
    assert.equal(existsSync(skillPath(projectA, 'claude', 'codebase-status')), true);
    assert.equal(existsSync(skillPath(projectB, 'claude', 'afps-status')), true);
    assert.equal(readProjectConfig(projectA).base_skills, true);
    assert.deepEqual(readProjectConfig(projectA).notes, ['preserve me']);
    assert.equal(readProjectConfig(projectB).base_skills, true);
    assert.deepEqual(readProjectConfig(projectB).skill_updates, { mode: 'warn' });
  });

  it('uninstall-global --reinstall-base --dry-run previews project migration without mutating projects', async () => {
    const root = makeTempProject();
    const home = makeTempProject();
    const projectA = join(root, 'project-a');
    const projectB = join(root, 'nested/project-b');
    mkdirSync(projectA, { recursive: true });
    mkdirSync(projectB, { recursive: true });
    writeProjectConfig(projectA, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      notes: ['preserve me']
    });
    writeProjectConfig(projectB, {
      project_type: 'business-app',
      enabled_packs: [],
      skill_pack_version: 1,
      skill_updates: { mode: 'warn' }
    });
    const projectAText = readFileSync(projectConfigPath(projectA), 'utf8');
    const projectBText = readFileSync(projectConfigPath(projectB), 'utf8');

    const claudeRoot = join(home, '.claude/skills');
    const codexRoot = join(home, '.codex/skills');
    writeManagedSkillDir(join(claudeRoot, 'codebase-status'), join(repoRoot, 'base/claude/codebase-status'));
    writeManagedSkillDir(join(codexRoot, 'legacy-codex'), join(repoRoot, 'global/codex/legacy-codex'));

    const { exitCode, stdout } = await captureConsole(() => uninstallGlobal({
      homeRoot: home,
      manifest: readManifest(),
      reinstallBase: true,
      rootDir: root,
      dryRun: true
    }));

    assert.equal(exitCode, 0);
    assert.match(stdout, /Would remove \.claude\/skills\/codebase-status/);
    assert.match(stdout, /Would remove \.codex\/skills\/legacy-codex/);
    assert.match(stdout, /Dry run\. Would reinstall project-local base skills in 2 project\(s\)/);
    assert.match(stdout, /=== project-a ===/);
    assert.match(stdout, /=== nested\/project-b ===/);
    assert.match(stdout, /would update \.agents\/project\.json \(base skills enabled\)/);
    assert.match(stdout, /install\s+\.claude\/skills\/codebase-status/);
    assert.match(stdout, /Summary \(cleanup --reinstall-base --dry-run\): 2 project\(s\) scanned/);
    assert.match(stdout, /Dry run\. No global skills or project files were changed/);
    assert.equal(existsSync(join(claudeRoot, 'codebase-status')), true);
    assert.equal(existsSync(join(codexRoot, 'legacy-codex')), true);
    assert.equal(readFileSync(projectConfigPath(projectA), 'utf8'), projectAText);
    assert.equal(readFileSync(projectConfigPath(projectB), 'utf8'), projectBText);
    assert.equal(existsSync(skillPath(projectA, 'claude', 'codebase-status')), false);
    assert.equal(existsSync(skillPath(projectB, 'claude', 'afps-status')), false);
    assert.equal(existsSync(lockDir(projectA)), false);
    assert.equal(existsSync(lockDir(projectB)), false);
  });

  it('cleanup --global --reinstall-base --dry-run migrates projects under the user home scope', async () => {
    const root = makeTempProject();
    const home = makeTempProject();
    const cwdProject = join(root, 'cwd-project');
    const homeProject = join(home, 'home-project');
    writeProjectConfig(cwdProject, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1
    });
    writeProjectConfig(homeProject, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1
    });
    const cwdText = readFileSync(projectConfigPath(cwdProject), 'utf8');
    const homeText = readFileSync(projectConfigPath(homeProject), 'utf8');

    const { exitCode, stdout } = await runSkillpacks(root, ['cleanup', '--global', '--reinstall-base', '--dry-run'], { home });

    assert.equal(exitCode, 0);
    assert.match(stdout, /Dry run\. Would reinstall project-local base skills in 1 project\(s\)/);
    assert.match(stdout, /=== home-project ===/);
    assert.doesNotMatch(stdout, /cwd-project/);
    assert.match(stdout, /Summary \(cleanup --global --reinstall-base --dry-run\): 1 project\(s\) scanned/);
    assert.equal(readFileSync(projectConfigPath(cwdProject), 'utf8'), cwdText);
    assert.equal(readFileSync(projectConfigPath(homeProject), 'utf8'), homeText);
    assert.equal(existsSync(skillPath(homeProject, 'claude', 'codebase-status')), false);
  });

  it('uninstall-global --reinstall-base initializes the current directory when no projects are discovered', async () => {
    const root = makeTempProject();
    const home = makeTempProject();
    writeManagedSkillDir(
      join(home, '.claude/skills/codebase-status'),
      join(repoRoot, 'base/claude/codebase-status')
    );

    const { exitCode, stdout } = await captureConsole(() => uninstallGlobal({
      homeRoot: home,
      manifest: readManifest(),
      reinstallBase: true,
      rootDir: root
    }));

    assert.equal(exitCode, 0);
    assert.match(stdout, /No projects with \.agents\/project\.json found/);
    assert.match(stdout, /Initialized project base skills to skillpacks@/);
    assert.equal(readProjectConfig(root).base_skills, true);
    assert.equal(existsSync(skillPath(root, 'claude', 'codebase-status')), true);
  });

  it('uninstall-global --reinstall-base --dry-run previews current-directory init without creating project config', async () => {
    const root = makeTempProject();
    const home = makeTempProject();
    writeManagedSkillDir(
      join(home, '.claude/skills/codebase-status'),
      join(repoRoot, 'base/claude/codebase-status')
    );

    const { exitCode, stdout } = await captureConsole(() => uninstallGlobal({
      homeRoot: home,
      manifest: readManifest(),
      reinstallBase: true,
      rootDir: root,
      dryRun: true
    }));

    assert.equal(exitCode, 0);
    assert.match(stdout, /Would remove \.claude\/skills\/codebase-status/);
    assert.match(stdout, /Would initialize current directory with base skills/);
    assert.match(stdout, /Dry run\. Would initialize project base skills to skillpacks@/);
    assert.equal(existsSync(join(home, '.claude/skills/codebase-status')), true);
    assert.equal(existsSync(projectConfigPath(root)), false);
    assert.equal(existsSync(skillPath(root, 'claude', 'codebase-status')), false);
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
    assertManagedConventionDocsInstalled(dir);
    assert.deepEqual(readProjectConfig(dir).enabled_packs, ['code-quality']);
    assert.equal(existsSync(join(dir, '.agents/.pack.lock')), false);
  });

  it('does not copy nested skill archives into latest managed installs', async () => {
    const dir = makeTempProject();

    await runSkillpacks(dir, ['install', 'business-research']);

    for (const tool of ['claude', 'codex']) {
      const discoveryFiles = installedSkillFiles(dir, tool, 'customer-discovery');
      assert.equal(discoveryFiles.includes('frameworks/five-rings/SKILL.md'), true);
      assert.equal(discoveryFiles.includes('frameworks/pmf-engine/SKILL.md'), true);
      assert.equal(discoveryFiles.includes('frameworks/w3-hypothesis/SKILL.md'), true);
      assert.equal(discoveryFiles.some((file) => file.split('/').includes('archive')), false);
      assert.equal(existsSync(join(skillPath(dir, tool, 'customer-discovery'), 'frameworks/five-rings/archive/v0.0/SKILL.md')), false);
      assert.equal(existsSync(skillPath(dir, tool, 'five-rings')), false);
      assert.equal(existsSync(skillPath(dir, tool, 'pmf-engine')), false);
      assert.equal(existsSync(skillPath(dir, tool, 'w3-hypothesis')), false);

      const positioningFiles = installedSkillFiles(dir, tool, 'positioning');
      assert.equal(positioningFiles.includes('frameworks/category-design/SKILL.md'), true);
      assert.equal(positioningFiles.includes('frameworks/jtbd-positioning/SKILL.md'), true);
      assert.equal(positioningFiles.includes('frameworks/obviously-awesome/SKILL.md'), true);
      assert.equal(positioningFiles.some((file) => file.split('/').includes('archive')), false);
      assert.equal(existsSync(join(skillPath(dir, tool, 'positioning'), 'frameworks/category-design/archive/v0.0/SKILL.md')), false);
      assert.equal(existsSync(skillPath(dir, tool, 'category-design')), false);
    }
  });

  it('ignores archive skill entries if a packaged manifest contains them', async () => {
    const dir = makeTempProject();
    const manifest = readManifest();
    const archivePath = 'packs/business-research/claude/customer-discovery/frameworks/five-rings/archive/v0.0/SKILL.md';
    const activeSkill = manifest.skills.find((skill) => skill.path === 'packs/business-research/claude/customer-discovery/SKILL.md');

    assert.ok(activeSkill, 'business-research customer-discovery fixture should exist');
    assert.equal(existsSync(join(repoRoot, archivePath)), true, 'archive fixture should exist');

    await installResolved({
      manifest: {
        ...manifest,
        skills: [
          ...manifest.skills,
          {
            ...activeSkill,
            id: 'pack-business-research-claude-five-rings-archived',
            name: 'five-rings',
            path: archivePath,
            installable: true
          }
        ]
      },
      projectRoot: dir,
      packs: ['business-research']
    });

    assert.equal(existsSync(skillPath(dir, 'claude', 'customer-discovery')), true);
    assert.equal(existsSync(skillPath(dir, 'claude', 'five-rings')), false);
    assert.equal(existsSync(skillPath(dir, 'codex', 'five-rings')), false);
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

  it('installs an exact base skill without enabling all base skills', async () => {
    const dir = makeTempProject();

    const { stdout } = await runSkillpacks(dir, ['install', 'idea-scope-brief']);

    assert.match(stdout, /Installed \.claude\/skills\/idea-scope-brief/);
    assert.match(stdout, /Installed \.codex\/skills\/idea-scope-brief/);
    assert.match(stdout, /Updated \.agents\/project\.json \(skill: idea-scope-brief from base\)/);
    assert.equal(existsSync(skillPath(dir, 'claude', 'idea-scope-brief')), true);
    assert.equal(existsSync(skillPath(dir, 'codex', 'idea-scope-brief')), true);
    assert.match(marker(dir, 'claude', 'idea-scope-brief'), /source=.*packs\/base\/claude\/idea-scope-brief/);
    assert.match(marker(dir, 'codex', 'idea-scope-brief'), /source=.*packs\/base\/codex\/idea-scope-brief/);
    assertManagedConventionDocsInstalled(dir);
    assert.deepEqual(readProjectConfig(dir).enabled_packs, []);
    assert.deepEqual(readProjectConfig(dir).enabled_skills, { 'idea-scope-brief': 'base' });
    assert.equal(Object.hasOwn(readProjectConfig(dir), 'base_skills'), false);
  });

  it('installs declared convention bundles into local skill roots', async () => {
    const dir = makeTempProject();

    await runSkillpacks(dir, ['install', 'idea-scope-brief']);
    await runSkillpacks(dir, ['install', 'user-flow-map']);

    for (const tool of ['claude', 'codex']) {
      assertDeclaredBundlesInstalled(dir, tool, 'idea-scope-brief');
      assertDeclaredBundlesInstalled(dir, tool, 'user-flow-map');
    }
  });

  it('refresh restores deleted managed convention docs', async () => {
    const dir = makeTempProject();
    await runSkillpacks(dir, ['install', 'quality-sweep']);

    const deletedDoc = managedConventionDocPath(dir, 'quality-gate-contract.md');
    rmSync(deletedDoc);
    assert.equal(existsSync(deletedDoc), false);

    const { stdout } = await runSkillpacks(dir, ['refresh']);

    assert.match(stdout, /Refreshed managed convention docs/);
    assertManagedConventionDocsInstalled(dir);
  });

  it('scripts/pack.sh install and refresh manage convention docs in source checkouts', () => {
    const dir = makeTempProject();

    const installOutput = runPackSh(dir, ['install', 'code-quality']);
    assert.match(installOutput, /Updated \.agents\/project\.json/);
    assertManagedConventionDocsInstalled(dir);

    const deletedDoc = managedConventionDocPath(dir, 'skillpacks-install-routing-contract.md');
    rmSync(deletedDoc);
    assert.equal(existsSync(deletedDoc), false);

    runPackSh(dir, ['refresh']);
    assertManagedConventionDocsInstalled(dir);
  });

  it('refreshes individually enabled base skills', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      enabled_skills: {
        'idea-scope-brief': 'base'
      }
    });

    const { stdout } = await runSkillpacks(dir, ['refresh']);

    assert.match(stdout, /Installed \.claude\/skills\/idea-scope-brief/);
    assert.match(stdout, /Installed \.codex\/skills\/idea-scope-brief/);
    assert.doesNotMatch(stdout, /Updated \.agents\/project\.json \(skill: idea-scope-brief from base\)/);
    assert.equal(existsSync(skillPath(dir, 'codex', 'idea-scope-brief')), true);
    assert.deepEqual(readProjectConfig(dir).enabled_skills, { 'idea-scope-brief': 'base' });
  });

  it('refreshes declared convention bundles into local skill roots', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      enabled_skills: {
        'idea-scope-brief': 'base',
        'user-flow-map': 'product-design'
      }
    });

    await runSkillpacks(dir, ['refresh']);

    for (const tool of ['claude', 'codex']) {
      assertDeclaredBundlesInstalled(dir, tool, 'idea-scope-brief');
      assertDeclaredBundlesInstalled(dir, tool, 'user-flow-map');
    }
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

    assert.match(stdout, /Installed \.claude\/skills\/quality-sweep @ v0\.0 \(pinned\)/);
    assert.doesNotMatch(stdout, / -> /);
    assert.match(stdout, /Updated \.agents\/project\.json \(skill: quality-sweep from pack: code-quality\)/);
    assert.equal(lstatSync(skillPath(dir, 'claude', 'quality-sweep')).isSymbolicLink(), true);
    assert.match(readlinkSync(skillPath(dir, 'claude', 'quality-sweep')), /packs\/code-quality\/claude\/quality-sweep\/archive\/v0\.0$/);
    assert.deepEqual(readProjectConfig(dir).enabled_skills, { 'quality-sweep': 'code-quality' });
    assert.deepEqual(readProjectConfig(dir).pinned_versions, { 'quality-sweep': 'v0.0' });
  });

  it('reports stale managed installs as version updates', async () => {
    const dir = makeTempProject();
    writeManagedInstall(
      dir,
      'claude',
      'quality-sweep',
      join(repoRoot, 'packs/code-quality/claude/quality-sweep'),
      { sourceVersion: 'v0.0' }
    );
    writeManagedInstall(
      dir,
      'codex',
      'quality-sweep',
      join(repoRoot, 'packs/code-quality/codex/quality-sweep'),
      { sourceVersion: 'v0.0' }
    );

    const { stdout } = await runSkillpacks(dir, ['install', 'quality-sweep']);

    assert.match(stdout, /Updated \.claude\/skills\/quality-sweep v0\.0 -> v0\.1/);
    assert.match(stdout, /Updated \.codex\/skills\/quality-sweep v0\.0 -> v0\.1/);
    assert.match(marker(dir, 'claude', 'quality-sweep'), /^source_version=v0\.1$/m);
    assert.deepEqual(readProjectConfig(dir).enabled_skills, { 'quality-sweep': 'code-quality' });
  });

  it('reports pinned installs and pinned updates with explicit versions', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      pinned_versions: {
        'quality-sweep': 'v0.0'
      }
    });

    const fresh = await runSkillpacks(dir, ['install', 'quality-sweep']);
    assert.match(fresh.stdout, /Installed \.claude\/skills\/quality-sweep @ v0\.0 \(pinned\)/);

    const updatedDir = makeTempProject();
    await runSkillpacks(updatedDir, ['install', 'quality-sweep']);
    const config = readProjectConfig(updatedDir);
    config.pinned_versions = { 'quality-sweep': 'v0.0' };
    writeProjectConfig(updatedDir, config);

    const updated = await runSkillpacks(updatedDir, ['install', 'quality-sweep']);
    assert.match(updated.stdout, /Updated \.claude\/skills\/quality-sweep v0\.1 -> v0\.0 \(pinned\)/);
    assert.match(updated.stdout, /Updated \.codex\/skills\/quality-sweep v0\.1 -> v0\.0 \(pinned\)/);
  });

  it('keeps already-current managed installs quiet on reinstall', async () => {
    const dir = makeTempProject();
    await runSkillpacks(dir, ['install', 'quality-sweep']);
    const before = installStateSnapshot(dir, 'quality-sweep');
    await waitForMtimeTick();

    const { stdout } = await runSkillpacks(dir, ['install', 'quality-sweep']);

    assert.equal(stdout, 'Skill already installed!\n');
    assert.doesNotMatch(stdout, /Installed \.claude\/skills\/quality-sweep/);
    assert.doesNotMatch(stdout, /Updated \.claude\/skills\/quality-sweep/);
    assert.doesNotMatch(stdout, /Installed \.codex\/skills\/quality-sweep/);
    assert.doesNotMatch(stdout, /Updated \.codex\/skills\/quality-sweep/);
    assert.doesNotMatch(stdout, /Updated \.agents\/project\.json \(skill: quality-sweep from pack: code-quality\)/);
    assert.doesNotMatch(stdout, /Skill installs changed/);
    assert.deepEqual(installStateSnapshot(dir, 'quality-sweep'), before);
  });

  it('keeps no-op refresh quiet except for the refresh summary', async () => {
    const dir = makeTempProject();
    await runSkillpacks(dir, ['install', 'quality-sweep']);

    const { stdout, exitCode } = await runSkillpacksRaw(dir, ['refresh']);

    assert.equal(exitCode, 0);
    assert.match(stdout, /Refreshed project skills to skillpacks@/);
    assert.doesNotMatch(stdout, /Skill installs changed/);
    assert.doesNotMatch(stdout, /Updated \.agents\/project\.json/);
    assert.doesNotMatch(stdout, /Installed \.claude\/skills\/quality-sweep/);
    assert.doesNotMatch(stdout, /Updated \.claude\/skills\/quality-sweep/);
  });

  it('refresh rewrites source-path-only marker drift without reload guidance', async () => {
    const dir = makeTempProject();
    await runSkillpacks(dir, ['install', 'quality-sweep']);
    const expected = {};

    for (const tool of ['claude', 'codex']) {
      expected[tool] = {
        source: markerField(dir, tool, 'quality-sweep', 'source'),
        sourceVersion: markerField(dir, tool, 'quality-sweep', 'source_version'),
        sourceSha: markerField(dir, tool, 'quality-sweep', 'source_sha')
      };
      rewriteMarkerSource(dir, tool, 'quality-sweep', join(dir, 'old-npx-cache', tool, 'quality-sweep'));
      writeFileSync(join(skillPath(dir, tool, 'quality-sweep'), 'LOCAL_SENTINEL.txt'), 'keep\n');
    }

    const { stdout, exitCode } = await runSkillpacksRaw(dir, ['refresh']);

    assert.equal(exitCode, 0);
    assert.match(stdout, /Refreshed project skills to skillpacks@/);
    assert.doesNotMatch(stdout, /Skill installs changed/);
    assert.doesNotMatch(stdout, /Installed \.claude\/skills\/quality-sweep/);
    assert.doesNotMatch(stdout, /Updated \.claude\/skills\/quality-sweep/);
    assert.doesNotMatch(stdout, /Installed \.codex\/skills\/quality-sweep/);
    assert.doesNotMatch(stdout, /Updated \.codex\/skills\/quality-sweep/);

    for (const tool of ['claude', 'codex']) {
      assert.equal(markerField(dir, tool, 'quality-sweep', 'source'), expected[tool].source);
      assert.equal(markerField(dir, tool, 'quality-sweep', 'managed_by'), 'agentic-skills');
      assert.equal(markerField(dir, tool, 'quality-sweep', 'source_version'), expected[tool].sourceVersion);
      assert.equal(markerField(dir, tool, 'quality-sweep', 'source_sha'), expected[tool].sourceSha);
      assert.equal(existsSync(join(skillPath(dir, tool, 'quality-sweep'), 'LOCAL_SENTINEL.txt')), true);
    }
  });

  it('refresh replaces current and legacy dangling managed links and is idempotent', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      enabled_skills: {
        'quality-sweep': 'code-quality'
      }
    });
    writeDanglingSkillLink(
      dir,
      'claude',
      'quality-sweep',
      join(repoRoot, 'packs/moved/claude/quality-sweep')
    );
    writeDanglingSkillLink(
      dir,
      'codex',
      'quality-sweep',
      '/home/alice/src/agentic-skills/packs/code-quality/codex/quality-sweep'
    );

    const first = await runSkillpacks(dir, ['refresh']);

    assert.match(first.stdout, /Installed \.claude\/skills\/quality-sweep @ v0\.1/);
    assert.match(first.stdout, /Installed \.codex\/skills\/quality-sweep @ v0\.1/);
    for (const tool of ['claude', 'codex']) {
      assert.equal(lstatSync(skillPath(dir, tool, 'quality-sweep')).isSymbolicLink(), false);
      assert.match(marker(dir, tool, 'quality-sweep'), /^managed_by=agentic-skills$/m);
      assert.equal(existsSync(join(skillPath(dir, tool, 'quality-sweep'), 'SKILL.md')), true);
    }

    const before = installStateSnapshot(dir, 'quality-sweep');
    await waitForMtimeTick();
    const second = await runSkillpacks(dir, ['refresh']);

    assert.doesNotMatch(second.stdout, /Installed \.claude\/skills\/quality-sweep/);
    assert.doesNotMatch(second.stdout, /Updated \.claude\/skills\/quality-sweep/);
    assert.deepEqual(installStateSnapshot(dir, 'quality-sweep'), before);
  });

  it('refresh preserves unmanaged dangling links and reports them as skipped', async () => {
    const parent = makeTempProject();
    const dir = join(parent, 'project');
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      enabled_skills: {
        'quality-sweep': 'code-quality'
      }
    });
    const source = '/home/alice/custom-skills/quality-sweep';
    const target = writeDanglingSkillLink(dir, 'claude', 'quality-sweep', source);

    const dryRun = await runSkillpacks(parent, ['refresh', '--all', '--dry-run'], { home: makeTempProject() });

    assert.match(dryRun.stdout, /skip\s+\.claude\/skills\/quality-sweep \(not repo-managed\)/);
    assert.match(dryRun.stdout, /1 skipped unmanaged/);
    assert.equal(lstatSync(target).isSymbolicLink(), true);
    assert.equal(readlinkSync(target), source);

    const refreshed = await runSkillpacks(dir, ['refresh']);

    assert.match(refreshed.stderr, /exists and is not repo-managed, skipping/);
    assert.equal(lstatSync(target).isSymbolicLink(), true);
    assert.equal(readlinkSync(target), source);
    assert.equal(lstatSync(skillPath(dir, 'codex', 'quality-sweep')).isDirectory(), true);
  });

  it('refresh migrates dangling managed pinned links and keeps valid pins unchanged', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      enabled_skills: {
        'quality-sweep': 'code-quality'
      },
      pinned_versions: {
        'quality-sweep': 'v0.0'
      }
    });
    writeDanglingSkillLink(
      dir,
      'claude',
      'quality-sweep',
      '/home/alice/src/agentic-skills/packs/code-quality/claude/quality-sweep/archive/v0.0'
    );

    await runSkillpacks(dir, ['refresh']);

    const expectedSources = {};
    const mtimes = {};
    for (const tool of ['claude', 'codex']) {
      const target = skillPath(dir, tool, 'quality-sweep');
      assert.equal(lstatSync(target).isSymbolicLink(), true);
      assert.match(readlinkSync(target), new RegExp(`packs/code-quality/${tool}/quality-sweep/archive/v0\\.0$`));
      expectedSources[tool] = readlinkSync(target);
      mtimes[tool] = lstatSync(target, { bigint: true }).mtimeNs.toString();
    }

    await waitForMtimeTick();
    const second = await runSkillpacks(dir, ['refresh']);

    assert.doesNotMatch(second.stdout, /Pinned|Installed|Updated \.claude\/skills\/quality-sweep/);
    for (const tool of ['claude', 'codex']) {
      const target = skillPath(dir, tool, 'quality-sweep');
      assert.equal(readlinkSync(target), expectedSources[tool]);
      assert.equal(lstatSync(target, { bigint: true }).mtimeNs.toString(), mtimes[tool]);
    }
  });

  it('doctor, prune, and remove recognize dangling managed links', async () => {
    const doctorDir = makeTempProject();
    writeProjectConfig(doctorDir, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      enabled_skills: {
        'quality-sweep': 'code-quality'
      }
    });
    writeDanglingSkillLink(
      doctorDir,
      'claude',
      'quality-sweep',
      '/home/alice/src/agentic-skills/packs/code-quality/claude/quality-sweep'
    );

    const doctor = await runSkillpacksRaw(doctorDir, ['doctor']);

    assert.equal(doctor.exitCode, 1);
    assert.match(doctor.stdout, /missing\s+\.claude\/skills\/quality-sweep — canonical source no longer exists/);
    assert.doesNotMatch(doctor.stdout, /pinned\s+\.claude\/skills\/quality-sweep/);

    const removed = await runSkillpacks(doctorDir, ['remove', 'quality-sweep']);

    assert.match(removed.stdout, /Removed \.claude\/skills\/quality-sweep/);
    assert.throws(() => lstatSync(skillPath(doctorDir, 'claude', 'quality-sweep')), { code: 'ENOENT' });

    const pruneDir = makeTempProject();
    writeProjectConfig(pruneDir, {
      project_type: 'devtool',
      enabled_packs: ['code-quality'],
      skill_pack_version: 1
    });
    const orphan = writeDanglingSkillLink(
      pruneDir,
      'codex',
      'orphan-skill',
      '/home/alice/src/skillpacks/packs/retired/codex/orphan-skill'
    );

    const preview = await runSkillpacks(pruneDir, ['prune', '--dry-run']);
    assert.match(preview.stdout, /would remove\s+\.codex\/skills\/orphan-skill \(source no longer exists\)/);
    assert.equal(lstatSync(orphan).isSymbolicLink(), true);

    const pruned = await runSkillpacks(pruneDir, ['prune']);
    assert.match(pruned.stdout, /removed\s+\.codex\/skills\/orphan-skill \(source no longer exists\)/);
    assert.throws(() => lstatSync(orphan), { code: 'ENOENT' });
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
    assert.match(stdout, /Updated \.claude\/skills\/quality-sweep v0\.0 -> v0\.1/);
    assert.match(stdout, /Installed \.codex\/skills\/devtool-adoption/);
    assert.equal(existsSync(skillPath(dir, 'claude', 'extract-shared-types')), true);
    assert.equal(existsSync(skillPath(dir, 'codex', 'devtool-adoption')), true);
    assert.notEqual(
      readFileSync(join(skillPath(dir, 'claude', 'quality-sweep'), 'SKILL.md'), 'utf8'),
      'stale\n'
    );
    assert.deepEqual(readProjectConfig(dir).enabled_packs, ['code-quality']);
    assert.deepEqual(readProjectConfig(dir).enabled_skills, { 'devtool-adoption': 'devtool' });
  });

  it('refresh prunes old repo-managed top-level framework installs but keeps unmanaged roots', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'business-app',
      enabled_packs: ['business-research'],
      skill_pack_version: 1
    });
    writeManagedInstall(
      dir,
      'codex',
      'pmf-engine',
      join(repoRoot, 'packs/business-research/codex/customer-discovery/frameworks/pmf-engine')
    );
    const unmanaged = skillPath(dir, 'claude', 'pmf-engine');
    mkdirSync(unmanaged, { recursive: true });
    writeFileSync(join(unmanaged, 'SKILL.md'), 'local unmanaged skill\n');

    const { stdout } = await runSkillpacks(dir, ['refresh']);

    assert.match(stdout, /removed  \.codex\/skills\/pmf-engine \(pack not enabled\)/);
    assert.equal(existsSync(skillPath(dir, 'codex', 'pmf-engine')), false);
    assert.equal(existsSync(unmanaged), true);
    assert.equal(existsSync(skillPath(dir, 'codex', 'customer-discovery')), true);
    assert.equal(
      existsSync(join(skillPath(dir, 'codex', 'customer-discovery'), 'frameworks/pmf-engine/SKILL.md')),
      true
    );
    assert.match(stdout, /Skill installs changed/);
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
    assert.doesNotMatch(stdout, /Updated \.agents\/project\.json \(skill: customer-discovery from pack: business-research\)/);
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
      join(repoRoot, 'packs/base/claude/codebase-status')
    );

    const { stdout } = await runSkillpacks(dir, ['refresh']);

    const currentVersion = readFileSync(join(repoRoot, 'packs/base/claude/codebase-status/SKILL.md'), 'utf8')
      .match(/^version:\s*(\S+)/m)[1];
    assert.match(stdout, new RegExp(`Updated \\.claude\\/skills\\/codebase-status v0\\.0 -> ${currentVersion}`));
    assert.match(stdout, /Refreshed project skills to skillpacks@/);
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
    assert.match(error.message, /npx skillpacks remove not-a-real-pack/);
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
    rmSync(managedConventionDocPath(dir, 'quality-gate-contract.md'));
    writeFileSync(managedConventionDocPath(dir, 'skillpacks-install-routing-contract.md'), 'stale\n');

    const { exitCode, stdout } = await runSkillpacksRaw(dir, ['doctor']);

    assert.equal(exitCode, 1);
    assert.match(stdout, /Project skill update mode: warn \(default\)/);
    assert.match(stdout, /ok       \.claude\/skills\/quality-sweep/);
    assert.match(stdout, /pinned   \.codex\/skills\/pinned-skill \(frozen v0\.0\)/);
    assert.match(stdout, /unknown  \.codex\/skills\/unknown-skill — run `[^`]*refresh` to enable drift tracking/);
    assert.match(stdout, /missing  \.claude\/skills\/missing-skill — canonical source no longer exists/);
    assert.match(stdout, /STALE    \.claude\/skills\/stale-skill \(v0\.0 -> v9\.0\)/);
    assert.match(stdout, /Convention doc drift \(\.agents\/skillpacks\/docs\):/);
    assert.match(stdout, /missing  \.agents\/skillpacks\/docs\/quality-gate-contract\.md/);
    assert.match(stdout, /STALE    \.agents\/skillpacks\/docs\/skillpacks-install-routing-contract\.md/);
    assert.match(stdout, /Fix: [^\n]*refresh/);
  });

  it('does not require convention docs after all managed installs are removed', async () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      project_type: 'game',
      enabled_packs: [],
      skill_pack_version: 1
    });

    const { exitCode, stdout } = await runSkillpacksRaw(dir, ['doctor']);

    assert.equal(exitCode, 0);
    assert.match(stdout, /\(no managed skill installs found\)/);
    assert.doesNotMatch(stdout, /Convention doc drift/);
    assert.doesNotMatch(stdout, /missing  \.agents\/skillpacks\/docs/);
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
    assert.match(agents, /npx skillpacks install <pack-or-skill>/);
    assert.match(claude, /npx skillpacks install <pack-or-skill>/);
    assertProvisionedShippingContract(agents, 'AGENTS.md');
    assertProvisionedShippingContract(claude, 'CLAUDE.md');
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

describe('Node multi-repo --all commands', () => {
  function makeParent() {
    const dir = mkdtempSync(join(tmpdir(), 'skillpacks-all-'));
    tmpDirs.push(dir);
    return dir;
  }

  it('refresh --all refreshes each project, skips failures, and ignores node_modules', async () => {
    const parent = makeParent();
    const a = join(parent, 'a');
    const b = join(parent, 'b');
    writeProjectConfig(a, {
      project_type: 'devtool',
      enabled_packs: ['code-quality'],
      skill_pack_version: 1
    });
    writeProjectConfig(b, {}); // empty config -> refreshProject throws, but the run continues
    writeProjectConfig(join(parent, 'node_modules', 'x'), {
      enabled_packs: ['code-quality'],
      skill_pack_version: 1
    });

    const { exitCode, stdout } = await runSkillpacksRaw(parent, ['refresh', '--all'], { home: makeParent() });

    assert.equal(existsSync(skillPath(a, 'claude', 'quality-sweep')), true);
    assert.match(stdout, /=== a ===/);
    assert.match(stdout, /=== b ===/);
    assert.doesNotMatch(stdout, /node_modules/);
    assert.match(stdout, /failed: No enabled packs or skills/);
    assert.match(stdout, /Summary \(refresh --all\): 1 ok, 0 flagged, 1 failed across 2 project\(s\)\./);
    assert.match(stdout, /Failures:\n  b: No enabled packs or skills in \.agents\/project\.json/);
    assert.equal(exitCode, 1);
  });

  it('refresh --all --dry-run reports drift without mutating', async () => {
    const parent = makeParent();
    const a = join(parent, 'a');
    const b = join(parent, 'b');
    const c = join(parent, 'c');
    writeProjectConfig(a, {
      project_type: 'devtool',
      enabled_packs: ['code-quality'],
      skill_pack_version: 1
    });
    writeManagedInstall(
      a,
      'claude',
      'quality-sweep',
      join(repoRoot, 'packs/code-quality/claude/quality-sweep')
    );
    writeManagedInstall(
      a,
      'codex',
      'orphan-skill',
      join(repoRoot, 'packs/code-quality/codex/quality-sweep')
    );
    writeProjectConfig(b, {
      project_type: 'devtool',
      enabled_packs: ['devtool'],
      skill_pack_version: 1
    });
    mkdirSync(c, { recursive: true });
    await runSkillpacks(c, ['install', 'quality-sweep']);
    const cOldClaudeSource = join(parent, 'old-npx-cache/claude/quality-sweep');
    const cOldCodexSource = join(parent, 'old-npx-cache/codex/quality-sweep');
    rewriteMarkerSource(c, 'claude', 'quality-sweep', cOldClaudeSource);
    rewriteMarkerSource(c, 'codex', 'quality-sweep', cOldCodexSource);

    const { exitCode, stdout } = await runSkillpacksRaw(parent, ['refresh', '--all', '--dry-run'], { home: makeParent() });

    assert.match(stdout, /=== a ===/);
    assert.match(stdout, /Proposed: 3 install, 1 update, 1 remove\./);
    assert.match(stdout, /install  \.claude\/skills\/extract-shared-types @ v0\.1/);
    assert.match(stdout, /update   \.claude\/skills\/quality-sweep \(v0\.0 -> v0\.1\)/);
    assert.match(stdout, /remove   \.codex\/skills\/orphan-skill \(pack not enabled\)/);
    assert.match(stdout, /=== b ===/);
    assert.match(stdout, /install  \.claude\/skills\/devtool-adoption/);
    assert.match(stdout, /=== c ===/);
    assert.match(stdout, /No refresh changes proposed\./);
    assert.match(stdout, /Summary \(refresh --all --dry-run\): 3 project\(s\) scanned\./);
    assert.match(stdout, /a: 3 install, 1 update, 1 remove/);
    assert.match(stdout, /b: [0-9]+ install, 0 update, 0 remove/);
    assert.match(stdout, /c: 0 install, 0 update, 0 remove/);
    assert.match(stdout, /Affected skills:/);
    assert.match(stdout, /a: update quality-sweep \(\.claude\/skills\/quality-sweep\)/);
    assert.doesNotMatch(stdout, /c: update quality-sweep/);
    assert.doesNotMatch(stdout, /Unsafe reasons:/);
    assert.match(stdout, /Safe to run: yes/);
    assert.match(stdout, /Recommended command: skillpacks refresh --all/);
    assert.equal(
      readFileSync(join(skillPath(a, 'claude', 'quality-sweep'), 'SKILL.md'), 'utf8'),
      'stale\n'
    );
    assert.equal(existsSync(skillPath(a, 'codex', 'orphan-skill')), true);
    assert.equal(existsSync(skillPath(b, 'claude', 'devtool-adoption')), false);
    assert.equal(markerField(c, 'claude', 'quality-sweep', 'source'), cOldClaudeSource);
    assert.equal(markerField(c, 'codex', 'quality-sweep', 'source'), cOldCodexSource);
    assert.equal(exitCode, 0);
  });

  it('refresh --all plans dangling managed links as updates and completes them as ok', async () => {
    const parent = makeParent();
    const project = join(parent, 'project');
    writeProjectConfig(project, {
      project_type: 'devtool',
      enabled_packs: [],
      skill_pack_version: 1,
      enabled_skills: {
        'quality-sweep': 'code-quality'
      }
    });
    const claudeTarget = writeDanglingSkillLink(
      project,
      'claude',
      'quality-sweep',
      '/home/alice/src/agentic-skills/packs/code-quality/claude/quality-sweep'
    );
    const codexTarget = writeDanglingSkillLink(
      project,
      'codex',
      'quality-sweep',
      '/home/alice/src/agentic-skills/packs/code-quality/codex/quality-sweep'
    );

    const dryRun = await runSkillpacksRaw(parent, ['refresh', '--all', '--dry-run'], { home: makeParent() });

    assert.equal(dryRun.exitCode, 0);
    assert.match(dryRun.stdout, /Proposed: 0 install, 2 update, 0 remove\./);
    assert.match(dryRun.stdout, /update\s+\.claude\/skills\/quality-sweep \(\? -> v0\.1\)/);
    assert.match(dryRun.stdout, /update\s+\.codex\/skills\/quality-sweep \(\? -> v0\.1\)/);
    assert.match(dryRun.stdout, /Safe to run: yes/);
    assert.equal(lstatSync(claudeTarget).isSymbolicLink(), true);
    assert.equal(lstatSync(codexTarget).isSymbolicLink(), true);

    const refreshed = await runSkillpacksRaw(parent, ['refresh', '--all'], { home: makeParent() });

    assert.equal(refreshed.exitCode, 0);
    assert.match(refreshed.stdout, /Summary \(refresh --all\): 1 ok, 0 flagged, 0 failed across 1 project\(s\)\./);
    assert.equal(lstatSync(claudeTarget).isDirectory(), true);
    assert.equal(lstatSync(codexTarget).isDirectory(), true);
  });

  it('refresh --all --dry-run reports failed project config as unsafe', async () => {
    const parent = makeParent();
    const a = join(parent, 'a');
    writeProjectConfig(a, {
      project_type: 'devtool',
      enabled_packs: ['devtool-kanban'],
      skill_pack_version: 1
    });

    const { exitCode, stdout } = await runSkillpacksRaw(parent, ['refresh', '--all', '--dry-run'], { home: makeParent() });

    assert.match(stdout, /=== a ===/);
    assert.match(stdout, /failed: ERROR: PoketoWork kanban pack 'devtool-kanban' is hibernated/);
    assert.match(stdout, /Summary \(refresh --all --dry-run\): 1 project\(s\) scanned\./);
    assert.match(stdout, /Failures:/);
    assert.match(stdout, /Unsafe reasons:/);
    assert.match(stdout, /1 project\(s\) failed dry-run planning; see Failures above\./);
    assert.match(stdout, /Safe to run: no/);
    assert.doesNotMatch(stdout, /Recommended command: skillpacks refresh --all/);
    assert.equal(exitCode, 1);
  });

  it('refresh --dry-run without --all is rejected', async () => {
    const parent = makeParent();
    const error = await runSkillpacksExpectError(parent, ['refresh', '--dry-run']);
    assert.match(error.message, /--dry-run is only supported with --all/);
  });

  it('status --all reports when no projects are found', async () => {
    const parent = makeParent();
    const { exitCode, stdout } = await runSkillpacksRaw(parent, ['status', '--all']);
    assert.equal(exitCode, 0);
    assert.match(stdout, /No projects with \.agents\/project\.json found under/);
  });

  it('doctor --all reports drift per repo', async () => {
    const parent = makeParent();
    const a = join(parent, 'a');
    writeProjectConfig(a, {
      project_type: 'devtool',
      enabled_packs: ['code-quality'],
      skill_pack_version: 1
    });
    writeManagedInstall(
      a,
      'claude',
      'quality-sweep',
      join(repoRoot, 'packs/code-quality/claude/quality-sweep')
    );

    const { exitCode, stdout } = await runSkillpacksRaw(parent, ['doctor', '--all']);

    assert.match(stdout, /=== a ===/);
    assert.match(stdout, /STALE\s+\.claude\/skills\/quality-sweep/);
    assert.equal(exitCode, 1);
  });
});
