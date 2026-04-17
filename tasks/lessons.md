# Lessons

## 2026-04-17 — Check live AWS auth before SSO login

- When a deploy path may use AWS SSO, do not infer that credentials are expired from stale context, earlier logs, or memory.
- First verify current auth with `aws sts get-caller-identity --profile <profile>` or let the deploy command fail with a current credential error.
- Only run `aws sso login --profile <profile>` after that live check proves credentials are missing or expired.
