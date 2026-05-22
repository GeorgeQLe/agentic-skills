---
name: trace
description: Follow a request end-to-end through the stack from route to database
type: review
version: v0.0
---

# Trace

Invoke as `$trace`.

Use this skill when the user wants to understand how a specific route, endpoint, or feature flows through the application stack.

## Workflow

1. Identify the entry point from the user's description.
2. Read CLAUDE.md for architecture context.
3. Trace forward through each layer: entry point → middleware → business logic → data access → response.
4. Map the data flow and types at each boundary.
5. Identify concerns: N+1 queries, auth gaps, type mismatches, performance issues.

## Output Format

- **Visual trace**: entry → middleware → handler → service → DB → response with file:line refs
- **Layer-by-layer detail**: file, inputs, outputs, what it does
- **Data flow**: how data transforms through the stack
- **Concerns found**: issues identified during the trace

## Constraints

- Follow actual code paths — do not guess from naming.
- Read each file in the chain.
- Do not modify any code — read-only analysis.


## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/trace-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/trace-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/trace-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
