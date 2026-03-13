---
name: plan-interview
description: Interview to validate and complete a specification
argument-hint: [optional-topic-override]
---

Using the project description provided above as a working draft, interview me in detail using the AskUserQuestionTool to validate, refine, and complete the specification. Treat the existing spec as a starting point that requires confirmation rather than settled decisions. Ask me to validate key assumptions and choices from the original document, probe for ambiguities and missing details, and explore edge cases, technical implementation, UI and UX considerations, concerns, and tradeoffs. Ask probing questions that challenge assumptions, explore failure modes, and uncover implicit requirements. Do not assume that what is written in the spec is final since I may deviate from it as we work through the details.

Ask one to three focused questions per turn. When a decision point genuinely has multiple viable approaches, list each option with a clear rationale and provide a simple pros and cons comparison. State your recommendation and explain why you recommend it. For the recommended option, explain how the con can be mitigated if doing so is feasible without compromising core functionality. If mitigation isn't needed, state that explicitly with your reasoning. Only present options when distinct alternatives genuinely exist. Do not manufacture choices or generate artificial options simply to follow this format.

Continue the interview until you have thoroughly covered all aspects of the specification including goals, user stories, technical architecture, data models, APIs, UI flows, edge cases, security, performance, and scope boundaries. Confirm with me before concluding that all areas have been addressed.

When finished, write the completed specification to spec.md incorporating all final decisions made during the interview. Also create an interview log file named [topic]-__interview.md__ where topic is a short kebab-case summary of the feature or product being planned. This file should record each turn of the interview including the questions asked, any options presented with their pros and cons evaluation, and my selections and responses. Conclude the file with a summary of any significant deviations from the original spec along with the reasoning behind those changes.
