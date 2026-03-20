---
name: roadmap
description: Build or update the project roadmap by interviewing across all specs, codebase state, and project history
argument-hint: [--existing] [path-to-spec]
---

# Roadmap Builder

Build or update `tasks/roadmap.md` by synthesizing all project documentation, interviewing the user on priorities and sequencing, and producing a phased roadmap. This is the bridge between specification (what to build) and execution planning (how to build it step by step).

## Modes

### New Project (default)
When `tasks/roadmap.md` does not exist or is empty. Reads specs and interviews to create the roadmap from scratch.

### Existing Project (`--existing`, or when `tasks/roadmap.md` already has content)
Reviews the codebase, documented history, and current roadmap. Updates the roadmap with new work, completed phases, or changed priorities.

## Process

### 1. Gather Context

Read all available project documentation:

- **`spec.md`** (or path from `$ARGUMENTS`) — may contain multiple spec sections from `/plan-interview-ideas`
- **`tasks/roadmap.md`** — existing roadmap if any
- **`tasks/todo.md`** — current work in progress
- **`tasks/history.md`** — what's been accomplished
- **`tasks/ideas.md`** — brainstorm output not yet specced
- **`CLAUDE.md`** — project conventions
- **`README.md`** or equivalent — project overview

For existing projects, also:
- Review key source files to understand what's already built
- Check git log for recent activity and trajectory
- Identify gaps between spec and implementation (what's done vs. what remains)

### 2. Synthesize and Present

Present the user with a structured summary:

**For new projects:**
- List each spec section / feature area identified
- Note dependencies between them
- Highlight any conflicts or overlaps between specs
- Flag specs that seem incomplete or ambiguous

**For existing projects:**
- What's been built (verified against codebase, not just docs)
- What's in progress (current phase/step from todo.md)
- What's remaining on the current roadmap
- New specs or ideas not yet on the roadmap
- Whether the current roadmap needs restructuring

### 3. Interview on Strategy

Use the AskUserQuestion tool to align on roadmap decisions. Ask one to three focused questions per turn. Cover:

- **Priority**: Which features/specs are most important? What's MVP vs. later?
- **Grouping**: Should any specs be combined into a single phase? Split apart?
- **Sequencing**: What depends on what? What should ship first for user value or risk reduction?
- **Scope**: Should anything be deferred, dropped, or marked as stretch?
- **Phase sizing**: Preference for many small phases vs. fewer larger ones?
- **Existing work**: (existing projects) Does completed work change priorities? Should anything be reworked?

When options exist, present pros/cons with a recommendation — same style as `/plan-interview`. Do not manufacture artificial choices.

Continue until the user confirms the phase structure is complete.

### 4. Write the Roadmap

Write `tasks/roadmap.md` with the agreed phase structure. Use this format:

```markdown
# Roadmap: [Project Name]

> Generated from: [source files]
> Date: [current date]
> Total Phases: [N]

## Summary
[2-3 sentence overview of the implementation strategy and sequencing rationale]

## Phase Overview
| Phase | Title | Source Spec(s) | Key Deliverable | Est. Complexity |
|-------|-------|----------------|-----------------|-----------------|
| 1     | ...   | ...            | ...             | S / M / L       |
| 2     | ...   | ...            | ...             | S / M / L       |

---

## Phase 1: [Title]

**Goal**: [What this phase achieves and why it comes first]

**Scope**:
- [Feature/capability 1 from spec section X]
- [Feature/capability 2 from spec section Y]

**Acceptance Criteria:**
- [ ] [Specific, verifiable criterion 1]
- [ ] [Specific, verifiable criterion 2]
- [ ] [Specific, verifiable criterion 3]

**On Completion** (fill in when phase is done):
- Deviations from plan: [none, or describe]
- Tech debt / follow-ups: [none, or list]
- Ready for next phase: yes/no

---

[Repeat for each phase]

---

## Deferred / Future Work
- [Items explicitly descoped during interview, with reasoning]

## Cross-Phase Concerns
### Integration Tests
- [Tests that span multiple phases, and when to write them]
### Non-Functional Requirements
- [Performance, security, accessibility — and which phase addresses each]
```

**Important**: The roadmap defines phases, goals, scope, and acceptance criteria — but NOT implementation steps, TDD structure, or file-level detail. That's `/plan-phases`' job.

### 5. Populate Phase 1 Detail

After writing the roadmap, invoke `/plan-phases` scoped to Phase 1 only. This fills in the TDD steps and writes `tasks/todo.md`.

If `tasks/todo.md` already exists with in-progress work, ask the user before overwriting.

### 6. Update History (existing projects only)

If updating an existing roadmap, append a brief entry to `tasks/history.md` noting the roadmap was revised and why.

## Constraints

- **Always interview.** Do not produce a roadmap without user input on priorities and sequencing. The whole point is interactive alignment.
- **Respect existing specs.** Do not modify `spec.md` — the roadmap references specs, it doesn't rewrite them.
- **Phase headers must use `## Phase N: [Title]` format** for compatibility with `/run`, `/ship`, and phase transition logic.
- **Acceptance criteria must be specific and checkable** — not vague statements like "works correctly."
- **Do not include TDD steps or file-level implementation detail** in the roadmap. That belongs in `/plan-phases`.
- **`tasks/roadmap.md` is the source of truth** for the full phased plan. `tasks/todo.md` holds only the current phase.
- **Do not put roadmap content in CLAUDE.md** — CLAUDE.md is for project conventions only.
- **Keep the interview focused.** This is about sequencing and priority, not re-litigating spec decisions. If a spec question comes up, note it and suggest running `/plan-interview` again for that topic.
