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

  it('omits archived deprecated aliases from the listing', () => {
    assert.doesNotMatch(output, /^\s+prototype\s+\[/m);
    assert.doesNotMatch(output, /^\s+create-ui-experiment\s+\[/m);
    assert.doesNotMatch(output, /^\s+consolidate-variations\s+\[/m);
  });

  it('does not mark the live replacement skills as deprecated', () => {
    for (const skillName of ['logic-wiring', 'build-ui-screens', 'consolidate-prototypes']) {
      const line = output.split('\n').find((l) => new RegExp(`^\\s+${skillName}\\s+\\[`).test(l));
      assert.ok(line, `${skillName} should appear in the listing`);
      assert.doesNotMatch(line, /deprecated/);
    }
  });
});

describe('skillpacks list --tree formatter', () => {
  const output = formatPackHierarchy(manifest);

  it('renders a pack header with its skill_count', () => {
    const productDesign = manifest.packs.find((pack) => pack.name === 'product-design');
    assert.ok(productDesign, 'product-design pack should exist');
    assert.match(output, new RegExp(`product-design  \\(${productDesign.skill_count} skills\\)`));
  });

  it('nests replacement skills under the pack without deprecated alias rows', () => {
    const lines = output.split('\n');
    const headerIndex = lines.findIndex((l) => l.startsWith('product-design  ('));
    assert.notEqual(headerIndex, -1);
    const productDesignLines = lines.slice(headerIndex + 1, lines.findIndex((l, index) => index > headerIndex && /^[a-z0-9-]+  \(\d+ skills\)/.test(l)));
    assert.ok(productDesignLines.some((l) => /^\s+logic-wiring\s+\(/.test(l)), 'logic-wiring should be nested under product-design');
    assert.ok(productDesignLines.some((l) => /^\s+build-ui-screens\s+\(/.test(l)), 'build-ui-screens should be nested under product-design');
    assert.ok(productDesignLines.some((l) => /^\s+consolidate-prototypes\s+\(/.test(l)), 'consolidate-prototypes should be nested under product-design');
    assert.equal(productDesignLines.some((l) => /^\s+prototype\s+\(/.test(l)), false);
    assert.equal(productDesignLines.some((l) => /^\s+create-ui-experiment\s+\(/.test(l)), false);
    assert.equal(productDesignLines.some((l) => /^\s+consolidate-variations\s+\(/.test(l)), false);
  });

  it('includes a base group', () => {
    assert.match(output, /^base  \(\d+ skills\)/m);
  });
});
