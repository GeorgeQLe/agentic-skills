import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = resolve(TESTS_ROOT, "..");

function readRepoFile(path: string): string {
  return readFileSync(resolve(REPO_ROOT, path), "utf8");
}

function routeFromBenchmarkReport(report: string, skill: string): string {
  const repeatedFalseNegative = /repeated same-family benchmark false negatives/i.test(report)
    || /same family of valid outputs/i.test(report);
  if (repeatedFalseNegative) {
    return `$session-triage ${skill} benchmark repeated false-negative generalization`;
  }
  if (/hard assertions failed|quality threshold failed|failed assertions/i.test(report)) {
    return `$session-triage ${skill} benchmark failure`;
  }
  if (/evaluated pass rate:\s*100%/i.test(report)) {
    return `$benchmark-agent-review ${skill}`;
  }
  return "$ship";
}

function triageRecommendation(report: string, skill: string): string {
  const sameFamilyReports = (report.match(/benchmark false negative/gi) ?? []).length;
  const namesOwner = /agentic-skills-benchmarks|tests\/layer4\/setups|tests\/harness/i.test(report);
  if (sameFamilyReports >= 2 && namesOwner) {
    return `$session-triage ${skill} benchmark repeated false-negative generalization`;
  }
  return `$session-triage ${skill} benchmark failure`;
}

describe("benchmark-test-skill layer2 fixture coverage", () => {
  it("routes repeated benchmark false-negative families to generalized remediation", () => {
    const codexContract = readRepoFile("packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md");
    const claudeContract = readRepoFile("packs/agentic-skills-bench/claude/benchmark-test-skill/SKILL.md");

    expect(codexContract).toContain("do not recommend another blind rerun");
    expect(claudeContract).toContain("do not recommend another blind rerun");

    const report = [
      "# Benchmark Test: update-packages",
      "",
      "Hard assertions failed after two prior triage reports.",
      "The current failure is part of repeated same-family benchmark false negatives around valid pnpm latest warning language.",
      "Previous triage says the same family of valid outputs should be handled by a semantic evaluator.",
    ].join("\n");

    expect(routeFromBenchmarkReport(report, "update-packages")).toBe(
      "$session-triage update-packages benchmark repeated false-negative generalization",
    );
  });

  it("keeps ordinary benchmark failures routed to session-triage", () => {
    const report = [
      "# Benchmark Test: roadmap",
      "",
      "Failed assertions:",
      "- Output omits the required roadmap artifact.",
      "No prior same-family false-negative triage reports are available.",
    ].join("\n");

    expect(routeFromBenchmarkReport(report, "roadmap")).toBe("$session-triage roadmap benchmark failure");
  });
});

describe("session-triage layer2 fixture coverage", () => {
  it("generalizes repeated same-family benchmark false negatives instead of one-off phrasing patches", () => {
    const codexContract = readRepoFile("packs/session-analytics/codex/session-triage/SKILL.md");
    const claudeContract = readRepoFile("packs/session-analytics/claude/session-triage/SKILL.md");

    expect(codexContract).toContain("check recent same-skill `agentic-skills-benchmarks/benchmark/triage-<skill>-*.md` reports");
    expect(claudeContract).toContain("check recent same-skill `agentic-skills-benchmarks/benchmark/triage-<skill>-*.md` reports");

    const triageEvidence = [
      "# Triage",
      "",
      "benchmark false negative: valid warning line rejected.",
      "benchmark false negative: valid parenthetical negation rejected.",
      "Owner target: agentic-skills-benchmarks tests/layer4/setups/tier23-base-workflows.setup.ts.",
      "Recommended fix: add a family-level semantic evaluator with positive and negative fixture shapes.",
    ].join("\n");

    expect(triageRecommendation(triageEvidence, "update-packages")).toBe(
      "$session-triage update-packages benchmark repeated false-negative generalization",
    );
  });

  it("does not generalize when recurrence evidence is absent", () => {
    const triageEvidence = [
      "# Triage",
      "",
      "benchmark false negative: one valid output shape was rejected.",
      "Owner target: agentic-skills-benchmarks tests/layer4/setups/tier23-base-workflows.setup.ts.",
    ].join("\n");

    expect(triageRecommendation(triageEvidence, "ship-end")).toBe(
      "$session-triage ship-end benchmark failure",
    );
  });
});
