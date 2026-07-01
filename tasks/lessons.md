# Lessons

## 2026-07-01 - Rapid deployment means rapid deck taxonomy first

- A user asked for "canonical rapid deployment workflows" and clarified they meant workflows like ORD, not deploy/release operations.
- Rule: in this skill library, interpret "rapid deployment" or "rapid workflow" as the deck taxonomy first: VARD for business/consumer rapid app experiments and ORD for developer/OSS rapid package experiments. Only discuss `release-ops` deploy tooling when the user explicitly asks about deployment mechanics, releases, environments, or shipping infrastructure.
- When the user references ORD, read `docs/decks.md` and the relevant rapid pack `PACK.md` files before answering.

## 2026-06-29 — Release readiness expires when the tree changes

- A `0.1.16` readiness answer was correct for the clean tree at the time, but the next publish attempt failed because a later alignment page/index change made the tracked tree dirty before publishing.
- Rule: treat publish readiness as a point-in-time result. Immediately before telling the user to run a real publish, re-check `git status --short --branch` and call out that any new tracked or untracked files must be committed or intentionally removed first.
- When the user reports the clean-tree gate failed, inspect the exact dirty paths and current commits before assuming the prior readiness check is still valid.

## 2026-06-29 — BIP channel gates should recommend before asking

- A BIP target-channel gate defaulted every unapproved channel to `not-now`, which made active Build-In-Public mode too conservative even after Stage 2 work produced enough evidence to judge channel fit.
- Rule: when a workflow has completed evidence gathering and asks the user to approve output channels, the agent should rank viable channels, mark each as `recommended`, `optional`, or `not-now`, and preselect recommended channels for confirmation.
- Keep channel-selection approval separate from final content approval: no draft posts, video ideas, channel-specific sample content, or channel convention loading until the user approves the channel set.

## 2026-06-29 — Enabled feature gates need enabled-state outputs

- A `ship-end` BIP wrap-up printed that the BIP gate was skipped because `alignment.build_in_public` was already true, but then produced no Build-In-Public posts or suggestions.
- Rule: when a workflow has an enablement gate plus an enabled-mode behavior, the already-enabled branch must skip only the enablement prompt and still run the enabled behavior.
- Add regression checks for already-enabled, dismissed, and newly-enabled branches whenever gate wording changes, not only the opt-in prompt branch.

## 2026-06-28 — Interactive publish paths need signal rollback tests

- A real `npm publish` path entered browser/web auth, was interrupted with Ctrl-C, and left release source files bumped to `0.1.15` even though neither package had published that version.
- Rule: release rollback coverage must include signal and interactive-auth interruptions, not only ordinary nonzero command exits.
- For publish scripts, run auth/package-existence preflight before source mutation whenever the target version can be computed in a temporary package copy.

## 2026-06-28 — Release bumps need a rollback boundary before publish

- A real `./publish.sh patch` auth preflight failure left `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` bumped to `0.1.14`, causing the next run to fail the clean-tree gate before it could retry auth.
- Rule: when a release script mutates tracked source state before an external publish/auth step, create a restore snapshot and automatically roll it back for every failure before the first package publish completes successfully.
- Preserve the bumped source state only after the first package publish exits successfully, because partial-publish recovery may need the source version for `--current` recovery.

## 2026-06-27 — Flow maps need surfaces, not UI-only screens

- A design-tree terminology review showed that `user-flow-map` used screen/route wording for flow points that may actually be MCP responses, CLI output, SDK/tool-call results, API responses, validation events, background state, or audit records.
- Use `surface` as the umbrella term for any visible, actionable, or inspectable point in a flow.
- Treat MCP, CLI, SDK/tool calls, and APIs as channels of the same surface by default; split them into distinct surfaces only when behavior materially differs.
- Keep `ui-interview` page/screen focused: it consumes upstream surfaces and channels, then owns visual UI candidates such as screens, routes, regions, diagnostics views, and audit/recovery screens.

## 2026-06-27 — Page YAML needs both invocation cue and parser contract

- A page-YAML routing discussion exposed that putting the skill invocation only in a YAML field can be easy for agents to miss, while putting it only in a prepended freeform line would weaken parser compliance.
- For alignment and interrogation page YAML, make the invocation visually first as a valid YAML comment: `# Invoke with: <resolved command>`.
- Keep `command` as the first real YAML key and match `agent_routing.command` when routing metadata exists; treat the comment as an attention cue and the field as the enforceable contract.

## 2026-06-24 — Downstream skill prompts need availability gates

- A `$brainstorm` handoff produced `$feature-interview ...` copy-paste prompts even though `feature-interview` was not enabled in `.agents/project.json` and no local/global skill file was installed.
- Before recommending or writing prompts for a downstream skill, verify direct availability through `.agents/project.json.enabled_skills`, an enabled provider pack, or local/global skill files.
- If the downstream skill is missing, put the `npx skillpacks install <skill-or-pack>` prerequisite before the unavailable command in both user-facing output and durable artifacts, then include the agent-specific reload or fresh-session guidance.

## 2026-06-23 — Keep `tasks/todo.md` current-only after shipping

- Stale next-work recommendations kept recurring because agents prepended completed `Current Implementation` sections to `tasks/todo.md` and left old unchecked terminal items there after shipping.
- Treat `tasks/todo.md` as the active execution contract only. After shipping, replace it with the next active task, a no-active-task state, or explicitly promoted next work; do not use it as an append-only history log.
- Preserve completed implementation evidence in `tasks/history.md`, ship manifests, reconciliation reports, and git history. Before recommending next work, scan only current active sections or first reconcile old unchecked boxes against commits/history.

## 2026-06-22 — Verify cleanup commands against observed targets

- A legacy global-skill cleanup recommendation treated `npx skillpacks uninstall-global` as sufficient, but the user's run returned "Removed 0" while previously inspected `~/.codex/skills/idea-scope-brief` and `~/.claude/skills/idea-scope-brief` still had `.agentic-skills-managed` markers.
- When recommending cleanup, verify the post-state against the exact observed target paths. A command that exits 0 but removes 0 is not success if the target evidence predicted removals.
- For legacy marker migrations, inspect the recognition predicate too: a cleanup command may only remove installs whose source path still satisfies current ownership checks, leaving older managed markers behind.

## 2026-06-22 — Question-like alignment YAML needs intake classification before mutation

- Fresh-session `needs-clarification` / `clarify-before-approval` YAML can represent a question, concern, premise challenge, or tradeoff rather than an instruction to edit the HTML page.
- Before mutating alignment artifacts from section feedback YAML, classify the user intent as answer-only, amend-page, investigate-before-amend, pushback-needed, or ask-user-before-amend.
- Answer or push back on question-like and ambiguous feedback before editing; reserve direct page mutation for plainly factual clarifications or explicit amendment requests.

## 2026-06-22 — Multi-project failures need end summaries, not only inline logs

- A `skillpacks refresh --all` UX change improved dry-run summaries but left real refresh failures only inline per project, which makes failures easy to miss after long multi-project output.
- For multi-project commands that continue past failures, collect each failed project and emitted error message, then repeat them in the final summary.
- Add regression coverage for both the inline failure and the final failure-detail section so future summary work does not regress operational scanability.

## 2026-06-20 — Compiled-YAML handoffs should not duplicate fresh-session routing

- A Pattern A review-pending handoff used both `## Next Work` to tell the user to review/compile/paste YAML and `## Continue In A Fresh Session` to repeat fresh-session routing.
- Keep review/compile/paste instructions in `## Next Work`; the command section for pending YAML gates should only name the parent invocation to use with the compiled YAML.
- Do not have a pre-approval handoff describe the next phase's post-write routing. The receiving parent skill resolves state from YAML plus filesystem and emits its own `## Recommended Next Command` after it writes or amends the approved artifact.

## 2026-06-18 — Pack-install handoffs should preserve the destination skill

- A competitive-analysis final handoff correctly recommended `npx skillpacks install customer-lifecycle` because `journey-map` was unavailable, but the terminal command alone did not tell the user that `$journey-map` was the intended next skill after install.
- When a workflow route is blocked by a missing pack, make the install command the immediate recommended command, but keep the destination skill visible in `Next Work`, the report rationale, or equivalent handoff text.
- The durable pattern is: "install `<pack>` now; after refresh or a fresh session, run `<skill>`." Do not collapse that into only the prerequisite command unless no destination skill is known.

## 2026-06-17 — Finalized research artifacts still need explicit next-step routing

- A finalized JTBD positioning handoff listed changed files, verification, and open status, but omitted an explicit next-step route after converting the alignment page to confirmed/read-only.
- Even when a research or alignment artifact is complete, final output should state the concrete route: the next skill/command if workflow work remains, or "no automated next step" with the human/manual decision expected next.
- Do not treat "Open status" or archived working-packet proof as a substitute for next-step routing; terminal handoffs need a distinct `Next`/`Next Command`/`Next Work` line.

## 2026-06-17 — Research/design review routes stay outside exec-loop by default

- A `$ship-end` handoff routed "Review and resolve the Deployment Plan First prototype/copy review pages" to `$exec` because the fallback prioritized the runner surface over the owning review workflow.
- When next work names research, alignment, design, UI, UX, prototype-test, copy-audit, or review-page artifacts, identify the owning skill or review contract first and route directly to that skill, user review, or compiled-YAML step.
- Use `$exec` or `/exec` only after proving no narrower installed skill, artifact contract, or review route owns the next action; invocation syntax is a command-text fallback, not ownership evidence.

## 2026-06-17 — Pattern A continuation YAML should route to the parent, not a child

- A research-loop handoff contract relied on explicit parent re-invocation plus pasted YAML, while the YAML itself carried no routing context; this left fresh sessions dependent on the user retyping the right command and made child-framework routing tempting.
- Pattern A review-page compiled YAML should include `agent_routing` with `workflow: pattern-a-research-loop`, the parent skill, the parent command, active gate type, run manifest, and `next_resolution: parent-resolves-from-yaml-and-filesystem`.
- Treat `agent_routing` as metadata only: the parent orchestrator still owns interpretation, artifact writes, archiving, filesystem-derived progress, and inline framework loading. Never expose path-shaped framework child commands as the user-facing continuation route.

## 2026-06-17 — Research loop stops need terminal handoff sections

- A journey-map routing fix made synthesis routing explicit, but the broader Pattern A research loop still relied on scattered prose for "what is next."
- Pattern A orchestrator and inline framework stops should end terminal output with `## Next Work` plus either `## Recommended Next Command After Compiling YAML` for review-pending gates or `## Recommended Next Command` after approved artifact writes.
- Framework subskills must keep routing parent-owned: no path-shaped child commands, no execution-loop commands, and no downstream commands before synthesis. After the last framework intermediate is written, the parent must recalculate file state and route explicitly to synthesis.

## 2026-06-16 — Research run manifests are selection schemas, not approval ledgers

- A journey-map continuation answer drifted after an agent encoded framework approval state into `research/alignmeant/_working/journey-map-run.yaml` with `status`, `approval`, and `blocking_feedback` fields.
- Pattern A research orchestrator run manifests should store only selected framework identities and intermediate paths; done/pending state must be recalculated from canonical intermediate existence before every handoff.
- After canonicalizing the last selected framework intermediate, do not give a generic parent rerun route. Replay the state ladder: if all intermediates exist and the unified canonical artifact is missing, route explicitly to the synthesis state (`$<orchestrator> --synthesize` or runner equivalent) and say the next output is a synthesis review page.

## 2026-06-16 — Base source inventory is not active skill availability

- A routing plan exposed that agents were treating base skills as directly runnable because the skills exist in the package/source checkout.
- Before recommending a base skill, verify it is visible in the active session or installed project-local; otherwise recommend `npx skillpacks init` from the project shell before the base command.
- Pack-provided skills likewise require active-session/project-local verification or `npx skillpacks install <pack-or-skill>` guidance; do not rely on global/default skill availability assumptions.

## 2026-06-16 — Inspect the actual publish target before release approval

- I initially checked the workspace package tarball, but the release script publishes `packages/skillpacks/build`, which has a different and much larger file boundary.
- Before saying an npm package is ready to publish, run `npm pack ./packages/skillpacks/build --dry-run --json` or the exact publish target used by the release script and inspect included path classes.
- Treat prompts, generated sites, active alignment outputs, and broad repo documentation as release-boundary questions that must be explicitly allowed or excluded before npm auth/publish.

## 2026-06-16 — Pre-existing provenance does not close a real failing gate

- A provenance investigation correctly proved that `ord-align` routing audit findings reproduced from unmodified `HEAD`, but I stopped after documenting that instead of also offering or applying the small available fix.
- When a user asks whether a failing verification is unrelated, distinguish two outcomes: provenance for the current work and remediation for the underlying gate.
- If the underlying fix is narrow, low-risk, and in-scope for the current repository, apply it after proving provenance unless the user explicitly asked for evidence only.

## 2026-06-15 — Verify ownership before deleting untracked files

- A cleanup plan treated all untracked files as disposable refresh fallout, but some untracked files can be prior or concurrent work that has not been committed yet.
- Before deleting an untracked path, verify whether it is named by the current cleanup request, tied to the current task's generated outputs, or clearly disposable build/cache output.
- If an untracked path belongs to another active task or prior work, leave it alone and narrow cleanup commands to the exact accidental paths named by the user.

## 2026-06-15 — Framework file paths are not skill invocation commands

- The user reported `$competitive-analysis/frameworks/porter-five-forces`, which was a path-shaped route leaked from framework subskill docs rather than a valid skill invocation.
- Pattern A framework subskills are implementation units followed inline by the parent orchestrator. Their `SKILL.md` files may live under `frameworks/`, but user-facing continuation must name only the parent orchestrator command.
- When changing orchestrator loops, add regression coverage that rejects slash-path skill commands such as `$parent/frameworks/child` or `/parent/frameworks/child` in active skill contracts.

## 2026-06-14 — Revision feedback should not preserve the rejected framing

- The user identified a recurring pattern where agents respond to feedback by adding warnings or negative emphasis around the undesired behavior instead of simply applying the requested edit.
- Treat this as overcorrection/negative instruction anchoring: the rejected concept becomes more salient because it is repeated in the durable artifact.
- When revising skills, research docs, alignment pages, or task docs, first classify the user request as add, remove, replace, reweight, or verify. For remove/replace/reweight requests, make the target text match the desired final state and do not add a new cautionary paragraph about the thing being removed unless the user explicitly asks for a warning.
- In research artifacts, keep rejected or corrected claims out of the canonical narrative. If provenance is needed, put it in a concise revision note or archive record, not in the forward-facing findings, recommendations, or future-agent instructions.
- Durable prevention belongs in shared revision hygiene rules and research/alignment conventions first; add skill-local copies only when the shared convention cannot reliably reach the workflow.

## 2026-06-13 — Research/prototype routing must not jump to roadmap

- A product-design route fix added the prototype build-plan synthesis step but left `ui-interview` able to recommend `agent-work-admin`/`roadmap` after approved UI branch work.
- During AFPS research and prototyping, completed UI branch decisions should route to `user-flow-map --prototype-build-plan [topic]`, then `prototype`, UAT/evaluation, consolidation, and post-prototype spec work before roadmap sequencing.
- When adding an intermediate artifact to a skill route, update the producer skill's final handoff and add a regression assertion for the exact next command, not just broad route-contract docs.

## 2026-06-12 — Prefer `$pack install` when the project-local skillpacks CLI is unavailable

- I recommended `npx skillpacks install guided-walkthrough` after shipping, but the user’s shell returned `sh: skillpacks: command not found`.
- Before recommending an npm-distributed pack install as the next command, check whether the CLI is available in the user’s project shell or whether the repo-local `$pack` workflow is the safer path.
- For this repository, when the goal is to enable a pack-provided skill from an active Codex session, prefer `$pack install <skill-or-pack>` or `scripts/pack.sh install <skill-or-pack>`; use `npx skillpacks ...` only when the npm CLI is known to be installed or intentionally being tested.

## 2026-06-12 — Verify exact npm package names before running `npx`

- I ran `npx skillpack install exec-loop` with the singular package name, which invoked an unrelated public npm package at `skillpack@0.1.3` instead of this repo's `skillpacks` CLI.
- Before running or recommending an `npx` command, verify the exact package name from the repo docs or local package metadata when a similarly named package could exist.
- For this repo, the package manager CLI is `skillpacks` plural. Treat `skillpack` singular output, `skillpack.yaml`, or `skillpack init` guidance as evidence that the wrong package is running.

## 2026-06-12 — Product design routing is a wireframe tree, not a linear UI-requirements funnel

- The product-design route was still encoded as `user-flow-map -> ui-interview --requirements-only -> ux-variations --layout-mode`, but the intended model is a branching wireframe tree.
- Future product-design skills should preserve this default route: `user-flow-map` creates named user-flow roots, `ux-variations` expands one selected user flow into alternate progression branches, and `ui-interview` investigates/proposes/approves or rejects one UX-variation branch with an HTML visual mockup.
- Keep `ui-interview --requirements-only` and `ux-variations --layout-mode` as explicit bounded modes, not the default product-design path, unless the user asks for a fixed content/layout contract.

## 2026-06-12 — Delegated framework alignment pages need framework-specific review surfaces

- Delegated/framework skills such as `w3-hypothesis` can satisfy generic research alignment-page rules while still producing thin, low-signal pages compared with richer parent or non-delegated skills.
- Future framework subskills must render the actual framework lens as the review surface: per-candidate or per-competitor matrices, scores/verdicts, disconfirming evidence, confidence by dimension, source gaps, and explicit implications for parent synthesis.
- Generator-level fallbacks should inspect `invocation: sub-skill` and `parent:` metadata so new delegated skills do not silently fall through to generic evidence-summary guidance.

## 2026-06-12 — No-context-loss means rendered review UI, not packet mirroring

- Repo-wide staged research guidance used "full preliminary/working packet" language, which made agents preserve content by dumping dense Markdown packets into alignment pages instead of translating the same content into readable review UI.
- Future alignment pages must preserve every section, finding, caveat, source, assumption, and decision detail by rendering them as purposeful HTML sections, tables, matrices, cards, gates, and review modules.
- Working packet Markdown remains a non-canonical staging artifact. Raw Markdown may appear only as a supplemental source view after the rendered HTML review UI, never as the primary review surface.

## 2026-06-12 — UI interview review pages need stage clarity and rendered packets

- A `ui-interview --requirements-only` alignment page preserved the full working packet only as a raw Markdown `<pre><code>` preview, making tables hard to parse and leaving the reviewer unclear whether the page represented a live agent/user interview or a requirements review artifact.
- Future `ui-interview` review pages must state the interview stage near the top: whether the run is requirements-only or full UI mode, what interview work already happened or was inferred from approved upstream evidence, and whether the next action is section feedback, compiled approval YAML, or resuming the interview.
- Render working packets as structured HTML sections, lists, and tables. Keep raw Markdown only as supplemental source context after the rendered packet, never as the primary review surface.

## 2026-06-10 — Verify unchecked backlog items before routing them as next work

- I routed the next command to a Skills Showcase drawer-close backlog item from `tasks/todo.md` without first verifying source, tests, and git history; the implementation already existed and the focused proof file was present locally but untracked.
- Before recommending a stale-looking unchecked backlog item as next work, inspect the relevant source and recent history, and check for matching untracked proof files. If the work is already implemented, reconcile the task docs and commit missing proof instead of routing to repeat implementation.
- Apply this especially after finishing an unrelated phase, where the next unchecked item may be a stale backlog entry rather than the logical continuation of the just-finished work.

## 2026-06-10 — Shell search patterns must not contain raw backticks

- A targeted `rg` scan used a double-quoted pattern containing `` `npm publish` ``, so the shell performed command substitution and attempted to run `npm publish` from the repo root.
- When scanning for literal command text that contains backticks, dollar signs, parentheses, or other shell-active characters, use single-quoted patterns, escape the characters, or put the pattern in a file. Do not place Markdown command literals inside double-quoted shell strings.
- For any release-sensitive workflow, treat command-substitution mistakes as real safety incidents: capture the failed output, verify external state with a read-only registry query, and update the ship manifest before committing.

## 2026-06-10 — Research scope approval must precede synthesized research

- Research-producing skills allowed Stage 1 to perform synthesized research and write working packets before the alignment page's research scope was approved.
- Before synthesized findings, candidate rankings, recommendations, working packets, or canonical research writes, create a `review` alignment page from minimal scope discovery only and stop for final compiled YAML approving the research scope.
- Treat pre-approval repo/source inspection as scope evidence only. Do not present it as findings, recommendations, or a preliminary deliverable until after scope approval.

## 2026-06-08 — New alignment-page addenda need matching gates before compile controls

- A deck-based installation addendum was appended after the npm distribution alignment page's review gates and YAML compile controls, so reviewers could approve the page without making the new deck-install decision.
- When adding a substantive decision section to an existing alignment page, place the section before `Review Gates` and add a matching `.gate` question block with a stable `data-question-id`.
- Verification should compare substantive section headings against gate sections and confirm the final compiled gate list includes every newly introduced decision surface.

## 2026-06-08 — Flow-chart SVG labels must stay inside the viewBox

- An alignment-page flow chart rendered all node labels to the right of each node, so destination labels on the final layer extended beyond the SVG viewBox and were cut off even when the SVG itself scaled responsively.
- For generated SVG flow diagrams, reserve space for labels or anchor labels inward on edge layers; do not rely on `max-width:100%` or a wider SVG width to fix text that is already outside the viewBox.
- For visual-tier alignment pages, verify charts at both desktop and narrow widths after feedback-driven edits, and treat clipped labels as a generator/layout bug rather than a content-only issue.

## 2026-06-05 — Alignment pages must not embed deliverables, and review-only product-path approvals need a formal state

- An alignment page used `<object data="...">` to embed the working packet instead of rendering all proposed deliverables inline, violating the no-context-loss rule but not explicitly prohibited.
- A product-path fork was approved as "review only" — a state with no formal representation in the AFPS product-path contracts, leaving the path in limbo (approved but absent from `research/.progress.yaml`).
- Added an explicit embed prohibition (`<object>`, `<iframe>`, `<embed>`, external-link-as-primary-render) to the alignment page convention.
- Added a `review-only-approved` alignment page status for product-path forks approved at the alignment level but not yet granted canonical-write approval.
- Added provisional-path evidence gates to ICP and competitive-analysis so downstream skills do not treat unmanifested paths as canonical active paths.

## 2026-06-02 - Do not turn deploy-skill absence into next work when deploy is not contextually needed

- A `$ship-end` final route recommended `$pack install deploy` because `tasks/deploy.md` existed and the `deploy` skill was not installed, even though the shipped boundary was a standalone alignment page/proof refresh and did not need a manual deploy follow-up.
- Before recommending deploy setup, classify whether the shipped boundary actually changes a deploy-relevant runtime surface, deploy script, schema, environment requirement, or manual launch state. The existence of `tasks/deploy.md` alone is not enough.
- If deployment is not contextually needed, report deploy as not applicable or skipped and choose the next work from verified active project tasks; if no verified unblocked task remains, recommend `none` rather than installing deployment tooling.
- If a deploy contract exists but targets production/manual setup, do not promote deploy tooling as the next command without an explicit deploy need and appropriate confirmation.

## 2026-06-01 — Verify stale unchecked tasks before recommending next work

- A `$ship-end` final route recommended `$analyze-sessions` for "Animation Approval Signal History" because `tasks/todo.md` still showed unchecked items, but the research already existed in `alignment/analyze-sessions-animation-approval-signals.html` and `docs/history/animation-approval-signals-2026-06-01.md`.
- Before recommending an unchecked task as next work, check for matching committed artifacts, recent commits, and task review notes. If artifacts already satisfy the task, first reconcile the stale task state instead of routing to repeat work.
- For `ship-end` next-work selection, treat unchecked task docs as candidates, not ground truth; verify against `git log -- <expected artifacts>` and concrete output files when the task name refers to an analysis/report already likely completed.

## 2026-05-31 — Alignment page compile controls must stay in normal page flow

- A user clarified that sidebar navigation and sticky/fixed bottom compile banners were not requested and made HTML alignment pages look worse.
- Alignment pages should use a top in-flow Table of Contents section for navigation, not a sidebar or nav rail that competes with the content.
- Bottom compile controls are acceptable only as ordinary page content near the bottom. Keep `Compile Answers` there, and support `Compile Feedback YAML` there too while also keeping local feedback YAML under the selected section-feedback textarea.

## 2026-05-31 — Alignment feedback YAML needs a local section path

- A user clarified that feedback-only YAML must not be available only through a busy bottom area, especially when zoomed and when section notes textareas are visible.
- Section thumbs up/down/clarify feedback should reveal its own multiline textarea and local feedback YAML/copy controls near the selected section controls. A separate normal bottom compile section may also aggregate feedback when requested.
- Treat section feedback textareas as separate from required gate-question text boxes. Even if a section already has gate inputs, selecting thumbs up/down/clarify must show a separate nearby feedback textarea whose notes are wrapped into feedback-only YAML.

## 2026-05-30 — Never write a test/verification claim from remembered or garbled tool output

- During a session with intermittent tool-output corruption I wrote "4/4 PASS", "654/654 pass", and "tsc --noEmit clean" into commits — each reconstructed from a garbled or never-actually-run result. Every one was wrong and needed a follow-up correction commit (three commits where one should have sufficed), and the false claims were pushed to `master` before being checked.
- A pass/fail count, "clean", or "N/N" claim may only be written from a tool result read cleanly *in the same turn it is written*. If output looks corrupted (repeated/interleaved blocks, mismatched counts), STOP — re-run the single command, capture its result to a temp file, and read that file back (`od -c`, python, or `--reporter=json` + a parser) for the authoritative number.
- Never fill in a number from memory of an earlier result. When unsure, write "not yet verified" rather than a fabricated figure.
- `tsc --noEmit` is not a usable gate in `tests/`: its `tsconfig.json` omits `@types/node`, so it errors project-wide (`Cannot find name 'process'`) on clean `master`, independent of any edit. Don't claim "tsc clean" there.

## 2026-05-30 — Prove a test failure is pre-existing before calling it unrelated

- I twice misidentified the failing file from corrupted scrollback (`skills-data-sync`/`bench-coverage`), committed that, then found the real one was `output-paths.test.ts` — another correction commit.
- Before calling a failure "pre-existing and unrelated," prove all three: (1) the real failing file/test name from clean machine-readable reporter output, not scrollback; (2) it reproduces at the parent commit via `git worktree add --detach <parent>` with none of my edits (here: `output-paths.test.ts` failed 2|42 at `ebbe3267`); (3) that file imports none of the modules I changed (`grep` its import list).
- Clean up worktrees and any `git show <ref>:file > file.orig` artifacts immediately — they leak into `git status` and almost got committed.

## 2026-05-30 — Verify commit/push RC and the staged boundary, don't assume

- A `git commit` failed silently with exit 128 (non-existent pathspec from an imagined test path); I nearly proceeded as if it had committed. Capture `COMMIT_RC=$?` plus `git log -1` / `HEAD == origin/master` to a file and read it back.
- Stage the exact intended files and read `git diff --cached --name-only` before committing, especially when the tree holds unrelated in-progress work from other tasks (this session's tree had another task's `prompt-history-backfill` work).
- When the tool layer is flaky, don't chain trivial `echo`/`ping` probes to "test the connection" — calls are usually just queued; wait for results instead of spamming.

## 2026-05-30 — Alignment feedback needs an early YAML path

- A user clarified that negative feedback or clarification needs on an HTML alignment page should not be blocked behind answering every final approval-gate question.
- Alignment pages need two YAML paths: feedback-only YAML for section concerns/questions that asks the agent to investigate and amend the page, and final approval YAML after required gates are answered.
- Section feedback with `down` or `needs-clarification` should be enough to compile actionable YAML before final approval; agents should treat that YAML as a revision request, not as approval.
- When updating alignment feedback behavior, edit the canonical `CLAUDE.md` alignment-convention block, regenerate bundled `ALIGNMENT-PAGE.md` files, and add drift/regression coverage.

## 2026-05-29 — Status routing must follow canonical skill contracts

- A `/codebase-status`-style status answer misordered AFPS next steps by recommending `value-prop-canvas` before `positioning` when ICP and competitive analysis were complete.
- For business-product research status, consult the canonical route and the last completed research skill's `## Next Steps`/routing contract before recommending a next command.
- When `research/journey-map.md` is missing after competitive analysis, check whether `customer-lifecycle` is enabled and route to `pack install customer-lifecycle` before `journey-map` if needed.
- Treat `value-prop-canvas` and `lean-canvas` as optional risk-driven detours only when their stated risk conditions are present, not as required default chain links.

## 2026-05-28 — Codex `$` visibility can fail on stale symlink skill installs

- A user report that `$` showed unrelated skills instead of installed project skills was confirmed by direct Codex project-local discovery: only two `.codex/skills/*/SKILL.md` files were visible even though `scripts/pack.sh status` listed the full enabled pack set.
- When debugging `$` skill visibility, compare `scripts/pack.sh status` against `find .codex/skills -maxdepth 2 -name SKILL.md -print` and `find .codex/skills -maxdepth 1 -type l -print`; status can count stale symlink entries that the active CLI discovery path may not load.
- Use `scripts/pack.sh refresh` to convert old project-local symlink installs into current managed skill directories, then start a fresh Codex session because the `$` skill list may be loaded at session start.
- Avoid committing machine-specific tracked `.claude/skills` pointer churn created by local refresh unless the task explicitly intends to update project-local install artifacts.

## 2026-05-27 — Skill preview duplicates can come from archived SKILL.md files

- A `$` preview duplicate for `analyze-sessions` was not a frontmatter case variant; it came from recursive skill discovery seeing both the active symlink target and `archive/v0.0/SKILL.md` under that target.
- When users report duplicate skill preview entries, trace the exact preview/discovery roots (`.codex/skills`, `.claude/skills`, user-home skills, project pack links) and check whether recursive scans include `archive/**/SKILL.md`.
- Treat archive skill files as historical snapshots, not invokable skills. Discovery and preview paths should exclude any `archive/` segment or dedupe by canonical active skill identity.
- Do not stop at checking active repo frontmatter; UI symptoms can be caused by generated indexes or client-side recursive scanning behavior.

## 2026-05-27 — Product research branches are product paths, not git branches

- In split-path research workflows, "branch" means product path, product-line divergence, app scope, ICP direction, pivot, or route experiment, not a git branch or a parallel implementation lane.
- Durable contracts should use `product_paths` in `research/.progress.yaml` and terms like product path, product line, app scope, deferred path, or promoted path.
- Avoid `branch`, `branches`, and `deferred_paths` in research workflow contracts unless explicitly discussing git operations or release workflow skills.
- Default downstream work to the active product path; parked paths need revisit triggers and next-skill routes, not automatic full research/spec expansion.

## 2026-05-27 — Do not wrap direct skill routes in exec-loop by default

- A `$ship-end` next-step recommendation incorrectly wrapped `$analyze-sessions split-path product research workflow` inside `$exec`, even though `$analyze-sessions` was already the concrete next skill route.
- Use `$exec` only when the next work is specifically an exec-loop planning/execution session or when the user asks to run the project execution loop.
- For next-step routing, recommend the owner skill command directly when the work is a named analysis, research, review, or builder skill. Do not prepend `$exec` as a generic executor.
- Treat exec-loop commands as workflow orchestration tools, not universal launchers for every other skill.

## 2026-05-27 — Distinguish injected external skills from project-local skill links

- A user complaint about `$` skill invocation pollution referred to external/system-injected skills visible in the session skill list, not stale `.codex/skills` or `.claude/skills` symlinks.
- Before mutating `.agents/project.json` or local skill symlinks, confirm whether the pollution source is the session-injected global/plugin skills, user-home installed skills, project-local links, or repo pack discovery.
- For ambiguous "extraneous skills" reports, first map visible skill names to their source paths in the injected skill list and compare against repo-defined `global/` and `packs/` skills.
- Do not prune project-local pack config as a first fix when the reported problem is external skills outside this repository's definitions.

## 2026-05-25 — Open WSL HTML pages in Windows browsers with file URI PowerShell

- A WSL browser-open attempt failed when using `cmd.exe /c start "" "$(wslpath -w "$FILE_PATH")"` and `powershell.exe Start-Process` against a UNC path, returning `UtilBindVsockAnyPort:309: socket failed 1`.
- For HTML alignment pages under WSL, prefer invoking the Windows PowerShell binary directly and passing a browser-friendly WSL file URI: `/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/powershell.exe -NoProfile -Command "Start-Process 'file://wsl.localhost/Ubuntu/path/to/file.html'"`.
- If `wslpath -w` returns a `\\wsl.localhost\...` UNC path but Windows launch fails, do not conclude the file path is wrong; test a `file://wsl.localhost/<distro>/...` URI before falling back to VS Code.
- When a user specifically asks to open in the browser, do not substitute `code <file>` as the final attempt unless browser launch is still blocked after the file URI approach.

## 2026-05-25 — Alignment-page feedback includes research quality, not only HTML UX

- Alignment-page corrections can be about the substance of research, not just whether the HTML review page exists or has usable controls.
- Research skills should preserve claims, evidence, inference, assumptions, confidence, alternatives, rejected findings, source gaps, and decision impact from the research process into the alignment page.
- When updating alignment contracts, require no context loss from proposed deliverables, search logs, interview logs, and approval notes; every fact, source, caveat, and rationale must be rendered or explicitly linked.
- Validation should assert research-quality gates directly so future passes do not improve presentation while thinning the underlying analysis.

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
- `$exec`, `$ship`, `$ship-end`, kanban run/ship loops, and monorepo run/ship loops should stay operational: execute, validate, package, commit, push, and route without generating alignment review pages.
- Cross-cutting alignment-page audits must exempt execution/shipping loop skills by role, even when those skills write task docs, reports, generated assets, or commits as part of shipping.
- Keep alignment pages for planning, research, spec, interview, prototype, and decision artifacts; do not require them for routine execution/shipping orchestration.

## 2026-05-21 — Idea scope brief routes bootstrap only before repo readiness

- Idea scope brief was clear about being pre-ICP, but its next-step rules did not distinguish an unbootstrapped idea from an already initialized repo.
- Route `$idea-scope-brief` to `$bootstrap-repo` only when the concept is ready and the repo lacks meaningful README plus agent workflow docs, or the user is shaping an idea outside a project repo.
- In an already bootstrapped repo, route idea scope brief to `$icp` or the required research-pack install, not to `$bootstrap-repo`.
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

- A Codex `$ship` handoff copied `/exec` from `tasks/todo.md` into the final `Recommended next command`, even though Codex users need `$exec`.
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
- After adding or updating benchmark reports, subjective review reports, or benchmark matrix inputs, do that work in `agentic-skills-benchmarks`; import the public `agentic-skills` export with `SKILLS_REPO_REF` pinned or `WORKTREE`, then run `pnpm catalog:check` and `pnpm bench:coverage`. Do not regenerate Showcase assets from `agentic-skills`.
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

- A `ship` benchmark initially treated Claude failure as a skill failure because the setup expected `$exec` for both Claude and Codex.
- When a benchmark runs both agents, hard assertions and quality rubrics must use the corresponding route convention for the runner: slash commands for Claude (`/exec`, `/ship`) and dollar commands for Codex (`$exec`, `$ship`).
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

- A handoff identified a manual overlay playtest as next work but still recommended `/exec`, which made an external human-only validation look agent-executable.
- When next work requires human-only browser/OS interaction, real device access, authenticated dashboards without a reliable CLI/API path, or explicit sign-off, record it in `tasks/manual-todo.md` as a blocking manual task when it blocks the next automated step.
- The recommended next route should be `$guide`, a Claude-guided manual step, or an explicit manual-blocker handoff, not `/exec` or `$exec`.
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

## 2026-04-30 — Codex `$exec` plans are implicitly approved

- Session history showed the user consistently accepted `$exec` plans with bare approvals (`y`, `yes`, `yes please`) and did not reject normal `$exec` execution plans.
- Treat a `$exec` invocation as approval for the next planned step or scoped phase after presenting the plan. Do not add a second routine approval question.
- Still ask explicitly for separate safety decisions: destructive commands, production deploys, paid/external account actions, credential or secret handling beyond the project contract, execution-profile downgrades, blockers, or material scope changes.

## 2026-04-17 — Check live AWS auth before SSO login

- When a deploy path may use AWS SSO, do not infer that credentials are expired from stale context, earlier logs, or memory.
- First verify current auth with `aws sts get-caller-identity --profile <profile>` or let the deploy command fail with a current credential error.
- Only run `aws sso login --profile <profile>` after that live check proves credentials are missing or expired.

## 2026-04-22 — `/exec` must trust profile metadata over legacy step prose

- `/exec` auto-dispatches `agent-team` phases via isolated worktrees. Do not stop just because the profile says `agent-team` or because the phase/step body contains stale advisory text like *"do not implement in a single `/exec`"* or *"use `/delegate`"*.
- That prose typically predates the agent-team dispatch feature. The current authority is the `### Execution Profile` block (after `/patch-exec-profile` fills it), not narrative embedded in the step description.
- Only stop if `/patch-exec-profile` cannot resolve the profile (overlapping `Owns`, cyclic `Depends on`, missing lane specs that can't be inferred). `/delegate` is for Claude↔Codex handoff, not lane parallelism.

## 2026-04-19 — Keep Claude `/exec` execution-only and `/ship` handoffs bounded

- Claude `/exec` should execute exactly one approved step and then hand the dirty tree to `/ship`; it should not commit or push.
- Claude `/ship` is not complete after writing the next-step plan. Unless `--no-plan` is set or a blocker is documented, it must enter plan mode so the user can clear context and implement.
- Clear-context sessions launched by `/ship` plan mode are ship-one-step sessions. The plan handed to them must explicitly say to implement the approved step, validate, commit/push, deploy only with an explicit manual deploy contract, write the following step's plan, start the next approval UI with `EnterPlanMode` before `ExitPlanMode`, and stop before implementing it.
- Deploy discovery should not stall shipping in repos with no explicit manual deploy contract; skip deploy unless `deploy.md` or `tasks/deploy.md` exists.

## 2026-06-02 — Distinguish canonical skills from generated local installs

- A pack drift report in the canonical `agentic-skills` repo sounded like the canonical skill sources were stale, even though `doctor` was reporting generated project-local copies under `.claude/skills` and `.codex/skills`.
- When explaining `scripts/pack.sh doctor`, explicitly say that `stale` means the local managed install's recorded source hash no longer matches the canonical source directory.
- In this repo, `packs/*` and `global/*` are the canonical sources; `.claude/skills/**` and `.codex/skills/**` are generated install roots that can fall behind until `scripts/pack.sh refresh` runs.

## 2026-06-10 — "GitHub audit" prompts mean portfolio status briefings, not code review

- The user wanted: a recurring briefing on Lexcorp progress across the app portfolio — searching GitHub for project status, shipping velocity, and content pipeline state to brief them.
- The agent interpreted: a read-only code-quality audit of pushed/merged GitHub changes, and built a `github-audit` skill around diff review.
- Signal missed: history prompts emphasized status/comparison framing ("status of my projects", "brief me", "compare against our local implementation"); the agent anchored on a single code-quality-worded Codex prompt instead of asking which sense of "audit" was meant when evidence was thin (≤10 matching prompts).
- Rule: when designing a skill from sparse history evidence, confirm the workflow's purpose with the user before encoding it; for this user, "audit based on github" defaults to operating-status briefing (`/lexcorp-briefing` in agentic-skills-personal), not code review.

## 2026-06-10 — Confirmation gates must not reference mid-turn text

- During `/ui-interview --requirements-only deck-creation`, the agent emitted the UI Assumptions Manifest before calling AskUserQuestion in the same turn; the harness does not guarantee that text emitted before a tool call is rendered, so the user was asked to confirm "the manifest above" without ever seeing it. The user's "Confirm as-is" answer was unsafe and had to be re-collected.
- Rule: any manifest, checklist, or summary a confirmation question references must travel through a guaranteed-visible channel — embed it as the `preview` content of the question's options (Claude), or make it the final text of its own turn and ask the confirmation in the next turn (Codex one-question-per-turn cadence). Never rely on mid-turn text in a turn that ends with a tool call.
- A confirmation question must never reference content the user has not been shown; if visibility is uncertain, re-present before re-asking.
- Fixed in `ui-interview` v0.13 (steps 3, 4b, 6 in both mirrors). The same weak pattern exists in `ux-variations` and `feature-interview` (product-design pack) — flagged for a follow-up pass.

## 2026-06-10 — Inline turn-final text is the default manifest channel, not previews

- Follow-up correction to the v0.13 visibility fix above: the user expects confirmation manifests to render inline in the conversation like other skills' checkpoints do. The AskUserQuestion option-preview channel that v0.13 allowed as an equal alternative is NOT the expected style — previews are a supplementary mirror only, never the sole channel. This supersedes the either/or framing in the 2026-06-10 "Confirmation gates must not reference mid-turn text" entry.
- Rule: deliver every manifest/checklist/checkpoint the user must confirm inline as the final message text of its own turn; ask the confirmation question in the next turn. Codified as the Manifest Visibility Rule in `docs/interview-convention.md` and propagated to ui-interview v0.14, spec-interview v0.11, skill-interview v0.2, ux-variations v0.15, feature-interview v0.5, user-flow-map v0.1, and idea-scope-brief v0.14 (both mirrors each).
- Second correction in the same session: ui-interview skipped the repo's 3-phase research lifecycle (preliminary working packet → review alignment page → final compiled YAML approval → finalize canonical files) and wrote canonical specs directly after an AskUserQuestion confirm. Its bundled ALIGNMENT-PAGE.md already prescribed the staged lifecycle; the SKILL.md just ignored it. Rule: when a skill bundles a lifecycle contract (ALIGNMENT-PAGE.md), the SKILL.md process steps must route writes through it explicitly — a checkpoint confirm is draft-ready only, never canonical-write approval. Fixed in ui-interview v0.14 (new step 7, both modes).
- Operational lesson: a concurrent Codex `$exec` session in the same working tree stashed this session's uncommitted edits as "codex-temp-unrelated-*" stashes and deleted restored untracked files mid-task. Recovery: `git stash apply` both stashes, restore `D` working-tree deletions with `git checkout --`, then commit and push the owned files immediately to protect them. When two agent sessions share a tree, commit early instead of batching everything for one end-of-task ship.

## 2026-06-11 — CLI install output should report destinations, not transient sources

- A `skillpacks refresh` output line reported `Installed .claude/skills/icon-handler -> /home/.../.npm/_npx/.../node_modules/skillpacks/...`, which made the temporary `npx` package cache look like the install destination.
- Rule: package CLI install/refresh/pin/unpin output should name the user-facing installed skill root (`.claude/skills/<name>` or `.codex/skills/<name>`) and relevant version/pin status, not the source package path.
- Reserve package source paths for diagnostics such as doctor/marker inspection, where the source is the subject being debugged.

## 2026-06-18 — Chunked-session STOP handoffs need plain-English next-unit + exact command

- In a chunked `/user-flow-map` run, a spec session ended with only the internal section ID — "next run should continue with action-state-matrices" — giving no plain-English explanation of that section and no command to run. The user could not tell what the unit was or how to continue.
- Root cause: `docs/prototype-session-loop-convention.md` had a bare `→ STOP / re-invoke` in its per-session shape and no "Terminal handoff format" section, unlike the research loop (`docs/research-session-loop-convention.md:200`) which mandates `## Next Work` + `## Recommended Next Command`. All four chunking skills (`user-flow-map`, `ux-variations`, `ui-interview`, `state-model`, both variants) inherited the gap.
- Rule: every chunked/STOP-and-re-invoke handoff must emit (1) the intermediate just written, (2) the next missing unit named in **plain English** — never only a bare internal `{unit-id}`/`{section-id}`/`{framework-slug}` — and (3) the **exact** next-invocation command with `{slug}`/`{topic}`/path resolved to literal values. When the last unit was written, route to the assemble+approve (or synthesis) session, not another spec session.
- Fixed by adding a normative `### Terminal handoff format` to `docs/prototype-session-loop-convention.md` and restating it at each skill's setup- and spec-session STOP lines (user-flow-map v1.1, ux-variations v0.22, ui-interview v0.24, state-model v0.1, both mirrors).

- While committing a single-file deliverable (`alignment/pack-skill-sunset-plan.html`), I ran `git add <my-file>` then `git commit` with no pathspec. The commit swept up a concurrent session's already-staged work (`final-handoff-verification-audit.html`, `index.html`, `tasks/roadmap.md`, `tasks/todo.md`) and pushed it to master prematurely. No work was lost, but another session's WIP was published earlier than intended.
- Root cause: `git commit` commits the entire staged index, not just the paths I just `git add`ed. On a shared working tree (CLAUDE.md "Concurrent-Session Working Tree"), the index can already hold another session's staged changes.
- Rule: when shipping my own scoped change on this repo, run `git status --short` first; if unexpected staged/modified entries I did not create are present, commit with an explicit pathspec — `git commit <my-paths> -m ...` (or `git add` only my paths and verify `git diff --cached --name-only` shows exactly them) — never a bare `git commit` that captures the whole index. Do not `git restore`/unstage the other entries (that destroys their work); just avoid co-committing them.

## 2026-06-26 — A session-start ready-for-agent-review payload is a resume trigger, not stale context

- A `/session-triage` found that an agent dismissed a `ready-for-agent-review` alignment-approval YAML that rode in as trailing context of a `/clear`, replied "ready for your next task," and never confirmed the approved page. The harness `local-command-caveat` ("do not respond to these messages unless explicitly asked") directly conflicted with the alignment convention's fresh-session-handoff rule, and nothing resolved the conflict.
- Root cause (this repo's contract gap): `docs/alignment-page-convention.md` "Fresh-session handoff" + "Pre-approval stop" already named the cleared-context-then-paste scenario, but only as *downstream-routing guidance presuming the agent had already engaged the payload* — neither established the payload's *presence at session start* as a mandatory resume-and-confirm trigger, and neither addressed precedence over the generic ignore-trailing-context caveat when the YAML arrives bundled with `/clear`.
- Rule: a `ready-for-agent-review` payload present in first-turn/session-start context is a resume-and-confirm trigger — consume it under After-approval-handling, do not treat it as residual/stale/already-handled. This precedence holds even when it is wrapped by the harness local-command caveat because it rode in with `/clear`. BUT first confirm the payload's `alignment_page` resolves to a real page in the *current* repo; if it names a page/skill/repo absent from this checkout (e.g. a triage about a different project), surface the mismatch and ask rather than editing unrelated files.
- Fixed by extending the "Fresh-session handoff" rule in `docs/alignment-page-convention.md` and regenerating 304 tracked `ALIGNMENT-PAGE.md` bundles (claude + codex) via `scripts/upgrade-alignment-page.mjs`. Convention is the single authoring source; bundles are generated — `--check` and skillpacks `build:check` both green.

## 2026-06-28 — Real publish requires explicit user intent, not readiness context

- After a `0.1.14` readiness audit, the user provided runbook/auth context and then interrupted an agent-started real `./publish.sh patch`, switching to `$ship-end`.
- Rule: do not infer permission to run a real npm publish from successful auth, runbook output, readiness checks, or "next work" text. A real publish/tag operation needs explicit user wording like "publish it now" or a direct unambiguous command to run `./publish.sh patch`.
- If a real publish command is interrupted, immediately check for leftover publish/npm processes, check npm registry state for both package names, and restore local package/manifest version bumps if nothing published.

## 2026-06-29 — Alignment/interrogation page handoffs require browser-open status

- A `/customer-discovery` W3 findings session wrote `alignment/w3-hypothesis-new-ship-city.html` and told the user to open it manually, even though the bundled alignment-page contract required running the browser-open helper and reporting one of the allowed statuses. The helper was available and later returned `opened`; the omission was agent noncompliance, not an environmental blocker.
- Rule: after writing or amending any active `alignment/*.html` or `interrogation/*.html` page, immediately run the required browser-open helper from the relevant page convention before the terminal handoff. Report `Browser open: focused`, `Browser open: opened`, `Browser open: fallback-opened`, `Browser open: blocked`, or `Browser open: failed` in the handoff. If no helper status has been produced, the handoff is incomplete; do not substitute a manual "open this file" instruction.
- For Pattern A framework stops, put the browser-open status before the required `## Next Work` / command sections so the final response still ends with the mandated routing block.
