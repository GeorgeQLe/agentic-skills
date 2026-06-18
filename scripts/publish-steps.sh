#!/usr/bin/env bash
# Print this repo's npm publishing steps. Run from anywhere:
#   ! publish-skills                  (alias set up by sync.md in ~/.zshenv)
#   ! scripts/publish-steps.sh        (inside the Claude Code CLI)
#   bash scripts/publish-steps.sh
# Canonical source of truth: docs/release-runbook.md
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/skillpacks/package.json"

local_ver="(unknown)"
if [ -f "$PKG" ]; then
  local_ver="$(sed -nE 's/.*"version": *"([^"]+)".*/\1/p' "$PKG" | head -1)"
fi

cat <<EOF
Publishing steps — skillpacks + @glexcorp/gskp
==============================================
Both packages publish TOGETHER at the same version from one staged artifact via
the top-level ./publish.sh. Canonical source of truth: docs/release-runbook.md

Local (staged) version: ${local_ver}
Check the last published version with:  npm view skillpacks version
If they are equal, a content change needs a new release — use ./publish.sh patch.

1. Auth (prerequisite)
   npm login --registry https://registry.npmjs.org/
   npm whoami --registry https://registry.npmjs.org/      # expect: glexcorp
   # Account needs publish access to skillpacks AND @glexcorp/gskp; OTP ready if 2FA.
   # Other authorized account: SKILLPACKS_NPM_PUBLISHER=<user> ./publish.sh patch

2. Release gates (run before publishing)
   npm --workspace packages/skillpacks run test:node
   npm run skillpacks:verify
   ./publish.sh --dry-run patch
   # Do NOT publish if: only one package would publish, staged versions differ,
   # the account can't publish both, or either dry run fails.

3. Publish
   ./publish.sh patch                 # normal next release (bumps patch)
   # or pin a target:  ./publish.sh 0.1.7
   # Publishes skillpacks first, then @glexcorp/gskp --access public, verifies both.

4. Post-publish verification
   npm view skillpacks version
   npm view @glexcorp/gskp version    # must match skillpacks
   npx skillpacks@<version> list
   npx @glexcorp/gskp@<version> list

Recovery (skillpacks published but @glexcorp/gskp failed)
   # Fix npm auth / scope access / OTP, then rerun from the committed version:
   ./publish.sh --current
   # npm versions are immutable; --current matches the alias to the published
   # skillpacks version. Never hand-run 'npm publish' for only one package.
EOF
