---
title: The four characteristics of modern collaboration tools
description:
---

At GitHub, we have a unique way of working. Some might say it's the future of knowledge work, others might say that we picked up a pair of bolt cutters a few years back, and now [everything looks like the lock on Wolf Blitzer's boat house](https://xkcd.com/801/). In reality, it's probably somewhere in between.

[We use GitHub to build GitHub](http://zachholman.com/talk/how-github-uses-github-to-build-github/). While that's obviously true for developers, and for writing the software that powers GitHub.com, it's less obviously true that we also use GitHub issues, pull requests, and markdown to manage all sorts of non-code things from internal policies to legal to HR to Sales. Need a contract reviewed? Open an issue. Want to propose a change to our vacation policy? Submit a pull request. After all, [how you work is just as important as what you work on](http://ben.balter.com/2015/09/21/open-source-behind-the-firewall/#how-you-work-is-as-important-as-what-you-work-on), so why not use the best, most modern tools available.

### Not all internet-based tools are created equal

Internally, this practice is often described as "everything should be on GitHub", but that's far from true true. Modern, developer-centric workflows use all sort of non-GitHub tools to share information. We use Slack for real-time chat and as a distributed water cooler. We have an internal blog called "Team" for posting company-wide announcements like ships and new Octokittens. Heck, every once in a while, we even, *gasp*, meet in person.

In practice at GitHub, like I suspect at many forward-thinking startups, GitHub.com has become a one-size-fits-all hammer for any [tangentially development-related nail](https://18f.gsa.gov/2015/11/06/micro-purchase-lessons/). In reality, there are lots of great, purpose-built tools that can be used to achieve the same ends. Sales teams have Salesforce. HR Teams have things like Zenefits. But not all internet-based tools are created equal.

### Evolving beyond Cold War workflows

When people say "put it on GitHub", I suspect what they really want, isn't necessarily a particular tool, but rather for it to be put on an open-source-inspired platform. GitHub is one of many tools that [consumerizes established, open-source norms](http://ben.balter.com/2013/02/06/the-next-big-thing-is-already-here/). Used this way, "put it on GitHub" is a metaphor for using the type of modern collaboration tools that don't simply digitize legacy workflows that predate the advent of the typewriter (and the ubiquity of the internet).

A few years back @rtomayko described [the four constraints of open source](http://2ndscale.com/rtomayko/2012/adopt-an-open-source-process-constraints), and why you should adopt them for your own team, open, closed, software or otherwise. Building on that assumption, I'd like to propose that these modern, open-source-inspired collaboration tools I'm describing, today, all have four common characteristics:

### 1. Open

Modern tools are built around the assumption that a diversity of contributors is essential to good decision making. While this statement isn't absolute (at a certain point adding more voices will have diminishing returns as the friction required to accommodate the Nth person will outweigh their contribution), modern tools seek to minimize that friction, ensuring that all relevant stakeholders can be included in discussions.

Tools designed to support open decision making incentivize collaborators to make the process as open as possible given the subject matter. Here, open means the opportunity for potential-contributors to opt-in to participate without being unnecessarily excluded *prima facia* by traditional constraints like time-zones, geography, title, or technical capability.

Open means openness for both humans and robots. Practically speaking, programatic access and machine readability is key. This is obviously true in some situations: video conferences aren't often an option for those with poor bandwidth. Scanned PDFs are blank pages to the blind. But by separating content from presentation, you make the information available on the platform of the content consumer's choice, rather than locking it into the platform of the content publisher's choosing.

Developers may feel at home using GitHub, but that doesn't mean lawyers and marketers do too. Platform-agnostic, programatic access means you can [stand up tools to optimize the experience for a diversity of skillsets](#). Not to mention, things like APIs can allow you to present information in different ways like high-level dashboards and bandwith- and remote-friendly mobile apps, further opening up the process. My general rule of thumb is to ask, "if we wanted, could @hubot access this information?".

### 2. Captures and exposes process

Modern tools [naturally capture and expose process](/2015/11/12/why-urls#systems-that-naturally-capture-and-expose-process). As teams go about their day-to-day business, they discuss matters, make decisions, and generate all sorts of artifacts of their process (meeting minutes, slide decks, spreadsheets, documents, etc.). While not every single artifact needs to be captured indefinitely, modern tools incentivize participants to prefer workflows that renders context time and location agnostic, both culturally and technically.

This can be as simple as memorializing real-time discussions after the fact (be they over video or IRL), but if you've ever read the read-out from a meeting, minutes tend to fall short of providing a full picture, and transcripts fail to surface key decisions. Not to mention, requiring an participants to take an affirmative step is time consuming, often forgotten, and while it may make sense for Congress doesn't scale down to smaller meetings and informal discussions.

Tools that naturally capture and expose process know that you should never force a human to do what a computer can do better. Discussions in chat, for example, are instantly captured, searchable, and shareable. The same is true of online discussion forums, version control systems, heck, to some extent, even *shudder* email. Compare that with audio or video recordings of a meeting, which may capture what was said, but generally isn't searchable, doesn't support linking to a particular segment, and often fails to adequately capture any media that was shared in the meeting (decks, handouts, etc.).

Capturing process is about capturing not only what decision was made, but who made it, what alternatives were rejected, that information that was relied on, and why. It's the antithesis of "I guess you had to be there". It renders organizational context time and location agnostic and provides value not just to those that weren't able to attend because they were out sick, traveling, remote, or even not part of the organization at the time, but also to those that were, when the revisit the same or similar decisions, weeks, months, or years later with full fidelity.

### 3. Linkable

Modern tools are built around URLs. [URLs are the primary means for sharing information in the age of the internet](/2015/11/12/why-urls#urls-are-how-we-share-information-today). Maybe in 10 years that'll change, but for now, every modern system (collaborative or otherwise) today assigns a globally unique identifier (a URL) to each distinct "thing" it knows about. Tweets, Amazon product and New York Times articles all have distinct URLs. If you find an interesting article you'd like to share, most people don't print and snail mail the article to their friends. This has several implications:

For one, it becomes ridiculously easy to share context. Here we're talking about a newspaper article, but that URL can be just as easily point to your organization's vacation policy, the process by which it was made, or the team who made it. It also gives the idea a permalink, meaning if the information changes, the resulting resource can be updated, while the URL remains the same. Compare that to the same information being captured in email, attachments and all. I may be able to forward you an old thread which you'd then have to grok through, but it'll likely be incomplete ("can you forward me the attachment?", "there's a reference to Joan's email, but I don't see it?"), and is merely a snapshot in time if the conversation continues.

URLs make sharing discussions a one-to-many relationship. It's no longer me explaining to you what happened in a meeting, or passing documents around via email, both processes that would not scale as the organization grows. The same effort required to expose a link to one person also exposes it to one hundred, and can do so, without your intervention. Posting a link in chat or on your company intranet is a fundamentally different function than describing where a document is on a shared drive. Not only does it automate (and render time and location agnostic) the dissemination of context (a reader can discover and click that link at any time, from anywhere, and click it without requiring any additional action on your part), it also allows you to link related concepts to one another, creating a network graph of your organization's inter-related knowledge over time. It creates an endless rabbit hole of information for readers to go down should the task at hand require they gain additional context.

### 4. Asynchronous decision making

Modern tools support asynchronous decision making. Today, in-person meetings are a crutch for forcing organizational action. To a certain degree, given finite resources, everyone is self interested. When workers are shackled with inefficient tools, they must triage what tasks they can tackle at any given moment, and more-often-than-not, those tasks which they feel ownership of get priority (because failure to do so would reflect poorly on them, rather than the group). If you want someone to do something, you call a meeting. Their computer dings, they step away, and for sixty minutes they are forced to concentrate on the thing you want them to concentrate on (and in all likelihood, this is the only time they're thinking about it). Compounding the problem, each meeting has a non-negligble switching cost, making "work time" even more scarce. Imagine if meetings weren't the default workflow. Imagine if you organization used tools that encouraged and empowered you (and your coworkrs) to advance goals without being in the same place at the same time or working on the same thing at the same time.

Meetings are an appendix of organizational evolution. When it was hard to share information between organizational units, status updates and inter-team alignment exercises were a necessity. If you're not working on X, the most efficient way for you to know about X is for me to tell you. Management has many roles, but for purposes of shuttling information around an organization and achieving consensus around shared goals, [there's nothing inherently unique or advantageous about a dozen people clearing their schedule to sit in a room for sixty minutes around a table](/2012/12/16/deprecate-management).

There are many examples where conversations will require higher-fidelity, real-time mediums (e.g., squishy human stuff, brainstorming, etc.), but today, technology has rendered many common meeting types not only unnecessary, but in an increasingly distributed and remote workplace, significantly less efficient than the alternative.

There's a strong case to be made that in-person, synchronous meetings should be the exception, not the rule, and in many organizations, they are no longer the default. For one, asynchronous workflow almost necessitate adopting systems that naturally capture, expose, and share process. At the same time, asynchronous workflows encourage data-driven decision making, through their ease of weaving external sources into the conversation on equal footing as the primary discussion. It's much easier (technically and culturally) to embed a chart or link to an external source in a GitHub issue, than it is to share it in a meatspace meeting ("hold on, let me see if I can't find that thing Bob emailed last year").

### Tools in practice

The four qualities above are ideals. In practice, there are a handful of specific design patterns that often implement them. Here are a handful that I've seen across tools I like at GitHub:

* @mentions - Like Twitter or Facebook, @mentions allow you to invite others to a conversation on equal footing and with equal context
* The ability to opt both in and out - Unlike email where CC's are controlled by the sender, not the receiver, one of my favorite GiHub features is the ability to opt-in to any conversation by clicking subscribe, and to opt-out, just as easily. This encourages liberally mentioning teams and teammates while minimizing noise
* Single sign on - If you're using more than a single tool, single sign on is crucial to ensuring openness. If I have to ask someone to create an account every time I'm linked to a resource in a new system, it will significantly hamper once ability to share information

* Markdown & Emoji
* Deep links
* Mobile
* RESTful API
* Cross-platform link notifications

### Evaluating existing Tools

I began by noting that the phrase "everything should be on GitHub", doesn't necessitate a certain tool, but if you believe working the way described above is valuable, few of today's consumer collaboration tools encourage open source enspired wokflows:

| Tool          | Open              | Captures Process      | Linkable             | Async           |
|:--------------|:------------------|:----------------------|:---------------------|:----------------|
| GitHub        | :check:           | :check:               | :check:              | :check:         |
| (Text) Chat   | :check:           | :check:               | :check:              | :check:         |
| Google Docs   | :check:           | :x:[^tracked-changes] | :x:[^gdocs-links]    | :check:         |
| Microsft Word | :x:[^proprietary] | :x:[^tracked-changes] | :x:                  | :check:         |
| Sharepoint    | :x:[^proprietary] | :x:[^tracked-changes] | :x:[^links]          | :check:         |
| Email         | :x:[^proprietary] | :check:               | :x:                  | :check          |
| Box/DropBox   | :x:[^proprietary] | :x:                   | :check:[^deep-links] | :check:         |
| Video chat    | :x:               | :x:                   | :x:[^recodings]      | :x:[^recodings] |
| IRL Meetings  | :x:               | :x:                   | :x:                  | :x:             |
{: .table}



[^tracked-changes]: While Google Docs and Microsoft Word can track changes (or you can version files manually via email), changes are tracked on a line-by-line or even character-by-character basis, making it hard to capture an entire revision in a single changeset. Compare a diff on GitHub (e.g., atomic commit) to the revision history menu on Google Docs or track changes in Microsoft Word.

[^links]: While you can link to the document as a whole, AFAIK, you can't link to individual versions, changes, comments, or decisions.

[^recordings]: Video conferences can theoretically be recorded and posted (we do this a lot at GitHub) in order to support asynchronous *viewing*, but video chat doesn't support asycronous participation, and absent indexed transcripts and search, something beyond most organization's means, don't readily support deep linking or discoverability.

[^deep-links]: While you can link to a particular file, [you can't link to content within the file](2014/10/07/expose-process-through-urls#great-urls) (and assume the reader has the appropriate proprietary software to view it).

[^proprietary]: While it's certainly possible to share documents as open formats like CSVs and Markdown files (thus rendering them platform agnostic), almost without exception these tools are used to share PDFs and Microsoft Office documents, which assume the reader has proprietary desktop software, and exponentially increases the complexity of machine readability and using the content elsewhere.
