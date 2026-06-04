---
skill: skill-creator
agent: codex
captured_at: 2026-05-31T13:33:42-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Downstream Skill Inventory Surface

## Summary
Create a new mirrored `$skill-inventory` skill in the `project-fleet` pack for Codex and Claude. V1 is report-only: it inventories downstream repos, classifies local skill-copy drift against canonical `agentic-skills`, writes `tasks/skill-inventory.md` in the control repo, and never mutates downstream repos.

## Key Changes
- Add `packs/project-fleet/{codex,claude}/skill-inventory/` with:
  - `SKILL.md` frontmatter `version: v0.0`, invocation docs, report-only guardrails, and manifest-first workflow.
  - `CHANGELOG.md` with initial `v0.0` entry.
  - `ALIGNMENT-PAGE.md` using the current bundled alignment convention.
  - `agents/openai.yaml` at least for Codex metadata, matching existing project-fleet metadata style.
- Update `packs/project-fleet/PACK.md` so `skill-inventory` is listed as a project-fleet skill.
- Add a deterministic bundled scanner script, mirrored or shared by both skill dirs:
  - CLI: `skill-inventory.sh [--manifest <path>] [--repo <path>] [--out <path>|-] [--format markdown|json]`.
  - Default manifest search: `tasks/downstream-repos.md`, then `tasks/fleet-queue.md`, then `tasks/repo-seeding.md`.
  - Required local-path source: a `Local Path` or `Path` table column, plus optional explicit `--repo <path>` overrides.
  - If no local paths are found, print a manifest template and fail non-destructively.
  - For each repo, inspect `.claude/skills/*` and `.codex/skills/*`, source canonical `scripts/skill-links.sh`, and classify installs with existing `skill_install_status`: `ok`, `stale`, `unknown`, `missing-source`, `pinned`, `not-managed`.
  - Report repo-level totals, per-agent status rows, stale/unknown/missing-source action hints, and exact suggested fixes such as `scripts/pack.sh refresh`; do not run them.
- Skill runtime behavior:
  - Read repo instructions first.
  - Run the scanner and write `tasks/skill-inventory.md` by default.
  - Build an alignment page at `alignment/skill-inventory-{topic}.html` when producing the durable report.
  - Prompt-history capture remains required for skill invocation per repo policy.
  - End with next work and recommended command, but no cleanup/apply route in v1.

## Test Plan
- Add layer1 tests for the scanner using temp control/downstream repos:
  - managed copy current -> `ok`.
  - source hash changed -> `stale`.
  - marker without `source_sha` -> `unknown`.
  - marker source missing -> `missing-source`.
  - archive symlink -> `pinned`.
  - manifest missing paths -> non-mutating failure with template guidance.
- Add contract tests that both mirrored `SKILL.md` files:
  - declare `version: v0.0`;
  - say report-only/no refresh/no delete;
  - point to `tasks/skill-inventory.md`;
  - reference all status categories.
- Run validation:
  - focused layer1 tests;
  - `bash scripts/skill-versions.sh --missing`;
  - `bash scripts/skill-archive-audit.sh --strict`;
  - skills showcase generation/validation required for new skill metadata;
  - `git diff --check`.

## Assumptions
- Skill name is `skill-inventory`.
- V1 supports Codex and Claude.
- V1 writes a durable Markdown control-repo report and does not write JSON by default.
- V1 does not mutate downstream repos; apply/refresh/cleanup can be planned later after inventory reports prove the exact needed actions.
- Downstream repo discovery is manifest-first and requires local checkout paths; remote-only `owner/repo` rows are reported as not scannable until a local path is added.
