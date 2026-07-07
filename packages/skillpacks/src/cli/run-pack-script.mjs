import { spawn, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  printEnabledPacks,
  printProjectStatus,
  setAgentMode,
  setBuildInPublicMode,
  setBuildInPublicPlatforms,
  setBipPromptDismissed,
  setUpdateMode
} from './project-config.mjs';
import { resolvePackCommandArgs } from './pack-normalization.mjs';
import {
  doctorAllProjects,
  doctorProject,
  initProject,
  installResolved,
  pinSkill,
  pruneProject,
  refreshAllProjects,
  refreshProject,
  removeResolved,
  statusAllProjects,
  uninstallGlobal,
  unpinSkill
} from './lifecycle.mjs';
import {
  resolveAlignmentScaffold,
  resolveInterrogationScaffold,
  runPageScaffold
} from './page-scaffold.mjs';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(moduleDir, '..', '..');
const checkoutRoot = resolve(packageRoot, '..', '..');
const packageJsonPath = join(packageRoot, 'package.json');
const packScriptPath = resolvePackagedPath('scripts/pack.sh');
const manifestPath = resolvePackagedPath('dist/skillpacks-manifest.json');
const alignmentUpgradeScriptPath = resolvePackagedPath('scripts/upgrade-alignment-page.mjs');
const designTreeUpgradeScriptPath = resolvePackagedPath('scripts/upgrade-design-tree-loop.mjs');
const alignmentAuditScriptPath = resolvePackagedPath('scripts/audit-alignment-pages.mjs');
const alignmentInjectTtsScriptPath = resolvePackagedPath('scripts/inject-tts.mjs');
const alignmentOpenScriptPath = resolvePackagedPath('scripts/open-html-page.mjs');
const alignmentServeScriptPath = resolvePackagedPath('scripts/serve-alignment.mjs');
const alignmentTtsAssetPath = resolvePackagedPath('scripts/alignment-tts-kokoro.js');
const alignmentTemplatePath = resolvePackagedPath('assets/templates/alignment-page.html');
const interrogationTemplatePath = resolvePackagedPath('assets/templates/interrogation-page.html');
const ALIGNMENT_PAGE_BROWSERS = new Set(['auto', 'brave', 'chrome', 'safari', 'edge', 'default']);

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
  'set-bip',
  'set-bip-platforms',
  'set-bip-prompt',
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
  console.log(`gskp alignment

Usage:
  gskp alignment bundles [--dry-run] [--check] [--legacy-bundles]
  gskp alignment pages audit
  gskp alignment pages open <alignment/page.html> [--browser auto|brave|chrome|safari|edge|default] [--dry-run] [--json]
  gskp alignment pages serve [--port <port>]
  gskp alignment pages inject-tts [--force] [--dry-run] [alignment/<page>.html]
  gskp alignment pages scaffold <skill> <topic> --out alignment/<skill>-<topic>.html
  gskp alignment verify

Commands:
  bundles                    Validate shared alignment resolver stubs
  bundles --dry-run          Preview resolver-stub changes
  bundles --check            Fail on resolver-stub drift without writing
  bundles --legacy-bundles   Regenerate legacy sibling ALIGNMENT-PAGE.md files
  pages audit                Audit active rendered alignment/*.html pages
  pages open                 Open or focus an alignment HTML page
  pages serve                Serve alignment pages from the current repo over localhost
  pages inject-tts           Add the packaged Brief Me TTS script tag to pages
  pages scaffold             Create a starter alignment HTML page from the packaged template
  verify                     Run the focused alignment verification set when present`);
}

function interrogationHelp() {
  console.log(`gskp interrogation

Usage:
  gskp interrogation pages scaffold <skill> <round> <branch> --out interrogation/<skill>-r<round>-<branch>.html

Commands:
  pages scaffold             Create a starter interrogation HTML page from the packaged template`);
}

function prototypeHelp() {
  console.log(`gskp prototype

Usage:
  gskp prototype bundles [--dry-run] [--check]

Commands:
  bundles                    Generate per-skill DESIGN-TREE-LOOP.md bundles
  bundles --dry-run          Preview generated bundle changes
  bundles --check            Fail on generated-bundle drift without writing`);
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

function assertSafeAlignmentPagePath(command, pagePath) {
  if (typeof pagePath !== 'string' || pagePath.length === 0) {
    throw new Error(`${command}: expected an alignment HTML page path`);
  }
  if (pagePath.startsWith('/') || /^[A-Za-z]:[\\/]/.test(pagePath) || pagePath.includes('\\')) {
    throw new Error(`${command}: expected a repo-relative alignment HTML page path, got '${pagePath}'`);
  }

  const parts = pagePath.split('/');
  if (
    parts.length !== 2 ||
    parts[0] !== 'alignment' ||
    !parts[1] ||
    parts[1] === '.' ||
    parts[1] === '..' ||
    parts[1].includes('..') ||
    !parts[1].endsWith('.html')
  ) {
    throw new Error(`${command}: expected an alignment HTML page path, got '${pagePath}'`);
  }
}

function validateOpenAlignmentPageArgs(args) {
  const passthrough = [];
  let pagePath = null;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--dry-run' || arg === '--json') {
      passthrough.push(arg);
      continue;
    }

    if (arg === '--browser') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('alignment pages open: --browser requires a value');
      }
      if (!ALIGNMENT_PAGE_BROWSERS.has(value)) {
        throw new Error(`alignment pages open: unsupported browser '${value}'`);
      }
      passthrough.push(arg, value);
      index += 1;
      continue;
    }

    if (arg.startsWith('--browser=')) {
      const value = arg.slice('--browser='.length);
      if (!ALIGNMENT_PAGE_BROWSERS.has(value)) {
        throw new Error(`alignment pages open: unsupported browser '${value}'`);
      }
      passthrough.push(arg);
      continue;
    }

    if (arg.startsWith('-')) {
      throw new Error(`alignment pages open: unsupported flag '${arg}'`);
    }

    if (pagePath) {
      throw new Error(`alignment pages open: unexpected argument '${arg}'`);
    }
    pagePath = arg;
    passthrough.push(arg);
  }

  assertSafeAlignmentPagePath('alignment pages open', pagePath);
  return passthrough;
}

function validateServeAlignmentPageArgs(args) {
  let port = null;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--port') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('alignment pages serve: --port requires an integer value');
      }
      if (port !== null) {
        throw new Error('alignment pages serve: --port can only be provided once');
      }
      port = validatePort(value);
      index += 1;
      continue;
    }

    if (arg.startsWith('--port=')) {
      if (port !== null) {
        throw new Error('alignment pages serve: --port can only be provided once');
      }
      port = validatePort(arg.slice('--port='.length));
      continue;
    }

    if (arg.startsWith('-')) {
      throw new Error(`alignment pages serve: unsupported flag '${arg}'`);
    }

    throw new Error(`alignment pages serve: unexpected argument '${arg}'`);
  }

  return port;
}

function validatePort(value) {
  if (!/^[0-9]+$/.test(value)) {
    throw new Error(`alignment pages serve: invalid port '${value}'`);
  }

  const port = Number(value);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
    throw new Error(`alignment pages serve: invalid port '${value}'`);
  }

  return String(port);
}

export function resolveAlignmentCommand(args, options = {}) {
  const projectRoot = resolve(options.projectRoot || process.cwd());
  const [scope, ...rest] = args;

  if (!scope || scope === 'help' || scope === '--help' || scope === '-h') {
    return { kind: 'help' };
  }

  if (scope === 'bundles') {
    validateArgs('alignment bundles', rest, {
      allowedFlags: new Set(['--dry-run', '--check', '--legacy-bundles'])
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

    if (pagesCommand === 'open') {
      const openArgs = validateOpenAlignmentPageArgs(pagesRest);
      return {
        kind: 'run',
        command: process.execPath,
        args: [alignmentOpenScriptPath, ...openArgs]
      };
    }

    if (pagesCommand === 'serve') {
      const port = validateServeAlignmentPageArgs(pagesRest);
      return {
        kind: 'run',
        command: process.execPath,
        args: [alignmentServeScriptPath, projectRoot],
        env: { ...process.env, PORT: port || '8907' }
      };
    }

    if (pagesCommand === 'inject-tts') {
      validateArgs('alignment pages inject-tts', pagesRest, {
        allowedFlags: new Set(['--force', '--dry-run']),
        maxPositionals: 1,
      });
      const pagePath = pagesRest.find((arg) => !arg.startsWith('-'));
      if (pagePath) {
        assertSafeAlignmentPagePath('alignment pages inject-tts', pagePath);
      }
      return {
        kind: 'run',
        command: process.execPath,
        args: [alignmentInjectTtsScriptPath, '--root', projectRoot, ...pagesRest],
        ensureTtsAsset: !pagesRest.includes('--dry-run')
      };
    }

    if (pagesCommand === 'scaffold') {
      return {
        kind: 'scaffold',
        scaffold: resolveAlignmentScaffold(pagesRest),
        templatePath: alignmentTemplatePath,
        projectRoot
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

export function resolveInterrogationCommand(args, options = {}) {
  const projectRoot = resolve(options.projectRoot || process.cwd());
  const [scope, ...rest] = args;

  if (!scope || scope === 'help' || scope === '--help' || scope === '-h') {
    return { kind: 'help' };
  }

  if (scope === 'pages') {
    const [pagesCommand, ...pagesRest] = rest;
    if (!pagesCommand || pagesCommand === 'help' || pagesCommand === '--help' || pagesCommand === '-h') {
      return { kind: 'help' };
    }

    if (pagesCommand === 'scaffold') {
      return {
        kind: 'scaffold',
        scaffold: resolveInterrogationScaffold(pagesRest),
        templatePath: interrogationTemplatePath,
        projectRoot
      };
    }

    throw new Error(`interrogation pages: unknown command '${pagesCommand}'`);
  }

  throw new Error(`interrogation: unknown command '${scope}'`);
}

export function resolvePrototypeCommand(args, options = {}) {
  const projectRoot = resolve(options.projectRoot || process.cwd());
  const [scope, ...rest] = args;

  if (!scope || scope === 'help' || scope === '--help' || scope === '-h') {
    return { kind: 'help' };
  }

  if (scope === 'bundles') {
    validateArgs('prototype bundles', rest, {
      allowedFlags: new Set(['--dry-run', '--check'])
    });
    if (rest.includes('--dry-run') && rest.includes('--check')) {
      throw new Error('prototype bundles accepts either --dry-run or --check, not both');
    }
    return {
      kind: 'run',
      command: process.execPath,
      args: [designTreeUpgradeScriptPath, '--root', projectRoot, ...rest]
    };
  }

  throw new Error(`prototype: unknown command '${scope}'`);
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

  requireCommand('node', 'Install Node.js before running gskp alignment commands.');
  if (resolved.kind === 'scaffold') {
    return runPageScaffold(resolved.scaffold, {
      projectRoot: resolved.projectRoot,
      templatePath: resolved.templatePath
    });
  }
  if (resolved.ensureTtsAsset) {
    ensureAlignmentTtsAsset(process.cwd());
  }
  return runCommand(resolved.command, resolved.args, { env: resolved.env || process.env });
}

function runInterrogation(args) {
  const resolved = resolveInterrogationCommand(args, { projectRoot: process.cwd() });
  if (resolved.kind === 'help') {
    interrogationHelp();
    return 0;
  }

  requireCommand('node', 'Install Node.js before running gskp interrogation commands.');
  if (resolved.kind === 'scaffold') {
    return runPageScaffold(resolved.scaffold, {
      projectRoot: resolved.projectRoot,
      templatePath: resolved.templatePath
    });
  }

  throw new Error(`unsupported interrogation command kind '${resolved.kind}'`);
}

function runPrototype(args) {
  const resolved = resolvePrototypeCommand(args, { projectRoot: process.cwd() });
  if (resolved.kind === 'help') {
    prototypeHelp();
    return 0;
  }

  requireCommand('node', 'Install Node.js before running gskp prototype commands.');
  return runCommand(resolved.command, resolved.args);
}

function printManifestJson(args) {
  if (args.length !== 1 || args[0] !== '--json') {
    throw new Error('list --json does not accept additional arguments');
  }
  console.log(JSON.stringify(readManifest(), null, 2));
  return 0;
}

function deprecationMarker(skill) {
  return skill.deprecated ? ` — deprecated → ${skill.replaced_by ?? '(unspecified)'}` : '';
}

export function formatSkillsList(manifest) {
  const byKey = new Map();
  for (const skill of manifest.skills) {
    if (skill.installable !== true) {
      continue;
    }
    const groupKey = `${skill.scope}|${skill.pack ?? ''}|${skill.name}`;
    const existing = byKey.get(groupKey);
    if (existing) {
      if (skill.platform && !existing.platforms.includes(skill.platform)) {
        existing.platforms.push(skill.platform);
      }
      continue;
    }
    byKey.set(groupKey, {
      name: skill.name,
      scope: skill.scope,
      pack: skill.pack,
      platforms: skill.platform ? [skill.platform] : [],
      deprecated: skill.deprecated,
      replaced_by: skill.replaced_by
    });
  }

  const rows = [...byKey.values()].sort((a, b) => {
    const aGroup = a.scope === 'base' ? '￿' : a.pack ?? '';
    const bGroup = b.scope === 'base' ? '￿' : b.pack ?? '';
    if (aGroup !== bGroup) {
      return aGroup < bGroup ? -1 : 1;
    }
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  });

  const lines = [`Installable skills (${rows.length}):`];
  for (const row of rows) {
    const group = row.scope === 'base' ? 'base' : row.pack;
    const platforms = row.platforms.slice().sort().join(', ');
    lines.push(`  ${row.name}  [${group}]  (${platforms})${deprecationMarker(row)}`);
  }
  return lines.join('\n');
}

export function formatPackHierarchy(manifest) {
  const skillLookup = new Map();
  for (const skill of manifest.skills) {
    if (skill.installable !== true) {
      continue;
    }
    const key = `${skill.scope}|${skill.pack ?? ''}|${skill.name}`;
    const existing = skillLookup.get(key);
    if (existing) {
      if (skill.platform && !existing.platforms.includes(skill.platform)) {
        existing.platforms.push(skill.platform);
      }
      continue;
    }
    skillLookup.set(key, {
      platforms: skill.platform ? [skill.platform] : [],
      deprecated: skill.deprecated,
      replaced_by: skill.replaced_by
    });
  }

  const baseRows = [...skillLookup.entries()].filter(([key]) => key.startsWith('base|'));
  const totalSkills = manifest.packs.reduce((sum, pack) => sum + pack.skills.length, 0) + baseRows.length;

  const lines = [`Packs (${manifest.packs.length}) and base, ${totalSkills} installable skills:`];
  for (const pack of manifest.packs) {
    lines.push(`${pack.name}  (${pack.skill_count} skills)`);
    for (const skillName of pack.skills) {
      const meta = skillLookup.get(`pack|${pack.name}|${skillName}`);
      const platforms = (meta?.platforms ?? []).slice().sort().join(', ');
      const marker = meta ? deprecationMarker(meta) : '';
      lines.push(`  ${skillName}  (${platforms})${marker}`);
    }
  }

  lines.push(`base  (${baseRows.length} skills)`);
  const baseSorted = baseRows
    .map(([key, meta]) => ({ name: key.slice('base||'.length), meta }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const { name, meta } of baseSorted) {
    const platforms = meta.platforms.slice().sort().join(', ');
    lines.push(`  ${name}  (${platforms})${deprecationMarker(meta)}`);
  }
  return lines.join('\n');
}

function printSkillListing(args) {
  const wantsSkills = args.includes('--skills');
  const wantsTree = args.includes('--tree');
  if (wantsSkills && wantsTree) {
    throw new Error('list --skills and list --tree cannot be combined');
  }
  const extras = args.filter((arg) => arg !== '--skills' && arg !== '--tree');
  if (extras.length > 0 || args.length !== 1) {
    throw new Error('list --skills/--tree does not accept additional arguments');
  }
  const manifest = readManifest();
  console.log(wantsSkills ? formatSkillsList(manifest) : formatPackHierarchy(manifest));
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
  console.log(`gskp ${packageVersion()}

Usage:
  gskp <command> [args...]

Commands:
  list                         List available packs
  list --json                  Print the packaged skillpacks manifest as JSON
  list --skills                List every installable skill (base + packs)
  list --tree                  List packs with their skills nested
  list-packs                   List enabled packs from .agents/project.json
  status                       Show project designation and installed skills
  status --all                 Status for every project below the current directory
  recommend                    Recommend packs from repository signals
  install <name...>            Enable packs or individual skills
  install-deck <deck> [--full] Enable packs selected by deck metadata
  init                         Install base skills into this project
  cleanup [--all|--global] [--reinstall-base] [--dry-run]
                               Remove deprecated state below cwd, or user-home state with --global
  uninstall-global [--reinstall-base] [--dry-run]
                               Deprecated alias for cleanup --global
  remove <name...>             Remove packs or individual skills
  refresh                      Recreate local skill roots from project config
  refresh --all [--dry-run]    Refresh every project under the current directory
  doctor                       Report skill-install drift
  doctor --all                 Drift report across every project below
  doctor --fix                 Clean generated skill-root drift
  doctor --fix --agent-docs [--dry-run]
                               Also migrate generated AGENTS.md/CLAUDE.md blocks
  alignment bundles [--dry-run] [--check] [--legacy-bundles]
                               Generate/check shared resolver stubs; optionally legacy ALIGNMENT-PAGE.md bundles
  prototype bundles [--dry-run] [--check]
                               Generate/check per-skill DESIGN-TREE-LOOP.md bundles
  alignment pages audit        Audit active rendered alignment/*.html pages
  alignment pages open <alignment/page.html> [--browser <browser>]
                               Open or focus an alignment HTML page
  alignment pages serve [--port <port>]
                               Serve alignment pages from the current repo over localhost
  alignment pages inject-tts [--force] [alignment/<page>.html]
                               Add the packaged Brief Me TTS script include
  alignment pages scaffold <skill> <topic> --out alignment/<skill>-<topic>.html
                               Create a starter alignment HTML page
  interrogation pages scaffold <skill> <round> <branch> --out interrogation/<skill>-r<round>-<branch>.html
                               Create a starter interrogation HTML page
  alignment verify             Run focused alignment tests when present
  prune [--dry-run]            Remove orphaned managed skill installs
  set-update-mode <mode>       Set skill update mode: warn, auto, or unset
  pin <skill> <version>        Pin a skill to an archived version
  unpin <skill>                Revert a pinned skill to latest
  set-mode <mode>              Set project agent mode
  which <skill>                Show which pack provides a skill

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

  if (command === 'list' && (rest.includes('--skills') || rest.includes('--tree'))) {
    return printSkillListing(rest);
  }

  if (command === 'list-packs') {
    if (rest.length > 0) {
      throw new Error('list-packs does not accept arguments');
    }
    return printEnabledPacks();
  }

  if (command === 'status') {
    if (rest.includes('--all')) {
      const others = rest.filter((arg) => arg !== '--all');
      if (others.length > 0) {
        throw new Error('status does not accept arguments');
      }
      return statusAllProjects({ rootDir: process.cwd() });
    }
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

  if (command === 'set-bip') {
    return setBuildInPublicMode(rest[0]);
  }

  if (command === 'set-bip-platforms') {
    return setBuildInPublicPlatforms(rest);
  }

  if (command === 'set-bip-prompt') {
    return setBipPromptDismissed(rest[0]);
  }

  if (command === 'cleanup' || command === 'uninstall-global') {
    const commandName = command;
    let reinstallBase = false;
    let dryRun = false;
    let allScope = false;
    let globalScope = command === 'uninstall-global';
    for (const arg of rest) {
      if (arg === '--all') {
        allScope = true;
        continue;
      }
      if (arg === '--global') {
        globalScope = true;
        continue;
      }
      if (arg === '--reinstall-base') {
        reinstallBase = true;
        continue;
      }
      if (arg === '--dry-run') {
        dryRun = true;
        continue;
      }
      if (arg.startsWith('-')) {
        throw new Error(`${commandName}: unsupported flag '${arg}'`);
      }
      throw new Error(`${commandName}: unexpected argument '${arg}'`);
    }
    if (allScope && globalScope) {
      throw new Error(`${commandName}: --all and --global cannot be used together`);
    }
    const rootDir = globalScope ? homedir() : process.cwd();
    return uninstallGlobal({
      manifest: reinstallBase ? readManifest() : null,
      reinstallBase,
      rootDir,
      cleanupScope: globalScope ? 'global' : allScope ? 'all' : 'default',
      dryRun
    });
  }

  if (command === 'install-deck') {
    const deckInstall = resolveDeckInstall(rest);
    requireCommand('bash', 'Install bash before running gskp.');
    requireCommand(
      'jq',
      'Install with: brew install jq (macOS) or apt install jq (Debian/Ubuntu).'
    );
    return runCommand('bash', [packScriptPath, 'install', ...deckInstall.packs]);
  }

  if (command === 'alignment') {
    return runAlignment(rest);
  }

  if (command === 'interrogation') {
    return runInterrogation(rest);
  }

  if (command === 'prototype') {
    return runPrototype(rest);
  }

  if (command === 'init') {
    if (rest.length > 0) {
      throw new Error('init does not accept arguments');
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
    let all = false;
    let dryRun = false;
    for (const arg of rest) {
      if (arg === '--all') {
        all = true;
        continue;
      }
      if (arg === '--dry-run') {
        dryRun = true;
        continue;
      }
      throw new Error(`refresh: unknown option '${arg}'`);
    }
    if (dryRun && !all) {
      throw new Error('refresh --dry-run is only supported with --all');
    }
    if (all) {
      return refreshAllProjects({
        manifest: readManifest(),
        rootDir: process.cwd(),
        dryRun
      });
    }
    return refreshProject({
      manifest: readManifest(),
      projectRoot: process.cwd()
    });
  }

  if (command === 'doctor') {
    if (rest.includes('--all')) {
      return doctorAllProjects({
        manifest: readManifest(),
        rootDir: process.cwd(),
        args: rest.filter((arg) => arg !== '--all')
      });
    }
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

  requireCommand('bash', 'Install bash before running gskp.');

  return runCommand('bash', [packScriptPath, command, ...rest]);
}
