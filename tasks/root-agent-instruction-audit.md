# Root Agent Instruction Audit

Date: 2026-06-14

Scope: provisioned content in `CLAUDE.md` and `AGENTS.md` from `provision-agentic-config`, plus the adjacent Claude-only local conventions that affect the same instruction surface.

## Executive Findings

1. `AGENTS.md` is entirely provisioned content plus the source note (`AGENTS.md:1-122`). `CLAUDE.md` has the same provisioned block and source note (`CLAUDE.md:1-122`), then local shared skill conventions (`CLAUDE.md:124-173`).
2. The checked-in root blocks do not match the current `base/claude/provision-agentic-config/SKILL.md` wording. Most notably, current source has Claude/Codex-specific "Always Ship Mutations" wording, but root `CLAUDE.md:92` and `AGENTS.md:92` use a generic variant.
3. The provisioned block is doing four jobs at once: agent operating mode, repo governance, skill-authoring policy, and environment-specific WSL help. Those should not all live in one mandatory root block.
4. Several lines are not absolutely needed as root instructions because they are motivational, redundant, or already enforced by tool/developer instructions. The highest-value reduction is to keep hard constraints and remove process slogans.
5. The current repo is a monorepo (`pnpm-workspace.yaml` exists), but neither root file contains the conditional `### 7. Monorepo Parallel-Work Safety` section described by the source skill. That is either intentional drift or a provisioning bug.

## Generated Block Audit

| Lines | File(s) | Current Content | Decision | Rationale |
| --- | --- | --- | --- | --- |
| `1` | both | `<!-- provision-agentic-config v0.13 -->` | Keep | Required by `sync` drift checks and source replacement logic. |
| `2` | both | `## Workflow Orchestration` | Keep | Gives the provisioned block a stable boundary. |
| `4` | both | `### 1. Plan Mode Default` | Keep | Useful section label, but numbering is brittle if sections are removed. Prefer unnumbered headings in a cleanup. |
| `5` | both | Enter plan mode for non-trivial task | Keep, tighten | The rule is needed; `ANY` is noisy. |
| `6` | both | Stop and re-plan when sideways | Keep, reword | Useful failure-mode guard; remove shouty wording. |
| `7` | both | Verification vs routine no-op validation | Keep | Important nuance that prevents unnecessary re-planning for known verification commands. |
| `8` | both | Write detailed specs upfront | Keep only for implementation | Overbroad for small fixes and audits; can merge with line 5. |
| `9` | both | Codex-specific `update_plan`/`request_user_input` rule | Keep in `AGENTS.md`; remove from `CLAUDE.md` | It is agent-specific and does not belong in Claude's root block. |
| `11` | both | `### 2. Subagent Strategy` | Keep | The section is needed because Claude and Codex differ materially here. |
| `12-14` | `CLAUDE.md` | Liberal subagent use / throw more compute | Trim aggressively | These are preference slogans, not necessary policy. Keep one concrete delegation rule if Claude needs it. |
| `12-15` | `AGENTS.md` | Codex subagent permission boundaries | Keep | These are necessary because Codex subagent availability is tool-dependent. |
| `15` | `CLAUDE.md`; `14` `AGENTS.md` | One task per subagent | Keep | Concrete and useful. |
| `16` | both | `agent-team` branch/consolidation exception | Keep | Prevents parallel write collisions and preserves direct-to-primary default. |
| `18-22` | both | Self-improvement loop | Reconsider root placement | Durable lessons are useful after real corrections, but four bullets are too heavy. Compress to one rule or move to skill docs. |
| `24-27` | both | Revision Hygiene | Keep | Directly addresses repeated user-correction failure modes. All three lines are purposeful. |
| `29-33` | both | Verification before done | Keep, compress | Keep "prove it works" and "run tests/logs"; remove subjective staff-engineer self-question unless it has proven behavioral value. |
| `35-39` | both | Demand Elegance | Fold into Core Principles | The useful part is "avoid hacky fixes"; the rest duplicates simplicity/minimal-impact guidance. |
| `41-45` | both | Autonomous Bug Fixing | Keep, compress | Keep "fix bug reports autonomously from evidence"; remove redundant "zero context switching" and repeated imperative. |
| `47-51` | `CLAUDE.md` | Missing Skill Fallback | Keep, merge with `53-56` | Necessary for pack-based skill discovery, but split across two Claude sections. |
| `53-56` | `CLAUDE.md` | Project Pack Command Resolution | Keep, merge into Missing Skill Fallback | This is useful but overly specific to one benchmark skill; generalize and avoid hardcoding one example if possible. |
| `47-50` | `AGENTS.md` | Missing Skill Fallback and project pack command resolution combined | Keep, split | The content is needed, but line 50 is too dense and should be broken into separate bullets for found/uninstalled/found/absent. |
| `58-65` `CLAUDE.md`; `52-59` `AGENTS.md` | Prompt History | Keep only if intentional; otherwise move to skill-level | This rule creates tracked files on every skill invocation. It is valuable for auditability but high-friction as a global root rule. |
| `67-74` `CLAUDE.md`; `61-68` `AGENTS.md` | Skill Versioning | Keep for this repo, not generic | This repository authors skills, so the rule matters here. A generic provisioned block should not impose it on non-skill repos. |
| `70-74` | `AGENTS.md` only | Alignment Page Convention | Move out of generic provisioned block | This is repo-specific skill authoring policy. It belongs in shared skill conventions, not universal workflow orchestration. |
| `76-85` | both | Task Management and research-loop exception | Keep, simplify | The distinction between implementation tasks and Pattern A research loops is important. The six-step checklist is more verbose than necessary. |
| `87-93` | both | Core Principles | Keep, compress | Direct-to-primary, shipping, and no-GitHub-Actions are concrete. Simplicity/no-laziness/minimal-impact overlap and can be one principle. |
| `92` | both | Always Ship Mutations | Keep, agent-specific | Current source now has Claude/Codex-specific shipping semantics. Root files should be updated to match source or source should be simplified. |
| `95-120` | both | Windows/WSL File Opening | Remove from provisioned block; replace with short reference | These 26 lines are environment support docs, not universal workflow policy. Keep in `docs/troubleshooting.md` and `env-setup`; root can say "for WSL opening, follow docs". |
| `122` | both | Provisioned artifact note | Keep | Useful audit trail and replacement boundary. |

## Claude-Only Adjacent Content

These lines are not inside the provisioned block but they affect `CLAUDE.md` instruction load.

| Lines | Content | Decision | Rationale |
| --- | --- | --- | --- |
| `124-130` | Alignment Page Template/direct-edit audit | Keep, but avoid duplicate with AGENTS generated section | Useful repo convention. If AGENTS also needs it, mirror as local shared convention instead of provisioning it generically. |
| `132-136` | Visual rendering tiers, interview depth, glossary gate | Keep in repo-local skill conventions | Specific to this skills repository; not provisioned workflow policy. |
| `138-140` | Excalidraw Convention | Keep only if Claude commonly edits diagrams | Otherwise move to `docs/excalidraw-convention.md` reference only. |
| `142-149` | Shipping Contract Template | Keep | Concrete handoff and shipping rules, but overlaps with provisioned "Always Ship Mutations"; consolidate to one source of truth. |
| `151-153` | Scope confirmation for destructive work | Keep | High-value safety rule. |
| `155-169` | Glossary Convention | Keep in repo-local research conventions | Too detailed for global root unless research skills are a primary workflow. |
| `171-173` | Cross-Pack Routing | Keep | Concrete repo behavior that prevents broken skill recommendations. |

## Recommended Reduction Plan

1. Split the provisioned block into two layers:
   - Minimal universal root workflow: plan/verify, autonomy, shipping, direct-to-primary, skill fallback, prompt-history pointer.
   - Repo-local skill-authoring conventions: skill versioning, alignment pages, glossary, Excalidraw, cross-pack routing.
2. Remove or compress motivational lines:
   - `CLAUDE.md:12-14`
   - `CLAUDE.md:20-22` and `AGENTS.md:20-22`
   - `CLAUDE.md:32` and `AGENTS.md:32`
   - `CLAUDE.md:35-39` and `AGENTS.md:35-39`
   - `CLAUDE.md:44-45` and `AGENTS.md:44-45`
3. Move Windows/WSL details out of the generated block. Replace `CLAUDE.md:95-120` and `AGENTS.md:95-120` with a one-line pointer to `docs/troubleshooting.md` or the existing `env-setup` skill.
4. Make agent-specific divergence explicit:
   - `CLAUDE.md` should not include Codex-only plan-tool instructions unless framed as a cross-agent note.
   - `AGENTS.md` should keep Codex subagent permission boundaries.
   - Shipping semantics should match the current source contracts or be intentionally unified.
5. Resolve the monorepo safety mismatch. Either insert the source-defined monorepo safety section because `pnpm-workspace.yaml` exists, or delete the conditional insertion requirement from `provision-agentic-config` if direct-to-primary plus `agent-team` branch safety is considered sufficient.

## Minimal Target Shape

If the goal is "every line absolutely needed", the provisioned root block should be closer to:

1. Version marker and heading.
2. Planning and re-planning rule.
3. Verification rule.
4. Agent-specific subagent rule.
5. User-correction/revision hygiene rule.
6. Bug/autonomy rule.
7. Missing skill fallback rule.
8. Task tracking vs research-loop distinction.
9. Direct-to-primary shipping rule.
10. No GitHub Actions rule.
11. Source note.

Everything else should move to repo-local conventions or linked docs.
