import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(
  readFileSync(new URL('../dist/skillpacks-manifest.json', import.meta.url), 'utf8')
);
const generatedManifestCache = new Map();

function generatedManifestForLane(lane) {
  if (generatedManifestCache.has(lane)) {
    return generatedManifestCache.get(lane);
  }

  const result = spawnSync(process.execPath, ['scripts/build-skillpacks-manifest.mjs', '--print'], {
    cwd: packageRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      SKILLPACKS_PACKAGE_LANE: lane
    },
    maxBuffer: 64 * 1024 * 1024
  });

  assert.equal(result.status, 0, [result.stdout, result.stderr].filter(Boolean).join('\n'));
  const generatedManifest = JSON.parse(result.stdout);
  generatedManifestCache.set(lane, generatedManifest);
  return generatedManifest;
}

function canaryManifest() {
  return generatedManifestForLane('canary');
}

function deckByName(sourceManifest, name) {
  return sourceManifest.decks.find((deck) => deck.name === name);
}

function skillByPath(sourceManifest, skillPath) {
  return sourceManifest.skills.find((skill) => skill.path === skillPath);
}

describe('skillpacks manifest deck metadata', () => {
  it('models rapid deck traction phases for VARD and ORD', () => {
    const manifest = canaryManifest();

    assert.deepEqual(
      deckByName(manifest, 'vard').phases.map((phase) => [phase.key, phase.cards]),
      [
        ['scan', ['vard-scan']],
        ['align', ['vard-align']],
        ['ship', ['vard-ship']],
        ['traction', ['vard-traction']]
      ]
    );
    assert.deepEqual(
      deckByName(manifest, 'ord').phases.map((phase) => [phase.key, phase.cards]),
      [
        ['scan', ['ord-scan']],
        ['align', ['ord-align']],
        ['ship', ['ord-ship']],
        ['traction', ['ord-traction']]
      ]
    );
  });

  it('models Game AFPS as a deliberate game deck backed by the game pack', () => {
    const deck = deckByName(canaryManifest(), 'game-afps');

    assert.ok(deck, 'game-afps deck should exist');
    assert.equal(deck.title, 'Game AFPS');
    assert.equal(deck.domain, 'game');
    assert.equal(deck.tempo, 'deliberate');
    assert.deepEqual(deck.default_packs, ['game']);
    assert.deepEqual(deck.full_packs, ['game']);
    assert.deepEqual(deck.package_list.default, ['game']);
    assert.deepEqual(deck.package_list.full, ['game']);
    assert.deepEqual(deck.registry_tags.default, ['deck:game-afps']);
    assert.deepEqual(deck.registry_tags.full, ['deck:game-afps']);
  });

  it('assigns game-pack skills to Game AFPS deck membership', () => {
    const gameSkills = canaryManifest().skills.filter((skill) => skill.pack === 'game');

    assert.ok(gameSkills.length > 0, 'manifest should include game-pack skills');
    assert.ok(
      gameSkills.every((skill) => skill.deck_memberships.includes('game-afps')),
      'every game skill should belong to game-afps'
    );
  });

  it('keeps nested framework skills in inventory but marks them non-installable', () => {
    const manifest = canaryManifest();
    const parent = skillByPath(manifest, 'packs/business-research/codex/customer-discovery/SKILL.md');
    const framework = skillByPath(manifest, 'packs/business-research/codex/customer-discovery/frameworks/pmf-engine/SKILL.md');
    const baseSkill = skillByPath(manifest, 'packs/base/codex/skills/SKILL.md');

    assert.ok(parent, 'customer-discovery parent skill should exist');
    assert.ok(framework, 'nested pmf-engine framework skill should remain in the manifest');
    assert.ok(baseSkill, 'base skill should exist');
    assert.equal(baseSkill.scope, 'base');
    assert.equal(baseSkill.pack, null);
    assert.equal(parent.installable, true);
    assert.equal(framework.installable, false);
    assert.equal(baseSkill.installable, true);
    assert.equal(
      manifest.packs
        .find((pack) => pack.name === 'business-research')
        .skills.includes('pmf-engine'),
      false,
      'non-installable nested framework skills should not count as top-level pack skills'
    );
  });

  it('keeps deprecated product-design aliases out of active manifest discovery', () => {
    const manifest = canaryManifest();
    const logicWiring = skillByPath(manifest, 'packs/product-design/claude/logic-wiring/SKILL.md');
    const buildUiScreens = skillByPath(manifest, 'packs/product-design/claude/build-ui-screens/SKILL.md');
    const consolidatePrototypes = skillByPath(manifest, 'packs/product-design/claude/consolidate-prototypes/SKILL.md');

    assert.equal(skillByPath(manifest, 'packs/product-design/claude/prototype/SKILL.md'), undefined);
    assert.equal(skillByPath(manifest, 'packs/product-design/claude/create-ui-experiment/SKILL.md'), undefined);
    assert.equal(skillByPath(manifest, 'packs/product-design/claude/consolidate-variations/SKILL.md'), undefined);
    assert.equal(skillByPath(manifest, 'packs/product-design/codex/prototype/SKILL.md'), undefined);
    assert.equal(skillByPath(manifest, 'packs/product-design/codex/create-ui-experiment/SKILL.md'), undefined);
    assert.equal(skillByPath(manifest, 'packs/product-design/codex/consolidate-variations/SKILL.md'), undefined);

    assert.ok(logicWiring, 'logic-wiring primary skill should exist');
    assert.ok(buildUiScreens, 'build-ui-screens primary skill should exist');
    assert.ok(consolidatePrototypes, 'consolidate-prototypes primary skill should exist');
    assert.equal(logicWiring.deprecated, false);
    assert.equal(logicWiring.replaced_by, null);
    assert.equal(buildUiScreens.deprecated, false);
    assert.equal(buildUiScreens.replaced_by, null);
    assert.equal(consolidatePrototypes.deprecated, false);
    assert.equal(consolidatePrototypes.replaced_by, null);
  });

  it('exposes required convention metadata for bundled skills', () => {
    const manifest = canaryManifest();
    const ideaScope = skillByPath(manifest, 'packs/base/codex/idea-scope-brief/SKILL.md');
    const userFlowMap = skillByPath(manifest, 'packs/product-design/codex/user-flow-map/SKILL.md');
    const competitiveAnalysis = skillByPath(manifest, 'packs/business-research/codex/competitive-analysis/SKILL.md');

    assert.deepEqual(ideaScope.required_conventions, ['alignment-page', 'briefing-slides', 'interrogation-page']);
    assert.deepEqual(userFlowMap.required_conventions, ['alignment-page', 'briefing-slides', 'design-tree-loop', 'interrogation-page']);
    assert.deepEqual(ideaScope.required_base_skills, ['create-briefing-slides']);
    assert.deepEqual(userFlowMap.required_base_skills, ['create-briefing-slides']);
    assert.deepEqual(competitiveAnalysis.required_base_skills, ['create-briefing-slides']);
  });

  it('omits canary-only briefing-slide skills from the stable manifest', () => {
    const stableManifest = generatedManifestForLane('stable');

    assert.equal(stableManifest.package.release_lane, 'stable');
    assert.equal(
      stableManifest.skills.find((skill) => skill.path === 'packs/base/codex/create-briefing-slides/SKILL.md'),
      undefined
    );
    assert.equal(stableManifest.skills.some((skill) => skill.name === 'create-briefing-slides'), false);
    assert.equal(
      stableManifest.skills.some((skill) => skill.required_conventions.includes('briefing-slides')),
      false,
      'stable manifest should not include skills requiring canary-only conventions'
    );
    assert.equal(
      stableManifest.skills.some((skill) => Object.hasOwn(skill, 'required_base_skills')),
      false,
      'stable manifest should not expose briefing-slide helper metadata'
    );
  });

  it('includes both create-briefing-slides mirrors in the canary manifest', () => {
    const canaryManifest = generatedManifestForLane('canary');
    const briefingSkills = canaryManifest.skills
      .filter((skill) => skill.name === 'create-briefing-slides')
      .map((skill) => [skill.platform, skill.release_lane, skill.path])
      .sort();

    assert.equal(canaryManifest.package.release_lane, 'canary');
    assert.deepEqual(briefingSkills, [
      ['claude', 'canary', 'packs/base/claude/create-briefing-slides/SKILL.md'],
      ['codex', 'canary', 'packs/base/codex/create-briefing-slides/SKILL.md']
    ]);
  });
});
