---
author: Benjamin J. Balter
title: "What's Missing from CFPB's Awesome New Source Code Policy"
excerpt:
layout: post
categories:
  - Law
  - Technology
tags:
  - .govs
  - cfpb
  - code
  - contracting
  - copyright
  - enterprise
  - fcc
  - federal
  - github
  - gov 2.0
  - government
  - IT
  - open government
  - open source
  - procurement
  - source code policy
post_format: [ ]
---

![CFPB Logo][1]{.alignright}

Most often, when we talk about open source in government, it's talked about in one of two ways: either it's [the pitfalls of the federal IT procurement model][2] that can't seem to comprehend a world in which open-source is an option, much less potentially a superior choice (["acquisition as a roadblock][3]"), or it's reiterating the same open-source talking points that haven't seemed to give open source much parity with the wall of organizational inertia proprietary software seems to have gained over the years ("[open source as an alternative][4]").

The [Consumer Financial Protection Bureau][5] (CFPB), however, is in a unique position. As the newest kid on the block, it's one of the few government agencies to have been born in a digital era, and more importantly, without the bureaucratic baggage that all too often stymies innovation. They have a chance to "do it right" from the start… and they're doing just that.

**An Agency Born of the Internet Generation**

Yesterday, CFPB [announced a bureau-wide preference for open source][6] in its shiny new [Source Code Policy][6], by my [crude research][7], a first for any government agency. There are two watershed shifts here: first, that the agency not only should, but *must* evaluate open source software on equal footing to its proprietary counterparts, a comparison which I believe will [increasingly fall in open source's favor][8], and second, that unless there's an overriding security or similar concern *not to*, public code must be public. There's nothing new here. All it says is that we should use the best software for the job (a no-brainier), and that that software, the public's property, should belong to the public.

So why is this news? Plenty of government entities have [released][9] [source][10] [code][11], or [encouraged the][12][ use of open][13]-[source software][14]. But no one has come out and [plainly stated that they were an "open-source agency"][15], that open source is the new default, and that absent an affirmative step by some nay-sayer, that the public will have access to their code.That's huge. It's flipping the burden, and it's the way things should be from the start.

**But Where's the Beef?**

That said, there's one thing the source code policy is noticeably silent on: *the ecosystem*. Posting code is great and it's great that they've done the legal legwork so other agencies can follow suit, but that's just the 1.0. The true power of open source comes not from simply publishing code, but from being a member of a broader coding community. Can a CFPB employee contribute a patch to an existing open source project on CFPB time? [^1] What about contributing to a CFPB project once he or she's left? What happens to my rights when I fork a [CFPB project on GitHub][17] and send the agency a pull request? [^2] Can the agency even accept my code legally? [^3] There's a lot of legal ambiguity there, and it's just the kind of legal ambiguity a well-intentioned government attorney can seize upon to gum up the very gears that are driving this incredible move.

We've seen the same progression in the open data world. The 1.0 is posting 10 XML files at a gigabyte each — an arms-length relationship with developers — arguably open data simply for open data's sake. The secret sauce lies in the relationship, in publishing APIs and web services rather than static data, to build an ecosystem around the agency's work.

**An Innovation Ecosystem**

Imagine if government agencies served as the catalyst for a [joint public-private effort to drive tomorrow's innovation][20]. We saw this during the space race, and see it today in terms of government-funded research, but by-and-large, open-source coders have yet to be included. Sure we've seen the "let's have some open-source developers build this for us for free" type challenges, but that's about it. There's no ecosystem, no community, no push-pull or give-and-take, and I'm worried that as CFPB's efforts federate across government, this nuance may not federate along with it.

The agency's already got [it's first public-generated code contribution][21], and can expect at least one more on [their gist of the policy][22] (Ed. note: does CFPB not *own* a Blue Book?!), but the possibility of such a relationship with the citizenry doesn't seem contemplated by the policy, let alone included as integrally as it should.

I'd love to see the next iteration of the policy have a third section, "III. Membership in the Open-Source Community" on not just publishing code they've developed in house — don't get me wrong, that's huge — but actually *contributing *meaningful code to the broader ecosystem, and working directly with the open-source community to foster an active partnership that delivers the best citizen services possible. It's a dialog, not a code dump. There needs to be a conversation there.

**Procure, Publish, Participate.**

It's the realization that when you use open-source software, you're not a customer. You're a member of a community. You're invited to a pot-luck dinner. There's not the same sense of entitlement you have with proprietary software. It's not that they owe you a given feature. There's no financial transaction there. It's that that feature hasn't been developed yet, but can be, the same way every other feature has evolved, through community contributions. There's an entirely different philosophy driving the relationship.

For open source in government to work, it's got to move beyond procuring community contributed open-source projects on the one hand, and releasing open-source code developed in house distinctly on the other. It's about feeling a sense of belonging. It's about the agency taking on a sense of ownership in the broader project. It's about participation. [^4]

I think CFPB gets it in a big way, and the fact that this is memorialized in writing is a major step in the right direction. They've got the basic mechanics down — procure open–source projects, publish open-source code — but the missing secret sauce that would really drive the policy home? Participate in the open-source community as a matter of policy.

+1 CFPB, +1. *Welcome to the community.*

[^1]: In simple terms, the core of open-source projects (as distinct from community-contributed plugins or modules) are primarily fueled by "patches" (small code change sets) in response to bugs or feature requests, that get committed to the project's codebase and released in subsequent versions. 
[^2]: If the project is licensed as government work, are my code contributions now government work? Are the government employee lines of code under a broader license, while mine are under a more restrictive license like GPL or apache? 
[^3]: Is this considered a donation for Federal ethics purposes thus requiring disclosure? 
[^4]: This can manifest itself in lots of different ways, but most tangibly: going to local meetups and conferences (or hosting them); contributing to the project's core by introducing new features, documentation, or posting to support forums; abstracting business logic from the start to be more broadly applicable to other developers; outreach and evangelism; and fostering relationships with key stakeholders within the community

 [1]: http://www.treasury.gov/press-center/news/PublishingImages/CFPB.jpg "CFPB Logo"
 [2]: http://ben.balter.com/2011/11/29/towards-a-more-agile-government/
 [3]: http://radar.oreilly.com/2011/09/open-source-government-it-goscon.html
 [4]: http://benbalter.github.com/open-source-alternatives/
 [5]: http://cfpb.gov
 [6]: http://www.consumerfinance.gov/developers/sourcecodepolicy/
 [7]: http://www.google.com/search?sugexp=chrome,mod=4&sourceid=chrome&ie=UTF-8&q=source+code+policy+site%3A.gov
 [8]: http://www.amazon.com/The-Wealth-Networks-Production-ebook/dp/B0015GWX0S
 [9]: http://www.fcc.gov/blog/contributing-code-back-fcc-govs-open-source-feedback-loop
 [10]: http://www.whitehouse.gov/blog/2011/02/11/whitehousegov-releases-second-set-open-source-code
 [11]: http://open.nasa.gov
 [12]: https://update.cabinetoffice.gov.uk/resource-library/open-source-procurement-toolkit
 [13]: http://www.finance.gov.au/e-government/infrastructure/docs/AGuidetoOpenSourceSoftware.pdf
 [14]: http://www.tekno.dk/pdf/projekter/p03_opensource_paper_english.pdf
 [15]: https://twitter.com/#!/victorzapanta/status/189390759181557760
 [16]: #note-2020-1 "In simple terms, the core of open-source projects (as distinct from community-contributed plugins or modules) are primarily fueled by "patches" (small code change sets) in response to bugs or feature requests, that get committed to the project's codebase and released in subsequent versions."
 [17]: http://github.com/cfpb
 [18]: #note-2020-2 "If the project is licensed as government work, are my code contributions now government work? Are the government employee lines of code under a broader license, while mine are under a more restrictive license like GPL or apache?"
 [19]: #note-2020-3 "Is this considered a donation for Federal ethics purposes thus requiring disclosure?"
 [20]: http://ben.balter.com/2012/03/05/wordpress-for-government-and-enterprise/#p[NssBlW]
 [21]: https://github.com/cfpb/transit_subsidy/pull/1
 [22]: https://gist.github.com/2343578
 [23]: #note-2020-4 "This can manifest itself in lots of different ways, but most tangibly: going to local meetups and conferences (or hosting them); contributing to the project's core by introducing new features, documentation, or posting to support forums; abstracting business logic from the start to be more broadly applicable to other developers; outreach and evangelism; and fostering relationships with key stakeholders within the community"