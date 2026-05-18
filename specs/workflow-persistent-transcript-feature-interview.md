# Workflow Persistent Transcript Feature Interview

## Artifact Path

`specs/workflow-persistent-transcript-feature-interview.md`

## Feature Evidence Brief And Assumptions Manifest

### Evidence Sources

- `.agents/project.json`
- `README.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/ideas.md`
- `specs/skills-showcase-website.md`
- `specs/ui-skills-showcase-website.md`
- `specs/ui-final-skills-showcase.md`
- `specs/workflow-hybrid-replay-feature-interview.md`
- `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`
- `apps/skills-showcase/src/showcase/tui/shared/useWorkflowPlayer.ts`
- `apps/skills-showcase/src/showcase/tui/shared/useTypewriter.ts`
- Recent git log

### User Idea

Instead of having the cards blink and change while moving through each skill in a workflow, the workflow surface should remain constant within a single terminal session. It should scroll down as a full conversation. Each skill invocation is a new turn, the steps stay on top, and the UI should fake the text-scroll feel of AI chat apps so the transition from step to step feels artificially slower.

### Claim Validation

- Confirmed: `[from codebase]` `/workflows` already has a hybrid replay pilot in `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`.
- Confirmed: `[from codebase]` The current UI remounts the active step card with `key={`${activeKey}-${activeStep}`}`, which supports the user's "blink and change" description.
- Confirmed: `[from codebase]` The current player auto-advances on a fixed timer in `useWorkflowPlayer`, defaulting to `3200ms`, without waiting for text reveal completion.
- Confirmed: `[from codebase]` `useTypewriter` exists but is not used by `TuiWorkflow`.
- Confirmed: `[from roadmap]` Phase 40 shipped the `/workflows` hybrid replay pilot, so this is a refinement of an existing shipped surface rather than a new product surface.
- Partially supported: `[from spec]` `specs/ui-skills-showcase-website.md` already requires a hybrid replay panel with chat-style replay and embedded terminal/proof blocks, but it does not yet specify a persistent transcript session model.

### Technical Gotchas

- `[from codebase]` The current implementation renders one active step. A persistent transcript likely needs to render all revealed turns from the selected workflow.
- `[from codebase]` Auto-play should coordinate with fake typing and proof-block reveal timing instead of advancing purely on a fixed interval.
- `[from codebase]` Benchmark receipts are per step. Keeping all prior turns expanded means receipt blocks need compact, stable layout so the transcript stays readable.
- `[inferred]` Changing workflows should reset the transcript to the new workflow's session; moving between steps inside one workflow should not create a new visual container.
- `[inferred]` Reduced-motion users should not receive fake typing or animated scrolling. They should see the complete turn content and still be able to jump between steps.

### Journey Placement

This belongs in the `/workflows` Workflow Lab as the next refinement of the Phase 40 hybrid replay pilot. It helps visitors understand one workflow as one continuous AI coding session before they browse the dense catalog or inspect benchmark receipts.

### Human Intent

The user wants the workflow animation to feel like watching a real ChatGPT/Claude-style session move through skill invocations, not a card carousel. The screen should show continuity, cumulative work, and active-step focus.

### Agent Interpretation

The implementation should turn the active-step replay into a persistent workflow-session transcript:

- workflow selection starts a new transcript session;
- each skill invocation appears as a new turn;
- prior turns remain fully expanded;
- the step controls stay at the top;
- the viewport follows the active turn;
- clicking an earlier step jumps to that existing turn without deleting later turns;
- user commands appear immediately;
- agent responses fake-type in ChatGPT/Claude style;
- terminal, artifact, and proof blocks reveal after the agent response.

### Existing-System Fit

Likely affected paths:

- `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`
- `apps/skills-showcase/src/showcase/tui/workflow.css`
- `apps/skills-showcase/src/showcase/tui/shared/useWorkflowPlayer.ts`
- `apps/skills-showcase/src/showcase/tui/shared/useTypewriter.ts`
- `specs/ui-skills-showcase-website.md`

No backend, database, generated benchmark schema, or route expansion is required for the first slice.

### Planning Destination

Update the existing Skills Showcase UI planning artifacts. This does not need a new product spec because the surface and product direction already exist.

### Priority Hypothesis

Next `/workflows` UI refinement after the current benchmark coverage lane. The change directly fixes a visible Phase 40 interaction issue and has a contained frontend-only blast radius.

### Implementation Shape

- Keep `/workflows` as the pilot surface.
- Keep workflow selectors and step controls visible above the transcript.
- Render the selected workflow as one persistent conversation/terminal session.
- Reveal the active turn in the order: user command, fake-typed agent response, terminal/proof/artifact content.
- Keep completed turns fully expanded.
- Auto-scroll the transcript to the active turn as playback advances.
- Treat step buttons as jump controls into existing transcript turns, not destructive rewind controls.
- On reduced motion, show complete turn content without fake typing or animated scroll.

### Prototype-First Gate

Not applicable as a new product prototype. This is a frontend-only refinement of an already accepted `/workflows` pilot. No durable storage, auth, payments, analytics, deployment, admin tooling, multi-tenancy, or production observability should be introduced.

## Interview Notes

### Evidence Checkpoint

Question: Should the target model be one persistent transcript per selected workflow, where changing workflows resets the session, but moving between steps appends or reveals turns in the same session?

Answer: The user agreed.

### Reveal Behavior

Question restated after correction: When the demo moves to the next skill step, should it feel more like ChatGPT/Claude, where the agent response visibly types in for a moment before the terminal/proof block appears?

Answer: It should feel more like ChatGPT/Claude.

Lesson captured: `tasks/lessons.md` now records that interview questions should use visible product language before implementation terms.

### Completed Turns

Question: Should old turns stay fully expanded as the session scrolls, or should completed turns compress slightly so the current turn is emphasized while the full conversation remains visible?

Answer: Completed turns should stay fully expanded, but the screen should follow the active turn of the workflow conversation.

### Step Navigation

Question: When someone clicks an earlier step at the top, should it jump back to that existing turn in the transcript without deleting later turns, or rewind the conversation to that step?

Answer: Jump back.

## Planning Destination And Priority Checkpoint

### Decision

Update the existing Skills Showcase UI planning artifacts, not create a new product spec.

### Target Artifacts

- `specs/workflow-persistent-transcript-feature-interview.md`
- `specs/ui-skills-showcase-website.md`

### Confirmed Scope

- `/workflows` remains the pilot surface.
- One selected workflow behaves like one continuous terminal/chat session.
- Changing workflows starts a new session.
- Moving through steps appends or reveals new skill-invocation turns in the same conversation.
- User command appears immediately.
- Agent response fake-types in ChatGPT/Claude style.
- Terminal, proof, and artifact blocks reveal after the agent response.
- Completed turns stay fully expanded.
- The viewport follows the active turn.
- Clicking an earlier step jumps to that existing turn without deleting later turns.
- Reduced-motion users see the full turn without fake typing.

### Explicitly Deferred

- Applying the pattern to homepage, catalog, or inspect routes.
- New backend or data model.
- New benchmark evidence model.
- Production analytics or behavior tracking.

### Priority

Next `/workflows` UI refinement after the current benchmark coverage lane. This fixes a visible interaction issue in a contained frontend surface.

### Confirmation

The user confirmed: "Ok I agree".

## Documentation Changes

`specs/ui-skills-showcase-website.md` was updated to specify the persistent workflow transcript behavior inside the existing Workflow Lab section.

## Next Route

The feature is ready to sequence through roadmap/task planning before implementation.

**Next work:** Sequence the `/workflows` persistent transcript refinement after the current benchmark coverage lane.
**Recommended next command:** `$roadmap`
