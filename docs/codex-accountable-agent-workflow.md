# Codex Accountable Agent Workflow

This Codex-only convention defines a risk-based accountability lifecycle for planning, implementation, independent review, and delivery. It supplements the shared quality gate without changing Claude workflows.

## Roles and lifecycle

- **Sol** is the accountable owner. Sol plans, assigns bounded work, inspects returned diffs and surrounding code, enforces ownership, integrates personally, verifies the integrated state, dispositions review findings, commits, pushes, and deploys.
- **Luna** is an optional bounded implementer. Use Luna only when parallel work is beneficial and write ownership is disjoint. The default maximum is three concurrent Luna implementers.
- **Terra** is a fresh independent auditor. Every non-trivial Codex mutation receives a read-only Terra audit after Sol has integrated and verified the actual result.

The order is: Sol plan → optional Luna assignments → Sol inspection and integration → integrated verification → fresh Terra audit → Sol disposition and remediation → required focused Terra re-audit → final Sol acceptance → shipping.

Trivial typo, formatting-only, narrow text, and task-checkbox changes stay on the existing single-owner path. A workflow-policy or executable-contract change is non-trivial even when it is text in a skill or convention.

## Model routing truthfulness

Sol records `requested model` and `resolved model` for Sol, every Luna assignment, and Terra. Model names request role separation; they do not prove runtime routing. If the runtime cannot select or report an exact model, record `resolved model: unavailable`, preserve the role's ownership and independence constraints, and disclose the fallback in the final report. Never claim an unverified model identity.

## Accountability topology

Planning records an `Accountability topology` independently of the execution profile:

- `sol-only-trivial`: trivial single-owner change; Terra is not required.
- `sol-terra`: non-trivial mutation implemented by Sol and independently audited by Terra.
- `sol-luna-terra`: non-trivial mutation with one to three safe Luna implementation lanes, Sol integration, and Terra audit.

The topology does not replace `serial`, `research-only`, `review-only`, `implementation-safe`, or `agent-team`. `implementation-safe` Luna lanes share a worktree only with disjoint paths. `agent-team` Luna lanes use isolated non-primary branches and consolidation/PR review. Reject, merge, or serialize any overlapping write ownership before dispatch.

## Luna assignment contract

Every Luna lane must be decision-complete before dispatch:

- lane identifier;
- objective and acceptance criteria;
- relevant context and assumptions;
- allowed paths it exclusively owns;
- forbidden and shared paths it must not edit;
- verification commands;
- dependencies and ordering constraints;
- requested model and resolved model (or `unavailable` plus fallback);
- required return evidence.

Task docs, shared manifests, lockfiles, migrations, generated artifacts, integration, conflict resolution, commits, pushes, and deployment remain Sol-owned unless the plan explicitly grants one lane exclusive ownership of a normally shared artifact. Sol must not assign overlapping paths to multiple write lanes.

Each Luna return report includes: lane identifier, status, changed paths, diff/commit evidence, acceptance-criteria mapping, verification commands and results, assumptions or deviations, unresolved risks, and requested/resolved model identity. A return is evidence, not acceptance: Sol reads the actual diff and surrounding code before integrating it.

## Terra audit contract

Terra starts only after integrated verification and receives the final integrated diff plus relevant surrounding code, plans, specifications, and verification evidence. Terra must be a fresh review context that did not implement or integrate the reviewed change.

In delegated mode, invoke `$expert-review --adversarial-diff --read-only`. Before launch, Sol captures any prompt-history or delegation record required by the repository. Terra must not modify repository files, task documents, prompt history, alignment pages, indexes, branches, commits, refs, or external state; read-only mode overrides all write-producing skill and repository conventions for the delegated invocation.

Every non-stylistic finding has a stable identifier and these fields:

- severity: `Critical`, `High`, `Medium`, or `Low`;
- file and line evidence;
- impact and failure mode;
- recommended remediation;
- verification method;
- confidence: `high`, `medium`, or `low`.

Terra reports `no findings` explicitly when appropriate. Style-only observations may be omitted and cannot block shipping.

## Sol disposition and remediation

Sol records exactly one disposition for every Terra finding:

- `accepted`: fix it or record why it remains unresolved. Accepted Critical/High findings block shipping until resolved and verified.
- `rejected`: cite concrete code, test, specification, or runtime evidence showing the finding does not apply.
- `deferred`: record residual risk, owner or destination, and a concrete next step. Deferral never bypasses the accepted Critical/High blocker.

After remediation, Sol reruns relevant integrated verification. A fresh focused Terra re-audit is mandatory when the remediation affects security, authentication, billing, persistence, migrations, concurrency, privacy, data loss, or broad cross-package contracts. The focused audit is also read-only and must verify the finding, fix, and adjacent regression risk.

## Shipping gate

Sol refuses shipping when any of these is true:

- an accepted Critical or High finding is unresolved;
- required integrated verification failed;
- a required focused Terra re-audit is absent or failed;
- Luna ownership overlap or out-of-scope edits remain unresolved;
- Sol has not inspected and accepted the integrated result.

Direct-to-primary and branch-isolated `agent-team` delivery rules remain governed by the repository's shipping contract. Sol is always the final integration and delivery owner.

## Final accountability report

The ship manifest and terminal report include:

- accountability topology and risk classification;
- Luna assignments and results, or why Luna was not used;
- requested/resolved model identities and routing fallbacks;
- Sol diff inspection and integration evidence;
- grouped changed files by owner and purpose;
- integrated verification and unavailable checks with reasons;
- Terra findings and a complete Sol disposition ledger;
- remediation and verification evidence;
- focused Terra re-audit evidence or why it was not required;
- deferred risks and concrete next steps;
- final Sol acceptance and shipping-gate status.
