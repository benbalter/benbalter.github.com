---
title: Optimizing for power users and edge cases is the easy part
description: In product development, it's all too easy to optimize for power users and edge cases. The real challenge lies in nailing the out-of-box experience for 80% of users' needs.
---

When designing a product — be it an open source project or a for-profit service — it's all too easy to optimize for power users and edge cases. While [the squeaky wheel may most often get the grease](https://en.wikipedia.org/wiki/The_squeaky_wheel_gets_the_grease), that doesn't necessarily mean that it should. The real challenge, for any product, lies in nailing the out-of-box experience for *80%* of users' needs.

### Solving fun problems

As a geek, it's always going to be more fun to develop the new wiz-bang feature that will allow the app to integrate with whatever's currently on the top of Hacker News, or to design a single method that elegantly accounts for when your program is used at the South Poll by a user running Window XP SP1 under a full moon. While those are fun engineering challenges for those of us that build software to tackle, they do little to benefit the majority of the people that actually use the software.

As a project maintainer, it's always going to feel better to ship code and mark an issue as resolved, than to close yet another issue as "wontfix" — to say no to a beloved user, or worse, a potential contributor. But your project's issue tracker (or support queue) is going to present a very skewed perspective of your user base, especially when you use it as your primary means to evaluate feature requests and user feedback.

### The silent majority of users

Think about the type of user that's going to take the time to open an issue: they're either going to be power users that have already invested hours in your app and now demand additional functionality that extends the core use case, or new and potential users with unique circumstances that you didn't originally intended to accommodate. In either case, opening an issue takes time, commitment to a cause, and specialized domain knowledge, and thus, through pure self selection, most issues are going to be opened by the extreme edges of your user base, not by the core of your users (or potential users).

Instead, of optimizing for the most vocal, feature requests should be evaluated through the lens of "what would benefit 80% of users?" — the [silent majority](https://en.wikipedia.org/wiki/Silent_majority), to borrow a phrase from politics. I suspect, for most projects, the exact opposite is sure, that 80% of feature requests come from just 20% of users. Combined with the fact that these requests often represent the "fun" problems, this [80/20 rule](https://en.wikipedia.org/wiki/Pareto_principle) means that in many cases, mathmatically, the majority of features implemented by project maintainers, will provide little or no benefit to the majority of project users.

### Anything added dilutes everything else

No product is going to satisfy 100% of user needs, although it's sure tempting to try. If a 20%-er requests a feature that isn't going to be used by the other 80%, there's no harm in just making it a non-default option, right?

We have a motto at GitHub, part of the [GitHub Zen](http://ben.balter.com/2015/08/12/the-zen-of-github/), that "*anything added dilutes everything else*". In reality, there is always a non-zero cost to adding that extra option. Most immediately, it's the time you spend building feature A, instead of building feature B. A bit beyond that, it's the cognitive burden you've just added to each user's onboarding experience as they try to grok how to use the thing you've built. In the long run, it's much more than maintenance. Complexity begets complexity, meaning each edge case you account for today, creates many more down the line.

The WordPress community [has a similar philosophy](https://wordpress.org/about/philosophy/), "*decisions not options*". Every time you provide a user with an option, you're asking them to make a decision, and those decisions quickly add up, especially when they don't care or fully understand the implications. Ultimately, many of these decisions are technical or domain-specific ones, and as a project maintainer, as the subject-matter expert, it's your obligation to absorb all that complexity on behalf of your users.
