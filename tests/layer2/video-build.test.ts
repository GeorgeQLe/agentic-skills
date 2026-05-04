import { describe, it, expect, afterAll } from "vitest";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { createTempProject, installPack, runClaude } from "../harness/runner.js";
import { setupDriftctlFixture, driftctlScriptFixture } from "../harness/fixtures.js";
import { buildSkillPrompt } from "../harness/interview.js";
import { hasRequiredSections } from "../harness/judge.js";

const SLUG = "driftctl";
const RUNS_DIR = join(import.meta.dirname, "../runs");

const buildAnswers = [
  { question: "Visual identity (colors, fonts, logo)?", answer: "Primary: #2563EB, Accent: #F59E0B, Font: JetBrains Mono for code / Inter for overlays, no logo overlay" },
  { question: "Asset sourcing for screen recordings?", answer: "All screen recordings will be placeholder — mark as needs-creation" },
  { question: "Technical config (platform, fps, resolution, existing Remotion project)?", answer: "No existing Remotion project. Start fresh scaffold." },
];

function saveRunArtifact(name: string, content: string): void {
  mkdirSync(RUNS_DIR, { recursive: true });
  writeFileSync(join(RUNS_DIR, `video-build-${name}-${Date.now()}.md`), content);
}

describe("video-build skill", () => {
  const workDirs: string[] = [];

  afterAll(() => {
    for (const dir of workDirs) {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {
        // best effort
      }
    }
  });

  it("minimal-1080p", () => {
    const workDir = createTempProject();
    workDirs.push(workDir);
    installPack(workDir, "remotion");
    setupDriftctlFixture(workDir, { tier: 4 });
    driftctlScriptFixture(workDir);

    const result = runClaude({
      prompt: buildSkillPrompt({
        pack: "remotion",
        skill: "video-build",
        args: `${SLUG} --style minimal --fps 30 --resolution 1080p`,
        answers: buildAnswers,
      }),
      workDir,
      maxBudgetUsd: 1.5,
      timeoutMs: 300_000,
    });

    const buildFile = result.files.find((f) => f.includes("video-build-"));
    expect(buildFile, "Build spec file created").toBeTruthy();

    const content = readFileSync(join(workDir, buildFile!), "utf-8");
    saveRunArtifact("minimal-1080p", content);

    const sections = hasRequiredSections(content, [
      "Build Brief",
      "Component Tree",
      "Asset Manifest",
    ]);
    expect(sections.pass, sections.description).toBe(true);

    const hasScaffold = result.files.some(
      (f) => f.startsWith("src/videos/") && f.endsWith(".tsx"),
    );
    expect(hasScaffold, "Scaffold directory with .tsx files created").toBe(true);
  });

  it("kinetic-text-1080p", () => {
    const workDir = createTempProject();
    workDirs.push(workDir);
    installPack(workDir, "remotion");
    setupDriftctlFixture(workDir, { tier: 4 });
    driftctlScriptFixture(workDir);

    const result = runClaude({
      prompt: buildSkillPrompt({
        pack: "remotion",
        skill: "video-build",
        args: `${SLUG} --style kinetic-text --fps 30 --resolution 1080p`,
        answers: buildAnswers,
      }),
      workDir,
      maxBudgetUsd: 1.5,
      timeoutMs: 300_000,
    });

    const buildFile = result.files.find((f) => f.includes("video-build-"));
    expect(buildFile, "Build spec file created").toBeTruthy();

    const content = readFileSync(join(workDir, buildFile!), "utf-8");
    saveRunArtifact("kinetic-text-1080p", content);

    const sections = hasRequiredSections(content, [
      "Build Brief",
      "Component Tree",
      "Asset Manifest",
    ]);
    expect(sections.pass, sections.description).toBe(true);

    expect(content.toLowerCase()).toMatch(/kinetic/);
  });
});
