---
name: web-animations-api
description: Web Animations API guardrails — Element.animate(), Animation object lifecycle, commitStyles, polyfill considerations
type: planning
version: v0.0
invocation: sub-skill
parent: animation-design-planner
---

# Web Animations API Implementation Guardrails

Invoke as `$animation-design-planner frameworks/web-animations-api`.

Framework-specific guardrails for the native Web Animations API (`Element.animate()`, `Animation` object, `commitStyles`, `KeyframeEffect`). Invoked by `$animation-design-planner` when Web Animations API usage is detected.

TODO: expand with `Animation` object lifecycle (play/pause/cancel/finish), `commitStyles()` for persisting final state, fill mode pitfalls (`forwards` vs `commitStyles`), composite modes, polyfill considerations for older browsers, and proof expectations.
