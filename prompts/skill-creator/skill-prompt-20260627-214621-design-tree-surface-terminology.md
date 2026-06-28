---
skill: skill-creator
agent: codex
captured_at: 2026-06-27T21:46:21-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

Session Triage Summary — Design-Tree “Screen” Terminology

  Target: user-flow-map, ui-interview, and the current alignment-page-review design-tree flow.

  User-Identified Issue: “Screen” may be too restrictive because some flow steps happen through MCP, CLI, tool calls, validation responses, background state, or audit records rather than explicit
  UI screens.

  Verification Verdict: Partially verified.

  The design-tree model itself is sound: it tracks user-flow branches, UX variations, UI experiments, and build leaves. It does not require every flow step to become a UI screen.

  The terminology in user-flow-map is the problem. It repeatedly says “screen/route inventory” and “per-screen action/state matrix,” which is too UI-biased for agent workflows.

  Key Conclusion

  Use surface as the umbrella term.

  A surface is any place where the flow becomes visible, actionable, or inspectable to a human, agent, or system.

  Recommended terms:

   Term                       Meaning
  ━━━━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Flow                       End-to-end job or journey
  ─────────────────────────  ─────────────────────────────────────────────────────────────
   Branch                     Meaningful alternate path
  ─────────────────────────  ─────────────────────────────────────────────────────────────
   Surface                    Visible/actionable/inspectable point in the flow
  ─────────────────────────  ─────────────────────────────────────────────────────────────
   Channel                    Delivery/access method: web UI, MCP, CLI, API, notification
  ─────────────────────────  ─────────────────────────────────────────────────────────────
   Screen / Route / Region    Visual UI realization of a surface
  ─────────────────────────  ─────────────────────────────────────────────────────────────
   Tool Response / Event      Non-visual realization of a surface

  MCP / CLI / Tool Handling

  MCP, CLI, SDK/tool call, and API should usually be treated as channels of the same surface, not separate surfaces.

  Example:

  Surface: Payload Validation Result
  Channels: MCP response, CLI output, SDK/tool-call result, optional diagnostics UI

  Split them only when behavior materially differs, such as CLI having an interactive repair flow while MCP returns structured machine-readable errors only.

  UI-Interview Fit

  ui-interview is strongly page/screen focused. It should not own full MCP/CLI/API channel splits.

  Better ownership:

   Skill            Responsibility
  ━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   user-flow-map    Surface inventory, channels, branches, states, handoffs
  ───────────────  ─────────────────────────────────────────────────────────────────────────
   state-model      Commands/events, state transitions, channel parity, logical contracts
  ───────────────  ─────────────────────────────────────────────────────────────────────────
   ui-interview     Human-visible UI screens, regions, routes, diagnostics/audit screens
  ───────────────  ─────────────────────────────────────────────────────────────────────────
   logic-wiring     Runnable prototype behavior, including CLI/API/infra behavior if needed

  Recommended Contract Fix

  Rename “screen inventory” conceptually to:

  > Surface Inventory

  Add columns:

  Surface Type
  Channels
  Visual UI Candidate

  Clarify:

  > Only named user-flow branches become branches[] in the design-tree manifest. Surfaces are supporting flow-map detail unless later promoted through UX/UI work.

  For Current Alignmeant Flow

  S1-S3 and S12 are valid surfaces, but mostly agent/tool surfaces.
  S4-S11 are the main reviewer UI candidates.
  S13 is a reusable recovery/history/audit surface.

  Recommended Next Skill

  None for analysis. If updating the skill contract, enable/install the skill-dev path first, then use a targeted skill update for user-flow-map and probably ui-interview terminology alignment.
