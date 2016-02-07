---
layout: post
title: "The technology's the easy part"
description: "Tools aren't the challenge, culture is. We should make it so ridiculously straightforward for government agencies to distribute information and build collaborative communities around shared problems that it would be criminal for them not to."
author: Ben Balter
comments: true
category: Technology
tags:
  - government
  - culture
  - version control
  - open source
  - open data
  - 'government,culture,version control,open source,open data'
published: true
categories: technology
---

After years of living at the bleeding edge of government IT, there's not been a single challenge presented that forces one to ask "is this even technologically possible?". Sure, maybe the code hasn't been written yet, but you know that once it is, it will ultimately do that thing you want it to do — the technology's the easy part.

It's the culture that we've got to worry about. Will the solution be adopted by the agency? Will existing habits subvert the cool thing you just made? Will the dream live on once you're at your next gig? If you ignore culture, even the most elegant of technological solutions can be relegated to a dusty shelf as nothing more than the right solution to the wrong problem.

## This is why we can't have nice things

Great technologies already exist. Lots of them in fact. Yet public servants still insist on adopting and subsequently entrenching their inferior predecessors. There's a reason that heavyweight, proprietary systems are a sad running joke in the Beltway.[^1] After all, the iPhone's been around since 2007. The problem isn't developing newer, better, flashier tools or tools that are more open or more intellectually elegant. The problem is creating the culture and the ecosystem necessary to begin appreciating and sustaining the ones we've already got — the ones we're already not using.

We're geeks. We're good at building things. Heck, it's fun, and it's what we do best. But it's time to realize that we're merely playing whack-a-mole with a system that doesn't want our help. We keep building increasingly larger mallets thinking that if it were just *that much easier* to knock the mole back down, maybe we'll hit that tipping point and it'll finally stay there. Spoiler alert: it never will.

<!-- more -->

## Dat Elegant solution

There was a [recent exchange on the Twitters](https://twitter.com/dan_munz/status/351065902642503681) with some members of the open government community whom I respect greatly about [a recent proposal](https://github.com/maxogden/dat/blob/master/README.md) that I'm afraid is a bit ahead of its time. The need for a distributed version control system to handle real time and large-scale government data would be a great problem to have. It'd be great because it'd mean that the supply side was already there and demanding it. Unfortunately, it's not, at least not yet, and no amount of [OT](http://en.wikipedia.org/wiki/Operational_transformation) can overcome the challenges we current face:

I watch day in and day out as many of my former colleagues fight tooth-and-nail trying to convince well-meaning government bureaucrats to toss a scrap of government data over the firewall. It's a tiring process. After all, whack-a-mole is, by definition, a losing game. But the answer's not Yet Another Mallet, nor is it to give up and build our own mole management solution. We should be making it dumb-simple to do the right thing. We should be building really, really boring stuff. The more boring the better. In many cases, we probably shouldn't be building anything at all. This is one of them.

## A culture that's criminal

The problem isn't that government agencies want to share vast swaths of public data, or that they want to share it with increasing frequency, or to the point, that they lack the tools to do so properly. In fact, it's the exact opposite. It's that sharing data is seen as being too onerous. It's too taxing. It forces me to learn something new. It diverts funding from mission. It's a political liability. Foundationally, it goes against the organizational culture. And frankly, [we're not helping](http://ben.balter.com/2013/05/14/we-ve-been-selling-open-source-wrong/).

We should be co-opting proven tools already in the hands of public servants and making it so ridiculously straightforward for government agencies to distribute information and build collaborative communities around shared problems that it would be criminal for them not to. To break the bad habits. To get rid of the excuses. To educate. To inform. To inspire. To get the mole on our side, rather than continuing to fight it.

## Baby steps

Complex, bleeding edge tools aren't the solution to making government more open. Even our [flagship efforts](http://healthcare.gov) expose that well-established solutions are unfortunately light years ahead of the anachronism that is DC and simply serve to baffle those the government trusts to implement them.[^2] Instead, it's about baby steps. It's about starting with a small real-world proof of concept at each agency, heck, maybe even each bureau, and gradually showing those individuals that may not even realize it, that they are, in fact, empowered to fundamentally reimagine the relationship between citizens and government.

Creating a culture of collaboration around government data is great, but let's start small. Let's start with what we know already works. Let's get agencies to begin committing CSVs and geoJSON to GitHub and other proven collaboration platforms, rather than merely uploading them to a unidirectional data portal or condemning the data to some proprietary and inaccessible format. Let's wean bureaucrats off of Word Documents and PDFs. Let's get them drafting in markdown and publishing in HTML. Let's help to make the entire pipeline open from the start. To break the addiction to closed systems.

## Data as code

We need to systematically and strategically demonstrate to government the value proposition inherent in the promise of open source and subsequently build the tools that transition them to realize it. To train government employees to begin to treat data like the rest of us treat code. To make them want to open up the data because there's a demonstrated community ready and waiting to nurture it. To upgrade the cultural technology on both sides of the firewall.

We're going to need a smarter way to process real-time and large-scale government data eventually. There's no doubt in my mind. But we're not there yet. And we're not going to be any time soon unless we can unteach public servants the bad, closed-solution lessons that have already been ingrained in the organizational culture. The technology's the easy part. When we need it, there's no doubt we can build it. The question is whether, we'll be building it hand-in-hand with an enthusiastic body of government technologists, or if it'll just be the most technologically advance whack-a-mole mallet that we've built to date.

[^1]: *See, e.g.,* SharePoint, Cold Fusion, PDFs, Oracle databases, Blackberrys, and just about "enterprise" anything.

[^2]: *E.g.,* [not knowing the difference between Ruby and Rails](https://github.com/CMSgov/HealthCare.gov-Open-Source-Release#ruby-on-rails){: data-proofer-ignore="true"}.
