export const SKILL_CONVENTIONS = {
  "alignment-page": {
    canonicalDoc: "docs/alignment-page-convention.md",
    bundleFile: "ALIGNMENT-PAGE.md",
    packageAsset: "assets/alignment-page-convention.md",
    generatorScript: "scripts/upgrade-alignment-page.mjs",
    checkCommand: ["node", "scripts/upgrade-alignment-page.mjs", "--check"],
  },
  "interrogation-page": {
    canonicalDoc: "docs/interrogation-page-convention.md",
    bundleFile: "INTERROGATION-PAGE.md",
    packageAsset: "assets/interrogation-page-convention.md",
    generatorScript: "scripts/upgrade-interrogation-page.mjs",
    checkCommand: ["node", "scripts/upgrade-interrogation-page.mjs", "--check"],
  },
  "prototype-session-loop": {
    canonicalDoc: "docs/prototype-session-loop-convention.md",
    bundleFile: "PROTOTYPE-SESSION-LOOP.md",
    packageAsset: "assets/prototype-session-loop-convention.md",
    generatorScript: "scripts/upgrade-prototype-session-loop.mjs",
    checkCommand: ["node", "scripts/upgrade-prototype-session-loop.mjs", "--check"],
  },
};

export function conventionIds() {
  return Object.keys(SKILL_CONVENTIONS).sort();
}
