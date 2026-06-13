# Debug Changelog

## 2026-06-12 — Singular `skillpack` command installed the wrong npm package

- **Symptom:** `npx skillpack install exec-loop` printed `npm warn exec The following package was not found and will be installed: skillpack@0.1.3`, then failed with `No skillpack.yaml found`.
- **Category:** CLI routing / package-name typo.
- **Severity:** Medium. The command reached the wrong public npm package and produced misleading setup guidance.
- **Root cause:** I used `skillpack` singular instead of this repository's `skillpacks` plural CLI. The singular `skillpack` package on npm is a different package at version `0.1.3`; this repo's package is `skillpacks` at version `0.1.1` locally and on npm at the time checked.
- **Fix:** No source fix was required for the immediate failure. The correct command route is `npx skillpacks install exec-loop`, or from this source checkout `node packages/skillpacks/bin/skillpacks.mjs install exec-loop`. Also, `scripts/pack.sh which exec-loop` is not a valid pack-name check because `which` expects a skill name; `node packages/skillpacks/bin/skillpacks.mjs which exec` correctly reports `exec` is provided by `exec-loop`.
- **Test results:** Verified `npm view skillpack` returns the unrelated singular package at `0.1.3`; verified `npm view skillpacks` and local `packages/skillpacks/package.json` report `0.1.1`; verified local `skillpacks` status lists `exec-loop` enabled and `which exec` maps to `exec-loop`.
- **Related entries:** None found; this changelog did not exist before this entry.
- **Systemic:** Yes. Agent guidance must distinguish exact package names before running or recommending `npx` commands.
