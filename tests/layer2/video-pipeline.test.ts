import { describe, it, expect, afterAll } from "vitest";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { createTempProject, installPack, runClaude } from "../harness/runner.js";
import { setupDriftctlFixture } from "../harness/fixtures.js";
import { buildSkillPrompt } from "../harness/interview.js";
import { hasRequiredSections, hasSourceAttribution } from "../harness/judge.js";

const SLUG = "driftctl";
const RUNS_DIR = join(import.meta.dirname, "../runs");

describe("video pipeline (script → build)", () => {
  let workDir: string;

  afterAll(() => {
    if (workDir) {
      try {
        rmSync(workDir, { recursive: true, force: true });
      } catch {
        // best effort
      }
    }
  });

  it("chains video-script → video-build end-to-end", () => {
    workDir = createTempProject();
    installPack(workDir, "remotion");
    setupDriftctlFixture(workDir, { tier: 4 });

    // Step 1: video-script
    const step1 = runClaude({
      prompt: buildSkillPrompt({
        pack: "remotion",
        skill: "video-script",
        args: `${SLUG} --type launch --duration medium`,
        answers: [
          { question: "What is the primary goal of this video?", answer: "Drive installs — target 5,000 npm installs in first 2 weeks" },
          { question: "Who is the target audience?", answer: "Backend ICs — individual contributor backend and platform engineers" },
          { question: "What narrative approach or tone?", answer: "Build-in-public — honest, technical, showing real decisions" },
          { question: "What production style/constraints?", answer: "Solo webcam + screen recording" },
        ],
      }),
      workDir,
      maxBudgetUsd: 1.5,
      timeoutMs: 300_000,
    });

    const scriptFile = step1.files.find((f) => f.includes("video-script-"));
    expect(scriptFile, "Step 1: video script created").toBeTruthy();

    const scriptContent = readFileSync(join(workDir, scriptFile!), "utf-8");
    const scriptSections = hasRequiredSections(scriptContent, [
      "Video Brief",
      "Scene Breakdown",
    ]);
    expect(scriptSections.pass, `Step 1: ${scriptSections.description}`).toBe(true);

    const attribution = hasSourceAttribution(scriptContent);
    expect(attribution.pass, `Step 1: ${attribution.description}`).toBe(true);

    // Step 2: video-build
    const step2 = runClaude({
      prompt: buildSkillPrompt({
        pack: "remotion",
        skill: "video-build",
        args: `${SLUG} --style minimal --fps 30 --resolution 1080p`,
        answers: [
          { question: "Visual identity (colors, fonts, logo)?", answer: "Primary: #2563EB, Accent: #F59E0B, Font: JetBrains Mono for code / Inter for overlays" },
          { question: "Asset sourcing for screen recordings?", answer: "All screen recordings placeholder — mark as needs-creation" },
          { question: "Technical config (platform, fps, resolution, existing Remotion project)?", answer: "No existing Remotion project. Start fresh." },
        ],
      }),
      workDir,
      maxBudgetUsd: 1.5,
      timeoutMs: 300_000,
    });

    const buildFile = step2.files.find((f) => f.includes("video-build-"));
    expect(buildFile, "Step 2: build spec created").toBeTruthy();

    const buildContent = readFileSync(join(workDir, buildFile!), "utf-8");
    const buildSections = hasRequiredSections(buildContent, [
      "Build Brief",
      "Component Tree",
      "Asset Manifest",
    ]);
    expect(buildSections.pass, `Step 2: ${buildSections.description}`).toBe(true);

    // Save artifacts
    mkdirSync(RUNS_DIR, { recursive: true });
    writeFileSync(
      join(RUNS_DIR, `video-pipeline-script-${Date.now()}.md`),
      scriptContent,
    );
    writeFileSync(
      join(RUNS_DIR, `video-pipeline-build-${Date.now()}.md`),
      buildContent,
    );
  });
});
