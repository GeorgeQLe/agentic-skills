// ============================================================================
// briefing-deck-flagships.mjs
// Phase-1 flagship deck definitions: content mapped to varied archetypes to
// prove the visual system before the manifest-driven batch regenerates all 44.
// Content is preserved from the prior hand-authored decks; only the visual
// system changes. Consumed by generate-briefing-decks.mjs.
// ============================================================================

const R = (label, href) => ({ label, href });

const ideaScopeBrief = {
  slug: "afps-skill-idea-scope-brief",
  title: "idea-scope-brief",
  subtitle: "Business AFPS · Concept & market",
  command: "$idea-scope-brief",
  briefingPath: "briefing-slides/afps-skill-idea-scope-brief.html",
  references: [
    "packs/base/claude/idea-scope-brief/SKILL.md",
    "docs/decks.md",
    "docs/skill-next-step-contracts.md",
    "docs/briefing-slides-convention.md",
    "briefing-slides/afps-skill-overviews.html",
  ],
  slides: [
    {
      archetype: "hero",
      title: "idea-scope-brief overview",
      eyebrow: "Business AFPS · planning",
      heading: "idea-scope-brief",
      lead: "Shape a rough product or project idea into a scoped brief before customer discovery, market research, specifications, UX, UI, or implementation planning.",
      meta: [
        { cap: "Where it fits", value: "Concept & market", tone: "teal" },
        { cap: "Invoke", value: "`$idea-scope-brief`" },
        { cap: "Next", value: "customer-discovery", tone: "violet" },
      ],
      refs: [
        R("SKILL.md", "../packs/base/claude/idea-scope-brief/SKILL.md"),
        R("overview deck", "../briefing-slides/afps-skill-overviews.html"),
      ],
    },
    {
      archetype: "splitPanel",
      title: "When to use it",
      eyebrow: "Concept & market",
      heading: "When to use it",
      lead: "Primary question: what decision, artifact, or proof does this step need to make safe before the next skill?",
      left: {
        title: "Run this when",
        items: [
          "The product is still rough, mixed, or underspecified.",
          "Primary input: current repo artifacts plus the previous AFPS phase's research, design, prototype, spec, or task output.",
        ],
      },
      right: {
        title: "Do not expect",
        items: [
          "A shortcut around upstream evidence.",
          "If required artifacts are missing, the skill routes to the prerequisite instead.",
        ],
      },
      refs: [R("SKILL.md", "../packs/base/claude/idea-scope-brief/SKILL.md"), R("decks", "../docs/decks.md")],
    },
    {
      archetype: "timeline",
      title: "What happens in the session",
      eyebrow: "Concept & market",
      heading: "What happens in the session",
      steps: [
        { title: "Resolve context", body: "Reads repo state, source artifacts, and relevant prior AFPS outputs before asking deeper questions." },
        { title: "Work the frame", body: "Runs an interview, research synthesis, planning loop, build loop, audit, or shipping pass based on its type." },
        { title: "Gate the result", body: "Uses review artifacts, checks, or approval language before writing canonical outputs or routing onward." },
      ],
      refs: [R("SKILL.md", "../packs/base/claude/idea-scope-brief/SKILL.md"), R("decks", "../docs/decks.md")],
    },
    {
      archetype: "featureCards",
      title: "What people should expect",
      eyebrow: "Concept & market",
      heading: "What people should expect",
      cols: 2,
      cards: [
        { ic: "📦", title: "Expected output", body: "A scoped product brief that makes the idea specific enough for discovery instead of jumping into specs or build work.", tone: "" },
        { ic: "🗂️", title: "Where detail lives", body: "Dense artifacts stay in research, design, prototype, specs, tasks, or source files. This deck is only the overview layer.", tone: "teal" },
        { ic: "🎚️", title: "Quality bar", body: "The output should make the next route more obvious and reduce ambiguity, not create a new parallel workflow.", tone: "violet" },
        { ic: "👤", title: "Human review", body: "Expect a checkpoint, alignment page, evidence artifact, prototype inspection, or shipping summary depending on the skill.", tone: "green" },
      ],
      refs: [R("SKILL.md", "../packs/base/claude/idea-scope-brief/SKILL.md"), R("overview", "../briefing-slides/afps-skill-overviews.html")],
    },
    {
      archetype: "flowDiagram",
      title: "Handoff and next route",
      eyebrow: "Concept & market",
      heading: "Handoff and next route",
      nodes: [
        { label: "Rough idea", sub: "before", tone: "" },
        { label: "idea-scope-brief", sub: "scoped brief", tone: "teal" },
        { label: "customer-discovery", sub: "after", tone: "violet" },
      ],
      note: "Series talking point: explain why this skill exists as a boundary — what risk it burns down before the next AFPS step.",
      refs: [R("skill-next-step-contracts", "../docs/skill-next-step-contracts.md"), R("decks", "../docs/decks.md")],
    },
    {
      archetype: "references",
      title: "References",
      eyebrow: "Review handoff",
      heading: "References",
      items: [
        { kind: "skill", title: "idea-scope-brief SKILL.md", href: "../packs/base/claude/idea-scope-brief/SKILL.md" },
        { kind: "doc", title: "AFPS deck chains", href: "../docs/decks.md" },
        { kind: "doc", title: "Skill next-step contracts", href: "../docs/skill-next-step-contracts.md" },
        { kind: "doc", title: "Briefing-slides convention", href: "../docs/briefing-slides-convention.md" },
        { kind: "deck", title: "AFPS skill overviews", href: "../briefing-slides/afps-skill-overviews.html" },
      ],
    },
    {
      archetype: "compiler",
      title: "Review and review YAML",
      eyebrow: "Review handoff",
      heading: "Review &amp; review YAML",
      gate: {
        name: "deck_accurate",
        question: "Approve whether this deck accurately explains what people can expect from idea-scope-brief.",
        options: [{ value: "approve", label: "Approve" }, { value: "revise", label: "Revise" }, { value: "needs-clarification", label: "Needs clarification" }],
        why: "Approving marks the deck ready for agent review and routes the compiled YAML back to $idea-scope-brief.",
      },
      refs: [R("SKILL.md", "../packs/base/claude/idea-scope-brief/SKILL.md"), R("convention", "../docs/briefing-slides-convention.md")],
    },
  ],
};

const createBriefingSlides = {
  slug: "create-briefing-slides",
  title: "Create Briefing Slides",
  subtitle: "Dogfood deck · reviews itself",
  command: "$create-briefing-slides",
  briefingPath: "briefing-slides/create-briefing-slides.html",
  references: [
    "packs/base/codex/create-briefing-slides/SKILL.md",
    "docs/briefing-slides-convention.md",
  ],
  sourceArtifacts: [
    "packs/base/codex/create-briefing-slides/SKILL.md",
    "docs/briefing-slides-convention.md",
    "packs/base/codex/create-briefing-slides/agents/openai.yaml",
  ],
  slides: [
    {
      archetype: "hero",
      title: "What it solves",
      eyebrow: "Briefing-first review",
      heading: "Create Briefing Slides",
      lead: "Turn dense alignment, interrogation, research, and spec artifacts into a visual review deck — without replacing the canonical source.",
      meta: [
        { cap: "Primary surface", value: "the deck", tone: "teal" },
        { cap: "Canonical", value: "dense page", tone: "" },
        { cap: "Handoff", value: "compiled YAML", tone: "violet" },
      ],
      refs: [R("SKILL.md", "../packs/base/codex/create-briefing-slides/SKILL.md"), R("convention", "../docs/briefing-slides-convention.md")],
    },
    {
      archetype: "statement",
      title: "The principle",
      eyebrow: "Principle",
      quote: "Briefing slides make review **visual and navigable** — the dense page stays canonical and is never skipped.",
      cite: "briefing-slides convention · Briefing-First Review Surface",
      refs: [R("convention", "../docs/briefing-slides-convention.md")],
    },
    {
      archetype: "splitPanel",
      title: "What it does / doesn't",
      eyebrow: "Scope",
      heading: "One review surface, not a replacement",
      left: {
        title: "It does",
        items: [
          "Author `briefing-slides/<skill>-<topic>.html` after the dense page exists.",
          "Open only the deck; link the dense page and sources as references.",
          "Compile reviewer choices into YAML routed to the producing command.",
        ],
      },
      right: {
        title: "It does not",
        items: [
          "Replace dense `alignment/*.html` or `interrogation/*.html` pages.",
          "Embed pages with iframe/object/embed or auto-open references.",
          "Drop unanswered gates or prior feedback on re-author.",
        ],
      },
      refs: [R("convention", "../docs/briefing-slides-convention.md")],
    },
    {
      archetype: "comparisonMatrix",
      title: "Deck vs dense page",
      eyebrow: "Surfaces",
      heading: "Deck vs dense page",
      columns: ["Concern", "Briefing deck", "Dense page"],
      rows: [
        ["Primary review surface", { s: "yes" }, { s: "no" }],
        ["Canonical detail", { s: "no" }, { s: "yes" }],
        ["Auto-opened", { s: "yes" }, { s: "no" }],
        ["Carries the gates", { s: "yes" }, { s: "yes" }],
      ],
      refs: [R("convention", "../docs/briefing-slides-convention.md")],
    },
    {
      archetype: "timeline",
      title: "How a deck is built",
      eyebrow: "Session",
      heading: "How a deck gets built",
      steps: [
        { title: "Author the dense page", body: "The producing skill writes its `alignment/*.html` or `interrogation/*.html` first — canonical, never skipped." },
        { title: "Build the deck", body: "Map content beats to varied archetypes; theme-aware, self-contained, one idea per slide." },
        { title: "Gate & compile", body: "Preserve every required gate; compile full-deck YAML back to the producing command." },
      ],
      refs: [R("SKILL.md", "../packs/base/codex/create-briefing-slides/SKILL.md")],
    },
    {
      archetype: "kanbanBoard",
      title: "Review controls",
      eyebrow: "Review controls",
      heading: "Every slide is reviewable",
      columns: [
        { title: "Feedback", kind: "question", tickets: ["emphasize", "revise", "needs-clarification", "freeform notes"] },
        { title: "Marks", kind: "assumption", tickets: ["important", "question", "approved", "skip"] },
        { title: "Gates", kind: "risk", tickets: ["inline radio answers", "red → green slide border", "compiled into YAML"] },
      ],
      refs: [R("convention", "../docs/briefing-slides-convention.md")],
    },
    {
      archetype: "references",
      title: "References",
      eyebrow: "Sources",
      heading: "References",
      items: [
        { kind: "skill", title: "create-briefing-slides SKILL.md", href: "../packs/base/codex/create-briefing-slides/SKILL.md" },
        { kind: "doc", title: "Briefing-slides convention", href: "../docs/briefing-slides-convention.md" },
      ],
      provenance: [{ title: "openai.yaml (agent metadata)", href: "../packs/base/codex/create-briefing-slides/agents/openai.yaml" }],
    },
    {
      archetype: "compiler",
      title: "Review and compiler",
      eyebrow: "Response",
      heading: "Review &amp; compile",
      gate: {
        name: "dogfood_ready",
        question: "Does this dogfood deck prove the briefing-first contract still works end to end?",
        options: [{ value: "approve", label: "Approve" }, { value: "revise", label: "Revise" }],
        why: "Approving marks the deck ready for agent review; the compiled YAML routes to $create-briefing-slides.",
      },
      refs: [R("SKILL.md", "../packs/base/codex/create-briefing-slides/SKILL.md"), R("convention", "../docs/briefing-slides-convention.md")],
    },
  ],
};

// Standalone (non-AFPS-series) briefing that predates the redesign. Converted to
// the shared visual system so the whole folder passes the audit; content is
// preserved from the prior hand-authored release-lane deck.
const releaseLaneChangeBoundary = {
  slug: "release-lane-change-boundary",
  title: "Release Lane Change Boundary",
  subtitle: "Alignment briefing · release lanes",
  command: "$create-briefing-slides",
  briefingPath: "briefing-slides/release-lane-change-boundary.html",
  references: [
    "alignment/release-lane-change-boundary.html",
    "docs/briefing-slides-convention.md",
    "tasks/todo.md",
    "tasks/lessons.md",
  ],
  slides: [
    {
      archetype: "hero",
      title: "Title",
      eyebrow: "Alignment briefing slides",
      heading: "Keep canary and general-release edits separate",
      lead: "A slide review surface for deciding how future skill, convention, package, and task changes declare their release lane before implementation.",
      meta: [
        { cap: "Default", value: "1 canonical skill tree", tone: "teal" },
        { cap: "Standardize", value: "5 release lanes" },
        { cap: "Keep honest", value: "1 audit gate", tone: "violet" },
      ],
      refs: [R("dense alignment page", "../alignment/release-lane-change-boundary.html")],
    },
    {
      archetype: "splitPanel",
      title: "Problem",
      eyebrow: "Problem",
      heading: "The failure is lane mixing, not interrogation-specific",
      left: {
        title: "Observed risk",
        items: ["A general `master` edit can inherit canary-only conventions when the task plan mixes release lanes."],
      },
      right: {
        title: "Broader blast radius",
        items: [
          "Skill frontmatter and conventions",
          "Generator registries and package exports",
          "Task docs and handoff language",
          "Canary publish or promotion metadata",
        ],
      },
      refs: [R("alignment", "../alignment/release-lane-change-boundary.html")],
    },
    {
      archetype: "featureCards",
      title: "Principles",
      eyebrow: "Boundary principles",
      heading: "Separate the lane before touching source",
      cols: 4,
      cards: [
        { ic: "1", title: "Declare lane first", body: "Every non-trivial task states its release lane before implementation.", tone: "" },
        { ic: "2", title: "One source truth", body: "Canonical skills stay in `packs/**` unless a promotion says otherwise.", tone: "teal" },
        { ic: "3", title: "Promotion is explicit", body: "Canary behavior graduates only through a named promotion task.", tone: "gold" },
        { ic: "4", title: "Audit disallowed surfaces", body: "General edits fail if canary-only surfaces appear.", tone: "violet" },
      ],
      refs: [R("convention", "../docs/briefing-slides-convention.md")],
    },
    {
      archetype: "scorecard",
      title: "COAs",
      eyebrow: "Courses of action",
      heading: "Four practical options",
      options: [
        { name: "B. Lane contract + audit", score: "recommended", pct: 92, win: true },
        { name: "C. Canary overlays", score: "situational", pct: 62 },
        { name: "A. Task metadata only", score: "too soft", pct: 40 },
        { name: "D. Separate full source trees", score: "high drift", pct: 24 },
      ],
      refs: [R("alignment", "../alignment/release-lane-change-boundary.html")],
    },
    {
      archetype: "splitPanel",
      title: "Directory Split",
      eyebrow: "Directory split question",
      heading: "Do not split full skill directories by default",
      left: {
        title: "Why not",
        items: ["Duplicated mirror files", "Duplicated archives and changelogs", "Ambiguous package staging", "Manual promotion diffing"],
      },
      right: {
        title: "Preferred boundary",
        items: ["One canonical source tree", "Release-lane metadata + branch policy", "Audit enforcement", "Optional overlays for long-lived experiments"],
      },
      refs: [R("alignment", "../alignment/release-lane-change-boundary.html")],
    },
    {
      archetype: "comparisonMatrix",
      title: "Lane Contract",
      eyebrow: "Recommended standard",
      heading: "Release-lane contract + audit",
      columns: ["Lane", "Branch", "Contract"],
      rows: [
        ["general", "`master`", "Disallow canary conventions and experimental review surfaces."],
        ["canary", "`canary/<name>`", "No general release impact until promotion."],
        ["promotion", "`master`", "Names source canary commit and accepted behavior."],
      ],
      refs: [R("alignment", "../alignment/release-lane-change-boundary.html")],
    },
    {
      archetype: "timeline",
      title: "Implementation",
      eyebrow: "Implementation shape",
      heading: "Minimal durable pieces",
      steps: [
        { title: "Convention doc", body: "`docs/release-lane-convention.md` defines lanes, branch rules, allowed and disallowed surfaces." },
        { title: "Task block", body: "`tasks/todo.md` includes a required `### Release Lane` block for non-trivial work." },
        { title: "Audit script", body: "`scripts/audit-release-lane.mjs` validates active lane, branch, and touched surfaces." },
      ],
      refs: [R("convention", "../docs/briefing-slides-convention.md")],
    },
    {
      archetype: "featureCards",
      title: "Decision Gates",
      eyebrow: "Review gates",
      heading: "Decisions to approve",
      cols: 3,
      cards: [
        { ic: "①", title: "Release-lane standard", body: "Require a release-lane block for future non-trivial tasks?", tone: "teal" },
        { ic: "②", title: "Audit enforcement", body: "Add mechanical audit enforcement?", tone: "violet" },
        { ic: "③", title: "Directory policy", body: "Avoid separate full source trees by default?", tone: "" },
      ],
      refs: [R("alignment", "../alignment/release-lane-change-boundary.html")],
    },
    {
      archetype: "references",
      title: "References",
      eyebrow: "References",
      heading: "Dense sources remain canonical",
      items: [
        { kind: "page", title: "Release-lane alignment page", href: "../alignment/release-lane-change-boundary.html" },
        { kind: "doc", title: "Briefing-slides convention", href: "../docs/briefing-slides-convention.md" },
        { kind: "task", title: "Task record", href: "../tasks/todo.md" },
        { kind: "doc", title: "Lessons learned", href: "../tasks/lessons.md" },
      ],
    },
    {
      archetype: "compiler",
      title: "Compile YAML",
      eyebrow: "Handoff",
      heading: "Compile slide review YAML",
      gate: {
        name: "release_lane_standard",
        question: "Adopt the release-lane contract + audit gate (lane block for non-trivial tasks, mechanical enforcement, no default source-tree split)?",
        options: [{ value: "approve", label: "Approve" }, { value: "revise", label: "Revise" }, { value: "reject", label: "Reject" }],
        why: "Approving routes the compiled YAML to implement the release-lane convention and audit gate.",
      },
      refs: [R("alignment", "../alignment/release-lane-change-boundary.html"), R("convention", "../docs/briefing-slides-convention.md")],
    },
  ],
};

export const FLAGSHIP_DECKS = [ideaScopeBrief, createBriefingSlides, releaseLaneChangeBoundary];
