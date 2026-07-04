---
skill: investigate
agent: codex
captured_at: 2026-07-04T10:57:25-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

my finding was “a global copy exists,” while uninstall-global is answering “I found 0 global copies that this current npx skillpacks package considers removable legacy repo-managed
  installs.”

  The global copy is real:

  /home/georgeqle/.codex/skills/codebase-status/SKILL.md
  version: v0.10

  Its marker says it came from your local checkout:

  source=/home/georgeqle/projects/tools/dev/agentic-skills/base/codex/codebase-status
  managed_by=agentic-skills
  source_version=v0.10

  The project-local copy is newer and came from the npm skillpacks package:

  /home/georgeqle/projects/tools/dev/omni-editor/.codex/skills/codebase-status/SKILL.md
  version: v0.11
  source=/home/georgeqle/.npm/_npx/.../node_modules/skillpacks/base/codex/codebase-status

  So the duplicate is not an archived install. It is:

  1. A legacy global Codex skill from your local agentic-skills checkout, v0.10
  2. A project-local Codex skill installed by current npx skillpacks install codebase-status, v0.11

  uninstall-global is narrower than its wording suggests. In the CLI source, it only removes global skill dirs whose marker source is considered owned by the current skillpacks package/checkout. Your old
  global copy points at /home/georgeqle/projects/tools/dev/agentic-skills/..., so the npm-run CLI does not count it as removable.

  The skills list shows both because Codex loads both global skills and project-local skills. The cleanup command showing 0 does not mean the global copy is absent; it means the current uninstall command
  declines to own/remove that particular legacy source. can you investigate and verify this? And determine how we can fix this?
