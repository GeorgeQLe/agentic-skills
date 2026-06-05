# Changelog

## v0.0 - 2026-06-05 (refactor)

- Refactored step 5 into framework-specific subskills with detection/routing in parent
- Extracted Motion/Framer guardrails into `frameworks/motion-framer` subskill (AnimatePresence placement, sequencing modes, LayoutGroup, interruption patterns)
- Added stub subskills for CSS transitions, GSAP, Web Animations API, and Three.js/R3F
- Changed invocation type from primary to orchestrator
- Kept baseline guardrails (transform/opacity, reduced-motion, focus/pointer/scroll/z-index) in parent

## v0.0 - 2026-06-04

- Added the initial Claude `/animation-design-planner` skill for interactive UI animation planning, lifecycle ownership, reduced-motion and performance guardrails, and proof-gated implementation handoffs.
