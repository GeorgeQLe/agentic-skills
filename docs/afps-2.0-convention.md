# AFPS 2.0 Convention

This is the canonical operating contract for ordinary product, research, design, specification, implementation, and task work. Source checkouts load `docs/afps-2.0-convention.md`; packaged consumers load `.agents/skillpacks/docs/afps-2.0-convention.md`, installed from `assets/skillpacks-docs/afps-2.0-convention.md`.

The governing loop is:

> infer intent → produce the smallest decision-revealing slice → evaluate evidence → continue or checkpoint

## Classify The Next Move

Apply these actions in precedence order. A higher-numbered action overrides a lower-numbered one.

1. **Infer and proceed.** Use for a reversible choice with a clear evidence-backed direction and cheap correction.
2. **State an assumption and proceed.** Use when uncertainty is meaningful enough to disclose but local and inexpensive to correct.
3. **Decision checkpoint.** Use for taste, materially different alternatives, high-downstream-cost direction, or a consequential low-confidence assumption. Present evidence and a recommendation in chat, ask at most three material decisions, and resume from the response.
4. **Permission stop.** Use before destructive, irreversible, public, paid, legal, privacy-sensitive, security-sensitive, account-authenticated, or otherwise externally consequential action. Resolve the exact target and consequence read-only, then obtain explicit authority through the governing safety mechanism.

Do not manufacture a checkpoint because an older workflow had an approval gate. A checkpoint never grants permission for an action classified as a permission stop.

## Produce A Decision-Revealing Slice

The smallest useful slice must make these seven semantic elements inspectable, inline or in the domain-native artifact:

- `hypothesis`: the belief, risk, or choice the slice could change;
- `artifact_or_behavior`: the tangible thing produced or exercised;
- `visible_result`: what the user or evaluator can inspect;
- `assertion_or_evaluation`: the assertion, rubric, comparison, or observation that judges it;
- `recommendation`: what the evidence suggests doing now;
- `confidence`: `high`, `medium`, or `low`, with a reason;
- `next_safe_move`: the next reversible action that needs neither a material decision nor new authority.

Use the cheapest evidence capable of falsifying the hypothesis. Deterministic behavior checks outrank screenshots for behavioral claims; runtime traces outrank parallel lookalikes; visual comparisons outrank prose for visual decisions; user judgment remains the evidence for taste.

After evaluation, `continue`, `adapt`, `checkpoint`, or `permission stop`. Skill boundaries and session boundaries do not themselves require a stop.

## Write Canonical State Reversibly

Write or amend canonical research, design, specification, code, prototype, and task artifacts as work progresses when the mutation is in scope, reversible, and supported by current evidence. Branches, explicit paths, diffs, tests, and archives provide reversibility.

Ordinary AFPS 2.0 work does not create or require implicit `alignment/*.html` or `interrogation/*.html` pages, compiled approval YAML, answer sidecars, approval-only `_working/` copies, or status fields whose only meaning is permission to write canonical state. Use explicit page-creation skills only when the user requests a page or a real visual review need materially benefits from one.

Preserve real domain state, evidence, delivery records, and genuine permission records. When evidence invalidates canonical state, amend it, mark dependent state stale where relevant, and re-evaluate it.

## Use Chat-First Decision Checkpoints

A decision checkpoint contains:

1. the decision-revealing evidence or direct artifact links;
2. the agent recommendation and confidence;
3. no more than three material decisions;
4. the next safe move after the response.

Optional structured checkpoint controls use exactly this shape:

```yaml
command: "$skill-name literal-arguments"
checkpoint: "stable-checkpoint-id"
decisions:
  - id: "decision-id"
    question: "Material question"
    recommendation: "Agent recommendation"
    confidence: "high"
    choice: ""
notes: "Optional reviewer notes"
resume_context:
  artifacts:
    - "path/to/artifact"
  evidence:
    - "path-or-identifier"
  next_safe_move: "Specific reversible continuation"
```

The top-level keys are `command`, `checkpoint`, `decisions`, optional `notes`, and `resume_context`. Each decision uses exactly `id`, `question`, `recommendation`, `confidence`, and `choice`. `resume_context` uses exactly `artifacts`, `evidence`, and `next_safe_move`.

Do not use `approval_status`, `gate_answers`, `authorized`, `permission_granted`, or equivalent approval/authorization semantics. Consuming a packet informs the next slice; it never authorizes a permission-boundary action.

## Route From Goal And Evidence

Treat route maps as capability maps, not mandatory chains. Read the current goal and canonical state, identify the closest unresolved hypothesis or failure, select the smallest discriminating slice, and invoke a specialized skill only when it is the best capability for that slice. Skip sufficient or irrelevant artifacts. A recommended command is a handoff, not a workflow lock.

## Handle Failure

- If a slice cannot falsify its hypothesis, reduce or replace it.
- If a recommendation is materially low confidence, produce the cheapest discriminating evidence and checkpoint only if the decision remains material.
- Treat missing required input, inaccessible assets, or unavailable capability as an input/capability blocker, not an approval ritual.
- If the next move crosses a permission boundary, identify the exact action, target, consequence, and required authority, then stop.

Historical approval artifacts remain valid history. AFPS 2.0 changes ordinary new work; it does not rewrite archives.
