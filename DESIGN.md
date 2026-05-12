---
version: "1.0"
name: "G Skillmap Design System"
colors:
  ink: "#111827"
  muted: "#5B6472"
  paper: "#F7F8F5"
  panel: "#FFFFFF"
  line: "#CFD8E3"
  primary: "#1769E0"
  primary-strong: "#0B4FB3"
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
elevation:
  blueprint-panel: "0 18px 50px rgba(17, 24, 39, 0.08)"
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
    rounded: "{rounded.none}"
    minHeight: "44px"
    paddingX: "15px"
    paddingY: "10px"
  secondary-button:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.line}"
    rounded: "{rounded.none}"
    minHeight: "44px"
    paddingX: "15px"
    paddingY: "10px"
  blueprint-panel:
    backgroundColor: "{colors.panel}"
    border: "1px solid {colors.line}"
    rounded: "{rounded.none}"
    padding: "{spacing.2xl}"
    shadow: "{elevation.blueprint-panel}"
  card:
    backgroundColor: "{colors.panel}"
    border: "1px solid {colors.line}"
    rounded: "{rounded.none}"
    padding: "{spacing.xl}"
  form-control:
    backgroundColor: "{colors.panel}"
    border: "1px solid {colors.line}"
    rounded: "{rounded.none}"
    minHeight: "44px"
    paddingX: "{spacing.md}"
    paddingY: "10px"
---

## Overview

The G Skillmap visual system is a precise site language for `agentic-skills`: Swiss grid discipline, blueprint construction lines, compact technical density, and visible proof. The site should feel like a command center crossed with a productized field manual, not a generic SaaS landing page.

Public naming must keep the brand and product layout aligned:

- Use **G Skillmap** as the visible brand in the header, metadata, footer, hero, and docs.
- Use `gskillmap.com` as the production domain reference.
- Use "skill map" language for information architecture: maps, routes, coordinates, workflow nodes, pack maps, catalog entries, and proof surfaces.
- Use `agentic-skills` only for the underlying open-source repository/library, not as the public site brand.

The canonical implementation source is `docs/skills-showcase/styles.css`; the motivating product and UI decisions live in `specs/skills-showcase-website.md` and `specs/ui-skills-showcase-website.md`.

## Colors

Use `{colors.paper}` as the page foundation and `{colors.panel}` for repeated panels, cards, route rows, and form surfaces. Use `{colors.ink}` for primary text, `{colors.muted}` for secondary copy, and `{colors.line}` for dividers and blueprint panel borders.

Blueprint blue is the action and selection color. Use `{colors.primary}` for active borders, state-machine connectors, focus outlines, selected rows, and measured accents. Use `{colors.primary-strong}` for hover text and command labels.

Status colors are supporting signals: `{colors.success}` for completed/progress artifacts, `{colors.warning}` for provider-missing or overlay states, and `{colors.error}` for validation failure and invalid form states. Do not use success or warning as the only cue for normal body text on the light background; their current contrast is below WCAG AA for normal text.

## Typography

The system uses a precise sans stack for page copy and display text, with `{typography.mono.fontFamily}` reserved for commands, coordinates, tags, terminal playback, labels, and generated metadata. Keep letter spacing at `0`.

Display headings are intentionally tight and oversized on hero surfaces, but compact panels, cards, controls, and catalog rows should use body-scale type. Commands and tags should remain small, uppercase where already implemented, and readable as metadata rather than decorative labels.

## Layout & Spacing

The desktop layout uses `{layout.container}` and a 12-column grid. Compact desktop and mobile states collapse to the 4-column grid at `1080px`; dense controls and maps collapse to one-column behavior at `900px`; mobile gutters tighten at `560px`.

The page background uses a `{layout.blueprint-grid-size}` drafting grid. Panels use a smaller `{layout.panel-grid-size}` grid so repeated components inherit the blueprint motif without requiring custom decoration.

Section spacing is substantial but not airy: `{spacing.section}` on desktop and `{spacing.mobile-section}` on mobile. Repeated items use tight gaps and padding because the product is meant for scanning, comparison, and proof inspection.

## Elevation & Depth

Depth is intentionally sparse. The only elevation token is `{elevation.blueprint-panel}`, used for the hero blueprint panel. Most repeated surfaces stay flat with a `{colors.line}` border and panel grid background. Avoid adding shadows to cards or rows unless the hierarchy must match the hero blueprint panel.

## Shapes

The implemented shape language is square and technical: `{rounded.none}` across buttons, panels, rows, inputs, tags, and cards. Do not introduce pill-shaped badges, rounded marketing cards, or soft SaaS containers unless the design system is intentionally revised.

## Components

Buttons use at least `44px` touch targets. Primary buttons use `{components.button.backgroundColor}` with white text; secondary buttons use `{components.secondary-button.backgroundColor}` with `{colors.ink}` text and blue hover text.

Panels, cards, catalog rows, proof items, workflow items, route cards, notices, and form panels share the blueprint panel background, `{colors.line}` border, and square corners. Use cards only for repeated items or framed tools; do not wrap page sections in decorative cards.

Selected states use blue borders plus an inset blue rule. Focus states use a `3px` translucent blue outline with `3px` offset. Error inputs use `{colors.error}` border and an inset one-pixel error ring.

Terminal playback uses `{colors.terminal-background}` with `{colors.terminal-text}` and `{typography.mono.fontFamily}`. Keep terminal output horizontally scrollable instead of shrinking code below readability.

## Do's and Don'ts

Do use neutral foundations, blueprint blue accents, green/amber/red status signals, visible construction lines, and compact proof-oriented layouts.

Do keep all factual metrics tied to generated data or explicit static proof receipts.

Do test desktop, tablet, and mobile text wrapping when hero copy, blueprint diagrams, catalog rows, or workflow labels change.

Don't use decorative blobs, orbs, bokeh, generic gradient hero art, video-only explanations, or Remotion assets for this V1 static showcase.

Don't let the interface become one-note blue; blue should identify structure and interaction, while neutral surfaces carry the page.

Don't use `{colors.success}` or `{colors.warning}` as normal body-copy colors on `{colors.paper}` or `{colors.panel}` unless the token is darkened in a future design-system update.
