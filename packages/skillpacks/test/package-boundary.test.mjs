import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import {
  SKILL_CONVENTIONS,
  managedConventionDocEntries
} from '../../../scripts/skill-convention-registry.mjs';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(packageRoot, '../..');
const socialAssetPaths = [
  'assets/social/bluesky-convention.md',
  'assets/social/founder-devtool-video-prompts-convention.md',
  'assets/social/hacker-news-convention.md',
  'assets/social/instagram-reels-convention.md',
  'assets/social/linkedin-post-convention.md',
  'assets/social/linkedin-video-convention.md',
  'assets/social/mastodon-convention.md',
  'assets/social/reddit-convention.md',
  'assets/social/threads-convention.md',
  'assets/social/tiktok-convention.md',
  'assets/social/x-post-convention.md',
  'assets/social/youtube-community-convention.md',
  'assets/social/youtube-long-form-convention.md',
  'assets/social/youtube-shorts-convention.md'
];

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: packageRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024
  });

  assert.equal(
    result.status,
    0,
    [result.stdout, result.stderr].filter(Boolean).join('\n')
  );
  return result.stdout;
}

function packedPaths() {
  run(process.execPath, ['scripts/build-package.mjs', '--check']);
  const stdout = run('npm', ['pack', './build', '--dry-run', '--json', '--silent']);
  const [packument] = JSON.parse(stdout);

  assert.ok(packument, 'npm pack should return package metadata');
  return new Set(
    packument.files.map((file) => file.path.replace(/^package\//, ''))
  );
}

function hasPathClass(paths, deniedPath) {
  return [...paths].some((filePath) => {
    return filePath === deniedPath || filePath.startsWith(`${deniedPath}/`);
  });
}

describe('skillpacks npm publish target boundary', () => {
  it('publishes only runtime package content and npm metadata', () => {
    const paths = packedPaths();

    for (const deniedPath of [
      'docs',
      'AGENTS.md',
      'CLAUDE.md',
      'prompts',
      'apps',
      'alignment',
      'tasks',
      'tests'
    ]) {
      assert.equal(
        hasPathClass(paths, deniedPath),
        false,
        `${deniedPath} should not be published`
      );
    }

    for (const requiredPath of [
      'package.json',
      'README.md',
      'CHANGELOG.md',
      'LICENSE',
      'bin/skillpacks.mjs',
      'dist/skillpacks-manifest.json',
      'src/cli/run-pack-script.mjs',
      'scripts/pack.sh',
      'scripts/skill-links.sh',
      'scripts/skill-convention-bundle-audit.mjs',
      'scripts/skill-convention-registry.mjs',
      'scripts/upgrade-alignment-page.mjs',
      'scripts/upgrade-interrogation-page.mjs',
      'scripts/upgrade-design-tree-loop.mjs',
      'scripts/audit-alignment-pages.mjs',
      'scripts/inject-tts.mjs',
      'scripts/alignment-tts-kokoro.js',
      'assets/alignment-page-convention.md',
      'assets/interrogation-page-convention.md',
      'assets/design-tree-loop-convention.md',
      'assets/social-post-convention.md',
      'assets/social-video-content-convention.md',
      'assets/social-ledger-convention.md',
      ...socialAssetPaths,
      'packs/release-ops/codex/release/SKILL.md',
      'packs/release-ops/codex/release/ALIGNMENT-PAGE.md',
      'packs/base/codex/idea-scope-brief/INTERROGATION-PAGE.md',
      'packs/product-design/codex/user-flow-map/DESIGN-TREE-LOOP.md',
      'packs/product-testing/codex/uat/DESIGN-TREE-LOOP.md',
      'packs/code-quality/PACK.md'
    ]) {
      assert.equal(paths.has(requiredPath), true, `${requiredPath} should be published`);
    }

    for (const [id, convention] of Object.entries(SKILL_CONVENTIONS)) {
      if (convention.generatorScript) {
        assert.equal(paths.has(convention.generatorScript), true, `${id} generator should be published`);
      }
      assert.equal(paths.has(convention.packageAsset), true, `${id} package asset should be published`);
    }

    for (const entry of managedConventionDocEntries(repoRoot)) {
      assert.equal(paths.has(entry.packageAsset), true, `${entry.packageAsset} should be published`);
    }
  });

  it('registers social conventions as static package assets for BIP guidance', () => {
    assert.deepEqual(
      Object.keys(SKILL_CONVENTIONS).filter((id) => id.startsWith('social-')).sort(),
      ['social-ledger', 'social-post', 'social-video-content']
    );
    assert.equal(SKILL_CONVENTIONS['social-ledger'].canonicalDoc, 'docs/social-ledger-convention.md');
    assert.equal(SKILL_CONVENTIONS['social-ledger'].packageAsset, 'assets/social-ledger-convention.md');
    assert.equal(SKILL_CONVENTIONS['social-ledger'].bundleFile, undefined);
    assert.equal(SKILL_CONVENTIONS['social-ledger'].generatorScript, undefined);
    assert.equal(SKILL_CONVENTIONS['social-post'].canonicalDoc, 'docs/social-post-convention.md');
    assert.equal(SKILL_CONVENTIONS['social-post'].packageAsset, 'assets/social-post-convention.md');
    assert.equal(SKILL_CONVENTIONS['social-post'].bundleFile, undefined);
    assert.equal(SKILL_CONVENTIONS['social-post'].generatorScript, undefined);
    assert.equal(SKILL_CONVENTIONS['social-video-content'].canonicalDoc, 'docs/social-video-content-convention.md');
    assert.equal(SKILL_CONVENTIONS['social-video-content'].packageAsset, 'assets/social-video-content-convention.md');
    assert.equal(SKILL_CONVENTIONS['social-video-content'].bundleFile, undefined);
    assert.equal(SKILL_CONVENTIONS['social-video-content'].generatorScript, undefined);

    const alignmentConvention = readFileSync(resolve(repoRoot, 'docs/alignment-page-convention.md'), 'utf8');
    assert.match(alignmentConvention, /alignment\/bip\/\{skill-name\}\.html/);
    assert.match(alignmentConvention, /post-confirmation/);
    assert.match(alignmentConvention, /prioritization metadata/);
    assert.match(alignmentConvention, /alignment\.bip_platforms/);
    assert.match(alignmentConvention, /set-bip-platforms <platform\.\.\.>/);
    assert.match(alignmentConvention, /Do not treat `alignment\.bip_platforms` as a channel filter/);
    assert.match(alignmentConvention, /every bundled channel/);
    assert.doesNotMatch(alignmentConvention, /Stage 2 has a required halfway review step/);
    assert.match(alignmentConvention, /docs\/social-post-convention\.md/);
    assert.match(alignmentConvention, /assets\/social-post-convention\.md/);
    assert.match(alignmentConvention, /docs\/social-video-content-convention\.md/);
    assert.match(alignmentConvention, /assets\/social-video-content-convention\.md/);
    assert.match(alignmentConvention, /docs\/social\//);
    assert.match(alignmentConvention, /assets\/social\//);
    assert.match(alignmentConvention, /loaded convention path/);
    assert.match(alignmentConvention, /platform_aligned/);
    assert.match(alignmentConvention, /creator_inspired/);

    const socialPostConvention = readFileSync(resolve(repoRoot, 'docs/social-post-convention.md'), 'utf8');
    assert.match(socialPostConvention, /docs\/social\/linkedin-post-convention\.md/);
    assert.match(socialPostConvention, /assets\/social\/linkedin-post-convention\.md/);
    assert.match(socialPostConvention, /BIP mode is active/);
    assert.match(socialPostConvention, /load every bundled channel file/);
    assert.match(socialPostConvention, /alignment\.bip_platforms.*prioritization metadata/);
    assert.match(socialPostConvention, /loaded_channel_convention/);
    assert.doesNotMatch(socialPostConvention, /^### LinkedIn$/m);

    const socialVideoConvention = readFileSync(resolve(repoRoot, 'docs/social-video-content-convention.md'), 'utf8');
    assert.match(socialVideoConvention, /docs\/social\/youtube-shorts-convention\.md/);
    assert.match(socialVideoConvention, /assets\/social\/youtube-shorts-convention\.md/);
    assert.match(socialVideoConvention, /BIP mode is active/);
    assert.match(socialVideoConvention, /load every bundled channel and prompt-family file/);
    assert.match(socialVideoConvention, /alignment\.bip_platforms.*prioritization metadata/);
    assert.match(socialVideoConvention, /loaded_channel_convention/);
    assert.doesNotMatch(socialVideoConvention, /^### YouTube Long-Form$/m);

    const linkedInPostConvention = readFileSync(resolve(repoRoot, 'docs/social/linkedin-post-convention.md'), 'utf8');
    assert.match(linkedInPostConvention, /# LinkedIn Post Convention/);
    assert.match(linkedInPostConvention, /## Drafting Modes/);

    const youtubeShortsConvention = readFileSync(resolve(repoRoot, 'docs/social/youtube-shorts-convention.md'), 'utf8');
    assert.match(youtubeShortsConvention, /# YouTube Shorts Convention/);
    assert.match(youtubeShortsConvention, /## Drafting Modes/);

    const ledgerConvention = readFileSync(resolve(repoRoot, 'docs/social-ledger-convention.md'), 'utf8');
    assert.match(ledgerConvention, /# Social Ledger Convention/);
    assert.match(ledgerConvention, /assets\/social-ledger-convention\.md/);
    assert.match(ledgerConvention, /dedupe_fingerprint/);
    assert.match(ledgerConvention, /post_plus_replies/);
    assert.match(ledgerConvention, /6eorge\.com\/brain/);

    // Parent router and X channel doc point at the ledger contract and post-plus-replies shape.
    assert.match(socialPostConvention, /docs\/social-ledger-convention\.md/);
    assert.match(socialPostConvention, /post_plus_replies/);
    const xPostConvention = readFileSync(resolve(repoRoot, 'docs/social/x-post-convention.md'), 'utf8');
    assert.match(xPostConvention, /Post Plus Replies Pattern/);
    assert.match(xPostConvention, /6eorge\.com\/brain/);

    // Alignment BIP guidance teaches ledger scope, account, and post-confirmation review fields.
    assert.match(alignmentConvention, /docs\/social-ledger-convention\.md/);
    assert.match(alignmentConvention, /assets\/social-ledger-convention\.md/);
    assert.match(alignmentConvention, /ledger storage scope/);
    assert.match(alignmentConvention, /claim-safety notes/);
    assert.match(alignmentConvention, /publish precheck/);
  });
});
