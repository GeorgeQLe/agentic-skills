# desk-flip — Skill Interview Log

## Assumptions Checkpoint

| # | Assumption | Tag | Status |
|---|-----------|-----|--------|
| 1 | Target is existing projects that are feature-complete / buttoned-down and stuck | `[from request]` | Confirmed |
| 2 | Core problem is infrastructure built before prototype/taste alignment, making UAT hard | `[from lessons]` | Confirmed |
| 3 | "Start from scratch" means restarting the workflow with existing code as reference | `[inferred]` | **Corrected** — user means full reset, literally starting the project over |
| 4 | New workflow requires specs/, tasks/roadmap.md, etc. — stuck projects lack these | `[from codebase]` | Confirmed (implicit) |
| 5 | Skill should be repo-managed and global | `[inferred]` | Confirmed |
| 6 | Skill should assess whether to migrate vs. restart | `[inferred]` | **Corrected** — always desk-flip, no assessment needed |

## Interview Questions and Decisions

### Turn 1: Core Shape

**Q1: Is "start from scratch" workflow-restart or full reset?**
- Options: Restart workflow only / Full reset / Skill decides per-project
- Recommendation: Restart workflow only
- **User chose: Full reset**
- Impact: The skill doesn't preserve the old codebase as the working tree. Old code stays in its repo, new project is a separate repo.

**Q2: What triggers this skill?**
- Options: Manual only / Manual + recommended / Auto-detection first
- Recommendation: Manual + recommended
- **User chose: Manual invocation only**
- Impact: No detection hooks in other skills needed. Simpler contract.

**Q3: Single skill or assess-then-route?**
- Options: Single skill / Assess then route / Assess + scaffold, route for content
- User response: "It depends on the strategy of unstucking a project"
- Impact: Led to follow-up questions about execution depth.

### Turn 2: Desk-Flip Mechanics

**Q4: What happens to old code?**
- Options: Git branch archive / Directory archive / Separate repo / Just delete
- **User chose: Separate repo**
- Impact: Old repo is untouched. New project starts in a fresh repo.

**Q5: Assessment signals for migrate vs. desk-flip?**
- Options: Missing workflow artifacts / Alignment failure / Both + user judgment / Always desk-flip
- **User chose: Always desk-flip**
- Impact: Eliminates the assessment/decision branch entirely. Skill is simpler — always autopsy + extract + route.

**Q6: Execution depth?**
- Options: Full execution / Assess + archive, then route / Assess only, route everything
- **User chose: Assess + archive, then route**
- Impact: Skill does the autopsy and extraction, then routes to `/bootstrap-repo`. Does not execute the fresh start itself.

### Turn 3: Extraction and Naming

**Q7: What to extract from the old project?**
- Options: Lessons + domain knowledge / Lessons + specs + assets / Full inventory
- **User chose: Lessons + specs + assets**
- Impact: Extraction includes lessons, valid specs/designs, and non-code assets. No code, dependencies, or infrastructure carried forward.

**Q8: Skill name?**
- Options: desk-flip / fresh-start / project-reset
- **User chose: desk-flip**

## Coverage Checkpoint

Presented full coverage table. User confirmed "Looks good, write the brief" with no corrections.

## Deviations from Initial Request

1. User initially asked whether `/hygiene` was adequate — determined it is not (hygiene is structural linting, not workflow migration)
2. User initially framed this as "migrate" — evolved to "always desk-flip" through the interview
3. Initial assumption of incremental migration as an option was eliminated — the skill is simpler and more opinionated as a result
