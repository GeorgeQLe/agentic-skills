# Code Review Pack

Code review and audit skills for thorough code quality analysis. Includes slim audits for quick checks, regression detection, dead code identification, and expert-panel-style reviews.

Install this pack when doing code audits, reviewing for dead code, regression checks, or expert panel reviews.

Install in a project with:

```bash
scripts/pack.sh install code-review
```

Then refresh local skill links if needed:

```bash
scripts/pack.sh refresh
```

## Skills

- `slim-audit`: Run a lightweight code audit focused on high-signal issues.
- `regression-check`: Check recent changes for potential regressions against existing behavior.
- `dead-code`: Identify and report dead or unreachable code in the codebase.
- `expert-review`: Conduct a multi-perspective expert panel review of code changes.
