---
title: "Default to Public Decisions, Not Private Context"
description: "If your team only hears about decisions after the fact, you're not working async—you’re creating communications debt."
published: false
---
<!--
  AI DRAFTING EXPERIMENT — drafted by an LLM (Azure AI Foundry, gpt-5.4) from a
  mined idea backlog, then linted against this repo's anti-AI-pattern Vale style.
  Unedited draft (published: false). Verify every [BRACKETED] placeholder and any
  specific statistic before publishing. See the PR description for details and a
  gpt-4.1 A/B variant of the same idea.
-->

I started tracking the number of "FYI" posts versus actual decision docs on my teams, and the ratio was embarrassing. Over [TIME PERIOD: e.g., "six weeks"], we posted [NUMBER] updates that amounted to "here's what changed" and only [NUMBER] records of how or why the decision got made.

That explained a lot.

Why people kept asking the same questions. Why teams felt like they were being handed outputs instead of trusted with context. Why autonomy looked fine on the org chart, but in practice still required someone to decode the backstory in a DM.

Here's the problem: most teams think they're working asynchronously because they publish artifacts. They share the deck, the roadmap, the spec, the launch note, or the meeting recap. But the real async unlock isn't publishing the artifact. It's publishing the decision.

If I only learn about decisions after the fact, I can't act autonomously. I can comply. That's not the same thing.

## Artifacts aren't context

A polished artifact tells you what survived the process. It rarely tells you what was debated, what constraints mattered, what alternatives were rejected, or who made the call. That's the stuff people actually need if you want them to make good downstream decisions without asking permission every five minutes.

This is where a lot of teams accidentally create communications debt. A quick Zoom, a few Slack DMs, maybe a private doc with comments flying around, and then someone posts the outcome in a public channel as an FYI. Near-term, it feels efficient. Long-term, you've just volunteered the team to keep re-explaining the same decision forever.

And yes, I've done this too. Everybody has. The private path is tempting because it's faster in the moment. So is hardcoding a value instead of fixing the underlying system. You still pay for it later.

The bill comes due when someone asks a reasonable question the artifact can't answer:

- Why did we choose this option over the other one?
- Is this a one-way or two-way door decision?
- Who needs to be consulted before we change it?
- Does this apply to my team, too?
- Are we optimizing for speed, cost, risk, or customer impact here?

If the answer lives in one person's memory, you don't have alignment. You have a human cache.

## Async breaks when decisions stay private

A lot of the advice around async focuses on medium. Write more. Meet less. Prefer issues to meetings. All good advice. But medium isn't the point. Durability is.

Async works because it decouples work from access to a specific person at a specific time. Once your team needs to chase down the decision-maker for the missing how and why, you've reintroduced the same bottleneck with extra steps.

That's why I have a pretty strong opinion here: if a decision affects more than the people in the room, the decision record should live in an open, linkable, async place by default.

Not the final announcement. The decision itself.

This is the practical application of [showing your work](https://ben.balter.com/2022/02/16/leaders-show-their-work/). It's also what "open by default" actually means at work. Not that every thought must be public from inception, but that decisions with broader impact should leave behind a durable trail that others can discover, understand, and build on.

## Why "FYI" posts make teams feel powerless

The phrase "for your awareness" should set off alarm bells.

An FYI post often signals that the meaningful part already happened elsewhere. The team gets the diff, but not the reasoning. Humans are not servers. You can't just apply a configuration change and expect understanding to propagate automatically.

When people repeatedly learn about decisions after the fact, a few things happen.

First, they stop investing in the broader system because they correctly infer they aren't part of it. Why spend time thinking deeply about trade-offs if the real decisions happen in private anyway?

Second, they get more risk-averse. Without context, the safest move is to escalate, wait, or ask for approval. That's not because people are incapable. It's because you're asking them to operate with incomplete information.

Third, trust takes a hit. Even when leaders have good intentions, private decisions followed by public announcements feel top-down. The message received is "we decided" not "here's how we decided."

Teams don't need omniscience. They do need enough context to make adjacent decisions confidently.

## What a real decision record looks like

A useful decision record isn't a novel. In fact, if your process requires a 10-page memo for every call, people will stop doing it by Wednesday.

The bar should be lower.

A good decision record captures just enough to let someone who wasn't there understand what happened and why. Usually that means:

- the decision
- the problem it solves
- the options considered
- the key trade-offs
- who made the call
- who was consulted
- when it takes effect
- what would cause you to revisit it

That's it. Concise beats comprehensive. Durable beats perfect.

If you work in issues, discussions, or pull requests, you're already most of the way there. The best systems make process visible as a byproduct. If you don't have that, you need to be more intentional about creating the record manually.

## A copy-pasteable playbook for public decisions

If your team has normalized private deliberation and public announcements, don't try to fix it with a values speech. Change the workflow.

Here's the checklist I'd use.

### Before the meeting or DM thread

- Ask: does this decision affect another team, a future team, or future me?
- If yes, open an issue, discussion, or doc in a shared, linkable place before the conversation starts.
- Write a working title that states the decision to be made, not the meeting name. "Choose onboarding owner for Q4" beats "Onboarding sync."
- Add a short problem statement and the decision deadline.
- Link any relevant background so people don't have to reconstruct the past from chat fragments.

### During discussion

- Take notes in the open record, even if the conversation happens live.
- Capture options, objections, and trade-offs, not just the conclusion.
- Note who needs to weigh in and by when.
- If the discussion happens in Slack or a meeting, treat that as input, not the system of record.
- Drop the link in chat and keep redirecting people back to it. Politely, relentlessly.

### When the decision is made

Copy and paste this template into the record:

```md
## Decision
[What we decided]

## Context
[What problem are we solving? Why now?]

## Options considered
- Option A — [why we didn't choose it]
- Option B — [why we chose it]
- Option C — [why we didn't choose it]

## Decision-makers
- [Name / team]

## Consulted
- [Name / team]

## Trade-offs
- [What gets better]
- [What gets worse or becomes constrained]

## Effective date
[Date]

## Revisit if
- [Condition 1]
- [Condition 2]
```

### After the decision

- Announce the decision by linking to the record, not by rewriting it from scratch.
- Write the announcement as an invitation to context: "Decision and rationale here" beats "FYI, we're doing X."
- Tag affected teams in the record itself so questions and follow-ups land where the context already lives.
- If someone asks in DM, answer the question once, then add that answer to the record.
- If you find yourself re-explaining the same thing [NUMBER: e.g., "five times in two weeks"], your record is missing something.

## A fair objection: not everything can be public

Of course not every decision belongs in an open forum. People issues, sensitive security work, legal matters, and confidential business information have constraints for good reason. "Open by default" has always implied defaults and judgment, not absolutism.

But teams abuse edge cases as an excuse for the norm. A handful of decisions truly require restricted access. Most product, process, policy, and prioritization decisions do not.

If you're defaulting to private channels because public records take a few extra minutes, that's not prudence. That's borrowing against the future.

## Start with one category of decision

If your team is early here, don't boil the ocean. Pick one type of decision that routinely creates confusion—product prioritization, ownership changes, architectural choices, operating norms, whatever hurts most—and require a public decision record for that category for [TIME PERIOD: e.g., "30 days"].

Then watch what happens.

Questions get better. Repeated confusion drops. New people ramp faster. Cross-team friction falls because fewer conversations start from "wait, why did we do this again?"

More importantly, autonomy stops being aspirational. People can see the logic of the system they're operating in. That's what allows them to make sound decisions without needing constant access to authority.

The teams I've seen work best in the open don't hoard context. They leave a trail.

Not because documentation is virtuous. Not because transparency sounds nice on a values slide. Because publishing decisions in public is how you scale judgment.

And if your team only hears about decisions after the fact, you don't have an async culture yet. You have a notification system.
