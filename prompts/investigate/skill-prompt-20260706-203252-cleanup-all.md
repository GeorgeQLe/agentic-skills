---
skill: investigate
agent: codex
captured_at: 2026-07-06 20:32:52 America/New_York
source: user-invocation
prompt_scope: visible-user-invocation
---

I thought we added cleanup --all so that we could handle cleanup for the current directory and all subdirectories or as a replacement for uninstall-global then it should be able to work across the device? georgele@Georges-MacBook-Air projects % npx skillpacks cleanup --dry-run
Dry run. Would remove 0 repo-managed base skill install(s) from /Users/georgele.
Base skills install project-local via `npx skillpacks init`.
Dry run. No Build-In-Public project config found under /Users/georgele/projects.
Dry run. No deprecated alias skill installs found under /Users/georgele/projects.
georgele@Georges-MacBook-Air projects % npx skillpacks cleanup --all  --dry-run
skillpacks: cleanup: unsupported flag '--all'
