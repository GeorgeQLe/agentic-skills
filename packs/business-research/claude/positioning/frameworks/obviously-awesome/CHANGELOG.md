# Changelog

## v0.14 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/obviously-awesome-{topic}.html` is now the primary review surface and compiled YAML routes back to `/obviously-awesome`.

## v0.13 - 2026-07-02

- Removed the separate review-pending `## Invoke With YAML` command block; compiled YAML now carries continuation via `command` and `agent_routing.command`, so terminal handoffs tell users to clear context and paste the compiled YAML directly.

## v0.12 - 2026-06-20

- Changed the review-pending Pattern A handoff to `## Invoke With YAML`; the section now only names the parent skill invocation to use with compiled YAML while `## Next Work` owns the review/compile/paste instructions.

## v0.11 - 2026-06-17

- Added parent-owned `agent_routing` guidance for inline framework findings YAML so fresh sessions route back to the parent orchestrator, not a child framework command.

## v0.10 - 2026-06-17

- Added parent-owned terminal handoff guidance for inline framework stops: framework review output ends with `## Next Work` and `## Recommended Next Command After Compiling YAML` naming only the parent orchestrator.

## v0.9 - 2026-06-15

- Hardened framework-loop routing so this subskill runs only through the parent orchestrator, prohibits path-shaped child framework handoffs, and suppresses downstream routing labels.

## v0.8 - 2026-06-12

- Clarified staged research review pages must render complete working-packet substance as structured HTML UI, with raw Markdown packet text allowed only as a supplemental source view.

## v0.7 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.6 - 2026-06-10

- Added npm-aware `npx skillpacks install <pack>` wording to the Pack Availability Guard while preserving runner-specific in-agent pack install routes.

## v0.5 - 2026-06-10

- Changed report-first research flow to require alignment-page research-scope approval before synthesized findings, candidate rankings, recommendations, working packets, or canonical research writes.

## v0.4 - 2026-06-06

- Updated missing-discovery prerequisite routes from the retired `icp` command to `customer-discovery` while preserving `research/icp.md` as the customer evidence artifact.

## v0.3 - 2026-06-02

- Added a staged research workflow so preliminary findings stay in non-canonical `_working` packets until review alignment approval finalizes canonical artifacts.

## v0.2 - 2026-06-02

- Added a generated sibling `ALIGNMENT-PAGE.md` bundle and updated the alignment stub to use the local convention.

## v0.1 - 2026-06-02

- Added evidence-aware feedback handling so agents push back on factual misunderstandings while honoring subjective user preferences.

## v0.0

- Initial framework subskill.
