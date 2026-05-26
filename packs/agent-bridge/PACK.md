# Agent Bridge Pack

Agent bridging skills for delegating work to other agents. Provides structured delegation with scope definition, context packaging, and result integration.

Install this pack when delegating work to other agents or coordinating multi-agent workflows.

Install in a project with:

```bash
scripts/pack.sh install agent-bridge
```

Then refresh local skill links if needed:

```bash
scripts/pack.sh refresh
```

## Skills

- `delegate`: Delegate a scoped unit of work to another agent with clear inputs, constraints, and expected outputs.
