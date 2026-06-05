import { describe, it, expect, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadEnv, buildConfig } from "./bootstrap-session.mjs";
import { ENV_SEARCH_PATHS } from "./env-paths.mjs";

/** @typedef {import("./types/bootstrap-session").BootstrapOrgRow} BootstrapOrgRow */
/** @typedef {import("./types/bootstrap-session").BootstrapUserRow} BootstrapUserRow */
/** @typedef {import("./types/bootstrap-session").LegacyConfig} LegacyConfig */

describe("loadEnv", () => {
  const tempDirs = [];

  function makeTempEnv(content) {
    const dir = mkdtempSync(join(tmpdir(), "bootstrap-test-"));
    tempDirs.push(dir);
    const filePath = join(dir, ".env");
    writeFileSync(filePath, content);
    return filePath;
  }

  afterEach(() => {
    for (const dir of tempDirs) {
      rmSync(dir, { recursive: true, force: true });
    }
    tempDirs.length = 0;
  });

  it("parses KEY=value pairs", () => {
    const p = makeTempEnv("FOO=bar\nBAZ=qux");
    const vars = loadEnv([p]);
    expect(vars).toEqual({ FOO: "bar", BAZ: "qux" });
  });

  it("handles double-quoted values", () => {
    const p = makeTempEnv('KEY="hello"');
    const vars = loadEnv([p]);
    expect(vars.KEY).toBe("hello");
  });

  it("handles single-quoted values", () => {
    const p = makeTempEnv("KEY='world'");
    const vars = loadEnv([p]);
    expect(vars.KEY).toBe("world");
  });

  it("skips comments and blank lines", () => {
    const p = makeTempEnv("# comment\n\nKEY=val");
    const vars = loadEnv([p]);
    expect(Object.keys(vars)).toEqual(["KEY"]);
    expect(vars.KEY).toBe("val");
  });

  it("returns empty object when no files exist", () => {
    const vars = loadEnv(["/tmp/nonexistent-env-file-12345"]);
    expect(vars).toEqual({});
  });

  it("later file overwrites earlier file values", () => {
    const p1 = makeTempEnv("KEY=first\nONLY_FIRST=a");
    const p2 = makeTempEnv("KEY=second\nONLY_SECOND=b");
    const vars = loadEnv([p1, p2]);
    expect(vars.KEY).toBe("second");
    expect(vars.ONLY_FIRST).toBe("a");
    expect(vars.ONLY_SECOND).toBe("b");
  });
});

describe("ENV_SEARCH_PATHS", () => {
  it("exports absolute paths", () => {
    expect(Array.isArray(ENV_SEARCH_PATHS)).toBe(true);
    expect(ENV_SEARCH_PATHS.length).toBeGreaterThanOrEqual(4);
    for (const p of ENV_SEARCH_PATHS) {
      expect(p.startsWith("/")).toBe(true);
    }
  });
});

describe("buildConfig", () => {
  /** @type {BootstrapUserRow} */
  const user = { id: "user-123", name: "Alice", email: "alice@example.com" };
  /** @type {BootstrapOrgRow} */
  const org = { org_id: "org-456", is_primary: true };

  it("builds config with all fields", () => {
    /** @type {LegacyConfig} */
    const config = buildConfig(user, org);
    expect(config.session).toBeDefined();
    expect(config.session).toHaveProperty("sessionToken");
    expect(config.session).toHaveProperty("userId");
    expect(config.session).toHaveProperty("userName");
    expect(config.session).toHaveProperty("userEmail");
    expect(config.session).toHaveProperty("orgId");
    expect(config.session).toHaveProperty("authenticatedAt");
  });

  it("userId matches input", () => {
    const config = buildConfig(user, org);
    expect(config.session.userId).toBe("user-123");
  });

  it("orgId matches input", () => {
    const config = buildConfig(user, org);
    expect(config.session.orgId).toBe("org-456");
  });

  it("authenticatedAt is valid ISO timestamp", () => {
    const config = buildConfig(user, org);
    const parsed = new Date(config.session.authenticatedAt);
    expect(parsed.toISOString()).toBe(config.session.authenticatedAt);
  });
});
