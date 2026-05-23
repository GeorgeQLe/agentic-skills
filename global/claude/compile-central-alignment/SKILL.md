---
name: compile-central-alignment
description: Generate a central alignment/index.html table of contents for all alignment pages in the current repo
type: utility
version: v0.0
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
     - File modification date via `git log -1 --format=%aI -- <path>` (fallback: filesystem mtime)

3. **Sort entries:**
   - Order by modification date, most recent first.

4. **Generate `alignment/index.html`:**
   - Self-contained HTML, no external dependencies.
   - Visual style matching existing alignment pages (same CSS variables, fonts, layout):
     - `--ink: #202124`, `--muted: #5f6368`, `--line: #dadce0`, `--panel: #f8fafd`, `--accent: #0b57d0`, `--bg: #ffffff`
     - `font-family: Arial, Helvetica, sans-serif`, `max-width: 1080px`, `line-height: 1.45`
   - Page header: `<h1>Alignment Pages</h1>` with page count and generation timestamp in a `<p class="meta">`.
   - Text filter input: an `<input>` that live-filters the card grid by title, description, and date as the user types. Inline `<script>` — no external JS.
   - Card grid: responsive CSS grid (`repeat(auto-fill, minmax(300px, 1fr))`), each card is a `.panel` link block containing:
     - Linked title (`<h3>`) pointing to the file (relative `href`)
     - Description line from the meta paragraph
     - Date line in muted text
   - All links are relative (same directory), no absolute or external URLs.

5. **Open in browser (WSL-aware):**
   - Attempt to open `alignment/index.html` in the default browser.
   - On WSL, convert the path with `wslpath -w` and use `cmd.exe /c start`.
   - Report whether the open succeeded or was blocked. A blocked open does not fail the skill.

## Constraints

- Do not modify any existing alignment page — only create or overwrite `alignment/index.html`.
- Do not commit or push — the index is a local convenience artifact, regenerated fresh each time.
- If no `.html` files exist in `alignment/` (besides `index.html`), generate an empty-state page with a message instead of an empty grid.
- The generated HTML must work when opened directly as a `file://` URL — no server required.

## Default Shipping Contract

- **No commit/push.** This skill produces a local convenience file that is regenerated on demand. Do not commit `alignment/index.html` to the repository.
- **Default next-step routing:** `Recommended next command: /skills`
