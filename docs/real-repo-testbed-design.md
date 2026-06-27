# Real-Repo Testbed Mode — Design & Scoping

**Status:** research-backed design proposal (no code yet). **Date:** 2026-06-26.
**Trigger:** "run the benchmark on `eval-ideas` against a realistic project" surfaced that the
current harness has no realistic-project mode at all. This doc scopes one.

This is a scoping document. It does **not** propose merging anything yet — it establishes what a
real-repo testbed should and should not borrow from SWE-bench and the broader eval literature, and
how it would graft onto the harness we already have.

---

## 1. The premise correction that started this

The intuition was: "find a good GitHub project as a testbed and benchmark the skill against it,"
SWE-bench style. Investigating the harness first changed the premise:

**Today every benchmark run is fully self-contained.** `tests/harness/bench-runner.ts:runChunk`
does `createProject()` → `mkdtempSync(tmpdir(), "skill-test-")` + `git init`
(`tests/harness/runner.ts:createTempProject`), then `setup.setupProject(workDir)` seeds a handful
of synthetic fixture files, runs the agent with `cwd = workDir`
(`claude --print --dangerously-skip-permissions` / `codex exec --cd`), grades, and
`rmSync(workDir)`. No clone, no real repo, no repo mutation.

So an external GitHub repo cannot feed this harness *as built*. "Real-repo testbed" is a **new mode**
to design, not a config flag — and the design has to confront a tension SWE-bench never had.

## 2. The core tension: our skills are not patch-generators

SWE-bench works because each task is **a code patch graded by running unit tests** (FAIL_TO_PASS +
PASS_TO_PASS). That grading substrate does not exist for the skills in this repo. `eval-ideas`,
`brainstorm`, `roadmap`, `competitive-analysis`, etc. are **workflow / planning / research
orchestrators** that emit markdown artifacts, run manifests (`tasks/_working/*.yaml`), routing
decisions (`Recommended next command:`), and state files — there is no test suite to flip green.

Therefore the transferable idea is **not** SWE-bench's grading. It is SWE-bench's *environment*: drop
the agent into a **realistic, pinned snapshot of a real project** so that context resolution,
artifact discovery, and routing happen against real complexity instead of two hand-written stub
files. Grading then comes from the **non-code agent-eval** tradition (τ-bench, WebArena, HealthBench,
G-Eval), not from `pytest`.

Two axes, decoupled:

| Axis | SWE-bench answer | Our answer |
| --- | --- | --- |
| **Environment realism** | real repo @ pinned commit in Docker | **adopt** — pinned realistic repo snapshot in the temp workdir |
| **Grading substrate** | execute hidden unit tests | **reject** — use layered artifact grading (state assertions + reference-set + rubric/jury judge) |

## 3. What the literature says to copy (and not)

Full source survey in the appendix. The load-bearing principles:

### From real-repo code benchmarks (SWE-bench family, Terminal-Bench, MLE-bench, Commit0)
1. **Execution/state-grounded grading beats string match.** Every credible real-repo benchmark grades
   *final state*, not a diff against a gold string. RepoBench/CrossCodeEval's exact-match grading is
   the cautionary tale (rewards lexical mimicry, penalizes correct variants). Our current harness is
   regex/substring-based — exactly the brittle mode to move away from.
2. **Pin the environment hard; defeat dependency drift.** SWE-bench Live's "time-machine" (only
   package versions ≤ base-commit date) is the single strongest reproducibility idea. For us: pin the
   repo snapshot to a commit SHA and **vendor** it (don't live-clone) so runs are hermetic and
   offline.
3. **Anti-triviality check.** ~31% of SWE-bench "passes" relied on weak tests; Terminal-Bench runs a
   "dummy agent" that must *fail* every task. Any grading spec we write must reject the empty/no-op
   output.
4. **Layered contamination defense, not one method.** Date cutoff + continuous refresh (Live, +50/mo)
   + canary strings + held-out secret slice + n-gram audits. Human curation alone (SWE-bench Verified)
   still left ~half its issues pre-2020.
5. **Screen for underspecification & solution leakage.** 38% of raw SWE-bench tasks were
   underspecified; 32.67% leaked the fix in the issue text. Task prompts must not contain the answer.
6. **Decouple model from scaffold; report diversity.** Identical models swing <1%→17% on scaffold
   alone (MLE-bench). Verified's Django≈50% concentration overfits. Use a neutral reference invocation
   and spread tasks across repo types.

### From non-code agent grading (τ-bench, WebArena, AgentBench, HealthBench, G-Eval, MT-Bench)
The directly applicable answer to "how do you grade markdown + state files rigorously" — treat output
as **three separable layers**, strongest applicable technique each:

- **(a) Deterministic state assertions on produced files** (the τ-bench / WebArena `program_html`
  move). Parse emitted markdown + manifests + routing and assert *end-state* facts: required sections
  exist, frontmatter keys present, manifest references resolve to real files, routing decision ∈
  allowed set, prompt-history file written. Zero variance, un-gameable by eloquence, debuggable.
  **Backbone — should carry the most weight and gate the run.**
- **(b) Reference-set comparison** (the Spider/τ-bench denotation move). Author a gold *set* of
  must-hit decisions/state-mutations and compare as a **set** (order/dup-insensitive,
  paraphrase-tolerant), not a string diff. Catches confident-but-wrong outputs without over-
  constraining valid divergence. Fits tasks with a canonical expected outcome (e.g. eval-ideas must
  identify `batch-export` as the next pending idea).
- **(c) Rubric-checklist + jury LLM judge** (HealthBench / G-Eval / PoLL) — **only for the open-ended
  residue** (is the plan coherent? does the research cover the asked dimensions?). Decompose into many
  small binary criteria scored independently; this converts one high-variance holistic guess into an
  average of low-variance checks and blunts verbosity bias (FLASK 0.680 vs holistic 0.641 vs ROUGE
  0.333). **Mandatory guardrails:** disjoint-family jury (PoLL: better κ, cheaper, less
  self-preference), order-swap, length control, **grader validated against human labels with κ
  reported**, sampled not temp-0.
- **(d) pass^k reliability wrapper** (τ-bench). Report `pass^k = E[C(c,k)/C(n,k)]` (all k trials
  succeed) alongside pass@1. A planning skill that's right once but inconsistent is production-unsafe;
  pass@1 hides it (τ-bench: high pass@1, pass^8 < 25%).

### From statistical-rigor practice (Anthropic error-bars, LiveCodeBench)
- **Task count is the dominant lever, not reruns.** 1–3 tasks × 3 runs → ±30pt Wilson CI no matter
  what. Statistical n is *tasks × runs*; once `E[σ²_i]/K ≪ Var(x)` stop rerunning and add tasks.
  Target ≥30–50 task instances per skill for defensible numbers.
- **Separate `errored`/`blocked` from `failed`.** Infra timeouts/rate-limits are not skill failures —
  report `passed / failed / errored / blocked` as four buckets. (The harness already half-does this
  via `classifyInfrastructureBlock`; make it first-class in the report.)
- **Paired + clustered SE** when comparing skills/agents on a shared task set with pinned seeds (free
  variance reduction from 0.3–0.7 score correlation); never compare two CIs for overlap.
- **Goodhart warning on our own regex.** Hard regex assertions are the single most gameable target.
  Rotate phrasings and hold out a private task slice.

## 4. Proposed architecture (grafted onto the existing harness)

A new **third setup tier** beside `custom` and `generic` (`tests/harness/bench-setups.ts`):
`repo-fixture`. Minimal, additive — reuses the existing `SkillBenchSetup` interface
(`tests/harness/bench-types.ts`).

```
SkillBenchSetup (existing)
 ├─ setupProject(workDir)   ← extend: materialize a pinned repo snapshot, THEN layer task seeds
 ├─ assertResult(result)    ← layer (a): deterministic end-state assertions (already supported)
 ├─ referenceSet?           ← NEW layer (b): gold must-hit set + set-comparison grader
 ├─ qualityEvaluator        ← layer (c): swap/augment deterministic rubric with rubric+jury judge
 └─ (report)                ← NEW: pass^k, four-bucket accounting, paired SE
```

### 4.1 Repo snapshots — vendored, pinned, hermetic
A snapshot library under `tests/benchmarks/repos/<repo-slug>@<shortsha>/` (a vendored tarball or
checked-in subtree, **not** a live clone). `setupProject` untars it into `workDir`, runs `git init`
+ one commit so the skill sees real history, then writes task-specific seed artifacts on top
(e.g. a realistic `tasks/ideas.md` + `alignment/brainstorm-*.html`). Hermetic, offline, reproducible;
each snapshot carries a **canary string** for corpus decontamination and a `SOURCE.md` recording
origin URL + commit SHA + capture date + license.

### 4.2 What counts as a "real repo" for *these* skills — the honest scoping note
Pure SWE-bench sourcing (scrape public issues) does **not** transfer, because our grading target is a
planning artifact, not a patch, and because very few public repos carry this project's planning
surface (`tasks/`, `research/`, `alignment/`, `specs/`, the manifest conventions). Realistic options,
in priority order:

1. **Self-sourced snapshots (highest realism).** Sanitized, pinned snapshots of real projects that
   genuinely exercise the planning surface — including this repo and the user's own projects (e.g.
   the bismarck-v5 game project) at chosen commits. These are the *true* distribution these skills run
   against. Sanitize secrets; record provenance.
2. **Public repos with rich planning artifacts** for context-resolution realism (large monorepos with
   real `docs/`, roadmaps, issue exports) where the skill's job is to *operate within* complexity even
   if the exact conventions differ.
3. **Synthesized realistic repos** — generate a full multi-file project state (dozens of files, real
   git history, plausible ideas/roadmap) rather than two stub files. Cheaper, fully controllable, no
   contamination risk; lower ecological validity. Good for filling out task count to ≥30.

A mature suite mixes all three and **reports the mix**, mirroring SWE-bench-Multilingual's diversity
lesson.

### 4.3 Grading wiring
- **(a)** stays in `assertResult` — already the pass/fail gate. Harden assertions to parse normalized
  values, not raw strings (the WebArena-Verified false-negative lesson).
- **(b)** a new `referenceSet` grader: extract semantic items from the produced artifacts, compare to
  the gold set as sets with an LLM equivalence check for paraphrase. Contributes to score, can gate on
  critical items.
- **(c)** extend `tests/harness/bench-quality.ts`: keep the deterministic rubric as the cheap default,
  add an **optional** rubric+jury LLM-judge path for open-ended criteria, behind a flag (cost). Report
  judge κ vs a small human-labeled calibration set before trusting it.
- **(d)** extend `tests/harness/bench-report.ts`: add `pass^k` (unbiased `C(c,k)/C(n,k)`), the
  four-bucket accounting, and paired/clustered SE for cross-skill/agent comparison. Wilson CI stays.

### 4.4 Anti-triviality & contamination gates
- A **no-op baseline** run per task (empty/stub output) that must score *fail* — if it passes, the
  grading spec is too weak (Terminal-Bench dummy-agent).
- Canary strings in every snapshot; a held-out private task slice never committed; date-stamped
  snapshots so contamination can be reported, not assumed away.

## 5. Phased rollout (proposed, not started)

- **Phase 0 — pilot on `eval-ideas` (1 skill).** Build one `repo-fixture` snapshot (self-sourced from
  this repo or bismarck-v5) carrying a real brainstorm/ideas surface; port the existing layer4
  `eval-ideas` scenario (`pack-workflows.setup.ts:1211`) onto it; implement layer (a)+(b) grading and
  pass^k reporting. Compare numbers vs the synthetic-fixture baseline. **This is where the originally
  requested run actually belongs** — against a real snapshot, with honest grading.
- **Phase 1 — grading library.** Generalize (b) reference-set + (c) rubric/jury judge into reusable
  harness modules with a calibration harness reporting judge κ.
- **Phase 2 — snapshot library + task count.** Curate 30–50 tasks across the three repo sources;
  wire four-bucket reporting, paired SE, held-out slice, canaries.
- **Phase 3 — refresh discipline.** Date-window + periodically re-snapshot to stay ahead of training
  cutoffs (SWE-bench-Live model).

## 6. Open questions for the human

1. **Snapshot sourcing consent/sanitization.** Self-sourced snapshots (this repo, bismarck-v5) give
   the most realism but need a sanitization pass for secrets and a provenance record. OK to vendor
   them under `tests/benchmarks/repos/`?
2. **LLM-judge budget.** Layer (c) adds per-run model cost and needs a human-labeled calibration set.
   Worth it now, or stay deterministic-only until (a)+(b)+pass^k are in?
3. **Scope of v1.** Pilot `eval-ideas` only, or design the snapshot/grading library for the whole
   product-design pack at once?
4. **Task-count ambition.** ≥30–50/skill is the statistically defensible target but is real authoring
   work. Acceptable to ship Phase 0 as a *capability demo* (small n, clearly labeled not-definitive)
   before investing in count?

## 7. What we explicitly are NOT doing
- Not copying SWE-bench's execute-the-patch grading (no patch, no tests).
- Not live-cloning repos at runtime (non-hermetic, contamination-prone, network-flaky).
- Not replacing the deterministic backbone with an LLM judge — the judge is for the open-ended
  residue only, validated and juried.
- Not treating any small-n run as statistically definitive.

---

## Appendix — sources

**Real-repo code benchmarks:** SWE-bench (arXiv:2310.06770) · SWE-bench Verified
(openai.com/index/introducing-swe-bench-verified) · SWE-bench Multimodal (arXiv:2410.03859) ·
SWE-bench Live (arXiv:2505.23419) · SWE-bench Multilingual (swebench.com/multilingual.html) ·
Terminal-Bench (tbench.ai) · Aider polyglot (aider.chat/2024/12/21/polyglot.html) · MLE-bench
(arXiv:2410.07095) · Commit0 (arXiv:2412.01769) · SWE-Lancer (arXiv:2502.12115) · RepoBench
(arXiv:2306.03091) · CrossCodeEval (arXiv:2310.11248). **Criticisms:** SWE-bench Illusion
(arXiv:2506.12286) · SWE-Bench+ (arXiv:2410.06992).

**Non-code agent grading:** GAIA (arXiv:2311.12983) · τ-bench (arXiv:2406.12045) + τ²-bench
(arXiv:2506.07982) · WebArena (arXiv:2307.13854) · VisualWebArena (arXiv:2401.13649) · AgentBench
(arXiv:2308.03688) · MLAgentBench (arXiv:2310.03302) · Spider (arXiv:1809.08887) + test-suite
(arXiv:2010.02840) · BIRD (arXiv:2305.03111) · G-Eval (arXiv:2303.16634) · MT-Bench/Arena
(arXiv:2306.05685) · Judging-the-Judges (arXiv:2406.12624) · PoLL (arXiv:2404.18796) · Rating
Roulette (arXiv:2510.27106) · HealthBench (arXiv:2505.08775) · FLASK (arXiv:2307.10928) ·
Prometheus-2 (arXiv:2405.01535).

**Statistical rigor:** Anthropic "Adding Error Bars to Evals" (arXiv:2411.00640) · pass@k unbiased
estimator (Chen et al. 2021, HumanEval) · pass^k (τ-bench) · LiveCodeBench (arXiv:2403.07974) · How to
Correctly Report LLM-as-a-Judge (arXiv:2511.21140) · data-efficient eval / SubLIME (arXiv:2406.15527).

**Harness internals referenced:** `tests/bench.ts` · `tests/harness/bench-runner.ts` ·
`tests/harness/runner.ts` · `tests/harness/bench-setups.ts` · `tests/harness/bench-types.ts` ·
`tests/harness/bench-quality.ts` · `tests/harness/bench-similarity.ts` · `tests/harness/bench-report.ts` ·
`tests/layer4/setups/packs/pack-workflows.setup.ts:1211` (eval-ideas scenario).
