---
title: 'Five best practices in open source: internal collaboration'
description: The way your organization works internally will necessarily be a mirror image of how your organization works externally, and if that workflow is closed or untrusting, you'll likely have trouble embracing to open source
---

Before you can participate in the open source community, you must first learn to collaborate. That's because [Open source is not a verb](https://ben.balter.com/2012/10/15/open-source-is-not-a-verb/). It's a workflow, a philosophy, a modern approach to software development. It's much more than simply hitting publish. To think you can [breed code in captivity behind a firewall](https://ben.balter.com/2013/05/14/we-ve-been-selling-open-source-wrong/), using closed, hostile, or waterfall methodologies, and that once that code leaves the firewall, it will grow wings, is a fundamental misunderstanding of what it means to participate in the open source community.

Working regularly with government agencies to help ensure their first (or second) step into the open source world is a successful one, here are five best practices for pursuing open source in government (or any large organization for that matter):

### 1. The technology is the easy part

Whether you realize it or not, when you embark on your organization's (or your team's) first open source project, you're likely going to be using open source as a vehicle for organizational change. From a practical standpoint, open source is a solved problem. It's not a question of if you can publish the source code, if you can stand up a forum to collect community feedback, or if you can track changes to the code over time. Geeks have been doing open source for decades at this point. You can assume it's at least *possible*.

The true challenge is whether or not you can foster the internal culture necessary to support your open source project externally. Put another way, you can't be a closed source culture behind the firewall, and expect to foster an open source culture publicly. Successful open source projects begin well before the first line of code is ever written, let alone published. The way your organization works internally will necessarily be a mirror image of how your organization works externally, and if that workflow is closed, hostile, or untrusting, you'll likely have trouble embracing to open source. Before you embark on your first open source project (whether as an agency, a company, a business unit, or a team), spend a few cycles improving your own internal workflows. Put another way, bad collaboration is bad collaboration, regardless of how closely held or widely shared the result is.

### 2. Start small, go through the motions

There's an anti-pattern within government that when an agency decides to start participating in the open source community, they bet big and do it with a flagship initiative, often with a strong policy component (and executive's reputation) at stake. In reality, [your first open source project is likely going to be a flop](https://ben.balter.com/2015/02/11/why-your-first-open-source-project-is-going-to-be-a-dud/).

You wouldn't run a marathon without training first, would you? Like your body, organizations have a strong muscle memory. You've most likely encountered [the organization's subconscious "no" reflex](https://ben.balter.com/2014/03/21/want-to-innovate-in-government-focus-on-culture/#bureaucracy-is-an-organism) when you unintentionally strike a nerve. If the organism doesn't recognize the antibodies of a new idea, it will attack it as a means of self preservation. Like introducing any new idea, introducing open source is no exception. Most stakeholders will say "no" at first glance, and certainly not on the proposal's merit.

Instead, start by experimenting by collaborating openly, but in private, within the safety of your team or organization. Create a list of best lunch places near your office or the team's favorite chocolate chip cookie recipe. Go through the motions of collaborating and master the basics when it doesn't matter if you make a mistake. Then get other stakeholders involved, legal, procurement, ethics, everyone. Abstract concepts like version control are much easier to justify when discussing concrete use cases.

Your first open source release should be something small and inconsequential, not a flagship initiative. Find a few lines of your website's frontend code, a plugin you use in your CMS, or a previously release mobile app. Get that open source 0.1 out the door, before waiting on (and learning from your mistakes as you ship) a 1.0 Your goal is to ensure all the organization's cylinders are firing in sync when it comes to open source, and to go through the motions of open source, with a bit of help from training wheels.

### 3. Minimize information imbalance

Open source is about growing a community. Often when we think about project stakeholders (and build or adopt workflows), we only look to those within our organization. When it comes to open source, you *must* ensure that those outside the firewall are on equal footing — in terms of access to information and ability to influence the project — as those inside the firewall. Simply put, developers are people too.

The default government workflow is to hold synchronous, meatspace meetings in wood-paneled, formerly smoke-filled rooms. Like a bad joke, you "had to be there" to be in on it. That's not how you foster a strong open source project.

Imagine this: you maintain an open source project. A contributor spends a week building out a new feature they want to see incorporated and propose it. You as the maintainer, have to turn them down, because either you've been secretly tracking a change internally that will solve the problem, or worse, have had secret discussions internally that you want to take the project in a different direction. You'd better bet that contributor is never contributing to your project ever again (or any other project for that matter).

The way you hedge against this risk is by working outside the firewall, by leveling the information playing field and placing your internal stakeholders on the same footing as all other project stakeholders. Not only does that simplify (and modernize) your own workflows, but it ensures that there's an information balance.

This idea comes into play in three distinct ways:

* **Procedurally** that means maintaining one issue tracker (that's public), rather than keeping a secret priority list that only you can see. That also means that stakeholders (again, whether internal or external) should have one mechanism to provide feedback or discuss new features. Last, minimize and memorialize meatspace discussions (when absolutely necessary).

* **Day-to-day** that means communicating the project's status (proof of concept, actively developed, deprecated, etc.) as well as how to submit an issue, propose a feature, or contribute a fix or enhancement.

* **Long-term** that means documenting (and open sourcing) the project's mission statement, philosophy, goals, features and requirements list, and overall project roadmap.

### 4. Embrace the constraints of open source

Open source is bound by certain workflow constraints. [Rarely are two people in the same place at the same time let alone working on the same thing at the same time](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/), and yet they almost always produce better results than their proprietary, purpose-built counterparts. It's the story of Wikipedia versus Encyclopedia Britannica.

You can't un-constrain open source, nor would you want to. To engage the open source community on equal footing, you must embrace their constraints, and chances are, by adopting modern, asynchronous tools, your workflow will improve for the better. With a few adaptations, as @rtomayko [wrote a few years back](http://tomayko.com/writings/adopt-an-open-source-process-constraints), there are four constraints:

* **Electronic** - Discussion, planning, and operations process should use a high fidelity form of electronic communication like email, GitHub.com, or chat with transcripts wherever possible. Avoid meatspace discussion and meetings.

* **Transparent** - Communicate decisions in real time, and forever. Work should be visible and expose process. Work should have a URL. It should be possible to move backward from a piece of product or a system failure and understand how it came to be that way. Prefer git, issues, pull requests, mailing lists, and chat with transcripts over URL-less mediums.

* **Asynchronous** - Focus workflow on code, not meetings. Almost no part of the product development process requires that one person interrupt another's immediate attention or that people be in the same place at the same time, or even that people be in different places at the same time. Even small meetings or short phone calls can wreck flow so consider laying it out in (a thought out) email or sending a pull request instead.

* **Informal** — Adopt cultures, not polices. Organizations should prefer social and cultural constraints to technical or administrative constraints that are unable to adapt to changing circumstances. Workflows should be professional, but not formal. Respond to pull requests with emoji and animated GIFs, not "Dear sir or madam, I am in receipt of your pull request". Be human.

### 5. Open source problems, not solutions

Developers want to contribute to a cause not provide free labor. If you set out to solve a problem, and you've published the result, you're not likely to garner a strong open source presence. Why would you? What exciting problems are there for developers to solve? What ways have you provided for them to contribute? Likely few to none (other than bugfixes, for which they have no vested interest).

Think about it this way. President Obama, in his 2008 campaign adopted the slogan of "Yes we can". Notice that that's not "Yes we did." He painted a vision of where the country could be in four years (not where he took it over the past four years), and invited others to help him get it there. Think of open source projects like political campaigns. Paint a vision of where the project could be and encourage developers to get behind the cause.

Put another way, if you're happy with your code when it leaves the firewall, if you're proud of it, you've almost undoubtedly shipped too late. Open source projects need but a vision. Start with documentation. An empty repository. A few lines of code that expresses your idea. Just enough to serve as a placeholder. Successful open source projects rarely, if ever, start with a finished product. As an added bonus, working in the open from day one (or two) will force you to write better, more modular code, and will allow you to get early feedback from stakeholders, both internal and external.

While it's certainly possible for your organization to maintain a waterfall or closed-source workflow and then hit publish, the likelihood of that project's open source success is exceedingly rare. If you're looking to take your first (or second) step into the open source community, start not by optimizing for external engagement, but by optimizing for internal collaboration.

{% capture content -%}
This post is part of a series on best practices in open source.<br />You may also be interested in <a href="https://ben.balter.com/2015/03/17/open-source-best-practices-external-engagement/" class="alert-link">Five best practices in open source: external engagement</a>.
{%- endcapture %}

{% include callout.html content=content %}
