---
title: Open source, not just software anymore
layout: post
comments: true
excerpt: "What we've been calling open source, may in fact be something else, especially when we start to use those workflows to collaborate on things beyond code."
---

Open source is collaborative, or at least, I thought it was. What modern hackers have been calling open source, may in fact be something else, especially when we start to use those workflows to collaborate on things beyond just computer code.

## Open source as a philosophy

> @benbalter The internet has noticed that you tried to define "open source"

Not an email that you receive every day. As part of an effort to lower the barrier for getting started GitHub, we published [a glossary of common GitHub jargon](https://help.github.com/articles/github-glossary#open-source), which included the term "open source". We defined it as:

> Open source refers to a philosophy of collaboration whereby others (publicly, or within an organization) are encouraged to fork, modify, discuss, and contribute to an ongoing project. Open source software refers to software with source code that has been made available to others.

For me, that's always been what open source is. It's a collaborative model, not a set of freedoms or political philosophy, and when you describe open source to non-developers, you don't lead off by talking about the right to fork or copyright assignment. Apparently, however, such a viewpoint is [the minority](https://twitter.com/kfogel/status/386259984817717248).

## Open source as permissionless modification

[Karl Fogel](http://www.red-bean.com/kfogel/), who *literally* wrote [the book](http://producingoss.com/) on producing open source software, and whom I admire greatly, corrected, in a series of emails, that since its inception, open source had always been about the right to modify, not the right to contribute.

> Open source refers to material (often software) released under terms that allow it to be freely shared, used, and modified by anyone. Open source projects often, though not always, also have a highly collaborative development process and are receptive to contributions of code, documentation, discussion, etc from anyone who shows competent interest.

That struck me as odd for a few reasons. Granted, I have a somewhat skewed viewpoint, but it exposes an important edge case. Especially in government, we see the source code for an application being made available, but with no intention of (or often mechanism for) the agency to accept community contributions, an arrangement that many today would not traditionally label a truly open source effort (although it is).

## Open source in a less license-centric world

I've only known a world where open source has already won. When I think open source, I don't think "*is this thing licensed under a Open Source Initiative blessed license?*" Today there are increasingly fewer debates over [the freedoms one receives with software](https://www.gnu.org/philosophy/free-sw.html), and more over seeing it released in the first place, or once released, over exposing process. Developers today could [care less what the license is](http://opensource.com/law/13/2/post-open-source-software-licensing) or if non-free software is [an instrument of unjust power](https://www.gnu.org/philosophy/free-software-even-more-important.html). We just want to hack on cool things and we know doing things in the open is the best way to do it. Open source has won, and not for political or philosophical reasons.

There are a lot of reasons for that deemphasis. For one, technology has made it easier to work together than alone, and in turn, has shaped what it means to be open source. As Karl noted:

> Pretty much all open source activity (whether software or otherwise) happens online... if it's not online, it's hard for it to be effectively open source, practically speaking.

But among the biggest reasons for this shift, I'd argue, is that unlike when the open source movement was originally taking shape, today, there is no "source" and "binary" distribution to drive a wedge of imbalance. With web-centric, high-level languages like Ruby, Node, and PHP, it's really hard to distribute the software in such a way that you don't have everything you need to modify it, at least not in terms of code.

## Open source <del>software</del>

Today, the idea of open source as it is seen outside of software is much more than just rights to "source code". What happens when there is no source versus binary? What does open source data look like? Open source content? Open source law? What happens when there is no OSI-approved license, because the thing I'm sharing simply isn't code. In [trying to distinguish open source from open source *software*](http://haacked.com/archive/2012/02/16/open-source-and-open-source-software-are-not-the-same.aspx/), I argued:

> Open source is more than just publishing. Seeing how the sausage is made is necessary but not sufficient. Discussions in the open, ability to fork and modify, pull requests... collaboration is a key.

Think about it in this context: I'm a government agency, and I publish a plain-text blog. Is that open source? As a government work, you have the right to use, fork, and modify the "open source" content as you see fit. Same with government data in the form of a spreadsheet. The "source" in both cases... what's necessary to rebuild the final intrinsically valuable thing from scratch is not the compiled letters or figures that are published, but exposing the underlying process through which that final product can be recreated (not to mention being the canonical place where the content is published).

So long as the publisher doesn't provide a mechanism to receive those improvements, or if there's a sufficient imbalance of information between those publishing and those contributing, that thing, be it code, text, or data, is simply published. It's not really open. In software I'd call that "disclosed source". In government, we call that publishing a PDF or simply throwing data over the firewall, but the one thing I would not have called that is open source. But that's exactly what it is.

## Open source behind the firewall

The way I'd been using open source differed from the traditional definition in a second distinct way: scope. For me, open source wasn't absolute.

> Open source ≠ public. A project can be open source, even if not *everyone* has access to the code. You can open source within your organization, within your team, with your friends, so long as the philosophy is there.

At GitHub, we like to think of GitHub.com as working like an open source project. We use GitHub to build it, anyone in the company can see the source code, open an issue, or submit a pull request. In all senses of the word it's open source, except not everyone has access to the code.

That begs the question: What percentage of the world needs to have access to something before we can call it open source? 90%? 51%? What if I print out the source code and make it available via snail mail to anyone who asks? What if I don't tell anyone that that's an option? What if I send the source to ten friends, and then leave a copy on a flash drive at the south pole? The list goes on. Rights are nothing without workflow.

## The case for open collaboration

>  There is no such thing as "government-only" or "academic-only" or "within-our-company-only" open source

I think that's true. At least, the idea of someone calling something "government-only open source" scares me. But what do we call the millions of developers that adopt open source workflows for their closed-source software? For non-software collaboration? How do we divorce ourselves from a rights-centric viewpoint and the holy wars that go with it (I'm looking at you GPL)? What do you call something that's developed in the open with community involvement that may or may not be software?

Dropping "software" from "open source software" isn't enough. Open source (software) since its inception, has always been about an external supply of freedom — the promise (or threat) that I am granted sufficient rights by the project creator and can, at any time, fork the project and go my own way — and it should stay that way.

Perhaps what we need is a new word that better describes what we're really doing? @haacked went through the same existential crisis and [landed somewhere near *crowd sourced*](http://haacked.com/archive/2012/02/22/spirit-of-open-source.aspx/), but for me, that implies a hub and spoke model with a highly centralized power structure, not the egalitarian web we often think of open source to be. Perhaps what I've been calling "open source" about all along is not really open source, but is in fact "open collaboration".

Open source (software) is a thing we make. Open collaboration is how we make it.

*For a much more in depth discussion with @kfogel, @haacked, and @afeld, see [benbalter/benbalter.github.com/pull/98](https://github.com/benbalter/benbalter.github.com/pull/98).*
