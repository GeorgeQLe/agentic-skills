import { parseArgs } from "node:util";
import type { BenchAgent, BenchConfig } from "./harness/bench-types.js";
import { startOrResumeSession, runChunk } from "./harness/bench-runner.js";
import { writeReport } from "./harness/bench-report.js";
import {
  findResumeableSession,
  getSessionDir,
} from "./harness/bench-persistence.js";
import {
  resolveBenchScenarioTarget,
  resolveBenchTarget,
  supportedBenchScenarioRows,
  supportedBenchScenarios,
  supportedBenchSkillRows,
  supportedBenchSkills,
} from "./harness/bench-setups.js";

const { values } = parseArgs({
  options: {
    skill: { type: "string" },
    scenario: { type: "string" },
    runs: { type: "string", default: "100" },
    "chunk-size": { type: "string", default: "25" },
    pause: { type: "string", default: "1800" },
    agent: { type: "string", default: "both" },
    resume: { type: "boolean", default: false },
    "report-only": { type: "boolean", default: false },
    "list-skills": { type: "boolean", default: false },
    "list-scenarios": { type: "boolean", default: false },
  },
});

if (values["list-skills"]) {
  for (const row of supportedBenchSkillRows()) {
    const setup = row.coverage_status === "custom" ? ` setup=${row.setup_path ?? "missing"}` : "";
    const blocked = row.coverage_status === "blocked"
      ? ` reason=${row.blocked_reason} next=${row.next_command}`
      : "";
    console.log(`${row.skill}\tcoverage=${row.coverage_status}${setup}${blocked}`);
  }
  for (const row of supportedBenchScenarioRows()) {
    console.log(`--scenario ${row.scenario}\tsetup=${row.setup_path}\tdescription=${row.description}`);
  }
  process.exit(0);
}

if (values["list-scenarios"]) {
  for (const row of supportedBenchScenarioRows()) {
    console.log(`--scenario ${row.scenario}\tsetup=${row.setup_path}\tdescription=${row.description}`);
  }
  process.exit(0);
}

if (values.skill && values.scenario) {
  console.error("Use either --skill <skill> or --scenario <scenario>, not both.");
  process.exit(1);
}

const targetKind = values.scenario ? "scenario" : "skill";
const skill = values.scenario ?? values.skill ?? "design-system";
const runs = parseInt(values.runs!, 10);
const chunkSize = parseInt(values["chunk-size"]!, 10);
const pauseSeconds = parseInt(values.pause!, 10);
const agents = resolveAgents(values.agent!);

const target = targetKind === "scenario"
  ? resolveBenchScenarioTarget(skill)
  : resolveBenchTarget(skill);
if (!target) {
  if (targetKind === "scenario") {
    console.error(`Unknown scenario: ${skill}. Scenarios: ${supportedBenchScenarios().join(", ")}`);
  } else {
    console.error(`Unknown skill: ${skill}. Repository skills: ${supportedBenchSkills().join(", ")}`);
  }
  process.exit(1);
}
if (targetKind === "skill" && target.coverageStatus === "blocked") {
  console.error(`Benchmark coverage for ${skill}: blocked`);
  console.error(`Reason: ${target.blockedReason ?? "No reason recorded."}`);
  console.error(`Next command: ${target.nextCommand ?? "No next command recorded."}`);
  process.exit(1);
}

const setup = target.setup!;
console.log(
  targetKind === "scenario"
    ? `Benchmark scenario for ${skill}: custom`
    : `Benchmark coverage for ${skill}: ${target.coverageStatus}`,
);

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function resolveAgents(value: string): BenchAgent[] {
  if (value === "both") return ["claude", "codex"];
  if (value === "claude" || value === "codex") return [value];
  console.error("Invalid agent. Use: claude, codex, or both.");
  process.exit(1);
  throw new Error("unreachable");
}

async function runForAgent(agent: BenchAgent) {
  if (values["report-only"]) {
    const existing = findResumeableSession(skill, agent);
    if (!existing) {
      console.error(`No session found for ${targetKind}: ${skill}, agent: ${agent}`);
      process.exit(1);
      return;
    }
    const report = writeReport(existing);
    console.log(`Report generated at ${getSessionDir(existing)}/report.md`);
    console.log(`Pass rate: ${(report.passRate * 100).toFixed(1)}%`);
    return;
  }

  const config: BenchConfig = {
    skill,
    agent,
    runs,
    chunkSize,
    pauseSeconds,
    maxBudgetUsd: runs * setup.perRunBudgetUsd,
    perRunBudgetUsd: setup.perRunBudgetUsd,
    timeoutMs: setup.timeoutMs,
  };

  const manifest = startOrResumeSession(setup, config, Boolean(values.resume));
  let completedRuns = manifest.completedRuns;

  console.log(
    `Session ${manifest.sessionId} (${agent}): ${completedRuns}/${runs} completed, ` +
      `$${manifest.totalEstimatedCostUsd.toFixed(2)} spent`,
  );

  let chunkIndex = 0;
  while (completedRuns < runs) {
    if (chunkIndex > 0) {
      console.log(`Pausing ${pauseSeconds}s before next chunk...`);
      await sleep(pauseSeconds * 1000);
    }

    const remaining = runs - completedRuns;
    const thisChunk = Math.min(chunkSize, remaining);

    console.log(
      `Chunk ${chunkIndex}: running ${thisChunk} iterations ` +
        `(${completedRuns + 1}-${completedRuns + thisChunk})`,
    );

    const { manifest: updated, haltedByBudget } = await runChunk(
      setup,
      manifest,
      completedRuns,
      thisChunk,
    );

    completedRuns = updated.completedRuns;
    console.log(
      `Chunk done: ${completedRuns}/${runs} completed, ` +
        `$${updated.totalEstimatedCostUsd.toFixed(2)} spent`,
    );

    if (haltedByBudget) {
      console.log("Budget cap reached. Halting.");
      break;
    }

    chunkIndex++;
  }

  const report = writeReport(manifest);
  console.log(`\nFinal report at ${getSessionDir(manifest)}/report.md`);
  console.log(
    `Pass rate: ${(report.passRate * 100).toFixed(1)}% ` +
      `[${(report.wilsonLower * 100).toFixed(1)}%, ${(report.wilsonUpper * 100).toFixed(1)}%]`,
  );
  console.log(
    `Latency p50=${(report.latency.p50 / 1000).toFixed(1)}s ` +
      `p95=${(report.latency.p95 / 1000).toFixed(1)}s ` +
      `p99=${(report.latency.p99 / 1000).toFixed(1)}s`,
  );
  console.log(
    `Consistency: mean=${report.consistency.meanPairwiseSimilarity.toFixed(3)}, ` +
      `outliers=${report.consistency.outliers.length}`,
  );
  console.log(`Total cost: $${report.totalEstimatedCostUsd.toFixed(2)}`);
}

async function main() {
  for (const agent of agents) {
    await runForAgent(agent);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
