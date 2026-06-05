#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const VALID_BROWSERS = new Set(["auto", "brave", "chrome", "safari", "edge", "default"]);
const CHROME_FAMILY_APPS = {
  brave: { appName: "Brave Browser", macBundle: "Brave Browser", windowsExe: "brave.exe", linuxCommands: ["brave-browser", "brave"] },
  chrome: { appName: "Google Chrome", macBundle: "Google Chrome", windowsExe: "chrome.exe", linuxCommands: ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"] },
  edge: { appName: "Microsoft Edge", macBundle: "Microsoft Edge", windowsExe: "msedge.exe", linuxCommands: ["microsoft-edge", "microsoft-edge-stable"] },
};
const MAC_BROWSER_ORDER = ["brave", "chrome", "safari", "edge"];
const LINUX_DEFAULT_OPENERS = [
  { name: "xdg-open", command: "xdg-open", args: [] },
  { name: "gio open", command: "gio", args: ["open"] },
];

class UsageError extends Error {}

function usage() {
  return [
    "Usage: node scripts/open-html-page.mjs <html-path-or-url> [--browser auto|brave|chrome|safari|edge|default] [--dry-run] [--json]",
    "",
    "Opens or focuses a local HTML alignment page with best-effort platform behavior.",
  ].join("\n");
}

export function parseArgs(argv) {
  const options = {
    browser: "auto",
    dryRun: false,
    json: false,
    target: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--json") {
      options.json = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }
    if (arg === "--browser") {
      const value = argv[index + 1];
      if (!value) throw new UsageError("--browser requires a value");
      options.browser = value;
      index += 1;
      continue;
    }
    if (arg.startsWith("--browser=")) {
      options.browser = arg.slice("--browser=".length);
      continue;
    }
    if (arg.startsWith("--")) {
      throw new UsageError(`Unknown option: ${arg}`);
    }
    if (options.target) {
      throw new UsageError(`Unexpected extra argument: ${arg}`);
    }
    options.target = arg;
  }

  if (options.help) return options;
  if (!options.target) throw new UsageError("Missing HTML path or URL");
  if (!VALID_BROWSERS.has(options.browser)) {
    throw new UsageError(`Unsupported browser: ${options.browser}`);
  }
  return options;
}

function hasUrlScheme(input) {
  return /^[A-Za-z][A-Za-z0-9+.-]*:/.test(input);
}

function isWindowsDrivePath(input) {
  return /^[A-Za-z]:[\\/]/.test(input) || /^\\\\/.test(input);
}

function canonicalFileUrlForPath(filePath) {
  return pathToFileURL(path.resolve(filePath)).href;
}

export function normalizeTarget(input, options = {}) {
  const cwd = options.cwd || process.cwd();
  const platform = options.platform || process.platform;
  const trimmed = String(input || "").trim();
  if (!trimmed) throw new UsageError("Missing HTML path or URL");

  if (hasUrlScheme(trimmed) && !(platform === "win32" && isWindowsDrivePath(trimmed))) {
    const url = new URL(trimmed);
    if (url.protocol === "file:") {
      try {
        const filePath = fileURLToPath(url);
        const absolutePath = path.resolve(filePath);
        return {
          input: trimmed,
          kind: "file",
          url: pathToFileURL(absolutePath).href,
          filePath: absolutePath,
          exists: existsSync(absolutePath),
        };
      } catch {
        return {
          input: trimmed,
          kind: "file-url",
          url: url.href,
          filePath: null,
          exists: null,
        };
      }
    }
    return {
      input: trimmed,
      kind: "url",
      url: url.href,
      filePath: null,
      exists: null,
    };
  }

  const absolutePath = path.resolve(cwd, trimmed);
  return {
    input: trimmed,
    kind: "file",
    url: canonicalFileUrlForPath(absolutePath),
    filePath: absolutePath,
    exists: existsSync(absolutePath),
  };
}

export function detectRuntime(options = {}) {
  const platform = options.platform || process.platform;
  const env = options.env || process.env;
  let procVersion = options.procVersion;
  if (procVersion === undefined && platform === "linux") {
    try {
      procVersion = readFileSync("/proc/version", "utf8");
    } catch {
      procVersion = "";
    }
  }
  const isWsl =
    platform === "linux" &&
    (/microsoft|wsl/i.test(procVersion || "") || Boolean(env.WSL_DISTRO_NAME || env.WSL_INTEROP));
  return {
    platform,
    isWsl,
    distro: env.WSL_DISTRO_NAME || "Ubuntu",
  };
}

function encodePathSegments(posixPath) {
  return posixPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function wslFileUrl(filePath, distro = "Ubuntu") {
  const posixPath = filePath.replace(/\\/g, "/");
  return `file://wsl.localhost/${encodeURIComponent(distro)}${encodePathSegments(posixPath)}`;
}

function psCommandFor(targetUrl, browser) {
  if (browser && browser !== "auto" && browser !== "default") {
    const browserInfo = CHROME_FAMILY_APPS[browser];
    if (!browserInfo) return null;
    return {
      name: `powershell ${browser}`,
      command: powershellCommand(),
      args: ["-NoProfile", "-Command", "Start-Process -FilePath $args[0] -ArgumentList $args[1]", browserInfo.windowsExe, targetUrl],
      expectedStatus: "opened",
    };
  }
  return {
    name: "powershell default",
    command: powershellCommand(),
    args: ["-NoProfile", "-Command", "Start-Process -FilePath $args[0]", targetUrl],
    expectedStatus: "opened",
  };
}

function powershellCommand() {
  const windowsPowerShell = "/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/powershell.exe";
  return existsSync(windowsPowerShell) ? windowsPowerShell : "powershell.exe";
}

function appleScriptString(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function macRunningBrowserFocusScript(browser, targetUrl) {
  if (browser === "safari") {
    return `
set targetUrl to ${appleScriptString(targetUrl)}
tell application "System Events" to set browserIsRunning to exists process "Safari"
if browserIsRunning then
  tell application "Safari"
    repeat with w in windows
      repeat with t in tabs of w
        if (URL of t as text) is targetUrl then
          set current tab of w to t
          set index of w to 1
          activate
          return "focused"
        end if
      end repeat
    end repeat
  end tell
end if
return "not-found"
`.trim();
  }

  const appName = CHROME_FAMILY_APPS[browser]?.appName;
  return `
set targetUrl to ${appleScriptString(targetUrl)}
tell application "System Events" to set browserIsRunning to exists process ${appleScriptString(appName)}
if browserIsRunning then
  tell application ${appleScriptString(appName)}
    repeat with w in windows
      set tabIndex to 1
      repeat with t in tabs of w
        if (URL of t as text) is targetUrl then
          set active tab index of w to tabIndex
          set index of w to 1
          activate
          return "focused"
        end if
        set tabIndex to tabIndex + 1
      end repeat
    end repeat
  end tell
end if
return "not-found"
`.trim();
}

function macOpenOrFocusScript(browser, targetUrl) {
  if (browser === "safari") {
    return `
set targetUrl to ${appleScriptString(targetUrl)}
tell application "Safari"
  if it is running then
    repeat with w in windows
      repeat with t in tabs of w
        if (URL of t as text) is targetUrl then
          set current tab of w to t
          set index of w to 1
          activate
          return "focused"
        end if
      end repeat
    end repeat
  end if
  open location targetUrl
  activate
  return "opened"
end tell
`.trim();
  }

  const appName = CHROME_FAMILY_APPS[browser]?.appName;
  return `
set targetUrl to ${appleScriptString(targetUrl)}
tell application ${appleScriptString(appName)}
  if it is running then
    repeat with w in windows
      set tabIndex to 1
      repeat with t in tabs of w
        if (URL of t as text) is targetUrl then
          set active tab index of w to tabIndex
          set index of w to 1
          activate
          return "focused"
        end if
        set tabIndex to tabIndex + 1
      end repeat
    end repeat
  end if
  open location targetUrl
  activate
  return "opened"
end tell
`.trim();
}

function macDefaultAttempt(targetUrl) {
  return {
    name: "macos default open",
    command: "open",
    args: [targetUrl],
    expectedStatus: "opened",
  };
}

function macOpenAppAttempt(browser, targetUrl) {
  const appName = browser === "safari" ? "Safari" : CHROME_FAMILY_APPS[browser]?.macBundle;
  if (!appName) return null;
  return {
    name: `macos open ${browser}`,
    command: "open",
    args: ["-a", appName, targetUrl],
    expectedStatus: "fallback-opened",
  };
}

function planMacOpen(target, browser) {
  const attempts = [];
  if (browser === "default") {
    attempts.push(macDefaultAttempt(target.url));
    return { targetUrl: target.url, attempts };
  }

  if (browser === "auto") {
    for (const candidate of MAC_BROWSER_ORDER) {
      attempts.push({
        name: `macos focus ${candidate}`,
        command: "osascript",
        args: ["-e", macRunningBrowserFocusScript(candidate, target.url)],
        expectedStatus: "focused",
        acceptOnlyStdout: "focused",
      });
    }
    attempts.push(macDefaultAttempt(target.url));
    return { targetUrl: target.url, attempts };
  }

  attempts.push({
    name: `macos ${browser} open-or-focus`,
    command: "osascript",
    args: ["-e", macOpenOrFocusScript(browser, target.url)],
    expectedStatus: "opened",
    parseStdoutStatus: true,
  });
  const fallback = macOpenAppAttempt(browser, target.url);
  if (fallback) attempts.push(fallback);
  attempts.push(macDefaultAttempt(target.url));
  return { targetUrl: target.url, attempts };
}

function planWindowsOpen(target, browser) {
  const attempts = [];
  const explicit = psCommandFor(target.url, browser);
  if (explicit) attempts.push(explicit);
  if (browser !== "auto" && browser !== "default") attempts.push(psCommandFor(target.url, "default"));
  return { targetUrl: target.url, attempts };
}

function planWslOpen(target, browser, distro) {
  const targetUrl = target.filePath ? wslFileUrl(target.filePath, distro) : target.url;
  const attempts = [];
  if (target.filePath) {
    attempts.push({
      name: "wslpath windows path",
      command: "wslpath",
      args: ["-w", target.filePath],
      expectedStatus: "blocked",
      metadataOnly: true,
    });
  }
  const explicit = psCommandFor(targetUrl, browser);
  if (explicit) attempts.push({ ...explicit, name: `wsl ${explicit.name}` });
  if (browser !== "auto" && browser !== "default") {
    attempts.push({ ...psCommandFor(targetUrl, "default"), name: "wsl powershell default fallback", expectedStatus: "fallback-opened" });
  }
  return { targetUrl, attempts };
}

function linuxBrowserAttempts(browser, targetUrl) {
  if (browser === "safari") return [];
  const commands = CHROME_FAMILY_APPS[browser]?.linuxCommands || [];
  return commands.map((command) => ({
    name: `linux ${browser} ${command}`,
    command,
    args: [targetUrl],
    expectedStatus: "opened",
  }));
}

function planLinuxOpen(target, browser) {
  const attempts = [];
  if (browser !== "auto" && browser !== "default") {
    attempts.push(...linuxBrowserAttempts(browser, target.url));
  }
  attempts.push(
    ...LINUX_DEFAULT_OPENERS.map((opener) => ({
      name: `linux ${opener.name}`,
      command: opener.command,
      args: [...opener.args, target.url],
      expectedStatus: browser === "auto" || browser === "default" ? "opened" : "fallback-opened",
    })),
  );
  if (browser === "auto") {
    for (const candidate of ["brave", "chrome", "edge"]) {
      attempts.push(...linuxBrowserAttempts(candidate, target.url));
    }
  }
  return { targetUrl: target.url, attempts };
}

export function planOpen({ target, runtime, browser }) {
  if (runtime.isWsl) return { strategy: "wsl", ...planWslOpen(target, browser, runtime.distro) };
  if (runtime.platform === "darwin") return { strategy: "macos", ...planMacOpen(target, browser) };
  if (runtime.platform === "win32") return { strategy: "windows", ...planWindowsOpen(target, browser) };
  if (runtime.platform === "linux") return { strategy: "linux", ...planLinuxOpen(target, browser) };
  return {
    strategy: "unsupported",
    targetUrl: target.url,
    attempts: [],
  };
}

function attemptCommand(attempt) {
  const startedAt = new Date().toISOString();
  const result = spawnSync(attempt.command, attempt.args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return {
    name: attempt.name,
    command: attempt.command,
    args: attempt.args,
    startedAt,
    exitCode: result.status,
    signal: result.signal,
    error: result.error?.code || result.error?.message || null,
    stdout: (result.stdout || "").trim(),
    stderr: (result.stderr || "").trim(),
  };
}

function statusFromAttempt(attempt, record) {
  if (record.error || record.exitCode !== 0) return null;
  if (attempt.acceptOnlyStdout && record.stdout !== attempt.acceptOnlyStdout) return null;
  if (attempt.parseStdoutStatus && ["focused", "opened"].includes(record.stdout)) return record.stdout;
  return attempt.expectedStatus || "opened";
}

function summarizeDryRun({ options, target, runtime, plan }) {
  const firstExecutable = plan.attempts.find((attempt) => !attempt.metadataOnly);
  return {
    status: firstExecutable?.expectedStatus === "focused" ? "opened" : firstExecutable?.expectedStatus || "blocked",
    dryRun: true,
    browser: options.browser,
    platform: runtime.platform,
    isWsl: runtime.isWsl,
    target,
    strategy: plan.strategy,
    targetUrl: plan.targetUrl,
    attempts: plan.attempts.map((attempt) => ({
      name: attempt.name,
      command: attempt.command,
      args: attempt.args,
      expectedStatus: attempt.expectedStatus,
      metadataOnly: Boolean(attempt.metadataOnly),
    })),
  };
}

function runPlan({ options, target, runtime, plan }) {
  if (!plan.attempts.length) {
    return {
      status: "blocked",
      dryRun: false,
      browser: options.browser,
      platform: runtime.platform,
      isWsl: runtime.isWsl,
      target,
      strategy: plan.strategy,
      targetUrl: plan.targetUrl,
      attempts: [],
      message: `No opener strategy is available for platform ${runtime.platform}`,
    };
  }

  const attempts = [];
  const metadata = {};
  for (const attempt of plan.attempts) {
    const record = attemptCommand(attempt);
    attempts.push(record);

    if (attempt.metadataOnly) {
      if (!record.error && record.exitCode === 0 && record.stdout) metadata.windowsPath = record.stdout;
      continue;
    }

    const status = statusFromAttempt(attempt, record);
    if (status) {
      return {
        status,
        dryRun: false,
        browser: options.browser,
        platform: runtime.platform,
        isWsl: runtime.isWsl,
        target,
        strategy: plan.strategy,
        targetUrl: plan.targetUrl,
        attempts,
        metadata,
      };
    }
  }

  return {
    status: "blocked",
    dryRun: false,
    browser: options.browser,
    platform: runtime.platform,
    isWsl: runtime.isWsl,
    target,
    strategy: plan.strategy,
    targetUrl: plan.targetUrl,
    attempts,
    metadata,
  };
}

function formatHuman(result) {
  const base = `open-html-page: ${result.status} ${result.target.url}`;
  if (result.dryRun) return `${base} (dry run, strategy: ${result.strategy})`;
  if (result.status === "blocked") return `${base} (opening was blocked or no opener succeeded)`;
  return `${base} via ${result.strategy}`;
}

export function run(argv, io = {}) {
  const options = parseArgs(argv);
  if (options.help) {
    return { status: "opened", help: true, text: usage() };
  }

  const target = normalizeTarget(options.target, { cwd: io.cwd || process.cwd() });
  const runtime = detectRuntime({ env: io.env || process.env });
  const plan = planOpen({ target, runtime, browser: options.browser });
  return options.dryRun
    ? summarizeDryRun({ options, target, runtime, plan })
    : runPlan({ options, target, runtime, plan });
}

function isCliEntryPoint() {
  if (!process.argv[1]) return false;
  return path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

if (isCliEntryPoint()) {
  let result;
  try {
    result = run(process.argv.slice(2));
  } catch (error) {
    const status = "failed";
    const payload = {
      status,
      error: error instanceof UsageError ? error.message : error?.message || String(error),
      usage: usage(),
    };
    const wantsJson = process.argv.includes("--json");
    if (wantsJson) {
      console.log(JSON.stringify(payload, null, 2));
    } else {
      console.error(payload.error);
      console.error("");
      console.error(usage());
    }
    process.exit(error instanceof UsageError ? 2 : 1);
  }

  if (result.help) {
    console.log(result.text);
    process.exit(0);
  }
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatHuman(result));
  }
  process.exit(result.status === "failed" ? 1 : 0);
}
