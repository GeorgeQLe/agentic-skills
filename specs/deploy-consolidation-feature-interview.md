# Deploy Consolidation — Feature Interview Log

## Feature Evidence Brief

### Evidence Sources
- `global/claude/deploy/SKILL.md` (v2.0.0)
- `global/claude/ship/SKILL.md` (v1.0.0, step 3)
- `global/claude/ship-end/SKILL.md` (v1.0.0, step 3)
- Codex counterparts for all three
- `tasks/ideas.md` Quick Wins entry

### Claim Validation

| Claim | Verdict | Evidence |
|-------|---------|----------|
| /ship and /ship-end both inline deploy search+execute logic | Confirmed | Both contain full deploy discovery lists, AWS SSO handling, and verification |
| /deploy (v2.0.0) exists but isn't called internally | Confirmed | Neither /ship nor /ship-end reference /deploy |
| AWS SSO handling is word-for-word identical across all three | Confirmed | Same 6-bullet SSO recovery block |
| Drift risk from duplication | Partially supported | /ship already diverged with stricter gate; /ship-end asks user |

### Technical Gotchas
1. Behavioral divergence already exists between /ship (strict gate) and /ship-end (ask user)
2. /deploy has unique ledger+staleness features that shouldn't be injected into callers
3. Six files to update (Claude + Codex variants)
4. Skills are prompt instructions — "call /deploy" means prose instruction to the agent
5. Benchmark coverage in agentic-skills-bench may exist for these skills

### Journey Placement
Deploy is a tail-end workflow step in the shipping pipeline: /run → validate → /ship (commit + push + deploy + plan). Agent-internal orchestration, no user-facing journey doc.

## Interview Questions & Answers

**Q: Which consolidation approach?**
A: Internal /deploy invocation — /ship and /ship-end say "run /deploy" as a sub-step.

**Q: Should /ship start recording deploys in the ledger?**
A: No. Ledger stays /deploy-only. Callers fire-and-forget.

**Q: Should /ship-end adopt /ship's strict gate?**
A: Yes. Both align to: require deploy.md or tasks/deploy.md, skip if absent.

**Q: Formal --no-ledger flag or prose instruction?**
A: Prose instruction. No formal flag needed since these are prompt instructions.

## Planning Destination + Priority Checkpoint

- **Decision:** Update existing skills (no new spec)
- **Target artifacts:** 4 SKILL.md files (ship + ship-end, Claude + Codex) + tasks/ideas.md
- **Scope now:** Replace inline deploy logic with /deploy invocation, align gate behavior
- **Deferred:** No /deploy changes, no formal flags, no shared reference doc
- **Priority:** Low urgency quick-win, no dependencies

## Next work: Execute the 4-file refactor
## Recommended next command: /run
