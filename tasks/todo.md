# Downstream Impact Check — Research Skills

Add a post-write "Downstream Impact Check" phase to each non-leaf research skill. After writing output, the skill scans downstream docs for conflicts, classifies impact (None/Minor/Major), and recommends `/research-reconcile` when blast radius is significant.

## Phase 1: Template & First Skill (gtm)

- [x] Add step 6 "Downstream Impact Check" to `claude/gtm/SKILL.md` after step 5 (Write Output)
- [x] Add `## Downstream Impact` section to gtm output template before `## Next Steps`
- [x] Add impact-aware logic to step 4 (Populate Next Steps) — prepend reconcile for Major, annotate for Minor
- [x] Downstream docs: `research/monetization.md`
- [x] Bump version 1.1.0 → 1.2.0
- [x] Verify: read full file, confirm step numbering and output template consistency

## Phase 2: metrics

- [x] Add step 6 "Downstream Impact Check" to `claude/metrics/SKILL.md` after step 5 (Write Output)
- [x] Add `## Downstream Impact` section to metrics output template before `## Next Steps`
- [x] Add impact-aware logic to step 4 (Populate Next Steps)
- [x] Downstream docs: `research/monetization.md`
- [x] Bump version 1.1.0 → 1.2.0
- [x] Verify: read full file, confirm consistency

## Phase 3: competitive-analysis

- [x] Add step 9 "Downstream Impact Check" to `claude/competitive-analysis/SKILL.md` after step 8 (Write Output)
- [x] Add `## Downstream Impact` section to competitive-analysis output template before `## Next Steps`
- [x] Add impact-aware logic to step 7 (Populate Next Steps)
- [x] Downstream docs: `research/gtm.md`, `research/monetization.md`
- [x] Bump version 2.2.0 → 2.3.0
- [x] Verify: read full file, confirm consistency

## Phase 4: customer-feedback

- [x] Add step 8 "Downstream Impact Check" to `claude/customer-feedback/SKILL.md` after step 7 (Write Output)
- [x] Add `## Downstream Impact` inside Synthesis output section (after `### Staleness Alerts`, before `### Next Steps`)
- [x] Add impact-aware logic to step 6 (Populate Next Steps)
- [x] Downstream docs: `research/gtm.md`, `research/monetization.md`
- [x] Note: existing staleness (step 5) looks upstream; this looks downstream — keep both
- [x] Bump version 1.1.0 → 1.2.0
- [x] Verify: read full file, confirm append-only format preserved

## Phase 5: journey-map

- [x] Add step 7 "Downstream Impact Check" to `claude/journey-map/SKILL.md` after step 6 (Write Output)
- [x] Add `## Downstream Impact` section to journey-map output template before `## Next Steps`
- [x] Add impact-aware logic to step 5 (Populate Next Steps)
- [x] Downstream docs: `research/metrics.md`, `research/gtm.md`, `research/monetization.md`, `research/customer-feedback.md`
- [x] Bump version 1.1.0 → 1.2.0
- [x] Verify: read full file, confirm consistency

## Phase 6: icp

- [x] Add step 9 "Downstream Impact Check" to `claude/icp/SKILL.md` after step 8 (Final Review & Write)
- [x] Add `## Downstream Impact` section to icp output template before `## Next Steps`
- [x] Add impact-aware logic to step 7 (Populate Next Steps)
- [x] Downstream docs: `research/competitive-analysis.md`, `research/journey-map.md`, `research/metrics.md`, `research/gtm.md`, `research/monetization.md`, `research/enterprise-icp.md`, `research/customer-feedback.md`
- [x] Bump version 3.3.0 → 3.4.0
- [x] Verify: read full file, confirm consistency

## Final Verification

- [x] Read each modified skill end-to-end — step numbers sequential, no gaps
- [x] Confirm downstream doc lists match reverse dependency map
- [x] Confirm no changes to monetization or enterprise-icp (leaf nodes)
