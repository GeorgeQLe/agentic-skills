---
name: compile-central-alignment
description: Generate a central alignment/index.html table of contents for all alignment pages in the current repo
type: ops
version: v0.3
---

# Compile Central Alignment

Generate a browsable `alignment/index.html` that links to every alignment page in the current repository. Works in any repo that has an `alignment/` directory.

## Process

1. **Locate alignment directory:**
   - Look for `alignment/` at the project root.
   - If the directory does not exist, stop and inform the user.

2. **Scan alignment pages:**
   - Enumerate `alignment/*.html`, excluding `index.html` itself.
   - For each file, extract:
     - `<title>` text (fallback: filename without extension)
     - First `<h1>` text (fallback: title)
     - First `<p class="meta">` text (fallback: empty)
     - `data-alignment-category` attribute from the `<html>` element (fallback: see prefix matching below)
     - File modification date via `git log -1 --format=%aI -- <path>` (fallback: filesystem mtime)

3. **Group and sort entries:**
   - **Category assignment:** For each page, determine its category using this precedence:
     1. `data-alignment-category` attribute value from the `<html>` element, if present.
     2. Match the filename (without extension) against the convention's skill-prefix lists:
        - `research` — prefixes: `devtool-positioning`, `devtool-adoption`, `devtool-monetization`, `devtool-user-map`, `devtool-workflow`, `devtool-dx-journey`, `devtool-integration-map`, `deep-research`, `repo-glossary`
        - `product-design` — prefixes: `idea-scope-brief`, `fork-idea-branch`, `animation-design-planner`, `skills-showcase`, `skills-inventory`
        - `utility` — prefixes: `investigate`, `session-triage`, `prompt-history-backfill`
        - `qa-meta` — prefixes: `expert-review`, `benchmark`, `targeted-skill-builder`, `devtool-docs-audit`
        - `ops-analysis` — prefixes: `analyze-sessions`, `canonical-workflow`, `run-batch`
     3. If no prefix matches, default to `research`.
   - **Category order:** Group pages by category in this fixed order: research → product-design → utility → qa-meta → ops-analysis.
   - **Within each category:** Sort by modification date descending.

4. **Generate `alignment/index.html`:**
   - Self-contained HTML, no external dependencies.
   - Visual style matching existing alignment pages (dark-mode, same CSS variables, fonts, layout):
     - `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --panel: #161b22;`
     - `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`, `max-width: 1080px`, `line-height: 1.45`
     - `body { background: var(--bg); color: var(--text); }`
   - Page header: `<h1>Alignment Pages</h1>` with total page count and generation timestamp in a `<p class="meta">`.
   - Text filter input: an `<input>` that live-filters the card grid by title, description, and date as the user types. The filter searches across all category sections, hiding/showing individual cards and hiding category headings when all their cards are filtered out. Inline `<script>` — no external JS.
   - Category sections: render each non-empty category as a section with:
     - `<h2>` heading using the category display name and a count of pages in that category (e.g., "Research (7)")
     - Display names: Research, Product Design & Spec, Utility & Maintenance, QA & Meta-Skill Improvement, Ops & Session Analysis
     - Card grid within that section: responsive CSS grid (`repeat(auto-fill, minmax(300px, 1fr))`), each card is a `.panel` link block containing:
       - Linked title (`<h3>`) pointing to the file (relative `href`)
       - Description line from the meta paragraph
       - Date line in muted text
   - Skip categories that have zero pages — do not render an empty heading.
   - All links are relative (same directory), no absolute or external URLs.

5. **Open or focus the central index:**
   - Verify `alignment/index.html` was written and still works as a direct `file://` page.
   - Run `npx skillpacks alignment pages open alignment/index.html --browser auto`.
   - In this source checkout only, if the packaged CLI is unavailable, fall back to `node scripts/open-html-page.mjs alignment/index.html --browser auto`.
   - Report the opener script status exactly as one of `focused`, `opened`, `fallback-opened`, `blocked`, or `failed`.
   - If the status is `blocked`, report the blocked open attempt; it does not fail this skill when `alignment/index.html` was generated and verified.

## Constraints

- Do not modify any existing alignment page — only create or overwrite `alignment/index.html`.
- Do not commit or push `alignment/index.html` by default — the index is a local convenience artifact, regenerated fresh each time.
- If no `.html` files exist in `alignment/` (besides `index.html`), generate an empty-state page with a message instead of an empty grid.
- The generated HTML must work when opened directly as a `file://` URL — no server required.
- Do not open individual alignment pages from this skill; individual alignment-producing skills handle their own review pages, and this skill opens or focuses only the central index.

## Default Shipping Contract

- **No commit/push.** Produce a local convenience file that is regenerated on demand. Do not commit `alignment/index.html` to the repository unless the user explicitly asks.
- **Default next-step routing:** After generating the index, suggest contextual next steps based on what was found:
  - If any pages have old modification dates or the scan revealed outdated content: `Recommended next command: /upgrade-alignment-pages`
  - If the index is freshly built with all pages current: confirm completion with no further routing
  - Do not default to `/skills` as a generic fallback
