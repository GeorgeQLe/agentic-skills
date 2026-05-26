# Agent Work Admin Pack

Planning and roadmap management skills for agent-orchestrated work. Provides structured roadmap creation, phase-level planning, and spec drift auditing to keep agent-driven projects on track.

Install this pack when managing roadmaps, planning phases, or auditing spec drift in agent-orchestrated workflows.

Install in a project with:

```bash
scripts/pack.sh install agent-work-admin
```

Then refresh local skill links if needed:

```bash
scripts/pack.sh refresh
```

## Skills

- `roadmap`: Create and manage a structured project roadmap with phased milestones.
- `plan-phase`: Break a roadmap phase into actionable tasks with dependencies and sequencing.
- `spec-drift`: Audit implementation against specifications to detect drift and flag divergences.
