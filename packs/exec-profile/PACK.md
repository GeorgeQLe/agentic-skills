# Exec Profile Pack

Execution profile patching skills for modifying and managing execution profiles used by agent workflows.

Install this pack when patching or updating execution profiles for agent-driven task execution.

Install in a project with:

```bash
scripts/pack.sh install exec-profile
```

Then refresh local skill links if needed:

```bash
scripts/pack.sh refresh
```

## Skills

- `patch-exec-profile`: Patch an existing execution profile with updated parameters, constraints, or workflow steps.
