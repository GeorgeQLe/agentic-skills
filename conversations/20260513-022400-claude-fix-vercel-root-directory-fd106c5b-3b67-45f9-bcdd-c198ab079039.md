# fix-vercel-root-directory

| Field | Value |
|-------|-------|
| **Date** | 2026-05-13 02:24:00 UTC |
| **Agent** | claude |
| **Model** | unknown |
| **Branch** | master |
| **Session** | `fd106c5b-3b67-45f9-bcdd-c198ab079039` |
| **Entrypoint** | cli |
| **Version** | 2.1.138 |

---

## User _02:24:00_

Implement the following plan:

# Fix Vercel 404 on gskillpacks.com

## Context

The G Skillpacks site returns 404 on both `gskillpacks.com` and the `.vercel.app` preview URL. The build logs show a successful Next.js 16.2.6 build with all 13 pages. DNS is correct, domain is assigned.

## Root Cause

The Vercel project's **Root Directory** is set to `docs/skills-showcase` (the old static site location). That directory was gutted — only `assets/` remains for dual-write. The app now lives at `apps/skills-showcase`.

The build succeeds because pnpm's workspace resolution finds and builds the correct package, but Vercel's output routing looks at the configured root directory, finds nothing to serve, and returns 404.

## Fix

**Manual step (Vercel dashboard):** Change Root Directory from `docs/skills-showcase` to `apps/skills-showcase`.

1. Go to **Vercel → agentic-skills project → Settings → General → Root Directory**
2. Change to `apps/skills-showcase`
3. Click **Redeploy** (from latest commit, with "Use existing Build Cache" unchecked)

No code changes needed.

## Verification

1. Wait for redeployment to complete
2. `curl -s -o /dev/null -w "%{http_code}" https://gskillpacks.com/` — should return 200
3. Visit `gskillpacks.com` in browser — teal accent, G Skillpacks branding, favicon visible


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/4a4de027-6d0d-4c7d-8d84-7aa9dda54c6c.jsonl
