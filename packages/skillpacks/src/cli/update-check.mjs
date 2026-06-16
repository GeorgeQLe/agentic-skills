import { homedir } from 'node:os';
import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';

const CACHE_PATH = join(homedir(), '.skillpacks-update-check.json');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const REGISTRY_URL = 'https://registry.npmjs.org/skillpacks/latest';

async function fetchLatestVersion() {
  const res = await fetch(REGISTRY_URL, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.version || null;
}

async function readCache() {
  try {
    const raw = await readFile(CACHE_PATH, 'utf8');
    const cache = JSON.parse(raw);
    if (Date.now() - cache.checkedAt < CACHE_TTL_MS) {
      return cache.latestVersion;
    }
  } catch {}
  return null;
}

async function writeCache(latestVersion) {
  try {
    await writeFile(CACHE_PATH, JSON.stringify({ latestVersion, checkedAt: Date.now() }));
  } catch {}
}

export function startUpdateCheck() {
  return (async () => {
    const cached = await readCache();
    if (cached) return cached;
    const latest = await fetchLatestVersion();
    if (latest) await writeCache(latest);
    return latest;
  })().catch(() => null);
}

function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na < nb) return -1;
    if (na > nb) return 1;
  }
  return 0;
}

const HUMAN_COMMANDS = new Set([
  'help',
  'list',
  'list-packs',
  'status',
  'init',
  'install',
  'install-deck',
  'refresh',
  'doctor',
  'prune',
  'pin',
  'unpin',
  'remove',
  'alignment'
]);

export function shouldPrintPackageStatus(args = []) {
  const [command, ...rest] = args;
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    return true;
  }
  if (command === '--version' || command === '-v') {
    return false;
  }
  if (command === 'list' && rest.includes('--json')) {
    return false;
  }
  return HUMAN_COMMANDS.has(command);
}

export function formatPackageStatus(currentVersion, latestVersion) {
  if (!latestVersion || !currentVersion) {
    return `skillpacks ${currentVersion || 'unknown'} (update check unavailable)`;
  }
  if (compareVersions(currentVersion, latestVersion) < 0) {
    return `skillpacks ${currentVersion} (latest ${latestVersion} available; run: npx skillpacks@latest)`;
  }
  return `skillpacks ${currentVersion} (latest)`;
}

export async function printPackageStatus(checkPromise, currentVersion, options = {}) {
  if (!options.enabled) {
    return;
  }

  try {
    const latest = await checkPromise;
    process.stderr.write(`${formatPackageStatus(currentVersion, latest)}\n`);
  } catch {
    process.stderr.write(`${formatPackageStatus(currentVersion, null)}\n`);
  }
}
