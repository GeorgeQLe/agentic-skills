---
name: gsap
description: GSAP-specific animation guardrails — timeline sequencing, ScrollTrigger, stagger, overwrite modes
type: planning
version: v0.0
invocation: sub-skill
parent: animation-design-planner
---

# GSAP Implementation Guardrails

Framework-specific guardrails for GSAP (GreenSock Animation Platform) timeline, ScrollTrigger, stagger, and overwrite mode patterns. Invoked by `/animation-design-planner` when GSAP is detected.

TODO: expand with timeline composition, ScrollTrigger pinning/scrub, stagger patterns, overwrite mode selection (`auto`, `true`, `false`), cleanup on unmount (`.kill()`, `ScrollTrigger.kill()`), and proof expectations.
