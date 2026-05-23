---
name: scaffold
description: Generate a new package or app in the monorepo following established project conventions
type: execution
version: v0.0
---

# Scaffold

Invoke as `$scaffold`.

Use this skill when the user wants to create a new package or app in their monorepo.

For product/app workflows, `$scaffold` is normally downstream of research, prototype consolidation, production specification, roadmap, and phase planning. Use it when `$roadmap`/`$plan-phase` identifies that the next implementation step needs a new app/package root. Do not route from `$concept-exploration`, `$bootstrap-repo`, `$icp`, `$competitive-analysis`, `$journey-map`, `$ux-variations`, or `$ui-interview` directly to `$scaffold` unless the user explicitly asks to create a minimal shell first.

## Workflow

1. Parse the type (package/app) and name from arguments.
2. Check `.agents/project.json`. If it is missing, run or recommend `$pack recommend` and include the likely project type in the scaffold plan.
3. If the scaffold creates a new project root, include `.agents/project.json` and install the matching local pack with `scripts/pack.sh install <pack>` after the root exists.
4. Learn conventions from CLAUDE.md, AGENTS.md, `.agents/project.json`, and monorepo config.
5. Find the most recently created package/app as a template.
6. Present the scaffold plan and wait for approval. Use `update_plan` to track the work; use `request_user_input` only if the session is already in Plan mode and a structured choice would help.
7. Generate files, adapting the template with the new name.
8. Run install and type-check to verify.

## Output Format

- **Scaffolded**: type, name, location
- **Files Created**: list of generated files
- **Next Steps**: what to do after scaffolding

## Next-Step Routing

- If the scaffold was created as part of an active roadmap/phase, recommend `$run` to continue the current implementation step.
- If the user explicitly requested an early shell before research, keep the next route on the research-first product workflow: `$icp` when the concept is ready and business-discovery is enabled, otherwise `$pack install business-discovery`.
- If the scaffold is for a non-product package with no pending roadmap item, recommend `$roadmap` or `$plan-phase` only when implementation sequencing is missing.

## Constraints

- Always use an existing package as the reference template.
- Do not install domain packs globally; use project-local pack symlinks.
- Present the plan and get approval before creating files. Do not assume a Claude-style `EnterPlanMode` or clear-context accept flow exists.
- Keep the scaffold minimal — no unnecessary boilerplate.
- Do not treat scaffolding as product validation. It creates structure only; ICP, market, journey, UX, UI, and prototype decisions belong to their upstream skills.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/scaffold-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/scaffold-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
