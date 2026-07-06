import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

export const SKILL_CONVENTIONS = {
  "alignment-page": {
    canonicalDoc: "docs/alignment-page-convention.md",
    legacyBundleFile: "ALIGNMENT-PAGE.md",
    packageAsset: "assets/alignment-page-convention.md",
    generatorScript: "scripts/upgrade-alignment-page.mjs",
    checkCommand: ["node", "scripts/upgrade-alignment-page.mjs", "--check"],
    resolver: "shared-doc-or-asset",
  },
  "interrogation-page": {
    canonicalDoc: "docs/interrogation-page-convention.md",
    legacyBundleFile: "INTERROGATION-PAGE.md",
    packageAsset: "assets/interrogation-page-convention.md",
    generatorScript: "scripts/upgrade-interrogation-page.mjs",
    checkCommand: ["node", "scripts/upgrade-interrogation-page.mjs", "--check"],
    resolver: "shared-doc-or-asset",
  },
  "briefing-slides": {
    canonicalDoc: "docs/briefing-slides-convention.md",
    packageAsset: "assets/briefing-slides-convention.md",
    resolver: "shared-doc-or-asset",
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

export const MANAGED_CONVENTION_DOC_PACKAGE_ROOT = "assets/skillpacks-docs";
export const MANAGED_CONVENTION_DOC_INSTALL_ROOT = ".agents/skillpacks/docs";

function posixPath(value) {
  return value.split(path.sep).join("/");
}

function conventionDocName(relativePath) {
  const name = path.posix.basename(relativePath);
  if (relativePath.startsWith("docs/social/")) {
    return /convention\.md$/.test(name);
  }
  if (path.posix.dirname(relativePath) !== "docs") {
    return false;
  }
  return /convention.*\.md$/.test(name) || /contract.*\.md$/.test(name);
}

export function managedConventionDocEntries(repoRoot) {
  const docsRoot = path.join(repoRoot, "docs");
  if (!existsSync(docsRoot)) {
    return [];
  }

  const files = [];
  function visit(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile()) {
        const canonicalDoc = posixPath(path.relative(repoRoot, fullPath));
        if (conventionDocName(canonicalDoc)) {
          const installPath = canonicalDoc.replace(/^docs\//, "");
          files.push({
            canonicalDoc,
            installPath,
            packageAsset: `${MANAGED_CONVENTION_DOC_PACKAGE_ROOT}/${installPath}`
          });
        }
      }
    }
  }

  visit(docsRoot);
  return files.sort((a, b) => a.canonicalDoc.localeCompare(b.canonicalDoc));
}
