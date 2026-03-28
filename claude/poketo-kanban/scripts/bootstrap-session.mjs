#!/usr/bin/env node

/**
 * Bootstrap a poketo session by querying the auth and pokeapps databases directly.
 * Run this once to create ~/.poketo/config.json without needing the Flow app running.
 *
 * Usage: node bootstrap-session.mjs
 *
 * Requires these env vars (reads from poke-productivity-suite/.env.local):
 *   - AUTH_DATABASE_URL
 *   - POKEAPPS_DATABASE_URL
 *   - POKETOWORK_DATABASE_URL
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { neon } from "@neondatabase/serverless";
import { ENV_SEARCH_PATHS } from "./env-paths.mjs";

export function loadEnv(searchPaths) {
  const envPaths = searchPaths ?? ENV_SEARCH_PATHS;

  const vars = {};
  for (const p of envPaths) {
    if (!existsSync(p)) continue;
    const content = readFileSync(p, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([A-Z_]+)=["']?([^\s"']+)["']?/);
      if (match) vars[match[1]] = match[2];
    }
  }
  return vars;
}

export function buildConfig(user, org) {
  return {
    session: {
      sessionToken: "bootstrap-direct-db",
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      orgId: org.org_id,
      authenticatedAt: new Date().toISOString(),
    },
  };
}

export async function main() {
  const env = loadEnv();

  if (!env.AUTH_DATABASE_URL) {
    console.error("AUTH_DATABASE_URL not found in .env.local");
    process.exit(1);
  }
  if (!env.POKEAPPS_DATABASE_URL) {
    console.error("POKEAPPS_DATABASE_URL not found in .env.local");
    process.exit(1);
  }

  console.log("Querying auth database for users...");
  const authSql = neon(env.AUTH_DATABASE_URL);
  const users = await authSql`SELECT id, name, email FROM "user" ORDER BY created_at LIMIT 10`;

  if (users.length === 0) {
    console.error("No users found in auth database.");
    process.exit(1);
  }

  // Show users and let the user pick
  console.log("\nAvailable users:");
  users.forEach((u, i) => {
    console.log(`  [${i}] ${u.name} (${u.email}) — id: ${u.id.slice(0, 8)}...`);
  });

  // Default to first user
  const selectedUser = users[0];
  console.log(`\nUsing: ${selectedUser.name} (${selectedUser.email})`);

  // Get org
  console.log("Querying for organization...");
  const appsSql = neon(env.POKEAPPS_DATABASE_URL);
  const orgs = await appsSql`SELECT org_id, is_primary FROM user_orgs WHERE user_id = ${selectedUser.id}`;

  const primaryOrg = orgs.find((o) => o.is_primary) ?? orgs[0];

  if (!primaryOrg) {
    console.error("No organization found for this user.");
    process.exit(1);
  }

  console.log(`Organization: ${primaryOrg.org_id}`);

  // Write config
  const configDir = join(homedir(), ".poketo");
  const configFile = join(configDir, "config.json");

  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  const config = buildConfig(selectedUser, primaryOrg);

  writeFileSync(configFile, JSON.stringify(config, null, 2) + "\n");
  console.log(`\nSession saved to ${configFile}`);
  console.log("You can now run: node kanban.mjs boards");
}

const isDirectRun = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/.*\//, ''));
if (isDirectRun) {
  main().catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
}
