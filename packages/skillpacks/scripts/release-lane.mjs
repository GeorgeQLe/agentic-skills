import { parseFrontmatter, readTextFromIndex } from "../../../scripts/catalog/index.mjs";
import { SKILL_CONVENTIONS } from "../../../scripts/skill-convention-registry.mjs";

export const DEFAULT_PACKAGE_LANE = "stable";
export const PACKAGE_LANES = new Set(["stable", "canary"]);

export function packageLaneFromEnv(env = process.env) {
  const lane = env.SKILLPACKS_PACKAGE_LANE || DEFAULT_PACKAGE_LANE;
  if (!PACKAGE_LANES.has(lane)) {
    throw new Error(
      `Invalid SKILLPACKS_PACKAGE_LANE '${lane}'. Expected one of: ${[...PACKAGE_LANES].join(", ")}.`
    );
  }
  return lane;
}

export function normalizeReleaseLane(value) {
  if (value === "canary") return "canary";
  return "stable";
}

export function releaseLaneAllowed(releaseLane, packageLane = packageLaneFromEnv()) {
  const normalized = normalizeReleaseLane(releaseLane);
  if (packageLane === "canary") return normalized === "stable" || normalized === "canary";
  return normalized === "stable";
}

export function skillReleaseLaneFromText(text) {
  return normalizeReleaseLane(parseFrontmatter(text || "").release_lane);
}

export function skillReleaseLaneFromIndex(repoRoot, skillPath) {
  return skillReleaseLaneFromText(readTextFromIndex(repoRoot, skillPath));
}

export function conventionReleaseLane(convention) {
  return normalizeReleaseLane(convention?.release_lane);
}

export function isConventionAllowed(conventionId, packageLane = packageLaneFromEnv()) {
  return releaseLaneAllowed(conventionReleaseLane(SKILL_CONVENTIONS[conventionId]), packageLane);
}

export function allowedConventionEntries(entries, packageLane = packageLaneFromEnv()) {
  return entries.filter((entry) => {
    const registryEntry = Object.values(SKILL_CONVENTIONS).find(
      (convention) => convention.canonicalDoc === entry.canonicalDoc
    );
    return releaseLaneAllowed(conventionReleaseLane(registryEntry), packageLane);
  });
}
