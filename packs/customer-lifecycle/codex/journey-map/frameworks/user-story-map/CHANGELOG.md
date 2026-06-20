# user-story-map changelog (codex)

## v0.9 - 2026-06-20

- Changed the review-pending Pattern A handoff to `## Invoke With YAML`; the section now only names the parent skill invocation to use with compiled YAML while `## Next Work` owns the review/compile/paste instructions.

## v0.8 - 2026-06-17

- Added parent-owned `agent_routing` guidance for inline framework findings YAML so fresh sessions route back to the parent orchestrator, not a child framework command.

## v0.7 - 2026-06-17

- Added parent-owned terminal handoff guidance for inline framework stops: framework review output ends with `## Next Work` and `## Recommended Next Command After Compiling YAML` naming only the parent orchestrator.

## v0.6 - 2026-06-15

- Hardened framework-loop routing so this subskill runs only through the parent orchestrator, prohibits path-shaped child framework handoffs, and suppresses downstream routing labels.

## v0.5 - 2026-06-12

- Clarified staged research review pages must render complete working-packet substance as structured HTML UI, with raw Markdown packet text allowed only as a supplemental source view.

## v0.4 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.3 - 2026-06-11

- Added npm-aware install-route guidance to the Pack Availability Guard while preserving runner-specific in-agent pack install commands.

## v0.2 - 2026-06-10

- Changed report-first research flow to require alignment-page research-scope approval before synthesized findings, candidate rankings, recommendations, working packets, or canonical research writes.

## v0.1 - 2026-06-06

- Route missing customer-discovery prerequisite guidance to `$customer-discovery` instead of the retired `$icp` command while preserving `research/icp.md` as the evidence artifact name.

## v0.0 - 2026-06-05

- Initial version — Jeff Patton user story map with activity→task→story hierarchy, release slicing, and walking skeleton identification
