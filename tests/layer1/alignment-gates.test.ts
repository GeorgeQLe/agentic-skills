import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");

const coreSkills = [
  "packs/product-design/claude/ui-interview/SKILL.md",
  "packs/product-design/codex/ui-interview/SKILL.md",
  "packs/product-design/claude/ux-variations/SKILL.md",
  "packs/product-design/codex/ux-variations/SKILL.md",
  "packs/product-design/claude/spec-interview/SKILL.md",
  "packs/product-design/codex/spec-interview/SKILL.md",
  "packs/product-design/claude/consolidate-variations/SKILL.md",
  "packs/product-design/codex/consolidate-variations/SKILL.md",
  "packs/product-design/claude/prototype/SKILL.md",
  "packs/product-design/codex/prototype/SKILL.md",
  "packs/product-testing/claude/uat/SKILL.md",
  "packs/product-testing/codex/uat/SKILL.md",
  "packs/agent-work-admin/claude/roadmap/SKILL.md",
  "packs/agent-work-admin/codex/roadmap/SKILL.md",
  "packs/research-admin/claude/research-roadmap/SKILL.md",
  "packs/research-admin/codex/research-roadmap/SKILL.md",
];

const skippedSkills = [
  "packs/exec-loop/claude/exec/SKILL.md",
  "packs/exec-loop/codex/exec/SKILL.md",
  "packs/exec-loop/claude/ship/SKILL.md",
  "packs/exec-loop/codex/ship/SKILL.md",
  "packs/exec-loop/claude/ship-end/SKILL.md",
  "packs/exec-loop/codex/ship-end/SKILL.md",
  "packs/gitops/claude/sync/SKILL.md",
  "packs/gitops/codex/sync/SKILL.md",
  "packs/agent-work-admin/claude/plan-phase/SKILL.md",
  "packs/agent-work-admin/codex/plan-phase/SKILL.md",
];

const researchQualitySkills = [
  "packs/research-admin/claude/research-roadmap/SKILL.md",
  "packs/research-admin/codex/research-roadmap/SKILL.md",
];

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

// Resolve the sibling ALIGNMENT-PAGE.md bundled next to a SKILL.md.
function bundledPath(skillMdPath: string) {
  return relative(ROOT, resolve(dirname(resolve(ROOT, skillMdPath)), "ALIGNMENT-PAGE.md"));
}

function bundled(skillMdPath: string) {
  return read(bundledPath(skillMdPath));
}

function hasBundle(skillMdPath: string) {
  return existsSync(resolve(ROOT, bundledPath(skillMdPath)));
}

// Where the convention text lives for a skill: the bundled file when the
// generator owns it, otherwise the inline SKILL.md section (bespoke,
// skip-listed skills such as `roadmap` keep their convention inline).
function conventionText(skillMdPath: string) {
  return hasBundle(skillMdPath) ? bundled(skillMdPath) : read(skillMdPath);
}

function activeSkillFiles(dir: string, out: string[] = []) {
  for (const entry of readdirSync(resolve(ROOT, dir))) {
    const abs = resolve(ROOT, dir, entry);
    const rel = relative(ROOT, abs);
    const stat = statSync(abs);
    if (stat.isDirectory()) {
      if (entry === "archive" || entry === "node_modules" || entry === ".git") continue;
      activeSkillFiles(rel, out);
    } else if (stat.isFile() && entry === "SKILL.md") {
      out.push(rel);
    }
  }
  return out;
}

// Alignment skills now carry the convention in a sibling ALIGNMENT-PAGE.md;
// the SKILL.md only holds a short stub heading that points at it.
const activeAlignmentSkillFiles = [...activeSkillFiles("global"), ...activeSkillFiles("packs")]
  .filter((path) => {
    const content = read(path);
    if (!/^#{2,3} Alignment Page$/m.test(content)) return false;
    // Bundled skills carry the convention in ALIGNMENT-PAGE.md; bespoke
    // skip-listed skills keep the full contract inline.
    return hasBundle(path) || content.includes("**Gate YAML contract.**");
  })
  .sort();

const generatedAlignmentSkillFiles = activeAlignmentSkillFiles.filter(hasBundle);

describe("alignment page gate contract", () => {
  it("points core skills at the bundled convention instead of CLAUDE.md", () => {
    for (const path of coreSkills) {
      const content = read(path);
      expect(content, `${path} alignment heading`).toMatch(/^#{2,3} Alignment Page$/m);
      expect(content, `${path} no dangling CLAUDE.md pointer`).not.toContain(
        "Follow the shared Alignment Page convention in CLAUDE.md",
      );
      if (hasBundle(path)) {
        // Generator-owned skills point their stub at the bundled file.
        expect(content, `${path} references bundled file`).toContain("ALIGNMENT-PAGE.md");
      } else {
        // Bespoke skip-listed skills (e.g. roadmap) keep the gates inline.
        expect(content, `${path} inline gates`).toContain("**Alignment gates.**");
      }
    }
  });

  it("requires gate-based HTML review pages for core planning and research skills", () => {
    for (const path of coreSkills) {
      const content = conventionText(path);
      expect(content, `${path} gates`).toContain("**Alignment gates.**");
      expect(content, `${path} required gate types`).toContain("evidence coverage, assumptions/confidence, scope/non-goals");
      expect(content, `${path} required questions`).toContain("**Required inline questions.**");
      expect(content, `${path} yaml contract`).toContain("**Gate YAML contract.**");
      expect(content, `${path} yaml fields`).toContain("`section`, `gate_type`, `status`");
      expect(content, `${path} in-page assumptions`).toContain("assumptions/confidence");
      expect(content, `${path} proposed file changes`).toContain("proposed file changes");
      expect(content, `${path} pre-approval stop`).toContain("the next action is review of the HTML alignment page");
    }
  });

  it("defines artifact destination and proposed file changes as separate output gate concepts", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} output gate section`).toContain("**Output gate semantics and de-duplication.**");
      expect(content, `${path} artifact destination semantics`).toContain(
        "The `artifact destination` gate approves the durable or review artifact location",
      );
      expect(content, `${path} proposed file changes semantics`).toContain(
        "The `proposed file changes` gate approves downstream mutation scope, timing, and the allowed file set",
      );
      expect(content, `${path} separate approval concepts`).toContain("Keep these as separate approval concepts");
    }
  });

  it("combines duplicate path-only output gates visually while separating distinct decisions", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} duplicate path-only gates combined`).toContain(
        "If both gate concepts ask only the same path-destination question, render one combined visual section such as `Artifact Destination & Proposed File Changes`",
      );
      expect(content, `${path} distinct decisions separated`).toContain(
        "If the decisions differ, render separate gates",
      );
    }
  });

  it("preserves output gate_type values in final YAML without duplicating combined sections", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} no visual-title duplication`).toContain(
        "Do not duplicate YAML entries solely because one visual section title names both concepts",
      );
      expect(content, `${path} separate yaml entries only for separate decisions`).toContain(
        "emit separate YAML items only when the page asked separate decisions",
      );
      expect(content, `${path} gate_type preserved`).toContain(
        "keep each item's `gate_type` equal to the decision it controls (`artifact destination` or `proposed file changes`)",
      );
      expect(content, `${path} output target yaml fields`).toContain(
        "optional `target_artifact` or `target_path` when the gate controls file output",
      );
    }
  });

  it("defines review, confirmed, and amended lifecycle states in generated alignment-page conventions", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} lifecycle section`).toContain("**Alignment lifecycle.**");
      expect(content, `${path} review state`).toContain("`review` is the draft/pre-approval page");
      expect(content, `${path} confirmed state`).toContain("`confirmed` is the post-approval page");
      expect(content, `${path} amended state`).toContain("`amended` is a future revision of a confirmed page");
      expect(content, `${path} finished current amendable`).toContain(
        "finished and current for the completed alignment cycle, but it remains amendable",
      );
    }
  });

  it("scopes approval gates, required questions, and final answer compilation to review pages", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} review gates`).toContain("In `review` pages, treat gates");
      expect(content, `${path} review-only finalization blocker`).toContain(
        "A gate blocks finalization only while the page is in `review`",
      );
      expect(content, `${path} confirmed read-only decisions`).toContain(
        "In `confirmed` pages, preserve the gate decisions as read-only approval records",
      );
      expect(content, `${path} review questions`).toContain(
        "In `review` pages, each gate must contain at least one required inline question",
      );
      expect(content, `${path} confirmed no required inputs`).toContain(
        "Confirmed pages must not keep these as required input controls",
      );
      expect(content, `${path} review compile controls`).toContain(
        'In `review` pages, at the bottom of the page, include an ordinary in-flow compile section with a "Compile Feedback YAML" button',
      );
      expect(content, `${path} review pre-approval stop`).toContain(
        "While an alignment page is in `review`, the next action is review of the HTML alignment page",
      );
    }
  });

  it("requires confirmed pages to remove approval UI while preserving approval and evidence records", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} confirmed contract`).toContain("**Confirmed page contract.**");
      expect(content, `${path} confirmed status`).toContain("`alignment_status: confirmed`");
      expect(content, `${path} confirmation metadata`).toContain(
        "confirmation date, confirmed artifact paths, approval source summary",
      );
      expect(content, `${path} finished amendable language`).toContain("finished but amendable language");
      expect(content, `${path} remove gate ui`).toContain(
        'Remove required gate-question controls, the final "Compile Answers" button, unanswered-question counters',
      );
      expect(content, `${path} preserve approval record`).toContain("Preserve the full research and approval record");
      expect(content, `${path} preserve evidence`).toContain(
        "answered decisions, user requests, evidence matrix, assumptions/confidence register, source gaps, proposed file changes",
      );
      expect(content, `${path} changed during confirmation`).toContain("what changed during confirmation");
      expect(content, `${path} research caveats`).toContain("Keep research caveats visible");
      expect(content, `${path} not immutable`).toContain(
        "`confirmed` means approved/current, not immutable or permanently true",
      );
    }
  });

  it("handles final approval YAML by applying edits before confirmation or returning unresolved feedback to review", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} after approval section`).toContain("**After approval handling.**");
      expect(content, `${path} edits before confirmation`).toContain(
        "If it contains approvals plus user-requested edits, first update the page, research, and proposed canonical artifacts",
      );
      expect(content, `${path} confirm after writing`).toContain(
        "then write or update the approved canonical artifacts and confirm the page",
      );
      expect(content, `${path} unresolved feedback returns to review`).toContain(
        "If it contains `needs-clarification`, unresolved `down` feedback, or any unresolved negative feedback",
      );
      expect(content, `${path} archive before replace`).toMatch(
        /Before replacing any existing alignment page, archive it to `docs\/history\/archive\/YYYY-MM-DD\/HHMMSS\/alignment\/[^`]+\.html`/,
      );
      expect(content, `${path} future amendments`).toContain(
        "Future amendments to confirmed pages follow the same archive-first rule",
      );
    }
  });

  it("keeps report-only research gates explicit", () => {
    for (const path of researchQualitySkills) {
      const content = conventionText(path);
      expect(content, `${path} report-only gates`).toContain("**Report-only research gates.**");
      expect(content, `${path} evidence coverage`).toContain("evidence coverage");
      expect(content, `${path} recommended path`).toContain("recommended path");
      expect(content, `${path} approval gates`).toContain("approval gates");
    }
  });

  it("defines staged working-packet handling for report-first research", () => {
    expect(generatedAlignmentSkillFiles.length).toBeGreaterThan(100);
    for (const path of generatedAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} staged research section`).toContain("**Staged research workflow.**");
      expect(content, `${path} stage 1`).toContain("Stage 1 performs research and clarification");
      expect(content, `${path} flat working packet`).toMatch(
        /`research\/_working\/preliminary-[^`]+-research\.md`/,
      );
      expect(content, `${path} product-path working packet`).toMatch(
        /`research\/\{slug\}\/_working\/preliminary-[^`]+-research\.md`/,
      );
      expect(content, `${path} no canonical stage 1 writes`).toContain(
        "Do not create or update canonical research, spec, or task files in Stage 1",
      );
      expect(content, `${path} stage 2`).toContain("Stage 2 consumes the working packet");
      expect(content, `${path} full preliminary packet`).toContain("renders the full preliminary packet");
      expect(content, `${path} feedback remains stage 2`).toContain(
        "Feedback-only YAML revises the working packet and review page, then remains in Stage 2",
      );
      expect(content, `${path} final yaml gating`).toContain(
        "Stage 3 consumes final compiled YAML only when it has no unresolved `needs-clarification`",
      );
      expect(content, `${path} archive working packet`).toContain(
        "archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`",
      );
      expect(content, `${path} remove working packet`).toContain("remove the active working packet");
      expect(content, `${path} confirmed page`).toContain("convert the page to `confirmed`");
    }
  });

  it("requires research output pages to preserve evidence, uncertainty, and decision context", () => {
    for (const path of researchQualitySkills) {
      const content = conventionText(path);
      expect(content, `${path} research quality contract`).toContain("**Research quality contract.**");
      expect(content, `${path} claim/evidence/inference split`).toContain("`claims` (what the report concludes), `evidence`");
      expect(content, `${path} no context loss`).toContain("**No context loss rule.**");
      expect(content, `${path} evidence matrix`).toContain("evidence matrix");
      expect(content, `${path} confidence register`).toContain("confidence/assumption register");
      expect(content, `${path} rejected findings`).toContain("rejected or lower-confidence findings");
      expect(content, `${path} source gaps`).toContain("source coverage gaps");
      expect(content, `${path} downstream implications`).toContain("downstream implications");
      expect(content, `${path} research completeness gate`).toContain("**Research completeness gate.**");
      expect(content, `${path} evidence sufficiency question`).toContain("whether the evidence is sufficient for the recommendation");
    }
  });

  it("requires source coverage categories for web research and file evidence for repo research", () => {
    for (const path of researchQualitySkills) {
      const content = conventionText(path);
      expect(content, `${path} source coverage expectations`).toContain("**Source coverage expectations.**");
      expect(content, `${path} web source categories`).toContain("competitors, pricing, user sentiment, positioning, integrations, and recent activity");
      expect(content, `${path} repo evidence`).toContain("file/path evidence");
      expect(content, `${path} fact inference distinction`).toContain("distinguish observed code facts from inferred product, workflow, or user conclusions");
    }
  });

  it("preserves skill-specific gate language", () => {
    expect(conventionText("packs/product-design/codex/ui-interview/SKILL.md")).toContain("Render surfaced assumptions, the UI or content requirements manifest");
    expect(conventionText("packs/product-design/codex/ux-variations/SKILL.md")).toContain("Render surfaced assumptions, variation manifest, concept selection");
    expect(conventionText("packs/customer-lifecycle/codex/journey-map/SKILL.md")).toContain("**Journey research translation.**");
    expect(conventionText("packs/research-admin/codex/research-roadmap/SKILL.md")).toContain("**Research-roadmap translation.**");
    expect(conventionText("global/codex/idea-scope-brief/SKILL.md")).toContain(
      "Apply the shared artifact-destination/proposed-file-changes de-duplication rule",
    );
    expect(conventionText("packs/product-design/codex/feature-interview/SKILL.md")).toContain(
      "combine them into one visual gate when they ask only the same path-destination question",
    );
  });

  it("requires every active alignment page to copy compiled YAML ergonomically", () => {
    expect(activeAlignmentSkillFiles.length).toBeGreaterThan(10);
    for (const path of activeAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} automatic copy`).toContain("automatically attempt to copy the YAML to the clipboard");
      expect(content, `${path} copy button`).toContain('explicit "Copy YAML" button');
      expect(content, `${path} fallback`).toContain("fall back to selecting the textarea contents");
      expect(content, `${path} old click-to-copy-only contract`).not.toContain("Display the YAML in a read-only, click-to-copy textarea.");
    }
  });

  it("allows feedback-only YAML before final gate answers are complete", () => {
    expect(activeAlignmentSkillFiles.length).toBeGreaterThan(10);
    for (const path of activeAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} feedback-only contract`).toContain("**Feedback-only YAML contract.**");
      expect(content, `${path} compile feedback`).toContain("Compile Feedback YAML");
      expect(content, `${path} early enable`).toContain("even if required inline gate questions are unanswered");
      expect(content, `${path} revision status`).toContain("`feedback_status: revision-request`");
      expect(content, `${path} not approved`).toContain("`approval_status: not-approved`");
      expect(content, `${path} unanswered questions`).toContain("`unanswered_required_questions`");
      expect(content, `${path} emphasize feedback value`).toContain("`feedback` (`emphasize`, `down`, or `needs-clarification`)");
      expect(content, `${path} requested action`).toContain("`requested_agent_action`");
      expect(content, `${path} emphasize action`).toContain("add-weight-to-section");
      expect(content, `${path} emphasize semantics`).toContain("this is a revision request, not approval");
      expect(content, `${path} investigate action`).toContain("investigate-and-revise");
      expect(content, `${path} clarification action`).toContain("clarify-before-approval");
      expect(content, `${path} stale up feedback value`).not.toContain("`feedback` (`up`, `down`, or `needs-clarification`)");
      expect(content, `${path} stale accept action`).not.toContain("accept-as-is");
      expect(content, `${path} do not require gates for feedback`).toContain(
        "Do not require the user to answer every gate before sending emphasis requests, negative feedback, or clarification needs",
      );
    }
  });

  it("uses top in-flow navigation and forbids generated sidebars or sticky compile banners", () => {
    expect(activeAlignmentSkillFiles.length).toBeGreaterThan(10);
    for (const path of activeAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} layout contract`).toContain("**Page layout contract.**");
      expect(content, `${path} top toc`).toContain('top-of-page "Table of Contents" section');
      expect(content, `${path} in flow toc`).toContain("Keep the Table of Contents in normal document flow");
      expect(content, `${path} no sidebar nav`).toContain("Do not use a sidebar, side rail, drawer, split-shell layout, or sticky navigation");
      expect(content, `${path} no sticky bottom banner`).toContain(
        "Do not place compile, copy, feedback, or answer controls in a sticky or fixed bottom banner/footer",
      );
      expect(content, `${path} bottom compile in flow`).toContain(
        "Bottom compile controls must appear as ordinary content in a bottom compile section",
      );
    }
  });

  it("keeps feedback-only YAML both local to selected sections and aggregated at the bottom", () => {
    expect(activeAlignmentSkillFiles.length).toBeGreaterThan(10);
    for (const path of activeAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} dual feedback placement`).toContain(
        "Provide feedback-only YAML in two places: locally under each selected section-feedback textarea, and globally in the bottom compile section",
      );
      expect(content, `${path} local feedback textarea`).toContain("section-feedback textarea");
      expect(content, `${path} separate from gate inputs`).toMatch(
        /separate from (required )?gate-question text inputs/,
      );
      expect(content, `${path} appears despite gate inputs`).toMatch(
        /even when (the same section )?(also )?has (required )?gate questions/,
      );
      expect(content, `${path} local yaml textarea`).toContain(
        "read-only YAML textarea directly under that section",
      );
      expect(content, `${path} local single feedback entry`).toContain(
        "single selected section-feedback entry",
      );
      expect(content, `${path} bottom aggregated feedback`).toContain(
        'The bottom "Compile Feedback YAML" control generates the same YAML shape but aggregates every selected section-feedback entry on the page',
      );
      expect(content, `${path} no sticky bottom feedback`).toContain(
        "Do not render the bottom feedback compile controls as a sticky or fixed banner",
      );
      expect(content, `${path} old bottom feedback ban removed`).not.toContain(
        "Do not place a global feedback-only compile/output banner at the bottom of the page",
      );
      expect(content, `${path} old local-only bottom ban removed`).not.toContain(
        "feedback-only YAML output belongs under each selected section feedback textarea, not in the bottom area",
      );
    }
  });

  it("keeps final answer compilation at the bottom of the page", () => {
    expect(activeAlignmentSkillFiles.length).toBeGreaterThan(10);
    for (const path of activeAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} bottom compile answers`).toMatch(
        /(?:In `review` pages, at|At) the bottom of the page, include an ordinary in-flow compile section with a "Compile Feedback YAML" button.*separate "Compile Answers" button/,
      );
      expect(content, `${path} bottom compile section`).toMatch(
        /(?:In `review` pages, at|At) the bottom of the page, include an ordinary in-flow compile section with a "Compile Feedback YAML" button/,
      );
      expect(content, `${path} no persistent banner`).toContain(
        "The bottom compile section must not be sticky, fixed, floating, or styled as a persistent banner",
      );
    }
  });

  it("requires compiled YAML to identify the source alignment page", () => {
    expect(activeAlignmentSkillFiles.length).toBeGreaterThan(10);
    for (const path of activeAlignmentSkillFiles) {
      const content = conventionText(path);
      expect(content, `${path} feedback alignment_page`).toMatch(
        /The local feedback compile generates YAML with `alignment_page: alignment\/[^`]+\.html`, `feedback_status: revision-request`/,
      );
      expect(content, `${path} final alignment_page`).toMatch(
        /`alignment_page: alignment\/[^`]+\.html`, `approval_status: ready-for-agent-review`/,
      );
      expect(content, `${path} repo-relative path source`).toMatch(
        /Populate `alignment_page` from the known repo-relative output path used to write the HTML page/,
      );
    }
  });

  it("leaves skip-list skills excluded from alignment requirements", () => {
    for (const path of skippedSkills) {
      const content = read(path);
      expect(content, `${path} skipped`).not.toContain("**Alignment gates.**");
      expect(hasBundle(path), `${path} has no bundled ALIGNMENT-PAGE.md`).toBe(false);
    }
  });

  it("bundles the convention so it travels with pointer-form skills", () => {
    // Pointer-form skills used to carry only a dangling reference to CLAUDE.md
    // (the afps-tracker incident). They must now ship a sibling
    // ALIGNMENT-PAGE.md with the full convention and their skill-specific gates.
    const pointerSkills = [
      "global/claude/idea-scope-brief/SKILL.md",
      "global/codex/idea-scope-brief/SKILL.md",
      "packs/customer-lifecycle/claude/journey-map/SKILL.md",
      "packs/customer-lifecycle/codex/journey-map/SKILL.md",
    ];
    for (const path of pointerSkills) {
      const skill = read(path);
      expect(hasBundle(path), `${path} has bundled ALIGNMENT-PAGE.md`).toBe(true);
      expect(skill, `${path} stub references bundle`).toContain("ALIGNMENT-PAGE.md");
      expect(skill, `${path} no dangling CLAUDE.md pointer`).not.toContain(
        "Follow the shared Alignment Page convention in CLAUDE.md",
      );
      const page = bundled(path);
      expect(page, `${path} bundle has gate contract`).toContain("**Gate YAML contract.**");
      expect(page, `${path} bundle has required questions`).toContain("**Required inline questions.**");
    }
    expect(bundled("global/claude/idea-scope-brief/SKILL.md"), "idea-scope-brief gates").toContain(
      "**Idea-specific gates.**",
    );
    expect(bundled("packs/customer-lifecycle/codex/journey-map/SKILL.md"), "journey-map gates").toContain(
      "**Journey research translation.**",
    );
  });

  it("keeps every bundled ALIGNMENT-PAGE.md in sync with CLAUDE.md (drift guard)", () => {
    const out = execFileSync("node", ["scripts/upgrade-alignment-page.mjs", "--dry-run"], {
      cwd: ROOT,
      encoding: "utf8",
    });
    const updated = out.match(/^Updated: (\d+)$/m)?.[1];
    const bundles = out.match(/^Bundled files written: (\d+)$/m)?.[1];
    expect(updated, `generator reported drift:\n${out}`).toBe("0");
    expect(bundles, `generator reported bundle drift:\n${out}`).toBe("0");
  });
});
