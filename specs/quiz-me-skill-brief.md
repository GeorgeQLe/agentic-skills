# quiz-me Skill Brief

## Overview

A repo-managed skill that reads alignment pages, specs, or any readable document and adversarially quizzes the user to verify deep comprehension. Designed to catch skimmers — questions target relationships, implications, and trade-offs rather than surface-level recall.

## Goals

1. Verify that the user deeply read and understood a document, not just skimmed it
2. Test comprehension of relationships between sections, design trade-offs, and non-obvious implications
3. Push back hard on vague or shallow answers — refuse to accept bluffing
4. Produce a clear pass/fail verdict with a summary of weak areas

## Non-Goals

- Teaching or explaining the document content (this is a test, not a tutorial)
- Modifying any files or producing persistent artifacts
- Replacing `taste-calibration` (which builds alignment for new work; `quiz-me` tests comprehension of existing docs)
- Generating questions that can be answered from section headers alone

## Skill Contract

- **Name:** `quiz-me`
- **Type:** `evaluation`
- **Location:** `global/claude/quiz-me/SKILL.md`
- **Argument hint:** `[file-path-or-glob]`
- **Description:** Adversarial one-question-at-a-time questioning to verify deep reading comprehension of alignment pages, specs, or any document

## Workflow

### Phase 1: Silent Document Ingestion
1. Read all files matching the argument (default: find alignment HTML and spec files in the current repo)
2. Parse the document structure — identify major sections, key decisions, trade-offs, relationships between sections, and non-obvious details
3. Build an internal question plan covering all major sections, biased toward:
   - Cross-section relationships ("How does X in section 3 affect Y in section 7?")
   - Implications and trade-offs ("What happens if the migration in step 2 fails?")
   - Specific details that skimmers miss (exact constraints, numbers, edge cases)
   - Intent questions ("Why was approach A chosen over approach B?")
4. Do NOT surface any of this analysis to the user

### Phase 2: Adversarial Questioning
1. Ask **one question per turn** — non-negotiable
2. Use `AskUserQuestion` for every question (free-text response via "Other")
3. Question types (mix throughout):
   - **Relationship:** "Section X describes [thing]. How does that interact with [thing from section Y]?"
   - **Implication:** "If [condition from the doc] changes, what breaks?"
   - **Detail trap:** "What specific [constraint/number/name] does the doc specify for [thing]?"
   - **Intent:** "Why does the doc recommend [approach] instead of [alternative]?"
   - **Synthesis:** "Summarize the three most important trade-offs the document makes."
4. After each answer, evaluate strictly:
   - **Correct and specific:** Acknowledge briefly, move to next question
   - **Vague or incomplete:** Push back — "That's too vague. What specifically does the doc say about [X]?" Do NOT accept hand-wavy answers
   - **Wrong:** State what's wrong, ask the user to try again or explain what they thought the doc said
   - **Suspiciously perfect verbatim recall:** Ask a follow-up that requires synthesis, not recitation
5. Track per-section comprehension internally

### Phase 3: Termination
**Continue until one of:**
- The user has demonstrated deep understanding across all major sections (no section left untested)
- The user explicitly gives up or asks to stop

**Do NOT terminate early** because the user got a few questions right. Cover the full document.

### Phase 4: Verdict
1. Deliver a **pass/fail verdict**
2. Include a summary:
   - Sections with strong comprehension
   - Sections with weak or missing comprehension
   - Specific gaps identified
3. If fail: recommend which sections to re-read

## Inputs and Outputs

### Inputs
- **Required:** File path or glob pattern (e.g., `docs/workflow-refactor-proposal.html`, `specs/*.md`)
- **Default behavior (no argument):** Find all alignment HTML files and spec documents in the current repo and quiz on all of them
- **Supported formats:** HTML, Markdown, plain text — any readable document with substantive content

### Outputs
- Conversation-only (no files written)
- Final verdict: pass/fail + per-section comprehension summary

## Safety and Side Effects

- **Read-only:** The skill reads documents and asks questions. It writes nothing.
- **No commits, no pushes, no file mutations**
- **No external requests** — all content is local
- **Adversarial but not hostile:** Push back firmly on bad answers, but don't insult the user

## Verification and Benchmark Coverage

- **Benchmark strategy:** Create a known test document with predictable content, then script a set of correct and incorrect answers to verify:
  1. Questions target cross-section relationships (not just surface recall)
  2. Vague answers are rejected and re-asked
  3. Wrong answers are caught and corrected
  4. Verdict accurately reflects comprehension gaps
- **Deterministic local coverage:** Feasible — the skill's question generation and answer evaluation can be tested against fixed documents with known-good and known-bad answer sets

## Related Skills

| Skill | Relationship |
|-------|-------------|
| `taste-calibration` (alignment-loop pack) | Different purpose: taste-calibration builds alignment for new work; quiz-me tests comprehension of existing docs |
| `feature-interview` | Interviews for feature definition; quiz-me tests reading comprehension |
| `uat` | Tests feature correctness; quiz-me tests human understanding |

## Open Questions

1. Should the skill support a "quick mode" (e.g., 5 questions only) for time-constrained users?
2. Should failed quizzes be logged anywhere for accountability (e.g., a quiz-results file)?

## Assumptions & Risks

| # | Assumption | Source | Risk if wrong |
|---|-----------|--------|---------------|
| 1 | Alignment HTML pages have parseable section structure | [from codebase] | Questions may be shallow if the document has no clear sections |
| 2 | One question per turn is the right cadence | [from lessons] | Could feel slow for users who want rapid-fire quizzing |
| 3 | Adversarial tone is appropriate for all users | [from request] | May frustrate users who are genuinely trying but struggle |
| 4 | No persistent output needed | [from request] | Users may later want quiz history |
| 5 | Free-text answers via AskUserQuestion "Other" option work well | [from codebase] | AskUserQuestion is designed for choices; free-text may feel awkward |

## Recommended Creation Route

`/create-agentic-skill quiz-me`
