---
title: The rule of no surprises
description: "Surprises break trust faster than setbacks. If something would surprise someone when they find out later, tell them now. Don't wait until it's convenient or until you have a fix."
tldr: "If something would surprise someone when they find out later, tell them now, not once it's convenient or fixed. Lead with the headline, say what you need, and name the rule. If you manage people, thank them for early warnings, or you'll get watermelon status updates: green on the outside, red on the inside. Do it consistently and people stop checking your work."
bookRelation: adapted
published: false
---

Early on at GitHub, I shipped a tiny diff that broke some of the millions of sites on GitHub Pages.[^pages] For those users, it was a big change, and some of them took their complaints straight to my leadership.

Soon after, I got a not-so-great message about how I'd handled the rollout. Not the breakage. Things break. The problem was that leadership heard about it from upset users first, with nothing in hand to explain or defend the call. I'd written a good technical rationale in the wrong place, for the wrong audience, at the wrong time.

I owned the surprise and explained the decision, in writing and in public. The change stuck. Rebuilding the trust took longer than building the feature had.

:quote[Surprises break trust faster than setbacks.]{#surprises-break-trust-faster-than-setbacks} Bad news is survivable. Hearing it from someone else first is what does the damage.

And the damage spreads. If you [work loudly](/2026/07/14/work-loudly/), people assume your updates are the full picture. A surprise exposes a gap, and suddenly the bad news isn't the only thing on the table. They're rereading every update you've ever sent and wondering what else wasn't in it.

## The rule

When you're unsure whether to share something, apply one test: **if it would surprise them later, share it now.** Don't wait until it's convenient, or until you've fixed it.

## What deserves a heads-up

- **Risks and blockers.** The vendor who's gone quiet. The dependency that's looking shaky. The migration that's been "almost done" for three weeks running. Share it while it's still a possibility.
- **Timeline changes.** The earlier the better, certainty optional. "I'm seeing signs we might slip a week. Still digging, but wanted you to know" is better than hoping you make up the time.
- **Scope calls you're making on your own.** Even if it's your call to make, the people depending on you deserve to know you made it.
- **Changes in approach.** Other people are planning around what they think you're doing. Change course without saying so, and their plans are built on something that no longer exists.
- **People issues.** Performance problems, team conflict, someone thinking about quitting.

That list includes work that's going fine. I was once responsible for a new product at GitHub, and everything was on track. Leadership just wasn't as in the loop as I thought. When they learned the specifics, including how it would affect a subset of customers, the reaction was defensive, and the product was dead within a week. :quote[On track isn't the same as in the loop.]{#on-track-isnt-in-the-loop}

If your manager could hear about it in someone else's meeting, they should hear about it from you first. That holds even when the work comes from above. If a skip-level pulls you into something urgent, :quote[a request from above isn't a substitute for an update to your manager.]{#request-from-above}[^skip-level]

:::objection[Won't all these heads-ups bury my manager, and make me look like I can't handle my work?]
Not if you use the right test: "would this surprise them," not "could this go wrong." A risk you've already flagged, or one they'd shrug at, doesn't qualify, so you're forwarding the few that matter. And surprises are what make you look like you can't handle it, because either you didn't see the problem coming or you saw it and sat on it. Call a risk a risk, not a certainty, and you'll read as thoughtful, not alarmist.
:::

## How to break bad news

Don't treat the rule as permission to dump problems on people. How you say it matters:

1. **Lead with the headline.** "We're going to miss the date." "The vendor backed out." Don't bury it under preamble or soften it past recognition.
2. **Then the context and the plan.** What's causing it, what you're doing about it, and what you've already ruled out.
3. **Say what you need.** A heads-up with nothing required and a decision you need by Friday are different messages. Make it obvious which one you're sending. I put it in the first line: "No action necessary yet, but…" or "(Not urgent) I wanted to let you know…" Before they've read a word of the bad news, they know how worried to be.

:::tip[Name the rule]
When you're telling someone earlier than they'd normally expect to hear it, say so: "Under the rule of no surprises, I wanted you to be the first to hear from me…" It tells them you're early on purpose, not because something's on fire. Use it consistently and the phrase itself becomes the signal.

It works at any scale, too. I once sent: "Under the rule of no surprises, I wanted to let you know that I just expensed two Furbies." Nobody wants to discover that line item on their own.
:::

Put together, it's a message you can send in under a minute:

> Under the rule of no surprises: the billing migration is likely to slip about a week. The vendor changed their integration under us, and we're still sizing the fix. No action needed yet. I'll know more Thursday and will flag right away if it gets worse.

Four sentences, sent today.

## If you're the manager

When someone brings you bad news early, :quote[how you react sets the price of every warning after it.]{#price-of-every-warning} Thank them first, then ask what they need. If early warnings get met with visible frustration, even unintentionally, people stop sending them, and the surprises that replace them are bigger and costlier. A heads-up is [the andon cord of knowledge work](/2023/08/30/transparency-collaboration-is-the-andon-of-knowledge-production/).[^andon]

### Punish yellow, get watermelons

Punish yellow (the "at risk" status), and you'll get watermelon status updates: green on the outside, red on the inside.

I've been on the receiving end of one. Someone on my team was green for weeks, across every one of their projects. Then the quarter closed, it was time to share results, and I learned the scope had been quietly whittled away the whole time. Deliverables dropped one at a time, never flagged, each project technically "on track" to deliver a little less, until there was little to show for the quarter. No single update was a lie.

Watermelons are usually a rational response to an environment where "at risk" hurts more than silence. If every status you see is green, don't congratulate yourself. Ask what it would cost someone to tell you otherwise, and what's been cut to keep it green.

### When you're making the call

Surprises come in tiers. Not everyone needs to hear at the same time, but the order matters. A team shouldn't find out they're being [reorged](/2026/06/07/reorgs-happen/) at the same moment as the rest of the company, in a town hall. :quote[The people most directly affected by a decision should be among the first to learn it]{#most-affected-first}, early enough to process it and ask questions before they have to react to it in front of everyone else. Then their partners and the teams who depend on them. Then the broad announcement.

The same rule applies to an audience of one. If a promotion isn't happening this cycle, tell them long before the cycle closes.

[The book](/2026/07/21/open-and-async/) goes further on how the rule changes by role, from your first heads-up as an individual contributor to briefing up, down, and across as a leader.

## Make it a habit

The hard part isn't knowing what to share. It's beating the instinct to wait: until you've fixed it, until you're sure, until you can control the story. We just don't want to look bad. But waiting is exactly what makes you look bad.

Make it routine with a standing section at the bottom of your weekly update:

> **Watching closely**
>
> - The vendor announced a shutdown date for the integration we use. We haven't confirmed our migration timeline yet. I'll know by the 15th.
> - Hiring for the open role is slower than planned. Not blocking yet, but it could push next quarter's work.

If the list is empty, say so. "Nothing new to watch" is information too.

When you reliably surface problems early, people stop checking your work, because they trust you'll tell them if something's wrong. :quote[No surprises is how you earn autonomy.]{#no-surprises-is-how-you-earn-autonomy}

One quick message to my leadership before that Markdown change shipped would have taken minutes. Skipping it cost me trust, and bought extra scrutiny on everything I shipped after. Send the message.

[^pages]: We were [standardizing GitHub Pages on a single Markdown engine](https://github.blog/news-insights/the-library/a-look-behind-our-decision-to-standardize-on-a-single-markdown-engine-for-github-pages/), which meant swapping out the renderer underneath every site on the platform. A non-trivial number of sites stopped rendering the way their owners expected.

[^skip-level]: The short version: GitHub's (then) CEO and General Counsel asked my team for an urgent feature, I assumed my own leadership was already in the loop, and they found out at launch. The full story is in [Work loudly](/2026/07/14/work-loudly/#like-a-bear-bell).

[^andon]: On a Toyota assembly line, any worker who spots a problem can pull the andon cord to stop the line. Stopping early is cheap. Shipping the defect isn't.
