---
name: css-transitions
description: CSS transitions and keyframe animation guardrails — transition/animation properties, will-change, class-based sequencing
type: planning
version: v0.0
invocation: sub-skill
parent: animation-design-planner
---

# CSS Transitions Implementation Guardrails

Invoke as `$animation-design-planner frameworks/css-transitions`.

Framework-specific guardrails for CSS `transition`, `animation`, `@keyframes`, and `will-change` based animation patterns. Invoked by `$animation-design-planner` when CSS-based animation is detected.

TODO: expand with sequencing patterns (class toggle timing, `transitionend`/`animationend` event handling, stagger via custom properties or `animation-delay`, `will-change` lifecycle, forced reflow triggers, and proof expectations).
