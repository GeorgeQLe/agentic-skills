#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function usage() {
  return "Usage: node scripts/audit-briefing-slides.mjs briefing-slides/<deck>.html";
}

function readDeck(relativePath) {
  if (!relativePath || relativePath.startsWith("-")) {
    throw new Error(usage());
  }
  if (path.isAbsolute(relativePath)) {
    throw new Error("Deck path must be repo-relative.");
  }
  if (!relativePath.endsWith(".html")) {
    throw new Error("Deck path must end in .html.");
  }

  const absolutePath = path.join(repoRoot, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Deck not found: ${relativePath}`);
  }
  return {
    relativePath,
    text: readFileSync(absolutePath, "utf8")
  };
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function hasAll(text, values) {
  return values.every((value) => text.includes(value));
}

const checks = [
  {
    label: "document shell",
    test: (text) => /<!doctype html>/i.test(text) && /<html\b/i.test(text) && /<script\b/i.test(text)
  },
  {
    label: "slide-by-slide stage",
    test: (text) => text.includes('class="deck"') || text.includes("class='deck'")
  },
  {
    label: "multiple slide sections",
    test: (text) => countMatches(text, /class=["'][^"']*\bslide\b/g) >= 2
  },
  {
    label: "active slide shell",
    test: (text) => /class=["'][^"']*\bslide\b[^"']*\bactive\b|class=["'][^"']*\bactive\b[^"']*\bslide\b/.test(text)
  },
  {
    label: "topbar counter and progress",
    test: (text) => hasAll(text, ["topbar", "slideCounter", "progressFill"])
  },
  {
    label: "previous and next controls",
    test: (text) => hasAll(text, ["prevSlide", "nextSlide"])
  },
  {
    label: "filmstrip navigation",
    test: (text) => hasAll(text, ["filmstrip", "Slide navigation"])
  },
  {
    label: "keyboard navigation",
    test: (text) => {
      return (text.includes("addEventListener('keydown'") || text.includes('addEventListener("keydown"'))
        && hasAll(text.toLowerCase(), ["arrowleft", "arrowright", "home", "end"]);
    }
  },
  {
    label: "hash and localStorage resume",
    test: (text) => hasAll(text, ["location.hash", "localStorage"])
  },
  {
    label: "empty-stage click navigation",
    test: (text) => text.includes("querySelector('.deck').addEventListener('click'")
      || text.includes('querySelector(".deck").addEventListener("click"')
  },
  {
    label: "slide-scoped feedback sidebar",
    test: (text) => hasAll(text, ["feedbackSidebar", "sidebarFeedback", "sidebarAnnotation", "sidebarMark"])
  },
  {
    label: "gate controls",
    test: (text) => text.includes("data-gate") && text.includes("gate_answers")
  },
  {
    label: "copy fallback",
    test: (text) => hasAll(text, ["navigator.clipboard", "copyFallback"])
  },
  {
    label: "YAML briefing contract",
    test: (text) => hasAll(text, [
      "briefing_slides:",
      "reference_pages:",
      "source_artifacts:",
      "slide_feedback:",
      "annotations:",
      "marked_slides:",
      "unanswered_required_questions:",
      "approval_status:"
    ])
  },
  {
    label: "references",
    test: (text) => /href=["'](?:\{\{|(?:\.\.\/|\.\/|[A-Za-z0-9_.-]+\/))[^"']+["']/.test(text)
  },
  {
    label: "print CSS",
    test: (text) => /@media\s+print/.test(text) && /(break-after|page-break-after)\s*:\s*(page|always)/.test(text)
  }
];

function audit({ relativePath, text }) {
  const failures = checks
    .filter((check) => !check.test(text))
    .map((check) => check.label);

  if (failures.length > 0) {
    throw new Error(`Briefing slides audit failed for ${relativePath}:\n- ${failures.join("\n- ")}`);
  }
}

try {
  const deck = readDeck(process.argv[2]);
  audit(deck);
  console.log(`Briefing slides audit passed: ${deck.relativePath}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
