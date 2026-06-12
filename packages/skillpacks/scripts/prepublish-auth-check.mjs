#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(readFileSync(path.join(packageRoot, "package.json"), "utf8"));
const packageName = packageJson.name;
const packageVersion = packageJson.version;
const registry = process.env.npm_config_registry || "https://registry.npmjs.org/";
const expectedPublisher = process.env.SKILLPACKS_NPM_PUBLISHER || "glexcorp";
const isDryRun = String(process.env.npm_config_dry_run || "").toLowerCase() === "true";
const npmTimeoutMs = Number(process.env.SKILLPACKS_NPM_PREFLIGHT_TIMEOUT_MS || 15000);

function npm(args) {
  return spawnSync("npm", [...args, "--registry", registry], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: npmTimeoutMs
  });
}

function fail(message, result) {
  const details = result
    ? [
        result.error && `error:\n${result.error.message}`,
        result.stdout.trim() && `stdout:\n${result.stdout.trim()}`,
        result.stderr.trim() && `stderr:\n${result.stderr.trim()}`
      ]
        .filter(Boolean)
        .join("\n\n")
    : "";

  console.error(message);
  if (details) {
    console.error(`\n${details}`);
  }
  process.exit(1);
}

function parseMaintainerNames(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (typeof entry === "string") return entry.split(/\s+/)[0];
        if (entry && typeof entry === "object") return entry.name;
        return null;
      })
      .filter(Boolean);
  }
  if (typeof value === "object" && value.name) {
    return [value.name];
  }
  return [];
}

if (isDryRun) {
  console.error("Skipping npm auth preflight for publish dry-run.");
  process.exit(0);
}

const whoami = npm(["whoami"]);
if (whoami.error) {
  fail(
    [
      `npm publish auth preflight failed for ${packageName}@${packageVersion}.`,
      `npm whoami did not complete within ${npmTimeoutMs}ms. Check npm registry connectivity/auth, then retry.`
    ].join("\n"),
    whoami
  );
}
if (whoami.status !== 0) {
  fail(
    [
      `npm publish auth preflight failed for ${packageName}@${packageVersion}.`,
      `Log in to ${registry} as ${expectedPublisher} before running a real publish.`,
      "",
      `  npm login --registry ${registry}`,
      `  npm whoami --registry ${registry}`,
      "",
      "Without a valid publisher session, npm may fail later with a misleading PUT 404."
    ].join("\n"),
    whoami
  );
}

const actualPublisher = whoami.stdout.trim();
if (actualPublisher !== expectedPublisher) {
  fail(
    [
      `npm publish auth preflight failed for ${packageName}@${packageVersion}.`,
      `Logged in as ${actualPublisher}, but expected ${expectedPublisher}.`,
      "If this release intentionally moved to another maintainer, set SKILLPACKS_NPM_PUBLISHER."
    ].join("\n")
  );
}

const maintainers = npm(["view", packageName, "maintainers", "--json"]);
if (maintainers.status === 0) {
  const maintainerNames = parseMaintainerNames(JSON.parse(maintainers.stdout));
  if (!maintainerNames.includes(actualPublisher)) {
    fail(
      [
        `npm publish auth preflight failed for ${packageName}@${packageVersion}.`,
        `${actualPublisher} is authenticated, but is not listed as a ${packageName} maintainer.`,
        `Current maintainers: ${maintainerNames.length ? maintainerNames.join(", ") : "(none)"}`
      ].join("\n")
    );
  }
} else if (!/E404|404/.test(`${maintainers.stdout}\n${maintainers.stderr}`)) {
  fail(`Could not verify npm maintainers for ${packageName}.`, maintainers);
}

const publishedVersion = npm(["view", `${packageName}@${packageVersion}`, "version", "--json"]);
if (publishedVersion.status === 0) {
  fail(`${packageName}@${packageVersion} is already published to ${registry}.`);
}
if (!/E404|404/.test(`${publishedVersion.stdout}\n${publishedVersion.stderr}`)) {
  fail(`Could not verify whether ${packageName}@${packageVersion} is already published.`, publishedVersion);
}

console.error(`npm publish auth preflight passed for ${packageName}@${packageVersion} as ${actualPublisher}.`);
