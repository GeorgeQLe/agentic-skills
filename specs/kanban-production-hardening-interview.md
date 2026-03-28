# Interview Log: Kanban Production Hardening

**Date:** 2026-03-27
**Interviewer:** Claude
**Output:** Two specs — `kanban-production-test-plan.md` and `kanban-offline-queue-soft-delete.md`

---

## Turn 1: Scope and Strategy

### Questions Asked

1. **Concurrency scenario:** Claude-to-Claude races vs Claude + Web App vs both?
2. **Test database:** Separate test DB vs production with cleanup?
3. **Resilience scope:** Graceful errors only vs retry logic vs offline queue?

### Options Presented

**Concurrency:**
- Claude-to-Claude only — matches existing hostname conflict detection
- Claude + Web App — more realistic but needs API simulation
- Both — comprehensive but doubles test surface

**Test DB:**
- Separate test DB (Recommended) — safe for destructive tests
- Production with cleanup — simpler setup but riskier
- Both — test DB for load, production for concurrency

**Resilience:**
- Graceful errors only (Recommended) — verify failure UX
- Errors + retry logic — adds ~30 lines
- Errors + offline queue — significant new feature

### Selections

- **Both concurrency scenarios** — user wants comprehensive coverage
- **Production with cleanup** — user prefers simplicity over test DB isolation
- **Errors + offline queue** — user wants full resilience including local queueing

### Deviation from Recommendations

User chose production DB over recommended separate test DB (accepted risk of cleanup failures). User chose the most ambitious resilience option (offline queue) over the recommended graceful-errors-only approach.

---

## Turn 2: Technical Deep Dives

### Questions Asked

1. **Web app simulation:** Raw SQL, Poketo API calls, or both?
2. **Offline queue scope:** Test plan only (defer implementation) or full spec here?
3. **Load scale:** Moderate (100), heavy (500+), or progressive?

### Options Presented

**Web App Sim:**
- Raw SQL — reverse-engineer web app patterns
- Poketo API calls — more realistic, needs auth
- Both layers — API for realistic sim, raw SQL for edge cases

**Offline Scope:**
- Test plan only (Recommended) — keeps spec focused
- Full spec here — one document covers everything

**Load Scale:**
- Moderate (100 cards)
- Heavy (500+ cards)
- Progressive (50→100→250→500 with latency profiling)

### Selections

- **Both layers** for web app simulation
- **Full spec here** — user wants the complete offline queue design in this spec
- **Progressive** load testing with ramp-up tiers

### Deviation from Recommendations

User chose full spec over recommended test-plan-only for the offline queue.

---

## Turn 3: Offline Queue and Concurrency Details

### Questions Asked

1. **Queue scope:** Queue all commands (reads + writes) or writes only?
2. **Conflict resolution:** Last-write-wins, detect-and-prompt, or detect-and-skip?
3. **Race scenarios:** Move-move, move+update, or all CRUD races?

### Options Presented

**Queue Scope:**
- Writes only (Recommended) — reads fail immediately since stale data causes bad decisions
- Writes + cached reads — more complex, lets skills continue during outages
- Writes + stale reads with --offline flag — user-controlled

**Conflict Resolution:**
- Last-write-wins — simple, predictable, may overwrite
- Detect and prompt — check updatedAt, surface conflicts to user
- Detect and skip — auto-skip conflicts, log for review

**Race Cases:**
- Move-move races only
- Move + update races
- All CRUD races — comprehensive, 10+ scenarios

### Selections

- **Writes only** (accepted recommendation) — reads fail when Neon is down
- **Detect and prompt** — surface conflicts for user decision
- **All CRUD races** — comprehensive coverage

---

## Turn 4: Implementation Details

### Questions Asked

1. **Queue storage:** better-sqlite3, plain JSON file, or JSON with lock file?
2. **Sync UX:** Sync subcommand, interactive sync, or conflict file + apply?
3. **Load metrics:** Full latency profiling (p50/p95/p99) or timeout thresholds?

### Options Presented

**Queue Store:**
- better-sqlite3 (Recommended) — proven in project, WAL mode, atomic writes
- Plain JSON file — simpler but no atomicity
- JSON with lock file — middle ground

**Sync UX:**
- Sync subcommand (Recommended) — non-interactive, outputs conflict JSON
- Interactive sync — prompts for each conflict via stdin
- Conflict file + apply — two-step, fully non-interactive

**Metrics:**
- Latency metrics (Recommended) — p50/p95/p99 performance profile
- Timeout thresholds — simple pass/fail

### Selections

- **better-sqlite3** (accepted recommendation) — reuse archived kanban-lite dependency
- **Sync subcommand** (accepted recommendation) — preserves JSON-in/JSON-out contract
- **Latency metrics** (accepted recommendation)

---

## Turn 5: Thresholds, Undo, and API

### Questions Asked

1. **API docs:** Available or reverse-engineer?
2. **Latency thresholds:** Define now, baseline first, or both?
3. **Undo scope:** Safety gates only, soft-delete with TTL, or full audit log?

### Options Presented

**Thresholds:**
- Define thresholds now — concrete SLOs from day one
- Baseline first (Recommended) — first run establishes baseline, 20% regression tolerance
- Both — hard ceiling + baseline comparison

**Undo:**
- Safety gates only — test existing safeguards
- Soft-delete with TTL (Recommended) — deleted_at column, 30-day recovery window, ~40 lines
- Full audit log — point-in-time recovery, more complex

### Selections

- **Reverse-engineer** — no API docs available
- **Both** threshold approaches — hard ceilings + baseline regression detection
- **Soft-delete with TTL** (accepted recommendation)

---

## Turn 6: Offline Queue Edge Cases

### Questions Asked

1. **Queue growth limit:** Hard limit, no limit with warning, or time-based expiry?
2. **Queue ordering:** Strict FIFO, dependency-aware batching, or FIFO with rollback?
3. **SQLite corruption recovery:** Detect and reset, WAL checkpoint + integrity check, or dual-write?

### Selections

- **Hard limit at 100 ops** (accepted recommendation) — new writes fail when full
- **Strict FIFO** (accepted recommendation) — apply in queue order, skip failures, continue
- **Detect and reset** (accepted recommendation) — rename corrupt file, create fresh DB

---

## Turn 7: Final Scope

### Questions Asked

1. **Spec structure:** One unified spec or split into two?

### Options Presented

- One unified spec — comprehensive single reference
- Split into two — test plan (concurrency, load, safety) separate from feature spec (offline queue, soft-delete)

### Selection

- **Split into two specs** — cleaner separation of testing vs new features

---

## Summary of Deviations from Original Draft

| Area | Original Assumption | Final Decision | Reasoning |
|------|-------------------|----------------|-----------|
| Test DB | Separate test DB recommended | Production with cleanup | User prefers simplicity; cleanup strategy with [TEST]-prefixed boards mitigates risk |
| Resilience | Graceful errors only recommended | Full offline queue + soft-delete | User wants production resilience, not just test coverage |
| Offline scope | Test plan only recommended | Full feature spec included | User wants one planning pass, not two |
| Spec structure | Started as one spec | Split into two | Test plan vs feature spec are cleanly separable; keeps each document focused |
| Conflict resolution | Could have been last-write-wins (simplest) | Detect and prompt | User values data safety over simplicity; sync subcommand preserves non-interactive contract |
| Load testing | Could have been fixed threshold | Progressive with p50/p95/p99 + hard ceilings + baseline regression | User wants performance profiling, not just pass/fail |
