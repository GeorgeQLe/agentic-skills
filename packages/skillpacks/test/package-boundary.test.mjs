import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import {
  SKILL_CONVENTIONS,
  managedConventionDocEntries
} from '../../../scripts/skill-convention-registry.mjs';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(packageRoot, '../..');
const manifestPath = resolve(packageRoot, 'dist/skillpacks-manifest.json');
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

function run(command, args, { env = {} } = {}) {
  const result = spawnSync(command, args, {
    cwd: packageRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...env
    },
    maxBuffer: 64 * 1024 * 1024
  });

  assert.equal(
    result.status,
    0,
    [result.stdout, result.stderr].filter(Boolean).join('\n')
  );
  return result.stdout;
}

function generatedManifestForLane(lane) {
  const stdout = run(process.execPath, ['scripts/build-skillpacks-manifest.mjs', '--print'], {
    env: { SKILLPACKS_PACKAGE_LANE: lane }
  });
  return `${JSON.stringify(JSON.parse(stdout), null, 2)}\n`;
}

function packedPaths({ lane = 'stable', writeLaneManifest = false, useDistManifest = false } = {}) {
  const originalManifest = readFileSync(manifestPath, 'utf8');
  try {
    if (writeLaneManifest) {
      writeFileSync(manifestPath, generatedManifestForLane(lane));
    }
    run(process.execPath, [
      'scripts/build-package.mjs',
      '--check',
      ...(useDistManifest ? ['--use-dist-manifest'] : [])
    ], {
      env: { SKILLPACKS_PACKAGE_LANE: lane }
    });
  } finally {
    writeFileSync(manifestPath, originalManifest);
  }
  const stdout = run('npm', ['pack', './build', '--dry-run', '--json', '--silent']);
  const [packument] = JSON.parse(stdout);

  assert.ok(packument, 'npm pack should return package metadata');
  return new Set(
    packument.files.map((file) => file.path.replace(/^package\//, ''))
  );
}

function builtManifest({ lane = 'stable', writeLaneManifest = false } = {}) {
  packedPaths({ lane, writeLaneManifest });
  return JSON.parse(readFileSync(resolve(packageRoot, 'build/dist/skillpacks-manifest.json'), 'utf8'));
}

function builtText(relativePath) {
  return readFileSync(resolve(packageRoot, 'build', relativePath), 'utf8');
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
      'scripts/lib/collapsing-fill-audit.mjs',
      'scripts/upgrade-alignment-page.mjs',
      'scripts/upgrade-interrogation-page.mjs',
      'scripts/upgrade-design-tree-loop.mjs',
      'scripts/audit-alignment-pages.mjs',
      'scripts/inject-tts.mjs',
      'scripts/alignment-tts-kokoro.js',
      'assets/alignment-page-convention.md',
      'assets/interrogation-page-convention.md',
      'assets/design-tree-loop-convention.md',
      'assets/templates/alignment-page.html',
      'assets/templates/interrogation-page.html',
      'assets/social-post-convention.md',
      'assets/social-video-content-convention.md',
      'assets/social-ledger-convention.md',
      ...socialAssetPaths,
      'packs/exec-loop/codex/ship/SKILL.md',
      'packs/code-quality/PACK.md'
    ]) {
      assert.equal(paths.has(requiredPath), true, `${requiredPath} should be published`);
    }

    for (const canaryOnlyPath of [
      'assets/briefing-slides-convention.md',
      'assets/skillpacks-docs/briefing-slides-convention.md',
      'assets/templates/briefing-slides.html',
      'scripts/audit-briefing-slides.mjs',
      'packs/base/claude/create-briefing-slides',
      'packs/base/codex/create-briefing-slides'
    ]) {
      assert.equal(
        hasPathClass(paths, canaryOnlyPath),
        false,
        `${canaryOnlyPath} should not be published in stable packages`
      );
    }

    for (const [relativePath, forbiddenPattern] of [
      ['package.json', /briefing-slides|create-briefing-slides|"release_lane": "canary"/],
      ['scripts/skill-convention-registry.mjs', /briefing-slides|create-briefing-slides|"release_lane": "canary"/],
      ['packs/base/PACK.md', /briefing-slides|create-briefing-slides|"release_lane": "canary"/]
    ]) {
      assert.doesNotMatch(
        builtText(relativePath),
        forbiddenPattern,
        `${relativePath} should not publish canary metadata in stable packages`
      );
    }

    for (const [id, convention] of Object.entries(SKILL_CONVENTIONS)) {
      if (convention.release_lane === 'canary') continue;
      if (convention.generatorScript) {
        assert.equal(paths.has(convention.generatorScript), true, `${id} generator should be published`);
      }
      assert.equal(paths.has(convention.packageAsset), true, `${id} package asset should be published`);
    }

    for (const entry of managedConventionDocEntries(repoRoot)) {
      if (entry.canonicalDoc === 'docs/briefing-slides-convention.md') continue;
      assert.equal(paths.has(entry.packageAsset), true, `${entry.packageAsset} should be published`);
    }
  });

  it('includes briefing-slide skills and assets in canary package staging', () => {
    const paths = packedPaths({ lane: 'canary', writeLaneManifest: true });

    for (const requiredPath of [
      'assets/briefing-slides-convention.md',
      'assets/skillpacks-docs/briefing-slides-convention.md',
      'assets/templates/briefing-slides.html',
      'scripts/audit-briefing-slides.mjs',
      'packs/base/claude/create-briefing-slides/SKILL.md',
      'packs/base/codex/create-briefing-slides/SKILL.md'
    ]) {
      assert.equal(paths.has(requiredPath), true, `${requiredPath} should be published in canary packages`);
    }
  });

  it('can stage from an already generated dist manifest', () => {
    const paths = packedPaths({
      lane: 'canary',
      writeLaneManifest: true,
      useDistManifest: true
    });

    assert.equal(paths.has('dist/skillpacks-manifest.json'), true);
    assert.equal(paths.has('assets/templates/briefing-slides.html'), true);
    assert.equal(paths.has('packs/base/codex/create-briefing-slides/SKILL.md'), true);
  });

  it('keeps package manifests inside their selected release lane', () => {
    const stableManifest = builtManifest();
    const canaryManifest = builtManifest({ lane: 'canary', writeLaneManifest: true });

    assert.equal(stableManifest.package.release_lane, 'stable');
    assert.equal(stableManifest.skills.some((skill) => skill.name === 'create-briefing-slides'), false);
    assert.equal(canaryManifest.package.release_lane, 'canary');
    assert.equal(
      canaryManifest.skills.filter((skill) => skill.name === 'create-briefing-slides').length,
      2
    );
  });

  it('registers social conventions as static package assets without BIP runtime guidance', () => {
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
    assert.doesNotMatch(alignmentConvention, /alignment\/bip/);
    assert.doesNotMatch(alignmentConvention, /Build-In-Public|BIP|--bip|alignment\.bip_|alignment\.build_in_public|set-bip/);
    assert.doesNotMatch(alignmentConvention, /Stage 2 has a required halfway review step/);

    const socialPostConvention = readFileSync(resolve(repoRoot, 'docs/social-post-convention.md'), 'utf8');
    assert.match(socialPostConvention, /docs\/social\/linkedin-post-convention\.md/);
    assert.match(socialPostConvention, /assets\/social\/linkedin-post-convention\.md/);
    assert.doesNotMatch(socialPostConvention, /Build-In-Public|BIP|--bip|alignment\.bip_|alignment\.build_in_public|set-bip/);
    assert.match(socialPostConvention, /loaded_channel_convention/);
    assert.doesNotMatch(socialPostConvention, /^### LinkedIn$/m);

    const socialVideoConvention = readFileSync(resolve(repoRoot, 'docs/social-video-content-convention.md'), 'utf8');
    assert.match(socialVideoConvention, /docs\/social\/youtube-shorts-convention\.md/);
    assert.match(socialVideoConvention, /assets\/social\/youtube-shorts-convention\.md/);
    assert.doesNotMatch(socialVideoConvention, /Build-In-Public|BIP|--bip|alignment\.bip_|alignment\.build_in_public|set-bip/);
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

    assert.doesNotMatch(ledgerConvention, /Build-In-Public|BIP|--bip|alignment\.bip_|alignment\.build_in_public|set-bip/);
  });
});
