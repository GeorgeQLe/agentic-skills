#!/usr/bin/env node

import { runSkillpacksCli } from '../src/cli/run-pack-script.mjs';

try {
  const exitCode = await runSkillpacksCli(process.argv.slice(2));
  process.exitCode = exitCode;
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`skillpacks: ${message}`);
  process.exit(1);
}
