import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = resolve(TESTS_ROOT, "..");
const SCRIPT = resolve(REPO_ROOT, "scripts/audit-alignment-pages.mjs");

const tempRoots: string[] = [];

afterEach(() => {
  for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function makeFixtureRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "alignment-audit-"));
  tempRoots.push(root);
  mkdirSync(join(root, "alignment"), { recursive: true });
  return root;
}

const TTS_TAG = '<script src="../scripts/alignment-tts-kokoro.js"></script>';

function pageHtml(overrides: {
  category?: string | null;
  tier?: string | null;
  status?: string | null;
  stage?: string | null;
  extraHtmlAttrs?: string[];
  viewport?: boolean;
  tts?: string | null;
  body?: string;
} = {}): string {
  const {
    category = "research",
    tier = "document",
    status = null,
    stage = null,
    extraHtmlAttrs = [],
    viewport = true,
    tts = TTS_TAG,
    body = "",
  } = overrides;
  const attrs = [
    'lang="en"',
    category === null ? "" : `data-alignment-category="${category}"`,
    tier === null ? "" : `data-visual-tier="${tier}"`,
    status === null ? "" : `data-alignment-status="${status}"`,
    stage === null ? "" : `data-alignment-stage="${stage}"`,
    ...extraHtmlAttrs,
  ].filter(Boolean).join(" ");
  return [
    "<!doctype html>",
    `<html ${attrs}>`,
    "<head>",
    '<meta charset="utf-8">',
    viewport ? '<meta name="viewport" content="width=device-width, initial-scale=1">' : "",
    "<title>Fixture Page</title>",
    "</head>",
    "<body>",
    `<main><h1>Fixture Page</h1>${body}</main>`,
    tts ?? "",
    "</body>",
    "</html>",
    "",
  ].filter(Boolean).join("\n");
}

function writePage(root: string, name: string, html: string = pageHtml()): void {
  writeFileSync(join(root, "alignment", name), html);
}

function writeProjectConfig(root: string, buildInPublic: boolean, bipPlatforms: string[] = []): void {
  mkdirSync(join(root, ".agents"), { recursive: true });
  writeFileSync(
    join(root, ".agents", "project.json"),
    JSON.stringify({
      alignment: {
        build_in_public: buildInPublic,
        ...(bipPlatforms.length > 0 ? { bip_platforms: bipPlatforms } : {}),
      },
    }, null, 2),
  );
}

function stage2Body(extra = ""): string {
  return [
    "<section>",
    "<h2>Research Scope Approved</h2>",
    "<p>The scope is approved and this page is now reviewing Stage 2 artifact output.</p>",
    "<h2>Final Artifact Approval</h2>",
    '<div class="question-block" data-gate-type="final-artifact-approval"><p>Approve the final artifact?</p></div>',
    extra,
    "</section>",
  ].join("\n");
}

function stage2ReadOnlyPreviewBody(extra = ""): string {
  return [
    "<section>",
    "<h2>Research Scope Approved</h2>",
    "<p>The scope is approved and this page is now reviewing Stage 2 artifact output.</p>",
    "<h2>Final Artifact Approval Preview</h2>",
    "<p>Final artifact approval will become actionable only after BIP is approved or marked narrowly not-applicable.</p>",
    extra,
    "</section>",
  ].join("\n");
}

function bipPageBody(inner: string): string {
  return [
    "<section>",
    "<h2>BIP Review</h2>",
    inner,
    "</section>",
  ].join("\n");
}

function targetChannelGate(): string {
  return [
    '<article class="gate" data-gate="target-channels" data-gate-type="target channel selection" data-section="Target Channels" data-required="true">',
    "<h3>Target Channel Selection</h3>",
    '<div class="question-block">',
    "<p><strong>Required question:</strong> Which public channels, if any, are in scope for BIP content from this run?</p>",
    '<label><input type="radio" name="gate-target-channels" value="approve recommended channels"> Approve recommended channels</label>',
    '<label><input type="radio" name="gate-target-channels" value="needs-clarification"> Need clarification</label>',
    "</div>",
    "</article>",
  ].join("\n");
}

function platformSetupGate(): string {
  return [
    '<article class="gate" data-gate="project-platform-setup" data-gate-type="project platform setup" data-section="BIP Platforms" data-required="true">',
    "<h3>Project Platform Setup</h3>",
    '<div class="question-block">',
    "<p><strong>Required question:</strong> Which platforms should be saved for future BIP drafts?</p>",
    '<label><input type="checkbox" name="gate-bip-platforms" value="linkedin"> LinkedIn</label>',
    '<label><input type="checkbox" name="gate-bip-platforms" value="x"> X</label>',
    "</div>",
    "</article>",
  ].join("\n");
}

function bulkDownselectGate(): string {
  return [
    '<article class="gate" data-gate="bulk-downselect" data-gate-type="bulk downselect" data-section="BIP Bulk Downselect" data-required="true">',
    "<h3>Bulk Downselect</h3>",
    '<div class="question-block">',
    "<p><strong>Required question:</strong> Which ranked platform-specific draft options are approved, edited, rejected, or not-now?</p>",
    '<label><input type="radio" name="gate-bulk-downselect" value="approve top-ranked"> Approve top-ranked options</label>',
    '<label><input type="radio" name="gate-bulk-downselect" value="needs-edits"> Needs edits</label>',
    "</div>",
    "</article>",
  ].join("\n");
}

function draftingModeGate(extraOptions = ""): string {
  return [
    '<article class="gate" data-gate="drafting-mode" data-gate-type="drafting mode" data-section="Drafting Mode" data-required="true">',
    "<h3>Drafting Mode</h3>",
    '<div class="question-block">',
    "<p><strong>Required question:</strong> Is the selected drafting mode correct for these rendered drafts?</p>",
    '<label><input type="radio" name="gate-drafting-mode" value="platform_aligned"> platform_aligned</label>',
    '<label><input type="radio" name="gate-drafting-mode" value="creator_inspired"> creator_inspired</label>',
    extraOptions,
    "</div>",
    "</article>",
  ].filter(Boolean).join("\n");
}

function indexHtml(entries: Array<{ href: string; title?: string; date?: string | null }>): string {
  const items = entries.map(({ href, title = href, date = "2026-06-10" }) =>
    `<li><a href="${href}">${title}</a>${date ? ` <span class="meta">${date}</span>` : ""}</li>`,
  );
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<title>Alignment Index</title>",
    "</head>",
    "<body>",
    "<main><h1>Alignment Index</h1><ul>",
    ...items,
    "</ul></main>",
    "</body>",
    "</html>",
    "",
  ].join("\n");
}

function writeIndex(root: string, entries: Array<{ href: string; title?: string; date?: string | null }>): void {
  writePage(root, "index.html", indexHtml(entries));
}

function runScript(root?: string) {
  const args = root ? [SCRIPT, "--root", root] : [SCRIPT];
  return spawnSync(process.execPath, args, { encoding: "utf8" });
}

describe("audit-alignment-pages repo state", () => {
  it("exits 0 on the current repo with exact summary lines", () => {
    const result = runScript();
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/TTS include: \d+ pages, exact/);
    expect(result.stdout).toMatch(/Page metadata: \d+ pages, exact/);
    expect(result.stdout).toMatch(/Viewport meta: \d+ pages, exact/);
    expect(result.stdout).toMatch(/Embed prohibition: \d+ pages, exact/);
    expect(result.stdout).toMatch(/Collapsing fill: \d+ pages, exact/);
    expect(result.stdout).toMatch(/BIP handling: \d+ Stage 2 pages, exact/);
    expect(result.stdout).toMatch(/Index integrity: \d+ entries, exact/);
  });
});

describe("audit-alignment-pages fixture trees", () => {
  it("passes on a clean fixture tree", () => {
    const root = makeFixtureRoot();
    writePage(root, "page-a.html");
    writePage(root, "page-b.html");
    writeIndex(root, [{ href: "page-a.html" }, { href: "page-b.html" }]);

    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("TTS include: 2 pages, exact");
    expect(result.stdout).toContain("Page metadata: 2 pages, exact");
    expect(result.stdout).toContain("Viewport meta: 3 pages, exact");
    expect(result.stdout).toContain("Embed prohibition: 3 pages, exact");
    expect(result.stdout).toContain("Alignment status controls: 2 pages, exact");
    expect(result.stdout).toContain("Index integrity: 2 entries, exact");
  });

  it("passes on a confirmed page with read-only approval records", () => {
    const root = makeFixtureRoot();
    writePage(root, "page-a.html", pageHtml({
      status: "confirmed",
      body: [
        '<section class="status"><p>alignment_status: confirmed</p></section>',
        '<section class="approval-record">',
        "<h2>Approval Record</h2>",
        "<p><strong>Evidence coverage:</strong> Approved as sufficient.</p>",
        "<p><strong>Artifact destination:</strong> research/example.md.</p>",
        "</section>",
      ].join("\n"),
    }));
    writeIndex(root, [{ href: "page-a.html" }]);

    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Alignment status controls: 1 pages, exact");
  });

  it("fails on confirmed pages with retained active gate, compile, registry, or retained-controls text", () => {
    const root = makeFixtureRoot();
    writePage(root, "page-a.html", pageHtml({
      status: "confirmed",
      body: '<div class="question-block"><input required name="gate"></div>',
    }));
    writePage(root, "page-b.html", pageHtml({
      body: '<p>alignment_status: confirmed</p><button>Compile Responses</button>',
    }));
    writePage(root, "page-c.html", pageHtml({
      status: "confirmed",
      body: "<script>const requiredGateNames = ['evidence'];</script>",
    }));
    writePage(root, "page-d.html", pageHtml({
      status: "confirmed",
      body: "<p>Retained controls from review remain here.</p>",
    }));
    writeIndex(root, [
      { href: "page-a.html" },
      { href: "page-b.html" },
      { href: "page-c.html" },
      { href: "page-d.html" },
    ]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("Alignment status controls: 4 pages, DRIFT");
    expect(result.stderr).toContain("Alignment status controls drift:");
    expect(result.stderr).toContain("Confirmed page controls in alignment/page-a.html");
    expect(result.stderr).toContain(".question-block gate controls");
    expect(result.stderr).toContain("required gate inputs/textareas");
    expect(result.stderr).toContain("Confirmed page controls in alignment/page-b.html");
    expect(result.stderr).toContain("Compile Responses control");
    expect(result.stderr).toContain("Confirmed page controls in alignment/page-c.html");
    expect(result.stderr).toContain("requiredGateNames registry");
    expect(result.stderr).toContain("Confirmed page controls in alignment/page-d.html");
    expect(result.stderr).toContain("retained controls wording");
  });

  it("allows review pages to keep active controls", () => {
    const root = makeFixtureRoot();
    writePage(root, "page-a.html", pageHtml({
      body: [
        '<div class="question-block"><input required name="gate"></div>',
        '<div class="section-feedback"><textarea></textarea></div>',
        "<button>Compile Responses</button>",
        "<script>const requiredGateNames = ['evidence'];</script>",
      ].join("\n"),
    }));
    writeIndex(root, [{ href: "page-a.html" }]);

    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Alignment status controls: 1 pages, exact");
  });

  it("passes on an empty alignment directory with no index", () => {
    const root = makeFixtureRoot();
    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Index integrity: 0 entries, exact");
  });

  it("fails on a page missing the TTS include", () => {
    const root = makeFixtureRoot();
    writePage(root, "page-a.html", pageHtml({ tts: null }));
    writeIndex(root, [{ href: "page-a.html" }]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("TTS include drift:");
    expect(result.stderr).toContain("Missing TTS include in alignment/page-a.html");
    expect(result.stderr).toContain("npx skillpacks alignment pages inject-tts alignment/page-a.html");
    expect(result.stderr).toContain("node scripts/inject-tts.mjs");
    expect(result.stdout).toContain("TTS include: 1 pages, DRIFT");
  });

  it("fails on a module-type TTS tag", () => {
    const root = makeFixtureRoot();
    writePage(
      root,
      "page-a.html",
      pageHtml({ tts: '<script type="module" src="../scripts/alignment-tts-kokoro.js"></script>' }),
    );
    writeIndex(root, [{ href: "page-a.html" }]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Module TTS tag in alignment/page-a.html");
    expect(result.stderr).toContain("npx skillpacks alignment pages inject-tts --force alignment/page-a.html");
    expect(result.stderr).toContain("node scripts/inject-tts.mjs --force");
  });

  it("fails on an old inline TTS block instead of the src tag", () => {
    const root = makeFixtureRoot();
    writePage(
      root,
      "page-a.html",
      pageHtml({ tts: "<script>\n// --- Brief Me TTS ---\nconst alignTTS = {};\n</script>" }),
    );
    writeIndex(root, [{ href: "page-a.html" }]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Inline TTS in alignment/page-a.html");
    expect(result.stderr).toContain("npx skillpacks alignment pages inject-tts --force alignment/page-a.html");
    expect(result.stderr).toContain("node scripts/inject-tts.mjs --force");
  });

  it("fails on missing and invalid data attributes on <html>", () => {
    const root = makeFixtureRoot();
    writePage(root, "page-a.html", pageHtml({ category: null, tier: null }));
    writePage(root, "page-b.html", pageHtml({ category: "misc", tier: "fancy" }));
    writeIndex(root, [{ href: "page-a.html" }, { href: "page-b.html" }]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Page metadata drift:");
    expect(result.stderr).toContain("Missing data-alignment-category on <html> in alignment/page-a.html");
    expect(result.stderr).toContain("Missing data-visual-tier on <html> in alignment/page-a.html");
    expect(result.stderr).toContain('Invalid data-alignment-category "misc" in alignment/page-b.html');
    expect(result.stderr).toContain('Invalid data-visual-tier "fancy" in alignment/page-b.html');
    expect(result.stdout).toContain("Page metadata: 2 pages, DRIFT");
  });

  it("fails on a page missing the viewport meta", () => {
    const root = makeFixtureRoot();
    writePage(root, "page-a.html", pageHtml({ viewport: false }));
    writeIndex(root, [{ href: "page-a.html" }]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Viewport drift:");
    expect(result.stderr).toContain("Missing viewport meta in alignment/page-a.html");
    expect(result.stdout).toContain("Viewport meta: 2 pages, DRIFT");
  });

  it("fails on embedded content elements", () => {
    const root = makeFixtureRoot();
    writePage(root, "page-a.html", pageHtml({ body: '<iframe src="other.html"></iframe>' }));
    writeIndex(root, [{ href: "page-a.html" }]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Embed prohibition drift:");
    expect(result.stderr).toContain("Embedded content in alignment/page-a.html");
    expect(result.stderr).toContain("<iframe>");
    expect(result.stdout).toContain("Embed prohibition: 2 pages, DRIFT");
  });

  it("fails on a collapsing min-height-only bar fill", () => {
    const root = makeFixtureRoot();
    const css = "<style>.bar{min-height:18px;overflow:hidden}.bar span{display:block;height:100%;background:#3fb950}</style>";
    writePage(root, "page-a.html", pageHtml({ body: `${css}<div class="bar"><span style="width:100%"></span></div>` }));
    writeIndex(root, [{ href: "page-a.html" }]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Collapsing fill drift:");
    expect(result.stderr).toContain("Collapsing fill in alignment/page-a.html");
    expect(result.stderr).toContain('its container ".bar"');
    expect(result.stdout).toContain("Collapsing fill: 2 pages, DRIFT");
  });

  it("passes a bar with an explicit container height", () => {
    const root = makeFixtureRoot();
    const css = "<style>.bar{height:18px;overflow:hidden}.bar span{display:block;height:100%;min-height:18px;background:#3fb950}</style>";
    writePage(root, "page-a.html", pageHtml({ body: `${css}<div class="bar"><span style="width:100%"></span></div>` }));
    writeIndex(root, [{ href: "page-a.html" }]);

    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Collapsing fill: 2 pages, exact");
  });

  it("fails when BIP is enabled and a Stage 2 review page has no BIP checkpoint or sibling page", () => {
    const root = makeFixtureRoot();
    writeProjectConfig(root, true);
    writePage(root, "page-a.html", pageHtml({
      status: "review",
      stage: "stage-2",
      body: stage2Body(),
    }));
    writeIndex(root, [{ href: "page-a.html" }]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("BIP handling: 1 Stage 2 pages, DRIFT");
    expect(result.stderr).toContain("BIP handling drift:");
    expect(result.stderr).toContain("Missing BIP checkpoint in alignment/page-a.html");
    expect(result.stderr).toContain("alignment/page-a-bip.html");
  });

  it("fails when linked BIP handling coexists with an active final artifact approval gate", () => {
    const root = makeFixtureRoot();
    writeProjectConfig(root, true);
    writePage(root, "page-a.html", pageHtml({
      status: "review",
      stage: "stage-2",
      body: stage2Body([
        '<aside data-bip-status="linked" data-bip-page="alignment/page-a-bip.html">',
        '<a href="page-a-bip.html">BIP review</a>',
        "<p>Open and review the BIP page at alignment/page-a-bip.html before final artifact approval.</p>",
        "</aside>",
      ].join("\n")),
    }));
    writePage(root, "page-a-bip.html", pageHtml({
      status: "review",
      extraHtmlAttrs: [
        'data-alignment-page-kind="bip"',
        'data-bip-gates="alignment/page-a.html"',
      ],
      body: "<section><h2>BIP Review</h2><p>Source-safe post options.</p></section>",
    }));
    writeIndex(root, [{ href: "page-a.html" }, { href: "page-a-bip.html" }]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("BIP handling: 1 Stage 2 pages, DRIFT");
    expect(result.stderr).toContain("BIP handling drift:");
    expect(result.stderr).toContain("cannot expose active final artifact approval controls");
    expect(result.stderr).toContain("final artifact approval");
  });

  it("passes when linked BIP handling has handoff text and read-only final approval preview only", () => {
    const root = makeFixtureRoot();
    writeProjectConfig(root, true, ["linkedin"]);
    writePage(root, "page-a.html", pageHtml({
      status: "review",
      stage: "stage-2",
      body: stage2ReadOnlyPreviewBody([
        '<aside data-bip-status="linked" data-bip-page="alignment/page-a-bip.html">',
        '<a href="page-a-bip.html">BIP review</a>',
        "<p>Open and review the BIP page at alignment/page-a-bip.html before final artifact approval.</p>",
        "</aside>",
      ].join("\n")),
    }));
    writePage(root, "page-a-bip.html", pageHtml({
      status: "review",
      extraHtmlAttrs: [
        'data-alignment-page-kind="bip"',
        'data-bip-gates="alignment/page-a.html"',
      ],
      body: bipPageBody([
        "<p>bip_platforms: linkedin</p>",
        "<p>bip_phase: implementation</p>",
        bulkDownselectGate(),
      ].join("\n")),
    }));
    writeIndex(root, [{ href: "page-a.html" }, { href: "page-a-bip.html" }]);

    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("BIP handling: 1 Stage 2 pages, exact");
    expect(result.stdout).toContain("Index integrity: 2 entries, exact");
  });

  it("passes when approved BIP YAML precedes active final artifact approval controls", () => {
    const root = makeFixtureRoot();
    writeProjectConfig(root, true);
    writePage(root, "page-a.html", pageHtml({
      status: "review",
      stage: "stage-2",
      body: stage2Body([
        '<aside data-bip-status="approved" data-bip-page="alignment/page-a-bip.html">',
        "<p>Approved BIP record:</p>",
        "<pre>bip_approval_status: ready-for-agent-review\nbip_page: alignment/page-a-bip.html</pre>",
        "</aside>",
      ].join("\n")),
    }));
    writeIndex(root, [{ href: "page-a.html" }]);

    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("BIP handling: 1 Stage 2 pages, exact");
    expect(result.stdout).toContain("Index integrity: 1 entries, exact");
  });

  it("passes a Stage 2 page without a BIP checkpoint when BIP is disabled", () => {
    const root = makeFixtureRoot();
    writeProjectConfig(root, false);
    writePage(root, "page-a.html", pageHtml({
      status: "review",
      stage: "stage-2",
      body: stage2Body(),
    }));
    writeIndex(root, [{ href: "page-a.html" }]);

    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("BIP handling: disabled, exact");
  });

  it("does not false-fail a Stage 1 scope page when BIP is enabled", () => {
    const root = makeFixtureRoot();
    writeProjectConfig(root, true);
    writePage(root, "page-a.html", pageHtml({
      status: "review",
      stage: "stage-1",
      body: [
        "<section>",
        "<h2>Research Scope</h2>",
        "<p>Scope-only review before synthesized research.</p>",
        "<h2>Stage 2 Preview / Expected Review Format</h2>",
        "<p>Later artifact review will include evidence, findings, and final artifact approval.</p>",
        "</section>",
      ].join("\n"),
    }));
    writeIndex(root, [{ href: "page-a.html" }]);

    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("BIP handling: 0 Stage 2 pages, exact");
  });

  it("fails when a BIP page omits stable page metadata", () => {
    const root = makeFixtureRoot();
    writeProjectConfig(root, true);
    writePage(root, "page-a.html");
    writePage(root, "page-a-bip.html", pageHtml({
      status: "review",
      body: "<section><h2>BIP Review</h2></section>",
    }));
    writeIndex(root, [{ href: "page-a.html" }, { href: "page-a-bip.html" }]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("BIP handling: 0 Stage 2 pages, DRIFT");
    expect(result.stderr).toContain("Missing BIP page metadata in alignment/page-a-bip.html");
    expect(result.stderr).toContain("Missing BIP gated-page metadata in alignment/page-a-bip.html");
  });

  it("passes a BIP page with saved platforms and a required bulk downselect gate", () => {
    const root = makeFixtureRoot();
    writeProjectConfig(root, true, ["linkedin", "x"]);
    writePage(root, "page-a.html");
    writePage(root, "page-a-bip.html", pageHtml({
      status: "review",
      extraHtmlAttrs: [
        'data-alignment-page-kind="bip"',
        'data-bip-gates="alignment/page-a.html"',
      ],
      body: bipPageBody([
        "<p>bip_platforms: linkedin, x</p>",
        "<p>bip_phase: implementation</p>",
        "<p>Loaded Convention Path: docs/social/linkedin-post-convention.md.</p>",
        bulkDownselectGate(),
      ].join("\n")),
    }));
    writeIndex(root, [{ href: "page-a.html" }, { href: "page-a-bip.html" }]);

    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("BIP handling: 0 Stage 2 pages, exact");
  });

  it("passes a first-run BIP page that includes platform setup and bulk downselect together", () => {
    const root = makeFixtureRoot();
    writeProjectConfig(root, true);
    writePage(root, "page-a.html");
    writePage(root, "page-a-bip.html", pageHtml({
      status: "review",
      extraHtmlAttrs: [
        'data-alignment-page-kind="bip"',
        'data-bip-gates="alignment/page-a.html"',
      ],
      body: bipPageBody([
        "<p>No saved bip_platforms exist yet; this page includes setup and draft review together.</p>",
        "<p>bip_phase: research</p>",
        platformSetupGate(),
        bulkDownselectGate(),
      ].join("\n")),
    }));
    writeIndex(root, [{ href: "page-a.html" }, { href: "page-a-bip.html" }]);

    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("BIP handling: 0 Stage 2 pages, exact");
  });

  it("fails a BIP page that uses obsolete granular gates instead of bulk downselect", () => {
    const root = makeFixtureRoot();
    writeProjectConfig(root, true, ["linkedin"]);
    writePage(root, "page-a.html");
    writePage(root, "page-a-bip.html", pageHtml({
      status: "review",
      extraHtmlAttrs: [
        'data-alignment-page-kind="bip"',
        'data-bip-gates="alignment/page-a.html"',
      ],
      body: bipPageBody([
        "<p>Old BIP state: selected-channel draft review.</p>",
        targetChannelGate(),
        draftingModeGate(),
        '<article class="gate" data-gate="content-angles" data-gate-type="content angle selection" data-section="Content Angles" data-required="true"></article>',
      ].join("\n")),
    }));
    writeIndex(root, [{ href: "page-a.html" }, { href: "page-a-bip.html" }]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("BIP handling: 0 Stage 2 pages, DRIFT");
    expect(result.stderr).toContain("Missing BIP bulk downselect gate in alignment/page-a-bip.html");
    expect(result.stderr).toContain("Obsolete BIP granular gates in alignment/page-a-bip.html");
    expect(result.stderr).toContain("target-channels, drafting-mode, content-angles");
  });

  it("fails a selected-channel BIP draft page with the stale all-channels-not-now drafting option", () => {
    const root = makeFixtureRoot();
    writeProjectConfig(root, true, ["linkedin"]);
    writePage(root, "page-a.html");
    writePage(root, "page-a-bip.html", pageHtml({
      status: "review",
      extraHtmlAttrs: [
        'data-alignment-page-kind="bip"',
        'data-bip-gates="alignment/page-a.html"',
      ],
      body: bipPageBody([
        "<p>Current BIP state: selected-channel draft review.</p>",
        "<p>Rendered selected-channel drafts are ready for review.</p>",
        bulkDownselectGate(),
        draftingModeGate(
          '<label><input type="radio" name="gate-drafting-mode" value="no drafting mode needed until channels selected"> No drafting mode needed; all channels remain not-now</label>',
        ),
      ].join("\n")),
    }));
    writeIndex(root, [{ href: "page-a.html" }, { href: "page-a-bip.html" }]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("BIP handling: 0 Stage 2 pages, DRIFT");
    expect(result.stderr).toContain("Stale BIP drafting-mode option in alignment/page-a-bip.html");
    expect(result.stderr).toContain('No drafting mode needed; all channels remain not-now');
  });

  it("fails when linked BIP handling omits the handoff before final artifact approval", () => {
    const root = makeFixtureRoot();
    writeProjectConfig(root, true);
    writePage(root, "page-a.html", pageHtml({
      status: "review",
      stage: "stage-2",
      body: stage2Body([
        '<aside data-bip-status="linked" data-bip-page="alignment/page-a-bip.html">',
        '<a href="page-a-bip.html">BIP review</a>',
        "<p>The BIP page exists for later reference.</p>",
        "</aside>",
      ].join("\n")),
    }));
    writePage(root, "page-a-bip.html", pageHtml({
      status: "review",
      extraHtmlAttrs: [
        'data-alignment-page-kind="bip"',
        'data-bip-gates="alignment/page-a.html"',
      ],
      body: "<section><h2>BIP Review</h2><p>Source-safe post options.</p></section>",
    }));
    writeIndex(root, [{ href: "page-a.html" }, { href: "page-a-bip.html" }]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain("BIP handling: 1 Stage 2 pages, DRIFT");
    expect(result.stderr).toContain(
      "must tell the reviewer to open/review alignment/page-a-bip.html before final artifact approval",
    );
  });

  it("fails when active pages exist but the central index is missing", () => {
    const root = makeFixtureRoot();
    writePage(root, "page-a.html");

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Index integrity drift:");
    expect(result.stderr).toContain("Missing central index alignment/index.html");
  });

  it("fails on an active page not linked from the index", () => {
    const root = makeFixtureRoot();
    writePage(root, "page-a.html");
    writePage(root, "page-b.html");
    writeIndex(root, [{ href: "page-a.html" }]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Unlinked page alignment/page-b.html");
    expect(result.stdout).toContain("Index integrity: 1 entries, DRIFT");
  });

  it("fails on duplicate and dangling index entries", () => {
    const root = makeFixtureRoot();
    writePage(root, "page-a.html");
    writeIndex(root, [
      { href: "page-a.html" },
      { href: "page-a.html" },
      { href: "page-gone.html" },
    ]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Duplicate index entry for alignment/page-a.html");
    expect(result.stderr).toContain("Dangling index entry alignment/page-gone.html");
  });

  it("fails on an undated index entry", () => {
    const root = makeFixtureRoot();
    writePage(root, "page-a.html");
    writePage(root, "page-b.html");
    writeIndex(root, [
      { href: "page-a.html", date: null },
      { href: "page-b.html" },
    ]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Undated index entry for alignment/page-a.html");
    expect(result.stderr).not.toContain("Undated index entry for alignment/page-b.html");
  });
});

// Drift Plan Phase 2 Step 7: direct edits to active alignment/*.html pages made
// without invoking a skill must be required to pass the audit by both root
// instruction files, in their alignment-convention sections.
describe("root instruction contract for direct alignment edits", () => {
  const rootSections = [
    { path: "CLAUDE.md", heading: "### Alignment Page Template" },
    { path: "AGENTS.md", heading: "### Alignment Page Convention" },
  ];

  function sectionText(path: string, heading: string): string {
    const content = readFileSync(join(REPO_ROOT, path), "utf8");
    const start = content.indexOf(heading);
    expect(start, `${path} has section ${heading}`).toBeGreaterThanOrEqual(0);
    const rest = content.slice(start + heading.length);
    const next = rest.search(/^##/m);
    return next === -1 ? rest : rest.slice(0, next);
  }

  it("requires the direct-edit audit to pass before commit in both root files", () => {
    for (const { path, heading } of rootSections) {
      const section = sectionText(path, heading);
      expect(section, `${path} direct-edit scope`).toContain("without invoking a skill");
      expect(section, `${path} audit command`).toContain("node scripts/audit-alignment-pages.mjs");
      expect(section, `${path} pass requirement`).toContain("(exit 0) before commit");
      expect(section, `${path} TTS fixer routing`).toContain("node scripts/inject-tts.mjs");
      expect(section, `${path} archive exemption`).toContain("docs/history/archive/");
    }
  });
});

// Interrogation-page direct-edit contract: the same root files must require the
// interrogation audit to pass before committing direct edits to interrogation/*.html.
describe("root instruction contract for direct interrogation edits", () => {
  const rootSections = [
    { path: "CLAUDE.md", heading: "### Alignment Page Template" },
    { path: "AGENTS.md", heading: "### Interrogation Page Convention" },
  ];

  function sectionText(path: string, heading: string): string {
    const content = readFileSync(join(REPO_ROOT, path), "utf8");
    const start = content.indexOf(heading);
    expect(start, `${path} has section ${heading}`).toBeGreaterThanOrEqual(0);
    const rest = content.slice(start + heading.length);
    const next = rest.search(/^##/m);
    return next === -1 ? rest : rest.slice(0, next);
  }

  it("requires the interrogation direct-edit audit to pass before commit in both root files", () => {
    for (const { path, heading } of rootSections) {
      const section = sectionText(path, heading);
      expect(section, `${path} direct-edit scope`).toContain("interrogation/*.html");
      expect(section, `${path} audit command`).toContain("node scripts/audit-interrogation-pages.mjs");
      expect(section, `${path} pass requirement`).toContain("(exit 0) before commit");
      expect(section, `${path} TTS fixer routing`).toContain("node scripts/inject-tts.mjs --dir interrogation");
      expect(section, `${path} archive exemption`).toContain("docs/history/archive/");
    }
  });
});
