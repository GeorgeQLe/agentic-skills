---
name: compile-central-alignment
description: Generate a central alignment/index.html table of contents for all alignment pages in the current repo
type: utility
version: v0.0
---

# Compile Central Alignment

Invoke as `$compile-central-alignment`.

Generate a browsable `alignment/index.html` linking to every alignment page in the current repository. Works in any repo with an `alignment/` directory.

## Workflow

1. Locate `alignment/` at the project root; stop if absent.
2. Scan `alignment/*.html` (exclude `index.html`), extract per-file: `<title>`, first `<h1>`, first `<p class="meta">`, modification date.
3. Sort by modification date descending.
4. Generate `alignment/index.html` — self-contained HTML with:
   - Visual style matching existing alignment pages (same CSS variables, fonts, layout)
   - Card grid with linked titles, descriptions, dates
   - Text filter input for quick search
   - Page count and generation timestamp
   - All relative links, no external dependencies
5. Open in browser (WSL-aware: `wslpath -w` + `cmd.exe /c start`).

## Constraints

- Do not modify existing alignment pages — only create/overwrite `alignment/index.html`.
- Do not commit or push — local convenience artifact, regenerated fresh each time.
- Empty-state page if no `.html` files found (besides `index.html`).
- Must work as `file://` URL — no server required.

## Default Shipping Contract

- **No commit/push.** Local convenience file, regenerated on demand.
- **Default next-step routing:** After generating the index, suggest contextual next steps based on what was found:
  - If any pages have old modification dates or the scan revealed outdated content: `Recommended next command: $upgrade-alignment-pages`
  - If the index is freshly built with all pages current: confirm completion with no further routing
  - Do not default to `$skills` as a generic fallback
