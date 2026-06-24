---
skill: investigate
agent: claude
captured_at: 2026-06-23T22:51:11Z
source: user-invocation
prompt_scope: visible-user-invocation
---

/investigate

Target: current session in /Users/georgele/projects/apps/calcllm; evidence from afps-status, packaged journey-map/onboarding-map, .agents/project.json, skillpacks CLI, and active repo artifacts.

User-identified issue: my $afps-status recommendation was stale: it routed to $onboarding-map research/crew instead of the canonical $journey-map orchestrator, and it did not handle skill availability.

Verification verdict: verified, with one nuance. journey-map is explicitly an orchestrator and owns inline subskill routing. onboarding-map is a child stage skill that expands research/{slug}/journey-map.md and says to recommend $journey-map if the journey map is missing or needs orchestration. Availability-wise, customer-lifecycle is enabled and npx skillpacks which journey-map says it is provided by that installed pack, but the current local skill roots only show session-triage; the active Codex skill list also does not expose journey-map. So the missing guard was not strictly "install customer-lifecycle"; it was "refresh/reload or fresh Codex session before treating $journey-map as invokable."

Timeline: $afps-status found lifecycle gaps, I recommended $onboarding-map research/crew; you corrected that journey-map is the orchestrator; verification confirmed journey-map has an optional trigger map for onboarding/conversion/retention/etc. and should own that next decision.

Root cause: bad next-step routing plus weak availability validation. afps-status has only generic lifecycle routing text and does not encode the journey-map parent-orchestrator rule. I also failed to compensate by checking packaged skill contracts and current session visibility.

Responsible contract gap: afps-status should be updated. The durable rule should be: for lifecycle gaps after ICP/competitive/positioning evidence, route first to $journey-map <product-path> when the journey map is canonical/stale/incomplete or when child lifecycle detours are being considered; let journey-map choose $onboarding-map, $conversion-map, $retention-map, $lifecycle-metrics, or $expansion-map.

Recommended fix: update the shared afps-status skill contract, not this app repo copy. Add an availability gate: use npx skillpacks which <skill> / npx skillpacks status when scripts/pack.sh is missing; if pack enabled but skill is not visible in local roots or the active $ list, recommend npx skillpacks refresh and a fresh Codex session before the $journey-map invocation.

Validation plan: targeted rg checks for journey-map, onboarding-map, skillpacks which, and active/session-visible; verify npx skillpacks which journey-map; replay the CalcLLM status case and confirm the route becomes $journey-map research/crew plus refresh/fresh-session guidance when not visible.

I also recorded the correction in tasks/lessons.md:1, captured the session prompt, committed, and pushed as e950ed3. Git is clean and synced.

Confidence: high. I did not run broad historical analysis; not needed for this live correction. There is a minor mirrored-platform difference in session-triage files ($ for Codex, / for Claude), but it is not responsible for this incident.

Recommended next skill: npx skillpacks install skill-dev, then start a fresh Codex session and run $targeted-skill-builder afps-status routing should prefer journey-map orchestrator and verify active skill availability before recommending lifecycle child skills.
