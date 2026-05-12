import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  evaluateQuality,
  qualityAssertions,
  type QualityRubric,
} from "../harness/bench-quality.js";
import {
  concreteCommandReferenceCriterion,
  concreteFileReferenceCriterion,
  createSetupQualityEvaluator,
  forbiddenFabricationCriterion,
  nextRouteCriterion,
  referenceTraitCriterion,
  requiredFactCoverageCriterion,
  specificityCriterion,
} from "../layer4/setup-helpers/quality.js";

const FIXTURE_ROOT = resolve(import.meta.dirname, "../fixtures/bench-quality");

const rubric: QualityRubric = {
  minimumScore: 0.8,
  criteria: [
    {
      id: "evidence-linked",
      description: "Names concrete source files or task facts used as evidence",
      weight: 3,
      critical: true,
      evaluate: qualityAssertions.requiredFacts([
        "tasks/todo.md",
        "tests/harness/bench-report.ts",
        "tests/harness/bench-types.ts",
      ]),
    },
    {
      id: "specific-scope",
      description: "Describes the exact implementation or test scope instead of generic progress",
      weight: 2,
      evaluate: qualityAssertions.specificity({
        requiredAny: ["Step 36.1", "quality tests", "benchmark quality"],
        forbiddenPhrases: ["made the benchmark better", "should be useful", "some tests somewhere"],
      }),
    },
    {
      id: "no-fabrication",
      description: "Avoids fabricated files, services, deploys, or validation claims",
      weight: 3,
      critical: true,
      evaluate: qualityAssertions.forbiddenFabrications([
        ".github/workflows/benchmark.yml",
        "OpenAI Evals API",
        "Postgres",
        "production",
        "GitHub Actions",
      ]),
    },
    {
      id: "actionable-handoff",
      description: "Includes a concrete next work item and command route",
      weight: 1,
      evaluate: qualityAssertions.requiredPatterns([
        /Next work:\s*\S/i,
        /Recommended next command:\s*\$run/i,
      ]),
    },
    {
      id: "reference-traits",
      description: "Matches reference traits for a useful run-step output",
      weight: 1,
      evaluate: qualityAssertions.referenceTraits({
        traits: ["evidence", "validation", "scope", "next command"],
      }),
    },
  ],
};

describe("benchmark output quality evaluation", () => {
  it("aggregates weighted rubric criteria and passes strong fixture output", () => {
    const result = evaluateQuality(rubric, fixture("strong-run-output.md"));

    expect(result.score).toBeCloseTo(1);
    expect(result.passed).toBe(true);
    expect(result.thresholdPassed).toBe(true);
    expect(result.criticalFailures).toEqual([]);
    expect(result.criteria).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "evidence-linked", score: 1, passed: true }),
        expect.objectContaining({ id: "no-fabrication", score: 1, passed: true }),
      ]),
    );
    expect(result.notes).toContainEqual(expect.stringContaining("threshold"));
  });

  it("fails generic output that lacks evidence, specificity, and an actionable handoff", () => {
    const result = evaluateQuality(rubric, fixture("generic-run-output.md"));

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(0.8);
    expect(result.criteria.find((criterion) => criterion.id === "evidence-linked")).toMatchObject({
      passed: false,
    });
    expect(result.criteria.find((criterion) => criterion.id === "specific-scope")).toMatchObject({
      passed: false,
    });
  });

  it("fails hallucinated output even when it is specific", () => {
    const result = evaluateQuality(rubric, fixture("hallucinated-run-output.md"));

    expect(result.passed).toBe(false);
    expect(result.criticalFailures).toContain("no-fabrication");
    expect(result.criteria.find((criterion) => criterion.id === "no-fabrication")).toMatchObject({
      passed: false,
      score: 0,
    });
  });

  it("records evaluator notes for degraded output", () => {
    const result = evaluateQuality(rubric, fixture("degraded-run-output.md"));

    expect(result.passed).toBe(false);
    expect(result.notes).toEqual(
      expect.arrayContaining([
        expect.stringContaining("missing required fact"),
        expect.stringContaining("forbidden phrase"),
      ]),
    );
  });

  it("provides setup-facing criterion helpers for common quality checks", () => {
    const evaluator = createSetupQualityEvaluator({
      minimumScore: 0.85,
      criteria: [
        requiredFactCoverageCriterion({
          id: "step-fact",
          description: "Names the selected step",
          weight: 2,
          critical: true,
          facts: ["Step 36.1"],
        }),
        concreteFileReferenceCriterion({
          id: "file-reference",
          description: "Names concrete changed files",
          weight: 2,
          files: ["tests/harness/bench-report.ts"],
        }),
        concreteCommandReferenceCriterion({
          id: "command-reference",
          description: "Names concrete validation commands",
          weight: 1,
          commands: ["git diff --check"],
        }),
        specificityCriterion({
          id: "scope",
          description: "Avoids generic scope language",
          weight: 1,
          requiredAny: ["benchmark quality"],
          forbiddenPhrases: ["made the benchmark better"],
        }),
        referenceTraitCriterion({
          id: "traits",
          description: "Includes useful handoff traits",
          weight: 1,
          traits: ["evidence", "validation", "scope"],
        }),
        nextRouteCriterion({
          id: "route",
          description: "Includes the next route",
          weight: 1,
          route: "$run",
        }),
        forbiddenFabricationCriterion({
          id: "fabrication",
          description: "Rejects invented implementation facts",
          weight: 2,
          critical: true,
          forbidden: ["OpenAI Evals API", "GitHub Actions"],
        }),
      ],
    });

    const strong = evaluator.evaluate(fixture("strong-run-output.md"));
    const hallucinated = evaluator.evaluate(fixture("hallucinated-run-output.md"));
    const recommendedNextSkill = evaluator.evaluate([
      "Step 36.1 evidence",
      "tests/harness/bench-report.ts",
      "benchmark quality",
      "evidence validation scope",
      "Recommended next skill: $run",
    ].join("\n"));

    expect(strong.passed).toBe(true);
    expect(recommendedNextSkill.criteria.find((criterion) => criterion.id === "route")).toMatchObject({
      passed: true,
    });
    expect(strong.criteria.map((criterion) => criterion.id)).toEqual(
      expect.arrayContaining([
        "step-fact",
        "file-reference",
        "command-reference",
        "scope",
        "traits",
        "route",
        "fabrication",
      ]),
    );
    expect(hallucinated.passed).toBe(false);
    expect(hallucinated.criticalFailures).toContain("fabrication");
  });
});

function fixture(name: string): string {
  return readFileSync(resolve(FIXTURE_ROOT, name), "utf8");
}
