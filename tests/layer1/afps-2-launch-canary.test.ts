import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { runLaunchCanary, validateCheckpointPacket } from "../../scripts/afps-2-launch-canary.mjs";

const root = resolve(import.meta.dirname, "../..");
const fixtureDir = resolve(root, "tests/fixtures/afps-2.0-canary/youtube-launch-play");
const readJson = (name: string) => JSON.parse(readFileSync(resolve(fixtureDir, name), "utf8"));

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
      expect(contract).toContain("<!-- provision-agentic-config v0.17 -->");
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
      checkpoint_owner: "youtube-video-prelaunch-audit"
    });
  });

  it("accepts the compact decision packet and rejects approval semantics or a fourth decision", () => {
    expect(validateCheckpointPacket(readJson("checkpoint-good.json"))).toEqual([]);
    expect(validateCheckpointPacket(readJson("checkpoint-bad.json"))).toEqual(expect.arrayContaining([
      "checkpoint packet has missing or unsupported top-level keys",
      "decisions must contain at most three entries",
      "checkpoint packet contains approval or authorization semantics"
    ]));
  });
});
