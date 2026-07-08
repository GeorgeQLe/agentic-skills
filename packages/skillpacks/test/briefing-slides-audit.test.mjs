import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, it } from 'node:test';

const packageRoot = resolve(new URL('..', import.meta.url).pathname);
const repoRoot = resolve(packageRoot, '../..');
const scriptPath = resolve(repoRoot, 'scripts/audit-briefing-slides.mjs');
const tmpDirs = [];

function makeTempProject() {
  const dir = mkdtempSync(join(tmpdir(), 'briefing-slides-audit-'));
  tmpDirs.push(dir);
  mkdirSync(join(dir, 'briefing-slides'), { recursive: true });
  return dir;
}

afterEach(() => {
  for (const dir of tmpDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  tmpDirs.length = 0;
});

function writeDeck(root, name, html = validDeck()) {
  writeFileSync(join(root, 'briefing-slides', name), html);
}

function runAudit(root) {
  return spawnSync(process.execPath, [scriptPath, '--root', root], {
    cwd: repoRoot,
    encoding: 'utf8'
  });
}

function validDeck({
  extraIntro = '',
  omitSecondTrigger = false,
  footer = null,
  script = '',
  mainAttrs = '',
  approvalStatus = 'ready-for-agent-review',
  includeUnanswered = false,
  decisionSlideAttrs = 'data-required-gate-slide data-gate-status="unanswered"',
  gateBorderStyles = [
    ':root { --gate-unanswered-border: #d92d20; --gate-answered-border: #16803c; }',
    '[data-required-gate-slide][data-gate-status="unanswered"] { border-color: var(--gate-unanswered-border); }',
    '[data-required-gate-slide][data-gate-status="answered"] { border-color: var(--gate-answered-border); }'
  ].join(' '),
  gateStatusScript = [
    '<script>',
    '  document.querySelectorAll("[data-gate-answer]").forEach((input) => {',
    '    input.addEventListener("change", () => {',
    '      const slide = input.closest("[data-required-gate-slide]");',
    '      if (slide) slide.setAttribute("data-gate-status", input.checked ? "answered" : "unanswered");',
    '    });',
    '  });',
    '</script>'
  ].join('\n')
} = {}) {
  const footerHtml = footer ?? [
    '<footer data-briefing-footer>',
    '  <button type="button" data-feedback-trigger>Feedback</button>',
    '  <span data-slide-counter>1 / 3</span>',
    '  <div data-slide-progress style="width:33%"></div>',
    '</footer>'
  ].join('\n');

  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    '  <title>Briefing Fixture</title>',
    `  <style>${gateBorderStyles} @media print { [data-briefing-slide] { break-after: page; } }</style>`,
    '</head>',
    '<body>',
    `  <main data-briefing-deck ${mainAttrs}>`,
    '    <section data-briefing-slide data-slide-id="intro">',
    '      <h1>Briefing Fixture</h1>',
    `      ${extraIntro}`,
    '      <a data-reference-chip href="../alignment/example.html">Alignment reference</a>',
    '      <button type="button" data-feedback-trigger>Slide feedback</button>',
    '    </section>',
    `    <section data-briefing-slide data-slide-id="decision" ${decisionSlideAttrs}>`,
    '      <h2>Decision</h2>',
    '      <label>Approve direction <input type="radio" name="gate-direction" data-gate-answer required></label>',
    omitSecondTrigger ? '' : '      <button type="button" data-feedback-trigger>Slide feedback</button>',
    '    </section>',
    '    <section data-briefing-slide data-slide-id="response">',
    '      <h2>Response</h2>',
    '      <textarea data-full-deck-yaml readonly>',
    '# Invoke with: $create-briefing-slides',
    'command: "$create-briefing-slides"',
    'briefing_slides: briefing-slides/example.html',
    'slide_feedback: []',
    ...(includeUnanswered ? ['unanswered_required_questions:', '  - gate-scope'] : []),
    `approval_status: ${approvalStatus}`,
    '      </textarea>',
    '      <button type="button" data-feedback-trigger>Slide feedback</button>',
    '    </section>',
    '  </main>',
    '  <nav aria-label="Slide navigation">',
    '    <button type="button" data-slide-prev>Previous</button>',
    '    <button type="button" data-slide-next>Next</button>',
    '  </nav>',
    '  <aside data-slide-feedback-panel>',
    '    <label><input type="checkbox" data-feedback-kind="emphasize"> Emphasize</label>',
    '    <label><input type="checkbox" data-feedback-kind="revise"> Revise</label>',
    '    <label><input type="checkbox" data-feedback-kind="needs-clarification"> Needs clarification</label>',
    '    <textarea data-slide-feedback-yaml readonly>',
    'command: "$create-briefing-slides"',
    'briefing_slides: briefing-slides/example.html',
    'slide_feedback: []',
    'approval_status: not-approved',
    '    </textarea>',
    '  </aside>',
    footerHtml,
    gateStatusScript,
    script,
    '</body>',
    '</html>',
    ''
  ].join('\n');
}

describe('audit-briefing-slides fixture trees', () => {
  it('passes on a valid deck fixture', () => {
    const root = makeTempProject();
    writeDeck(root, 'example.html');

    const result = runAudit(root);

    assert.equal(result.stderr, '');
    assert.equal(result.status, 0, [result.stdout, result.stderr].filter(Boolean).join('\n'));
    assert.match(result.stdout, /Active decks: 1/);
    assert.match(result.stdout, /Slide structure: 1 decks, exact/);
    assert.match(result.stdout, /Slide feedback: 1 decks, exact/);
    assert.match(result.stdout, /YAML compiler: 1 decks, exact/);
  });

  it('fails when any slide is missing its feedback trigger', () => {
    const root = makeTempProject();
    writeDeck(root, 'missing-feedback.html', validDeck({ omitSecondTrigger: true }));

    const result = runAudit(root);

    assert.equal(result.status, 1);
    assert.match(result.stdout, /Slide feedback: 1 decks, DRIFT/);
    assert.match(result.stderr, /Slide feedback drift:/);
    assert.match(result.stderr, /Missing data-feedback-trigger in briefing-slides\/missing-feedback\.html slide "decision"/);
  });

  it('fails when required gate slides lack red and green border status affordances', () => {
    const root = makeTempProject();
    writeDeck(root, 'missing-gate-marker.html', validDeck({
      decisionSlideAttrs: ''
    }));
    writeDeck(root, 'missing-gate-border-css.html', validDeck({
      gateBorderStyles: ''
    }));
    writeDeck(root, 'missing-gate-status-updater.html', validDeck({
      gateStatusScript: ''
    }));

    const result = runAudit(root);

    assert.equal(result.status, 1);
    assert.match(result.stdout, /Required gate borders: 3 decks, DRIFT/);
    assert.match(result.stderr, /Required gate border drift:/);
    assert.match(result.stderr, /Missing required-gate slide marker in briefing-slides\/missing-gate-marker\.html slide "decision"/);
    assert.match(result.stderr, /Missing required-gate slide status in briefing-slides\/missing-gate-marker\.html slide "decision"/);
    assert.match(result.stderr, /Missing unanswered required-gate border style in briefing-slides\/missing-gate-border-css\.html/);
    assert.match(result.stderr, /Missing answered required-gate border style in briefing-slides\/missing-gate-border-css\.html/);
    assert.match(result.stderr, /Missing required-gate status updater in briefing-slides\/missing-gate-status-updater\.html/);
  });

  it('fails when footer markup contains YAML output or required gate inputs', () => {
    const root = makeTempProject();
    writeDeck(root, 'footer-yaml.html', validDeck({
      footer: [
        '<footer data-briefing-footer>',
        '  <textarea data-full-deck-yaml>approval_status: not-approved</textarea>',
        '</footer>'
      ].join('\n')
    }));
    writeDeck(root, 'footer-gate.html', validDeck({
      footer: [
        '<footer data-briefing-footer>',
        '  <input required data-gate-answer name="gate-footer">',
        '</footer>'
      ].join('\n')
    }));

    const result = runAudit(root);

    assert.equal(result.status, 1);
    assert.match(result.stdout, /Footer controls: 2 pages, DRIFT/);
    assert.match(result.stderr, /Footer controls drift:/);
    assert.match(result.stderr, /footer-yaml\.html block 1/);
    assert.match(result.stderr, /YAML textarea/);
    assert.match(result.stderr, /footer-gate\.html block 1/);
    assert.match(result.stderr, /required gate inputs/);
  });

  it('fails when a prior YAML sidecar is promoted as a primary action link', () => {
    const root = makeTempProject();
    writeDeck(root, 'promoted-sidecar.html', validDeck({
      extraIntro: '<a class="primary-action" href="../research/_working/prior-review.yaml">Open prior YAML</a>'
    }));

    const result = runAudit(root);

    assert.equal(result.status, 1);
    assert.match(result.stdout, /YAML sidecar links: 1 pages, DRIFT/);
    assert.match(result.stderr, /YAML sidecar link drift:/);
    assert.match(result.stderr, /Promoted YAML sidecar link in briefing-slides\/promoted-sidecar\.html/);
  });

  it('fails on unsafe embeds and missing required structural controls', () => {
    const root = makeTempProject();
    writeDeck(root, 'unsafe-structure.html', [
      '<!doctype html>',
      '<html lang="en">',
      '<head><title>Unsafe</title></head>',
      '<body>',
      '  <main><iframe src="../alignment/example.html"></iframe></main>',
      '</body>',
      '</html>',
      ''
    ].join('\n'));

    const result = runAudit(root);

    assert.equal(result.status, 1);
    assert.match(result.stdout, /Viewport meta: 1 pages, DRIFT/);
    assert.match(result.stdout, /Embed prohibition: 1 pages, DRIFT/);
    assert.match(result.stdout, /Slide structure: 1 decks, DRIFT/);
    assert.match(result.stdout, /Presentation navigation: 1 decks, DRIFT/);
    assert.match(result.stdout, /Print CSS: 1 decks, DRIFT/);
    assert.match(result.stderr, /Embedded content in briefing-slides\/unsafe-structure\.html/);
    assert.match(result.stderr, /Missing data-briefing-slide roots/);
  });

  it('passes on a labeled-partial deck emitting partial status and preserving uncovered gates', () => {
    const root = makeTempProject();
    writeDeck(root, 'partial.html', validDeck({
      mainAttrs: 'data-partial-deck',
      approvalStatus: 'partial',
      includeUnanswered: true
    }));

    const result = runAudit(root);

    assert.equal(result.stderr, '');
    assert.equal(result.status, 0, [result.stdout, result.stderr].filter(Boolean).join('\n'));
    assert.match(result.stdout, /Partial deck status: 1 decks, exact/);
    assert.match(result.stdout, /Gate parity \(best-effort\): no notes/);
  });

  it('fails when a partial deck emits ready-for-agent-review', () => {
    const root = makeTempProject();
    writeDeck(root, 'partial-ready.html', validDeck({
      mainAttrs: 'data-partial-deck',
      approvalStatus: 'ready-for-agent-review',
      includeUnanswered: true
    }));

    const result = runAudit(root);

    assert.equal(result.status, 1);
    assert.match(result.stdout, /Partial deck status: 1 decks, DRIFT/);
    assert.match(result.stderr, /Partial deck status drift:/);
    assert.match(result.stderr, /Partial deck emits ready-for-agent-review in briefing-slides\/partial-ready\.html/);
    assert.match(result.stderr, /Missing partial approval_status in briefing-slides\/partial-ready\.html/);
  });

  it('fails when a partial deck omits unanswered_required_questions', () => {
    const root = makeTempProject();
    writeDeck(root, 'partial-no-unanswered.html', validDeck({
      mainAttrs: 'data-partial-deck',
      approvalStatus: 'partial',
      includeUnanswered: false
    }));

    const result = runAudit(root);

    assert.equal(result.status, 1);
    assert.match(result.stdout, /Partial deck status: 1 decks, DRIFT/);
    assert.match(result.stderr, /Missing unanswered_required_questions in briefing-slides\/partial-no-unanswered\.html/);
  });

  it('fails on double-escaped YAML newline joins', () => {
    const root = makeTempProject();
    writeDeck(root, 'double-escaped.html', validDeck({
      script: '<script>const yaml = ["command: $create-briefing-slides"].join("\\\\n");</script>'
    }));

    const result = runAudit(root);

    assert.equal(result.status, 1);
    assert.match(result.stdout, /Compiled-YAML newline join: 1 pages, DRIFT/);
    assert.match(result.stderr, /Double-escaped YAML newline join in briefing-slides\/double-escaped\.html/);
  });
});
