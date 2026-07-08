---
skill: investigate
agent: codex
captured_at: 2026-07-08T09:49:39-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

for the canary briefing skill, investigate and verify the following: command: "implement-skill-fix"
  defect_class: convention
  target:
    - docs/briefing-slides-convention.md
  fix: |
    Amend the Briefing Slides Convention in three places.

    In Review Controls:
    - Require a slide-scoped feedback trigger on every slide, such as a Feedback button/chip.
    - Selecting any feedback, mark, annotation, or clarification action must open a slide-scoped sidebar/drawer for the active slide.
    - The persistent footer/bottom bar may show navigation, progress, slide count, and a compact feedback-status/trigger affordance only. It must not contain the required feedback controls, required
    gate answers, final approval controls, or compiled YAML output.
    - The sidebar must update when the active slide changes, preserve inline gate questions on their original slides, and provide the active slide's feedback controls, marks, note field, local
    slide-feedback YAML, and copy controls.

    In YAML Contract:
    - Compiled YAML is produced only by local slide-feedback YAML controls in the slide sidebar/near-slide feedback surface and by the final full-deck compiler on the response/final slide.
    - Do not render prior compiled YAML sidecars, answer sidecars, or generated review YAML files as primary slide cards, action chips, or navigation links. If they are needed as provenance, include
    them in compiled `source_artifacts` and optionally in a dedicated References slide with non-action wording.
    - The final full-deck compiler remains in normal slide flow on the last slide or an explicit response slide.

    In Verification And Opening:
    - Verify every slide has a feedback trigger and that activating it opens the slide-scoped sidebar/drawer.
    - Verify footer/bottom-bar markup does not contain required feedback inputs, required gate inputs, or YAML output textareas.
    - Verify prior YAML sidecars are not promoted as primary reference/action links outside a dedicated references/provenance area.
  publish_refresh:
    - git add docs/briefing-slides-convention.md
    - npm run skillpacks:build
    - git add packages/skillpacks/dist/skillpacks-manifest.json packages/skillpacks/build
    - git commit -m "Tighten briefing slide feedback and YAML controls"
    - git push
    - scripts/pack.sh refresh
  verify:
    - rg -n "feedback trigger|sidebar|bottom bar|sidecar|compiled YAML" docs/briefing-slides-convention.md
    - rg -n "bottom-bar feedback sidebar is allowed" docs/briefing-slides-convention.md && false || true
    - npx skillpacks alignment pages open --help
