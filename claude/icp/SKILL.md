---
name: icp
description: Customer discovery interview — map the problem space, ICP, user journeys, and value prop before designing a solution
argument-hint: [optional: rough idea or problem area]
---

# ICP — Customer Discovery Interview

Interview the founder to map the complete problem space before any solution design begins. This skill owns the **problem space** — who the customer is, who the user is, what their current experience looks like, where it breaks down, and what value we can uniquely provide. The output feeds directly into `/plan-interview` for solution design.

## Modes (auto-detected)

### Greenfield (no meaningful source code)
No codebase exists yet. Start from the founder's idea or problem area. The interview builds the customer and market picture from scratch.

### Existing Project (source code exists)
A product already exists. Read the codebase, README, package config, and existing specs to understand what's been built, then interview to determine who it's actually for and whether it serves them. Acknowledge upfront: "We're working backwards from a solution — let's find the right problem and customer fit for what you've built, and identify where there might be misalignment."

## Process

### 1. Gather Context

**Greenfield:** Read `$ARGUMENTS` if provided. Check if `specs/` or `spec.md` exist from a prior `/plan-interview` session. If so, use them as background context but do not treat them as settled — the ICP interview may reshape the product direction.

**Existing project:** Read CLAUDE.md, README, package config, key source files, routes, data models, and existing specs to understand what the product does today. Summarise your understanding back to the user before beginning the interview.

### 2. Interview

Use the AskUserQuestion tool. Ask 1–3 focused questions per turn. When genuine alternatives exist, present options with pros/cons and a recommendation — same style as `/plan-interview`.

Cover these areas in order:

#### A. Customer Profile
- Who pays for this? Role, title, company size/type, industry
- What's their budget authority? Who else is involved in buying decisions?
- What triggers them to look for a solution? What pain becomes unbearable?
- How do they discover new tools? (Search, word of mouth, conferences, vendor outreach)

#### B. User Profile(s)
- Who uses this daily? (May be same as customer or different)
- What's their role, technical sophistication, and daily goals?
- What frustrates them most about their current workflow?
- Are there multiple user tiers? (Power user vs. casual, admin vs. end-user)

#### C. Current State Journey
- Walk through the user's workflow step by step — how do they handle this problem today?
- What tools, spreadsheets, manual processes, or workarounds do they use?
- Where do handoffs happen? Where does information get lost?
- What does "done well" look like for them today?

#### D. Pain Map
- For each step in the current journey: what breaks down?
- What's costly, slow, error-prone, or simply missing?
- How severe is each pain? (Annoyance vs. revenue loss vs. compliance risk)
- How frequently does each pain occur?

#### E. Market Landscape
- What alternatives exist? (Competitors, internal tools, manual processes, "do nothing")
- Where do alternatives fall short?
- What has the user/customer already tried and abandoned? Why?
- What gap does no one fill?

#### F. Value Proposition
- Given everything above, what unique value do we provide?
- Why would the customer choose us over the alternatives?
- What's the wedge — the single most compelling reason to switch?
- What's the "aha moment" where the user sees the value?

#### G. Customer ↔ User Relationship
- How does the customer discover, evaluate, and decide to buy?
- How is the product provisioned to users? (Self-serve, admin invite, IT deployment)
- Where do the customer journey and user journey overlap or diverge?
- Who champions adoption internally?

### 3. Conclude

Confirm with the user that all areas have been covered. Summarise the key findings and any surprising insights or tensions discovered during the interview.

## Output

Write two files:

### `specs/icp.md`
Structured discovery document with these sections:
1. **Customer Profile** — buyer persona, triggers, discovery channels
2. **User Profile(s)** — daily user persona(s), technical sophistication, goals
3. **Current State Journey** — step-by-step workflow without our product
4. **Pain Map** — where the current state breaks down, severity, frequency
5. **Market Landscape** — alternatives, their shortcomings, the unaddressed gap
6. **Value Proposition** — our unique wedge, the "aha moment"
7. **Customer ↔ User Dynamics** — buying process, provisioning, adoption path

### `specs/icp-interview.md`
Raw interview log — every question asked, options presented, user responses, and a closing summary of key insights and any surprises.

Create the `specs/` directory if it doesn't exist.

## Constraints

- **Stay in problem space.** Do not propose features, architecture, UI, or technical solutions. That is `/plan-interview`'s job.
- **In existing-project mode**, note misalignments between what's built and what the ICP actually needs, but do not prescribe fixes — that's `/mvp-gap`'s job.
- **Challenge assumptions.** If the founder says "everyone needs this," push back: who specifically? If they say "our users are developers," ask what kind — frontend, backend, DevOps, data?
- **Continue until all 7 areas are covered.** Do not conclude early. Confirm with the user before wrapping up.
- **Do not overwrite existing `specs/icp.md`** without asking the user first.
