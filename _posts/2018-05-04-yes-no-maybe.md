---
title: Yes, No, Maybe
description: When responding to customer feature requests your answer should be in the form of "we're doing that", "we're not doing that", or "we might do that".
---

I've been a Product Manager at GitHub for a number of years now, but recently, @gnawhleinad and @nayafia introduced me to a framework for responding to feature requests that has changed how I talk about upcoming features (both internally and externally) and that I'd like to share here (in slightly modified form). As misleadingly simple as it sounds, I call it "Yes, No, Maybe". It looks a little something like this:

* **Yes** - We have committed to implement it in the next three months
* **No** - We have no plans to implement it in the foreseeable future
* **Maybe** - We might implement it down the road, but either need more information or plan to, but can't commit to it right now

When it comes to feature development, I've always been a fan of "under promise, over deliver". The worst place you can find yourself as a Product Manager is promising something to stakeholders (again, internal or external) that you're unable to deliver, especially if they rely on you for it.

While customers shouldn't make purchase decisions based on [forward-looking statements](https://en.wikipedia.org/wiki/Forward-looking_statement), customers nonetheless take comfort in better understanding a product's direction, your vision, and what they might be able to expect down the line. At GitHub, we often run into this in the form of "are you going to build that, or should we?"-type questions from customers, for example. At the same time, most sufficiently sophisticated engineering organizations either formally think about Product work in terms of quarters, or have a rough idea of their product roadmap that extends at least three months out.

Those two factors combined lead to three possible answers when responding to feature requests:

### Yes - "we're doing that"

This three month mark creates a good bright-line where it's safe to say "yes" we're doing that (or are going to soon). Often projects are in flight at this point (or planned and committed to), and even if the exact ship date is unknown, it's likely the project will eventually ship in one form or another. At this point, you should have high confidence that you can say "yes" without risking that you may violate the customer's expectations down the line. "Yes" is a verbal contract between you and the customer that you will do the thing you say you'll do.

For those features not on a team's short-term roadmap, you have two choices:

### No - "we're not doing that"

If it's something that doesn't make sense for your product strategically, the answer is simple: "No" or "we're not planning on building that in the foreseeable future", more verbosely (ideally with the reason why). While [there are many reason to say "yes"](https://blog.intercom.com/product-strategy-means-saying-no/), and "no" is often the harder choice to convey to customers, if you truly have no plans to implement the feature "no" gives the customer the opportunity to pursue other ways to fix the problem (workflow, policy, tooling, etc.), and shows them that you're being honest and transparent about your product vision and direction, even if the news is unpopular in the short-term.

### Maybe - "we might do that"

If it's something you'd like to do but haven't yet committed to (e.g., 4+ months out), or something that might make strategic sense but you haven't yet looked into, you give the best answer you can: "maybe". I like to always follow up "maybe" with as much context as I can provide, e.g., explaining that it's on our medium or long-term roadmap, but that you can't yet commit to it, or explaining that it's a great idea that you should (genuinely) look into (with a promise to get back to them when you do). Maybe isn't a cop out, but a commitment to follow up with either "yes" or "no" once a decision's been made.

[As with code](http://tom.preston-werner.com/2011/11/22/open-source-everything.html), I strive to be transparent about upcoming features (and general product direction), unless there's an overriding business or practical concern not to (after all [markets are conversations](https://ben.balter.com/2014/08/24/three-things-you-learn/#3-relationships-are-assets)). Think of "yes, no, maybe" like a "green, red, yellow" stoplight indicating the status of your efforts, and in the inverse, the customer's need to pursue a workaround (or alternative) to the problem they face.

It sounds simple written out, but if you start from this point, when responding to feature requests, your answer should almost always be in the form of "we're doing that", "we're not doing that", or "we might do that", and thus should ensure you consistently meet, or ideally exceed customer expectations when it comes to upcoming features.
