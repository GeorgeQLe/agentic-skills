# Devtool Docs Audit — agentic-skills

Scope: audits the developer-facing documentation for this repository — the `agentic-skills` shared skill library for Claude Code and OpenAI Codex. Grounded in the public docs (`README.md`, `docs/skills-reference.md`, `docs/packs.md`, `docs/operating-modes.md`), project conventions (`CLAUDE.md`), and the completed devtool research chain (`research/devtool-user-map.md`, `research/devtool-integration-map.md`, `research/devtool-dx-journey.md`, `research/devtool-adoption.md`, `research/devtool-positioning.md`, `research/devtool-monetization.md`). This is a docs adoption audit, not a generic devtool checklist.

Continuity: this is the final default-flow devtool research artifact after user map, integration map, DX journey, adoption, positioning, and monetization. The audit evaluates whether the docs support the positioning promise: a local-first workflow library that turns raw Claude Code and Codex sessions into repeatable plan -> run -> ship workflows with project-local packs and explicit hybrid handoff.

## Findings

### P0 — None

No documentation issue appears to block a shell-comfortable user from installing the global skills, enabling a pack, and understanding that CLI restart is required after pack changes. The core path is present in `README.md`, `docs/packs.md`, and `docs/skills-reference.md`.

### P1 — Quickstart explains commands, but not the fastest proof path

The README opens with install and pack commands quickly, which is good. It tells the reader to run `./install.sh`, then `scripts/pack.sh install <pack>`, and it names `scripts/pack.sh list-packs` as internal. `docs/packs.md` reinforces the same model and explains local symlinks.

The gap is that the docs do not give a single "prove it worked" route. A new user can install and enable a pack, but the next visible success is implied rather than staged. The strongest first-success path from `research/devtool-dx-journey.md` is:

1. install global skills,
2. enable a pack in a real project,
3. restart Claude Code or Codex,
4. run `/pack` or `$pack status`,
5. run `/run` or `$run` against a repo with `tasks/todo.md`,
6. verify `tasks/history.md` and a commit changed.

Recommendation: add a short "First successful cycle" subsection to the README after Project Packs. Keep it command-first, not conceptual. It should mention the no-task fallback: if `tasks/todo.md` is missing or empty, run `/roadmap`, `$roadmap`, `/research-roadmap`, or `$research-roadmap` first depending on context.

### P1 — Examples are real but scattered

The repo has strong examples:

- `research/devtool-*.md` is a self-referential example of the devtool pack producing docs about its own library.
- `tasks/history.md` is a dense proof log of shipped skill work.
- `docs/operating-modes.md` shows the full approval-packet contract.
- `README.md` lists concrete pack commands and target packs.

The gap is discoverability. A skeptical reader has to infer that these are examples. `research/devtool-adoption.md` correctly names `tasks/history.md` as the example gallery, but user-facing docs do not elevate that.

Recommendation: add an "Examples to inspect" section to `docs/skills-reference.md` or README linking to `research/devtool-user-map.md`, `research/devtool-dx-journey.md`, `research/devtool-positioning.md`, and the most recent `tasks/history.md` entries. This would convert existing dogfood artifacts into adoption proof without creating new demo infrastructure.

### P1 — Troubleshooting is present as fragments, not a support path

The most important recovery facts are documented:

- `README.md` and `docs/packs.md` both say pack refresh does not hot-reload active CLI sessions.
- `docs/packs.md` explains committed `.agents/project.json` versus uncommitted local symlinks.
- `docs/operating-modes.md` documents mode resolver failures, approval-packet lifecycle, `jq` hard-dependency failure text, and hybrid degraded paths.
- `README.md` lists validation scripts under the repository structure and pack sections.

The issue is shape: troubleshooting is not a single decision tree. The likely support questions are predictable from the research chain: "skill does not show up", "pack installed but nothing changed", "hybrid delegation fails", "Codex cannot execute approved packet", "symlinks broke after moving the checkout", and "Windows/synced folders behave oddly".

Recommendation: add `docs/troubleshooting.md` or a README subsection covering:

- Skills not visible -> restart CLI, then run `scripts/pack.sh status` and `scripts/pack.sh refresh`.
- Broken/missing skill references -> run `./scripts/skill-deps.sh --broken`.
- Missing versions after editing skills -> run `./scripts/skill-versions.sh --missing`.
- Hybrid packet errors -> read `docs/operating-modes.md` § "Approval packet" and check `jq`, mode, dirty tree, TTL, `tasks/todo.md` hash, and manual blockers.
- Moved checkout or broken symlinks -> rerun `scripts/pack.sh refresh` in consumer repos.
- Windows/native shell friction -> use WSL with a Linux-side clone.

### P2 — API/reference coverage exists for skills, but script contracts are under-documented

`docs/skills-reference.md` is a useful skill catalog. It lists global skills, pack skills, default flows, and the Claude-only `delegate` asymmetry. For skill discovery, the reference is adequate.

The script surface is less reference-like. `README.md` and `docs/packs.md` cover common `scripts/pack.sh` commands and mention `list-packs` as internal. `docs/operating-modes.md` covers `scripts/agent-mode.sh` and `scripts/approved-plan.sh` conceptually. The validation scripts are named in examples, but their exact output expectations and failure interpretation are not centralized.

Recommendation: add a compact "Script Reference" section to `docs/skills-reference.md` or a separate `docs/scripts-reference.md` for:

- `install.sh` and `install.sh --uninstall`
- `scripts/pack.sh list|recommend|install|remove|refresh|status|set-mode|list-packs`
- `scripts/agent-mode.sh`
- `scripts/approved-plan.sh check|consume|mark-stale` as consumer-facing commands, with producer commands referenced for Claude-side flows
- `scripts/skill-deps.sh --broken`
- `scripts/skill-versions.sh --missing`

Keep it descriptive, not exhaustive. The goal is to help users understand which command answers which question.

### P2 — Migration paths are honest but incomplete for teams

`docs/operating-modes.md` has a strong migration section for moving from the old parity-mirror model to declared modes. `docs/packs.md` explains moving from global domain skills to project-local packs. `README.md` names former global business/product skills and says how to restore them via `business-app`.

The missing migration path is team rollout. The research chain repeatedly identifies team-specific friction: clone-path coupling, CLI restart, `.agents/project.json` commit discipline, direct-to-primary defaults, and Claude/Codex mirror maintenance. These are discussed in `research/devtool-dx-journey.md` and `research/devtool-monetization.md`, but not as a user-facing migration guide.

Recommendation: add a short "Team adoption checklist" to `docs/packs.md`:

- choose a stable `agentic-skills` checkout path,
- install globals once per developer,
- commit `.agents/project.json`,
- do not commit `.claude/skills` or `.codex/skills`,
- run `scripts/pack.sh refresh` after pulling pack designation changes,
- restart the active CLI,
- decide whether direct-to-primary is acceptable or the team needs a local workflow fork.

### P2 — Proof artifacts are strong, but buried

The proof surface is better than average for a local workflow library:

- The repository uses its own skills to maintain itself.
- `tasks/history.md` records shipped changes with validation details.
- `research/devtool-*.md` artifacts show the devtool pack in use.
- `scripts/skill-deps.sh --broken` and `scripts/skill-versions.sh --missing` validate reference and version hygiene.
- `docs/operating-modes.md` documents degraded paths and contract details instead of leaving hybrid behavior implicit.

The docs should make this proof easier to find. Right now the proof exists, but a reader has to know to inspect task history and research outputs.

Recommendation: add a README "Proof and validation" paragraph pointing to `tasks/history.md`, the devtool research chain under `research/`, and the two validation scripts. Do not overclaim behavioral test coverage; the honest claim is metadata/reference validation plus self-dogfooding.

## Quickstart Clarity

Strengths:

- README gets to `./install.sh` immediately.
- Project pack commands are copy-pasteable.
- `scripts/pack.sh list-packs` is explicitly marked internal, preventing user-facing confusion.
- CLI restart after pack changes is called out in both README and `docs/packs.md`.
- `.agents/project.json` shape is shown as JSON.

Gaps:

- No explicit first-success script after installation.
- No short decision branch for "I do not have `tasks/todo.md` yet".
- No one-screen summary of "global install once; pack install per project; restart; run the workflow".

Recommended docs change: add a 6-step quickstart outcome path that ends with a visible artifact (`tasks/history.md` entry or pack status), not only installed symlinks.

## Examples

Strengths:

- The repo is heavily dogfooded.
- Research artifacts demonstrate pack outputs in realistic depth.
- `tasks/history.md` provides a living change log.
- `docs/operating-modes.md` gives concrete mode and packet tables.

Gaps:

- No short demo artifact, screenshot, or walkthrough.
- No curated "read these three examples" list.
- No explicit example of a successful consumer repo installing a pack and running a first `$run`.

Recommended docs change: link to existing dogfood artifacts first. A screencast or GIF would help adoption later, but the low-cost improvement is a curated examples list.

## API Reference

Strengths:

- Skill catalog is broad and reasonably organized.
- Pack default flows are documented.
- Claude-only `delegate` asymmetry is named clearly.
- Operating-mode resolver and approval-packet semantics are centralized in `docs/operating-modes.md`.

Gaps:

- Script commands are described across multiple docs instead of one reference.
- Validation script outputs are not explained.
- `approved-plan.sh` is a critical hybrid dependency, but user-facing docs mostly discuss the concept rather than practical failure triage.

Recommended docs change: create a compact script reference and link it from README, `docs/packs.md`, and `docs/operating-modes.md`.

## Troubleshooting

Strengths:

- Common failure causes are documented where they arise.
- Hybrid degraded paths are unusually explicit.
- The repo has local validation scripts for broken skill refs and missing versions.

Gaps:

- No central troubleshooting page.
- No "symptom -> command -> likely fix" table.
- Windows/symlink/synced-folder caveats live in research docs, not user-facing setup docs.

Recommended docs change: add a troubleshooting table. Prioritize the most common local setup failures before rare approval-packet edge cases.

## Migration Paths

Strengths:

- Parity-mirror to three-mode migration is documented.
- Former global business/product skills have a clear pack-based replacement path.
- Pack refresh and `.agents/project.json` regeneration are documented.

Gaps:

- No team rollout checklist.
- No PR-gated workflow adaptation guidance despite direct-to-primary defaults being a known adoption blocker.
- No checkout-path migration instructions for moving the `agentic-skills` clone after packs have been installed elsewhere.

Recommended docs change: add team rollout and moved-checkout recovery guidance before creating any larger managed/enterprise documentation.

## Proof Artifacts

Strengths:

- `tasks/history.md` is a high-signal proof log.
- The devtool research chain demonstrates the pack on this repo.
- Validation scripts prove metadata and reference hygiene.
- `docs/operating-modes.md` proves the hybrid contract is specified, not improvised.

Gaps:

- Proof is not presented as proof in the landing docs.
- No release notes or external social proof surface exists.
- No behavior-level test harness exists for SKILL.md contracts, and docs should continue to qualify validation claims accordingly.

Recommended docs change: add a README proof paragraph with honest boundaries: self-dogfooded, locally inspectable, metadata/reference checks available, no hidden telemetry, no CI-enforced behavior contract.

## Recommended Backlog

1. Add README "First successful cycle" and "Proof and validation" sections.
2. Add `docs/troubleshooting.md` with symptom-led recovery steps.
3. Add a compact script reference for install, pack, mode, approval-packet, and validation commands.
4. Add a team adoption checklist to `docs/packs.md`.
5. Consider a short demo asset only after the written quickstart and troubleshooting path are complete.

## Summary

The docs are sufficient for an experienced shell user who already understands Claude Code or Codex and reads carefully. The main adoption problem is not missing truth; it is navigation. Installation, packs, modes, validation, and proof are all documented, but the fastest path from "clone this repo" to "I saw it work" is not packaged as one guided route. The highest-leverage documentation work is therefore a short first-success quickstart plus central troubleshooting, not a broad rewrite.
