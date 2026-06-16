import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const manifest = JSON.parse(
  readFileSync(new URL('../dist/skillpacks-manifest.json', import.meta.url), 'utf8')
);

function deckByName(name) {
  return manifest.decks.find((deck) => deck.name === name);
}

function skillByPath(skillPath) {
  return manifest.skills.find((skill) => skill.path === skillPath);
}

describe('skillpacks manifest deck metadata', () => {
  it('models Game AFPS as a deliberate game deck backed by the game pack', () => {
    const deck = deckByName('game-afps');

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
    const gameSkills = manifest.skills.filter((skill) => skill.pack === 'game');

    assert.ok(gameSkills.length > 0, 'manifest should include game-pack skills');
    assert.ok(
      gameSkills.every((skill) => skill.deck_memberships.includes('game-afps')),
      'every game skill should belong to game-afps'
    );
  });

  it('keeps nested framework skills in inventory but marks them non-installable', () => {
    const parent = skillByPath('packs/business-research/codex/customer-discovery/SKILL.md');
    const framework = skillByPath('packs/business-research/codex/customer-discovery/frameworks/pmf-engine/SKILL.md');
    const baseSkill = skillByPath('base/codex/skills/SKILL.md');

    assert.ok(parent, 'customer-discovery parent skill should exist');
    assert.ok(framework, 'nested pmf-engine framework skill should remain in the manifest');
    assert.ok(baseSkill, 'base skill should exist');
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
});
