# Repo Maintenance Pack

Repository maintenance and bootstrapping skills for setting up new repositories with proper structure, conventions, and local environment configuration.

Install this pack when bootstrapping a new repository, standardizing repository structure, or scaffolding local env files.

Install in a project with:

```bash
scripts/pack.sh install repo-maintenance
```

Then refresh local skill links if needed:

```bash
scripts/pack.sh refresh
```

## Skills

- `bootstrap-repo`: Bootstrap a new repository with standard directory structure, configuration files, and development conventions.
- `env-setup`: Scaffold the local env file with required variable stubs, open it for the user to fill, and verify completeness by key names only — never reading secret values.
