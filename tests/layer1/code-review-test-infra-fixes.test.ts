import { describe, it, expect } from "vitest";
import { mkdtempSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import {
  isSafeBenchRepoSlug,
  cleanupRepo,
} from "../layer4/helpers/disposable-repo.js";
import { pickResumeableManifest } from "../harness/bench-persistence.js";
import type { SessionManifest } from "../harness/bench-types.js";

// Code Review test-infra fixes (#4 slug guard, #5 temp-dir reclaim, #6
// resumeable session sort). These cover the pure logic plus the gh-free
// cleanup paths; the live gh side effects in layer4 run only under the gated
// live benchmark project.

describe("isSafeBenchRepoSlug (#4 destructive-delete guard)", () => {
  it("accepts a real owner with the bench prefix", () => {
    expect(isSafeBenchRepoSlug("octocat/agentic-skills-bench-sync-1234")).toBe(
      true,
    );
  });

  it("refuses the getGhUser() 'unknown' fallback owner", () => {
    expect(isSafeBenchRepoSlug("unknown/agentic-skills-bench-sync-1234")).toBe(
      false,
    );
  });

  it("refuses repos that are not bench fixtures", () => {
    expect(isSafeBenchRepoSlug("octocat/agentic-skills")).toBe(false);
    expect(isSafeBenchRepoSlug("octocat/some-other-repo")).toBe(false);
  });

  it("refuses slugs containing shell metacharacters", () => {
    expect(
      isSafeBenchRepoSlug("octocat/agentic-skills-bench-x; rm -rf /"),
    ).toBe(false);
    expect(isSafeBenchRepoSlug("octocat/agentic-skills-bench-x && echo hi")).toBe(
      false,
    );
  });

  it("refuses a missing owner segment", () => {
    expect(isSafeBenchRepoSlug("agentic-skills-bench-sync-1234")).toBe(false);
    expect(isSafeBenchRepoSlug("/agentic-skills-bench-sync-1234")).toBe(false);
  });
});

describe("cleanupRepo temp-dir reclaim (#5 leak fix)", () => {
  // Both paths below return before any `gh` invocation (unsafe slug is
  // refused pre-confirm; denial is honored pre-delete), so they exercise the
  // local-dir reclaim without touching the network.

  const tempDirWithMarker = (): string => {
    const dir = mkdtempSync(join(tmpdir(), "bench-leak-test-"));
    writeFileSync(join(dir, "marker.txt"), "leak check", "utf-8");
    return dir;
  };

  it("removes the work dir even when the slug is refused as unsafe", async () => {
    const dir = tempDirWithMarker();
    const result = await cleanupRepo(
      "https://github.com/unknown/agentic-skills-bench-sync-1234",
      () => Promise.resolve(true),
      dir,
    );
    expect(result.status).toBe("infrastructure-blocked");
    expect(existsSync(dir)).toBe(false);
  });

  it("removes the work dir even when deletion is denied", async () => {
    const dir = tempDirWithMarker();
    const result = await cleanupRepo(
      "https://github.com/octocat/agentic-skills-bench-sync-1234",
      () => Promise.resolve(false),
      dir,
    );
    expect(result).toEqual({
      status: "infrastructure-blocked",
      reason: "User denied repository deletion",
    });
    expect(existsSync(dir)).toBe(false);
  });

  it("tolerates a missing or already-removed work dir", async () => {
    const result = await cleanupRepo(
      "https://github.com/unknown/agentic-skills-bench-sync-1234",
      () => Promise.resolve(true),
      join(tmpdir(), "bench-leak-test-does-not-exist"),
    );
    expect(result.status).toBe("infrastructure-blocked");
  });
});

describe("pickResumeableManifest (#6 sort by time, not random id)", () => {
  const manifest = (
    sessionId: string,
    updatedAt: string,
    status: SessionManifest["status"],
  ): SessionManifest =>
    ({
      skill: "sync",
      sessionId,
      createdAt: updatedAt,
      updatedAt,
      status,
    }) as unknown as SessionManifest;

  it("returns null when nothing is resumeable", () => {
    expect(pickResumeableManifest([])).toBeNull();
    expect(
      pickResumeableManifest([
        manifest("a", "2026-05-01T00:00:00.000Z", "completed"),
        manifest("b", "2026-05-02T00:00:00.000Z", "failed"),
      ]),
    ).toBeNull();
  });

  it("picks the most recently updated running/paused session regardless of id order", () => {
    // Ids are intentionally NOT in time order — a name sort would pick "zzz".
    const picked = pickResumeableManifest([
      manifest("zzz", "2026-05-01T00:00:00.000Z", "paused"),
      manifest("aaa", "2026-05-03T00:00:00.000Z", "running"),
      manifest("mmm", "2026-05-02T00:00:00.000Z", "paused"),
    ]);
    expect(picked?.sessionId).toBe("aaa");
  });

  it("ignores completed/failed sessions even when newer", () => {
    const picked = pickResumeableManifest([
      manifest("old-running", "2026-05-01T00:00:00.000Z", "running"),
      manifest("new-done", "2026-05-09T00:00:00.000Z", "completed"),
    ]);
    expect(picked?.sessionId).toBe("old-running");
  });
});
