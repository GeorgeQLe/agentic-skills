---
version: "1.0"
name: "gSkillPacks Design System"
colors:
  ink: "#111827"
  muted: "#5B6472"
  paper: "#F7F8F5"
  panel: "#FFFFFF"
  line: "#CFD8E3"
  primary: "#00D4AA"
  primary-strong: "#00A88A"
  coral: "#ff6b6b"
  coral-strong: "#e85555"
  success: "#0F8A5F"
  warning: "#A86700"
  error: "#B42318"
  terminal-background: "#101827"
  terminal-border: "#243044"
  terminal-text: "#D8F3DC"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(3rem, 7.2vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.92
  section:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(2rem, 5vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 0.98
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  lede:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "SFMono-Regular, Consolas, Liberation Mono, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.5
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "18px"
  "2xl": "22px"
  "3xl": "24px"
  section: "76px"
  mobile-section: "52px"
  container-gutter: "32px"
  mobile-container-gutter: "24px"
rounded:
  none: "0"
  sm: "4px"
  md: "8px"
  lg: "12px"
  pill: "999px"
elevation:
  blueprint-panel: "0 18px 50px rgba(17, 24, 39, 0.08)"
  card: "0 4px 16px rgba(17, 24, 39, 0.06)"
layout:
  container: "min(1180px, calc(100% - 32px))"
  mobile-container: "min(100% - 24px, 1180px)"
  desktop-grid: "repeat(12, minmax(0, 1fr))"
  mobile-grid: "repeat(4, minmax(0, 1fr))"
  blueprint-grid-size: "48px"
  panel-grid-size: "24px"
  header-height: "60px"
components:
  button:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.panel}"
    border: "1px solid {colors.ink}"
    rounded: "{rounded.lg}"
    minHeight: "44px"
    paddingX: "15px"
    paddingY: "10px"
  secondary-button:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.line}"
    rounded: "{rounded.lg}"
    minHeight: "44px"
    paddingX: "15px"
    paddingY: "10px"
    hoverTextColor: "{colors.coral-strong}"
  blueprint-panel:
    backgroundColor: "{colors.panel}"
    border: "1px solid {colors.line}"
    rounded: "{rounded.none}"
    padding: "{spacing.2xl}"
    shadow: "{elevation.blueprint-panel}"
  card:
    backgroundColor: "{colors.panel}"
    border: "1px solid {colors.line}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
    shadow: "{elevation.card}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    border: "2px solid {colors.ink}"
    rounded: "{rounded.pill}"
    paddingX: "1rem"
    paddingY: "0.4rem"
    fontSize: "0.8rem"
    fontWeight: 600
    activeBackgroundColor: "{colors.coral}"
    activeBorderColor: "{colors.coral}"
    activeTextColor: "#FFFFFF"
  lab-notebook:
    backgroundColor: "#f8f0ff"
    border: "1px solid {colors.line}"
    rounded: "{rounded.none} {rounded.none} {rounded.lg} {rounded.lg}"
    accentStrip: "{colors.coral}"
    tiltMax: "0.5deg"
    padding: "1.5rem 1.75rem"
    shadow: "2px 4px 16px rgba(17, 24, 39, 0.08)"
  form-control:
    backgroundColor: "{colors.panel}"
    border: "1px solid {colors.line}"
    rounded: "{rounded.sm}"
    minHeight: "44px"
    paddingX: "{spacing.md}"
    paddingY: "10px"
---

## Overview

The gSkillPacks visual system blends Swiss grid discipline with playful blueprint energy: neutral paper foundations, teal blueprint construction lines, progressive corner rounding, coral warmth accents, bounce-in micro-interactions, and compact technical density. The site should feel like a lab notebook crossed with a productized command center, not a generic SaaS landing page.

Public naming must keep the brand and product layout aligned:

- Use **gSkillPacks** as the visible brand in the header, metadata, footer, hero, and docs.
- Use `gskillpacks.com` as the production domain reference.
- Use "skill packs" language for information architecture: packs, routes, coordinates, workflow nodes, pack maps, catalog entries, and proof surfaces.
- Use `agentic-skills` only for the underlying open-source repository/library, not as the public site brand.

The canonical website implementation lives in the separate `agentic-skills-showcase` repository and imports this repo's public catalog exports from `exports/skills-catalog/v1/`. Historical product and UI decisions live in that showcase repository after the split.

## Colors

Use `{colors.paper}` as the page foundation and `{colors.panel}` for repeated panels, cards, route rows, and form surfaces. Use `{colors.ink}` for primary text, `{colors.muted}` for secondary copy, and `{colors.line}` for dividers and blueprint panel borders.

Blueprint teal is the structural and selection color. Use `{colors.primary}` for active borders, state-machine connectors, focus outlines, selected rows, and measured accents — but sparingly, so it reads as structure rather than decoration. Use `{colors.primary-strong}` for hover text and command labels.

Coral is the warmth and energy accent. Use `{colors.coral}` for active chip states, labels in the lab-notebook sidebar, selected workflow indicators, and decorative warmth on interactive elements. Use `{colors.coral-strong}` for secondary button hover text. Coral should appear at interaction points, not as a background wash.

Status colors are supporting signals: `{colors.success}` for completed/progress artifacts, `{colors.warning}` for provider-missing or overlay states, and `{colors.error}` for validation failure and invalid form states. Do not use success or warning as the only cue for normal body text on the light background; their current contrast is below WCAG AA for normal text.

## Typography

The system uses a precise sans stack for page copy and display text, with `{typography.mono.fontFamily}` reserved for commands, coordinates, tags, terminal playback, labels, and generated metadata. Keep letter spacing at `0`.

Display headings are intentionally tight and oversized on hero surfaces, but compact panels, cards, controls, and catalog rows should use body-scale type. Commands and tags should remain small, uppercase where already implemented, and readable as metadata rather than decorative labels.

## Layout & Spacing

The desktop layout uses `{layout.container}` and a 12-column grid. Compact desktop and mobile states collapse to the 4-column grid at `1080px`; dense controls and maps collapse to one-column behavior at `900px`; mobile gutters tighten at `560px`.

The page background uses a `{layout.blueprint-grid-size}` drafting grid. Panels use a smaller `{layout.panel-grid-size}` grid so repeated components inherit the blueprint motif without requiring custom decoration.

Section spacing is substantial but not airy: `{spacing.section}` on desktop and `{spacing.mobile-section}` on mobile. Repeated items use tight gaps and padding because the product is meant for scanning, comparison, and proof inspection.

## Elevation & Depth

The hero blueprint panel uses `{elevation.blueprint-panel}` as the primary elevation. Interactive cards — route cards, follow cards, catalog rows, workflow items — use `{elevation.card}` to provide subtle lift on hover. Static structural surfaces (metrics, state nodes, terminals) stay flat with a `{colors.line}` border.

## Shapes

The shape language uses progressive corner rounding scaled by component importance: `{rounded.none}` for structural elements (blueprint panels, metrics, state nodes, terminals), `{rounded.sm}` for tags and form controls, `{rounded.md}` for cards and repeated surfaces, `{rounded.lg}` for buttons and step cards, and `{rounded.pill}` for chips and selection pills. This progression keeps technical density on structural surfaces while adding approachability to interactive elements.

## Components

Buttons use at least `44px` touch targets with `{rounded.lg}`. Primary buttons use `{components.button.backgroundColor}` with white text; secondary buttons use `{components.secondary-button.backgroundColor}` with `{colors.ink}` text and coral hover text.

Chips are horizontal pill selectors (`{rounded.pill}`) used for workflow selection. The active chip uses `{colors.coral}` background with white text. Chips provide a scannable, tap-friendly alternative to vertical lists.

The lab-notebook sidebar is a sticky metadata panel with a light lavender wash (`#f8f0ff`), a coral accent strip on the left edge, subtle tilt (max `0.5deg`), and asymmetric rounding (`{rounded.none}` top, `{rounded.lg}` bottom). It displays workflow metadata: title, when-to-use, changes, artifacts, and failure paths.

Panels, cards, catalog rows, proof items, workflow items, route cards, notices, and form panels share the blueprint panel background, `{colors.line}` border, and `{rounded.md}` corners. Interactive cards get `{elevation.card}` on hover. Use cards only for repeated items or framed tools; do not wrap page sections in decorative cards.

Selected workflow items use coral borders plus an inset coral rule (replacing the previous teal selection). Focus states use a `3px` translucent teal outline with `3px` offset. Error inputs use `{colors.error}` border and an inset one-pixel error ring.

Terminal playback uses `{colors.terminal-background}` with `{colors.terminal-text}` and `{typography.mono.fontFamily}`. Keep terminal output horizontally scrollable instead of shrinking code below readability.

## Do's and Don'ts

Do use neutral foundations, teal structural accents, coral warmth accents, green/amber/red status signals, visible construction lines, progressive corner rounding, and compact proof-oriented layouts.

Do use bounce-in animations on step cards and hover scale/lift on interactive elements. Reduce overshoot to `cubic-bezier(0.34, 1.3, 0.64, 1)` to keep energy without bounciness feeling uncontrolled.

Do keep all factual metrics tied to generated data or explicit static proof receipts.

Do test desktop, tablet, and mobile text wrapping when hero copy, blueprint diagrams, catalog rows, or workflow labels change.

Don't use decorative blobs, orbs, bokeh, generic gradient hero art, video-only explanations, or Remotion assets for this V1 static showcase.

Don't let the interface become one-note blue or one-note coral; teal identifies structure, coral identifies interaction energy, and neutral surfaces carry the page.

Don't apply rounding to structural elements (blueprint panels, metrics, state nodes, terminals) — these stay square to preserve the technical blueprint feel.

Don't use `{colors.success}` or `{colors.warning}` as normal body-copy colors on `{colors.paper}` or `{colors.panel}` unless the token is darkened in a future design-system update.
