---
skill: skill-creator
agent: codex
captured_at: 2026-06-23T09:16:10-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

I'd like to amend the fork-branch skill to not archive an existing branch unless the --archive flag is passed to that skill. The default behavior should be on user approval to spawn two to N number of research/[descriptive name for branch/product in product line] based on the number of research branches that the user identifies that they'd like to split off of an idea. An example use case for this skill is during customer-discovery it is felt that there are three promising but ultimately very different potential ICPs that would all require different products. A user would invoke fork-branch while passing in the list of ICPs to spawn new research branches for, what the names of the stubs should be for each ICP, and any additional notes they'd like to provide. Fork-branch should compile an alignment page to ensure the agent creates the right amount of branches, with the right names, and provides the user potential prompts to kick off a separate idea-scope-brief with for each branch.
