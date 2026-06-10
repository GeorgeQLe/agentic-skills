# Preliminary Research — Skill Gaps & Manual Agent Asks (analyze-sessions)

Status: working packet (non-canonical, Stage 1)
Date: 2026-06-10
Scope: full Claude Code history (`~/.claude/history.jsonl`), full Codex compact history (`~/.codex/history.jsonl`), Codex rollout metadata (`~/.codex/sessions/**/*.jsonl`, 764 files)
Question: are there gaps in our skills, and what does the user still ask agents to do manually?

## 1. Overview Stats

| Metric | Claude | Codex | Total |
|---|---|---|---|
| User messages | 10,208 | 2,092 | 12,300 |
| Distinct sessions | 3,095 | 696 | 3,791 |
| Date range | 2025-12-13 → 2026-06-10 | 2026-01-09 → 2026-06-10 | — |

Top projects by message volume: metternich-engine 1,322 (10.7%), bismarck-ai v0.3/AWS 1,271 (10.3%), poke/monorepo 694 (5.6%), bismarck-ai v0.3/monorepo 694 (5.6%), bismarck-v0.4 670 (5.4%), **agentic-skills 621 (5.0%)**, web/dev/b4 423, poke-productivity-suite 370, loadoutworks (apps+web) 699 combined.

Monthly trend (messages): 2025-12: 663 (claude only) · 2026-01: 3,975 · 2026-02: 1,591 · 2026-03: 2,208 (claude only) · 2026-04: 2,495 (codex peak 1,359) · 2026-05: 961 · 2026-06 (partial): 407.

Freeform (non-command) prompts: 9,293 of 12,300 (75.6%). Short steering messages (≤30 chars — "y", "continue", "push it"): 2,747.

## 2. Token & Cost Check

- **Codex**: 757 of 764 rollout files have `token_count` events. Final cumulative session totals: **2,020,107,036 total tokens** — input 2,007,193,471 (of which cached input 1,889,405,696, ≈94%), output 12,913,565 (reasoning output 4,319,262 of that). Model attribution was not recoverable from `session_meta` payloads in this parse — model/provider breakdown is a coverage gap.
- **Claude**: `history.jsonl` carries no token usage metadata. Token coverage gap for the Claude source (transcript JSONL files were not parsed for usage in this run).
- **Cost: unavailable.** No cost fields in either log, no user-provided pricing table, and no provider pricing was verified during this run. Per skill constraints, no estimate is made.

## 3. Skill Command Usage (all-time, both sources)

/ship 857 · /clear 552 · /ship-end 266 · /resume 166 · /usage 162 · /sync 124 · /run 121 · /commit-and-push-by-feature 91 · /pack 69 · /plan-interview 58 · /ship-then-plan 31 · /workflow 28 · /investigate 21 · /exec 20 · /expert-review 16 · /session-triage 14 · /analyze-sessions 10 · long tail of business/research skills (icp, gtm, journey-map, positioning, monetization…).

Codex `$run` skill invocations dominate Codex usage (256+58+46 across skill-path variants), confirming Codex-side skill adoption is concentrated on run/ship/sync.

## 4. Closed Gaps — Manual Asks That Skills Already Eliminated

These were the largest manual-ask families in history, and the data shows them dying out as skills were adopted. This is evidence the skill system works.

| Manual ask family | Peak | Timeline (claude msgs) | Replaced by |
|---|---|---|---|
| "update docs, commit and push" / "commit this" / "push it" (~552 total) | Jan 2026 | Jan 274 → Feb 206 → Mar 72 → **Apr+ 0** | /ship (857), /ship-end (266), /commit-and-push-by-feature (91) |
| "implement phase N step N" / "phase N.N @docs/…plan.md" (~279 total) | Jan 2026 | Jan 137 → Feb 111 → Mar 31 → **Apr+ 0** | /ship-then-plan (31), /exec (20), exec-loop pack |
| "deploy to staging" (59) | Jan 2026 | Jan 40 → Feb 19 → **Mar+ 0** | release-ops/deploy skill now exists with deployment-history tracking; bismarck project also wound down |
| "create a directory to house our new package" (44) | Jan–Feb | **Apr+ ~0** | monorepo pack (scaffold, mono-*) |

Verified: the user's 2026-04 request "update the deploy skill so it maintains a historical record of what commits were part of what deployments" **was implemented** — `packs/release-ops/claude/deploy/SKILL.md` now declares deployment history tracking in its description and body.

## 5. Open Gaps — Recent Manual Asks (2026-04-01 → 2026-06-10)

Recent window: 3,863 messages, 1,892 freeform. Intent buckets with exact counts and real examples:

### 5.1 `.env` scaffolding & secrets handoff — 23 recent asks (69 all-time) — STRONGEST GAP
No env-related skill exists in any pack (verified by inventory scan). Examples:
- "can you create the .env.local with the necessary variable stubs and then open it in vscode so I can drop it in?"
- "can you open the .env.local in vscode? what do I need to add?"
- "ok done, remember don't look at .env.local"
- "no just tell me what's in .env.example. then I can add it back into .env.local. Do not edit or view the contents of .env.local"

The pattern has a stable shape: derive required variables (from .env.example or code), scaffold `.env.local` with stubs, open it in VS Code (WSL-aware), never read secret values back. The repeated "don't look at it" warnings show the manual flow also carries a recurring safety concern. **Recommendation: new skill** (working name `env-setup`), likely owner surface: gitops or repo-maintenance pack. Validation expectation: layer1 contract test asserting it never reads/echoes `.env.local` contents and produces the stub file.

### 5.2 False-positive verification of findings — 10 recent (15 all-time)
- "can you double check your findings for false positives?" (and 3 near-identical variants in April alone)

`expert-review` already has a built-in false-positive filter step (verified in SKILL.md), but these asks follow **ad-hoc** audits ("audit the codebase and hunt for any best practice reasons to reduce lines of code"), not skill runs. **Recommendation: standing instruction/convention** — any findings-producing response (skill or ad-hoc) ends with a self-verification pass before presenting; alternatively extend the quality-gate contract doc.

### 5.3 Findings → fix-plan handoff — 11 recent (17 all-time)
- "yes create a plan to fix them all" / "can you create a plan to fix these?" / "should we not make a plan to fix the significant drift?"

After any audit/review output, the user manually requests a fix plan. **Recommendation: standing instruction** extending the shipping-contract next-step routing: findings-producing skills and ad-hoc audits should offer a concrete "plan to fix" route (e.g. `/exec` or plan mode) in their handoff instead of waiting for the ask.

### 5.4 Research data freshness — explicit recurring correction (2026-05)
- "for the research skills, they should be attempting to get as recent data points as possible, I've had multiple instances of very stale data."

Only `pmf-engine` and `youtube-portfolio` carry recency language (verified by grep across packs). **Recommendation: standing convention** — a freshness contract for all research-producing skills (prefer current-year sources, date-stamp claims, flag stale evidence), authored once in docs and bundled like the alignment-page convention.

### 5.5 Document consistency validation — 5 recent (12 all-time)
- "can you go over and validate the document to ensure consistency and correctness across the document?" (×2, June)
- "ok is that language consistent across all docs? create a plan to audit the docs and determine if there is anything we need to update"

docs-health pack (`hygiene`, `reconcile-dev-docs`) covers this but is **not in this repo's `enabled_packs`** and likely not installed in the other projects where the asks occurred. **Recommendation: pack adoption** (`/pack install docs-health`) rather than a new skill.

### 5.6 Open-in-VS-Code ergonomics — 22 recent
Heavily overlaps with 5.1 (most are `.env` opens). Covered if `env-setup` includes the WSL-aware open step already documented in CLAUDE.md.

### 5.7 Codex-side observations
- 51 recent "I agree with your recommendations" messages are **Codex-only** — approval steering at recommendation gates. Inherent to the gate design, not a gap; but if it grates, a Codex-side compiled-answer flow (like alignment YAML) would compress it.
- 38 recent manual git-ops asks on Codex ("yes please and then commit it", "can you track and push the sync file") vs 16 on Claude — Codex skill adoption lags outside run/ship/sync.

### 5.8 Buckets reviewed and judged NOT skill gaps
- design/UI tweak feedback (45 recent, all Claude): iterative taste feedback on animations/layout — inherently conversational; animation-design-planner + verify/run already support it.
- video/recording/content (59 recent): guided-walkthrough + youtube-ops packs already own these flows; asks were in-flow direction, not repeated workflow shapes.
- research/investigate (102 recent): well covered by /investigate, debug pack, deep-research, autoresearch.
- "what's next/status" (22 recent): covered by codebase-status, afps-status, roadmap skills.

## 6. Ranked Recommendations

| # | Pattern | Recent freq | Type | Suggested name / action | Owner surface | Validation |
|---|---|---|---|---|---|---|
| 1 | .env scaffolding & secrets handoff | 23 (69 all-time) | **Skill** | `env-setup`: scaffold .env.local stubs from .env.example/code, WSL-aware VS Code open, never read secrets | gitops or repo-maintenance pack | layer1 contract test (no secret reads; stub file produced) |
| 2 | False-positive verify after ad-hoc audits | 10 | Standing instruction | findings-verification convention (self-verify pass before presenting findings) | CLAUDE.md / quality-gate contract doc | benchmark smoke on an audit prompt |
| 3 | Findings → fix-plan handoff | 11 | Standing instruction | extend shipping-contract routing: audits end with a plan-to-fix offer | CLAUDE.md shared conventions | skill-next-step-contracts doc check |
| 4 | Research data freshness | recurring correction | Standing convention | research freshness contract bundled into research skills | docs/ + upgrade script | spot-check bundled skill text |
| 5 | Doc consistency validation | 5 | Pack adoption | `/pack install docs-health` in affected projects | docs-health pack | existing pack tests |

## 7. Highest-Impact View (avoided manual prompts)

1. **Historical win (already shipped):** /ship + exec-loop eliminated ~830 manual commit/push/phase prompts — the single largest automation in the dataset.
2. **env-setup skill** — ~23 prompts/quarter avoided, plus removes a recurring secret-exposure risk surface.
3. **Findings-verification convention** — ~10/quarter avoided and improves audit quality everywhere at once.
4. **Fix-plan routing** — ~11/quarter avoided; pure convention change, zero new code.
5. **Research freshness contract** — prevents repeated stale-data corrections across all research skills.

## 8. Assumptions & Coverage Gaps

- Claude token usage and all dollar costs unavailable (no usage metadata in history.jsonl; no pricing basis). Token totals are Codex-only.
- Codex model attribution not recovered from session_meta; model-level breakdown not stated.
- Project attribution for Codex compact history relies on rollout `cwd` mapping (764 sessions mapped); unmapped sessions labeled "(unknown)".
- Recent-window intent buckets use first-match keyword classification; counts are exact for the patterns shown but buckets are not mutually exhaustive.
- "Closed gap" inferences assume the manual asks stopped because skills replaced them; for deploy-to-staging the project wind-down is a confounder (explicitly noted).

## 9. Proposed Glossary Additions (pending gate approval)

| Term | Definition | Source | Category |
|---|---|---|---|
| manual ask | A recurring typed user instruction that a skill could perform end-to-end (e.g. "commit this and push") | this report | workflow |
| steering prompt | A short (≤30 char) confirmation or direction message ("y", "continue", "push it") that drives an agent between skill steps | this report | workflow |
