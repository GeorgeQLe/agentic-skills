# Context Intake Convention

This file defines the **context intake convention** for skills that gather user or project context before producing output. The historical filename remains `docs/interview-convention.md` for link stability, but the canonical frontmatter field is `context_intake`.

Each skill may declare its intake mode in `SKILL.md` frontmatter:

```yaml
context_intake: deep | scoped | artifact_only
```

The intake phase happens before alignment-page review artifacts are built. Alignment pages are reserved for visual review, feedback, and approval of proposed deliverables.

## Manifest Visibility Rule

Deliver every manifest/checklist/checkpoint the user must confirm inline as the final message text of its own turn; ask the confirmation question in the next turn. AskUserQuestion option previews may mirror the content as a supplement but are never the sole channel. Never emit it only as mid-turn text in a turn that ends with a tool call because harness rendering does not guarantee mid-turn text is shown. A confirmation question must never reference content the user has not been shown.

This rule applies to every confirmation artifact in every intake mode: assumptions manifests, coverage checkpoints, findings validations, evidence briefs, and any other content the user is asked to confirm, correct, or flag.

## Intake Modes

### Deep interview (`context_intake: deep`)

For skills where the user is the primary source and input is ambiguous. The skill cannot produce useful output without understanding the user's specific situation, goals, and constraints.

**Phase 1 - Evidence/context gathering.** Read project context (`.agents/project.json`, README, CLAUDE.md, specs, research docs, git history) before asking anything. Build an internal model of what is already known.

**Phase 2 - Assumptions manifest.** Present 3-7 bullets of what the skill assumes based on gathered evidence. Tag each assumption with its source: `[from prompt]`, `[from repo]`, `[from research]`, `[from spec]`, `[from codebase]`, `[from git]`, `[inferred]`. Ask the user to confirm, correct, or flag each assumption before proceeding. Deliver the manifest per the Manifest Visibility Rule above.

**Phase 3 - Focused interview loop.** Ask 1-3 questions per turn using the current agent's user-input mechanism. Research and recommend by default: present options with pros/cons, state a recommendation, and ask the user to approve, adjust, or override. Cover the skill's defined interview areas. Do not ask open-ended "tell me about..." questions when specific options can be derived from context.

**Phase 4 - Coverage checkpoint.** Present a summary checklist of everything covered. Ask the user to confirm completeness or flag gaps. Only after explicit confirmation does the skill proceed to build the alignment page. Deliver the checklist per the Manifest Visibility Rule above.

**Deep-interview examples:** `enterprise-icp`, `gtm`, `landing-copy`, `metrics`, `monetization`, `conversion-map`, `expansion-map`, `lifecycle-metrics`, `onboarding-map`, `retention-map`, `transaction-map`, `feature-interview`, `ui-interview`, `spec-interview`, `skill-interview`, `idea-scope-brief`, `customer-discovery`, `user-flow-map`.

### Scoped intake (`context_intake: scoped`)

For skills where external data, repo artifacts, or research sources are primary, but user context or validation is needed to focus the work and keep conclusions relevant.

**Phase 1 - Scope questions.** Ask 1-3 focused questions to understand the user's product/service, target audience, constraints, and what they hope to learn or decide.

**Phase 2 - Research or analysis.** Perform web search, codebase analysis, artifact review, or other data gathering based on the context gathered.

**Phase 3 - Findings validation.** Before building the alignment page, present the 3-5 most important findings inline as the final message text of their own turn and ask the user to validate or correct critical assumptions in the next turn. This is a brief checkpoint, not a deep interview.

**Phase 4 - Alignment page.** Build the alignment page with the validated findings.

**Scoped-intake examples:** `competitive-analysis`, `customer-feedback`, `lean-canvas`, `positioning`, `value-prop-canvas`, `experiment`, `growth-model`, `hook-model`, `pmf-assessment`, `burn-rate`, `platform-strategy`, `risk-register`, `runway-model`, `retro`, `devtool-adoption`, `devtool-monetization`, `devtool-positioning`, `devtool-user-map`, `game-audience`, `game-comparables`, `game-fantasy`, `game-genre-map`, `game-launch`, `game-prototype-test`, `game-store-page-test`, `youtube-concept-research`, `content-programming`, `creator-positioning`, `product-led-media-map`, `series-spec`, `brainstorm`.

### Artifact-driven (`context_intake: artifact_only`)

For skills that primarily work from concrete external data, analytics, codebase state, existing artifacts, logs, or pre-approved instructions. There is no required pre-work discovery interview. This does not mean "never ask questions": ask concise clarification questions when the artifact is missing, contradictory, unsafe to interpret, or insufficient to proceed.

**Artifact-driven examples:** `assumption-tracker`, `cohort-review`, `investor-update`, `mvp-gap`, `product-line`, `reconcile-research`, `scale-audit`, `devtool-docs-audit`, `devtool-dx-journey`, `devtool-integration-map`, `devtool-workflow`, `game-core-loop`, `game-playtest-metrics`, `game-roadmap`, `game-workflow`, `youtube-audit`, `youtube-cadence-diagnosis`, `youtube-channel-audit`, `youtube-competitive-research`, `youtube-description-optimizer`, `youtube-format-research`, `youtube-peer-benchmark`, `youtube-portfolio`, `youtube-search-positioning`, `youtube-title-thumbnail-audit`, `youtube-vid-research`, `youtube-video-audit`, `youtube-video-prelaunch-audit`, `analyze-sessions`, `dogfood`, `uat`, `creator-evidence-schema`, `creator-metrics-review`, `creator-platform-capability-matrix`, `creator-presence-dossier`.

## Deep Interview Section Template

Add this section to `SKILL.md` for deep-interview skills that do not already have an intake pattern:

```markdown
## Context Intake

**Step 1 - Gather context.** Read `.agents/project.json`, README, CLAUDE.md, existing research and specs, git history, and any argument-provided context. Build an internal evidence base before asking questions.

**Step 2 - Assumptions manifest.** Present 3-7 assumptions about the user's situation, goals, and constraints. Tag each with source (`[from prompt]`, `[from repo]`, `[from research]`, `[inferred]`). Deliver the manifest inline as the final message text of its own turn; ask the user to confirm, correct, or flag in the next turn.

**Step 3 - Focused interview.** Ask 1-3 focused questions per turn. Cover: [skill-specific areas]. Research and recommend by default. Present options with a recommended default. Continue until all required areas are covered.

**Step 4 - Coverage checkpoint.** Present a summary of everything established inline as the final message text of its own turn; ask the user to confirm completeness in the next turn before building the alignment page.
```

## Scoped Intake Section Template

Add this section to `SKILL.md` for scoped-intake skills:

```markdown
## Context Intake

**Step 1 - Scope questions.** Before researching, ask 1-3 focused questions to understand the product/service, target audience, constraints, and intended decision.

**Step 2 - Research.** Conduct research or analysis scoped by the user's answers.

**Step 3 - Findings validation.** Before building the alignment page, present the 3-5 most important findings inline as the final message text of their own turn; ask the user to validate or correct any critical assumptions in the next turn.
```

## Frontmatter

Skills declare context intake in YAML frontmatter:

```yaml
---
name: skill-name
context_intake: deep | scoped | artifact_only
---
```

Use `type` only for the broad workflow category: `planning`, `research`, `analysis`, `execution`, `review`, `shipping`, `ops`, or `router`. Do not overload `type` with intake behavior.

The upgrade and catalog tooling read `context_intake` as metadata. Historical `interview_depth` declarations should not appear in active non-archived skill files.
