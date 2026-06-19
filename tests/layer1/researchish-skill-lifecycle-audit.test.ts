import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const AUDIT_SCRIPT = "scripts/researchish-skill-lifecycle-audit.mjs";
const CATEGORY_NAMES = ["staged-research", "alignment-document", "direct-utility", "misclassified"];
const FINDING_NAMES = [
  "misclassified",
  "nonResearchResearchOutputs",
  "alignmentSkipListCandidates",
  "skipListBundleViolations",
  "markerCompliantSuspiciousResearch",
  "stagedResearchMarkerIssues",
  "nonResearchGenericWorkingPacketMisuse",
];

type AuditSkill = {
  path: string;
  type: string;
  category: string;
  stagedMissingMarkers?: string[];
  signals: {
    typeResearch: boolean;
    inAlignmentSkipList: boolean;
    hasAlignmentBundle: boolean;
    stagedMarkerCompliant: boolean;
    usesGenericWorkingPacket: boolean;
  };
};

type Audit = {
  totals: {
    activeSkills: number;
    inScopeSkills: number;
    typeResearchSkills: number;
    nonResearchResearchPathSkills: number;
    byCategory: Record<string, number>;
  };
  categories: Record<string, string[]>;
  findingCounts: Record<string, number>;
  findings: Record<string, unknown[]>;
  skills: AuditSkill[];
};

function runAudit(): Audit {
  const output = execFileSync(process.execPath, [AUDIT_SCRIPT, "--json"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  return JSON.parse(output) as Audit;
}

describe("research-ish skill lifecycle audit", () => {
  const audit = runAudit();

  it("emits stable counts and finding categories", () => {
    // Bounded/invariant assertions instead of exact snapshot pins, so routine
    // skill additions and type reclassifications do not redden layer1.
    expect(audit.totals.activeSkills).toBeGreaterThan(300);
    expect(audit.totals.inScopeSkills).toBeGreaterThan(250);
    expect(audit.totals.inScopeSkills).toBeLessThanOrEqual(audit.totals.activeSkills);
    expect(audit.totals.typeResearchSkills).toBeGreaterThan(100);
    expect(audit.totals.nonResearchResearchPathSkills).toBeGreaterThanOrEqual(0);

    const categoryTotal = Object.values(audit.totals.byCategory).reduce((sum, count) => sum + count, 0);
    expect(categoryTotal).toBe(audit.totals.inScopeSkills);
    expect(audit.totals.byCategory["staged-research"]).toBe(audit.totals.typeResearchSkills);
    expect(audit.totals.byCategory.misclassified).toBe(0);
    expect(audit.totals.byCategory["alignment-document"]).toBeGreaterThan(0);
    expect(audit.totals.byCategory["direct-utility"]).toBeGreaterThan(0);

    expect(Object.keys(audit.categories).sort()).toEqual([...CATEGORY_NAMES].sort());
    expect(Object.keys(audit.findingCounts).sort()).toEqual([...FINDING_NAMES].sort());
    expect(Object.keys(audit.findings).sort()).toEqual([...FINDING_NAMES].sort());
    expect(audit.skills).toHaveLength(audit.totals.inScopeSkills);
  });

  it("keeps active type: research skills in the staged-research lifecycle", () => {
    const typeResearchSkills = audit.skills.filter((skill) => skill.type === "research");

    expect(typeResearchSkills).toHaveLength(audit.totals.typeResearchSkills);
    for (const skill of typeResearchSkills) {
      expect(skill.category, skill.path).toBe("staged-research");
      expect(skill.signals.typeResearch, skill.path).toBe(true);
      expect(skill.signals.stagedMarkerCompliant, skill.path).toBe(true);
      expect(skill.stagedMissingMarkers ?? [], skill.path).toEqual([]);
    }
    expect(audit.findingCounts.stagedResearchMarkerIssues).toBe(0);
  });

  it("keeps alignment skip-list skills free of bundled alignment pages", () => {
    expect(audit.findingCounts.skipListBundleViolations).toBe(0);

    const skipListedWithBundles = audit.skills.filter((skill) => {
      return skill.signals.inAlignmentSkipList && skill.signals.hasAlignmentBundle;
    });
    expect(skipListedWithBundles.map((skill) => skill.path)).toEqual([]);
  });

  it("prevents non-research skills from using generic staged working packets", () => {
    expect(audit.findingCounts.misclassified).toBe(0);
    expect(audit.findingCounts.nonResearchGenericWorkingPacketMisuse).toBe(0);

    const nonResearchGenericWorkingPackets = audit.skills.filter((skill) => {
      return skill.type !== "research"
        && skill.signals.usesGenericWorkingPacket
        && skill.category !== "staged-research";
    });
    expect(nonResearchGenericWorkingPackets.map((skill) => skill.path)).toEqual([]);
  });
});
