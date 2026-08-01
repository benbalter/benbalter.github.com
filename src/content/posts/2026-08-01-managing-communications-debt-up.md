---
title: "Managing Up Means Managing Communications Debt"
description: "If your boss and skip-levels can't see your work, you're accruing communications debt that shows up at review and promotion time."
published: false
---
<!--
  AI DRAFTING EXPERIMENT — drafted by an LLM (Azure AI Foundry, gpt-5.4) from a
  mined idea backlog, then linted against this repo's anti-AI-pattern Vale style.
  Unedited draft (published: false). Verify every [BRACKETED] placeholder and any
  specific statistic before publishing. See the PR description for details and a
  gpt-4.1 A/B variant of the same idea.
-->

Picture this: promotion packets are due, your skip-level is scanning for evidence, and half the strongest work on the team might as well have never happened.

In a recent skip-level promotion cycle, [NUMBER: e.g., "60%"] of overlooked engineers had zero public evidence of wins. Not weak evidence. No evidence. No design doc, no project issue, no decision record, no weekly recap, no visible trail that connected their work to an outcome.

That’s the dirty secret behind a lot of "my manager doesn’t see my impact" frustration: often, they do. Your skip-level doesn’t.

And if you’re not making your work legible to the people above your manager, you’re taking on communications debt. Quietly. Repeatedly. Usually with interest.

## Managing up is mostly a documentation problem

People hear "managing up" and picture office politics, constant self-promotion, or some kind of weird personal branding exercise. I don’t. I think of it as reducing ambiguity for the people who need to make decisions about your scope, your performance, and your future.

Your boss can advocate for you in the room. But they can’t perfectly serialize months of your judgment, trade-offs, cross-functional influence, and boring-but-critical wins into a few bullet points at calibration time. Like any lossy compression format, fidelity drops fast.

That’s why [showing your work](https://ben.balter.com/2022/02/16/leaders-show-their-work/) matters just as much for individual contributors as it does for leaders. A URL is necessary, but not sufficient. The people evaluating your impact need to see what changed, why it changed, and what role you played in making it happen.

If that context only lives in your manager’s head, you’ve built a single point of failure.

## "My skip-levels never see what I do—until it’s too late"

I’ve heard some version of that complaint at just about every company I’ve worked with. Sometimes it’s true in the unfair, structural sense. The organization is opaque, decision making is centralized, and visibility accrues to the loudest person in the room. That happens.

More often, though, the problem is less sinister and more mundane: the work happened in ephemeral channels.

A few Slack threads. A meeting where everybody nodded. A last-minute fire drill. A private doc nobody can find anymore. A bunch of DMs that felt efficient in the moment, right up until someone needed to reconstruct what happened [TIME PERIOD: e.g., "six months later"].

Near-term convenience creates long-term communications debt.

That debt comes due during performance reviews, promotion discussions, reorgs, staffing conversations, and the awkward moment when a skip-level asks, "Remind me what they’ve been driving?"

You do not want your career to hinge on somebody else having a good memory on a busy Thursday.

## Good work doesn’t speak for itself

I know. Engineers hate this sentence.

We want to believe quality is self-evident. That if you fixed the scaling problem, untangled the migration, mentored the new hire, or quietly prevented [NUMBER: e.g., "three"] incidents, the system will somehow notice and reward you. It won’t. Organizations are not observability platforms. They have terrible defaults.

Good work can be invisible for all kinds of reasons:

- the outcome was preventing a problem, not shipping a feature,
- the impact was distributed across teams,
- the work was operational, not flashy,
- the decision making happened in meetings, and
- your manager knows it happened, but your manager’s manager doesn’t.

This is where I take a hard line: if your work matters, it deserves a durable record.

Not because you should constantly brag. Because adults doing consequential work should not rely on folklore.

## Managing up asynchronously

The fix isn’t more meetings. It’s not cornering your boss after standup to casually mention your latest win. And it’s definitely not waiting until self-review season to reverse-engineer a year’s worth of impact from your Git history and vague memories.

The fix is to manage up asynchronously.

By that, I mean creating lightweight, durable, linkable evidence of your work as part of the work itself. The same logic behind [why async](https://ben.balter.com/2022/03/17/why-async/) applies here: if the information matters, capture it in a way that survives time, timezone, turnover, and human memory.

You’re not just updating your manager. You’re building an evidence trail that helps your manager advocate, helps your skip-level understand, and helps future-you not hate present-you.

## A copy-pasteable playbook

Here’s the playbook I recommend. Steal it. Adapt it. Make it boringly consistent.

### 1. Keep a brag doc

Yes, "brag doc" is a slightly embarrassing name. Keep one anyway.

Create a simple running document with four sections:

- **Wins** — what shipped, improved, or got unblocked
- **Impact** — what changed as a result; use numbers where you can
- **Influence** — decisions shaped, people mentored, teams aligned
- **Evidence** — links to issues, pull requests, docs, dashboards, demos

If you want a template, use this:

```md
## [Month YYYY]

### Wins
- Shipped [project/feature] that reduced [metric] by [NUMBER]%
- Unblocked [team/project] by resolving [problem]

### Impact
- Result: [customer/team/business outcome]
- Scope: [who was affected]
- Why it mattered: [one sentence]

### Influence
- Drove decision on [topic]
- Mentored [person/team] on [skill/project]
- Coordinated across [teams]

### Evidence
- Issue: [link]
- PR: [link]
- Design doc: [link]
- Demo/notes: [link]
```

Update it weekly. Not quarterly. Quarterly means you’ll forget half of it and undersell the other half.

### 2. Send a weekly digest to your manager

A good weekly update is one of the highest-leverage habits you can build. It reduces status meetings, creates a searchable record, and gives your manager language they can reuse upstream.

Short. Specific. Link-heavy.

Here’s a template:

```md
Subject: Weekly update — [Your name] — [Date]

This week:
- Completed [thing] — [link]
- Made decision on [topic] — [link]
- Unblocked [team/person] on [issue] — [link]

Impact:
- [Metric moved, risk reduced, customer pain addressed, time saved]

Next:
- [Top priority 1]
- [Top priority 2]

Needs/risks:
- [Decision needed, dependency, trade-off, or concern]
```

If your manager likes Slack, send it in Slack. If they live in email, use email. The medium matters less than the habit and the links.

### 3. Write for the skip-level, not just your manager

This is the part people miss.

Your update should make sense to someone one level removed from the day-to-day. That means less jargon, fewer internal shortcuts, and one sentence on why the work mattered.

Bad: "Finished phase 2 of the auth migration."

Better: "Finished phase 2 of the auth migration, removing [NUMBER] manual support escalations per week and clearing the blocker for the enterprise rollout."

Your manager may know the first version is important. Your skip-level needs the second.

### 4. Prefer public artifacts over private explanations

Whenever possible, put decisions and progress somewhere others can find later. Issues. Pull requests. Design docs. Team updates. Decision logs. Whatever your organization uses as a durable medium.

Private messages feel faster. They also guarantee that you’ll pay for that speed later.

This is just [communications debt](https://ben.balter.com/2022/02/16/leaders-show-their-work/#near-term-convenience-creates-long-term-communications-debt) in a career-shaped trench coat.

### 5. Make your manager’s job easy

The best managing up isn’t performative. It’s operational.

Your manager needs to answer questions like:

- What has this person actually driven?
- How do they operate across teams?
- What evidence shows they’re working at the next level?
- What did they do that wasn’t obvious from the roadmap?

If you hand them clear examples with links and outcomes, you’re not making them do you a favor. You’re giving them the raw material to do their job well.

### 6. Save the receipts for invisible work

Some of your most important work won’t produce a shiny launch post.

Conflict resolved before it turned into a team problem. An onboarding doc that cut ramp time. The dependency risk you spotted early. The incident you prevented. The meeting you canceled because the written plan was enough. That counts.

Write it down.

Invisible work stays invisible unless you make it visible.

## The obvious objection

Isn’t this just self-promotion?

Only if you do it badly.

There’s a difference between peacocking and documenting. One says, "Look how great I am." The other says, "Here’s what changed, here’s my role, and here’s the evidence."

Done right, this is less about ego than about accuracy. Promotion and performance conversations already happen. The question isn’t whether your work will be evaluated. It’s whether that evaluation will rely on evidence or vibes.

I know which system I’d choose.

## Start before you need it

The worst time to build a visibility habit is when you’re already frustrated, already up for promotion, or already trying to recover from being overlooked.

Start now. Open a document. Drop in the links from this week. Send the digest on Friday. Next week, do it again.

Small, repeated acts of showing your work compound. So does neglect.

If you don’t manage your communications debt as you go, the bill won’t disappear. It just lands later, all at once, in the meeting you weren’t in, with stakes you can’t control.

And by then, "my skip-level never saw what I did" isn’t an observation.

It’s the receipt.
