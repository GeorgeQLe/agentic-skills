---
name: devtool-workflow
description: Use only for developer-facing tools, libraries, SDKs, CLIs, APIs, and infrastructure products
type: planning
version: 1.0.0
---

# Devtool Workflow

Use this skill when the project is primarily developer-facing.

## Workflow

1. Read `.agents/project.json` and confirm `project_type` is `devtool`.
2. If the devtool pack is not enabled, run `scripts/pack.sh install devtool`.
3. Route research through developer workflow, integration, DX, adoption, positioning, monetization, and docs checks.

## Output

Recommend the next single devtool-pack skill to run and explain the missing artifact or decision that makes it next. In the final response, include `Recommended next skill: <command>` using the `## Next-Skill Routing` rules below.

## Alignment Page

When this skill writes or updates durable planning, research, spec, task, prototype, report, or document deliverables, also build a custom HTML alignment page at `alignment/devtool-workflow-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/devtool-workflow-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Next-Skill Routing

Use `/research-roadmap` as the queue manager when repository state is not obvious. When the devtool chain can be resolved directly, recommend the first missing or stale item in this order:

`/devtool-user-map` -> `/devtool-integration-map` -> `/devtool-dx-journey` -> `/devtool-adoption` -> `/devtool-positioning` -> `/devtool-monetization` -> `/devtool-docs-audit` -> `/research-roadmap`
