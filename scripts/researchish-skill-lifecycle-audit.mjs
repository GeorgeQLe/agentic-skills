#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
let rootOverride = null;
const flags = new Set();

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--root") {
    rootOverride = args[i + 1];
    i += 1;
    if (!rootOverride) usage("missing value for --root");
  } else if (arg === "--json" || arg === "--help" || arg === "-h") {
    flags.add(arg);
  } else {
    usage(`unknown argument: ${arg}`);
  }
}

if (flags.has("--help") || flags.has("-h")) usage(null, 0);

const repoRoot = rootOverride ? resolve(rootOverride) : dirname(dirname(fileURLToPath(import.meta.url)));

const CATEGORY_ORDER = ["staged-research", "alignment-document", "direct-utility", "misclassified"];
const UTILITY_TYPES = new Set(["ops", "execution", "shipping", "router", "orchestrator", "debugging"]);
const DIRECT_UTILITY_NAMES = new Set([
  "exec",
  "ship",
  "ship-end",
  "sync",
  "commit-and-push-by-feature",
  "deploy",
  "scaffold",
  "bootstrap-repo",
  "env-setup",
  "pack",
  "skills",
  "compile-central-alignment",
  "upgrade-alignment-pages",
  "patch-exec-profile",
  "create-agentic-skill",
  "create-local-skill",
  "targeted-skill-builder",
  "update-packages",
  "mono-exec",
  "mono-ship",
  "handoff",
]);

const STAGED_MARKERS = [
  {
    id: "report-first-heading",
    label: "Report-First Approval Gate heading",
    test: (text) => text.includes("## Report-First Approval Gate"),
  },
  {
    id: "scope-first-default",
    label: "scope-first default",
    test: (text) => /Default to scope-first approval/i.test(text),
  },
  {
    id: "scope-evidence-only",
    label: "pre-approval work is scope evidence only",
    test: (text) => /label it as scope evidence, not findings/i.test(text),
  },
  {
    id: "staged-workflow-heading",
    label: "Staged Research Workflow heading",
    test: (text) => text.includes("## Staged Research Workflow"),
  },
  {
    id: "stage-1-heading",
    label: "Stage 1 scope discovery and approval",
    test: (text) => text.includes("1. **Stage 1 - Scope discovery and approval.**"),
  },
  {
    id: "review-page-before-research",
    label: "review page before synthesized research",
    test: (text) => text.includes("Build the `review` HTML alignment page before synthesized research"),
  },
  {
    id: "stage-1-stop",
    label: "Stage 1 stops for research-scope approval",
    test: (text) => text.includes("Stop for final compiled YAML approval of the research scope"),
  },
  {
    id: "stage-1-no-research",
    label: "Stage 1 does not write findings or working packets",
    test: (text) => text.includes("Do not perform synthesized research, rank candidates, make recommendations, or write working packets"),
  },
  {
    id: "stage-2-heading",
    label: "Stage 2 research and artifact review",
    test: (text) => text.includes("2. **Stage 2 - Research and artifact review.**"),
  },
  {
    id: "stage-2-after-approval",
    label: "Stage 2 starts only after approved research scope",
    test: (text) => text.includes("Only after approved research-scope YAML"),
  },
  {
    id: "flat-working-packet",
    label: "flat preliminary working packet path",
    test: (text) => text.includes("`research/_working/preliminary-<skill>-research.md`"),
  },
  {
    id: "scoped-working-packet",
    label: "product-path preliminary working packet path",
    test: (text) => text.includes("`research/{slug}/_working/preliminary-<skill>-research.md`"),
  },
  {
    id: "artifact-review-page",
    label: "artifact approval page renders structured working-packet substance",
    test: (text) =>
      text.includes("Update the `review` HTML alignment page so it renders the complete working-packet substance"),
  },
  {
    id: "feedback-loop",
    label: "feedback-only YAML stays in Stage 2",
    test: (text) => text.includes("Feedback-only YAML revises the working packet and page, then remains in Stage 2"),
  },
  {
    id: "stage-3-heading",
    label: "Stage 3 finalizes approved artifacts",
    test: (text) => text.includes("3. **Stage 3 - Finalize approved artifacts.**"),
  },
  {
    id: "archive-working-packet",
    label: "archive working packet before canonical write",
    test: (text) => text.includes("archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`"),
  },
  {
    id: "remove-active-working-packet",
    label: "remove active working packet",
    test: (text) => text.includes("remove the active working packet"),
  },
  {
    id: "write-canonical-artifacts",
    label: "write approved canonical artifacts",
    test: (text) => text.includes("write the approved canonical artifacts"),
  },
  {
    id: "confirmed-page",
    label: "convert alignment page to confirmed",
    test: (text) => text.includes("convert the alignment page to `confirmed`"),
  },
  {
    id: "canonical-paths-unchanged",
    label: "canonical output paths remain unchanged",
    test: (text) => text.includes("Canonical output paths remain unchanged"),
  },
];

function usage(error, exitCode = 1) {
  const stream = exitCode === 0 ? process.stdout : process.stderr;
  if (error) stream.write(`ERROR: ${error}\n\n`);
  stream.write(
    [
      "Usage: node scripts/researchish-skill-lifecycle-audit.mjs [--json] [--root <path>]",
      "",
      "Default mode prints a Markdown audit report and writes no files.",
      "--json emits machine-readable audit data for tests and writes no files.",
      "",
    ].join("\n"),
  );
  process.exit(exitCode);
}

function walk(dir, predicate, out = []) {
  if (!existsSync(dir)) return out;

  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === "archive" || entry === "node_modules" || entry === ".git") continue;
      walk(full, predicate, out);
    } else if (stat.isFile() && predicate(full)) {
      out.push(full);
    }
  }

  return out;
}

function normalizeRel(file) {
  return relative(repoRoot, file).split(/\\/g).join("/");
}

function collectActiveSkillFiles() {
  return [
    ...walk(resolve(repoRoot, "base"), (file) => file.endsWith("/SKILL.md")),
    ...walk(resolve(repoRoot, "packs"), (file) => file.endsWith("/SKILL.md")),
  ].map(normalizeRel).sort();
}

function readSkipList() {
  const skipPath = resolve(repoRoot, "scripts/alignment-skip-list.txt");
  const names = new Set();
  if (!existsSync(skipPath)) return names;

  for (const rawLine of readFileSync(skipPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    if (line) names.add(line);
  }
  return names;
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const data = {};
  if (!match) return data;

  for (const rawLine of match[1].split(/\r?\n/)) {
    const parsed = rawLine.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!parsed) continue;
    const value = parsed[2].trim().replace(/^"(.*)"$/, "$1");
    data[parsed[1]] = value;
  }

  return data;
}

function stripFrontmatter(text) {
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

function stripStagedBoilerplate(text) {
  return text
    .replace(/\n## Report-First Approval Gate\n[\s\S]*?(?=\n## |\n# |$)/g, "\n")
    .replace(/\n## Staged Research Workflow\n[\s\S]*?(?=\n## |\n# |$)/g, "\n");
}

function lineMatches(text, regex, limit = 8) {
  const lines = text.split(/\r?\n/);
  const matches = [];
  for (let i = 0; i < lines.length; i += 1) {
    regex.lastIndex = 0;
    if (!regex.test(lines[i])) continue;
    matches.push({
      line: i + 1,
      text: lines[i].trim().replace(/\s+/g, " "),
    });
    if (matches.length >= limit) break;
  }
  return matches;
}

function missingStagedMarkers(text) {
  return STAGED_MARKERS.filter((marker) => !marker.test(text)).map((marker) => marker.id);
}

function isDirectUtility(record, skipListNames) {
  const name = record.name || record.dirName;
  if (skipListNames.has(name)) return true;
  if (DIRECT_UTILITY_NAMES.has(name)) return true;
  if (["ops", "shipping", "router", "orchestrator"].includes(record.type)) return true;
  if (
    record.type === "execution"
    && /\b(install|initialize|ship|deploy|commit|push|scaffold|sync|delegate|cleanup|migrate)\b/i.test(record.description || "")
  ) {
    return true;
  }
  if (/\b(router|route|install|initialize|ship|deploy|commit|push|scaffold|sync|delegate)\b/i.test(record.description || "")) {
    return true;
  }
  return false;
}

function researchPathSignals(text) {
  const body = stripFrontmatter(text);
  const stripped = stripStagedBoilerplate(body);
  const mentionsResearchPath = /\bresearch\//.test(body);
  const mentionsResearchOutsideStaged = /\bresearch\//.test(stripped);
  const usesWorkingPacket =
    /(?:^|[^A-Za-z0-9_-])_working(?:[^A-Za-z0-9_-]|$)/.test(body)
    || /\bresearch\/(?:\{slug\}\/)?_working\//.test(body)
    || /preliminary-[A-Za-z0-9_-]+-research\.md/.test(body);
  const usesGenericWorkingPacket = body.includes("research/_working/preliminary-<skill>-research.md")
    || body.includes("research/{slug}/_working/preliminary-<skill>-research.md");
  const writesCanonicalResearch = body.split(/\r?\n/).some((line) => {
    return /\bresearch\//.test(line)
      && !/\bresearch\/(?:\{slug\}\/)?_working\//.test(line)
      && !/preliminary-<skill>-research\.md/.test(line)
      && /\b(write|writes|writing|create|creates|creating|update|updates|updating|append|appends|produce|produces|output|canonical|artifact|deliverable)\b/i.test(line);
  });

  return {
    mentionsResearchPath,
    mentionsResearchOutsideStaged,
    usesWorkingPacket,
    usesGenericWorkingPacket,
    writesCanonicalResearch,
  };
}

function alignmentSignals(relPath, text) {
  const skillDir = dirname(resolve(repoRoot, relPath));
  const hasAlignmentHeading = /^#{2,3} Alignment Page$/m.test(text);
  const hasAlignmentBundle = existsSync(resolve(skillDir, "ALIGNMENT-PAGE.md"));
  const hasAlignmentText =
    /alignment\/[^`\s)]+\.html/.test(text)
    || /\b(build|write|create|produce|output|render)\b[^\n]{0,80}\balignment (?:review )?(?:HTML )?page/i.test(text)
    || /\balignment (?:review )?page[^\n]{0,80}\b(output|artifact|deliverable|gate)/i.test(text);
  return {
    hasAlignmentHeading,
    hasAlignmentBundle,
    hasAlignmentBehavior: hasAlignmentHeading || hasAlignmentBundle || hasAlignmentText,
  };
}

function semanticSuspicionReasons(record) {
  if (record.type !== "research" || !record.signals.stagedMarkerCompliant) return [];

  const reasons = [];
  const name = record.name || "";
  const description = record.description || "";
  const textWithoutStaged = stripStagedBoilerplate(stripFrontmatter(record.text));

  if (/\b(router|route|play composer|does not produce research artifacts|do not write files)\b/i.test(description)
    || /\bdoes not produce research artifacts\b/i.test(record.text)) {
    reasons.push("description-or-body-says-router-or-no-research-artifacts");
  }

  if (/(^|[-_])(test|launch|metrics|schema|optimizer|prelaunch|portfolio)([-_]|$)/i.test(name)) {
    reasons.push("name-suggests-validation-planning-or-utility-review-needed");
  }

  if (!/^## Output$/m.test(record.text)) {
    reasons.push("no-explicit-output-section");
  }

  if (!/\bresearch\//.test(textWithoutStaged)) {
    reasons.push("no-specific-research-path-outside-staged-boilerplate");
  }

  return reasons;
}

function buildRecord(relPath, skipListNames) {
  const absPath = resolve(repoRoot, relPath);
  const text = readFileSync(absPath, "utf8");
  const fm = parseFrontmatter(text);
  const dirName = basename(dirname(absPath));
  const name = fm.name || dirName;
  const type = fm.type || "unknown";
  const description = fm.description || "";
  const stagedMissingMarkers = missingStagedMarkers(text);
  const stagedMarkerCompliant = stagedMissingMarkers.length === 0;
  const researchSignals = researchPathSignals(text);
  const alignSignals = alignmentSignals(relPath, text);

  const record = {
    path: relPath,
    name,
    dirName,
    type,
    version: fm.version || null,
    description,
    text,
    signals: {
      typeResearch: type === "research",
      inAlignmentSkipList: skipListNames.has(name),
      hasReportFirstGate: text.includes("## Report-First Approval Gate"),
      hasStagedWorkflow: text.includes("## Staged Research Workflow"),
      stagedMarkerCompliant,
      ...researchSignals,
      ...alignSignals,
    },
    stagedMissingMarkers,
    category: null,
    issues: [],
    evidence: {
      researchPathLines: lineMatches(text, /\bresearch\//g),
      workingPacketLines: lineMatches(text, /_working|preliminary-[A-Za-z0-9_-]+-research\.md/g),
      alignmentLines: lineMatches(text, /Alignment Page|alignment\/[^`\s)]+\.html|HTML alignment page/g),
    },
  };

  record.signals.directUtility = isDirectUtility(record, skipListNames);
  record.signals.semanticSuspicionReasons = semanticSuspicionReasons(record);
  record.signals.inScope =
    record.signals.typeResearch
    || record.signals.hasAlignmentBehavior
    || record.signals.mentionsResearchPath
    || record.signals.usesWorkingPacket
    || record.signals.writesCanonicalResearch
    || record.signals.hasStagedWorkflow
    || record.signals.hasReportFirstGate;

  return record;
}

function classify(record) {
  const typeConflict = record.signals.hasStagedWorkflow && record.type !== "research";
  const researchTypeContradictsUtility =
    record.type === "research"
    && record.signals.directUtility
    && !record.signals.hasStagedWorkflow
    && !record.signals.writesCanonicalResearch;

  if (typeConflict) {
    record.category = "misclassified";
    record.issues.push("staged research workflow exists but frontmatter type is not research");
    return record;
  }

  if (researchTypeContradictsUtility) {
    record.category = "misclassified";
    record.issues.push("frontmatter type is research but skill reads as direct utility");
    return record;
  }

  if (record.signals.typeResearch || record.signals.hasStagedWorkflow || record.signals.usesGenericWorkingPacket) {
    record.category = "staged-research";
    if (!record.signals.stagedMarkerCompliant) {
      record.issues.push(`missing staged markers: ${record.stagedMissingMarkers.join(", ")}`);
    }
    return record;
  }

  if (record.signals.directUtility) {
    record.category = "direct-utility";
    if (record.signals.hasAlignmentBehavior) {
      record.issues.push("direct utility has alignment-page behavior");
    }
    if (record.signals.usesWorkingPacket || record.signals.writesCanonicalResearch) {
      record.issues.push("direct utility mentions research working/canonical outputs");
    }
    return record;
  }

  if (record.signals.hasAlignmentBehavior || record.signals.mentionsResearchPath || record.signals.writesCanonicalResearch) {
    record.category = "alignment-document";
    if (record.signals.usesGenericWorkingPacket) {
      record.issues.push("alignment document uses generic staged research working-packet path");
    }
    return record;
  }

  record.category = "direct-utility";
  return record;
}

function compactEvidence(record) {
  const compactLines = (lines) => {
    return (lines || []).slice(0, 2).map((line) => {
      const text = line.text.length > 160 ? `${line.text.slice(0, 157)}...` : line.text;
      return { line: line.line, text };
    });
  };
  return {
    researchPathLines: compactLines(record.evidence.researchPathLines),
    workingPacketLines: compactLines(record.evidence.workingPacketLines),
    alignmentLines: compactLines(record.evidence.alignmentLines),
  };
}

function publicRecord(record, options = {}) {
  const signals = {
    typeResearch: record.signals.typeResearch,
    inAlignmentSkipList: record.signals.inAlignmentSkipList,
    hasReportFirstGate: record.signals.hasReportFirstGate,
    hasStagedWorkflow: record.signals.hasStagedWorkflow,
    stagedMarkerCompliant: record.signals.stagedMarkerCompliant,
    mentionsResearchPath: record.signals.mentionsResearchPath,
    mentionsResearchOutsideStaged: record.signals.mentionsResearchOutsideStaged,
    usesWorkingPacket: record.signals.usesWorkingPacket,
    usesGenericWorkingPacket: record.signals.usesGenericWorkingPacket,
    writesCanonicalResearch: record.signals.writesCanonicalResearch,
    hasAlignmentHeading: record.signals.hasAlignmentHeading,
    hasAlignmentBundle: record.signals.hasAlignmentBundle,
    hasAlignmentBehavior: record.signals.hasAlignmentBehavior,
    directUtility: record.signals.directUtility,
    semanticSuspicionReasons: record.signals.semanticSuspicionReasons,
    inScope: record.signals.inScope,
  };
  const out = {
    path: record.path,
    name: record.name,
    type: record.type,
    version: record.version,
    category: record.category,
    signals,
    issues: record.issues,
  };
  if (
    options.includeStagedMissing
    || record.category === "staged-research"
    || record.category === "misclassified"
    || record.stagedMissingMarkers.length === 0
  ) {
    out.stagedMissingMarkers = record.stagedMissingMarkers;
  }
  if (options.includeEvidence) out.evidence = compactEvidence(record);
  return out;
}

function buildAudit() {
  const skipListNames = readSkipList();
  const allRecords = collectActiveSkillFiles()
    .map((relPath) => buildRecord(relPath, skipListNames))
    .map(classify);
  const inScope = allRecords.filter((record) => record.signals.inScope);

  const categoryCounts = Object.fromEntries(CATEGORY_ORDER.map((category) => [category, 0]));
  for (const record of inScope) categoryCounts[record.category] += 1;

  const skipListBundleViolations = allRecords
    .filter((record) => record.signals.inAlignmentSkipList && record.signals.hasAlignmentBundle)
    .map((record) => publicRecord(record, { includeEvidence: true }));
  const nonResearchResearchOutputs = inScope
    .filter((record) => record.type !== "research" && record.signals.mentionsResearchPath)
    .map((record) => publicRecord(record, { includeEvidence: true }));
  const alignmentSkipListCandidates = inScope
    .filter((record) => record.category === "direct-utility" && record.signals.hasAlignmentBehavior)
    .map((record) => publicRecord(record, { includeEvidence: true }));
  const markerCompliantSuspiciousResearch = inScope
    .filter((record) => {
      return record.type === "research"
        && record.signals.stagedMarkerCompliant
        && record.signals.semanticSuspicionReasons.length > 0;
    })
    .map((record) => publicRecord(record, { includeEvidence: true }));
  const stagedResearchMarkerIssues = inScope
    .filter((record) => record.category === "staged-research" && record.stagedMissingMarkers.length > 0)
    .map((record) => publicRecord(record, { includeEvidence: true }));
  const nonResearchGenericWorkingPacketMisuse = inScope
    .filter((record) => {
      return record.type !== "research"
        && record.signals.usesGenericWorkingPacket
        && record.category !== "staged-research";
    })
    .map((record) => publicRecord(record, { includeEvidence: true }));

  return {
    totals: {
      activeSkills: allRecords.length,
      inScopeSkills: inScope.length,
      typeResearchSkills: allRecords.filter((record) => record.type === "research").length,
      alignmentBehaviorSkills: allRecords.filter((record) => record.signals.hasAlignmentBehavior).length,
      alignmentBundleSkills: allRecords.filter((record) => record.signals.hasAlignmentBundle).length,
      nonResearchResearchPathSkills: nonResearchResearchOutputs.length,
      byCategory: categoryCounts,
    },
    categories: Object.fromEntries(
      CATEGORY_ORDER.map((category) => [
        category,
        inScope.filter((record) => record.category === category).map((record) => publicRecord(record)),
      ]),
    ),
    findings: {
      misclassified: inScope
        .filter((record) => record.category === "misclassified")
        .map((record) => publicRecord(record, { includeEvidence: true })),
      nonResearchResearchOutputs,
      alignmentSkipListCandidates,
      skipListBundleViolations,
      markerCompliantSuspiciousResearch,
      stagedResearchMarkerIssues,
      nonResearchGenericWorkingPacketMisuse,
    },
    skills: inScope.map((record) => publicRecord(record)),
  };
}

function mdEscape(text) {
  return String(text ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ")
    .trim();
}

function firstEvidence(record, key) {
  const lines = record.evidence?.[key] || [];
  if (lines.length === 0) return "";
  return `L${lines[0].line}: ${lines[0].text}`;
}

function tableRows(records, columns) {
  if (records.length === 0) return "_None._\n";
  const header = `| ${columns.map((column) => column.heading).join(" | ")} |`;
  const divider = `| ${columns.map(() => "---").join(" | ")} |`;
  const rows = records.map((record) => {
    return `| ${columns.map((column) => mdEscape(column.value(record))).join(" | ")} |`;
  });
  return `${[header, divider, ...rows].join("\n")}\n`;
}

function renderMarkdown(audit) {
  const lines = [];
  lines.push("# Research-ish Skill Lifecycle Audit");
  lines.push("");
  lines.push("Generated from active `base/**/SKILL.md` and `packs/**/SKILL.md` files, excluding `archive/**`.");
  lines.push("Command: `node scripts/researchish-skill-lifecycle-audit.mjs`.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("| --- | ---: |");
  lines.push(`| Active skills scanned | ${audit.totals.activeSkills} |`);
  lines.push(`| Research-ish in-scope skills | ${audit.totals.inScopeSkills} |`);
  lines.push(`| Active \`type: research\` skills | ${audit.totals.typeResearchSkills} |`);
  lines.push(`| Skills with alignment-page behavior | ${audit.totals.alignmentBehaviorSkills} |`);
  lines.push(`| Skills with bundled \`ALIGNMENT-PAGE.md\` | ${audit.totals.alignmentBundleSkills} |`);
  lines.push(`| Non-research skills mentioning \`research/\` paths | ${audit.totals.nonResearchResearchPathSkills} |`);
  lines.push("");
  lines.push("## Category Counts");
  lines.push("");
  lines.push("| Category | Count |");
  lines.push("| --- | ---: |");
  for (const category of CATEGORY_ORDER) {
    lines.push(`| \`${category}\` | ${audit.totals.byCategory[category]} |`);
  }
  lines.push("");

  lines.push("## Misclassified Skills");
  lines.push("");
  lines.push(tableRows(audit.findings.misclassified, [
    { heading: "Path", value: (record) => record.path },
    { heading: "Name", value: (record) => record.name },
    { heading: "Type", value: (record) => record.type },
    { heading: "Issue", value: (record) => record.issues.join("; ") },
  ]));

  lines.push("## Non-research Skills With `research/` Output Language");
  lines.push("");
  lines.push(tableRows(audit.findings.nonResearchResearchOutputs, [
    { heading: "Path", value: (record) => record.path },
    { heading: "Type", value: (record) => record.type },
    { heading: "Category", value: (record) => record.category },
    { heading: "First `research/` evidence", value: (record) => firstEvidence(record, "researchPathLines") },
  ]));

  lines.push("## Alignment Skip-list Candidates");
  lines.push("");
  lines.push("These direct-utility classifications still show alignment-page behavior and should either lose that behavior or be deliberately documented as exceptions.");
  lines.push("");
  lines.push(tableRows(audit.findings.alignmentSkipListCandidates, [
    { heading: "Path", value: (record) => record.path },
    { heading: "Type", value: (record) => record.type },
    { heading: "Skip-listed", value: (record) => (record.signals.inAlignmentSkipList ? "yes" : "no") },
    { heading: "Alignment evidence", value: (record) => firstEvidence(record, "alignmentLines") },
  ]));

  lines.push("## Skip-list Bundle Violations");
  lines.push("");
  lines.push("Skills listed in `scripts/alignment-skip-list.txt` should not have sibling `ALIGNMENT-PAGE.md` bundles.");
  lines.push("");
  lines.push(tableRows(audit.findings.skipListBundleViolations, [
    { heading: "Path", value: (record) => record.path },
    { heading: "Type", value: (record) => record.type },
    { heading: "Name", value: (record) => record.name },
  ]));

  lines.push("## Marker-compliant Research Skills Needing Semantic Review");
  lines.push("");
  lines.push(tableRows(audit.findings.markerCompliantSuspiciousResearch, [
    { heading: "Path", value: (record) => record.path },
    { heading: "Name", value: (record) => record.name },
    { heading: "Reasons", value: (record) => record.signals.semanticSuspicionReasons.join(", ") },
  ]));

  lines.push("## Staged-research Marker Issues");
  lines.push("");
  lines.push(tableRows(audit.findings.stagedResearchMarkerIssues, [
    { heading: "Path", value: (record) => record.path },
    { heading: "Type", value: (record) => record.type },
    { heading: "Missing markers", value: (record) => record.stagedMissingMarkers.join(", ") },
  ]));

  lines.push("## Non-research Generic Working-packet Misuse");
  lines.push("");
  lines.push(tableRows(audit.findings.nonResearchGenericWorkingPacketMisuse, [
    { heading: "Path", value: (record) => record.path },
    { heading: "Type", value: (record) => record.type },
    { heading: "Category", value: (record) => record.category },
    { heading: "Working evidence", value: (record) => firstEvidence(record, "workingPacketLines") },
  ]));

  lines.push("## In-scope Inventory");
  lines.push("");
  for (const category of CATEGORY_ORDER) {
    lines.push(`### ${category}`);
    lines.push("");
    lines.push(tableRows(audit.categories[category], [
      { heading: "Path", value: (record) => record.path },
      { heading: "Type", value: (record) => record.type },
      { heading: "Signals", value: (record) => {
        const signals = [];
        if (record.signals.typeResearch) signals.push("type:research");
        if (record.signals.hasAlignmentBehavior) signals.push("alignment");
        if (record.signals.mentionsResearchPath) signals.push("research/");
        if (record.signals.usesWorkingPacket) signals.push("_working");
        if (record.signals.hasStagedWorkflow) signals.push("staged");
        if (record.signals.directUtility) signals.push("utility");
        return signals.join(", ");
      } },
      { heading: "Issues", value: (record) => record.issues.join("; ") },
    ]));
  }

  return `${lines.join("\n")}\n`;
}

function renderJsonAudit(audit) {
  return {
    totals: audit.totals,
    categories: Object.fromEntries(
      Object.entries(audit.categories).map(([category, records]) => [
        category,
        records.map((record) => record.path),
      ]),
    ),
    findingCounts: Object.fromEntries(
      Object.entries(audit.findings).map(([finding, records]) => [finding, records.length]),
    ),
    findings: audit.findings,
    skills: audit.skills,
  };
}

const audit = buildAudit();

if (flags.has("--json")) {
  console.log(JSON.stringify(renderJsonAudit(audit)));
} else {
  process.stdout.write(renderMarkdown(audit));
}
