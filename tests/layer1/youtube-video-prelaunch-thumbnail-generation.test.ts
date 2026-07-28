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

describe("youtube-video-prelaunch-audit Stage 2.5 contract", () => {
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

      it("orders concept approval, Stage 2.5 generation, and Stage 3 finalization", () => {
        const stage2 = content.indexOf(
          "**Stage 2 - Research, concepts, and asset-selection review.**",
        );
        const stage25 = content.indexOf(
          "**Stage 2.5 - Generate Test and Compare assets.**",
        );
        const stage3 = content.indexOf("**Stage 3 - Finalize approved artifacts.**");

        expect(stage2).toBeGreaterThan(-1);
        expect(stage25).toBeGreaterThan(stage2);
        expect(stage3).toBeGreaterThan(stage25);
        expect(content).toContain(
          "Enter Stage 2.5 only when final compiled YAML explicitly approves all three titles, concepts, and asset allocations",
        );
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
          "Write `variant-a`, `variant-b`, and `variant-c` image files plus `manifest.json`",
        );
        expect(content).toContain(
          "validate that exactly three variant image files exist and each is 1280x720",
        );
        expect(content).toContain("generation provenance");
        expect(content).toContain(
          "Never overwrite, rename away, or delete a prior generation",
        );
      });

      it("embeds generated comparisons in review HTML", () => {
        expect(content).toContain(
          "embed the three generated images beside their paired titles",
        );
        expect(content).toContain("use actual `<img>` elements");
        expect(content).toContain("open link, and download link");
        expect(content).toContain(
          "Treat broken images, missing links, missing fields, or a concept-only card as incomplete",
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

      it("requires a distinct post-generation approval before Stage 3", () => {
        expect(content).toContain(
          "Keep the page in `review` and stop for a new compiled approval",
        );
        expect(content).toContain(
          "Enter only after the post-generation compiled YAML approves the three generated images and paired titles",
        );
        expect(content).toContain(
          "Do not enter Stage 3 on concept approval alone",
        );
        expect(content).toContain(
          "thumbnail or title revisions return to Stage 2.5 and create a new generation",
        );
      });

      it("requires real thumbnail paths in successful reports and handoffs", () => {
        expect(content).toContain(
          "the three Test and Compare title/thumbnail pairs with their real image paths",
        );
        expect(content).toContain("approved generation manifest path");
        expect(content).toContain(
          "Do not claim YouTube Studio or API upload/configuration automation",
        );
      });
    });
  }
});
