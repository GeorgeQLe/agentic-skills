# Pack/Card Hierarchy for Skills Showcase

## Raw Inventory Summary

- Current generated Skills Showcase data reports **373 platform entries** from generated rows: **354 pack platform entries** plus **19 global platform entries**.
- De-duplicating generated rows by `mirrorKey` gives **190 unique mirrored skills**: **179 unique pack skills** plus **11 unique global skills**.
- Generated pack metadata reports **41 active packs**, **39 skill-bearing packs**, and two active empty/alias packs (`business-app`, `creator-media`) that should not be counted as skill-bearing display packs.
- The seven-set map below is a **historical prototype display-card map**. It groups **157 repo-managed Claude pack roots** into **7 display sets** from an earlier inventory snapshot; use it as layout inspiration, not as the current public inventory total.

## Step 1: Pack → AFPS Phase Coverage

### AFPS Phase Definitions (from workflow-data.ts)

| Phase | Coordinate | Key Skills Referenced |
| --- | --- | --- |
| LAB-01 Market Discovery | idea-scope-brief, pack, ICP, competitive scan, journey map |
| LAB-02 Value & Strategy | value-prop, positioning, lean-canvas, metrics, monetization |
| LAB-03 Go-to-Market | hook model, GTM plan, growth loops |
| LAB-04 UX & UI Design | ux-variations, ui-interview, design lock |
| LAB-05 Prototype & Test | prototype, uat, consolidate-variations |
| LAB-06 Specification | spec-interview, research-roadmap |
| LAB-07 Production | roadmap, exec, ship, ship-end |

### Pack → Phase Matrix

| Pack | Size | LAB-01 | LAB-02 | LAB-03 | LAB-04 | LAB-05 | LAB-06 | LAB-07 | Category |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **business-discovery** | 7 | ✓ | ✓ | | | | | | domain |
| **customer-lifecycle** | 7 | ✓ | | | | | | | domain |
| **business-growth** | 8 | | ✓ | ✓ | | | | | domain |
| **business-ops** | 13 | | | | | | | ✓ | domain |
| **creator-foundation** | 9 | ✓ | ✓ | | | | | | domain |
| **youtube-ops** | 12 | ✓ | | | | | | | domain |
| **remotion** | 3 | | | | | | | ✓ | domain |
| **devtool** | 8 | ✓ | ✓ | ✓ | | | | | domain |
| **game** | 11 | ✓ | ✓ | | ✓ | ✓ | | ✓ | domain |
| **product-design** | 8 | | | | ✓ | ✓ | ✓ | | domain |
| **product-testing** | 2 | | | | | ✓ | | | domain |
| **alignment-loop** | 3 | | ✓ | | | | | | overlay |
| **alignment-page-admin** | 2 | | | | | | | ✓ | overlay |
| **agent-work-admin** | 3 | | | | | | ✓ | ✓ | overlay |
| **research-admin** | 1 | | | | | | ✓ | | overlay |
| **exec-loop** | 3 | | | | | | | ✓ | overlay |
| **monorepo** | 7 | | | | | | | ✓ | overlay |
| **code-review** | 4 | | | | | | | ✓ | overlay |
| **code-debug** | 3 | | | | | | | ✓ | overlay |
| **code-quality** | 2 | | | | | | | ✓ | overlay |
| **code-maintenance** | 2 | | | | | | | ✓ | overlay |
| **gitops** | 2 | | | | | | | ✓ | overlay |
| **release-ops** | 3 | | | | | | | ✓ | overlay |
| **docs-health** | 2 | | | | | | | ✓ | overlay |
| **session-analytics** | 3 | | | | | | | ✓ | meta |
| **skill-dev** | 4 | | | | | | | ✓ | meta |
| **agentic-skills-bench** | 2 | | | | | | | ✓ | meta |
| **guided-walkthrough** | 2 | | | | | ✓ | | | meta |
| **project-fleet** | 4 | | | | | | | ✓ | meta |
| **teardown** | 2 | | | | | | | ✓ | meta |
| **global** | 8 | ✓ | | | | | | ✓ | foundation |
| **agent-bridge** | 1 | | | | | | | ✓ | utility |
| **context-transfer** | 1 | | | | | | | ✓ | utility |
| **exec-profile** | 1 | | | | | | | ✓ | utility |
| **knowledge-check** | 1 | | | | | | | | utility |
| **repo-maintenance** | 1 | | | | | | | ✓ | utility |
| **report-gen** | 1 | | | | | | | ✓ | utility |
| **website-polish** | 1 | | | | | | | ✓ | utility |

### Key Observation

Most packs are phase-specialized (1-2 phases). The business chain covers LAB-01 through LAB-07 across its 4 packs. Game is the only single pack spanning 5 phases. Product-design is the core LAB-04/05/06 pack. Overlay/meta packs cluster at LAB-07 (production execution).

---

## Step 2: Historical Prototype Set Groupings

This section preserves the original seven-set prototype display-card grouping. The card counts in this section are scoped to that historical prototype map, not the current generated Skills Showcase inventory.

### Design Constraints
- Each set = 8–40 cards (sweet spot for a booster pack shelf)
- Every skill lands in exactly one set
- Sets have coherent themes (TCG expansion feel)
- Tiny packs absorbed into nearest thematic set

### The Seven Sets

#### 1. "Market Intel" (Discovery & Research)
*Theme: Scouting the landscape before committing*

| Pack | Skills |
| --- | --- |
| business-discovery | competitive-analysis, customer-feedback, enterprise-icp, icp, lean-canvas, positioning, value-prop-canvas |
| customer-lifecycle | conversion-map, expansion-map, journey-map, lifecycle-metrics, onboarding-map, retention-map, transaction-map |

**Card count: 14** · Phases: LAB-01, LAB-02

#### 2. "Growth Engine" (Strategy & GTM)
*Theme: Turning evidence into a business machine*

| Pack | Skills |
| --- | --- |
| business-growth | experiment, growth-model, gtm, hook-model, landing-copy, metrics, monetization, pmf-assessment |
| business-ops | assumption-tracker, burn-rate, cohort-review, investor-update, mvp-gap, platform-strategy, product-line, reconcile-research, repo-glossary, retro, risk-register, runway-model, scale-audit |

**Card count: 21** · Phases: LAB-02, LAB-03, LAB-07

#### 3. "Creator Studio" (Content & Video)
*Theme: From creator strategy to published video*

| Pack | Skills |
| --- | --- |
| creator-foundation | content-programming, creator-evidence-schema, creator-metrics-review, creator-platform-capability-matrix, creator-positioning, creator-presence-dossier, product-led-media-map, research-directory-conventions, series-spec |
| youtube-ops | youtube-audit, youtube-cadence-diagnosis, youtube-channel-audit, youtube-competitive-research, youtube-concept-research, youtube-description-optimizer, youtube-peer-benchmark, youtube-portfolio, youtube-search-positioning, youtube-title-thumbnail-audit, youtube-vid-research, youtube-video-audit |
| remotion | video-build, video-script, youtube-format-research |

**Card count: 24** · Phases: LAB-01, LAB-02, LAB-07

#### 4. "Design Lab" (UX/UI & Prototype)
*Theme: From wireframe to validated prototype*

| Pack | Skills |
| --- | --- |
| product-design | brainstorm, consolidate-variations, design-system, feature-interview, prototype, spec-interview, ui-interview, ux-variations |
| product-testing | dogfood, uat |
| guided-walkthrough | guide, uat-guide |
| alignment-loop | destination-doc, taste-calibration, vertical-slice-splitter |
| research-admin | research-roadmap |

**Card count: 16** · Phases: LAB-02, LAB-04, LAB-05, LAB-06

#### 5. "Domain Decks" (Vertical Specializations)
*Theme: Genre-specific strategy packs*

| Pack | Skills |
| --- | --- |
| devtool | devtool-adoption, devtool-docs-audit, devtool-dx-journey, devtool-integration-map, devtool-monetization, devtool-positioning, devtool-user-map, devtool-workflow |
| game | game-audience, game-comparables, game-core-loop, game-fantasy, game-genre-map, game-launch, game-playtest-metrics, game-prototype-test, game-roadmap, game-store-page-test, game-workflow |

**Card count: 19** · Phases: LAB-01 through LAB-07 (game spans wide)

#### 6. "Forge" (Code Quality & Shipping)
*Theme: The engineering toolbelt*

| Pack | Skills |
| --- | --- |
| exec-loop | exec, ship-end, ship |
| agent-work-admin | plan-phase, roadmap, spec-drift |
| monorepo | affected, mono-detect, mono-exec, mono-guard, mono-plan, mono-ship, scaffold |
| code-review | dead-code, expert-review, regression-check, slim-audit |
| code-debug | debug, investigate, trace |
| code-quality | extract-shared-types, quality-sweep |
| code-maintenance | migrate, update-packages |
| gitops | commit-and-push-by-feature, sync |
| release-ops | branch-lifecycle, deploy, release |
| docs-health | hygiene, reconcile-dev-docs |

**Card count: 31** · Phases: LAB-06, LAB-07

#### 7. "Foundation" (Global, Meta & Utility)
*Theme: The starter deck — tools that work everywhere*

| Pack | Skills |
| --- | --- |
| global | afps-status, animation-design-planner, codebase-status, idea-scope-brief, init-agentic-skills, pack, provision-agentic-config, skills |
| skill-dev | create-agentic-skill, create-local-skill, skill-interview, targeted-skill-builder |
| agentic-skills-bench | benchmark-agent-review, benchmark-test-skill |
| session-analytics | analyze-sessions, prompt-history-backfill, session-triage |
| project-fleet | clone-spec-store, skill-inventory, project-fleet, spin-off |
| alignment-page-admin | compile-central-alignment, upgrade-alignment-pages |
| teardown | decommission, desk-flip |
| knowledge-check | quiz-me |
| agent-bridge | delegate |
| context-transfer | handoff |
| exec-profile | patch-exec-profile |
| repo-maintenance | bootstrap-repo |
| report-gen | report-website |
| website-polish | icon-handler |

**Card count: 32** · Phases: LAB-01, LAB-07

---

## Step 3: Sets × AFPS Phase Matrix

| Set | Cards | LAB-01 | LAB-02 | LAB-03 | LAB-04 | LAB-05 | LAB-06 | LAB-07 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Market Intel | 14 | ✓✓ | ✓ | | | | | |
| Growth Engine | 21 | | ✓ | ✓ | | | | ✓ |
| Creator Studio | 24 | ✓ | ✓ | | | | | ✓ |
| Design Lab | 16 | | ✓ | | ✓✓ | ✓✓ | ✓✓ | |
| Domain Decks | 19 | ✓ | ✓ | ✓ | ✓ | ✓ | | ✓ |
| Forge | 31 | | | | | | ✓ | ✓✓ |
| Foundation | 32 | ✓ | | | | | | ✓ |

✓✓ = primary phase coverage, ✓ = secondary

**Every AFPS phase is covered by at least 2 sets.** No dead spots.

---

## Step 4: Display Recommendations

### Shelf Layout (7 sealed packs)

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  MARKET      │ │  GROWTH     │ │  CREATOR    │ │  DESIGN     │
│  INTEL       │ │  ENGINE     │ │  STUDIO     │ │  LAB        │
│  14 cards    │ │  21 cards   │ │  24 cards   │ │  16 cards   │
│  LAB 01-02   │ │  LAB 02-03  │ │  LAB 01-02  │ │  LAB 04-06  │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  DOMAIN      │ │  FORGE      │ │  FOUNDATION │
│  DECKS       │ │             │ │             │
│  19 cards    │ │  31 cards   │ │  32 cards   │
│  LAB 01-07   │ │  LAB 06-07  │ │  ALL        │
└─────────────┘ └─────────────┘ └─────────────┘
```

### Booster Splitting (for Forge and Foundation)

Forge (31 cards) and Foundation (32 cards) are near the upper range. Options:
- **Keep as-is**: 31 and 32 are well under 40, the pull animation handles it fine
- **Split Forge** into "Forge: Review" (code-review + code-debug = 7) and "Forge: Ship" (everything else = 24) — only if drawer scroll becomes unwieldy

**Recommendation: Keep 7 sets as-is.** All are within 8–40 range. The TCG aesthetic benefits from fewer, chunkier packs rather than many tiny ones.

### Phase Badges

Each sealed pack shows phase badge chips (e.g., "LAB-01 LAB-02") so the user can scan by workflow stage. This is the hybrid display model from Step 3 — sets on a shelf, phase badges on each pack.

---

## Verification Checklist

- [x] **157 historical prototype display cards accounted for:** 14 + 21 + 24 + 16 + 19 + 31 + 32 = **157** ✓
- [x] **No set under 8 cards:** smallest = Market Intel (14) ✓
- [x] **No set over 40 cards:** largest = Foundation (32) ✓
- [x] **All 7 AFPS phases covered:** see matrix above ✓
- [x] **Every prototype display pack assigned to exactly one set:** the historical display snapshot covered 38 skill-bearing groupings in the seven-set layout ✓

---

## Implementation Data

This TypeScript sketch is retained for the historical prototype grouping. Before using it in current Skills Showcase implementation work, regenerate deck/set data from `apps/skills-showcase/public/assets/skills-data.js` so the UI reflects 373 platform entries, 190 unique mirrored skills, 179 unique pack skills, 11 unique global skills, and 41 active packs.

For `page.tsx`, replace `FEATURED_PACKS` with:

```typescript
const SETS = [
  {
    name: "Market Intel",
    slug: "market-intel",
    packs: ["business-discovery", "customer-lifecycle"],
    phases: ["LAB-01", "LAB-02"],
    theme: "discovery",
  },
  {
    name: "Growth Engine",
    slug: "growth-engine",
    packs: ["business-growth", "business-ops"],
    phases: ["LAB-02", "LAB-03", "LAB-07"],
    theme: "strategy",
  },
  {
    name: "Creator Studio",
    slug: "creator-studio",
    packs: ["creator-foundation", "youtube-ops", "remotion"],
    phases: ["LAB-01", "LAB-02", "LAB-07"],
    theme: "creator",
  },
  {
    name: "Design Lab",
    slug: "design-lab",
    packs: ["product-design", "product-testing", "guided-walkthrough", "alignment-loop", "research-admin"],
    phases: ["LAB-02", "LAB-04", "LAB-05", "LAB-06"],
    theme: "design",
  },
  {
    name: "Domain Decks",
    slug: "domain-decks",
    packs: ["devtool", "game"],
    phases: ["LAB-01", "LAB-02", "LAB-03", "LAB-04", "LAB-05", "LAB-07"],
    theme: "vertical",
  },
  {
    name: "Forge",
    slug: "forge",
    packs: ["exec-loop", "agent-work-admin", "monorepo", "code-review", "code-debug", "code-quality", "code-maintenance", "gitops", "release-ops", "docs-health"],
    phases: ["LAB-06", "LAB-07"],
    theme: "engineering",
  },
  {
    name: "Foundation",
    slug: "foundation",
    packs: ["global", "skill-dev", "agentic-skills-bench", "session-analytics", "project-fleet", "alignment-page-admin", "teardown", "knowledge-check", "agent-bridge", "context-transfer", "exec-profile", "repo-maintenance", "report-gen", "website-polish"],
    phases: ["LAB-01", "LAB-07"],
    theme: "core",
  },
];
```

### Helper to Collect Cards for a Set

```typescript
function getSetSkills(skills: Skill[], set: typeof SETS[number]): Skill[] {
  return set.packs.flatMap(packName =>
    packName === "global"
      ? getGlobalSkills(skills)
      : getPackSkills(skills, packName)
  );
}
```
