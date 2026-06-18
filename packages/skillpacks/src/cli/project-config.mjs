import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { dirname, join } from 'node:path';

const PROJECT_CONFIG_VERSION = 1;
const LOCK_MAX_ATTEMPTS = Number.parseInt(process.env.PACK_LOCK_MAX_ATTEMPTS || '300', 10);
const LOCK_SLEEP_SECONDS = Number.parseFloat(process.env.PACK_LOCK_SLEEP_SECONDS || '0.1');
const VALID_AGENT_MODES = new Set(['claude-only', 'codex-only', 'hybrid']);
const VALID_UPDATE_MODES = new Set(['warn', 'auto', 'unset']);

export function projectFilePath(projectRoot = process.cwd()) {
  return join(projectRoot, '.agents', 'project.json');
}

function projectLockDir(projectRoot) {
  return join(projectRoot, '.agents', '.pack.lock');
}

const DISCOVERY_EXCLUDE_NAMES = new Set(['node_modules', 'archive']);

export function discoverProjectRoots(rootDir = process.cwd(), { maxDepth = Infinity } = {}) {
  const found = [];

  function visit(dir, depth) {
    if (depth > maxDepth || !existsSync(dir)) {
      return;
    }

    if (existsSync(projectFilePath(dir))) {
      found.push(dir);
      // A *discovered* child project absorbs its own nested dirs; stop there
      // (this also skips its node_modules/.claude/etc.). But the scan root is a
      // scan origin, not a boundary — keep descending so `--all` reaches
      // projects nested under a root that is itself a project.
      if (depth > 0) {
        return;
      }
    }

    if (depth >= maxDepth) {
      return;
    }

    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      const name = entry.name;
      if (DISCOVERY_EXCLUDE_NAMES.has(name) || name.startsWith('.')) {
        continue;
      }
      visit(join(dir, name), depth + 1);
    }
  }

  visit(rootDir, 0);
  return found.sort();
}

export function readProjectConfig(projectRoot = process.cwd()) {
  const filePath = projectFilePath(projectRoot);
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`failed to parse ${filePath}: ${detail}`);
  }
}

function readProjectConfigText(projectRoot) {
  const filePath = projectFilePath(projectRoot);
  if (!existsSync(filePath)) {
    return null;
  }
  return readFileSync(filePath, 'utf8');
}

export function writeProjectConfig(projectRoot, config) {
  const filePath = projectFilePath(projectRoot);
  mkdirSync(dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.${process.pid}.tmp`;
  writeFileSync(tmpPath, `${JSON.stringify(config, null, 2)}\n`);
  renameSync(tmpPath, filePath);
}

function pidIsRunning(pidText) {
  if (!/^[0-9]+$/.test(pidText || '')) {
    return false;
  }

  try {
    process.kill(Number(pidText), 0);
    return true;
  } catch {
    return false;
  }
}

function readLockField(lockDir, name) {
  const filePath = join(lockDir, name);
  if (!existsSync(filePath)) {
    return '';
  }
  return readFileSync(filePath, 'utf8').trim();
}

function clearStaleProjectLock(lockDir) {
  const pid = readLockField(lockDir, 'pid');
  if (!pid || pidIsRunning(pid)) {
    return false;
  }

  console.error(`Removing stale project pack lock at ${lockDir} (pid ${pid} is not running)`);
  rmSync(lockDir, { recursive: true, force: true });
  return true;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function acquireProjectLock(projectRoot, command) {
  const lockDir = projectLockDir(projectRoot);
  mkdirSync(dirname(lockDir), { recursive: true });

  const maxAttempts = Number.isFinite(LOCK_MAX_ATTEMPTS) && LOCK_MAX_ATTEMPTS > 0
    ? LOCK_MAX_ATTEMPTS
    : 300;
  const sleepMs = Number.isFinite(LOCK_SLEEP_SECONDS) && LOCK_SLEEP_SECONDS >= 0
    ? LOCK_SLEEP_SECONDS * 1000
    : 100;

  for (let attempt = 0; attempt <= maxAttempts; attempt += 1) {
    try {
      mkdirSync(lockDir);
      writeFileSync(join(lockDir, 'pid'), `${process.pid}\n`);
      writeFileSync(join(lockDir, 'started_at'), `${new Date().toISOString()}\n`);
      writeFileSync(join(lockDir, 'command'), `skillpacks ${command}\n`);
      return () => {
        rmSync(lockDir, { recursive: true, force: true });
      };
    } catch (error) {
      if (error?.code !== 'EEXIST') {
        throw error;
      }

      clearStaleProjectLock(lockDir);
      if (attempt === maxAttempts) {
        const pid = readLockField(lockDir, 'pid') || 'unknown';
        const startedAt = readLockField(lockDir, 'started_at') || 'unknown';
        const lockCommand = readLockField(lockDir, 'command') || 'unknown';
        throw new Error(
          `Timed out waiting for project pack lock at ${lockDir} (pid: ${pid}; started_at: ${startedAt}; command: ${lockCommand})`
        );
      }
      await sleep(sleepMs);
    }
  }

  throw new Error(`Timed out waiting for project pack lock at ${lockDir}`);
}

export async function withProjectLock(projectRoot, command, fn) {
  const release = await acquireProjectLock(projectRoot, command);
  try {
    return await fn();
  } finally {
    release();
  }
}

function hasFileWithinDepth(root, targetNames, maxDepth) {
  function visit(dir, depth) {
    if (depth > maxDepth || !existsSync(dir)) {
      return false;
    }

    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return false;
    }

    for (const entry of entries) {
      if (targetNames.some((name) => entry.name.toLowerCase().includes(name))) {
        return true;
      }
      if (entry.isDirectory() && depth < maxDepth) {
        if (visit(join(dir, entry.name), depth + 1)) {
          return true;
        }
      }
    }

    return false;
  }

  return visit(root, 0);
}

export function inferProjectType(projectRoot) {
  if (
    projectRoot.includes('/games/') ||
    hasFileWithinDepth(projectRoot, ['godot', 'unity', 'unreal'], 2)
  ) {
    return 'game';
  }

  if (hasFileWithinDepth(projectRoot, ['package.json', 'pyproject.toml', 'cargo.toml'], 2)) {
    return 'devtool';
  }

  return 'business-app';
}

function normalizedProjectConfig(projectRoot) {
  const config = readProjectConfig(projectRoot) || {};
  if (!config.project_type) {
    config.project_type = inferProjectType(projectRoot);
  }
  if (!Array.isArray(config.enabled_packs)) {
    config.enabled_packs = [];
  }
  config.skill_pack_version = PROJECT_CONFIG_VERSION;
  return config;
}

function enabledSkillsEntries(config) {
  if (!config?.enabled_skills || typeof config.enabled_skills !== 'object') {
    return [];
  }
  return Object.entries(config.enabled_skills);
}

export function printEnabledPacks(projectRoot = process.cwd()) {
  const config = readProjectConfig(projectRoot);
  const packs = Array.isArray(config?.enabled_packs) ? config.enabled_packs : [];
  for (const pack of packs) {
    console.log(pack);
  }
  return 0;
}

function installedSkillPaths(projectRoot) {
  const roots = [join(projectRoot, '.claude', 'skills'), join(projectRoot, '.codex', 'skills')];
  const paths = [];

  for (const root of roots) {
    if (!existsSync(root)) {
      continue;
    }

    for (const entry of readdirSync(root)) {
      const fullPath = join(root, entry);
      const stat = lstatSync(fullPath);
      if (stat.isDirectory() || stat.isSymbolicLink()) {
        paths.push(fullPath);
      }
    }
  }

  return paths.sort();
}

export function printProjectStatus(projectRoot = process.cwd()) {
  const rawConfig = readProjectConfigText(projectRoot);
  const config = rawConfig ? readProjectConfig(projectRoot) : null;

  if (rawConfig) {
    console.log('Project designation:');
    for (const line of rawConfig.trimEnd().split('\n')) {
      console.log(`  ${line}`);
    }
  } else {
    console.log('No .agents/project.json found.');
  }

  console.log('');
  console.log('Installed local pack skills:');
  for (const skillPath of installedSkillPaths(projectRoot)) {
    console.log(skillPath);
  }

  const skillEntries = enabledSkillsEntries(config);
  if (skillEntries.length > 0) {
    console.log('');
    console.log('Individually installed skills:');
    for (const [skill, pack] of skillEntries) {
      console.log(`  ${skill} (from pack: ${pack})`);
    }
  }

  return 0;
}

export async function setAgentMode(mode, projectRoot = process.cwd()) {
  if (!mode) {
    throw new Error('set-mode requires a mode: claude-only, codex-only, hybrid, or unset');
  }
  if (mode !== 'unset' && !VALID_AGENT_MODES.has(mode)) {
    throw new Error(`Invalid mode '${mode}'. Must be claude-only, codex-only, hybrid, or unset`);
  }

  return withProjectLock(projectRoot, `set-mode ${mode}`, async () => {
    const config = normalizedProjectConfig(projectRoot);
    if (mode === 'unset') {
      delete config.agent_mode;
    } else {
      config.agent_mode = mode;
    }
    writeProjectConfig(projectRoot, config);
    console.log('Updated .agents/project.json');
    return 0;
  });
}

export async function setUpdateMode(mode, projectRoot = process.cwd()) {
  if (!VALID_UPDATE_MODES.has(mode || '')) {
    throw new Error('set-update-mode requires a mode: warn, auto, or unset');
  }
  if (!existsSync(projectFilePath(projectRoot))) {
    throw new Error('No .agents/project.json found; install a pack first');
  }

  return withProjectLock(projectRoot, `set-update-mode ${mode}`, async () => {
    const config = readProjectConfig(projectRoot) || {};
    if (mode === 'unset') {
      delete config.skill_updates;
    } else {
      const existing = config.skill_updates && typeof config.skill_updates === 'object'
        ? config.skill_updates
        : {};
      config.skill_updates = { ...existing, mode };
    }
    writeProjectConfig(projectRoot, config);
    console.log(`Set skill_updates.mode to ${mode}`);
    return 0;
  });
}
