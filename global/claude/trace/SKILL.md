---
name: trace
description: Follow a request end-to-end through the stack from route to database
type: review
version: v0.0
argument-hint: <route, endpoint, or feature to trace, e.g. "/api/products" or "user login flow">
---

# Trace

Follow a request or feature flow end-to-end through the application stack, mapping every layer from the entry point to the database and back.

## Process

1. **Identify the entry point** from `$ARGUMENTS`:
   - API route or page route → find the route handler or page component.
   - Feature name → identify the primary user action and its entry point.
   - tRPC procedure → find the router definition.
   - If unclear, ask the user for specifics.

2. **Read `CLAUDE.md`** for project conventions and architecture.

3. **Trace forward through the stack:**

   **Layer 1 — Entry Point:**
   - Route handler, page component, or API endpoint.
   - What middleware runs before it (auth, rate limiting, etc.).
   - What parameters/inputs it receives.

   **Layer 2 — Business Logic:**
   - Service functions, tRPC procedures, or server actions called.
   - Validation and transformation logic.
   - Authorization checks.

   **Layer 3 — Data Access:**
   - Database queries (Drizzle, Prisma, raw SQL).
   - External API calls.
   - Cache reads/writes.
   - What tables/collections are touched.

   **Layer 4 — Response:**
   - How the response is constructed.
   - What data is returned to the client.
   - Error handling at each layer.

4. **Map the data flow:**
   - What types are used at each boundary.
   - Where data is transformed or mapped.
   - Where validation happens.
   - Where errors are caught and how they propagate.

5. **Identify concerns:**
   - N+1 queries or redundant data fetches.
   - Missing error handling at layer boundaries.
   - Auth/authz gaps.
   - Type mismatches between layers.
   - Performance bottlenecks (large queries, missing indexes, unnecessary joins).

## Output Format

### Trace: [route/feature name]

```
[Entry] → [Middleware] → [Handler] → [Service] → [DB Query] → [Response]
file.ts:10   auth.ts:5    route.ts:20  svc.ts:45   db.ts:30     route.ts:25
```

### Layer-by-Layer

#### 1. Entry Point
- **File**: `app/api/route.ts:10`
- **Method**: GET/POST
- **Middleware**: auth, rate-limit
- **Input**: params, body, query

#### 2. Business Logic
- **File**: `services/foo.ts:45`
- **Called by**: route handler
- **Validates**: [what]
- **Calls**: [what functions/services]

#### 3. Data Access
- **File**: `db/queries/foo.ts:30`
- **Table(s)**: `products`, `categories`
- **Query type**: SELECT with JOIN
- **Indexes used**: [if identifiable]

#### 4. Response
- **Shape**: `{ data: Product[], count: number }`
- **Error cases**: 401, 404, 500

### Data Flow
```
Input (params) → validated → service call → DB query → transform → response
```

### Concerns Found
- [Any issues identified during the trace]

## Constraints
- Follow the actual code path — do not guess or assume based on naming conventions.
- Read each file in the chain; do not skip layers.
- Keep the output focused on the specific route/feature — do not map the entire application.
- If a layer uses dynamic dispatch or plugin patterns that make the path ambiguous, note the ambiguity.
- Do not modify any code — this is a read-only analysis.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/trace-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/trace-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
