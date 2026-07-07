import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");

const activeRuntimeFiles = [
  "CLAUDE.md",
  "docs/alignment-page-convention.md",
  "docs/social-post-convention.md",
  "docs/social-video-content-convention.md",
  "docs/social-ledger-convention.md",
  "packs/base/claude/idea-scope-brief/SKILL.md",
  "packs/base/codex/idea-scope-brief/SKILL.md",
  "packs/exec-loop/claude/ship/SKILL.md",
  "packs/exec-loop/codex/ship/SKILL.md",
  "packs/exec-loop/claude/ship-end/SKILL.md",
  "packs/exec-loop/codex/ship-end/SKILL.md",
];

const removedRuntimePatterns = [
  /Build-In-Public/,
  /\bBIP\b/,
  /--bip/,
  /alignment\.bip_/,
  /alignment\.build_in_public/,
  /alignment\/bip/,
  /set-bip/,
  /data-bip-/,
  /bip_phase/,
];

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

describe("Build-In-Public runtime removal", () => {
  it("removes active BIP runtime instructions from skills and shared conventions", () => {
    for (const path of activeRuntimeFiles) {
      const content = read(path);
      for (const pattern of removedRuntimePatterns) {
        expect(content, `${path} should not match ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  it("keeps BIP config commands as deprecated cleanup guidance only", () => {
    const nodeProjectConfig = read("packages/skillpacks/src/cli/project-config.mjs");
    const packScript = read("scripts/pack.sh");

    expect(nodeProjectConfig).toContain("Build-In-Public has been removed.");
    expect(nodeProjectConfig).toContain("Run skillpacks cleanup to remove stale alignment.build_in_public, alignment.bip_platforms, and alignment.bip_prompt_dismissed config.");
    expect(packScript).toContain("Build-In-Public has been removed.");
    expect(packScript).toContain("Run scripts/pack.sh cleanup to remove stale alignment.build_in_public, alignment.bip_platforms, and alignment.bip_prompt_dismissed config.");
  });
});
