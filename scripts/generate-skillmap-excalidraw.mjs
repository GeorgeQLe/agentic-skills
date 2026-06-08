#!/usr/bin/env node
import { readdirSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const PACKS_DIR = join(ROOT, 'packs');
const GLOBAL_DIR = join(ROOT, 'global', 'claude');
const OUT = join(ROOT, 'docs', 'skillmap.excalidraw');

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

// --- Deck/domain mapping ---

const DOMAINS = {
  rapid_vard:   { label: 'VARD (Rapid)', packs: ['vard'], fill: '#fff3bf', border: '#fab005' },
  rapid_ord:    { label: 'ORD (Rapid)', packs: ['ord'], fill: '#fff3bf', border: '#fab005' },
  business:     { label: 'Business', packs: ['business-discovery', 'customer-lifecycle', 'business-growth', 'business-ops', 'business-app'], fill: '#d3f9d8', border: '#2f9e44' },
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
    roughness: 0,
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
    roughness: 0,
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

const totalPacks = Object.keys(allPacks).length;
const totalSkills = Object.values(allPacks).reduce((sum, s) => sum + s.length, 0);

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
allElements.push(makeText(nextId('subtitle'), startX, curY, `${totalPacks} packs · ${totalSkills} pack skills · ${globalSkills.length} global skills`, {
  fontSize: 14,
  fontFamily: 2,
  strokeColor: '#868e96',
  width: 600,
}));
curY += 50;

// Row 1: Rapid Decks
const row1 = layoutRow(allPacks, ['rapid_vard', 'rapid_ord'], startX, curY, 'Rapid Decks');
allElements.push(...row1.elements);
Object.assign(allPackPositions, row1.packPositions);
curY = row1.nextY;

// Row 2: Business AFPS
const row2 = layoutRow(allPacks, ['business', 'creator', 'game'], startX, curY, 'Business AFPS');
allElements.push(...row2.elements);
Object.assign(allPackPositions, row2.packPositions);
curY = row2.nextY;

// Row 3: Devtool AFPS
const row3 = layoutRow(allPacks, ['devtool'], startX, curY, 'Devtool AFPS');
allElements.push(...row3.elements);
Object.assign(allPackPositions, row3.packPositions);
curY = row3.nextY;

// Row 4: Support & Cross-cutting (split into sub-rows for width)
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
arrowBetween('vard', 'business-discovery', 'graduate', 'dashed');
arrowBetween('ord', 'devtool', 'graduate', 'dashed');

// Canonical business flow (solid)
arrowBetween('business-discovery', 'customer-lifecycle', '', 'solid');
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

console.log(`Generated ${OUT}`);
console.log(`  ${totalPacks} packs, ${totalSkills} pack skills, ${globalSkills.length} global skills`);
console.log(`  ${allElements.length} Excalidraw elements`);
