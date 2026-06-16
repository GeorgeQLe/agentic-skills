---
name: ord-align
description: Validate whether an OSS tool is worth building — namespace, existing solutions, effort estimate
type: analysis
version: v0.0
context_intake: scoped
---

# ORD Align

Invoke as `/ord-align`.

Rapid alignment check for an ORD candidate. Validates feasibility, checks the npm namespace, surveys existing solutions, and produces a go/no-go decision.

## Process

1. **Identify candidate:** Read the most recent ord-scan output or `$ARGUMENTS` for the tool concept to evaluate.
2. **Light interview (1-3 questions):** Ask only what's needed:
   - Target developer persona unclear?
   - Scope boundary question (what's in v1 vs. later)?
   - Licensing or dependency concern?
3. **Check dimensions:**
   - **npm namespace:** Is the desired package name available? Check `npm view <name>`. If taken, is a scoped package (`@scope/name`) viable?
   - **Existing solutions:** What already exists? Why is it insufficient? Be honest — if a good solution exists, this is a NO-GO.
   - **Feasibility:** Can v1 ship in 1-3 days? What's the minimal useful API surface?
   - **Effort estimate:** Break down into: core logic, CLI/API surface, tests, docs, publish pipeline.
   - **Adoption signal:** Is there evidence developers want this? (GitHub issues, forum posts, tweet complaints)
4. **Verdict:** GO or NO-GO with one-line rationale.
5. **If GO:** Produce a 1-page alignment doc:
   - Package name (confirmed available or scoped fallback)
   - One-line description (what goes in package.json)
   - Target developer persona
   - Core API surface (3-5 exported functions or CLI commands)
   - Tech stack (TypeScript, build tool, test framework)
   - Ship deadline (date)
   - Success metric (downloads, stars, or adoption signal to watch)

## Output

Write alignment doc to `alignment/ord-<slug>.md` if GO. End with:

```md
**Verdict:** GO / NO-GO
**Next work:** <build the package / scan for another candidate>
**Recommended next command:** /ord-ship / /ord-scan
```

## Constraints

- Do not begin implementation.
- Keep the alignment doc to 1 page.
- If the candidate came from ord-scan, reference it; don't re-research.
- Run `npm view` to check namespace availability when possible.

## Default Shipping Contract

Follow the shared shipping contract convention.
