# Active Phase: Benchmark Test Skill Rename

**Project:** Claude Skills / agentic-skills
**Status:** Targeted skill update in progress on 2026-05-10.

## Current Plan

- [x] Read the relevant lesson and current `agentic-skills-bench` pack files.
- [x] Replace the old benchmark command with the clearer `benchmark-test-skill` skill for Claude and Codex.
- [x] Add `packs/agentic-skills-bench/PACK.md` and update discovery docs.
- [x] Remove the old benchmark command's skill files and references.
- [x] Regenerate Skills Showcase data for the skill and pack metadata change.
- [x] Run skill metadata, dependency, next-step routing, showcase freshness, targeted search, and whitespace validation.
- [ ] Commit and push the intended rename.

## Current Benchmark: design-system

- [x] Read the `benchmark-test-skill` contract and confirmed `design-system` is the skill under test.
- [x] Ran `pnpm verify --skill design-system`.
- [x] Ran `pnpm bench --skill design-system --runs 3 --chunk-size 3 --pause 0`.
- [x] Wrote `benchmark/test-design-system-2026-05-10.md`.
- [ ] Commit and push the benchmark report.

## Review

**Strategy Used:** Targeted skill-builder update after session-triage verified that the existing behavior was right but the old command name was ambiguous.

**Files Changed:** Added `benchmark-test-skill` under `packs/agentic-skills-bench/{claude,codex}/`, added `packs/agentic-skills-bench/PACK.md`, removed the old benchmark command, updated pack/reference docs and lessons/history, and refreshed generated showcase data.

**Behavior:** `$benchmark-test-skill <skill>` and `/benchmark-test-skill <skill>` now explicitly benchmark-test one repository skill via `pnpm verify --skill <SKILL>` followed by `pnpm bench --skill <SKILL> --runs 3 --chunk-size 3 --pause 0`. The contract says the trailing argument is the skill under test and not a mode for that skill.

**Validation:** `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `scripts/validate-skills-showcase-data.sh`, targeted `rg` checks for old and new command names, and `git diff --cached --check` passed. `github-proof-data.js` uses the generator's documented public-metadata fallback in this environment.

## Benchmark Review: design-system

**Strategy Used:** `benchmark-test-skill` harness run for the `design-system` skill only.

**Validation:** `pnpm verify --skill design-system` passed: layer1 PASS in 7.5s with 1,184 tests, and layer2 PASS in 167.1s with both `design-system` behavior tests passing.

**Benchmark Result:** `pnpm bench --skill design-system --runs 3 --chunk-size 3 --pause 0` completed session `design-system-534194ed`. Pass rate was 66.7% with Wilson 95% CI 20.8% - 93.9%, p50 latency 91.0s, p95 latency 225.0s, p99 latency 236.9s, mean pairwise similarity 0.843, 0 outliers, and total estimated cost $3.00.

**Failure:** Run 2 failed the `Interview log created` assertion. All other assertions passed in all runs.

## Completed Phase

Phase 34 - Skills Showcase Distribution Launch is archived at `tasks/phases/phase-34.md`.

## Launch Follow-Ups

Manual launch tasks remain in `tasks/manual-todo.md`:

- Choose and configure the static newsletter/email provider endpoint on `/follow/`, then re-run local validation.
- Configure the Vercel project for `docs/skills-showcase/` and verify deployed static route reloads after final local validation.

## Validation Snapshot

- `scripts/validate-skills-showcase-data.sh` passed after refreshing generated proof data.
- `node --check docs/skills-showcase/app.js` passed.
- Static route files exist for `/`, `/workflows/`, `/packs/`, `/catalog/`, `/inspect/`, and `/follow/`.
- One local HTTP HEAD check for `/` returned `HTTP/1.0 200 OK`; repeated temporary-server curl checks were unreliable in the sandbox.
- Targeted scans confirmed LexCorp, YouTube, X/Twitter, Discord, GitHub, newsletter states, proof boundaries, accessibility hooks, and reduced-motion handling.
- `git diff --check` passed.

## Next Work

Discover the next candidate project phase, or explicitly park the project after manual launch tasks are handled.

**Recommended next command:** `$brainstorm`

## Current Hotfix: Skills Showcase Hero Overlap

**Status:** Fixed on 2026-05-08.

**Plan**

- [x] Validate the reported homepage hero text/diagram collision against the current static site.
- [x] Trace the responsible hero HTML/CSS and recent git history.
- [x] Apply the smallest responsive layout fix that preserves the blueprint design.
- [x] Verify static syntax, generated data freshness, whitespace, and desktop/mobile visual layout.
- [x] Record investigation results and ship the tracked changes.

## Review

**Strategy Used:** UI investigation. No pivot required.

**User Claims Validated:** Confirmed. The homepage hero placed large headline text in a 5-column grid track while the right-side blueprint occupied 7 columns, and the layout did not stack until `900px`.

**Root Cause:** `docs/skills-showcase/styles.css` used an asymmetric desktop hero grid (`.hero-copy` span 5, `.hero-visual` span 7) with `h1` scaling up to `9vw`, so mid-size desktop/tablet widths could let the headline overflow into the blueprint area. The relevant layout was introduced with the initial showcase shell commit `bac0b1e`.

**Fix Applied:** Adjusted the hero to a balanced 6/6 desktop grid, added `min-width: 0` to both hero grid items, reduced the desktop headline clamp, moved the single-column hero breakpoint to `1080px`, and tightened stacked/mobile headline and blueprint wrapping so the diagram drops below the text before crowding it.

**Prevention:** Browser visual checks at desktop, tablet, and mobile widths should be part of showcase UI validation whenever hero copy or blueprint layout changes.
