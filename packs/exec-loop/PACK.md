# Exec Loop Pack

Execution loop skills for the plan-exec-ship workflow. Provides the core lifecycle for executing tasks, shipping completed work, and finalizing execution sessions.

Install this pack when using the plan-exec-ship execution workflow.

Install in a project with:

```bash
scripts/pack.sh install exec-loop
```

Then refresh local skill links if needed:

```bash
scripts/pack.sh refresh
```

## Skills

- `exec`: Execute the next planned task or phase.
- `ship`: Commit, push, and ship completed work with verification and cleanup.
- `ship-end`: Finalize a shipping session and transition to the next phase or completion.
