import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = resolve(import.meta.dirname, "../..");

const mirroredSkills = [
  {
    pack: "knowledge-check",
    skill: "quiz-me",
  },
  {
    pack: "guided-walkthrough",
    skill: "uat-guide",
  },
  {
    pack: "alignment-loop",
    skill: "taste-calibration",
  },
] as const;

function read(relativePath: string): string {
  return readFileSync(resolve(REPO_ROOT, relativePath), "utf8");
}

function skillPath(pack: string, agent: "claude" | "codex", skill: string): string {
  return `packs/${pack}/${agent}/${skill}/SKILL.md`;
}

describe("pack skill mirror parity", () => {
  it("has active Claude and Codex SKILL.md files for quiz-me, uat-guide, and taste-calibration", () => {
    for (const mirror of mirroredSkills) {
      const versions: string[] = [];

      for (const agent of ["claude", "codex"] as const) {
        const relativePath = skillPath(mirror.pack, agent, mirror.skill);
        const absolutePath = resolve(REPO_ROOT, relativePath);

        expect(existsSync(absolutePath), relativePath).toBe(true);
        expect(relativePath, `${relativePath} should be active`).not.toContain("/archive/");

        const content = read(relativePath);
        expect(content, `${relativePath} name`).toMatch(new RegExp(`^name: ${mirror.skill}$`, "m"));

        const version = content.match(/^version: (v\d+\.\d+)$/m)?.[1];
        expect(version, `${relativePath} version`).toBeTruthy();
        versions.push(version!);
      }

      expect(versions[0], `${mirror.skill} mirrors should share one version`).toBe(versions[1]);

      const codexOpenAiMetadata = resolve(
        REPO_ROOT,
        `packs/${mirror.pack}/codex/${mirror.skill}/agents/openai.yaml`,
      );
      expect(existsSync(codexOpenAiMetadata), `${mirror.skill} Codex OpenAI metadata`).toBe(true);
    }
  });

  it("does not describe newly mirrored skills as Claude-only in current docs", () => {
    const docs = [
      "docs/skills-reference.md",
      "docs/packs.md",
      "packs/alignment-loop/PACK.md",
      "packs/guided-walkthrough/PACK.md",
      "packs/knowledge-check/PACK.md",
    ];

    for (const relativePath of docs) {
      const content = read(relativePath);
      for (const { skill } of mirroredSkills) {
        expect(content, `${relativePath} should not mark ${skill} as Claude-only`).not.toMatch(
          new RegExp(`(${skill}[\\s\\S]{0,120}Claude-only|Claude-only[\\s\\S]{0,120}${skill})`, "i"),
        );
      }
    }
  });

  it("uses Codex command routing in the new Codex mirrors", () => {
    const quizMe = read(skillPath("knowledge-check", "codex", "quiz-me"));
    const uatGuide = read(skillPath("guided-walkthrough", "codex", "uat-guide"));
    const tasteCalibration = read(skillPath("alignment-loop", "codex", "taste-calibration"));

    expect(quizMe).toContain("Codex-compatible user-input handling");
    expect(quizMe).not.toContain("AskUserQuestion");

    for (const command of ["$uat-guide", "$uat", "$debug", "$guide", "$ux-variations", "$pack install"]) {
      expect(uatGuide).toContain(command);
    }
    expect(uatGuide).not.toMatch(
      /(?:^|[\s`"'])\/(?:uat-guide|uat|debug|guide|ux-variations|pack install)\b/,
    );

    expect(tasteCalibration).toContain("permitted non-mutating exploration tools");
    expect(tasteCalibration).toContain("$destination-doc");
    expect(tasteCalibration).not.toMatch(/(?:^|[\s`"'])\/destination-doc\b/);
  });
});
