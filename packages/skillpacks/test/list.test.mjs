import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

import { formatSkillsList, formatPackHierarchy } from '../src/cli/run-pack-script.mjs';

const manifest = JSON.parse(
  readFileSync(new URL('../dist/skillpacks-manifest.json', import.meta.url), 'utf8')
);

describe('skillpacks list --skills formatter', () => {
  const output = formatSkillsList(manifest);

  it('includes a pack skill and a base skill', () => {
    assert.match(output, /\bdelegate\b/, 'should list a known pack skill');
    assert.match(output, /\[base\]/, 'should list at least one base-scope skill');
  });

  it('annotates deprecated aliases with their replacement', () => {
    const line = output.split('\n').find((l) => /^\s+prototype\s+\[/.test(l));
    assert.ok(line, 'prototype alias should appear in the listing');
    assert.match(line, /deprecated → logic-wiring/);
  });

  it('does not mark the live replacement skill as deprecated', () => {
    const line = output.split('\n').find((l) => /^\s+logic-wiring\s+\[/.test(l));
    assert.ok(line, 'logic-wiring should appear in the listing');
    assert.doesNotMatch(line, /deprecated/);
  });
});

describe('skillpacks list --tree formatter', () => {
  const output = formatPackHierarchy(manifest);

  it('renders a pack header with its skill_count', () => {
    const productDesign = manifest.packs.find((pack) => pack.name === 'product-design');
    assert.ok(productDesign, 'product-design pack should exist');
    assert.match(output, new RegExp(`product-design  \\(${productDesign.skill_count} skills\\)`));
  });

  it('nests the deprecated alias under its pack with a marker', () => {
    const lines = output.split('\n');
    const headerIndex = lines.findIndex((l) => l.startsWith('product-design  ('));
    assert.notEqual(headerIndex, -1);
    const prototypeLine = lines
      .slice(headerIndex + 1)
      .find((l) => /^\s+prototype\s+\(/.test(l));
    assert.ok(prototypeLine, 'prototype should be nested under product-design');
    assert.match(prototypeLine, /deprecated → logic-wiring/);
  });

  it('includes a base group', () => {
    assert.match(output, /^base  \(\d+ skills\)/m);
  });
});
