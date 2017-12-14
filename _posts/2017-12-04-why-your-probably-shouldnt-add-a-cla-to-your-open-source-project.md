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

### 

*  CLAs simply shift legal blame for any patent infringement, copyright infringement, or other bad acts from the project (or its legal entity) back onto its contributors.
* CLA-assent records requires massive administrative overhead.
* CLAs require the first interaction between a FLOSS project and a new contributor to involve a complex legal negotiation and a formal legal agreement.
* "nice assurances we'd like to have — all things being equal” and focus on the “what legal assurances our FLOSS project actually needs to assure its thrives”.
*  If the project is unwilling to accept (inbound) contribution of code under the terms of the license it chose, that's a clear indication that the project's (outbound) license has serious deficiencies that require immediate remedy.
