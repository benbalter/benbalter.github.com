---
title: Why your probably shouldn't add a CLA to your open source project
description:
---

Contributor license agreements or CLAs for short have gained a lot of visibility in recent years as many prominent open source projects have opted to use them. If all the cool kids are doing it, should you? Probably not. Here's why:


### What is a CLA?

First, if you're new to concepts like copyright, patents, and licensing, this post on [everything an open source maintainer might need to know about open source licensing](https://ben.balter.com/2017/11/28/everything-an-open-source-maintainer-might-need-to-know-about-open-source-licensing/) may provide some helpful background.

In short, you can think of a CLA as somewhat of a "reverse open source license". Whereas open source licenses are a copyright grant for users to use the project, a contributor license agreement, at its core, is the right for the project to incorporate a contributor's code. Contributors may also be required to attest that they have the right to submit the code, or the CLA may include an explicit patent grant. Some CLAs go so far as to actually assign the developers copyright to the project.

Unlike licenses, however, contributor license agreements, or CLAs, are not standardized, meaning if you're a contributor, you'll have to read each CLA to determine what legal rights you're giving away, before contributing (and hope you can parse what's often dense legalese if you're not a lawyer).

### Why projects adopt a CLA

CLAs are generally a form of CYA, to prevent maintainers (or the project) from landing in hot water due to the community contributions it accepts. They are an extremely effective way to reduce a maintainer's exposure to intellectual property liability, especially if that maintainer is a for-profit business. Specifically, it makes ownership of the project's intellectual property explicit.

Think about it this way: the role of an attorney, especially a transactional attorney, is to minimize legal risk. For the vast majority of intellectual property transfers in the business world, that means lots of corporate paper and due diligence. When one company buys another company's software, be it a procurement or an acquisition, it often involves lengthy negotiations resulting in contracts with tens or hundreds of pages to ensure both parties exchange exactly what they intended to transfer, no more, no less.

Contrast that with open source licensing, which often caries equal legal weight, but almost exclusively without the legal safeguards. With that "traditional" baseline in mind, it's natural then, for corporate counsels to suggest the company take steps to "paper" the transaction. But as mentioned earlier, legal's role is to advise business owners how to minimize risk, not how best to run an open source project, and such steps must be balanced against business motivations and the likelihood that the harm might occur.

### CLAs create a contribution-hostile developer experience

I spend a lot of my day helping open source maintainers to [grow healthy and vibrant communities around their project](https://ben.balter.com/2017/11/10/twelve-tips-for-growing-communities-around-your-open-source-project/). If one of the most common reasons to open source a project is to seek contributions from others, why would a project maintainer add significant [friction](https://ben.balter.com/2013/08/11/friction/) to advancing one of their primary goals? CLAs require that the first interaction between an open source project and a potential contributor to involve a formal and complex legal agreement that requiring them signing away their legal rights.

Most open source developers aren't lawyers, and they shouldn't have to be. If a project is optimizing for the developer experience in hopes of maximizing contributions, it would be antithetical to require a contributor to higher outside counsel to properly evaluate what they're agreeing to, or in many cases, also get the sign off from their employer's corporate counsel before they could contribute, a frustrating experience that can shift even the smallest contributions from minutes to weeks, assuming the developer ultimately gets approval, a outcome that's not guaranteed in many corporate cultures.

Imagine the "give a penny, take a penny" dish at your local convenience store. It's a win-win for customers and the business by facilitating faster cash transactions. It works because dropping a penny in the dish is a near-frictionless experience. Now imagine instead, the corporate counsel walks by seeing this and says "Woah, woah, woah! We don't know where that money's from or if they even intend to donate it!" All of a sudden, customers must now sign and date a short two page contract before can drop a penny in the dish. Even though the risk that a bank robber is going to make a v-line for chips and leave a stack of freshly stolen $100 dollar bills is extremely small, you've also made the likelihoosd that a customer will leave a penny almost as unlikely.

### CLAs require significant administrative overhead

As stated earlier, CLAs are legal contracts contributors agree to prior to contributing to a project, intended to minimize maintainer (often corporate maintainer) intellectual property risk. How then, does a project know when a contributor has "signed" the CLA?

Like many things in the legal world, in the world of digital contract formation, there's similarly a spectrum of options, depending on how much risk the maintainer is willing to accept that a contributor might later claim they never agreed to the CLA. It's a matter of how "signed" you want the CLA to be. At one end of the spectrum, it might be a link to the CLA with some sort of "by submitting you agree..." disclaimer ("browserwrap") or an explicit "I agree to the CLA" checkbox that enables the submit button. At the other extreme might be the requirement that developers print the CLA and submit a physical "wet" signature before they can contribute. Most projects that have adopted CLAs land someplace in the middle, treating electronic signatures as sufficient, but even electronic signatures create lots of administrative overhead, both for the contributor and for the maintainer.

For the contributor,

For the maintainer,


### CLAs shifts legal blame to the party least equipped to defend against it



*  CLAs simply shift legal blame for any patent infringement, copyright infringement, or other bad acts from the project (or its legal entity) back onto its contributors.

### If a license isn't good enough for maintainers, you shouldn't subject users to it



*  If the project is unwilling to accept (inbound) contribution of code under the terms of the license it chose, that's a clear indication that the project's (outbound) license has serious deficiencies that require immediate remedy.
* * "nice assurances we'd like to have — all things being equal” and focus on the “what legal assurances our FLOSS project actually needs to assure its thrives”.

https://julien.ponge.org/blog/in-defense-of-contributor-license-agreements/

> Requiring a contributor license agreement is a sign that you intend to sustain your project in the long run with responsible practices regarding intellectual property management. Responsible open source developers aren’t afraid of signing contributor license agreements: they simply understand the legal implications of sharing source code with the rest of the world.


http://ebb.org/bkuhn/blog/2014/06/09/do-not-need-cla.html
