# Skill Dev Pack

Skills for interviewing for and scaffolding agentic skills. Covers gathering requirements and creating a project-local skill.

Install this pack when interviewing for a new skill or scaffolding a project-local skill.

Install in a project with:

```bash
scripts/pack.sh install skill-dev
```

Then refresh local skill links if needed:

```bash
scripts/pack.sh refresh
```

## Skills

- `skill-interview`: Conduct a structured interview to gather requirements for a new skill.
- `create-local-skill`: Create a project-local skill scoped to the current repository.

> Archived: `targeted-skill-builder` and `create-agentic-skill` were removed. Verified fixes to shared skills, convention pages, or workflow routing/process are implemented in the managing `agentic-skills` repo via the `session-triage` managing-layer handoff payload (`docs/session-triage-handoff-contract.md`), not a builder skill.
