---
title: Your project's README is your project's constitution
description: Your project README doesn't just communicate the "what" and "how", it communicates the "why", and serves as your most effective tool to combat open source scope creep and technical debt.
---

Most open source project maintainers treat READMEs as mere marketing material or technical documentation. Yes, your project README can and should tell others what your project does and how they can use it, but at its most fundamental level, the README serves as your project's foundational document, memorializing and communicating the project's core goals, philosophies, and underlying assumptions.

[Well-focused projects are healthy projects](http://ben.balter.com/2016/07/21/removing-a-feature-is-a-feature/). Among the first things I do when I start a new project is to write a one- or two-line description of what problem(s) I intend the project to solve (the project's goals) as the first line of the README (immediately after the project name). For complex projects, maybe it grows to a few bullets. One of my favorite examples of this is [the `choosealicense.com` goals](https://github.com/github/choosealicense.com#immediate-goals). As you continue to write new features, refactor old ones, and gain contributors, those goals will sit there unchanged, and often slip into the back of your mind. And that's just fine.

### It begins with a well-intentioned pull request

About six months will go by while your project (hopefully) gains popularity. One day, a well-intentioned user will submit a pull request to expand the project beyond its original scope, trying to solve a problem you have no personal interest in solving, a solution that will be difficult for you to maintain, or one that complicates solving the problems you really care about solving. At this point you have two options:

1. You engage the contributor on the merits of the pull request they painstakingly hand crafted ("*is this a valid problem to be solving?*"), or
2. You engage the contributor on whether the problem they're trying to solve furthers one of the project's goals (*"is this part of the problem we're trying to solve?"*).

Option 1 almost always ends in a choice between scope creep and hurt feelings, because they wouldn't have submitted the pull request unless it was a problem they were personally facing.

### Defer to the README

With option 2, you link back to the README, explain that you don't believe the pull request will advance the project's purpose, and suggest that if the contributor thinks the project's goals should be revised or expanded, that it's a valid suggestion, but that the appropriate forum to do so is in a pull request updating the README, where the entire community of contributors — not just those interested in this particular feature — could have a dedicated and in-depth conversation about the project's *raison d'etre*. As we wrote in [`opensource.guide`](https://opensource.guide/building-community/#treat-your-readme-as-a-constitution):

> If people are overly focused on debating the merit of a particular feature, it may help to revisit your README and talk about the higher vision of your project. Focusing on your README also depersonalizes the conversation, so you can have a constructive discussion.

### Pull requests should solve exactly one problem

This approach mirrors the common technical mantra, that each pull request should solve exactly one problem. If a pull request review is forced to answer two questions (1) "*is this the right technical solution to the problem?*, and (2) "*are we solving the right problem?*", the "right" way to do it is in two distinct pull requests to keep unrelated discussions distinct and adequately memorialized.

To continue the legal metaphor, deferring to the README is the open source equivalent of appealing to the Supreme Court. Just as the US Constitution sets the foundation for what the US government should and shouldn't do and how it should go about solving problems, so too does a project's README dictate the four corners of the project's efforts and the means by which it's permitted to solve them. Think of it as a contract between the project and its users saying "this project will provide the service of tackling these problems in this way".

### Moving beyond bullets

As your project evolves and becomes more mature, so too should your stated goals. Maybe you expand those goals to document the project's philosophy, like [WordPress](https://wordpress.org/about/philosophy/) and [Jekyll](https://jekyllrb.com/philosophy.html) do. Maybe you add an explicit code of conduct. You might also need to document any [underlying assumptions you're making about the problem space](https://github.com/benbalter/licensee/blob/master/docs/what-we-look-at.md#huh-why-dont-you-look-at-x). Eventually these may move to dedicated docs, but almost without exception, they begin their legal existence as a line or two in the README (and not solely in your head or communicated ad-hoc).

When you start a new open source project, you know what problems you're trying to solve and how you'd solve them. As the project matures, "you" becomes "we", and it becomes even more important that you write down these foundational beliefs so that you can communicate them to others and establish shared norms (which you can then later enforce without prejudice or drama). Your project README doesn't just communicate the "what" and "how", it communicates the "why", and serves as your most effective tool to combat open source scope creep and technical debt.
