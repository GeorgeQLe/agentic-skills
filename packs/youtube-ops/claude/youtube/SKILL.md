---
name: youtube
description: Intent-based router and play composer for youtube-ops skills — classifies what the user needs and recommends a single skill or queues a multi-step play for /exec
type: router
version: v0.0
argument-hint: "[natural language] | --health <channel> | --concept \"<idea>\" [--channel <slug>] | --launch <video-url> | --intel <video-urls...> | --status"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json` `enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# YouTube — Intent Router & Play Composer

Invoke as `/youtube`.

Entry point for the `youtube-ops` pack. Classifies the user's intent and either recommends a single skill or composes a multi-step "play" written to `tasks/todo.md` for `/exec` to drive.

This skill does not produce research artifacts or alignment pages. It is a routing and planning layer over the 12 standalone youtube-ops skills (plus `youtube-format-research` from the `remotion` pack when installed).

## Modes

### Mode A — Intent Router (default)

When invoked with natural language and no flags, classify the user's intent against the table below. Recommend 1–3 skills inline with a one-sentence rationale per skill. Do not write files. If the intent maps cleanly to a play (Modes B–E), suggest the corresponding flag instead.

| Intent | Signal Words | Routes To |
|--------|-------------|-----------|
| Channel health | "audit", "how is my channel", channel URL | `/youtube-channel-audit` or suggest `--health` play |
| Video diagnosis | "why did this video", single video URL | `/youtube-video-audit` |
| Video understanding | "watch this", "summarize", external URL | `/youtube-vid-research` |
| Concept validation | "should I make", "video idea" | `/youtube-concept-research` or suggest `--concept` play |
| Competitive analysis | "why did their video", "competitor" | `/youtube-competitive-research` |
| Packaging | "title", "thumbnail", "CTR" | `/youtube-title-thumbnail-audit` |
| Description/SEO | "description", "tags", "metadata" | `/youtube-description-optimizer` |
| Search opportunity | "search", "keywords", "ranking" | `/youtube-search-positioning` |
| Cadence | "cadence", "how often", "schedule" | `/youtube-cadence-diagnosis` |
| Peer comparison | "compare", "benchmark", "peers" | `/youtube-peer-benchmark` |
| Portfolio | "portfolio", "content mix" | `/youtube-portfolio` |
| General audit | "full audit", "everything" | `/youtube-audit` |
| Format/production | "format", "editing", "pacing" | `/youtube-format-research` (remotion pack) |

When routing to `youtube-format-research`, verify the `remotion` pack is enabled in `.agents/project.json` `enabled_packs`. If not, note that `/pack install remotion` is required first.

### Mode B — Channel Health Play (`--health <channel>`)

Queue a 5-step channel health audit play to `tasks/todo.md`:

1. `/youtube-channel-audit <channel> --count 20`
2. `/youtube-portfolio`
3. `/youtube-peer-benchmark <channel>`
4. `/youtube-cadence-diagnosis <channel>`
5. `/youtube-title-thumbnail-audit <channel>`

### Mode C — Pre-Production Play (`--concept "<idea>" [--channel <slug>]`)

Queue a concept validation play to `tasks/todo.md`:

1. `/youtube-concept-research "<idea>" [--channel <slug>]`
2. `/youtube-competitive-research` (using comparables surfaced in step 1)
3. `/youtube-search-positioning`
4. `/youtube-format-research` (only if `remotion` pack is enabled — mark optional if missing)

### Mode D — Video Launch Play (`--launch <video-url>`)

Queue a launch preparation play to `tasks/todo.md`:

1. `/youtube-video-audit <video-url>`
2. `/youtube-title-thumbnail-audit`
3. `/youtube-description-optimizer <video-url>`

### Mode E — Competitive Intel Play (`--intel <video-urls...>`)

Queue a competitive analysis play to `tasks/todo.md`:

1. `/youtube-vid-research <video-urls>`
2. `/youtube-competitive-research <video-urls>`
3. `/youtube-format-research` (only if `remotion` pack is enabled — mark optional if missing)

### Mode F — Status (`--status`)

Read-only scan of `research/youtube/` artifacts. Report:

- Which research files exist and their last-modified dates
- Staleness (files older than 30 days)
- Coverage gaps (which skills have never produced output)
- Any active working packets in `research/youtube/_working/`

Do not write files in this mode.

## Play Approval Gate

Before writing a play to `tasks/todo.md`:

1. **Check for existing work.** Read `tasks/todo.md`. If it contains unfinished items (unchecked checkboxes), warn the user and ask whether to append, replace, or abort. Do not silently overwrite existing plans.
2. **Present the play.** Show the numbered steps with skill names and arguments. Note any optional steps and their prerequisites (e.g., remotion pack).
3. **Write on approval.** Write the play to `tasks/todo.md` as a checklist. Include a header line identifying the play type and timestamp. Each step is a `- [ ]` item with the full skill invocation command.

After writing the play, recommend `/exec` to begin execution.

## Play Format for `tasks/todo.md`

```markdown
## YouTube Play: {Play Type} — {timestamp}

- [ ] Step 1: `/skill-name <args>`
- [ ] Step 2: `/skill-name <args>`
...
```

Follow the shared shipping contract convention.
