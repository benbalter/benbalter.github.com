---
title: "A White House Open Source policy written by a geek"
excerpt: "As a geek, and a life-long member of the open source community, here's three things I hope the White House Open Source Policy embodies."
---

Open source in government is about much more than efficiency, shipping better code, or engaging the public more openly. Open source is about spurring [innovation ecosystems](http://ben.balter.com/2012/04/10/whats-missing-from-cfpbs-awesome-new-source-code-policy/?dontCache=1416281172765#an-innovation-ecosystem), public/private marketplaces of scientific and engineering ideas, the likes of which were last seen during the space race. Think space pens are cool? Wait until you see what open source has to offer.

The U.S. Federal government is [the single-largest purchaser of code](http://ben.balter.com/2011/11/29/towards-a-more-agile-government/) in the world. Imagine if, every year, those eleventy billion dollars went not to large, established government contractors, but to the many open source projects that government, you, and I use on a daily basis. The ones that already form the basis of our economy. Immagine if the size and tallent of the open source contributor pool literally *doubled* over night.

Private-sector firms like Coke and Pepsi, may have a valid reason to shy away from open source in some cases. If core business logic, a dollar spent on open source is a dollar your competitor doesn't need to spend to solve the same problem. But with government, there's no competitor, at least not in the sense of efficient regulation or delivering citizen services. There's no bottom line to hurt, no competitor to outsmart.

At the same time, the types of challenges faced by agencies don't differ much from agency to agency. A FOIA request is a FOIA request. A blog post is a blog post. When the Department of State creates a mechanism for publishing press releases, and the Department of Education uses it, all of a sudden the taxpayer dollar goes twice as far. We just got a 100% return on investment that we would not have otherwise gotten. We're solving the problem once, and solving it everywhere, rather than solving it multiple times, all at the taxpayer's expense. Why then, is the vast majority of government code, code that could potentially benefit both other agencies and the general public, primarily [built on proprietary platforms](http://ben.balter.com/2014/08/03/why-isnt-all-government-software-open-source/)? Why is such code, by habit, almost always [hidden from other agencies and from American taxpayers](http://ben.balter.com/2014/10/08/why-government-contractors-should-%3C3-open-source/)?

The White House [has committed to creating an open source policy](http://e-pluribusunum.com/2014/09/24/usa-to-create-official-open-source-policy/) by year's end, but like most policy-making efforts in the beltway, it may likely be influenced more by suits keen on the idea of open source, than by the geeks who will actually to use it.

As a geek, as a former government technologist, and as a life-long member of the open source community, here's three things I hope the White House Open Source Policy embodies:

### 1. Prefer (existing) open source platforms (*Open source as a platform*)

Every government IT project begins (and ends) with procurement. Non-technical government employees spec out a list of detailed technical requirements, based on what's been done in the past, not what should be done at the time of delivery. While it's surely possible to build on a closed-source platform and then later publish your efforts, (A) that code will be recieved by a smaller, less-receptive community, limiting the code's lifetime impact and (B) utilizing that code requires developers to purchase expensive licenses to use that closed source platform to contribute — not exactly in the spirit of open source. Both aspects of the closed platform minimize the promise of open source and become a self-fulfilling prophecy for naysayers.

At the same time, government agencies have a habit of seeing themselves as a unique, individual snowflakes. By virtue of the procurement process, they create such detailed specifications, that no existing product can meet their needs, and they must turn to purpose-built solutions. That's the beauty of open source. Rather than taking the existing *motus operandi* (build it from as close to scratch as possible), and apply it to open source, agencies should prefer a land and expand strategy, finding an existing open source platform — Rails, WordPress, whatever — and customizing it to their needs, rather than reinventing the wheel each time. That's the only way shared efficiencies are going to be found across government.

That said, if there's an overwhelming business case to the contrary, government shouldn't use open source for open source's sake. There's a reason that it's a preference, and there's a reason many geeks prefer Gmail to clunkier open-source desktop alternatives. Shared open source platforms should be the strong preference, with custom-built open source, custom-built closed-source, and proprietary platforms servings as reasoned fallbacks.

### 2. Open source, not source disclosed (*Open source as a design philosophy*)

Open source does not simply mean [government software for which the underlying code has been published](http://ben.balter.com/2014/09/29/source-disclosed-%E2%89%A0-open-source/
). In the industry, that's called disclosed source. Instead, open source is about growing communies around shared challenges. That has several implications:

Agencies must [abstract business logic](http://ben.balter.com/2012/06/26/why-you-should-always-write-software-as-open-source/
). There's an insane anti-pattern in government that suggests that all software should be so purpose built, all application logic so hard coded into the program itself, that changes to policy require multi-million dollar investments in the software, software that by virtue of being so application specific, is of no value to anyone other than the agency. Even if published, that's not open source.

Instead, software should be modular by design and flexible from the start, with deployment-specific variable and other business logic abstracted to databases or other configuration variables. Put in practice, where there's a common problem, there should be the possibility of a common platform, not the inevitability of two divergent applications, either of which may or may not be published. That benefits no one. Again, open source is not about published code. It's more a design philosophy.

[Open source is not a verb](http://ben.balter.com/2012/10/15/open-source-is-not-a-verb/). Successful open source projects are open source from day two (if not day one), are not so purpose built as to render them useless outside the agency, and do not participate in the open source community solely to garner good will. Instead, great open source projects are open source, because they know their software is better as a result.

### 3. Shared to the widest extent possible (*Open source as a workflow*)

If they wish to be successful, agencies looking to participate in the open source community, must first take the open source philosophy and workflow and apply it to their own, internal development efforts, regardless of if that code is every going to be made public.

While it's certainly possible to have a waterfall or closed-source workflow behind the firewall, and then later make that code open source, it's going to be a terrible experience for all involved, especially if the business process within the agency doesn't change. Open source begins, not at the point of disclosure, but rather, [at the point of creation](http://ben.balter.com/2013/05/14/we-ve-been-selling-open-source-wrong/).

As I've said before, [the technology's the easy part](http://ben.balter.com/2013/07/01/technologys-the-easy-part/). Instead, the discussion around open source today is, almost always, an implicit discussion on using technology as vehicle for organizational change. For breaking down silos between business units, for communicating more openly.

Agencies should license and share code, data, and documentation, to the widest extent possible, limited only by weighed privacy, security, or other business concerns, whether shared within a team, a bureau, an agency, across government, or with the general public.

### A community effort

The White House set a high bar with [Project Open Data](https://project-open-data.github.io), the White House Open Data Policy. All too often, especially in the world of government IT, by the time policy goes through the vetting process, it's already outdated at the time of publication, and even worse, it's encased in carbonite, forever memorialized as an unmovable PDF. Project Open Data, by contrast, was published as a living, collaborative document, whereby any government employee or member of the public was (and is) invited to improve the document. Since the document's release, it's been revised more than 500 times, all the result of post-release, public discussions with end users both technical and non-technical.

My normal advice to agencies would be to :ship: 0.1, not 1.0, but here, it's more appropriate to ship 0.0.1. The flaw of the White House Open Data Policy was that it shipped as 1.0, a document, admittedly flawed, but still with the force of law on day one. Especially for the White House Open Source Policy, I'd make the medium be the message. I'd push the document outside the firewall, in draft form, as soon as their was a minimum viable product, and once *the community* has developed a 1.0.0, then, and only then, should it be deserving of the president's signature, not the other way around.

In practice, that means eschewing the White House's standard Word and Outlook based workflows (supported by weekly standing meetings in leather and mohonogy-clad rooms), and putting all stakeholders — lawyers, bureaucrats, and CxOs inside the firewall, and developers, civic hackeres, and entrepreneurs outside the firewall — on equal footing. That's the most basic promise of open source. As soon as there's an information embalance between contributors, as soon as the discussion is stifeled by artificial contestants, the end result is going to suffer. Not to mention, in this case, it'd look awful silly, for the White House to talk out of one side of its mouth, espousing the virtues of open collaboration, while at the same time, doing so in the least collaborative way possible. As with anything else, in policy, actions speak louder than words.

Sure, there's more you potentially put in there, especially around fostering the culture necessary for the government to be truly successful at open source, but to :ship: a 0.0.1, what else would you include?
