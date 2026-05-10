import { describe, it, expect, afterAll } from "vitest";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { createTempProject, runClaude } from "../harness/runner.js";
import { inputFixture } from "../harness/fixtures.js";

let workDir: string;

describe("design-system skill (complex spec)", () => {
  afterAll(() => {
    if (workDir) {
      try {
        rmSync(workDir, { recursive: true, force: true });
      } catch {
        // best effort
      }
    }
  });

  it("extracts tokens from draft-stonk V1 spec into DESIGN.md", async () => {
    workDir = createTempProject();

    const specContent = inputFixture("ui-draft-stonk-v1.md");
    mkdirSync(join(workDir, "specs"), { recursive: true });
    writeFileSync(join(workDir, "specs/ui-v1-draft-night.md"), specContent);

    const result = await runClaude({
      prompt: `You have the design-system skill installed. Read specs/ui-v1-draft-night.md and extract all design tokens into a DESIGN.md file in the project root. Follow the Google Labs Stitch format: YAML frontmatter with machine-readable tokens (colors, typography, spacing, rounded, elevation, components, animations) plus prose sections (Overview, Colors, Typography, Layout & Spacing, Elevation & Depth, Shapes, Animation & Motion, Components, Do's and Don'ts). Use {token.path} cross-references in component definitions. Do NOT ask questions — use the spec values directly. Write DESIGN.md and design-system-interview.md.`,
      workDir,
      maxBudgetUsd: 1.5,
      timeoutMs: 240_000,
    });

    // Assert DESIGN.md was created
    const designMd = result.files.find((f) => f === "DESIGN.md");
    expect(designMd, "DESIGN.md created in project root").toBeTruthy();

    // Read and validate structure
    const content = readFileSync(join(workDir, "DESIGN.md"), "utf-8");

    // Has YAML frontmatter
    expect(content.startsWith("---"), "Starts with YAML frontmatter").toBe(
      true,
    );
    const frontmatterEnd = content.indexOf("---", 4);
    expect(
      frontmatterEnd > 0,
      "Has closing frontmatter delimiter",
    ).toBeTruthy();

    const frontmatter = content.slice(4, frontmatterEnd);

    // Required token categories in frontmatter
    expect(frontmatter, "Has colors section").toContain("colors:");
    expect(frontmatter, "Has typography section").toContain("typography:");
    expect(frontmatter, "Has spacing section").toContain("spacing:");
    expect(frontmatter, "Has rounded section").toContain("rounded:");
    expect(frontmatter, "Has components section").toContain("components:");

    // V1-specific token values
    expect(frontmatter, "Has primary emerald #10b981").toContain("#10b981");
    expect(frontmatter, "Has bg-base slate-900 #0f172a").toContain("#0f172a");
    expect(frontmatter, "Has bg-card #1e293b").toContain("#1e293b");
    expect(frontmatter, "Has accent amber #fbbf24").toContain("#fbbf24");
    expect(frontmatter, "Has loss red #f87171").toContain("#f87171");

    // Emerald or slate references (Tailwind-aware extraction)
    expect(content, "References emerald color family").toMatch(/emerald/i);
    expect(content, "References slate color family").toMatch(/slate/i);

    // Animation/transition tokens (V1 defines them in section 1.4)
    expect(content, "Has animation or transition tokens").toMatch(
      /animat|transition|motion/i,
    );

    // Token cross-references
    expect(content, "Uses token cross-references").toMatch(
      /\{colors\.\w+\}/,
    );

    // Prose sections
    const proseContent = content.slice(frontmatterEnd + 3);
    expect(proseContent, "Has Colors section").toMatch(/##?\s+Colors/i);
    expect(proseContent, "Has Typography section").toMatch(
      /##?\s+Typography/i,
    );
    expect(proseContent, "Has Components section").toMatch(
      /##?\s+Components/i,
    );

    // Interview log created
    const interviewLog = result.files.find((f) =>
      f.includes("design-system-interview"),
    );
    expect(interviewLog, "Interview log created").toBeTruthy();
  });
});
