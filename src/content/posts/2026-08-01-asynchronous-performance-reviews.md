---
title: "Async Performance Reviews: Less Stress, More Signal"
description: "Performance reviews work better when they start with written evidence, not memory, meetings, or a pile of DMs."
published: false
---
<!--
  AI DRAFTING EXPERIMENT — drafted by an LLM (Azure AI Foundry, gpt-5.4) from a
  mined idea backlog, then linted against this repo's anti-AI-pattern Vale style.
  Unedited draft (published: false). Verify every [BRACKETED] placeholder and any
  specific statistic before publishing. See the PR description for details and a
  gpt-4.1 A/B variant of the same idea.
-->

The first year I forced my reports to populate their own evidence, review stress—and surprise—dropped by [NUMBER: e.g., "half"]. Not a little. Materially.

The weird part wasn't that reviews got easier. It was how much unnecessary pain we'd normalized before that.

Review cycles at a lot of companies feel like a Black Box and burn everyone out. Managers scramble through Slack threads, docs, and calendar archaeology trying to reconstruct six months of work. Employees stare at a blank page, vaguely aware they did good work, but unable to summon specific examples on command. Then everyone gets into a live conversation and pretends human memory is a reliable database. It isn't.

Here's my take: performance reviews shouldn't start from a blank page or a backlog of DMs. Async prep beats live recall, every time.

## The problem with review-by-memory

Most review processes fail long before the meeting. They fail when you ask people to remember, summarize, and defend months of work from scratch, usually under deadline, usually while still doing their actual job.

That's not a performance review. That's an improv exercise.

The failure mode is predictable. The most visible work wins. The most recent work wins. The loudest work wins. Quiet, compounding, behind-the-scenes contributions—mentoring, documentation, incident prevention, process fixes, unblocking others—get undervalued because they don't announce themselves. If your system rewards what was easiest to remember in the moment, you're not evaluating performance. You're evaluating recall.

And live review conversations make it worse. Put someone on the spot and you don't get signal. You get whatever they can retrieve fast enough to sound coherent. Some people are naturally good at that. Some aren't. That's a terrible proxy for impact.

This is one of those places where an engineering mindset helps. If a system depends on perfect human memory, the system is broken. Add enough people, enough projects, and enough time, and review prep becomes a kind of communications debt. You took shortcuts all quarter, kept context in DMs and meetings, and now somebody has to pay interest trying to reconstruct what happened.

Usually, that's everyone.

## Async prep fixes the actual problem

The point of async review prep isn't to make the process feel modern. The point is to capture evidence while it's still fresh, visible, and linked.

When reviews start with written, durable artifacts, a few good things happen at once. Employees have time to reflect instead of perform. Managers react to evidence instead of vibes. Surprises go down because context goes up. And the final conversation can focus on calibration, growth, and next steps—not forensic analysis.

That's the same reason [showing your work](https://ben.balter.com/2022/02/16/leaders-show-their-work/) matters in decision making. Once the reasoning and receipts are visible, people spend less time guessing and more time engaging with what's actually there.

A good review process should feel less like a courtroom and more like a pull request. Here's what changed, here's the context, here's the evidence, and here's where I'd like feedback.

## The playbook

This is the workflow I'd use if I were setting up a review cycle today. It's intentionally simple. The goal isn't ceremony. It's reducing ambiguity.

### The workflow

**Step 1: Create one shared review document per person**

Use whatever durable medium your team already trusts—an issue, a doc, an internal post, a discussion thread. The tool matters less than the behavior. It needs to be linkable, searchable, and easy to update over time.

**Step 2: Ask the employee to draft first**

Not because the burden should fall on them exclusively, but because self-reflection is part of the exercise. More importantly, they usually know about important work that never made it into the manager's field of view.

**Step 3: Require linked evidence**

No vague claims. If someone says they improved reliability, ask for the incident review, project doc, dashboard, pull request, customer note, or decision log. If the work mattered, there should be some artifact.

**Step 4: Manager adds feedback async**

Read the draft, comment inline, add missing examples, and challenge unsupported claims before the meeting. This turns the live conversation from first exposure into synthesis.

**Step 5: Use the meeting for discussion, not discovery**

By the time you meet, both sides should already know the shape of the review. The conversation is for nuance, coaching, and alignment—not revealing the plot twist.

**Step 6: Save the final version somewhere durable**

Not hidden in your inbox. Future-you will need it. So will the employee at the next review cycle.

### The template

Copy, paste, and adjust to fit your leveling framework:

```markdown
## Review period
- Dates: [START]–[END]
- Role/level: [ROLE]
- Reviewer: [NAME]

## Self-assessment

### What I’m most proud of
- [Outcome or project]
  - Evidence: [link]
  - My contribution: [specifics]
  - Impact: [customer, team, business, or technical impact]

- [Outcome or project]
  - Evidence: [link]
  - My contribution: [specifics]
  - Impact: [impact]

### Goals and expectations
For each goal or competency:
- Expectation: [goal, level behavior, or competency]
- Evidence: [link]
- What went well: [specifics]
- What I’d do differently: [specifics]

### Collaboration and leadership
- How I helped others succeed: [examples]
- Evidence: [links]
- Cross-team work: [examples]
- Evidence: [links]

### Learning and growth
- Skills I developed: [examples]
- Evidence: [links]
- Feedback I acted on: [examples]
- Evidence: [links]

### Challenges
- Where I struggled: [specifics]
- What I learned: [specifics]
- What support would help: [specifics]

## Manager assessment

### Observed strengths
- [strength]
  - Evidence: [link]
  - Why it matters: [specifics]

### Areas to grow
- [growth area]
  - Evidence: [link]
  - Coaching notes: [specifics]
  - Suggested next step: [specifics]

### Calibration against expectations
- [Expectation or competency]: [assessment with evidence]

## Next period
- Focus areas: [2–3 areas]
- Support needed: [manager/team/org support]
- Success measures: [how we’ll know]
```

That's it. Not magical. Just explicit.

## A few rules that make this work

First, evidence beats adjectives. “Strategic,” “strong,” “proactive,” and “needs improvement” are nearly useless without examples. Tie claims to artifacts and outcomes.

Second, write throughout the period, not just at the end. If you wait until review season, you've already lost. I like a lightweight brag document, operating log, or monthly check-in that feeds the final review. It doesn't need to be fancy. It needs to exist.

Third, don't confuse visibility with vanity. Making work visible isn't self-promotion. It's how distributed teams function. If your process depends on the manager accidentally noticing contributions, your process punishes thoughtful people and rewards performative ones.

Fourth, no surprises. If a review contains major feedback the employee is hearing for the first time, that's usually a management failure, not a review feature.

## The obvious objection

Does this create more writing?

Yes. A bit. But it replaces worse work.

You're swapping frantic recollection, duplicate status gathering, and awkward meetings for a written record that compounds in value. The same artifacts that make reviews easier also help with promotion packets, project retrospectives, onboarding, and succession planning. This is the good kind of overhead—the kind that reduces future overhead.

And if you're leading a remote or distributed team, you don't really have a choice. Async isn't a productivity hack here. It's the only sane way to review work fairly across time, teams, and communication styles. As I've written in [Why async](https://ben.balter.com/2022/03/17/why-async/), the benefit isn't just flexibility. It's better decisions through better process.

## What to do next cycle

If your current review process begins with “please summarize your impact from the last six months,” change that sentence.

Start earlier. Give people a template. Require links. Comment async. Use the meeting to discuss, not discover. And save the final review somewhere the next cycle can build on it.

If you want the cultural version of this shift, it's simple: work in the open whenever you can. Make decisions, progress, and outcomes visible by default. The less work lives in private messages and fading memory, the less review season feels like archeology.

That's the real win. Better reviews, sure. But also less anxiety, fewer surprises, and a system that doesn't ask humans to behave like servers.

Because they won't. And they shouldn't.
