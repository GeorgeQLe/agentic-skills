#!/usr/bin/env node

import { runSkillpacksCli } from '../src/cli/run-pack-script.mjs';
import {
  printPackageStatus,
  shouldPrintPackageStatus,
  startUpdateCheck
} from '../src/cli/update-check.mjs';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
const cliArgs = process.argv.slice(2);
const checkPromise = startUpdateCheck();
const printStatus = shouldPrintPackageStatus(cliArgs);

try {
  const exitCode = await runSkillpacksCli(cliArgs);
  process.exitCode = exitCode;
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`skillpacks: ${message}`);
  process.exitCode = 1;
} finally {
  await printPackageStatus(checkPromise, pkg.version, { enabled: printStatus });
}
