---
name: commit-and-push-by-feature
description: Commit and push all changes to GitHub grouped by logical feature/function buckets with conventional commit messages
type: shipping
version: v0.0
---

# Commit And Push By Feature

Invoke as `$commit-and-push-by-feature`.

Use this skill when the user wants current changes committed and pushed in sensible feature-oriented buckets rather than one undifferentiated commit.

## Workflow

1. Inspect `git status` and relevant diffs to understand the change set.
1b. For non-trivial mutations, confirm the caller has produced a `docs/quality-gate-contract.md` ship manifest for the exact shipping boundary before staging. The manifest must include: User goal, Changed files, Per-file purpose, User-goal mapping, Tests run, Skipped tests, Adversarial review, Residual risk, Rollback note, and Next command.
1c. If the change set includes non-trivial source changes, confirm the manifest records a targeted `quality-sweep audit`, `$expert-review`, configured review lane, or explicitly justified equivalent adversarial review. If the review is missing, stop before committing.
1d. Confirm validation evidence distinguishes executable checks from documentation-only or task-only checks. If non-trivial source changes rely only on documentation/task checks, stop before committing unless the manifest gives a concrete skipped-test rationale and residual-risk explanation.
1e. If the work being shipped follows a user correction, confirm the pre-commit ship manifest proves the exact shipping boundary includes a `tasks/lessons.md` update for the current correction. Treat the correction as repeatable unless the manifest proves otherwise. If it exposed a workflow failure, confirm the same shipping boundary includes the relevant skill contract, validation script, fixture, or test enforcement update, or a `Correction enforcement:` entry with the blocker or not-applicable rationale and the concrete follow-up file/command when needed.
2. Partition changes into logical buckets such as `auth`, `api`, `ui`, `tests`, `docs`, `build`, or `refactor`.
3. Prefer 2 to 6 commits unless the change set is genuinely tiny.
4. For each bucket:
   - Stage only the files for that bucket
   - Verify the staged diff matches the intended scope
   - Commit with a conventional message such as `feat(scope): summary`, `fix(scope): summary`, `refactor(scope): summary`, `test(scope): summary`, `docs(scope): summary`, or `chore(scope): summary`
5. Do not leave unrelated tracked changes behind. Either bucket them too or stop and explain the blocker.
6. Determine the primary branch: prefer `main`; if it does not exist, use `master`. If neither exists, stop and explain the blocker.
7. Ensure the commits land on the primary branch from step 6:
   - If already on `main` or `master`, stay there.
   - If on any other branch, switch to the primary branch before committing and pushing. Carry the working tree across only if it can be done safely.
   - If switching would discard work, introduce conflicts you cannot resolve confidently, or otherwise prevent a safe move onto the primary branch, stop and explain the blocker. Do **not** push the feature branch instead.
8. Push the resulting commits to the primary branch. `commit-and-push-by-feature` means commit **and** push when the workflow succeeds.

## Safety

- Do not amend or rewrite history unless the user explicitly asks.
- Stop if you detect likely secrets or credentials in the diff.
- If hooks or tests fail and the expected fix is straightforward, fix them and continue; otherwise report the blocker.
- Do not commit or push a non-trivial mutation without a ship manifest that covers the exact files being shipped. If unrelated tracked changes are present, the manifest must identify which files are included and why the remaining files are safe to leave untouched.
- Do not treat documentation-only or task-only checks as sufficient executable verification for source changes. Require a skipped-test rationale when no executable check was run.
- Do not ship a user-correction follow-up unless the manifest proves the current correction's `tasks/lessons.md` update is in the exact shipping boundary and includes either an enforcement update or a `Correction enforcement:` rationale. If claiming an existing rule already covers the correction, require the manifest to cite the exact file and rule/check and explain why it would have prevented the corrected behavior.

## Output

Report:

- Branch name
- Commits created, with hash and subject
- Final `git status` outcome


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/commit-and-push-by-feature-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/commit-and-push-by-feature-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- For non-trivial mutations, report the ship manifest location or summarize its required fields in the final output.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
