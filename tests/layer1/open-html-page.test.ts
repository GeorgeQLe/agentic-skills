import { describe, expect, it } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "../..");
const SCRIPT = resolve(ROOT, "scripts/open-html-page.mjs");

function runJson(args: string[], cwd = ROOT) {
  return JSON.parse(
    execFileSync(process.execPath, [SCRIPT, ...args], {
      cwd,
      encoding: "utf8",
    }),
  );
}

describe("open-html-page script", () => {
  it("normalizes a relative HTML path to a canonical file URL", () => {
    const result = runJson(["--dry-run", "--json", "alignment/example.html"]);
    const expected = pathToFileURL(resolve(ROOT, "alignment/example.html")).href;

    expect(result.status).toBe("opened");
    expect(result.dryRun).toBe(true);
    expect(result.target.kind).toBe("file");
    expect(result.target.url).toBe(expected);
    expect(result.target.filePath).toBe(resolve(ROOT, "alignment/example.html"));
    expect(result.attempts.length).toBeGreaterThan(0);
  });

  it("encodes absolute paths with spaces", () => {
    const absolutePath = resolve(ROOT, "alignment/example page.html");
    const result = runJson(["--dry-run", "--json", absolutePath]);

    expect(result.target.url).toBe(pathToFileURL(absolutePath).href);
    expect(result.target.url).toContain("example%20page.html");
  });

  it("preserves an existing file URL after canonicalization", () => {
    const absolutePath = resolve(ROOT, "alignment/example page.html");
    const fileUrl = pathToFileURL(absolutePath).href;
    const result = runJson(["--dry-run", "--json", fileUrl]);

    expect(result.target.url).toBe(fileUrl);
    expect(result.target.filePath).toBe(absolutePath);
  });

  it("returns structured failure output for unsupported browser values", () => {
    const result = spawnSync(
      process.execPath,
      [SCRIPT, "--dry-run", "--json", "--browser", "firefox", "alignment/example.html"],
      {
        cwd: ROOT,
        encoding: "utf8",
      },
    );

    expect(result.status).toBe(2);
    const payload = JSON.parse(result.stdout);
    expect(payload.status).toBe("failed");
    expect(payload.error).toContain("Unsupported browser: firefox");
  });

  it("plans WSL file URLs with the distro and encoded Linux path", async () => {
    const opener = await import(pathToFileURL(SCRIPT).href);
    const target = opener.normalizeTarget("/home/dev/alignment/example page.html", {
      cwd: ROOT,
      platform: "linux",
    });
    const runtime = opener.detectRuntime({
      platform: "linux",
      env: { WSL_DISTRO_NAME: "Ubuntu-24.04" },
      procVersion: "Linux version 5.15.0-microsoft-standard-WSL2",
    });
    const plan = opener.planOpen({ target, runtime, browser: "auto" });

    expect(runtime.isWsl).toBe(true);
    expect(plan.strategy).toBe("wsl");
    expect(plan.targetUrl).toBe(
      "file://wsl.localhost/Ubuntu-24.04/home/dev/alignment/example%20page.html",
    );
    expect(plan.attempts[0].command).toBe("wslpath");
    expect(plan.attempts.some((attempt: { command: string }) => attempt.command.includes("powershell"))).toBe(true);
  });

  it("plans macOS auto mode as exact-tab focus checks followed by default open", async () => {
    const opener = await import(pathToFileURL(SCRIPT).href);
    const target = opener.normalizeTarget("alignment/example.html", { cwd: ROOT, platform: "darwin" });
    const runtime = opener.detectRuntime({ platform: "darwin", env: {} });
    const plan = opener.planOpen({ target, runtime, browser: "auto" });

    expect(plan.strategy).toBe("macos");
    expect(plan.attempts.slice(0, 4).map((attempt: { command: string }) => attempt.command)).toEqual([
      "osascript",
      "osascript",
      "osascript",
      "osascript",
    ]);
    expect(plan.attempts[0].name).toContain("brave");
    expect(plan.attempts.at(-1)).toMatchObject({
      command: "open",
      expectedStatus: "opened",
    });
  });
});
