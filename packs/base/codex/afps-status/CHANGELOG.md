# Changelog

## v0.10 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/afps-status-{topic}.html` is now the primary review surface and compiled YAML routes back to `$afps-status`.

## v0.9 - 2026-06-23

- Lifecycle-gap routing now prefers the `$journey-map` orchestrator over child lifecycle skills. The next-route rule for missing journey/lifecycle/growth evidence routes to `$journey-map <product-path>` first whenever the canonical journey map is missing/stale/incomplete or any child detour (onboarding/conversion/retention/lifecycle-metrics/expansion) is being considered, and lets `journey-map` own inline child routing via its Optional Research Trigger Map. Direct child-skill routes are reserved for the case where a current journey map already exists and a single stage is explicitly scoped. Fixes a stale recommendation that routed to `$onboarding-map` instead of the parent orchestrator.
- Strengthened the step-8 availability gate with an installed-but-not-yet-visible guard: an enabled pack (and `npx skillpacks which` resolving the skill) does not prove session invokability. When a target skill is not visible in the active session/local roots despite its pack being installed, recommend the reload path (`npx skillpacks refresh` + a fresh Codex session, or `/reload-skills`/`/clear`/restart for Claude Code) rather than a reinstall. Added `npx skillpacks which` / `npx skillpacks status` as the fallback provenance lookup when `scripts/pack.sh` is missing.

## v0.8 - 2026-06-22

- Updated AFPS route references to use `$consolidate-prototypes` as the primary post-UAT consolidation handoff.

## v0.7 - 2026-06-15

- Brought the Codex side to parity with Claude on rapid-pipeline awareness: added the "Rapid pipeline artifacts" inspection bullet, a new "Detect rapid pipeline activity" step (step 5, renumbering classify/route/validate to 6/7/8), and the "active rapid pipelines (VARD/ORD)" Overview + "Rapid Pipeline Status" output additions.
- Surfaced VARD/ORD graduation as a concrete next command: the detect step reads the **latest** ship-log traction entry's persisted `Status:` (`iterating` | `graduating` | `archived`) and `Recommendation:` line deterministically, and the next-route ladder gained high-priority graduation rules — VARD `Status: graduating` → `$idea-scope-brief` (base pack), ORD `Status: graduating` → `$devtool-user-map` (install `devtool` if needed) or `$idea-scope-brief` for the rare cross-domain case — so the `Recommended next command:` footer now emits the graduation command. Added a `graduation-ready` AFPS stage label.

## v0.6 - 2026-06-15

- Updated business discovery fallback routing to use canonical `business-research` install guidance and explicit pack-availability wording for cross-pack discovery routes.

## v0.5 - 2026-06-14

- Made reporting and routing Research-Session-Loop-aware: when reconciling a research stage, read the selected-set run manifest (`research/{slug}/_working/{orchestrator}-run.yaml`), compare against existing canonical intermediates, and report "k of N frameworks complete" instead of reading `tasks/todo.md` checkboxes for research progress.
- Added a mid-run routing rule: when a research loop has pending frameworks (or all intermediates exist but no synthesized canonical), route to re-invoking that same orchestrator (fresh Codex session), taking precedence over starting a new orchestrator. Kept `research/.progress.yaml` `pipeline_stage` as a pointer.

## v0.4 - 2026-06-12

- Made alignment pages optional by default: report inline and write the skill's normal durable artifacts unless the user requests an alignment page or the agent identifies a concrete clarification/review need.

## v0.3 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.2 - 2026-06-11

- Added npm-aware install-route alternatives to AFPS pack fallback recommendations while preserving Codex `$pack install` routes.

## v0.1 - 2026-06-06

- Renamed the discovery-needed AFPS stage and next-route wording to use `$customer-discovery`, while preserving `research/icp.md` as the customer-discovery evidence artifact where relevant.

## v0.0 - 2026-05-28

- Added the initial Codex `$afps-status` skill for read-mostly AFPS artifact reconciliation and next-command routing.
