---
title: Open source as Yelp for software
description: Open source has become somewhat of a Yelp for software, and with it, has the potential to shift the balance of power from software publishers to software consumers.
---

Open source has become somewhat of a Yelp for software, and with it, open source has the potential to shift the balance of power from software publishers to software consumers. So why do we hold the software that our society increasingly depends on to a standard lesser than that to which we hold fast food?

### The allegory of the lost carry out order

A few weeks ago, I was in a restaurant when they lost a guest's carry-out order. As the customer stormed away hungry, the host turned to me and remarked, "*that sucks, now he's going to leave a bad Yelp review.*" This interaction struck me as odd. The host didn't seem too concerned about upsetting the customer, but was instead deeply worried about what the internet might think.

In *ye olde* days before Yelp, restaurants basically had city food inspectors' opinion to care about. Sure, some of the fancier restaurants might get a visit from a food critic, but the long tail of restaurants did not, and even if they did, after the initial review, there's a long window where the risk of a return visit from a food critic is highly unlikely. Not to mention, while high-end restaurants downtown face steep competition, I suspect your neighborhood Italian or Chinese place does not feel the same pressure. As a result, restaurants were incentivized to care about the tangible. *Is the kitchen clean? Is the menu diverse enough? Are the prices right for the market?*

Yelp shifted that equation, by creating an incentive for restaurants to focus on the intangible (and beyond the bare minimum). All of a sudden it became *was the hostess welcoming enough to that guest? Is our staff properly trained? Can our kitchen get food out quickly?* In a pre-Yelp world, individuals' poor experiences weren't enough to motivate action in many markets, especially those with few repeat customers. One customer might be able to influence two, maybe three people, at most. If they're an extremely vocal connector, maybe ten potential customers? In a post-Yelp world, that same, single scorned customer can cause someone they've never met to continue walking right to the place next door instead. In this sense, crowdsourced-reviews shift the balance of power from service provider to service consumer, creating an incentive for more than mere box checking. The shift in power applies equally to both soft tacos and soft wares.

### The internet empowers consumers

Whether a restaurant, a software project, or an open data effort, public, consumer-moderated discussion forums do three things:

1. **Amplify single voices** - Traditionally, there's been a power imbalance, when it comes to the ability to communicate with customers. The restaurant has a monopoly, as by definition, all customers must go to them to get the service. Customers traditionally had no means of reaching other customers *en masse*, short of picketing outside. Online forums change that, making a single voice as loud as, and in many cases, louder than the service provider. Readers know that the service provider has an incentive to paint themselves in the best light. The reviewer has no such incentive to demonize the service, and thus readers take that peer perspective into account when weighing the veracity of conflicting claims.

2. **Make private knowledge public** - Restaurants have enjoyed a similar monopoly when it comes to information. By definition, they know everything about themselves. *Is the bread fresh or frozen? Does the soup come from a can? Is the pasta cooked in chicken broth? Is the signature dish over priced?* This type of insider information often comes from being a regular. Today, online forums create somewhat of a hive-mind consumer, allowing otherwise private knowledge to become public, and empowering each consumer to be a first-time regular.

3. **Connect seemingly isolated experiences** - Service providers similarly enjoy an advantaged perspective. By virtue of being the service provider, they see and interact with each customer. Customers, by and large only see themselves, and maybe those in their immediate proximity. It's easy to write off a sub-par waiter as having an off night, or being an isolated experience, but online forums let consumers share those poor experience, exposing patterns and trends. Where a consumer might see a single bad waiter, the crowd can see chronic poor service and a pattern of inadequate training.

### Waiter, there's a bug in my software

What if all software had public review forums like most restaurants do today? This is true of just about all open source software, and the same consumer-empowering trends could hold true. When it serves as a consumer-moderated discussion forum, open source has several implications for the software consumer:

* **Perception** - Perception begins to play a role, and becomes a very visible metric to measure the project's success. Are there 100 open issues, all without a single comment? Are users posting frustrated comments due to their lack of attention? Do bug reports start "I love this app, but..."?

* **Follow up** - That perception metric creates a disincentive for software publishers to ignore or minimize consumers' complaints. If you email support@company.com, they can ignore your email, and there's not much you can do about it. Worse yet, you have no way to know if they got 100 emails that day with the same request. When that conversation happens in the open, the publisher is all but forced to acknowledge the request for fear of appearing unsympathetic to user needs.

* **Customer experience** - From that forced feedback mechanism flows a desire to optimize not for top-down requirements documents, but solving actual customer needs. Software consumers have a direct line and a formal say in the software publishers efforts, and customer-centric features and bug fixes often become prioritized as a result.

* **Quality** - Most measures of a software project's quality are either number of outstanding bugs, or how well it solves the problem it sets out to solve. While no software is perfect, open source projects are used by more people in more use cases, and thus bugs are more quickly surfaced and squashed. Combined with better feedback channels and prioritization of user-centric features, open source projects are better set up to not only contain fewer bugs, but to better solve for users actual needs, rather than what software publishers perceive them to be.

### Government's transparency imperative

Even if you find flaws in the argument that private-sector software should have public discussion forums, one class of software—government software—could benefit disproportionately from being more transparent.

Unlike, say, Coke or Pepsi, government organizations have an obligation to be transparent. For one, the software is taxpayer-funded, and thus taxpayers have a right to the software they paid for, and to have a say in its direction. Additionally, as software and algorithms are increasingly relied on by government to regulate industries and deliver citizens services, software transparency becomes a means for citizens to check the government's work.

Today, I suspect that a significant percentage of government software isn't closed source for security reasons, but rather because closed source is a cushy default, and at this point, it's easy to sweep imperfect code (because all code is imperfect) under the rug, rather than potentially be embarrassed by accurate (but critical) feedback. If we give government agencies the choice, they will always chose less public scrutiny.

### Why do government agencies get off easier than Taco Bell?

So why then, do we hold government agencies to a lesser standard than we hold fast food restaraunts? If I go to Taco Bell, a private sector company for which there are plenty of competitors, and they deliver dissatisfactory service, I have a megaphone in the form of an online forum (and often their immediate attention as a result). If I go to renew my passport or get a new social security number, services only the government provides, I have no such recourse. There are no K-street lobbyists who advocate for better user experience, or special interest groups who run ads in support of shorter wait times at the DMV.

What if every government website was required, at least in part, to be open source? Start with an empty repository where citizens can open issues and share experiences,[^clarify] and evolve to a world in which we can truly account for the services we charge our elected officials with implementing. This it becomes easier for citizens to help government agencies deliver the services they deliver than it is for a customer to help a restaurant improve the food they serve.

When you think of open source as Yelp for software, open source suddenly becomes a means of creating more user-centric solutions, rather than a wonky means of producing more philosophically pure code.

- - -

[^clarify]: Of course, much of the feedback might be technical in nature. Anyone can say a burger tastes bad, or that a restaurant is unclean. When it comes to software, there's a perception that the only technical contributors are developers. That's not true. Similarly anyone can report unexpected behavior or a sub-par user experience. When it comes to software development, often times, the actual development is the easy part. All the hard technical challenge have already been solved. Today the challenge comes from understanding user needs, identifying points of friction, and in providing more than the bare minimum, user-centric functionality.
