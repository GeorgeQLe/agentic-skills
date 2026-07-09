#!/usr/bin/env node
// ============================================================================
// extract-deck-manifest.mjs
// Re-runnable, read-only extractor over the OLD hand-authored skill decks.
// Parses the stable machine anchors from each briefing-slides/afps-skill-*.html
// deck still on the legacy template (data-state-key / .brand / .slide cards)
// into briefing-slides/_deck-manifest.json — the committed, hand-editable source
// of truth the generator batch-renders every deck from.
//
// The already-migrated flagship decks (idea-scope-brief, create-briefing-slides)
// and the standalone release-lane deck are NOT extracted: they are bespoke
// buildDeck() flagships. Slides 3 (session) are identical boilerplate the mapper
// regenerates, so only per-skill anchors are captured here.
//
// Enrichment (logged, non-fatal):
//   - deckFamily + intra-family order from the existing index.html grouping.
//   - title/lead backfill from the skill's SKILL.md name/description.
//   - nextSkill cross-check against the canonical chains (divergence logged).
// ============================================================================

import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);
const BRIEFING_DIR = `${REPO}/briefing-slides`;
const MANIFEST_PATH = `${BRIEFING_DIR}/_deck-manifest.json`;

// --- text helpers -----------------------------------------------------------
const decode = (s) =>
  String(s == null ? "" : s)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
const text = (s) => decode(String(s == null ? "" : s).replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
const norm = (s) => text(s).toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

// Canonical chains (from docs/decks.md + docs/skill-next-step-contracts.md rule 8).
// Used to compute a chain successor for the next-step divergence check.
const CHAINS = {
  business: [
    "idea-scope-brief", "customer-discovery", "competitive-analysis", "journey-map",
    "positioning", "user-flow-map", "state-model", "ux-variations", "ui-interview",
    "build-ui-screens", "logic-wiring", "uat", "consolidate-prototypes",
    "research-roadmap", "spec-interview", "roadmap", "plan-phase", "exec", "ship", "ship-end",
  ],
  devtool: ["devtool-positioning", "devtool-adoption", "devtool-dx-journey", "devtool-docs-audit", "devtool-monetization"],
  game: [
    "game-audience", "game-fantasy", "game-genre-map", "game-comparables", "game-core-loop",
    "game-prototype-test", "game-playtest-metrics", "game-store-page-test", "game-launch", "game-roadmap",
  ],
  vard: ["vard-scan", "vard-align", "vard-ship", "vard-traction"],
  ord: ["ord-scan", "ord-align", "ord-ship", "ord-traction"],
};
function chainSuccessor(slug) {
  for (const chain of Object.values(CHAINS)) {
    const i = chain.indexOf(slug);
    if (i >= 0 && i < chain.length - 1) return chain[i + 1];
  }
  return null;
}

// --- index.html catalog parse (family / order / blurb / chips) --------------
function parseIndexCatalog(html) {
  const map = {};
  const sectionRe = /<section\b[^>]*data-section[^>]*>([\s\S]*?)<\/section>/gi;
  let sIndex = 0;
  for (const sMatch of html.matchAll(sectionRe)) {
    const block = sMatch[1];
    const family = text((block.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i) || [])[1] || "");
    const cardRe = /<a\b[^>]*class="card\s+(\w+)"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let cIndex = 0;
    for (const cMatch of block.matchAll(cardRe)) {
      const familyKey = cMatch[1];
      const href = cMatch[2];
      const inner = cMatch[3];
      const slugMatch = href.match(/afps-skill-(.+)\.html$/) || href.match(/([a-z0-9-]+)\.html$/i);
      const slug = slugMatch ? slugMatch[1] : href;
      const blurb = text((inner.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i) || [])[1] || "");
      const chips = [...inner.matchAll(/<span class="chip">([\s\S]*?)<\/span>/gi)].map((m) => text(m[1]));
      map[slug] = { family, familyKey, familyOrder: sIndex, order: cIndex, blurb, chips, href };
      cIndex += 1;
    }
    sIndex += 1;
  }
  return map;
}

// --- SKILL.md frontmatter ---------------------------------------------------
function readSkillFrontmatter(skillPath) {
  const abs = `${REPO}/${skillPath}`;
  if (!existsSync(abs)) return null;
  const raw = readFileSync(abs, "utf8");
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return null;
  const body = fm[1];
  const grab = (key) => {
    const m = body.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return m ? m[1].trim().replace(/^["']|["']$/g, "") : null;
  };
  return { name: grab("name"), description: grab("description"), type: grab("type") };
}

// --- old-deck extraction ----------------------------------------------------
function strongPairs(html) {
  // label -> body from every <strong>Label</strong> <p>Body</p> pair.
  const map = {};
  const re = /<strong>([\s\S]*?)<\/strong>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  for (const m of html.matchAll(re)) {
    const label = norm(m[1]);
    if (label && !(label in map)) map[label] = text(m[2]);
  }
  return map;
}

function extractOldDeck(file, html, indexCatalog, log) {
  const rel = `briefing-slides/${file}`;
  const slug = (file.match(/^afps-skill-(.+)\.html$/) || [])[1];
  if (!slug) return null;

  const brand = html.match(/<div class="brand">\s*<strong>([\s\S]*?)<\/strong>\s*<span>([\s\S]*?)<\/span>/i);
  const title = brand ? text(brand[1]) : slug;
  const subtitle = brand ? text(brand[2]) : "";

  const tier = (html.match(/<span class="badge (\w+)"/i) || [])[1] || "research";
  const lead = text((html.match(/<p class="lead">([\s\S]*?)<\/p>/i) || [])[1] || "");
  const command = "$" + ((html.match(/<span class="chip">\$([^<]+)<\/span>/i) || [])[1] || slug).trim();

  let references = [];
  const refBlob = html.match(/<script id="referencesData"[^>]*>([\s\S]*?)<\/script>/i);
  if (refBlob) {
    try { references = JSON.parse(refBlob[1]); } catch { references = []; }
  }
  const skillPath = references.find((r) => /SKILL\.md$/.test(r)) || references[0] || null;

  const pairs = strongPairs(html);
  const nextChip = (html.match(/next:\s*([^<]+)</i) || [])[1];
  const nextSkill = (pairs["after"] || (nextChip ? nextChip.trim() : "") || "").trim();

  const gateQuestion =
    pairs["review gate"] ||
    `Approve whether this deck accurately explains what people can expect from ${slug}.`;

  const beats = {
    whenToUse: {
      runWhen: pairs["run this when"] || "",
      doNotExpect: pairs["do not expect"] || "",
      primaryInput: pairs["primary input"] || "",
      primaryQuestion: pairs["primary question"] || "",
    },
    expect: {
      output: pairs["expected output"] || "",
      detailLives: pairs["where detail lives"] || "",
      qualityBar: pairs["quality bar"] || "",
      humanReview: pairs["human review"] || "",
    },
    handoff: {
      before: pairs["before"] || "",
      after: nextSkill,
      seriesPoint: pairs["series talking point"] || "",
    },
  };

  const enrich = indexCatalog[slug] || {};
  const entry = {
    slug,
    command,
    title,
    subtitle,
    tier,
    deckFamily: enrich.family || "",
    familyKey: enrich.familyKey || "",
    familyOrder: enrich.familyOrder ?? 99,
    order: enrich.order ?? 99,
    blurb: enrich.blurb || "",
    chips: enrich.chips || [],
    skillPath,
    nextSkill,
    lead,
    beats,
    references,
    gate: {
      question: gateQuestion,
      options: [
        { value: "approve", label: "Approve" },
        { value: "revise", label: "Revise" },
        { value: "needs-clarification", label: "Needs clarification" },
      ],
    },
  };

  // Validation + enrichment logging (non-fatal).
  const missing = [];
  if (!entry.subtitle) missing.push("subtitle/track");
  if (!entry.skillPath) missing.push("skillPath");
  if (!entry.lead) missing.push("lead");
  if (!entry.beats.whenToUse.runWhen) missing.push("beat:run-when");
  if (!entry.beats.expect.output) missing.push("beat:expected-output");
  if (!entry.nextSkill) missing.push("nextSkill");
  if (!(slug in indexCatalog)) missing.push("index-family");
  if (missing.length) log.missing.push(`${rel}: missing ${missing.join(", ")}`);

  // Backfill title/lead from SKILL.md when the deck value is just the slug/empty.
  const fm = entry.skillPath ? readSkillFrontmatter(entry.skillPath) : null;
  if (fm) {
    if ((!entry.lead || entry.lead === slug) && fm.description) {
      entry.lead = fm.description;
      log.backfill.push(`${rel}: lead <- SKILL.md description`);
    }
    if ((!entry.title || entry.title === slug) && fm.name && fm.name !== slug) {
      entry.title = fm.name;
      log.backfill.push(`${rel}: title <- SKILL.md name`);
    }
    entry.skillType = fm.type || null;
  }

  // next-step divergence vs canonical chain (branchers keep their own "After").
  const successor = chainSuccessor(slug);
  if (successor && entry.nextSkill && entry.nextSkill !== successor) {
    log.nextStep.push(`${rel}: deck next "${entry.nextSkill}" != chain successor "${successor}" (kept deck value)`);
  }

  return entry;
}

// --- main -------------------------------------------------------------------
function main() {
  const indexHtml = existsSync(`${BRIEFING_DIR}/index.html`)
    ? readFileSync(`${BRIEFING_DIR}/index.html`, "utf8")
    : "";
  const indexCatalog = parseIndexCatalog(indexHtml);

  const files = readdirSync(BRIEFING_DIR)
    .filter((f) => /^afps-skill-.+\.html$/.test(f))
    .sort();

  const log = { missing: [], backfill: [], nextStep: [] };
  const entries = [];
  for (const file of files) {
    const html = readFileSync(`${BRIEFING_DIR}/${file}`, "utf8");
    if (!/data-state-key/.test(html)) continue; // skip already-migrated / non-legacy decks
    const entry = extractOldDeck(file, html, indexCatalog, log);
    if (entry) entries.push(entry);
  }

  // Order the manifest by folder grouping (family, then intra-family order) so
  // the generator's deckIndex-based rotation makes adjacent folder decks differ.
  entries.sort((a, b) => (a.familyOrder - b.familyOrder) || (a.order - b.order) || a.slug.localeCompare(b.slug));

  const manifest = {
    _comment:
      "Source of truth for briefing-slides skill decks. Hand-editable. Regenerate decks with `node scripts/generate-briefing-decks.mjs`. Re-extract from legacy decks with `node scripts/extract-deck-manifest.mjs` (overwrites this file).",
    generated_from: "briefing-slides/afps-skill-*.html (legacy template) + index.html grouping + SKILL.md frontmatter",
    deck_count: entries.length,
    decks: entries,
  };
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");

  // Summary
  console.log(`Extracted ${entries.length} decks -> ${MANIFEST_PATH.replace(REPO + "/", "")}`);
  console.log(`  families: ${[...new Set(entries.map((e) => e.deckFamily))].filter(Boolean).join(", ")}`);
  if (log.backfill.length) {
    console.log(`  backfilled (${log.backfill.length}):`);
    for (const l of log.backfill) console.log(`    - ${l}`);
  }
  if (log.nextStep.length) {
    console.log(`  next-step divergences (${log.nextStep.length}, kept deck value):`);
    for (const l of log.nextStep) console.log(`    - ${l}`);
  }
  if (log.missing.length) {
    console.log(`  anchor gaps (${log.missing.length}, review before batch regen):`);
    for (const l of log.missing) console.log(`    - ${l}`);
  } else {
    console.log("  anchor gaps: none");
  }
}

main();
