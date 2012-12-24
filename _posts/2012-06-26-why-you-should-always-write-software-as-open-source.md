---
author: Benjamin J. Balter
title: "Why You Should Always Write Software as Open Source, Even When It's Never Going to Be"
excerpt: |
  When you are the only person that's ever going to see something, you're a lot more likely to "just make it work. Therefore write open source
layout: post
categories:
  - Business
  - Technology
tags:
  - .govs
  - agile
  - code
  - contracting
  - development
  - enterprise
  - gov 2.0
  - government
  - IT
  - open source
  - procurement
  - proprietary
post_format: [ ]
---
[![Unsatisfied with your Contractor?](http://ben.balter.com/wp-content/uploads/2012/06/mike-holmes-203x300.jpeg){.alignright}][1]

There are two kinds of software: cludgy software and open source. Think about it logically. When you (or your organization) is the only person that's ever going to see something, you're a lot more likely to "just make it work." After all, who would ever know? [^1]

But the same logic that applies to sweeping literal dirt under the rug doesn't apply to writing code. Whereas a rug will always serve to cover the floor, applications evolve over time and code is often constantly reused and repurposed as customers' needs change. Simply put, it's impossible to predict today where your code is going to be a year from now and it's in your best interest to plan accordingly.

Open source hedges this risk by distinguishing generic logic (say posting content online) from application-specific customization (say the use-case-specific presentation of that content). Yet when you're writing with the intention of producing proprietary or one-off code, you do everything in one pass. The true challenge arises when the same problem emerges again in another department, another business unit, or more generally in an even slightly different context. You're reinventing the wheel. You're "open sourcing" (even if within your organization). The solution? Always assume your software is going to be open source, even if you know it's never going to be, and here's why:

**Flexible from the start** - Imagine you building a house and the contractor literally nails down all your furniture at the onset, saying you could always remove it before you sell. You'd almost certainly hire a new contractor. Even if you're never going to sell the house, you may want to get a new couch, or at the very least change a room's layout somewhere down the line. Yet software developers do it all the time. We custom build solutions, and then go back and abstract logic to "open source" it as needed. You're doubling the effort. Keep logic separate from implementation-specific customization, and you'll have a shared, portable solution from day one. Put another way, your business unit is no way special or unique. The same logic that presents updates about the latest line of widgets to your customers can also be used to update the same customer base about cogs and you should prepare for that potential synergy from day one, even if not immediately realized.

**Modular by design **- Distinguishing unrelated components encourages several coding best practices. In addition to introducing a modular design, meaning additional components could easily be added (or existing components removed) down the line, abstraction often yields objectively more stable and more readably maintainable code due to the abhorrence of the copy-and-paste effect. Put another way, you're forced to build elegant solutions — the fact that others are not only going to see, but have to be able to use and adapt your code forces you to follow best-practices like name spacing, abstraction, and object oriented programming.

**A message to your future self** – Ever go back and look at old code, [only to scratch your head][3] as to what's going on? The same you that may be asking yourself what you were thinking when you got a tattoo five years back, is also going to be asking why you wrote that singleton function five years ago. Yet when you write open source, you mitigate that risk by explaining your code in such a way that others (including your future self) can understand it. In a world of system orientated architectures and ever-changing requirements, the chance that a software project is one-and-done is increasingly rare, not to mention the fact that by failing to properly document, you're introducing a significant risk of vendor lock in. Your successor will thank you, and so will the person paying the bills.

The reality of today's business environment is that all software is inherently "open source", even if the scope of the sharing is limited to an organization. Assume the software is open, needs to be modular, and will be repurposed, and you will save significant costs in the long run. And when you require the same of outside contractors, you get better, more flexible code, and offset the risks of vendor or technology lock in in the long run.

Justice Brandeis is famous for noting that "sunlight is the best disinfectant." Likewise, the transparency afforded by the open-source ethos produces [more reliable software][4] –  so why not simply assume your code is going to be open source from the start?

[^1]: The same would apply when you're buying software and the contractor is under the impression no one outside the organization will ever see the code, and more importantly, the code could never negatively impact the public's perception of their overall work-product

 [1]: http://ben.balter.com/wp-content/uploads/2012/06/mike-holmes.jpeg
 [2]: "The same would apply when you're buying software and the contractor is under the impression no one outside the organization will ever see the code, and more importantly, the code could never negatively impact the public's perception of their overall work-product"
 [3]: https://twitter.com/BenBalter/status/209356982983999488
 [4]: http://www.coverity.com/library/pdf/coverity-scan-2011-open-source-integrity-report.pdf