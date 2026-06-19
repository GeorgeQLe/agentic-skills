---
name: icon-handler
description: Audit and apply project-root icon assets to favicon, app icon, Apple touch icon, and manifest surfaces
type: execution
version: v0.1
required_conventions: [alignment-page]
argument-hint: "[audit|fix] [asset filename]"
---

# Icon Handler

Use this skill when a user adds a desired icon image at the project root and wants it applied consistently across website/app icon surfaces. It works like `/hygiene`: audit first, show findings and a correction plan, then modify files only after the user explicitly approves `fix`.

## Process

### 1. Determine Mode and Asset

Parse `$ARGUMENTS`:

- **Mode:** `audit` by default; `fix` applies approved corrections.
- **Asset:** optional filename or path. If omitted, search only the project root for likely icon assets.

Candidate asset names, in priority order:

1. User-provided path.
2. Root files matching `*-icon.png`, `*icon.png`, `*logo.png`, `favicon.png`, or `app-icon.png`.
3. Root SVG equivalents only when the app toolchain can rasterize them safely.

If multiple candidates exist, stop and ask which one to use.

### 2. Identify App Framework

Audit only what is relevant to the repository:

- **Next App Router:** `src/app/favicon.ico`, `src/app/icon.png`, `src/app/apple-icon.png`, `public/manifest.webmanifest`, `public/apple-touch-icon.png`, and `metadata.icons` in `src/app/layout.tsx`.
- **Next Pages Router:** `public/favicon.ico`, `public/icon.png`, `public/app-icon.png`, `public/apple-touch-icon.png`, `_document` or page/head icon links, and any manifest.
- **Vite/React/static:** `public/favicon.ico`, `public/icon.png`, `public/app-icon.png`, `public/apple-touch-icon.png`, `index.html`, and any manifest.
- **Other frameworks:** report the detected framework and only apply conventional public-root assets unless the framework has clear local icon conventions.

Do not assume `icon.ico` is a standard favicon name. The conventional browser-probed file is `favicon.ico`.

### 3. Audit Icon Surfaces

Inspect without modifying:

- Source asset format and dimensions using available tools (`file`, `sips`, `identify`, or framework tooling).
- Existing favicon/app icon files and whether they still contain stale assets.
- Metadata or HTML links for:
  - `/favicon.ico`
  - `/icon.png`
  - `/app-icon.png`
  - `/apple-touch-icon.png`
  - Next App Router `/apple-icon.png`
  - `manifest.webmanifest`
- Whether generated build output or static HTML emits `rel="icon"`, `rel="shortcut icon"`, and `rel="apple-touch-icon"` links.

### 4. Produce Audit Report

Report:

- Detected framework and project root.
- Chosen source asset and dimensions.
- Existing icon surfaces found.
- Missing, stale, or non-standard surfaces.
- Proposed file writes, conversions, and metadata edits.
- Verification commands to run after changes.

Stop after the audit unless the user invoked `fix` or explicitly approves the proposed writes.

### 5. Apply Fixes After Approval

Only after approval:

- Preserve the source asset at its original path unless the user asks to move it.
- Copy the source asset to PNG surfaces that should remain full-size or app-install size.
- Generate `favicon.ico` from a smaller source when conversion tools are available. Prefer:
  - `magick`/ImageMagick when installed.
  - macOS `sips` as a fallback: create a 256px PNG first, then convert that PNG to ICO.
  - If no converter exists, stop and report the exact missing command rather than leaving a stale ICO.
- For Next App Router, prefer:
  - `src/app/favicon.ico`
  - `src/app/icon.png`
  - `src/app/apple-icon.png`
  - `public/apple-touch-icon.png`
  - `public/icon.png`
  - `public/app-icon.png`
- Add or update manifest icons when a manifest exists or when app-install behavior is expected.
- Update Next metadata or static HTML links so the generated site references the conventional paths.

### 6. Verify

Run the smallest relevant checks:

- File format checks for generated assets.
- Framework type/lint checks when metadata or source code changed.
- Production build or static render when available.
- Generated HTML/build-output search for `favicon.ico`, `apple-touch-icon`, `icon.png`, and `manifest.webmanifest`.

For Next App Router, verify `.next/server/app/favicon.ico.body`, `.next/server/app/icon.png.body`, and `.next/server/app/apple-icon.png.body` when a build was run.

### 7. Document and Ship

If the project has task docs, add a concise review note with:

- Source icon path.
- Files changed.
- Verification results.
- Any cache caveat: browsers and iOS may require hard refresh, cache clear, reinstalling the home-screen icon, or waiting for deployment/CDN cache expiry.

Commit and push if the user asked to ship or the active workflow requires it.

## Output

In audit mode:

```text
## Icon Audit

Framework: Next App Router
Source asset: calc-mascot-icon.png (1024x1024 PNG)

Findings:
- Missing /apple-touch-icon.png
- Stale src/app/favicon.ico

Proposed fix:
- Generate src/app/favicon.ico from the source icon
- Copy source to src/app/icon.png, src/app/apple-icon.png, public/icon.png, public/app-icon.png, public/apple-touch-icon.png
- Update metadata.icons and manifest.webmanifest

Approval needed: reply "fix" to apply these changes.
```

In fix mode, include the same report plus changed files, validation, and next command.

## Constraints

- Read-only by default.
- Do not overwrite existing branded icon assets without showing the diff/format evidence and getting approval.
- Do not invent framework conventions; verify local framework and file layout first.
- Do not use `icon.ico` as the default favicon path.
- Do not commit generated binary assets until format checks pass.
- Do not touch unrelated visual branding, OG images, logos, or marketing copy unless the user explicitly asks.
- Prefer project-local tooling. Do not install image conversion dependencies without explicit approval.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/icon-handler-{topic}.html`.

## Default Shipping Contract

- **Next work:** if audit finds issues and approval is missing, the next work is "approve `/icon-handler fix <asset>`".
- **Recommended next command:** `/icon-handler fix <asset>`
