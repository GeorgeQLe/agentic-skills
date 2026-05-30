import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoPath = (path: string) => resolve(TESTS_ROOT, "..", path);
const read = (path: string) => readFileSync(repoPath(path), "utf8");

describe("prompt-history-backfill skill contract", () => {
  const contracts = [
    {
      path: "packs/session-analytics/claude/prompt-history-backfill/SKILL.md",
      command: "/prompt-history-backfill",
    },
    {
      path: "packs/session-analytics/codex/prompt-history-backfill/SKILL.md",
      command: "$prompt-history-backfill",
    },
  ];

  it("adds mirrored v0.0 skill contracts", () => {
    for (const contract of contracts) {
      expect(existsSync(repoPath(contract.path)), `${contract.path} exists`).toBe(true);
      const content = read(contract.path);

      expect(content, `${contract.path} name`).toContain("name: prompt-history-backfill");
      expect(content, `${contract.path} version`).toMatch(/^version: v0\.0$/m);
      expect(content, `${contract.path} command`).toContain(`Invoke as \`${contract.command}\`.`);
      expect(content, `${contract.path} argument hint`).toContain("--repo <path>");
      expect(content, `${contract.path} apply flag`).toContain("--apply");
    }
  });

  it("defaults to report-only and requires explicit apply before prompt writes", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} default report-only`).toContain(
        "Default mode is report-only.",
      );
      expect(content, `${contract.path} apply required`).toContain(
        "Do not create, modify, or remove prompt files unless the visible invocation includes explicit `--apply`.",
      );
      expect(content, `${contract.path} no report-only prompt writes`).toContain(
        "In report-only mode, prompt backfill candidates are reviewed but no files under `prompts/<skill-slug>/` are created.",
      );
      expect(content, `${contract.path} report artifact`).toContain(
        "In report-only mode, write a review artifact at `alignment/prompt-history-backfill-{topic}.html`",
      );
    }
  });

  it("reads Claude and Codex history sources plus optional exports", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} claude history`).toContain("`~/.claude/history.jsonl`");
      expect(content, `${contract.path} codex compact history`).toContain("`~/.codex/history.jsonl`");
      expect(content, `${contract.path} codex rich sessions`).toContain("`~/.codex/sessions/**/*.jsonl`");
      expect(content, `${contract.path} optional paths`).toContain(
        "Optional user-provided history files, exported logs, or session directories.",
      );
      expect(content, `${contract.path} date filters`).toContain("--since YYYY-MM-DD");
      expect(content, `${contract.path} date filters`).toContain("--until YYYY-MM-DD");
      expect(content, `${contract.path} missing source handling`).toContain(
        "If a source is missing or unreadable, report it and continue with available sources.",
      );
    }
  });

  it("classifies candidates and excludes low confidence from writes", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} high confidence`).toContain(
        "High confidence: the visible user prompt begins with or clearly invokes `/skill-name`, `$skill-name`, or `You have the <skill> skill installed`.",
      );
      expect(content, `${contract.path} medium confidence`).toContain(
        "Medium confidence: the visible user prompt names a known skill and asks the agent to use it",
      );
      expect(content, `${contract.path} low confidence report only`).toContain(
        "Low confidence: the prompt only loosely mentions a skill or workflow. Include it in the report, but never write it even when `--apply` is present.",
      );
      expect(content, `${contract.path} constraint`).toContain("Never write low-confidence candidates.");
    }
  });

  it("writes only under prompts/<skill-slug> with required frontmatter", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} path constraint`).toContain(
        "In `--apply` mode, create missing prompt files only under `prompts/<skill-slug>/`.",
      );
      expect(content, `${contract.path} never outside path`).toContain(
        "Never write prompt files outside `prompts/<skill-slug>/`.",
      );
      expect(content, `${contract.path} frontmatter fields`).toContain(
        "Use this YAML frontmatter exactly for every backfilled prompt file: `skill`, `agent`, `captured_at`, `source`, and `prompt_scope: visible-user-invocation`.",
      );
      expect(content, `${contract.path} source field`).toContain("source: user-invocation");
      expect(content, `${contract.path} filename pattern`).toContain(
        "skill-prompt-YYYYMMDD-HHMMSS-<short-topic>",
      );
    }
  });

  it("preserves exact visible prompts and excludes hidden context", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} exact visible prompt`).toContain(
        "Preserve the exact visible user prompt content after frontmatter without summarizing, redacting, or truncating.",
      );
      expect(content, `${contract.path} no truncation constraint`).toContain(
        "Do not summarize, redact, or truncate the visible prompt body in backfilled prompt files.",
      );
      expect(content, `${contract.path} visible only`).toContain(
        "Normalize records into visible user prompt candidates only",
      );
      expect(content, `${contract.path} hidden exclusions`).toContain(
        "Exclude hidden system instructions, hidden developer instructions, base prompts, tool output, tool arguments, assistant messages, unavailable model context, and generated summaries.",
      );
      expect(content, `${contract.path} final hidden constraint`).toContain(
        "Do not include hidden system/developer instructions, tool output, assistant messages, or unavailable model context in prompt files.",
      );
    }
  });

  it("blocks likely secrets instead of writing them", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} secret scan before write`).toContain(
        "Before any `--apply` write, scan candidate prompt text for likely secrets",
      );
      expect(content, `${contract.path} secret examples`).toContain(
        "API keys, bearer tokens, private keys, cookie/session tokens, password assignments, credential-bearing URLs, database URLs, and common provider token prefixes",
      );
      expect(content, `${contract.path} secret block`).toContain(
        "If a candidate contains a likely secret, do not write it. Mark it as blocked in the report and ask the user for a sanitized prompt.",
      );
      expect(content, `${contract.path} secret constraint`).toContain(
        "Never write likely-secret candidates.",
      );
    }
  });

  it("is listed in pack metadata and Codex UI metadata", () => {
    const pack = read("packs/session-analytics/PACK.md");
    expect(pack).toContain("`prompt-history-backfill`");
    expect(pack).toContain("prompts/<skill-slug>/");

    const openai = read("packs/session-analytics/codex/prompt-history-backfill/agents/openai.yaml");
    expect(openai).toContain('display_name: "Prompt History Backfill"');
    expect(openai).toContain('short_description: "Audit and backfill missing skill prompt logs"');
    expect(openai).toContain("Use $prompt-history-backfill");
    expect(openai).toContain("allow_implicit_invocation: true");
  });
});
