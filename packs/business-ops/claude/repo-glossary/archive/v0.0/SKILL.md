---
name: repo-glossary
description: Audit and reconcile the shared project glossary — find stale terms, missing definitions, conflicts, and gaps across research docs
type: analysis
version: v0.0
argument-hint: "[optional: focus area e.g. \"tooling\", \"business\", \"workflow\"]"
---

# Repo Glossary — Glossary Audit & Reconciliation

Scans all research documents, CLAUDE.md, and docs for domain-specific terminology, then audits the shared glossary at `research/glossary.md` for accuracy, conflicts, staleness, and missing terms. This is the look-back complement to the write-forward glossary convention: research skills add terms during their alignment flow, and this skill periodically reviews the full glossary for drift and gaps.

## Prerequisites

- **Hard**: At least 2 files must exist in `research/` (or `research/{slug}/`). If fewer exist, tell the user to run more research skills first and stop.
- **Soft**: `research/glossary.md` may or may not exist. If it does not exist, the skill runs in bootstrap mode — all discovered terms are treated as proposed additions.

## Process

### 0. Product-Path Scope Resolution

Resolve research scope by product path before using code or app structure as a hint:

1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as the product/app name, not the ICP, audience, or segment label.
2. If `$ARGUMENTS` names only `research/_archive/{slug}/` or a manifest entry with `status: archived` or legacy `status: abandoned`, stop and warn that the path is archived; do not write or update scoped outputs there.
3. Read `research/.progress.yaml` when present. Normalize legacy `active_path` to `active_paths` on read and write back `active_paths` on manifest updates. Treat legacy `abandoned` as `archived`; exclude `archived`, `abandoned`, `deferred`, `revisit_candidate`, `promoted`, and any `scope_path` under `research/_archive/` from active target selection.
4. If active product paths exist in the manifest, use those paths. If multiple active paths exist, ask which one to target unless this skill explicitly supports cross-path output.
5. If no active manifest target exists, list non-archived product directories under `research/`, excluding `research/_archive/` and dot directories. Auto-select only when exactly one exists; ask when multiple exist.
6. If no product directories exist, use flat `research/` single-product mode.
7. Detect monorepo/app/package structure only as a secondary hint. Suggest creating a missing `research/{slug}/` product path when code clearly exposes an app, but do not require code or monorepo detection before using `research/{slug}/`.

When product path `{slug}` is active, read and write research under `research/{slug}/`, specs under `specs/{slug}/`, and treat top-level `research/*.md` files as flat-mode documents or cross-path summaries.

### 1. Load Sources

Read every file in scope and extract terminology:

**Glossary file** (`research/glossary.md` or `research/{slug}/glossary.md`):
- Parse all existing entries from the Terms table (Term, Definition, Source, Category, Status)
- Parse Acronyms table
- Parse Recently Added table

**Research documents** (`research/*.md` or `research/{slug}/*.md`):
- Extract terms that appear with inline definitions, parenthetical expansions, or "i.e." / "a.k.a." markers
- Extract capitalized compound nouns or quoted terms used as domain jargon
- Extract acronyms used without expansion

**Convention and documentation files** (`CLAUDE.md`, `docs/*.md`, `packs/*/PACK.md`):
- Extract terms defined in glossary-like sections, definition lists, or tables
- Extract tool/workflow/concept names that carry project-specific meaning

Build a combined term index: `{ term, definition (if found), sources[], category (inferred) }`.

### 2. Surface & Interrogate

Cross-reference the combined term index against the existing glossary to classify every term into one of four groups:

**Existing terms** — present in glossary.md:
- Check whether the current definition still matches how the term is used across research docs
- Flag terms whose usage has drifted from the glossary definition
- Show source count and last-seen document

**Missing terms** — used in research docs but absent from glossary:
- Propose a definition based on context where the term appears
- Infer category (business / tooling / workflow / technical / domain)
- Rank by frequency and number of distinct source documents

**Conflicting terms** — same term defined or used differently across documents:
- List each conflicting definition with its source
- Ask user to select the canonical definition or provide a new one

**Stale terms** — present in glossary but no longer appear in any scanned document:
- Show the term, its glossary definition, and original source
- Ask whether to keep, update, or remove

If `$ARGUMENTS` specifies a focus area, filter findings to that category.

### 3. Present in Alignment Page

Build the alignment page with findings grouped by the four categories above. Each category is a gate section with inline approval questions:

**For missing terms**: per-term radio — Approve proposed definition / Edit definition / Reject / Needs clarification
**For existing terms**: per-term radio — Confirm accurate / Update definition / Remove / Needs clarification
**For conflicting terms**: per-term radio showing each conflicting definition — select canonical / Provide new / Needs clarification
**For stale terms**: per-term radio — Keep / Remove / Needs clarification

Include an evidence matrix mapping each proposed change to the source documents that support it.

### 4. Write Output

After final compiled YAML approval, apply approved changes to `research/glossary.md` (or `research/{slug}/glossary.md`):

- Add approved new terms to the Terms table with `status: confirmed`
- Update definitions for terms marked "Update definition"
- Remove terms marked "Remove"
- Resolve conflicts by writing the user-selected canonical definition
- Update the Acronyms table for any new acronym expansions
- Update the Recently Added table with terms added in this run
- Update the header metadata (last updated date, source count, term count)

If `research/glossary.md` does not exist, create it with the standard glossary format before writing entries.

**Standard glossary format:**

```markdown
# Glossary

> Last updated: YYYY-MM-DD | Sources: [count] docs | Terms: [count]

## Terms

| Term | Definition | Source | Category | Status |
|------|-----------|--------|----------|--------|

## Acronyms

| Acronym | Expansion | Source |
|---------|-----------|--------|

## Recently Added

| Term | Added | Source Skill | Approved In |
|------|-------|-------------|-------------|
```

### 5. Populate Next Steps

Include 3–5 applicable items with "Pick one:" framing:

- IF conflicting terms remain unresolved: `/repo-glossary` — Re-run to resolve remaining conflicts
- IF assumption-tracker exists and references undefined terms: `/assumption-tracker` — Update assumption register with clarified terminology
- IF research docs have many undefined terms: run more research skills to build context, then `/repo-glossary` again
- IF glossary is comprehensive: `/reconcile-research` — Check cross-document consistency now that terms are aligned
- ALWAYS: `/research-roadmap` — Check overall project status

## Report-First Approval Gate

Default to report-only: present findings in a pre-approval alignment page for user review before modifying `research/glossary.md`.

Do not write or overwrite the glossary until the user explicitly approves via final compiled YAML. When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and provide either feedback-only YAML or final compiled YAML.

## Staged Research Workflow

Use this staged workflow for glossary changes.

1. **Stage 1 — Scan and classify.** Perform the source scan (Section 1) and classification (Section 2). Write only a non-canonical working packet: flat mode uses `research/_working/preliminary-repo-glossary-research.md`; product-path mode uses `research/{slug}/_working/preliminary-repo-glossary-research.md`. Do not modify `research/glossary.md` in Stage 1.
2. **Stage 2 — Review alignment.** Consume the working packet and build the `review` HTML alignment page. The page must render all four term categories, evidence matrix, proposed changes, and approval gates. Stop for either feedback-only YAML or final compiled YAML. Feedback-only YAML revises the working packet and page, then remains in Stage 2.
3. **Stage 3 — Finalize approved changes.** Consume final compiled YAML only when it has no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback. Apply approved edits, archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`, remove the active working packet, write the approved glossary changes, and convert the alignment page to `confirmed`.

## Output

### `research/glossary.md` (or `research/{slug}/glossary.md`)

The shared project glossary in the standard format shown in Section 4.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Read-only on research docs.** Extract terms from existing research — do not modify source documents. Only `research/glossary.md` is writable.
- **Be specific.** "A thing" is not a term. "Pack — a collection of related skills installed together via pack.sh" is.
- **Trace to source.** Every term must reference the specific document it was extracted from.
- **Update, don't duplicate.** If `research/glossary.md` already exists, merge new findings with existing entries. When updating, preserve confirmation status and Recently Added history.
- **Present before writing.** Never write output files until findings have been presented and validated via the alignment page.
- **Respect write-forward.** Terms added by research skills during their alignment flow have `status: confirmed`. Do not downgrade confirmed terms to `proposed` during audit.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/repo-glossary-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
