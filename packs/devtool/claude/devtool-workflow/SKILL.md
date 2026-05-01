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

## Next-Skill Routing

Use `/research-roadmap` as the queue manager when repository state is not obvious. When the devtool chain can be resolved directly, recommend the first missing or stale item in this order:

`/devtool-user-map` -> `/devtool-integration-map` -> `/devtool-dx-journey` -> `/devtool-adoption` -> `/devtool-positioning` -> `/devtool-monetization` -> `/devtool-docs-audit` -> `/research-roadmap`
