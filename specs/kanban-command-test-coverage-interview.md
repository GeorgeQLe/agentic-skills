# Interview Log: Kanban Command Test Coverage

## Turn 1: Scope

**Q1:** Narrow scope (just create-list) or expand to all untested command behaviors?
- Option A: Just create-list — 3-5 tests, quick win
- Option B: All untested commands — audit all 11, write tests for gaps
**Selection:** All untested commands. User wants comprehensive coverage.

**Q2:** Live Neon DB or mock layer?
- Option A: Live Neon DB — consistent with existing 24 tests
- Option B: Mock layer — faster, offline, isolated, but new pattern
**Selection:** Live Neon DB. Consistency with existing tests.

## Turn 2: Coverage categories

**Q1:** create-list + edge cases vs. create-list + missing flags only?
- Option A: create-list + edge cases — comprehensive pass (~15-20 tests)
- Option B: create-list + missing flags only — narrower (~8-10 tests)
**Selection:** create-list + edge cases. Full comprehensive pass.

**Q2:** Test existing create-list behavior or add --type flag?
- Option A: Test existing only — create-list always makes "normal" type
- Option B: Add --type flag + tests — mixes feature work with testing
**Selection:** Test existing only. Keep testing and feature work separate.

## Turn 3: Test organization

**Q1:** All edge case categories in scope?
- Option A: All categories (~15-20 new tests)
- Option B: High-value only (~8-10 tests)
- Option C: Minimal + create-list (~4 tests)
**Selection:** All categories. User wants thorough coverage.

**Q2:** Same file or separate file?
- Option A: Same file (kanban.test.mjs) — shared setup, single runner
- Option B: Separate file — cleaner separation but split state
**Selection:** Same file. Consistent pattern, shared test board.

## Turn 4: Isolation and known issues

**Q1:** Shared board or separate board per describe group?
- Option A: Shared board — less DB overhead, faster, order-dependent
- Option B: Separate board per group — isolated but ~2x round trips
**Selection:** Shared board. Performance over isolation.

**Q2:** Any known failure modes to explicitly test?
- Option A: Use systematic gap analysis
- Option B: User provides specific scenarios
**Selection:** Use gap analysis. No specific user-reported issues.

## Deviations from Original Card

The original card ("Test create-list command") was scoped as a quick win (hours) covering just the create-list command. The spec expanded to cover all command edge cases based on user preference, changing the effort level from "quick win" to "medium effort (days)". The card description should be updated to reflect this broader scope.
