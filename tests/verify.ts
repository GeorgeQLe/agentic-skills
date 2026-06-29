import { parseArgs } from "node:util";
import { spawnSync } from "node:child_process";

const { values } = parseArgs({
  options: {
    skill: { type: "string" },
    layers: { type: "string", default: "1,2" },
  },
});

const layerSet = new Set(values.layers!.split(",").map((s) => parseInt(s, 10)));

const sortedLayers = [...layerSet].sort((a, b) => a - b);

type LayerResult = { layer: number; status: "PASS" | "FAIL" | "SKIP"; timeMs: number };

const results: LayerResult[] = [];

function buildCommand(layer: number): { cmd: string; args: string[]; env: Record<string, string> } {
  const env: Record<string, string> = {};
  const args = ["vitest", "run", "--project", `layer${layer}`];

  if (values.skill && layer >= 2) {
    args.push(values.skill);
  }

  return { cmd: "pnpm", args, env };
}

function formatTime(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

function printSummary() {
  const colLayer = 7;
  const colStatus = 6;
  const colTime = 7;

  const hr = `├${"─".repeat(colLayer + 2)}┼${"─".repeat(colStatus + 2)}┼${"─".repeat(colTime + 2)}┤`;
  const top = `┌${"─".repeat(colLayer + 2)}┬${"─".repeat(colStatus + 2)}┬${"─".repeat(colTime + 2)}┐`;
  const bot = `└${"─".repeat(colLayer + 2)}┴${"─".repeat(colStatus + 2)}┴${"─".repeat(colTime + 2)}┘`;

  const pad = (s: string, w: number) => s + " ".repeat(Math.max(0, w - s.length));

  console.log("\n" + top);
  console.log(`│ ${pad("Layer", colLayer)} │ ${pad("Status", colStatus)} │ ${pad("Time", colTime)} │`);
  console.log(hr);

  for (const r of results) {
    const name = `layer${r.layer}`;
    const time = r.status === "SKIP" ? "--" : formatTime(r.timeMs);
    console.log(`│ ${pad(name, colLayer)} │ ${pad(r.status, colStatus)} │ ${pad(time, colTime)} │`);
  }

  console.log(bot);
}

let failed = false;

for (const layer of sortedLayers) {
  if (!layerSet.has(layer)) {
    results.push({ layer, status: "SKIP", timeMs: 0 });
    continue;
  }

  const { cmd, args, env } = buildCommand(layer);
  const start = Date.now();

  const result = spawnSync(cmd, args, {
    stdio: ["inherit", "pipe", "pipe"],
    env: { ...process.env, ...env },
    cwd: import.meta.dirname,
  });

  const stdout = result.stdout?.toString() ?? "";
  const stderr = result.stderr?.toString() ?? "";
  process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);

  const elapsed = Date.now() - start;

  const combined = stdout + stderr;
  const allTestsPassed = /Test Files\s+\d+ passed/.test(stdout) && !/\d+ failed/.test(stdout);
  const onlyBirpcErrors = result.status !== 0
    && /Timeout calling "onTaskUpdate"/.test(combined)
    && allTestsPassed;
  const noTargetTests = result.status !== 0
    && Boolean(values.skill)
    && layer === 2
    && /No test files found/.test(combined);

  if (onlyBirpcErrors) {
    console.log("⚠ birpc timeout (cosmetic, all tests passed)");
  }

  if (noTargetTests) {
    console.log(`No layer2 tests matched skill "${values.skill}"; skipping target-specific layer2 verification.`);
    results.push({ layer, status: "SKIP", timeMs: elapsed });
    continue;
  }

  const passed = result.status === 0 || onlyBirpcErrors;

  if (!passed) {
    results.push({ layer, status: "FAIL", timeMs: elapsed });
    failed = true;
    break;
  }

  results.push({ layer, status: "PASS", timeMs: elapsed });
}

// Mark remaining layers as SKIP after fail-fast
for (const layer of sortedLayers) {
  if (!results.find((r) => r.layer === layer)) {
    results.push({ layer, status: "SKIP", timeMs: 0 });
  }
}

printSummary();
process.exit(failed ? 1 : 0);
