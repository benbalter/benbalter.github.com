---
title: "Deprecate Management"
description: "There are many aspects to 'making things' that open source just does better, and does so without traditional management structure."
author: "Benjamin J. Balter"
layout: post
comments: true
category: 
tags: 
published: false

---

There are many aspects to "making things" that [open source just does better](http://ben.balter.com/2012/10/19/we-ve-been-trained-to-make-paper/). Regardless of if at the end of the day you ship bits or cogs, certain aspects of "office" work are universal: ideation, vetting initatives, resolving conflicts, and shipping product. Now imagine if you had to do all this not across conference tables, but across geographies and timezones. You'd have a pretty kickass process for sure. Welcome to the world of open source.

Think about it this way: in the traditional office setting, we use management to facilitate this collaborative building process. Management does many things, but at the most basic level they:

* Shuttle Information
* Coordinate across business units
* Align efforts to organazation priorities
* Make sure people do work
* Recruit new people

This makes sense if you look at the history of the role. In an age when conveying information was onerous, the only way for Adam to tell Becky what he was working on (and thus prevent Becky from duplicating efforts) was to stop what he was doing, walk down the hall, and interupt Becky. So instead of doing this every day, we hire Charlie to facilitate a standing meeting and shuttle that information back and forth.

But what if when that problem first arose Adam could send Becky an e-mail or an IM or post a update to a shared collaboration space. Do you think they'd need Charlie in the first place? Would management as we see it today have arisen in an age where technology reduces the friction of collaboration to nearly nil?

Take the open source community, as an test case, which was afforded just such an opportunity. Same problem, same outcome, and (for the most part), no traditional hierarchical structure. How do you overcome the management burden? Transparent, persistent communication — everything from code to decisions happen in the open and are archived for all to see — and pure meritocracy — a bunch of ideas arise and are voted on (through opt-in participation) and the best are seen to fruition.

But does it <del>blend</del> scale? WordPress, the open source content management system had nearly 300 individual contributors to its latest release, in just under four months, all working on a single project. And there's no reason this process has to be limited to software. Collaboration is collaboration. So what aspects of the open source process make this management free collaboration possible?

Ryan Tomayko [outlines](http://tomayko.com/writings/adopt-an-open-source-process-constraints) his experience applying the open source philosophy to an entire (for-profit) venture, noting four key features to the system:

> * **Electronic**: Discussion, planning, and operations process should use a high fidelity form of electronic communication like email, github.com, or chat with transcripts wherever possible. Avoid meatspace discussion and meetings.
> 
> * **Available**: Work should be visible and expose process. Work should have a URL. It should be possible to move backward from a piece of product or a system failure and understand how it came to be that way. Prefer git, issues, pull requests, mailing lists, and chat with transcripts over URL-less mediums.
> 
> * **Asynchronous**: Almost no part of the product development process requires that one person interrupt another's immediate attention or that people be in the same place at the same time, or even that people be in different places at the same time. Even small meetings or short phone calls can wreck flow so consider laying it out in (a thought out) email or sending a pull request instead.
> 
> * **Lock free**: Avoid synchronization / lock points when designing process. This is [distributed version control] writ large. We don't have a development manager that grants commit bit to repositories before you can do work, or a release manager that approves deploys, or a product manager that approves work on experimental product ideas. Work toward a goal should never be blocked on approval. Push approval/rejection to the review stage or automate it, but surface work early to get feedback.