---
name: destination-doc
description: Serialize grill-me alignment into a lightweight destination document
type: planning
version: 1.0.0
argument-hint: "[optional topic override]"
---

# Destination Doc

Serialize operator-agent alignment into a short, disposable destination document.

## Process

1. **Read conversation context** for a grill-me summary. If running standalone, gather context from `$ARGUMENTS` and project files.
2. **Determine topic slug** (kebab-case) from the subject matter.
3. **Archive existing file** if `research/destination-[topic].md` already exists (Archive-First policy).
4. **Write `research/destination-[topic].md`** with the structure below.

## Document Structure

```markdown
> Checkpointed alignment state — not a contract. Verify against code before treating any claim as current.

## Intent
[What and why — 2-4 sentences]

## Success Criteria
- [Bulleted, testable criteria]

## Taste Notes
[What would be wrong even if tests pass — qualitative signals]

## Out of Scope
- [Explicit exclusions]

## Open Questions
- [Unresolved items, if any]
```

Keep to 1-2 pages. Cut anything that belongs in a full spec.

## Output

`research/destination-[topic].md`

## Archive-First Replacement Policy

- Before replacing an existing `research/destination-*.md`, copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed; do not edit the archived copy.
- After the archive snapshot exists, write the updated document to the original canonical path.

## Shipping

Commit and push the destination doc.

## Next-Skill Routing

After writing: "Run `/vertical-slice-splitter research/destination-[topic].md` to split into issue cards."
