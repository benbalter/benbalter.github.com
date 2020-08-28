---
title: N Trust and Safety features to build into your product before someone gets hurt
description:
---

This week, my colleague @katmeister chronicled [her recent experience with online harassment](https://www.tinykat.cafe/on-all-that-fuckery). Kat's post is well worth reading if you want to better understand how people (most of whom don't look like me) experience the internet daily, but one line in particular stood out to me:

> it's always an "edge case" until someone's personal safety is threatened.

When I joined GitHub's Community and Safety team back in 2016, I distinctly remember a conversation I had with one of the team's then engineers as I was onboarding. We were discussing a potential user safety feature, and ever the vigilant Product Manager, I crunched the numbers to see how prevalent the problem was. Instances where the feature would likely be useful was in the range of single digits to hundreds of users. On a platform with 30 million developers at the time, if an issue affected less than a thousand users, I'd rarely prioritize it, in favor of the team focusing on more impactful work. I quickly wrote off the problem as an "[edge case](https://en.wikipedia.org/wiki/Edge_case)". I was quickly corrected.

The go-to heuristic in bug triage is to favor high-visibility bugs. To this day, I will often still decry a feature [if it serves less than 80% of users](https://ben.balter.com/2016/03/08/optimizing-for-power-users-and-edge-cases/). But abuse vectors are fundamentally different from bugs or feature requests in that "number of people affected" doesn't properly capture the risk it presents to both your customers and your business (or in the case of Kat, your employees). Unlike a bug that breaks an experience or a feature that enables new ones, a single exploitation of a single abuse vector can have profound real-world affects on its target.

At best, abuse and harassment is disruptive and diminishes the user experience, which is why it might be tempting to treat abuse like you would a bug, technical debt, or feature request, but when you start talking about [doxing](https://en.wikipedia.org/wiki/Doxing), stalking, and [swatting](https://en.wikipedia.org/wiki/Swatting), it quickly goes from affecting mental health and wellbeing to threatening physical safety. I, for one, wouldn't want a platform I build to be used as a vehicle to harm others, even in a single instance, but it goes beyond "doing the right thing". In the near term, users who have (or observe others having) bad experiences stop using your product[^1], and in the long term, as an unattended community turns toxic, [it directly affects the business's value](https://www.businessinsider.com/disney-ceo-bob-iger-abandons-twitter-deal-over-abuse-problem-2019-9).

As I've transitioned from Trust and Safety to product Security, I'm starting to see just how differently we treat product security from user safety. If you knew of a security vulnerability in your product, you wouldn't deprioritize it because it had only been exploited "a few" times. Ideally, you'd remediate it before it's used even once, and in the event you weren't able to do so, almost without question, it becomes a p0 priority as soon as you discover the first instance of it's exploitation. So why would we protect our user's data with better care than we'd seek to protect the user themselves?

There are a number of incentive-based and ___ reasons for that, but if you're building a product and to take ab use and harassment seriously _before_ someone gets hurt, here are N trust and safety features to build into your product early on:

### Spam and suspension
Blocking or muting
Internal education, consulting, and shared services
Per-content reporting
Moderation tools
Staff moderation
Community moderation
CoC
Capture, expose, and retain relevant info
CSAM

Looking at this list, it may be easy to ask why, if GitHub implemented these features, why Kat's experience was still possible. The reality is that Trust and Safety is an adversarial space, and it requires a baseline of ongoing investment to stay one step ahead of those who wish to do harm to others. Just as your product will never be 100% secure, your platform will never be 100% safe, but ____ in both humans and engineering efforts 

[^1]: A [study by the Anti-Defamation League] found that 1 in 3 Americans, and half of those 18-29 years old experience severe online harassment. 38% withdrew from the platform after the experience. GitHub's [open source survey](https://github.com/github/open-source-survey), found that 20% of users who experienced _or witnessed_ negative interactions stopped contributing as a result.