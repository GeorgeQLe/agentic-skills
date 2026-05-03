---
name: ux-variation
description: Interview and plan multiple UX and UI variations for a product, page, or flow, including onboarding, typical workflows, sharing, collaboration, return use, and interface alternatives users can compare before locking a direction
type: planning
version: 1.0.0
argument-hint: "[optional: app, page, flow, feature, or existing UI spec]"
---

# UX Variation

Invoke as `$ux-variation`.

Use this skill when the user wants to explore multiple UX/UI directions before committing to a final experience. This skill interrogates the full user journey: onboarding, first success, typical workflows, sharing and collaboration, return use, notifications, handoffs, failure recovery, and the interface patterns that support those moments. It then creates variation plans for flows, layouts, navigation models, interaction patterns, component choices, content density, visual tone, and behavior so the user can compare, test, and lock one direction.

Use `$ui-interview` first when the interface has not yet been specified page by page. Use this skill directly when a UI spec, current implementation, screenshot, prototype, or clear feature scope already exists.

## Workflow

1. **Resolve context**
   - Read `.agents/project.json` if it exists.
   - Read `README.md`, `AGENTS.md`, `CLAUDE.md`, relevant `docs/`, `specs/`, `research/`, task files, screenshots, route files, and component implementations when present.
   - Prefer existing `specs/ui-*.md`, product specs, journey maps, ICP research, and user feedback as source evidence.
   - If no credible scope exists, run or recommend `$ui-interview` before developing variants.

2. **Define the decision surface**
   - Identify what the user is deciding: whole app experience, onboarding, activation, typical workflow, sharing flow, collaboration model, purchase flow, editor, dashboard, settings, mobile experience, page layout, or another bounded surface.
   - Identify which dimensions are allowed to vary:
     - First-run onboarding and activation
     - Core workflow sequencing
     - Sharing, invitations, permissions, and collaboration
     - Return-use loops and re-entry points
     - Notifications, reminders, and status surfaces
     - Handoffs between users, roles, devices, or channels
     - Recovery from errors, empty states, and stalled progress
     - Information architecture
     - Navigation
     - Page layout
     - Task flow order
     - Component model
     - Data density
     - Visual hierarchy
     - Motion and transition behavior
     - Copy tone
     - Mobile behavior
   - Identify fixed constraints: brand, stack, design system, must-keep components, accessibility, launch scope, performance, and business requirements.

3. **Surface assumptions before probing**
   - Present a UX Variation Assumptions Manifest before deep questioning.
   - Tag assumptions with `[from spec]`, `[from codebase]`, `[from research]`, `[from artifact]`, or `[inferred]`.
   - Cover:
     - Target users and usage context
     - Primary job or workflow
     - First-run moment, activation event, and "aha" threshold
     - Typical repeat-use workflow
     - Sharing, collaboration, and permission assumptions
     - Return triggers, notifications, and re-engagement assumptions
     - Cross-device, cross-role, or external handoff assumptions
     - Existing pain points or uncertainty
     - Decisions that are locked versus open
     - Evaluation criteria
     - Required variants and desired breadth
     - Prototype fidelity and implementation budget
     - Success metrics and selection method
   - Ask the user to confirm, correct, or flag assumptions before proceeding.

4. **Interview for variation goals**
   - Ask 1 to 3 focused questions per turn.
   - Establish:
     - Who will judge the variants
     - What they must be able to accomplish
     - How a new user arrives, signs up, understands the product, and reaches first value
     - What the normal repeat workflow looks like after onboarding
     - What users create, save, share, export, invite others into, or hand off
     - What roles or permission levels exist, and how collaboration should feel
     - What notifications, reminders, status updates, or activity feeds users expect
     - How users resume work after hours, days, or weeks away
     - What happens when a workflow is abandoned, blocked, invalid, offline, or partially complete
     - Which current interface parts are working
     - Which current interface parts feel wrong, uncertain, slow, confusing, too dense, too sparse, or too generic
     - How different the variants should be from one another
     - What would make a variant unacceptable
     - What evidence will decide the winner
   - When the user is unsure, recommend a practical default and explain why.

5. **Create distinct variation concepts**
   - Produce 3 to 5 variations unless the user requests a different count.
   - Each variation must be meaningfully different, not just a color or spacing change.
   - At this stage, keep each concept lightweight: name, thesis, archetype, best-fit user/context, core workflow difference, major tradeoff, and rough complexity. Do not fully specify screens, controls, or implementation details yet.
   - Useful archetypes include:
     - Task-first workflow
     - Data-dense operator console
     - Guided step-by-step flow
     - Onboarding-first activation path
     - Collaboration-first workspace
     - Sharing-first artifact flow
     - Notification/status-driven workflow
     - Role-based handoff workflow
     - Visual canvas or board
     - Command/search-first interface
     - Mobile-first progressive disclosure
     - Familiar SaaS dashboard
     - Editorial or showcase layout
   - Only choose archetypes that fit the product and user context.

6. **Concept selection checkpoint**
   - Before fully specifying any variant, ask the user to adjust the concept set.
   - Use bounded wording such as: "How should I adjust these UX variants before writing the final spec?"
   - Present clear options:
     - Keep all concepts
     - Remove one
     - Merge concepts
     - Make one concept bolder or more extreme
     - Add another concept
   - Ask the user to name the affected concept and briefly describe the change when they choose anything other than keeping all concepts.
   - Recommend a practical default when evidence supports it; do not imply that variants have already been built or committed.
   - Revise the concept set based on the answer before moving on.

7. **Specify each approved variation enough to build**
   - For each variation, define:
     - Name and design thesis
     - Target user fit
     - Page and flow changes
     - Onboarding and activation model
     - Typical workflow sequence
     - Sharing, collaboration, and permissions model
     - Return-use and notification model
     - Failure recovery and abandoned-workflow behavior
     - Navigation model
     - Screen-by-screen layout
     - Key components and controls
     - Button and link behavior
     - Spatial density, sizing, and hierarchy
     - Responsive behavior
     - Visual tone
     - Strengths, risks, and failure modes
     - Implementation complexity
     - What to prototype first
     - What user signal would make this the winner

8. **Plan experimentation**
   - Recommend the cheapest useful validation method:
     - Static mockups for visual direction
     - Clickable prototype for navigation and flow
     - Feature-flagged implementation for real usage
     - A/B test only when traffic and metrics are credible
     - Human UAT when target-user acceptance is the question
   - Define comparison criteria before selecting a winner.
   - Include a lock-in checklist so the chosen direction becomes a decision record, not a vague preference.

9. **Coverage checkpoint**
   - Before concluding, summarize the variants, the decision criteria, and the proposed experiment plan.
   - Ask whether any decision criteria, risks, validation steps, or implementation constraints are missing before writing deliverables.

## Deliverables

- Write the variation plan to `specs/ux-variations-[topic].md`.
- Write the interview log to `ux-variations-[topic]-interview.md`.

The variation plan must include:

- Scope and source evidence
- UX Variation Assumptions Manifest with confirmations and corrections
- Fixed constraints and open decision dimensions
- Onboarding, activation, and first-success model
- Typical user workflow and repeat-use loop
- Sharing, collaboration, permissions, and handoff model
- Notification, status, and return-use model
- Failure, abandonment, and recovery behavior
- Evaluation criteria and selection method
- Variation matrix
- Detailed variation specifications
- Prototype or implementation plan for each variation
- Experiment plan and evidence capture
- Lock-in checklist for confirming the chosen interface
- Risks, non-goals, and follow-up work

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

After writing files, recommend `$run` or `$roadmap` if the next step is building variants, `$uat` if humans should evaluate acceptance, or `$ui-interview` if the winning direction still lacks implementation-ready interface detail.

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
