---
title: Bringing open source workflows to the enterprise
description: How open source workflows and philosophies can be leveraged by the enterprise to produce more modern software, even if that software ultimately remains closed source.
---

<!--lint ignore no-emphasis-as-heading-->

*This post originally published on [DLT's Technically Speaking](http://blogs.dlt.com/bringing-open-source-workflows-enterprise/).*

Open source has changed the way we build software. A fully distributed team of strangers, rarely working on the same thing at the same time or in the same place at the same time, yet open source projects consistently produce better software than their closed-source and proprietary counterparts. How then, can this reimagined software development workflow be leveraged by the enterprise to produce more modern software, even if that software ultimately remains closed source?

## Traditional waterfall development

A traditional software development project may look something like this: A customer spends weeks to months gathering requirements, the requirements are passed to a project manager, and the project manager assigns tasks to individual developers and designers. It's an extremely rigid, extremely hierarchical approach that traces its roots to the rise of factory workers each producing fungible parts of a whole where responsibility for assemblies and sub-assemblies could be easily delegated and managed individually.

In practicality, software is more art than assembly, with project managers acting as the primary interface between the customer and development efforts, often passing information back and forth in non-purpose-built tools like Excel and Outlook, or even holding regularly scheduled status meetings just to keep stakeholders in the loop. When the project concludes, the customer is often left with just the URL to a working instance of the software, or perhaps a snapshot of the final code via an email from the project manager to product owner. Needless to say, the process is inefficient, time consuming, and leaves the customer with an incomplete view of what they've bought both day-to-day and historically. This is especially troublesome if the agency needs to make any changes to the software once the engagement concludes.

## Software development in the open source world

If traditional software development mirrors the command-and-control ethos of the organizational chart, open source workflows are better understood as a web of personal and professional relationships. All open source projects live and die by their public bug tracker. This bug tracker maintains an ongoing backlog of known issues, feature requests, and proposed improvements, open to end users, developers, and non-technical stakeholders alike to submit new issues or participate in the ongoing discussion surrounding each open proposal. Notice something wonky? File an issue. Wish the application did X? File an issue. Issues are the atomic element of open source software development.

Project managers regularly go through and curate open issues, prioritize requests, and review proposed changes as developers self-assign tasks and work in the open where all can see their progress. It may sound like chaos to a traditionally trained manager, but whether the code is public or remains behind your organization's firewall, by removing the transactional friction inherent in a top-down, heavyweight process, all stakeholders gain access to more real-time project information and can spend less time collecting, communicating, and sifting through the noise created by bespoke project updates.

## Open source in the enterprise

These leaner, more agile, open source workflows are increasingly taking footholds in the private sector. Today, you'd be hard pressed to find a startup worth its venture capital funding that doesn't trace its development philosophy, at least in part, to the world of open source, even if the code it writes is never made public. Development teams develop as openly as possible (within the confines of their organization), leveraging electronic and asynchronous tools to naturally capture and expose process for others to see at each step.

When private organizations do contract out development efforts, they expect contractors to integrate with the customer's development workflow, not the other way around, and deliver not just the source code, but all project collateral on a near constant basis, providing the customer with the code's full pedigree, decision history, and most importantly, the means to avoiding vendor lock in.

These transparent workflows break down the organizational silos native to large organizations, fostering somewhat of an "open source" culture internally. Rather than hoarding "their" code, teams maintain "open source" projects that other teams are encouraged to leverage for their own efforts. These "open source" projects act just like any other open source project — bug tracker, documentation, generic modularity and all — except the code is only open to those within the organization, an arrangement often referred to as "open collaboration".

## Open collaboration in government

Government is perfectly positioned to leverage these more open software development workflows. Rarely developing software in house, government agencies spend millions of dollars each year on purpose-built software, but maintain a largely arms-length relationship with development teams. More often than not, agencies hand curate their own issue backlog, funneling bugs and feature requests through a single project owner, and communicating task orders via email where project managers then record the request in the development team's duplicative issue tracker.

What if both agency and contractor adopted and shared tools that naturally captured and exposed process? What if we let technology do the heavy lifting rather than dedicating two full time employees to largely shuttle information back and forth between organizations? As asynchronous tools like chat and issue trackers replace hand-curated spreadsheets and in-person updates, government agencies gain day-to-day visibility into project status, are given a more complete, historical picture of how decisions were made and why, and agency employees can move from remedial to higher-value work.

## How you work is as important as what you work on

The tools you choose matter. Tools are more than mere convenience. Tools force teams into particular workflows, workflows that constrain not just how software is produced, but what software is possible. It's no coincidence then that the open source community, to produce the type of software it produces, adopts vastly different tools than most enterprise developers have available to them at their office.

Open source tools tend to be more organic, rather than process-driven, and prefer social norms to technical constraints. Open source tools must also be able to support the constraints of distributed, open source teams. For example, a 9:00 AM standup meeting is not an option when your development team spans every timezone, let alone, isn't in the same office.

When it comes to how they work, open source teams are bound by [four distinct constraints](http://2ndscale.com/rtomayko/2012/adopt-an-open-source-process-constraints):

> * **Electronic**: Discussion, planning, and operations process should use a high fidelity form of electronic communication like email, GitHub.com, or chat with transcripts wherever possible. Avoid meatspace discussion and meetings.
>
> * **Available**: Work should be visible and expose process. Work should have a URL. It should be possible to move backward from a piece of product or a system failure and understand how it came to be that way. Prefer Git, issues, pull requests, mailing lists, and chat with transcripts over URL-less mediums.
>
> * **Asynchronous**: Almost no part of the product development process requires that one person interrupt another's immediate attention or that people be in the same place at the same time, or even that people be in different places at the same time. Even small meetings or short phone calls can wreck flow so consider laying it out in (a thought out) email or sending a pull request instead.
>
> * **Lock free**: Avoid synchronization / lock points when designing process. This is [distributed version control](http://en.wikipedia.org/wiki/Distributed_revision_control) writ large… Work towards a goal should never be blocked on approval. Push approval/rejection to the review stage or automate it, but surface work early to get feedback.

By adopting tools that embrace these constraints, both in their own dealings, and in their dealings with external contractors, government agencies can begin to foster modern software development practices more in line with those seen beyond the beltway.

## The technology is the easy part

It's not a question of if your team can track who-made-what-change-when to code over time, or if your IT department can stand up a chat server. These are all technical challenges that the open source community solved decades ago. The challenge is in using technology as a vehicle to motivate organization change, to rethink internal workflows and lines of communication. The challenge is also cultural, to foster an organizational culture of trust and cooperation whereby transparency is seen as an asset, not a political liability.

It's often said that government IT is five to ten years behind that of the private sector. It doesn't need to be that way. It's possible to fold the map in half and bring the East coast a bit closer to the West coast. It starts not with what we work on, but in how we work.
