---
skill: investigate
agent: codex
captured_at: 2026-06-06T18:24:52-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

can you validate this research? Investigation: Skills That Should Be Scripts

  Current Landscape

  The repo already has 20 scripts in scripts/ doing real work, and many skills are thin LLM wrappers that delegate to them. The pack skill is the clearest example — pack.sh is a 1164-line
  self-contained CLI tool; the skill just calls it and formats the output.

  Three Patterns Where Skills Don't Need LLM Intelligence

  1. Pure delegation — the skill runs a script and reports output. No reasoning added.
  - pack (for explicit commands like install, remove, status, which)
  - init-agentic-skills → delegates to init.sh
  - mono-detect → delegates to mono-detect.sh
  - skill-inventory → delegates to skill-inventory.sh
  - upgrade-alignment-pages → delegates to upgrade-alignment-page.mjs
  - compile-central-alignment → delegates to open-html-page.mjs
  
  2. Verbatim block insertion — the content is baked into the skill, the LLM just does find-and-replace.
  - provision-agentic-config — inserts static CLAUDE.md/AGENTS.md blocks

  3. Algorithmic git/package operations — fully deterministic procedures.
  - release — version bump + changelog from conventional commits
  - deploy — discover config, run it, record it
  - sync — git pull --rebase, check drift, report
  - update-packages — registry queries, age gates, lockfile updates
  - create-local-skill — writes a SKILL.md from a known template
  
  What's Already Script-Ready

  These already work as standalone scripts and could be packaged for downstream repos today:

  ┌───────────────────────────────────────────┬───────┬──────────────────────────────────────┐
  │                  Script                   │ Lines │             What it does             │
  ├───────────────────────────────────────────┼───────┼──────────────────────────────────────┤
  │ pack.sh                                   │ 1164  │ Full pack lifecycle manager          │
  ├───────────────────────────────────────────┼───────┼──────────────────────────────────────┤
  │ approved-plan.sh                          │ 500+  │ Approval/delegation packet lifecycle │
  ├───────────────────────────────────────────┼───────┼──────────────────────────────────────┤
  │ detect-secrets.sh                         │ 66    │ Hook: scan for leaked secrets        │
  ├───────────────────────────────────────────┼───────┼──────────────────────────────────────┤
  │ skill-drift-hook.sh                       │ 100+  │ Hook: warn on stale skill installs   │
  ├───────────────────────────────────────────┼───────┼──────────────────────────────────────┤
  │ save-conversation.sh                      │ 9KB   │ Export JSONL sessions to markdown    │
  ├───────────────────────────────────────────┼───────┼──────────────────────────────────────┤
  │ ship-quality-gate.sh                      │ 52    │ Validate ship manifests              │
  ├───────────────────────────────────────────┼───────┼──────────────────────────────────────┤
  │ skill-archive.sh + skill-archive-audit.sh │ 200+  │ Archive management + integrity audit │
  ├───────────────────────────────────────────┼───────┼──────────────────────────────────────┤
  │ skill-versions.sh + skill-deps.sh         │ 250+  │ Version listing + dependency graph   │
  ├───────────────────────────────────────────┼───────┼──────────────────────────────────────┤
  │ open-html-page.mjs                        │ 500+  │ Cross-platform browser launcher      │
  └───────────────────────────────────────────┴───────┴──────────────────────────────────────┘
  
  What Could Collapse From Skill → Script

  ┌──────────────────────────┬──────────────────────────┬─────────────────────────────────────────┐
  │          Skill           │ Why it doesn't need LLM  │          What LLM adds (minor)          │
  ├──────────────────────────┼──────────────────────────┼─────────────────────────────────────────┤
  │ pack (explicit cmds)     │ pack.sh does everything  │ Argument normalization, reload guidance │
  ├──────────────────────────┼──────────────────────────┼─────────────────────────────────────────┤
  │ init-agentic-skills      │ Runs init.sh, reports    │ First-run preference prompts            │
  ├──────────────────────────┼──────────────────────────┼─────────────────────────────────────────┤
  │ provision-agentic-config │ Static text insertion    │ Block collision detection               │
  ├──────────────────────────┼──────────────────────────┼─────────────────────────────────────────┤
  │ sync                     │ git pull + drift checks  │ Formatted summary                       │
  ├──────────────────────────┼──────────────────────────┼─────────────────────────────────────────┤
  │ release                  │ Version bump + changelog │ Commit classification for changelog     │
  ├──────────────────────────┼──────────────────────────┼─────────────────────────────────────────┤
  │ deploy                   │ Run deploy config        │ Discovery of deploy config location     │
  ├──────────────────────────┼──────────────────────────┼─────────────────────────────────────────┤
  │ create-local-skill       │ Template scaffolding     │ None meaningful                         │
  ├──────────────────────────┼──────────────────────────┼─────────────────────────────────────────┤
  │ upgrade-alignment-pages  │ Runs the node script     │ None                                    │
  └──────────────────────────┴──────────────────────────┴─────────────────────────────────────────┘
  
  The Key Distinction

  LLM-dependent skills (keep as skills): research, interviews, analysis, reviews, debugging, investigation, planning — anything requiring synthesis, judgment, or multi-step reasoning. This is ~130+
  skills and the vast majority.

  Script-shaped skills (candidates to move): operational plumbing that follows a deterministic procedure. The LLM is used only because it can run bash and format output — a shell script with echo
  statements would do the same job.

  The pack Skill Specifically

  pack.sh is already the real tool. The pack skill adds value only in guided setup mode (inspecting the repo, running pack.sh recommend, interviewing the user about which packs to install). For
  every other subcommand (install, remove, status, which, refresh, doctor, prune), the skill is a pass-through. The guided setup could become a separate interactive script or remain as the one
  LLM-powered entry point, with all explicit commands going directly through pack.sh.
  
  What Downstream Installation Would Look Like

  These scripts are already self-contained. Installation in a downstream repo would be: copy the script, make it executable, optionally add it to PATH or a scripts/ directory. The hooks
  (detect-secrets.sh, skill-drift-hook.sh) would additionally need entries in .claude/settings.json. No LLM context window needed. Feel free to push back and ensure that we're addressing the root problem.
