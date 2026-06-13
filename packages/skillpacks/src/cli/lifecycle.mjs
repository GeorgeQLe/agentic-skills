import { createHash } from 'node:crypto';
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync
} from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  canonicalHibernatedPack,
  hibernatedPacksForSkill,
  hibernatedSkillNamesForPack,
  normalizePack
} from './pack-normalization.mjs';
import {
  inferProjectType,
  readProjectConfig,
  writeProjectConfig,
  withProjectLock
} from './project-config.mjs';

const SKILL_LINK_MARKER = '.agentic-skills-managed';
const HIBERNATED_ARCHIVE_RELATIVE_PATH = 'archive/hibernated-packs/2026-06-poketowork-rebuild';
const HIBERNATED_REACTIVATION_TEXT =
  'Reactivation requires a stable service/API, a known auth contract, and updated smoke tests.';
const TOOLS = ['claude', 'codex'];
const AGENT_DOCS = ['AGENTS.md', 'CLAUDE.md'];
const KNOWN_PROVISION_AGENTIC_CONFIG_VERSIONS = new Set(['v0.5', 'v0.6', 'v0.7', 'v0.8', 'v0.9']);
const moduleDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(moduleDir, '..', '..');
const checkoutRoot = resolve(packageRoot, '..', '..');

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

function projectTypeForPack(pack) {
  if (
    [
      'business-research',
      'customer-lifecycle',
      'business-growth',
      'business-ops',
      'business-app',
      'vard'
    ].includes(pack)
  ) {
    return 'business-app';
  }
  if (pack === 'game') {
    return 'game';
  }
  if (pack === 'devtool' || pack === 'ord') {
    return 'devtool';
  }
  if (['creator-foundation', 'youtube-ops', 'creator-media', 'remotion'].includes(pack)) {
    return 'creator-media';
  }
  if (pack === 'project-fleet') {
    return 'project-fleet';
  }
  return null;
}

function activePackNames(manifest) {
  return (manifest.packs || [])
    .filter((pack) => pack.status === undefined || pack.status === 'active')
    .map((pack) => pack.name)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

function manifestPackageLabel(manifest) {
  const name = manifest?.package?.name || 'skillpacks';
  const version = manifest?.package?.version || 'unknown';
  return `${name}@${version}`;
}

function availablePacksInline(manifest) {
  const names = activePackNames(manifest);
  if (names.length === 0) {
    return '(none)';
  }

  return names.reduce((output, name, index) => {
    if (index === 0) {
      return name;
    }
    return `${output}${index % 2 === 1 ? ',' : ' '}${name}`;
  }, '');
}

function manifestSkills(manifest) {
  return [...(manifest.skills || [])].sort((a, b) => {
    return String(a.path || '').localeCompare(String(b.path || ''));
  });
}

function activePackExists(manifest, packName) {
  return activePackNames(manifest).includes(packName);
}

function packSkillEntries(manifest, packName, tool) {
  return manifestSkills(manifest).filter((skill) => {
    return skill.pack === packName && skill.platform === tool && skill.path;
  });
}

function baseSkillEntries(manifest, tool) {
  return manifestSkills(manifest).filter((skill) => {
    return skill.scope === 'global' && skill.platform === tool && skill.path;
  });
}

function uniquePackSkillNames(manifest, packName) {
  return [
    ...new Set(
      manifestSkills(manifest)
        .filter((skill) => skill.pack === packName && skill.name)
        .map((skill) => skill.name)
    )
  ].sort((a, b) => a.localeCompare(b));
}

function uniqueBaseSkillNames(manifest) {
  return [
    ...new Set(
      manifestSkills(manifest)
        .filter((skill) => skill.scope === 'global' && skill.name)
        .map((skill) => skill.name)
    )
  ].sort((a, b) => a.localeCompare(b));
}

function findPackForSkill(manifest, skillName) {
  return manifestSkills(manifest).find((skill) => skill.name === skillName && skill.pack)?.pack || null;
}

function findSkillEntry(manifest, packName, tool, skillName) {
  return manifestSkills(manifest).find((skill) => {
    return skill.pack === packName && skill.platform === tool && skill.name === skillName && skill.path;
  });
}

function hibernatedPackError(requested, pack) {
  return new Error(
    [
      `ERROR: PoketoWork kanban pack '${pack}' is hibernated while Poketo.work is being rebuilt.`,
      `Requested: ${requested}`,
      `Archive: ${HIBERNATED_ARCHIVE_RELATIVE_PATH}/${pack}`,
      HIBERNATED_REACTIVATION_TEXT,
      `No active install is available. To clean up a stale project designation, run: scripts/pack.sh remove ${pack}`
    ].join('\n')
  );
}

function skillSourceDir(skillEntry) {
  return resolvePackagedPath(dirname(skillEntry.path));
}

function targetRoot(projectRoot, tool) {
  return join(projectRoot, `.${tool}`, 'skills');
}

function targetPath(projectRoot, tool, skillName) {
  return join(targetRoot(projectRoot, tool), skillName);
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function listSkillContentFiles(sourceDir) {
  const files = [];

  function visit(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'archive' || entry.name === SKILL_LINK_MARKER) {
        continue;
      }
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  visit(sourceDir);
  return files.sort((a, b) => {
    const left = relative(sourceDir, a);
    const right = relative(sourceDir, b);
    if (left < right) {
      return -1;
    }
    if (left > right) {
      return 1;
    }
    return 0;
  });
}

function skillContentSha(sourceDir) {
  const lines = listSkillContentFiles(sourceDir)
    .map((filePath) => {
      const fileHash = sha256(readFileSync(filePath));
      return `${fileHash}  ${relative(sourceDir, filePath)}`;
    })
    .join('\n');
  return sha256(`${lines}\n`);
}

function skillSourceVersion(sourceDir) {
  const skillFile = join(sourceDir, 'SKILL.md');
  if (!existsSync(skillFile)) {
    return '';
  }

  const match = readFileSync(skillFile, 'utf8').match(/^version:\s*(.+)$/m);
  if (!match) {
    return '';
  }

  return match[1].trim().replace(/^"|"$/g, '');
}

function isArchiveSource(sourceDir) {
  return basename(dirname(sourceDir)) === 'archive';
}

function isManagedSkillDir(target) {
  return existsSync(target)
    && !lstatSync(target).isSymbolicLink()
    && lstatSync(target).isDirectory()
    && existsSync(join(target, SKILL_LINK_MARKER));
}

function managedMarkerField(target, field) {
  const markerPath = join(target, SKILL_LINK_MARKER);
  if (!existsSync(markerPath)) {
    return '';
  }

  const prefix = `${field}=`;
  const line = readFileSync(markerPath, 'utf8')
    .split(/\r?\n/)
    .find((candidate) => candidate.startsWith(prefix));
  return line ? line.slice(prefix.length) : '';
}

function sourceOwnedBySkillpacks(source) {
  const ownedPrefixes = [
    join(packageRoot, 'global', 'claude'),
    join(packageRoot, 'global', 'codex'),
    join(packageRoot, 'packs'),
    join(checkoutRoot, 'global', 'claude'),
    join(checkoutRoot, 'global', 'codex'),
    join(checkoutRoot, 'packs')
  ];

  return ownedPrefixes.some((prefix) => source === prefix || source.startsWith(`${prefix}/`));
}

function removeRepoSkillInstall(target) {
  if (!existsSync(target)) {
    return false;
  }

  const stats = lstatSync(target);
  if (stats.isSymbolicLink()) {
    const source = readlinkSync(target);
    if (sourceOwnedBySkillpacks(source)) {
      unlinkSync(target);
      return true;
    }
    return false;
  }

  if (isManagedSkillDir(target)) {
    const source = managedMarkerField(target, 'source');
    if (sourceOwnedBySkillpacks(source)) {
      rmSync(target, { recursive: true, force: true });
      return true;
    }
  }

  return false;
}

function comparePathStrings(left, right) {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

function syncSkillLink(source, target) {
  if (existsSync(target)) {
    const stats = lstatSync(target);
    if (stats.isSymbolicLink()) {
      if (readlinkSync(target) === source) {
        return false;
      }
      unlinkSync(target);
    } else if (isManagedSkillDir(target)) {
      rmSync(target, { recursive: true, force: true });
    } else {
      console.error(`WARNING: ${target} exists and is not repo-managed, skipping`);
      return false;
    }
  }

  symlinkSync(source, target, 'dir');
  return true;
}

function syncSkillInstall(source, target) {
  if (isArchiveSource(source)) {
    return syncSkillLink(source, target);
  }

  if (existsSync(target)) {
    const stats = lstatSync(target);
    if (stats.isSymbolicLink()) {
      unlinkSync(target);
    } else if (isManagedSkillDir(target)) {
      rmSync(target, { recursive: true, force: true });
    } else {
      console.error(`WARNING: ${target} exists and is not repo-managed, skipping`);
      return false;
    }
  }

  mkdirSync(target, { recursive: true });
  writeFileSync(
    join(target, SKILL_LINK_MARKER),
    [
      `source=${source}`,
      'managed_by=agentic-skills',
      `source_version=${skillSourceVersion(source)}`,
      `source_sha=${skillContentSha(source)}`
    ].join('\n') + '\n'
  );

  for (const entry of readdirSync(source, { withFileTypes: true })) {
    if (entry.name === 'archive') {
      continue;
    }
    cpSync(join(source, entry.name), join(target, entry.name), {
      recursive: true,
      dereference: false
    });
  }

  return true;
}

function effectiveSourceForSkill(sourceDir, skillName, config) {
  const pinned = config?.pinned_versions?.[skillName];
  if (!pinned) {
    return { source: sourceDir, pinned: null, usingPinned: false };
  }

  const archivePath = join(sourceDir, 'archive', pinned);
  if (existsSync(archivePath) && existsSync(join(archivePath, 'SKILL.md'))) {
    return { source: archivePath, pinned, usingPinned: true };
  }

  console.error(`WARNING: pin ${skillName}=${pinned} but ${archivePath}/SKILL.md not found, using current`);
  return { source: sourceDir, pinned, usingPinned: false };
}

function linkSkill(projectRoot, tool, skillName, sourceDir, config) {
  const root = targetRoot(projectRoot, tool);
  mkdirSync(root, { recursive: true });
  const target = join(root, skillName);
  const effective = effectiveSourceForSkill(sourceDir, skillName, config);

  if (syncSkillInstall(effective.source, target)) {
    if (effective.usingPinned) {
      console.log(`Installed .${tool}/skills/${skillName} (pinned ${effective.pinned})`);
    } else {
      console.log(`Installed .${tool}/skills/${skillName}`);
    }
    return true;
  }
  return false;
}

function enabledPacks(config) {
  return Array.isArray(config?.enabled_packs) ? config.enabled_packs : [];
}

function baseSkillsEnabled(config) {
  return config?.base_skills === true;
}

function pinnedVersions(config) {
  return config?.pinned_versions && typeof config.pinned_versions === 'object'
    ? config.pinned_versions
    : {};
}

function writePackProjectConfig(projectRoot, pack, packs) {
  const existing = readProjectConfig(projectRoot);
  const next = existing
    ? { ...existing }
    : {
        project_type: projectTypeForPack(pack) || inferProjectType(projectRoot),
        enabled_packs: [],
        skill_pack_version: 1
      };

  if (!next.project_type) {
    next.project_type = projectTypeForPack(pack) || inferProjectType(projectRoot);
  }
  next.enabled_packs = packs;
  next.skill_pack_version = 1;
  writeProjectConfig(projectRoot, next);
}

function writeBaseProjectConfig(projectRoot) {
  const existing = readProjectConfig(projectRoot);
  const next = existing
    ? { ...existing }
    : {
        project_type: inferProjectType(projectRoot),
        enabled_packs: [],
        skill_pack_version: 1
      };

  if (!next.project_type) {
    next.project_type = inferProjectType(projectRoot);
  }
  if (!Array.isArray(next.enabled_packs)) {
    next.enabled_packs = [];
  }
  next.base_skills = true;
  next.skill_pack_version = 1;
  writeProjectConfig(projectRoot, next);
}

function installBaseSkills(projectRoot, manifest, config = readProjectConfig(projectRoot)) {
  const skillNames = uniqueBaseSkillNames(manifest);
  if (skillNames.length === 0) {
    throw new Error('No base skills found in the packaged manifest');
  }

  for (const tool of TOOLS) {
    for (const skill of baseSkillEntries(manifest, tool)) {
      linkSkill(projectRoot, tool, skill.name, skillSourceDir(skill), config);
    }
  }
}

function installPack(projectRoot, manifest, pack) {
  const hibernatedPack = canonicalHibernatedPack(pack);
  if (hibernatedPack) {
    throw hibernatedPackError(pack, hibernatedPack);
  }
  if (!activePackExists(manifest, pack)) {
    throw new Error(`Unknown pack '${pack}'. Available packs: ${availablePacksInline(manifest)}`);
  }

  const config = readProjectConfig(projectRoot);
  for (const tool of TOOLS) {
    for (const skill of packSkillEntries(manifest, pack, tool)) {
      linkSkill(projectRoot, tool, skill.name, skillSourceDir(skill), config);
    }
  }

  const packs = [...enabledPacks(readProjectConfig(projectRoot)), pack]
    .filter((candidate, index, all) => all.indexOf(candidate) === index);
  writePackProjectConfig(projectRoot, pack, packs);
  console.log('Updated .agents/project.json');
}

function ensureProjectConfigForSkill(projectRoot) {
  const existing = readProjectConfig(projectRoot);
  if (existing) {
    return { ...existing };
  }

  return {
    project_type: inferProjectType(projectRoot),
    enabled_packs: [],
    skill_pack_version: 1
  };
}

function installSingleSkill(projectRoot, manifest, skillName) {
  const pack = findPackForSkill(manifest, skillName);
  if (!pack) {
    const hibernatedPacks = hibernatedPacksForSkill(skillName);
    if (hibernatedPacks.length > 0) {
      throw new Error(`ERROR: PoketoWork kanban skill '${skillName}' is archived in hibernated pack(s): ${hibernatedPacks.join(', ')}`);
    }
    throw new Error(`Skill '${skillName}' not found in any pack. Available packs: ${availablePacksInline(manifest)}`);
  }

  const config = readProjectConfig(projectRoot);
  for (const tool of TOOLS) {
    const skill = findSkillEntry(manifest, pack, tool, skillName);
    if (skill) {
      linkSkill(projectRoot, tool, skillName, skillSourceDir(skill), config);
    }
  }

  const next = ensureProjectConfigForSkill(projectRoot);
  const enabledSkills = next.enabled_skills && typeof next.enabled_skills === 'object'
    ? { ...next.enabled_skills }
    : {};
  enabledSkills[skillName] = pack;
  next.enabled_skills = enabledSkills;
  writeProjectConfig(projectRoot, next);
  console.log(`Updated .agents/project.json (skill: ${skillName} from pack: ${pack})`);
}

function removeEnabledSkill(projectRoot, skillName) {
  const existing = readProjectConfig(projectRoot);
  if (!existing) {
    return;
  }

  const next = { ...existing };
  if (next.enabled_skills && typeof next.enabled_skills === 'object') {
    const enabledSkills = { ...next.enabled_skills };
    delete enabledSkills[skillName];
    if (Object.keys(enabledSkills).length > 0) {
      next.enabled_skills = enabledSkills;
    } else {
      delete next.enabled_skills;
    }
  }
  writeProjectConfig(projectRoot, next);
}

function removeSingleSkill(projectRoot, manifest, skillName) {
  const config = readProjectConfig(projectRoot);
  const enabledSkillPack = config?.enabled_skills?.[skillName];
  const activePack = findPackForSkill(manifest, skillName);
  const hibernatedPacks = hibernatedPacksForSkill(skillName);

  if (!enabledSkillPack && !activePack && hibernatedPacks.length === 0) {
    throw new Error(`Skill '${skillName}' not found in any pack`);
  }

  for (const tool of TOOLS) {
    if (removeRepoSkillInstall(targetPath(projectRoot, tool, skillName))) {
      console.log(`Removed .${tool}/skills/${skillName}`);
    }
  }

  removeEnabledSkill(projectRoot, skillName);
  console.log(`Updated .agents/project.json (removed skill: ${skillName})`);
}

function removePack(projectRoot, manifest, pack) {
  let skillNames = [];
  if (activePackExists(manifest, pack)) {
    skillNames = uniquePackSkillNames(manifest, pack);
  } else {
    const hibernatedPack = canonicalHibernatedPack(pack) || pack;
    skillNames = hibernatedSkillNamesForPack(hibernatedPack);
    if (skillNames.length === 0) {
      throw new Error(`Unknown pack '${pack}'. Available packs: ${availablePacksInline(manifest)}`);
    }
    pack = hibernatedPack;
  }

  for (const tool of TOOLS) {
    for (const skillName of skillNames) {
      if (removeRepoSkillInstall(targetPath(projectRoot, tool, skillName))) {
        console.log(`Removed .${tool}/skills/${skillName}`);
      }
    }
  }

  const packs = enabledPacks(readProjectConfig(projectRoot)).filter((candidate) => candidate !== pack);
  writePackProjectConfig(projectRoot, pack, packs);
  console.log('Updated .agents/project.json');
}

function enabledSkillEntries(config) {
  if (!config?.enabled_skills || typeof config.enabled_skills !== 'object') {
    return [];
  }
  return Object.entries(config.enabled_skills);
}

function staleProjectPackError(pack, location, reason = '') {
  const detail = reason ? ` ${reason}` : '';
  return new Error(
    `Stale pack entry '${pack}' in .agents/project.json ${location}.${detail} ` +
      `Run 'npx gskp remove ${pack}' or edit .agents/project.json to remove or rename it.`
  );
}

function reconcileStoredPack(manifest, pack, location) {
  const hibernatedPack = canonicalHibernatedPack(pack);
  if (hibernatedPack) {
    throw hibernatedPackError(pack, hibernatedPack);
  }

  if (activePackExists(manifest, pack)) {
    return pack;
  }

  const activeMatches = normalizePack(pack).filter((candidate) => activePackExists(manifest, candidate));
  if (activeMatches.length === 1) {
    return activeMatches[0];
  }
  if (activeMatches.length > 1) {
    throw staleProjectPackError(
      pack,
      location,
      `It resolves to multiple active packs: ${activeMatches.join(', ')}.`
    );
  }

  throw staleProjectPackError(pack, location);
}

function reconcileProjectConfig(projectRoot, manifest) {
  const config = readProjectConfig(projectRoot);
  if (!config) {
    return null;
  }

  const next = { ...config };
  let changed = false;

  if (Array.isArray(config.enabled_packs)) {
    const packs = [];
    for (const pack of config.enabled_packs) {
      const canonical = reconcileStoredPack(manifest, pack, 'enabled_packs');
      if (canonical !== pack) {
        changed = true;
      }
      if (!packs.includes(canonical)) {
        packs.push(canonical);
      } else {
        changed = true;
      }
    }
    next.enabled_packs = packs;
  }

  if (config.enabled_skills && typeof config.enabled_skills === 'object') {
    const enabledSkills = {};
    for (const [skillName, pack] of Object.entries(config.enabled_skills)) {
      const canonical = findPackForSkill(manifest, skillName);
      enabledSkills[skillName] = canonical || pack;
      if (canonical && canonical !== pack) {
        changed = true;
      }
    }
    next.enabled_skills = enabledSkills;
  }

  if (changed) {
    writeProjectConfig(projectRoot, next);
    console.log('Reconciled .agents/project.json pack names');
    return next;
  }

  return config;
}

function installedSkillTargets(projectRoot) {
  const roots = TOOLS.map((tool) => targetRoot(projectRoot, tool));
  const paths = [];

  for (const root of roots) {
    if (!existsSync(root)) {
      continue;
    }
    for (const entry of readdirSync(root)) {
      const fullPath = join(root, entry);
      const stats = lstatSync(fullPath);
      if (stats.isDirectory() || stats.isSymbolicLink()) {
        paths.push(fullPath);
      }
    }
  }

  return paths.sort(comparePathStrings);
}

function relativeProjectPath(projectRoot, target) {
  return relative(projectRoot, target);
}

function skillInstallStatus(target) {
  const stats = lstatSync(target);
  if (stats.isSymbolicLink()) {
    const source = readlinkSync(target);
    if (!sourceOwnedBySkillpacks(source)) {
      return { status: 'not-managed', recordedVersion: '', currentVersion: '' };
    }
    const version = skillSourceVersion(source);
    return { status: 'pinned', recordedVersion: version, currentVersion: version };
  }

  if (!isManagedSkillDir(target)) {
    return { status: 'not-managed', recordedVersion: '', currentVersion: '' };
  }

  const source = managedMarkerField(target, 'source');
  const recordedSha = managedMarkerField(target, 'source_sha');
  const recordedVersion = managedMarkerField(target, 'source_version');

  if (!source || !existsSync(source) || !lstatSync(source).isDirectory()) {
    return { status: 'missing-source', recordedVersion, currentVersion: '' };
  }

  const currentVersion = skillSourceVersion(source);
  if (!recordedSha) {
    return { status: 'unknown', recordedVersion, currentVersion };
  }

  const currentSha = skillContentSha(source);
  return {
    status: recordedSha === currentSha ? 'ok' : 'stale',
    recordedVersion,
    currentVersion
  };
}

function projectSkillUpdatesMode(projectRoot) {
  const config = readProjectConfig(projectRoot);
  return config?.skill_updates?.mode || '';
}

function archiveSourceForSkill(skillEntry, version) {
  return join(skillSourceDir(skillEntry), 'archive', version);
}

function findPackOrDie(manifest, skillName) {
  const pack = findPackForSkill(manifest, skillName);
  if (!pack) {
    throw new Error(`Skill '${skillName}' not found in any pack`);
  }
  return pack;
}

function archiveVersionExists(manifest, pack, skillName, version) {
  return TOOLS.some((tool) => {
    const skill = findSkillEntry(manifest, pack, tool, skillName);
    return skill && existsSync(join(archiveSourceForSkill(skill, version), 'SKILL.md'));
  });
}

function requireExistingProjectConfig(projectRoot, message) {
  const config = readProjectConfig(projectRoot);
  if (!config) {
    throw new Error(message);
  }
  return config;
}

function writePinnedVersion(projectRoot, skillName, version) {
  const config = requireExistingProjectConfig(projectRoot, 'No .agents/project.json found; install a pack first');
  const next = { ...config };
  next.pinned_versions = { ...pinnedVersions(config), [skillName]: version };
  writeProjectConfig(projectRoot, next);
}

function deletePinnedVersion(projectRoot, skillName) {
  const config = requireExistingProjectConfig(projectRoot, 'No .agents/project.json found');
  const next = { ...config };

  if (next.pinned_versions && typeof next.pinned_versions === 'object') {
    const versions = { ...next.pinned_versions };
    delete versions[skillName];
    if (Object.keys(versions).length > 0) {
      next.pinned_versions = versions;
    } else {
      delete next.pinned_versions;
    }
  }

  writeProjectConfig(projectRoot, next);
}

function relinkPinnedSkill(projectRoot, manifest, pack, skillName, version) {
  for (const tool of TOOLS) {
    const skill = findSkillEntry(manifest, pack, tool, skillName);
    if (!skill) {
      continue;
    }

    const root = targetRoot(projectRoot, tool);
    const source = archiveSourceForSkill(skill, version);
    if (!existsSync(root) || !existsSync(source)) {
      continue;
    }

    if (syncSkillInstall(source, join(root, skillName))) {
      console.log(`Pinned .${tool}/skills/${skillName} (${version})`);
    }
  }
}

function relinkUnpinnedSkill(projectRoot, manifest, pack, skillName) {
  for (const tool of TOOLS) {
    const skill = findSkillEntry(manifest, pack, tool, skillName);
    if (!skill) {
      continue;
    }

    const root = targetRoot(projectRoot, tool);
    const source = skillSourceDir(skill);
    if (!existsSync(root) || !existsSync(source)) {
      continue;
    }

    if (syncSkillInstall(source, join(root, skillName))) {
      console.log(`Unpinned .${tool}/skills/${skillName} (latest)`);
    }
  }
}

function expectedSkillNames(manifest, config) {
  const expected = new Set();

  if (baseSkillsEnabled(config)) {
    for (const skillName of uniqueBaseSkillNames(manifest)) {
      expected.add(skillName);
    }
  }

  for (const pack of enabledPacks(config)) {
    for (const skillName of uniquePackSkillNames(manifest, pack)) {
      expected.add(skillName);
    }
  }

  for (const [skillName] of enabledSkillEntries(config)) {
    expected.add(skillName);
  }

  for (const skillName of Object.keys(pinnedVersions(config))) {
    expected.add(skillName);
  }

  return expected;
}

export function printSessionReloadNotice() {
  console.log('');
  console.log('Skill installs changed. Claude Code and Codex may keep the skill list loaded when the current session started.');
  console.log('Claude Code: use /reload-skills to rescan skills. /clear starts a new empty-context conversation and can also pick up the refreshed registry. Restart Claude Code if .claude/skills did not exist when the session started or the skill is still invisible.');
  console.log('Codex: start a fresh Codex CLI session if the $ skill list does not show newly installed or removed project-local skills.');
}

export async function initProject({ manifest, projectRoot = process.cwd() }) {
  return withProjectLock(projectRoot, 'init', async () => {
    installBaseSkills(projectRoot, manifest);
    writeBaseProjectConfig(projectRoot);
    console.log('Updated .agents/project.json (base skills enabled)');
    console.log(`Initialized project base skills to ${manifestPackageLabel(manifest)}.`);
    printSessionReloadNotice();
    return 0;
  });
}

export async function installResolved({ manifest, projectRoot = process.cwd(), packs = [], skills = [] }) {
  return withProjectLock(projectRoot, `install ${[...packs, ...skills].join(' ')}`.trim(), async () => {
    for (const pack of packs) {
      installPack(projectRoot, manifest, pack);
    }
    for (const skill of skills) {
      installSingleSkill(projectRoot, manifest, skill);
    }
    printSessionReloadNotice();
    return 0;
  });
}

function syncExpectedSkillRoots(projectRoot, manifest) {
  const config = readProjectConfig(projectRoot);
  if (!config) {
    return 0;
  }

  let changed = 0;

  if (baseSkillsEnabled(config)) {
    for (const tool of TOOLS) {
      for (const skill of baseSkillEntries(manifest, tool)) {
        if (linkSkill(projectRoot, tool, skill.name, skillSourceDir(skill), config)) {
          changed += 1;
        }
      }
    }
  }

  for (const pack of enabledPacks(config)) {
    for (const tool of TOOLS) {
      for (const skill of packSkillEntries(manifest, pack, tool)) {
        if (linkSkill(projectRoot, tool, skill.name, skillSourceDir(skill), config)) {
          changed += 1;
        }
      }
    }
  }

  for (const [skillName, pack] of enabledSkillEntries(config)) {
    for (const tool of TOOLS) {
      const skill = findSkillEntry(manifest, pack, tool, skillName);
      if (skill && linkSkill(projectRoot, tool, skillName, skillSourceDir(skill), config)) {
        changed += 1;
      }
    }
  }

  return changed;
}

function pruneOrphanedSkillRoots({ manifest, projectRoot, dryRun = false }) {
  const expected = expectedSkillNames(manifest, readProjectConfig(projectRoot));
  let removed = 0;

  for (const target of installedSkillTargets(projectRoot)) {
    const status = skillInstallStatus(target);
    if (status.status === 'not-managed') {
      continue;
    }

    let reason = '';
    if (status.status === 'missing-source') {
      reason = 'source no longer exists';
    } else if (!expected.has(basename(target))) {
      reason = 'pack not enabled';
    }

    if (!reason) {
      continue;
    }

    const rel = relativeProjectPath(projectRoot, target);
    if (dryRun) {
      console.log(`would remove  ${rel} (${reason})`);
    } else if (removeRepoSkillInstall(target)) {
      console.log(`removed  ${rel} (${reason})`);
    } else if (lstatSync(target).isSymbolicLink()) {
      unlinkSync(target);
      console.log(`removed  ${rel} (${reason})`);
    } else if (lstatSync(target).isDirectory()) {
      rmSync(target, { recursive: true, force: true });
      console.log(`removed  ${rel} (${reason})`);
    } else {
      console.error(`FAILED   ${rel} (${reason})`);
    }

    removed += 1;
  }

  return removed;
}

function provisionerSkillText() {
  const sourcePath = resolvePackagedPath('global/codex/provision-agentic-config/SKILL.md');
  if (!existsSync(sourcePath)) {
    throw new Error(`Cannot find canonical provision-agentic-config skill at ${sourcePath}`);
  }
  return readFileSync(sourcePath, 'utf8');
}

function extractCanonicalProvisionBlock(fileName) {
  const heading = fileName === 'CLAUDE.md' ? '## Required Claude Block' : '## Required AGENTS Block';
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`${escapedHeading}\\r?\\n\\r?\\n\`\`\`\`(?:md|markdown)\\r?\\n([\\s\\S]*?)\\r?\\n\`\`\`\``);
  const match = provisionerSkillText().match(pattern);
  if (!match) {
    throw new Error(`Cannot extract canonical ${fileName} provision block from provision-agentic-config`);
  }
  return match[1].replace(/\r\n/g, '\n').trimEnd();
}

function provisionNote(fileName) {
  return `Provisioned artifact: ./${fileName}. Source: workflow.md. Verification: block appears exactly once.`;
}

function parseProvisionedAgentDoc(projectRoot, fileName) {
  const filePath = join(projectRoot, fileName);
  if (!existsSync(filePath)) {
    throw new Error(`${fileName}: file not found`);
  }

  const original = readFileSync(filePath, 'utf8');
  const markerPattern = /<!-- provision-agentic-config (v\d+\.\d+) -->/g;
  const markers = [...original.matchAll(markerPattern)];
  if (markers.length === 0) {
    throw new Error(`${fileName}: missing provision-agentic-config marker`);
  }
  if (markers.length > 1) {
    throw new Error(`${fileName}: duplicate provision-agentic-config markers`);
  }

  const marker = markers[0];
  const version = marker[1];
  if (!KNOWN_PROVISION_AGENTIC_CONFIG_VERSIONS.has(version)) {
    throw new Error(`${fileName}: unknown provision-agentic-config version ${version}`);
  }

  const afterMarker = original.slice(marker.index);
  const note = provisionNote(fileName).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const noteMatch = afterMarker.match(new RegExp(`^${note}$`, 'm'));
  if (!noteMatch || noteMatch.index === undefined) {
    throw new Error(`${fileName}: malformed provision block boundary`);
  }
  if (!afterMarker.slice(0, noteMatch.index).includes('## Workflow Orchestration')) {
    throw new Error(`${fileName}: malformed provision block boundary`);
  }

  let end = marker.index + noteMatch.index + noteMatch[0].length;
  while (original[end] === '\r' || original[end] === '\n') {
    end += 1;
  }

  return {
    fileName,
    filePath,
    original,
    start: marker.index,
    end,
    prefix: original.slice(0, marker.index),
    suffix: original.slice(end)
  };
}

function replacementProvisionBlock(fileName, hasSuffix) {
  const block = extractCanonicalProvisionBlock(fileName);
  const note = provisionNote(fileName);
  return hasSuffix ? `${block}\n\n${note}\n\n` : `${block}\n\n${note}\n`;
}

function unifiedDiff(fileName, before, after) {
  const beforeLines = before.endsWith('\n') ? before.slice(0, -1).split('\n') : before.split('\n');
  const afterLines = after.endsWith('\n') ? after.slice(0, -1).split('\n') : after.split('\n');
  const output = [
    `--- ${fileName}`,
    `+++ ${fileName}`,
    `@@ -1,${beforeLines.length} +1,${afterLines.length} @@`
  ];
  output.push(...beforeLines.map((line) => `-${line}`));
  output.push(...afterLines.map((line) => `+${line}`));
  return `${output.join('\n')}\n`;
}

function timestampForBackup() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function migrateAgentDocs({ projectRoot = process.cwd(), dryRun = false } = {}) {
  const planned = [];
  const errors = [];

  for (const fileName of AGENT_DOCS) {
    try {
      const parsed = parseProvisionedAgentDoc(projectRoot, fileName);
      const next =
        parsed.prefix + replacementProvisionBlock(fileName, parsed.suffix.length > 0) + parsed.suffix;
      planned.push({ ...parsed, next });
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (errors.length > 0) {
    throw new Error(`Refusing agent-doc migration:\n${errors.map((error) => `  - ${error}`).join('\n')}`);
  }

  const changed = planned.filter((entry) => entry.original !== entry.next);
  if (changed.length === 0) {
    console.log('Agent docs already match the canonical provision blocks.');
    return 0;
  }

  for (const entry of changed) {
    console.log(unifiedDiff(entry.fileName, entry.original, entry.next));
  }

  if (dryRun) {
    console.log('Dry run: no files written.');
    return changed.length;
  }

  const backupDir = join(projectRoot, '.agents', 'backups');
  mkdirSync(backupDir, { recursive: true });
  const timestamp = timestampForBackup();
  const reports = [];

  for (const entry of changed) {
    const backupPath = join(backupDir, `${entry.fileName}.${timestamp}.bak`);
    writeFileSync(backupPath, entry.original);
    writeFileSync(entry.filePath, entry.next);
    reports.push({
      fileName: entry.fileName,
      backupPath: relativeProjectPath(projectRoot, backupPath)
    });
  }

  console.log('Agent docs changed:');
  for (const report of reports) {
    console.log(`  ${report.fileName} (backup: ${report.backupPath})`);
  }

  return changed.length;
}

function parseDoctorArgs(args) {
  const options = {
    fix: false,
    agentDocs: false,
    dryRun: false
  };

  for (const arg of args) {
    if (arg === '--fix') {
      options.fix = true;
      continue;
    }
    if (arg === '--agent-docs') {
      options.agentDocs = true;
      continue;
    }
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    throw new Error(`doctor: unknown option '${arg}'`);
  }

  if (options.agentDocs && !options.fix) {
    throw new Error('doctor --agent-docs requires --fix');
  }
  if (options.dryRun && !options.agentDocs) {
    throw new Error('doctor --dry-run is only supported with --fix --agent-docs');
  }

  return options;
}

export async function doctorProject({ manifest, projectRoot = process.cwd(), args = [] } = {}) {
  const options = parseDoctorArgs(args);

  if (options.fix) {
    if (options.dryRun) {
      migrateAgentDocs({ projectRoot, dryRun: true });
      return 0;
    }

    return withProjectLock(projectRoot, 'doctor --fix', async () => {
      console.log('Doctor fix: generated skill-root cleanup');
      reconcileProjectConfig(projectRoot, manifest);
      const synced = syncExpectedSkillRoots(projectRoot, manifest);
      const removed = pruneOrphanedSkillRoots({ manifest, projectRoot });
      if (synced === 0 && removed === 0) {
        console.log('No generated skill-root changes needed.');
      } else {
        console.log(`Generated skill-root cleanup changed ${synced + removed} item(s).`);
      }

      if (options.agentDocs) {
        migrateAgentDocs({ projectRoot, dryRun: false });
      }

      if (synced > 0 || removed > 0) {
        printSessionReloadNotice();
      }

      return 0;
    });
  }

  const mode = projectSkillUpdatesMode(projectRoot) || 'warn (default)';
  console.log(`Project skill update mode: ${mode}`);
  console.log('Skill install drift (.claude/skills, .codex/skills):');

  let found = false;
  let anyStale = false;
  for (const target of installedSkillTargets(projectRoot)) {
    const status = skillInstallStatus(target);
    if (status.status === 'not-managed') {
      continue;
    }

    found = true;
    const rel = relativeProjectPath(projectRoot, target);
    switch (status.status) {
      case 'ok':
        console.log(`  ok       ${rel}`);
        break;
      case 'pinned':
        console.log(`  pinned   ${rel} (frozen ${status.recordedVersion || '?'})`);
        break;
      case 'unknown':
        console.log(`  unknown  ${rel} — run refresh to enable drift tracking`);
        break;
      case 'missing-source':
        console.log(`  missing  ${rel} — canonical source no longer exists`);
        break;
      case 'stale':
        console.log(
          `  STALE    ${rel} (${status.recordedVersion || '?'} -> ${status.currentVersion || '?'})`
        );
        anyStale = true;
        break;
      default:
        break;
    }
  }

  if (!found) {
    console.log('  (no managed skill installs found)');
  }

  if (anyStale) {
    console.log('');
    console.log('Fix: npx gskp refresh (or scripts/pack.sh refresh from a source checkout)');
    return 1;
  }

  return 0;
}

export async function pinSkill({
  manifest,
  projectRoot = process.cwd(),
  skillName,
  version
}) {
  if (!skillName) {
    throw new Error('pin requires a skill name');
  }
  if (!version) {
    throw new Error('pin requires a version (e.g., v0.0)');
  }

  return withProjectLock(projectRoot, `pin ${skillName} ${version}`, async () => {
    const pack = findPackOrDie(manifest, skillName);
    if (!archiveVersionExists(manifest, pack, skillName, version)) {
      throw new Error(`No archive/${version}/SKILL.md found for skill '${skillName}' in pack '${pack}'`);
    }

    writePinnedVersion(projectRoot, skillName, version);
    relinkPinnedSkill(projectRoot, manifest, pack, skillName, version);
    console.log(`Pinned ${skillName} to ${version}`);
    return 0;
  });
}

export async function unpinSkill({ manifest, projectRoot = process.cwd(), skillName }) {
  if (!skillName) {
    throw new Error('unpin requires a skill name');
  }

  return withProjectLock(projectRoot, `unpin ${skillName}`, async () => {
    const pack = findPackOrDie(manifest, skillName);
    deletePinnedVersion(projectRoot, skillName);
    relinkUnpinnedSkill(projectRoot, manifest, pack, skillName);
    console.log(`Unpinned ${skillName} (reverted to latest)`);
    return 0;
  });
}

export async function pruneProject({
  manifest,
  projectRoot = process.cwd(),
  args = []
}) {
  let dryRun = false;
  for (const arg of args) {
    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }
    throw new Error(`prune: unknown option '${arg}'`);
  }

  return withProjectLock(projectRoot, 'prune', async () => {
    const removed = pruneOrphanedSkillRoots({ manifest, projectRoot, dryRun });

    if (removed === 0) {
      console.log('Nothing to prune.');
    } else if (dryRun) {
      console.log(`${removed} orphan(s) found. Run without --dry-run to remove.`);
    } else {
      console.log(`${removed} orphan(s) removed.`);
    }

    printSessionReloadNotice();
    return 0;
  });
}

export async function removeResolved({ manifest, projectRoot = process.cwd(), packs = [], skills = [] }) {
  return withProjectLock(projectRoot, `remove ${[...packs, ...skills].join(' ')}`.trim(), async () => {
    for (const pack of packs) {
      removePack(projectRoot, manifest, pack);
    }
    for (const skill of skills) {
      removeSingleSkill(projectRoot, manifest, skill);
    }
    printSessionReloadNotice();
    return 0;
  });
}

export async function refreshProject({ manifest, projectRoot = process.cwd() }) {
  return withProjectLock(projectRoot, 'refresh', async () => {
    const config = reconcileProjectConfig(projectRoot, manifest);
    const packs = enabledPacks(config);
    const skills = enabledSkillEntries(config).map(([skill]) => skill);
    const base = baseSkillsEnabled(config);

    if (!base && packs.length === 0 && skills.length === 0) {
      throw new Error('No enabled packs or skills in .agents/project.json');
    }

    if (base) {
      installBaseSkills(projectRoot, manifest, config);
    }
    for (const pack of packs) {
      installPack(projectRoot, manifest, pack);
    }
    for (const skill of skills) {
      installSingleSkill(projectRoot, manifest, skill);
    }
    console.log(`Refreshed project skills to ${manifestPackageLabel(manifest)}.`);
    printSessionReloadNotice();
    return 0;
  });
}
