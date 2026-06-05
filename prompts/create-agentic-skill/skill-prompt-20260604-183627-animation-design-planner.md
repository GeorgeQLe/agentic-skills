---
skill: create-agentic-skill
agent: codex
captured_at: 2026-06-04T18:36:27-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

# Visible User Invocation

```text
A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Animation Design Planning Skill

## Summary
Create a new repo-managed skill, tentatively `$animation-design-planner`, mirrored for Codex and Claude. It will make agents plan interactive UI animations before implementation, with a mandatory proof gate so sequencing, lifecycle ownership, reduced-motion behavior, and visual regressions are handled intentionally.

Research basis:
- Material Design motion emphasizes focus, shared elements, staggered choreography, and layout stability: https://m1.material.io/motion/choreography.html
- Motion/Framer docs call out sequencing modes, key stability, `AnimatePresence` placement, and layout pitfalls: https://motion.dev/docs/react-animate-presence
- W3C requires interaction-triggered motion to be suppressible when nonessential: https://www.w3.org/WAI/WCAG21/Techniques/css/C39
- MDN/web.dev recommend planning for frame rate and avoiding layout/paint-heavy animation properties: https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate and https://web.dev/articles/animations-and-performance
- Animation production workflows use storyboard/animatic/timing iteration before polish; Pixar/Khan and Disney describe storyboard/layout/animation phases and animation principles like timing, staging, anticipation, and follow-through: https://www.khanacademy.org/computing/pixar/storytelling and https://www.disneyanimation.com/process/animation/

## Key Changes
- Add `$animation-design-planner` as a planning + proof skill, not a direct implementation skill.
- Default target: interactive web animations using React + Motion/Framer-style lifecycle concepts.
- Secondary future extension: generated/video animation planning, including Remotion-style timelines, after the UI-animation workflow is stable.

The skill output must include:
- **Visible motion contract:** trigger, start state, end state, what the user should see, what must never flash/pop/jump, and accepted interruption behavior.
- **Storyboard/timeline:** key frames or phases, timing, easing, focal point, continuity/shared elements, anticipation/follow-through where relevant.
- **Lifecycle ownership map:** one explicit owner for multi-component sequences, state-machine phases, component mount/unmount responsibilities, stable keys/identity rules, and callback handoff points.
- **Implementation guardrails:** Motion/Framer sequencing mode, `AnimatePresence` placement, `LayoutGroup`/layout-animation considerations, reduced-motion behavior, and transform/opacity-first performance constraints.
- **Proof gate:** slow-motion/manual review steps, Playwright screenshot or video capture where feasible, reduced-motion verification, and an acceptance checklist tied to the visible motion contract.

## Test Plan
- Add benchmark coverage with a card-pack-style prompt that requires the skill to produce a state-machine lifecycle plan instead of local timing tweaks.
- Add a fixture for a new modal/drawer/list transition that checks for storyboard, ownership, reduced-motion, performance, and visual proof sections.
- Validate mirrored skill metadata and frontmatter, including `version: v0.0`.
- Run the repository’s skill validation scripts and regenerate showcase/catalog data if metadata changes.

## Assumptions
- The first implementation creates a new standalone skill rather than modifying `$debug` or `$investigate`.
- The skill should be web/Motion-first, then later expanded or paired with a Remotion/generated-video planning skill.
- The skill should prevent the exact card-pack failure mode: agents must not start tweaking animation constants until they have named the visible sequence, lifecycle owner, state phases, and proof method.
```
