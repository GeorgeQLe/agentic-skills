# AFPS 2.0: Evidence-Driven Alignment

- Status: Proposed
- Scope: Foundational operating contract and clean-break migration design
- Authors: Codex with George Le
- Date: 2026-08-09
- Tracking: [issue #13](https://github.com/GeorgeQLe/agentic-skills/issues/13)
- Prior evidence: [issue #11](https://github.com/GeorgeQLe/agentic-skills/issues/11), [PR #12](https://github.com/GeorgeQLe/agentic-skills/pull/12)
- Canary protocol: [AFPS 2.0 canary plan](./afps-2.0-canary-plan.md)
- Review checkpoint: [AFPS 2.0 RFC briefing](../../briefing-slides/afps-2.0-rfc.html)

## 1. Decision requested

Adopt AFPS 2.0 as a clean-break replacement for the approval-first AFPS operating model, subject to the paired canary in the companion plan. AFPS 2.0 makes a **decision-revealing slice** the unit of progress and uses this loop:

> **infer intent → produce the smallest decision-revealing slice → evaluate evidence → continue or checkpoint**

The canary may use a temporary `--afps2` comparison flag on its isolated implementation branch. The flag is not a public compatibility mode, does not ship, and is removed before AFPS 2.0 becomes the sole ordinary behavior.

This RFC does not migrate a skill, change a convention, or introduce the temporary flag. It defines the contract that a later issue-backed implementation sequence must follow.

## 2. Problem

AFPS currently treats alignment as an approval pipeline. A typical path elicits assumptions, stages draft work outside canonical artifacts, produces dense interrogation or alignment pages, compiles approval-flavored YAML, and advances through fixed skill chains only after a binding gate. The design-tree loop makes the cost explicit with five stages per branch and prohibits canonical writes until the final alignment approval.

That model protected earlier agents from premature commitment, but its orchestration state now competes with the domain work:

- reversible choices block behind the same machinery as costly choices;
- questions arrive before an artifact gives the user something concrete to judge;
- dense pages, briefing wrappers, answer sidecars, approval YAML, and working copies duplicate state;
- fixed routes run skills because of their position rather than because the current evidence needs them;
- prototypes may demonstrate structural resemblance while missing behavioral parity with the real system.

AFPS 2.0 retains user control where correction is expensive or consequences escape the workspace. It removes mandatory approval ceremony where a capable agent can make a reversible inference and expose the result quickly.

## 3. Goals and non-goals

### Goals

1. Reach concrete, reviewable evidence before asking a blocking question whenever the next move is safe and reversible.
2. Make uncertainty, confidence, evaluation, and the next move visible without turning them into authorization state.
3. Keep human decisions focused on taste, selection, costly direction, and material low-confidence assumptions.
4. Preserve permission stops for destructive, irreversible, public, paid, legal, privacy, security, and other externally consequential actions.
5. Keep real product, research, design, specification, prototype, and task state while deleting approval-only orchestration state from ordinary workflows.
6. Give Claude and Codex the same semantic contract while allowing platform-native wording and mechanics.

### Non-goals

- This RFC does not weaken repository, GitHub delivery, release, deployment, secret, privacy, legal, or external-action safety contracts.
- It does not make every task autonomous. It makes the reason to stop explicit.
- It does not abolish alignment pages, interrogation pages, or briefing slides. It makes them explicit tools rather than automatic workflow stages.
- It does not require one universal artifact format for every domain.
- It does not preserve AFPS v1 as a normal compatibility mode after cutover.

## 4. Normative vocabulary

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are normative.

| Term | Meaning |
|---|---|
| **Decision-revealing slice** | The smallest tangible artifact or behavior that can change a material decision or retire a meaningful uncertainty. |
| **Material decision** | A choice involving taste, prototype selection, high downstream rework, or a consequential assumption with low confidence. |
| **Decision checkpoint** | A chat-first pause that presents evidence, a recommendation, and at most three material decisions. It is not an authorization surface. |
| **Permission stop** | A mandatory stop before an action whose consequences require explicit authority. |
| **Canonical artifact** | The domain source of truth: research, design, specification, code, prototype, task, or other product-state output. |
| **Review-only artifact** | A page, sidecar, packet, or working copy whose only purpose is approval orchestration and that carries no unique domain state. |
| **Next safe move** | The next reversible, in-scope action the agent can take without a material decision or new authority. |
| **Ordinary workflow** | Default product, research, design, specification, implementation, and task work, excluding explicit page-admin or archival commands. |

## 5. The operating contract

### 5.1 The four agent actions

The agent classifies the next choice into exactly one action. Precedence runs from action 4 to action 1: a permission boundary overrides every other classification; a material decision overrides a cheap assumption.

| Action | Use when | Required behavior | Examples |
|---|---|---|---|
| **1. Infer and proceed** | The choice is reversible, evidence supports a clear direction, and a wrong choice is cheap to amend. | Make the choice, produce or extend the slice, and expose the result in the artifact or handoff. | File organization consistent with the repo; fixture naming; choosing the smallest existing component that satisfies a known need. |
| **2. State an assumption and proceed** | Uncertainty is meaningful enough to disclose but inexpensive to correct. | State the assumption close to the affected work, continue, and make the consequence inspectable. | Inferred default user role; provisional copy tone; an inexpensive test-data shape. |
| **3. Decision checkpoint** | The choice is about taste, prototype selection, high-downstream-cost direction, or a material low-confidence assumption. | Show evidence and the agent recommendation, ask no more than three material decisions, then resume from the response. | Selecting a UX direction; choosing which gameplay station to amplify; committing to a data model that would invalidate several downstream branches. |
| **4. Permission stop** | The next action is destructive, irreversible, public, paid, legal, privacy-sensitive, security-sensitive, or otherwise externally consequential. | Do not perform the action. Identify the exact action, consequence, target, and required authority. Resume only after explicit permission through the governing safety mechanism. | Publishing, merging, production deployment, purchasing, deleting unrecoverable data, sending external messages, handling protected data. |

The classification questions are:

1. Would the action require new authority or create an external, destructive, irreversible, paid, legal, privacy, or security consequence? If yes, **permission stop**.
2. Would a wrong choice cause substantial downstream rework, select among materially different prototypes, or decide taste the user must own? If yes, **decision checkpoint**.
3. Is uncertainty meaningful but correction local and inexpensive? If yes, **state an assumption and proceed**.
4. Otherwise, **infer and proceed**.

An agent MUST NOT manufacture a decision checkpoint merely because a skill previously had an approval gate. It MUST NOT use a decision packet to bypass a permission stop.

### 5.2 The unit of progress

Every decision-revealing slice MUST identify these seven elements, inline or in a domain-native artifact:

| Element | Required question |
|---|---|
| `hypothesis` | What belief, risk, or choice could this slice change? |
| `artifact_or_behavior` | What tangible thing was produced or exercised? |
| `visible_result` | What can the user or evaluator directly inspect? |
| `assertion_or_evaluation` | What deterministic assertion, rubric, comparison, or observation judges the result? |
| `recommendation` | What does the evidence suggest doing now? |
| `confidence` | How strong is that recommendation: `high`, `medium`, or `low`, and why? |
| `next_safe_move` | What reversible action can proceed next without a material decision or new authority? |

The schema is semantic, not a mandatory sidecar. A small code slice may express it through a test name, changed behavior, test output, and handoff. A UX lab may express it through a variant card and comparison matrix. A research slice may express it through a claim, evidence table, confidence note, and recommended follow-up.

A slice is not decision-revealing merely because a file exists. It must make a relevant hypothesis inspectable and include a way to judge the result.

### 5.3 Continuous progression

After evaluating a slice, the agent chooses one of four transitions:

- **continue** — the result supports another safe slice;
- **adapt** — the result changes the working assumption or next slice while remaining reversible;
- **checkpoint** — the evidence has reached a material decision boundary;
- **permission stop** — the next action needs explicit authority.

The agent SHOULD continue through adjacent safe slices while context and verification remain reliable. Session boundaries, skill names, and route positions do not themselves require a user stop.

## 6. Evidence proportionality

Evidence cost SHOULD scale with consequence and uncertainty, not artifact size.

| Consequence / uncertainty | Minimum evidence |
|---|---|
| Low consequence, high confidence | Direct inspection or one focused assertion. |
| Low consequence, meaningful uncertainty | State the assumption; add a focused assertion, example, or visible comparison. |
| Material direction or low confidence | Produce competing or falsifiable evidence, summarize tradeoffs, and checkpoint. |
| Safety or permission boundary | Resolve targets and consequences with read-only checks; stop before acting. |

Prefer the cheapest evidence that can falsify the hypothesis. Deterministic behavior checks outrank screenshots for behavioral claims. Real runtime traces outrank a parallel implementation that shares names or shapes. Visual comparisons outrank prose when the decision is visual. User judgment remains the evidence for taste.

Repeated or broader verification is justified when a failure could invalidate several downstream artifacts, escape the repository, or be difficult to reverse.

## 7. Canonical writes and artifact ownership

### 7.1 Reversible canonical writes

AFPS 2.0 permits canonical writes as work progresses when the write is in scope, reversible, and supported by the current evidence. Git branches, explicit file scope, diffs, tests, and archives provide reversibility. Canonical artifacts MUST NOT wait behind compiled approval YAML solely because they are canonical.

When a later slice invalidates a prior write, the agent amends or reverts the affected domain state, records the evidence where the domain needs a decision history, and re-evaluates stale descendants. It does not preserve a false state to honor an earlier approval marker.

### 7.2 State to preserve

The migration preserves artifacts that represent real domain state, including:

- `research/.progress.yaml` product paths and product-line state;
- design flow trees, model attachments, branch relationships, build ledgers, platform-fit evidence, and domain decisions;
- canonical research reports, UX/UI specifications, build plans, prototypes, UAT evidence, and production specs;
- implementation task, manual task, record, and recurring-task artifacts with their existing execution semantics;
- repository delivery state, issue/branch/PR evidence, and release/deployment safety records.

Existing field names MAY change when they encode approval rather than domain truth. Migration scripts or compatibility readers may translate old artifacts, but new ordinary writes use AFPS 2.0 semantics.

### 7.3 State to remove from ordinary workflows

Ordinary AFPS 2.0 workflows do not create or require:

- implicit `alignment/*.html` or `interrogation/*.html` pages;
- answer sidecars or compiled YAML whose purpose is to authorize a canonical write;
- `approval_status`, required-gate parity, or approve-before-write status fields;
- `_working/` copies kept solely because canonical output is forbidden before approval;
- fixed stage cursors whose only meaning is progress through interrogation, alignment, or approval;
- briefing decks that merely wrap a dense approval page.

Historical artifacts and archives are not rewritten. Admin tools continue to understand their own explicit page formats.

## 8. Decision checkpoints

### 8.1 Chat first, slides optional

A checkpoint is delivered in chat by default. It MUST contain:

1. the decision-revealing evidence or links to it;
2. the agent's recommendation and confidence;
3. no more than three material decisions;
4. the next safe move after a response.

A briefing deck MAY be created when visual comparison, several linked evidence surfaces, or a consequential architecture choice materially benefits from presentation. A deck is created at the decision boundary, not as routine progress and not as a wrapper around a mandatory dense page.

### 8.2 Compact decision packet

Optional checkpoint controls emit this interface and no approval vocabulary:

```yaml
command: "$skill-name literal-arguments"
checkpoint: "stable-checkpoint-id"
decisions:
  - id: "decision-id"
    question: "Material question"
    recommendation: "Agent recommendation"
    confidence: "high"
    choice: "reviewer choice or empty"
notes: "Optional reviewer notes"
resume_context:
  artifacts:
    - "path/to/canonical-or-evidence-artifact"
  evidence:
    - "path-or-identifier"
  next_safe_move: "Specific reversible continuation"
```

Contract rules:

- `command` is the owning workflow's literal continuation command.
- `checkpoint` is stable across amendments of the same decision boundary.
- `decisions` contains zero to three material decisions; each uses exactly `id`, `question`, `recommendation`, `confidence`, and `choice`.
- `confidence` is `high`, `medium`, or `low`.
- `notes` is optional reviewer context, not an authorization grant.
- `resume_context` contains `artifacts`, `evidence`, and `next_safe_move`.
- The packet MUST NOT contain `approval_status`, `gate_answers`, `authorized`, `permission_granted`, or equivalent authorization semantics.
- Consuming a packet informs the next slice. It does not authorize a permission-boundary action.

## 9. Goal- and evidence-based routing

Route maps become capability maps. They explain what a skill can contribute and common predecessor/successor relationships, but do not compel a fixed chain.

At every continuation, the agent:

1. reads the user's current goal and the canonical artifacts;
2. identifies the closest unresolved hypothesis, failure, or material decision;
3. selects the smallest slice that can change it;
4. invokes a specialized skill only when that skill is the most useful capability for the slice;
5. skips artifacts and skills that are already sufficient or irrelevant;
6. records domain state in the artifact that owns it;
7. continues, checkpoints, or permission-stops from evidence.

A recommended command is a useful handoff, not a workflow lock. The same command may continue when it owns the next slice. A different command may be selected when the evidence changes the need. No-op routing solely to satisfy a sequence is a defect.

## 10. Design-tree target model

The flow tree remains canonical domain state. AFPS 2.0 rewrites its loop from five approval stages to continuous branch-scoped slice production:

1. resolve the highest-value unresolved branch or honor an explicit user branch;
2. identify the branch hypothesis and the cheapest slice that tests it;
3. write or amend the branch's canonical artifact and child state when reversible;
4. evaluate the result with domain-appropriate assertions;
5. continue on the branch, adapt or stale affected descendants, checkpoint on a material choice, or permission-stop;
6. move to another branch when evidence says it is now the best next slice.

The migration preserves flow ordering, model references, UX/UI branches, build ledgers, prototype items, UAT evidence, platform-fit state, consolidation state, and explicit human task ownership. It removes mandatory stage-zero interrogation, the universal five-stage labels, one-binding-gate-per-branch, HTML-first canonical-write prohibition, and fixed route-position requirements.

Chunking remains an efficiency technique when one session would overload context. Filesystem cursors remain valid when they represent unfinished domain work. Neither condition creates an approval gate. Branch decisions are evidence records; vocabulary such as selected, rejected, revise, retry, deferred, and stale SHOULD replace approve-before-write semantics where the field is not itself a real permission record.

## 11. Shared convention architecture

The implementation creates one canonical `docs/afps-2.0-convention.md` rather than copying this contract into every skill.

The convention is globally available through the existing managed convention-doc channel:

- source of truth: `docs/afps-2.0-convention.md`;
- packaged managed copy: `assets/skillpacks-docs/afps-2.0-convention.md`;
- consumer copy: `.agents/skillpacks/docs/afps-2.0-convention.md`;
- global pointer: the provisioned `AGENTS.md` / `CLAUDE.md` workflow block requires ordinary product, research, design, specification, and implementation work to read and follow the managed convention;
- registry and package audits verify source/package/install freshness.

Skills retain only domain-specific procedure, artifact ownership, evidence requirements, permission boundaries, and exceptions. They do not restate the four actions, slice anatomy, checkpoint packet, or routing algorithm. This keeps the cross-agent semantic contract singular and lowers context cost.

## 12. Explicit review tools after migration

The page systems remain available for intentional use:

- keep `create-alignment-page` as an explicit command;
- add a symmetric `create-interrogation-page` command with mirrored Claude/Codex behavior;
- keep alignment/interrogation conventions, templates, audits, archives, scaffolds, open helpers, TTS assets, and administration tools;
- keep `create-briefing-slides`, rewritten for optional decision checkpoints and general briefings;
- prohibit ordinary workflows from auto-invoking any of the three page creators.

The briefing-slides convention is rewritten around visual briefing and optional decision checkpoints. Dense-page-first, gate-parity, required-gate borders, approval status, and ready-for-agent-review semantics leave the ordinary deck contract. Navigation, accessibility, fit, references, feedback, annotations, local persistence, print behavior, and copy fallback remain.

## 13. Failure handling

| Failure | Response |
|---|---|
| The slice cannot falsify its hypothesis | Reduce or replace the slice; do not present activity as evidence. |
| A recommendation is materially low confidence | Checkpoint with alternatives and the cheapest discriminating evidence. |
| Evidence contradicts a canonical artifact | Amend the artifact, mark affected descendants stale, and re-evaluate them. |
| A prototype resembles source structure but fails source behavior | Fail the parity assertion; do not accept visual or structural similarity as a substitute. |
| The next move crosses a permission boundary | Resolve target/consequence read-only, then permission-stop. |
| Context is too large for reliable continuation | Persist domain state, hand off the next safe move, and resume fresh; do not invent an approval boundary. |
| Tools or external state prevent evaluation | Preserve the slice and evidence gap, try safe alternatives, then report a concrete blocker. |
| User feedback invalidates the direction | Classify the correction, amend toward the requested final state, and update the smallest affected domain subtree. |

## 14. Migration architecture

Implementation occurs on later issue-backed branches after this RFC is accepted.

### Wave 0 — Canary-only foundation

- Add the global AFPS 2.0 convention, provisioned pointer, registry/package support, and semantic contract checks.
- Add a temporary internal `--afps2` dispatch only on the implementation branch.
- Build pinned canary fixtures, run-record schema, deterministic checkers, and isolated worktree runner.
- Do not publish the flag or change ordinary behavior.

### Wave 1 — Checkpoint surfaces and explicit page tools

- Rewrite both `create-briefing-slides` mirrors and the shared deck convention for optional decision checkpoints.
- Update the deck auditor and fixtures to validate compact decision packets and forbid approval semantics.
- Keep `create-alignment-page`; add mirrored `create-interrogation-page`.
- Ensure ordinary skills do not auto-call page creators.

### Wave 2 — Design tree and prototype labs

- Rewrite the design-tree convention and participating skill families around continuous branch-scoped slices.
- Preserve flow-tree domain state and add migrations/readers only where approval-shaped fields must change.
- Validate Chromux-style shared-state UX variants, 3K Stars-style deterministic stations, and Omega Wars source-runtime parity.

### Wave 3 — Research and product paths

- Replace fixed research-session ladders, implicit interrogation rounds, framework approval pages, and synthesis approval gates with evidence-driven slices.
- Preserve research reports, framework evidence, product-path state, and synthesis decisions.

### Wave 4 — Specification, task, and execution routing

- Remove approval-only stops from specification and task workflows.
- Update route maps, handoff contracts, quickstarts, pack docs, catalog descriptions, and platform-native wording to goal/evidence guidance.
- Preserve GitHub delivery, release, deployment, destructive-action, and external-action permission boundaries.

### Wave 5 — Coordinated clean break

- Run the full paired canary and repository-wide contract suite.
- Remove temporary `--afps2` parsing, legacy ordinary dispatch, implicit page stubs, compiled-approval routing, and staged-approval wording.
- Refresh runtime mirrors and regenerate catalog/package artifacts.
- Publish one coordinated release in which AFPS 2.0 is the only ordinary behavior.

For every behavior- or output-changing skill, the implementation MUST run `scripts/skill-archive.sh <skill-dir>` before editing, bump the decimal version, update `CHANGELOG.md`, maintain Claude/Codex parity where applicable, and include generated artifacts in the same wave. Historical archives are not rewritten.

## 15. Canary graduation contract

The companion plan defines measurement details. Migration is eligible to proceed only when the shared thresholds hold:

- pooled median elapsed time or turns to the first decision-revealing slice improves by at least 50%, while the other measure regresses by no more than 10%;
- median blocking questions before the first slice is zero and no run exceeds one absent a permission boundary;
- pooled median review-only artifact count falls by at least 50%;
- every checkpoint contains at most three material decisions;
- every AFPS 2.0-scoped scenario assertion and the Omega Wars source-runtime parity assertion passes in every measured AFPS 2.0 run, while legacy target-contract failures remain baseline evidence;
- no unauthorized destructive, irreversible, external, public, paid, legal, privacy, or security action occurs;
- AFPS 2.0 introduces no checkpoint where its paired legacy run has none, and the paired conditional post-checkpoint rework median is no worse than legacy when both arms checkpoint;
- Claude and Codex pass the same semantic contract.

One efficiency miss among the three scenario families requires diagnosis and a focused rerun. Any safety failure, behavioral-parity regression, cross-agent semantic failure, or two family efficiency misses stops cutover and requires foundation revision. No aggregate score compensates for a hard failure.

## 16. Clean-break release contract

The release is atomic from an ordinary user's perspective:

1. No stable or canary package exposes `--afps2` as a supported long-lived mode.
2. Before the coordinated release, default behavior remains AFPS v1 outside isolated comparison worktrees.
3. At release, ordinary skills, shared conventions, provisioned instructions, route documentation, audits, manifests, and generated catalogs all switch to AFPS 2.0 together.
4. The temporary flag and legacy ordinary dispatch are absent from the release commit.
5. Alignment/interrogation infrastructure remains only as explicit tooling and historical support.
6. Rollback uses the prior release/commit through the normal release process; the new release does not carry a hidden dual-runtime fallback.

Mixed defaults are a release blocker. A skill that still requires an implicit v1 approval gate cannot ship as an ordinary AFPS 2.0 skill.

## 17. Acceptance criteria

The RFC is ready to govern implementation when:

- the companion canary plan uses this vocabulary, action taxonomy, slice schema, decision packet, and release end state;
- reviewers accept or revise the three material decision areas in the briefing checkpoint;
- canary fixtures and assertions are concrete enough to distinguish evidence from superficial output;
- the implementation inventory covers global provisioning, both agent mirrors, conventions, ordinary skills, explicit tools, docs, tests, runtime refresh, catalogs, and packages;
- no section interprets a decision packet as permission or preserves `--afps2` as shipped compatibility behavior.

**Next work:** review the RFC, canary plan, and briefing checkpoint; implementation is deliberately separate.

**Recommended next command:** `$skill-creator AFPS 2.0 foundational convention and canary harness`
