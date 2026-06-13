import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");

const skillPaths = [
  "global/claude/idea-scope-brief/SKILL.md",
  "global/codex/idea-scope-brief/SKILL.md",
];

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

function gateBlock(content: string) {
  const start = content.indexOf("6. **Build pre-approval alignment preview**");
  const end = content.indexOf("\n## Output", start);
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return content.slice(start, end);
}

function outputGuard(content: string) {
  const start = content.indexOf("Before writing anything in this section");
  const end = content.indexOf("\nWrite:", start);
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return content.slice(start, end);
}

function sharedGateBlock(content: string) {
  return gateBlock(content).replace(" and Deck Fit Handoff", "");
}

describe("idea-scope-brief approval ordering", () => {
  it("requires the alignment preview before canonical writes", () => {
    for (const path of skillPaths) {
      const content = read(path);
      const checkpointIndex = content.indexOf("5. **Coverage checkpoint**");
      const previewIndex = content.indexOf("6. **Build pre-approval alignment preview**");
      const outputIndex = content.indexOf("## Output");
      const guardIndex = content.indexOf("Before writing anything in this section");
      const writeIndex = content.indexOf("Write:", guardIndex);

      expect(checkpointIndex, `${path} coverage checkpoint`).toBeGreaterThan(-1);
      expect(previewIndex, `${path} preview gate`).toBeGreaterThan(checkpointIndex);
      expect(outputIndex, `${path} output follows preview`).toBeGreaterThan(previewIndex);
      expect(guardIndex, `${path} output guard`).toBeGreaterThan(outputIndex);
      expect(writeIndex, `${path} canonical writes follow approval guard`).toBeGreaterThan(guardIndex);

      expect(content, `${path} preview path`).toContain("build `alignment/idea-scope-brief-{topic}.html`");
      expect(content, `${path} canonical write block`).toContain(
        "Before writing any canonical `research/**/idea-brief.md`",
      );
      expect(content, `${path} required alignment contents`).toContain(
        "Idea/Concept Assumptions Manifest, artifact destinations, proposed file changes, coverage checkpoint, and approval gates",
      );
    }
  });

  it("requires final compiled YAML approval and treats coverage confirmation as non-final", () => {
    for (const path of skillPaths) {
      const content = read(path);

      expect(content, `${path} checkpoint non-final`).toContain("Treat coverage-checkpoint confirmation as non-final");
      expect(content, `${path} compiled YAML authorizes writes`).toContain(
        "Only final compiled YAML from the alignment page authorizes canonical writes",
      );
      expect(content, `${path} output guard approval`).toContain(
        "Do not write canonical idea briefs, interview logs, or `research/.progress.yaml` until `alignment/idea-scope-brief-{topic}.html` has been reviewed and the user has provided final compiled YAML approval.",
      );
      expect(content, `${path} checkpoint not approval`).toContain(
        "Coverage-checkpoint confirmation is not final approval and does not authorize these writes.",
      );
    }
  });

  it("suppresses downstream routing until approved artifacts are written", () => {
    for (const path of skillPaths) {
      const content = read(path);

      expect(content, `${path} no downstream before approval`).toContain(
        "Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after final compiled YAML approval has been provided and the approved artifacts below have been written or updated.",
      );
    }
  });

  it("keeps the inserted approval gate mirrored across Claude and Codex contracts", () => {
    const [claude, codex] = skillPaths.map(read);

    expect(sharedGateBlock(claude)).toEqual(sharedGateBlock(codex));
    expect(outputGuard(claude)).toEqual(outputGuard(codex));
  });
});
