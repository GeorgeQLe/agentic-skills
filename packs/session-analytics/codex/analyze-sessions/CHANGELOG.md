# Changelog

## v0.5 - 2026-06-19

- Re-chartered the skill to own informational history questions — single or trend — and softened the route-away rule so only live incidents needing a verified fix go to `$session-triage`; pure informational lookups (find a past conversation, explain a skill recommendation, check one run's tokens) stay here.
- Removed the prescriptive "Remediation-Ready Handoffs" house-style section; the concise `$targeted-skill-builder` (skill-dev pack) routing with owner surface + validation expectation is preserved in the Output section.
- Kept the token-spend/cost section unchanged (in active use).

## v0.4 - 2026-06-17

- Caught Codex up to the Claude mirror with npm-aware cross-pack recommendation guidance, clearer full-history analysis constraints, and skill-dev pack labeling while preserving `$...` route syntax.

## v0.3 - 2026-06-12

- Made alignment pages optional by default: report inline and write the skill's normal durable artifacts unless the user requests an alignment page or the agent identifies a concrete clarification/review need.

## v0.0

- Archived previous skill contract.

## v0.2 - 2026-06-05

- Added token-spend and cost-accounting requirements, including Codex `token_count` parsing, cumulative snapshot de-duplication, pricing-source caveats, and output coverage gaps.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
