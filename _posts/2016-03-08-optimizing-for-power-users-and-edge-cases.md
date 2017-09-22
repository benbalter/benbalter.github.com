---
title: Optimizing for power users and edge cases is the easy part
description: In product development, it's all too easy to optimize for power users and edge cases. The real challenge lies in nailing the out-of-box experience for 80% of users' needs.
---

When designing a product — be it an open source project or a for-profit service — it's all too easy to optimize for power users and edge cases. While [the squeaky wheel may most often get the grease](https://en.wikipedia.org/wiki/The_squeaky_wheel_gets_the_grease), that doesn't necessarily mean that it should. The real challenge, for any product, lies in genuinely nailing the out-of-box experience for *80%* of users' needs.

### Solving fun problems

As a geek, it's always going to be more fun to develop the new wiz-bang feature that will allow the app to integrate with whatever's currently on the top of Hacker News, or to design a single method that elegantly accounts for when your program is used at the South Pole by a user running Window XP SP1 under a full moon. While those are fun Rubix-cube-style engineering challenges to tackle for those of us that build software, they do little to benefit the majority of the people that actually use the software we build.

As a project maintainer, it's always going to feel better to ship code and mark an issue as resolved, than to close yet another issue as `wontfix` — to say "no" to a beloved user, or worse, a potential contributor. For many, wasting already-written code is a cardinal sin. But your project's issue tracker, pull request backlog, or support queue is going to present a very skewed perspective of your user base, especially when you use it as your primary means of evaluating feature requests and user feedback.

### The silent majority of users

Think about the type of user that's going to take the time to open an issue: they're either going to be power users that have already invested hours in your app and have grown the need for additional functionality that extends the core use case, or new and potential users with unique circumstances that you didn't originally intended to accommodate. In either case, opening an issue takes time, commitment to a cause, and specialized knowledge, and thus, through pure self selection, most issues are going to be opened by the extreme edges of your user base, not by the core of your users (or potential users, for that matter).

Instead of optimizing for the most vocal, feature requests should be evaluated through the lens of "what would benefit 80% of users?" — the [silent majority](https://en.wikipedia.org/wiki/Silent_majority), to borrow a phrase from politics. I suspect, for most projects, the exact opposite is sure, that 80% of feature requests come from just 20% of users (or [as few as 1%](https://en.wikipedia.org/wiki/1%25_rule_(Internet_culture))). Combined with the fact that these requests often represent the "fun" problems, this [80/20 rule](https://en.wikipedia.org/wiki/Pareto_principle) means that in many cases, absent your intervention, the majority of features implemented, will provide little or no benefit to the majority of users.

|                      | Technically simple | Technically complex |
| :------------------- | :----------------- | :------------------ |
| **Solution obvious** | Feature creep      | Edge cases          |
| **Solution unclear** | Core use           | Power users         |

{: .table style="max-width:60%" .aligncenter }

### Anything added dilutes everything else

No product is going to satisfy 100% of user needs, although it's sure tempting to try. If a 20%-er requests a feature that isn't going to be used by the other 80%, there's no harm in just making it a non-default option, right?

We have a motto at GitHub, part of the [GitHub Zen](https://ben.balter.com/2015/08/12/the-zen-of-github/), that "anything added dilutes everything else". In reality, there is always a non-zero cost to adding that extra option. Most immediately, it's the time you spend building feature A, instead of building feature B. A bit beyond that, it's the cognitive burden you've just added to each user's onboarding experience as they try to grok how to use the thing you've added (and if they should). In the long run, it's much more than maintenance. Complexity begets complexity, meaning each edge case you account for today, creates many more edge cases down the line.

The WordPress community [has a similar philosophy](https://wordpress.org/about/philosophy/), "decisions not options\*." Every time you provide a user with an option, you're asking them to make a decision, and [those decisions quickly add up](https://en.wikipedia.org/wiki/Analysis_paralysis), especially when the user doesn't care or doesn't fully understand the implications. Ultimately, many of these decisions are technical or domain-specific decisions, and as a project maintainer, as the subject-matter expert, it's your obligation to absorb all that complexity on behalf of your users, not to simply kick the decision can down the line.

### Settings are a crutch

Adding a setting is easy. Burying that setting in the endless clutter of an "advanced" tab is even easier. Making the right decision is hard. Decisions require you to get to the cause of the user's needs. To figure out what they're actually trying to solve for, even if they may not fully know it yet. To think through the user experience. To decide the one thing you're trying to do, and to do it well, not to try to do everything, but to do it poorly.

One of my favorite features to add to a project is the one that removes two others. And for the majority of users, that tough decision is just that, a software feature. The next time you're faced with a tough decision, forego the temptation to optimize for power users, or worse yet, to inch your project one step closer to the inside of an airplane cockpit. Optimize for the majority out-of-box experience. [Challenge yourself. Learn to decide](https://nacin.com/2011/12/18/in-open-source-learn-to-decide/).
