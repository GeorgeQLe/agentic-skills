---
name: ord-scan
description: Scan for OSS tool opportunities from npm gaps, GitHub trends, and developer pain points
type: research
version: v0.0
interview_depth: none
---

# ORD Scan

Invoke as `/ord-scan`.

Rapid opportunity scanner for open-source developer tools. Identifies gaps in the npm ecosystem, trending developer pain points, and CLI/library opportunities.

## Process

1. **Gather signals:** Scan for opportunities across:
   - npm packages with high download counts but poor DX, stale maintenance, or missing features
   - GitHub trending repos and discussions revealing unmet developer needs
   - Stack Overflow / Reddit / HN threads where developers complain about tooling gaps
   - Build tool, testing, CLI, and workflow automation gaps
   - Wrapper/adapter opportunities (bridging two popular tools that don't talk to each other)
2. **Filter for ORD fit:** Each candidate must pass:
   - Buildable and publishable in 1-3 days
   - Clear value proposition explainable in one sentence
   - npm namespace likely available (or scoped package viable)
   - No heavy runtime dependencies or complex native bindings
   - Solves a real, recurring developer pain point (not a toy)
3. **Produce brief:** For each viable candidate (aim for 2-5), output:
   - One-line concept
   - Problem it solves (the pain point)
   - Why it doesn't exist yet (or why existing solutions fall short)
   - Build estimate (hours)
   - Distribution: npm, GitHub, dev community channels
   - Monetization potential (none / sponsorware / freemium CLI / premium features)
4. **Rank and recommend:** Order candidates by (developer pain × feasibility × ecosystem gap size) and highlight the top pick.

## Output

A ranked list of 2-5 OSS tool candidates with lightweight briefs. End with:

```md
**Top pick:** <concept name>
**Next work:** validate top pick feasibility and namespace
**Recommended next command:** /ord-align
```

## Constraints

- Do not produce full idea-scope-brief depth — keep each candidate to a few lines.
- Do not begin implementation or scaffolding.
- Do not run paid API calls or external account actions.
- If `$ARGUMENTS` specifies a domain or constraint (e.g., "CLI tools" or "testing"), narrow the scan.

## Default Shipping Contract

Follow the shared shipping contract convention.
