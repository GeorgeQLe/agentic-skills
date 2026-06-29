import { readFileSync } from "node:fs";

export interface Frontmatter {
  name: string;
  description: string;
  version: string;
  context_intake?: string;
  visual_tier?: string;
  [key: string]: string | undefined;
}

export function parseFrontmatter(filePath: string): Frontmatter {
  const content = readFileSync(filePath, "utf8");
  const block = content.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const fields: Record<string, string> = {};

  for (const line of block.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const value = match[2].trim().replace(/^['"]|['"]$/g, "");
    fields[match[1]] = value;
  }

  return fields as Frontmatter;
}

export function validFrontmatter(filePath: string): { pass: boolean; description: string } {
  const meta = parseFrontmatter(filePath);
  const missing = ["name", "description", "version"].filter((field) => !meta[field]);
  if (missing.length > 0) {
    return {
      pass: false,
      description: `${filePath} is missing required frontmatter: ${missing.join(", ")}`,
    };
  }
  if (!/^v\d+\.\d+$/.test(meta.version)) {
    return {
      pass: false,
      description: `${filePath} has invalid version: ${meta.version}`,
    };
  }
  return { pass: true, description: `${filePath} has valid frontmatter` };
}
