# Lessons

## 2026-04-17 — Check live AWS auth before SSO login

- When a deploy path may use AWS SSO, do not infer that credentials are expired from stale context, earlier logs, or memory.
- First verify current auth with `aws sts get-caller-identity --profile <profile>` or let the deploy command fail with a current credential error.
- Only run `aws sso login --profile <profile>` after that live check proves credentials are missing or expired.

## 2026-04-19 — Keep Claude `/run` execution-only and `/ship` handoffs bounded

- Claude `/run` should execute exactly one approved step and then hand the dirty tree to `/ship`; it should not commit or push.
- Claude `/ship` is not complete after writing the next-step plan. Unless `--no-plan` is set or a blocker is documented, it must enter plan mode so the user can clear context and implement.
- Clear-context sessions launched by `/ship` plan mode are ship-one-step sessions. The plan handed to them must explicitly say to implement the approved step, validate, commit/push, deploy only with an explicit manual deploy contract, write the following step's plan, start the next approval UI with `EnterPlanMode` before `ExitPlanMode`, and stop before implementing it.
- Deploy discovery should not stall shipping in repos with no explicit manual deploy contract; skip deploy unless `deploy.md` or `tasks/deploy.md` exists.
