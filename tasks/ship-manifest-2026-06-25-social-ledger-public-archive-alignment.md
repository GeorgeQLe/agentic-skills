# Ship Manifest - Social Ledger Public Archive Alignment Page

## Scope

Create a review-state alignment page for approving the social ledger and public archive system design before implementation.

## Changes

- Added `alignment/social-ledger-public-archive.html` as a document-tier, review-state approval page.
- Captured the proposed system of record for social posts:
  - project-local ledgers for project-owned accounts
  - central account ledgers for shared posting identities
  - optional local pointers or mirrors for provenance
  - public-safe gBrain projection for alignment context links
- Captured the proposed X publishing pattern:
  - main topic post
  - first reply with full public alignment doc link
  - optional contextual skill/package promo reply
- Added approval gates for archive target, ledger scope, account resolution, X reply-chain pattern, promo policy, public safety boundary, implementation scope, and artifact paths.
- Added the page to `alignment/index.html` under Product Design & Spec.

## Verification

- `node scripts/audit-alignment-pages.mjs` - pass.
- `node scripts/audit-task-docs.mjs` - pass.
- `git diff --check` - pass.

## Notes

- This change does not implement the ledger, publish posts, edit social conventions, or modify `GeorgeQLe/me`.
- The page is ready for review. Implementation should wait for compiled response YAML with `approval_status: ready-for-agent-review`.
