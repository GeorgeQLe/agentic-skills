---
name: ux-variation
description: Interview and plan multiple UX and UI variations for a product, page, or flow, including onboarding, typical workflows, sharing, collaboration, return use, and interface alternatives users can compare before locking a direction
type: planning
version: 1.0.0
argument-hint: "[optional: app, page, flow, feature, or existing UI spec]"
---

# UX Variation

Invoke as `/ux-variation`.

Use this skill when the user wants to explore multiple UX/UI directions before committing to a final experience. This skill interrogates the full user journey: onboarding, first success, typical workflows, sharing and collaboration, return use, notifications, handoffs, failure recovery, and the interface patterns that support those moments. It then creates variation plans for flows, layouts, navigation models, interaction patterns, component choices, content density, visual tone, and behavior so the user can compare, test, and lock one direction.

Use `/ui-interview` first when the interface has not yet been specified page by page. Use this skill directly when a UI spec, current implementation, screenshot, prototype, or clear feature scope already exists.

## Workflow

1. **Resolve context**
   - Read `.agents/project.json` if it exists.
   - Read `README.md`, `AGENTS.md`, `CLAUDE.md`, relevant `docs/`, `specs/`, `research/`, task files, screenshots, route files, and component implementations when present.
   - Prefer existing `specs/ui-*.md`, product specs, journey maps, ICP research, and user feedback as source evidence.
   - If no credible scope exists, run or recommend `/ui-interview` before developing variants.

2. **Define the decision surface**
   - Identify what the user is deciding: whole app experience, onboarding, activation, typical workflow, sharing flow, collaboration model, purchase flow, editor, dashboard, settings, mobile experience, page layout, or another bounded surface.
   - Identify which dimensions may vary: first-run onboarding, activation, core workflow sequencing, sharing, invitations, permissions, collaboration, return-use loops, notifications, reminders, status surfaces, user or device handoffs, failure recovery, information architecture, navigation, page layout, task flow order, component model, data density, visual hierarchy, motion, copy tone, and mobile behavior.
   - Identify fixed constraints: brand, stack, design system, must-keep components, accessibility, launch scope, performance, and business requirements.

3. **Surface assumptions before probing**
   - Present a UX Variation Assumptions Manifest before deep questioning.
   - Tag assumptions with `[from spec]`, `[from codebase]`, `[from research]`, `[from artifact]`, or `[inferred]`.
   - Cover target users, usage context, first-run moment, activation event, "aha" threshold, typical repeat-use workflow, sharing and collaboration assumptions, permissions, return triggers, notifications, re-engagement assumptions, handoffs, pain points, locked versus open decisions, evaluation criteria, required variant breadth, prototype fidelity, implementation budget, success metrics, and selection method.
   - Use AskUserQuestion to ask the user to confirm, correct, or flag assumptions before proceeding.

4. **Interview for variation goals**
   - Ask 1 to 3 focused questions per turn using AskUserQuestion.
   - Establish who will judge the variants, what they must accomplish, how a new user arrives and reaches first value, what the normal repeat workflow looks like, what users create/save/share/export/invite others into, what roles or permission levels exist, what notifications or status updates users expect, how users resume work after time away, what happens when a workflow is abandoned or blocked, which current interface parts work, which parts feel wrong or uncertain, how different the variants should be, what would make a variant unacceptable, and what evidence will decide the winner.
   - When the user is unsure, recommend a practical default and explain why.

5. **Create distinct variation concepts**
   - Produce 3 to 5 variations unless the user requests a different count.
   - Each variation must be meaningfully different, not just a color or spacing change.
   - Useful archetypes include task-first workflow, data-dense operator console, guided step-by-step flow, onboarding-first activation path, collaboration-first workspace, sharing-first artifact flow, notification/status-driven workflow, role-based handoff workflow, visual canvas or board, command/search-first interface, mobile-first progressive disclosure, familiar SaaS dashboard, and editorial or showcase layout.
   - Only choose archetypes that fit the product and user context.

6. **Specify each variation enough to build**
   - For each variation, define name and thesis, target user fit, onboarding and activation model, typical workflow sequence, sharing and collaboration model, permissions model, return-use and notification model, failure recovery behavior, page and flow changes, navigation model, screen-by-screen layout, key components and controls, button and link behavior, spatial density, sizing, hierarchy, responsive behavior, visual tone, strengths, risks, failure modes, implementation complexity, prototype scope, and winning signal.

7. **Plan experimentation**
   - Recommend the cheapest useful validation method: static mockups, clickable prototype, feature-flagged implementation, A/B test only when traffic and metrics are credible, or human UAT when acceptance is the question.
   - Define comparison criteria before selecting a winner.
   - Include a lock-in checklist so the chosen direction becomes a decision record, not a vague preference.

8. **Coverage checkpoint**
   - Before concluding, use AskUserQuestion to summarize the variants, decision criteria, and experiment plan.
   - Ask whether any variant should be removed, merged, made more extreme, or added before writing deliverables.

## Deliverables

- Write the variation plan to `specs/ux-variations-[topic].md`.
- Write the interview log to `ux-variations-[topic]-interview.md`.

The variation plan must include source evidence, the confirmed assumptions manifest, fixed constraints, open decision dimensions, onboarding and activation model, typical workflow and repeat-use loop, sharing and collaboration model, permissions and handoffs, notification and return-use model, failure recovery behavior, evaluation criteria, selection method, variation matrix, detailed variation specifications, prototype or implementation plan, experiment plan, evidence capture, lock-in checklist, risks, non-goals, and follow-up work.

Use this variation format:

```markdown
### Variation N: [Name]

- Thesis: [why this direction should work]
- Best for: [user/context]
- Page and flow model: [routes, steps, navigation]
- Onboarding and activation: [first-run path, setup, first success]
- Typical workflow: [repeat-use sequence and completion point]
- Sharing and collaboration: [invite, permission, handoff, export, or sharing behavior]
- Return-use and notifications: [resume path, reminders, status, activity]
- Recovery behavior: [blocked, invalid, abandoned, partial, or offline states]
- Layout and spatial model: [regions, density, sizing, responsive behavior]
- Components and controls: [core UI inventory]
- Button and link behavior: [primary actions, secondary actions, destinations]
- Visual tone: [hierarchy, typography, color, media, motion]
- Prototype scope: [smallest useful build]
- Strengths:
- Risks:
- Complexity: Low | Medium | High
- Winning signal: [evidence that selects this variation]
```

After writing files, recommend `/run` or `/roadmap` if the next step is building variants, `/uat` if humans should evaluate acceptance, or `/ui-interview` if the winning direction still lacks implementation-ready interface detail.

## Constraints

- Do not present superficial variants that differ only by color palette, typography, or decorative treatment.
- Do not choose a winner for the user unless the evidence clearly supports it and the user asked for a recommendation.
- Do not defer all decisions to testing. State a recommended variant or experiment when evidence is sufficient.
- Do not ignore implementation cost. A compelling variation still needs a prototype path and selection criteria.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
