# Devtool Docs Audit - Documentation Drift Inventory (2026-06-14)

Scope: repository-owned documentation and documentation-like surfaces in `agentic-skills`, excluding dependency documentation under `node_modules`, app build output under `.next`, and package build output under `packages/*/build`.

This audit treats archived skill versions, historical task manifests, prompt logs, and dated benchmark reports as historical unless an active index, active docs page, active pack contract, or current `README.md` points readers to them as current guidance.

## Executive Verdict

P0: none found. I did not find evidence that the main `skillpacks` package metadata, primary install-route contract, or generated active pack manifest is structurally broken.

P1: the active `devtool-docs-audit` skill references a `## Next-Skill Routing` section that does not exist. This is a direct active-contract drift in the skill that produced this audit.

P1: current business-pack docs still mix the removed/canonical pack name `business-research` with the compatibility alias `business-discovery`. The CLI intentionally accepts `business-discovery`, but several docs present it as the active pack and some compatibility descriptions omit `customer-lifecycle`.

P1: `docs/skill-next-step-contracts.md` still tells Pattern A `positioning` framework selection to write selected frameworks to `tasks/todo.md` for `/exec`, contradicting the current Research Session Loop convention.

P2: the 2026-06-01 "Canonical Agentic Workflow Report" still describes pre-prototype UX/UI artifacts as living in `specs/`, while the current prototype-session-loop convention and active product-design skills put them in `design/`.

P2: `docs/skillpacks-npm-distribution.md` is internally inconsistent: its top-level approval summary says `skillpacks` is primary and `@glexcorp/gskp` is the scoped alias, but later pre-publish sections still say to use `gskp` as the only npm package and to confirm `gskp` publish rights.

P3: most old references inside `archive/`, skill changelogs, task history, benchmark notes, and prompt logs are expected historical drift. The risk is only when current docs or indexes present those artifacts as live guidance.

## Inventory

The repository has 4,779 repo-owned Markdown/HTML/RST/ADOC files after excluding dependency docs, `.next`, and package build output.

| Documentation class | Count | Notes |
| --- | ---: | --- |
| Active pack docs and active pack `SKILL.md`/`PACK.md` surfaces | 1,019 | Includes active skill contracts, `ALIGNMENT-PAGE.md`, and pack metadata under `packs/` excluding archives. |
| Archived pack skill/docs surfaces | 1,771 | Versioned historical snapshots under `packs/**/archive/**`; expected to preserve stale behavior. |
| Installed Codex skill copies | 227 | Current local install surface under `.codex/skills`; should mirror active packaged roots for enabled skills. |
| Public/reference docs under `docs/` | 80 | Canonical conventions, quickstarts, package docs, generated showcase assets, historical docs. |
| Task docs under `tasks/` | 121 | Current plans plus historical ship manifests and review notes. |
| Benchmark reports under `benchmark/` | 170 | Historical test and triage outputs. |
| Specs under `specs/` | 32 | Product/spec artifacts, some historical design-phase documents. |
| Research docs under `research/` | 16 | Active research outputs and working packets. |
| Alignment pages under `alignment/` | 51 | Current and historical review/approval pages, plus index. |
| App-owned docs under `apps/` | 8 | Excludes `node_modules` and `.next`. |
| Prompt logs under `prompts/` | 394 | Invocation history, intentionally historical. |
| Top-level/other docs | 724 | Includes root docs, tests fixtures, conversations, and miscellaneous non-pack surfaces. |
| Repo-wide archive docs | 166 | Historical non-pack archive. |

Skill-specific inventory:

| Surface | Count |
| --- | ---: |
| Active pack `SKILL.md` files | 354 |
| Archived `SKILL.md` files | 2,172 |
| Installed `.codex/skills/**/SKILL.md` files | 53 |
| Other `SKILL.md` files | 98 |

## Findings

### P1 - `devtool-docs-audit` References Missing Next-Skill Routing Rules

Claim: the active skill tells the agent to use a section that is absent from the file.

Evidence:

- `packs/devtool/codex/devtool-docs-audit/SKILL.md:17` says final responses should include `Recommended next skill: <command>` using the `## Next-Skill Routing` rules below.
- `packs/devtool/codex/devtool-docs-audit/SKILL.md:19-25` then contains only `## Alignment Page` and `## Default Shipping Contract`; no next-skill routing section follows.
- The installed copy `.codex/skills/devtool-docs-audit/SKILL.md` has the same contract shape.
- The Claude mirror `packs/devtool/claude/devtool-docs-audit/SKILL.md` has the same missing reference.

Impact: agents using the skill have to infer downstream routing from the shared shipping contract or avoid a next-skill recommendation while the skill text says a local rule exists.

Recommended cleanup:

- Add a concrete `## Next-Skill Routing` section to both mirrors, or remove the local-section reference and rely on the shared shipping contract.
- If no deterministic next skill is valid for report-only docs audits, say `No follow-up skill recommended` unless findings point to a specific remediation skill such as `reconcile-dev-docs`, `targeted-skill-builder`, or a direct docs-maintenance task.

### P1 - Business Pack Naming Drift: `business-discovery` Alias vs `business-research` Canonical Pack

Claim: the active package manifest and pack directory use `business-research`, while current docs and pack metadata still often present `business-discovery` as the active pack name.

Evidence:

- Active pack directories include `packs/business-research` and do not include `packs/business-discovery`.
- `packages/skillpacks/dist/skillpacks-manifest.json` names the active pack `business-research` and points to `packs/business-research`.
- `packages/skillpacks/src/cli/pack-normalization.mjs:13-14` intentionally treats `business-discovery` as an alias that installs `business-research`.
- `packs/repo-maintenance/codex/bootstrap-repo/CHANGELOG.md:13` says product bootstrap pack checks were updated from `business-discovery` to `business-research` after the rename.
- `packs/customer-lifecycle/codex/journey-map/CHANGELOG.md:12` says cross-pack routing guards were updated from the removed `business-discovery` pack name to canonical `business-research`.
- Current docs still present `business-discovery` as primary guidance: `README.md:90`, `README.md:254`, `docs/packs.md:120`, `docs/QUICKSTART.md:51`, `docs/codex-workflow.md:284`, and `docs/skills-reference.md:112`.
- `docs/packs.md:137` says `business-app` expands to `business-discovery`, `business-growth`, and `business-ops`, omitting `customer-lifecycle`; the CLI normalization expands business app aliases to `business-research`, `customer-lifecycle`, `business-growth`, and `business-ops`.
- `packs/business-app/PACK.md:6` also says the old broad business app split includes `business-discovery`, not `business-research`.

Impact: copy-paste installs may still work through alias normalization, but users and agents cannot tell which pack name is canonical. The omitted `customer-lifecycle` in one compatibility description is a real workflow drift because journey evidence is part of the current AFPS path.

Recommended cleanup:

- Use `business-research` in primary docs and active pack metadata.
- Mention `business-discovery` only as a compatibility alias where helpful.
- Fix `business-app` expansion descriptions to include `business-research`, `customer-lifecycle`, `business-growth`, and `business-ops`.

### P1 - `skill-next-step-contracts` Still Routes Pattern A Positioning Through `/exec`

Claim: current research-loop docs say Pattern A research orchestrators should not use `tasks/todo.md` plus `/exec`, but the next-step contract still says `positioning` framework selection writes framework work to `tasks/todo.md` for `/exec`.

Evidence:

- `docs/research-session-loop-convention.md:3-4` defines Pattern A research across fresh-context sessions without the implementation exec loop.
- `docs/research-session-loop-convention.md:22-31` says Pattern A uses its own re-invocation and run manifest/file existence, not `tasks/roadmap.md` or `tasks/todo.md`.
- `docs/orchestrator-convention.md:35` says Pattern A execution is now the Research Session Loop, with state in a run manifest plus research artifacts.
- `docs/skill-next-step-contracts.md:84` says `positioning` market-mode framework selection should write selected frameworks to `tasks/todo.md` for `/exec` execution.
- `docs/skill-next-step-contracts.md:86` says `positioning` product mode writes a single `obviously-awesome` step to `tasks/todo.md`.

Impact: agents following next-step contracts can resurrect the legacy research execution model and contaminate `tasks/todo.md` with research framework phases.

Recommended cleanup:

- Update the `positioning` rows in `docs/skill-next-step-contracts.md` to the Research Session Loop wording.
- Add a regression check that active Pattern A rows in next-step docs do not mention writing framework phases to `tasks/todo.md` or `/exec`.

### P2 - Canonical Workflow Report Uses Old Pre-Prototype `specs/` Artifact Paths

Claim: the canonical workflow report describes current durable sources of truth using pre-prototype `specs/ux-variations-*` and `specs/ui-*`, but the newer prototype-session-loop convention and active product-design skills use `design/`.

Evidence:

- `docs/canonical-workflow-report.md:3-4` identifies itself as a current 2026-06-01 workflow-contract snapshot.
- `docs/canonical-workflow-report.md:16-18` says `specs/ux-variations-*.md`, `specs/ui-*.md`, and `specs/ui-requirements-*.md` capture UX/UI pre-prototype artifacts.
- `docs/prototype-session-loop-convention.md:86-90` says pre-prototype flow maps, UX variation plans, UI branch packets, UI requirements packets, branch decisions, mockup references, flow-tree manifests, and prototype build plans live in `design/`; `specs/` is for finalized post-prototype implementation specifications.
- Active `packs/product-design/{codex,claude}/user-flow-map/SKILL.md`, `ux-variations/SKILL.md`, and `ui-interview/SKILL.md` all instruct new pre-prototype artifacts to be written to `design/`.

Impact: the report is useful historical context, but its title and wording make it look canonical. A reader could write new pre-prototype artifacts to `specs/`, conflicting with active skill contracts.

Recommended cleanup:

- Either update `docs/canonical-workflow-report.md` to cite the newer `design/` convention, or add a prominent superseded-status note at the top.
- Keep `specs/` only for finalized post-prototype implementation specifications and legacy fallback reads.

### P2 - npm Distribution Doc Contains Old `gskp`-Primary Planning Text

Claim: `docs/skillpacks-npm-distribution.md` has correct current package identity at the top but stale implementation-plan text near the end.

Evidence:

- `docs/skillpacks-npm-distribution.md:9-12` says the primary public npm package is `skillpacks`, with `@glexcorp/gskp` as the scoped alias.
- `docs/skillpacks-npm-distribution.md:27-31` says source package metadata is `skillpacks`, every release also publishes `@glexcorp/gskp`, and both expose `skillpacks` and `gskp` binaries.
- `packages/skillpacks/package.json:2-8` confirms source package name `skillpacks` and both bins.
- `README.md:51-61` uses `npx skillpacks` as primary and calls `@glexcorp/gskp` an equivalent scoped alias.
- `docs/skillpacks-install-routing-contract.md:7-9` says default public examples should use `npx skillpacks ...`.
- `docs/skillpacks-npm-distribution.md:659-665` still says a `gskp` package/scope claim blocks the approved public name and says to use `gskp` as the only npm package and bin name.
- `docs/skillpacks-npm-distribution.md:671-681` still asks whether `gskp` is final and says to confirm publish rights for `gskp`.

Impact: readers scanning later sections get a contradictory package decision. The document is half current reference, half historical implementation record.

Recommended cleanup:

- Split the doc into "Current Decisions" and "Historical Planning Notes", or move the obsolete sections into an explicit appendix.
- Replace "only npm package and bin name" with the current dual-package/dual-bin release boundary.

### P2 - Generated Manifest Examples In npm Docs Still Use Removed Pack Paths

Claim: example manifest snippets in `docs/skillpacks-npm-distribution.md` still show `business-discovery` package entries and paths that no longer exist as active pack source.

Evidence:

- `docs/skillpacks-npm-distribution.md:275-288` shows an example pack named `business-discovery` with path `packs/business-discovery`.
- The actual generated manifest uses `business-research` and `packs/business-research`.
- `packages/skillpacks/src/cli/pack-normalization.mjs:13-14` keeps `business-discovery` as an input alias only.

Impact: maintainers could copy stale manifest shapes into tests, package docs, or downstream tooling.

Recommended cleanup:

- Update example manifest snippets to use `business-research`.
- If alias examples are useful, show them as alias inputs, not manifest source identities.

### P3 - Historical Surfaces Are Numerous And Need Clear Currentness Labels

Claim: the repo intentionally preserves many historical docs, but current readers need labels to avoid treating old artifacts as live contracts.

Evidence:

- There are 1,771 archived pack doc surfaces, 170 benchmark reports, 121 task docs, 394 prompt logs, and 166 repo-wide archive docs.
- `alignment/index.html` includes current and historical pages side by side; some cards have historical labels, but not every stale workflow page carries an equally strong warning.
- `docs/history/archive/**`, `packs/**/archive/**`, and dated `tasks/ship-manifest-*` files are expected to contain old commands, pack names, and artifact paths.

Impact: the volume of retained documentation makes drift scans noisy. Without currentness labels, readers have to infer whether a document is a contract, audit snapshot, historical decision record, or task log.

Recommended cleanup:

- Add a short currentness marker to high-visibility docs: `Status: active contract`, `Status: historical snapshot`, `Status: generated`, or `Status: task history`.
- Keep archives intact, but exclude them from active drift assertions and generated docs search where possible.

## Evidence Matrix

| Claim | Evidence | Inference | Confidence | Assumption status | Decision impact |
| --- | --- | --- | --- | --- | --- |
| `devtool-docs-audit` has a missing local routing section | Active skill line references `## Next-Skill Routing`; file ends after shared shipping contract | Active skill contract points to absent rules | High | Directly observed | Patch skill mirrors or remove reference |
| Business pack naming is inconsistent | Manifest and directories use `business-research`; docs and PACK files still use `business-discovery`; CLI alias maps old name to new | Commands may work, but docs mix canonical and alias identities | High | Directly observed | Standardize docs on `business-research`, alias note only |
| Business app alias docs omit lifecycle lane in one current doc | CLI expands business app to four packs; `docs/packs.md` lists three and old name | A reader may install or reason about an incomplete business AFPS lane | High | Directly observed | Fix compatibility alias docs |
| Pattern A next-step docs conflict with Research Session Loop | Research loop forbids `tasks/todo.md`/`/exec` for Pattern A; next-step table tells positioning to use them | Current docs disagree on execution driver | High | Directly observed | Update `docs/skill-next-step-contracts.md` |
| Canonical workflow report has stale artifact paths | Report says UX/UI pre-prototype artifacts live in `specs/`; prototype convention says `design/` | Current-looking report is stale after later artifact-boundary work | High | Directly observed | Update or label historical |
| npm distribution doc has internal package identity drift | Top says `skillpacks` primary; later says `gskp` only package/bin | Later sections preserve obsolete implementation plan | High | Directly observed | Split current vs historical sections |
| Most archive drift is expected | Large archive counts and dated files | Historical docs should not be cleaned globally | Medium | Assumes archives are intentionally retained | Add labels, do not rewrite archives |

## Current / Needs Update / Historical Matrix

| Surface | Classification | Action |
| --- | --- | --- |
| `README.md` | Mostly current | Replace primary `business-discovery` examples with `business-research`, leaving alias note if needed. |
| `docs/QUICKSTART.md` | Needs update | Replace `business-discovery` primary install guidance. |
| `docs/packs.md` | Needs update | Rename `business-discovery` to `business-research`; fix `business-app` expansion to include `customer-lifecycle`. |
| `docs/pack-workflow-matrix.md` | Current on business-research | Keep; use it as the source for business lane naming. |
| `docs/skill-next-step-contracts.md` | Needs update | Replace Pattern A `positioning` `tasks/todo.md` and `/exec` routing with Research Session Loop routing. |
| `docs/research-session-loop-convention.md` | Current | Treat as authoritative for Pattern A research execution. |
| `docs/prototype-session-loop-convention.md` | Current | Treat as authoritative for pre-prototype `design/` artifact boundaries. |
| `docs/canonical-workflow-report.md` | Historical or needs update | Update `specs/` pre-prototype paths to `design/` or label as historical snapshot. |
| `docs/skillpacks-npm-distribution.md` | Needs update | Separate current dual-package decision from stale `gskp`-only planning text and old manifest snippets. |
| `docs/skillpacks-install-routing-contract.md` | Current | Treat as authoritative for `npx skillpacks ...` install-route wording. |
| `packs/devtool/{codex,claude}/devtool-docs-audit/SKILL.md` | Needs update | Add or remove missing `Next-Skill Routing` reference. |
| `.codex/skills/devtool-docs-audit/SKILL.md` | Needs refresh after source fix | Installed copy carries the same missing-section drift. |
| `packs/business-app/PACK.md` | Needs update | Replace old `business-discovery` split wording with `business-research`. |
| `packs/customer-lifecycle/PACK.md`, `packs/business-growth/PACK.md`, `packs/business-ops/PACK.md`, `packs/code-quality/PACK.md` | Needs update | Use `business-research` as canonical dependency name. |
| `packs/**/archive/**` | Historical | Do not rewrite for drift; use only as version history. |
| `tasks/ship-manifest-*`, `benchmark/*`, `prompts/*` | Historical | Exclude from active drift unless current docs point to them. |

## Source Coverage Gaps

- No web research was performed; this is a repo-internal documentation alignment audit.
- I did not read all 4,779 files line by line. I classified inventory by path and used targeted scans for high-risk contracts: install commands, pack names, routing, artifact paths, package identity, alignment lifecycle, and skill local references.
- I did not mutate the underlying drifted docs in this pass; this report identifies drift and recommends cleanup.

## Verification

| Check | Result |
| --- | --- |
| Repo-owned docs inventory excluding dependencies/build output | 4,779 files classified by path class. |
| Active/archived/installed skill inventory | 354 active pack skills, 2,172 archived skill snapshots, 53 installed Codex skills. |
| Targeted `rg` scans | Found drift across pack naming, Pattern A routing, pre-prototype artifact paths, and npm package identity. |
| Exact line evidence checks | Captured with `nl -ba` for the major findings above. |
| Final artifact validation | Recorded in `tasks/todo.md` after the report and alignment page are written. |
