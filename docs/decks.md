# Decks

A **deck** is a named workflow sequence — a documentation and installation concept that guides which packs to install and in what order. Decks are not a directory or runtime primitive; they describe a canonical path through the skill system.

A **workflow** is the runtime execution of a deck's skill sequence in a specific project.

## The Five Decks

Decks sit on two axes: **domain** (business / consumer, developer / OSS, or game / playable entertainment) and **tempo** (rapid vs. deliberate). Not every domain has both tempos yet.

|  | Business / Consumer | Developer / OSS | Game / Playable Entertainment |
| --- | --- | --- | --- |
| **Rapid** (days) | VARD | ORD | Not defined yet |
| **Deliberate** (weeks–months) | Business AFPS | Devtool AFPS | Game AFPS |

Rapid decks are for weekly experiments. Deliberate decks are for products that justify full discovery, lifecycle planning, and growth strategy.

Install decks through the npm CLI:

```bash
npx @glexcorp/gskp install-deck vard
npx @glexcorp/gskp install-deck ord
npx @glexcorp/gskp install-deck business-afps
npx @glexcorp/gskp install-deck business-afps --full
npx @glexcorp/gskp install-deck devtool-afps
npx @glexcorp/gskp install-deck game-afps
```

In the current `@glexcorp/gskp@0.1.0` release, npm deck materialization still uses the packaged shell backend, so `install-deck` requires `bash` and `jq`. Direct npm pack installs such as `npx @glexcorp/gskp install devtool` are Node-owned and do not require `jq`.

---

## VARD — Viral App Rapid Distribution

**Tempo:** Rapid (idea to shipped app in days)
**Domain:** Business / consumer apps

**Install:**

```bash
npx @glexcorp/gskp install-deck vard
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
npx @glexcorp/gskp install business-discovery
```

Then start the deliberate pipeline with `/idea-scope-brief` or `/customer-discovery`.

---

## ORD — OSS Rapid Distribution

**Tempo:** Rapid (pain point to published package in days)
**Domain:** Developer tools / OSS

**Install:**

```bash
npx @glexcorp/gskp install-deck ord
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
npx @glexcorp/gskp install devtool
```

Then start the deliberate pipeline with `/devtool-adoption` or `/devtool-positioning`.

---

## Business AFPS — Deliberate Business Pipeline

**Tempo:** Deliberate (weeks to months)
**Domain:** Business / consumer / SaaS products

**Install:**

```bash
npx @glexcorp/gskp install-deck business-afps
```

Add packs progressively as the product matures:

```bash
npx @glexcorp/gskp install customer-lifecycle   # after ICP + competitive analysis
npx @glexcorp/gskp install business-growth      # after lifecycle evidence
npx @glexcorp/gskp install business-ops         # for ongoing operations
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
npx @glexcorp/gskp install-deck devtool-afps
```

**Canonical chain:**

```text
devtool-positioning -> devtool-adoption -> devtool-dx-journey -> devtool-docs-audit -> devtool-monetization
```

**Skills:** `devtool-positioning`, `devtool-adoption`, `devtool-user-map`, `devtool-workflow`, `devtool-integration-map`, `devtool-dx-journey`, `devtool-docs-audit`, `devtool-monetization`.

---

## Game AFPS — Deliberate Game Development Pipeline

**Tempo:** Deliberate (weeks to months)
**Domain:** Video games and playable entertainment

**Install:**

```bash
npx @glexcorp/gskp install-deck game-afps
```

**Canonical chain:**

```text
game-audience -> game-fantasy -> game-genre-map -> game-comparables
-> game-core-loop -> game-prototype-test -> game-playtest-metrics
-> game-store-page-test -> game-launch -> game-roadmap
```

**Skills:** `game-audience`, `game-fantasy`, `game-genre-map`, `game-comparables`, `game-core-loop`, `game-prototype-test`, `game-playtest-metrics`, `game-store-page-test`, `game-launch`, `game-roadmap`, `game-workflow`.

Game AFPS uses the AFPS tempo with game-specific proof gates: align on audience, fantasy, genre, and comparable expectations first; then validate the playable loop, playtest evidence, store-page promise, launch plan, and roadmap.

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

Game AFPS currently has no rapid feeder deck. Small game prototypes should either start directly with `game-audience` / `game-core-loop` inside the `game` pack or use Game AFPS when the concept warrants deliberate playtest-driven validation.

## npm Distribution

When distributed via npm, decks map to package-list and registry-tag metadata that the CLI can materialize from the current backend. The npm package semver selects the bundled deck and skill snapshot, while skill-level pins continue to use each skill's `version:` value. See `docs/skillpacks-npm-distribution.md` and `alignment/idea-scope-brief-npm-distribution.html` for the approved distribution route.
