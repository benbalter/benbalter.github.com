---
title: 'Open procurement: procurement in an increasingly open source world'
description: 'What IT procurement might look like, in a world in which government agencies adopt open source methodologies as their primary means of development'
---

Government IT has been on [an in increasingly agile trajectory](/2011/11/29/towards-a-more-agile-government/). Where once waterfall development was the only option, today agile development has become the norm, with agencies increasingly turning to open source platforms and open source solutions. But no discussion of government IT would be complete, without mentioning the "P" word: procurement. What then, assuming the trend continues, does IT procurement look like, in a world in which government agencies adopt open source methodologies as their primary means of software development? Are we headed towards a world where open procurement begets open source?

### From Waterfall to Agile

Traditionally, when the government needs a piece of code, lets say a website, they spend months gathering a detailed list of requirements from internal stakeholders. Once finalized, these requirements are set in stone, and are made available for government contractors to bid on. Whichever firm tenders the lowest, technically acceptable offer is awarded the contract, and months to years later, a website (not necessarily the code) is delivered to the agency, regardless of if the agency still wants the features it originally outlined months or years earlier.

That tide has shifted, towards agile procurement, whereby agencies typically procure software development services in bulk via the same requirements and award process, but rather than describing features for a particular website, describe the development capabilities of the firm. Once the contract is awarded, the agency works with the vendor to maintain an ongoing backlog of feature requests and over the course of two- to four-week code sprints, choose, develop, test, and deploy particular features across one or more applications. In this sense, the agency gets a "delivery" of new functionality once or twice a month, rather than once every few years. It's an iterative process designed to reduce the risk inherent with outlining detailed requirements upfront, requirements that would undoubtedly change as both technology and the organization evolve during the course of the contract.

### Applying agile to open source

One thing that open source does extremely well is to capture and organize feature requirements as they evolve. Head to any major open source project's issue tracker, and you'll see extremely detailed, extremely active discussions around both bugs and feature requests — it's the hallmark of a healthy open source project. It's also the perfect Agile backlog.

A stakeholder, technical or otherwise, will open an issue. Typically "I can't get this to work...", or "wouldn't it be great if..." type requests. Other stakeholders weigh in, noting that they've experience similar trouble, or that they too would benefit from a proposed feature. They may also propose suggested improvements. Technical stakeholders weigh in on potential approaches to solving the problem, and the relative merits of each are discussed. This entire discussion (along who made what argument in favor of what approach) is captured, public, and linkable from anywhere on the internet. You not only know what decisions were made, but how and why.

### A tale of two issue trackers

Today, government agencies, just like the maintainer of any open source project keep an ongoing backlog of bugs and feature requests (the "issue queue") in the open, in places like GitHub. The problem is, stuck in their old ways, government agencies often continue to also maintain an Excel spreadsheet, or other means of capturing and organizing potential task orders which they then hand off to contractors, in a typically bureacratic process.

In reality, however, due to this hierarchy, rarely if ever does feedback from external stakeholders make their way into a an agency-funded sprint. The open source community, often the more technical, more knowledgeable, and most directly affected by the project is relegated to submitting issues in what is arguably a second-tier form of feedback, at least in the agency's eyes. It's often seen as a feedback form, not too dissimilar from the comment card at your local chain restaurant. Maybe your comment makes its way back to "corporate"? Maybe?

Internal stakeholders, on the other hand, primarily email program managers directly, or voice their ideas at in-person meetings open only to agency staff. Once voiced, the program manager captures the request in an internal spreadsheet, and that spreadsheet is used to plan the next subsequent code sprint. Needless to say, the requests of internal stakeholders are almost always prioritized by virtue of having a direct line to the program manger's ear.

### Automating issue tracking

If there's one thing government is known for, it's paperwork, and if there's one thing technology is known for, it's for reducing paperwork. In the typical government development workflow, you have a civil servant for which a significant potion of his or her job is spent being a human issue tracker, a task that the open source community has automated out of necessity for decades. Practically, a non-trivial part of the government employee's day is spent collecting feedback, organizing feedback into tasks, and prioritizing which tasks should be given to an external contractor.

Imagine if, when those internal stakeholders made a feature request, the project manager memorialized the idea as an issue in the public issue tracker, or better yet, empowering the internal stakeholder to open it themselves. All of a sudden, not only can the project manager focus on actually managing the project, rather than a barrage of feature requests, stakeholders — both internal and external — can have a bird's eye view of the project's status, comment on proposed changes, and help to prioritize work. All stakeholders are now on equal footing.

What if, rather than duplicating its efforts and maintaining an internal feature backlog in some non-purpose-built tool, government agencies simply used the issue trackers of their open source projects to request, document, and prioritize requirements? Then, when it comes time to plan the next sprint, they simply look at the top issues, as prioritized by all stakeholders, not just those within the agency, let the community know they're about to tackle an issue (so as to avoid duplication of efforts), and assign that issue, by name or number, to the subsequent sprint.

As an added benefit, the agency is now empowered to provide the contractor not with a rough description of the desired functionality in layman's terms, filtered through ten intermediaries, but with the entire request's technical history, straight from the stakeholder's mouth, all in a single URL.

### From agile procurement to open procurement

Using a single, public issue tracker to track and prioritize potential tasks is just the start. What if, instead of procuring generic developer hours at the onset with set requirements — still a fundamentally waterfall mindset — instead, agencies chose issues for a given sprint, and sought contractors to bid on tackling those particular issues.

Instead of "50 hours of PHP developer's time", an RFQ which is almost guaranteed to get you the cheapest developers, you buy "pull requests which fix issues #1, #2, and #3", an approach which is more likely to get you the best possible solution to your problem. The idea is to treat government contractors as contributors, ones that happen to be paid for their time (rather than being motivated by a shared need). They select an issue, submitted a pull request, and the functionality is reviewed by stakeholders before being merged. It's the government's same requirements, testing and acceptance process, we'd just be doing it in the open, instead of in secret.

As government agencies adopt increasingly open software development methodologies, our approach to procurement must similarly evolve. Imagine an open source project maintained by an agency and contributed to by open source developers, private-sector companies, and multiple government contractors, all with equal access to information, all on equal footing, and all providing taxpayers with the best possible value for their tax dollar, not simply what the bureaucracy's antiquated process was able to squeeze out.

We're not far off. From a technology and legal standpoint, this idea of "open procurement" is trivial to implement. It's the culture around procurement, the hallway lawyering, and educating contracting officers, that's going to be the real challenge. Websites are not tanks or battleships, and we can't expect that a single approach will suit both. The government waking up to open source is fundamentally changing the way we build software. The next logical step is to change how we buy it.

*I'd be remissed if I didn't give a shoutout to David Hale (@lostonroute66) whose trying to head down this path at NIH and whose conversation inspired this post.*
