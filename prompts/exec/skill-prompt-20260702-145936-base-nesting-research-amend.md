---
skill: exec
agent: codex
captured_at: 2026-07-02T14:59:36Z
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced a plan to build this as two sequential, separately shippable changes:

1. Move the canonical base skill source from top-level `base/{claude,codex}` to `packs/base/{claude,codex}` while preserving existing base-skill semantics.
2. Add a mirrored base skill named `research-amend` under `packs/base/{claude,codex}/research-amend` for bounded post-canonical research changes.

The plan requires `packs/base/PACK.md`, source-layout updates so base skills still report `scope: "base"` and `pack: null`, `npx skillpacks init` and exact base-skill installs to keep their current `.agents/project.json` semantics, and compatibility for existing managed markers that still point at old `base/...` paths.

The future `research-amend` skill must:

- revise already-canonical research when new evidence, missed competitors, corrected claims, stale sources, or scoped feedback should update existing research without a full rerun;
- support all canonical research docs, with Pattern A-specific handling for `customer-discovery`, `competitive-analysis`, `positioning`, and `journey-map`;
- resolve scope from an explicit artifact/product path or `research/.progress.yaml`;
- inspect canonical docs, Pattern A intermediates, search/evidence logs, and downstream docs only for impact assessment;
- build a delta packet in `_working/` with proposed amendment, evidence/sources, affected canonical sections, affected intermediates, downstream implications, and impact classification;
- classify impact as low, medium, high, or systemic;
- render one review alignment page before canonical writes;
- on approved YAML, archive superseded canonical files/page, apply only listed amendments, update evidence logs when applicable, and add a dated amendment note;
- on not-approved YAML, revise packet/page and stop again;
- avoid implementation tasks and product-code mutation.

The user then pasted the local `$exec` skill contract and asked to implement the plan in a fresh context, treating the plan as the source of intent and carrying the work through implementation and verification.
