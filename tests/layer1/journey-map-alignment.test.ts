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

      expect(content, `${check.command} version`).toMatch(/^version: v0\.7$/m);
      expect(content, `${check.command} report-first gate`).toContain("## Report-First Approval Gate");
      expect(content, `${check.command} builds alignment preview first`).toContain(
        "When stopping for approval, build and attempt to open the alignment preview page first",
      );
      expect(content, `${check.command} suppresses downstream routing before approval`).toContain(
        "Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language.",
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
