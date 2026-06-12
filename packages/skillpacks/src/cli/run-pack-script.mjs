import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  printEnabledPacks,
  printProjectStatus,
  setAgentMode,
  setUpdateMode
} from './project-config.mjs';
import { resolvePackCommandArgs } from './pack-normalization.mjs';
import {
  doctorProject,
  initProject,
  installResolved,
  pinSkill,
  pruneProject,
  refreshProject,
  removeResolved,
  unpinSkill
} from './lifecycle.mjs';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(moduleDir, '..', '..');
const checkoutRoot = resolve(packageRoot, '..', '..');
const packageJsonPath = join(packageRoot, 'package.json');
const packScriptPath = resolvePackagedPath('scripts/pack.sh');
const initScriptPath = resolvePackagedPath('init.sh');
const manifestPath = resolvePackagedPath('dist/skillpacks-manifest.json');

function resolvePackagedPath(relativePath) {
  const packagedPath = join(packageRoot, relativePath);
  if (existsSync(packagedPath)) {
    return packagedPath;
  }

  const checkoutPath = join(checkoutRoot, relativePath);
  if (existsSync(checkoutPath)) {
    return checkoutPath;
  }

  return packagedPath;
}

const PACK_COMMANDS = new Set([
  'list',
  'list-packs',
  'status',
  'recommend',
  'install',
  'remove',
  'refresh',
  'doctor',
  'prune',
  'set-update-mode',
  'pin',
  'unpin',
  'set-mode',
  'which'
]);

function packageVersion() {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

function readManifest() {
  if (!existsSync(manifestPath)) {
    throw new Error(
      `manifest not found at ${manifestPath}. Run 'npm --workspace skillpacks run build:manifest' from a source checkout or reinstall skillpacks.`
    );
  }

  try {
    return JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`failed to read manifest at ${manifestPath}: ${detail}`);
  }
}

function commandExists(command) {
  const result = spawnSync(command, ['--version'], {
    stdio: 'ignore'
  });
  return !result.error;
}

function requireCommand(command, installHint) {
  if (!commandExists(command)) {
    throw new Error(`${command} is required. ${installHint}`);
  }
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'inherit',
      ...options
    });

    child.on('error', reject);
    child.on('close', (code, signal) => {
      if (signal) {
        reject(new Error(`${command} terminated by signal ${signal}`));
        return;
      }
      resolve(code ?? 1);
    });
  });
}

function runGlobalInit(args) {
  requireCommand('bash', 'Install bash before running skillpacks.');
  return runCommand('bash', [initScriptPath, ...args]);
}

function printManifestJson(args) {
  if (args.length !== 1 || args[0] !== '--json') {
    throw new Error('list --json does not accept additional arguments');
  }
  console.log(JSON.stringify(readManifest(), null, 2));
  return 0;
}

function availableDeckNames(manifest) {
  return (manifest.decks || []).map((deck) => deck.name).sort();
}

function resolveDeckInstall(args) {
  let deckName = null;
  let full = false;

  for (const arg of args) {
    if (arg === '--full') {
      full = true;
      continue;
    }
    if (arg.startsWith('-')) {
      throw new Error(`install-deck: unsupported flag '${arg}'. Supported flags: --full`);
    }
    if (deckName) {
      throw new Error(`install-deck: unexpected argument '${arg}'`);
    }
    deckName = arg;
  }

  if (!deckName) {
    throw new Error('install-deck requires a deck name');
  }

  const manifest = readManifest();
  const deck = (manifest.decks || []).find((candidate) => candidate.name === deckName);
  if (!deck) {
    const available = availableDeckNames(manifest).join(', ') || '(none)';
    throw new Error(`unknown deck '${deckName}'. Available decks: ${available}`);
  }

  const lane = full ? 'full' : 'default';
  const packs = deck.package_list?.[lane] || (full ? deck.full_packs : deck.default_packs);
  if (!Array.isArray(packs) || packs.length === 0) {
    throw new Error(`deck '${deckName}' has no ${lane} package list in the manifest`);
  }

  return { deckName, lane, packs };
}

function usage() {
  console.log(`skillpacks ${packageVersion()}

Usage:
  skillpacks <command> [args...]

Commands:
  list                         List available packs
  list --json                  Print the packaged skillpacks manifest as JSON
  list-packs                   List enabled packs from .agents/project.json
  status                       Show project designation and installed skills
  recommend                    Recommend packs from repository signals
  install <name...>            Enable packs or individual skills
  install-deck <deck> [--full] Enable packs selected by deck metadata
  init                         Install base skills into this project
  init --global [args...]      Install user-home global core skills with packaged init.sh
  remove <name...>             Remove packs or individual skills
  refresh                      Recreate local skill roots from project config
  doctor                       Report skill-install drift
  prune [--dry-run]            Remove orphaned managed skill installs
  set-update-mode <mode>       Set skill update mode: warn, auto, or unset
  pin <skill> <version>        Pin a skill to an archived version
  unpin <skill>                Revert a pinned skill to latest
  set-mode <mode>              Set project agent mode
  which <skill>                Show which pack provides a skill
  init-global [args...]        Alias for init --global

Project-local commands write to the current working directory.`);
}

export async function runSkillpacksCli(args) {
  const [command, ...rest] = args;

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    usage();
    return 0;
  }

  if (command === '--version' || command === '-v') {
    console.log(packageVersion());
    return 0;
  }

  if (command === 'list' && rest.includes('--json')) {
    return printManifestJson(rest);
  }

  if (command === 'list-packs') {
    if (rest.length > 0) {
      throw new Error('list-packs does not accept arguments');
    }
    return printEnabledPacks();
  }

  if (command === 'status') {
    if (rest.length > 0) {
      throw new Error('status does not accept arguments');
    }
    return printProjectStatus();
  }

  if (command === 'set-mode') {
    if (rest.length !== 1) {
      throw new Error('set-mode requires exactly one mode: claude-only, codex-only, hybrid, or unset');
    }
    return setAgentMode(rest[0]);
  }

  if (command === 'set-update-mode') {
    if (rest.length !== 1) {
      throw new Error('set-update-mode requires exactly one mode: warn, auto, or unset');
    }
    return setUpdateMode(rest[0]);
  }

  if (command === 'init-global') {
    return runGlobalInit(rest);
  }

  if (command === 'install-deck') {
    const deckInstall = resolveDeckInstall(rest);
    requireCommand('bash', 'Install bash before running skillpacks.');
    requireCommand(
      'jq',
      'Install with: brew install jq (macOS) or apt install jq (Debian/Ubuntu).'
    );
    return runCommand('bash', [packScriptPath, 'install', ...deckInstall.packs]);
  }

  if (command === 'init') {
    if (rest[0] === '--global') {
      return runGlobalInit(rest.slice(1));
    }
    if (rest.length > 0) {
      throw new Error(
        "init does not accept arguments except '--global'. Use 'skillpacks init --global' for user-home global core skills."
      );
    }
    return initProject({
      manifest: readManifest(),
      projectRoot: process.cwd()
    });
  }

  if (!PACK_COMMANDS.has(command)) {
    usage();
    throw new Error(`unknown command '${command}'`);
  }

  if (command === 'install' || command === 'remove') {
    const manifest = readManifest();
    const resolved = resolvePackCommandArgs(command, rest, {
      manifest,
      projectRoot: process.cwd()
    });
    if (command === 'install') {
      return installResolved({
        manifest,
        projectRoot: process.cwd(),
        packs: resolved.packs,
        skills: resolved.skills
      });
    }
    return removeResolved({
      manifest,
      projectRoot: process.cwd(),
      packs: resolved.packs,
      skills: resolved.skills
    });
  }

  if (command === 'refresh') {
    if (rest.length > 0) {
      throw new Error('refresh does not accept arguments');
    }
    return refreshProject({
      manifest: readManifest(),
      projectRoot: process.cwd()
    });
  }

  if (command === 'doctor') {
    return doctorProject({
      projectRoot: process.cwd()
    });
  }

  if (command === 'prune') {
    return pruneProject({
      manifest: readManifest(),
      projectRoot: process.cwd(),
      args: rest
    });
  }

  if (command === 'pin') {
    return pinSkill({
      manifest: readManifest(),
      projectRoot: process.cwd(),
      skillName: rest[0],
      version: rest[1]
    });
  }

  if (command === 'unpin') {
    return unpinSkill({
      manifest: readManifest(),
      projectRoot: process.cwd(),
      skillName: rest[0]
    });
  }

  requireCommand('bash', 'Install bash before running skillpacks.');

  return runCommand('bash', [packScriptPath, command, ...rest]);
}
