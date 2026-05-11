import { describe, expect, it } from "vitest";
import { mkdirSync, rmSync } from "node:fs";
import type { BenchConfig, SessionManifest } from "../harness/bench-types.js";
import { canResumeSession, runChunk } from "../harness/bench-runner.js";
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

  it("does not resume a zero-run session for a one-run benchmark", () => {
    const oneRunConfig: BenchConfig = {
      skill: "run",
      agent: "codex",
      runs: 1,
      chunkSize: 1,
      pauseSeconds: 0,
      maxBudgetUsd: 0.2,
      perRunBudgetUsd: 0.2,
      timeoutMs: 120_000,
    };
    const zeroRunManifest: SessionManifest = {
      skill: "run",
      sessionId: "zero0000",
      createdAt: "2026-05-11T00:00:00.000Z",
      updatedAt: "2026-05-11T00:00:00.000Z",
      status: "paused",
      config: { ...oneRunConfig, runs: 0, maxBudgetUsd: 0 },
      completedRuns: 0,
      totalEstimatedCostUsd: 0,
      chunks: [],
    };

    expect(canResumeSession(zeroRunManifest, oneRunConfig)).toBe(false);
  });

  it("resumes only when the benchmark configuration matches exactly", () => {
    const config: BenchConfig = {
      skill: "run",
      agent: "codex",
      runs: 2,
      chunkSize: 1,
      pauseSeconds: 0,
      maxBudgetUsd: 0.4,
      perRunBudgetUsd: 0.2,
      timeoutMs: 120_000,
    };
    const manifest: SessionManifest = {
      skill: "run",
      sessionId: "resume01",
      createdAt: "2026-05-11T00:00:00.000Z",
      updatedAt: "2026-05-11T00:00:00.000Z",
      status: "paused",
      config,
      completedRuns: 1,
      totalEstimatedCostUsd: 0.2,
      chunks: [],
    };

    expect(canResumeSession(manifest, config)).toBe(true);
    expect(canResumeSession(manifest, { ...config, chunkSize: 2 })).toBe(false);
    expect(canResumeSession(manifest, { ...config, timeoutMs: 180_000 })).toBe(false);
  });

  it("does not classify successful runs as infrastructure-blocked when output mentions rate limits", async () => {
    const workDir = "/tmp/skill-test-rate-limit-docs";
    const sessionDir = "benchmarks/runs/rate-limit-docs-codex-ratelimit";
    rmSync(sessionDir, { recursive: true, force: true });
    mkdirSync(sessionDir, { recursive: true });

    try {
      const result = await runChunk(
        {
          skill: "rate-limit-docs",
          prompt: "unused",
          perRunBudgetUsd: 0.01,
          timeoutMs: 1_000,
          setupProject() {},
          assertResult() {
            return [{ description: "successful assertion", pass: true }];
          },
        },
        {
          skill: "rate-limit-docs",
          sessionId: "ratelimit",
          createdAt: "2026-05-11T00:00:00.000Z",
          updatedAt: "2026-05-11T00:00:00.000Z",
          status: "running",
          config: {
            skill: "rate-limit-docs",
            agent: "codex",
            runs: 1,
            chunkSize: 1,
            pauseSeconds: 0,
            maxBudgetUsd: 0.01,
            perRunBudgetUsd: 0.01,
            timeoutMs: 1_000,
          },
          completedRuns: 0,
          totalEstimatedCostUsd: 0,
          chunks: [],
        },
        0,
        1,
        async () => ({
          stdout: "Created report.md",
          stderr: "Documentation mentions rate limits as a possible future blocker.",
          exitCode: 0,
          workDir,
          files: ["report.md"],
        }),
        () => workDir,
      );

      expect(result.runs[0]?.infrastructureBlocked).toBe(false);
      expect(result.runs[0]?.passed).toBe(true);
    } finally {
      rmSync(sessionDir, { recursive: true, force: true });
    }
  });

  it("classifies non-zero agent rate limits as infrastructure-blocked", async () => {
    const workDir = "/tmp/skill-test-rate-limit-block";
    const sessionDir = "benchmarks/runs/rate-limit-block-codex-ratelimit";
    rmSync(sessionDir, { recursive: true, force: true });
    mkdirSync(sessionDir, { recursive: true });

    try {
      const result = await runChunk(
        {
          skill: "rate-limit-block",
          prompt: "unused",
          perRunBudgetUsd: 0.01,
          timeoutMs: 1_000,
          setupProject() {},
          assertResult() {
            return [{ description: "should be skipped for infrastructure blocks", pass: false }];
          },
        },
        {
          skill: "rate-limit-block",
          sessionId: "ratelimit",
          createdAt: "2026-05-11T00:00:00.000Z",
          updatedAt: "2026-05-11T00:00:00.000Z",
          status: "running",
          config: {
            skill: "rate-limit-block",
            agent: "codex",
            runs: 1,
            chunkSize: 1,
            pauseSeconds: 0,
            maxBudgetUsd: 0.01,
            perRunBudgetUsd: 0.01,
            timeoutMs: 1_000,
          },
          completedRuns: 0,
          totalEstimatedCostUsd: 0,
          chunks: [],
        },
        0,
        1,
        async () => ({
          stdout: "",
          stderr: "429 rate limit exceeded",
          exitCode: 1,
          workDir,
          files: [],
        }),
        () => workDir,
      );

      expect(result.runs[0]?.infrastructureBlocked).toBe(true);
      expect(result.runs[0]?.infrastructureReason).toBe("agent runner rate limit");
      expect(result.runs[0]?.assertions).toEqual([]);
      expect(result.runs[0]?.passed).toBe(false);
    } finally {
      rmSync(sessionDir, { recursive: true, force: true });
    }
  });
});
