---
title: Everything an open source maintainer might need to know about open source licensing
description: There's lots of internet lore around open source licensing. As an attorney
  and an open source developer, here's my answers to common open source licensing
  questions.
date: '2017-11-28'
---

Without an open source license, open source is just published code. Open source licenses are what allow users to use your software, and more importantly, to modifying it (and hopefully propose improvements).

There's lots of internet lore around open source licensing. As an attorney and an open source developer, I've answered many questions over the years about open source licensing, and figured [it was time to give my answers a URL](https://ben.balter.com/2015/11/12/why-urls/), in hopes that they might help other maintainers.

## Copyright versus the right to use

As soon as a developer writes a line of code, they automatically possess certain rights.[^1] Think about it logically: if you write a line of code, you naturally have the right to use it, to modify it, and to distribute it to others. This is called the code's copyright, and you would be the copyright holder.

Keep in mind, however, copyright is distinct from the right to use the code. While you may retain the copyright, you might also grant others some or all of those automatic rights by stating your intent to do so in a license. Think of this somewhat like a lease for real property. Your building owner still owns the building, but you have the right to live there. What rights you grant is up to you. For example, if you write closed source code, you may grant users the right to use it (but not modify or redistribute it), and if you write open source code you may grant the right to use or modify it. In either case, you still retain both rights.

When a developer licenses their code under an open source license, they are granting downstream users one or more rights, but in most cases, copyright doesn't transfer. The same is true for when a contributor submits a contribution to your project. Absent an agreement to the contrary, the developer retains the copyright, but grants (to the world), the right to use, modify, distribute, and sublicense the software.

Put another way, in most cases, code "ownership" doesn't change hands. As a user, when I download an open source project, one developer may hold the copyright in one line, another developer may technically hold the copyright in another, but as long as both developers granted me the same rights to use the code (via the open source license), I don't really care.

## What an open source license does

An open source license is a contract between the person who writes code (often a developer, but potentially a designer, translator, etc.), and any person who uses it. It's a contract just like your apartment lease or cell phone contract, except that the contract language is standardized into about [a dozen mainstream](https://ben.balter.com/2014/10/08/open-source-licensing-for-government-attorneys/) and [three primary](http://choosealicense.com/) licenses like the MIT, Apache, and GPL licenses (named after the organizations or open source projects that originally wrote and used them).

While the wording and specific terms may vary from license to license, most licenses include the following three things:

* It gives users the right to use, modify, and (re)distribute the software
* A promise from users not to sue the developer if the software doesn't work as intended
* The requirement that the author's name, the license, or both be included if distributed

Additionally, some licenses may also include:

* The requirement that any contributions to the project be licensed under the same license
* The right for users to use any patented technology contained in the software (see [below](#patents))
* The requirement that any changes to the software be described when distributed
* Different requirements depending on whether the software is distributed in its human-readable or machine-readable form

## Copyleft and the GPL

All open source licenses use copyright law to make the software more widely available. Some licenses, notably the "GPL" family of licenses, also use copyright law to ensure the software *remains* available, a practice known creatively as "copyleft".

While there's some nuance that's beyond this post, in short, any software based on copyleft-licensed software must be licensed under the same, or a similar (compatible) license, if distributed. For code to be copyleft, two things must happen:

1. The code depends on copyleft code, such as a Drupal theme or a WordPress plugin (a "derivative work" in copyright terms, but the species depend on the license and often how the two bodies of code are wired up)
2. The code is distributed. Modifying it for your own use is often okay, but in some cases, putting it in a for-sale closed-source project, or using it in an internet-based service may be considered distribution.

While there are many philosophical and political reasons in support of copyleft software, you must be especially careful when using copyleft code within a project, especially in a for-profit business (and consider that added burden when licensing your own code, depending on how you want it to be used).

## Contributor License Agreements

In addition an open source license, many large, often-corporate-backed projects also use a second type of legal contract called a Contributor License Agreement. Unlike licenses, contributor license agreements, or CLAss, are not standardized, meaning if you're a contributor, you'll have to read each CLA to determine what legal rights you're giving away, before contributing (and hope you can parse what's often dense legalese if you're not a lawyer).

Whereas open source licenses can be thought of as the copyright grant for users to use the project, a contributor license agreement, at its core, is the right for the project to incorporate a contributor's code. While absent a CLA, most contributions are assumed to be under the terms of the project's license, for high-risk projects or risk-averse maintainers, a CLA makes that understanding explicit. Contributors may also be required to attest that they have the right to submit the code, or the CLA may include an explicit patent grant (see [below](#patents)). Some CLAss go so far as to actually assign the developers copyright to the project. Regardless of the specific clauses, CLAss are generally a form of CYA, to prevent maintainers (or the project) from landing in hot water due to the community contributions it accepts.

Unless your employer tells you that you need one, most open source projects will not need a CLA, and even then, I'd push back against your corporate counsel a bit, especially [if your project is on GitHub](#copyright-on-github). CLAss add significant friction to the developer experience and can make it so that a one-line change can take weeks (and countless internal emails) to merge. Learning software development and open source is hard enough. You shouldn't need a law degree (or favor owed from your general counsel's office) on top of that.

## Copyright on GitHub

If a project is on GitHub, in addition the open source license (if any), there's a second legal document at play, GitHub's Terms of Service. Specifically, GitHub recently updated its terms of service to [explicitly include the otherwise-assumed `inbound=outbound` rule](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license), meaning that by submitting a pull request on GitHub, contributors agree to contribute under that code under the same license as your project (making a CLA unnecessary in most cases).

Additionally, even if your project doesn't have a license, just by posting your code on GitHub, you grant certain rights to other users such as the right to view the code, or to fork it. Logically, you also give GitHub the right to display your code, if the repository's public. That said, if you want others to use your code, you should really [add an open source license](https://help.github.com/articles/adding-a-license-to-a-repository/#including-an-open-source-license-in-your-repository).

## Patents

For most projects, you won't have to worry about patents. If you create an open source project that's already been implemented in another language, or something that isn't technically novel and non-obvious (for example, a sidebar widget, a small helper library, etc.), chances are it's not [patentable](https://en.wikipedia.org/wiki/Patentability).

Patents are a distinct legal right from copyright, but unlike copyright, you don't get one just for creating a thing. Think of patented software as inventing an entirely new technology (like the first site to have an online "shopping cart"). The idea being, that the government wants to reward inventors who create new things, by granting them the exclusive right to use that technology for a certain period of time. As an inventor, you may want to register your invention, to secure that right, and as a developer, you'll want to ensure your code does not infringe on a patent.

In my mind, the vast majority of open source projects tackle easy technical, but hard human, user experience, or implementation problems. Pagination, for example, is a solved technical problem, but the value of an open source pagination project like [`will_paginate`](https://github.com/mislav/will_paginate) comes in the API, integration with other frameworks, flexibility, and so on All things that are not, at least on their face, novel, or patentable.

If you've made something that's *not* technically trivial to implement, you should probably talk to a lawyer (who in addition helping you conduct a patent search, might recommend a Patent-aware license like Apache over a simpler license like MIT). If you're in the vast majority of left-pad- or Rails-addon-type projects, you're probably fine, at least in terms of patent concerns.

## Copyright in a distinct legal entity

Some more mature projects opt to form a distinct legal entity to hold the project's copyright, often in the form of a non-profit, such as the WordPress foundation. In the case of WordPress, for example, copyright in the WordPress logo is owned by the foundation, meaning if I go to Café Press and print WordPress t-shirts to sell on the street for my own personal gain, WordPress can sue me.

The same is true of code. If copyright is distributed among hundreds or thousands of developers and a conflict arises, the project may have to secure additional legal rights from hundreds or thousands of people across multiple countries, languages, and jurisdictions. In the case of WordPress, [copyleft-licensed software](#copyleft-and-the-gpl), if I create and sell WordPress-Pro, and don't make the code available to users, the WordPress foundation may rightfully sue me (although it may be practically difficult for them to do so).

Many CLAss, in addition the explicit copyright grant also include either a *transfer* of copyright (meaning the foundation owns the code and the developer forfeits all rights), or some form of limited power of attorney, meaning the foundation can sue on the developers behalf to enforce their copyright. Because of this, CLAss are almost exclusively associated with project's maintained by distinct legal entities (rather than an individual or small group of developers).

Whether you're willing to forfeit legal rights just to contribute to an open source project is a personal decision that you'll have to make, and if you're drafting or evaluating a CLA for use within your own project (despite my warning), hopefully you have sophisticated enough legal counsel to walk you through the various trade-offs and alternatives.

## When in doubt, follow the money

The number one lesson I learned in law school was to always follow the money. For the vast majority of open source projects, if you add the MIT or Apache licenses, you will never have to think about copyright or patents and can focus on writing amazing software.

The reason being, if you're a college student and infringe on a corporation's intellectual property, they may send you a harshly worded cease-and-desist letter, or DMCA notice, and tell you to take down your project, but it's unlikely that they'll sue you, as it'll cost them more in legal fees than they'll likely recover (since college students generally have few assets to their name). Not to mention, the negative PR of going after an aspiring developer would cost them more in good will than they would have likely incurred from the infringement as a function of lost profit, if any. That's not to say you should ignore copyright and patents entirely, but unlike say, those scary pre-VHS-playback FBI warnings, if a mistake is made in good faith, and you respond reasonably, it's unlikely you'll be thrown in jail.

That said, if you're writing software for a major corporation or a promising startup, you may want to be more risk averse, as the copyright holder (you or your employer) has substantially more to their name (and substantially more for a potential legal adversary to gain, creating an incentive to sue). Not to mention, as a potential competitor, the law does not look favorably upon infringement, the very scenario intellectual property is intended to prevent.

## See also

If you found this post helpful, there are two other resources you may be interested in reading:

* An overview of the best way to handle [copyright notices for open source projects](https://ben.balter.com/2015/06/03/copyright-notices-for-websites-and-open-source-projects/) in for example, Licenses or the readme, and
* A similar overview of [open source licensing geared towards government attorneys](https://ben.balter.com/2014/10/08/open-source-licensing-for-government-attorneys/)

## That said…

Be sure to read the [fine print](https://ben.balter.com/fine-print/), both here and elsewhere. Each situation is different. I've provided a high-level, highly simplified, highly generalized overview here for which I'm sure there are countless "well actually"s. If you are making a decision that affects your legal rights, you should really consult a licensed attorney in your state. I don't know the specifics of your particular situation, and am not in a position to provide you with legal advice. `</disclaimer>`

We've done a lot at GitHub to ensure you don't need to be or hire a lawyer just to participate in the open-source community, but we're not there yet. I hope the above overview can help to answer some common questions, but if there's a general open source legal question I didn't answer, [please ask](https://github.com/benbalter/feedback).

[^1]: In some cases, under what's called the [work for hire doctrine](https://en.wikipedia.org/wiki/Work_for_hire), the developer's employer may be the copyright holder. This is true both of work done by a full-time employee, and often of a contractor given a specific task (unless otherwise specified). There's also [some nuances when it comes to government-created code](https://ben.balter.com/2014/10/08/open-source-licensing-for-government-attorneys/#publishing-open-source-software).
