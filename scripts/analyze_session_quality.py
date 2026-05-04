#!/usr/bin/env python3
import argparse
import collections
import datetime as dt
import glob
import json
import os
import re
from pathlib import Path


ROOT = Path.home()
DEFAULT_CLAUDE = ROOT / ".claude" / "history.jsonl"
DEFAULT_CODEX = ROOT / ".codex" / "history.jsonl"
DEFAULT_CODEX_SESSIONS = ROOT / ".codex" / "sessions" / "**" / "*.jsonl"

CATEGORY_PATTERNS = {
    "ship_commit_push": r"\b(ship|commit|push|github|uncommitted|uncommited)\b",
    "run_execute_phase": r"(^|\s)(/run|\$run|run\b|phase\b|step\b|implement\b)",
    "plan_spec_roadmap": r"\b(plan|spec|roadmap|todo|prd|requirements|phase)\b|(/roadmap|\$roadmap|/plan|\$plan)",
    "verification_tests": r"\b(test|verify|validate|validation|check|typecheck|lint|build|ci)\b",
    "review_audit": r"\b(review|audit|investigate|debug|root cause|findings)\b|(/expert-review|\$expert-review|/investigate|\$investigate)",
    "skills_workflow": r"(/|\$)([a-z][a-z0-9-]+)|\bskill|workflow|pack|agentic-skills\b",
    "frontend_app": r"\b(ui|ux|frontend|app|component|page|screen|layout|design|browser|server)\b",
    "quality_slop": r"\b(slop|hacky|quality|elegant|senior|staff engineer|lazy|temporary fix|no laziness)\b",
    "correction_feedback": r"\b(wrong|suck|mistake|not what|fix this|why did|is this expected|where did|you should|correction)\b",
}

SKILL_RE = re.compile(r"(^|[\s(])(?:/|\$)([a-z][a-z0-9-]+)\b")


def read_jsonl(path):
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        for line_no, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                yield line_no, json.loads(line)
            except json.JSONDecodeError:
                continue


def iso_from_ts(value, millis=False):
    if value is None:
        return None
    seconds = value / 1000 if millis else value
    try:
        return dt.datetime.fromtimestamp(seconds, tz=dt.timezone.utc)
    except Exception:
        return None


def normalize_text(text):
    text = (text or "").strip()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\b[0-9a-f]{8,}\b", "<hex>", text, flags=re.I)
    text = re.sub(r"\b\d+(?:\.\d+)*\b", "<num>", text)
    return text.lower()


def dedupe_key(text):
    text = normalize_text(text)
    text = re.sub(r"\[([$/][a-z][a-z0-9-]+)\]\([^)]+\)", r"\1", text)
    return text


def short(text, limit=140):
    text = re.sub(r"\s+", " ", (text or "").strip())
    return text if len(text) <= limit else text[: limit - 1] + "..."


def project_name(path):
    if not path:
        return "(unknown)"
    parts = Path(path).parts
    if len(parts) >= 2:
        return "/".join(parts[-2:])
    return path


def load_codex_session_metadata(pattern):
    meta = {}
    rollout_user = []
    files = glob.glob(str(pattern), recursive=True)
    for path in files:
        sid = None
        cwd = None
        model = None
        cli = None
        branch = None
        repo = None
        for _, rec in read_jsonl(path):
            typ = rec.get("type")
            payload = rec.get("payload") or {}
            if typ == "session_meta":
                sid = payload.get("id") or sid
                cwd = payload.get("cwd") or cwd
                model = payload.get("model") or payload.get("model_provider") or model
                cli = payload.get("cli_version") or cli
                git = payload.get("git") or {}
                branch = git.get("branch") or branch
                repo = git.get("repository_url") or repo
            elif typ == "response_item":
                if payload.get("type") == "message" and payload.get("role") == "user":
                    chunks = []
                    for item in payload.get("content") or []:
                        if isinstance(item, dict) and item.get("type") in {"input_text", "text"}:
                            chunks.append(item.get("text") or "")
                    text = "\n".join(chunks).strip()
                    ts = rec.get("timestamp")
                    if text:
                        rollout_user.append({
                            "source": "codex",
                            "timestamp": parse_iso(ts),
                            "session_id": sid,
                            "project": cwd,
                            "text": text,
                            "from_rollout": True,
                        })
        if sid:
            meta[sid] = {"cwd": cwd, "model": model, "cli": cli, "branch": branch, "repo": repo, "file": path}
    return meta, rollout_user, len(files)


def parse_iso(text):
    if not text:
        return None
    try:
        return dt.datetime.fromisoformat(text.replace("Z", "+00:00"))
    except Exception:
        return None


def load_records(claude_path, codex_path, codex_sessions):
    records = []
    source_files = {}

    codex_meta, rollout_user, rollout_file_count = load_codex_session_metadata(codex_sessions)
    source_files["codex_rollout_files"] = rollout_file_count

    if claude_path.exists():
        source_files["claude_history"] = str(claude_path)
        for _, rec in read_jsonl(claude_path):
            text = rec.get("display") or ""
            if text:
                records.append({
                    "source": "claude",
                    "timestamp": iso_from_ts(rec.get("timestamp"), millis=True),
                    "session_id": rec.get("sessionId"),
                    "project": rec.get("project"),
                    "text": text,
                })
    else:
        source_files["claude_history_missing"] = str(claude_path)

    codex_seen = set()
    if codex_path.exists():
        source_files["codex_history"] = str(codex_path)
        for _, rec in read_jsonl(codex_path):
            sid = rec.get("session_id")
            text = rec.get("text") or ""
            ts = iso_from_ts(rec.get("ts"), millis=False)
            key = (sid, dedupe_key(text))
            codex_seen.add(key)
            meta = codex_meta.get(sid, {})
            records.append({
                "source": "codex",
                "timestamp": ts,
                "session_id": sid,
                "project": meta.get("cwd"),
                "text": text,
                "model": meta.get("model"),
                "cli": meta.get("cli"),
                "branch": meta.get("branch"),
                "repo": meta.get("repo"),
            })
    else:
        source_files["codex_history_missing"] = str(codex_path)

    for rec in rollout_user:
        ts = rec.get("timestamp")
        key = (rec.get("session_id"), dedupe_key(rec.get("text")))
        if key not in codex_seen and not is_context_blob(rec.get("text")):
            records.append(rec)

    return records, source_files


def is_context_blob(text):
    text = text or ""
    stripped = text.strip()
    return (
        "<INSTRUCTIONS>" in text
        or "<environment_context>" in text
        or stripped.startswith("# AGENTS.md instructions")
        or stripped.startswith("<skill>")
        or stripped.startswith("<permissions instructions>")
        or stripped.startswith("<collaboration_mode>")
        or stripped.startswith("<apps_instructions>")
        or stripped.startswith("<plugins_instructions>")
        or stripped.startswith("<skills_instructions>")
        or stripped.startswith("<turn_aborted>")
    )


def categorize(text):
    hits = []
    for name, pattern in CATEGORY_PATTERNS.items():
        if re.search(pattern, text or "", flags=re.I):
            hits.append(name)
    return hits or ["uncategorized"]


def month_key(ts):
    return ts.strftime("%Y-%m") if ts else "(unknown)"


def build_report(records, source_files):
    records = [r for r in records if r.get("text") and not is_context_blob(r.get("text"))]
    records.sort(key=lambda r: r.get("timestamp") or dt.datetime.min.replace(tzinfo=dt.timezone.utc))
    total = len(records)
    sessions = {(r["source"], r.get("session_id")) for r in records if r.get("session_id")}
    date_min = records[0]["timestamp"] if records else None
    date_max = records[-1]["timestamp"] if records else None

    by_source = collections.Counter(r["source"] for r in records)
    sessions_by_source = collections.defaultdict(set)
    project_counts = collections.Counter()
    source_projects = collections.defaultdict(collections.Counter)
    categories = collections.Counter()
    category_examples = collections.defaultdict(list)
    exact = collections.Counter()
    fuzzy = collections.Counter()
    skill_counts = collections.Counter()
    monthly_source = collections.defaultdict(collections.Counter)

    for r in records:
        src = r["source"]
        sid = r.get("session_id")
        if sid:
            sessions_by_source[src].add(sid)
        proj = project_name(r.get("project"))
        project_counts[proj] += 1
        source_projects[src][proj] += 1
        monthly_source[month_key(r.get("timestamp"))][src] += 1
        text = r["text"]
        exact[normalize_text(text)] += 1
        fuzzy[re.sub(r"\b(?:phase|step)\s+<num>(?:\.<num>)*\b", "phase <num>", normalize_text(text))] += 1
        for cat in categorize(text):
            categories[cat] += 1
            if len(category_examples[cat]) < 6:
                category_examples[cat].append(text)
        for _, skill in SKILL_RE.findall(text):
            skill_counts[skill] += 1

    source_lines = []
    for src, count in by_source.most_common():
        source_lines.append(f"- {src}: {count} messages, {len(sessions_by_source[src])} sessions")

    project_lines = [
        f"- {proj}: {count} ({count / total:.1%})"
        for proj, count in project_counts.most_common(15)
    ]

    category_lines = [
        f"- {cat}: {count} ({count / total:.1%})"
        for cat, count in categories.most_common()
    ]

    repeated_lines = []
    for text, count in exact.most_common(25):
        if count > 1 and len(text) > 1:
            repeated_lines.append(f"- {count}x exact: {short(text)}")
    for text, count in fuzzy.most_common(25):
        if count > 2 and exact[text] != count and len(text) > 1:
            repeated_lines.append(f"- {count}x fuzzy: {short(text)}")
    repeated_lines = repeated_lines[:25]

    skill_lines = [f"- {name}: {count}" for name, count in skill_counts.most_common(30)]
    trend_lines = []
    for month in sorted(monthly_source)[-12:]:
        c = monthly_source[month]
        trend_lines.append(f"- {month}: Claude {c.get('claude', 0)}, Codex {c.get('codex', 0)}")

    examples_lines = []
    for cat, examples in sorted(category_examples.items()):
        examples_lines.append(f"### {cat}")
        for ex in examples[:4]:
            examples_lines.append(f"- \"{short(ex, 220)}\"")

    quality_metrics = {
        "verification_prompts": categories["verification_tests"],
        "ship_prompts": categories["ship_commit_push"],
        "planning_prompts": categories["plan_spec_roadmap"],
        "review_prompts": categories["review_audit"],
        "skill_prompts": categories["skills_workflow"],
        "correction_prompts": categories["correction_feedback"],
        "quality_prompts": categories["quality_slop"],
    }

    lines = [
        "# Session Workflow Quality Audit",
        "",
        f"Generated: {dt.datetime.now().astimezone().isoformat(timespec='seconds')}",
        "",
        "## Inputs",
    ]
    for key, value in source_files.items():
        lines.append(f"- {key}: {value}")
    lines += [
        "",
        "## Overview Stats",
        f"- Total normalized user messages: {total}",
        f"- Total sessions: {len(sessions)}",
        f"- Date range: {date_min.isoformat() if date_min else 'unknown'} to {date_max.isoformat() if date_max else 'unknown'}",
        "",
        "## Source Comparison",
        *source_lines,
        "",
        "## Recent Trend",
        *trend_lines,
        "",
        "## Top Projects",
        *project_lines,
        "",
        "## Category Counts",
        *category_lines,
        "",
        "## Skill Command Counts",
        *skill_lines,
        "",
        "## Repeated Prompt Patterns",
        *(repeated_lines or ["- No repeated prompt patterns found."]),
        "",
        "## Category Examples",
        *examples_lines,
        "",
        "## Quality Signal Metrics",
    ]
    for key, value in quality_metrics.items():
        lines.append(f"- {key}: {value}")
    lines += [
        "",
        "## Derived Judgment",
        "Short answer: the new workflows and skill usage are constraining AI slop in planning, routing, evidence capture, and repeatability, but they are not yet strong enough to constrain AI slop in implementation by default.",
        "",
        "The current workflow appears to constrain low-quality output when it forces evidence capture, scoped execution, review, and verification before shipping. The strongest positive signal is the high volume of explicit planning, verification, audit, and skill-routing prompts. The main negative signal is procedural surface area: many prompts are about shipping, routing, and next-step repair, which can hide weak implementation quality if the gate checks only docs or command success.",
        "",
        "The risk is not that skills inherently create more bad code. The risk is that skills can create compliant-looking work: plans, checkboxes, commits, and next commands that look rigorous while code quality is only indirectly tested. The system should therefore make code quality gates executable, diff-aware, and failure-oriented instead of primarily prose-oriented.",
        "",
        "## Audit Of New Workflow Shape",
        "- Recent repo work has clearly shifted toward durable workflow primitives: `run`, `ship`, `roadmap`, `research-roadmap`, `creator-media` evidence lanes, `alignment-loop`, and explicit next-step routing.",
        "- Recent commits show the system is improving routing and workflow correctness, including no-op verification handoff fixes, variation-gate fixes, roadmap self-routing fixes, mutation routing audits, alignment-loop additions, and creator-media evidence/routing additions.",
        "- `tasks/lessons.md` shows a real self-improvement loop. Recent lessons address dead-end handoffs, self-routing, late variation pruning, no-op verification handoffs, and final-response next-step omissions.",
        "- Existing code-quality infrastructure is present but underused as a default ship gate. `packs/code-quality/codex/quality-sweep/SKILL.md` already audits duplication, shared types, dead code, circular dependencies, weak types, error handling, legacy paths, and stale comments. That should become part of mutation shipping, not an optional cleanup lane.",
        "",
        "## Where Slop Is Still Getting Through",
        "- Verification is often command-based rather than claim-based. A passing `build` or `git diff --check` does not prove the implementation matches the user intent, preserves behavior, or has meaningful edge coverage.",
        f"- Shipping is overrepresented. There are {quality_metrics['ship_prompts']} shipping/commit/push prompts versus {quality_metrics['verification_prompts']} verification/test prompts. That does not prove bad shipping, but it shows the workflow pressure is toward closure.",
        "- Skill routing can become a compliance ritual. Recommending the next command is useful, but it is not a code-quality control unless the next command is selected from evidence and failure modes.",
        f"- The current history has only {quality_metrics['correction_prompts']} correction/feedback prompts and {quality_metrics['quality_prompts']} explicit quality/slop prompts. Those are valuable but sparse compared with the number of implementation and shipping actions.",
        "- Prompt examples show real correction moments, such as \"woah wait why did you make that change to the index? everything in the old code works\" and \"why did we change the svgmap and imagemap in the database?\" These are exactly the type of changes a diff-aware pre-ship review should catch before the user sees them.",
        "",
        "## Aggressive Anti-Slop Standard",
        "- No implementation ships without a manifest: changed files, why each file changed, user goal mapping, tests run, tests not run, known risk, and rollback note.",
        "- No non-trivial implementation ships without a second-pass review. Use a reviewer/subagent or `expert-review`/`quality-sweep audit` depending on scope, but require an adversarial pass before `ship`.",
        "- No feature is done until at least one negative/edge case is checked. For UI, that means responsive and state checks. For backend, that means invalid input and boundary behavior. For data migrations, that means current data compatibility.",
        "- No generated abstraction without a reason-to-change test. The agent must say what duplication or risk the abstraction removes; otherwise it stays local and boring.",
        "- No doc-only verification for code changes. Docs can be updated, but code changes need executable validation or an explicit, high-friction `not verified` risk entry.",
        "- No silent scope growth. If the diff touches files outside the plan, the ship gate must call that out and justify it.",
        "- No commit/push while unresolved unrelated tracked changes exist unless the ship manifest explicitly separates ownership and the operator accepts the boundary.",
        "",
        "## Ranked Recommendations",
        "| Rank | Pattern | Evidence Count | Recommendation Type | Suggested Control |",
        "| --- | --- | ---: | --- | --- |",
        f"| 1 | Verification/test prompts | {quality_metrics['verification_prompts']} | Standing instruction + skill contract | Every mutating skill must list exact changed files, exact tests, and untested risk. |",
        f"| 2 | Shipping prompts | {quality_metrics['ship_prompts']} | Ship gate | Block commit/push unless diff summary maps each changed file to user goal and verification. |",
        f"| 3 | Planning/spec prompts | {quality_metrics['planning_prompts']} | Plan quality gate | Require acceptance criteria to include negative tests and rollback/escape hatch for risky work. |",
        f"| 4 | Review/audit prompts | {quality_metrics['review_prompts']} | Agent/review lane | Run a mandatory adversarial review for non-trivial code before shipping. |",
        f"| 5 | Skill/workflow prompts | {quality_metrics['skill_prompts']} | Skill schema | Add a shared `Quality Gate` section to all implementation/shipping skills. |",
        f"| 6 | Correction prompts | {quality_metrics['correction_prompts']} | Lessons loop | Convert corrections into concrete skill tests or final-response checks within 24 hours. |",
        "",
        "## Required Workflow Changes",
        "- Promote `quality-sweep audit` into the default pre-ship path for non-trivial code changes. Use full `quality-sweep full` only for explicit cleanup campaigns.",
        "- Add a shared `Quality Gate` contract to `run`, `ship`, `ship-end`, `commit-and-push-by-feature`, and pack-level mutation skills.",
        "- Make `ship` refuse to summarize only docs/tasks when source files changed. It should include code file review, test evidence, and residual risk.",
        "- Add a lightweight script that scans a final response or ship manifest for required fields: changed files, tests, skipped tests, residual risk, next command.",
        "- Add `user correction -> lesson -> skill/test update` enforcement. A correction should not end at `tasks/lessons.md`; the relevant skill or validation script should change when possible.",
        "- Route implementation phases through labels: `afk`, `human-review`, or `pair`. High-risk work defaults to `human-review` even if an agent can technically implement it.",
        "- Treat `AI slop` as a measurable class: weak types, stale comments, speculative fallback paths, broad abstractions, untested UI states, unused exports, and source changes not traceable to the user goal.",
        "",
        "## Highest-Impact Automations",
        "- `quality-gate` skill: diff-aware pre-ship check that inspects changed files, test coverage, risk, and claims before commit/push.",
        "- `slop-check` review prompt or agent: asks what a rushed agent would have missed, then verifies the answer against code and tests.",
        "- `ship` hardening: require a machine-readable ship manifest with files, purpose, tests, skipped tests, and residual risk.",
        "- `run` hardening: require implementation steps to name concrete verification commands before edits begin.",
        "- `lessons` enforcement: add a test/scan that fails when a correction pattern is only documented but not reflected in the relevant skill.",
        "",
        "## Recommended Policy",
        "Default posture should be: agents may move fast, but shipping is adversarial. The work can be autonomous; acceptance cannot be casual.",
        "",
        "For every non-trivial mutation, require:",
        "- `Plan`: explicit scope, non-goals, risk, and verification commands.",
        "- `Implement`: smallest coherent diff, no opportunistic refactors.",
        "- `Self-review`: changed-file walkthrough and `what could be wrong?` list.",
        "- `Quality sweep`: targeted `quality-sweep audit` or equivalent code-quality lane.",
        "- `Verification`: executable checks plus manual/visual checks where relevant.",
        "- `Ship manifest`: commit boundary, tests, residual risk, next command.",
    ]
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--claude", type=Path, default=DEFAULT_CLAUDE)
    parser.add_argument("--codex", type=Path, default=DEFAULT_CODEX)
    parser.add_argument("--codex-sessions", type=Path, default=DEFAULT_CODEX_SESSIONS)
    parser.add_argument("--out", type=Path, default=Path("tasks/session-workflow-quality-audit.md"))
    args = parser.parse_args()

    records, source_files = load_records(args.claude, args.codex, args.codex_sessions)
    report = build_report(records, source_files)
    args.out.write_text(report, encoding="utf-8")
    print(f"Wrote {args.out}")


if __name__ == "__main__":
    main()
