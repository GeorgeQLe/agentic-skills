#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  activeSkillPaths,
  gitFiles,
  parseFrontmatter,
} from "./catalog/index.mjs";
import { SKILL_CONVENTIONS, conventionIds } from "./skill-convention-registry.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseRequiredConventions(markdown) {
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) return [];

  const block = frontmatter[1];
  const scalar = parseFrontmatter(markdown).required_conventions;
  if (scalar) {
    const inline = scalar.match(/^\[(.*)\]$/);
    const raw = inline ? inline[1] : scalar;
    return raw
      .split(",")
      .map((value) => value.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean)
      .sort();
  }

  const lines = block.split("\n");
  const start = lines.findIndex((line) => /^required_conventions:\s*$/.test(line));
  if (start === -1) return [];

  const values = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^[A-Za-z0-9_-]+:\s*/.test(line)) break;
    const item = line.match(/^\s*-\s*([^#]+?)\s*(?:#.*)?$/);
    if (item) values.push(item[1].trim().replace(/^['"]|['"]$/g, ""));
  }
  return values.filter(Boolean).sort();
}

function skillDir(skillPath) {
  return path.dirname(skillPath);
}

function skillName(skillPath) {
  return path.basename(path.dirname(skillPath));
}

function rel(...parts) {
  return path.join(...parts).replaceAll(path.sep, "/");
}

function packageJsonFilesList() {
  const packageJson = JSON.parse(
    readFileSync(path.join(repoRoot, "packages/skillpacks/package.json"), "utf8"),
  );
  return new Set(packageJson.files ?? []);
}

function fileContains(relativePath, needle) {
  const text = readFileSync(path.join(repoRoot, relativePath), "utf8");
  return text.includes(needle);
}

const tracked = new Set(gitFiles(repoRoot));
const skills = activeSkillPaths([...tracked]).sort();
const knownConventionIds = new Set(conventionIds());
const problems = [];

for (const skillPath of skills) {
  const markdown = readFileSync(path.join(repoRoot, skillPath), "utf8");
  const declared = new Set(parseRequiredConventions(markdown));

  for (const id of declared) {
    if (!knownConventionIds.has(id)) {
      problems.push(`${skillPath} declares unknown required_conventions id '${id}'`);
    }
  }

  for (const [id, convention] of Object.entries(SKILL_CONVENTIONS)) {
    const declaredConvention = declared.has(id);
    const referencesCanonicalDoc = markdown.includes(convention.canonicalDoc);

    if (convention.resolver === "shared-doc-or-asset") {
      const legacyBundleFile = convention.legacyBundleFile;
      const legacyBundlePath = legacyBundleFile ? rel(skillDir(skillPath), legacyBundleFile) : null;
      const legacyBundleExists = legacyBundlePath ? existsSync(path.join(repoRoot, legacyBundlePath)) : false;
      const referencesLegacyBundle = legacyBundleFile ? markdown.includes(legacyBundleFile) : false;
      const referencesSharedResolver = markdown.includes(`shared ${id} convention via the packaged convention resolver`);
      const referencesPackageAsset = markdown.includes(convention.packageAsset);
      const standardsReader = skillName(skillPath) === "upgrade-alignment-pages" || skillName(skillPath) === "upgrade-interrogation-pages";

      if (declaredConvention && !referencesSharedResolver && !referencesCanonicalDoc && !referencesPackageAsset && !referencesLegacyBundle) {
        problems.push(`${skillPath} declares ${id} but does not reference the shared resolver, canonical doc, package asset, or legacy ${legacyBundleFile}`);
      }
      if (legacyBundleExists && !declaredConvention) {
        problems.push(`${legacyBundlePath} exists but ${skillPath} does not declare ${id}`);
      }
      if (referencesLegacyBundle && !declaredConvention && !standardsReader) {
        problems.push(`${skillPath} references legacy ${id} convention material without declaring it`);
      }
      if ((referencesCanonicalDoc || referencesPackageAsset || referencesSharedResolver) && !declaredConvention && !standardsReader) {
        problems.push(`${skillPath} references ${id} convention material without declaring it`);
      }
      continue;
    }

    if (convention.bundleFile) {
      const bundlePath = rel(skillDir(skillPath), convention.bundleFile);
      const bundleExists = existsSync(path.join(repoRoot, bundlePath));
      const bundleTracked = tracked.has(bundlePath);
      const referencesBundle = markdown.includes(convention.bundleFile);

      if (declaredConvention && !bundleExists) {
        problems.push(`${skillPath} declares ${id} but is missing ${bundlePath}`);
      }
      if (declaredConvention && !bundleTracked) {
        problems.push(`${skillPath} declares ${id} but ${bundlePath} is not tracked by git`);
      }
      if (bundleExists && !declaredConvention) {
        problems.push(`${bundlePath} exists but ${skillPath} does not declare ${id}`);
      }
      if (referencesBundle && bundleExists && !declaredConvention) {
        problems.push(`${skillPath} references ${id} convention material without declaring it`);
      }
    }

    if (referencesCanonicalDoc && !declaredConvention) {
      problems.push(`${skillPath} references ${id} convention material without declaring it`);
    }
  }
}

const packageFiles = packageJsonFilesList();
for (const [id, convention] of Object.entries(SKILL_CONVENTIONS)) {
  if (!existsSync(path.join(repoRoot, convention.canonicalDoc))) {
    problems.push(`${id} canonical doc is missing: ${convention.canonicalDoc}`);
  }
  if (convention.generatorScript && !existsSync(path.join(repoRoot, convention.generatorScript))) {
    problems.push(`${id} generator script is missing: ${convention.generatorScript}`);
  }

  if (convention.generatorScript && !packageFiles.has(convention.generatorScript)) {
    problems.push(`packages/skillpacks/package.json does not publish ${convention.generatorScript}`);
  }
  if (!packageFiles.has(convention.packageAsset)) {
    problems.push(`packages/skillpacks/package.json does not publish ${convention.packageAsset}`);
  }
  if (convention.generatorScript && !fileContains("packages/skillpacks/scripts/build-package.mjs", convention.generatorScript)) {
    problems.push(`package staging does not copy ${convention.generatorScript}`);
  }
  if (!fileContains("packages/skillpacks/scripts/build-package.mjs", convention.packageAsset)) {
    problems.push(`package staging does not produce ${convention.packageAsset}`);
  }
}

for (const [id, convention] of Object.entries(SKILL_CONVENTIONS)) {
  if (!convention.checkCommand) continue;
  const [command, ...args] = convention.checkCommand;
  const resolvedCommand = command === "node" ? process.execPath : command;
  const result = spawnSync(resolvedCommand, args, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    problems.push(`${id} generator check failed: ${convention.checkCommand.join(" ")}${output ? `\n${output}` : ""}`);
  }
}

if (problems.length > 0) {
  console.error(`${problems.length} skill convention bundle issue(s):`);
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

const declaredCount = execFileSync("git", ["ls-files"], {
  cwd: repoRoot,
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean)
  .filter((file) => /\/(?:ALIGNMENT-PAGE|INTERROGATION-PAGE|DESIGN-TREE-LOOP)\.md$/.test(file))
  .length;

console.log(`Skill convention bundle audit passed for ${skills.length} active skills and ${declaredCount} tracked bundle(s).`);
