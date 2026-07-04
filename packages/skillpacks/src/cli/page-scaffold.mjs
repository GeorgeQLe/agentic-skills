import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ROUND_RE = /^[1-9][0-9]*$/;

function assertSlug(command, label, value) {
  if (!SLUG_RE.test(value || '')) {
    throw new Error(`${command}: ${label} must be a lowercase slug using a-z, 0-9, and single hyphens`);
  }
}

function assertRound(command, value) {
  if (!ROUND_RE.test(value || '')) {
    throw new Error(`${command}: round must be a positive integer`);
  }
}

function assertRelativeOut(command, outPath) {
  if (!outPath) {
    throw new Error(`${command}: --out is required`);
  }
  if (outPath.startsWith('/') || /^[A-Za-z]:[\\/]/.test(outPath) || outPath.includes('\\')) {
    throw new Error(`${command}: --out must be a repo-relative HTML path`);
  }
  if (outPath.split('/').some((part) => part === '..' || part === '.')) {
    throw new Error(`${command}: --out must not contain dot path segments`);
  }
}

function parseOut(command, args) {
  let out = null;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--out') {
      if (out !== null) {
        throw new Error(`${command}: --out can only be provided once`);
      }
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error(`${command}: --out requires a path`);
      }
      out = value;
      index += 1;
      continue;
    }
    if (arg.startsWith('--out=')) {
      if (out !== null) {
        throw new Error(`${command}: --out can only be provided once`);
      }
      out = arg.slice('--out='.length);
      if (!out) {
        throw new Error(`${command}: --out requires a path`);
      }
      continue;
    }
    if (arg.startsWith('-')) {
      throw new Error(`${command}: unsupported flag '${arg}'`);
    }
    throw new Error(`${command}: unexpected argument '${arg}'`);
  }
  assertRelativeOut(command, out);
  return out;
}

export function resolveAlignmentScaffold(args) {
  const command = 'alignment pages scaffold';
  const [skill, topic, ...rest] = args;
  if (!skill || !topic) {
    throw new Error(`${command}: expected <skill> <topic> --out alignment/<skill>-<topic>.html`);
  }
  assertSlug(command, 'skill', skill);
  assertSlug(command, 'topic', topic);
  const out = parseOut(command, rest);
  const expected = `alignment/${skill}-${topic}.html`;
  if (out !== expected) {
    throw new Error(`${command}: --out must be ${expected}`);
  }
  return { kind: 'alignment', skill, topic, out };
}

export function resolveInterrogationScaffold(args) {
  const command = 'interrogation pages scaffold';
  const [skill, round, branch, ...rest] = args;
  if (!skill || !round || !branch) {
    throw new Error(`${command}: expected <skill> <round> <branch> --out interrogation/<skill>-r<round>-<branch>.html`);
  }
  assertSlug(command, 'skill', skill);
  assertRound(command, round);
  assertSlug(command, 'branch', branch);
  const out = parseOut(command, rest);
  const expected = `interrogation/${skill}-r${round}-${branch}.html`;
  if (out !== expected) {
    throw new Error(`${command}: --out must be ${expected}`);
  }
  return { kind: 'interrogation', skill, round, branch, out };
}

function titleFromSlug(slug) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function renderTemplate(template, replacements) {
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (match, token) => {
    if (!Object.prototype.hasOwnProperty.call(replacements, token)) {
      throw new Error(`template token ${match} has no replacement`);
    }
    return replacements[token];
  });
}

function writeNewFile(projectRoot, relativePath, contents) {
  const target = resolve(projectRoot, relativePath);
  const root = resolve(projectRoot);
  if (target !== join(root, relativePath)) {
    throw new Error(`scaffold target escapes project root: ${relativePath}`);
  }
  if (existsSync(target)) {
    throw new Error(`scaffold target already exists: ${relativePath}`);
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents);
}

function alignmentIndexHtml(entryHref, title, date) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Alignment Index</title>
</head>
<body>
  <main>
    <h1>Alignment Index</h1>
    <section>
      <h2>Utility &amp; Maintenance</h2>
      <article><a href="${entryHref}">${title}</a> <span class="meta">${date}</span></article>
    </section>
  </main>
</body>
</html>
`;
}

function ensureAlignmentIndex(projectRoot, scaffold) {
  const indexPath = resolve(projectRoot, 'alignment/index.html');
  if (existsSync(indexPath)) {
    return false;
  }
  const pageName = scaffold.out.slice('alignment/'.length);
  writeFileSync(indexPath, alignmentIndexHtml(pageName, `${titleFromSlug(scaffold.skill)} - ${titleFromSlug(scaffold.topic)}`, todayIso()));
  return true;
}

export function runPageScaffold(scaffold, options) {
  const projectRoot = resolve(options.projectRoot || process.cwd());
  const template = readFileSync(options.templatePath, 'utf8');
  const date = todayIso();
  let html;
  if (scaffold.kind === 'alignment') {
    html = renderTemplate(template, {
      ALIGNMENT_CATEGORY: 'utility',
      COMMAND: scaffold.skill,
      DATE: date,
      PAGE_PATH: scaffold.out,
      SKILL: scaffold.skill,
      TITLE: `${titleFromSlug(scaffold.skill)} - ${titleFromSlug(scaffold.topic)}`,
      TOPIC: scaffold.topic,
      VISUAL_TIER: 'document'
    });
  } else {
    html = renderTemplate(template, {
      BRANCH: scaffold.branch,
      COMMAND: scaffold.skill,
      DATE: date,
      PAGE_PATH: scaffold.out,
      ROUND: scaffold.round,
      SKILL: scaffold.skill,
      TITLE: `${titleFromSlug(scaffold.skill)} Round ${scaffold.round} - ${titleFromSlug(scaffold.branch)}`,
      VISUAL_TIER: 'document'
    });
  }

  writeNewFile(projectRoot, scaffold.out, html);
  const indexCreated = scaffold.kind === 'alignment' ? ensureAlignmentIndex(projectRoot, scaffold) : false;
  console.log(`Scaffolded ${scaffold.out}`);
  if (indexCreated) {
    console.log('Created alignment/index.html');
  }
  return 0;
}
