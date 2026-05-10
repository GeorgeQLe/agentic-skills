import { parseArgs } from "node:util";
import { designSystemSetup } from "./layer4/setups/design-system.setup.js";
import { designSystemDraftstonkSetup } from "./layer4/setups/design-system-draftstonk.setup.js";
import type { SkillBenchSetup, BenchConfig } from "./harness/bench-types.js";
import { startOrResumeSession, runChunk } from "./harness/bench-runner.js";
import { writeReport } from "./harness/bench-report.js";
import {
  findResumeableSession,
  loadSessionRuns,
  getSessionDir,
} from "./harness/bench-persistence.js";

const SETUPS: Record<string, SkillBenchSetup> = {
  "design-system": designSystemSetup,
  "design-system-draftstonk": designSystemDraftstonkSetup,
};

const { values } = parseArgs({
  options: {
    skill: { type: "string", default: "design-system" },
    runs: { type: "string", default: "100" },
    "chunk-size": { type: "string", default: "25" },
    pause: { type: "string", default: "1800" },
    resume: { type: "boolean", default: false },
    "report-only": { type: "boolean", default: false },
  },
});

const skill = values.skill!;
const runs = parseInt(values.runs!, 10);
const chunkSize = parseInt(values["chunk-size"]!, 10);
const pauseSeconds = parseInt(values.pause!, 10);

const setup = SETUPS[skill];
if (!setup) {
  console.error(`Unknown skill: ${skill}. Available: ${Object.keys(SETUPS).join(", ")}`);
  process.exit(1);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (values["report-only"]) {
    const existing = findResumeableSession(skill);
    if (!existing) {
      console.error(`No session found for skill: ${skill}`);
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
    runs,
    chunkSize,
    pauseSeconds,
    maxBudgetUsd: runs * setup.perRunBudgetUsd,
    perRunBudgetUsd: setup.perRunBudgetUsd,
    timeoutMs: setup.timeoutMs,
  };

  const manifest = startOrResumeSession(setup, config);
  let completedRuns = manifest.completedRuns;

  console.log(
    `Session ${manifest.sessionId}: ${completedRuns}/${runs} completed, ` +
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
