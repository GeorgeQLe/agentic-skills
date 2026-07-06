---
name: delegate
description: Live in-session delegation from Claude to Codex via the approval/delegation packet contract
type: shipping
version: v0.2
required_conventions: [alignment-page, briefing-slides]
argument-hint: "[target-skill] [--allow-dirty <glob>] [--inline-fallback]"
---

# Delegate

Delegate the next step's execution to Codex **live, inside the current Claude session**. Produces an `approved` packet via the shared contract (same helpers `/handoff --target=codex` uses), then invokes Codex synchronously with `codex exec "<target-skill> --execute-approved"`. Claude stays the orchestrator; Codex executes; Claude resumes once Codex returns.

Unlike `/handoff --target=codex` (async — user resumes later), `/delegate` is live cross-CLI transport. The target skill defaults to `$exec`; other executor skills (e.g. `$ship`) may be named but `$exec` is the primary use case.

## Mode requirement

`/delegate` is **`hybrid`-only by design**. `claude-only` has no executor to delegate to; `codex-only` plans in Codex directly. In either non-hybrid mode, the skill exits non-zero with a `mode-mismatch:` reason and touches no packet state.

## Transport dependency

`/delegate` requires the `codex` binary on `PATH`. If missing (or auth-failed, or the start marker never prints), the skill falls cleanly into the **pre-start-failure** branch of the fallback matrix — it does not crash, and the packet stays at `approved`.

## Process

1. **Resolve agent mode** via `./scripts/agent-mode.sh`. If the effective mode is anything other than `hybrid`, exit non-zero with a `mode-mismatch:` message naming the resolved mode. Do not touch the packet.

2. **Parse arguments** from `$ARGUMENTS`:
   - First positional token (if any) is the target skill; defaults to `$exec`.
   - Collect repeatable `--allow-dirty <glob>` flags (shell-glob semantics, same as `scripts/approved-plan.sh check`). Note: back-to-back hybrid cycles rewrite the `tasks/approved-plan.md` mirror on each `consume`; commit it between cycles, or pass `--allow-dirty tasks/approved-plan.md` so the next `draft` tolerates the uncommitted mirror.
   - `--inline-fallback` auto-selects inline Claude execution in the pre-start-failure branch without prompting.

3. **Derive `phase` / `step` / `title` from `tasks/todo.md`**, using the same rules as `/handoff --target=codex`:
   - First unchecked `- [ ]` under the `### Active Step Plan` block.
   - Fallback: first unchecked `- [ ]` under the current `## Phase N` header.
   - Parse `Phase N` and `Step N.X` tokens from the surrounding context; the checkbox text (stripped of `- [ ] **Step N.X** — `) becomes `title`.

4. **Produce the approval packet**:
   1. `./scripts/approved-plan.sh draft --phase "Phase N" --step "Step N.X" --title "<title>"` plus any `--allow-dirty <glob>` flags. Surface the helper's single-line failure reason verbatim if it fails.
   2. Pretty-print the drafted packet (`jq . .agents/approved-plan.json`).
   3. Ask exactly one concise question: *"Approve this packet for Codex execution via /delegate?"*
   4. On yes → `./scripts/approved-plan.sh approve`. On no → leave at `draft` and stop; the user can approve later or discard with `./scripts/approved-plan.sh supersede`.

5. **Invoke Codex synchronously**:
   - Record a start-marker timestamp (ISO-8601 UTC) before the exec call so the fallback matrix can classify outcomes.
   - Shell out to `codex exec "<target-skill> --execute-approved"`. Capture stdout, stderr, and the exit code.
   - The Step 4 consumer (`$exec --execute-approved`) is what actually runs `scripts/approved-plan.sh check && consume` inside Codex. `/delegate` is transport only.

6. **Classify via the safe-fallback matrix — never blind-retry**:

   - **Pre-start failure** — `codex` binary not found, auth failure, or the start marker was never printed by Codex before exit:
     - Packet stays at `approved` (no writer ran).
     - Offer two options: (a) run inline in Claude (same session, no CLI boundary), or (b) keep the packet `approved` for later manual `$exec --execute-approved` in Codex.
     - If `--inline-fallback` was passed, auto-select (a) without prompting.
     - Under an `agent-team` execution profile, inline fallback is a **downgrade** requiring explicit interactive confirmation unless `--inline-fallback` is already on the command line.

   - **Success** — Codex exited 0, printed `Approved packet consumed: …`, and `tasks/approved-plan.md` reports `lifecycle: consumed`:
     - Step 4's `consume` already flipped `approved → consumed`.
     - Read `tasks/approved-plan.md` to confirm `lifecycle: consumed`. If confirmed, report success and hand back to the user.
     - If the mirror does not report `consumed`, treat as the ambiguous case below.

   - **Ambiguous** — non-zero exit, timeout, or crash after the start marker printed (Codex may have started mutating state):
     - Call `./scripts/approved-plan.sh mark-uncertain`. The packet lifecycle becomes `uncertain`.
     - Prompt the user with three explicit options: *inspect repo state manually / discard the packet via `./scripts/approved-plan.sh supersede` / continue inline in Claude from the current repo state*.
     - **Never blind-retry `codex exec` on the same packet.** Re-executing against a packet whose consumer may have partially mutated state risks double-execution.

7. **Report** the classified outcome, the final lifecycle, and whatever the user chose from the fallback prompt.

## Constraints

- **Hybrid-only.** Non-hybrid modes exit with `mode-mismatch:` before any packet operation.
- **Never blind-retry cross-CLI.** The invariant. Ambiguous failures always go through `mark-uncertain` + explicit user prompt.
- **Contract is frozen.** Do not edit `docs/operating-modes.md`, `specs/approved-plan.schema.json`, or add new lifecycle states / freshness checks. `uncertain` is already in the schema enum; Step 6 is just its first writer.
- **`mark-uncertain` is only valid from `approved`.** The helper rejects `draft`, `consumed`, `stale`, `superseded`, and `uncertain` source states.
- **`codex` binary is a transport dependency.** Fall cleanly into pre-start-failure if missing; do not crash.


## Briefing Slides Review Surface

Follow the shared briefing-slides convention via the packaged convention resolver. When this skill creates or amends a dense review artifact, keep building and updating the dense `alignment/*.html` and/or `interrogation/*.html` pages exactly as this skill already requires. Also build or update `briefing-slides/delegate-{topic}.html` as the primary human review UI.

Treat the briefing slide deck as the artifact to open for review. Link the dense pages, source documents, and any other context artifacts from slide reference chips or other clickable slide elements so reviewers can drill into detail without losing the slide-first review flow.

The compiled deck YAML must route back to `/delegate`. Include the dense review pages and source artifacts in `reference_pages` / `source_artifacts`, preserve unanswered gates and slide feedback, and only mark the deck ready when the slide gates are approved.

After artifact creation or amendment, attempt to open only the briefing slide deck. Do not auto-open the linked dense pages.
## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/delegate-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
