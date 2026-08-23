import { appendFileSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { runLaunchCanary, validateCheckpointPacket } from "../../scripts/afps-2-launch-canary.mjs";

const root = resolve(import.meta.dirname, "../..");
const fixtureDir = resolve(root, "tests/fixtures/afps-2.0-canary/youtube-launch-play");
const readJson = (name: string) => JSON.parse(readFileSync(resolve(fixtureDir, name), "utf8"));

function createMutationRoot() {
  const mutationRoot = mkdtempSync(resolve(tmpdir(), "afps-2-launch-canary-"));
  const fixture = readJson("fixture.json");
  const relativePaths = [
    "tests/fixtures/afps-2.0-canary/youtube-launch-play/fixture.json",
    "tests/fixtures/afps-2.0-canary/youtube-launch-play/checkpoint-good.json",
    "tests/fixtures/afps-2.0-canary/youtube-launch-play/checkpoint-bad.json",
    ...fixture.legacy.skills.flatMap((skill: { claude: string; codex: string }) => [skill.claude, skill.codex]),
    ...fixture.afps2.skills.flatMap((name: string) => [
      `packs/youtube-ops/claude/${name}/SKILL.md`,
      `packs/youtube-ops/codex/${name}/SKILL.md`
    ])
  ];
  for (const relativePath of relativePaths) {
    const destination = resolve(mutationRoot, relativePath);
    mkdirSync(resolve(destination, ".."), { recursive: true });
    copyFileSync(resolve(root, relativePath), destination);
  }
  return mutationRoot;
}

describe("AFPS 2.0 YouTube launch canary", () => {
  it("publishes one canonical convention through managed docs and provisioned agent pointers", () => {
    const convention = readFileSync(resolve(root, "docs/afps-2.0-convention.md"), "utf8");
    const registry = readFileSync(resolve(root, "scripts/skill-convention-registry.mjs"), "utf8");
    const packageBuild = readFileSync(resolve(root, "packages/skillpacks/scripts/build-package.mjs"), "utf8");
    const agents = readFileSync(resolve(root, "AGENTS.md"), "utf8");
    const claude = readFileSync(resolve(root, "CLAUDE.md"), "utf8");

    for (const phrase of [
      "Infer and proceed",
      "State an assumption and proceed",
      "Decision checkpoint",
      "Permission stop",
      "artifact_or_behavior",
      "assertion_or_evaluation",
      "next_safe_move"
    ]) expect(convention).toContain(phrase);
    expect(convention).toContain("A checkpoint never grants permission");
    expect(registry).toContain('"afps-2.0"');
    expect(registry).toContain('assets/skillpacks-docs/afps-2.0-convention.md');
    expect(packageBuild).toContain("afps-2.0-convention.md");
    for (const contract of [agents, claude]) {
      expect(contract).toContain("<!-- provision-agentic-config v0.18 -->");
      expect(contract).toContain(".agents/skillpacks/docs/afps-2.0-convention.md");
      expect(contract).toContain("at most three decisions");
    }
  });

  it("distinguishes the archived seven-stop launch play from the migrated contract", () => {
    const result = runLaunchCanary({ root });

    expect(result.failures).toEqual([]);
    expect(result.legacy).toEqual({ routine_stops: 7, review_only_pages: 7 });
    expect(result.afps2).toMatchObject({
      routine_stops: 0,
      maximum_material_checkpoints: 1,
      review_only_pages: 0,
      checkpoint_owner: "youtube-video-prelaunch-audit",
      checkpoint_ids: ["launch-packaging-selection"]
    });
  });

  it("accepts the compact decision packet and rejects approval semantics or a fourth decision", () => {
    const goodPacket = readJson("checkpoint-good.json");
    const nextSafeMoves = readJson("checkpoint-next-safe-moves.json");
    expect(validateCheckpointPacket(goodPacket)).toEqual([]);
    for (const nextSafeMove of nextSafeMoves.allowed) {
      expect(validateCheckpointPacket({
        ...goodPacket,
        resume_context: { ...goodPacket.resume_context, next_safe_move: nextSafeMove }
      }), nextSafeMove).toEqual([]);
    }
    for (const nextSafeMove of nextSafeMoves.blocked) {
      expect(validateCheckpointPacket({
        ...goodPacket,
        resume_context: { ...goodPacket.resume_context, next_safe_move: nextSafeMove }
      }), nextSafeMove).toEqual([
        "resume_context.next_safe_move must remain reversible and cannot perform a permission-bound external action"
      ]);
    }
    expect(validateCheckpointPacket(readJson("checkpoint-bad.json"))).toEqual(expect.arrayContaining([
      "checkpoint packet has missing or unsupported top-level keys",
      "decisions must contain at most three entries",
      "checkpoint packet contains approval or authorization semantics",
      "resume_context.next_safe_move must remain reversible and cannot perform a permission-bound external action"
    ]));
    expect(validateCheckpointPacket(readJson("checkpoint-external-action.json"))).toEqual([
      "resume_context.next_safe_move must remain reversible and cannot perform a permission-bound external action"
    ]);
  });

  it("measures alternate checkpoints and restored review-page producers from mutated source", () => {
    const mutations = readJson("source-mutations.json");
    const mutationRoot = createMutationRoot();
    try {
      for (const agent of ["claude", "codex"]) {
        appendFileSync(
          resolve(mutationRoot, `packs/youtube-ops/${agent}/youtube-video-prelaunch-audit/SKILL.md`),
          `\n${mutations.alternate_checkpoint}\n`
        );
      }
      const checkpointResult = runLaunchCanary({ root: mutationRoot });
      expect(checkpointResult.afps2.maximum_material_checkpoints).toBe(2);
      expect(checkpointResult.failures).toContain(
        "measured 2 material checkpoints (alternate-launch-selection, launch-packaging-selection); expected at most 1"
      );

      const producer = mutations.restored_review_page;
      for (const agent of ["claude", "codex"]) {
        const bundlePath = resolve(mutationRoot, `packs/youtube-ops/${agent}/${producer.skill}/${producer.bundle}`);
        writeFileSync(bundlePath, producer.content);
      }
      const producerResult = runLaunchCanary({ root: mutationRoot });
      expect(producerResult.afps2.review_only_pages).toBe(1);
      expect(producerResult.failures).toContain(
        "measured 1 review-page producers (youtube-description-optimizer:alignment); expected 0"
      );
    } finally {
      rmSync(mutationRoot, { recursive: true, force: true });
    }
  });
});
