---
name: slim-audit
description: Audit codebase for opportunities to reduce lines of code while preserving functionality, performance, and quality
type: analysis
version: v0.1
required_conventions: [alignment-page]
---

# Slim Audit

Invoke as `$slim-audit`.

Use this skill when the user wants to identify opportunities to reduce lines of code while maintaining or improving functionality, performance, and code quality.

## Process

1. Read project context (CLAUDE.md, specs, docs, conventions).
2. Determine scope (specific path from arguments, or entire project).
3. Analyze for reduction opportunities:
   - Duplicate and near-duplicate code that can be consolidated.
   - Over-abstraction: unnecessary wrappers, adapters, single-implementation interfaces.
   - Verbose patterns with idiomatic shorter equivalents (optional chaining, collection methods, etc.).
   - Redundant logic: duplicate validation, always-true branches, redundant conversions.
   - Hand-rolled implementations replaceable by already-imported dependencies.
   - Structural bloat: unnecessary barrel files, excessive file splitting, boilerplate.
4. Cross-reference findings against specs/docs — skip intentionally verbose patterns.
5. Estimate LOC savings, risk level, and effort for each opportunity.
6. Cross-reference with git history for context and prioritization.
7. Verify findings (false-positive filter):
   - Re-read actual source code for every finding. Confirm duplicates are genuine, wrappers don't handle hidden edge cases, replacements are behaviorally equivalent, and redundant checks are truly redundant.
   - Drop any finding you cannot re-confirm on second read. If uncertain, move to "Needs Investigation."

## Output

- **Summary**: total opportunities, estimated LOC reduction, risk breakdown
- **High-Value Reductions**: low risk, high savings — with location, category, savings, and proposed approach
- **Medium-Value Reductions**: moderate savings or risk
- **Low-Value Reductions**: small wins worth tracking
- **Behavior Change Risk**: reductions that may alter visible behavior
- **Intentional Decisions**: verbose patterns kept for documented reasons
- **Needs Investigation**: ambiguous findings needing manual review

## Constraints

- Never automatically modify code — only report.
- Functionality preservation is the top priority — every recommendation must preserve existing behavior.
- Do not recommend reductions that trade LOC for readability.
- Do not suggest adding new dependencies — only use what's already imported.
- Do not flag test code unless reduction clearly improves maintainability.
- Be specific with file paths and line numbers.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/slim-audit-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
