import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, it } from 'node:test';
import { runSkillpacksCli } from '../src/cli/run-pack-script.mjs';
import {
  canonicalHibernatedPack,
  normalizePack,
  resolvePackCommandArgs,
  tokenizePackArgs
} from '../src/cli/pack-normalization.mjs';

const manifest = JSON.parse(
  readFileSync(new URL('../dist/skillpacks-manifest.json', import.meta.url), 'utf8')
);
const tmpDirs = [];

function makeTempProject() {
  const dir = mkdtempSync(join(tmpdir(), 'skillpacks-pack-normalization-'));
  tmpDirs.push(dir);
  return dir;
}

function writeProjectConfig(projectRoot, config) {
  const filePath = join(projectRoot, '.agents/project.json');
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(config, null, 2)}\n`);
}

async function withEmptyPath(projectRoot, fn) {
  const originalCwd = process.cwd();
  const originalPath = process.env.PATH;

  try {
    process.chdir(projectRoot);
    process.env.PATH = '';
    return await fn();
  } finally {
    process.chdir(originalCwd);
    if (originalPath === undefined) {
      delete process.env.PATH;
    } else {
      process.env.PATH = originalPath;
    }
  }
}

afterEach(() => {
  for (const dir of tmpDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  tmpDirs.length = 0;
});

describe('pack normalization helpers', () => {
  it('normalizes direct pack names and pack aliases', () => {
    assert.deepEqual(normalizePack('code-quality'), ['code-quality']);
    assert.deepEqual(normalizePack('quality'), ['code-quality']);
    assert.deepEqual(normalizePack('business'), [
      'business-research',
      'customer-lifecycle',
      'business-growth',
      'business-ops'
    ]);
    assert.deepEqual(normalizePack('product'), [
      'business-research',
      'customer-lifecycle',
      'business-growth',
      'business-ops'
    ]);
  });

  it('tokenizes comma-separated args, pack prefixes, and empty pack tokens like pack.sh', () => {
    assert.deepEqual(tokenizePackArgs(['pack:code-quality,docs', 'pack', 'packs', 'pack:', ',quality']), [
      'code-quality',
      'docs',
      'quality'
    ]);
  });

  it('maps hibernated PoketoWork kanban aliases to canonical pack names', () => {
    assert.equal(canonicalHibernatedPack('dev-kanban'), 'devtool-kanban');
    assert.equal(canonicalHibernatedPack('poketo-work-kanban'), 'poketowork-kanban');
    assert.equal(canonicalHibernatedPack('code-quality'), null);
  });
});

describe('pack command argument resolution', () => {
  it('resolves install exact pack names, exact pack titles, comma args, and pack prefixes', () => {
    assert.deepEqual(resolvePackCommandArgs('install', ['code-quality'], { manifest }).args, [
      'code-quality'
    ]);
    assert.deepEqual(resolvePackCommandArgs('install', ['pack:code-quality,docs-health'], { manifest }).args, [
      'code-quality',
      'docs-health'
    ]);
    const titled = resolvePackCommandArgs('install', ['Exec Loop Pack'], { manifest });
    assert.deepEqual(titled.packs, ['exec-loop']);
    assert.deepEqual(titled.skills, []);
    assert.deepEqual(titled.args, ['exec-loop']);

    const normalizedTitle = resolvePackCommandArgs('install', [' exec   loop pack '], { manifest });
    assert.deepEqual(normalizedTitle.packs, ['exec-loop']);
    assert.deepEqual(normalizedTitle.skills, []);
  });

  it('skips empty pack tokens but rejects calls with no resolved pack or skill', () => {
    assert.deepEqual(resolvePackCommandArgs('install', ['pack', 'packs', 'pack:', 'code-quality'], { manifest }).args, [
      'code-quality'
    ]);
    assert.throws(
      () => resolvePackCommandArgs('install', ['pack', 'packs', 'pack:'], { manifest }),
      /install requires a pack or skill name/
    );
  });

  it('resolves exact active skill names before pack names and titles', () => {
    const resolved = resolvePackCommandArgs('install', ['exec'], { manifest });

    assert.deepEqual(resolved.packs, []);
    assert.deepEqual(resolved.skills, ['exec']);
    assert.deepEqual(resolved.args, ['exec']);

    const exactSkill = resolvePackCommandArgs('install', ['enterprise-icp'], { manifest });
    assert.deepEqual(exactSkill.packs, []);
    assert.deepEqual(exactSkill.skills, ['enterprise-icp']);

    const baseSkill = resolvePackCommandArgs('install', ['idea-scope-brief'], { manifest });
    assert.deepEqual(baseSkill.packs, []);
    assert.deepEqual(baseSkill.skills, ['idea-scope-brief']);
  });

  it('does not resolve nested framework skills as exact install targets', () => {
    assert.throws(
      () => resolvePackCommandArgs('install', ['pmf-engine'], { manifest }),
      /Unknown pack or skill 'pmf-engine'\./
    );
  });

  it('resolves exact active pack names without alias expansion', () => {
    const resolved = resolvePackCommandArgs('install', ['exec-loop'], { manifest });

    assert.deepEqual(resolved.packs, ['exec-loop']);
    assert.deepEqual(resolved.skills, []);
    assert.deepEqual(resolved.args, ['exec-loop']);
  });

  it('rejects install aliases and fuzzy skill names with unknown-name diagnostics', () => {
    assert.throws(
      () => resolvePackCommandArgs('install', ['quality'], { manifest }),
      /Unknown pack or skill 'quality'\./
    );
    assert.throws(
      () => resolvePackCommandArgs('install', ['icp'], { manifest }),
      /Unknown pack or skill 'icp'\./
    );
  });

  it('rejects unknown names with available active pack diagnostics', () => {
    assert.throws(
      () => resolvePackCommandArgs('install', ['not-a-real-pack'], { manifest }),
      /Unknown pack or skill 'not-a-real-pack'\. Available packs: agent-bridge,agent-work-admin/
    );
  });

  it('blocks hibernated pack and skill installs with PoketoWork safety language', () => {
    assert.throws(
      () => resolvePackCommandArgs('install', ['dev-kanban'], { manifest }),
      /PoketoWork kanban pack 'devtool-kanban' is hibernated[\s\S]*Requested: dev-kanban[\s\S]*Reactivation requires a stable service\/API/
    );
    assert.throws(
      () => resolvePackCommandArgs('install', ['exec-kanban'], { manifest }),
      /PoketoWork kanban skill 'exec-kanban' is archived in hibernated pack\(s\): business-app-kanban, devtool-kanban, game-kanban, poketowork-kanban/
    );
  });

  it('allows hibernated pack and skill removal for stale project cleanup', () => {
    const dir = makeTempProject();

    assert.deepEqual(resolvePackCommandArgs('remove', ['dev-kanban'], { manifest, projectRoot: dir }).args, [
      'devtool-kanban'
    ]);
    assert.deepEqual(resolvePackCommandArgs('remove', ['exec-kanban'], { manifest, projectRoot: dir }).args, [
      'exec-kanban'
    ]);
  });

  it('resolves project-enabled skills before active pack and skill fallback on remove', () => {
    const dir = makeTempProject();
    writeProjectConfig(dir, {
      enabled_skills: {
        'local-only-skill': 'custom-pack'
      }
    });

    const resolved = resolvePackCommandArgs('remove', ['local-only-skill'], { manifest, projectRoot: dir });

    assert.deepEqual(resolved.packs, []);
    assert.deepEqual(resolved.skills, ['local-only-skill']);
    assert.deepEqual(resolved.args, ['local-only-skill']);
  });
});

describe('fuzzy skill resolution', () => {
  it('resolves customer-discovery as a skill, not a pack', () => {
    const resolved = resolvePackCommandArgs('install', ['customer-discovery'], { manifest });

    assert.deepEqual(resolved.packs, []);
    assert.deepEqual(resolved.skills, ['customer-discovery']);
  });

  it('rejects ambiguous fuzzy install tokens as unknown names', () => {
    assert.throws(
      () => resolvePackCommandArgs('install', ['canvas'], { manifest }),
      /Unknown pack or skill 'canvas'\./
    );
  });

  it('throws unknown error with help text for no-match tokens', () => {
    assert.throws(
      () => resolvePackCommandArgs('install', ['zzz-nonexistent'], { manifest }),
      /Run 'npx skillpacks list' to see all available skills\./
    );
  });

  it('exact skill match takes priority over fuzzy', () => {
    const resolved = resolvePackCommandArgs('install', ['enterprise-icp'], { manifest });

    assert.deepEqual(resolved.packs, []);
    assert.deepEqual(resolved.skills, ['enterprise-icp']);
  });

  it('fuzzy-resolves on remove as well', () => {
    const dir = makeTempProject();
    const resolved = resolvePackCommandArgs('remove', ['icp'], { manifest, projectRoot: dir });

    assert.deepEqual(resolved.packs, []);
    assert.deepEqual(resolved.skills, ['enterprise-icp']);
  });

  it('throws ambiguous fuzzy errors on remove', () => {
    const dir = makeTempProject();

    assert.throws(
      () => resolvePackCommandArgs('remove', ['canvas'], { manifest, projectRoot: dir }),
      /Ambiguous skill name 'canvas'\. Did you mean:/
    );
  });
});

describe('skillpacks install/remove Node resolution', () => {
  it('reports hibernated install diagnostics before requiring bash or jq', async () => {
    const dir = makeTempProject();

    await assert.rejects(
      withEmptyPath(dir, () => runSkillpacksCli(['install', 'dev-kanban'])),
      /PoketoWork kanban pack 'devtool-kanban' is hibernated/
    );
  });

  it('reports unknown install names before requiring bash or jq', async () => {
    const dir = makeTempProject();

    await assert.rejects(
      withEmptyPath(dir, () => runSkillpacksCli(['install', 'not-a-real-pack'])),
      /Unknown pack or skill 'not-a-real-pack'/
    );
  });
});
