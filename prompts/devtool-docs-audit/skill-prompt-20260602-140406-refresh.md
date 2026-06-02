---
skill: devtool-docs-audit
agent: codex
captured_at: 2026-06-02T14:04:06-04:00
source: exec-selected-task
prompt_scope: visible-user-invocation
---

# Visible User Invocation

```text
$exec
```

# Selected Task Context

```markdown
- [ ] `$pack install devtool` then `$devtool-docs-audit` — run the overdue recurring developer-docs audit refresh.
  - Classification: automated, with alignment-page review output.
  - Pack status: `scripts/pack.sh which devtool-docs-audit` reports `devtool-docs-audit` is provided by uninstalled pack `devtool`; install the pack or skill first, then start a fresh Codex session if `$devtool-docs-audit` is still not visible.
  - Files: expected output `research/devtool-docs-audit.md`, `alignment/devtool-docs-audit-{topic}.html`, prompt history under `prompts/devtool-docs-audit/`, task/history notes, and any doc fixes only after the audit recommends and the user approves them.
  - Implementation plan:
    1. Install the providing pack with `$pack install devtool` or `scripts/pack.sh install devtool-docs-audit`; verify `$devtool-docs-audit` is available in a fresh Codex session if needed.
    2. Run `$devtool-docs-audit` against this developer-facing repo, covering quickstart clarity, examples, API reference, troubleshooting, migration paths, and missing proof artifacts.
    3. Produce `research/devtool-docs-audit.md` and an alignment page before any follow-up doc changes.
    4. Validate artifacts with content checks and `git diff --check`; ship intended prompt/task/research/alignment artifacts on `master`.
```
