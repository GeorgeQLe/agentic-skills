import { describe, it, expect, afterAll } from "vitest";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { createTempProject, runClaude } from "../harness/runner.js";
import { inputFixture } from "../harness/fixtures.js";

let workDir: string;

describe("design-system skill", () => {
  afterAll(() => {
    if (workDir) {
      try {
        rmSync(workDir, { recursive: true, force: true });
      } catch {
        // best effort
      }
    }
  });

  it("extracts tokens from ui-final spec into DESIGN.md", async () => {
    workDir = createTempProject();

    const specContent = inputFixture("ui-final-dashboard.md");
    mkdirSync(join(workDir, "specs"), { recursive: true });
    writeFileSync(join(workDir, "specs/ui-final-dashboard.md"), specContent);

    const result = await runClaude({
      prompt: `You have the design-system skill installed. Read specs/ui-final-dashboard.md and extract all design tokens into a DESIGN.md file in the project root. Follow the Google Labs Stitch format: YAML frontmatter with machine-readable tokens (colors, typography, spacing, rounded, elevation, components) plus prose sections (Overview, Colors, Typography, Layout & Spacing, Elevation & Depth, Shapes, Components, Do's and Don'ts). Use {token.path} cross-references in component definitions. Do NOT ask questions — use the spec values directly. Write DESIGN.md and design-system-interview.md.`,
      workDir,
      maxBudgetUsd: 1.0,
      timeoutMs: 180_000,
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

    // Specific token values from the spec
    expect(frontmatter, "Has primary color").toContain("#2563EB");
    expect(frontmatter, "Has surface color").toContain("#FAFAFA");

    // Additional frontmatter categories
    expect(frontmatter, "Has rounded section").toContain("rounded:");
    expect(frontmatter, "Has elevation section").toContain("elevation:");
    expect(frontmatter, "Has components section").toContain("components:");

    // Token cross-references in components
    expect(content, "Uses token cross-references").toMatch(
      /\{colors\.\w+\}/,
    );
    expect(content, "Uses spacing or rounded cross-references").toMatch(
      /\{(spacing|rounded)\.\w+\}/,
    );

    // Prose sections
    const proseContent = content.slice(frontmatterEnd + 3);
    const heading = (title: string) =>
      new RegExp(`##?\\s+(?:\\d+\\.\\s*)?${title}`, "i");

    expect(proseContent, "Has Colors section").toMatch(heading("Colors"));
    expect(proseContent, "Has Typography section").toMatch(
      heading("Typography"),
    );
    expect(proseContent, "Has Layout or Spacing section").toMatch(
      heading("(Layout|Spacing)"),
    );
    expect(proseContent, "Has Elevation or Depth section").toMatch(
      heading("(Elevation|Depth)"),
    );
    expect(proseContent, "Has Components section").toMatch(
      heading("Components"),
    );
    expect(proseContent, "Has Do's and Don'ts section").toMatch(
      heading("Do['']?s?\\s+(and|&)\\s+Don['']?ts?"),
    );

    // Interview log created
    const interviewLog = result.files.find((f) =>
      f.includes("design-system-interview"),
    );
    expect(interviewLog, "Interview log created").toBeTruthy();
  });
});
