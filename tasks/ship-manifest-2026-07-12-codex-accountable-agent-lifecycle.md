# Ship Manifest - Codex Accountable Agent Lifecycle

## User goal

Implement the approved Codex-only Sol/Luna/Terra accountability lifecycle across planning, execution, independent review, quality gating, and shipping while preserving unrelated dirty work and leaving Claude skill sources unchanged.

## Accountability

- Topology: `sol-terra`.
- Risk: non-trivial cross-skill workflow-policy mutation.
- Luna assignments/results: none; the affected skills, shared gate, generated catalog, tests, and task records are integration chokepoints, so disjoint implementation lanes were not beneficial.
- Model routing: Sol requested role `Sol`; resolved model identity is unavailable in this runtime. Terra requested role `Terra`; resolved model identity is unavailable. Role constraints were preserved and no exact model identity is claimed.
- Sol inspection/integration: inspected each active skill, archive, changelog, shared convention, test, generated catalog diff, and surrounding workflow language. Sol performed all edits and integration.

## Changed files and purpose

- Convention and gate: `docs/codex-accountable-agent-workflow.md`, `docs/quality-gate-contract.md` define the Codex lifecycle and generic shared pointer.
- Planning/execution: Codex `plan-phase` and `exec` active skills, changelogs, and prior-version archives add topology and lifecycle control.
- Review: Codex `expert-review` active skill, changelog, and archive add fresh `--adversarial-diff --read-only` Terra behavior.
- Shipping: Codex `ship` and `ship-end` active skills, changelogs, and archives add accountability evidence and hard blockers.
- Verification: `tests/layer1/codex-accountable-agent-workflow.test.ts` enforces the lifecycle contract.
- Packaging: `exports/skills-catalog/v1/{catalog,manifest,proof}.json` publish the changed Codex metadata.
- Records: the exec prompt capture, this manifest, and `tasks/history.md` preserve invocation, evidence, and outcome. `tasks/roadmap.md` and `tasks/todo.md` contain an unstaged concurrent-work record because their pre-existing GitHub-delivery edits are outside this ship boundary.

Every included change maps directly to convention definition, orchestrator enforcement, independent review, shipping gates, versioning, packaging, verification, or required history.

## Integrated verification

- `npx vitest run tests/layer1/codex-accountable-agent-workflow.test.ts` — 7/7 passed after Terra remediation.
- `scripts/skill-archive-audit.sh --strict` — passed.
- `scripts/skill-mirror-parity-audit.sh` — passed; no parity exception was required.
- `node scripts/audit-task-docs.mjs` — passed with zero failures/warnings.
- `node scripts/upgrade-alignment-page.mjs --check` and `node scripts/audit-alignment-pages.mjs` — passed.
- `scripts/validate-skills-catalog-export.sh` — passed after generation.
- `scripts/pack.sh refresh` plus source/runtime `cmp` checks for enabled affected Codex skills — passed.
- `git diff --check` — passed.
- `npx vitest run tests/layer1` — 2,511/2,532 passed. The 21 failures are in untouched research/design/provisioning contracts; none reference accountable-lifecycle files.

## Unavailable or skipped checks

- A fully green layer-one suite is unavailable without remediating unrelated pre-existing failures in research approval, alignment routing, product-path, frontmatter, flow-tree, prompt-history, and research-amend contracts. Widening this mutation into those systems would violate the requested boundary.
- `plan-phase` is not currently enabled under `.codex/skills`, so runtime byte comparison was performed for `exec`, `expert-review`, `ship`, and `ship-end`; the source skill and catalog metadata validate `plan-phase`.
- No deployment applies; no `deploy.md` or `tasks/deploy.md` contract is part of this documentation/workflow-policy change.

## Terra findings and Sol dispositions

- `TERRA-001` — High — accepted. `expert-review --read-only` overrode Follow-Through writes but still inherited prompt-history, alignment-page, and shipping mutations. Remediation: it now overrides every mutation-producing instruction, enumerates forbidden state, requires Sol to pre-capture delegation history, and skips alignment/shipping/task/prompt writes. Verification: targeted contract test 7/7, runtime/source comparison, and focused Terra re-audit with no findings.
- `TERRA-002` — Medium — accepted. The initial test relied too heavily on canonical vocabulary. Remediation: added enforcement assertions for forbidden Terra writes, exec overlap handling, rejected/deferred evidence, ship disposition ledgers, model fallback fields, and explicit Claude-source exclusion. Verification: targeted contract test 7/7 and focused Terra re-audit with no findings.
- Rejected findings: none.
- Deferred findings: none.
- Focused re-review: required because the High remediation changes the broad cross-skill review contract; a fresh read-only Terra context returned no findings with high confidence.

## Deferred risks

- The pre-existing full-suite failures may obscure future unrelated regressions; next step is a separate reconciliation task for those named contracts.
- The active GitHub-delivery task changes `tasks/roadmap.md` and `tasks/todo.md`. Those user-owned changes and their untracked deck/prompts remain unstaged and must not be included in this commit.

## Rollback

Revert the accountable-lifecycle commit. The archived prior skill versions provide exact contract references; rerun catalog generation and `scripts/pack.sh refresh` after reversal.

## Final Sol acceptance

Accepted. All Terra findings are resolved, integrated targeted verification passes, the required focused re-audit is clean, no accepted Critical/High finding remains, and unrelated dirty work is outside the staged boundary.

## Next command

`$skill-creator` with the approved GitHub-delivery briefing YAML remains the unrelated active project route after this implementation is shipped.
