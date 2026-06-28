---
skill: exec
agent: codex
captured_at: 2026-06-28T19:33:18-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

**Fix No-Op `skillpacks refresh` Reload Notices**

**Summary**
- Make `npx skillpacks refresh` stop printing the session reload notice when installed skill content is already current and only the managed marker’s absolute `source=` path differs.
- Preserve real reload notices for actual installs, removals, pinned-version changes, content updates, and pack/skill membership changes.

**Key Changes**
- Update `packages/skillpacks/src/cli/lifecycle.mjs` so `syncSkillInstall()` returns separate outcomes:
  - `contentChanged` or equivalent for visible skill-root changes that require reload guidance.
  - `metadataChanged` for marker-only updates such as refreshing `source=` to the current package/cache path.
- In the same-content case where `source_version` and `source_sha` match but `source=` differs:
  - Rewrite only `.agentic-skills-managed` with the current `source=`, `managed_by`, `source_version`, and `source_sha`.
  - Do not delete or recopy the skill directory.
  - Do not log `Installed`, `Updated`, or `Skill installs changed`.
- Update refresh planning logic so `refresh --all --dry-run` does not report an update solely because the absolute source path changed when version and content hash match.
- Keep `doctor` semantics intact: marker source paths should still be refreshed by `refresh`, so future `doctor` runs are less likely to report missing npm cache sources.

**Tests**
- Add a lifecycle test that simulates an existing managed install whose marker points at a different absolute source path but has the same `source_version` and `source_sha`; `skillpacks refresh` should:
  - exit 0,
  - print the normal refresh summary,
  - not print `Skill installs changed`,
  - not log installed/updated skill lines,
  - update the marker `source=` to the current canonical source.
- Add or extend a dry-run/all-projects test so source-path-only drift is not counted as a proposed update.
- Re-run focused verification:
  - `npm --workspace skillpacks test -- lifecycle`
  - `npm --workspace skillpacks run build:check` if available in the repo’s current script set.

**Assumptions**
- The repeated notice is caused by `npx` running the same package content from changing npm cache/extraction paths, while markers store absolute `source=` paths.
- Marker-only maintenance should count as internal metadata cleanup, not as a user-visible skill install change requiring Claude/Codex reload guidance.
- No docs wording change is required unless tests reveal CLI help or README examples claiming source-path changes are visible refresh changes.
