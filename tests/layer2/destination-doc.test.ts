import { describe, it, expect, afterAll } from "vitest";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { createTempProject, installPack, runClaude } from "../harness/runner.js";
import { inputFixture } from "../harness/fixtures.js";
import { hasRequiredSections } from "../harness/judge.js";

let workDir: string;

describe("destination-doc skill", () => {
  afterAll(() => {
    if (workDir) {
      try {
        rmSync(workDir, { recursive: true, force: true });
      } catch {
        // best effort
      }
    }
  });

  it("produces a destination doc with required sections", async () => {
    workDir = createTempProject();
    installPack(workDir, "alignment-loop");

    const appIdea = inputFixture("app-idea-fitness-tracker.md");
    mkdirSync(join(workDir, "research"), { recursive: true });
    writeFileSync(join(workDir, "context.md"), appIdea);

    const result = await runClaude({
      prompt: `You have the alignment-loop skill pack installed. Read context.md for the project context. Run the destination-doc skill to create a destination document for the fitness-tracker project. Write the output to research/destination-fitness-tracker.md following the skill's document structure exactly.`,
      workDir,
      maxBudgetUsd: 0.5,
      timeoutMs: 120_000,
    });

    const docPath = result.files.find((f) =>
      f.match(/research\/destination-.*\.md/),
    );
    expect(docPath, "Should create a destination doc in research/").toBeTruthy();

    const fullPath = join(workDir, docPath!);
    const content = readFileSync(fullPath, "utf-8");

    const sectionCheck = hasRequiredSections(content, [
      "Intent",
      "Success Criteria",
      "Taste Notes",
      "Out of Scope",
      "Open Questions",
    ]);
    expect(sectionCheck.pass, sectionCheck.description).toBe(true);

    const runsDir = join(import.meta.dirname, "../runs");
    mkdirSync(runsDir, { recursive: true });
    writeFileSync(
      join(runsDir, `destination-doc-${Date.now()}.md`),
      content,
    );
  });
});
