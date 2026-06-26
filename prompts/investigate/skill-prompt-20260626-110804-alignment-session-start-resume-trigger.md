---
skill: investigate
agent: claude
captured_at: 2026-06-26T11:08:04-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

investigate the issue needed to be fix in this repo

---

Context: a session-triage report rode in as trailing context of a `/clear` command at
session start. The triage diagnosed (in a different repo, calcllm) that an agent
dismissed a `ready-for-agent-review` approval payload as residual context and never
confirmed the page. Its durable fix #2 targets THIS repo (agentic-skills): the shared
alignment-page convention does not establish that a session-start `ready-for-agent-review`
payload — including when bundled with `/clear` under the harness local-command caveat —
is a resume-and-confirm trigger that overrides the generic "ignore local-command output"
caveat. The user asked to investigate and fix that in-repo gap; per-skill remediation
(lifecycle-metrics, calcllm files) is out of scope here.
