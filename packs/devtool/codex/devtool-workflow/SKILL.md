---
name: devtool-workflow
description: Use only for developer-facing tools, libraries, SDKs, CLIs, APIs, and infrastructure products
type: planning
version: v0.1
invocation: orchestrator
interview_depth: none
visual_tier: visual
---

# Devtool Workflow

Invoke as `$devtool-workflow`.

Use this skill when the project is primarily developer-facing.

## Process

1. Read `.agents/project.json` and confirm `project_type` is `devtool`.
2. If the devtool pack is not enabled, run `scripts/pack.sh install devtool`.
3. Route research through developer workflow, integration, DX, adoption, positioning, monetization, and docs checks.

## Output

Recommend the next single devtool-pack skill to run and explain the missing artifact or decision that makes it next. In the final response, include `Recommended next skill: <command>` using the `## Next-Skill Routing` rules below.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/devtool-workflow-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

