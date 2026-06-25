# Social Post Convention

Research date: 2026-06-25.
Canonical package asset: `assets/social-post-convention.md`.

This convention guides build-in-public and alignment-producing agents when they draft source-safe text and community posts for dev-founder, devtool, product, and technical-work updates. It covers LinkedIn, X, Bluesky, Threads, Mastodon, Reddit, Hacker News, and YouTube Community posts.

## Rules Vs Norms

- **Platform official guidance** is treated as a rule or hard constraint. It includes help-center docs, community guidelines, product docs, and explicit platform policy.
- **Creator/practitioner norms** are treated as optional style guidance. They can improve fit, but they are not policy and must never override platform rules, user instructions, source safety, or accuracy.
- If official guidance and practitioner advice conflict, follow the official guidance and explain the tradeoff in the BIP page.
- If a platform limit is account-, client-, subscription-, region-, or server-dependent, draft below the conservative default and tell the user what to verify before publishing.

## Agent Source-Safety Rules

Every proposed post must be safe to publish from the evidence the agent can actually see.

Do not include:

- Unsupported performance, adoption, revenue, benchmark, security, or quality claims.
- Private user, customer, repo, incident, prompt, or session context.
- Secrets, credentials, tokens, hostnames, account identifiers, private URLs, screenshots with sensitive data, or proprietary implementation details.
- Confidential research inputs, interview quotes, customer names, company names, or logos without permission.
- Unverifiable metrics, "first", "best", "only", "guaranteed", or "production-ready" claims without source evidence.
- Premature commitments about roadmap, launch date, pricing, compliance, availability, or support.
- Deceptive AI, sponsorship, employment, affiliation, or paid-promotion framing.

Each post option must include:

- `target_channel`: platform or community.
- `drafting_mode`: `platform_aligned` or `creator_inspired`.
- `source_basis`: the specific work artifact, finding, changelog item, commit, public source, or approved user statement supporting the post.
- `risk_level`: `low`, `medium`, or `high`.
- `claim_safety_notes`: what was omitted, softened, or needs human approval.
- `publish_precheck`: account/community-specific checks before posting.

## Drafting Modes

`platform_aligned`:

- Stays close to official platform rules, product constraints, and community standards.
- Uses conservative length and media choices.
- Avoids growth hacks, engagement bait, vague virality tactics, or unverified trend participation.
- Prefers clarity, accessibility, attribution, and explicit source boundaries.

`creator_inspired`:

- May use current creator/operator norms, such as stronger hooks, more opinionated framing, narrative arcs, "what changed" posts, or native-format repurposing.
- Must label the basis as practitioner norm, not platform policy.
- Must keep claims source-safe and avoid bait, exaggeration, or community-hostile self-promotion.

When useful, generate both modes side by side so the user can choose between conservative platform fit and a more expressive creator version.

## Cross-Channel Defaults

- Start from the work, not the channel. Identify the approved artifact, evidence, or outcome first.
- Prefer one clear idea per post. For multi-part work, create a thread, carousel, separate posts, or community discussion prompt only when the platform supports it and the user approves.
- Use links as evidence or next action, not as the whole post. Avoid link-only posts except where community norms explicitly favor source submission.
- Avoid unrelated hashtags. Use zero to two where hashtags are useful and accepted; use more only if the platform/community norm clearly supports it.
- Add alt text or accessible text equivalents for images when the platform supports it.
- Do not ask for votes, upvotes, artificial engagement, brigading, or coordinated amplification.
- For cross-posting, rewrite natively for each channel. Do not paste the same copy across platforms without adapting length, tone, link behavior, and community expectations.

## Channel Profiles

### LinkedIn

**Audience expectation:** Professional, work-contextual, expertise-driven posts. Strong fit for founder lessons, technical decisions with business impact, hiring/collaboration notes, customer-safe lessons, and product milestones.

**Format patterns:** Short professional update, lesson-learned narrative, mini case study, concise launch note, document or image-supported summary, native video/image post, or external link with enough context to stand alone.

**Length guidance:** Keep the core post concise enough to scan in the feed. Long-form narrative is acceptable, but the first two to three lines must carry the point because feed truncation is common. Use a short title-like opener only when it improves clarity.

**Link, hashtag, and media norms:** LinkedIn supports text, image, article, video, newsletter, and link-preview style posts. LinkedIn Help says posts can include photos, and image posts support up to 20 images. LinkedIn also documents alt text and Open Graph requirements for shared links. Practitioner norm is to use native media or a strong text post when reach matters, keep hashtags sparse, and put the useful takeaway before the link.

**Tone:** Specific, professional, generous, and concrete. Avoid triumphal or vague hustle language.

**Spam triggers:** Excessive or automated comments can reduce visibility or trigger limits. Avoid repetitive self-promotion, mass tagging, irrelevant hashtags, and posts that read as ads without value.

**Source-safety risks:** Customer names, logos, revenue numbers, enterprise claims, hiring or partnership signals, security posture, and "we solved X for everyone" claims need explicit approval.

**`platform_aligned`:** Draft a professional update with direct source basis, conservative claims, accessible media notes, and one clear optional link.

**`creator_inspired`:** Draft a founder/operator story: tension, decision, what changed, specific lesson, and a restrained call for relevant discussion.

### X

**Audience expectation:** Fast-moving public conversation, concise takes, live build notes, technical debates, launch updates, and short threads.

**Format patterns:** Single sharp post, short thread, quote/reply to public source, changelog note, screenshot plus context, or question framed for technical discussion.

**Length guidance:** X Help lists 280 characters for standard posts and longer post limits for premium surfaces. Default to 280 characters for portable drafts unless the user selects a long-post mode.

**Link, hashtag, and media norms:** X posts can include text, links, photos, GIFs, and video. X Help recommends no more than two hashtags as a best practice. Practitioner norm is to lead with the takeaway, put the link after context, and use threads only when the post needs multiple beats.

**Tone:** Direct, concise, and conversational. Technical specificity beats broad claims.

**Spam triggers:** X policy calls out platform manipulation, repetitive posts, link-only or duplicate content, unrelated hashtags, deceptive links, and artificial engagement.

**Source-safety risks:** Screenshots can leak private repo or customer details. Hot takes can overstate evidence. Threads can compound unsupported claims.

**`platform_aligned`:** Draft one concise post under the standard limit with no more than two relevant hashtags and no engagement bait.

**`creator_inspired`:** Draft a short hook plus useful technical lesson, optionally with a thread outline that each carries one sourced claim.

### Bluesky

**Audience expectation:** Public microblog conversation with strong community norms around authenticity, moderation choice, topical feeds, and less formal voice than LinkedIn.

**Format patterns:** Short post, reply, quote post, image-supported note, link card, or custom-feed-friendly topical update.

**Length guidance:** Draft under the common 300-character app limit unless the target client changes it. Keep posts punchy and avoid imported thread bloat.

**Link, hashtag, and media norms:** Bluesky docs describe posts, replies, quote posts, embeds, link cards, and image embeds with alt text. Images support up to four images in the documented API flow. Practitioner norm is to participate conversationally, use tags/feed-relevant terms lightly, and avoid sounding like scheduled brand copy.

**Tone:** Human, specific, and community-aware. Plain language is usually better than polished marketing copy.

**Spam triggers:** Bluesky community guidelines prohibit spam, scams, artificial manipulation, and undisclosed commercial content.

**Source-safety risks:** Bluesky posts, likes, and blocks are public in the protocol model; do not imply privacy. Avoid posting internal build notes that assume a closed audience.

**`platform_aligned`:** Draft a short public post with clear context, source-safe link/media, and no artificial engagement request.

**`creator_inspired`:** Draft a conversational "today I learned" or "small build note" version that invites useful replies without manufacturing controversy.

### Threads

**Audience expectation:** Public conversation connected to Instagram identity, with accessible, less formal text updates and cross-network/fediverse considerations.

**Format patterns:** Short thought, update, question, poll/GIF when available, image/video-supported note, or discussion prompt.

**Length guidance:** Meta states Threads posts can be up to 500 characters and include links, photos, and videos up to five minutes. Stay under that limit unless the user explicitly requests a longer multi-post sequence.

**Link, hashtag, and media norms:** Links, photos, and videos are supported. Topic tags and fediverse sharing can affect reach and context. Practitioner norm is to keep posts lighter and more conversational than LinkedIn, with one focused point.

**Tone:** Positive, creative, conversational, and not over-optimized.

**Spam triggers:** Threads enforces Instagram Community Guidelines. Trending topics are reviewed for guideline violations and misleading themes.

**Source-safety risks:** Fediverse sharing can make public Threads visible beyond Threads. Avoid content that assumes only Instagram followers will see it.

**`platform_aligned`:** Draft a 500-character-or-less update with explicit source basis and no sensitive material.

**`creator_inspired`:** Draft a warmer "builder note" or question that translates the technical work into a broader product/founder lesson.

### Mastodon

**Audience expectation:** Federated, community-specific conversation where server norms matter. Strong fit for open-source, standards, technical learning, and public-interest product notes when adapted to the instance.

**Format patterns:** Short toot, thread, content-warning post, link with context, image post with alt text, or community reply.

**Length guidance:** Mastodon docs list a default 500-character limit, but instances can configure their own limits. Draft below 500 unless the target instance is known.

**Link, hashtag, and media norms:** Mastodon docs discourage link shorteners, describe hashtags as discovery tools, support media with alt text, and support visibility levels and content warnings. Practitioner norm is to use a few meaningful hashtags for discovery and to respect instance-specific etiquette.

**Tone:** Respectful, technically clear, low-hype, and community-first.

**Spam triggers:** Repetitive promotion, link shorteners, cross-post dumps, ignoring content warnings, and using global/community hashtags for unrelated promotion.

**Source-safety risks:** Federation means posts can travel across servers with different norms and moderation. Visibility settings are not a substitute for source safety.

**`platform_aligned`:** Draft under the default limit, include no shortened links, add content warning guidance when needed, and specify alt text for media.

**`creator_inspired`:** Draft an open-source or technical learning note with one or two relevant hashtags and a respectful invitation to compare approaches.

### Reddit

**Audience expectation:** Community-first discussion where subreddit rules override generic social strategy. Strong fit only when the content genuinely serves the specific subreddit.

**Format patterns:** Text post, link post, question, show-and-tell where allowed, or comment reply. The title and first paragraph carry most of the trust signal.

**Length guidance:** No universal best length. Use the subreddit pattern: short factual title for link posts, concise context for technical posts, and enough detail to avoid drive-by promotion.

**Link, hashtag, and media norms:** Hashtags are usually not relevant. Reddit Reddiquette asks users to read community rules, use factual titles, link original or canonical sources, search before reposting, tag NSFW when needed, and avoid link shorteners.

**Tone:** Transparent, helpful, community-literate, and non-defensive.

**Spam triggers:** Reddiquette warns against flooding, sensational titles, personal attacks, upvote asks, and heavy self-promotion. The classic self-promotion guideline expects a user's participation to be mostly non-promotional.

**Source-safety risks:** Community members will challenge vague claims. Posting as a founder/team member may require disclosure. Product claims, benchmark claims, and customer anecdotes need strong evidence.

**`platform_aligned`:** Draft only after naming the target subreddit and its rules. Use factual title, disclosure if affiliated, original source link where appropriate, and a value-first explanation.

**`creator_inspired`:** Draft a community-native discussion prompt or "here is what we learned" post that foregrounds the problem and evidence before the product.

### Hacker News

**Audience expectation:** Technically curious readers who reward original sources, concrete technical substance, and low-marketing framing.

**Format patterns:** Link submission with original title, `Show HN`, `Ask HN`, or substantive comments. HN guidelines explicitly say not to use generated text or AI-edited text in comments.

**Length guidance:** For link submissions, use the original title unless it is misleading or linkbait. For `Show HN`, keep the title factual. For comments, prefer human-written text; agents can provide notes or risk review, but the user should author the final comment.

**Link, hashtag, and media norms:** No hashtags. Prefer original sources. Avoid editorialized titles, linkbait, resubmission churn, and requests for upvotes or comments.

**Tone:** Factual, technical, humble, and specific. Avoid launch-copy tone.

**Spam triggers:** HN guidelines prohibit promotion-heavy behavior, soliciting votes/comments, deleting and reposting for attention, and generated text.

**Source-safety risks:** High risk for AI-authored comments, overclaimed technical novelty, and marketing language. Treat HN as `high` risk unless the user is posting a public original source or a real `Show HN` artifact.

**`platform_aligned`:** Provide a submission safety review, title recommendation, and human-author notes. Do not present AI text as ready-to-post HN comment copy.

**`creator_inspired`:** Suggest a terse `Show HN` angle and human-authored discussion prompts, while preserving the no-generated-comment boundary.

### YouTube Community

**Audience expectation:** Existing or reachable YouTube audience updates, polls, teasers, behind-the-scenes notes, and video-adjacent discussions.

**Format patterns:** Text post, image/GIF post, poll, quiz, video post, playlist post, or short update that points to a video.

**Length guidance:** Keep community posts short and oriented around one action or discussion point. The platform supports multiple post types; select the type before drafting copy.

**Link, hashtag, and media norms:** YouTube Help describes posts as lightweight ways to engage audiences through text, images, GIFs, polls, quizzes, and videos. Use posts to add context, solicit viewer input, or connect a long-form/Shorts idea to the channel audience.

**Tone:** Direct, channel-native, and audience-aware.

**Spam triggers:** YouTube says posts that violate Community Guidelines may be removed and can result in strikes. Avoid misleading thumbnails, reused content without rights, and irrelevant link drops.

**Source-safety risks:** Community posts can be seen by viewers without the source artifact context. Avoid roadmap promises, unapproved launch claims, or customer references.

**`platform_aligned`:** Draft a short post using the selected YouTube post type, with one source-safe viewer action and no unsupported claim.

**`creator_inspired`:** Draft a poll or "which would you rather see next?" update tied to approved work, with choices that do not overpromise future production.

## BIP Page Output Shape

When an alignment page uses this convention, render channel decisions in a table or cards with these fields:

- `channel`
- `drafting_mode`
- `angle`
- `source_basis`
- `audience`
- `format`
- `draft`
- `risk_level`
- `claim_safety_notes`
- `platform_or_community_precheck`
- `user_decision`: `approve`, `revise`, `reject`, or `not-now`

Final YAML from the BIP page should preserve user selections, rejected angles, requested edits, and any channel-specific pre-publish checks.

## Sources Accessed 2026-06-25

Official/platform sources:

- LinkedIn Help, [Share Photos or Videos](https://www.linkedin.com/help/linkedin/answer/a527229), [Add Alternative Text to Images](https://www.linkedin.com/help/linkedin/answer/a518928), [Comment on LinkedIn Posts](https://www.linkedin.com/help/linkedin/answer/a524166), and [Make Your Website Shareable on LinkedIn](https://www.linkedin.com/help/linkedin/answer/a521928).
- X Help, [How to Post](https://help.x.com/en/using-x/how-to-post), [How to Use Hashtags](https://help.x.com/en/using-x/how-to-use-hashtags), [The X Rules](https://help.x.com/en/rules-and-policies/x-rules), and [Authenticity / Platform Manipulation and Spam](https://help.x.com/en/rules-and-policies/platform-manipulation).
- Bluesky docs, [Creating a Post](https://docs.bsky.app/docs/tutorials/creating-a-post), [Community Guidelines](https://bsky.social/about/support/community-guidelines), and [User FAQ](https://bsky.social/about/blog/5-19-2023-user-faq).
- Meta Newsroom, [Introducing Threads: A New Way to Share With Text](https://about.fb.com/news/2023/07/introducing-threads-new-app-text-sharing/).
- Mastodon docs, [Posting](https://docs.joinmastodon.org/user/posting/).
- Reddit Help, [Reddiquette](https://support.reddithelp.com/hc/en-us/articles/205926439-Reddiquette) and [Content Policy](https://redditinc.com/policies/content-policy).
- Hacker News, [Guidelines](https://news.ycombinator.com/newsguidelines.html) and [FAQ](https://news.ycombinator.com/newsfaq.html).
- YouTube Help, [Learn About Posts](https://support.google.com/youtube/answer/9409631).

Practitioner/creator norm sources:

- Sprout Social, [How to Create a Social Media Content Strategy](https://sproutsocial.com/insights/social-media-content-strategy/), published 2026-03-25.
- Lifewire, [Bluesky vs. X](https://www.lifewire.com/bluesky-vs-x-8777189), published 2025-01-21, used only as practitioner context for microblogging feature and audience contrasts.
