---
author: Benjamin J. Balter
title: "Government's Release of Federally Funded Source Code: Public Domain or Open Source? Yes."
excerpt: "The question for developers isn't how should the US government best license software, but how can the open source community help it to do so"
layout: post
categories:
  - Law
  - Technology
tags:
  - .govs
  - code
  - contracting
  - copyright
  - enterprise
  - federal
  - gov 2.0
  - government
  - gpl
  - IT
  - licensing
  - open government
  - open source
  - procurement
post_format: [ ]
---

A petition was recently posted on [We The People][1] demanding [that federally funded software be released under an open source license][2]. Makes sense. The public should have access to what is technically their property.

However, [TechDirt posed the question][3] of whether it should be released under an open-source license or public domain, and I'm afraid they really missed the point.

There's no doubt in my mind that the creator of the petition was simply asking the question "I can haz source code?" Plain and simple. Put it in context: 99% of the time when an organization (or an individual) releases software to the public, they do so under the terms of an open source license. It tells users what they can and can't do, and tells contributors under what terms they can contribute. It's set's the ground rules. It's a contract with the public. It's a prenup for code.

So what's the issue? Although I generally dread the phrase, in this case, government is objectively different. Under 17 U.S.C § 105 US Government Works are not subject to domestic copyright protection. It's not technically public domain, but it's close enough. [^1] Any US citizen can use the code any way they wish. There's simply no copyright, thus no need to license. [^2] And this entire debate is a moot point if the software is a derivative work of a viral license like the GPL, the most common open source license. [^3]

That of course, only applies to code created by a US government employee, an increasingly rare occurrence. [^4] Absent permission from the contracting officer, the US government retains unlimited rights for all work created under contract (including the right to redistribute). [^5] And again a moot point if GPL derivative (and thus must be given to the Government under the GPL.)

Yet all this is very academic (not to mention dry). Waldo Jaquith and Anil Dash [made a great suggestion][9]: let's be pragmatic here. Government doesn't hold on to software because they are concerned about licensing. They hold on to software because they have better things to do, because it's not within the culture, and because there's no angry mob slamming a battering ram against the metaphorical front gates when they don't.

I don't think the nuances of federal procurement law is even close to the first thing we should care about here. [^6] The concern is about whether feds should do the leg work to open source it or not. The question for us as developers, for the thought leaders in the space, isn't how should the US government best license / not license software, but *how can the open source community help it to do so.* How can we get more software out the door? In a world of finite time, *how can we make open sourcing* [^7] *a bonafide  priority*?

How? For one, involvement in existing open source projects [^8] would surely send a strong message that there's latent demand here, and would give the foot soldiers political air cover to forge onward with their efforts. For another, taking ownership of the code itself, and realizing it is *our* code, not the government's would surely change the tone of the debate by encouraging agencies to ship code sooner, rather than delaying release out of fear of criticism.

Put simply, it's about what role we are going to play, not what rights we are going to receive. Let's at least get the source code, then we can go back to our regularly scheduled holy wars over licensing.

*As always, [views are my own][13].*

[^1]: I'd argue that all software, even government funded software should still be licensed under a traditional open source license, to resolve any legal ambiguity when used abroad under the terms of various international copyright treaties and agreements
[^2]: Although citizen-contributions to that project would theoretically not be public domain, thus necessitating a license, which should be clarified in the project's documentation at the time of release to avoid potential issues with 21 U.S.C. § 1342.
[^3]: Although again, technically speaking the project as a whole would be licensed under GPL,  individual code not dependent on the parent project could be used as a US Government Work.
[^4]: Unless you're looking at the [vibrant open source cold fusion community][17].
[^5]: FAR 52.227-14(c)(1)(i). Even if the contracting officer grants such rights, they do not take effect unless the contractor includes a copyright notice at the time of delivery, acknowledging the government's sponsorship and indicating the contract number under which it was procured. See FAR 27.404(a)(5).
[^6]: General counsels across government already have enough ammunition to stymy progress.
[^7]: Often the last and least seen step in the enterprise development process.
[^8]: There's been [exactly one pull request to date][22] across all government github repos.

 [1]: https://petitions.whitehouse.gov/
 [2]: https://petitions.whitehouse.gov/petition/maximize-public-benefit-federal-technology-sharing-government-developed-software-under-open-source/6n5ZBBwf?utm_source=wh.gov&utm_medium=shorturl&utm_campaign=shorturl
 [3]: http://www.techdirt.com/articles/20120723/12181319800/should-software-created-federal-govt-be-open-source-licensed-public-domain.shtml
 [9]: https://twitter.com/anildash/statuses/227476701599391744
 [13]: http://ben.balter.com/fine-print/
 [17]: https://github.com/languages/ColdFusion
 [22]: http://ben.balter.com/2012/04/15/cfpb-accepts-first-citizen-submitted-pull-request-on-behalf-of-federal-government/