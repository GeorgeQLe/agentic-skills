---
name: slim-audit
description: Audit codebase for opportunities to reduce lines of code while preserving functionality, performance, and quality
type: analysis
version: v0.1
argument-hint: "[optional: specific package, directory, or file to scope the audit]"
---

# Slim Audit

Audit the codebase, documentation, and specs to identify concrete opportunities to reduce lines of code while maintaining or improving functionality, performance, and code quality. Outputs a prioritized reduction plan with estimated LOC savings.

## Process

1. **Gather project context:**
   - Read `CLAUDE.md`, `README.md`, and project config files to understand conventions, architecture, and constraints.
   - Search for and read project documentation: specs (`specs/`, `spec.md`, `docs/`), changelogs (`CHANGELOG.md`, `tasks/history.md`), ADRs, and design docs.
   - Read `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, and `tasks/recurring-todo.md` if they exist to understand in-progress and advisory work.
   - Build a mental model of **intentional decisions** — patterns, trade-offs, and constraints the team has deliberately chosen.

2. **Determine scope:**
   - If `$ARGUMENTS` specifies a package, directory, or file, scope the audit there.
   - Otherwise, audit the entire project (or all packages in a monorepo).

3. **Analyze for reduction opportunities across these categories:**

   **a. Duplicate and near-duplicate code:**
   - Identify code blocks that are identical or structurally similar (same logic, different names/values).
   - Flag copy-paste patterns across files that could be consolidated into a shared function or module.
   - Look for repeated patterns in tests that could use shared fixtures, helpers, or parameterized tests.

   **b. Over-abstraction and unnecessary indirection:**
   - Wrapper functions/classes that add no logic — they just forward calls to an inner implementation.
   - Adapter or facade layers with a single consumer that could be inlined.
   - Abstract base classes or interfaces implemented by only one concrete class.
   - Factory patterns where a direct constructor or function call would suffice.
   - Middleware or decorator chains that could be collapsed.

   **c. Verbose patterns with idiomatic alternatives:**
   - Manual loops that could be replaced by built-in array/collection methods (`map`, `filter`, `reduce`).
   - Verbose null/undefined checks that could use optional chaining, nullish coalescing, or pattern matching.
   - Hand-rolled utility functions that duplicate standard library or already-imported dependency functionality.
   - Explicit type definitions that could be inferred by the compiler/runtime.
   - Verbose error handling patterns that could use a shared error handler or middleware.

   **d. Redundant logic:**
   - Validation or guard checks already performed upstream (caller validates, callee re-validates).
   - Dead branches in conditionals — conditions that are always true/false given the surrounding code.
   - Redundant type conversions or serialization round-trips.
   - Configuration or initialization code that duplicates framework defaults.

   **e. Hand-rolled implementations replaceable by dependencies:**
   - Custom implementations of functionality provided by an already-imported library (e.g., hand-rolled date formatting when `date-fns` is already in `package.json`).
   - Utility code that reimplements well-tested standard library functions.
   - **Note:** Only suggest replacing with libraries *already in the dependency tree*. Do not suggest adding new dependencies.

   **f. Structural bloat:**
   - Files that exist purely for re-export (barrel files) with no additional logic, where the re-exports could be replaced by direct imports.
   - Excessive file splitting where closely related code (used together, changed together) is scattered across many small files that could be a single cohesive module.
   - Boilerplate-heavy patterns that could be reduced with code generation, decorators, or framework conventions.

4. **Cross-reference findings against documentation:**
   - Before reporting a finding, check if the pattern was an intentional decision documented in specs, ADRs, changelogs, or design docs.
   - If a verbose pattern exists because of a documented constraint (performance, compatibility, readability preference), **do not flag it**. Note it under "Intentional Decisions" instead.
   - If a finding would change externally-visible behavior (API contracts, output format, error messages), flag it as **Behavior Change Risk** rather than a safe reduction.

5. **Estimate impact:**
   - For each opportunity, estimate the approximate LOC reduction (net lines removed after the refactor).
   - Assess risk: Low (pure refactor, no behavior change), Medium (internal behavior change, needs testing), High (external behavior change risk).
   - Assess effort: Small (< 30 min), Medium (1-2 hours), Large (half-day+).

6. **Cross-reference with git:**
   - For flagged areas, check `git log` and `git blame` to understand why the code exists in its current form.
   - Code with recent intentional refactoring history should be flagged with lower confidence.
   - Code untouched for 6+ months with clear reduction paths gets higher priority.

7. **Verify findings (false-positive filter):**
   - Before finalizing, re-read the actual source code for every finding. For each one, confirm:
     - The "duplicate" code is genuinely duplicated — not just structurally similar with important semantic differences.
     - The "unnecessary wrapper" doesn't handle edge cases, logging, error transformation, or other subtle behavior you missed on first read.
     - The "verbose pattern" replacement is actually equivalent — same behavior for all inputs, including edge cases.
     - The "redundant check" is genuinely redundant — the upstream validation actually covers all cases the downstream check handles.
     - The suggested library replacement produces identical output for all relevant inputs.
     - The reduction **preserves all existing functionality** unless the current behavior is a clear, demonstrable bug.
   - **Drop any finding you cannot re-confirm with a second read.** If uncertain, move it to "Needs Investigation" rather than recommending removal.

## Output Format

### Summary
- **Total opportunities found**: N
- **Estimated total LOC reduction**: ~N lines
- **Risk breakdown**: N low / N medium / N high

### High-Value Reductions (low risk, high LOC savings)
| Location | Category | Current LOC | Est. Savings | Risk | Description |
|----------|----------|-------------|--------------|------|-------------|
| `path/file.ts:20-85` | Duplication | 65 | ~40 | Low | Consolidate into shared helper |

For each high-value finding, include:
- **Current code**: brief description or snippet of the verbose/duplicated pattern
- **Proposed approach**: how to reduce it
- **Why it's safe**: what guarantees functionality is preserved

### Medium-Value Reductions
Same table format — moderate savings or moderate risk.

### Low-Value Reductions
Brief list — small savings, worth tracking but not urgent.

### Behavior Change Risk
Opportunities that would reduce code but may alter externally-visible behavior. Each includes:
- What would change
- Why it might be acceptable (e.g., fixing a likely bug)
- What testing would be needed to confirm safety

### Intentional Decisions (no action)
Verbose patterns that exist for documented reasons — not flagged as issues.

### Needs Investigation
Items that look reducible but have ambiguous usage patterns or unclear intent. Each includes what specifically needs to be investigated.

## Constraints
- Use subagents to parallelize analysis across packages in a monorepo.
- **Never automatically modify code** — only report findings and recommendations.
- **Functionality preservation is the top priority.** Every recommendation must preserve existing behavior unless the current behavior is a clear, demonstrable bug. When in doubt, classify as "Behavior Change Risk" rather than recommending removal.
- Do not recommend reductions that trade LOC for readability — if the verbose version is clearer, it stays.
- Do not recommend adding new dependencies to replace hand-rolled code. Only suggest replacements using libraries already in the dependency tree.
- Do not flag test code for reduction unless the reduction clearly improves test maintainability (e.g., shared fixtures reducing update burden).
- Do not flag configuration files, migration files, or generated code.
- Be specific — always include file paths and line numbers or ranges.
- Every recommendation must include a concrete "proposed approach," not just "simplify this."
- Prefer many small, independent reductions over large sweeping refactors — smaller changes are safer and easier to review.
- If the codebase has no specs or documentation, proceed with the audit but note the absence and increase the confidence threshold for recommendations.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/slim-audit-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Research quality contract.** For research-producing outputs, build the research before polishing the page. Separate and label `claims` (what the report concludes), `evidence` (source, repo artifact or file path, quote or observation, date, and confidence), `inference` (why that evidence supports the claim), `assumptions` (what remains unproven), and `decision impact` (what the user should approve, reject, or correct). Do not collapse evidence and inference into unsupported summary prose.

**No context loss rule.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item -- plus the decision-relevant substance from search logs, interview logs, source notes, repo scans, and approval notes. If a fact, source, caveat, uncertainty, alternative, rejected or lower-confidence finding, or decision rationale appears in a proposed deliverable or research log, it must either appear in the HTML page or be explicitly linked from the exact section that depends on it. The page is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Research translation requirements.** For research outputs, the HTML page must include an evidence matrix, confidence/assumption register, alternatives considered, rejected or lower-confidence findings, source coverage gaps, and downstream implications. The evidence matrix must map each major claim to source or repo evidence, inference, confidence, assumption status, and decision impact. The confidence/assumption register must show which conclusions are evidence-backed, which are provisional, and what evidence would change them.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Research completeness gate.** For research outputs, include a research completeness gate with inline questions asking whether the evidence is sufficient for the recommendation, which claims need more support, and whether missing context could change the recommendation. Place these questions directly under the evidence matrix or recommendation section they govern.

**Source coverage expectations.** For web research, organize source coverage by category rather than citation list alone; use categories such as competitors, pricing, user sentiment, positioning, integrations, and recent activity when relevant to the topic. For repo or codebase research, include file/path evidence and clearly distinguish observed code facts from inferred product, workflow, or user conclusions.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/slim-audit-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
