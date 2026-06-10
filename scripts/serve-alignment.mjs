#!/usr/bin/env node
// Zero-dependency static server for alignment pages.
//
// Pages opened from file:// (especially file://wsl.localhost) cannot use the
// Cache API, so the Kokoro TTS voice model re-downloads on every visit.
// Serving the same files over http://localhost gives the browser a real
// origin and the model weights persist between visits.
//
// Usage: node scripts/serve-alignment.mjs [root-dir]
//   root-dir defaults to this repository's root. Pass another checkout
//   (e.g. a content repo) to serve its alignment pages instead.
//   PORT env var overrides the default port 8907.
import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const root = path.resolve(process.argv[2] || repoRoot);
const port = Number(process.env.PORT) || 8907;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
};

function resolveRequestPath(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(urlPath, "http://localhost").pathname);
  } catch {
    return null;
  }
  const resolved = path.resolve(root, "." + pathname);
  // Path-traversal guard: the resolved path must stay under the served root.
  if (resolved !== root && !resolved.startsWith(root + path.sep)) return null;
  return resolved;
}

const server = createServer((req, res) => {
  let filePath = resolveRequestPath(req.url);
  if (!filePath) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Bad request");
    return;
  }

  try {
    if (statSync(filePath).isDirectory()) filePath = path.join(filePath, "index.html");
  } catch {
    // Fall through; the stream below reports the 404.
  }

  const mime = MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
  const stream = createReadStream(filePath);
  stream.on("open", () => {
    res.writeHead(200, { "Content-Type": mime });
    stream.pipe(res);
  });
  stream.on("error", (err) => {
    const status = err.code === "ENOENT" ? 404 : 500;
    res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(status === 404 ? "Not found" : "Server error");
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`serve-alignment: serving ${root}`);
  console.log(`  http://localhost:${port}/alignment/`);
});
