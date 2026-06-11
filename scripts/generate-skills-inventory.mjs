#!/usr/bin/env node
// Regenerates the data sections of alignment/skills-inventory.html from the
// repo's SKILL.md files (global/claude/* and packs/*/claude/*). Page chrome
// (CSS, JS behavior, layout) is preserved; only the subtitle date, stats bar,
// TOC, list-view pack sections, and packCategoryMap are rewritten.
//
// Usage: node scripts/generate-skills-inventory.mjs

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const pagePath = join(repoRoot, 'alignment', 'skills-inventory.html');

// Empty packs (compatibility aliases with no claude/ skills) are skipped
// automatically. Every pack that contains skills must be listed here.
const PACK_CATEGORY = {
  'agent-bridge': 'ops', 'agent-work-admin': 'ops', 'agentic-skills-bench': 'ops',
  'alignment-loop': 'product', 'alignment-page-admin': 'ops',
  'business-research': 'business', 'business-growth': 'business', 'business-ops': 'business',
  'code-debug': 'code', 'code-maintenance': 'code', 'code-quality': 'code', 'code-review': 'code',
  'context-transfer': 'ops',
  'creator-foundation': 'media', 'customer-lifecycle': 'business',
  'devtool': 'code',
  'docs-health': 'ops', 'exec-loop': 'ops', 'exec-profile': 'ops',
  'game': 'product',
  'gitops': 'code', 'guided-walkthrough': 'ops',
  'knowledge-check': 'ops', 'monorepo': 'code',
  'ord': 'code',
  'product-design': 'product', 'product-testing': 'product',
  'project-fleet': 'ops',
  'release-ops': 'ops', 'remotion': 'media',
  'repo-maintenance': 'code', 'report-gen': 'ops',
  'research-admin': 'ops', 'session-analytics': 'ops',
  'skill-dev': 'ops', 'teardown': 'ops',
  'vard': 'product',
  'website-polish': 'code', 'youtube-ops': 'media',
};

function esc(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('—', '&mdash;')
    .replaceAll('’', '&rsquo;');
}

function readSkill(skillDir) {
  const file = join(skillDir, 'SKILL.md');
  if (!existsSync(file)) return null;
  const text = readFileSync(file, 'utf8');
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return null;
  const field = (key) => fm[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1].trim().replace(/^['"]|['"]$/g, '') ?? '';
  return { name: field('name'), version: field('version') || 'v0.0', desc: field('description') };
}

function readSkillDirs(parent) {
  if (!existsSync(parent)) return [];
  return readdirSync(parent, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => readSkill(join(parent, e.name)))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
}

const globalSkills = readSkillDirs(join(repoRoot, 'global', 'claude'));
const packs = readdirSync(join(repoRoot, 'packs'), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => ({ name: e.name, skills: readSkillDirs(join(repoRoot, 'packs', e.name, 'claude')) }))
  .filter((p) => p.skills.length > 0)
  .sort((a, b) => a.name.localeCompare(b.name));

const unmapped = packs.filter((p) => !PACK_CATEGORY[p.name]).map((p) => p.name);
if (unmapped.length) {
  console.error(`Packs missing a category in PACK_CATEGORY: ${unmapped.join(', ')}`);
  process.exit(1);
}

const sections = [{ name: 'global', category: 'global', skills: globalSkills }]
  .concat(packs.map((p) => ({ name: p.name, category: PACK_CATEGORY[p.name], skills: p.skills })));

const uniqueSkills = new Set(sections.flatMap((s) => s.skills.map((k) => k.name))).size;
const categories = new Set(sections.map((s) => s.category)).size;
const today = new Date().toLocaleDateString('en-CA');

const renderSection = (s) => {
  const rows = s.skills.map((k) => `    <div class="skill-row" data-skill="${k.name}" data-desc="${esc(k.desc)}">
      <span class="skill-name">${k.name}</span><span class="skill-version">${k.version}</span><span class="skill-desc">${esc(k.desc)}</span>
    </div>`).join('\n');
  return `<div class="pack-section${s.name === 'global' ? ' open' : ''}" data-pack="${s.name}" data-category="${s.category}" id="${s.name}">
  <div class="pack-header" onclick="togglePack(this)">
    <div><span class="pack-name">${s.name}</span> <span class="pack-badge">${s.skills.length} skill${s.skills.length === 1 ? '' : 's'}</span></div>
    <span class="pack-chevron">&#9654;</span>
  </div>
  <div class="skill-list">
${rows}
  </div>
</div>`;
};

const statsBar = `<div class="stats-bar">
  <div class="stat"><div class="stat-value">${uniqueSkills}</div><div class="stat-label">Unique Skills</div></div>
  <div class="stat"><div class="stat-value">${packs.length}</div><div class="stat-label">Packs</div></div>
  <div class="stat"><div class="stat-value">${globalSkills.length}</div><div class="stat-label">Global Skills</div></div>
  <div class="stat"><div class="stat-value">${categories}</div><div class="stat-label">Categories</div></div>
</div>`;

const toc = `<ul>
${sections.map((s) => `      <li><a href="#${s.name}">${s.name}</a> <span class="toc-count">(${s.skills.length})</span></li>`).join('\n')}
    </ul>`;

const listView = `<div class="list-view" id="listView">

${sections.map(renderSection).join('\n\n')}

</div><!-- end list view -->`;

const categoryMap = `const packCategoryMap = {
${sections.map((s) => `  '${s.name}': '${s.category}'`).join(',\n')}
};`;

let html = readFileSync(pagePath, 'utf8');

const splice = (label, pattern, replacement) => {
  if (!pattern.test(html)) {
    console.error(`Could not locate ${label} section in ${pagePath}`);
    process.exit(1);
  }
  html = html.replace(pattern, replacement);
};

splice('subtitle', /(<p class="subtitle">[^<]*&mdash; )\d{4}-\d{2}-\d{2}(<\/p>)/, `$1${today}$2`);
splice('stats bar', /<div class="stats-bar">\n(?:  <div class="stat">.*\n)+<\/div>/, statsBar);
splice('TOC', /<ul>\n(?:      <li><a href="#.*\n)+    <\/ul>/, toc);
splice('list view', /<div class="list-view" id="listView">[\s\S]*?<\/div><!-- end list view -->/, listView);
splice('packCategoryMap', /const packCategoryMap = \{[\s\S]*?\};/, categoryMap);

writeFileSync(pagePath, html);
console.log(`Updated ${pagePath}: ${uniqueSkills} unique skills, ${packs.length} packs, ${globalSkills.length} global skills, ${categories} categories (${today})`);
