---
name: report-website
description: Convert a Markdown report into clean JSX and build a frontend website that hosts the report as a polished, readable experience
type: execution
version: 1.0.0
argument-hint: "<report.md> [output app/page path]"
---

# Report Website

Invoke as `$report-website`.

Use this skill when the user wants a report written in Markdown turned into a frontend website, app page, or static route whose content is represented as clean JSX components instead of a raw Markdown render. The goal is a readable publication surface: strong hierarchy, responsive layout, accessible content, and source-faithful report sections.

## Workflow

1. **Resolve source and target**
   - Read the requested Markdown report path. If no path was provided, locate likely report files under `reports/`, `docs/`, `research/`, `benchmark/`, or the project root and ask only when there is no clear source.
   - Identify the frontend stack from existing files before creating anything: framework, route conventions, component directories, styling system, icon library, image handling, and test commands.
   - Choose the output location that matches the project:
     - Existing app route or page when a frontend app already exists.
     - A new static page/component inside the established app when there is no report route yet.
     - A minimal static site only when no frontend app exists and the user asked for a standalone website.
   - Inspect `AGENTS.md`, `CLAUDE.md`, `README.md`, `DESIGN.md`, package scripts, and relevant neighboring pages before editing.

2. **Parse the report into structure**
   - Convert Markdown into an explicit content model before writing JSX: title, subtitle, metadata, summary, sections, subsections, tables, lists, callouts, citations, figures, links, code blocks, footnotes, and appendices.
   - Preserve source meaning and ordering. Do not summarize, omit, or rewrite findings unless the user explicitly asks for editorial compression.
   - Normalize links, anchors, heading IDs, dates, numbers, and table columns. Keep citations and source references visible and clickable when present.
   - Flag unsupported Markdown features or missing assets early, then implement the closest source-faithful rendering.

3. **Build clean JSX**
   - Represent the report with typed data, small presentational components, or a straightforward JSX section tree, following the existing framework's conventions.
   - Keep JSX readable: semantic elements, named section components, stable keys, and clear component boundaries. Avoid a single monolithic blob when the report has meaningful structure.
   - Use framework-native routing, metadata, bundling, and asset APIs. Do not add dependencies unless the existing stack cannot reasonably handle the conversion.
   - Escape or encode content safely. Never inject raw HTML from Markdown unless the project already has a trusted sanitizer and the source requires it.
   - Preserve code blocks, tables, quotes, and footnotes with accessible markup and responsive overflow behavior.

4. **Design the reading experience**
   - Build the actual report as the first screen; do not create a marketing landing page for the report.
   - Provide a publication-quality layout with readable measure, strong heading hierarchy, scan-friendly section spacing, and mobile-first responsiveness.
   - Add expected report navigation when the document is long: table of contents, anchor links, sticky or collapsible section nav, progress affordance, or back-to-top controls as appropriate to the existing app.
   - Use the project's design system and UI primitives. If none exist, keep the palette restrained, text-forward, accessible, and not dominated by a single hue family.
   - For report assets, use real supplied images/charts/tables when available. Do not replace report evidence with decorative stock imagery.

5. **Verify behavior and fidelity**
   - Run the repo's relevant lint, typecheck, unit, or build commands.
   - Start the local dev server when needed and inspect the page in a browser at desktop and mobile widths.
   - Check that all sections render, long tables and code blocks do not overflow incoherently, anchors work, links are valid, and text does not overlap.
   - Compare the rendered page against the Markdown source for missing headings, tables, figures, links, and appendix content.
   - Capture screenshots or describe browser verification evidence in the final response.

6. **Document and ship**
   - Record the source Markdown path, generated route/path, verification commands, and any fidelity exceptions.
   - If tracked files changed, commit and push intended changes on the repository primary branch unless the user explicitly asked not to.
   - Leave unrelated dirty files untouched.

## Output

- **Source:** Markdown report path used.
- **Website:** route, page, or static entry point created or updated.
- **Implementation:** key components/data files created or changed.
- **Fidelity:** any report content intentionally transformed, deferred, or unsupported.
- **Validation:** commands and browser checks run.
- **Git:** commit hash and pushed branch when tracked files changed.
- **Next Work:** exact follow-up, or `none` only when there is no useful follow-up.

## Constraints

- Do not use raw Markdown rendering as the final implementation when the user asked for clean JSX. Markdown may be an intermediate parsing source only.
- Do not invent report findings, citations, images, charts, or metrics.
- Do not hide dense report content behind decorative cards, carousels, or marketing sections.
- Do not introduce a new frontend framework inside an existing app unless the user explicitly requests a separate standalone site.
- Do not add broad dependencies for Markdown parsing or UI when the existing project or standard toolchain is sufficient.
- Keep generated JSX maintainable enough for a human to edit the report after conversion.
- Do not skip visual verification for a frontend website.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>`.
- After building the report website, recommend `$uat` when the report is intended for stakeholder review, or `$ship` when implementation is complete but not yet packaged.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping.
