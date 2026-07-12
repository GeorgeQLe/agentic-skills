## Repo-Specific: Do Not Install Skills In This Directory

**This repository IS the skillpacks source of truth, so skill installation does not work here.** In this directory specifically, never run `npx skillpacks install <pack-or-skill>`, `npx skillpacks init`, `npx skillpacks which`, or any other skillpacks install/package command to obtain or enable a skill — it does not work in this repo and is never the correct fix. Every skill already exists in-tree at `packs/<pack>/{claude,codex}/<skill>/SKILL.md`. To use a skill, run it directly from its written convention in `packs/**` (or the runtime `.codex/skills/**` / `.claude/skills/**` copies produced by `scripts/pack.sh refresh`).

This overrides every instruction below (and any routing from `/ship`, Missing Skill Fallback, Cross-Pack Routing, or a recommended-next-command handoff) that would tell you to run or suggest an `npx skillpacks install`/`init` command as a prerequisite for an unavailable or not-enabled pack. In this repo, treat the skill as present in-tree and run it from its source SKILL.md instead of recommending an install. The only skillpacks-related command used here is `scripts/pack.sh refresh`, which republishes the local runtime skill copies from source — it is not an install.

<!-- provision-agentic-config v0.16 -->
## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Verification is mandatory, but routine no-op verification runs inside the active execution/shipping step. Enter plan mode for non-trivial remediation or new work discovered by verification, not for validation that already has clear commands and no expected source changes.
- Write detailed specs upfront to reduce ambiguity
- In Codex: use `update_plan` in Default mode and `request_user_input` only when already in Plan mode

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution
- For `agent-team` parallel write lanes, require separate non-primary GitHub branches per lane and include a consolidation/PR review step before final integration.

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### Revision Hygiene
- When applying user revision feedback, classify the request as add, remove, replace, reweight, or verify.
- For remove, replace, or reweight requests, update the artifact toward the requested final state.
- Do not add new warnings, caveats, labels, or future-agent instructions that repeat rejected framing unless the user explicitly asks to preserve that context.

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff your behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing tests without being told how

### 7. Monorepo Parallel-Work Safety
- NEVER run `pnpm install`, `pnpm add`, `npm install`, `yarn add`, or any command that modifies a shared lockfile (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`) when running as one of multiple parallel agents in a monorepo
- All dependency changes must be pre-staged in a single serial session before parallel work begins
- Parallel agents must only write files within their own package directory (e.g. `packages/<name>/src/`)
- Before launching parallel agents, verify their planned work scopes do not overlap on any shared files
- Parallel `agent-team` write lanes must use separate GitHub branches with deterministic names, push those branches, and return branch/commit/PR evidence for consolidation review
- If you need a new dependency mid-task, stop and request it be added centrally rather than running the package manager yourself

### Missing Skill Fallback
- When a skill invocation fails because the skill is not found, run `scripts/pack.sh which <skill-name>` to check if the skill exists in an available pack.
- If found in an uninstalled pack, recommend `npx skillpacks install <pack-or-skill>` from the project shell for either the skill or the full pack, and note the post-install reload path: Claude Code `/reload-skills` first, `/clear` can pick up the refreshed registry, restart if the top-level `.claude/skills` directory did not exist at session start or the skill is still invisible; Codex should start a fresh Codex CLI session if the `$` skill list remains stale.
- If found in an installed pack, suggest the same reload path to pick up the local skill roots.
- If not found in any pack, suggest `/skills` or `/skills search <keyword>` only when `/skills` is visible in the active session; otherwise recommend `npx skillpacks init` from the project shell to install base skills, or use `npx skillpacks which <skill-name>` for a direct package lookup.

### Project Pack Command Resolution
- If a user invokes a command-like skill such as `/benchmark-test-skill design-system` and the leading command is not in the injected session skill list, search project-local packs before falling back to the trailing argument as the active skill.
- Check `packs/*/claude/<command>/SKILL.md` and pack metadata such as `packs/*/PACK.md`; project-local pack skills may exist in this repository even when they are not visible in the active session list.
- In this repository, `/benchmark-test-skill` lives under `packs/agentic-skills-bench/claude/benchmark-test-skill/SKILL.md`, and `design-system` is its target skill argument.

### Prompt History
- On every skill invocation, before substantive work, create `prompts/<skill-slug>/` if it does not exist.
- Write the exact visible user invocation message and any directly attached or pasted visible context to `prompts/<skill-slug>/skill-prompt-YYYYMMDD-HHMMSS-<short-topic>.md`.
- Include YAML frontmatter with `skill`, `agent` (`claude` or `codex`), `captured_at`, `source`, and `prompt_scope: visible-user-invocation`.
- Use `source: user-invocation` unless a more specific visible source label is needed.
- Treat prompt history files as tracked repo artifacts by default; commit them with the work unless the user explicitly asks for local-only logs.
- Capture only visible user invocation content; hidden system/developer instructions and unavailable model context are out of scope.
- Do not summarize, redact, or truncate the prompt log. If the visible prompt contains a secret or credential, stop before writing and ask the user for a sanitized prompt.

### Skill Versioning
- Every SKILL.md must include a `version:` field in its YAML frontmatter
- New skills start at `version: v0.0`
- Bump the decimal (e.g. `v0.0` → `v0.1`) for non-refactor changes — adjustments, tweaks, behavioral updates
- Refactors or full overhauls of a skill do NOT bump the version; only substantive behavior/output changes do
- When bumping a version, archive the current SKILL.md to `archive/<old-version>/SKILL.md` in the same commit
- Maintain a `CHANGELOG.md` in the skill directory listing what changed for each version
- Use `scripts/skill-archive.sh <skill-dir>` to automate the archive step before bumping

### Shipping Contract Convention

When a skill says "Follow the shared shipping contract convention", apply these rules:

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next caller has a concrete handoff.
- If this skill creates or modifies tracked repository files, follow `docs/github-delivery-contract.md`: reuse or create one GitHub Issue, work on a non-primary branch, and publish or update one ready pull request without merging it.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.

## Task Management

1. **Plan First**: Write plan to `tasks/roadmap.md` (full plan) and `tasks/todo.md` (current phase) with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

**Research vs implementation loops.** The `tasks/roadmap.md` + `tasks/todo.md` task tracking above is for implementation work. Pattern A research orchestrators (e.g. `customer-discovery`, `competitive-analysis`, `positioning`, `journey-map`) instead use the **Research Session Loop**: each invocation runs one heavy phase (interview, one framework, or synthesis) and stops, re-invoking itself to continue, with state in a run manifest plus the research artifacts. See `docs/research-session-loop-convention.md`.

## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
- **Issue-Backed GitHub Delivery**: Every tracked mutation uses one GitHub Issue, a non-primary branch, and a ready pull request when GitHub is available. Never push tracked mutations directly to the primary branch. Merge remains a separate explicit review action.
- **Always Ship Mutations**: If a task creates or modifies tracked files, finish by committing and pushing all intended changes before stopping unless the user explicitly says not to. Do not leave a dirty tracked tree or unpushed commits behind.
- **No GitHub Actions**: Do not create, modify, or suggest GitHub Actions workflows unless the user explicitly asks for GitHub Actions. This project does not use GitHub Actions for CI/CD by default.

## Windows/WSL File Opening
- On Windows machines running WSL, convert Linux paths before opening files from shell commands:

```bash
WIN_PATH=$(wslpath -w "$FILE_PATH")
cmd.exe /c start "" "$WIN_PATH"
```

- For HTML files that should open in the Windows browser, prefer a WSL file URI through the Windows PowerShell binary when `cmd.exe /c start` or UNC paths fail:

```bash
DISTRO=${WSL_DISTRO_NAME:-Ubuntu}
URI="file://wsl.localhost/${DISTRO}${FILE_PATH}"
/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/powershell.exe -NoProfile -Command "Start-Process '$URI'"
```

- Use WSL detection so this path only runs inside WSL:

```bash
if grep -qi microsoft /proc/version 2>/dev/null; then
  cmd.exe /c start "" "$(wslpath -w "$FILE_PATH")"
fi
```

- The `cmd.exe` UNC warning (`UNC paths are not supported. Defaulting to Windows directory.`) is cosmetic; the file still opens correctly.
- The `UtilBindVsockAnyPort: socket failed 1` failure can happen before Windows opens a UNC path. For browser-targeted HTML pages, retry with the `file://wsl.localhost/<distro>/...` PowerShell URI before using editor fallbacks.

Provisioned artifact: ./CLAUDE.md. Source: workflow.md. Verification: block appears exactly once.

## Repo-Specific Workflow Notes

- **Concurrent-Session Working Tree**: Another Claude/Codex session may be working this repo in parallel on a shared working tree. After running a repo-wide operation (e.g. `scripts/pack.sh refresh`), do NOT `git restore`/delete unexpected `git status` entries you did not create — they may be a concurrent session's uncommitted work, and cleaning them up silently reverts and deletes that work. Scope any post-op cleanup to your own task paths only, and commit your own new files promptly rather than relying on the working tree surviving.
- **Skillpacks Manifest Is Index-Generated**: `packages/skillpacks/dist/skillpacks-manifest.json` (and the `build-package.mjs` source fingerprint) are generated from the **git index**, not the working tree. Regeneration therefore never captures another session's unstaged edits on the shared tree. Workflow: `git add` your skill edits **before** running `npm run build` (or `node packages/skillpacks/scripts/build-skillpacks-manifest.mjs`), then `git add` the regenerated manifest and commit source + manifest **together** in one atomic commit. `build:check` validates the committed manifest against the index, so a clean checkout (index == HEAD) always passes. The public skills-catalog export under `exports/skills-catalog/v1/` follows the same index-sourced skill/package inputs and is validated with `scripts/validate-skills-catalog-export.sh`. The Skills Showcase app and benchmark run outputs live in separate repositories and are not regenerated during normal package shipping here.

## Shared Skill Conventions

### Alignment Page Template

The alignment-page convention is authored in `docs/alignment-page-convention.md` and bundled per-skill as `ALIGNMENT-PAGE.md` by `scripts/upgrade-alignment-page.mjs`. Edit the convention there; never hand-edit a generated `ALIGNMENT-PAGE.md`.

**Direct-edit audit.** Direct edits to active `alignment/*.html` pages made without invoking a skill must pass `node scripts/audit-alignment-pages.mjs` (exit 0) before commit. TTS-include diagnostics route to `node scripts/inject-tts.mjs`; all other diagnostics are manual fixes. Archived pages under `docs/history/archive/` are out of scope.

**Interrogation-page direct-edit audit.** The stage-zero **interrogation page** archetype is authored in `docs/interrogation-page-convention.md` and bundled per-skill as `INTERROGATION-PAGE.md` by `scripts/upgrade-interrogation-page.mjs` (edit the convention there; never hand-edit a generated bundle). Direct edits to active `interrogation/*.html` pages made without invoking a skill must pass `node scripts/audit-interrogation-pages.mjs` (exit 0) before commit. TTS-include diagnostics route to `node scripts/inject-tts.mjs --dir interrogation`; all other diagnostics are manual fixes. Archived pages under `docs/history/archive/` are out of scope.

**Visual rendering tiers.** Each alignment page has a rendering tier declared via `visual_tier` in SKILL.md frontmatter: `document` (default — text/tables only), `visual` (adds inline Canvas/SVG charts using `scripts/alignment-chart-snippets.js` as reference), or `prototype` (adds interactive components). The upgrade script injects tier-appropriate guidance into each skill's `ALIGNMENT-PAGE.md`.

**Interview depth.** Skills declare `interview_depth` in SKILL.md frontmatter: `full` (4-phase terminal interview before alignment page), `light` (1-3 context questions + findings validation), or `none` (direct to research). The interview convention is defined in `docs/interview-convention.md`. All interviewing happens in the terminal before the alignment page is built. Confirmation manifests/checklists render inline as turn-final message text per the Manifest Visibility Rule in `docs/interview-convention.md`.

**Glossary write-forward.** Skills with `type: research` or `type: analysis` automatically receive a glossary additions gate in their `ALIGNMENT-PAGE.md`. The gate renders proposed terms with per-term approve/edit/reject/flag controls. Only approved terms are appended to the target glossary during the confirmed-page write step.

### Excalidraw Convention

The Excalidraw styling convention is authored in `docs/excalidraw-convention.md`. All Excalidraw diagrams and inline SVG renderings in this project use sketchy/hand-drawn borders (`roughness: 1`) on shapes but clean system fonts on text (`fontFamily: 2` sans-serif for labels, `fontFamily: 3` monospace for code). Never use `fontFamily: 1` (Virgil). For HTML SVG, apply an `feTurbulence`+`feDisplacementMap` sketch filter to `rect, line, polygon` only — not to `<text>`. See the convention doc for the full filter snippet and rationale.

### Shipping Contract Template

When a skill says "Follow the shared shipping contract convention", apply these rules:

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next caller has a concrete handoff.
- If this skill creates or modifies tracked repository files, follow `docs/github-delivery-contract.md`: reuse or create one GitHub Issue, work on a non-primary branch, and publish or update one ready pull request without merging it.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.

### Scope Confirmation for Destructive Work

When a skill's resolved scope would delete, archive, overwrite, or irreversibly transform existing project artifacts not explicitly named in the user's invocation, confirm scope before proceeding. Does NOT apply to additive work, routine shipping, or bug fixes where the user described the symptom.

### Glossary Convention

Research-producing skills maintain a shared project glossary at `research/glossary.md` (or `research/{slug}/glossary.md` in product-path mode).

**Write-forward rule.** When a research skill introduces or encounters domain-specific terms, acronyms, or concept definitions that a reader outside the project would not know, include a `## Glossary Additions` section in the alignment page. This section contains a glossary approval gate with each proposed term, its definition, source tag, and category. The gate uses the standard inline question pattern: the user can approve, edit, reject, or flag each term. Only user-approved terms are appended to the target glossary during the confirmed-page write step. If the target glossary does not exist, create it with the standard glossary header before appending. When multiple product paths are active, the alignment page glossary gate must ask the user whether each new term belongs in the parent or scoped glossary; default to the scoped glossary when the skill is writing to a scoped path.

**Glossary entry format.** Each entry in `research/glossary.md` is a row in the Terms table: `| Term | Definition | Source | Category | Status |` where Source is the research doc that introduced the term, Category is one of business/tooling/workflow/technical/domain, and Status is `confirmed` (user-approved) or `proposed` (pending review by `/repo-glossary`).

**Audit.** Run `/repo-glossary` (business-ops pack) periodically to audit the glossary for accuracy, conflicts, staleness, and missing terms across all research docs.

**Hierarchy.** When multiple product paths exist, glossary files form a two-level hierarchy: `research/glossary.md` is the parent containing shared cross-path terms; `research/{slug}/glossary.md` is the scoped glossary for that product path. A scoped glossary inherits all parent terms. A term defined in a scoped glossary with the same name as a parent term overrides (shadows) the parent definition within that scope. Flat single-product repos with only `research/glossary.md` are unaffected.

**Scoped write-forward.** Research skills writing to a scoped path append new terms to `research/{slug}/glossary.md`. Skills writing to flat `research/` or producing cross-path output append to `research/glossary.md`. The alignment page glossary gate must ask the user whether each new term belongs in the parent or scoped glossary. Default: scoped glossary when the skill is writing to a scoped path.

**Parent Scope column.** The parent glossary adds an optional `Scope` column after Status: `| Term | Definition | Source | Category | Status | Scope |`. Values: `shared` (default — inherited by all paths) or comma-separated slugs. Scoped glossaries omit the Scope column. Repos with no product paths omit it entirely.

### Cross-Pack Routing

When a skill recommends another skill from a different pack, verify the target pack is installed via `.agents/project.json` `enabled_packs`. If not installed, include `npx skillpacks install <pack-name>` as the prerequisite in the recommendation.
