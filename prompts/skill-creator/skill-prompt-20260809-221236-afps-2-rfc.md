---
skill: skill-creator
agent: codex
captured_at: 2026-08-09T22:12:36-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# AFPS 2.0 Foundational RFC and Canary Plan

## Summary

Draft AFPS 2.0 as a ground-up replacement for the current approval-first system. The new operating loop is:

`infer intent → produce the smallest decision-revealing slice → evaluate evidence → continue or checkpoint`

The RFC will define the complete target architecture and coordinated clean-break migration. A temporary `--afps2` flag will exist only on the implementation branch for comparative canaries; it will be removed before AFPS 2.0 becomes the sole ordinary behavior.

This drafting task produces the RFC, canary plan, and one briefing checkpoint deck. It does not yet migrate skills.

## Foundational Contract

- Define four agent actions:

  1. **Infer and proceed** when the choice is reversible and evidence supports a clear direction.
  2. **State an assumption and proceed** when uncertainty is meaningful but inexpensive to correct.
  3. **Decision checkpoint** for taste, prototype selection, high-downstream-cost direction, or a material low-confidence assumption.
  4. **Permission stop** for destructive, irreversible, public, paid, legal, privacy, security, or externally consequential actions.

- Make the decision-revealing slice the unit of progress. Every slice identifies its hypothesis, tangible artifact or behavior, visible result, assertion/evaluation, recommendation, confidence, and next safe move.
- Permit reversible canonical writes as work progresses; remove the rule that canonical artifacts wait behind compiled approval YAML.
- Limit checkpoints to three material decisions. Briefing slides are created only at a decision boundary, not for routine progress.
- Make checkpoints chat-first. Optional controls emit a compact decision packet containing `command`, `checkpoint`, `decisions[]`, notes, and resume context—never approval status or authorization semantics.
- Replace fixed AFPS chains with goal- and evidence-based routing. Route maps remain capability guidance, while agents may skip irrelevant skills and infer the next useful action from current artifacts.
- Keep existing product-path, design-tree, research, specification, and task artifacts when they represent real domain state; remove state whose only purpose is approval orchestration.

## RFC and Migration Design

- Write `docs/proposals/afps-2.0-rfc.md` covering principles, decision boundaries, slice anatomy, checkpoint behavior, evidence proportionality, routing, artifact ownership, failure handling, and the clean-break release contract.
- Write `docs/proposals/afps-2.0-canary-plan.md` containing fixtures, paired-run protocol, metrics, thresholds, rollback conditions, and cutover sequence.
- Build `briefing-slides/afps-2.0-rfc.html` as the RFC review checkpoint. It links the two documents directly and contains no dense alignment/interrogation backup page.
- Define a new globally provisioned AFPS 2.0 convention rather than repeating the full contract inside every skill.
- Rewrite the briefing-slides convention around optional decision checkpoints; remove its dense-page-first and gate-parity requirements.
- Rewrite the design-tree loop from five approval stages into continuous branch-scoped slice production while preserving the flow tree as domain state.
- Remove implicit alignment/interrogation requirements, page stubs, compiled-YAML gates, and staged approval wording from ordinary skills and routing documentation during the later migration.
- Preserve alignment/interrogation conventions, templates, audits, archives, and admin tools for explicit use only.
- Keep `create-alignment-page` and add a symmetric `create-interrogation-page`; neither may be invoked automatically by ordinary workflows.
- During implementation, archive and decimal-bump every skill whose behavior or outputs change, update its changelog, refresh runtime mirrors, and regenerate catalog/package artifacts.

## Canary and Cutover

Use four paired scenarios against pinned, identical inputs:

- `idea-scope-brief`: a rough product concept with inferable scope but two consequential uncertainties.
- `ux-variations`: the Chromux theme-lab pattern—multiple complete variants sharing one canonical product state.
- `game-prototype-test`: the 3K Stars gameplay-lab pattern—small deterministic stations with unique fixtures, actions, visible outcomes, and assertions.
- `game-prototype-test`: the Omega Wars failure case—verify behavioral parity and reject a parallel runtime that merely resembles the source structure.

Run legacy and temporary `--afps2` behavior on isolated worktrees for both Claude and Codex. Use three repeated runs per scenario and agent after deterministic contract checks pass.

Graduation requires:

- Median time or turns to the first decision-relevant slice improves by at least 50%.
- Median blocking questions before the first slice is zero and never exceeds one unless a permission boundary exists.
- Review-only artifact count falls by at least 50%.
- Every checkpoint contains at most three material decisions.
- All scenario-specific quality and behavioral-parity assertions pass.
- No unauthorized destructive, external, public, paid, legal, privacy, or security action occurs.
- Post-checkpoint rework is no worse than the legacy baseline.
- Both supported agents pass the same semantic contract despite platform-specific wording.

If any safety assertion fails, behavioral parity regresses, or two scenario families miss the efficiency thresholds, stop the cutover and revise the foundation. Otherwise migrate skill families in development waves, validate each wave, and publish one coordinated release where ordinary AFPS 2.0 behavior replaces v1 and the temporary flag disappears.

## Draft Verification and Delivery

- Validate that both documents use the same terms, thresholds, interfaces, and end state.
- Audit the deck with the briefing-slides static auditor and verify desktop/mobile fit, navigation, references, decision controls, and compact decision-packet output.
- Confirm the draft creates no alignment or interrogation page and does not mutate active skill behavior.
- Capture the visible skill-creator prompt history and record the user correction in `tasks/lessons.md`.
- Create a new issue-backed branch and ready pull request for the RFC artifacts, separate from research PR #12; link PR #12 as evidence and leave both unmerged.
- Treat the later foundation implementation and clean-break migration as a separate issue/branch/PR sequence governed by the approved RFC.
