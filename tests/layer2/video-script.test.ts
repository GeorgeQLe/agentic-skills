import { describe, it, expect, afterAll } from "vitest";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { createTempProject, installPack, runClaude } from "../harness/runner.js";
import { setupDriftctlFixture } from "../harness/fixtures.js";
import { buildSkillPrompt, type InterviewAnswer } from "../harness/interview.js";
import {
  hasRequiredSections,
  hasSourceAttribution,
  hasUngroundedSection,
  matchesNarrativeArc,
} from "../harness/judge.js";

const SLUG = "driftctl";
const SCRIPT_PATH = `specs/youtube/video-script-${SLUG}.md`;
const RUNS_DIR = join(import.meta.dirname, "../runs");

const baseAnswers = {
  launch: [
    { question: "What is the primary goal of this video?", answer: "Drive installs — target 5,000 npm installs in first 2 weeks" },
    { question: "Who is the target audience?", answer: "Backend ICs — individual contributor backend and platform engineers" },
    { question: "What narrative approach or tone?", answer: "Build-in-public — honest, technical, showing real decisions" },
    { question: "What production style/constraints?", answer: "Solo webcam + screen recording, no crew, home office setup" },
  ] as InterviewAnswer[],
  explainer: [
    { question: "What is the primary goal of this video?", answer: "Build awareness — explain what schema drift is and why it matters" },
    { question: "Who is the target audience?", answer: "Broader dev audience — not just backend, anyone who touches databases" },
    { question: "What narrative approach or tone?", answer: "Educational — clear, structured, concept-first" },
    { question: "What production style/constraints?", answer: "Screen-only recording, no webcam, voice-over narration" },
  ] as InterviewAnswer[],
  demo: [
    { question: "What is the primary goal of this video?", answer: "Drive installs — show the tool in action so people try it" },
    { question: "Who is the target audience?", answer: "Backend ICs who are evaluating migration tools" },
    { question: "What narrative approach or tone?", answer: "Straight demo — minimal talking, show don't tell" },
    { question: "What production style/constraints?", answer: "Solo webcam + screen recording" },
  ] as InterviewAnswer[],
};

function saveRunArtifact(name: string, content: string): void {
  mkdirSync(RUNS_DIR, { recursive: true });
  writeFileSync(join(RUNS_DIR, `video-script-${name}-${Date.now()}.md`), content);
}

describe("video-script skill", () => {
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

  it("launch-tier4", () => {
    const workDir = createTempProject();
    workDirs.push(workDir);
    installPack(workDir, "creator-media");
    setupDriftctlFixture(workDir, { tier: 4 });

    const result = runClaude({
      prompt: buildSkillPrompt({
        pack: "creator-media",
        skill: "video-script",
        args: `${SLUG} --type launch --duration medium`,
        answers: baseAnswers.launch,
      }),
      workDir,
      maxBudgetUsd: 1.5,
      timeoutMs: 300_000,
    });

    const scriptFile = result.files.find((f) => f.includes("video-script-"));
    expect(scriptFile, "Script file created").toBeTruthy();

    const content = readFileSync(join(workDir, scriptFile!), "utf-8");
    saveRunArtifact("launch-tier4", content);

    const sections = hasRequiredSections(content, [
      "Video Brief",
      "Narrative Arc",
      "Scene Breakdown",
      "CTA Strategy",
      "Asset Requirements",
      "Source Attribution",
      "Ungrounded Claims",
    ]);
    expect(sections.pass, sections.description).toBe(true);

    const attribution = hasSourceAttribution(content);
    expect(attribution.pass, attribution.description).toBe(true);

    const ungrounded = hasUngroundedSection(content);
    expect(ungrounded.pass, ungrounded.description).toBe(true);

    const arc = matchesNarrativeArc(content, "launch");
    expect(arc.pass, `${arc.description}${arc.detail ? ` — ${arc.detail}` : ""}`).toBe(true);
  });

  it("explainer-tier2", () => {
    const workDir = createTempProject();
    workDirs.push(workDir);
    installPack(workDir, "creator-media");
    setupDriftctlFixture(workDir, { tier: 2 });

    const result = runClaude({
      prompt: buildSkillPrompt({
        pack: "creator-media",
        skill: "video-script",
        args: `${SLUG} --type explainer --duration medium`,
        answers: baseAnswers.explainer,
      }),
      workDir,
      maxBudgetUsd: 1.5,
      timeoutMs: 300_000,
    });

    const scriptFile = result.files.find((f) => f.includes("video-script-"));
    expect(scriptFile, "Script file created").toBeTruthy();

    const content = readFileSync(join(workDir, scriptFile!), "utf-8");
    saveRunArtifact("explainer-tier2", content);

    const arc = matchesNarrativeArc(content, "explainer");
    expect(arc.pass, `${arc.description}${arc.detail ? ` — ${arc.detail}` : ""}`).toBe(true);

    expect(content).not.toMatch(/journey-map/i);
  });

  it("demo-tier1", () => {
    const workDir = createTempProject();
    workDirs.push(workDir);
    installPack(workDir, "creator-media");
    setupDriftctlFixture(workDir, { tier: 1 });

    const result = runClaude({
      prompt: buildSkillPrompt({
        pack: "creator-media",
        skill: "video-script",
        args: `${SLUG} --type demo --duration short`,
        answers: baseAnswers.demo,
      }),
      workDir,
      maxBudgetUsd: 1.5,
      timeoutMs: 300_000,
    });

    const scriptFile = result.files.find((f) => f.includes("video-script-"));
    expect(scriptFile, "Script file created").toBeTruthy();

    const content = readFileSync(join(workDir, scriptFile!), "utf-8");
    saveRunArtifact("demo-tier1", content);

    const arc = matchesNarrativeArc(content, "demo");
    expect(arc.pass, `${arc.description}${arc.detail ? ` — ${arc.detail}` : ""}`).toBe(true);

    const brief = hasRequiredSections(content, ["Video Brief"]);
    expect(brief.pass, brief.description).toBe(true);

    expect(content.toLowerCase()).toMatch(/tier.{0,5}1/);
  });

  it("launch-tier3-series", () => {
    const workDir = createTempProject();
    workDirs.push(workDir);
    installPack(workDir, "creator-media");
    setupDriftctlFixture(workDir, { tier: 3 });

    const result = runClaude({
      prompt: buildSkillPrompt({
        pack: "creator-media",
        skill: "video-script",
        args: `${SLUG} --type launch --duration medium --series driftctl-deep-dives`,
        answers: baseAnswers.launch,
      }),
      workDir,
      maxBudgetUsd: 1.5,
      timeoutMs: 300_000,
    });

    const scriptFile = result.files.find((f) => f.includes("video-script-"));
    expect(scriptFile, "Script file created").toBeTruthy();

    const content = readFileSync(join(workDir, scriptFile!), "utf-8");
    saveRunArtifact("launch-tier3-series", content);

    const sections = hasRequiredSections(content, ["Video Brief", "Scene Breakdown"]);
    expect(sections.pass, sections.description).toBe(true);

    const lowerContent = content.toLowerCase();
    expect(
      lowerContent.includes("series") || lowerContent.includes("deep dive"),
      "Series context referenced in brief or body",
    ).toBe(true);
  });
});
