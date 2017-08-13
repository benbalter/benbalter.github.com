---
title: Seven ways to consistently ship great features
description: Seven habits I admire in developers that I see consistently shipping great, user-centric features.
---

As a product manager, I spend most of my day working with developers to get features out the door and into the hands of users, both internally and for several open source projects. This gives me a unique sideline view of some of the habits successful (and not-so-successful) developers adopt, a perspective many may not be afforded when working in the code day-to-day. Here are seven habits I admire in developers that I see consistently shipping great, user-centric features:

### 1. Over communicate

When it comes to feature development, there is no such thing as over-communicating. What problem are we solving? Who are we solving it for? Why are we solving *this* problem? What solutions were proposed? Which was selected? How are we implementing it? What product or design considerations did we make? Do we have to make technical tradeoffs? Are there any outstanding questions? Does it actually solve what we set out to solve? What's the current status? Are there any blockers? What do we need to do to ship it? Make it all explicit, memorialized, and discoverable.

It doesn't have to be a formal template, but great developers make sure all the above question are answered at each step of the development process, and that everyone who needs to be aware, is, and that it's updated as circumstances change. The old developer adage, that there should be "more comments than code" is true here, except those comments often take the form of issue and pull request comments, rather than code comments. Most importantly, create a web of context through cross links so that others can find it. As a simple rule, if you reference something that has a URL, [you must provide a link](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/#double-bonus-if-it-has-a-url-link-to-it).

### 2. Write features first, then code

The difference between a feature and code is that a feature is defined by the user experience and the code is defined by how it's implemented. Writing code is by far the easiest part of software development. Sure, there are technical challenges to overcome, styles to be enforced, and methods to be optimized, but most days, those are routinely solvable problems. The challenge is building well-thought out, well-implemented features.

Describe what you're going to write, write it, and then describe what you wrote. Before you write a single line of code, propose to your teamates what you'd like to do and how you'd like to do it. Many code-review-induced rewrites could have been avoided by more explicit communication upfront. After the code's written, make sure non-developers can understand (and provide feedback) on what you did.

### 3. Get it in users' hands, not on `master`

Great developers don't just write code. The goal isn't to get functionality on `master`, rather to get functionality to users, and everything that entails beyond hitting merge. They own the feature from conception to retirement, writing feature proposals, success metrics, user-facing documentation, internal support playbooks, and the blog post that ultimately announces it to users, in addition to the code itself.

After it ships, they're going through Hacker News, Twitter, support tickets, and metrics dashboards to make sure they've smoothed any rough edges and the feature's solving the problem they intended to solve. At every step of the process, they're asking "*what else can I do to get an amazing experience into the hands of users?*", and they do just that.

### 4. Ship the smallest delta possible

If two features touch the same part of the codebase or can be conceptually related, it's tempting to think of them as one meta-feature and ship them at the same time. Great developers don't bundle features or increase batch size, but instead, strive to ship the smallest delta possible between the current user experience and the desired user experience.

Imagine you're just sitting down for a cross-country flight and the pilot gets on the PA to explain how excited they are because the engine's been redesigned from the ground up, and this is the first time it's being flown with passengers. You'd be unlikely to stay in your seat. But it's easy to imagine how an engineer seeking to replace one gasket, might realize that the new gasket allows you to slightly optimize the manifold, which means you can reconfigure the assembly... before you know it, one gasket has lead to a new engine. Most passengers would prefer that the engineer replaced the gasket and left it at that, before moving on to the next thing in a subsequent iteration.

Fewer moving parts parts means fewer untested lines of code and fewer things that can break. Avoid "flip a giant switch" ships. If you can ship something smaller than you currently are, you should.

### 5. "Next iteration" doesn't mean "never"

In a industry where "iterative" is the buzzword *de jure*, when a colleague proposes a feature that goes one step too far, it's tempting to say "*we should tackle that in a subsequent iteration*" as a sneaky way to pocket veto their suggestion. Instead, downscope the ship, but show your colleague the respect of giving their feature due consideration by immediately opening up a dedicated issue to discuss their proposal. Not only will their suggestion get the eyeball time and thought it deserves, if you decide to move forward, it's already in your backlog and will not be unintentionally (or intentionally) forgotten.

### 6. Always be opening issues

It happens all the time. You're discussing one feature and a related, but logically distinct idea comes up. Look at the issue title at the top of the page. If the idea doesn't solve the problem the title describes, it deserves its own issue. Not only does that keep the current discussion on track, it gives that new idea a dedicated URL where it can be memorialized, tracked, discussed, and cross linked.

Before you type the words "*this is a bug*", "*we should tackle this in a subsequent iteration*", or "*that's out of scope*", take the time to open a new issue to track that other thing. After all, [issues are free](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/#3-nobody-gets-fired-for-buying-ibm-opening-an-issue).

### 7. Optimize for users

For any sufficiently complex feature, you will face a choice between what's best for users and what's easy to implement, support, or maintain. Your software doesn't exist for you to write it. It exists so that users can use it. When in doubt, optimize for user happiness, not maintenance costs.

Practically, that means you should back into the code from the constraints of the desired user experience, not the other way around, and generally, [absorb complexity on behalf of users](https://ben.balter.com/2016/08/22/ten-ways-to-make-a-product-great/#1-absorb-complexity-on-behalf-of-users). You know you've done your job when to users it appears to be a simple problem to solve, but in reality, you labored over the implementation.

This list is far from exhaustive. I've written before about [rules for communicating at GitHub](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/), [habits common to effective GitHubbers](https://ben.balter.com/2016/09/13/seven-habits-of-highly-effective-githubbers/), and [philosophies that make great products](https://ben.balter.com/2016/08/22/ten-ways-to-make-a-product-great/), which remain true for developers and non-developers alike. These are some of the habits I've notice and admire, but of course, none of the above matters, however, unless you get it out the door. Above all, great developers :ship:.
