import { describe, expect, it } from "vitest";
import { CODEX_EXEC_STDIO, codexExecArgs } from "../harness/runner.js";

describe("benchmark runner", () => {
  it("invokes codex exec with stdin closed", () => {
    expect(CODEX_EXEC_STDIO).toEqual(["ignore", "pipe", "pipe"]);
  });

  it("passes the benchmark prompt as the codex exec prompt argument", () => {
    const args = codexExecArgs("/tmp/skill-test", "Write DESIGN.md");

    expect(args).toEqual([
      "exec",
      "--cd",
      "/tmp/skill-test",
      "--sandbox",
      "workspace-write",
      "--ephemeral",
      "Write DESIGN.md",
    ]);
  });
});
