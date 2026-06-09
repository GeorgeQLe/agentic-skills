# Decks

A **deck** is a named workflow sequence — a documentation and installation concept that guides which packs to install and in what order. Decks are not a directory or runtime primitive; they describe a canonical path through the skill system.

A **workflow** is the runtime execution of a deck's skill sequence in a specific project.

## The Four Decks

Decks sit on a 2×2 matrix of **domain** (business vs. devtool) and **tempo** (rapid vs. deliberate):

|  | Business / Consumer | Developer / OSS |
| --- | --- | --- |
| **Rapid** (days) | VARD | ORD |
| **Deliberate** (weeks–months) | Business AFPS | Devtool AFPS |

Rapid decks are for weekly experiments. Deliberate decks are for products that justify full discovery, lifecycle planning, and growth strategy.

---

## VARD — Viral App Rapid Distribution

**Tempo:** Rapid (idea to shipped app in days)
**Domain:** Business / consumer apps

**Install:**

```bash
scripts/pack.sh install vard
```

**Canonical chain:**

```text
vard-scan -> vard-align -> vard-ship
```

**Skills:**
- `vard-scan` — scan for viral app opportunities
- `vard-align` — go/no-go feasibility check
- `vard-ship` — deploy, landing page, analytics, ship log

**Graduation:** When an experiment shows traction, graduate to Business AFPS:

```bash
scripts/pack.sh install business-discovery
```

Then start the deliberate pipeline with `/idea-scope-brief` or `/customer-discovery`.

---

## ORD — OSS Rapid Distribution

**Tempo:** Rapid (pain point to published package in days)
**Domain:** Developer tools / OSS

**Install:**

```bash
scripts/pack.sh install ord
```

**Canonical chain:**

```text
ord-scan -> ord-align -> ord-ship
```

**Skills:**
- `ord-scan` — scan for OSS tool opportunities
- `ord-align` — validate feasibility, check npm namespace
- `ord-ship` — publish to npm, README, repo setup, ship log

**Graduation:** When a package gains traction (stars, downloads, issues), graduate to Devtool AFPS:

```bash
scripts/pack.sh install devtool
```

Then start the deliberate pipeline with `/devtool-adoption` or `/devtool-positioning`.

---

## Business AFPS — Deliberate Business Pipeline

**Tempo:** Deliberate (weeks to months)
**Domain:** Business / consumer / SaaS products

**Install:**

```bash
scripts/pack.sh install business-discovery
```

Add packs progressively as the product matures:

```bash
scripts/pack.sh install customer-lifecycle   # after ICP + competitive analysis
scripts/pack.sh install business-growth      # after lifecycle evidence
scripts/pack.sh install business-ops         # for ongoing operations
```

**Canonical chain:**

```text
business-discovery -> customer-lifecycle -> business-growth -> business-ops
```

See `docs/pack-workflow-matrix.md` for the full default route with optional detours.

---

## Devtool AFPS — Deliberate Devtool Pipeline

**Tempo:** Deliberate (weeks to months)
**Domain:** Developer tools, CLIs, libraries, SDKs

**Install:**

```bash
scripts/pack.sh install devtool
```

**Canonical chain:**

```text
devtool-positioning -> devtool-adoption -> devtool-dx-journey -> devtool-docs-audit -> devtool-monetization
```

**Skills:** `devtool-positioning`, `devtool-adoption`, `devtool-user-map`, `devtool-workflow`, `devtool-integration-map`, `devtool-dx-journey`, `devtool-docs-audit`, `devtool-monetization`.

---

## Graduation Path

Rapid decks feed into deliberate decks when experiments prove out:

```text
VARD ──(traction)──> Business AFPS
ORD  ──(traction)──> Devtool AFPS
```

The graduation signal differs by deck:
- **VARD → Business AFPS:** Users return, share organically, or revenue appears. The experiment justifies full customer discovery and lifecycle planning.
- **ORD → Devtool AFPS:** npm downloads grow, GitHub stars accumulate, or issues from real users arrive. The package justifies full positioning, adoption strategy, and documentation depth.

## npm Distribution

When distributed via npm, decks map to package-list and registry-tag metadata that the CLI can materialize from the current backend. See `docs/skillpacks-npm-distribution.md` and `alignment/idea-scope-brief-npm-distribution.html` for the approved distribution route.
