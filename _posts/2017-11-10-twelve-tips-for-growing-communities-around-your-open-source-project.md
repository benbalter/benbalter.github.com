---
title: Twelve tips for growing communities around your open source project
description: After more than ten years maintaining open source projects, and now helping other maintainers to do the same, here's twelve things I've learned about growing healthy, vibrant communities around your open source project.
---

The superficial promise of open source is that if you publish your code, others will make it better. Strictly speaking, that's not the case. To reap the benefits of open source, maintainers must seek to grow communities around their project, a step often overlooked when "publishing" code.

When it comes to growing communities, there's nothing unique about online communities. Online communities are offline communities, just online. Like your bowling league, place of worship, or neighborhood, there are members, leaders, and rules (be they written or unspoken).

Beyond establishing and enforcing such norms, maintainers seeking to grow communities need to attract members and encourage them to become leaders. My colleague @MikeMcQuaid describes this process as a [contributor funnel](https://mikemcquaid.com/2018/08/14/the-open-source-contributor-funnel-why-people-dont-contribute-to-your-open-source-project/). Similar to prospects traveling down a sales funnel, maintainers must market their project to attract users, provide opportunities for those users to contribute, and encourage repeat contributors to take on maintaining the project.

At GitHub, we've created [`opensource.guide`](https://opensource.guide) to memorialize some of those community-building best practices, and have started prompting users to adopt them via [the community profile](https://github.com/blog/2380-new-community-tools). Beyond that, here are twelve tips for growing communities around your open source project:

### 1. Solve a shared problem

The first step to growing a community is to solve a shared problem. If you open source a library that only connects to one server in your data center on Tuesdays when there's a full moon, it's unlikely that another developer would use the software, let alone see the need to improve or contribute.

Ideally when you're initially architecting the application, but at least before open sourcing, you should abstract your project's logic to the point that it can be widely used beyond your own, specific use case. A library that makes any MySQL database into an API is significantly more likely to thrive as an open source project than an application that wraps your specific database and exposes an API for only your data.

It's a shared win. You'll get more modular, more robust code (and potential community improvements), and the open-source community will gain a library that can be used for problems beyond the one you're trying to solve.

### 2. Choose a (widely adopted) open source license

Open source software isn't open source without an open source license. It's simply "published code". Open source licenses grant developers the right to use and more importantly, to modify your code. They tell downstream consumers what they can and can't do with your code, and give them the confidence to use your software, without fear of legal repercussion, not to mention, it (often) clarifies under what conditions third-party developers contribute.

While it may be tempting to author your own open source license, [don't](http://ben.balter.com/2016/08/01/why-you-shouldnt-write-your-own-open-source-license/). The difference between open source licenses, and other intellectual property grants, like say, an author's license to a book publisher, however, is that open source licenses are heavily standardized, with about a dozen mainstream licenses and three primary licenses representing the vast majority of open source projects.

It shouldn't require a team of lawyers to participate in the open-source community, either as a contributor or as a consumer. Standardized open source licenses serve as a three or four letter proxy for those with and without formal legal training to know exactly what they can and can't do with your code, and thus, make it more likely your code will be used and contributed to.

### 3. Link to the GitHub repository from your project's distribution channel(s)

If you're developing a WordPress plugin, Drupal module, Chrome extension, or mobile app, it's vital that users know that your project is open source, and that they're invited to contribute (the first step of the contributor funnel). Regardless of how you distribute your code, if it's distributed any way other than GitHub or a package manager, link back to the repository from that distribution mechanism (WordPress.org, drupal.org, the Google Play or App store, etc.).

Imagine this: You're a software developer using a Chrome extension you found via a Google search and installed via Chrome. You find a bug. You could simply uninstall the extension and find an alternative, or if the extension is open source and the repository readily available, can engage the maintainer, open an issue, and potentially submit the fix yourself.

Links from where the users install the project, or expect support from other projects, to your repository can go a long way to driving users to preferred feedback channels and gives them the opportunity to discover and contribute to your open source project.

### 4. Publish technical documentation

In my mind, there are three types of documentation: marketing materials (why you should use the project), end user documentation (how to use the project), and technical documentation (how the project works or how to implement it). Most projects tackle the first two but neglect the last beyond obvious or common use cases. The goal should be to transfer project knowledge from the maintainer's head(s) to potential contributors.

The last two are the difference between documenting anticipated behaviors versus method or function level functionality. It could be in-line, autogenerated, or hand curated, but the idea is that you're lowering the cognitive burden to expand your project beyond what was originally anticipated, both technically and in terms of desired functionality.

In my experience expanded technical documentation is a positive feedback loop, in that it forces crisper, more purpose built code and leaves less room for ambiguity (not to mention, it helps onboard new users to your project).

### 5. Document how to contribute (and that you want contributions)

Every project has its own workflow, processes, and norms. Some require that each pull request have an associated issue, other require squashing commits or that commit messages be in a specific format. Whatever your community's practice, make it easy for first-time contributors to implement. This helps ensure that first-time contributors have a positive experience and become repeat contributors, but also means that maintainers will be able to spend less time on the busy work of enforcing process.

Think through the experience of going from a user to a first-time contributor to a regular contributor. How long does it take for that user to go from "I want to contribute" to "I have contributed"? I call that measure [friction](https://ben.balter.com/2013/08/11/friction/). When documenting your process, constantly ask yourself "how can you minimize that friction?" (or inversely, how can you maximize that conversion rate). How do you bootstrap a local development environment? How do you run tests? What are common pitfalls? Do you require a CLA? Whatever it is, try to make it as easy as possible to contribute, and more users will.

Last, it's not enough to simply write down *how* to contribute. As you think through the contributor UX, and growing a welcoming community of contributors, it becomes necessary to document that users *should* contribute. At the top of your contributing document, be sure to invite users to contribute (not always a safe assumption), explain that the project improves one contribution at a time from users just like them, and thank them in advance for taking the time to make the project better. Provide users with the activation energy to overcome the temptation of working around the problem locally (or finding another project) without contributing their fixes back upstream.

### 6. Clarify support versus development

No software is perfect. As your community grows, it's likely users will discover flaws or at least stumble to use the project as you intended. As your project's users seek support, try to anticipate common questions, and clarify your preferred routes for support for those that remain unanswered. Should users open an issue? Do you have a dedicated support forum? Contact paid support? Pop into Slack or Gitter? Hope for the best on StackOverflow? There are several ways you can do this:

* **Support files** - If you add a `SUPPORT.md` file to your project's root, `.github`, or `docs/` folder, GitHub will display it at various times users seek support, including above the new issue form. This is a great place to describe what avenues are available to users for support, if any.
* **Troubleshooting or FAQ docs** - If you find yourself answering common questions, rather than hope users search prior issues before opening a new one, answer common questions/trouble points in a dedicated troubleshooting or FAQ document. Better yet, when you answer new questions, encourage the users to expand the documentation with their solution.
* **Dedicated support channels** - Many projects like to keep their issue tracker dedicated to capturing the project's ongoing work. If that's the case, then you must establish and communicate alternate support channels. It could be a separate repository, a Discourse instance, a chat forum, or paid support. Whatever the medium, be sure to document it front and center.

Whatever the preferred path, if you assume your software is imperfect, then you need to tell users how they can best get problems resolved.

### 7. Welcome new contributors

One of the most impactful ways you can grow your community is to welcome new contributors. Submitting a pull request to a project can be a scary experience, especially if it's a user's first pull request. If after potentially hours of frustrating effort, all you get is an automated merge notification, it's unlikely you'll find the motivation to endure the ordeal a second time.

The good news is, that as a maintainer, if a first-time contributor submits a pull request, you'll see a "First-time contributor" badge displayed prominently next to their name. As you review the pull request, go out of your way to walk them through the process and ensure they have a good first-time experience. Put another way, you shouldn't review a user's 100th contribution and first contribution the same way. Take the time to explain *why* you're requesting changes, if any, and *how* to implement them, if necessary.

Once the pull request has been merged, take a moment to thank and congratulate the contributor. Remember, this is potentially a big deal for them, depending on where they are in their career or the notoriety of your project. Better yet, provide links to open issues, especially those labeled "help-wanted" and invite the contributor to build on their momentum by finding a second issue to tackle. GitHub offers saved replies that can help simplify the process.

### 8. Set up automated tests

Many developers think of continuous integration (CI) as a workflow tool, or a software quality tool, but it's actually a powerful community building tool. Rather than needing to wait for a maintainer to review their work, which might span timezones or work schedules, automated tests provide contributors with instant feedback on their contribution. Beyond providing contributors with the opportunity to improve their code before a human review, CI also provides maintainers with confidence that a given feature or bugfix doesn't introduce a regression, without necessarily needing to run the code locally.

CI is often trivial to set up for open source projects, especially if your project already has automated tests. Services like Travis CI have examples for every major framework and language, are completely free, and are often a matter of simply adding the necessary metadata to your project's root. Once enabled, potential contributions are automatically tested, and their status is reported directly on the pull request. Rather than testing each contribution manually, don't force humans to do what computers can.

### 9. Enforce code standards

Automated testing can be used for more than just "does this thing work". If your project (or language or framework) has adopted coding standards, use CI to enforce them. Most common languages have customizable linters, or, if necessary, you could always write your own for custom or one-off rules.

As we say at GitHub, "pedantic robots > pedantic humans". If a human comes along and criticizes your coding style or nit-picks every detail of your implementation, you might take it personally. If a robot makes those same suggestions, you're less likely to.

Automated code style enforcement via projects like Rubocop or WPCS not only ensures consistent code style to improve readability, it also allows contributors to get instant feedback on their code, all without your intervention.

### 10. Automate community management

One of the biggest improvements to open source community management in recent memory is [Probot](https://probot.github.io/). Probot is an extensible framework for automating tasks based on your repository's activity. With [dozens of community-maintained apps](https://probot.github.io/apps/) chances are whatever pain point you're current experiencing has already been experienced (and solved) by an open source maintainer.

You can use Probot for things like welcoming first-time users, automatically closing stale issues, requesting more information, or even moderating toxic conversations. Better still, if your problem hasn't been solved, Probot makes it easy to write your own app.

While I'd certainly recommend manually implementing the above to get a feel for what practices best support your community, once you've answered that question, Probot can certainly help automate implementing them.

### 11. Adopt a code of conduct

Not every experience on the internet is a great one. Humans are human, and reasonable people can disagree, even when it comes to open source. Your goal as an open source community maintainer should be to keep conversations civil, and ensure that anyone who wants to contribute, can. Adding a code of conduct to your project takes seconds, and can signal to those considering contributing that your community is a welcoming community to which they should contribute.

Establishing such norms early on can go along way to preventing or mitigating conflict before it arises. Committing a single file, however, isn't enough, and can actually do more harm than good, if you're not willing to enforce it. Be sure to provide a private channel to report violations, and be prepared to take action in response, even if the decision is unpopular.

When looking at the long-term success of your project, a vibrant, welcoming community of users and contributors is going to do more for your project than any single developer or individual feature. In a perfect world, conflicts wouldn't arise, but sometimes a tough conversation and establishing community norms is going to be the best thing for the health of your project in the long-run.

### 12. Find someone to adopt it

Priorities change. People move jobs. New technology arises. Whatever the reason, if you're heart's no longer into maintaining the project, don't, but also don't abandon it. If you feel your passion start to fade, or if you're feeling burned out, begin actively soliciting new maintainers, and ultimately a developer to adopt your project.

If you have a small cadre of active contributors, often, this is just a matter of formally turning over control to them as maintainers. If you don't, you may need to be a bit more transparent with your intentions, by opening a dedicated "this project is up for adoption issue", making please for financial support (if money's an issue), or reaching out into individual developers you think might be interested.

The most important thing you can do is communicate your project's status, whatever it may be. If it's feature complete, say so. No longer maintained? Warn potential users. Is their a better replacement? You don't want a potential contributor to spend hours working on a bugfix, only to find their pull request go unanswered. You created the project, your users and contributors dedicated countless hours, and its your responsibility to ensure they have a good experience from start to finish.

### It takes a community

Open source is much more than simply publishing code. It's just as much about community building and the humans behind the software as it is about the software itself. As your project gains in popularity, scaling the community becomes just as important as the technology's ability to scale, and it's your responsibility to do so, if you want your project to grow sustainably.
