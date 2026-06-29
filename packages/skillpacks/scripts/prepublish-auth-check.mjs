#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(readFileSync(path.join(packageRoot, "package.json"), "utf8"));
const registry = process.env.npm_config_registry || "https://registry.npmjs.org/";
const expectedPublisher = process.env.SKILLPACKS_NPM_PUBLISHER || "glexcorp";
const isDryRun = String(process.env.npm_config_dry_run || "").toLowerCase() === "true";
const allowPublished = String(process.env.SKILLPACKS_NPM_ALLOW_PUBLISHED || "").toLowerCase() === "true";
const npmTimeoutMs = Number(process.env.SKILLPACKS_NPM_PREFLIGHT_TIMEOUT_MS || 15000);

function parseArgs(argv) {
  const options = {
    packageName: process.env.SKILLPACKS_NPM_PACKAGE_NAME || packageJson.name,
    packageVersion: process.env.SKILLPACKS_NPM_PACKAGE_VERSION || packageJson.version
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--package-name") {
      options.packageName = argv[index + 1];
      index += 1;
    } else if (arg === "--package-version") {
      options.packageVersion = argv[index + 1];
      index += 1;
    } else {
      fail(`Unknown prepublish auth check option: ${arg}`);
    }
  }

  if (!options.packageName) {
    fail("Missing package name for npm publish auth preflight.");
  }
  if (!options.packageVersion) {
    fail("Missing package version for npm publish auth preflight.");
  }

  return options;
}

const { packageName, packageVersion } = parseArgs(process.argv.slice(2));

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

function normalizedRegistryTokenKey(value) {
  try {
    const url = new URL(value);
    const pathname = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
    return `//${url.host}${pathname}:_authToken`;
  } catch {
    return "//registry.npmjs.org/:_authToken";
  }
}

function hasTokenValue(value) {
  const normalized = String(value || "").trim();
  return normalized.length > 0 && !["undefined", "null"].includes(normalized.toLowerCase());
}

function npmConfigValue(key) {
  const result = npm(["config", "get", key]);
  if (result.status !== 0 || result.error) {
    return "";
  }
  return result.stdout.trim();
}

function hasRegistryAuthToken() {
  const result = npm(["config", "get", normalizedRegistryTokenKey(registry)]);
  if (result.status === 0 && hasTokenValue(result.stdout)) {
    return true;
  }

  const details = `${result.stdout || ""}\n${result.stderr || ""}\n${result.error?.message || ""}`;
  return /_authToken/.test(details) && /protected/i.test(details);
}

function hasPublishToken() {
  if (hasTokenValue(process.env.NODE_AUTH_TOKEN) || hasTokenValue(process.env.NPM_TOKEN)) {
    return true;
  }
  return hasRegistryAuthToken();
}

const authType = npmConfigValue("auth-type").toLowerCase();
if (authType === "web" && !hasPublishToken()) {
  fail(
    [
      `npm publish auth preflight failed for ${packageName}@${packageVersion}.`,
      `npm is configured with auth-type=web for ${registry}, but this release runs non-interactively and no publish token was detected.`,
      "",
      "Configure a publish-capable token via NODE_AUTH_TOKEN, NPM_TOKEN, or a registry-scoped _authToken before retrying.",
      "Alternatively, run token-based npm auth and verify it before retrying:",
      "",
      `  npm login --auth-type=legacy --registry ${registry}`,
      `  npm whoami --registry ${registry}`
    ].join("\n")
  );
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
  if (allowPublished) {
    console.error(`${packageName}@${packageVersion} is already published to ${registry}; continuing because SKILLPACKS_NPM_ALLOW_PUBLISHED=true.`);
  } else {
    fail(`${packageName}@${packageVersion} is already published to ${registry}.`);
  }
} else if (!/E404|404/.test(`${publishedVersion.stdout}\n${publishedVersion.stderr}`)) {
  fail(`Could not verify whether ${packageName}@${packageVersion} is already published.`, publishedVersion);
}

console.error(`npm publish auth preflight passed for ${packageName}@${packageVersion} as ${actualPublisher}${isDryRun ? " (dry run)" : ""}.`);
