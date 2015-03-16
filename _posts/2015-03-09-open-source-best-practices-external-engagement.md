---
title: "Five best practices in open source: external engagement"
Excerpt: ""
---

When it comes to open source, simply publishing code, isn't enough. Open source is about fostering communities around shared challenges. Sure, you'll want to [fine tune your internal collaboration workflows](http://ben.balter.com/2015/03/08/open-source-best-practices-internal-collaboration/), but at its core, open source is about proactively engaging external developers. You can have open source without executive oversight. You can have open source without policy guidance. You can even have open source without large organizations. But you can't have open source without open source developers and you certainly can't have open source without open source code.

Working regularly with government agencies to help ensure their first (or second) step into the open source world is a successful one, here are five best practices for pursuing open source in government (or any large organization for that matter):

### 1. Expand your definition of stakeholders

Going in to your first open source project, you'll likely have a narrow definition of stakeholders. You've probably accounted for open source developers, internal business owners or subject matter experts, and possibly the press. Open source communities are made out of many more types of stakeholders, on both sides of the firewall. Put a different way, [everyone contributes](http://ben.balter.com/2013/08/11/everyone-contributes/).

Here's a short list of personas that likely already care about your project, our would care, if properly engaged:

* Non-technical, non-user stakeholders
* Potential users
* Veteran (or curious) users
* Subject matter experts (accessibility, content, i18n)
* Technical users
* Active developers
* Potential developers

Even before you hit publish, there's lots of ways to seed your project's ecosystem with different types of contributors, technical and otherwise. Here's a few ways they might contribute:

* Kick the tires, does the thing even work? Does it do what it says it does?
* Answer the question “what features would you love to see?”
* Flesh out documentation, ask questions, note where documentation is lacking
* Community evangelism, speak, teach, and spread your love for the project
* Submit new questions to the project’s Q&A forums, or take a stab at an answer or two
* Host a genius bar at the next local meetup
* Translate the project into a different language
* Give feedback on proposed bug fixes and features, propose new ones
* Recruit new developers, help junior developers grow into the project

In traditional government workflows, many of these functions happen by necessity, but artifacts, if they exist, are invisible to the open source community. Before you seek to engage external stakeholders, shift internal stakeholders off traditional workflows, and have them begin using the same tools you'd use to engage external stakeholders. Have a feature request? Open an issue. Want to review the docuemntation? Here's a link to the README.

If you do it right, by the time you're ready to engage the external community, you'll be a pro, having already used the same tools to engage your internal community, which can now be placed on equal footing as external stakeholders. Put another way, your goal should be to support one large community, not two necessary unequal ones.

### 2. Be the hub, encourage spokes

As the maintainer of an open source project, you should think of your role as being the host of the internet's most boring cocktail party. You are responsible for extending invitations to a diverse list of party goers, providing drinks and snacks, and as attendees arrive one-by-one, taking their coat and providing introductions.

Open source is no different. You must invite contributors, provide them with the necessary tools to collaborate (both social and technical), and to float from conversation to conversation, connecting subject matter and technical experts, and smoothing over any potential disagreements among guests before they even arise.

You can't be a host, however, if guests are only allowed to talk directly to you. That wouldn't be much of a party, and in the case of open source, wouldn't foster much of a community. Yet that's exactly how most open source efforts are initially structured by potential contributors emailing `anonymous-inbox@agency.gov`.

Instead, minimize one-to-one interactions. There's absolutely no way for you to scale. The types of questions and feedback you receive are going to be common to one another. *Is this column month-day-year or year-month-day?* *What unit is this represented in?*. Engaging developers via email means, by definition, that you're going to be answering the same question multiple times, and will be creating a single point of failure: yourself. As we say in engineering, non-blocking is better than blocking.

Every answer to every question should have a URL (and a human name and face). Communities are made up of humans, not of roles, titles, or shared inboxes. Ideally, you should only have to answer a question once, or even better, never, if the community can for you. When the second user encounters the same problem, they can search and get connected with the first. Better yet, by the time it's happened a third time, it's a documented problem, and a member of the community can propose an update to the documentation. This isn't hypothetical, this happens every day in open source.

In practicality, that means standing up public, linkable forums for stakeholders to ask questions and submit feedback, to engage with other another, and for you to support the community. If all that's locked away in a shared inbox, if you hold a monopoly on the ability to communicate, well, then, nobody's going to come to your party.

### 3. Minimize Friction

At GitHub, we measure workflows in terms of friction. You can define friction as the time it takes for a potential contributor to go from "I want to contribute" to "I have contributed". When contributions are on a volunteer basis, minimizing friction is essential.

Think about it this way. Lets say I find a typo in your app. I need to make what is literally a single character change. The actually change itself should take less than thirty seconds. But what do I have to do to make that change? I'll need to figure out the project dependencies and install them, bootstrap a local development environment, make my change, set up the test suite, run tests, and then figure out how to contribute my change back. That 30 seconds change just became a day long process. When friction outweighs (or is even close to) the time to do the thing I set out to do, I'm simply not going to contribute.

If a maintainer spending a few hours improving documentation and scripting common tasks, even if it only shaves a few seconds those hours the maintainer spends will be well justified in the long run, when you multiply those seconds by the hundreds of developers that may contribute across the project's lifetime, and the hundred more than would otherwise be turned away.

In practice, that means walking through the contribution flow from discovery to merge and deployment, and anticipating the potential contributor's needs at each step. How do I find the source code? Am I familiar with this language or platform? Where's the documentation? Have I seen this license before, or do I need to hire a lawyer to know if I can contribute? What are the local system requirements? How do I bootstrap those dependencies? Tests? Once I've made my change, what's the workflow for submitting an improvement? How long should I expect to wait on feedback? How long will it take to get merged so I can go work on the next thing?

A lot of that comes down to contributor-friendly documentation (read: not internal policy), but a sane workflow (e.g., merging pull requests as they come in, not in a standing meeting on the 2nd Tuesday of the month) and some simple tooling can go a long way. At GitHub we have what we call culture tools, meaning I can jump into any project and know how to set things up and submit my proposed fix without reading a single line of documentation. @parkr expanded on that idea with what he calls ["Language-Agnostic Interfaces for Software Development"](https://byparker.com/blog/2015/language-agnostic-interfaces-for-software-development/). Whatever you call it, running `script/bootstrap` is a heck of a lot easier than spending a few hours learning how some random package manager works.

### 4. Decentralize governance

* You don’t need a meeting  to merge a pull request
* You don’t need a suit  to merge a pull request
* You need to be a member of the community to participate in it
* Responding to issues and providing support
* Code review and enforcing project style
* Accepting or rejecting pull request on behalf of the project Long-term planning, roadmaps, releases

### 5. Encourage contributors

* The right to contribute is assumed  in the open source world
* It’s not in government
* Let developers know  you want contributions
* Go out of your way to encourage them
* In advance  (Document how to contribute, technical requirements, how to run the project locally in the README)
* Daily  (Provide constructive and supportive feedback, express gratitude when merging or commenting)
* Going Forward  (Automate testing with continuous integration, minimize friction through shared tooling)
