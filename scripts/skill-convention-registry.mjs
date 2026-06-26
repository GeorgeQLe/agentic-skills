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
  "design-tree-loop": {
    canonicalDoc: "docs/design-tree-loop-convention.md",
    bundleFile: "DESIGN-TREE-LOOP.md",
    packageAsset: "assets/design-tree-loop-convention.md",
    generatorScript: "scripts/upgrade-design-tree-loop.mjs",
    checkCommand: ["node", "scripts/upgrade-design-tree-loop.mjs", "--check"],
  },
  "social-post": {
    canonicalDoc: "docs/social-post-convention.md",
    packageAsset: "assets/social-post-convention.md",
  },
  "social-video-content": {
    canonicalDoc: "docs/social-video-content-convention.md",
    packageAsset: "assets/social-video-content-convention.md",
  },
  "social-ledger": {
    canonicalDoc: "docs/social-ledger-convention.md",
    packageAsset: "assets/social-ledger-convention.md",
  },
};

export function conventionIds() {
  return Object.keys(SKILL_CONVENTIONS).sort();
}
