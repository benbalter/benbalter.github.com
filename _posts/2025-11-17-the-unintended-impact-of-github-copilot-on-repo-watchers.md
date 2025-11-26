---
title: The unintended impact of GitHub Copilot on repo watchers
description: AI coding agents can ship code faster than ever, but what about the people watching your repository? Let's talk about the notification flood and what it means for collaborative development.
---

I spent a weekend hacking on my personal blog with GitHub Copilot's coding agent. It was incredibly productive—dozens of improvements, bugfixes, and new features shipped in a matter of hours. The kind of weekend sprint that would have taken me weeks to accomplish manually. Then on Monday morning, I got a message from a reader: "Might need to tweak my notifications a bit." It was said with good humor, but it got me thinking about an unintended consequence of AI-powered development: what happens to the people watching your repository?

## The notification flood

If you've ever watched an active open source project, you know the feeling. Each commit, each pull request, each comment generates a notification. Multiply that by the velocity of an AI coding agent working through a backlog, and you've got a fire hose of activity that can quickly overwhelm anyone trying to stay informed. What used to be a manageable stream of updates—a commit here, a pull request there—becomes a constant barrage of notifications that's impossible to keep up with.

The irony is that this is exactly what we wanted. We wanted to ship faster. We wanted to iterate more quickly. We wanted to reduce the friction between having an idea and seeing it in production. And Copilot delivers on all of that. But like many technological advances, the benefits come with trade-offs that aren't immediately obvious until you experience them.

## The watcher's dilemma

Repository watchers fall into a few categories. There are the casual observers who star a project because they find it interesting and want to keep tabs on its progress. There are the power users who actively use the project and want to know when bugs are fixed or features are added. There are the contributors who are invested in the project's direction and want to participate in discussions. And there are the maintainers of other projects who watch dependencies to stay informed about changes that might affect their own code.

For all of these groups, the traditional notification system worked reasonably well when human developers were setting the pace. A maintainer might push a few commits a day. A pull request might generate a handful of comments. The rhythm was manageable. But when an AI agent can generate dozens of commits in an hour, the signal-to-noise ratio breaks down. The watchers who were trying to stay informed now find themselves drowning in notifications, many of which are granular implementation details rather than meaningful changes.

## It's not just about volume

The challenge isn't just the quantity of notifications—it's also about their nature. When a human developer works on a feature, they typically batch related changes into logical commits. They might open a pull request that represents hours or days of work, allowing watchers to review the change as a cohesive whole. The commit messages and pull request descriptions provide context and rationale. The review process surfaces questions and alternative approaches.

When an AI agent works, the pattern can be different. Commits might be more granular, representing individual iterations as the agent tests and refines its approach. The "work in progress" nature of AI development becomes visible in the commit history. Pull requests might be opened, closed, and reopened as the agent explores different solutions. Each of these actions generates notifications, but many of them represent intermediate states rather than significant milestones.

This isn't a criticism of how AI agents work—it's actually a feature. The iterative, exploratory approach is part of what makes them effective. But it does create a mismatch with notification systems designed around human development patterns.

## Rethinking notifications for the AI era

So what's the solution? Telling watchers to "just turn off notifications" defeats the purpose of watching a repository in the first place. The goal is to stay informed, not to be completely disconnected. Here are a few approaches worth considering:

### For AI users

1. **Batch and squash**: When possible, work in a feature branch and open a single pull request with squashed commits. This preserves the AI's exploratory process internally while presenting a cleaner interface to watchers.

2. **Strategic notifications**: Consider working in a private fork for the initial AI-assisted iteration, then opening a pull request to the main repository only when you're ready for review. This keeps the exploratory noise out of watchers' inboxes.

3. **Communication cadence**: If you're doing an intensive sprint with AI assistance, consider posting a heads-up issue like "Working on weekend improvements, expect higher than normal activity." This sets expectations and gives watchers the option to temporarily adjust their notification settings.

4. **Draft pull requests**: Use GitHub's draft pull request feature liberally when working with AI agents. This signals that the work is in progress and doesn't require immediate attention.

### For watchers

1. **Adjust notification settings**: GitHub offers granular notification controls. Consider watching only releases or specific events rather than all activity. For projects with high AI activity, you might watch releases and manually check in on pull requests rather than getting every commit notification.

2. **Use notification filters**: Set up email filters or use GitHub's notification features to triage based on what matters to you. You can filter by author, label, or activity type to focus on the signals that matter.

3. **Embrace digest modes**: Instead of real-time notifications, consider checking in on repositories at scheduled intervals. GitHub's interface makes it easy to see what's changed since your last visit without needing every notification.

4. **Communicate with maintainers**: If you're watching a repository and find the notification volume unmanageable, open an issue. Good maintainers care about their community's experience and may adjust their workflow if they know it's causing problems.

## The broader implications

This notification challenge is really a symptom of a larger shift happening in software development. As AI coding agents become more capable and more prevalent, we're going to see development velocity increase across the board. That's exciting, but it also means our collaboration and communication tools need to evolve.

The current notification paradigm assumes a roughly human-paced workflow. It's optimized for a world where commits are somewhat expensive (in terms of time and attention) and therefore naturally batched. When commits become cheap and plentiful, that optimization breaks down. We need notification systems that can intelligently summarize activity, highlight significant changes, and give watchers more control over what "significant" means to them.

GitHub and other platforms are already starting to address this with features like notification filtering, digest modes, and more granular watch settings. But there's more work to be done. We need smarter defaults, better AI-powered summarization of activity, and more flexible notification policies that can adapt to different workflow patterns.

## The human element

Here's the thing though: notifications aren't just about information delivery. They're about community and collaboration. When you watch a repository, you're not just passively consuming updates—you're participating in a shared endeavor. You're saying "I care about this project and want to be part of its evolution." The challenge of the AI era is preserving that sense of community and participation even as the pace of development accelerates.

My weekend reader who needed to tweak their notifications wasn't complaining—they were engaging. They cared enough about my blog to watch it, cared enough about their notification hygiene to notice the flood, and cared enough about our relationship to let me know (with humor) that something had changed. That's exactly the kind of feedback loop that makes open source communities work.

The lesson isn't to stop using AI coding agents or to stop watching repositories. It's to be more intentional about both. As someone using AI to accelerate development, I need to think about the experience of people following my work. As someone watching repositories, I need to actively curate my notification settings to match my goals and capacity. And as a community, we need to keep talking about these experiences so that tools and norms can evolve together.

## Looking forward

We're still in the early days of AI-assisted development becoming mainstream. The patterns and practices are still emerging. The tools are still evolving. The social norms around AI usage in open source are still being established. This is a good thing—it means we have the opportunity to shape how this technology integrates into our workflows rather than having it imposed on us.

The notification challenge is just one example of the friction points we'll encounter as AI coding agents become more prevalent. There will be others: how we attribute AI-assisted contributions, how we review code that was primarily written by AI, how we maintain code quality and security when the volume of changes increases, how we preserve institutional knowledge when development happens at machine speed.

These are solvable problems, but they require thoughtfulness and communication. They require maintainers to consider the experience of their communities. They require tool builders to iterate based on real-world usage patterns. And they require all of us to stay engaged in the conversation about what we want software development to look like in the AI era.

## Conclusion

So yes, I'll probably "tweak my notifications" too—both by adjusting my GitHub notification settings and by being more thoughtful about how I use AI coding agents on public repositories. But I'm also grateful for that Monday morning message. It reminded me that behind every GitHub notification is a real person trying to stay informed and engaged. And that's something worth preserving, even as everything else accelerates.

If you're using AI coding agents on your projects, take a moment to think about the people watching your repositories. If you're watching repositories and finding the notification volume overwhelming, don't just suffer in silence—adjust your settings, and if appropriate, let maintainers know. And if you're building tools in this space, keep iterating on notification systems that can scale to the AI era while preserving the human connections that make open source special.

The future of software development is going to be faster, more automated, and more AI-assisted. But it can also be more humane, more collaborative, and more considerate of everyone involved. It's up to us to build it that way.
