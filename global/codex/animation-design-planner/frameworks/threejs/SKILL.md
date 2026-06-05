---
name: threejs
description: Three.js/R3F animation guardrails — useFrame loop, tween libraries, shader-based animation, render-loop timing
type: planning
version: v0.0
invocation: sub-skill
parent: animation-design-planner
---

# Three.js / R3F Implementation Guardrails

Invoke as `$animation-design-planner frameworks/threejs`.

Framework-specific guardrails for Three.js and React Three Fiber (`@react-three/fiber`) animation patterns including the render loop, `useFrame`, tween libraries, and shader-based animation. Invoked by `$animation-design-planner` when Three.js or R3F is detected.

TODO: expand with `useFrame` delta-time patterns, tween library integration (gsap, tween.js, maath), shader uniform animation, disposal/cleanup on unmount, frame-budget awareness, and proof expectations.
