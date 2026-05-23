---
name: commit-and-push-by-feature
description: Commit and push all changes to GitHub grouped by logical feature/function buckets with conventional commit messages
type: shipping
version: v0.0
argument-hint:
---

# Commit and Push by Feature

Commit and push all changes to GitHub grouped by feature/function.

## Process

1. **Inspect changes:**
   - Run `git status` and `git diff` to understand all changes.

2. **Identify logical buckets:**
   - Group changes into feature/function buckets (e.g., "auth", "api", "ui", "tests", "docs", "build", "refactor"). Prefer 2–6 commits total unless the change set is tiny.

3. **Commit each bucket:**
   - For each bucket:
     - Stage only the files for that bucket (use `git add <paths>`; avoid `git add -A` unless it's the final bucket and everything belongs together).
     - Create a conventional commit message:
       - `feat(<scope>): <summary>` for new functionality
       - `fix(<scope>): <summary>` for bug fixes
       - `refactor(<scope>): <summary>` for refactors without behavior change
       - `test(<scope>): <summary>` for tests only
       - `docs(<scope>): <summary>` for documentation
       - `chore(<scope>): <summary>` for tooling/config
     - Include a short body only if it clarifies intent or risk.
     - Verify `git diff --cached` matches the bucket before committing.
   - If there are uncommitted leftover changes at the end, bucket them; do not leave a dirty working tree.

4. **Branch handling:**
   - Determine the primary branch: prefer `main`; if it does not exist, use `master`. If neither exists, stop and explain the blocker.
   - Ensure the commits land on the primary branch.
   - If already on `main` or `master`, stay there.
   - If on any other branch, switch to the primary branch before committing and pushing. Carry the working tree across only if it can be done safely.
   - If switching would discard work, introduce conflicts you cannot resolve confidently, or otherwise prevent a safe move onto the primary branch, stop and explain the blocker. Do not push the feature branch instead.

5. **Push and report:**
   - Push the resulting commits to the primary branch. `commit-and-push-by-feature` means commit and push when the workflow succeeds.
   - Output a concise summary: branch name, list of commits (hash + subject), confirmation that working tree is clean, and whether push was performed or blocked.

## Output Format

```
## Commits
| Hash | Message |
|------|---------|
| abc1234 | feat(auth): add OAuth2 login flow |
| def5678 | docs(readme): update setup instructions |

Branch: current branch
Working tree: clean
```

## Constraints

- Do not amend or rewrite history unless explicitly asked.
- Do not commit secrets; if you detect likely secrets, stop and report before committing.
- If pre-commit hooks/tests fail, fix and retry.


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
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
