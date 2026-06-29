import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SKILL_CONVENTIONS } from "../../scripts/skill-convention-registry.mjs";

const REPO_ROOT = resolve(import.meta.dirname, "../..");

function read(relativePath: string): string {
  return readFileSync(resolve(REPO_ROOT, relativePath), "utf8");
}

describe("social-ledger convention contract", () => {
  const ledger = read("docs/social-ledger-convention.md");

  it("is registered as a static package asset alongside the other social conventions", () => {
    expect(SKILL_CONVENTIONS["social-ledger"]).toEqual({
      canonicalDoc: "docs/social-ledger-convention.md",
      packageAsset: "assets/social-ledger-convention.md",
    });
  });

  it("defines config-first resolution before drafting (Gate 3)", () => {
    for (const field of ["mode", "account_id", "central_repo", "central_path", "local_path"]) {
      expect(ledger, `resolution field ${field}`).toContain(field);
    }
    expect(ledger).toMatch(/before drafting/i);
  });

  it("defines the four ledger scopes including the gBrain public projection (Gates 1, 2)", () => {
    expect(ledger).toContain("Project-local ledger");
    expect(ledger).toContain("Central account ledger");
    expect(ledger).toContain("Both local and central");
    expect(ledger).toContain("Public gBrain projection");
    expect(ledger).toContain("6eorge.com/brain");
    expect(ledger).toContain("GeorgeQLe/me");
  });

  it("specifies the ledger record shape with account-scoped dedupe (Gate 2)", () => {
    for (const field of ["account_id", "project_id", "status", "post_mode", "reply_chain", "dedupe_fingerprint"]) {
      expect(ledger, `record field ${field}`).toContain(field);
    }
    expect(ledger).toMatch(/account-scoped/i);
  });

  it("defines the X post-plus-replies pattern (Gate 4)", () => {
    expect(ledger).toContain("post_plus_replies");
    expect(ledger).toContain("full_alignment_doc");
    expect(ledger).toContain("skill_promo");
  });

  it("sets the contextual rotated skill promo policy with npm + GitHub targets (Gate 5)", () => {
    expect(ledger).toMatch(/rotated/i);
    expect(ledger).toContain("npmjs.com/package/skillpacks");
    expect(ledger).toMatch(/GitHub/);
  });

  it("keeps the canonical ledger private and publishes only approved public-safe surfaces (Gate 6)", () => {
    expect(ledger).toMatch(/private by default/i);
    expect(ledger).toMatch(/Do not publish/);
    for (const secret of ["secrets", "credentials"]) {
      expect(ledger, `safety boundary ${secret}`).toContain(secret);
    }
  });

  it("defers automation scripts to a separate approval (Gate 7)", () => {
    expect(ledger).toMatch(/deferred/i);
    expect(ledger).toMatch(/separate approval/i);
  });
});

describe("social ledger cross-references", () => {
  it("the parent router links the ledger contract and post-plus-replies shape", () => {
    const router = read("docs/social-post-convention.md");
    expect(router).toContain("docs/social-ledger-convention.md");
    expect(router).toContain("post_plus_replies");
  });

  it("the X channel doc documents the post-plus-replies reply chain", () => {
    const x = read("docs/social/x-post-convention.md");
    expect(x).toContain("Post Plus Replies Pattern");
    expect(x).toContain("6eorge.com/brain");
  });

  it("the alignment-page convention keeps BIP ledger writes behind later explicit approval", () => {
    const alignment = read("docs/alignment-page-convention.md");
    expect(alignment).toContain("docs/social-ledger-convention.md");
    expect(alignment).toContain("assets/social-ledger-convention.md");
    expect(alignment).toContain("ledger storage scope");
    expect(alignment).toContain("account identity");
    expect(alignment).toContain("Do not write social-ledger records from this page unless a later workflow receives explicit posting or ledger approval");
  });
});
