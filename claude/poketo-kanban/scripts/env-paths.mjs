import { join } from "node:path";
import { homedir } from "node:os";

export const ENV_SEARCH_PATHS = [
  join(homedir(), "projects", "apps", "poke", "monorepo", ".env.local"),
  join(homedir(), "projects", "apps", "poke", "monorepo", ".env"),
  join(homedir(), "projects", "poke", "dev", "poke-productivity-suite", ".env.local"),
  join(homedir(), "projects", "poke", "dev", "poke-productivity-suite", ".env"),
];
