# Project Fleet Pack

Project-local workflows for control repositories that manage many downstream repositories, clone/spec-store portfolios, or bounded spin-offs.

Default flow:

```text
clone-spec-store -> project-fleet -> spin-off
```

Skills:

```text
clone-spec-store, project-fleet, skill-inventory, spin-off
```

`clone-spec-store` defines lawful functional-parity spec stores and portfolio gates. `project-fleet` orchestrates downstream work queues and guarded batches. `skill-inventory` reports downstream local skill-copy drift without mutating downstream repos. `spin-off` extracts bounded source areas into new repositories with private/public readiness gates.

Install this pack only in repos or sessions that explicitly manage a fleet, portfolio, or extraction workflow.
