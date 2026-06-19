import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

describe("journey-map alignment preview contract", () => {
  it("requires pre-approval HTML alignment previews before canonical journey-map writes", () => {
    const checks = [
      {
        path: resolve(TESTS_ROOT, "../packs/customer-lifecycle/codex/journey-map/SKILL.md"),
        command: "$journey-map",
      },
      {
        path: resolve(TESTS_ROOT, "../packs/customer-lifecycle/claude/journey-map/SKILL.md"),
        command: "/journey-map",
      },
    ];

    for (const check of checks) {
      const content = readFileSync(check.path, "utf8");

      expect(content, `${check.command} version`).toMatch(/^version: v\d+\.\d+$/m);
      expect(content, `${check.command} report-first gate`).toContain("## Report-First Approval Gate");
      expect(content, `${check.command} scope-first approval`).toContain("Default to scope-first approval");
      expect(content, `${check.command} blocks synthesis before scope approval`).toContain(
        "Do not perform synthesized research, rank candidates, make recommendations, or write working packets",
      );
      expect(content, `${check.command} builds scope alignment page first`).toContain(
        "Build the `review` HTML alignment page before synthesized research",
      );
      expect(content, `${check.command} stops for research scope approval`).toContain(
        "Stop for final compiled YAML approval of the research scope",
      );
      // Accept either the canonical downstream-stop literal or the unified
      // paraphrase the AFPS research orchestrators deliberately share.
      expect(content, `${check.command} suppresses downstream routing before approval`).toMatch(
        /Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language|Do not include downstream or cross-skill command recommendations/,
      );
      expect(content, `${check.command} uses journey page path`).toContain(
        "alignment/journey-map-{topic}.html",
      );
      expect(content, `${check.command} has journey translation rules`).toContain(
        "**Journey research translation.**",
      );
      expect(content, `${check.command} includes stage evidence`).toContain(
        "evidence coverage by journey stage",
      );
      expect(content, `${check.command} rejects chat-only substitute`).toContain(
        "Do not treat a plain-text lifecycle summary as a substitute for the HTML alignment preview.",
      );
    }
  });
});
