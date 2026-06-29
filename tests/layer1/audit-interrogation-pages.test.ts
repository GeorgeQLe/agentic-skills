import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = resolve(TESTS_ROOT, "..");
const SCRIPT = resolve(REPO_ROOT, "scripts/audit-interrogation-pages.mjs");

const tempRoots: string[] = [];

afterEach(() => {
  for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function makeFixtureRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "interrogation-audit-"));
  tempRoots.push(root);
  mkdirSync(join(root, "interrogation"), { recursive: true });
  return root;
}

const TTS_TAG = '<script src="../scripts/alignment-tts-kokoro.js"></script>';

function pageHtml(overrides: {
  tier?: string | null;
  status?: string | null;
  round?: string | null;
  gate?: string | null;
  viewport?: boolean;
  tts?: string | null;
  openInput?: boolean;
  openQuestion?: boolean;
  recommended?: boolean;
  agentRecommended?: boolean;
  agentRecommendedAttrs?: string;
  confidence?: string | null;
  clarifyCopy?: boolean;
  applyRecommended?: boolean;
  sidecar?: string | null;
  body?: string;
} = {}): string {
  const {
    tier = "document",
    status = "review",
    round = "1",
    gate = "continue",
    viewport = true,
    tts = TTS_TAG,
    openInput = true,
    openQuestion = true,
    recommended = true,
    agentRecommended = true,
    agentRecommendedAttrs = "hidden",
    confidence = "medium",
    clarifyCopy = true,
    applyRecommended = true,
    sidecar = "research/_working/interrogation-positioning-r1.yaml",
    body = "",
  } = overrides;
  const attrs = [
    'lang="en"',
    tier === null ? "" : `data-visual-tier="${tier}"`,
    status === null ? "" : `data-interrogation-status="${status}"`,
    round === null ? "" : `data-interrogation-round="${round}"`,
    gate === null ? "" : `data-interrogation-gate="${gate}"`,
  ].filter(Boolean).join(" ");
  const input = openInput ? '<textarea data-open-input placeholder="In your words"></textarea>' : "";
  const recommendedEl = recommended ? '<p data-recommended-answer>e.g. mid-market RevOps leads</p>' : "";
  const agentRecommendedEl = agentRecommended
    ? `<p data-agent-recommended-answer ${agentRecommendedAttrs}>mid-market RevOps leads</p>`
    : "";
  const confidenceEl = confidence === null
    ? ""
    : `<span data-agent-confidence="${confidence}">Agent confidence: ${confidence}</span>`;
  const clarifyEl = clarifyCopy ? '<button data-clarify-copy>Need clarification</button>' : "";
  const applyEl = applyRecommended ? '<button data-apply-recommended>Apply recommended</button>' : "";
  const inner = `${recommendedEl}${agentRecommendedEl}${confidenceEl}${input}${clarifyEl}${applyEl}`;
  const open = openQuestion
    ? `<div data-open-question>${inner}</div>`
    : inner;
  const compile = sidecar === null
    ? '<section class="compile"><button>Compile Responses</button></section>'
    : `<section class="compile" data-answer-sidecar="${sidecar}"><button>Compile Responses</button></section>`;
  return [
    "<!doctype html>",
    `<html ${attrs}>`,
    "<head>",
    '<meta charset="utf-8">',
    viewport ? '<meta name="viewport" content="width=device-width, initial-scale=1">' : "",
    "<title>Fixture Round</title>",
    "</head>",
    "<body>",
    `<main><h1>Fixture Round</h1>${open}${compile}${body}</main>`,
    tts ?? "",
    "</body>",
    "</html>",
    "",
  ].filter(Boolean).join("\n");
}

function writePage(root: string, name: string, html: string = pageHtml()): void {
  writeFileSync(join(root, "interrogation", name), html);
}

function runScript(root?: string) {
  const args = root ? [SCRIPT, "--root", root] : [SCRIPT];
  return spawnSync(process.execPath, args, { encoding: "utf8" });
}

describe("audit-interrogation-pages repo state", () => {
  it("exits 0 on the current repo with exact summary lines", () => {
    const result = runScript();
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/TTS include: \d+ pages, exact/);
    expect(result.stdout).toMatch(/Page metadata: \d+ pages, exact/);
    expect(result.stdout).toMatch(/Open input: \d+ pages, exact/);
    expect(result.stdout).toMatch(/Confidence gate: \d+ pages, exact/);
    expect(result.stdout).toMatch(/Round naming: \d+ pages, exact/);
    expect(result.stdout).toMatch(/Answer sidecar: \d+ pages, exact/);
    expect(result.stdout).toMatch(/Collapsing fill: \d+ pages, exact/);
  });
});

describe("audit-interrogation-pages fixture trees", () => {
  it("passes on a clean fixture tree", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html");
    writePage(root, "positioning-r2-acme.html", pageHtml({ round: "2", gate: "coverage-checkpoint" }));

    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Active pages: 2");
    expect(result.stdout).toContain("Open input: 2 pages, exact");
    expect(result.stdout).toContain("Open question: 2 pages, exact");
    expect(result.stdout).toContain("Confidence gate: 2 pages, exact");
  });

  it("passes on an empty interrogation directory", () => {
    const root = makeFixtureRoot();
    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Active pages: 0");
  });

  it("fails on a page missing the TTS include", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({ tts: null }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("TTS include drift:");
    expect(result.stderr).toContain("Missing TTS include in interrogation/positioning-r1-acme.html");
    expect(result.stderr).toContain("node scripts/inject-tts.mjs --dir interrogation");
  });

  it("fails on a module-type TTS tag", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({
      tts: '<script type="module" src="../scripts/alignment-tts-kokoro.js"></script>',
    }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Module TTS tag in interrogation/positioning-r1-acme.html");
  });

  it("fails on missing and invalid metadata attributes", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({ tier: null, status: null }));
    writePage(root, "positioning-r2-acme.html", pageHtml({ round: "2", tier: "fancy", status: "open" }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Page metadata drift:");
    expect(result.stderr).toContain("Missing data-visual-tier on <html> in interrogation/positioning-r1-acme.html");
    expect(result.stderr).toContain("Missing data-interrogation-status on <html> in interrogation/positioning-r1-acme.html");
    expect(result.stderr).toContain('Invalid data-visual-tier "fancy" in interrogation/positioning-r2-acme.html');
    expect(result.stderr).toContain('Invalid data-interrogation-status "open" in interrogation/positioning-r2-acme.html');
  });

  it("fails when no open input is present", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({ openInput: false }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Open input drift:");
    expect(result.stderr).toContain("No open input in interrogation/positioning-r1-acme.html");
    expect(result.stdout).toContain("Open input: 1 pages, DRIFT");
  });

  it("fails when no open-question block is present", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({ openQuestion: false }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Open question drift:");
    expect(result.stderr).toContain("No open-question block in interrogation/positioning-r1-acme.html");
    expect(result.stdout).toContain("Open question: 1 pages, DRIFT");
  });

  it("fails when an open question is missing its recommended answer", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({ recommended: false }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Open question drift:");
    expect(result.stderr).toContain("Missing recommended answer in interrogation/positioning-r1-acme.html");
  });

  it("fails when an open question is missing its hidden agent recommended answer", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({ agentRecommended: false }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Open question drift:");
    expect(result.stderr).toContain("Missing hidden agent recommended answer in interrogation/positioning-r1-acme.html");
  });

  it("fails when the agent recommended answer is not hidden", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({ agentRecommendedAttrs: "" }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Open question drift:");
    expect(result.stderr).toContain("Visible agent recommended answer in interrogation/positioning-r1-acme.html");
  });

  it("accepts common hidden conventions for the agent recommended answer", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({ agentRecommendedAttrs: 'aria-hidden="true"' }));
    writePage(root, "positioning-r2-acme.html", pageHtml({ round: "2", agentRecommendedAttrs: 'class="visually-hidden"' }));
    writePage(root, "positioning-r3-acme.html", pageHtml({ round: "3", agentRecommendedAttrs: 'style="display: none;"' }));
    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Open question: 3 pages, exact");
  });

  it("does not count selector strings in scripts as open-question markers", () => {
    const root = makeFixtureRoot();
    const script = `<script>
      document.querySelector("[data-open-question] [data-agent-recommended-answer]");
      document.querySelector("[data-recommended-answer]");
    </script>`;
    writePage(root, "positioning-r1-acme.html", pageHtml({ body: script }));
    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Open question: 1 pages, exact");
  });

  it("fails on a missing or invalid agent-confidence badge", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({ confidence: null }));
    writePage(root, "positioning-r2-acme.html", pageHtml({ round: "2", confidence: "certain" }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Open question drift:");
    expect(result.stderr).toContain("Missing agent-confidence badge in interrogation/positioning-r1-acme.html");
    expect(result.stderr).toContain('Invalid data-agent-confidence "certain" in interrogation/positioning-r2-acme.html');
  });

  it("fails when an open question is missing its clarify-copy button", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({ clarifyCopy: false }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Open question drift:");
    expect(result.stderr).toContain("Missing clarify-copy button in interrogation/positioning-r1-acme.html");
  });

  it("fails when an open question is missing its apply-recommended button", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({ applyRecommended: false }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Open question drift:");
    expect(result.stderr).toContain("Missing apply-recommended button in interrogation/positioning-r1-acme.html");
  });

  it("fails on a missing or invalid confidence gate", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({ gate: null }));
    writePage(root, "positioning-r2-acme.html", pageHtml({ round: "2", gate: "done" }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Confidence gate drift:");
    expect(result.stderr).toContain("Missing data-interrogation-gate in interrogation/positioning-r1-acme.html");
    expect(result.stderr).toContain('Invalid data-interrogation-gate "done" in interrogation/positioning-r2-acme.html');
  });

  it("fails on a bad round-file name and round mismatch", () => {
    const root = makeFixtureRoot();
    writePage(root, "badname.html", pageHtml({ round: "1" }));
    writePage(root, "positioning-r1-acme.html", pageHtml({ round: "3" }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Round naming drift:");
    expect(result.stderr).toContain("Invalid interrogation page name interrogation/badname.html");
    expect(result.stderr).toContain("Round mismatch in interrogation/positioning-r1-acme.html");
  });

  it("fails on a missing or invalid answer sidecar", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({ sidecar: null }));
    writePage(root, "positioning-r2-acme.html", pageHtml({ round: "2", sidecar: "research/notes.yaml" }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Answer sidecar drift:");
    expect(result.stderr).toContain("Missing data-answer-sidecar in interrogation/positioning-r1-acme.html");
    expect(result.stderr).toContain('Invalid data-answer-sidecar "research/notes.yaml" in interrogation/positioning-r2-acme.html');
  });

  it("fails on embedded content elements", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({ body: '<iframe src="other.html"></iframe>' }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Embed prohibition drift:");
    expect(result.stderr).toContain("Embedded content in interrogation/positioning-r1-acme.html");
  });

  it("fails on a page missing the viewport meta", () => {
    const root = makeFixtureRoot();
    writePage(root, "positioning-r1-acme.html", pageHtml({ viewport: false }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Viewport drift:");
    expect(result.stderr).toContain("Missing viewport meta in interrogation/positioning-r1-acme.html");
  });

  it("fails on a collapsing min-height-only bar fill", () => {
    const root = makeFixtureRoot();
    const css = "<style>.bar{min-height:18px;overflow:hidden}.bar span{display:block;height:100%;background:#3fb950}</style>";
    writePage(root, "positioning-r1-acme.html", pageHtml({ body: `${css}<div class="bar"><span style="width:100%"></span></div>` }));
    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Collapsing fill drift:");
    expect(result.stderr).toContain("Collapsing fill in interrogation/positioning-r1-acme.html");
    expect(result.stderr).toContain('its container ".bar"');
    expect(result.stdout).toContain("Collapsing fill: 1 pages, DRIFT");
  });

  it("passes a bar with an explicit container height", () => {
    const root = makeFixtureRoot();
    const css = "<style>.bar{height:18px;overflow:hidden}.bar span{display:block;height:100%;min-height:18px;background:#3fb950}</style>";
    writePage(root, "positioning-r1-acme.html", pageHtml({ body: `${css}<div class="bar"><span style="width:100%"></span></div>` }));
    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Collapsing fill: 1 pages, exact");
  });
});
