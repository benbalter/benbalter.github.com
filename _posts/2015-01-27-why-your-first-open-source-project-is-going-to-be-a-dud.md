---
title: ""
excerpt: ""
---


If you're a government agency your first opens source project is likely going to be a flop. In all fairness, [your organization has been set up](http://ben.balter.com/2014/08/03/why-isnt-all-government-software-open-source/) to fail. Participating in the open source community bares little relationship to the decade (or century) old processes your agency has established, like those required to publish a press release or respond to a FOIA request. It's not un understatement to say, Open source is an animal unlike one your agency has ever seen.

### The typical startup hockeystick

In startup land, new products are brought to market with an adoption curve that somewhat resembles a hockey stick. At first only a handful of early adopters kick the tires, things grow in at a linear rate, until a critical mass is achieved, and growth explodes exponentially, often with no end in sight. You can see this phenomenon in [the adoption of open source by government employees](https://github.com/blog/1874-government-opens-up-10k-active-government-users-on-github), but the examples are countless. Even when an established firm brings a new product (or even a feature) to market, it's done in such a way to artificially emulate this same adoption curve. You've likely seen startups launch a new product in "private beta", but it also happens behind the scenes every day in ways you likely don't know (by design), with hidden experiments phased rollouts.

Government on the other hand, almost always adopts a reverse hockey stick approach to new initiatives, technical or otherwise. Take the launch of `healthcare.gov` as an example. On day one, demand is seemingly endless, interest decays exponentially over the following months, and there's a long tail of linear decline as the application exists in perpetuity (or until replace wholesale). Embarking on a new open source project is not to dissimilar, and without a different strategy, the results are likely to be the same.

### Software that's too big to fail

When starting your first open source project, it necessarily involves lots of firsts for lots of people. For developers, it may be the first time users, especially technical users, will scrutinize their code. For project managers, it may be their first time adopting a more open, more iterative workflow. For lawyers it may be their first time advising the agency on an entire field of intelectual property law. For the security team it may be their first time participating in collaborative code reviews. And for the public affairs office, it may be their first time directly engaging the developer community, trolls and all. For your agency's first open source project to be a success a lot of one-in-a-million chances need to go right. In fact, they almost all do.

Almost without exception, up until this point, government has preferred to wait until something is absolutely perfect before it's operationalized, public policy, tank, battleship, code, or otherwise. Think about it logically: if you're writing a law, or a treaty, or building an aircraft carrier you'd better hope you got it right before others depend on it.[^hedge] Adding to the problem, government agencies are also incentivized to maximize batch size by virtue of bureaucratic process (once again, encouraging "too big too fail" initiatives). If getting one line of code into production takes six weeks of change control board reviews and getting 10,000 lines of code into production takes the same six weeks, logic dictates that batches should be maximized to minimize meta-work.

### Ship 0.1 not 1.0

The most effective way to hedge the risk of too-big-too fail software is through iteration. Lean startup. Fail fast. Validated assumptions an dall that. In the open source world, that means that when starting something new, you should :ship: version 0.1 (the minimum viable version of the thing you're trying to create), not 1.0 (what you're hoping to :ship: when you start). So long as you communicate the projects status (e.g., "it's a prototype", "it's a proof-of-concept"), the community can respond accordingly. Once you've gotten real-world, production-grade feedback, you can add additional functionality in 0.2, and eventually ship the 1.0 you originally wanted.

The irony is, government agencies often initially ship software that would be called 0.1 anyplace outside of government, but give it the self-proclaimed badge of 1.0 quality, both internally and externally. But in reality, that's not the case. Not even remotely.

### Think small, then think even smaller

Successful forays into open source begin not with large, flagship initiatives, but with small, nobody-will-notice-if-they-fail efforts. In fact, the story often starts well before a single line of code leaves the firewall. There's a lot of organizational pistons that need to fire in perfect timing for open source to work. Prime them with an open source exercise. Create a list of the best lunch spots near your office in a private repository. Or everyone's favorite chocolate cookie recipe. Whatever it is, there's immense value in forcing the organizations to go through the motions of open source on a smaller scale — procurement, security, legal, developers, public affairs — they all need to participate in the skirmish.

Start small, learn from your

[^hedge]:  I'd argue that the private sector has the same "can't afford to fail" mindset, arguably even more justifiably so (it take a lot for a government agency to go out of business), but they hedge the risk differently.
