# Workflow Hybrid Replay Feature Interview

## Feature Evidence Brief

### Evidence Sources

- `.agents/project.json`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ideas.md`
- `specs/skills-showcase-website.md`
- `specs/ui-skills-showcase-website.md`
- `specs/ui-final-skills-showcase.md`
- `docs/benchmark-results-matrix.md`
- `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`
- `apps/skills-showcase/src/showcase/tui/workflow-data.ts`
- `apps/skills-showcase/src/showcase/tui/workflow.css`
- `apps/skills-showcase/src/showcase/types.ts`
- `scripts/generate-skills-showcase-data.mjs`
- Git commit `09b9712 feat: connect workflow demos to benchmark evidence`

### User Idea

The existing benchmark test run history and results in the Skills Showcase are a good start, but the workflow showcase should use that evidence as the primary way to show step by step what is happening. The user imagines step circles driving a terminal or chat-app style interface that behaves as if the user had typed the skills in the given scenario.

### Claim Validation

- Confirmed: `[from codebase]` Benchmark evidence is already incorporated into workflow demos. `TuiWorkflow.tsx` renders benchmark summary strips, step badges, and expandable benchmark prompt/output demos.
- Confirmed: `[from codebase]` The current benchmark evidence is secondary. The active workflow step card remains the main object, while benchmark execution lives inside a collapsed `View benchmark execution` details panel.
- Confirmed: `[from spec]` The original Skills Showcase UI spec already names terminal playback, state machines, step timelines, and handoff diagrams as core animation primitives.
- Partially supported: `[from codebase]` Step circles already exist as dot controls, but they are navigation indicators rather than the execution narrative.
- Unknown at intake: `[inferred]` Whether the desired replay should feel like terminal output, chat messages, or a hybrid transcript.

### Technical Gotchas

- `[from codebase]` `WorkflowStep` is currently tuple-based: `[label, command, description, skill?]`. A compelling replay likely needs structured step events instead of adding more tuple fields.
- `[from codebase]` `WORKFLOW_SKILL_MAP` joins workflow steps to benchmark evidence by skill name. It does not create scenario-specific replay timelines.
- `[from codebase]` Not every workflow step has persisted benchmark evidence. The UI needs distinct states for curated scenario transcript, benchmarked proof receipt, and no benchmark receipt.
- `[from roadmap]` The `/workflows` mobile surface recently needed layout fixes for chips, benchmark strips, demo panels, controls, and notebook stacking. A primary replay panel needs mobile-first constraints.
- `[inferred]` The benchmark excerpt should be sanitized and summarized enough to be readable while still linking back to persisted proof paths when available.

### Journey Placement

This belongs in the `/workflows` Workflow Lab. The goal is to help visitors understand how a skill-driven session unfolds before they move into the generated catalog or benchmark matrix.

### Human Intent

The user wants benchmark and run history to become the primary storytelling surface: a step-by-step replay where each circle advances a user/agent interaction, terminal validation, artifact result, and benchmark proof when available.

### Agent Interpretation

The implementation should replace or demote the current step-card-plus-hidden-details model with a primary hybrid replay panel. Each active step should show:

- user command or prompt;
- assistant/agent response;
- terminal, validation, or benchmark output block when relevant;
- artifact or result summary;
- benchmark receipt metadata when available.

## Interview Notes

### Question: Replay Style

Options presented:

- Terminal replay: commands, logs, tests, artifacts, benchmark receipt.
- Chat replay: user prompt, assistant response, tool/progress updates, final handoff.
- Hybrid replay: chat-style user/agent messages with terminal blocks embedded for validation and benchmark proof.

Recommendation presented: hybrid replay, because it best matches how people experience Claude/Codex while still showing grounded terminal/test evidence.

User answer: hybrid replay.

### Question: First Implementation Surface

Recommendation presented: target only `/workflows` first, keeping the implementation focused while the homepage remains a lighter entry point.

User correction: yes, target `/workflows` first, but not because the rest should remain unchanged. The user wants to test the visuals in one place before making it the new standard.

Confirmed interpretation: `/workflows` is a visual validation slice and pilot surface. Homepage, catalog, or other surfaces may inherit the pattern later after the design proves itself.

## Planning Destination And Priority Checkpoint

### Decision

Update the existing Skills Showcase UI planning artifacts rather than creating a new product spec.

### Target Artifacts

- New interview log: `specs/workflow-hybrid-replay-feature-interview.md`.
- Scoped UI spec update: `specs/ui-skills-showcase-website.md`, in the `/workflows` Workflow Lab section.

### Confirmed Scope

- Build the hybrid replay model first on `/workflows` only.
- Treat benchmark evidence as primary replay proof, not a hidden detail.
- Use step circles to drive chat-style user/agent messages with embedded terminal, test, artifact, and benchmark-proof blocks.
- Preserve `/benchmarks` as the full evidence matrix.
- Defer homepage and other surfaces until the `/workflows` visual pattern is validated.

### Priority

Next UI iteration candidate. All current roadmap phases are complete, and current task state points at feature triage. This improves the public proof surface without requiring backend scope.

### Planning Destination Confirmation

User confirmed: "Looks good."

## Implementation Shape

The next implementation should treat each workflow step as a structured replay state. A likely data model is:

- step label and command;
- user message or prompt;
- assistant response summary;
- terminal output block;
- artifact/result block;
- benchmark receipt block with pass rate, quality score, agent, run index, and report path when available.

The UI should keep the step circles as the main progress control, but the replay panel should be the primary content. The existing lab notebook can remain as contextual metadata if it does not compete with the replay.

## Risks And Unknowns

- The replay could become too verbose if raw benchmark prompts/outputs are shown without summary.
- The pattern could look credible but not grounded if benchmark receipts are over-curated. Links to persisted reports and run artifacts should remain available.
- Some workflow steps lack benchmark evidence. Those steps should still have curated scenario transcript content and a clear absence of benchmark receipt rather than empty proof UI.
- Mobile layout needs explicit constraints so terminal blocks and chat bubbles do not create horizontal overflow.

## Next Route

The feature is ready for sequencing after the spec update. Because it is a UI behavior/design change with a defined pilot surface, route through roadmap/task planning before implementation.

**Next work:** Sequence the `/workflows` hybrid replay pilot as the next UI implementation slice.
**Recommended next command:** `$roadmap`
