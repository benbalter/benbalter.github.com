---
title: "Why isn't all government software open source?"
excerpt: "Why is taxpayer funded code — integral to the day-to-day working of our democracy — so often hidden from the public view?"
---

The federal government is the single largest purchaser of code in the world. So why is this code — taxpayer-funded and integral to the day-to-day working of our democracy — so often hidden from public view? There's two sides to the question: Why does the government so often build on closed source platforms, and once built, why isn't the code released to the public?

## Using open source

It's a lot easier to contribute to open source when you're building on an open source platform. While it's possible to open source a VBA script, you'd likely have more momentum and receive a warmer reception from a platform with a more vibrant online community like Ruby or Python. Yet more often than not, the default in government is to look to "enterprise-grade", proprietary platforms from the onset, which send the government on a closed-source trajectory.

### The demands for "enterprise" solutions

There's a good deal of FUD — fear, uncertainty, and doubt — in government CIO shops that open source is less secure, buggy, or more costly, and that you'll be in for a lifetime of pain if you don't invest in a real "enterprise solution". For one, if an agency writes a check to a software vendor, they know what they're getting. The contract spells out features, upgrade schedules, and allocates liability in the event that something goes wrong. More importantly, the vendor provides a phone number that the agency can call if they need help. "Post in the support forums and someone will reply" can be a scary proposition for a CIO.

### There are fewer suits behind open source

Before that transaction even occurs, the closed-source platform likely has a flashy marketing page and a cadre of federal salespeople calling up the agency and tabling at conferences, things open source platforms traditionally don't do, save Red Hat and a few others. And when the CIOs office asks for "enterprise" features like audit trails or meeting certain compliance requirements, you can bet that the closed-source solution will make sure they make it into the next release cycle.

### Closed source contractors

Last, these closed source platforms are what government contractors know, because it's what's taught in computer science programs, and what they've always been asked to supply. If an experienced development firm has a bunch of ColdFusion developers, when they bid on a contract, they're going to recomend that the thing be built in cold fusion. All this means is that before the first line of code is ever written, the odds are stacked against that code from ever making it past the firewall.

But even if the agency's using a closed-source platform, there's no reason their custom code can't still be [open sourced](https://github.com/trending?l=cfm&since=monthly).

## Contributing to open source

With the exception of [18F](https://18f.gsa.gov), [CFPB](http://cfpb.github.io), and a few others, government doesn't actually write a single line of code. The agency traditionally plays the role of a non-techincal program manager, speccing out the functional requirements, and selecting a contractor to deliver the end functionality. The points of contact at the agency overseeing the contract are rarely engaged with the open source community, let alone, passionate about open source. As a result, open source traditionally isn't even part of the conversation. Why would it be?

### Closed source workflows

In terms of the actual software development mechanics, the contract likely calls for a throw-it-over-the-fence workflow, where the agency doesn't even see the code until it's already in production, if at all — a long way from open source. Even if asked, the contractors may not be familiar with more modern, open source workflows, or with participating in the open source community, creating a bad experience for all involved and further chilling open source involvement across government.

### Reinventing the wheel as a business model

I also suspect that federal contractors have a disincentive to open source their work, considering that technical requirements likely don't vary much from agency to agency. A FOIA request is a FOIA request and a press release is a press release, regardless of if it's on FAA or FDA letterhead. Open sourcing these solutions the first time around could potentially decrease the demand for that same code being written a second time at the taxpayer's expense.

### A culture of "no"

Once built, it takes humans to bring that code to the escape velocity necessary to overcome the agency's guarded inertia. Security is going to likely say no. Legal is going to likely say no. You'll have to get the code hosting platform approved. You'll have to procure an ongoing maintenance contract to review pull requests. You'll have to create a developer engagement policy for how you accept them. In a world of competing priorities, government employees will likely choose to move on to the next citizen-facing project, rather than spend potentially months combating the bureaucracy's immune system to change.

### Clash of cultures

Even if the agency manages to open source the code, the open source community follows a set of norms vastly different than the rigid hierarchy of government. Government agencies don't always know how best to engage the open source community, or how to integrate an open-source workflow within their own command-and-control culture. Supporting an open source community takes time, something government employees are traditionally short on. And when the agency doesn't follow the open source community's unspoken norms, the naysayer's worst fears become a self-fullfilling prophesy.

### Feedback as a liability

Open sourcing code exposes the agency to the potential for criticism from millions of highly-technical, critical eyes, with little perceived upside from the agency's perspective. The non-technical agency team may not have the ability to evaluate the craftsmanship of the code internally, and it's often preferable to sweep things under the rug, rather than potentially air their dirty laundry to some of the internet's most skilled trolls.

The benefits of open sourcing code that advocates espouse are often not realized if the code is so purpose built so as to render it unusable outside of government, thus attracting no outside contributors, or if the project is poorly managed, so as to scare contributors away. Meanwhile, unreleased source code poses absolutely zero liability, in today's political climate. Which one would you choose?

## What needs to change

To flip the default, three things needs to change:

* First, government employees need to be empowered with a better understanding of and appreciation for the virtues of open source. Those agencies who have open sourced code due so because of individual cheerleaders spearheading the charge. Successful projects are scoped from day one with the intention of being open source. Initiatives like 18F and the PIF program can seek to inspire and educate the next generation of open source advocates within government.

* Second, even when the agency doesn't explicitly call for it, as subject matter experts, government contractors have a duty to explore open source alternatives and to educate the market as to modern industry standard development practices. Any casual observer can see the direction the market's heading, and the smart firms have an opportunity to get infront of it. Create internal competencies around today's hottest technologies and grow government demand for this newly emerging market. Make it more practical for government to do the right thing, rather than the thing it's always done.

* Last, the open source community needs to step up its game, both in terms of what it offers — moving past the perception that open source is written by hobbyists — and the reception government code receives — so that it's perceived as an asset, not a liability. On the supply side, there's a tremendous business model in being the suits behind any one of the internet's most popular open source projects — Automattic, GitHub, and Redhat being a few examples — combating the FUD and providing "enterpise" support. On the demand side, the community needs to make it a liability *not* to release code ("what are you hiding?"), and make the agency's return on investment clear, by breaking down the us/them mentality, and supporting, not criticizing, government efforts to learn open source.

Why isn't all government software open source? Because you've got an entire value chain designed to produce closed source software, a system at equalibrium, with few incentives to rethink itself.

Technology has made collaborating in the open easier in recent years, and as a result, the open source ecosystem has exploded. Yet, like all technology, government is still a few years behind mainstream adopters.

Hopefully, with your help, that can change.
