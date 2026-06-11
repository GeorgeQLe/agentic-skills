#!/usr/bin/env node

import { runSkillpacksCli } from '../src/cli/run-pack-script.mjs';
import { startUpdateCheck, printUpdateNotice } from '../src/cli/update-check.mjs';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
const checkPromise = startUpdateCheck();

try {
  const exitCode = await runSkillpacksCli(process.argv.slice(2));
  process.exitCode = exitCode;
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`skillpacks: ${message}`);
  process.exitCode = 1;
} finally {
  await printUpdateNotice(checkPromise, pkg.version);
}
