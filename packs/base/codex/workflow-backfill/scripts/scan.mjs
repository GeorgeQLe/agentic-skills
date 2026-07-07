#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const positional = args.filter((arg) => arg !== '--json');
const targetRoot = resolve(positional[0] || process.cwd());
const tools = ['claude', 'codex'];

function readText(path) {
  return readFileSync(path, 'utf8');
}

function readJson(path) {
  try {
    return JSON.parse(readText(path));
  } catch {
    return null;
  }
}

function parseKeyValue(text) {
  const fields = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^([^=\s]+)=(.*)$/);
    if (match) fields[match[1]] = match[2];
  }
  return fields;
}

function parseFrontmatter(text) {
  const fields = {};
  const lines = text.split(/\r?\n/);
  if (lines[0] !== '---') return fields;
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index] === '---') break;
    const match = lines[index].match(/^([^:]+):\s*(.*)$/);
    if (match) fields[match[1].trim()] = match[2].trim();
  }
  return fields;
}

function parseList(value) {
  if (!value) return [];
  const trimmed = String(value).trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return [trimmed].filter(Boolean);
  return trimmed
    .slice(1, -1)
    .split(',')
    .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

function listDir(path) {
  if (!existsSync(path)) return [];
  return readdirSync(path).sort((a, b) => a.localeCompare(b));
}

function rel(path) {
  return relative(targetRoot, path) || '.';
}

function installedSkills() {
  const skills = [];
  for (const tool of tools) {
    const root = join(targetRoot, `.${tool}`, 'skills');
    for (const entry of listDir(root)) {
      const skillRoot = join(root, entry);
      const skillPath = join(skillRoot, 'SKILL.md');
      if (!existsSync(skillPath)) continue;

      const text = readText(skillPath);
      const frontmatter = parseFrontmatter(text);
      const markerPath = join(skillRoot, '.agentic-skills-managed');
      const marker = existsSync(markerPath) ? parseKeyValue(readText(markerPath)) : null;
      const requiredConventions = parseList(frontmatter.required_conventions);

      skills.push({
        platform: tool,
        name: frontmatter.name || entry,
        path: rel(skillRoot),
        version: frontmatter.version || null,
        release_lane: frontmatter.release_lane || 'stable',
        required_conventions: requiredConventions,
        requires_briefing_slides: requiredConventions.includes('briefing-slides'),
        marker,
        marker_status: marker ? markerStatus(marker, frontmatter) : 'missing'
      });
    }
  }
  return skills.sort((a, b) => `${a.platform}/${a.name}`.localeCompare(`${b.platform}/${b.name}`));
}

function markerStatus(marker, frontmatter) {
  const missing = ['source_version', 'source_sha'].filter((field) => !marker[field]);
  if (missing.length > 0) return `incomplete:${missing.join(',')}`;
  if (frontmatter.version && marker.source_version !== frontmatter.version) return 'version-mismatch';
  return 'recorded';
}

function projectConfig() {
  return readJson(join(targetRoot, '.agents', 'project.json'));
}

function dependencyGaps(skills, config) {
  const gaps = [];
  for (const tool of tools) {
    const installedNames = new Set(skills.filter((skill) => skill.platform === tool).map((skill) => skill.name));
    const needsBriefing = skills.some((skill) => skill.platform === tool && skill.requires_briefing_slides);
    const configNeedsBriefing = installedNames.size > 0 && Object.values(config?.enabled_skill_dependencies || {})
      .flat()
      .includes('briefing-slides');
    if ((needsBriefing || configNeedsBriefing) && !installedNames.has('create-briefing-slides')) {
      gaps.push({
        platform: tool,
        missing_skill: 'create-briefing-slides',
        reason: needsBriefing ? 'installed-skill-requires-briefing-slides' : 'project-config-dependency'
      });
    }
  }
  return gaps;
}

function htmlFiles(dirName) {
  const root = join(targetRoot, dirName);
  return listDir(root)
    .filter((entry) => entry.endsWith('.html') && entry !== 'index.html')
    .map((entry) => join(root, entry))
    .filter((path) => statSync(path).isFile());
}

function ownerForPage(file, skillNames) {
  const stem = basename(file, '.html');
  return skillNames.find((name) => stem === name || stem.startsWith(`${name}-`)) || null;
}

function reviewGateHint(text) {
  return /Compile Responses|approval_status|required_gate_status|gate_answers|section_feedback/.test(text);
}

function canonicalTargetHint(text) {
  return /\b(research|design|specs)\/[^<>"'\s]+|prototype|target_artifact|target_path/.test(text);
}

function pageCandidates(skills) {
  const briefingOwners = new Set(
    skills
      .filter((skill) => skill.requires_briefing_slides)
      .map((skill) => skill.name)
  );
  const ownerNames = [...briefingOwners].sort((a, b) => b.length - a.length || a.localeCompare(b));
  const candidates = [];

  for (const sourceType of ['alignment', 'interrogation']) {
    for (const file of htmlFiles(sourceType)) {
      const owner = ownerForPage(file, ownerNames);
      if (!owner) continue;
      const stem = basename(file, '.html');
      const deckPath = join(targetRoot, 'briefing-slides', `${stem}.html`);
      const text = readText(file);
      candidates.push({
        source_type: sourceType,
        source_path: rel(file),
        owner_skill: owner,
        expected_deck: rel(deckPath),
        deck_exists: existsSync(deckPath),
        review_gate_present: reviewGateHint(text),
        canonical_target_hint: canonicalTargetHint(text)
      });
    }
  }

  return candidates.sort((a, b) => a.source_path.localeCompare(b.source_path));
}

function conventionMetadata() {
  const metadataPath = join(targetRoot, '.agents', 'skillpacks', 'docs', '.skillpacks-managed.json');
  const metadata = readJson(metadataPath);
  return {
    path: existsSync(metadataPath) ? rel(metadataPath) : null,
    source_package: metadata?.source_package || null
  };
}

const config = projectConfig();
const skills = installedSkills();
const scan = {
  target_root: targetRoot,
  project_config: config ? rel(join(targetRoot, '.agents', 'project.json')) : null,
  convention_docs: conventionMetadata(),
  installed_skills: skills,
  dependency_gaps: dependencyGaps(skills, config),
  pages: pageCandidates(skills)
};

if (jsonMode) {
  process.stdout.write(`${JSON.stringify(scan, null, 2)}\n`);
} else {
  console.log(`target: ${scan.target_root}`);
  console.log(`installed skills: ${scan.installed_skills.length}`);
  for (const skill of scan.installed_skills) {
    const markerPackage = skill.marker?.source_package || scan.convention_docs.source_package || 'missing';
    console.log(`${skill.platform}/${skill.name} ${skill.version || 'unknown'} marker=${skill.marker_status} source_package=${markerPackage}`);
  }
  console.log(`dependency gaps: ${scan.dependency_gaps.length}`);
  for (const gap of scan.dependency_gaps) {
    console.log(`${gap.platform}: missing ${gap.missing_skill} (${gap.reason})`);
  }
  console.log(`page candidates: ${scan.pages.length}`);
  for (const page of scan.pages) {
    const deckStatus = page.deck_exists ? 'deck-exists' : 'deck-missing';
    console.log(`${page.source_path} -> ${page.expected_deck} ${deckStatus}`);
  }
}
