import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT_DIR = resolve(import.meta.dirname, "../..");

function readRepoFile(relPath: string): string {
  return readFileSync(resolve(ROOT_DIR, relPath), "utf-8");
}

function expectAll(content: string, relPath: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    expect(
      content,
      `${relPath} should include ${pattern.toString()}`,
    ).toMatch(pattern);
  }
}

const mirroredLinkedInFoundationSkills = [
  "packs/creator-foundation/claude/creator-platform-capability-matrix/SKILL.md",
  "packs/creator-foundation/codex/creator-platform-capability-matrix/SKILL.md",
  "packs/creator-foundation/claude/creator-evidence-schema/SKILL.md",
  "packs/creator-foundation/codex/creator-evidence-schema/SKILL.md",
];

const mirroredPresenceDossierSkills = [
  "packs/creator-foundation/claude/creator-presence-dossier/SKILL.md",
  "packs/creator-foundation/codex/creator-presence-dossier/SKILL.md",
];

const linkedInDocs = [
  "packs/creator-foundation/PACK.md",
  "packs/creator-media/PACK.md",
  "README.md",
  "docs/skills-reference.md",
];

describe("LinkedIn creator-media lane contracts", () => {
  for (const relPath of mirroredLinkedInFoundationSkills) {
    it(`${relPath} defines the baseline, redaction gate, and forbidden access patterns`, () => {
      const content = readRepoFile(relPath);

      expectAll(content, relPath, [
        /LinkedIn (Baseline|Evidence Baseline)/,
        /owner exports?/,
        /manual snapshots?/,
        /public unauthenticated page captures?/,
        /user-provided files?/,
        /logged-in scraping/,
        /bot-protection bypass/,
        /paywall access/,
        /access-control circumvention/,
        /paid API dependency/,
        /private-data collection/,
        /private contacts/,
        /private messages/,
        /relationship data/,
        /sensitive account data/,
        /unrelated personal (information|data)/,
      ]);
    });
  }

  for (const relPath of mirroredPresenceDossierSkills) {
    it(`${relPath} routes LinkedIn evidence through public or redacted dossier synthesis`, () => {
      const content = readRepoFile(relPath);

      expectAll(content, relPath, [
        /LinkedIn Evidence Handling/,
        /Owner-provided LinkedIn exports/,
        /Public unauthenticated profile or company page captures/,
        /logged-in scraping/,
        /bot-protection bypass/,
        /paywall access/,
        /access-control circumvention/,
        /paid API dependency/,
        /private-data collection/,
        /private relationship graph extraction/,
        /`public`/,
        /`owner-provided`/,
        /`admin-provided`/,
        /`internal notes`/,
        /`mixed\/redaction needed`/,
        /redacted version/,
        /Never summarize private contacts/,
        /relationship data/,
        /Evidence Register/,
        /profile export/,
        /profile snapshot/,
        /post\/share/,
        /article\/newsletter/,
        /rich media/,
        /recommendation/,
        /skill/,
        /position/,
        /education/,
        /certification/,
        /company page/,
        /owner-provided analytics/,
        /admin-provided analytics/,
      ]);
    });
  }

  for (const relPath of linkedInDocs) {
    it(`${relPath} documents the LinkedIn matrix/schema/dossier workflow boundary`, () => {
      const content = readRepoFile(relPath);

      expectAll(content, relPath, [
        /LinkedIn-first evidence/,
        /creator-platform-capability-matrix -> creator-evidence-schema -> creator-presence-dossier/,
        /owner exports/,
        /manual snapshots/,
        /public unauthenticated captures/,
        /user-provided files/,
        /Paid APIs/,
        /logged-in scraping/,
        /bot-protection bypass/,
        /private-data collection/,
        /private relationship graph extraction/,
        /paywall access/,
        /access-control circumvention/,
        /owner-provided/,
        /admin-provided/,
        /authorized/,
      ]);
    });
  }
});
