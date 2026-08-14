import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");
const skillRoot = "packs/youtube-ops";
const claudePath = `${skillRoot}/claude/youtube-video-prelaunch-audit/SKILL.md`;
const codexPath = `${skillRoot}/codex/youtube-video-prelaunch-audit/SKILL.md`;
const skillPaths = [claudePath, codexPath] as const;

function read(path: string): string {
  return readFileSync(resolve(ROOT, path), "utf8");
}

function normalizePlatformSyntax(content: string): string {
  return content.replaceAll(/\/(youtube-[a-z-]+)/g, "$$$1");
}

describe("youtube-video-prelaunch-audit AFPS 2.0 generation contract", () => {
  it("keeps normalized Claude/Codex mirror parity and identical changelogs", () => {
    expect(normalizePlatformSyntax(read(claudePath))).toBe(
      normalizePlatformSyntax(read(codexPath)),
    );
    expect(
      read(`${skillRoot}/claude/youtube-video-prelaunch-audit/CHANGELOG.md`),
    ).toBe(read(`${skillRoot}/codex/youtube-video-prelaunch-audit/CHANGELOG.md`));
  });

  for (const path of skillPaths) {
    describe(path, () => {
      const content = read(path);

      it("generates the decision-revealing slice before one material checkpoint", () => {
        expect(content).toContain("required_conventions: [afps-2.0]");
        expect(content).toContain("`launch-packaging-selection`");
        expect(content).toContain("only after all three title/thumbnail pairs exist and pass image/manifest validation");
        expect(content).toContain("at most three material decisions");
        expect(content).not.toContain("## Report-First Approval Gate");
        expect(content).not.toContain("## Staged Research Workflow");
        expect(content).not.toContain("## Alignment Page");
      });

      it("accepts repeatable pointed assets and accounts for every candidate", () => {
        expect(content).toContain(
          "Optional repeatable `--thumbnail-asset <path-or-url>`",
        );
        expect(content).toContain(
          "backward-compatible alias for one `--thumbnail-asset`",
        );
        expect(content).toContain("explicitly identified attachments");
        expect(content).toContain(
          "limit discovery to the exact files, URLs, attachments, and directories the user points to",
        );
        expect(content).toContain(
          "one record for every candidate discovered within a user-pointed asset location",
        );
        expect(content).toContain("`used` or `rejected` status");
        expect(content).toContain("a rejection reason when rejected");
      });

      it("requires exactly three verified 1280x720 files and a provenance manifest", () => {
        expect(content).toContain(
          "create exactly three upload-ready 1280x720 thumbnail files",
        );
        expect(content).toContain(
          "test-and-compare/<generation-id>/` directory",
        );
        expect(content).toContain(
          "write `variant-a`, `variant-b`, and `variant-c` image files plus `manifest.json`",
        );
        expect(content).toContain(
          "validate that exactly three variant image files exist, each decodes as 1280x720",
        );
        expect(content).toContain("generation provenance");
        expect(content).toContain(
          "Never overwrite, rename away, or delete a prior generation",
        );
      });

      it("requires content-based upload format and desktop byte-size validation", () => {
        expect(content).toContain(
          "actual format detected from its contents or file signature is JPEG, PNG, or GIF",
        );
        expect(content).toContain(
          "Do not trust the filename extension; reject unreadable files, extension/content mismatches, unsupported formats, and oversized outputs",
        );
        expect(content).toContain(
          "detected `format` normalized to `jpg`, `png`, or `gif`, and numeric `byte_size`",
        );
        expect(content).toContain("`byte_size <= 50_000_000`");
        expect(content).toContain(
          "write the detected format and byte size to the manifest before changing the status to complete or presenting the checkpoint",
        );
        expect(content).toContain(
          "Do not substitute the separate mobile/API limit, infer format from an extension",
        );
      });

      it("exposes generated comparisons directly from canonical artifacts", () => {
        expect(content).toContain(
          "Candidate comparison: expose each actual image through a resolvable repository-relative path",
        );
        expect(content).toContain("meaningful alternative text");
        expect(content).toContain("full paired title, variant ID, source assets, hypothesis");
        expect(content).toContain(
          "Treat broken images, missing fields, or a concept-only entry as incomplete",
        );
      });

      it("stops when generation or required asset access is unavailable", () => {
        expect(content).toContain("If no image-capable tool is available");
        expect(content).toContain(
          "stop and request an image-capable session or corrected asset access",
        );
        expect(content).toContain(
          "Do not substitute prose concepts, mock paths, or supplied source files for generated outputs",
        );
      });

      it("keeps checkpoint revision and publication permission semantics distinct", () => {
        expect(content).toContain(
          "A response may revise the canonical report or trigger a new immutable generation",
        );
        expect(content).toContain(
          "The checkpoint does not authorize YouTube Studio upload, public visibility, scheduling, account-authenticated changes",
        );
        expect(content).toContain(
          "Do not ask the material packaging question until the actual three image/title pairs pass validation",
        );
      });

      it("requires real thumbnail paths in successful reports and handoffs", () => {
        expect(content).toContain(
          "the three Test and Compare title/thumbnail pairs with their real image paths",
        );
        expect(content).toContain("generation manifest path");
        expect(content).toContain(
          "Do not claim YouTube Studio or API upload/configuration automation",
        );
      });
    });
  }
});
