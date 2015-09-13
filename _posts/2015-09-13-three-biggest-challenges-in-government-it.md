---
title: The three biggest challenges in government IT
excerpt:
---

It's often said that government IT is 5-10 years behind the private sector, and most places in government you look, that's probably true. It's as if the government learned how to computer right around the time Windows XP was released, set its comfort level for risk, and has maintained purposeful blinders to progress since. But why? I'd argue there are three key factors keeping it there: change aversion, lack of technocratic leadership, and heavyweight processes bred by distrust.

### Change aversion

If there's one thing that defines government IT, it's [the culture of "no"](http://blog.dobt.co/2015/02/24/culture-of-no/). If your a change agent, a technologist, heck, even someone that wants to use an iPhone instead of your government-mandated Blackberry, at every potential turn, [the organizational immune system](http://ben.balter.com/2014/03/21/want-to-innovate-in-government-focus-on-culture/#bureaucracy-is-an-organism) will release risk-reducing antibodies any time it so much as sniffs something it doesn't recognize.

This risk-reducing antibodies come in the form of process: it's the procurement process designed to ensure only established firms are qualified to bid. It's the ATO process designed to ensure only applications that complete a six-month, 150-page security checklist can be brought online. It's the hiring process that disqualifies applicants without a traditional education. The process is designed to reduce risk, but almost without exception, it serves to increase it. This happens in three ways:

First, process increases batch size, meaning any effort becomes an all-or-nothing wager. That's why we see the enterprise-wide sweeping initiatives, the multi-million, multi-year projects that are all but guaranteed to fail. If standing up one server and one hundred servers both require the same amount of administrative friction, you're incentivized to maximize your return by betting the farm. Imagine a game of poker where the ante was ten times the minimum bet. You'd be crazy not to go all in each hand (and extremely lucky if you walked away with any money).

Second, as non-technocratic management is socialized to a system whereby change only happens in decade-long increments, the agency grows further and further out of band with the private sector. Industry standards are just that. Standards. They change as technology changes. If you every few years you poke your head up, look around, and adopt whatever's mainstream wholesale, you spend the vast majority of your time using already-outdated technologies and construct your perception of the IT landscape acordingly.

Finally, even you can convince the powers that be to pilot a new technology, there's no support structure in place, all but guaranteeing new initiatives will fail (further supporting the "go big or go home" mentality). Want to stand up a ColdFusion server? The agency has ten spare in its datacenter and a IDIQ contract to support going forward. Have a Rails app you'd like hosted? Once you convince IT that Rails isn't a threat to national security, you'll need to spend a significant amount of time explaining what a Rails console is, how migrations work, and what modern deployment management looks like (hint: it doesn't involve SSH and a shell script).

Government should be risk averse. Take a look at brutalist DC architecture and you'll quickly realize that government builds buildings very differently than the rest of society, Corinthian columns and all. After all, government operates on multi-century scale where companies focus on a quarter-to-quarter earnings. While government agencies certainly shouldn't adopt the latest fly-by-night, just-posted-to-hacker-news-yeterday framework, there's a happy medium between that and "what we've used since the 90s", and risk-averse process is not the solution.

*A system that seeks to reduce risk by raising the barrier to change will increase risk in the long run.*

### Lack of technocratic leadership



2. Lack of technocratic leadership
  * Optimize for developers
  * Tech-centric initiatives key to policy goals
  * Geeks lack a seat at the table, both inside government and out, geek vs. suit divide
  * Matter of priorities; Forgo tools and systems (set org up for long-term success) for short-term wins (get the thing out the door)
  * Think in terms of 10-20 years for digital systems, but 6mo - year for platforms, tools, culture
  * Don't have the tools because management not affected by the need to scratch an itch (e.g. small script to automate a task)
  * Ex. Can't code in the open, but no budget for on-prem VCS

3. Heavyweight processes bred by distrust
  * Distrust of employees, contractors/vendors, the community
  * Employees
    * Assume if they can do something malicious, they will
    * Technical and policy constraints over cultural norms
    * Maximize batch size to minimize metawork
  * Vendors
    * Cost correlates with quality
    * Age of firm correlates with quality
    * Government specifics requirements (rather than relying on industry standards)
  * Community
    * Ø work in the open
    * All communications tightly controlled
