---
name: visible-uat
description: Execute deterministic visible UAT against local desktop, web, and app surfaces using Computer Use or the available visible UI tool, with reportable PASS/FAIL/BLOCKED evidence
type: action
version: v0.0
release_lane: canary
argument-hint: "[required: UAT scope, app surface, journey, feature, or bug/release area]"
context_intake: artifact_first
---

# Visible UAT

Invoke as `/visible-uat`.

Conduct deterministic visible user acceptance testing for local desktop, web, and app surfaces. This skill runs the product through the visible UI using Computer Use or the available visible UI tool, records observable evidence, and produces a Markdown UAT report.

`visible-uat` is distinct from `/uat`. `/uat` creates human-run UAT plans and must not run or operate the product. `visible-uat` executes UAT through visible inspection and interaction; use it only when the user asks the agent to perform the UAT run.

Do not silently substitute automated tests for Computer Use or visible UI observations. Automated checks are supplemental and may run only after visible UAT observations are complete.

## Safety Boundary

- Do not change app source during UAT unless the user explicitly changes the task from UAT to implementation.
- Do not use repo-tracked files for transient setup.
- Create temporary setup scripts under `/tmp` only.
- Use setup scripts only to seed deterministic states, fixtures, accounts, profiles, or files through existing safe setup APIs.
- If setup reveals missing hooks, record `BLOCKED` with the missing hook and reproduction detail; do not patch hooks as part of UAT.
- Respect Computer Use confirmation policy for risky UI actions such as purchases, account deletion, external sends, credential changes, destructive data edits, or actions outside the requested test surface.
- Stop every app, desktop process, browser process, and dev server started for the UAT before final handoff.

## Process

1. **Read instructions and scope**
   - Read project instructions such as `AGENTS.md`, `CLAUDE.md`, `.agents/project.json`, README files, and any user-supplied UAT scope.
   - Identify the requested local surface, target user journey, acceptance goal, and any risk boundaries.
   - If the UAT scope is too broad for a deterministic run, choose the smallest representative run and state the narrowed run name in the report.

2. **Identify launch and setup hooks**
   - Inspect package scripts, Makefiles, task docs, smoke tests, seed scripts, fixture utilities, dev-server docs, and app launch instructions.
   - Prefer existing test/smoke hooks, launch commands, and safe setup APIs over ad hoc setup.
   - Identify whether isolated state is possible through temp `HOME`, userData, profile, workspace, database, cache, or storage paths.
   - If no safe deterministic setup exists for a required state, record `BLOCKED` instead of changing app code.

3. **Prepare isolated deterministic state**
   - Create any temporary setup script under `/tmp`, with a path that includes the run slug or timestamp.
   - Keep setup idempotent where possible and document the exact temp script path in the report.
   - Launch the product with isolated test state where possible, such as temp `HOME`, userData, browser profile, app data, or workspace paths.
   - For intermediate states that matter, use manual-gated setup stages and explicit checkpoints rather than timers. A manual-gated stage means the run stops at a named setup checkpoint, records the observed state, and proceeds only after the checkpoint is visibly satisfied or intentionally marked `BLOCKED`.

4. **Run visible UAT**
   - Start every visible interaction turn with the visible UI state tool, such as Computer Use `get_app_state` or the currently available visible UI inspection tool.
   - Prefer accessibility-tree element clicks, typed values, key presses, and control-specific actions over coordinate clicks.
   - Use coordinates only when no stable accessible target exists, and record that limitation in failure notes or run notes.
   - Use visible UI inspection and interaction for assertions. Do not rely on app-internal JavaScript state, local storage, database rows, logs, or API responses as the observed result when visible UI can be inspected.
   - Capture screenshots or visible tool references when an observed result is surprising, failing, ambiguous, or important to reproduce.

5. **Record the report while running**
   - Write the Markdown report under `docs/testing/` unless the repo has a stronger convention.
   - Update the report after each run, not only at the end.
   - Include the run name and timestamp, setup used including temp script path, a populated step table, failure notes, and screenshot references when applicable.
   - No actual, expected, or result cell may be blank.
   - Mark each run exactly `PASS`, `FAIL`, or `BLOCKED`.

6. **Run supplemental automated checks**
   - After visible UAT is complete, run relevant automated checks only if they are safe and directly related.
   - Label automated checks as supplemental in the report.
   - Keep automated check output separate from visible UAT observations.

7. **Clean up and hand off**
   - Stop all processes started for the UAT before final handoff.
   - Leave `/tmp` setup scripts available when they are referenced by the report and useful for reproduction.
   - Summarize run status, report path, failures, blockers, screenshots, supplemental checks, and cleanup performed.

## Report Template

Create or update a report like:

```markdown
# Visible UAT Report - [Surface or Feature]

## Summary

| Run | Timestamp | Status | Reported evidence |
|---|---|---|---|
| [Run name] | [YYYY-MM-DD HH:MM timezone] | PASS/FAIL/BLOCKED | [short evidence pointer] |

## Run: [Run name]

- Timestamp: [YYYY-MM-DD HH:MM timezone]
- Scope: [requested journey, feature, release, or bug area]
- Setup used: [commands and isolated state paths]
- Temp setup script: [/tmp/path or `None`]
- Launch command: [command or app launch path]
- Visible UI tool: [Computer Use or other visible UI tool]

| Step | Action | Observed result | Expected result | Result |
|---|---|---|---|---|
| 1 | [visible action performed] | [actual visible observation] | [expected visible state] | PASS/FAIL/BLOCKED |

### Failure Notes

- [For each FAIL or BLOCKED step, include enough detail to reproduce, including prior state, action, observed UI, expected UI, and screenshot/tool reference when applicable.]

### Screenshots and References

- [screenshot path, visible tool reference, or `None`]

## Supplemental Automated Checks

| Check | Command | Result | Notes |
|---|---|---|---|
| [check name] | [command] | PASS/FAIL/BLOCKED/SKIPPED | [brief output or reason] |
```

## Result Rules

- `PASS`: the visible UI completed the user journey and every expected visible result appeared.
- `FAIL`: the visible UI was reachable but did not match expected behavior.
- `BLOCKED`: the run could not reach a valid assertion point because of missing hooks, launch failure, environment failure, unavailable credentials, unsafe action boundaries, or missing deterministic setup.

Failure notes must include enough detail to reproduce the issue. If a failure has no screenshot reference, state why no screenshot was captured.
