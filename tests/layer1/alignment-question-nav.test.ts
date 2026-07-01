import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const SCRIPT = resolve(ROOT, "scripts/alignment-question-nav.js");

describe("alignment-question-nav script", () => {
  it("exists as a source-checkout asset", () => {
    expect(existsSync(SCRIPT)).toBe(true);
  });

  const source = existsSync(SCRIPT) ? readFileSync(SCRIPT, "utf8") : "";

  it("stays a classic script: no statement-form import/export (file:// safety)", () => {
    // Module scripts are blocked by CORS on file:// URLs; the script must stay
    // loadable via a plain <script src> tag, exactly like the TTS include.
    expect(source).not.toMatch(/^\s*import\s/m);
    expect(source).not.toMatch(/^\s*export\s/m);
  });

  it("guards against double-init", () => {
    expect(source).toContain("__alignmentQuestionNavInit");
  });

  it("is navigation-only: no compile/copy/clipboard semantics", () => {
    // The pager must not carry answer/compile semantics, so it stays exempt
    // from the sticky-controls prohibition even when rendered inline.
    expect(source).not.toMatch(/clipboard/i);
    expect(source).not.toContain("Compile Responses");
  });

  it("discovers answerable blocks and the compile section", () => {
    expect(source).toContain("data-open-question");
    expect(source).toContain("data-question-block");
    expect(source).toContain("data-answer-sidecar");
  });

  it("keeps a live unanswered count with input/change listeners", () => {
    expect(source).toContain("unansweredIndices");
    expect(source).toContain("All answered");
    expect(source).toMatch(/addEventListener\(['"]input['"]/);
    expect(source).toMatch(/addEventListener\(['"]change['"]/);
  });
});
