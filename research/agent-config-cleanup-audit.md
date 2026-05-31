# Agent Config Cleanup Audit

Generated: 2026-05-30
Skill: `$investigate`
Scope: root `CLAUDE.md`, root `AGENTS.md`, and the `provision-agentic-config` generated blocks/source.

## Strategy Used

General repo investigation. I compared the live root agent files, the repo-local `global/codex/provision-agentic-config` and `global/claude/provision-agentic-config` skills, the installed Codex `~/.codex/skills/provision-agentic-config` skill, supporting generator scripts, and recent git history/blame. No implementation changes were made to `CLAUDE.md`, `AGENTS.md`, or the provisioner templates.

## Executive Verdict

Yes, there is meaningful material that can move out of root agent files and down into skills or skill-adjacent bundled convention files.

The root files should keep only instructions that must apply before a skill is available, before a skill is loaded, or across every agent task. Skill-invocation behavior, skill authoring rules, durable-output page rules, and route handoff conventions should mostly live with skills and their generators.

Recommended cleanup target:

- Keep root `CLAUDE.md` and `AGENTS.md` to a compact global operating contract: planning threshold, agent-specific subagent policy, verification standard, mutation/shipping posture, missing-skill fallback, and a short task-management pointer.
- Move prompt history, skill versioning, alignment-page details, shared shipping contract details, and cross-pack routing into skill-local or generator-owned convention files.
- Replace hardcoded project-specific examples in root config with `scripts/pack.sh which <skill-name>` and pack metadata lookup.
- Fix source-of-truth drift before pruning: current root blocks are marked `provision-agentic-config v0.5`, but they contain sections not present in the repo-local v0.5 provisioner templates.

## User Claims Validated

### Claim: We can push some `AGENTS.md` / `CLAUDE.md` content down to skills.

Verdict: confirmed, with boundaries.

Evidence:

- `AGENTS.md:54-61` and `CLAUDE.md:55-62` define `Prompt History`, which applies specifically "On every skill invocation".
- `AGENTS.md:63-70` and `CLAUDE.md:64-71` define `Skill Versioning`, which applies to skill creation/update work, not ordinary repo work.
- `CLAUDE.md:119-174` contains the full shared alignment-page and shipping/cross-pack conventions used by skills.
- `scripts/upgrade-alignment-page.mjs:24-41` reads the alignment convention from `CLAUDE.md`, then bundles it into per-skill `ALIGNMENT-PAGE.md` files.
- Many skills already carry local `ALIGNMENT-PAGE.md` files and `## Default Shipping Contract` stubs.

Inference:

Prompt history, skill versioning, alignment-page construction, and skill handoff conventions are skill-runtime or skill-authoring concerns. They do not need to be expanded inside the always-loaded root prompt once they are bundled beside the skills that need them.

### Claim: The provisioned block itself should be audited, not just the current root files.

Verdict: confirmed.

Evidence:

- Root `CLAUDE.md:1` and `AGENTS.md:1` are marked `<!-- provision-agentic-config v0.5 -->`.
- Repo-local provisioner `global/codex/provision-agentic-config/SKILL.md:35-140` and `:145-244` define the current v0.5 generated Claude and AGENTS blocks.
- Those repo-local generated blocks do not include root `Skill Versioning` or `Alignment Page Convention` sections, while root `AGENTS.md:63-75` includes both and root `CLAUDE.md:64-71` includes skill versioning plus a separate full shared-conventions section at `CLAUDE.md:119-174`.
- The installed Codex skill at `/home/georgeqle/.codex/skills/provision-agentic-config/SKILL.md` is still `version: v0.3`, while repo-local provisioners are `v0.5`.

Inference:

The live root files, repo-local provisioner templates, and installed Codex provisioner are not all describing the same generated artifact. Any cleanup should first choose the canonical source of truth and then refresh the installed skill.

## Evidence Matrix

| Claim | Evidence | Inference | Confidence | Decision impact |
| --- | --- | --- | --- | --- |
| Prompt history belongs with skill invocation, not root global policy. | `AGENTS.md:54-61`, `CLAUDE.md:55-62`, `global/codex/provision-agentic-config/SKILL.md:88-95` and `:192-199` all scope it to skill invocation. | It can move into a shared skill runtime contract, or be injected into each `SKILL.md` that should log prompts. | High | Approve moving this out of the root block after all skill invocation paths preserve the pre-work logging requirement. |
| Skill versioning is skill-authoring policy. | `AGENTS.md:63-70`, `CLAUDE.md:64-71`, and `docs/skill-versioning.md` describe only `SKILL.md`, archives, changelogs, and validation scripts. | This belongs in `skill-creator`, `targeted-skill-builder`, `create-local-skill`, and docs. | High | Strong cleanup candidate. |
| Alignment-page details are already designed to be bundled per skill. | `AGENTS.md:72-75` says the convention is bundled per skill; `CLAUDE.md:119-161` holds the canonical block; `scripts/upgrade-alignment-page.mjs:24-52` propagates it. | The full canonical template can move from `CLAUDE.md` into a generator-owned source file, with root reduced to a short pointer or removed. | High | Biggest line-count reduction, but requires updating the generator source path. |
| Shared shipping and cross-pack routing are skill handoff conventions. | `CLAUDE.md:163-174` applies only when a skill says "Follow the shared shipping contract convention" or recommends another skill. | Bundle or inline these into skills that need them; root only needs global mutation posture. | Medium-high | Good cleanup candidate, but update all skills that currently reference `CLAUDE.md`. |
| Missing-skill fallback must stay partly global. | `AGENTS.md:43-53`, `CLAUDE.md:43-53`; this applies when the requested skill is absent or not visible. | It must be available before a missing skill can load, but it can be compressed and made data-driven. | High | Keep a concise root fallback. Move hardcoded pack examples into `pack` metadata or `scripts/pack.sh which`. |
| Windows/WSL browser-opening guidance can mostly move down. | Root `AGENTS.md:94-119`, `CLAUDE.md:90-115`; alignment convention also requires browser-open attempts at `CLAUDE.md:160`. | The detailed fallback is mostly relevant to HTML/alignment/report skills. A short root pointer may be enough. | Medium | Move details into alignment/report/open-file helper docs; keep only if root agents often open arbitrary files. |
| Root/provisioner drift exists. | Root files are v0.5, but repo-local provisioner v0.5 generated blocks lack root `Skill Versioning` and `Alignment Page Convention`; installed Codex provisioner is v0.3. | Rerunning or syncing provisioners could unexpectedly remove root-only sections or compare against stale installed templates. | High | Resolve drift before deleting or relocating content. |
| The `workflow.md` source note is stale or at least unverifiable in this repo. | Root notes say `Source: workflow.md`; `find . -maxdepth 4 -path '*/workflow.md' -print` found no `workflow.md`. | The note should point to the actual canonical provisioner or a real source file. | High | Small cleanup candidate outside the main block. |

## Keep In Root

These instructions should stay in `CLAUDE.md` / `AGENTS.md`, though most can be shorter:

1. Plan threshold and replanning behavior.
   - Applies before any skill selection and guards arbitrary user work.
   - Current evidence: `CLAUDE.md:4-10`, `AGENTS.md:4-10`.

2. Agent-specific subagent policy.
   - Claude and Codex need different rules. This is exactly the kind of global runner behavior root files should encode.
   - Current evidence: `CLAUDE.md:12-17`, `AGENTS.md:12-17`.

3. Self-improvement on user correction.
   - This is repo-wide feedback hygiene, not a single skill behavior.
   - Current evidence: `CLAUDE.md:19-23`, `AGENTS.md:19-23`.

4. Verification standard.
   - Applies to all mutation work, skill or no skill.
   - Current evidence: `CLAUDE.md:25-29`, `AGENTS.md:25-29`.

5. Core mutation posture.
   - Direct-to-primary flow, shipping expectations, and "No GitHub Actions" are repo-wide policy.
   - Current evidence: `CLAUDE.md:82-88`, `AGENTS.md:86-92`.

6. Missing-skill fallback, in compressed form.
   - Needed exactly when skill instructions cannot be loaded.
   - Current evidence: `CLAUDE.md:43-53`, `AGENTS.md:43-53`.

## Push Down To Skills Or Skill-Adjacent Files

### 1. Prompt History

Current root footprint:

- `CLAUDE.md:55-62`
- `AGENTS.md:54-61`
- provisioner templates in `global/codex/provision-agentic-config/SKILL.md:88-95` and `:192-199`

Recommended destination:

- A bundled per-skill `PROMPT-HISTORY.md` or a short generated section in every skill that requires prompt capture.
- Alternatively, include it only in skills with durable output or mutation behavior, but this is riskier because the current rule says every skill invocation.

Why:

The rule only activates after a skill is invoked. Keeping the full seven-bullet policy in root adds always-loaded context for a skill-runtime behavior.

Risk:

It must remain visible before substantive skill work. If moved into skill-local files, every invoked skill must load that local convention before work begins.

### 2. Skill Versioning

Current root footprint:

- `CLAUDE.md:64-71`
- `AGENTS.md:63-70`
- detailed durable docs already exist at `docs/skill-versioning.md`

Recommended destination:

- Keep canonical detail in `docs/skill-versioning.md`.
- Add/keep enforcement in `skill-creator`, `targeted-skill-builder`, `create-local-skill`, and any skill that modifies `SKILL.md`.
- Optionally add a short validation pointer in root only for this repository, not in provisioned blocks for every consuming project.

Why:

Most tasks do not create or modify skills. This is high-value but narrow policy.

### 3. Alignment Page Convention

Current root footprint:

- Full template in `CLAUDE.md:119-161`
- Short root pointer in `AGENTS.md:72-75`
- Generator hard-coupling in `scripts/upgrade-alignment-page.mjs:24-41`

Recommended destination:

- Move the canonical convention from `CLAUDE.md` to a generator-owned source such as `docs/alignment-page-convention.md` or `scripts/templates/alignment-page.md`.
- Keep per-skill `ALIGNMENT-PAGE.md` as the load-on-demand runtime source.
- Root files should not carry the full template. At most, this repo root can say: "Alignment-producing skills load their sibling `ALIGNMENT-PAGE.md`; update the canonical generator source, then run `scripts/upgrade-alignment-page.mjs`."

Why:

The current setup already says the convention is bundled per skill, but the canonical source remains inside `CLAUDE.md`, making the root file a generator source file and an agent instruction file at the same time.

Risk:

The generator must be updated before the CLAUDE block is removed. Otherwise `scripts/upgrade-alignment-page.mjs` will fail.

### 4. Shared Shipping Contract Template

Current root footprint:

- `CLAUDE.md:163-170`
- Many skills say "Follow the shared shipping contract convention in CLAUDE.md."

Recommended destination:

- Bundle a `SHIPPING-CONTRACT.md` or inline the needed contract into mutating skills.
- Keep only the broad root mutation policy in `Core Principles`.

Why:

The detailed handoff/output routing rule is a skill completion convention, not a global root behavior. Root should not be the dependency for every skill-local shipping stub.

Risk:

Existing skills reference `CLAUDE.md`; those references need to change as a set.

### 5. Cross-Pack Routing

Current root footprint:

- `CLAUDE.md:172-174`

Recommended destination:

- `pack`, `skills`, and route-recommending skills.
- A shared route contract bundled with skills that recommend downstream skills.

Why:

This applies only at skill handoff time. It does not need to be always-loaded except as part of a skill's final response contract.

### 6. Windows/WSL File Opening

Current root footprint:

- `CLAUDE.md:90-115`
- `AGENTS.md:94-119`

Recommended destination:

- Alignment/report/browser-opening skills and a small helper doc.
- Keep a one-line root rule only if arbitrary file opening outside skills is common.

Why:

The detailed PowerShell fallback is operationally useful but only in a narrow environment and mainly for HTML report/alignment outputs. It is not core workflow policy.

### 7. Hardcoded Project Pack Example

Current root footprint:

- `CLAUDE.md:49-53`
- `AGENTS.md:49-53`

Recommended destination:

- `scripts/pack.sh which <skill-name>` and pack metadata.
- The `pack` / `skills` skills can own the detailed fallback text.

Why:

Root files should not need to know that `benchmark-test-skill` lives under a particular pack path. That is exactly the kind of lookup the pack tooling should answer.

## Drift And Cleanliness Findings

### Finding 1: Root v0.5 blocks are not identical to repo-local v0.5 provisioner blocks.

Impact:

The root files have sections that current repo-local provisioner templates do not generate. A rerun of `provision-agentic-config` could strip those root-only sections, while the version marker would not communicate that difference.

Evidence:

- Root `AGENTS.md:63-75` includes `Skill Versioning` and `Alignment Page Convention`.
- Root `CLAUDE.md:64-71` includes `Skill Versioning`; root `CLAUDE.md:119-174` contains shared skill conventions outside the provisioned note.
- `global/codex/provision-agentic-config/SKILL.md:35-244` has v0.5 required blocks without `Skill Versioning` or `Alignment Page Convention`.

Recommendation:

Before implementing cleanup, decide whether the provisioner should generate the extra sections, omit them, or move them elsewhere. Then make root and templates match.

### Finding 2: Installed Codex provisioner is stale.

Impact:

The active Codex skill registry can disagree with the repo-local source and root v0.5 files.

Evidence:

- `/home/georgeqle/.codex/skills/provision-agentic-config/SKILL.md` reports `version: v0.3`.
- `global/codex/provision-agentic-config/SKILL.md:5` reports `version: v0.5`.
- Root `AGENTS.md:1` and `CLAUDE.md:1` are provisioned as v0.5.

Recommendation:

After deciding on cleanup, refresh installed global skills so the active Codex registry sees the current provisioner.

### Finding 3: `workflow.md` source note does not resolve locally.

Impact:

The note claims a source that is not present in the repo scan. This weakens provenance and adds confusion during audits.

Evidence:

- Root notes at `CLAUDE.md:117` and `AGENTS.md:121` say `Source: workflow.md`.
- `find . -maxdepth 4 -path '*/workflow.md' -print` returned no files.

Recommendation:

Either add the real canonical `workflow.md`, or update the note to name the actual source, such as `global/codex/provision-agentic-config/SKILL.md` and `global/claude/provision-agentic-config/SKILL.md`.

### Finding 4: Report-only work still triggers tracked mutations.

Impact:

The combination of prompt-history logging, alignment-page output, and default shipping rules makes even "report-only" skill invocations create tracked files and potentially require commit/push. That is heavy for an audit request.

Evidence:

- Prompt history says tracked by default at `AGENTS.md:59-60`.
- The investigate skill requires alignment pages for durable reports.
- Shared shipping contract in `CLAUDE.md:167-170` says tracked mutations should be committed and pushed.

Recommendation:

Add a clearer report-only artifact policy in the skill runtime contract: report artifacts are allowed, but implementation targets remain untouched. If report artifacts should still ship, say so explicitly in the skill; if not, allow a local-only report mode.

## Proposed Minimal Root Shape

This is not implementation text. It is the target content model:

1. Global Workflow
   - Plan for non-trivial work.
   - Re-plan when work changes materially.
   - Use agent-specific subagent rules.
   - Verify before done.

2. Repo Mutation Policy
   - Minimal impact.
   - Direct-to-primary unless explicitly overridden.
   - Commit/push intended tracked mutations unless user says otherwise.
   - No GitHub Actions unless explicitly asked.

3. Skill Resolution
   - If a named skill is missing, run `scripts/pack.sh which <skill-name>`.
   - If found, recommend the right install/reload route.
   - Search project-local pack roots for command-like invocations.

4. Task Records
   - For non-trivial mutation work, keep `tasks/roadmap.md`, `tasks/todo.md`, and `tasks/lessons.md` current.
   - Let planning/execution skills own the detailed steps.

Everything else should be skill-local, generator-local, or documentation-local.

## Recommended Implementation Sequence If Approved Later

1. Canonical-source cleanup:
   - Move the alignment-page authoring source out of `CLAUDE.md`.
   - Update `scripts/upgrade-alignment-page.mjs` to read the new source.
   - Regenerate bundled `ALIGNMENT-PAGE.md` files.

2. Skill-runtime contract cleanup:
   - Create a bundled prompt-history/shipping/cross-pack route convention or inline these into affected skills.
   - Update skills that currently reference `CLAUDE.md` for shared conventions.

3. Provisioner cleanup:
   - Update both repo-local provisioners so generated blocks match the desired minimal root shape.
   - Archive/bump provisioner versions per skill versioning policy.

4. Root cleanup:
   - Re-run or manually align `CLAUDE.md` and `AGENTS.md` to the new generated blocks.
   - Fix or replace the `workflow.md` source note.

5. Refresh installed skills:
   - Reinstall/refresh global skills so `~/.codex/skills/provision-agentic-config` is no longer v0.3.

6. Verification:
   - Run provisioner/sync checks.
   - Run skill dependency/version/archive checks.
   - Run generator dry-run or diff check for alignment pages.

## Recommendation

Approve a cleanup, but do it as a staged refactor of instruction ownership, not a direct deletion pass.

Highest-confidence moves:

- Move `Skill Versioning` out of root.
- Move full alignment-page template out of `CLAUDE.md`.
- Move prompt-history detail into skill runtime/bundled skill conventions.
- Compress missing-skill fallback and remove hardcoded benchmark pack paths.
- Fix provisioner/root/installed-skill drift before any pruning.

Lower-confidence or conditional moves:

- Move Windows/WSL opening details only if alignment/report/open-file skills reliably carry them.
- Move shipping contract only after all `Follow the shared shipping contract convention in CLAUDE.md` references are updated.
