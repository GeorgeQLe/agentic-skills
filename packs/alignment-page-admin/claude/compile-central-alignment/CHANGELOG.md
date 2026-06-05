# Changelog

## v0.1 - 2026-06-05

- Open or focus the regenerated central `alignment/index.html` with `node scripts/open-html-page.mjs alignment/index.html --browser auto`.
- Require reporting the opener status: `focused`, `opened`, `fallback-opened`, `blocked`, or `failed`.
- Clarify that `blocked` opener status does not fail the skill when the index was generated and verified.
- Preserve the index as a local convenience artifact that is not committed or pushed by default.

## v0.0 - 2026-05-30

- Initial central alignment index generation skill.
