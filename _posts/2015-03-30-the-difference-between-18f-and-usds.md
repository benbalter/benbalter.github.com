---
title: The difference between 18F and USDS
excerpt: "Two parallel efforts at modernizing the way government approaches technology are taking foothold in the Beltway: 18F and the US Digital Service (USDS)"
---

You may have noticed two parallel efforts at modernizing the way government approaches technology taking foothold in the Beltway over the past several months: 18F and the US Digital Service (USDS). Although similar on paper, the two approach the challenge with two very divergent goals: one was created to ship culture and the other was created to ship confidence. It's the age-old saga of [geeks vs. suits](http://ben.balter.com/2014/12/18/geeks-and-suits/).

### A long time in the making

The story of 18F and USDS (and their divergence) begins about three years ago with the introduction of the [**Presidential Innovation Fellows**](http://presidentialinnovation.org) (PIF) program. Modeled after [Code for America](http://codeforamerica.org) and the [Presidential Management Fellows program](http://pmf.gov), the PIF program was designed to parachute 18 skilled, private-sector technologists into government for six-month stints at a particular agency, technologists that wouldn't otherwise consider a career in government. The goal was simple: burst the stereotypical beltway bubble and expose government employees and bureaucratic workflows to mainstream technology thinking.[^disclosure]

The PIF program was a success, and soon after a group called **[18F](https://18f.gsa.gov)** was created within the General Services Administration (GSA) not only to house the PIFs, both physically and bureaucratically,[^eol] but also to continue and augment their efforts — to centralize forward-thinking technologists in government under one administrative umbrella, and to provide a vehicle for change that wasn't tied so closely to the administration and the highly political world in which it operates on a daily basis. In practice, 18F attracts the same type of outside-the-Beltway talent that the PIF program was designed to attract, and embodies a similar open-source-first mentality, but unlike the PIF program where many fellows simply took sabbaticals from their private-sector jobs, members of 18F traditionally jump ship and are in federal government for the long-haul, signing up for significantly longer terms than PIFs do.[^hiring-authority]

### 18F — Here's the best way to build software (and you can too!)

18F is an odd duck, at least when compared to how bureaucratic entities normally interact with one another. There's a bit of nuance in how 18F maintains engagements with "partner" agencies (just as a private sector firm might have "clients"), rather than embedding technologists in the agency itself (like the PIF program did), but the play's essentially the same:

18F's secret sauce is that it is [insistently dogmatic about collaborating in the open](https://github.com/18F/open-source-policy), and after expending a great deal of organizational energy painting a picture of a citizen-centric future and doing their best to inspire agency stakeholders that the way 18F approaches technology is vastly superior to the status quo, they will simply refuse to work with an agency unless the agency agrees to adopt 18F's culture and workflow, at least for the project at hand.

For 18F, the goal isn't simply to deliver the piece of software that they were asked to create, but to leave the partner agency with a better sense of and appreciation for what modern software development looks like outside the Beltway. For them a win might be their name on the front page of the Washington Post talking about a new citizen-facing service that they launched, but an even better win would be that the partner agency's name was the one in the headline, spiking the football for 18F's work (and continuing 18Fs vision once the engagement concludes).

Sure, it's leading by example, but it's also the teach-a-cio-how-to-fish strategy, and for them, culture's a first-class deliverable right along side the open-source code that that very culture necessitates. Think of them like the "consultant" in the movie Hitch: they're the guy behind the scenes whispering a few pointers in your ear to help you be the best you you can be (except without all the food poisoning and rom-com drama).

### The healthcare.gov wakeup call

To get a better sense of the full picture, let's take a step back for a second: On October 1st, 2013 `healthcare.gov` happened. While surely it wasn't the impetus for modern IT reform efforts, it certainly made them a priority among non-technical decision makers. [The administration quickly realized that simply throwing more money at "enterprise grade solutions" wasn't a defensible strategy](http://ben.balter.com/2014/12/18/geeks-and-suits/#the-age-of-the-geek), at least not in the long run. The West Wing knew that the government needed to get smart about technology, and needed to get smart fast, not to mention, coming off the tech-centric 2008 and 2012 campaign cycles, there was a legacy as "the technology president" at stake.

Although `healthcare.gov` was the first time that a recent policy initiative risked failure due to our inability to execute from a technical perspective, it was far from the first time change agents in government pushed for the need to rethink how we approached technology. You see, the dirty secret of government IT is that most agencies don't employ developers or the types of folks that read Hacker News over their lunch break to stay abreast of industry trends, and if they do, they're certainly not invited to the types of meetings that decide things like how to launch `healthcare.gov`. Instead, many IT executives are life-long bureaucrats, promoted from within the government ranks, with agencies primarily employing what we'd call program managers in the private sector, contracting out the overwhelming balance of development and subject-matter expertise (read: technical know-how) to a small cadre of government contracting firms for both the high-level system architecture and low-level application implementation.

Imagine that it's October 2013 and you're one of the President's senior advisers. You're getting asked questions about `healthcare.gov`, which is currently the lead story on just about every news channel globally. Your immediate concern is putting out the fire — getting the website back up — and if we're honest, being able to report to the press that you've righted the wrong so that you can get it out of the news. But once the crises subsides, you're going to start to be asked a second round of equally disconcerting questions: *How'd this happen? What's going to be the next `healthcare.gov` and how can we prevent it?*.

### USDS — We're on it boss (okay, listen, here's what you're going to do)

That's where **USDS** comes in. At least in the near term, the US Digital Service exists to prevent the next `healthcare.gov`. Full stop.

Unlike 18F, which is approached by agencies asking for help, USDS has a shortlist of administration priorities that it actively pursues. They're [the administrative talking points](https://medium.com/@USDigitalService/an-improbable-public-interest-start-up-6f9a54712411) you're used to hearing at stump speeches — immigration, veterans, social security, student loans, healthcare, and small business concerns. If it doesn't fit into one of those buckets, it's unlikely to get USDS's attention.

Think about it practically: bureaucratically, physically, and technically, USDS is part of and must respond to the ever-changing political desires of the White House (in contrast, 18F reports to, and is supported primarily by career civil servants). Whereas a win for 18F might be for a partner agency to grace the front cover of the Washington Post, for USDS, the goal is the exact opposite: to prevent a set list of technology-backed policy initiatives from making the news, at least not from a technology standpoint.

USDS's strategy is to bring best-of-class, private-sector engineers into government for time-limited tours of duty, parachute them into agency positions outside the traditional reporting structure, and task them with bringing a modern perspective to key technology initiatives. Sound familiar? Although, unlike the PIFs approach, from what I understand, like those that parachuted in to save `healthcare.gov`, there role seems to be inspired by the likes of [Nick Burns ("your company's computer guy")](https://www.youtube.com/watch?v=tfKL6RM8hsY), demanding that agency CIOs and other technical leads step aside, and they have the political capital to do it. After all, by definition, USDS projects are those already at risk of failure and those that require radical redirection.

Think of USDS like the Men in Black (although as far as I know, there's no adorable pug at the office). To them, the planet's always 24-hours away from destruction by an Arquillian Battle Cruiser or a Corillian Death Ray, but if they do their job right, you'll never know it. And that's the point.

### So what's the difference?

18F and USDS have divergent goals (getting on the front page, versus not getting on the front page), but there's more than that. I'd break the difference in approaches down to three key value statements implicit in each team's culture:

#### 1. Transparency as an asset versus transparency as a liability

When others outside your organization can see what you're working on, you provide them with the right to criticize your work. You also provide them with the opportunity to improve it.

18F clearly falls in the "transparency as an asset" camp. Almost without exception, they work in the open, list the names of the humans behind their efforts [on their homepage](https://18f.gsa.gov/), and [talk regularly about why they work the way they do](https://18f.gsa.gov/news/). By doing so, they impact not just those they engage with (and I suspect raise their own expectations internally), but have a real shot at shifting the conversation around how we approach IT here in DC by simply showing what's possible. As someone who fights to modernize government day in and day out, I can assure you that .gov URLs are a powerful weapon when going up against agency myth.

USDS on the other hand falls on the "transparency as liability" side of things, or at the very least, working in a way that captures and exposes process is lower down the list of organization priorities. Nearly six months after USDS launched, [the group was criticized for not having a web presence of its own](http://www.nextgov.com/cio-briefing/2015/01/man-google-who-came-fix-federal-it-still-doesnt-have-his-own-website/102582/), launched one a few weeks later in coordination with the State of the Union, and to my admittedly unobservant eye, hasn't changed much since. Beyond their recruiting materials, it's admittedly hard to tell exactly what they're up to, an odd arrangement for any startup today, let alone a government initiative riding on the coattails of the White House Open Government, Open Data, and Digital Strategy efforts.

Where as 18F uses its position to paint an opinionated vision of federal IT, USDS seems to use its single-page web presence almost exclusively for recruitment. An important task, don't get me wrong, and I'm sure they've got more pressing, more immediate fires to put out, but there's something to be said for the fact that if you google "USDS", the first result (after their Twitter feed) is a page entitled "US Digital Service *Recruitment*" (with the first heading being "Join the US Digital Service"), while the first result for "18F" is "18F Digital Services *Delivery*" (with the first heading being "Building the 21st century digital government").

#### 2. Show versus tell

In creative writing there are two ways to convey an idea. You can tell your reader explicitly, or you can explain the facts to your reader, and let them draw their own conclusion. Technology is no different. It's the reason we write instructional manuals.

For 18F, the play is "show". For one, it's the only way they will ever scale. They maintain no dominion over agency CIOs, and can't realistically have an ongoing engagement that covers every IT project. If they're going to do their part to push government in a more technocratic direction, they've got to leave agencies with a Swiss Army Knife of cultural tools so that change agents within the agency can carry the torch forward once 18F leaves. Not to mention, as an engagment-based agency, marketing their efforts is critical to maintaining a pipeline of partner agencies and the political capital it brings.

For USDS, the play is "tell". For one, they're in a position to do so. Whether recruiting for their own ranks or architecting an agency website, a call from the White House is an insanely powerful thing. For another, coming from a managment-point-of-view, they have the unique ability to change agency org. charts when they need to, placing the technologists they trust in positions bureaucratically that allows them to bypass the "show" step. They've also got enough political runway to ride things out until the end of the administration, without the need to prove their value, internally or externally.

#### 3. Management versus hacker

Crazy successful startups are founded and run by geeks — think Zuckerberg, Gates, Brin and Page to name a few. When creating an organization dedicated to building software, there's something to be said for optimizing for developers above external constraints. I've written before about [the distinction between geeks and suits](http://ben.balter.com/2014/12/18/geeks-and-suits/). Nowhere is that more apparent than when you look at 18F and USDS.

To me, 18F embodies [the hacker ethic](http://ben.balter.com/2013/02/16/what-is-a-hacker/), with geeks being at the top of the organizational food chain (whether developer, designer, UX-expert, whatever) and managers adopting a [servant leadership](https://en.wikipedia.org/wiki/Servant_leadership) approach to supporting their efforts. For 18F, change begin bottom up, by those closest to the problem. Not to mention, they've clearly embodied [the UK Digital Service's "delivery is the strategy"](http://mikebracken.com/blog/the-strategy-is-delivery-again/) ethos. From this outsider's perspective, 18F was built by geeks, for geeks, and that fact shows in how they work and what they *choose* to work on.

USDS may be strongly influenced by non-geek technologists, but that also provides them with a unique opportunity not afforded to 18F: While not immediately apparent, I suspect in the long run that USDS hopes to create a much wider-reaching digital service corps, with USDS being the bureaucratic umbrella, providing managerial air cover for non-career technologists at each of the household name agencies (DHS, VA, HHS, etc.).[^look-out] For USDS, the play is a top-down reimplementation of how the federal government approaches IT, at least from a human perspective.

### So which one's better?

Is 18F better? USDS? You're asking to compare Apples to PCs. They exist to serve different masters, and that's a *great* thing. They've both brought incredibly skilled technologists into government to serve their country, and as [any student of organizational change will tell you](http://www.kotterinternational.com/the-8-step-process-for-leading-change/), a two-pronged, top-down-and-bottom-up approach is the only way to unstick the the world we find ourselves in today (USDS) while simultaneously bringing about the world we want to live in (18F).

If you're a technologist and looking at the way our government approaches technology gives you the same nails-on-a-chalkboard feeling it gives me, I encourage you to [give in to your sense of civic duty](https://medium.com/thelist/why-i-m-returning-to-government-e191f8b14355) and lend the federal government a hand for a three-month, six-month, year-long, or lifetime sprint. 

[^disclosure]: Full disclosure, I was [a member of the inaugural round of fellows](http://ben.balter.com/2013/09/30/ten-things-you-learn-as-a-presidential-innovation-fellow/), but since them, work in the private sector. These are my own observations, reading public-facing representations, and being intimately familiar with government IT reform efforts. Your experience may vary.

[^eol]: As a result, I'd be surprised if the PIF program survived the next administration in its current form, but that's neither here nor there.

[^hiring-authority]: Technically speaking, most members of 18F are full time government employees (FTEs) hired under "direct hire" hiring authority for non-competed positions. That means that they are term-limited to two years, with an option to renew for two more, but when you're attracting 20- or 30-somethings, 2-4 years is a non-negligible percent of a technologist's life, and very possibly a plurality of their professional career.

[^look-out]: While certainly splitting hairs, there's already indication that OSTP's broader IT modernization efforts, and yes, even 18Fs, are being branded as part of the USDS portfolio (see e.g. the staffers listed on the public-facing USDS page).
