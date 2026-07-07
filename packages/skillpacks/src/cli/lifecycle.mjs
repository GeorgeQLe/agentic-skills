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
import { homedir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  canonicalHibernatedPack,
  hibernatedPacksForSkill,
  hibernatedSkillNamesForPack,
  normalizePack
} from './pack-normalization.mjs';
import {
  discoverProjectRoots,
  inferProjectType,
  printProjectStatus,
  readProjectConfig,
  writeProjectConfig,
  withProjectLock
} from './project-config.mjs';

const SKILL_LINK_MARKER = '.agentic-skills-managed';
const MANAGED_CONVENTION_DOC_ROOT = '.agents/skillpacks/docs';
const MANAGED_CONVENTION_DOC_METADATA = '.skillpacks-managed.json';
const HIBERNATED_ARCHIVE_RELATIVE_PATH = 'archive/hibernated-packs/2026-06-poketowork-rebuild';
const HIBERNATED_REACTIVATION_TEXT =
  'Reactivation requires a stable service/API, a known auth contract, and updated smoke tests.';
const TOOLS = ['claude', 'codex'];
const AGENT_DOCS = ['AGENTS.md', 'CLAUDE.md'];
const BIP_CONFIG_KEYS = ['build_in_public', 'bip_platforms', 'bip_prompt_dismissed'];
const DEPRECATED_ALIAS_REPLACEMENTS = new Map([
  ['prototype', 'logic-wiring'],
  ['create-ui-experiment', 'build-ui-screens'],
  ['consolidate-variations', 'consolidate-prototypes']
]);
const KNOWN_PROVISION_AGENTIC_CONFIG_VERSIONS = new Set([
  'v0.5',
  'v0.6',
  'v0.7',
  'v0.8',
  'v0.9',
  'v0.10',
  'v0.11',
  'v0.12',
  'v0.13',
  'v0.14',
  'v0.15'
]);
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

function archiveSkillPath(skill) {
  return String(skill.path || '').split('/').includes('archive');
}

function installableSkill(skill) {
  return skill.installable !== false && !archiveSkillPath(skill);
}

function activePackExists(manifest, packName) {
  return activePackNames(manifest).includes(packName);
}

function packSkillEntries(manifest, packName, tool) {
  return manifestSkills(manifest).filter((skill) => {
    return installableSkill(skill) && skill.pack === packName && skill.platform === tool && skill.path;
  });
}

function baseSkillEntries(manifest, tool) {
  return manifestSkills(manifest).filter((skill) => {
    return installableSkill(skill) && skill.scope === 'base' && skill.platform === tool && skill.path;
  });
}

function uniquePackSkillNames(manifest, packName) {
  return [
    ...new Set(
      manifestSkills(manifest)
        .filter((skill) => installableSkill(skill) && skill.pack === packName && skill.name)
        .map((skill) => skill.name)
    )
  ].sort((a, b) => a.localeCompare(b));
}

function uniqueBaseSkillNames(manifest) {
  return [
    ...new Set(
      manifestSkills(manifest)
        .filter((skill) => installableSkill(skill) && skill.scope === 'base' && skill.name)
        .map((skill) => skill.name)
    )
  ].sort((a, b) => a.localeCompare(b));
}

function findPackForSkill(manifest, skillName) {
  return manifestSkills(manifest).find((skill) => {
    return installableSkill(skill) && skill.name === skillName && skill.pack;
  })?.pack || null;
}

function hasBaseSkill(manifest, skillName) {
  return manifestSkills(manifest).some((skill) => {
    return installableSkill(skill) && skill.scope === 'base' && skill.name === skillName && skill.path;
  });
}

function findSkillEntry(manifest, packName, tool, skillName) {
  return manifestSkills(manifest).find((skill) => {
    return installableSkill(skill)
      && skill.pack === packName
      && skill.platform === tool
      && skill.name === skillName
      && skill.path;
  });
}

function findBaseSkillEntry(manifest, tool, skillName) {
  return manifestSkills(manifest).find((skill) => {
    return installableSkill(skill)
      && skill.scope === 'base'
      && skill.platform === tool
      && skill.name === skillName
      && skill.path;
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

function toPosixPath(value) {
  return value.split('/').join('/').replaceAll('\\', '/');
}

function conventionDocName(relativePath) {
  const name = basename(relativePath);
  if (relativePath.startsWith('social/')) {
    return /convention\.md$/.test(name);
  }
  if (relativePath.includes('/')) {
    return false;
  }
  return /convention.*\.md$/.test(name) || /contract.*\.md$/.test(name);
}

function conventionDocSourceRoot() {
  const checkoutDocs = join(checkoutRoot, 'docs');
  if (existsSync(checkoutDocs)) {
    return { root: checkoutDocs, mode: 'checkout' };
  }

  const packagedDocs = join(packageRoot, 'assets', 'skillpacks-docs');
  if (existsSync(packagedDocs)) {
    return { root: packagedDocs, mode: 'package' };
  }

  return { root: packagedDocs, mode: 'package' };
}

function managedConventionDocEntries() {
  const { root, mode } = conventionDocSourceRoot();
  if (!existsSync(root)) {
    return [];
  }

  const entries = [];
  function visit(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile()) {
        const relPath = toPosixPath(relative(root, fullPath));
        if (mode === 'package' || conventionDocName(relPath)) {
          entries.push({
            source: fullPath,
            installPath: relPath,
            sourceSha: sha256(readFileSync(fullPath))
          });
        }
      }
    }
  }

  visit(root);
  return entries.sort((a, b) => comparePathStrings(a.installPath, b.installPath));
}

function managedConventionDocsDir(projectRoot) {
  return join(projectRoot, MANAGED_CONVENTION_DOC_ROOT);
}

function conventionDocMetadata(entries, manifest) {
  return `${JSON.stringify({
    managed_by: 'agentic-skills',
    source_package: manifestPackageLabel(manifest),
    docs: entries.map((entry) => ({
      path: entry.installPath,
      source_sha: entry.sourceSha
    }))
  }, null, 2)}\n`;
}

function conventionDocStatuses(projectRoot) {
  return managedConventionDocEntries().map((entry) => {
    const target = join(managedConventionDocsDir(projectRoot), entry.installPath);
    if (!existsSync(target)) {
      return { ...entry, status: 'missing', target };
    }
    const currentSha = sha256(readFileSync(target));
    return {
      ...entry,
      status: currentSha === entry.sourceSha ? 'ok' : 'stale',
      target
    };
  });
}

function syncManagedConventionDocs(projectRoot, manifest) {
  const entries = managedConventionDocEntries();
  if (entries.length === 0) {
    return false;
  }

  const root = managedConventionDocsDir(projectRoot);
  const metadataPath = join(root, MANAGED_CONVENTION_DOC_METADATA);
  const metadata = conventionDocMetadata(entries, manifest);
  const statuses = conventionDocStatuses(projectRoot);
  const metadataCurrent = existsSync(metadataPath) ? readFileSync(metadataPath, 'utf8') : '';
  if (statuses.every((entry) => entry.status === 'ok') && metadataCurrent === metadata) {
    return false;
  }

  rmSync(root, { recursive: true, force: true });
  mkdirSync(root, { recursive: true });
  for (const entry of entries) {
    const target = join(root, entry.installPath);
    mkdirSync(dirname(target), { recursive: true });
    cpSync(entry.source, target, {
      preserveTimestamps: true,
      dereference: false
    });
  }
  writeFileSync(metadataPath, metadata);
  return true;
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
    join(packageRoot, 'packs', 'base', 'claude'),
    join(packageRoot, 'packs', 'base', 'codex'),
    join(packageRoot, 'base', 'claude'),
    join(packageRoot, 'base', 'codex'),
    join(packageRoot, 'packs'),
    join(packageRoot, 'global', 'claude'),
    join(packageRoot, 'global', 'codex'),
    join(packageRoot, 'global', 'packs'),
    join(packageRoot, 'global'),
    join(checkoutRoot, 'packs', 'base', 'claude'),
    join(checkoutRoot, 'packs', 'base', 'codex'),
    join(checkoutRoot, 'base', 'claude'),
    join(checkoutRoot, 'base', 'codex'),
    join(checkoutRoot, 'packs'),
    join(checkoutRoot, 'global', 'claude'),
    join(checkoutRoot, 'global', 'codex'),
    join(checkoutRoot, 'global', 'packs'),
    join(checkoutRoot, 'global')
  ];

  return ownedPrefixes.some((prefix) => source === prefix || source.startsWith(`${prefix}/`));
}

function sourceLooksLikeLegacyGlobalSkillpacksInstall(source, tool, skillName) {
  if (!source) {
    return false;
  }

  const normalizedSource = source.replace(/\\/g, '/');
  const segments = normalizedSource.split('/').filter(Boolean);
  if (!segments.includes('agentic-skills') && !segments.includes('skillpacks')) {
    return false;
  }

  const suffixes = [
    ['base', tool, skillName],
    ['packs', 'base', tool, skillName],
    ['global', tool, skillName],
    ['global', 'packs', tool, skillName]
  ].map((parts) => parts.join('/'));

  return suffixes.some((suffix) => normalizedSource === suffix || normalizedSource.endsWith(`/${suffix}`));
}

function targetManagedBySkillpacks(target) {
  return managedMarkerField(target, 'managed_by') === 'agentic-skills';
}

function removeRepoSkillInstall(target, options = {}) {
  const { tool = '', skillName = '', allowLegacyGlobalSource = false } = options;

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
    const legacyGlobalSource =
      allowLegacyGlobalSource && sourceLooksLikeLegacyGlobalSkillpacksInstall(source, tool, skillName);
    if (targetManagedBySkillpacks(target) && (sourceOwnedBySkillpacks(source) || legacyGlobalSource)) {
      rmSync(target, { recursive: true, force: true });
      return true;
    }
  }

  return false;
}

function repoSkillInstallOwned(target) {
  if (!existsSync(target)) {
    return false;
  }

  const stats = lstatSync(target);
  if (stats.isSymbolicLink()) {
    return sourceOwnedBySkillpacks(readlinkSync(target));
  }

  if (isManagedSkillDir(target)) {
    const source = managedMarkerField(target, 'source');
    return targetManagedBySkillpacks(target) && sourceOwnedBySkillpacks(source);
  }

  return false;
}

function globalRepoSkillInstallOwned(target, tool, skillName) {
  if (!existsSync(target)) {
    return false;
  }

  const stats = lstatSync(target);
  if (stats.isSymbolicLink()) {
    return sourceOwnedBySkillpacks(readlinkSync(target));
  }

  if (isManagedSkillDir(target)) {
    const source = managedMarkerField(target, 'source');
    return (
      targetManagedBySkillpacks(target)
      && (
        sourceOwnedBySkillpacks(source)
        || sourceLooksLikeLegacyGlobalSkillpacksInstall(source, tool, skillName)
      )
    );
  }

  return false;
}

function globalRepoSkillInstalls(homeRoot = homedir()) {
  const installs = [];

  for (const tool of TOOLS) {
    const root = join(homeRoot, `.${tool}`, 'skills');
    if (!existsSync(root)) {
      continue;
    }

    for (const entry of readdirSync(root).sort((a, b) => a.localeCompare(b))) {
      const target = join(root, entry);
      if (globalRepoSkillInstallOwned(target, tool, entry)) {
        installs.push({
          tool,
          skillName: entry,
          target,
          rel: relative(homeRoot, target)
        });
      }
    }
  }

  return installs.sort((a, b) => comparePathStrings(a.rel, b.rel));
}

function printGlobalRepoSkillWarning(installs, homeRoot = homedir()) {
  if (installs.length === 0) {
    return;
  }

  console.log(
    `WARNING: Found ${installs.length} legacy user-home skillpacks install(s) under ${homeRoot}.`
  );
  for (const install of installs) {
    console.log(`  ${install.rel}`);
  }
  console.log('Global skill installs are retired. Recommended cleanup: npx skillpacks cleanup --global');
  console.log('To clean up and enable project-local base skills below your home directory: npx skillpacks cleanup --global --reinstall-base');
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

function installedSkillVersion(target) {
  if (!existsSync(target)) {
    return '';
  }

  const stats = lstatSync(target);
  if (stats.isSymbolicLink()) {
    return skillSourceVersion(readlinkSync(target));
  }
  if (isManagedSkillDir(target)) {
    return managedMarkerField(target, 'source_version');
  }
  return '';
}

function copyActiveSkillContent(source, target) {
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    if (entry.name === 'archive' || entry.name === SKILL_LINK_MARKER) {
      continue;
    }

    const sourceEntry = join(source, entry.name);
    const targetEntry = join(target, entry.name);
    if (entry.isDirectory()) {
      mkdirSync(targetEntry, { recursive: true });
      copyActiveSkillContent(sourceEntry, targetEntry);
    } else {
      cpSync(sourceEntry, targetEntry, {
        recursive: true,
        dereference: false
      });
    }
  }
}

function writeManagedSkillMarker(target, { source, sourceVersion, sourceSha }) {
  writeFileSync(
    join(target, SKILL_LINK_MARKER),
    [
      `source=${source}`,
      'managed_by=agentic-skills',
      `source_version=${sourceVersion}`,
      `source_sha=${sourceSha}`
    ].join('\n') + '\n'
  );
}

function syncSkillInstall(source, target) {
  const oldVersion = installedSkillVersion(target);
  const newVersion = skillSourceVersion(source);

  if (isArchiveSource(source)) {
    const contentChanged = syncSkillLink(source, target);
    return {
      changed: contentChanged,
      contentChanged,
      metadataChanged: false,
      oldVersion,
      newVersion
    };
  }

  const currentSha = skillContentSha(source);
  if (existsSync(target)) {
    const stats = lstatSync(target);
    if (stats.isSymbolicLink()) {
      unlinkSync(target);
    } else if (isManagedSkillDir(target)) {
      const currentSource = managedMarkerField(target, 'source');
      const recordedSha = managedMarkerField(target, 'source_sha');
      if (oldVersion === newVersion && recordedSha === currentSha) {
        if (currentSource !== source) {
          writeManagedSkillMarker(target, {
            source,
            sourceVersion: newVersion,
            sourceSha: currentSha
          });
          return {
            changed: false,
            contentChanged: false,
            metadataChanged: true,
            oldVersion,
            newVersion
          };
        }
        return {
          changed: false,
          contentChanged: false,
          metadataChanged: false,
          oldVersion,
          newVersion
        };
      }
      rmSync(target, { recursive: true, force: true });
    } else {
      console.error(`WARNING: ${target} exists and is not repo-managed, skipping`);
      return {
        changed: false,
        contentChanged: false,
        metadataChanged: false,
        oldVersion,
        newVersion
      };
    }
  }

  mkdirSync(target, { recursive: true });
  writeManagedSkillMarker(target, {
    source,
    sourceVersion: newVersion,
    sourceSha: currentSha
  });

  copyActiveSkillContent(source, target);

  return {
    changed: true,
    contentChanged: true,
    metadataChanged: false,
    oldVersion,
    newVersion
  };
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
  const result = syncSkillInstall(effective.source, target);

  if (result.changed) {
    const rel = `.${tool}/skills/${skillName}`;
    const suffix = effective.usingPinned ? ' (pinned)' : '';
    const version = result.newVersion || 'unknown';
    if (effective.usingPinned) {
      if (result.oldVersion) {
        console.log(`Updated ${rel} ${result.oldVersion} -> ${version}${suffix}`);
      } else {
        console.log(`Installed ${rel} @ ${version}${suffix}`);
      }
    } else {
      if (result.oldVersion && result.oldVersion !== version) {
        console.log(`Updated ${rel} ${result.oldVersion} -> ${version}`);
      } else if (!result.oldVersion) {
        console.log(`Installed ${rel} @ ${version}`);
      }
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

function writePackProjectConfig(projectRoot, manifest, pack, packs) {
  const existing = readProjectConfig(projectRoot);
  let next = existing
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
  next = applyEnabledSkillDependencies(next, manifest);
  return writeProjectConfigIfChanged(projectRoot, next);
}

function projectConfigText(config) {
  return `${JSON.stringify(config, null, 2)}\n`;
}

function projectConfigsEqual(left, right) {
  return projectConfigText(left) === projectConfigText(right);
}

function writeProjectConfigIfChanged(projectRoot, next) {
  const existing = readProjectConfig(projectRoot);
  if (existing && projectConfigsEqual(existing, next)) {
    return false;
  }
  writeProjectConfig(projectRoot, next);
  return true;
}

function nextBaseSkillsProjectConfig(projectRoot, existing = readProjectConfig(projectRoot)) {
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
  return next;
}

function writeBaseProjectConfig(projectRoot) {
  const next = nextBaseSkillsProjectConfig(projectRoot);
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
  let changed = false;
  for (const tool of TOOLS) {
    for (const skill of packSkillEntries(manifest, pack, tool)) {
      if (linkSkill(projectRoot, tool, skill.name, skillSourceDir(skill), config)) {
        changed = true;
      }
      if (linkRequiredBaseSkills(projectRoot, manifest, tool, skill, config)) {
        changed = true;
      }
    }
  }

  const packs = [...enabledPacks(readProjectConfig(projectRoot)), pack]
    .filter((candidate, index, all) => all.indexOf(candidate) === index);
  if (writePackProjectConfig(projectRoot, manifest, pack, packs)) {
    console.log('Updated .agents/project.json');
    changed = true;
  }
  return changed;
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
  const baseSkill = !pack && hasBaseSkill(manifest, skillName);
  if (!pack && !baseSkill) {
    const hibernatedPacks = hibernatedPacksForSkill(skillName);
    if (hibernatedPacks.length > 0) {
      throw new Error(`ERROR: PoketoWork kanban skill '${skillName}' is archived in hibernated pack(s): ${hibernatedPacks.join(', ')}`);
    }
    throw new Error(`Skill '${skillName}' not found in any pack. Available packs: ${availablePacksInline(manifest)}`);
  }

  const config = readProjectConfig(projectRoot);
  let changed = false;
  for (const tool of TOOLS) {
    const skill = pack
      ? findSkillEntry(manifest, pack, tool, skillName)
      : findBaseSkillEntry(manifest, tool, skillName);
    if (skill) {
      if (linkSkill(projectRoot, tool, skillName, skillSourceDir(skill), config)) {
        changed = true;
      }
      if (linkRequiredBaseSkills(projectRoot, manifest, tool, skill, config)) {
        changed = true;
      }
    }
  }

  let next = ensureProjectConfigForSkill(projectRoot);
  const enabledSkills = next.enabled_skills && typeof next.enabled_skills === 'object'
    ? { ...next.enabled_skills }
    : {};
  enabledSkills[skillName] = pack || 'base';
  next.enabled_skills = enabledSkills;
  next = applyEnabledSkillDependencies(next, manifest);
  if (writeProjectConfigIfChanged(projectRoot, next)) {
    console.log(`Updated .agents/project.json (skill: ${skillName} from ${pack ? `pack: ${pack}` : 'base'})`);
    changed = true;
  }
  return changed;
}

function removeEnabledSkill(projectRoot, manifest, skillName) {
  const existing = readProjectConfig(projectRoot);
  if (!existing) {
    return;
  }

  let next = { ...existing };
  if (next.enabled_skills && typeof next.enabled_skills === 'object') {
    const enabledSkills = { ...next.enabled_skills };
    delete enabledSkills[skillName];
    if (Object.keys(enabledSkills).length > 0) {
      next.enabled_skills = enabledSkills;
    } else {
      delete next.enabled_skills;
    }
  }
  next = applyEnabledSkillDependencies(next, manifest);
  writeProjectConfigIfChanged(projectRoot, next);
}

function removeSingleSkill(projectRoot, manifest, skillName) {
  const config = readProjectConfig(projectRoot);
  const enabledSkillPack = config?.enabled_skills?.[skillName];
  const activePack = findPackForSkill(manifest, skillName);
  const activeBaseSkill = hasBaseSkill(manifest, skillName);
  const hibernatedPacks = hibernatedPacksForSkill(skillName);

  if (!enabledSkillPack && !activePack && !activeBaseSkill && hibernatedPacks.length === 0) {
    throw new Error(`Skill '${skillName}' not found in any pack`);
  }

  for (const tool of TOOLS) {
    if (removeRepoSkillInstall(targetPath(projectRoot, tool, skillName))) {
      console.log(`Removed .${tool}/skills/${skillName}`);
    }
  }

  const before = readProjectConfig(projectRoot);
  removeEnabledSkill(projectRoot, manifest, skillName);
  const after = readProjectConfig(projectRoot);
  if (!projectConfigsEqual(before, after)) {
    console.log(`Updated .agents/project.json (removed skill: ${skillName})`);
  }
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
  if (writePackProjectConfig(projectRoot, manifest, pack, packs)) {
    console.log('Updated .agents/project.json');
  }
}

function enabledSkillEntries(config) {
  if (!config?.enabled_skills || typeof config.enabled_skills !== 'object') {
    return [];
  }
  return Object.entries(config.enabled_skills);
}

function enabledSkillDependencyEntries(config) {
  if (!config?.enabled_skill_dependencies || typeof config.enabled_skill_dependencies !== 'object') {
    return [];
  }
  return Object.entries(config.enabled_skill_dependencies);
}

function skillRequiredBaseSkills(skill) {
  return Array.isArray(skill?.required_base_skills)
    ? skill.required_base_skills.filter(Boolean)
    : [];
}

function addRequiredBaseSkillDependencies(dependencies, skill) {
  for (const requiredBaseSkill of skillRequiredBaseSkills(skill)) {
    if (!dependencies.has(requiredBaseSkill)) {
      dependencies.set(requiredBaseSkill, new Set());
    }
    const conventions = dependencies.get(requiredBaseSkill);
    if (Array.isArray(skill.required_conventions) && skill.required_conventions.includes('briefing-slides')) {
      conventions.add('briefing-slides');
    } else {
      conventions.add('required_base_skills');
    }
  }
}

function dependencyEntriesForConfig(manifest, config) {
  const dependencies = new Map();

  for (const pack of enabledPacks(config)) {
    for (const skill of manifestSkills(manifest).filter((candidate) => {
      return installableSkill(candidate) && candidate.pack === pack;
    })) {
      addRequiredBaseSkillDependencies(dependencies, skill);
    }
  }

  for (const [skillName, pack] of enabledSkillEntries(config)) {
    for (const skill of manifestSkills(manifest).filter((candidate) => {
      return installableSkill(candidate)
        && candidate.name === skillName
        && (pack === 'base' ? candidate.scope === 'base' : candidate.pack === pack);
    })) {
      addRequiredBaseSkillDependencies(dependencies, skill);
    }
  }

  return [...dependencies.entries()]
    .map(([skillName, reasons]) => [skillName, [...reasons].sort((a, b) => a.localeCompare(b))])
    .sort(([left], [right]) => left.localeCompare(right));
}

function applyEnabledSkillDependencies(config, manifest) {
  const next = { ...config };
  const dependencies = Object.fromEntries(dependencyEntriesForConfig(manifest, next));
  if (Object.keys(dependencies).length > 0) {
    next.enabled_skill_dependencies = dependencies;
  } else {
    delete next.enabled_skill_dependencies;
  }
  return next;
}

function requiredBaseSkillEntriesForSkill(manifest, tool, skill) {
  return skillRequiredBaseSkills(skill)
    .map((skillName) => findBaseSkillEntry(manifest, tool, skillName))
    .filter(Boolean);
}

function linkRequiredBaseSkills(projectRoot, manifest, tool, skill, config) {
  let changed = false;
  for (const requiredBaseSkill of requiredBaseSkillEntriesForSkill(manifest, tool, skill)) {
    if (linkSkill(projectRoot, tool, requiredBaseSkill.name, skillSourceDir(requiredBaseSkill), config)) {
      changed = true;
    }
  }
  return changed;
}

function staleProjectPackError(pack, location, reason = '') {
  const detail = reason ? ` ${reason}` : '';
  return new Error(
    `Stale pack entry '${pack}' in .agents/project.json ${location}.${detail} ` +
      `Run 'npx skillpacks remove ${pack}' or edit .agents/project.json to remove or rename it.`
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
      const baseSkill = !canonical && hasBaseSkill(manifest, skillName);
      const nextPack = canonical || (baseSkill ? 'base' : pack);
      enabledSkills[skillName] = nextPack;
      if (nextPack !== pack) {
        changed = true;
      }
    }
    next.enabled_skills = enabledSkills;
  }

  const nextWithDependencies = applyEnabledSkillDependencies(next, manifest);
  if (
    JSON.stringify(nextWithDependencies.enabled_skill_dependencies || null)
    !== JSON.stringify(next.enabled_skill_dependencies || null)
  ) {
    changed = true;
  }
  Object.assign(next, nextWithDependencies);

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

    if (syncSkillInstall(source, join(root, skillName)).changed) {
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

    if (syncSkillInstall(source, join(root, skillName)).changed) {
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

  for (const [skillName] of dependencyEntriesForConfig(manifest, config)) {
    expected.add(skillName);
  }

  for (const skillName of Object.keys(pinnedVersions(config))) {
    expected.add(skillName);
  }

  return expected;
}

function expectedSkillInstallEntries(manifest, config, projectRoot) {
  const entries = [];
  const seen = new Set();

  function add(tool, skillName, sourceDir) {
    const effective = effectiveSourceForSkill(sourceDir, skillName, config);
    const target = targetPath(projectRoot, tool, skillName);
    const key = relativeProjectPath(projectRoot, target);
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    entries.push({
      tool,
      skillName,
      source: effective.source,
      target,
      rel: key,
      version: skillSourceVersion(effective.source)
    });
  }

  if (baseSkillsEnabled(config)) {
    for (const tool of TOOLS) {
      for (const skill of baseSkillEntries(manifest, tool)) {
        add(tool, skill.name, skillSourceDir(skill));
      }
    }
  }

  for (const pack of enabledPacks(config)) {
    for (const tool of TOOLS) {
      for (const skill of packSkillEntries(manifest, pack, tool)) {
        add(tool, skill.name, skillSourceDir(skill));
      }
    }
  }

  for (const [skillName, pack] of enabledSkillEntries(config)) {
    for (const tool of TOOLS) {
      const skill = pack === 'base'
        ? findBaseSkillEntry(manifest, tool, skillName)
        : findSkillEntry(manifest, pack, tool, skillName);
      if (skill) {
        add(tool, skillName, skillSourceDir(skill));
      }
    }
  }

  for (const [skillName] of dependencyEntriesForConfig(manifest, config)) {
    for (const tool of TOOLS) {
      const skill = findBaseSkillEntry(manifest, tool, skillName);
      if (skill) {
        add(tool, skillName, skillSourceDir(skill));
      }
    }
  }

  return entries.sort((a, b) => comparePathStrings(a.rel, b.rel));
}

function plannedExpectedSkillChange(entry) {
  if (!existsSync(entry.target)) {
    return {
      type: 'install',
      skillName: entry.skillName,
      target: entry.rel,
      fromVersion: '',
      toVersion: entry.version
    };
  }

  const stats = lstatSync(entry.target);
  if (stats.isSymbolicLink()) {
    const currentSource = readlinkSync(entry.target);
    if (!sourceOwnedBySkillpacks(currentSource)) {
      return {
        type: 'skip',
        skillName: entry.skillName,
        target: entry.rel,
        reason: 'not repo-managed'
      };
    }
    if (currentSource === entry.source) {
      return null;
    }
    return {
      type: 'update',
      skillName: entry.skillName,
      target: entry.rel,
      fromVersion: skillSourceVersion(currentSource),
      toVersion: entry.version
    };
  }

  if (!isManagedSkillDir(entry.target)) {
    return {
      type: 'skip',
      skillName: entry.skillName,
      target: entry.rel,
      reason: 'not repo-managed'
    };
  }

  const currentSha = skillContentSha(entry.source);
  const currentSource = managedMarkerField(entry.target, 'source');
  const recordedSha = managedMarkerField(entry.target, 'source_sha');
  const fromVersion = managedMarkerField(entry.target, 'source_version');

  if (fromVersion === entry.version && recordedSha === currentSha) {
    return null;
  }

  return {
    type: 'update',
    skillName: entry.skillName,
    target: entry.rel,
    fromVersion,
    toVersion: entry.version
  };
}

function readOnlyReconciledConfig(manifest, config) {
  if (!config) {
    return null;
  }

  const next = { ...config };

  if (Array.isArray(config.enabled_packs)) {
    const packs = [];
    for (const pack of config.enabled_packs) {
      const canonical = reconcileStoredPack(manifest, pack, 'enabled_packs');
      if (!packs.includes(canonical)) {
        packs.push(canonical);
      }
    }
    next.enabled_packs = packs;
  }

  if (config.enabled_skills && typeof config.enabled_skills === 'object') {
    const enabledSkills = {};
    for (const [skillName, pack] of Object.entries(config.enabled_skills)) {
      const canonical = findPackForSkill(manifest, skillName);
      const baseSkill = !canonical && hasBaseSkill(manifest, skillName);
      enabledSkills[skillName] = canonical || (baseSkill ? 'base' : pack);
    }
    next.enabled_skills = enabledSkills;
  }

  return applyEnabledSkillDependencies(next, manifest);
}

function readOnlyReconciledProjectConfig(projectRoot, manifest) {
  return readOnlyReconciledConfig(manifest, readProjectConfig(projectRoot));
}

function readOnlyBaseSkillsProjectConfig(projectRoot, manifest) {
  return readOnlyReconciledConfig(manifest, nextBaseSkillsProjectConfig(projectRoot));
}

function planRefreshProject({ manifest, projectRoot, config = null }) {
  config = config || readOnlyReconciledProjectConfig(projectRoot, manifest);
  const packs = enabledPacks(config);
  const skills = enabledSkillEntries(config).map(([skill]) => skill);
  const base = baseSkillsEnabled(config);

  if (!base && packs.length === 0 && skills.length === 0) {
    throw new Error('No enabled packs or skills in .agents/project.json');
  }

  const expected = expectedSkillNames(manifest, config);
  const plan = {
    installs: [],
    updates: [],
    removals: [],
    skips: []
  };

  const expectedEntries = expectedSkillInstallEntries(manifest, config, projectRoot);
  const expectedTargets = new Set(expectedEntries.map((entry) => entry.rel));

  for (const entry of expectedEntries) {
    const change = plannedExpectedSkillChange(entry);
    if (!change) {
      continue;
    }
    if (change.type === 'install') {
      plan.installs.push(change);
    } else if (change.type === 'update') {
      plan.updates.push(change);
    } else if (change.type === 'skip') {
      plan.skips.push(change);
    }
  }

  for (const target of installedSkillTargets(projectRoot)) {
    const status = skillInstallStatus(target);
    const rel = relativeProjectPath(projectRoot, target);
    const skillName = basename(target);

    if (status.status === 'not-managed') {
      plan.skips.push({
        type: 'skip',
        skillName,
        target: rel,
        reason: 'not repo-managed'
      });
      continue;
    }

    let reason = '';
    if (status.status === 'missing-source') {
      if (expectedTargets.has(rel)) {
        continue;
      }
      reason = 'source no longer exists';
    } else if (!expected.has(skillName)) {
      reason = 'pack not enabled';
    }

    if (reason) {
      plan.removals.push({
        type: 'remove',
        skillName,
        target: rel,
        reason
      });
    }
  }

  return plan;
}

function planProjectLocalBaseSkills({ manifest, projectRoot }) {
  const existing = readProjectConfig(projectRoot);
  const next = readOnlyBaseSkillsProjectConfig(projectRoot, manifest);
  const plan = planRefreshProject({ manifest, projectRoot, config: next });
  return {
    configChanged: !projectConfigsEqual(existing, next),
    baseSkillsChanged: existing?.base_skills !== true,
    plan
  };
}

function planChangeCount(plan) {
  return plan.installs.length + plan.updates.length + plan.removals.length;
}

function printRefreshDryRunProjectPlan(plan) {
  console.log(
    `  Proposed: ${plan.installs.length} install, ${plan.updates.length} update, ${plan.removals.length} remove.`
  );

  for (const item of plan.installs) {
    const version = item.toVersion || 'unknown';
    console.log(`  install  ${item.target} @ ${version}`);
  }
  for (const item of plan.updates) {
    console.log(`  update   ${item.target} (${item.fromVersion || '?'} -> ${item.toVersion || '?'})`);
  }
  for (const item of plan.removals) {
    console.log(`  remove   ${item.target} (${item.reason})`);
  }
  for (const item of plan.skips) {
    console.log(`  skip     ${item.target} (${item.reason})`);
  }

  if (planChangeCount(plan) === 0 && plan.skips.length === 0) {
    console.log('  No refresh changes proposed.');
  }
}

function affectedRefreshItems(projectPlans) {
  const items = [];
  for (const project of projectPlans) {
    for (const change of [...project.plan.installs, ...project.plan.updates, ...project.plan.removals]) {
      items.push({
        project: project.rel,
        skillName: change.skillName,
        target: change.target,
        type: change.type
      });
    }
  }
  return items.sort((a, b) => {
    return comparePathStrings(`${a.project}/${a.target}/${a.type}`, `${b.project}/${b.target}/${b.type}`);
  });
}

export function printSessionReloadNotice() {
  console.log('');
  console.log('Skill installs changed. Claude Code and Codex may keep the skill list loaded when the current session started.');
  console.log('Claude Code: use /reload-skills to rescan skills. /clear starts a new empty-context conversation and can also pick up the refreshed registry. Restart Claude Code if .claude/skills did not exist when the session started or the skill is still invisible.');
  console.log('Codex: start a fresh Codex CLI session if the $ skill list does not show newly installed or removed project-local skills.');
}

function printInstallNoChanges({ packs, skills }) {
  if (packs.length === 0 && skills.length === 1) {
    console.log('Skill already installed!');
    return;
  }
  if (packs.length === 1 && skills.length === 0) {
    console.log('Pack already installed!');
    return;
  }
  console.log('Requested packs and skills already installed!');
}

export async function initProject({ manifest, projectRoot = process.cwd() }) {
  return withProjectLock(projectRoot, 'init', async () => {
    installBaseSkills(projectRoot, manifest);
    syncManagedConventionDocs(projectRoot, manifest);
    writeBaseProjectConfig(projectRoot);
    console.log('Updated .agents/project.json (base skills enabled)');
    console.log(`Initialized project base skills to ${manifestPackageLabel(manifest)}.`);
    printSessionReloadNotice();
    return 0;
  });
}

function enableProjectLocalBaseSkills(projectRoot, manifest, lockCommand = 'cleanup --reinstall-base') {
  return withProjectLock(projectRoot, lockCommand, async () => {
    const next = nextBaseSkillsProjectConfig(projectRoot);

    if (writeProjectConfigIfChanged(projectRoot, next)) {
      console.log('Updated .agents/project.json (base skills enabled)');
    }

    reconcileProjectConfig(projectRoot, manifest);
    const synced = syncExpectedSkillRoots(projectRoot, manifest);
    const docsChanged = syncManagedConventionDocs(projectRoot, manifest);
    const removed = pruneOrphanedSkillRoots({ manifest, projectRoot });
    console.log(`Refreshed project base skills to ${manifestPackageLabel(manifest)}.`);
    if (docsChanged) {
      console.log('Refreshed managed convention docs.');
    }
    if (synced > 0 || removed > 0) {
      printSessionReloadNotice();
    }
    return 0;
  });
}

function cloneProjectConfig(config) {
  return JSON.parse(JSON.stringify(config));
}

function removeBuildInPublicConfig(config) {
  if (!config?.alignment || typeof config.alignment !== 'object' || Array.isArray(config.alignment)) {
    return { config, removed: [] };
  }

  const next = cloneProjectConfig(config);
  const removed = [];
  for (const key of BIP_CONFIG_KEYS) {
    if (Object.hasOwn(next.alignment, key)) {
      delete next.alignment[key];
      removed.push(`alignment.${key}`);
    }
  }

  if (Object.keys(next.alignment).length === 0) {
    delete next.alignment;
  }

  return { config: next, removed };
}

async function cleanupBuildInPublicConfigs({ rootDir, dryRun, commandLabel }) {
  const roots = discoverProjectRoots(rootDir);
  const changes = [];

  for (const root of roots) {
    const config = readProjectConfig(root);
    const result = removeBuildInPublicConfig(config);
    if (result.removed.length === 0) {
      continue;
    }

    changes.push({
      root,
      rel: relative(rootDir, root) || '.',
      removed: result.removed,
      config: result.config
    });
  }

  if (dryRun) {
    if (changes.length === 0) {
      console.log(`Dry run. No Build-In-Public project config found under ${rootDir}.`);
      return changes;
    }
    for (const change of changes) {
      console.log(`Would remove ${change.removed.join(', ')} from ${change.rel}/.agents/project.json`);
    }
    console.log(`Dry run. Would remove Build-In-Public config from ${changes.length} project(s) under ${rootDir}.`);
    return changes;
  }

  if (changes.length === 0) {
    console.log(`No Build-In-Public project config found under ${rootDir}.`);
    return changes;
  }

  for (const change of changes) {
    await withProjectLock(change.root, commandLabel, async () => {
      const current = readProjectConfig(change.root);
      const result = removeBuildInPublicConfig(current);
      if (result.removed.length === 0) {
        return 0;
      }
      writeProjectConfig(change.root, result.config);
      console.log(`Removed ${result.removed.join(', ')} from ${change.rel}/.agents/project.json`);
      return 0;
    });
  }

  console.log(`Removed Build-In-Public config from ${changes.length} project(s) under ${rootDir}.`);
  return changes;
}

function displayProjectTarget(rootDir, projectRoot, target) {
  const projectRel = relative(rootDir, projectRoot) || '.';
  const targetRel = relativeProjectPath(projectRoot, target);
  return projectRel === '.' ? `./${targetRel}` : `${projectRel}/${targetRel}`;
}

async function cleanupDeprecatedAliasInstalls({ rootDir, dryRun, commandLabel }) {
  const roots = discoverProjectRoots(rootDir);
  const changes = [];

  for (const root of roots) {
    for (const tool of TOOLS) {
      for (const [skillName, replacement] of DEPRECATED_ALIAS_REPLACEMENTS) {
        const target = targetPath(root, tool, skillName);
        if (!existsSync(target) || !isManagedSkillDir(target) || !targetManagedBySkillpacks(target)) {
          continue;
        }

        changes.push({
          root,
          target,
          display: displayProjectTarget(rootDir, root, target),
          reason: `deprecated alias replaced by ${replacement}`
        });
      }
    }
  }

  if (dryRun) {
    if (changes.length === 0) {
      console.log(`Dry run. No deprecated alias skill installs found under ${rootDir}.`);
      return changes;
    }
    for (const change of changes) {
      console.log(`Would remove ${change.display} (${change.reason})`);
    }
    console.log(`Dry run. Would remove ${changes.length} deprecated alias skill install(s) under ${rootDir}.`);
    return changes;
  }

  if (changes.length === 0) {
    console.log(`No deprecated alias skill installs found under ${rootDir}.`);
    return changes;
  }

  for (const change of changes) {
    await withProjectLock(change.root, commandLabel, async () => {
      if (existsSync(change.target) && isManagedSkillDir(change.target) && targetManagedBySkillpacks(change.target)) {
        rmSync(change.target, { recursive: true, force: true });
        console.log(`Removed ${change.display} (${change.reason})`);
      }
      return 0;
    });
  }

  console.log(`Removed ${changes.length} deprecated alias skill install(s) under ${rootDir}.`);
  return changes;
}

export async function uninstallGlobal({
  homeRoot = homedir(),
  manifest = null,
  reinstallBase = false,
  rootDir = process.cwd(),
  cleanupScope = 'default',
  dryRun = false
} = {}) {
  const commandParts = ['cleanup'];
  if (cleanupScope === 'global') {
    commandParts.push('--global');
  } else if (cleanupScope === 'all') {
    commandParts.push('--all');
  }
  if (reinstallBase) {
    commandParts.push('--reinstall-base');
  }
  const commandLabel = commandParts.join(' ');
  const installs = globalRepoSkillInstalls(homeRoot);
  let removed = installs.length;

  if (dryRun) {
    for (const install of installs) {
      console.log(`Would remove ${install.rel}`);
    }
    console.log(`Dry run. Would remove ${removed} repo-managed base skill install(s) from ${homeRoot}.`);
  } else {
    removed = 0;
    for (const install of installs) {
      if (removeRepoSkillInstall(install.target, {
        tool: install.tool,
        skillName: install.skillName,
        allowLegacyGlobalSource: true
      })) {
        console.log(`Removed ${install.rel}`);
        removed += 1;
      }
    }
    console.log(`Done. Removed ${removed} repo-managed base skill install(s) from ${homeRoot}.`);
  }

  if (dryRun) {
    console.log('Base skills install project-local via `npx skillpacks init`.');
  } else {
    console.log('Base skills now install project-local via `npx skillpacks init`.');
  }

  await cleanupBuildInPublicConfigs({ rootDir, dryRun, commandLabel });
  await cleanupDeprecatedAliasInstalls({ rootDir, dryRun, commandLabel });

  if (!reinstallBase) {
    return 0;
  }

  if (!manifest) {
    throw new Error('cleanup --reinstall-base requires a packaged manifest');
  }

  const roots = discoverProjectRoots(rootDir);
  if (roots.length === 0) {
    const initTargetLabel = cleanupScope === 'global' ? 'user-home scan root' : 'current directory';
    if (dryRun) {
      console.log(`No projects with .agents/project.json found under ${rootDir}. Would initialize ${initTargetLabel} with base skills.`);
      console.log(`Dry run. Would initialize project base skills to ${manifestPackageLabel(manifest)}.`);
      return 0;
    }
    console.log(`No projects with .agents/project.json found under ${rootDir}. Initializing ${initTargetLabel}.`);
    return initProject({ manifest, projectRoot: rootDir });
  }

  if (dryRun) {
    console.log(`Dry run. Would reinstall project-local base skills in ${roots.length} project(s) under ${rootDir}.`);
    const projectPlans = [];
    const failures = [];

    for (const root of roots) {
      const rel = relative(rootDir, root) || '.';
      console.log('');
      console.log(`=== ${rel} ===`);
      try {
        const migration = planProjectLocalBaseSkills({ manifest, projectRoot: root });
        if (migration.configChanged) {
          const suffix = migration.baseSkillsChanged ? ' (base skills enabled)' : '';
          console.log(`  would update .agents/project.json${suffix}`);
        }
        printRefreshDryRunProjectPlan(migration.plan);
        projectPlans.push({ rel, plan: migration.plan, configChanged: migration.configChanged });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`  failed: ${message}`);
        failures.push({ rel, message });
      }
    }

    const totals = projectPlans.reduce(
      (sum, project) => {
        sum.configs += project.configChanged ? 1 : 0;
        sum.installs += project.plan.installs.length;
        sum.updates += project.plan.updates.length;
        sum.removals += project.plan.removals.length;
        sum.skips += project.plan.skips.length;
        return sum;
      },
      { configs: 0, installs: 0, updates: 0, removals: 0, skips: 0 }
    );

    console.log('');
    console.log(`Summary (${commandLabel} --dry-run): ${roots.length} project(s) scanned.`);
    for (const project of projectPlans) {
      console.log(
        `  ${project.rel}: ${project.configChanged ? 1 : 0} config, ${project.plan.installs.length} install, ${project.plan.updates.length} update, ${project.plan.removals.length} remove`
      );
    }
    if (failures.length > 0) {
      console.log('  Failures:');
      for (const failure of failures) {
        console.log(`    ${failure.rel}: ${failure.message}`);
      }
    }
    console.log(
      `  Totals: ${totals.configs} config, ${totals.installs} install, ${totals.updates} update, ${totals.removals} remove, ${totals.skips} skipped unmanaged.`
    );
    console.log('Dry run. No global skills or project files were changed.');
    return failures.length > 0 ? 1 : 0;
  }

  console.log(`Reinstalling project-local base skills in ${roots.length} project(s) under ${rootDir}.`);
  let failed = 0;
  const failures = [];
  for (const root of roots) {
    const rel = relative(rootDir, root) || '.';
    console.log('');
    console.log(`=== ${rel} ===`);
    try {
      await enableProjectLocalBaseSkills(root, manifest);
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.log(`  failed: ${message}`);
      failures.push({ rel, message });
    }
  }

  console.log('');
  console.log(`Summary (${commandLabel}): ${roots.length - failed} ok, ${failed} failed across ${roots.length} project(s).`);
  if (failures.length > 0) {
    console.log('Failures:');
    for (const failure of failures) {
      console.log(`  ${failure.rel}: ${failure.message}`);
    }
  }

  return failed > 0 ? 1 : 0;
}

export async function installResolved({ manifest, projectRoot = process.cwd(), packs = [], skills = [] }) {
  return withProjectLock(projectRoot, `install ${[...packs, ...skills].join(' ')}`.trim(), async () => {
    let changed = false;
    for (const pack of packs) {
      if (installPack(projectRoot, manifest, pack)) {
        changed = true;
      }
    }
    for (const skill of skills) {
      if (installSingleSkill(projectRoot, manifest, skill)) {
        changed = true;
      }
    }
    syncManagedConventionDocs(projectRoot, manifest);
    if (changed) {
      printSessionReloadNotice();
    } else {
      printInstallNoChanges({ packs, skills });
    }
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
        if (linkRequiredBaseSkills(projectRoot, manifest, tool, skill, config)) {
          changed += 1;
        }
      }
    }
  }

  for (const [skillName, pack] of enabledSkillEntries(config)) {
    for (const tool of TOOLS) {
      const skill = pack === 'base'
        ? findBaseSkillEntry(manifest, tool, skillName)
        : findSkillEntry(manifest, pack, tool, skillName);
      if (skill && linkSkill(projectRoot, tool, skillName, skillSourceDir(skill), config)) {
        changed += 1;
      }
      if (skill && linkRequiredBaseSkills(projectRoot, manifest, tool, skill, config)) {
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
  const sourcePath = resolvePackagedPath('packs/base/codex/provision-agentic-config/SKILL.md');
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
      const docsChanged = syncManagedConventionDocs(projectRoot, manifest);
      const removed = pruneOrphanedSkillRoots({ manifest, projectRoot });
      if (synced === 0 && removed === 0 && !docsChanged) {
        console.log('No generated skill-root changes needed.');
      } else {
        console.log(`Generated skill-root cleanup changed ${synced + removed + (docsChanged ? 1 : 0)} item(s).`);
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

  const refreshCmd = existsSync(join(checkoutRoot, '.git'))
    ? `${checkoutRoot}/scripts/pack.sh refresh`
    : 'npx skillpacks refresh';

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
        console.log(`  unknown  ${rel} — run \`${refreshCmd}\` to enable drift tracking`);
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

  const shouldCheckConventionDocs = found
    || Boolean(readProjectConfig(projectRoot))
    || existsSync(managedConventionDocsDir(projectRoot));
  if (shouldCheckConventionDocs) {
    console.log('Convention doc drift (.agents/skillpacks/docs):');
    const docStatuses = conventionDocStatuses(projectRoot);
    if (docStatuses.length === 0) {
      console.log('  (no packaged convention docs found)');
    }
    for (const doc of docStatuses) {
      const rel = `${MANAGED_CONVENTION_DOC_ROOT}/${doc.installPath}`;
      if (doc.status === 'ok') {
        console.log(`  ok       ${rel}`);
      } else if (doc.status === 'missing') {
        console.log(`  missing  ${rel}`);
        anyStale = true;
      } else if (doc.status === 'stale') {
        console.log(`  STALE    ${rel}`);
        anyStale = true;
      }
    }
  }

  if (anyStale) {
    console.log('');
    console.log(`Fix: ${refreshCmd}`);
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

    if (!dryRun && removed > 0) {
      printSessionReloadNotice();
    }
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

    const synced = syncExpectedSkillRoots(projectRoot, manifest);
    const docsChanged = syncManagedConventionDocs(projectRoot, manifest);
    const removed = pruneOrphanedSkillRoots({ manifest, projectRoot });
    console.log(`Refreshed project skills to ${manifestPackageLabel(manifest)}.`);
    if (docsChanged) {
      console.log('Refreshed managed convention docs.');
    }
    if (synced > 0 || removed > 0) {
      printSessionReloadNotice();
    }
    return 0;
  });
}

export async function runAcrossProjects({
  rootDir = process.cwd(),
  label,
  run,
  summarizeFailures = false
} = {}) {
  const roots = discoverProjectRoots(rootDir);

  if (roots.length === 0) {
    console.log(`No projects with .agents/project.json found under ${rootDir}`);
    return 0;
  }

  let succeeded = 0;
  let flagged = 0;
  let failed = 0;
  const failures = [];

  for (const root of roots) {
    const rel = relative(rootDir, root) || '.';
    console.log('');
    console.log(`=== ${rel} ===`);
    try {
      const code = await run(root);
      if (code !== 0) {
        flagged += 1;
      } else {
        succeeded += 1;
      }
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.log(`  failed: ${message}`);
      failures.push({ rel, message });
    }
  }

  console.log('');
  console.log(
    `Summary${label ? ` (${label})` : ''}: ${succeeded} ok, ${flagged} flagged, ${failed} failed across ${roots.length} project(s).`
  );
  if (summarizeFailures && failures.length > 0) {
    console.log('Failures:');
    for (const failure of failures) {
      console.log(`  ${failure.rel}: ${failure.message}`);
    }
  }

  return failed > 0 || flagged > 0 ? 1 : 0;
}

export async function refreshAllProjects({
  manifest,
  rootDir = process.cwd(),
  dryRun = false,
  homeRoot = homedir()
} = {}) {
  const globalInstalls = globalRepoSkillInstalls(homeRoot);
  printGlobalRepoSkillWarning(globalInstalls, homeRoot);
  if (globalInstalls.length > 0) {
    console.log('');
  }

  if (dryRun) {
    const roots = discoverProjectRoots(rootDir);

    if (roots.length === 0) {
      console.log(`No projects with .agents/project.json found under ${rootDir}`);
      return globalInstalls.length > 0 ? 1 : 0;
    }

    const projectPlans = [];
    const failures = [];

    for (const root of roots) {
      const rel = relative(rootDir, root) || '.';
      console.log('');
      console.log(`=== ${rel} ===`);
      try {
        const plan = planRefreshProject({ manifest, projectRoot: root });
        printRefreshDryRunProjectPlan(plan);
        projectPlans.push({ rel, plan });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`  failed: ${message}`);
        failures.push({ rel, message });
      }
    }

    const totals = projectPlans.reduce(
      (sum, project) => {
        sum.installs += project.plan.installs.length;
        sum.updates += project.plan.updates.length;
        sum.removals += project.plan.removals.length;
        sum.skips += project.plan.skips.length;
        return sum;
      },
      { installs: 0, updates: 0, removals: 0, skips: 0 }
    );
    const safe = failures.length === 0 && globalInstalls.length === 0;
    const affected = affectedRefreshItems(projectPlans);

    console.log('');
    console.log(`Summary (refresh --all --dry-run): ${roots.length} project(s) scanned.`);
    for (const project of projectPlans) {
      console.log(
        `  ${project.rel}: ${project.plan.installs.length} install, ${project.plan.updates.length} update, ${project.plan.removals.length} remove`
      );
    }
    if (failures.length > 0) {
      console.log('  Failures:');
      for (const failure of failures) {
        console.log(`    ${failure.rel}: ${failure.message}`);
      }
    }
    console.log(
      `  Totals: ${totals.installs} install, ${totals.updates} update, ${totals.removals} remove, ${totals.skips} skipped unmanaged.`
    );
    if (affected.length > 0) {
      console.log('  Affected skills:');
      for (const item of affected) {
        console.log(`    ${item.project}: ${item.type} ${item.skillName} (${item.target})`);
      }
    } else {
      console.log('  Affected skills: none');
    }
    if (!safe) {
      console.log('  Unsafe reasons:');
      if (globalInstalls.length > 0) {
        console.log(
          `    - Found ${globalInstalls.length} legacy user-home skillpacks install(s) under ${homeRoot}.`
        );
        console.log('      Cleanup: npx skillpacks cleanup --global');
      }
      if (failures.length > 0) {
        console.log(`    - ${failures.length} project(s) failed dry-run planning; see Failures above.`);
      }
    }
    console.log(`Safe to run: ${safe ? 'yes' : 'no'}`);
    if (safe) {
      console.log('Recommended command: skillpacks refresh --all');
    }

    return safe ? 0 : 1;
  }

  const projectExitCode = await runAcrossProjects({
    rootDir,
    label: 'refresh --all',
    run: (root) => refreshProject({ manifest, projectRoot: root }),
    summarizeFailures: true
  });
  return globalInstalls.length > 0 ? 1 : projectExitCode;
}

export async function doctorAllProjects({ manifest, rootDir = process.cwd(), args = [] } = {}) {
  return runAcrossProjects({
    rootDir,
    label: 'doctor --all',
    run: (root) => doctorProject({ manifest, projectRoot: root, args })
  });
}

export async function statusAllProjects({ rootDir = process.cwd() } = {}) {
  return runAcrossProjects({
    rootDir,
    label: 'status --all',
    run: (root) => printProjectStatus(root)
  });
}
