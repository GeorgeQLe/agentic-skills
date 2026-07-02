import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");

const mirrors = [
  "packs/exec-loop/claude/ship-end/SKILL.md",
  "packs/exec-loop/codex/ship-end/SKILL.md",
];

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

describe("ship-end BIP post suggestions", () => {
  it("keeps the shared BIP gate convention aligned with enabled-mode behavior", () => {
    const content = read("CLAUDE.md");

    expect(content).toContain("skip only the enablement prompt");
    expect(content).toContain("use saved `alignment.bip_platforms` only as priority/ranking metadata");
    expect(content).toContain("draft exhaustive phase-aware, source-safe BIP post candidate batches for every bundled channel");
    expect(content).toContain("Do not report only that the BIP gate was skipped.");
    expect(content).not.toContain("BIP already on, **skip** (no prompt)");
  });

  it("routes the wrap/ship BIP batch to the single HTML BIP page in the shared gate", () => {
    const content = read("CLAUDE.md");

    expect(content).toContain(
      "write that batch to the single HTML BIP page `alignment/bip/{skill-name}.html`",
    );
    expect(content).toContain("instead of rendering the candidates inline in the terminal");
    expect(content).toContain("included in `alignment/index.html`");
    expect(content).toContain("Do not publish externally or write social-ledger records without later explicit approval.");
  });

  it("defines the wrap/ship post-confirmation BIP trigger in the canonical convention", () => {
    const content = read("docs/alignment-page-convention.md");

    expect(content).toContain(
      "A wrap/ship skill that completes a clean ship without producing its own alignment page reaches this same post-confirmation step",
    );
    expect(content).toContain("`ship-end` → `alignment/bip/ship-end.html`");
    expect(content).toContain("instead of being rendered inline in the terminal");
  });

  it("treats enabled BIP as a post-suggestion path, not a terminal skip", () => {
    for (const path of mirrors) {
      const content = read(path);

      expect(content, `${path} version`).toContain("version: v0.12");
      expect(content, `${path} BIP section`).toContain("**BIP post suggestions**");
      expect(content, `${path} enabled skip scope`).toContain("skip only the enablement question");
      expect(content, `${path} enabled path`).toContain("run the enabled BIP post-suggestion path");
      expect(content, `${path} dismissed branch`).toContain("skip both enablement and post suggestions");
      expect(content, `${path} yes branch`).toContain("Then run the enabled BIP post-suggestion path for this shipped session.");
      expect(content, `${path} no skip-only output`).toContain("Do not report only that the BIP gate was skipped.");
      expect(content, `${path} saved platforms`).toContain(".agents/project.json.alignment.bip_platforms");
      expect(content, `${path} priority metadata`).toContain("optional priority/ranking metadata");
      expect(content, `${path} no platform setup`).toContain("Do not ask a project-platform setup question");
      expect(content, `${path} no saved-platform filter`).toContain("do not use saved platforms as a filter");
      expect(content, `${path} every bundled convention`).toContain("every bundled text/community and video channel convention");
      expect(content, `${path} phase-aware batches`).toContain("exhaustive phase-aware batch");
      expect(content, `${path} bip phase`).toContain("`bip_phase`");
      expect(content, `${path} suggestion fields`).toContain("target channel, optional priority rank from saved `alignment.bip_platforms`, `bip_phase`, angle, source basis, fresh-audience context, jargon expansion, public-facing significance, loaded convention path, risk level, claim-safety notes, publish precheck");
      expect(content, `${path} html output bullet`).toContain("**Write the batch to the single HTML BIP page, not inline.**");
      expect(content, `${path} bip page path`).toContain("alignment/bip/ship-end.html");
      expect(content, `${path} bip page metadata`).toContain('data-bip-source-skill="ship-end"');
      expect(content, `${path} bip generation metadata`).toContain('data-bip-generation="post-confirmation"');
      expect(content, `${path} bip terminal pointer`).toContain("Print a one-line terminal pointer to the file instead of dumping candidates inline.");
      expect(content, `${path} bip archive-before-replace`).toContain("docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/bip/ship-end.html");
      expect(content, `${path} no old count`).not.toContain("draft 2-4 source-safe Build-In-Public post suggestions");
      expect(content, `${path} no platform setup command`).not.toContain("persist the answer with `scripts/pack.sh set-bip-platforms <platform...>`");
      expect(content, `${path} old skip contract removed`).not.toContain(
        "If `alignment.build_in_public === true`, skip. Else if `alignment.bip_prompt_dismissed === true`, skip.",
      );
    }
  });

  it("archives the previous saved-platform BIP suggestion contract before the v0.10 behavior change", () => {
    for (const path of mirrors) {
      const archivedPath = path.replace("/SKILL.md", "/archive/v0.9/SKILL.md");
      const content = read(archivedPath);

      expect(content, `${archivedPath} version`).toContain("version: v0.9");
      expect(content, `${archivedPath} previous contract`).toContain(
        "use only those saved platforms for suggestions",
      );
    }
  });

  it("archives the inline-output BIP contract before the v0.11 single-HTML-page change", () => {
    for (const path of mirrors) {
      const archivedPath = path.replace("/SKILL.md", "/archive/v0.10/SKILL.md");
      const content = read(archivedPath);

      expect(content, `${archivedPath} version`).toContain("version: v0.10");
      expect(content, `${archivedPath} prior inline contract`).toContain(
        "draft post text or a concise video/community-post outline",
      );
      expect(content, `${archivedPath} no html page path`).not.toContain("alignment/bip-ship-end.html");
      expect(content, `${archivedPath} no html output bullet`).not.toContain(
        "**Write the batch to the single HTML BIP page, not inline.**",
      );
    }
  });

  it("archives the top-level BIP page contract before the v0.12 BIP directory change", () => {
    for (const path of mirrors) {
      const archivedPath = path.replace("/SKILL.md", "/archive/v0.11/SKILL.md");
      const content = read(archivedPath);

      expect(content, `${archivedPath} version`).toContain("version: v0.11");
      expect(content, `${archivedPath} prior top-level path`).toContain("alignment/bip-ship-end.html");
      expect(content, `${archivedPath} no directory path`).not.toContain("alignment/bip/ship-end.html");
    }
  });
});
