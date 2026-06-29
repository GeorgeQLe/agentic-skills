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
    expect(content).toContain("draft source-safe BIP post suggestions");
    expect(content).toContain("do not report only that the BIP gate was skipped");
    expect(content).not.toContain("BIP already on, **skip** (no prompt)");
  });

  it("treats enabled BIP as a post-suggestion path, not a terminal skip", () => {
    for (const path of mirrors) {
      const content = read(path);

      expect(content, `${path} version`).toContain("version: v0.8");
      expect(content, `${path} BIP section`).toContain("**BIP post suggestions**");
      expect(content, `${path} enabled skip scope`).toContain("skip only the enablement question");
      expect(content, `${path} enabled path`).toContain("run the enabled BIP post-suggestion path");
      expect(content, `${path} dismissed branch`).toContain("skip both enablement and post suggestions");
      expect(content, `${path} yes branch`).toContain("Then run the enabled BIP post-suggestion path for this shipped session.");
      expect(content, `${path} no skip-only output`).toContain("Do not report only that the BIP gate was skipped.");
      expect(content, `${path} drafts`).toContain("draft 2-4 source-safe Build-In-Public post suggestions");
      expect(content, `${path} suggestion fields`).toContain("target channel, angle, source basis, claim-safety notes");
      expect(content, `${path} old skip contract removed`).not.toContain(
        "If `alignment.build_in_public === true`, skip. Else if `alignment.bip_prompt_dismissed === true`, skip.",
      );
    }
  });

  it("archives the previous skip-only BIP contract before the v0.8 behavior change", () => {
    for (const path of mirrors) {
      const archivedPath = path.replace("/SKILL.md", "/archive/v0.7/SKILL.md");
      const content = read(archivedPath);

      expect(content, `${archivedPath} version`).toContain("version: v0.7");
      expect(content, `${archivedPath} previous contract`).toContain(
        "If `alignment.build_in_public === true`, skip.",
      );
    }
  });
});
