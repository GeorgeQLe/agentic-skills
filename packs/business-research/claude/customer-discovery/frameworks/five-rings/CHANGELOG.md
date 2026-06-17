# five-rings changelog (claude)

## v0.8 - 2026-06-17

- Added parent-owned `agent_routing` guidance for inline framework findings YAML so fresh sessions route back to the parent orchestrator, not a child framework command.

## v0.7 - 2026-06-17

- Added parent-owned terminal handoff guidance for inline framework stops: framework review output ends with `## Next Work` and `## Recommended Next Command After Compiling YAML` naming only the parent orchestrator.

## v0.6 - 2026-06-15

- Hardened framework-loop routing so this subskill runs only through the parent orchestrator, prohibits path-shaped child framework handoffs, and suppresses downstream routing labels.

## v0.5 - 2026-06-15

- Clarified framework handoff behavior: after approved artifact finalization, return to the parent `customer-discovery` Research Session Loop using the agent-specific parent command, without cross-skill, execution-loop, or direct framework-route recommendations.

## v0.4 - 2026-06-12

- Clarified staged research review pages must render complete working-packet substance as structured HTML UI, with raw Markdown packet text allowed only as a supplemental source view.

## v0.3 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.2 - 2026-06-10

- Added npm-aware `npx skillpacks install <pack>` wording to the Pack Availability Guard while preserving runner-specific in-agent pack install routes.

## v0.1 - 2026-06-10

- Changed report-first research flow to require alignment-page research-scope approval before synthesized findings, candidate rankings, recommendations, working packets, or canonical research writes.

## v0.0 - 2026-06-06

- Initial version: Revella Five Rings of Buying Insight — Priority Initiatives, Success Factors, Perceived Barriers, Decision Criteria, and Buyer's Journey analysis per ICP candidate with cross-ring synthesis and buyer persona correlation
