# Alignment YAML Routing Contract

Alignment pages are the durable cross-session review artifact for skills that produce research, specs, reports, planning artifacts, prototypes, or other reviewable outputs.

## Review State

While an alignment page is in `review`, the page owns the next action:

- Section-feedback YAML asks the agent to revise, investigate, or clarify the page.
- Final compiled YAML approves the complete reviewed artifact set.
- Downstream routing is blocked until final compiled YAML approval is consumed and approved canonical artifacts are written or updated.

Skills must not use a `review` alignment page as a command handoff. Do not include `Recommended next skill`, `Recommended next command`, `$exec`, `/exec`, or equivalent execution-loop routing before final compiled YAML approval.

## Approved Artifact State

After final compiled YAML approval:

- Apply approved edits.
- Archive or remove non-canonical working packets according to the skill contract.
- Write or update the approved canonical artifacts.
- Convert the alignment page to `confirmed` with the approval record preserved.
- Only then emit downstream routing based on the approved artifact state.

## Non-Exec Skills

Non-exec skills may write YAML, task, roadmap, or play artifacts that describe executable work. They must not recommend `$exec` or `/exec` directly as the next action. The approved artifact is the routing boundary; the user or active executor consumes that artifact later.

Execution-loop skills are the exception. Skills under `packs/exec-loop/**` and skills with `type: execution` may document and recommend execution-loop commands because running those commands is their purpose.

## Audit

Run:

```bash
node scripts/skill-alignment-routing-audit.mjs
```

The audit scans active `global/**/SKILL.md` and `packs/**/SKILL.md`, excluding archives and generated local install roots. It fails when active non-exec skills recommend direct `$exec`/`/exec` handoffs, and it checks the game artifact skills plus staged approval-gated skills for the pre-approval YAML stop contract.
