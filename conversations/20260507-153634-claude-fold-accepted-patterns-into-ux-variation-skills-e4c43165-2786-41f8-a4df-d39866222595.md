# Fold accepted patterns into UX variation skills

| Field | Value |
|-------|-------|
| **Date** | 2026-05-07 15:36:34 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `e4c43165-2786-41f8-a4df-d39866222595` |
| **Entrypoint** | cli |
| **Version** | 2.1.132 |

---

## User _15:36:34_

Implement the following plan:

# Plan: Fold Consistently-Accepted Patterns into ux-variation, ui-interview, and ui-consolidate

## Context

Session analysis across 9 invocations of `/ux-variation` and `/ui-interview` (4 projects, 10 days) revealed that the user consistently accepts certain recommendations and consistently overrides others. The skills currently ask questions the user always answers the same way, wasting interview turns. Conversely, the skills recommend scope-narrowing that the user always rejects. These patterns should be baked into the skill defaults.

## Files to modify

1. `global/claude/ux-variation/SKILL.md` (199 lines)
2. `global/claude/ui-interview/SKILL.md` (110 lines)
3. `global/claude/ui-consolidate/SKILL.md` (127 lines) — minor, only if cross-references need updating

## Changes

### A. `ux-variation/SKILL.md`

**A1. Default variant breadth to "very different"** (step 4, interview)
- Add instruction after the interview step intro: "Default to maximally contrasting archetypes. Do not ask how different variants should be — assume dramatic contrast unless the user explicitly requests graduated steps."
- Remove or skip the breadth question from the interview checklist.

**A2. Default to 5 archetypes, skip count question** (step 5)
- Change "Produce 3 to 5 variations unless the user requests a different count" → "Produce 5 variations by default. Present the concepts for adjustment — do not ask the user to choose a count first."

**A3. Reframe concept-selection checkpoint** (step 6)
- Current options: Keep all / Remove one / Merge concepts / Make one bolder / Add another
- New options: Keep all / Make one concept bolder or more extreme / Add another concept
- Remove "Remove one" and "Merge concepts" — user never uses these pre-build. Add note: "Do not ask the user to remove or merge concepts before they have been built. Pre-build narrowing is consistently rejected."

**A4. Don't recommend building a subset** (step 8)
- Current: "Recommend the cheapest useful validation method: static mockups, clickable prototype, feature-flagged implementation..."
- New: "Recommend serial full buildout of all approved variants. Do not recommend building a subset first — the user's consistent preference is to build all variants before evaluating. After all are built, recommend `/ui-consolidate`."

**A5. Default evaluation to "build and gut-check"** (step 4)
- Add: "Default evaluation method is: build each variation and evaluate by using it. Do not ask who will judge or how — assume solo evaluator building and gut-checking unless the user states otherwise."

**A6. Add "Make this a variant axis" as default option** (step 4)
- Add instruction: "When presenting a design decision with 3+ plausible answers during the interview, always include 'Make this a variant axis (test all approaches)' as an option. When the user has already chosen 'test all' for a prior question in the same session, default subsequent ambiguous decisions to variant axes without asking."

**A7. Don't lock shared constraints between variants** (step 5 or new constraint)
- Add to Constraints section: "Do not enforce shared design constraints across variations. Each variation independently decides layout, density, color, navigation, and component choices. Only technical stack (framework, renderer, design system tokens) is shared unless the user explicitly locks a shared constraint."

### B. `ui-interview/SKILL.md`

**B1. Include full accessibility by default** (step 4, page-by-page)
- Add instruction near the accessibility bullet in step 4: "Include color-blind safe patterns, keyboard navigation, reduced motion support, and screen reader labels by default in every spec. Do not present accessibility features as optional checkboxes. Only ask about domain-specific accessibility (gamepad support, dyslexia fonts) when the product context warrants it."

**B2. Strengthen "treat inputs as draft material"** (step 2)
- Current: "Do not assume the current UI, prompt, screenshot, or mockup is final."
- Add: "Product specs, ICP documents, and journey maps are reference material, not locked constraints. The user may override any product decision during the interview. When a user's interview answer contradicts an existing spec, adopt the interview answer and note the divergence."

**B3. Reference questions optional** (step 5)
- Add: "Reference and inspiration questions ('apps you admire?') are low-priority. Ask once early, accept any answer including 'none' or 'let's experiment,' and move on. Do not block the interview on reference input."

### C. `ui-consolidate/SKILL.md`

No structural changes needed. The consolidation skill's design already aligns with user behavior (it doesn't pre-narrow, it lets the user cherry-pick post-build). Only update if cross-references to ux-variation step numbers shift.

## Validation

1. `./install.sh` — reinstall skills
2. `./scripts/skill-deps.sh --broken` — check for broken dependencies
3. `./scripts/skill-versions.sh --missing` — check version metadata
4. `./scripts/skill-next-step-routing.sh --missing` — check next-step routing
5. `rg "variant breadth\|how different\|cheapest useful\|Remove one\|Merge concepts" global/claude/ux-variation/SKILL.md` — confirm old patterns are gone
6. `rg "variant axis\|dramatic contrast\|full buildout\|gut-check\|shared design constraints" global/claude/ux-variation/SKILL.md` — confirm new patterns present
7. `rg "accessibility.*optional\|a11y.*checkbox" global/claude/ui-interview/SKILL.md` — confirm a11y is not optional
8. `git diff --check`
9. Commit and push


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/a9991a03-df22-42da-8571-d9ffaaa612eb.jsonl

## Assistant _15:36:40_

I'll start by reading the three skill files to understand the current content before making changes.

## Assistant _15:36:40_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/ux-variation/SKILL.md`

</details>

## Assistant _15:36:41_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/ui-interview/SKILL.md`

</details>

## Assistant _15:36:41_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/global/claude/ui-consolidate/SKILL.md`

</details>

## Assistant _15:36:51_

Now I'll implement all the changes. Starting with `ux-variation/SKILL.md` (changes A1–A7) and `ui-interview/SKILL.md` (changes B1–B3) in parallel.

**A1: Default variant breadth to "very different"** — adding instruction to step 4 and removing breadth question.

**A2: Default to 5 archetypes, skip count question** — updating step 5.

**A3: Reframe concept-selection checkpoint** — updating step 6 options.

**A4: Don't recommend building a subset** — updating step 8.

**A5: Default evaluation to "build and gut-check"** — adding to step 4.

**A6: Add "Make this a variant axis"** — adding to step 4.

**A7: Don't lock shared constraints** — adding to Constraints section.

## Assistant _15:37:05_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/ux-variation/SKILL.md`

</details>

## Assistant _15:37:10_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/ux-variation/SKILL.md`

</details>

## Assistant _15:37:18_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/ux-variation/SKILL.md`

</details>

## Assistant _15:37:25_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/ux-variation/SKILL.md`

</details>

## Assistant _15:37:28_

Now A7 — adding the shared constraints rule to the Constraints section:

## Assistant _15:37:31_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/ux-variation/SKILL.md`

</details>

## Assistant _15:37:34_

Now the `ui-interview/SKILL.md` changes (B1, B2, B3):

## Assistant _15:37:39_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/ui-interview/SKILL.md`

</details>

## Assistant _15:37:47_

B1 — accessibility default in step 4:

## Assistant _15:37:51_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/ui-interview/SKILL.md`

</details>

## Assistant _15:37:53_

B3 — reference questions optional in step 5:

## Assistant _15:37:59_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/global/claude/ui-interview/SKILL.md`

</details>

## Assistant _15:38:02_

All edits done. Now running the validation steps.

## Assistant _15:38:02_

<details><summary>Tool calls</summary>

- Bash: Reinstall skills

</details>

## Assistant _15:38:04_

<details><summary>Tool calls</summary>

- Bash: Confirm old patterns are gone

</details>

## Assistant _15:38:05_

<details><summary>Tool calls</summary>

- Bash: Confirm new patterns present

</details>

## Assistant _15:38:06_

<details><summary>Tool calls</summary>

- Bash: Confirm a11y is not optional

</details>

## Assistant _15:38:21_

The "variant breadth" and "how different" matches are in the correct context — the assumptions manifest still lists it as a surface item, and the new instruction says "Do not ask how different." The old question patterns ("Remove one", "Merge concepts", "cheapest useful") are gone. All new patterns are confirmed present. The a11y grep confirms accessibility is framed as mandatory, not optional.

## Assistant _15:38:23_

<details><summary>Tool calls</summary>

- Bash: Check for broken skill dependencies

</details>

## Assistant _15:38:23_

<details><summary>Tool calls</summary>

- Bash: Check version metadata

</details>

## Assistant _15:38:23_

<details><summary>Tool calls</summary>

- Bash: Check next-step routing

</details>

## Assistant _15:38:24_

<details><summary>Tool calls</summary>

- Bash: Check for whitespace errors

</details>

## Assistant _15:40:12_

All validation passes. Now committing and pushing.

## Assistant _15:40:12_

<details><summary>Tool calls</summary>

- Bash: Show working tree status

</details>

## Assistant _15:40:13_

<details><summary>Tool calls</summary>

- Bash: Show diff summary

</details>

## Assistant _15:40:13_

<details><summary>Tool calls</summary>

- Bash: Show recent commits

</details>

## Assistant _15:40:18_

<details><summary>Tool calls</summary>

- Bash: Commit skill changes

</details>

## Assistant _15:40:21_

<details><summary>Tool calls</summary>

- Bash: Push to remote

</details>

## Assistant _15:40:30_

Done. All changes committed and pushed as `e41ad4b`.

**Summary of changes:**

`ux-variation/SKILL.md`:
- **A1**: Default to dramatic contrast, don't ask about breadth
- **A2**: Default to 5 variations, don't ask for a count
- **A3**: Removed "Remove one" and "Merge concepts" from checkpoint options; added note that pre-build narrowing is rejected
- **A4**: Recommend serial full buildout of all variants instead of cheapest validation
- **A5**: Default evaluation to solo build-and-gut-check
- **A6**: Added "Make this a variant axis" affordance for ambiguous decisions
- **A7**: Each variation independently decides all design constraints; only tech stack is shared

`ui-interview/SKILL.md`:
- **B1**: Accessibility is mandatory by default, not an optional checkbox
- **B2**: Specs/ICPs/journey maps are overridable reference material; interview answers win
- **B3**: Reference/inspiration questions are low-priority and non-blocking

`ui-consolidate/SKILL.md`: No changes needed — no step-number cross-references shifted.

## User _17:09:53_

<command-message>ship-end</command-message>
<command-name>/ship-end</command-name>

## User _17:09:53_

Base directory for this skill: /Users/georgele/.claude/skills/ship-end

# Ship End

Wrap up the current session: mark progress, commit, and push.

## Process

1. **Check for changes:**
   - Run `git status` and `git diff` to see all changes.
   - If the working tree is clean and no unpushed commits: report "nothing to ship" and stop.

2. **Update task tracking:**
   - Update `tasks/todo.md` — mark completed items as done, note any outstanding items or blockers.
   - Update milestone progress in `tasks/roadmap.md` if criteria were met.
   - Check `tasks/manual-todo.md` (if it exists) — note the status of manual tasks (how many checked vs unchecked). Do NOT modify checked items.
   - Check `tasks/record-todo.md` and `tasks/recurring-todo.md` if they exist — note unchecked advisory counts only. Do NOT treat them as blockers unless an item has been promoted into `tasks/todo.md`.
   - Update `tasks/history.md` — append a brief record of what was accomplished this session (phase/step completed, key changes). Create it if it doesn't exist.

3. **Deploy:**
   - Find the deploy method by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   - Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   - If no deploy method is found, ask the user how deployment works. Do not guess or skip.
   - Run the deploy and verify the output for errors.
   - Do not run `aws sso login` preemptively from stale context, old logs, or assumptions. If the deploy method uses an AWS profile and auth status is uncertain, first run `aws sts get-caller-identity --profile <profile>` using the profile from the deploy contract or deploy command.
   - If the AWS identity check succeeds, proceed directly with the deploy and do not run `aws sso login`.
   - If the AWS identity check or the deploy command fails because AWS SSO credentials are missing or expired, do not skip deployment. Run the matching `aws sso login --profile <profile>` command, using the profile from the deploy contract, deploy command, or error output.
   - When `aws sso login` prints a browser URL, device code, or verification instructions, relay them to the user and tell them to navigate to the provided URL and complete the login in their browser. Keep the login command running until it succeeds, fails, or times out.
   - After a successful SSO login, rerun the original deploy command once. This auth recovery is part of the same deploy attempt, not an automatic retry of a failed deploy.
   - If the user cannot complete SSO login or the login command fails, report the deploy as blocked by authentication. Do not report it as skipped.
   - If the deploy fails, report the error. Do not retry automatically.

4. **Ship the session changes:**
   - Use the `/commit-and-push-by-feature` workflow: group changes into logical feature/function buckets, use conventional commit messages, land the resulting commits on `main` or `master`, and push them there when the workflow succeeds.

5. **Report session summary:**
   - What was accomplished
   - Deploy status (if deployed)
   - Test status — explicitly state whether any failing tests are expected (red phase: tests written before implementation) or unexpected (regressions/bugs that need fixing)
   - What's outstanding
   - Branch and commit list
   - Confirm working tree is clean

## Output Format

```
## Session Summary
- **Accomplished**: [what was done]
- **Deploy**: [status]
- **Tests**: [pass/fail — expected or unexpected]
- **Manual tasks**: [X/Y complete, or "none"]
- **Advisory tasks**: [record/recurring counts, or "none"]
- **Outstanding**: [remaining work]
- **Branch**: [branch name]
- **Commits**: [list]
- **Working tree**: clean
- **Next work:** [specific task, blocker, verification gap, or "none"]
- **Recommended next command:** [one command or route]
```

## Next-Step Routing

Before closing out the session, identify the next concrete work item from project state, then recommend the executor and invocation.

Output exactly two lines beyond the normal session summary:

- **Next work:** <specific task name, manual blocker, verification gap, or "none">
- **Recommended next command:** <one command or route>

Rules:

- Make the next work item primary. Derive it from `tasks/todo.md`, `tasks/manual-todo.md`, deploy status, validation gaps, smoke-test gaps, outstanding session work, or the absence of any remaining work. Do not use agent mode itself as the next work item.
- Use `./scripts/agent-mode.sh` only to choose command text. If it is missing, unset, or non-zero, infer routing from the current invocation and task type instead of asking the user to select a mode by default.
- Inference defaults:
  - Hybrid execution handoff → recommend `/delegate $run`.
  - Claude-only or orchestration-heavy work → recommend `/run`.
  - Codex-only execution → recommend `$run`.
  - External human-only manual work (browser/auth/DNS/service dashboard work with no reliable authenticated CLI/API path, paid account setup, real-device checks, or production smoke-test work needing human sign-off) → recommend `/guide` or a Claude-guided manual step rather than `/run`.
  - Agent-executable work misfiled in `tasks/manual-todo.md`, task-doc bookkeeping, stale `tasks/manual-todo.md` cleanup, or reconciliation against repo/history reality → recommend `/reconcile-dev-docs fix tasks`, promotion to `tasks/todo.md`, or a direct dev-doc audit, not `/guide`.
- Only present multiple commands when the ambiguity materially changes execution safety or there are equally valid next work items. Otherwise choose the best route and mention degraded mode lookup inline.

## Constraints

- **Fix unrelated issues:** If any step surfaces errors, warnings, or lint issues — even ones unrelated to the current work — investigate and fix them before continuing. Commit these fixes separately with a descriptive message.
- Do NOT modify CLAUDE.md. CLAUDE.md is for project conventions and config only — not progress tracking.
- Progress and active work go in `tasks/todo.md`. Completed work history goes in `tasks/history.md`.
- Do not execute or block wrap-up on `tasks/record-todo.md` or `tasks/recurring-todo.md` items unless they were explicitly promoted into `tasks/todo.md`.
- Do not switch branches or create new branches unless the current state requires it.
- Do not amend or rewrite history.
- Do not commit secrets.
- Do not push session-wrap-up commits to an existing feature branch. Use `/commit-and-push-by-feature` to move the work onto `main` or `master` and push it there, or stop and report a blocker if that cannot be done safely.
- If pre-commit hooks fail, fix and retry.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.

## Assistant _17:09:57_

<details><summary>Tool calls</summary>

- Bash: Check repo state

</details>

## Assistant _17:09:58_

<details><summary>Tool calls</summary>

- Bash: Check task files

</details>

## Assistant _17:10:01_

Working tree is clean, commit already pushed. Let me update task tracking.

## Assistant _17:10:02_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _17:10:02_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/history.md`

</details>

## Assistant _17:10:03_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/roadmap.md`

</details>

## Assistant _17:10:07_

Working tree is clean, commit `e41ad4b` already pushed. I need to update task docs for this session.

## Assistant _17:10:15_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/history.md`

</details>

## Assistant _17:10:18_

Now check for manual-todo, record-todo, recurring-todo:

## Assistant _17:10:19_

<details><summary>Tool calls</summary>

- Bash: Check for optional task files

</details>

## Assistant _17:10:22_

No optional task files. Now commit and push the task doc update.

## Assistant _17:10:23_

<details><summary>Tool calls</summary>

- Bash: Commit and push task doc update

</details>

## Assistant _17:10:33_

## Session Summary
- **Accomplished**: Folded consistently-accepted user patterns into `ux-variation/SKILL.md` (7 changes: default 5 dramatic-contrast variants, skip breadth/count/evaluator questions, remove pre-build narrowing, require full buildout, add variant-axis affordance, unlock per-variation design constraints) and `ui-interview/SKILL.md` (3 changes: mandatory accessibility, overridable specs, deprioritized reference questions). No changes needed to `ui-consolidate`.
- **Deploy**: N/A (skill repo, `./install.sh` run successfully)
- **Tests**: All validation scripts passed (skill-deps, skill-versions, skill-next-step-routing, git diff --check, targeted rg scans)
- **Manual tasks**: none
- **Advisory tasks**: none
- **Outstanding**: none
- **Branch**: master
- **Commits**: `e41ad4b` fix(skills): bake consistently-accepted patterns into ux-variation and ui-interview, `ab6b897` docs: record session
- **Working tree**: clean
- **Next work:** none — Phase 31 remains the latest completed phase. Run brainstorm to discover a candidate next phase.
- **Recommended next command:** `/brainstorm`
