# Changelog

## v0.2 - 2026-06-06

- Group index entries by category (research, product-design, utility, qa-meta, ops-analysis) instead of a flat date-sorted list.
- Read `data-alignment-category` from each page's `<html>` element; fall back to filename prefix matching; default to `research`.
- Render each non-empty category as a section with `<h2>` heading, display name, and page count.
- Text filter hides individual cards and collapses empty category headings.

## v0.1 - 2026-06-05

- Open or focus the regenerated central `alignment/index.html` with `node scripts/open-html-page.mjs alignment/index.html --browser auto`.
- Require reporting the opener status: `focused`, `opened`, `fallback-opened`, `blocked`, or `failed`.
- Clarify that `blocked` opener status does not fail the skill when the index was generated and verified.
- Preserve the index as a local convenience artifact that is not committed or pushed by default.

## v0.0 - 2026-05-30

- Initial central alignment index generation skill.
