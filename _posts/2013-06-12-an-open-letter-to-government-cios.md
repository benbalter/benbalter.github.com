---
published: 
  - true
  - "false,true"
title: An open letter to government CIOs
excerpt: "Government CIOs should seek to build systems in a lean, iterative, decentralized, and open way"
author: Ben Balter
layout: post
comments: "true"
category: Technology
tags: "government,best practices,style,howto"
---

Hey there government CIOs. I've noticed you've been getting a bit of a bad rap recently. And I have to say, with all the stories of [multi-million dollar websites](http://www.dobt.co/What-Is-The-Future-Of-Open-Government/) going around, I'm not sure that I can fault your critics. But don't get down on yourself, at least not yet. You're still in great shape. You've got ample resources; you've got smart, well-intentioned people working for you; and you've got more low-hanging fruit than most private-sector CIOs can ever dream of.

The problem's not budgetary, legal, or policy constraints, although I'm sure don't help much. The problem's more a matter of taste, really. It's a matter of style. A matter of lacking a particular finesse in execution. It's a matter of doing things right from day one. And we're here to assure you that it's really not that hard if you put your mind to it. Come to think of it, it's actually a matter of doing less, not more. You should be thinking smaller, not bigger, setting your sights lower, not higher, and away from organization-wide change in favor of quick, tangible wins that we can all share.

But hey, the good news is that you're not in it alone. We (the Internet) are here to help. We've been here before, and we're still here to tell the story. Just follow this simple Style Guide for building new systems going forward, and you'll be shipping quality code in no time:

<!-- more -->

## Lean

If there's a less heavyweight solution, and you're not using it, you've over-engineered things. Look to existing tools (think open source), services (think APIs), and practices (think shared standards). Simpler applications are easier to scale, easier to maintain, and have fewer components that can break. Prefer [JSON](http://jsonapi.org/) to [XML](http://www.codinghorror.com/blog/2008/05/xml-the-angle-bracket-tax.html), [REST](https://github.com/whitehouse/api-standards#pragmatic-rest) to [SOAP](http://en.wikipedia.org/wiki/SOAP), and [static](http://jekyllrb.com) to [dynamic](http://ben.balter.com/2012/10/01/welcome-to-the-post-cms-world/). Fear complexity.

## Iterative 

If you are not embarrassed by the first version of your product, you’ve launched [too late](http://www.businessinsider.com/the-iterate-fast-and-release-often-philosophy-of-entrepreneurship-2009-11#ixzz2U7lGAS2A). It doesn't need to be perfect or complete. Publicly ship 0.1, not 1.0. Start small and ramp up to where you want things to be. Watch how customers receive things and adapt accordingly. Be transparent, manage expectations. Let your vision evolve.

## Decentralized

Avoid single points of failure, both in systems and in people. Foster communities. Push decisions to the edge. Put your faith in the crowd. Don't bake in <a href="http://en.wikipedia.org/wiki/Lock_(computer_science)">locks</a>. Avoid blockers. Automate wherever possible. Eliminate all humans.

## Open

Barriers to the free-flow of information just add friction and more often than not, you just end up shooting yourself in the foot. Make open the default. Open standards, open formats, open systems. Expose process. Prefer social and cultural norms to technical constraints. Don't lock it down unless you absolutely have to. Trust people.

And that's about it. You'll instantly be on the path to building apps like the cool kids in the private sector. Lean, iterative, decentralized, open. Hey, the technology's the easy part. It's the culture you have to worry about.

Sincerely yours,<br />
\- The people who build the Internet
