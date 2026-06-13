import { spawn, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
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
const alignmentUpgradeScriptPath = resolvePackagedPath('scripts/upgrade-alignment-page.mjs');
const alignmentAuditScriptPath = resolvePackagedPath('scripts/audit-alignment-pages.mjs');
const alignmentInjectTtsScriptPath = resolvePackagedPath('scripts/inject-tts.mjs');
const alignmentTtsAssetPath = resolvePackagedPath('scripts/alignment-tts-kokoro.js');

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

function assertNoArgs(command, args) {
  if (args.length > 0) {
    throw new Error(`${command} does not accept arguments`);
  }
}

function ensureAlignmentTtsAsset(projectRoot) {
  if (!existsSync(alignmentTtsAssetPath)) {
    throw new Error(
      `alignment TTS asset not found at ${alignmentTtsAssetPath}. Reinstall skillpacks or use a source checkout that includes scripts/alignment-tts-kokoro.js.`
    );
  }

  const target = join(projectRoot, 'scripts/alignment-tts-kokoro.js');
  if (existsSync(target)) {
    return;
  }

  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(alignmentTtsAssetPath, target);
  console.log('Installed scripts/alignment-tts-kokoro.js for alignment page TTS.');
}

function alignmentHelp() {
  console.log(`skillpacks alignment

Usage:
  skillpacks alignment bundles [--dry-run] [--check]
  skillpacks alignment pages audit
  skillpacks alignment pages inject-tts [--force] [--dry-run] [alignment/<page>.html]
  skillpacks alignment verify

Commands:
  bundles                    Generate per-skill ALIGNMENT-PAGE.md bundles
  bundles --dry-run          Preview generated bundle changes
  bundles --check            Fail on generated-bundle drift without writing
  pages audit                Audit active rendered alignment/*.html pages
  pages inject-tts           Add the packaged Brief Me TTS script tag to pages
  verify                     Run the focused alignment verification set when present`);
}

function validateArgs(command, args, options) {
  const { allowedFlags = new Set(), maxPositionals = 0, positionalPattern = null } = options;
  let positionals = 0;

  for (const arg of args) {
    if (arg.startsWith('-')) {
      if (!allowedFlags.has(arg)) {
        throw new Error(`${command}: unsupported flag '${arg}'`);
      }
      continue;
    }

    positionals += 1;
    if (positionals > maxPositionals) {
      throw new Error(`${command}: unexpected argument '${arg}'`);
    }
    if (positionalPattern && !positionalPattern.test(arg)) {
      throw new Error(`${command}: expected an alignment HTML page path, got '${arg}'`);
    }
  }
}

export function resolveAlignmentCommand(args, options = {}) {
  const projectRoot = resolve(options.projectRoot || process.cwd());
  const [scope, ...rest] = args;

  if (!scope || scope === 'help' || scope === '--help' || scope === '-h') {
    return { kind: 'help' };
  }

  if (scope === 'bundles') {
    validateArgs('alignment bundles', rest, {
      allowedFlags: new Set(['--dry-run', '--check'])
    });
    if (rest.includes('--dry-run') && rest.includes('--check')) {
      throw new Error('alignment bundles accepts either --dry-run or --check, not both');
    }
    return {
      kind: 'run',
      command: process.execPath,
      args: [alignmentUpgradeScriptPath, '--root', projectRoot, ...rest]
    };
  }

  if (scope === 'pages') {
    const [pagesCommand, ...pagesRest] = rest;
    if (!pagesCommand || pagesCommand === 'help' || pagesCommand === '--help' || pagesCommand === '-h') {
      return { kind: 'help' };
    }

    if (pagesCommand === 'audit') {
      assertNoArgs('alignment pages audit', pagesRest);
      return {
        kind: 'run',
        command: process.execPath,
        args: [alignmentAuditScriptPath, '--root', projectRoot]
      };
    }

    if (pagesCommand === 'inject-tts') {
      validateArgs('alignment pages inject-tts', pagesRest, {
        allowedFlags: new Set(['--force', '--dry-run']),
        maxPositionals: 1,
        positionalPattern: /^alignment\/[^/].*\.html$/
      });
      return {
        kind: 'run',
        command: process.execPath,
        args: [alignmentInjectTtsScriptPath, '--root', projectRoot, ...pagesRest],
        ensureTtsAsset: !pagesRest.includes('--dry-run')
      };
    }

    throw new Error(`alignment pages: unknown command '${pagesCommand}'`);
  }

  if (scope === 'verify') {
    assertNoArgs('alignment verify', rest);
    return {
      kind: 'verify',
      projectRoot,
      command: 'pnpm',
      args: [
        '--dir',
        'tests',
        'exec',
        'vitest',
        'run',
        '--project',
        'layer1',
        'layer1/upgrade-alignment-page-bespoke.test.ts',
        'layer1/audit-alignment-pages.test.ts',
        'layer1/alignment-gates.test.ts',
        'layer1/alignment-tts-kokoro.test.ts'
      ]
    };
  }

  throw new Error(`alignment: unknown command '${scope}'`);
}

function targetHasAlignmentVerifyTests(projectRoot) {
  const required = [
    'tests/package.json',
    'tests/layer1/upgrade-alignment-page-bespoke.test.ts',
    'tests/layer1/audit-alignment-pages.test.ts',
    'tests/layer1/alignment-gates.test.ts',
    'tests/layer1/alignment-tts-kokoro.test.ts'
  ];
  return required.every((relativePath) => existsSync(join(projectRoot, relativePath)));
}

function runAlignment(args) {
  const resolved = resolveAlignmentCommand(args, { projectRoot: process.cwd() });
  if (resolved.kind === 'help') {
    alignmentHelp();
    return 0;
  }

  if (resolved.kind === 'verify') {
    if (!targetHasAlignmentVerifyTests(resolved.projectRoot)) {
      console.error(
        'alignment verify requires this repository\'s focused alignment Vitest files under tests/layer1. This target repo does not include them.'
      );
      return 1;
    }
    requireCommand('pnpm', 'Install pnpm or run the source-checkout Vitest command directly.');
    return runCommand(resolved.command, resolved.args);
  }

  requireCommand('node', 'Install Node.js before running skillpacks alignment commands.');
  if (resolved.ensureTtsAsset) {
    ensureAlignmentTtsAsset(process.cwd());
  }
  return runCommand(resolved.command, resolved.args);
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
  doctor --fix                 Clean generated skill-root drift
  doctor --fix --agent-docs [--dry-run]
                               Also migrate generated AGENTS.md/CLAUDE.md blocks
  alignment bundles [--dry-run] [--check]
                               Generate/check per-skill ALIGNMENT-PAGE.md bundles
  alignment pages audit        Audit active rendered alignment/*.html pages
  alignment pages inject-tts [--force] [alignment/<page>.html]
                               Add the packaged Brief Me TTS script include
  alignment verify             Run focused alignment tests when present
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

  if (command === 'alignment') {
    return runAlignment(rest);
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
      manifest: readManifest(),
      projectRoot: process.cwd(),
      args: rest
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
