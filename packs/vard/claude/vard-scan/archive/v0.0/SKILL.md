---
name: vard-scan
description: Scan for viral app opportunities from trends, gaps, and user pain points
type: research
version: v0.0
interview_depth: none
---

# VARD Scan

Invoke as `/vard-scan`.

Rapid opportunity scanner for viral app ideas. Produces a lightweight brief — enough to decide whether to build this week, not a full idea-scope-brief.

## Process

1. **Gather signals:** Scan for opportunities across:
   - Trending topics, memes, cultural moments with app potential
   - App Store / Play Store gaps and underserved niches
   - Twitter/Reddit/HN pain points that a simple tool could solve
   - Existing apps with poor UX that could be reimagined
   - Seasonal or time-sensitive opportunities
2. **Filter for VARD fit:** Each candidate must pass:
   - Buildable in 1-3 days by a solo developer
   - Viral or shareable mechanic (results people screenshot, share, or talk about)
   - No complex backend requirements (serverless-friendly)
   - Clear distribution channel (social, SEO, Product Hunt, etc.)
3. **Produce brief:** For each viable candidate (aim for 2-5), output:
   - One-line concept
   - Why now (timeliness signal)
   - Viral mechanic (what makes people share it)
   - Build estimate (hours)
   - Distribution channel
   - Revenue potential (none / ads / freemium / one-time)
4. **Rank and recommend:** Order candidates by (virality × feasibility) and highlight the top pick.

## Output

A ranked list of 2-5 viral app candidates with lightweight briefs. End with:

```md
**Top pick:** <concept name>
**Next work:** validate top pick feasibility
**Recommended next command:** /vard-align
```

## Constraints

- Do not produce full idea-scope-brief depth — keep each candidate to a few lines.
- Do not begin implementation or scaffolding.
- Do not run paid API calls or external account actions.
- If `$ARGUMENTS` specifies a domain or constraint, narrow the scan accordingly.

## Default Shipping Contract

Follow the shared shipping contract convention.
