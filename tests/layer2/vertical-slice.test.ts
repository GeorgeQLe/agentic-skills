import { describe, it, expect, afterAll } from "vitest";
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { createTempProject, installPack, runClaude } from "../harness/runner.js";
import { inputFixturePath } from "../harness/fixtures.js";
import { validDAG } from "../harness/judge.js";

let workDir: string;

describe("vertical-slice-splitter skill", () => {
  afterAll(() => {
    if (workDir) {
      try {
        rmSync(workDir, { recursive: true, force: true });
      } catch {
        // best effort
      }
    }
  });

  it("produces DAG and issue cards from a destination doc", async () => {
    workDir = createTempProject();
    installPack(workDir, "alignment-loop");

    mkdirSync(join(workDir, "research"), { recursive: true });
    copyFileSync(
      inputFixturePath("destination-doc-sample.md"),
      join(workDir, "research/destination-sample.md"),
    );

    const result = await runClaude({
      prompt: `You have the alignment-loop skill pack installed. Run the vertical-slice-splitter skill on research/destination-sample.md. Create the issues/ directory with a DAG.md file and numbered issue card files (000-xxx.md, 001-xxx.md, etc.) following the skill's format exactly.`,
      workDir,
      maxBudgetUsd: 0.5,
      timeoutMs: 120_000,
    });

    const dagFile = result.files.find((f) => f.match(/issues\/DAG\.md/i));
    expect(dagFile, "Should create issues/DAG.md").toBeTruthy();

    const issueCards = result.files.filter((f) =>
      f.match(/issues\/\d{3}-.*\.md/),
    );
    expect(
      issueCards.length,
      "Should create at least 2 issue cards",
    ).toBeGreaterThanOrEqual(2);

    const dagContent = readFileSync(join(workDir, dagFile!), "utf-8");
    const dagCheck = validDAG(dagContent);
    expect(dagCheck.pass, dagCheck.description).toBe(true);

    const runsDir = join(import.meta.dirname, "../runs");
    mkdirSync(runsDir, { recursive: true });
    writeFileSync(
      join(runsDir, `vertical-slice-dag-${Date.now()}.md`),
      dagContent,
    );
    for (const card of issueCards) {
      const cardContent = readFileSync(join(workDir, card), "utf-8");
      writeFileSync(
        join(runsDir, `vertical-slice-${card.replace(/\//g, "-")}-${Date.now()}.md`),
        cardContent,
      );
    }
  });
});
