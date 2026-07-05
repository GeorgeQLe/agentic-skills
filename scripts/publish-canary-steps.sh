#!/usr/bin/env bash
# Print this repo's npm canary publishing steps. Run from anywhere:
#   ! publish-canary                  (wrapper installed on PATH by sync.md: ~/.local/bin)
#   ! scripts/publish-canary-steps.sh (inside the Claude Code CLI)
#   bash scripts/publish-canary-steps.sh
# Canonical source of truth: docs/release-runbook.md
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/skillpacks/package.json"

local_ver="(unknown)"
if [ -f "$PKG" ]; then
  local_ver="$(sed -nE 's/.*"version": *"([^"]+)".*/\1/p' "$PKG" | head -1)"
fi

cat <<EOF
Canary publishing steps — skillpacks + @glexcorp/gskp
=====================================================
WARNING: @experimental is a canary prerelease package channel for testing only.
It may contain unproven package behavior and should not be used for normal
installs. Normal users should use plain 'npx skillpacks ...' or
'npx skillpacks@latest ...'.

Both packages publish TOGETHER at the same prerelease version from one staged
artifact. Canary releases use the npm dist-tag "experimental" and never move
"latest". Canonical source of truth: docs/release-runbook.md

Local (staged) version: ${local_ver}
Check current canary tags with:
  npm view skillpacks dist-tags.experimental
  npm view @glexcorp/gskp dist-tags.experimental

1. Auth (prerequisite)
   npm login --registry https://registry.npmjs.org/
   npm whoami --registry https://registry.npmjs.org/      # expect: glexcorp
   # Account needs publish access to skillpacks AND @glexcorp/gskp; OTP ready if 2FA.
   # Other authorized account:
   # SKILLPACKS_NPM_PUBLISHER=<user> ./publish.sh --tag experimental --preid experimental prerelease

2. Canary release gates (run before publishing)
   npm --workspace packages/skillpacks run test:node
   npm run skillpacks:verify
   ./publish.sh --dry-run --tag experimental --preid experimental prerelease
   # Do NOT publish if: only one package would publish, staged versions differ,
   # the account can't publish both, either dry run fails, or the command would use latest.

3. Publish canary
   ./publish.sh --tag experimental --preid experimental prerelease
   # Publishes versions like 0.1.20-experimental.0 under dist-tags.experimental
   # for both package names. It does not move dist-tags.latest.

4. Commit, tag, and push the prerelease source state
   git add packages/skillpacks/package.json packages/skillpacks/dist/skillpacks-manifest.json
   git commit -m "Release skillpacks <version>"
   git tag skillpacks-v<version>
   git push
   git push origin skillpacks-v<version>

5. Post-publish verification
   npm view skillpacks dist-tags.experimental
   npm view @glexcorp/gskp dist-tags.experimental    # must match skillpacks
   # Stable/default install examples:
   npx skillpacks@latest install <pack-or-skill>
   npx @glexcorp/gskp@latest install <pack-or-skill>
   # Canary/testing-only install examples:
   npx skillpacks@experimental list
   npx skillpacks@experimental install <pack-or-skill>
   npx @glexcorp/gskp@experimental list

Recovery (skillpacks canary published but @glexcorp/gskp failed)
   # Fix npm auth / scope access / OTP, then rerun from the committed version:
   ./publish.sh --current --tag experimental
   # npm versions are immutable; --current matches the alias to the published
   # skillpacks version and preserves the experimental dist-tag. Never hand-run
   # 'npm publish' for only one package.

GA follow-up after canary approval
   ./publish.sh --dry-run patch
   ./publish.sh patch
   # Stable GA publishes a new stable semver version to latest; do not promote
   # the canary tarball directly.
EOF
