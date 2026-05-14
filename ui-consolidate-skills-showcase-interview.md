# UI Consolidation Interview Log: Skills Showcase

## Interview Context

- **Date**: 2026-05-14
- **Participants**: User (George Le), Claude (UI consolidation agent)
- **Subject**: Consolidating 5 TUI variations into a single "playful blueprint" theme
- **Prior work**: `specs/ui-skills-showcase-website.md`, `DESIGN.md` (Swiss grid system), 5 built variations (v1-v5)

## Variation Review

### V1: Hacker Terminal
- Green-on-black phosphor, monospace, scanlines
- **User verdict**: Too niche, dark theme doesn't match the paper/blueprint foundation

### V2: Clean Minimal
- Light, spacious dev-docs feel, teal accent only
- **User verdict**: Too plain, lacks energy and personality

### V3: Retro CRT
- Amber-on-navy, CRT bezel and scanlines
- **User verdict**: Fun but novelty-driven, doesn't scale to a full product

### V4: Playful Lab
- Lavender background, coral chips, sticky-note sidebar, bounce animations, progressive rounding
- **User verdict**: Winner. Best balance of energy, usability, and personality. Chip selectors are more scannable than vertical lists. Sticky note concept is strong but needs evolution.

### V5: Professional
- Dark monitoring dashboard, timeline + context panel
- **User verdict**: Good density but dark theme conflicts with Swiss paper foundation

## Consolidation Decisions

### Q: Which variation wins?
**A**: V4 Playful Lab

### Q: Keep V4's lavender page background or Swiss paper?
**A**: Swiss paper (`#F7F8F5`). Lavender reserved for the notebook sidebar only.

### Q: Keep V4's purple text palette or Swiss ink system?
**A**: Swiss ink system — better contrast ratios, more professional.

### Q: How to handle corner radius — V4's rounded or Swiss's square?
**A**: Progressive scale. Structural elements (blueprint panels, metrics, terminals) stay square. Interactive elements get increasing radius: tags 4px, cards 8px, buttons 12px, chips 999px.

### Q: Keep the sticky note as-is or evolve it?
**A**: Evolve to "lab notebook" — lavender wash instead of yellow, coral accent strip instead of purple, tilt reduced from 2deg max to 0.5deg, asymmetric rounding.

### Q: V4 bounce animation — keep the overshoot?
**A**: Reduce from 1.56 to 1.3. Keep the energy but make it feel controlled.

### Q: Blueprint grid opacity — V4 had no grid, Swiss had 0.12?
**A**: Halve to 0.06. Grid should be visible but subtle, especially against rounded card edges.

### Q: Selected workflow indicator — teal or coral?
**A**: Coral for workflow-specific selections (chips, workflow items). Teal remains for structural selections (pack nodes, state machine).

### Q: What happens to the 5 variation route pages?
**A**: Delete all. Consolidated TuiWorkflow component renders directly on the workflows page.

### Q: Monospace font — keep SFMono or adopt V4's Fira Code?
**A**: Fira Code as primary with SFMono fallback. Fira Code has better ligatures for command display.

### Q: Secondary button hover color?
**A**: Coral-strong (`#e85555`) instead of teal-strong. Adds warmth to interactions.
