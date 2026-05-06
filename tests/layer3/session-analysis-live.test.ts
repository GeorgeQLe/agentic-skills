import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import {
  type AgentName,
  REPO_ROOT,
  agentEnabled,
  commandAvailable,
  livePromptForScenario,
  liveTestsEnabled,
  makeLiveTestRepo,
  removeLiveTestRepo,
  runLiveAgent,
  sessionAnalysisSchema,
  writeFixtureFiles,
} from "../harness/live-agent.js";

interface SessionAnalysisResult {
  selectedSkill: "analyze-sessions" | "session-triage";
  reason: string;
  verificationVerdict: string;
  timeline: string[];
  rootCause: string;
  recommendedFix: string;
  validationPlan: string[];
  recommendedNextSkill: string;
  forbiddenAliasUsed: boolean;
}

const liveDescribe = liveTestsEnabled() ? describe : describe.skip;
const agents: AgentName[] = ["claude", "codex"];
let workDirs: string[] = [];

function resultOf(parsed: unknown): SessionAnalysisResult {
  expect(parsed, "agent returned parseable structured output").toBeTruthy();
  const result = parsed as Partial<SessionAnalysisResult>;
  expect(typeof result.selectedSkill).toBe("string");
  expect(Array.isArray(result.timeline)).toBe(true);
  expect(Array.isArray(result.validationPlan)).toBe(true);
  return result as SessionAnalysisResult;
}

function makeScenarioRepo(name: string): string {
  const workDir = makeLiveTestRepo(name);
  writeFixtureFiles(workDir);
  workDirs.push(workDir);
  return workDir;
}

liveDescribe("live session-analysis skill behavior", () => {
  beforeAll(() => {
    execFileSync("bash", [join(REPO_ROOT, "install.sh")], {
      cwd: REPO_ROOT,
      stdio: "pipe",
    });
  });

  afterEach(() => {
    for (const dir of workDirs) removeLiveTestRepo(dir);
    workDirs = [];
  });

  for (const agent of agents) {
    const describeAgent = agentEnabled(agent) ? describe : describe.skip;

    describeAgent(`${agent} headless skill routing`, () => {
      beforeAll(() => {
        expect(commandAvailable(agent), `${agent} CLI must be installed for live tests`).toBe(true);
      });

      it("uses session-triage for one verified incident", () => {
        const workDir = makeScenarioRepo(`${agent}-incident`);
        const run = runLiveAgent({
          agent,
          workDir,
          schema: sessionAnalysisSchema,
          prompt: livePromptForScenario("single-incident"),
        });

        expect(run.exitCode, `${agent} stderr:\n${run.stderr}\nstdout:\n${run.stdout}`).toBe(0);
        const result = resultOf(run.parsed);

        expect(result.selectedSkill).toBe("session-triage");
        expect(result.forbiddenAliasUsed).toBe(false);
        expect(result.verificationVerdict).toMatch(/verified|partially verified/);
        expect(result.timeline.length).toBeGreaterThan(0);
        expect(result.rootCause.length).toBeGreaterThan(0);
        expect(result.recommendedFix.length).toBeGreaterThan(0);
        expect(result.validationPlan.length).toBeGreaterThan(0);
        expect(result.recommendedNextSkill).toMatch(/targeted-skill-builder|create-agentic-skill|none/);
      });

      it("uses analyze-sessions for broad repeated-prompt trends", () => {
        const workDir = makeScenarioRepo(`${agent}-trends`);
        const run = runLiveAgent({
          agent,
          workDir,
          schema: sessionAnalysisSchema,
          prompt: livePromptForScenario("broad-trends"),
        });

        expect(run.exitCode, `${agent} stderr:\n${run.stderr}\nstdout:\n${run.stdout}`).toBe(0);
        const result = resultOf(run.parsed);

        expect(result.selectedSkill).toBe("analyze-sessions");
        expect(result.forbiddenAliasUsed).toBe(false);
        expect(result.reason.toLowerCase()).toMatch(/trend|repeat|pattern|cross-session|history/);
        expect(result.recommendedNextSkill).not.toContain("analyze-session");
      });
    });
  }
});
