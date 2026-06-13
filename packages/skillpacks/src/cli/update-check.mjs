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

export async function printUpdateNotice(checkPromise, currentVersion) {
  try {
    const latest = await checkPromise;
    if (!latest || !currentVersion) return;
    if (compareVersions(currentVersion, latest) >= 0) return;

    const msg = `  Update available: ${currentVersion} → ${latest}`;
    const run = '  Run: npx @glexcorp/gskp@latest';
    const width = Math.max(msg.length, run.length) + 2;
    const pad = (s) => s + ' '.repeat(width - s.length);
    const border = '─'.repeat(width);

    process.stderr.write(
      `\n╭${border}╮\n` +
      `│${pad(msg)}│\n` +
      `│${pad(run)}│\n` +
      `╰${border}╯\n`
    );
  } catch {}
}
