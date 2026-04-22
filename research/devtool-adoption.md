# Devtool Adoption — agentic-skills

Scope: maps how developers actually find, try, trust, and keep using this specific repo — the `agentic-skills` shared skill library — and what proof artifacts and activation signals exist today versus what is aspirational. Grounded in observable repo signals (`README.md`, `install.sh`, `scripts/pack.sh`, `packs/devtool/**/SKILL.md`, `global/{claude,codex}/create-skill/SKILL.md`, `tasks/history.md`, `tasks/todo.md`, `CLAUDE.md`, `docs/packs.md`, `docs/operating-modes.md`). Not a generic devtool adoption playbook.

Continuity: fourth step in the devtool research chain. Assumes audience framing from `research/devtool-user-map.md`, setup mechanics from `research/devtool-integration-map.md`, and the lived-in sequence from `research/devtool-dx-journey.md`. This file answers "how does the next developer arrive, and why do they stay?" rather than "what does install look like?".

## Adoption loops

An adoption loop is the cycle that takes a curious developer from first-hearing-about-it to recommending-it-to-someone-else. This repo has a narrow, real loop and several absent ones.

- **Word-of-mouth in AI-coding circles is the only inbound loop.** There is no launch announcement, no marketing site, no package registry listing, and no CHANGELOG at the repo root (verified: `ls CONTRIBUTING.md` and `ls CHANGELOG.md` both absent; no `.github/` directory either). A developer reaches this repo because another developer showed them a `/plan` → `/run` → `/ship` cycle and they asked what drives it. The loop is: user demonstrates the ship-one-step cadence in a shared session or screencast → observer clones → observer's own `tasks/history.md` grows → observer shows someone else.
- **`README.md` is the landing page.** There is no external docs site; `README.md:1–209` is the first surface. It leads with the two-layer (global + pack) model (`README.md:5–10`), then `./install.sh` (line 15), then pack enablement (lines 36–45), then explicitly names the CLI-restart requirement (line 51). The README's job in the loop is to get the reader to `./install.sh` in under two minutes of reading; it mostly succeeds, but it does not pitch *why* the library exists before the install command.
- **`install.sh` is the try-it surface.** Single-command, idempotent, and symmetric with `--uninstall` (`install.sh:33–39, 115–135`). The trial cost is "one shell command, no account signup, no network dependency beyond git clone". This is a real adoption advantage the repo does not lean on in its own copy.
- **Guided `/pack` no-arg flow is the activation loop.** `/pack` (Claude) and `$pack` (Codex) with no arguments detect whether `.agents/project.json` exists and, if not, run `pack recommend` against repo signals before asking for install confirmation (`README.md:49`, `docs/packs.md` § guided setup). This is the moment the library goes from "installed globally" to "actually doing something in my project" — the single highest-leverage UX in the whole repo.
- **Self-referential dogfooding is a silent loop.** The skills used to build this repo are the same skills the repo ships. Every commit in `git log --oneline` (e.g. `35810dd`, `1c192dd`, `a2a092e`, `35f8ff5`, `87e7316`) is literally an artifact of running `/plan` → `/run` → `/ship` on this repo. A prospective adopter reading `tasks/history.md` is reading a demo of the product running on itself.

Missing loops that would measurably widen adoption:
- **No "see it in 30 seconds" asset.** No short screencast, no animated GIF in the README, no hosted demo. The shortest path to understanding is still "clone and try it", which is a big ask from a skeptic.
- **No package-registry presence.** Not on npm, Homebrew, or any registry; discovery requires knowing the GitHub URL. This is consistent with the repo's "git is the registry" stance (see `research/devtool-integration-map.md` § "Compatibility constraints") but closes off incidental discovery.
- **No social proof surface.** No stargazers banner, no testimonials, no "used by" list. The only public signal of who uses it is whatever shows up on GitHub itself.

## Examples

First-success examples are what a new user can run in their first hour that produce a visible, reversible change and validate the install. `research/devtool-dx-journey.md` § "First success" covers the developer-experience side of these; this section covers them as adoption *examples* — the concrete demonstrations that convert a trial into continued use.

- **A `/run` (or `$run`) cycle on a real project.** The canonical first example. From within Claude Code or Codex, the user runs `/run`; the skill at `global/{claude,codex}/run/SKILL.md` plans the next unchecked step from `tasks/todo.md`, enters plan mode for approval, and implements exactly that step on approval. The visible output is a commit on the primary branch, a ticked `tasks/todo.md` line, and a new `tasks/history.md` entry. This is the simplest end-to-end example the repo has.
- **The devtool research chain as a self-referential example.** `tasks/todo.md:1017–1023` tracks six sequential research skills (`$devtool-user-map` → `$devtool-integration-map` → `$devtool-dx-journey` → `$devtool-adoption` → `$devtool-positioning` → `$devtool-monetization` → `$devtool-docs-audit`). Every step in the chain is an example of the repo using its own research skills to produce a research artifact about itself. A reader at `research/devtool-user-map.md`, `research/devtool-integration-map.md`, or `research/devtool-dx-journey.md` is reading both the artifact and the example.
- **`tasks/history.md` entries as lived examples.** Each dated entry (most recent: two entries under `2026-04-22` — agent-team auto-dispatch and the `$spec-drift` approval-packet fix) describes what changed, why, and which skill drove it. A new adopter can read five entries and see five different kinds of cycle: shipping a new skill, fixing doc drift, reconciling dev-docs, adding a validator, refactoring the run contract. The history file is effectively the example gallery.
- **`create-skill` as the first-author example.** `global/claude/create-skill/SKILL.md:1–50` scaffolds a user-local skill directly under `~/.claude/skills/` (not a symlink back into the repo — so `install.sh --uninstall` leaves it intact). The promotion step then copies the skill into a personal fork of `agentic-skills`. Running this once is the moment a trial user becomes an author, which is the highest-retention move in the whole library (see "Activation metrics" below).
- **`extract-shared-types` / `quality-sweep` as domain-neutral examples.** The `code-quality` pack (`packs/code-quality/{claude,codex}/{extract-shared-types,quality-sweep}/`) gives users a non-research first-success path: run a behavior-preserving refactor audit on an existing codebase and see a concrete, reversible diff. Useful for adopters whose first project isn't one that benefits from research chains.

## Templates

Templates are the reusable skeletons adopters copy to produce their own version of a skill or project designation.

- **Pack skeleton: `packs/<pack>/{claude,codex}/<skill>/SKILL.md`.** Every existing pack is a template for a new one. A team building a private pack copies the layout of `packs/devtool/` (or `packs/business-app/`, `packs/game/`, `packs/code-quality/`), adds their skills as `SKILL.md` pairs, and lists the pack in `scripts/pack.sh` pack registry. The repo does not ship a `packs/example-pack/` template, but the existing packs serve as implicit templates.
- **Skill frontmatter contract.** Every `SKILL.md` in the repo opens with the same shape: `name`, `description`, `type`, `version`, optional `argument-hint`. See `global/claude/create-skill/SKILL.md:1–7` and `packs/devtool/claude/devtool-adoption/SKILL.md:1–6`. `scripts/skill-versions.sh --missing` enforces the `version:` field, and the `argument-hint` normalization noted in `tasks/todo.md:1045` ensures Codex-side parsers do not trip. The contract is small enough to memorize after reading three skills.
- **`create-skill` + `pack promote` flow.** `global/{claude,codex}/create-skill/SKILL.md` scaffolds a skill locally (real directory, not symlink — `create-skill` step 3), then offers to promote it into a personal fork of `agentic-skills` under `packs/<pack>/` or `global/`. This is the official on-ramp from "private user-local skill" to "pack-shipped skill" and is the intended authorship path.
- **`.agents/project.json` as a committable template instance.** Each repo that adopts the library ends up with a file like the block shown in `README.md:62–68` (`project_type`, `enabled_packs`, `skill_pack_version`, optional `agent_mode`). Teammates pulling the commit regenerate symlinks via `/pack` no-args. The file is small, version-controllable, and human-readable — exactly what a template should be.
- **Research / spec document contracts as output templates.** Each research skill's `## Output` clause (e.g. `packs/devtool/claude/devtool-adoption/SKILL.md:14`) declares the canonical artifact path and the required sections. The artifact itself becomes a template: a later adopter copies the structure of `research/devtool-dx-journey.md` to draft their own project's DX research.

What is notably missing from the template surface:
- **No `packs/_template/` starter pack.** A would-be pack author copies an existing pack and edits; there is no blank-slate reference with `TODO` stubs.
- **No issue / PR template directory.** `.github/` is absent entirely — a community contributor has no template to file against.
- **No `CONTRIBUTING.md`.** Named explicitly as an adoption blocker in `research/devtool-user-map.md` § "Adoption blockers". Without it, the template for "how to contribute back" has to be inferred from `CLAUDE.md` and `tasks/*`.

## Community channels

Honest state: there is no community channel infrastructure. Adoption today is either solo or bilateral (one person showing another).

- **No Discord, Slack, Matrix, or mailing list.** Searched: none referenced in `README.md`, `docs/`, or any `SKILL.md`. A new adopter with a question has no peer-support surface.
- **GitHub issues/PRs are the only documented channel — and they have no templates.** No `.github/ISSUE_TEMPLATE/`, no `.github/pull_request_template.md`, no `CODEOWNERS`. A reporter filing a bug writes into an empty textarea with no guidance on what to include. A drive-by contributor has no PR checklist.
- **No `CONTRIBUTING.md`.** Confirmed absent. `CLAUDE.md` is the de facto contributor guide (plan-mode-first, ship-one-step, direct-to-primary git flow, no GitHub Actions), but it is oriented to agents, not humans, and lives in the repo root without pointing new contributors at it.
- **No release cadence or notification channel.** No tags, no GitHub Releases, no discussion forum, no newsletter. A user who cloned six months ago has no passive way to learn that new skills exist; they find out by re-pulling and diffing.
- **The session-history analysis skill (`analyze-sessions`) is an introspection channel, not a community one.** It surfaces usage patterns from local session logs. Useful for a solo maintainer but not a community mechanism.

What this constrains:
- **Adoption is gated by existing relationships.** Without any community surface, the library grows at the rate of one-to-one introductions. A developer who bounces off the terminology cliff (`research/devtool-user-map.md` § "Adoption blockers") has nowhere to go for help short of reading `docs/operating-modes.md` end-to-end.
- **Feedback loop is thin.** The only upstream-facing feedback is a GitHub issue; the repo itself has no record of issues filed (no `.github/` directory at all). Maintainer-facing feedback comes from dogfooding, not users.
- **A first community channel is the single-biggest adoption unblock.** A public Discord channel or GitHub Discussions would cost the maintainer hours per week; its absence likely costs more in silent churn.

## Proof artifacts

Proof artifacts are the evidence a skeptical adopter reads to decide whether the library is real, maintained, and trustworthy.

- **`tasks/history.md` is the primary changelog.** 1,083 lines at time of writing (`wc -l tasks/history.md`), with dated `## YYYY-MM-DD — <title>` entries describing what shipped and why. No separate `CHANGELOG.md` exists. A skeptic reading the last ten entries sees a living project: `2026-04-22` shipped agent-team auto-dispatch plus a `$spec-drift` fix; earlier 2026-04 entries cover plan-phase execution profiles, archive-first replacement, and pack install flows. The cadence is near-daily.
- **Per-skill `version:` fields.** Every `SKILL.md` carries a `version:` frontmatter field; `scripts/skill-versions.sh --missing` enforces presence and `--check-bumped` catches unchanged versions on edited skills. Compared to a typical devtool library without per-artifact versioning, this is an unusually granular proof that change is tracked.
- **Self-audit skills: `$spec-drift` and `/reconcile-dev-docs`.** `spec-drift` audits `specs/*.md` against the codebase for diverged/unimplemented features. `reconcile-dev-docs` reconciles `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`, `tasks/phases/`, specs, and git history. The repo's own `tasks/history.md` contains entries for both (e.g. `$spec-drift fix packs/business-app/*/scale-audit`, `$spec-drift fix approval-packet references`, `$reconcile-dev-docs fix skills-reference`). The artifact is a proof: the library audits itself and records the audits.
- **Dogfooding is the strongest proof.** The repo maintains itself through the skills it ships. `research/devtool-user-map.md`, `research/devtool-integration-map.md`, `research/devtool-dx-journey.md`, and this file were all produced by the corresponding `$devtool-*` skills in the pack. The recent `2026-04-22` history entry for agent-team auto-dispatch was itself shipped through a `/plan` → `/run` → `/ship` cycle. An adopter skeptical that the library is used in anger can read the commit history and see it is used here.
- **Archive-first policy artifacts.** `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-path>` preserves snapshots of substantively rewritten canonical docs. A skeptic auditing whether research thinking is honest-over-time can follow an archived snapshot to see the prior position and why it changed. Policy lives in each research skill's § "Archive-First Replacement Policy".
- **Validation scripts: `scripts/skill-deps.sh`, `scripts/skill-versions.sh`.** Run under `./scripts/skill-deps.sh --broken` and `./scripts/skill-versions.sh --missing` (documented in `README.md:202–208`). These are the proof that the library's reference graph and versioning invariants hold at any given checkout.
- **Pack symlink idempotency.** `install.sh` sweeps stale symlinks before re-installing (`install.sh:131–132`), and `scripts/pack.sh refresh` is safe to re-run. A skeptic worried about "does re-running this break things" can verify by running it twice.

What is missing from the proof surface:
- **No independent test harness for skill behavior.** `skill-deps.sh` and `skill-versions.sh` validate references and frontmatter, not output. The absence is explicitly acknowledged in `research/devtool-user-map.md` § "Adoption blockers" and the `CLAUDE.md` "No GitHub Actions" rule. An adopter who wants CI-enforced proof has to build their own.
- **No public usage metrics.** Stars, forks, and contributor counts exist on GitHub; the repo itself emits no download/install telemetry (intentional — see next section).

## Activation metrics

Activation is the set of user-visible behaviors that indicate a trial has converted into durable use. This repo instruments nothing today; activation must be reconstructed from git and task files, or explicitly added.

What is instrumented today: **nothing**. There is no telemetry. `install.sh` does not phone home. `scripts/pack.sh` does not log anywhere network-facing. Skills do not emit events. `CLAUDE.md` hard-codes "No GitHub Actions", which in practice also means no workflow to aggregate usage. The `analyze-sessions` global skill reads *local* session logs on the user's own machine to produce a personal usage breakdown — introspection, not telemetry.

What a maintainer *could* measure today without adding instrumentation, from `tasks/history.md` + `git log` on an adopter repo that shares its history:

- **Install-to-first-`tasks/history.md`-entry latency.** Proxy for time-to-first-success. An adopter repo with `.agents/project.json` committed and a first `tasks/history.md` entry within a day of the install is activating fast; one still at zero entries a week later is not.
- **Ship-cycle count per week.** Count of dated `## YYYY-MM-DD — <title>` headings in `tasks/history.md` per calendar week. The most load-bearing single activation signal: a repo producing ship-cycles is alive.
- **Ratio of user-authored skills to repo-managed skills.** Count of real directories (non-symlinks) under `~/.claude/skills/` and `~/.codex/skills/`, relative to the symlink count. A ratio > 0 means the user has run `create-skill`; a ratio climbing over months means the user is authoring durable workflows — the highest-retention behavior the repo has (`research/devtool-dx-journey.md` § "Retention").
- **`tasks/lessons.md` growth.** Line count or entry count over time. `CLAUDE.md` § "Self-Improvement Loop" directs adopters to write patterns after corrections; adopters who maintain the file are the ones whose mistake rate drops over time. Non-empty `tasks/lessons.md` is a strong activation signal; an untouched file is a warning.
- **Ratio of `/plan`-gated commits to free-form commits.** Proxy for plan-mode-first adoption. Commits that follow a `tasks/todo.md` tick-off are the plan-mode-first kind; commits that don't aren't. A rising ratio over weeks signals the muscle memory from `research/devtool-dx-journey.md` § "Retention" is forming.
- **Count of `$spec-drift` / `$reconcile-dev-docs` runs.** `tasks/history.md` entries with those skill names show self-audit discipline. Zero runs over months, in a repo with active development, is a drift-risk signal.
- **Pack stickiness: `.agents/project.json` age vs edit recency.** A file committed months ago with `enabled_packs` unchanged and `skill_pack_version` still at the default is a proxy for "installed and stable"; frequent changes signal either active pack authorship or churn.
- **CLI-restart-chore frequency, inferred from `tasks/history.md`.** Entries mentioning pack refreshes or restart confusion indicate where the restart friction is biting. Repeated entries on the same topic are a negative activation signal worth escalating.

What could be instrumented (but requires explicit maintainer and user consent, and contradicts the current no-telemetry stance):

- **Opt-in anonymous install counter.** A post-install prompt asking whether to report "install happened" to a maintainer-controlled endpoint. The repo does not have this and should not add it without an explicit privacy contract.
- **Opt-in `scripts/pack.sh` usage pings.** Same shape, for pack install/remove/refresh events. Same consent caveat.

The honest maintainer framing: **measure the three signals that are free and local first** — ship-cycles per week, user-authored-skill ratio, and `tasks/lessons.md` growth — before considering any telemetry. These three, together, distinguish a real adopter from a trial that lapsed, without any network dependency and without any of the privacy cost that comes with usage pings.
