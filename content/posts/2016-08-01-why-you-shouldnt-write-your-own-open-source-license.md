---
title: Why you shouldn't write your own open source license
description: Unless absolutely required, avoid custom, modified, or non-standard open
  source licenses, which will serve as a barrier to downstream use of your code.
date: '2016-08-01'
---

The power and potential of open source comes not from the fact that code is published for others to see, or that you won't get sued for publishing it, but from the fact that others have the ability to use your code, to modify it, and to improve it. That possibility breaks down, however, when would-be contributors have the legal right to contribute, but not the practical means to do so.

At their core, open source licenses are legal contracts between code contributors and code consumers. In exchange for me waiving my right to sue you if something goes wrong, you grant me the right to use and modify your code. The difference between open source licenses, and other intellectual property grants, like say, an author's license to a book publisher, however, is that open source licenses are heavily standardized, with about a dozen mainstream licenses and three primary licenses representing the vast majority of open source projects. This contract standardization creates important non-legal externalities.

## A right isn't a right unless you know you can use it

The standardization of open source licenses is not a matter of convenience or group think. The MIT license isn't popular because it has a great marketing campaign. For open source to work, downstream users must be able to use the code you publish. When small businesses and individual developers need to hire a highly specialized (and costly) law firm to know just what they can and can't do with your code, regardless of what the license says, those rights are rarely going to be exercised, and thus often don't exist, at least not practically.

Developers and small business are generally familiar with the most common open source licenses, and even when those downstream users don't recognize the exact license flavor of variation, there are countless free or low-cost resources to help them do so. In this sense, standardized open source licenses serve as a three or four letter proxy for those with and without formal legal training to know exactly what they can and can't do with your code (and how those project's terms interact with other projects' terms) and thus can use software licensed under standard terms freely and with little administrative overhead.

This is true not only of the projects they use directly, but of those project's downstream dependencies as well. Whereas a mainstream project might have a dozen dependencies (and be a dependency of a dozen more) in practicality, those dependencies are likely governed by two or three unique licenses, with their compatibility with one another well understood. When one dependency introduces a bespoke license, that complexity resonates and compounds upstream (and thus is much less likely to be used).

## Why government agencies and enterprises feel the need to create their own license

Open source software licensing is rarely taught in law school. Even if it's taught in some schools today, the types of general counsels that are involved in software licensing decisions likely graduated ten, twenty, or thirty+ years ago when it definitely wasn't taught, are experts in administrative law, not intellectual property law, and in all likelihood, don't have enough expose to the open-source community to appreciate its history and context. Given that lens, it's not a totally unexpected reaction for in-house lawyers to look upon existing open source licenses — something their client downloaded off the internet, mind you, and presented for review — incredulously and say "that's not quite right, we should do X instead".

At the same time, in house counsels' primary goal is historically to minimize the organization's expose to legal risk. Absent a strong counterbalance (read: you), this often creates legal frameworks that are optimized for the publishing organization legal posturing, not for the code's widespread adoption or the diversity of its contributor base. As long as your organization operates in the open market, it's impossible to eliminate risk. Seek the guidance of [your organization's immune system](https://ben.balter.com/2014/03/21/want-to-innovate-in-government-focus-on-culture/#bureaucracy-is-an-organism), but ultimately you must decide the acceptable level of risk to take on given the countervailing business necessity (or mission imperative as we say in GovSpeak).

Finally, every large organization I've ever worked with or at suffers from some degree of *special snowflake syndrome*, meaning, they see themselves as an exception to just about every established rule. Bureaucracy is bureaucracy, regardless of size or sector. Other organizations face the same constraints your organization is facing, and were able to overcome them in favor of adopting open source best practices. In the public sector the White House, GSA, and DoD all use standard open source licenses, and in the private sector successful companies, large and small — Microsoft, IBM, Facebook, Apple, Google — do the same every day.

## Open source is nothing without adoption

If you needed a contract to procure a piece of software, I wouldn't suggest you Google "software contract" and use the first result without modification. Each transaction is different, and that boilerplate agreement likely wouldn't reflect the deal being struck. This is a fundamentally different type of transaction than that of open source. When you're buying software from a major vendor, that's a one-off agreement between two sophisticated parties, and given the amount of money on the table, there's enough at stake to justify the necessary legal costs.

When I make the case that open source publishers shouldn't create their own license, it's not a legal argument. Undoubtedly, developers have the legal right to license their code under any terms they'd like (or choose not to license their code entirely). In fact, you'd be hard-pressed to make a *legal* argument for why you shouldn't create your own open source license. My argument against bespoke licensing is one of practicality, public policy, and your own self-interest.

Open source is nothing without adoption. The reason you publish your code isn't to show others that you wrote it, but with the hope that they'll use it, they'll improve it, and that they'll contribute it back. If you make it easy for you to publish the code (the easy part), but hard for others to contribute (the hard part), they never will. Unlike the one-to-one software purchase, open source is a many-to-many relationship between contributors and users, and there's a good chance at least one party to the contract won't participate if you've created an arrangement that all but ensures that they don't have the legal resources necessary to do so.

## Who should bear the cost of open source?

From a public policy standpoint, let's assume for a second that there's always going to be some complexity inherent in open source, that all open source licenses share some legal ambiguity. Who should bear the burden of that complexity? I'd argue that open source should be optimized for code consumers, not for code publishers. There are three reasons for this:

First, when you're talking about code published by large organizations — those organizations who might consider a custom license — code consumers are almost undoubtedly going to be less sophisticated. You could push the complexity on to code consumers, who would then have to go out and hire outside counsel before they could use your code, but those publishers sophisticated enough to need their own license generally have in house lawyers that could absorb the complexity of a standardized license at little to no economic cost.

Second, even if code consumers are sophisticated enough to perform their own legal analysis, incurring such costs may make your open source project more expensive then its proprietary alternative, further reducing adoption among institutional consumers. Not to mention, it's far more efficient for the code publisher to preform that legal review once, and make a determination of risk, then for each downstream consumer to perform that same legal review anew and for each project it's incorporated within.

Finally, if we assume the value of open source comes not just from downstream use, but also from upstream contribution, non-standard open source licenses cause downstream consumers to incur a very real economic cost before they can consider contributing improvements upstream. As a developer, why would I contribute to your project if I have to pay to do so? Why shouldn't the project maintainer absorb the economic cost of my (otherwise-free) contribution to their project?

Institutional code publishers should absorb the complexity of open source on behalf of their potential code consumers and code contributors. Institutional publishers are better equipped to do so, and in doing so, incentive others to use their code and contribute back — activity for which they gain a tangible benefit and the very activity the system should be optimized for.

## Optimize for the code's reuse, not its publication

Unless absolutely required, avoid custom, modified, or non-standard open source licenses, which will serve as a barrier to downstream use of your code, the reason, I suspect, you're getting involved with open source in the first place. The open-source community is just that, a community, and one with a strong tradition. Your one-off license is the newcomer here, and one that will likely face an unnecessary challenge in terms of adoption. While legally it's well within your rights to create a purpose-specific license, open source software is published so that others may use it, not so that you can publish it, and doing so under a legal framework alien to the community is the easiest way to make sure it's not used.

*For additional context, see [Everything a government attorney needs to know about open source software licensing](https://ben.balter.com/2014/10/08/open-source-licensing-for-government-attorneys/).*
