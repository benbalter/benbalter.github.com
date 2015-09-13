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

`healthcare.gov` was [the best thing to happen to government IT](http://ben.balter.com/2015/04/22/the-difference-between-18f-and-usds/#the-healthcaregov-wakeup-call). Traditionally, there's been two classes of change agents in government, [geeks and suits](http://ben.balter.com/2014/12/18/geeks-and-suits/). The geeks are exactly what you'd expect to find in the sub-basement of the government agency in a dimly lit room strewn with Mountain Dew cans again Doritos crumbs. They're the ones that understand today's IT landscape. The suits are exactly what you'd expect to find on the top floor of the agency, windowed room strewn with business cards and printed power point decks. They're the ones that understanding today's organizational politics. The problem is, only one has a seat at the table, and it produces exactly outcomes you'd expect.

`healthcare.gov` was the first time in recent memory that a policy initiative failed due to our inability to execute from a technical perspective, but it was far from the first time that geeks in government pushed for the need to rethink how we approached technology. The administration quickly realized that simply throwing more money at “enterprise grade solutions” wasn’t a defensible strategy, but that lesson hasn't been learned across government. Those making strategic decisions are largely still those that spend a life-long career as a bureaucrat making "risk-averse" investments that contract out the bulk of the technical know-how. In a world in which policy initiatives increasingly lean on technical ability, geeks simply lack a seat at the table.

First, the system is rigged for suits and against geeks, which means that it'll always solve for an effective process over an effective outcome. Enterprise software is a particular breed of software. It's popular among CIOs because it checks the right boxes and it's equally unpopular among end users because that's what it does best. On paper, an iPhone and a Blackberry both allow you to send and receive email, browse the internet, and make phone calls. Ask a consumer which they'd prefer, and there's a world of difference. The same is true of Enterprise IT and the stacks its built up. Government IT often prefers the vendor which claims to meet an arbitrary compliance standard. With some combination of time, money, and effort, compliance is always possible. Given that same trifecta, good technology is not a guarantee. Instead, of optimizing for process, optimize for the developer (and thus the end-user) experience.

Second, agencies often forgo the fundamentals of a sound technology stack that would set up the agency for to execute in the long term — tools, systems, and culture — for short term wins and "getting the thing out the door". Agencies expect 10 to 20 years of planning and forethought from geeks for standing up a new digital systems, but rarely plan six months to a year down the line when contracting out the platforms, tools, and human capital that will make that vision a reality. As a result, even if an agency's IT stack looks good on paper, in reality, it's often held together with little more than duct tape and bubble gum.

Finally, there's something to be said for a geek's need to scratch an itch. Geeks are problem solvers. Geeks are slaves to doing things better than the status quo. Regardless of role or title, geeks find itches in their day-to-day life they're dying to scratch. They think "I could write a script to automate this task", or "if only there were an API, it'd be so much easier to submit this report". Regardless of the thing, geeks know technology and geeks know if there's a better way. The same can't be said of suits. Geeks that serve under suits often don't have the tools they need because management isn't affected by the need to scratch that itch. That's why you end up in the Catch-51 where it's against agency policy to code in the open, but there's also no budget to stand up on on-prem version control system. Geeks in leadership positions naturally scratch itches, the same itches their developers are asking to have scratched.

### Heavyweight processes bred by distrust

  *   * Distrust of employees, contractors/vendors, the community
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
