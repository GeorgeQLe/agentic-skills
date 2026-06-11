# Skillpacks Install Routing Contract

Status: active contract for skill wording remediation
Last updated: 2026-06-10
Primary source: `research/skillpack-cli-routing-audit.md`

This contract defines the canonical wording for install-route guidance in active `SKILL.md` files and supporting docs. It is intentionally additive: keep valid in-agent and source-checkout routes, and add the published npm CLI route when the reader may be outside this repository checkout.

## Terms

- **In-agent route:** a command the user runs inside Claude Code or Codex, such as `/pack install <pack>` or `$pack install <pack>`.
- **Project shell route:** a command the user runs from the target project directory through the published package, such as `npx skillpacks install <pack>`.
- **Source-checkout route:** a command the user runs from or through a local clone of this repository, such as `scripts/pack.sh install <pack>`.
- **Deck route:** a curated deck install command, always expressed as `npx skillpacks install-deck <deck>`.

## Wording Matrix

| Scenario | Canonical wording |
| --- | --- |
| Claude pack install | `If the target pack is not enabled, recommend /pack install <pack> inside Claude Code, or npx skillpacks install <pack> from the project shell.` |
| Codex pack install | `If the target pack is not enabled, recommend $pack install <pack> inside Codex, or npx skillpacks install <pack> from the project shell.` |
| Claude individual skill install | `If only this skill is needed, recommend /pack install <skill> inside Claude Code, or npx skillpacks install <skill> from the project shell.` |
| Codex individual skill install | `If only this skill is needed, recommend $pack install <skill> inside Codex, or npx skillpacks install <skill> from the project shell.` |
| Missing skill fallback for Claude | `If found in an uninstalled pack, recommend /pack install <skill> for just that skill, /pack install <pack> for the full pack, or npx skillpacks install <pack-or-skill> from the project shell.` |
| Missing skill fallback for Codex | `If found in an uninstalled pack, recommend $pack install <skill> for just that skill, $pack install <pack> for the full pack, or npx skillpacks install <pack-or-skill> from the project shell.` |
| Source-checkout maintenance | `For source-checkout maintenance, keep scripts/pack.sh install <pack-or-skill>. If the target reader may be using the published package, also mention npx skillpacks install <pack-or-skill>.` |
| Deck install | `For curated workflow decks, use npx skillpacks install-deck <deck>. Do not describe deck installation as /pack install <deck>, $pack install <deck>, or npx skillpacks install <deck>.` |

## Pack Availability Guard Boilerplate

Claude-facing skills should use this pattern when they recommend a skill from a pack that may not be enabled:

```markdown
## Pack Availability Guard

When recommending a skill from another pack, verify the target pack is installed via `.agents/project.json` `enabled_packs`. If it is not enabled, recommend `/pack install <pack>` inside Claude Code, or `npx skillpacks install <pack>` from the project shell. After install, tell Claude users to run `/reload-skills`, then `/clear` or restart if the skill remains invisible.
```

Codex-facing skills should use the same structure with Codex syntax:

```markdown
## Pack Availability Guard

When recommending a skill from another pack, verify the target pack is installed via `.agents/project.json` `enabled_packs`. If it is not enabled, recommend `$pack install <pack>` inside Codex, or `npx skillpacks install <pack>` from the project shell. After install, tell Codex users to start a fresh Codex CLI session if the `$` skill list remains stale.
```

Use `<skill>` instead of `<pack>` when the intended install unit is one individual skill. Use `<pack-or-skill>` only in general-purpose installer or discovery docs where both units are explicitly valid.

## Decision Rules

- Preserve runner syntax exactly: Claude examples use `/pack`, Codex examples use `$pack`, and shell examples use `npx skillpacks`.
- Preserve `scripts/pack.sh` where text is explicitly about this source checkout, local development, or shell-backed compatibility behavior.
- Add `npx skillpacks install <pack-or-skill>` when install guidance could be read by someone consuming the published package outside this checkout.
- Use `npx skillpacks install-deck <deck>` only for deck installs. Deck wording must not be satisfied by `npx skillpacks install <pack-or-skill>`.
- Do not update active `SKILL.md` content without applying skill versioning: archive current `SKILL.md`, bump the active `version:`, and update the skill `CHANGELOG.md` where applicable.
- Exclude `archive/**` snapshots from active-routing remediation and validation unless the task explicitly audits historical wording.

## Validation Targets

The follow-up validation rule should scan active `SKILL.md` files under `global/` and `packs/`, excluding `archive/**`, and report install-route wording that omits the relevant npm CLI route.

Candidate trigger text:

- `/pack install`
- `$pack install`
- `pack install`
- `scripts/pack.sh install`
- `Pack Availability Guard`
- `Missing Skill Fallback`
- `install-deck`

Expected npm evidence:

- Pack or individual skill installs mention `npx skillpacks install`.
- Deck installs mention `npx skillpacks install-deck`.
- Source-checkout-only exceptions are explicit and auditable through an allowlist or fixture comment.
