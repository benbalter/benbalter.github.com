---
title: Optimizing for power users and edge cases is the easy part
description:
---

When designing a product — be it an open source project or a for-profit service — it's all too easy to optimize for power users and edge cases. While [the squeaky wheel may most often get the grease](https://en.wikipedia.org/wiki/The_squeaky_wheel_gets_the_grease), that doesn't necessarily mean that it should. The real challenge for any product lies in nailing the out-of-box experience for 80% of users' needs.

### Solving the fun problems

As a geek, it's always going to be more fun to develop the new wiz-bang feature that will allow the app to integrate with whatever's currently on the top of Hacker News, or to design a single method that elegantly accounts for when your program is used at the South Poll by a user running Window XP SP1 under a full moon. While those are fun engineering challenges for those of us that build software, they do little to benefit the majority of the people that actually use the software that we build.

As a project maintainer, it's always going to feel better to ship code and mark an issue as resolved, than to close yet another issue as "wontfix" — to say no. But your project's issue tracker (or support queue) is going to present a very skewed perspective of your user base, especially when you use it to evaluate feature requests and user feedback.

### The silent majority of users

Think about the type of user that's going to take the time to open an issue: they're either going to be power users that have already invested hours in your app and now demand additional functionality that extends the core use case, or new and potential users with unique circumstances that you didn't originally intended to accommodate. In either case, opening an issue takes time and specialized domain knowledge, and thus, through pure self selection, most issues are going to be opened by the extreme edges of your user base, not by the core of users (or potential users).

Instead, of optimizing for the most vocal, feature requests should be evaluated through the lens of "what would benefit 80% of users?" — the [silent majority](https://en.wikipedia.org/wiki/Silent_majority), to borrow a phrase from politics. I suspect, for most projects, the exact opposite is sure, that 80% of feature requests come from just 20% of users. Combined with the fact that these requests often represent the "fun" problems, this [80/20 rule](https://en.wikipedia.org/wiki/Pareto_principle) means that in many cases, the majority of features implemented will provide no benefit to the majority of the people that use the project.

No product is going to satisfy 100% of user needs.
