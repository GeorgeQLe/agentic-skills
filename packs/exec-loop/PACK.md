# Exec Loop Pack

Execution loop skills for the plan-run-ship workflow. Provides the core lifecycle for running tasks, shipping completed work, and finalizing execution sessions.

Install this pack when using the plan-run-ship execution workflow.

Install in a project with:

```bash
scripts/pack.sh install exec-loop
```

Then refresh local skill links if needed:

```bash
scripts/pack.sh refresh
```

## Skills

- `run`: Launch and drive the project application to verify changes work in practice.
- `ship`: Commit, push, and ship completed work with verification and cleanup.
- `ship-end`: Finalize a shipping session and transition to the next phase or completion.
