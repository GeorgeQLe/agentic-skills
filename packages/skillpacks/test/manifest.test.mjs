import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const manifest = JSON.parse(
  readFileSync(new URL('../dist/skillpacks-manifest.json', import.meta.url), 'utf8')
);

function deckByName(name) {
  return manifest.decks.find((deck) => deck.name === name);
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
});
