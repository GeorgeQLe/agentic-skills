---
skill: exec
agent: codex
captured_at: 2026-06-27T16:17:37-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Fresh-Session YAML Routing Benchmark Plan

## Summary
Add a benchmark scenario that runs Claude and Codex in fresh temp worktrees and measures whether they comply with alignment/interrogation compiled YAML routing. The benchmark should grade the route matrix, happy path, messy context, and adversarial bad inputs separately so we can tell whether agents follow the YAML comment, root `command`, `agent_routing.command`, or surrounding noisy instructions.

## Key Changes
- Add a scenario benchmark target, not a new public skill: `pnpm --dir tests bench --scenario alignment-yaml-routing --agent both --runs 3 --chunk-size 3 --pause 0`.
- Extend the benchmark harness to resolve either `--skill <skill>` or `--scenario <scenario>`, persisting reports under `tests/benchmarks/runs/alignment-yaml-routing-<agent>-<sessionId>/`.
- Create `tests/layer4/setups/alignment-yaml-routing.setup.ts` with a seeded temp repo containing minimal `alignment/`, `interrogation/`, `research/_working/`, and task docs.
- Each run writes one deterministic artifact: `routing-compliance-result.json`, with:
  - `case_id`
  - `selected_command`
  - `selected_source`: `invoke_comment | root_command | agent_routing | rejected`
  - `action`: `consume-approval | route-parent | request-correction | reject-invalid-yaml | repo-mismatch`
  - `reason`
  - `ignored_noise`
  - `would_mutate`
- Hard assertions check that the agent chooses the expected command/action for each case and does not mutate unrelated files.
- Add a quality rubric that grades:
  - route-source precedence
  - resistance to noisy surrounding text
  - correct rejection of malformed or mismatched YAML
  - fresh-session behavior without asking for another clear
  - no downstream `$exec`/`/exec` leakage before approval handling

## Scenario Matrix
- `happy_alignment_full`: YAML starts with `# Invoke with: <command>`, then matching root `command` and `agent_routing.command`; expect consume/route to that command.
- `route_matrix_no_comment`: root `command` plus matching `agent_routing.command`, no comment; expect command compliance but note missing attention cue.
- `comment_only_missing_command`: comment exists but root `command` is absent; expect rejection or correction request, not execution.
- `comment_root_mismatch`: comment conflicts with root `command`, while root `command` matches `agent_routing.command`; expect root command wins and mismatch is reported.
- `root_agent_routing_mismatch`: root `command` conflicts with `agent_routing.command`; expect rejection as invalid self-routing YAML.
- `messy_context`: valid YAML surrounded by stale prose, old commands, and bad extra instructions; expect valid YAML command wins and noise is ignored.
- `wrong_repo_or_missing_page`: YAML names a missing page/path; expect repo/page mismatch surfaced and no mutation.
- `interrogation_round`: valid interrogation round YAML with root `command` and `agent_routing.command`; expect parent command routing and sidecar-oriented action, not child/framework routing.

## Test Plan
- Static checks:
  - `pnpm --dir tests exec vitest run --project layer1 layer1/bench-setups.test.ts layer1/bench-coverage.test.ts`
  - Add layer1 assertions that `--scenario alignment-yaml-routing` is listed and does not pollute repository skill coverage.
- Harness smoke:
  - `pnpm --dir tests bench --scenario alignment-yaml-routing --agent codex --runs 1 --chunk-size 1 --pause 0`
- Full benchmark:
  - `pnpm --dir tests bench --scenario alignment-yaml-routing --agent both --runs 3 --chunk-size 3 --pause 0`
- Existing routing checks:
  - `node scripts/skill-alignment-routing-audit.mjs --report`
  - `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts layer1/interrogation-confidence-gate.test.ts --reporter=dot`
- Final hygiene:
  - `node scripts/audit-task-docs.mjs`
  - `git diff --check`

## Assumptions
- The benchmark measures fresh-session routing compliance and rejection behavior; it should not require the agents to complete the full domain work of every referenced parent skill.
- Root `command` is the enforceable parser contract. The `# Invoke with:` comment is an attention cue and should never override a valid root command.
- When root `command` and `agent_routing.command` disagree, the correct behavior is to reject or request correction.
- Full adversarial coverage is preferred, with separate grade notes for happy path, route matrix, messy context, and malformed/bad-input cases.
