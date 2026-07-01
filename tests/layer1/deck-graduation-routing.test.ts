import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const REPO_ROOT = resolve(import.meta.dirname, "../..");

function read(relativePath: string): string {
  return readFileSync(resolve(REPO_ROOT, relativePath), "utf8");
}

function expectContainsAll(text: string, expected: string[]): void {
  for (const value of expected) {
    expect(text).toContain(value);
  }
}

describe("rapid deck graduation routing", () => {
  it("documents VARD and ORD rapid chains through traction", () => {
    const decks = read("docs/decks.md");
    const matrix = read("docs/pack-workflow-matrix.md");

    for (const text of [decks, matrix]) {
      expect(text).toContain("vard-scan -> vard-align -> vard-ship -> vard-traction");
      expect(text).toContain("ord-scan -> ord-align -> ord-ship -> ord-traction");
    }
  });

  it("keeps Business AFPS canonical on business-research, with business-discovery only as an alias", () => {
    const canonicalDocs = [
      "docs/decks.md",
      "docs/skills-reference.md",
      "docs/operating-modes.md",
      "docs/codex-workflow.md",
      "docs/orchestrator-convention.md",
      "packs/vard/PACK.md",
    ];

    for (const file of canonicalDocs) {
      const text = read(file);
      expect(text).toContain("business-research");
      expect(text).not.toContain("npx skillpacks install business-discovery");
    }

    expect(read("docs/packs.md")).toContain(
      "`business-discovery` is accepted as a compatibility alias for `business-research`",
    );
  });

  it("routes VARD graduation to business-research plus idea-scope-brief or customer-discovery", () => {
    const vardPack = read("packs/vard/PACK.md");
    const claudeTraction = read("packs/vard/claude/vard-traction/SKILL.md");
    const codexTraction = read("packs/vard/codex/vard-traction/SKILL.md");

    expectContainsAll(vardPack, [
      "npx skillpacks install business-research",
      "$idea-scope-brief",
      "$customer-discovery",
      "scan, align, ship-log, and traction-log",
    ]);
    expectContainsAll(claudeTraction, [
      "npx skillpacks install business-research",
      "/idea-scope-brief",
      "/customer-discovery",
      "scan, align, ship-log, and traction-log",
    ]);
    expectContainsAll(codexTraction, [
      "npx skillpacks install business-research",
      "$idea-scope-brief",
      "$customer-discovery",
      "scan, align, ship-log, and traction-log",
    ]);
  });

  it("routes ORD graduation to devtool plus devtool-workflow or devtool-user-map", () => {
    const ordPack = read("packs/ord/PACK.md");
    const devtoolPack = read("packs/devtool/PACK.md");
    const claudeTraction = read("packs/ord/claude/ord-traction/SKILL.md");
    const codexTraction = read("packs/ord/codex/ord-traction/SKILL.md");

    for (const text of [ordPack, devtoolPack]) {
      expectContainsAll(text, [
        "npx skillpacks install devtool",
        "$devtool-workflow",
        "$devtool-user-map",
        "scan, align, ship-log, and traction-log",
      ]);
    }

    expectContainsAll(claudeTraction, [
      "npx skillpacks install devtool",
      "/devtool-workflow",
      "/devtool-user-map",
      "scan, align, ship-log, and traction-log",
    ]);
    expectContainsAll(codexTraction, [
      "npx skillpacks install devtool",
      "$devtool-workflow",
      "$devtool-user-map",
      "scan, align, ship-log, and traction-log",
    ]);
  });

  it("keeps ship skills routing to traction before AFPS", () => {
    const vardClaude = read("packs/vard/claude/vard-ship/SKILL.md");
    const vardCodex = read("packs/vard/codex/vard-ship/SKILL.md");
    const ordClaude = read("packs/ord/claude/ord-ship/SKILL.md");
    const ordCodex = read("packs/ord/codex/ord-ship/SKILL.md");

    expect(vardClaude).toContain("/vard-traction");
    expect(vardCodex).toContain("$vard-traction");
    expect(ordClaude).toContain("/ord-traction");
    expect(ordCodex).toContain("$ord-traction");

    for (const text of [vardClaude, vardCodex, ordClaude, ordCodex]) {
      expect(text).toContain("before any");
      expect(text).not.toContain("then /idea-scope-brief");
      expect(text).not.toContain("then $idea-scope-brief");
      expect(text).not.toContain("then /devtool-workflow");
      expect(text).not.toContain("then $devtool-workflow");
    }
  });
});
