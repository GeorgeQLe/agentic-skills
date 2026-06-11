#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const PACKS_DIR = join(ROOT, 'packs');
const GLOBAL_DIR = join(ROOT, 'global', 'claude');
const OUT = join(ROOT, 'docs', 'skillmap.excalidraw');
const OUT_HTML = join(ROOT, 'alignment', 'skillmap.html');
const SHOWCASE_DATA_JS = join(ROOT, 'apps', 'skills-showcase', 'public', 'assets', 'skills-data.js');

// --- Data collection ---

function getSkills(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();
}

function getAllPacks() {
  const packs = {};
  for (const d of readdirSync(PACKS_DIR, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const claudeDir = join(PACKS_DIR, d.name, 'claude');
    packs[d.name] = getSkills(claudeDir);
  }
  return packs;
}

function getGlobalSkills() {
  return getSkills(GLOBAL_DIR);
}

function getShowcaseCounts() {
  const fallback = {
    platformEntries: 0,
    sourceCount: 0,
    activePacks: 0,
    skillBearingPacks: 0,
    uniqueMirroredSkills: 0,
    uniquePackSkills: 0,
    uniqueGlobalSkills: 0,
    packPlatformEntries: 0,
    globalPlatformEntries: 0,
  };

  if (!existsSync(SHOWCASE_DATA_JS)) return fallback;

  const source = readFileSync(SHOWCASE_DATA_JS, 'utf8');
  const match = source.match(/window\.SKILLS_SHOWCASE_DATA\s*=\s*(\{[\s\S]*\});?\s*$/);
  if (!match) return fallback;

  const data = JSON.parse(match[1]);
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const uniqueMirroredSkills = new Set();
  const uniquePackSkills = new Set();
  const uniqueGlobalSkills = new Set();
  const skillBearingPacks = new Set();
  let packPlatformEntries = 0;
  let globalPlatformEntries = 0;

  for (const skill of skills) {
    const key = skill.mirrorKey || skill.name;
    if (key) uniqueMirroredSkills.add(key);
    if (skill.scope === 'global') {
      globalPlatformEntries += 1;
      if (key) uniqueGlobalSkills.add(key);
    } else {
      packPlatformEntries += 1;
      if (key) uniquePackSkills.add(key);
      if (skill.pack) skillBearingPacks.add(skill.pack);
    }
  }

  return {
    platformEntries: Number(data.skillCount) || skills.length,
    sourceCount: Number(data.sourceCount) || 0,
    activePacks: Number(data.packCount) || (Array.isArray(data.packs) ? data.packs.length : 0),
    skillBearingPacks: skillBearingPacks.size,
    uniqueMirroredSkills: uniqueMirroredSkills.size,
    uniquePackSkills: uniquePackSkills.size,
    uniqueGlobalSkills: uniqueGlobalSkills.size,
    packPlatformEntries,
    globalPlatformEntries,
  };
}

// --- Deck/domain mapping ---

const DOMAINS = {
  rapid_vard:   { label: 'VARD (Rapid)', packs: ['vard'], fill: '#fff3bf', border: '#fab005' },
  rapid_ord:    { label: 'ORD (Rapid)', packs: ['ord'], fill: '#fff3bf', border: '#fab005' },
  business:     { label: 'Business', packs: ['business-research', 'customer-lifecycle', 'business-growth', 'business-ops', 'business-app'], fill: '#d3f9d8', border: '#2f9e44' },
  creator:      { label: 'Creator', packs: ['creator-foundation', 'creator-media', 'youtube-ops'], fill: '#ffe3e3', border: '#e03131' },
  game:         { label: 'Game', packs: ['game'], fill: '#e5dbff', border: '#7950f2' },
  devtool:      { label: 'Devtool', packs: ['devtool'], fill: '#d0ebff', border: '#228be6' },
  execution:    { label: 'Execution', packs: ['exec-loop', 'exec-profile', 'guided-walkthrough'], fill: '#d3f9d8', border: '#40c057' },
  code:         { label: 'Code Quality', packs: ['code-review', 'code-quality', 'code-debug', 'code-maintenance'], fill: '#dbe4ff', border: '#4c6ef5' },
  product:      { label: 'Product Design', packs: ['product-design', 'product-testing'], fill: '#fcc2d7', border: '#e64980' },
  alignment:    { label: 'Alignment', packs: ['alignment-loop', 'alignment-page-admin', 'research-admin'], fill: '#ffe8cc', border: '#fd7e14' },
  session:      { label: 'Session & Knowledge', packs: ['session-analytics', 'knowledge-check', 'context-transfer'], fill: '#c5f6fa', border: '#15aabf' },
  skilldev:     { label: 'Skill Dev', packs: ['skill-dev', 'agentic-skills-bench'], fill: '#e9fac8', border: '#82c91e' },
  infra:        { label: 'Infrastructure', packs: ['gitops', 'release-ops', 'docs-health', 'monorepo', 'repo-maintenance', 'report-gen', 'remotion', 'teardown', 'website-polish', 'agent-bridge', 'agent-work-admin', 'poketowork-kanban', 'project-fleet'], fill: '#e9ecef', border: '#868e96' },
};

// --- Excalidraw element factories ---

let idCounter = 0;
function nextId(prefix) {
  return `${prefix}-${++idCounter}`;
}

function makeRect(id, x, y, w, h, opts = {}) {
  return {
    id,
    type: 'rectangle',
    x, y,
    width: w,
    height: h,
    angle: 0,
    strokeColor: opts.strokeColor || '#1e1e1e',
    backgroundColor: opts.backgroundColor || 'transparent',
    fillStyle: 'solid',
    strokeWidth: opts.strokeWidth || 1,
    strokeStyle: opts.strokeStyle || 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: opts.groupIds || [],
    frameId: null,
    index: opts.index || 'a0',
    roundness: { type: 3 },
    seed: Math.abs(hashCode(id)),
    version: 1,
    versionNonce: Math.abs(hashCode(id + 'v')),
    isDeleted: false,
    boundElements: opts.boundElements || null,
    updated: 1,
    link: null,
    locked: false,
  };
}

function makeText(id, x, y, text, opts = {}) {
  const fontSize = opts.fontSize || 16;
  const width = opts.width || Math.max(text.length * (fontSize * 0.6), 40);
  const height = opts.height || (fontSize + 4);
  return {
    id,
    type: 'text',
    x, y,
    width,
    height,
    angle: 0,
    strokeColor: opts.strokeColor || '#1e1e1e',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 1,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: 100,
    groupIds: opts.groupIds || [],
    frameId: null,
    index: opts.index || 'a0',
    roundness: null,
    seed: Math.abs(hashCode(id)),
    version: 1,
    versionNonce: Math.abs(hashCode(id + 'v')),
    isDeleted: false,
    boundElements: null,
    updated: 1,
    link: null,
    locked: false,
    text,
    rawText: text,
    fontSize,
    fontFamily: opts.fontFamily || 2,
    textAlign: opts.textAlign || 'left',
    verticalAlign: opts.verticalAlign || 'top',
    containerId: opts.containerId || null,
    originalText: text,
    autoResize: true,
    lineHeight: 1.25,
  };
}

function makeArrow(id, points, opts = {}) {
  const [start, ...rest] = points;
  return {
    id,
    type: 'arrow',
    x: start[0],
    y: start[1],
    width: Math.abs(rest[rest.length - 1][0]),
    height: Math.abs(rest[rest.length - 1][1]),
    angle: 0,
    strokeColor: opts.strokeColor || '#1e1e1e',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: opts.strokeWidth || 2,
    strokeStyle: opts.strokeStyle || 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    index: opts.index || 'a0',
    roundness: { type: 2 },
    seed: Math.abs(hashCode(id)),
    version: 1,
    versionNonce: Math.abs(hashCode(id + 'v')),
    isDeleted: false,
    boundElements: null,
    updated: 1,
    link: null,
    locked: false,
    points: [[0, 0], ...rest.map(p => [p[0] - start[0], p[1] - start[1]])],
    lastCommittedPoint: null,
    startBinding: opts.startBinding || null,
    endBinding: opts.endBinding || null,
    startArrowhead: null,
    endArrowhead: 'arrow',
    elbowed: false,
  };
}

function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}

// --- Pack box builder ---

const PACK_W = 280;
const HEADER_H = 36;
const SKILL_LINE_H = 22;
const PACK_PAD = 8;
const PACK_GAP_X = 20;
const PACK_GAP_Y = 20;

function packBoxHeight(skillCount) {
  return HEADER_H + PACK_PAD + Math.max(skillCount, 1) * SKILL_LINE_H + PACK_PAD;
}

function makePackBox(packName, skills, x, y, fill, border, groupId) {
  const h = packBoxHeight(skills.length);
  const elements = [];
  const gids = [groupId];

  // Body rectangle
  elements.push(makeRect(`pack-body-${packName}`, x, y, PACK_W, h, {
    strokeColor: border,
    backgroundColor: '#ffffff',
    groupIds: gids,
  }));

  // Header bar
  elements.push(makeRect(`pack-header-${packName}`, x, y, PACK_W, HEADER_H, {
    strokeColor: border,
    backgroundColor: fill,
    groupIds: gids,
  }));

  // Header text
  elements.push(makeText(`pack-title-${packName}`, x + 10, y + 8, packName, {
    fontSize: 16,
    fontFamily: 2,
    strokeColor: '#1e1e1e',
    groupIds: gids,
    width: PACK_W - 20,
  }));

  // Skill list
  if (skills.length === 0) {
    elements.push(makeText(`skill-${packName}-empty`, x + 10, y + HEADER_H + PACK_PAD, '(no skills yet)', {
      fontSize: 13,
      fontFamily: 3,
      strokeColor: '#868e96',
      groupIds: gids,
      width: PACK_W - 20,
    }));
  } else {
    skills.forEach((skill, i) => {
      elements.push(makeText(`skill-${packName}-${skill}`, x + 10, y + HEADER_H + PACK_PAD + i * SKILL_LINE_H, skill, {
        fontSize: 13,
        fontFamily: 3,
        strokeColor: '#495057',
        groupIds: gids,
        width: PACK_W - 20,
      }));
    });
  }

  return { elements, width: PACK_W, height: h };
}

// --- Layout engine ---

function layoutRow(packDataMap, domainKeys, startX, startY, rowLabel) {
  const elements = [];
  const packPositions = {};
  let curX = startX;
  let maxH = 0;

  // Row label
  elements.push(makeText(nextId('row-label'), startX, startY - 30, rowLabel, {
    fontSize: 20,
    fontFamily: 2,
    strokeColor: '#495057',
  }));

  for (const dk of domainKeys) {
    const domain = DOMAINS[dk];
    if (!domain) continue;

    // Domain sub-label
    elements.push(makeText(nextId('domain-label'), curX, startY - 10, domain.label, {
      fontSize: 12,
      fontFamily: 2,
      strokeColor: domain.border,
    }));

    for (const packName of domain.packs) {
      const skills = packDataMap[packName] || [];
      const groupId = `group-${packName}`;
      const box = makePackBox(packName, skills, curX, startY + 10, domain.fill, domain.border, groupId);
      elements.push(...box.elements);
      packPositions[packName] = { x: curX, y: startY + 10, w: box.width, h: box.height };
      maxH = Math.max(maxH, box.height);
      curX += PACK_W + PACK_GAP_X;
    }

    curX += 20; // extra gap between domains
  }

  return { elements, packPositions, nextY: startY + 10 + maxH + PACK_GAP_Y + 40, rowWidth: curX - startX };
}

// --- Main ---

const allPacks = getAllPacks();
const globalSkills = getGlobalSkills();
const showcaseCounts = getShowcaseCounts();

const mappedPacks = Object.keys(allPacks).length;
const claudePackRoots = Object.values(allPacks).reduce((sum, s) => sum + s.length, 0);
const activePacks = showcaseCounts.activePacks || mappedPacks;
const uniquePackSkills = showcaseCounts.uniquePackSkills || claudePackRoots;
const uniqueGlobalSkills = showcaseCounts.uniqueGlobalSkills || globalSkills.length;
const platformEntries = showcaseCounts.platformEntries || claudePackRoots + globalSkills.length;
const uniqueMirroredSkills = showcaseCounts.uniqueMirroredSkills || uniquePackSkills + uniqueGlobalSkills;
const skillBearingPacks = showcaseCounts.skillBearingPacks || mappedPacks;
const packPlatformEntries = showcaseCounts.packPlatformEntries || claudePackRoots;
const globalPlatformEntries = showcaseCounts.globalPlatformEntries || globalSkills.length;

const allElements = [];
let curY = 40;
const startX = 40;
const allPackPositions = {};

// Title
allElements.push(makeText(nextId('title'), startX, curY, 'agentic-skills — Skill Map', {
  fontSize: 28,
  fontFamily: 2,
  strokeColor: '#1e1e1e',
  width: 500,
}));
curY += 36;
allElements.push(makeText(nextId('subtitle'), startX, curY, `${activePacks} packs · ${uniquePackSkills} unique pack skills · ${uniqueGlobalSkills} unique global skills · ${platformEntries} platform entries`, {
  fontSize: 14,
  fontFamily: 2,
  strokeColor: '#868e96',
  width: 900,
}));
curY += 50;

// Row 1: Rapid Decks
const row1 = layoutRow(allPacks, ['rapid_vard', 'rapid_ord'], startX, curY, 'Rapid Decks');
allElements.push(...row1.elements);
Object.assign(allPackPositions, row1.packPositions);
curY = row1.nextY;

// Row 2: Business AFPS
const row2 = layoutRow(allPacks, ['business', 'creator'], startX, curY, 'Business AFPS');
allElements.push(...row2.elements);
Object.assign(allPackPositions, row2.packPositions);
curY = row2.nextY;

// Row 3: Devtool AFPS
const row3 = layoutRow(allPacks, ['devtool'], startX, curY, 'Devtool AFPS');
allElements.push(...row3.elements);
Object.assign(allPackPositions, row3.packPositions);
curY = row3.nextY;

// Row 4: Game AFPS
const row4 = layoutRow(allPacks, ['game'], startX, curY, 'Game AFPS');
allElements.push(...row4.elements);
Object.assign(allPackPositions, row4.packPositions);
curY = row4.nextY;

// Row 5: Support & Cross-cutting (split into sub-rows for width)
const row4a = layoutRow(allPacks, ['execution', 'code', 'product'], startX, curY, 'Support & Cross-cutting');
allElements.push(...row4a.elements);
Object.assign(allPackPositions, row4a.packPositions);
curY = row4a.nextY;

const row4b = layoutRow(allPacks, ['alignment', 'session', 'skilldev'], startX, curY, '');
allElements.push(...row4b.elements);
Object.assign(allPackPositions, row4b.packPositions);
curY = row4b.nextY;

// Row 5: Infrastructure
const infraPacks = DOMAINS.infra.packs;
const infraRow1 = infraPacks.slice(0, 7);
const infraRow2 = infraPacks.slice(7);

const row5keys1 = ['infra_r1'];
DOMAINS.infra_r1 = { ...DOMAINS.infra, label: 'Infrastructure', packs: infraRow1 };
const row5a = layoutRow(allPacks, ['infra_r1'], startX, curY, 'Infrastructure');
allElements.push(...row5a.elements);
Object.assign(allPackPositions, row5a.packPositions);
curY = row5a.nextY;

DOMAINS.infra_r2 = { ...DOMAINS.infra, label: '', packs: infraRow2 };
const row5b = layoutRow(allPacks, ['infra_r2'], startX, curY, '');
allElements.push(...row5b.elements);
Object.assign(allPackPositions, row5b.packPositions);
curY = row5b.nextY;

// Row 6: Global Skills
const globalGroupId = 'group-global';
const globalH = HEADER_H + PACK_PAD + globalSkills.length * SKILL_LINE_H + PACK_PAD;
const globalW = 340;

allElements.push(makeText(nextId('row-label'), startX, curY - 30, 'Global Skills', {
  fontSize: 20,
  fontFamily: 2,
  strokeColor: '#495057',
}));

allElements.push(makeRect('pack-body-global', startX, curY + 10, globalW, globalH, {
  strokeColor: '#1971c2',
  backgroundColor: '#ffffff',
  groupIds: [globalGroupId],
}));
allElements.push(makeRect('pack-header-global', startX, curY + 10, globalW, HEADER_H, {
  strokeColor: '#1971c2',
  backgroundColor: '#f8f9fa',
  groupIds: [globalGroupId],
}));
allElements.push(makeText('pack-title-global', startX + 10, curY + 18, 'global/claude', {
  fontSize: 16,
  fontFamily: 2,
  strokeColor: '#1971c2',
  groupIds: [globalGroupId],
  width: globalW - 20,
}));
globalSkills.forEach((skill, i) => {
  allElements.push(makeText(`skill-global-${skill}`, startX + 10, curY + 10 + HEADER_H + PACK_PAD + i * SKILL_LINE_H, skill, {
    fontSize: 13,
    fontFamily: 3,
    strokeColor: '#495057',
    groupIds: [globalGroupId],
    width: globalW - 20,
  }));
});

// --- Relationship arrows ---

function arrowBetween(fromPack, toPack, label, style) {
  const from = allPackPositions[fromPack];
  const to = allPackPositions[toPack];
  if (!from || !to) return;

  const startX = from.x + from.w / 2;
  const startY = from.y + from.h;
  const endX = to.x + to.w / 2;
  const endY = to.y;

  allElements.push(makeArrow(nextId(`arrow-${fromPack}-${toPack}`), [
    [startX, startY + 5],
    [endX, endY - 5],
  ], {
    strokeStyle: style || 'solid',
    strokeColor: '#868e96',
    strokeWidth: 2,
  }));

  if (label) {
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    allElements.push(makeText(nextId('arrow-label'), midX - 30, midY - 10, label, {
      fontSize: 11,
      fontFamily: 2,
      strokeColor: '#868e96',
    }));
  }
}

// Graduation arrows (dashed)
arrowBetween('vard', 'business-research', 'graduate', 'dashed');
arrowBetween('ord', 'devtool', 'graduate', 'dashed');

// Canonical business flow (solid)
arrowBetween('business-research', 'customer-lifecycle', '', 'solid');
arrowBetween('customer-lifecycle', 'business-growth', '', 'solid');
arrowBetween('business-growth', 'business-ops', '', 'solid');

// --- Assemble Excalidraw file ---

const excalidrawFile = {
  type: 'excalidraw',
  version: 2,
  source: 'agentic-skills/generate-skillmap-excalidraw.mjs',
  elements: allElements,
  appState: {
    gridSize: null,
    viewBackgroundColor: '#ffffff',
  },
  files: {},
};

writeFileSync(OUT, JSON.stringify(excalidrawFile, null, 2));

// --- Alignment page HTML with inline SVG ---

function generateAlignmentHTML() {
  const svgW = curY > 2000 ? 3200 : 2800;
  const svgH = curY + 80;
  const alignmentPage = 'alignment/skillmap.html';
  const today = new Date().toISOString().slice(0, 10);

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function svgPackBox(packName, skills, x, y, fill, border) {
    const h = packBoxHeight(skills.length);
    let svg = '';
    svg += `<rect x="${x}" y="${y}" width="${PACK_W}" height="${h}" rx="6" fill="#161b22" stroke="${border}" stroke-width="1.5"/>`;
    svg += `<rect x="${x}" y="${y}" width="${PACK_W}" height="${HEADER_H}" rx="6" fill="${fill}" stroke="${border}" stroke-width="1.5"/>`;
    svg += `<rect x="${x}" y="${y + HEADER_H - 6}" width="${PACK_W}" height="6" fill="${fill}"/>`;
    svg += `<text x="${x + 10}" y="${y + 23}" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="14" font-weight="600" fill="#1e1e1e">${esc(packName)}</text>`;
    if (skills.length === 0) {
      svg += `<text x="${x + 10}" y="${y + HEADER_H + PACK_PAD + 13}" font-family="ui-monospace,SFMono-Regular,monospace" font-size="12" fill="#8b949e">(no skills yet)</text>`;
    } else {
      skills.forEach((skill, i) => {
        svg += `<text x="${x + 10}" y="${y + HEADER_H + PACK_PAD + 13 + i * SKILL_LINE_H}" font-family="ui-monospace,SFMono-Regular,monospace" font-size="12" fill="#c9d1d9">${esc(skill)}</text>`;
      });
    }
    return svg;
  }

  function svgRowLabel(x, y, text, fontSize = 18) {
    if (!text) return '';
    return `<text x="${x}" y="${y}" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="${fontSize}" font-weight="700" fill="#ffffff">${esc(text)}</text>`;
  }

  function svgDomainLabel(x, y, text, color) {
    return `<text x="${x}" y="${y}" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="11" font-weight="600" fill="${color}">${esc(text)}</text>`;
  }

  function svgArrow(x1, y1, x2, y2, dashed, label) {
    const dash = dashed ? ' stroke-dasharray="8 4"' : '';
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len, uy = dy / len;
    const tipX = x2, tipY = y2;
    const a1x = tipX - ux * 10 + uy * 5, a1y = tipY - uy * 10 - ux * 5;
    const a2x = tipX - ux * 10 - uy * 5, a2y = tipY - uy * 10 + ux * 5;
    let svg = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#8b949e" stroke-width="2"${dash}/>`;
    svg += `<polygon points="${tipX},${tipY} ${a1x},${a1y} ${a2x},${a2y}" fill="#8b949e"/>`;
    if (label) {
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      svg += `<text x="${mx}" y="${my - 6}" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="11" fill="#8b949e" text-anchor="middle">${esc(label)}</text>`;
    }
    return svg;
  }

  function svgLayoutRow(packDataMap, domainKeys, sx, sy, rowLabel) {
    let svg = '';
    let cx = sx;
    let maxH = 0;
    const positions = {};
    svg += svgRowLabel(sx, sy - 12, rowLabel);
    for (const dk of domainKeys) {
      const domain = DOMAINS[dk];
      if (!domain) continue;
      svg += svgDomainLabel(cx, sy + 4, domain.label, domain.border);
      for (const packName of domain.packs) {
        const skills = packDataMap[packName] || [];
        const py = sy + 14;
        svg += svgPackBox(packName, skills, cx, py, domain.fill, domain.border);
        const h = packBoxHeight(skills.length);
        positions[packName] = { x: cx, y: py, w: PACK_W, h };
        maxH = Math.max(maxH, h);
        cx += PACK_W + PACK_GAP_X;
      }
      cx += 20;
    }
    return { svg, positions, nextY: sy + 14 + maxH + PACK_GAP_Y + 40, rowWidth: cx - sx };
  }

  let svgContent = '';
  let y = 50;
  const sx = 40;
  const positions = {};

  svgContent += `<text x="${sx}" y="${y}" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="24" font-weight="700" fill="#ffffff">agentic-skills — Skill Map</text>`;
  y += 24;
  svgContent += `<text x="${sx}" y="${y}" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="13" fill="#8b949e">${activePacks} packs · ${uniquePackSkills} unique pack skills · ${uniqueGlobalSkills} unique global skills · ${platformEntries} platform entries</text>`;
  y += 44;

  const rows = [
    { domains: ['rapid_vard', 'rapid_ord'], label: 'Rapid Decks' },
    { domains: ['business', 'creator'], label: 'Business AFPS' },
    { domains: ['devtool'], label: 'Devtool AFPS' },
    { domains: ['game'], label: 'Game AFPS' },
    { domains: ['execution', 'code', 'product'], label: 'Support & Cross-cutting' },
    { domains: ['alignment', 'session', 'skilldev'], label: '' },
  ];

  for (const row of rows) {
    const r = svgLayoutRow(allPacks, row.domains, sx, y, row.label);
    svgContent += r.svg;
    Object.assign(positions, r.positions);
    y = r.nextY;
  }

  const infraPacks1 = DOMAINS.infra.packs.slice(0, 7);
  const infraPacks2 = DOMAINS.infra.packs.slice(7);
  DOMAINS._ir1 = { ...DOMAINS.infra, label: 'Infrastructure', packs: infraPacks1 };
  DOMAINS._ir2 = { ...DOMAINS.infra, label: '', packs: infraPacks2 };
  const ir1 = svgLayoutRow(allPacks, ['_ir1'], sx, y, 'Infrastructure');
  svgContent += ir1.svg; Object.assign(positions, ir1.positions); y = ir1.nextY;
  const ir2 = svgLayoutRow(allPacks, ['_ir2'], sx, y, '');
  svgContent += ir2.svg; Object.assign(positions, ir2.positions); y = ir2.nextY;

  // Global skills box
  const gH = HEADER_H + PACK_PAD + globalSkills.length * SKILL_LINE_H + PACK_PAD;
  const gW = 340;
  svgContent += svgRowLabel(sx, y - 12, 'Global Skills');
  svgContent += `<rect x="${sx}" y="${y + 14}" width="${gW}" height="${gH}" rx="6" fill="#161b22" stroke="#1971c2" stroke-width="1.5"/>`;
  svgContent += `<rect x="${sx}" y="${y + 14}" width="${gW}" height="${HEADER_H}" rx="6" fill="#1c2333" stroke="#1971c2" stroke-width="1.5"/>`;
  svgContent += `<rect x="${sx}" y="${y + 14 + HEADER_H - 6}" width="${gW}" height="6" fill="#1c2333"/>`;
  svgContent += `<text x="${sx + 10}" y="${y + 37}" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="14" font-weight="600" fill="#58a6ff">global/claude</text>`;
  globalSkills.forEach((skill, i) => {
    svgContent += `<text x="${sx + 10}" y="${y + 14 + HEADER_H + PACK_PAD + 13 + i * SKILL_LINE_H}" font-family="ui-monospace,SFMono-Regular,monospace" font-size="12" fill="#c9d1d9">${esc(skill)}</text>`;
  });
  y += 14 + gH + 40;

  // Arrows
  function svgArrowBetween(from, to, label, dashed) {
    const fp = positions[from], tp = positions[to];
    if (!fp || !tp) return '';
    return svgArrow(fp.x + fp.w / 2, fp.y + fp.h, tp.x + tp.w / 2, tp.y, dashed, label);
  }
  svgContent += svgArrowBetween('vard', 'business-research', 'graduate', true);
  svgContent += svgArrowBetween('ord', 'devtool', 'graduate', true);
  svgContent += svgArrowBetween('business-research', 'customer-lifecycle', '', false);
  svgContent += svgArrowBetween('customer-lifecycle', 'business-growth', '', false);
  svgContent += svgArrowBetween('business-growth', 'business-ops', '', false);

  // Compute max width from positions
  let maxX = gW + sx + 40;
  for (const p of Object.values(positions)) {
    maxX = Math.max(maxX, p.x + p.w + 40);
  }

  const sketchDefs = `<defs><filter id="sketchy" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" seed="2" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/></filter></defs><style>rect,line,polygon{filter:url(#sketchy)}</style>`;
  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${maxX} ${y}" width="100%" height="auto" style="background:#0d1117;border-radius:8px">${sketchDefs}${svgContent}</svg>`;

  // Domain legend data
  const legendDomains = [
    { label: 'Rapid (VARD/ORD)', fill: '#fff3bf', border: '#fab005' },
    { label: 'Business', fill: '#d3f9d8', border: '#2f9e44' },
    { label: 'Creator', fill: '#ffe3e3', border: '#e03131' },
    { label: 'Game', fill: '#e5dbff', border: '#7950f2' },
    { label: 'Devtool', fill: '#d0ebff', border: '#228be6' },
    { label: 'Execution', fill: '#d3f9d8', border: '#40c057' },
    { label: 'Code Quality', fill: '#dbe4ff', border: '#4c6ef5' },
    { label: 'Product Design', fill: '#fcc2d7', border: '#e64980' },
    { label: 'Alignment', fill: '#ffe8cc', border: '#fd7e14' },
    { label: 'Session & Knowledge', fill: '#c5f6fa', border: '#15aabf' },
    { label: 'Skill Dev', fill: '#e9fac8', border: '#82c91e' },
    { label: 'Infrastructure', fill: '#e9ecef', border: '#868e96' },
    { label: 'Global', fill: '#1c2333', border: '#1971c2' },
  ];

  // Pack stats table rows sorted by domain
  const domainOrder = ['rapid_vard', 'rapid_ord', 'business', 'creator', 'game', 'devtool', 'execution', 'code', 'product', 'alignment', 'session', 'skilldev', 'infra'];
  let statsRows = '';
  for (const dk of domainOrder) {
    const domain = DOMAINS[dk];
    if (!domain || dk.startsWith('_')) continue;
    for (const pn of domain.packs) {
      const skills = allPacks[pn] || [];
      statsRows += `<tr><td><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${domain.fill};border:1px solid ${domain.border};margin-right:6px"></span>${esc(pn)}</td><td>${domain.label}</td><td>${skills.length}</td><td style="font-family:ui-monospace,monospace;font-size:0.85rem;color:var(--text-muted)">${skills.length ? esc(skills.join(', ')) : '<em>(empty)</em>'}</td></tr>`;
    }
  }

  const html = `<!doctype html>
<html lang="en" data-alignment-category="product-design" data-visual-tier="visual">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Skill Map — agentic-skills</title>
<style>
:root { --bg:#0d1117; --surface:#161b22; --border:#30363d; --text:#c9d1d9; --text-muted:#8b949e; --accent:#58a6ff; --green:#3fb950; --red:#f85149; --orange:#d29922; --purple:#bc8cff; --chart-1:#58a6ff; --chart-2:#3fb950; --chart-3:#d29922; --chart-4:#bc8cff; --chart-5:#f85149; --chart-6:#79c0ff; --chart-7:#f0883e; --chart-8:#a5d6ff; }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--text); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; line-height:1.55; }
main { width:min(1180px, calc(100% - 32px)); margin:0 auto; padding:32px 0 56px; max-width:100%; overflow-wrap:break-word; }
h1 { color:#fff; margin:0 0 8px; font-size:2.2rem; }
h2 { color:var(--accent); margin:0; font-size:1.45rem; }
h3 { color:#fff; margin:24px 0 8px; font-size:1.05rem; }
p { margin:12px 0; } a { color:var(--accent); } code { color:#fff; background:#0b1320; border:1px solid var(--border); padding:1px 5px; border-radius:4px; }
.status { display:inline-flex; min-height:44px; align-items:center; padding:10px 16px; border:1px solid var(--purple); color:#fff; background:#1c2333; margin:16px 0; }
.lead { color:#fff; font-size:1.05rem; }
.toc, section, .compile-box { border:1px solid var(--border); background:var(--surface); border-radius:8px; padding:18px; margin:18px 0; }
.toc ol { margin:8px 0 0; columns:2; }
.section-head { display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; align-items:center; }
.stat-grid { display:grid; grid-template-columns:repeat(4,minmax(min(210px,100%),1fr)); gap:12px; margin:18px 0; }
.stat-grid div { border:1px solid var(--border); background:#0f1623; padding:14px; border-radius:8px; }
.stat-grid strong { display:block; color:#fff; font-size:1.35rem; } .stat-grid span { color:var(--text-muted); }
.table-wrap { overflow-x:auto; margin:14px 0; border:1px solid var(--border); border-radius:8px; }
table { border-collapse:collapse; width:100%; min-width:720px; } th,td { border-bottom:1px solid var(--border); padding:10px 12px; vertical-align:top; text-align:left; } th { background:var(--surface); color:#fff; } tr:last-child td { border-bottom:0; }
ul,ol { padding-left:22px; } li { margin:4px 0; }
.callout { border:1px solid var(--purple); background:#1c2333; padding:14px; border-radius:8px; margin:16px 0; }
.legend { display:flex; flex-wrap:wrap; gap:10px; margin:14px 0; }
.legend-item { display:flex; align-items:center; gap:6px; font-size:0.85rem; }
.legend-swatch { width:16px; height:16px; border-radius:3px; }
.map-wrap { overflow-x:auto; margin:18px 0; border:1px solid var(--border); border-radius:8px; }
.section-feedback { display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin:12px 0 16px; padding:10px; border:1px solid var(--border); border-radius:8px; background:#0f1623; }
.section-feedback span { color:var(--text-muted); }
button, .radio-group label { min-height:44px; padding:10px 16px; border-radius:6px; border:1px solid var(--border); background:#0d1117; color:var(--text); cursor:pointer; }
button:hover, .radio-group label:hover { border-color:var(--accent); }
button.active[data-feedback="emphasize"] { border-color:var(--green); color:#fff; background:#12351f; }
button.active[data-feedback="down"] { border-color:var(--red); color:#fff; background:#351616; }
button.active[data-feedback="needs-clarification"] { border-color:var(--orange); color:#fff; background:#33260f; }
textarea { width:100%; min-height:90px; background:#0d1117; color:var(--text); border:1px solid var(--border); border-radius:6px; padding:10px; font:inherit; }
.feedback-notes, .local-yaml, .local-yaml-actions { display:none; flex-basis:100%; }
.section-feedback.has-feedback .feedback-notes, .section-feedback.has-feedback .local-yaml-actions { display:block; }
.section-feedback.has-yaml .local-yaml { display:block; min-height:130px; }
.question-block { background:#1c2333; border:1px solid var(--purple); padding:16px; border-radius:8px; margin:16px 0; }
.radio-group { display:flex; flex-wrap:wrap; gap:8px; margin:10px 0; } .radio-group label { display:flex; align-items:center; gap:8px; }
.answer-notes { display:none; margin-top:10px; }
.question-block.has-answer .answer-notes { display:block; }
.compile-actions { display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin:12px 0; }
#compiled-yaml, #compiled-feedback-yaml { min-height:180px; }
.copy-status, #answer-status, #feedback-status { color:var(--text-muted); }
@media (max-width: 860px) { .toc ol { columns:1; } .stat-grid { grid-template-columns:repeat(2,minmax(min(210px,100%),1fr)); } main { width:min(100% - 24px, 1180px); } }
@media (max-width: 560px) { .stat-grid { grid-template-columns:1fr; } h1 { font-size:1.7rem; } table { min-width:640px; } }
</style>
</head>
<body>
<main>
<header>
  <h1>Skill Map</h1>
  <p class="lead">Visual overview of the current generated Skills Showcase inventory: ${platformEntries} platform entries, ${uniqueMirroredSkills} unique mirrored skills, ${uniquePackSkills} unique pack skills, ${uniqueGlobalSkills} unique global skills, and ${activePacks} active packs &mdash; organized by deck and domain.</p>
  <div class="status"><strong>alignment_status:</strong>&nbsp; review &nbsp; <strong>generated:</strong>&nbsp; ${today} &nbsp; <strong>artifact:</strong>&nbsp; ${alignmentPage}</div>
</header>

<nav class="toc" aria-label="Table of Contents"><h2>Table of Contents</h2><ol>
  <li><a href="#overview">System Overview</a></li>
  <li><a href="#skillmap">Interactive Skill Map</a></li>
  <li><a href="#pack-index">Pack Index</a></li>
  <li><a href="#deck-structure">Deck Structure</a></li>
  <li><a href="#review-gates">Review Gates</a></li>
  <li><a href="#compile">Compile YAML</a></li>
</ol></nav>

<!-- =========================================================== -->
<section id="overview"><div class="section-head"><h2>System Overview</h2></div>
    <div class="section-feedback" data-section="System Overview" id="feedback-overview">
      <span>Section feedback</span>
      <button type="button" data-feedback="emphasize">Emphasize</button>
      <button type="button" data-feedback="down">Thumbs down</button>
      <button type="button" data-feedback="needs-clarification">Clarification needed</button>
      <textarea class="feedback-notes" placeholder="Optional notes for this section"></textarea>
      <div class="local-yaml-actions"><button type="button" class="compile-local-feedback">Compile Feedback YAML</button><button type="button" class="copy-local-feedback">Copy YAML</button><span class="copy-status"></span></div>
      <textarea class="local-yaml" readonly></textarea>
    </div>
<div class="stat-grid" data-tts-narrative="The generated inventory contains ${platformEntries} platform entries, ${uniqueMirroredSkills} unique mirrored skills, ${uniquePackSkills} unique pack skills, ${uniqueGlobalSkills} unique global skills, ${activePacks} active packs, and ${skillBearingPacks} skill-bearing packs. The visual map below lists ${claudePackRoots} repo-managed Claude pack roots and ${globalSkills.length} global Claude roots.">
  <div><strong>${platformEntries}</strong><span>Platform entries</span></div>
  <div><strong>${uniqueMirroredSkills}</strong><span>Unique mirrored skills</span></div>
  <div><strong>${uniquePackSkills}</strong><span>Unique pack skills</span></div>
  <div><strong>${uniqueGlobalSkills}</strong><span>Unique global skills</span></div>
  <div><strong>${activePacks}</strong><span>Active packs</span></div>
  <div><strong>${skillBearingPacks}</strong><span>Skill-bearing packs</span></div>
</div>
<p>The counts above come from <code>apps/skills-showcase/public/assets/skills-data.js</code>. The SVG and pack index are a structural Claude-root map for the editable Excalidraw view; they list ${claudePackRoots} repo-managed Claude pack roots and ${globalSkills.length} global Claude roots rather than platform entries.</p>
<h3>Domain Legend</h3>
<div class="legend">
${legendDomains.map(d => `  <div class="legend-item"><div class="legend-swatch" style="background:${d.fill};border:1.5px solid ${d.border}"></div>${esc(d.label)}</div>`).join('\n')}
</div>
</section>

<!-- =========================================================== -->
<section id="skillmap"><div class="section-head"><h2>Interactive Skill Map</h2></div>
    <div class="section-feedback" data-section="Interactive Skill Map" id="feedback-skillmap">
      <span>Section feedback</span>
      <button type="button" data-feedback="emphasize">Emphasize</button>
      <button type="button" data-feedback="down">Thumbs down</button>
      <button type="button" data-feedback="needs-clarification">Clarification needed</button>
      <textarea class="feedback-notes" placeholder="Optional notes for this section"></textarea>
      <div class="local-yaml-actions"><button type="button" class="compile-local-feedback">Compile Feedback YAML</button><button type="button" class="copy-local-feedback">Copy YAML</button><span class="copy-status"></span></div>
      <textarea class="local-yaml" readonly></textarea>
    </div>
<p>All packs grouped by deck row (Rapid &rarr; Business AFPS &rarr; Devtool AFPS &rarr; Game AFPS &rarr; Support &rarr; Infrastructure &rarr; Global). Dashed arrows show graduation paths; solid arrows show canonical flow.</p>
<div class="map-wrap" data-tts-narrative="The skill map shows ${activePacks} active packs organized in deck rows: Rapid decks with VARD and ORD, Business AFPS with business and creator packs, Devtool AFPS, Game AFPS, support and cross-cutting packs, infrastructure packs, and global skills. Dashed arrows connect rapid decks to their graduation targets, and solid arrows show the canonical business flow from discovery through operations.">
${fullSvg}
</div>
<p style="color:var(--text-muted);font-size:0.85rem">Scroll horizontally to see all packs. Also available as <code>docs/skillmap.excalidraw</code> for editing in Excalidraw.</p>
</section>

<!-- =========================================================== -->
<section id="pack-index"><div class="section-head"><h2>Pack Index</h2></div>
    <div class="section-feedback" data-section="Pack Index" id="feedback-pack-index">
      <span>Section feedback</span>
      <button type="button" data-feedback="emphasize">Emphasize</button>
      <button type="button" data-feedback="down">Thumbs down</button>
      <button type="button" data-feedback="needs-clarification">Clarification needed</button>
      <textarea class="feedback-notes" placeholder="Optional notes for this section"></textarea>
      <div class="local-yaml-actions"><button type="button" class="compile-local-feedback">Compile Feedback YAML</button><button type="button" class="copy-local-feedback">Copy YAML</button><span class="copy-status"></span></div>
      <textarea class="local-yaml" readonly></textarea>
    </div>
<div class="table-wrap" data-tts-narrative="The pack index table lists all ${mappedPacks} repo-managed packs with their domain, Claude-root skill count, and Claude skill names. Current generated inventory counts are summarized above.">
<table><thead><tr><th>Pack</th><th>Domain</th><th>Skills</th><th>Skill Names</th></tr></thead><tbody>
${statsRows}
</tbody></table>
</div>
</section>

<!-- =========================================================== -->
<section id="deck-structure"><div class="section-head"><h2>Deck Structure</h2></div>
    <div class="section-feedback" data-section="Deck Structure" id="feedback-deck-structure">
      <span>Section feedback</span>
      <button type="button" data-feedback="emphasize">Emphasize</button>
      <button type="button" data-feedback="down">Thumbs down</button>
      <button type="button" data-feedback="needs-clarification">Clarification needed</button>
      <textarea class="feedback-notes" placeholder="Optional notes for this section"></textarea>
      <div class="local-yaml-actions"><button type="button" class="compile-local-feedback">Compile Feedback YAML</button><button type="button" class="copy-local-feedback">Copy YAML</button><span class="copy-status"></span></div>
      <textarea class="local-yaml" readonly></textarea>
    </div>
<div class="table-wrap" data-tts-narrative="Five decks sit on a domain by tempo model. VARD is rapid business, ORD is rapid devtool, Business AFPS is deliberate business, Devtool AFPS is deliberate devtool, and Game AFPS is deliberate game development.">
<table><thead><tr><th></th><th>Business / Consumer</th><th>Developer / OSS</th><th>Game / Playable Entertainment</th></tr></thead><tbody>
<tr><td><strong>Rapid</strong> (days)</td><td>VARD &mdash; 3 skills</td><td>ORD &mdash; 3 skills</td><td>Not defined yet</td></tr>
<tr><td><strong>Deliberate</strong> (weeks&ndash;months)</td><td>Business AFPS &mdash; 4 packs</td><td>Devtool AFPS &mdash; 1 pack, 8 skills</td><td>Game AFPS &mdash; 1 pack, 11 skills</td></tr>
</tbody></table>
</div>
<h3>Graduation Paths</h3>
<ul>
  <li><strong>VARD &rarr; Business AFPS:</strong> When an experiment shows traction (users return, share organically, revenue appears), graduate to full customer discovery and lifecycle planning.</li>
  <li><strong>ORD &rarr; Devtool AFPS:</strong> When an OSS package gains traction (npm downloads, stars, issues), graduate to full positioning, adoption strategy, and documentation depth.</li>
</ul>
<h3>Canonical Business Flow</h3>
<p><code>business-research</code> &rarr; <code>customer-lifecycle</code> &rarr; <code>business-growth</code> &rarr; <code>business-ops</code></p>
<h3>Canonical Game Flow</h3>
<p><code>game-audience</code> &rarr; <code>game-fantasy</code> &rarr; <code>game-genre-map</code> &rarr; <code>game-comparables</code> &rarr; <code>game-core-loop</code> &rarr; <code>game-prototype-test</code> &rarr; <code>game-playtest-metrics</code> &rarr; <code>game-store-page-test</code> &rarr; <code>game-launch</code> &rarr; <code>game-roadmap</code></p>
</section>

<!-- =========================================================== -->
<section id="review-gates"><div class="section-head"><h2>Review Gates</h2></div>
    <div class="section-feedback" data-section="Review Gates" id="feedback-review-gates">
      <span>Section feedback</span>
      <button type="button" data-feedback="emphasize">Emphasize</button>
      <button type="button" data-feedback="down">Thumbs down</button>
      <button type="button" data-feedback="needs-clarification">Clarification needed</button>
      <textarea class="feedback-notes" placeholder="Optional notes for this section"></textarea>
      <div class="local-yaml-actions"><button type="button" class="compile-local-feedback">Compile Feedback YAML</button><button type="button" class="copy-local-feedback">Copy YAML</button><span class="copy-status"></span></div>
      <textarea class="local-yaml" readonly></textarea>
    </div>

    <div class="question-block gate" data-section="Coverage" data-gate-type="evidence coverage" data-question-id="q-coverage">
      <h3 style="color:var(--purple);margin-top:0">Does the skill map accurately represent all packs and skills?</h3>
      <div class="radio-group">
        <label><input type="radio" name="q-coverage" value="Yes — map is complete and accurate"> <span>Yes &mdash; map is complete and accurate</span></label>
        <label><input type="radio" name="q-coverage" value="Missing packs or skills — needs update"> <span>Missing packs or skills &mdash; needs update</span></label>
        <label><input type="radio" name="q-coverage" value="Other / None of the above" data-special="other"> <span>Other / None of the above</span></label>
        <label><input type="radio" name="q-coverage" value="Need clarification" data-special="clarification"> <span>Need clarification</span></label>
      </div>
      <textarea class="answer-notes" placeholder="Additional notes, replacement answer, or clarification request"></textarea>
    </div>

    <div class="question-block gate" data-section="Domain Grouping" data-gate-type="scope" data-question-id="q-grouping">
      <h3 style="color:var(--purple);margin-top:0">Is the domain grouping correct?</h3>
      <p style="color:var(--text-muted)">Some packs could reasonably belong to multiple domains. Does the current assignment match your mental model?</p>
      <div class="radio-group">
        <label><input type="radio" name="q-grouping" value="Yes — grouping looks right"> <span>Yes &mdash; grouping looks right</span></label>
        <label><input type="radio" name="q-grouping" value="Some packs are misassigned — see notes"> <span>Some packs are misassigned &mdash; see notes</span></label>
        <label><input type="radio" name="q-grouping" value="Other / None of the above" data-special="other"> <span>Other / None of the above</span></label>
        <label><input type="radio" name="q-grouping" value="Need clarification" data-special="clarification"> <span>Need clarification</span></label>
      </div>
      <textarea class="answer-notes" placeholder="Additional notes, replacement answer, or clarification request"></textarea>
    </div>

    <div class="question-block gate" data-section="Artifact Destination" data-gate-type="artifact destination" data-question-id="q-artifact" data-target-path="alignment/skillmap.html">
      <h3 style="color:var(--purple);margin-top:0">Confirm artifact destination</h3>
      <div class="radio-group">
        <label><input type="radio" name="q-artifact" value="alignment/skillmap.html is correct"> <span><code>alignment/skillmap.html</code> is correct</span></label>
        <label><input type="radio" name="q-artifact" value="Other / None of the above" data-special="other"> <span>Other / None of the above</span></label>
        <label><input type="radio" name="q-artifact" value="Need clarification" data-special="clarification"> <span>Need clarification</span></label>
      </div>
      <textarea class="answer-notes" placeholder="Additional notes, replacement answer, or clarification request"></textarea>
    </div>
</section>

<!-- =========================================================== -->
<section id="compile" class="compile-box">
  <div class="section-head"><h2>Compile YAML</h2></div>
    <div class="section-feedback" data-section="Compile YAML" id="feedback-compile">
      <span>Section feedback</span>
      <button type="button" data-feedback="emphasize">Emphasize</button>
      <button type="button" data-feedback="down">Thumbs down</button>
      <button type="button" data-feedback="needs-clarification">Clarification needed</button>
      <textarea class="feedback-notes" placeholder="Optional notes for this section"></textarea>
      <div class="local-yaml-actions"><button type="button" class="compile-local-feedback">Compile Feedback YAML</button><button type="button" class="copy-local-feedback">Copy YAML</button><span class="copy-status"></span></div>
      <textarea class="local-yaml" readonly></textarea>
    </div>
  <p>Use feedback YAML for emphasis requests, concerns, or clarification before answering all gates. Use final answers YAML only when every required gate is answered.</p>
  <div class="compile-actions"><button type="button" id="compile-feedback">Compile Feedback YAML</button><button type="button" id="copy-feedback">Copy YAML</button><span id="feedback-status"></span></div>
  <textarea id="compiled-feedback-yaml" readonly></textarea>
  <div class="compile-actions"><button type="button" id="compile-answers" disabled>Compile Answers</button><button type="button" id="copy-answers">Copy YAML</button><span id="answer-status">3 required questions remaining</span></div>
  <textarea id="compiled-yaml" readonly></textarea>
</section>
</main>

<script>
const alignmentPage = '${alignmentPage}';
const actionFor = { emphasize: 'add-weight-to-section', down: 'investigate-and-revise', 'needs-clarification': 'clarify-before-approval' };
function yamlEscape(value) { return String(value || '').replace(/\\n/g, '\\n    '); }
function selectedFeedbackEntries() {
  return [...document.querySelectorAll('.section-feedback.has-feedback')].map(box => ({
    section: box.dataset.section,
    feedback: box.dataset.feedback,
    notes: box.querySelector('.feedback-notes').value.trim(),
    requested_agent_action: actionFor[box.dataset.feedback]
  }));
}
function unansweredQuestions() { return [...document.querySelectorAll('.gate')].filter(g => !g.querySelector('input[type="radio"]:checked')); }
function feedbackYaml(entries) {
  const unanswered = unansweredQuestions().map(g => g.dataset.questionId);
  let y = \`alignment_page: \${alignmentPage}\\nfeedback_status: revision-request\\napproval_status: not-approved\\nunanswered_required_questions:\\n\`;
  y += unanswered.length ? unanswered.map(q => \`  - \${q}\`).join('\\n') + '\\n' : '  []\\n';
  y += 'section_feedback:\\n';
  y += entries.length ? entries.map(e => \`  - section: \${yamlEscape(e.section)}\\n    feedback: \${e.feedback}\\n    requested_agent_action: \${e.requested_agent_action}\\n    notes: \${yamlEscape(e.notes)}\`).join('\\n') + '\\n' : '  []\\n';
  return y;
}
function answersYaml() {
  const gates = [...document.querySelectorAll('.gate')];
  let y = \`alignment_page: \${alignmentPage}\\napproval_status: ready-for-agent-review\\ngate_answers:\\n\`;
  for (const g of gates) {
    const checked = g.querySelector('input[type="radio"]:checked');
    const answer = checked ? checked.value : '';
    const status = answer === 'Need clarification' ? 'needs-clarification' : (answer === 'Other / None of the above' ? 'other' : 'answered');
    const notes = g.querySelector('.answer-notes').value.trim();
    y += \`  - section: \${yamlEscape(g.dataset.section)}\\n    gate_type: \${yamlEscape(g.dataset.gateType)}\\n    status: \${status}\\n    answer: \${yamlEscape(answer)}\\n\`;
    if (notes) y += \`    notes: \${yamlEscape(notes)}\\n\`;
    if (g.dataset.targetPath) y += \`    target_path: \${yamlEscape(g.dataset.targetPath)}\\n\`;
  }
  const feedback = selectedFeedbackEntries();
  y += 'section_feedback:\\n';
  y += feedback.length ? feedback.map(e => \`  - section: \${yamlEscape(e.section)}\\n    feedback: \${e.feedback}\\n    requested_agent_action: \${e.requested_agent_action}\\n    notes: \${yamlEscape(e.notes)}\`).join('\\n') + '\\n' : '  []\\n';
  return y;
}
async function copyText(text, statusEl, textarea) {
  try { await navigator.clipboard.writeText(text); statusEl.textContent = 'Copied'; }
  catch { if (textarea) { textarea.focus(); textarea.select(); } statusEl.textContent = 'Select text to copy'; }
}
function updateAnswerState() {
  const remaining = unansweredQuestions();
  const btn = document.getElementById('compile-answers');
  btn.disabled = remaining.length > 0;
  document.getElementById('answer-status').textContent = remaining.length ? \`\${remaining.length} required questions remaining\` : 'All required questions answered';
}
document.querySelectorAll('.section-feedback button[data-feedback]').forEach(btn => {
  btn.addEventListener('click', () => {
    const box = btn.closest('.section-feedback');
    if (btn.classList.contains('active')) {
      btn.classList.remove('active'); box.classList.remove('has-feedback','has-yaml'); delete box.dataset.feedback;
    } else {
      box.querySelectorAll('button[data-feedback]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); box.dataset.feedback = btn.dataset.feedback; box.classList.add('has-feedback'); box.classList.remove('has-yaml');
    }
  });
});
document.querySelectorAll('.compile-local-feedback').forEach(btn => {
  btn.addEventListener('click', () => {
    const box = btn.closest('.section-feedback');
    const entry = { section: box.dataset.section, feedback: box.dataset.feedback, notes: box.querySelector('.feedback-notes').value.trim(), requested_agent_action: actionFor[box.dataset.feedback] };
    const y = feedbackYaml([entry]);
    const area = box.querySelector('.local-yaml'); area.value = y; box.classList.add('has-yaml');
    copyText(y, box.querySelector('.copy-status'), area);
  });
});
document.querySelectorAll('.copy-local-feedback').forEach(btn => {
  btn.addEventListener('click', () => {
    const box = btn.closest('.section-feedback');
    copyText(box.querySelector('.local-yaml').value, box.querySelector('.copy-status'), box.querySelector('.local-yaml'));
  });
});
document.querySelectorAll('.gate input[type="radio"]').forEach(r => {
  r.addEventListener('change', () => { r.closest('.gate').classList.add('has-answer'); updateAnswerState(); });
});
document.getElementById('compile-feedback').addEventListener('click', () => {
  const y = feedbackYaml(selectedFeedbackEntries());
  const area = document.getElementById('compiled-feedback-yaml'); area.value = y;
  copyText(y, document.getElementById('feedback-status'), area);
});
document.getElementById('copy-feedback').addEventListener('click', () => {
  copyText(document.getElementById('compiled-feedback-yaml').value, document.getElementById('feedback-status'), document.getElementById('compiled-feedback-yaml'));
});
document.getElementById('compile-answers').addEventListener('click', () => {
  const y = answersYaml();
  const area = document.getElementById('compiled-yaml'); area.value = y;
  copyText(y, document.getElementById('answer-status'), area);
});
document.getElementById('copy-answers').addEventListener('click', () => {
  copyText(document.getElementById('compiled-yaml').value, document.getElementById('answer-status'), document.getElementById('compiled-yaml'));
});
updateAnswerState();
</script>

<script src="../scripts/alignment-tts-kokoro.js"></script>
</body>
</html>`;

  writeFileSync(OUT_HTML, html);
  return html.length;
}

const htmlSize = generateAlignmentHTML();

console.log(`Generated ${OUT}`);
console.log(`Generated ${OUT_HTML} (${(htmlSize / 1024).toFixed(1)} KB)`);
console.log(`  ${platformEntries} platform entries, ${uniqueMirroredSkills} unique mirrored skills`);
console.log(`  ${uniquePackSkills} unique pack skills, ${uniqueGlobalSkills} unique global skills, ${activePacks} active packs`);
console.log(`  map scope: ${mappedPacks} repo-managed packs, ${claudePackRoots} Claude pack roots, ${globalSkills.length} global Claude roots`);
console.log(`  ${allElements.length} Excalidraw elements`);
