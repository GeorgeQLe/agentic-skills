---
name: spec-drift
description: Audit specs against codebase — find unimplemented features, diverged implementations, and undocumented code
type: analysis
version: 1.0.0
argument-hint: [audit|fix] [spec-file|all]
---

# Spec Drift — Spec-to-Code Conformance Audit

Checks that specs and codebase tell the same story. Extracts verifiable claims from spec documents, checks each against the actual implementation, and flags divergence. Think of it as a linter for spec-to-code fidelity — complementary to `/research-reconcile` (doc-to-doc) and `/expert-review` (broad code review).

## Prerequisites

At least one spec file must exist in `specs/` (or `specs/{app}/`, `docs/specifications/`). If no specs exist, display a message and exit — there's nothing to audit.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, detect the app structure:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `specs/`, use it.
2. If `specs/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, check `docs/specifications/` as an alternative spec location.
4. If no subdirectories exist in any location, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read specs from `specs/{app}/` instead of `specs/`
- Also check `docs/specifications/` for additional spec documents

### 1. Determine Mode and Scope

Parse `$ARGUMENTS`:

- **Mode**: `audit` (default, read-only) or `fix` (update specs or flag code issues, write drift report)
- **Scope**: specific spec file path, or `all` (default — scan all specs)

### 2. Inventory Specs

Scan `specs/` (or `specs/{app}/`, `docs/specifications/`) for `.md` files. Skip non-spec files (README, index, changelog, mvp-gap, scale-audit, and files matching `*-interview.md`).

For each spec, record:
- File path
- Last-modified timestamp (via `stat`)
- Title (first `#` heading)

**Stop condition**: If no spec files are found, display a message suggesting `/plan-interview` and exit.

### 3. Extract Claims Per Spec

Launch a **subagent per spec** to extract verifiable claims. Each subagent reads one spec and returns structured claims:

| Claim type | What to look for | How to verify |
|------------|-----------------|---------------|
| **Routes/endpoints** | API paths, HTTP methods, request/response shapes | Grep routes, check handlers |
| **Data models/schema** | Field names, types, relations, constraints | Read schema files, model definitions |
| **Feature behaviors** | "When X happens, Y occurs", business logic rules | Read implementation, check conditionals |
| **Config/env vars** | Named config values, feature flags, env vars | Grep for usage |
| **UI flows** | Screen names, navigation paths, component structure | Check components/pages |
| **Commands/CLI** | Command names, arguments, behavior | Check command handlers |
| **Pricing/limits** | Tier names, limits, gates | Check config, middleware, constants |
| **Integration points** | External service calls, webhooks, events | Grep for client calls |

Each claim includes:
- **Source spec**: file path
- **Section heading**: the `##`/`###` heading the claim appears under
- **Direct quote**: the exact text making the claim
- **Claim type**: one of the types above

### 4. Verify Claims Against Codebase

Launch **subagents per claim group** (grouped by claim type or by spec, whichever produces fewer groups) to verify each claim against the codebase:

For each claim:
1. Search the codebase for evidence (grep, glob, read relevant files)
2. Classify the claim:

| Status | Meaning | Evidence required |
|--------|---------|-------------------|
| **Verified** | Code matches spec | File:line where behavior is implemented |
| **Diverged** | Code exists but behaves differently than spec says | Spec quote + code quote showing the difference |
| **Unimplemented** | Spec describes it but code doesn't have it | Search terms used + confirmation of absence |
| **Removed** | Spec describes it but evidence suggests intentional removal | Git log showing removal, or TODO/deprecated markers |

For **Diverged** and **Unimplemented** findings, include the specific file:line references (or search terms used) as evidence.

### 5. Detect Undocumented Code

Scan for significant code patterns not covered by any spec claim:

- Routes/endpoints with no spec coverage
- Data models not mentioned in specs
- Feature flags/config not documented
- Public API endpoints without spec descriptions

This is a **lighter scan** — only flag things that look like they *should* have spec coverage (public API, user-facing features, documented config). Do not flag internal utilities, helper functions, or infrastructure code.

### 6. Classify and Report Findings

Group all findings by severity:

| Severity | Meaning | Example |
|----------|---------|---------|
| **Error** | Spec actively contradicts code behavior | Spec says "free tier: 10 projects" but code enforces limit of 5 |
| **Warning** | Drift — spec may be stale or incomplete | Spec describes 3 API endpoints but code has 5 |
| **Info** | Undocumented code that probably should have spec coverage | New route `/api/v2/export` exists with no spec |

Classification rules:
- **Diverged** claims → Error (spec and code disagree on behavior)
- **Unimplemented** claims → Warning (spec describes something code doesn't have yet)
- **Removed** claims → Warning (spec describes something that was intentionally removed)
- **Undocumented code** → Info (code exists without spec coverage)
- If uncertain whether something is a real divergence, classify as Info, not Error.

### 7. Fix Mode (if `fix` was specified)

If mode is `fix`:

1. **Present all Errors** to the user. For each Error, show the spec claim and code reality side-by-side with direct quotes. Ask: **is the code right or the spec right?**
   - **Code is right** → update the spec section to match the implementation
   - **Spec is right** → add item to `tasks/todo.md` as an implementation bug with the spec reference
2. **Present Warnings** — ask user whether to update spec (remove unimplemented/removed claims) or add to `tasks/todo.md` as work to be done.
3. **Skip Info items** — these are suggestions only.
4. Apply approved changes.
5. Write `specs/drift-report.md` (or `specs/{app}/drift-report.md`) as audit trail:

```markdown
# Spec Drift Report — [date]

## Resolved
- [Error description] — resolved by updating [spec file] to match code
- [Error description] — resolved by adding implementation task to tasks/todo.md

## Deferred
- [Warning/Info description] — no action taken

## Remaining
- [Any Errors the user chose to defer]
```

6. Re-run the audit to confirm fixes resolved the flagged issues.

**Downstream Impact Check** — after fix mode, check if spec updates affect:

| File | What to check | Impact if affected |
|------|---------------|-------------------|
| `research/journey-map.md` | Journey stages referenced by changed spec sections | Journey map may describe flows that no longer match |
| `research/metrics.md` | Metrics tied to features that drifted | Metrics may track behaviors that changed |
| `tasks/roadmap.md` | Roadmap items that reference changed specs | Roadmap priorities may need re-evaluation |

Classify impact as **None**, **Minor** (cosmetic references), or **Major** (core assumptions affected). If any impact is Major, recommend running `/research-reconcile` to propagate changes.

## Output Format

**Audit mode** (default): Display directly to the user. No files written.

```
## Spec Drift Report — [scope]

### Errors (X)
- **specs/feature-a.md § Pricing** → `src/config/limits.ts:42` — Spec says "10 project limit" but code enforces 5

### Warnings (X)
- **specs/feature-a.md § API Endpoints** → code has 2 undocumented endpoints: `/api/v2/export`, `/api/v2/import`
- **specs/feature-b.md § Auth Flow** → spec describes OAuth2 PKCE but no implementation found

### Info (X)
- **Undocumented**: `src/routes/webhooks.ts` — webhook handler with no spec coverage

### Verified (X of Y claims)
- specs/feature-a.md: 15/18 claims verified
- specs/feature-b.md: 8/12 claims verified

### Summary
- Specs scanned: 4
- Claims extracted: 72
- Verified: 58, Diverged: 6, Unimplemented: 3, Undocumented: 5
```

**Fix mode**: Same report format, with a `### Fixed` section prepended and `specs/drift-report.md` written as audit trail.

## Constraints

- **Read-only by default.** Only modify files when explicitly invoked with `fix` mode.
- **Never auto-resolve Errors.** Errors always require user input on whether the code or spec is correct.
- **Show evidence.** Every finding must include the spec quote + code reference (file:line).
- **No false positives.** If uncertain whether something is a real divergence, classify it as Info, not Error.
- **Skip absent specs gracefully.** If no specs exist, display a message and exit.
- **Respect monorepo structure.** Use app-scoped paths when monorepo is detected.
- **Use subagents** for claim extraction (one per spec) and verification (one per claim group) to parallelize work.
- **Idempotent.** Running audit twice with no changes between should produce identical output.
- **Do not make code changes.** In fix mode, only update spec documents and `tasks/todo.md` — never modify source code.
