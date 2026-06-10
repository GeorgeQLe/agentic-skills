# Interview Convention

This file defines the **interview depth convention** for skills that gather user context before producing output. Each skill declares its interview depth via `interview_depth` in SKILL.md frontmatter. The interview phase happens entirely in the terminal (via `AskUserQuestion` or direct questions) **before** the alignment page is built. The alignment page is reserved for visual review and approval, not interrogation.

## Interview Tiers

### Full (4-phase)

For skills where the user is the primary source and input is ambiguous. The skill cannot produce useful output without understanding the user's specific situation, goals, and constraints.

**Phase 1 — Evidence/context gathering.** Read project context (`.agents/project.json`, README, CLAUDE.md, specs, research docs, git history) before asking anything. Build an internal model of what is already known.

**Phase 2 — Assumptions manifest.** Present 3–7 bullets of what the skill assumes based on gathered evidence. Tag each assumption with its source: `[from prompt]`, `[from repo]`, `[from research]`, `[from spec]`, `[from codebase]`, `[from git]`, `[inferred]`. Ask the user to confirm, correct, or flag each assumption before proceeding.

**Phase 3 — Focused interview loop.** Ask 1–3 questions per turn via `AskUserQuestion`. Research and recommend by default — present options with pros/cons, state a recommendation, ask the user to approve/adjust/override. Cover the skill's defined interview areas. Do not ask open-ended "tell me about..." questions; offer specific options derived from context.

**Phase 4 — Coverage checkpoint.** Present a summary checklist of everything covered. Ask the user to confirm completeness or flag gaps. Only after explicit confirmation does the skill proceed to build the alignment page.

**Full-interview skills:** `enterprise-icp`, `gtm`, `landing-copy`, `metrics`, `monetization`, `conversion-map`, `expansion-map`, `lifecycle-metrics`, `onboarding-map`, `retention-map`, `transaction-map`, `feature-interview`, `ui-interview`, `spec-interview`, `skill-interview`, `idea-scope-brief`, `customer-discovery`

### Light (2-phase)

For skills where external data is primary but user context or validation is needed to focus the research and ensure relevance.

**Phase 1 — Context gathering.** 1–3 `AskUserQuestion` calls to understand the user's product, target market, constraints, and what they hope to learn. This scopes the research phase.

**Phase 2 — Research phase.** Perform web search, codebase analysis, or other data gathering based on the context gathered.

**Phase 3 — Findings validation.** Present key findings to the user and ask them to validate or correct critical assumptions before the alignment page is built. This is a brief checkpoint, not a full interview.

**Phase 4 — Alignment page.** Build the alignment page with the validated findings.

**Light-interview skills:** `competitive-analysis`, `customer-feedback`, `lean-canvas`, `positioning`, `value-prop-canvas`, `experiment`, `growth-model`, `hook-model`, `pmf-assessment`, `burn-rate`, `platform-strategy`, `risk-register`, `runway-model`, `retro`, `devtool-adoption`, `devtool-monetization`, `devtool-positioning`, `devtool-user-map`, `game-audience`, `game-comparables`, `game-fantasy`, `game-genre-map`, `game-launch`, `game-prototype-test`, `game-store-page-test`, `youtube-concept-research`, `content-programming`, `creator-positioning`, `product-led-media-map`, `series-spec`, `brainstorm`

### None

For skills that work from concrete external data (analytics, codebase state, existing artifacts). No interview phase — proceed directly to research/analysis and then the alignment page.

**None-interview skills:** `assumption-tracker`, `cohort-review`, `investor-update`, `mvp-gap`, `product-line`, `reconcile-research`, `scale-audit`, `devtool-docs-audit`, `devtool-dx-journey`, `devtool-integration-map`, `devtool-workflow`, `game-core-loop`, `game-playtest-metrics`, `game-roadmap`, `game-workflow`, `youtube-audit`, `youtube-cadence-diagnosis`, `youtube-channel-audit`, `youtube-competitive-research`, `youtube-description-optimizer`, `youtube-format-research`, `youtube-peer-benchmark`, `youtube-portfolio`, `youtube-search-positioning`, `youtube-title-thumbnail-audit`, `youtube-vid-research`, `youtube-video-audit`, `youtube-video-prelaunch-audit`, `analyze-sessions`, `dogfood`, `uat`, `creator-evidence-schema`, `creator-metrics-review`, `creator-platform-capability-matrix`, `creator-presence-dossier`

## Interview Section Template (Full)

Add this section to SKILL.md for full-interview skills that don't already have an interview pattern:

```markdown
## Interview Protocol

**Step 1 — Gather context.** Read `.agents/project.json`, README, CLAUDE.md, existing research and specs, git history, and any argument-provided context. Build an internal evidence base before asking questions.

**Step 2 — Assumptions manifest.** Present 3–7 assumptions about the user's situation, goals, and constraints. Tag each with source (`[from prompt]`, `[from repo]`, `[from research]`, `[inferred]`). Ask the user to confirm, correct, or flag before proceeding.

**Step 3 — Focused interview.** Ask 1–3 questions per turn via `AskUserQuestion`. Cover: [skill-specific areas]. Research and recommend by default — present options with a recommended default. Continue until all areas are covered.

**Step 4 — Coverage checkpoint.** Present a summary of everything established. Ask the user to confirm completeness before building the alignment page.
```

## Interview Section Template (Light)

Add this section to SKILL.md for light-interview skills:

```markdown
## Context Gathering

**Step 1 — Scope questions.** Before researching, ask the user 1–3 questions via `AskUserQuestion` to understand: their product/service, target audience, and what they hope to learn or decide from this research.

**Step 2 — Research.** Conduct research scoped by the user's answers.

**Step 3 — Findings validation.** Before building the alignment page, present the 3–5 most important findings and ask the user to validate or correct any critical assumptions.
```

## Frontmatter

Skills declare their interview depth in YAML frontmatter:

```yaml
---
name: skill-name
interview_depth: full | light | none
---
```

The upgrade script reads this field and optionally injects tier-appropriate guidance into `ALIGNMENT-PAGE.md`.
