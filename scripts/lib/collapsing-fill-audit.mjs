// Shared convention check for the collapsing-fill anti-pattern in
// alignment/ and interrogation/ pages. CSS-rendered bars/meters built from a
// container <div> plus a percentage-sized fill child collapse to zero height
// when the container declares min-height without an explicit height: a
// percentage height resolves against the parent's *definite* height, and a
// min-height-only parent has none, so the fill never paints even at width:100%.
// See the "Bar and meter sizing" rule in docs/{alignment,interrogation}-page-convention.md.
//
// The check is deliberately scoped to the resolvable, near-zero-false-positive
// case: a descendant/child-combinator selector whose declaration block sets a
// percentage height, whose derived ancestor selector has an exact rule in the
// same page that declares min-height but no explicit height. The correct
// pattern (explicit height on the container) and the unresolvable class-pair
// pattern (no descendant combinator) are both left untouched.

const PCT_HEIGHT = /(?<![-\w])height:\s*\d+(?:\.\d+)?%/;
const HAS_HEIGHT = /(?<![-\w])height:/;
const MIN_HEIGHT = /min-height:/;
const COMBINATORS = new Set([">", "+", "~"]);

function normalizeSelector(selector) {
  return selector
    .trim()
    .replace(/\s*([>+~])\s*/g, " $1 ")
    .replace(/\s+/g, " ");
}

function ancestorOf(normalizedSelector) {
  const tokens = normalizedSelector.split(" ");
  tokens.pop(); // drop the fill's own simple selector
  while (tokens.length && COMBINATORS.has(tokens[tokens.length - 1])) tokens.pop();
  return tokens.join(" ").trim();
}

// Returns an array of diagnostic strings (empty when the page is clean).
export function collapsingFillDiagnostics(html, rel) {
  const rules = [];
  for (const styleMatch of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const css = styleMatch[1].replace(/\/\*[\s\S]*?\*\//g, "");
    // [^{}]+ can't cross braces, so this matches innermost declaration blocks
    // and naturally skips @media/@supports wrappers.
    for (const ruleMatch of css.matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
      const selectorList = ruleMatch[1].trim();
      if (!selectorList || selectorList.startsWith("@")) continue;
      rules.push({ selectorList, decls: ruleMatch[2] });
    }
  }
  if (!rules.length) return [];

  const declsBySelector = new Map();
  for (const { selectorList, decls } of rules) {
    for (const sel of selectorList.split(",")) {
      const s = normalizeSelector(sel);
      if (!s) continue;
      declsBySelector.set(s, `${declsBySelector.get(s) ?? ""};${decls}`);
    }
  }

  const diagnostics = [];
  const flagged = new Set();
  for (const { selectorList, decls } of rules) {
    if (!PCT_HEIGHT.test(decls)) continue;
    for (const sel of selectorList.split(",")) {
      const s = normalizeSelector(sel);
      if (!s || !s.includes(" ")) continue; // need a combinator to derive an ancestor
      const ancestor = ancestorOf(s);
      if (!ancestor) continue;
      const ancestorDecls = declsBySelector.get(ancestor);
      if (!ancestorDecls) continue; // can't prove the container is unsized
      if (HAS_HEIGHT.test(ancestorDecls)) continue; // container has an explicit height — fine
      if (!MIN_HEIGHT.test(ancestorDecls)) continue; // only the min-height-only trap
      const key = `${ancestor}|${s}`;
      if (flagged.has(key)) continue;
      flagged.add(key);
      diagnostics.push(
        `Collapsing fill in ${rel} — "${s}" sets a percentage height but its container "${ancestor}" declares min-height without an explicit height, so the fill resolves to zero and the bar paints empty. Give "${ancestor}" an explicit height (or give "${s}" its own min-height).`,
      );
    }
  }
  return diagnostics;
}
