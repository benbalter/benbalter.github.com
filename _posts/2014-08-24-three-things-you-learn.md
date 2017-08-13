---
title: Three things you learn going from the most bureaucratic organization in the world to the least
comments: true
description: Moving from the federal government, arguably the most bureaucratic organization in the history of the world, to GitHub, arguably one of the world’s least bureaucratic, I learned that there were three key organizational differences beyond mere size and the lack of TPS reports.
---

About a year and a half ago, I moved from the federal government, arguably [the most bureaucratic organization in the history of the world](http://www.washingtonpost.com/sf/national/2014/03/22/sinkhole-of-bureaucracy/), to GitHub, arguably one of [the world's least bureaucratic](http://www.fastcolabs.com/3020181/open-company/inside-githubs-super-lean-management-strategy-and-how-it-drives-innovation). Looking back, there were three key organizational differences beyond mere size and the lack of TPS reports:

### 1. Trust your coworkers

Much of my job at GitHub involves explaining open source to government employees and (hopefully) inspiring them to adopt more collaborative software-development workflows. The hard part in bridging this anachronistic divide isn't teaching version control or dependency management. Instead, it's the many cultural incongruencies between government and open source that derive from one fundamental rift: trust.

At GitHub, I trust my coworkers. I trust them to write good code, I trust them to write good tests, I trust them to review each other's pull requests, and I trust that it's gone through our standard development workflow, it's production ready, and my employer does the same. On day one I could theoretically have committed bad code, but I didn't, and technical constraints weren't what stopped me. Cultural constraints (and the threat of breaching that trust) were what did. As [Airbnb's cofounder explained on Medium](https://medium.com/@bchesky/dont-fuck-up-the-culture-597cde9ee9d4):

> The stronger the culture, the less process a company needs. When the culture is strong, you can trust everyone to do the right thing. People can be independent and autonomous. They can be entrepreneurial. In organizations... where culture is weak, you need an abundance of heavy, precise rules and processes.

Without that culture, management within government starts from a point of distrust. If an employee can do something, no matter how against their interest, the organization must assume they will, and must put in place draconian administrative and technical constraints to prevent it from happening, no matter the cost. There's simply no room to fail and adjust. All workflows are heavyweight, and the necessarily larger batch size create necessarily larger failures as the first proof point.

*Lesson one: where an organization has the choice between empowering employees to do their job and minimizing risk, large organizations err on the side of minimizing risk, which in effect, creates it.*

### 2. Optimize for happiness

GitHub's philosophy, both in terms of internal development and in terms of outward facing product is simple: optimize for (developer) happiness. If there's something *de minimis* that will make me better at my job, be it 20 minutes or 20 dollars, I'm encouraged to do it, and can do so without a three-fold paperwork burden. Just as happy cows make better milk, and in turn better cheese, happy developers build better software, and in turn, ensure more satisfied end users. Happiness is best achieved when you [push decisions to the edge](https://ben.balter.com/2013/06/12/an-open-letter-to-government-cios/#decentralized), put your faith in the crowd, avoid blockers, and automate wherever possible.

The concept of "happiness" is foreign to a government agency. Using that word in a room full of IT management elicits the same blank stare as you might expect from terms like "Node" or "Map Reduce". *Is that Rube Goldberg Machine of a change review and deployment process frustrating? Would access to a piece of (free) software make your job easier?* These aren't the questions being asked. It's "*Has this been through the FedRAMP/FISMA/PRA process?*" and "*what if the contract vehicle is protested?*".

Chances are, the process required to change the process, or to get approval for the thing you need, is more time consuming than just doing things the hard way, and management within government's CYA culture isn't necessarily there to serve as your advocate to navigate the bureaucracy and politics on your behalf. As a result, you stick with the less efficient, less enjoyable process. From a technology standpoint, you don't even have the opportunity to yak shave, even if you wanted to.

*Lesson two: where an organization has the choice between employee happiness and minimizing risk, large organizations err on the size of minimizing risk, often at the cost of efficacy.*

### 3. Relationships are assets

One thing I noticed, as early as my first day at GitHub, is that there were no gatekeepers, no organizational filters to safeguard (or bottleneck) the traditional interfaces between employees and the public. GitHubbers at all levels, whether engineers or accountants, are encouraged to speak directly to customers, to provide support, to get feedback, and to answer questions about where the product is heading. If a reporter from my hometown paper calls with questions, I'm free to answer them, whether I stick to the company's non-existent talking points or not. The press team is there to amplify me, not to silence me.

It's the underlying realization that today, the delivery of a service, be it to customers or citizens, necessarily involves the creation of a relationship. In the private sector, we acknowledge that [markets are conversations](http://www.cluetrain.com/book/95-theses.html). Established organizations no longer enjoy a monopoly on information. No matter how tightly lipped a press department may strive to be, or how calculated a marketing effort may appear, the service's true character is one customer's Tweet, blog post, or Amazon review away from being known. Organizations like GitHub embrace that reality, speak as individuals, not as a Borg-like collective, and thus become a valued part of the dialog that would otherwise be going on, with or without their consent.

Government, on the other hand, still often seeks to dredge as deep a moat as possible between those involved with a decision and the rest of the world. Government employees cannot talk to customers (we have the Paperwork Reduction Act to ensure that), and when they do, they must go out of their way to disclaim that they are speaking as a human, and not as an agency employee. Speaking to the press is even more difficult: information is channeled through a single drawbridge of failure, the press office, and requests are granted only when the Agency has a story they'd like the media to tell on their behalf. Even more difficult still, maintaining a relationship with others in the your space — to stay abreast of industry trends, seek the advice of a subject-matter expert, or to explore partnerships that may benefit the agency — are often frowned upon, if not flat-out prohibited by law. Needless to say, conversations, whether with customers, the press, or industry partners are seen as a liability, not an asset.

*Lesson three: where an organization has the choice between the free flow of information and minimizing risk, large organizations err on the size of minimizing risk, but information cannot be centrally controlled.*

### More than just size

I suspect much of this difference comes from the liberty of making decisions in the abstract. It's easy to say, "*given the opportunity, our developers are going to do something that reflects poorly on the organization*". It's a lot harder to say "*I don't trust Bob and Susan. It's just a matter of time before they mess up*", especially when you see them in the lunch room each day.

Even at GitHub, as we started growing past [Dunbar's Number](https://en.wikipedia.org/wiki/Dunbar's_number), we began to take the smallest baby step in the direction of risk-aversion. On the other hand, within government, small-batch innovation efforts like the Presidential Innovation Fellows and 18F (both website listing each employees real, human name), provide developers with much more leeway to make a calculated risk analysis, rather than blindly following government IT lore to their detriment.

Another reason may be that smaller organizations [don't respect process as an end in and of itself](http://www.fastcompany.com/1720052/googles-greatest-innovation-may-be-its-management-practice). There's no hierarchy for hierarchy's sake. Or another reason still may be the lack of a dedicated class of career managers, [proudly ignorant of their own subject matter](http://www.vox.com/2014/8/21/6053819/white-house-cybersecurity-czar-brags-about-his-lack-of-technical) and reliant on an increasing snowball of policy, rather than their own knowledge or expertise.

Whatever the reason may be, one thing is clear: while the hierarchy of the Beltway has much to learn from Silicon Valley's bottom-up, *laissez faire* approach to problem solving, so too can San Francisco startups benefit from a closer appreciation of DC's dedication to fairness of process above all else.
