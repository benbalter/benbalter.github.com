---
title: "Our code deserves better"
description: "I've seen multi-million dollar contracts in government, the final deliverable for which, is a CD-ROM, in triplicate. That's not how modern software development works, and our code deserves better."
redirect_from: "/2014/09/29/your-code-deserves-better/"
---

I've seen multi-million dollar contracts in government, the final deliverable for which, is a CD-ROM, in triplicate. That's not how modern software development works. Our government's code deserves much, much better.

### How we got here

The most commonly used arrows in the federal IT procurement quiver are CTRL-C and CTRL-V. Rightly not wanting to reinvent the wheel with each contract, the first step of most procurements is to find an analogous prior award and swap out the inapplicable terms. Need a mobile app? Take the web design contract you awarded a few months back and swap out Objective-C for PHP and uptime for cross-platform. Boom. Contract. No need to rewrite potentially shared clauses like the contractor needing to supply their own laptops or the need to establish a test environment.

The problem comes when you rewind this practice across thirty years of technology change. Where a contract once called for 5 1/4" floppies in triplicate (because what if it gets demagnetized — these things happen), it was replaced with 3 1/2" floppies, then by CD-ROMs, and today that role is filled by zip files and email. And just as before, whereas when version 1.1 came out, you'd stick the 1.0 floppies on the shelf and accept the new floppies labeled 1.1, today, the agencies receives subsequent iterations of its software via incrementally named zip files — `agency-website-v1-1.zip`. Seriously, [this is how we build the world's most technologically advanced nation](https://www.fbo.gov/index?s=opportunity&mode=form&id=7d564eb4ea5e4b763a48eb21bf5f3766&tab=core&_cview=0).

### Deliverables outside the beltway

Over those same thirty years, while contracting officers swapped out mediums word-for-word in deliverable clause of government contracts, the software industry fundamental reimagined the way it developed software, a change that isn't necessarily possible through a piecemeal adaptation of prior clauses.

Today, you'd be hard pressed to find a startup, small business, or respectable corporation that doesn't version  day-to-day changes to their software projects via a version control systems, and likewise expect their external contractors to do the same. And I suspect government contractors, for the most part, have also adopted these industry-standard best practices, as I'd be shocked if large beltway firms would be able to deliver the scale of software they deliver without some form of tracking who made what change when along the way. It'd be tantamount to a construction contractor ignoring the existence of power tools.

### When government only gets half the code

Despite this shift, when the government asks for code, it still asks for emailed zip files. The contractor simply won't get paid if they deliver the code in any other form. So government contractors take the software, maintained in a version control system, rich with context and pedigree, and simply gives the government a neutered snapshot of its current state, a tiny fraction of the work developed under the contract.

The value of version control extends beyond being able to `CTRL-Z` a given change. Modern software development tools let you drill down to a code's history, line-by-line, to see not only the code as it exists today, but how and why it got to be the way it is. It's institutional knowledge, stored and presented in its immediately useful form. It's who to ask when there's a bug, where to look for documentation, and what other parts of the codebase that particular line touches. It's context, and without it, you're setting yourself up for failure and duplicated efforts.

### Version control as a hedge against vendor lock in

It used to be that vendor lock in meant a particular format or platform. In many ways the procurement process prefers large, generalist contracting firms that supply everything from tanks and aircraft carriers to websites and mobile apps because the government knows they're going to be around in a decade (and thus can support the government's purchase).

But with open source, when done right, that threat's a moot point. Ruby is Ruby. WordPress is WordPress. Given shared frameworks, shared design patterns, and shared practices, if properly documented, swapping contractor A for contractor B becomes trivial because both are working from the same shared playbook. The secret sauce is now in their approach to difficult challenges, not in the code itself or the additional context they withhold.

### Forcing contractors to show their work

Forcing a government contractor to show their work not only gives the agency insight into the development process, which allows it to gain a better understanding of the code's strengths and weaknesses (think Carfax for code), but also ensures the contractor doesn't wrongfully hold a monopoly on the associated organizational knowledge.

If you're a government contractor, get ahead of the curve and offer the software's history in your next proposal — none of your competitors are even thinking to do it. If you're a government employee, demand the software's change log as part of your next RFP.

Version control forces knowledge transfer in a way no human-curated documentation can ever provide, and once in the agency's hands can subsequently be shared with other contractors and open source developers alike, providing a broader picture, and ensuring the government, contractors, and public are all aligned in making the code the best it can be. After all, our code deserves it.
