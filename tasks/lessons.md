# Lessons

## 2026-05-24 — Feature interview is the post-spec add-on path

- A workflow review framed `$feature-interview` too much as a post-ship or pre-spec triage step, but the user clarified it is also the normal post-spec route for additions.
- After a production spec exists, route feature additions through `$feature-interview` to either update the existing spec or create a smaller-scope add-on spec instead of defaulting back to full `$spec-interview`.
- Post-spec feature triage should preserve the parent spec as the baseline contract and record exactly what the add-on changes, inherits, and leaves untouched.

## 2026-05-22 — Benchmark review handoffs are not remediation completion

- A `$benchmark-agent-review provision-agentic-config` run documented the main remediation and recommended `$targeted-skill-builder`, but the follow-up answer needed to state plainly that the remediation itself had not been implemented.
- After any review workflow that names a definitive remediation route, distinguish "review/report complete" from "owner contract/rubric remediation complete" in the final handoff.
- If the user asks whether the main remediation is done, answer from repository changes, not from the existence of a remediation table or next command.
- When the user immediately invokes the recommended remediation, implement the owner skill contract and validation checks rather than re-summarizing the review.

## 2026-05-22 — Competitive analysis should route to journey before value prop in prototype-first product flow

- A legacy business-discovery sequence routed standard competitive analysis to `value-prop-canvas` before `journey-map`, even after the product restart workflow had moved to ICP -> competitive analysis -> journey map -> UX/UI/prototype.
- In an AFPS (alignment-first, prototype-second) product workflow, competitive gaps need customer/user journey placement before solution-value mapping; otherwise value-prop-canvas can optimize abstract claims before the path to aha, conversion, and retention is understood.
- When changing canonical sequence order, update mirrored skill contracts, pack flow docs, workflow docs, route-contract summaries, generated showcase data, and focused route tests together.
- Treat older canonical workflow reports as executable routing evidence; stale summary docs can reintroduce old ordering even after individual skill contracts are fixed.

## 2026-05-22 — Approval-gated research needs alignment preview before approval

- A repo-wide alignment-page contract made durable output skills create `alignment/*.html` only after writing or updating canonical deliverables, but many research skills stop for approval before those writes.
- Approval-gated research, planning, spec, report, and document skills should treat the alignment page as a pre-approval preview artifact: build it, attempt to open it, point the user at it, ask for questions or adjustments, then write canonical files only after approval.
- Keep the approval gate on synthesized Markdown/spec/research/report outputs; do not classify the temporary/browser review page as the canonical artifact that requires prior approval.
- When fixing cross-cutting approval flows, audit both the approval-gate language and the alignment-page language so the two instructions do not contradict each other.

## 2026-05-21 — Alignment page changes need all durable planning skills, not only prototype path

- A root `alignment/` migration updated the named prototype-first path but missed upstream research skills such as `icp`, so users still saw no automatic alignment review page after earlier alignment steps.
- When changing a cross-cutting output contract, audit every skill that writes durable planning, research, spec, interview, or decision artifacts across global skills and enabled packs, not just the skills named in the immediate plan.
- Validate the contract with repository-wide checks that find output-writing skills lacking `alignment/*.html`, archive-first replacement, and browser-open reporting; do not rely on a hand-picked skill list.
- Treat research-pack skills like ICP, competitive analysis, journey mapping, and other early alignment outputs as first-class alignment-page producers unless they explicitly document no-file or human-only behavior.

## 2026-05-21 — Run/ship loops are not alignment-page producers

- A repo-wide alignment-page contract pass overcorrected and added HTML review-page output to execution/shipping loop skills.
- `$run`, `$ship`, `$ship-end`, kanban run/ship loops, and monorepo run/ship loops should stay operational: execute, validate, package, commit, push, and route without generating alignment review pages.
- Cross-cutting alignment-page audits must exempt execution/shipping loop skills by role, even when those skills write task docs, reports, generated assets, or commits as part of shipping.
- Keep alignment pages for planning, research, spec, interview, prototype, and decision artifacts; do not require them for routine execution/shipping orchestration.

## 2026-05-21 — Concept routes bootstrap only before repo readiness

- Concept exploration was clear about being pre-ICP, but its next-step rules did not distinguish an unbootstrapped idea from an already initialized repo.
- Route `$concept-exploration` to `$bootstrap-repo` only when the concept is ready and the repo lacks meaningful README plus agent workflow docs, or the user is shaping an idea outside a project repo.
- In an already bootstrapped repo, route concept exploration to `$icp` or the required research-pack install, not to `$bootstrap-repo`.
- Keep `$scaffold` downstream of roadmap/plan-phase for normal product work; use it early only when the user explicitly asks for a minimal app/package shell before research.

## 2026-05-21 — Fresh product resets need market alignment before UI alignment

- A reset/bootstrap workflow routed product restarts from the high-level concept directly to `$ui-interview --requirements-only`, skipping ICP, competitive landscape, and journey mapping.
- When old docs/research are intentionally archived, the next active step should rebuild market and lifecycle alignment before UI requirements: `$icp` -> `$competitive-analysis` -> `$journey-map` -> `$ux-variations` -> `$ui-interview` -> prototype work.
- If the required research packs are not enabled in the fresh repo, route first to `$pack install business-discovery` and `$pack install customer-lifecycle`, then continue the research sequence.
- UI requirements should be downstream of ICP/journey evidence for product/app restarts, not the first default artifact after bootstrap.

## 2026-05-21 — Reset mode should preserve concept, not stale docs

- A reset/bootstrap workflow initially preserved valid salvage docs as active files, but the user clarified that old docs should be archived too so research starts from scratch.
- In-place fresh starts should keep only a concise high-level concept artifact active; archive old docs, research, specs, task files, implementation notes, and design docs with the stale codebase.
- Salvage docs may be referenced in the archive manifest or desk-flip report for historical context, but downstream alignment and research should rebuild from the high-level concept rather than treating old documents as source of truth.
- When routing to AFPS workflows after reset, make the concept seed the input to `$ui-interview --requirements-only`, not a pile of old research/spec artifacts.

## 2026-05-21 — Desk-flip handoffs need reset/archive and alignment routing

- A `desk-flip` restart route sent users to `bootstrap-repo`, but `bootstrap-repo` only handled README/agent docs and did not reset an existing stale codebase.
- Fresh-start workflows must distinguish new-repo bootstrap from in-place reset. For in-place restarts, archive stale implementation files under `archive/` with a manifest before writing fresh bootstrap docs.
- After bootstrap for product/app restarts, route to AFPS requirements work (`$ui-interview --requirements-only` or runner equivalent) before UX variations, prototypes, UAT, consolidation, and production specs.
- Do not let a bootstrap handoff skip directly to implementation planning when requirements, layout direction, or prototype evidence are not accepted yet.

## 2026-05-21 — Final handoffs must render routes for the active CLI

- A Codex `$ship` handoff copied `/run` from `tasks/todo.md` into the final `Recommended next command`, even though Codex users need `$run`.
- Treat routes in task docs, benchmark reports, and prior handoffs as task identifiers, not final command text.
- Before final output, normalize global skill commands to the active CLI: Codex uses `$...`; Claude uses `/...`.
- Preserve explicit cross-runner handoffs such as `/delegate $ship`, but do not let stale slash or dollar examples bleed into same-runner final recommendations.

## 2026-05-21 — Never paste resolved secrets into docs or handoffs

- A kanban validation handoff once copied the resolved `POKETOWORK_DATABASE_URL` value into `docs/kanban-test-results.md` instead of leaving an env-var placeholder.
- When documenting setup commands, write placeholder syntax such as `export NAME="$NAME"` or `export NAME="<set locally>"`; never expand, echo, or paste current secret values from env files, shell context, command output, or model-visible context.
- Before committing documentation that mentions credentials, run a targeted secret scan for URL credentials, `DATABASE_URL`, provider token prefixes, and password-like query params.
- If a secret reaches git history, report the exact commit and path without repeating the secret, rotate the credential, and decide whether repository history needs to be rewritten.

## 2026-05-18 — Workflow demos should start from user value and real excerpts

- A `/workflows` demo pass showed generic step commands and summaries even when benchmark run excerpts were available, making the scenario feel synthetic.
- Workflow demos should lead with the user's goal for using the workflow before showing command execution details.
- When persisted benchmark prompt/output excerpts exist, render those excerpts in the visible transcript instead of replacing them with generic curated copy.
- Curated fallbacks are acceptable only for steps without retained run evidence, and they should clearly describe the user value rather than only the command.

## 2026-05-18 — Interview questions should use product language

- A `$feature-interview` follow-up asked about "sub-blocks" and reveal cadence in implementation terms, which made the design decision unclear.
- Interview workflows should phrase UI behavior questions in the user's visible product language first, then optionally translate to implementation terms after the user confirms.
- For animation and interaction decisions, ask what the user should see on screen rather than naming component states, render units, or internal timing mechanics.
- If the user says they do not understand a question, restate it with a concrete screen example before continuing the interview.

## 2026-05-18 — Clean shipped investigations should not route to ship-end

- A `$investigate` run can complete the fix, validate it, commit it, push it, and leave a clean tree with no unpushed commits, then still recommend `$ship-end`.
- Investigation workflows should treat a clean, already-pushed bug fix as terminal unless there is concrete pending documentation, uncommitted work, unpushed commits, deploy follow-up, unresolved wrap-up work, or a task source explicitly requests ship-end.
- In that terminal state, the final handoff should say `**Next work:** none` and `**Recommended next command:** none`.
- Benchmark coverage for mutation-capable debugging workflows should reject mechanical ship-end recommendations when the fixture state already proves there is nothing left to ship.

## 2026-05-18 — Prototype-first gates need separate phases and route experiments

- The initial prototype-first workflow update added a `Prototype Phase 0` concept but left room for agents to stuff prototype scope, calibration, and later production infrastructure into one phase.
- Product and feature planning should separate prototype exploration from production implementation: add or prepend a distinct Phase 0 / experiment phase when no accepted clickable journey exists, then promote only justified infrastructure into later phases.
- Feature prototyping should usually produce multiple small experiments, preferably on separate routes such as `/experiments/<variant>`, so users can click through alternatives side by side before consolidation.
- Roadmap and plan-phase skills should distinguish "prototype experiments", "calibration/consolidation", and "production promotion" instead of treating "defer infra" as sufficient.
- Benchmark fixtures for product planning should assert separate prototype phase structure and multi-route experiment planning, not only fake data and deferred infrastructure language.

## 2026-05-17 — Package update skills should persist installer age gates

- An `$update-packages` run manually selected versions older than 8 days but did not make future package-manager installs enforce the same safety policy.
- Dependency-update workflows should add or update project package-manager config as part of the update, not only choose safe versions during the current run.
- For npm, require project `.npmrc` `min-release-age=8`.
- For pnpm, require an 8-day equivalent (`11520` minutes) in the configuration format the active pnpm version actually reads, while still documenting the `.npmrc` guard when the project uses it.
- Verification should check the committed config files and not treat a one-time registry query as sufficient supply-chain protection.

## 2026-05-17 — Benchmark test handoffs should route evaluated runs to agent review

- A `$benchmark-test-skill roadmap` run ended by recommending another `$benchmark-test-skill roadmap` rerun even though Codex produced evaluated passing runs and only the Claude lane was infrastructure-blocked.
- When at least one runner has evaluated benchmark outputs and no subjective review has been performed, route to `$benchmark-agent-review <skill>` unless the only outcome is infrastructure blocking or a deterministic failure that needs triage.
- Fully blocked lanes should be reported separately, but they do not erase evaluated evidence from another runner.
- Reserve repeat `$benchmark-test-skill <skill>` recommendations for pure infrastructure-blocked runs, post-remediation reruns, or explicit user requests for another deterministic run.

## 2026-05-15 — Do not treat stale manual deploy tasks as live deployment truth

- A `$ship` handoff reported the Skills Showcase Vercel setup as pending because `tasks/manual-todo.md` still contained old unchecked Vercel setup tasks.
- When a user says a surface is already live, update the manual task source of truth before repeating older blockers.
- Separate confirmed hosting status from unverified launch checks: Vercel project/deploy can be complete while Neon env vars, `/follow`, and `/admin/newsletter` still need verification.
- Future ship handoffs should read manual tasks critically and distinguish "initial setup not done" from "live surface exists but smoke checks remain."

## 2026-05-15 — Codex interview skills should ask one primary question per turn

- Codex interview runs inherited Claude's 1-3 grouped-question cadence even though Codex cannot open a structured ask-user prompt outside Plan mode.
- Recent Codex session history included repeated user corrections asking to discuss interview questions one by one after `$spec-interview` runs.
- For Codex-facing interrogation skills, ask one primary decision question per turn by default and use short follow-up bullets only to clarify that same decision.
- Reserve `request_user_input` for sessions that are already in Plan mode, and use it for one material decision with 2-3 concrete options rather than batching unrelated questions.
- Keep Claude skills free to use grouped AskUserQuestion turns when that matches Claude's interaction model.

## 2026-05-15 — Red/green test analysis must distinguish app tests from benchmark harness tests

- A red/green testing workflow analysis answered with benchmark-harness incidents when the user meant app-level tests such as Vitest, Playwright, and frontend smoke tests.
- When a user says "tests our apps do" or names Vitest/Playwright, scope evidence to product/application test suites first, not skill benchmark reports, unless they explicitly mention benchmark harnesses.
- Separate categories in reports: app unit/integration tests, browser/e2e tests, generated-data validation, skill benchmark harnesses, and manual/UAT checks.
- If the initial evidence source is ambiguous, state the scope assumption before drawing incident-level conclusions.

## 2026-05-15 — Cross-board testing analysis must not collapse into the current repo

- A follow-up app-test analysis overcorrected into auditing only this repository's Skills Showcase tests when the user wanted testing performance examined across projects/apps broadly.
- For cross-board red/green test analysis, scan local session history by project and testing tool first, then group incidents by app/project and test layer before making repository-specific recommendations.
- Treat the current repo as one data point, not the evidence universe, unless the user explicitly asks for a codebase-local audit.

## 2026-05-14 — UI refactor scope must include duplicate legacy blocks on already-themed pages

- A sitewide theme refactor plan initially called out the rest of the Skills Showcase routes while underemphasizing that `/workflows` itself still has an older top selector/panel above the Playful Lab player.
- When evaluating a theme consolidation, audit every route for mixed-era sections on the same page, not only pages that appear untouched.
- Refactor scope should explicitly remove duplicate legacy blocks when a newer component already represents the intended direction.

## 2026-05-14 — Approval-gated reports should not route past approval

- A `$creator-positioning` report-first run included `Recommended next skill: $content-programming` while it was still waiting for user approval to write the positioning artifact.
- In approval-gated workflows, the approval request is the next action. Do not emit downstream skill or command routing until the approved artifact has actually been written or updated.
- Skills that combine `Report-First Approval Gate` with `Next-Skill Routing` need an explicit stop rule in the approval gate so agents do not mechanically copy post-write routing into pre-write approval reports.
- Apply the rule to mirrored Claude and Codex skill contracts when the approval-gate pattern exists in both.

## 2026-05-14 — Benchmark evidence changes can stale the showcase frontend

- A `$benchmark-agent-review icon-handler` run updated benchmark/review evidence but did not refresh the Skills Showcase frontend data, leaving `icon-handler` catalog benchmark evidence pointing at the older 2026-05-13 report.
- The showcase freshness gate applies to public benchmark evidence as well as `SKILL.md` and `PACK.md` behavior/metadata changes.
- After adding or updating curated benchmark reports, subjective review reports, or benchmark matrix inputs, run `node scripts/generate-skills-showcase-data.mjs`, `node scripts/generate-skills-showcase-github-data.mjs`, and `scripts/validate-skills-showcase-data.sh`.
- Generator parsing must handle the current benchmark report table shape, including title-case agent labels and columns such as `Output Quality`.

## 2026-05-13 — Hygiene must check canonical root existence, not just contents

- Hygiene validated files *inside* `research/` but silently passed when `research/` did not exist at all, even when research-pattern files (`icp-*.md`, `gtm-*.md`) existed in non-canonical locations like `docs/`.
- The war-room research ingester flagged pulseboard's missing `research/` directory while hygiene in the same project reported 0 errors.
- Audit skills that define canonical roots must check root existence and scan for misfiled content in sibling directories, not only validate structure within present roots.
- When adding a new canonical-root check, use Warning severity for "absent but misfiled content found elsewhere" and Info for "absent with no content found" to avoid false positives on early-stage projects.

## 2026-05-11 — Separate benchmark coverage from benchmarked results

- A benchmark coverage matrix can show custom/generic/blocked setup eligibility without proving that a skill already has persisted evaluated runs, test data, and grades.
- When the user asks which skills have been benchmarked, report from persisted benchmark artifacts and curated reports, not from setup coverage metadata alone.
- Keep a separate benchmark-results matrix with raw report paths, evaluated run counts, hard pass rates, quality scores, subjective review grades, and incomplete/blocked persisted reports.
- For git-mutating skills, do not leave them permanently blocked if a safe explicit-permission integration fixture can use a disposable test repository; document the safety boundary before implementation.

## 2026-05-11 — Benchmark execution and subjective review are separate steps

- `$benchmark-test-skill` should run deterministic verify/benchmark evidence and write the benchmark report; it should not absorb subjective agent-review work into the same step.
- After deterministic benchmark completion with evaluated runs, route to `$benchmark-agent-review <skill>` as a separate review step when subjective ergonomic quality or remediation planning is needed.
- `$benchmark-agent-review` owns output-quality judgment and remediation-ready handoff details after persisted benchmark artifacts exist.
- Route directly from `$benchmark-test-skill` to `$ship` only when no subjective review is needed or after the separate review step has already been completed.

## 2026-05-11 — Review reports need remediation-ready next steps

- A `$benchmark-agent-review ship` report identified weaknesses but did not make every remediation decision definitive enough for the next operator.
- Agent-review skills should convert each material weakness into a remediation target: owning skill or harness file, exact contract or rubric gap, validation command, and recommended next route.
- Keep the output-quality verdict primary, but add a remediation plan that distinguishes skill contract fixes from benchmark rubric fixes, retained-evidence issues, and one-off run problems.
- Validate this with contract-lint coverage so future review workflows cannot stop at broad advice like "tighten the rubric" when the report found actionable output-quality issues.

## 2026-05-11 — Agent benchmark reviews judge skill outputs first

- A `$benchmark-agent-review ship` run over-focused on deterministic benchmark laxness and recommended benchmark tightening as the primary conclusion.
- `$benchmark-agent-review` should treat hard assertions and deterministic quality scores as context for triage, not as the object of review.
- Lead with the generated skill output verdict against the agent-review rubric: usefulness, specificity, validation strength, scope control, route ergonomics, absence of invented facts, and residual-risk awareness.
- Mention deterministic rubric tightening only after the output-quality judgment, and only when it would help future triage surface the same skill-output issue.

## 2026-05-11 — Preserve existing product surfaces before proposing framework migration

- A first-party newsletter capture spec initially discussed moving to a minimal app framework without first making the existing Skills Showcase site concrete.
- When a user asks to extend an existing product surface, inspect and name the current files/routes before recommending a migration or architecture change.
- Treat framework migration as a preservation refactor when the product surface already exists: port the current content, route map, data contracts, and visual system unless the user explicitly asks for a redesign.
- If a requested library stack fits poorly with the current implementation style, explain the mismatch against the existing files and frame the refactor as the smallest way to support the new capability.

## 2026-05-11 — Benchmarks must respect Claude slash and Codex dollar route conventions

- A `ship` benchmark initially treated Claude failure as a skill failure because the setup expected `$run` for both Claude and Codex.
- When a benchmark runs both agents, hard assertions and quality rubrics must use the corresponding route convention for the runner: slash commands for Claude (`/run`, `/ship`) and dollar commands for Codex (`$run`, `$ship`).
- Before diagnosing a mirrored skill as failed, compare the benchmark setup against both `global/claude/<skill>/SKILL.md` and `global/codex/<skill>/SKILL.md`; a mismatch in the harness is a test bug, not proof of a skill-contract bug.
- Add deterministic layer1 coverage for runner-specific route expectations whenever a shared setup supports both agents.

## 2026-05-11 — UI consolidation needs UAT after variants are built

- A workflow audit initially treated low `ui-consolidate` usage as a missing handoff, but the user clarified that consolidation can also be recommended too early.
- After UX/UI variants are built, route through a UAT/evaluation step before `ui-consolidate` so the user has time and structure to try each variant and form a defensible opinion.
- Variant deliverables should define how to test each option: target task, success criteria, comparison questions, evidence to capture, and what tradeoffs to notice.
- Recommend `ui-consolidate` only after evaluation evidence exists or the user explicitly says they have reviewed the variants and are ready to converge.

## 2026-05-10 — Missing injected skills may still exist in project packs

- The session skill list can omit project-local pack skills when the pack is not loaded into the active runtime context, even if the skill exists in the repository.
- When a user invokes `$<command> <arg>` and `<command>` is missing from the injected skill list, search `packs/*/{codex,claude}/<command>/SKILL.md` and project pack metadata before treating `<arg>` as the active skill.
- In this repository, `benchmark-test-skill` lives under `packs/agentic-skills-bench/` and should be resolved there before falling back to `design-system`.
- When a rule applies to both Claude and Codex command resolution, update both `CLAUDE.md` and `AGENTS.md` unless the user explicitly limits it to one agent file.

## 2026-05-10 — Benchmark rate limits are infrastructure blocks, not skill failures

- When a benchmark runner reports a rate limit, quota exhaustion, or account-capacity error, classify that run as infrastructure-blocked instead of counting it as a failed skill assertion.
- `$benchmark-test-skill <skill>` should benchmark both Claude and Codex by default so one runner's capacity or behavior does not stand in for the skill as a whole.
- Report pass rate over evaluated runs only, and separately report blocked-run counts and reasons.

## 2026-05-10 — Benchmark-test-skill means skill benchmark, not target skill execution

- `$benchmark-test-skill <skill>` belongs to the `agentic-skills-bench` pack and should run the harness verification plus benchmark extension for that skill.
- Do not interpret `$benchmark-test-skill design-system` as "run design-system in a benchmark mode" or produce app/site design-system deliverables unless the user explicitly asks for those artifacts.
- Prefer explicit command names when a workflow takes another skill name as its argument; ambiguous names make the active command and target skill easier to reverse.
- When a command composes two skill-like names, resolve the leading command first, including project-local pack skills and dirty/untracked pack additions, before applying the trailing argument as the active workflow.

## 2026-05-07 — Treat product showcases as product roadmaps, not one-off pages

- A showcase for an agentic workflow library can be a real top-of-funnel product, not a single marketing page, when the user's goal includes personal brand, distribution, community, and product proof.
- Do not defer newsletter/email capture, public GitHub proof data, or multi-page routing by default just because the first implementation can be static.
- Distinguish public/open-source proof telemetry from visitor-tracking analytics and from unrelated live product metrics; GitHub proof data can belong in MVP while live LexCorp metrics remain out of scope.
- When the user wants skill changes to keep the site current, roadmap the freshness contract explicitly: generated data, validation, and skill-changing workflow prompts all need to agree.

## 2026-05-07 — Agent-team parallel work needs branch and PR isolation

- A direct-to-primary rule is correct for sequential work, but it becomes unsafe when multiple write agents work in parallel from one base.
- When a phase uses `agent-team` write lanes, each lane needs its own non-primary GitHub branch, commit evidence, pushed branch, and PR URL before returning.
- Planning skills must include a consolidation/PR review step after parallel lane completion and before final validation, shipping, or integration into the primary branch.
- Treat branch-backed lane PRs as the explicit exception to the normal direct-to-primary workflow; do not let broad feature-branch habits leak back into serial work.

## 2026-05-05 — Avoid singular/plural skill name ambiguity

- Splitting one workflow into broad and focused commands can create a near-duplicate naming trap when the only visible difference is singular versus plural.
- When users identify a likely command-selection ambiguity, prefer a semantically distinct name for the focused workflow instead of a one-letter variant.
- For session analysis, keep `$analyze-sessions` as the broad cross-session trend command and use `$session-triage` for one immediate issue, correction, repo/session incident, or skill failure.

## 2026-05-05 — Keep Claude and Codex agent config blocks separate

- A config conflict was easy to underweight because Codex reads `AGENTS.md`, not `CLAUDE.md`, but the provisioning workflow had been copying Claude-oriented subagent guidance into both files.
- When auditing or generating agent config, evaluate each file according to the agent that consumes it instead of assuming mirrored instructions are harmless.
- Keep Codex `AGENTS.md` subagent guidance constrained by active Codex tool permissions; Claude-specific subagent defaults belong only in `CLAUDE.md`.

## 2026-05-05 — Next-step skill routing must validate pack installation

- A next-step routing answer initially cited the universal contract but did not check for existing skill contracts that still recommend pack-local skills directly.
- When auditing or writing next-step recommendations, validate the target skill against the active platform and `.agents/project.json.enabled_packs`, not only against repository-wide skill existence.
- If a target skill lives in a pack that is not guaranteed active, the recommending skill must either check the pack is enabled before recommending it or recommend installing/enabling the pack first, e.g. `$pack install <pack>` / `/pack install <pack>`.
- Cross-pack examples, routing tables, and "default recommendation" lines need the same fallback language because agents often copy them into final responses.

## 2026-05-04 — Remotion pack scope includes format, script, and build

- A Remotion pack split was initially scoped only to `video-build`, but the user clarified that `youtube-format-research`, `video-script`, and `video-build` belong together.
- When separating a domain-specific pack from a broader workflow pack, include the full adjacent workflow chain, not just the terminal implementation skill.
- For Remotion work, treat `youtube-format-research -> video-script -> video-build` as the cohesive pack boundary unless the user explicitly asks for a narrower split.

## 2026-05-04 — Use repo-managed skill creation for agentic-skills contributions

- `$create-local-skill` creates user-local skills under `~/.codex/skills` or `~/.claude/skills`; it is not the right workflow when the user wants a skill added to this `agentic-skills` repository.
- When the user is working inside `agentic-skills` and asks to create a skill for the library, use `$create-agentic-skill` and create it under `global/codex/<name>/` and/or `global/claude/<name>/`, following repository conventions.
- Before invoking or following a skill-creation workflow, distinguish "personal/local skill" from "repo-managed global skill" and state the target path.
- If the wrong target is created, remove the mistaken local copy after preserving any useful draft content in the intended repo path.

## 2026-05-04 — Human-only blockers should not route back to run

- A handoff identified a manual overlay playtest as next work but still recommended `/run`, which made an external human-only validation look agent-executable.
- When next work requires human-only browser/OS interaction, real device access, authenticated dashboards without a reliable CLI/API path, or explicit sign-off, record it in `tasks/manual-todo.md` as a blocking manual task when it blocks the next automated step.
- The recommended next route should be `$guide`, a Claude-guided manual step, or an explicit manual-blocker handoff, not `/run` or `$run`.
- Keep the next work item primary; command routing should serve the work classification rather than mechanically matching the current skill invocation.

## 2026-05-24 — Apply alignment UX fixes to the shared contract, not one skill

- A request about "the html alignment pages" was incorrectly scoped to `$investigate` because the user invoked that skill for the investigation.
- When a bug or UX gap is in repeated alignment-page boilerplate, search all active `SKILL.md` alignment contracts and update the shared/template source plus every active copy.
- Add regression coverage that scans every active alignment-page skill, not only the skill used to report the issue.
- Treat archived skill versions as historical evidence; do not mutate them for current behavior fixes.

## 2026-05-04 — Exhausted queues route to discovery, not none

- A completed roadmap plus current documentation scan allowed `Recommended next command: none`, leaving a repo in a dead-end handoff even though candidate new-phase discovery was still possible.
- Scanner and shipping skills should reserve `none` for explicit user-requested pause, park, archive, or wait states.
- When implementation phases, documentation work, and promotable advisory items are all exhausted, recommend `$brainstorm` to discover candidate next phases before formal `$spec-interview` work.
- Keep this rule in both output templates and next-step routing sections so final responses cannot bypass it.

## 2026-05-04 — Distinguish workflow policy from existing orchestration skills

- A recommendation for a "workflow" around `mobile-ideas` sounded like inventing a new skill even though `$project-fleet` already exists.
- When an orchestration skill already exists, frame recommendations as project-specific policy, queues, scoring gates, and defaults that the existing skill should consume.
- Say "extend/configure `$project-fleet` for this fleet shape" instead of implying a separate new controller unless there is a clear missing primitive.
- For repeated fleet work, recommend durable playbooks/config/contracts first, then skill changes only where the current skill cannot read or enforce those contracts.

## 2026-05-03 — Verification gates should not become no-op plan handoffs

- A clean validation gate was followed by a separate "refactor if validation exposes drift" step, which forced Claude `/ship` to open a clear-context plan even though no remediation was expected.
- Keep verification mandatory, but fold conditional cleanup into the active Green/validation step unless there is known concrete remediation work.
- If validation passes and the expected source changes are none, record the no-op result, mark the gate complete, and advance to the next substantive step.
- Enter plan mode only when verification discovers failures, drift, warnings needing judgment, or a non-trivial remediation plan.

## 2026-05-03 — Variation pruning belongs before full specification

- `$ux-variation` surfaced "remove, merge, make more extreme, or add a fourth" only after presenting three fully framed variants, which made the checkpoint feel like late-stage rework instead of concept selection.
- For interrogation skills that generate alternatives, split the flow into two gates: first present lightweight concept candidates for keep/remove/merge/extreme/add decisions, then fully specify only the approved set.
- Wording should ask for a bounded adjustment action and optional rationale, not combine several vague decisions into one prose question.
- Do not say "before I commit" or imply implementation/build commitment when the actual next step is writing a planning deliverable.

## 2026-05-02 — Scanner skills must not route to themselves

- A `$roadmap` run could end by recommending `$roadmap` again because final routing chose a matching command without a self-recursion guard.
- For scanner/router skills, explicitly forbid recommending the same skill as the next command after it has updated its queue.
- If the first unchecked queue item is self-referential, treat it as stale task-doc state and route to `$reconcile-dev-docs fix tasks` (or the Claude slash equivalent) with evidence.
- Also fix the queue-writing source: a scanner should not write itself into its own priority queue. For `$roadmap`, missing-roadmap states must be handled by State B in the same run or by queueing the missing upstream input, never by queueing `$roadmap`.
- When a completed roadmap has a newer substantive spec, `$roadmap` must extend the roadmap in the same run and seed the new phase with `$plan-phase N`; it must not write a `$roadmap` queue item asking a later run to do that extension.

## 2026-05-01 — Use local venv for YouTube transcript dependency

- A `$youtube-audit` prerequisite failure under Homebrew Python was handled with a system-Python install recommendation, which conflicts with the skill's PEP 668-safe instructions.
- When `youtube_transcript_api` is missing, create or reuse project `.venv` and install with `.venv/bin/python -m pip install youtube-transcript-api`.
- Do not recommend `python3 -m pip install youtube-transcript-api` against Homebrew/system Python, and do not recommend `--break-system-packages`.

## 2026-05-01 — Put required handoffs in Output, not only routing notes

- Devtool pack skills had `## Next-Skill Routing` sections, but users still saw runs that did not recommend the next skill.
- When a skill must emit a handoff, state the requirement in `## Output` and specify the exact final-response shape, then keep the routing section as the decision logic.
- Validate both presence of the routing logic and presence of the final-output phrase across mirrored Claude/Codex skills.

## 2026-04-30 — Completed-roadmap scans must be idempotent

- `$roadmap` and `/roadmap` previously re-queued research-roadmap whenever all implementation phases were complete, even after research-roadmap had already written an active or current `## Priority Documentation Todo`.
- When one planning skill queues another one-shot scan, teach the caller to recognize the callee's completion surface before recommending it again.
- For completed implementation roadmaps, route to the first unchecked documentation item when the documentation queue exists, and only queue research-roadmap when no current documentation queue/result exists.

## 2026-04-30 — Codex `$run` plans are implicitly approved

- Session history showed the user consistently accepted `$run` plans with bare approvals (`y`, `yes`, `yes please`) and did not reject normal `$run` execution plans.
- Treat a `$run` invocation as approval for the next planned step or scoped phase after presenting the plan. Do not add a second routine approval question.
- Still ask explicitly for separate safety decisions: destructive commands, production deploys, paid/external account actions, credential or secret handling beyond the project contract, execution-profile downgrades, blockers, or material scope changes.

## 2026-04-17 — Check live AWS auth before SSO login

- When a deploy path may use AWS SSO, do not infer that credentials are expired from stale context, earlier logs, or memory.
- First verify current auth with `aws sts get-caller-identity --profile <profile>` or let the deploy command fail with a current credential error.
- Only run `aws sso login --profile <profile>` after that live check proves credentials are missing or expired.

## 2026-04-22 — `/run` must trust profile metadata over legacy step prose

- `/run` auto-dispatches `agent-team` phases via isolated worktrees. Do not stop just because the profile says `agent-team` or because the phase/step body contains stale advisory text like *"do not implement in a single `/run`"* or *"use `/delegate`"*.
- That prose typically predates the agent-team dispatch feature. The current authority is the `### Execution Profile` block (after `/patch-exec-profile` fills it), not narrative embedded in the step description.
- Only stop if `/patch-exec-profile` cannot resolve the profile (overlapping `Owns`, cyclic `Depends on`, missing lane specs that can't be inferred). `/delegate` is for Claude↔Codex handoff, not lane parallelism.

## 2026-04-19 — Keep Claude `/run` execution-only and `/ship` handoffs bounded

- Claude `/run` should execute exactly one approved step and then hand the dirty tree to `/ship`; it should not commit or push.
- Claude `/ship` is not complete after writing the next-step plan. Unless `--no-plan` is set or a blocker is documented, it must enter plan mode so the user can clear context and implement.
- Clear-context sessions launched by `/ship` plan mode are ship-one-step sessions. The plan handed to them must explicitly say to implement the approved step, validate, commit/push, deploy only with an explicit manual deploy contract, write the following step's plan, set/check `showClearContextOnPlanAccept` and `defaultMode: "acceptEdits"`, start the next approval UI with `EnterPlanMode` before `ExitPlanMode`, and stop before implementing it.
- If Claude refuses `EnterPlanMode` because Auto mode or the active permission mode requires an explicit user request, do not try `ExitPlanMode`; stop and ask the user to explicitly request plan mode, such as `/plan <next step>`.
- Deploy discovery should not stall shipping in repos with no explicit manual deploy contract; skip deploy unless `deploy.md` or `tasks/deploy.md` exists.
