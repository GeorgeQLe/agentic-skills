# Changelog

## v0.0 - 2026-06-05 (subskill expansion)

- Expanded CSS transitions subskill: sequencing/orchestration, will-change lifecycle, forced reflow triggers, exit animation patterns
- Expanded GSAP subskill: timeline composition, overwrite modes, ScrollTrigger patterns, cleanup on unmount
- Expanded Web Animations API subskill: animation lifecycle, fill mode vs commitStyles, composite modes, sequencing/grouping
- Expanded Three.js/R3F subskill: render loop/useFrame, tween integration, disposal/cleanup, frame budget
- Updated GSAP subskill description to match content scope

## v0.0 - 2026-06-05 (refactor)

- Refactored step 5 into framework-specific subskills with detection/routing in parent
- Extracted Motion/Framer guardrails into `frameworks/motion-framer` subskill (AnimatePresence placement, sequencing modes, LayoutGroup, interruption patterns)
- Added stub subskills for CSS transitions, GSAP, Web Animations API, and Three.js/R3F
- Changed invocation type from primary to orchestrator
- Kept baseline guardrails (transform/opacity, reduced-motion, focus/pointer/scroll/z-index) in parent

## v0.0 - 2026-06-04

- Added the initial Codex `$animation-design-planner` skill for interactive UI animation planning, lifecycle ownership, reduced-motion and performance guardrails, and proof-gated implementation handoffs.
