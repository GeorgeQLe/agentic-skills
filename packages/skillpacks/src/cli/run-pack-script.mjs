import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(moduleDir, '..', '..');
const checkoutRoot = resolve(packageRoot, '..', '..');
const packageJsonPath = join(packageRoot, 'package.json');
const packScriptPath = resolvePackagedPath('scripts/pack.sh');
const initScriptPath = resolvePackagedPath('init.sh');

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

const JQ_WRITE_COMMANDS = new Set([
  'install',
  'remove',
  'refresh',
  'prune',
  'set-update-mode',
  'pin',
  'unpin',
  'set-mode'
]);

function packageVersion() {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
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

function usage() {
  console.log(`skillpacks ${packageVersion()}

Usage:
  skillpacks <command> [args...]

Commands:
  list                         List available packs
  list-packs                   List enabled packs from .agents/project.json
  status                       Show project designation and installed skills
  recommend                    Recommend packs from repository signals
  install <name...>            Enable packs or individual skills
  remove <name...>             Remove packs or individual skills
  refresh                      Recreate local skill roots from project config
  doctor                       Report skill-install drift
  prune [--dry-run]            Remove orphaned managed skill installs
  set-update-mode <mode>       Set skill update mode: warn, auto, or unset
  pin <skill> <version>        Pin a skill to an archived version
  unpin <skill>                Revert a pinned skill to latest
  set-mode <mode>              Set project agent mode
  which <skill>                Show which pack provides a skill
  init-global [args...]        Install global core skills with packaged init.sh

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

  requireCommand('bash', 'Install bash before running skillpacks.');

  if (command === 'init-global') {
    return runCommand('bash', [initScriptPath, ...rest]);
  }

  if (!PACK_COMMANDS.has(command)) {
    usage();
    throw new Error(`unknown command '${command}'`);
  }

  if (JQ_WRITE_COMMANDS.has(command)) {
    requireCommand(
      'jq',
      'Install with: brew install jq (macOS) or apt install jq (Debian/Ubuntu).'
    );
  }

  return runCommand('bash', [packScriptPath, command, ...rest]);
}
