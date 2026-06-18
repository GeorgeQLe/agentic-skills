# Alignment YAML Routing Contract

Alignment pages are the durable cross-session review artifact for skills that produce research, specs, reports, planning artifacts, prototypes, or other reviewable outputs.

## Review State

While an alignment page is in `review`, the page owns the next action:

- Section-feedback YAML asks the agent to revise, investigate, or clarify the page.
- Final compiled YAML approves the complete reviewed artifact set.
- Downstream routing is blocked until final compiled YAML approval is consumed and approved canonical artifacts are written or updated.

Skills must not use a `review` alignment page as a command handoff. Do not include `Recommended next skill`, `Recommended next command`, `$exec`, `/exec`, or equivalent execution-loop routing inside the review page before final compiled YAML approval.

Exception: self-advancing Pattern A research orchestrators may include `agent_routing` metadata in the compiled YAML and may end the **terminal message outside the page** with `## Next Work` and `## Continue In A Fresh Session`, instructing the user to compile the bottom YAML and paste it into a fresh session that invokes the same parent orchestrator command. This is loop continuation guidance, not downstream routing, and the alignment page itself remains a review artifact rather than a command handoff. The `agent_routing.command` value must name the parent orchestrator, never a child framework path command; the parent still interprets the YAML and filesystem state before writing artifacts or loading framework subskills inline.

## Approved Artifact State

After final compiled YAML approval:

- Apply approved edits.
- Archive or remove non-canonical working packets according to the skill contract.
- Write or update the approved canonical artifacts.
- Convert the alignment page to `confirmed` with the approval record preserved.
- Only then emit downstream routing based on the approved artifact state.

A skill's own re-invocation is a valid downstream route. Self-advancing Pattern A research orchestrators (`docs/research-session-loop-convention.md`) continue their loop by naming their own command as the next action once a gate's artifact is written (e.g. `Next: clear context, then run /customer-discovery`).

## Non-Exec Skills

Non-exec skills may write YAML, task, roadmap, or play artifacts that describe executable work. They must not recommend `$exec` or `/exec` directly as the next action. The approved artifact is the routing boundary; the user or active executor consumes that artifact later.

Execution-loop skills are the exception. Skills under `packs/exec-loop/**` and skills with `type: execution` may document and recommend execution-loop commands because running those commands is their purpose.

## Audit

Run:

```bash
node scripts/skill-alignment-routing-audit.mjs
```

The audit scans active `base/**/SKILL.md` and `packs/**/SKILL.md`, excluding archives and generated local install roots. It fails when active non-exec skills recommend direct `$exec`/`/exec` handoffs, and it checks the game artifact skills plus staged approval-gated skills for the pre-approval YAML stop contract.
