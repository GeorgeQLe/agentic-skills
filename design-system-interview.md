# Design System Interview Log: Skills Showcase

## Context

Command: `$full-sweep design-system`

Mode used: full codebase/spec scan. The current repository has no root `DESIGN.md`, no Tailwind config, and one implemented static site CSS file at `docs/skills-showcase/styles.css`.

Primary evidence:

- `docs/skills-showcase/styles.css`
- `specs/ui-skills-showcase-website.md`
- `specs/skills-showcase-website.md`
- `tasks/phases/phase-32.md`
- `tasks/phases/phase-33.md`
- `tasks/phases/phase-34.md`

## Extracted Tokens

### Colors

From `:root` in `docs/skills-showcase/styles.css`:

- `--ink`: `#111827`
- `--muted`: `#5b6472`
- `--paper`: `#f7f8f5`
- `--panel`: `#ffffff`
- `--line`: `#cfd8e3`
- `--blue`: `#1769e0`
- `--blue-strong`: `#0b4fb3`
- `--green`: `#0f8a5f`
- `--amber`: `#a86700`
- `--red`: `#b42318`
- `--grid`: `rgba(23, 105, 224, 0.12)`
- `--shadow`: `0 18px 50px rgba(17, 24, 39, 0.08)`

Additional hard-coded implementation colors:

- Primary button text: `#ffffff`
- Terminal background: `#101827`
- Terminal border: `#243044`
- Terminal text: `#d8f3dc`

### Typography

- Sans stack: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Mono stack: `"SFMono-Regular", Consolas, "Liberation Mono", monospace`
- Root line height: `1.5`
- Display heading: `clamp(3rem, 7.2vw, 5.5rem)`, line-height `0.92`
- Section heading: `clamp(2rem, 5vw, 4.25rem)`, line-height `0.98`
- Lede: `1.12rem`
- Tags/coordinates/metric labels: `0.72rem`, uppercase, mono
- Command text: `0.82rem`, mono

### Layout And Spacing

- Container: `min(1180px, calc(100% - 32px))`
- Mobile container: `min(100% - 24px, 1180px)`
- Desktop grid: 12 columns
- Mobile grid: 4 columns
- Header min-height: `60px`
- Section padding: `76px 0`
- Mobile section padding: `52px 0`
- Hero padding: `48px 0 32px`, mobile top `34px`
- Common gaps: `8px`, `10px`, `12px`, `16px`, `18px`, `20px`, `22px`, `24px`
- Page background grid: `48px`
- Panel background grid: `24px`

### Shapes And Elevation

- Border radius: none in implemented CSS.
- Primary elevation: `0 18px 50px rgba(17, 24, 39, 0.08)` on `.blueprint-panel`.
- Most repeated surfaces are flat: one-pixel border plus blueprint panel background.

### Components

Implemented component families:

- Sticky header and mobile panel
- Primary and secondary buttons
- Blueprint panel
- State machine nodes
- Terminal playback
- Metrics and proof summaries
- Route cards
- Follow cards and newsletter form
- Workflow selector items and workflow stage panel
- Pack controls, pack nodes, pack bands, pack detail panel
- Catalog tools and expandable catalog rows
- Tags, notices, status text, and footer

## Source Decisions

Spec-confirmed:

- Use Swiss grid and blueprint motif.
- Use neutral base, blueprint blue accents, green success, amber warning, and red failure.
- Avoid decorative blobs, generic gradients, video, and Remotion assets.
- Use browser-native workflow animations with static reduced-motion fallback.
- Keep cards restrained and use them for repeated skill/workflow items, not nested section containers.
- Keep typography precise and readable, with no viewport-scaled font sizes as a general implementation guardrail.

Code-confirmed:

- The implemented hero and section headings use `clamp()` with viewport components.
- The current site uses square corners throughout.
- The page and panels use blue drafting grids.
- The visual system is dependency-free static HTML/CSS/JS.

## Accessibility Check

Computed contrast ratios:

| Pairing | Ratio | WCAG AA result |
| --- | ---: | --- |
| `#111827` on `#f7f8f5` | 16.64:1 | Pass normal text |
| `#111827` on `#ffffff` | 17.74:1 | Pass normal text |
| `#5b6472` on `#f7f8f5` | 5.61:1 | Pass normal text |
| `#5b6472` on `#ffffff` | 5.98:1 | Pass normal text |
| `#1769e0` on `#f7f8f5` | 4.77:1 | Pass normal text |
| `#1769e0` on `#ffffff` | 5.08:1 | Pass normal text |
| `#0b4fb3` on `#f7f8f5` | 7.08:1 | Pass normal text |
| `#0b4fb3` on `#ffffff` | 7.54:1 | Pass normal text |
| `#0f8a5f` on `#f7f8f5` | 4.09:1 | Fails normal text; passes large text and UI graphics |
| `#a86700` on `#f7f8f5` | 4.28:1 | Fails normal text; passes large text and UI graphics |
| `#b42318` on `#f7f8f5` | 6.17:1 | Pass normal text |
| `#d8f3dc` on `#101827` | 15.04:1 | Pass normal text |
| `#cfd8e3` on `#f7f8f5` | 1.35:1 | Fails text; acceptable only as decorative border/grid line |

Required guardrail: green and amber status tokens should not be used as the only color for normal body text on light backgrounds. The line token is a border/grid token, not a text color.

## Confirmation Notes

No new token values were invented. `DESIGN.md` maps the existing CSS variables and hard-coded static-site values into semantic roles and records the spec-confirmed visual rules. The only unresolved design issue is whether future work should darken success/warning tokens for normal text; this sweep records the current implementation and warns against body-copy usage.
