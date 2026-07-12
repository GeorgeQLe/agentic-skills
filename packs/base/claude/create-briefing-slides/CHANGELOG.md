# Changelog

## v0.3 - 2026-07-12

- Replaced the repository-specific direct-primary override with issue-backed branch and ready pull-request delivery.

## v0.2 - 2026-07-09

- Document the manifest-driven skill-deck pipeline: the per-skill AFPS deck gallery under `briefing-slides/` is generated from `briefing-slides/_deck-manifest.json` via `scripts/generate-briefing-decks.mjs`, with six content beats mapped onto rotating archetypes and the bespoke flagship decks kept out of the manifest. Never hand-edit a generated deck — edit the manifest or the generator and regenerate. Mirrors the convention's new **Manifest-Driven Skill Decks** section.

## v0.1 - 2026-07-08

- Establish the deck as the briefing-first primary review surface producing skills adopt at each interrogation/alignment step on canary: author the dense page inline, then build and auto-open the deck, linking dense pages/sources as references. Route compiled YAML back to the producing command with `reference_pages` / `source_artifacts`, preserve unanswered gates and slide feedback, and mark ready only when every required gate is approved (per the convention's Briefing-First Review Surface and Gate Parity And Partial Decks sections).

## v0.0 - 2026-07-05

- Initial skill for creating slide-first HTML briefing decks that link to dense alignment/interrogation/reference artifacts and open only the deck.
