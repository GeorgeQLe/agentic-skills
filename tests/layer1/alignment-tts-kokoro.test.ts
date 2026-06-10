import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const SCRIPT = resolve(ROOT, "scripts/alignment-tts-kokoro.js");
const source = readFileSync(SCRIPT, "utf8");

describe("alignment-tts-kokoro script", () => {
  it("stays a classic script: no statement-form import/export (file:// safety)", () => {
    // Module scripts are blocked by CORS on file:// URLs; the script must stay
    // loadable via a plain <script src> tag. Dynamic import( is allowed.
    expect(source).not.toMatch(/^\s*import\s/m);
    expect(source).not.toMatch(/^\s*export\s/m);
  });

  it("keeps the warm-start contract referenced by the regenerated docs", () => {
    // The 'tts-kokoro-used' flag name appears in ~270 ALIGNMENT-PAGE.md files;
    // renaming it requires a doc fan-out via upgrade-alignment-page.mjs.
    expect(source).toContain("'tts-kokoro-used'");
    expect(source).toContain("requestIdleCallback");
  });

  it("pipelines synthesis with a short first chunk", () => {
    expect(source).toContain("FIRST_CHUNK_LEN");
    expect(source).toContain("chunkText(text, 1000, FIRST_CHUNK_LEN)");
    expect(source).toContain("startGen(");
  });

  it("shares a single in-flight load promise", () => {
    expect(source).toContain("ttsLoadPromise");
    expect(source).not.toContain("loadingTTS");
  });

  it("explains Cache API unavailability on file:// origins", () => {
    expect(source).toContain("Cache API");
  });
});
