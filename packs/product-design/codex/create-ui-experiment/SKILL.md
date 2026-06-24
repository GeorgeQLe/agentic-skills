---
name: create-ui-experiment
description: Own clickable UI experiment routes or project-native lightweight prototypes for one approved UI branch, using fake, fixture, local, or in-memory data to test the branch's first-value journey before prototype build-plan synthesis, UAT, or production planning.
type: execution
version: v0.1
required_conventions: [alignment-page, design-tree-loop]
argument-hint: "[approved-ui-experiment]"
context_intake: scoped
visual_tier: prototype
---

# Create UI Experiment

Invoke as `$create-ui-experiment`.

Own clickable UI experiment routes or project-native lightweight prototypes for one approved UI branch. Use this skill after `$ui-interview [specific-ux-variation]` approves a UI experiment branch and the branch needs a clickable first-value route before the broader `$prototype` build ledger or production planning exists.

This skill is an experiment owner, not a default buildout path. It tests whether one approved branch's first-value journey works when the user can click through it with fake, fixture, local, or in-memory data. It must not introduce durable database/storage, auth, payments, analytics, deployment, admin tooling, multi-tenancy, production observability, or other production infrastructure.

Follow `DESIGN-TREE-LOOP.md` for design-tree routing, state storage, branch decisions, approval boundaries, and task classification. UI experiment branch state belongs in `design/**/flow-tree-*.yaml`, not `tasks/todo.md`.

## Gate

Before building, verify the approved branch is explicit:

- Read `design/**/flow-tree-*.yaml` and resolve the named `ui_experiments[]` branch. If `$ARGUMENTS` is missing, choose the first approved UI experiment branch that has no clickable experiment evidence in `experiment_path` and `review_evidence`, honoring any recorded branch-order override.
- Read the branch packet from `design/ui-[topic].md`, `design/ui-requirements-[topic].md`, or product-path-scoped equivalents.
- Read the parent `design/ux-variations-[topic].md`, `design/user-flow-[topic].md`, and any relevant `design/design-inspirations-{topic}.md` when present.
- Stop if no UI branch has an explicit approve decision. Route back to `$ui-interview [specific-ux-variation]`.
- Stop if the requested work needs production infrastructure. Record the deferred infrastructure and route to prototype evidence first.

## Process

1. **Resolve scope.** Identify the product path, topic, parent user-flow branch, UX variation branch, and approved UI experiment branch. Preserve branch IDs from the flow-tree manifest.
2. **Define the first-value journey.** Name the first-value moment, the primary task path, the entry route, the exit/success state, and the evidence needed before moving deeper.
3. **Choose the experiment home.** Prefer a project-native lightweight route when the app already has a safe local experiment surface. Otherwise create a disposable route under `experiments/{topic}/{ui-experiment-id}/`. Keep the experiment easy to remove.
4. **Build the clickable path.** Implement only the minimum interaction needed for a user to experience the first-value journey. Use fake, fixture, local, or in-memory data. Include realistic states only when they clarify the primary path.
5. **Progressive reveal.** Introduce first value and the primary task path before dense secondary controls. Hide, defer, or stub secondary controls until the route proves the core journey.
6. **Review evidence.** Produce a concise review note naming what the user should click, what decision the experiment tests, what worked, what remains unknown, and which deferred infrastructure stays out of scope.
7. **Update branch state.** Add `experiment_path` and `review_evidence` to the relevant `ui_experiments[]` branch in the flow-tree manifest. Keep `artifacts[]` for canonical design and review files. Do not create or update the prototype build plan unless the current run has explicit review evidence approving the experiment.
8. **Build the alignment page.** Render the route, first-value journey, fake-data boundary, deferred infrastructure, and review gate in `alignment/create-ui-experiment-{topic}.html`.

## Output

The skill may create or update:

```text
experiments/{topic}/{ui-experiment-id}/
design/**/flow-tree-*.yaml
alignment/create-ui-experiment-{topic}.html
```

When using a project-native route instead of `experiments/`, record the exact route path in `experiment_path` and the concise note or repo-relative review artifact in `review_evidence` in the flow-tree manifest and in the alignment page.

## Next Work

After explicit review evidence exists, route based on what the evidence supports:

- `$user-flow-map --prototype-build-plan [topic]` when approved UI experiments are ready to become prototype build-plan items.
- `$prototype` when a prototype build plan already exists and names the approved UI experiment item.
- `$uat --variant-evaluation` when the clickable experiment itself is being used as the evaluated variant artifact.

Do not route to production planning, roadmap work, or durable infrastructure until experiment review evidence explicitly promotes the branch.

## Constraints

- Use fake, fixture, local, or in-memory data only.
- Build one approved UI experiment branch per run.
- Keep the route disposable and bounded to the first-value journey.
- Use progressive reveal; do not expose dense secondary controls before the primary task path works.
- Do not build production infrastructure, external account integrations, deployment automation, or durable storage.
- Do not skip the review evidence gate before handing off to `$prototype`, `$uat --variant-evaluation`, or `$user-flow-map --prototype-build-plan`.
- When recommending a skill from another pack, verify the pack is installed via `.agents/project.json` `enabled_packs`. If not installed, recommend `npx skillpacks install <pack-name>` from the project shell before the target skill.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/create-ui-experiment-{topic}.html`.

The page must show the first-value journey, primary task path, clickable route path, fake-data boundary, deferred infrastructure, review evidence, and the exact downstream handoff gate.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
