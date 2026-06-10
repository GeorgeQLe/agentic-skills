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
  viewport?: boolean;
  tts?: string | null;
  body?: string;
} = {}): string {
  const { category = "research", tier = "document", viewport = true, tts = TTS_TAG, body = "" } = overrides;
  const attrs = [
    'lang="en"',
    category === null ? "" : `data-alignment-category="${category}"`,
    tier === null ? "" : `data-visual-tier="${tier}"`,
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
    expect(result.stdout).toContain("Index integrity: 2 entries, exact");
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
    expect(result.stderr).toContain("inject-tts.mjs --force");
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
    expect(result.stderr).toContain("inject-tts.mjs --force");
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
