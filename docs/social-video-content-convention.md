# Social Video Content Convention

Research date: 2026-06-25.
Canonical package asset: `assets/social-video-content-convention.md`.

This convention guides build-in-public and alignment-producing agents when they draft source-safe video ideas, outlines, hooks, and scripts for YouTube long-form, YouTube Shorts, TikTok, Instagram Reels, LinkedIn video, and reusable founder/devtool video prompts. It covers ideation and scripting guidance only; it does not authorize auto-publishing, video production, scraping, uploading, or account operations.

## Rules Vs Norms

- **Platform official guidance** is treated as rule-level guidance: help-center docs, product docs, advertising specs, creator safety docs, and community guidelines.
- **Creator/practitioner norms** are treated as optional style guidance: hook patterns, pacing, repurposing tactics, caption habits, thumbnail conventions, and common duration preferences.
- If official guidance conflicts with creator advice, use official guidance and explain the conflict.
- If a limit varies by account verification, region, app surface, ad format, or current experiment, draft conservatively and mark the pre-publish check.

## Agent Source-Safety Rules

Video ideas are high leak-risk because scripts often reference screens, metrics, customers, and demos. Do not propose or script:

- Private dashboards, customer data, repo internals, incident timelines, prompts, logs, secrets, tokens, hostnames, keys, or unredacted terminal output.
- Customer names, logos, testimonials, quotes, or usage metrics without explicit approval.
- Benchmark, performance, security, compliance, quality, or adoption claims without a named source basis.
- Unannounced launch dates, roadmap promises, pricing, support commitments, or integration promises.
- AI-generated likeness, voice, screenshot, or synthetic demonstration without disclosure and platform-specific AI/synthetic media compliance.
- Music, clips, memes, watermarked footage, or third-party assets without rights.

Every video concept must include:

- `target_channel`
- `drafting_mode`: `platform_aligned` or `creator_inspired`
- `source_basis`
- `format`: long-form, short-form, native feed video, poll/post-adjacent video, or reusable prompt
- `hook`
- `outline_or_script`
- `visual_plan`
- `risk_level`
- `claim_safety_notes`
- `asset_safety_notes`
- `publish_precheck`

## Drafting Modes

`platform_aligned`:

- Follows official constraints and safety guidance.
- Uses conservative duration, aspect ratio, title, description, caption, disclosure, and copyright assumptions.
- Prioritizes accessibility, clear metadata, and accurate source boundaries.

`creator_inspired`:

- May use current creator/operator norms: faster hooks, before/after structure, behind-the-scenes narrative, screen-recording pacing, native captions, and repurposed cuts.
- Must label those as practitioner norms, not platform policy.
- Must not use bait, fake urgency, misleading retention tactics, or unsupported claims.

## Cross-Channel Defaults

- Confirm the publish goal before scripting: teach, announce, demo, recruit feedback, summarize research, or invite discussion.
- Make one core claim per short video and one coherent arc per long-form video.
- Write the claim before the hook. Hooks may be punchy, but they must remain true.
- Include caption/subtitle notes whenever the platform supports or expects silent playback.
- Mark any screen capture as `needs-redaction-review` unless the content is already public or explicitly approved.
- Prefer showing a public artifact, sanitized diagram, public changelog, or recreated demo data over recording private product state.
- Include "what not to show" notes for every demo concept.
- Do not promise a follow-up video, launch, benchmark, or feature unless the user approves the commitment.

## Channel Profiles

### YouTube Long-Form

**Audience expectation:** Searchable, durable technical or founder content. Good fit for walkthroughs, tutorials, design decisions, benchmark explanations, launch retrospectives, and public build narratives.

**Format patterns:** Tutorial, architecture breakdown, demo walkthrough, case-study explanation, devlog, interview, teardown, or long-form update that can be chaptered.

**Length guidance:** YouTube default uploads are up to 15 minutes until the account is verified; verified accounts can upload longer videos, with YouTube documenting a maximum upload size of 256 GB or 12 hours, whichever is less. For drafting, prefer the shortest length that completes the teaching arc.

**Metadata, link, and media norms:** YouTube Help documents 100-character title limits, 5,000-character descriptions, thumbnails, playlists, audience settings, altered-content disclosure, chapters, tags, captions, end screens, cards, copyright checks, and visibility. Practitioner norm is to use a searchable title, strong first 30 seconds, chaptered structure, clear thumbnail premise, and pinned resources.

**Tone:** Useful, precise, and durable. Avoid hype that will age poorly.

**Spam or policy triggers:** Copyright claims, undisclosed altered/synthetic content, misleading metadata, unsafe claims, reused clips without rights, and community-guideline strikes.

**Source-safety risks:** Screen recordings, terminal output, unreleased roadmap, customer examples, private repositories, and benchmark charts.

**`platform_aligned`:** Produce a title, one-paragraph description, disclosure checklist, chapter outline, source-safe visual plan, and upload checks.

**`creator_inspired`:** Produce a teaching-first story arc: cold open, problem, failed/simple approach, decision, demo, lesson, and viewer question.

### YouTube Shorts

**Audience expectation:** Fast, vertical or square, one-idea videos that can introduce a longer video, demo, or build note.

**Format patterns:** One quick lesson, mini-demo, before/after, misconception correction, tool tip, "what changed" note, or long-form teaser with related-video path.

**Length guidance:** YouTube Help says square or vertical videos uploaded after 2024-10-15 can be Shorts up to three minutes. Draft 15 to 60 seconds by default unless the idea needs the extra time; mark Content ID risk for Shorts longer than one minute.

**Metadata, link, and media norms:** YouTube Help describes linking Shorts to related channel videos and notes that wider-aspect videos avoid Shorts classification. Practitioner norm is to hook immediately, show the result early, use captions, and cut anything that does not serve the single idea.

**Tone:** Clear, quick, and demonstration-led.

**Spam or policy triggers:** Reused clips, copyrighted audio, misleading before/after, unverified claims, and pushing users off-platform without value.

**Source-safety risks:** Quick demos can flash secrets or private data. Redaction review is mandatory for screen capture.

**`platform_aligned`:** Draft a 30- to 60-second vertical/square outline with caption text, no copyrighted assets, and a related-video note only when a public video exists.

**`creator_inspired`:** Draft a sharper 15- to 45-second hook-demo-payoff script with one visual beat per line and a concise final question.

### TikTok

**Audience expectation:** Native, fast-paced, accessible, personality-forward short-form video. Technical/devtool posts need an immediate problem, visual proof, or useful trick.

**Format patterns:** Quick demo, "watch me fix/build", contrarian lesson, green-screen explanation, stitch/duet only with rights and context, storytime lesson, or rapid before/after.

**Length guidance:** TikTok Help says the app lets users select a maximum length before recording and supports upload flows from app and web. Draft short by default: 15 to 60 seconds for one idea, longer only when the story or demo needs it and the account supports it.

**Metadata, link, and media norms:** TikTok Help supports descriptions, hashtags, tags, location, links where available, privacy controls, drafts, filters, sounds, text, stickers, effects, advanced editing, and up to 35 photos for photo posts. TikTok AI guidance requires or encourages labeling AI-generated or significantly edited realistic content and prohibits harmful synthetic content.

**Tone:** Direct, visual, and native. Avoid corporate polish.

**Spam or policy triggers:** TikTok integrity rules prohibit deceptive behavior, spam, artificial engagement, account manipulation, unoriginal or reused material without creative edits, and IP violations.

**Source-safety risks:** Trend audio/IP rights, accidental private data in screen recordings, AI/synthetic media disclosure, and exaggerated product claims.

**`platform_aligned`:** Draft a short vertical concept with privacy, AI-label, copyright, and source-safety checks.

**`creator_inspired`:** Draft a fast "here is the problem/result" hook, three visual beats, native caption text, and a comment prompt that does not ask for artificial engagement.

### Instagram Reels

**Audience expectation:** Short-form visual storytelling for an Instagram-connected audience. Good fit for polished demos, founder clips, design/process moments, and concise before/after narratives.

**Format patterns:** Screen-demo clip, face-to-camera lesson, carousel-adjacent recap, design/process reveal, mini tutorial, or short launch teaser.

**Length guidance:** Current reporting from Instagram leadership in 2025 says Reels support up to three minutes, while Meta creator guidance has also emphasized short, shareable videos for discovery. Draft 15 to 60 seconds by default, 60 to 90 seconds for complex demos, and mark anything longer as `verify_current_reels_limit`.

**Metadata, link, and media norms:** Use native captions/on-screen text, safe cover text, rights-cleared audio, and a caption that adds context rather than repeats the video. Practitioner norm is to make the first frame intelligible without sound and to keep the premise visually obvious.

**Tone:** Clear, visual, accessible, and less text-heavy than LinkedIn.

**Spam or policy triggers:** Reused/watermarked content, misleading claims, unlicensed music, over-tagging, and content that feels like a repurposed ad with no Instagram-native value.

**Source-safety risks:** Instagram audiences may include customers, investors, personal contacts, and public followers; avoid private roadmap and customer details.

**`platform_aligned`:** Draft a conservative Reel concept with a short hook, caption, visual beats, accessibility note, rights check, and current-limit verification.

**`creator_inspired`:** Draft a more polished before/after or "build moment" script with a strong first frame, short captions, and one useful takeaway.

### LinkedIn Video

**Audience expectation:** Professional feed video for business, career, technical leadership, product education, and founder credibility.

**Format patterns:** Native feed video, founder camera note, short demo, product lesson, conference-style clip, customer-safe explainer, or launch video.

**Length guidance:** LinkedIn Marketing Solutions says LinkedIn Video Ads can be 3 seconds to 30 minutes, and that shorter videos can capture attention while longer videos tell deeper stories. For organic founder/devtool video, draft 45 to 120 seconds by default unless the content is explicitly long-form.

**Metadata, link, and media norms:** LinkedIn says video ads appear natively in the feed, can use 4:5, 9:16, 16:9, or 1:1 aspect ratios, use MP4/H.264/AAC, autoplay muted, and strongly recommend captions. Practitioner norm is to make the first frame and caption work without sound, and to put the business/technical relevance upfront.

**Tone:** Credible, concise, expert, and practical.

**Spam or policy triggers:** Overly promotional ad copy, unsupported customer or ROI claims, engagement bait, and excessive tagging.

**Source-safety risks:** Professional audiences infer commitments and credibility from the content. Be conservative with roadmap, customer, security, hiring, and revenue implications.

**`platform_aligned`:** Draft a captioned professional video outline with muted-autoplay first-frame text, source-safe claims, and media specs/prechecks.

**`creator_inspired`:** Draft a founder/operator "what changed and why it matters" clip with a direct lesson and a restrained discussion prompt.

## Reusable Founder And Devtool Video Prompts

Use these prompts only when the source basis exists. Each prompt should be specialized to the selected channel and drafting mode.

### Before And After

- **Use when:** There is a public or sanitized before/after artifact.
- **Hook:** "This looked simple until we saw the old flow."
- **Structure:** Problem state, constraint, change, result, lesson.
- **Risk:** Medium; before/after claims can overstate impact.
- **Safety checks:** Verify screenshots, metrics, and user/customer context.

### Bug Hunt Or Incident Lesson

- **Use when:** The incident is public or fully sanitized.
- **Hook:** "The bug was not where we expected."
- **Structure:** Symptom, false lead, root cause, fix, prevention.
- **Risk:** High; incidents often expose private data or blame.
- **Safety checks:** Remove customer, uptime, security, and personnel details unless approved.

### Architecture Decision

- **Use when:** There is an approved technical decision or design note.
- **Hook:** "We chose the boring option for a reason."
- **Structure:** Options, constraint, decision, tradeoff, what to revisit.
- **Risk:** Medium; avoid exposing private architecture or security posture.
- **Safety checks:** Keep diagrams sanitized and avoid infrastructure identifiers.

### Changelog Demo

- **Use when:** A feature, skill, package, or workflow change is public.
- **Hook:** "Tiny change, better workflow."
- **Structure:** Before, new behavior, example, why it matters, next safe step.
- **Risk:** Low to medium.
- **Safety checks:** Do not promise availability beyond what is shipped.

### Research Insight

- **Use when:** A research synthesis has approved public-safe findings.
- **Hook:** "The surprising part was not the answer; it was the assumption."
- **Structure:** Question, evidence, insight, implication, caveat.
- **Risk:** Medium to high.
- **Safety checks:** No confidential interview details, customer names, or overgeneralized market claims.

### Benchmark Or Measurement

- **Use when:** Public benchmark methods and results are approved.
- **Hook:** "The number changed only after we measured the right thing."
- **Structure:** Baseline, method, result, caveat, decision.
- **Risk:** High.
- **Safety checks:** Include methodology, avoid cherry-picking, and do not compare competitors without evidence.

### Build-In-Public Weekly Note

- **Use when:** There is an approved weekly work summary.
- **Hook:** "This week we learned where the workflow breaks."
- **Structure:** Shipped, learned, changed, still uncertain, next approved question.
- **Risk:** Medium.
- **Safety checks:** Do not disclose private roadmap or unfinished commitments.

## BIP Page Output Shape

When an alignment page uses this convention, render video ideas with these fields:

- `channel`
- `drafting_mode`
- `format`
- `idea_title`
- `source_basis`
- `hook`
- `outline_or_script`
- `visual_plan`
- `caption_or_description`
- `risk_level`
- `claim_safety_notes`
- `asset_safety_notes`
- `publish_precheck`
- `user_decision`: `approve`, `revise`, `reject`, or `not-now`

Final YAML from the BIP page should preserve selected video ideas, rejected ideas, user edits, mode decisions, target channel decisions, and publish-readiness checks. Approval of a video idea is not approval to publish; it only authorizes the producing skill to record the approved BIP content decisions and continue the alignment flow.

## Sources Accessed 2026-06-25

Official/platform sources:

- YouTube Help, [Upload YouTube Videos](https://support.google.com/youtube/answer/57407), [Upload Videos Longer Than 15 Minutes](https://support.google.com/youtube/answer/71673), [Understand Three-Minute YouTube Shorts](https://support.google.com/youtube/answer/15424877), and [Learn About Posts](https://support.google.com/youtube/answer/9409631).
- TikTok Support, [Making a Post](https://support.tiktok.com/en/using-tiktok/creating-videos/making-a-post) and [About AI-Generated Content](https://support.tiktok.com/en/using-tiktok/creating-videos/ai-generated-content).
- TikTok Community Guidelines, [Integrity and Authenticity](https://www.tiktok.com/community-guidelines/en/integrity-authenticity/).
- LinkedIn Marketing Solutions, [Video Ads](https://business.linkedin.com/advertise/ads/sponsored-content/video-ads), used for feed-video specs and muted-autoplay/caption guidance.
- Meta Newsroom, [Introducing Threads](https://about.fb.com/news/2023/07/introducing-threads-new-app-text-sharing/), used only for Meta text/video surface constraints adjacent to Threads.

Practitioner/creator norm sources:

- Sprout Social, [How to Create a Social Media Content Strategy](https://sproutsocial.com/insights/social-media-content-strategy/), published 2026-03-25.
- The Verge, [Instagram Reels Can Be 3 Minutes Long Now](https://www.theverge.com/2025/1/18/24346567/instagram-announces-reels-3-minute-video-posts), published 2025-01-18, used as current reporting on Instagram Reels length.
- The Verge, [Instagram's Best Practices Tell Creators How They Should Post](https://www.theverge.com/2024/10/1/24259462/instagram-best-practices-business-profiles-tips-reach), published 2024-10-01, used as practitioner-facing reporting on Instagram's professional-dashboard best-practice advice.
