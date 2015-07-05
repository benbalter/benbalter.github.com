---
title: "Procuring open source contributions"
excerpt: "What IT procurement might look like, in a world in which government agencies adopt open source methodologies as their primary means of development"
---

Government IT has been on an in increasingly agile trajectory. Where once waterfall development was the only option, today agile development has become the norm, with agencies increasingly turning to open source platforms and open source solutions. But no discussion of government IT would be complete, without mentioning procurement. What then, assuming the trend continues, does IT procurement look like, in a world in which government agencies adopt open source methodologies as their primary means of development?

### From Waterfall to Agile

Traditionally, when the government needs a piece of code, lets say a website, they spend months gathering a detailed list of requirements. Once finalized, these requirements are set in stone, and are made available for government contractors to bid on. Whichever firm tenders the lowest, technically acceptable offer is awarded the contract, and months to years later, a website (not necessarily the code) is delivered to the agency, regardless of if the agency still wants the features it originally outlined months or years earlier.

That tide has shifted, towards agile procurement, whereby agencies typically procure software development services in bulk via the same requirements and award process, but rather than describing features for a particular website, describe the development capabilities of the firm. Once the contract is awarded, the agency works with the vendor to maintain an ongoing backlog of feature requests and over the course of two- to four-week code sprints, choose, develop, test, and deploy particular features across one or more applications. In this sense, the agency gets a "delivery" of new functionality once or twice a month, rather than once every few years. It's an iterative process designed to reduce the risk inherent with outlining detailed requirements upfront, requirements that would undoubtedly change as both technology and the organization evolve during the course of the contract.

### Applying agile to open source

One thing that open source does extremely well is to capture and organize feature requirements as they evolve. Head to any major open source project's issue tracker, and you'll see extremely detailed, extremely active discussions around both bugs and feature requests — it's the hallmark of a healthy open source project. It's also the perfect Agile backlog.

#### A tale of two issue trackers

Today, government agencies, just like the owner of any open source project maintain an ongoing backlog of bugs and feature requests (the "issue queue") in the open, in places like GitHub. The problem is, stuck in their old ways, government agencies often continue to also maintain an Excel spreadsheet, or other means of capturing and organizing potential task orders which they then hand off to contractors.

In reality, however, rarely if ever does feedback from external stakeholders make their way into a an agency-funded sprint. The open source community, often the more technical, more knowledgeable, and most directly affected by the project is relegated to submitting issues in what is arguable a second-tier form of feedback, at least form the agency's eyes.

Internal stakeholders, on the other hand, primarily email program managers directly, or voice their ideas at in in-person meetings open only to agency staff. Once voiced, the program manager captures the request in an internal spreadsheet, the same spreadsheet used to plan the next subsequent code sprint.

#### Automating issue tracking

If there's one thing government is known for, it's paperwork, but if there's one thing technology is known for, it's reducing paperwork. In the scenerio described above, you have a government staffer for which a significant potion of the job is spent being a human issue tracker, a task the open source community has automated for decades.

Imagine if, when those internal stakeholders made a feature request, they memorialized the idea in an issue in the public issue tracker, or better yet, encouraged the internal stakeholder to open it themselves. All of a sudden, not only can the project manager focus on managing the project, rather than a barrage of feature requests, stakeholders — both internal and external — can have a birds-eye view of the project's status, comment on proposed changes, and help to prioritize work.

Imagine if, rather than duplicating its efforts and maintaining an internal feature backlog in some non-purpose-built tool, government agencies simply used the issue trackers of their open source projects to request, document, and prioritize requirements. When it comes time to plan the next sprint, they simply look at the top issues, as prioritized by all stakeholders, not just those within the agency, let the community know they're about to tackle an issue, and assign that issue, by name, to the subsequent sprint.

The agency also has the benefit of providing the contractor not with a rough description of the desired functionality in laymans terms, but with the entire request's technical history, all in a single URL.

### Getting to agile procurement

Using a single, public issue tracker to track and prioritize potential tasks is just the start. What if, instead of procuring generic developer hours at the onset via set requirements, still a fundamentally waterfall mindset, instead, agencies chose issues for a given sprint, and sought contractors to bid on tackling those particular issues.

Instead of "50 hours of PHP developer's time", a RFQ which is almost guaranteed to get you the cheapest developers, you buy "pull requests which fix issues #1, #2, and #3", an approach which is more likely to get you the best possible solution to a given problem.

As government agencies increasingly adopt open source methodologies, our approach to procurement must similarly evolve. Imagine an open source project maintained by an agency and contributed to by open source developers, private-sector companies, and multiple government contractors.

What if we treated government contractors as just another contributor, one that happened to be paid for their time (rather than being motivated by a shared need). They selected an issue, submitted a pull request, and the functionality is reviewed by stakeholders before being merged. We're not far off. 
