import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");
const read = (path: string) => readFileSync(resolve(ROOT, path), "utf8");

const convention = read("docs/codex-accountable-agent-workflow.md");
const plan = read("packs/agent-work-admin/codex/plan-phase/SKILL.md");
const exec = read("packs/exec-loop/codex/exec/SKILL.md");
const review = read("packs/code-review/codex/expert-review/SKILL.md");
const ship = read("packs/exec-loop/codex/ship/SKILL.md");
const shipEnd = read("packs/exec-loop/codex/ship-end/SKILL.md");

describe("Codex accountable agent workflow", () => {
  it("activates by risk while preserving the trivial single-owner path", () => {
    expect(convention).toContain("Every non-trivial Codex mutation receives a read-only Terra audit");
    expect(convention).toContain("Trivial typo, formatting-only, narrow text, and task-checkbox changes");
    expect(plan).toContain("sol-only-trivial | sol-terra | sol-luna-terra");
  });

  it("bounds Luna fan-out and requires decision-complete assignments and returns", () => {
    expect(convention).toContain("default maximum is three concurrent Luna implementers");
    for (const field of ["objective and acceptance criteria", "allowed paths", "forbidden and shared paths", "verification commands", "dependencies", "requested model", "resolved model", "required return evidence"]) {
      expect(convention).toContain(field);
    }
    for (const field of ["changed paths", "diff/commit evidence", "acceptance-criteria mapping", "verification commands and results", "assumptions or deviations", "unresolved risks"]) {
      expect(convention).toContain(field);
    }
    expect(convention).toContain("Reject, merge, or serialize any overlapping write ownership");
    expect(plan).toContain("one to three Luna implementation lanes");
    expect(exec).toContain("Reject overlapping ownership");
    expect(exec).toContain("enforce allowed/forbidden paths");
  });

  it("keeps integration and shipping with Sol", () => {
    expect(convention).toMatch(/\*\*Sol\*\* is the accountable owner/);
    expect(convention).toContain("Sol is always the final integration and delivery owner");
    expect(exec).toContain("personally integrate or reject the work");
    expect(ship).toContain("Sol remains the sole integration and delivery owner");
    expect(shipEnd).toContain("Sol remains the sole integration and delivery owner");
  });

  it("requires fresh read-only Terra findings and complete Sol dispositions", () => {
    expect(review).toContain("--adversarial-diff");
    expect(review).toContain("--read-only");
    expect(review).toContain("fresh context that did not implement or integrate");
    for (const field of ["stable ID", "file and line evidence", "impact/failure mode", "recommended remediation", "verification method", "confidence"]) {
      expect(review).toContain(field);
    }
    for (const forbidden of ["repository files", "task documents", "prompt history", "alignment pages", "the index", "branches", "commits", "refs", "external state"]) {
      expect(review).toContain(forbidden);
    }
    expect(review).toContain("overrides every mutation-producing instruction");
    expect(review).toContain("Skip alignment-page creation when `--read-only` is active");
    expect(review).toContain("Skip all shipping, commit, push, task-document, and prompt-history mutations");
    expect(convention).toContain("exactly one disposition for every Terra finding");
    for (const disposition of ["`accepted`", "`rejected`", "`deferred`"]) expect(convention).toContain(disposition);
    expect(convention).toContain("cite concrete code, test, specification, or runtime evidence");
    expect(convention).toContain("record residual risk, owner or destination, and a concrete next step");
    for (const skill of [ship, shipEnd]) expect(skill).toContain("complete Sol dispositions");
  });

  it("blocks unresolved high-severity findings and requires focused high-risk re-audit", () => {
    for (const skill of [exec, ship, shipEnd]) {
      expect(skill).toMatch(/accepted Critical\/High.*unresolved/);
      expect(skill).toMatch(/focused Terra re-audit/);
    }
    for (const trigger of ["security", "authentication", "billing", "persistence", "migrations", "concurrency", "privacy", "data loss", "broad cross-package contracts"]) {
      expect(convention).toContain(trigger);
    }
  });

  it("requires final accountability evidence and truthful model fallback disclosure", () => {
    for (const field of ["Luna assignments and results", "Sol diff inspection and integration evidence", "grouped changed files", "integrated verification", "Terra findings", "remediation", "focused Terra re-audit", "deferred risks", "final Sol acceptance"]) {
      expect(convention).toContain(field);
    }
    expect(convention).toContain("resolved model: unavailable");
    expect(convention).toContain("Never claim an unverified model identity");
    for (const skill of [exec, ship, shipEnd]) expect(skill).toMatch(/requested\/resolved models|model-routing fallbacks/);
  });

  it("keeps the lifecycle Codex-only", () => {
    const claudeSources = [
      "packs/agent-work-admin/claude/plan-phase/SKILL.md",
      "packs/exec-loop/claude/exec/SKILL.md",
      "packs/code-review/claude/expert-review/SKILL.md",
      "packs/exec-loop/claude/ship/SKILL.md",
      "packs/exec-loop/claude/ship-end/SKILL.md",
    ].map(read);
    for (const source of claudeSources) {
      expect(source).not.toContain("Accountability topology");
      expect(source).not.toContain("Sol/Luna/Terra");
      expect(source).not.toContain("--adversarial-diff");
    }
  });
});
