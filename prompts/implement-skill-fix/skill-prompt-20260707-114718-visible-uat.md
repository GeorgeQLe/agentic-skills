---
skill: implement-skill-fix
agent: codex
captured_at: 2026-07-07T11:47:18-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

command: "implement-skill-fix"
  defect_class: skill
  target:
    - packs/product-testing/claude/visible-uat/SKILL.md
    - packs/product-testing/codex/visible-uat/SKILL.md
  fix: |
    Create a new product-testing skill named visible-uat.

    Purpose:
    - Conduct deterministic visible UAT for local desktop/web/app surfaces using Computer Use or the available visible UI tool.
    - This skill executes UAT; it is distinct from the existing uat skill, which only creates human-run UAT plans.

    Required process:
    1. Read project instructions and the requested UAT scope.
    2. Identify existing test/smoke hooks, launch commands, and safe setup APIs.
    3. Create temporary setup scripts under /tmp only. Do not change app source during UAT unless the user explicitly asks for implementation.
    4. Launch the app with isolated test state where possible, such as temp HOME/userData/profile paths.
    5. Use setup scripts only to seed deterministic states. Use visible UI inspection and interaction for assertions.
    6. Start every visible interaction turn with the visible UI state tool. Prefer accessibility-tree element clicks over coordinates.
    7. Record a Markdown UAT report under docs/testing/ unless the repo has a stronger convention.
    8. After each run, update the report with:
       - run name and timestamp
       - setup used, including temp script path
       - step table: action, observed result, expected result, PASS/FAIL/BLOCKED
       - failure notes and screenshot reference when applicable
    9. If an intermediate state matters, use manual-gated setup stages rather than timers.
    10. If setup reveals missing hooks, record BLOCKED with the missing hook and reproduction detail; do not patch hooks as part of UAT.
    11. Run relevant automated checks only after visible UAT, and label them supplemental.
    12. Stop app/dev-server processes started for the UAT before final handoff.

    Report template:
    - Summary table with every run marked PASS, FAIL, or BLOCKED.
    - One section per run.
    - No blank actual/expected/result cells.
    - Failure notes must include enough detail to reproduce.
    - Include automated checks separately from visible UAT observations.

    Constraints:
    - Do not silently substitute automated tests for Computer Use observations.
    - Do not rely on app-internal JavaScript state as the observed result when visible UI can be inspected.
    - Do not use repo-tracked files for transient setup.
    - Do not patch app code during UAT unless the user explicitly changes the task from UAT to implementation.
    - Respect Computer Use confirmation policy for risky UI actions.
  publish_refresh:
    - scripts/skill-archive.sh packs/product-testing/claude/visible-uat && scripts/skill-archive.sh packs/product-testing/codex/visible-uat; set initial version; update CHANGELOG
    - git add packs/product-testing/claude/visible-uat packs/product-testing/codex/visible-uat CHANGELOG*; npm run skillpacks:build; git add packages/skillpacks/dist/skillpacks-manifest.json; commit
    source+manifest together; push
    - scripts/pack.sh refresh
  verify:
    - rg -n "visible-uat|Computer Use|/tmp|docs/testing|manual-gated|automated checks" packs/product-testing/{claude,codex}/visible-uat/SKILL.md
    - rg -n "Do not run or operate the product" packs/product-testing/{claude,codex}/uat/SKILL.md
    - Verify the new skill explicitly says it is distinct from uat and does not weaken uat's human-run contract.
    - Verify refreshed mirrors expose the new skill and matching version.
