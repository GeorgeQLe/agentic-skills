import { describe, it, expect, afterAll } from "vitest";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { createTempProject, installPack, runClaude } from "../harness/runner.js";
import { inputFixture } from "../harness/fixtures.js";
import { hasRequiredSections, validDAG } from "../harness/judge.js";

let workDir: string;

describe("full alignment-loop pipeline", () => {
  afterAll(() => {
    if (workDir) {
      try {
        rmSync(workDir, { recursive: true, force: true });
      } catch {
        // best effort
      }
    }
  });

  it("chains destination-doc → vertical-slice-splitter end-to-end", () => {
    workDir = createTempProject();
    installPack(workDir, "alignment-loop");

    const appIdea = inputFixture("app-idea-fitness-tracker.md");
    writeFileSync(join(workDir, "context.md"), appIdea);

    // Step 1: destination-doc
    const step1 = runClaude({
      prompt: `You have the alignment-loop skill pack installed. Read context.md for the project context. Run the destination-doc skill to create a destination document for the fitness-tracker project. Write the output to research/destination-fitness-tracker.md following the skill's document structure exactly. Do NOT run vertical-slice-splitter yet.`,
      workDir,
      maxBudgetUsd: 0.5,
      timeoutMs: 120_000,
    });

    const docPath = step1.files.find((f) =>
      f.match(/research\/destination-.*\.md/),
    );
    expect(docPath, "Step 1: destination doc created").toBeTruthy();

    const docContent = readFileSync(join(workDir, docPath!), "utf-8");
    const sectionCheck = hasRequiredSections(docContent, [
      "Intent",
      "Success Criteria",
    ]);
    expect(sectionCheck.pass, `Step 1: ${sectionCheck.description}`).toBe(true);

    // Step 2: vertical-slice-splitter
    const step2 = runClaude({
      prompt: `You have the alignment-loop skill pack installed. Run the vertical-slice-splitter skill on ${docPath}. Create the issues/ directory with a DAG.md file and numbered issue card files following the skill's format exactly.`,
      workDir,
      maxBudgetUsd: 0.5,
      timeoutMs: 120_000,
    });

    const dagFile = step2.files.find((f) => f.match(/issues\/DAG\.md/i));
    expect(dagFile, "Step 2: DAG.md created").toBeTruthy();

    const issueCards = step2.files.filter((f) =>
      f.match(/issues\/\d{3}-.*\.md/),
    );
    expect(
      issueCards.length,
      "Step 2: at least 2 issue cards",
    ).toBeGreaterThanOrEqual(2);

    // Save run outputs
    const runsDir = join(import.meta.dirname, "../runs");
    mkdirSync(runsDir, { recursive: true });
    writeFileSync(
      join(runsDir, `full-pipeline-doc-${Date.now()}.md`),
      docContent,
    );
    const dagContent = readFileSync(join(workDir, dagFile!), "utf-8");
    writeFileSync(
      join(runsDir, `full-pipeline-dag-${Date.now()}.md`),
      dagContent,
    );
  });
});
