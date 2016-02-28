---

comments: true
description: The internet forces us to reimagine desktop technologies as vehicles for collaboration.
title: "That's not how the internet works"
---

The internet has [a particular way of doing things](http://ben.balter.com/2013/07/02/a-brief-history-of-the-internet/). It's an ethos driven by a desire for resilience, for interoperability, for speed and efficiency — for preferring pragmatism over perfection. There's an unspoken set of rules born out of the [hacker ethic](http://ben.balter.com/2013/02/16/what-is-a-hacker/#the-hacker-ethic). It's about elegant solutions, not over engineered ones, and it's what makes the internet what it is. Put another way, the internet forces us to not simply to press upload, but to reimagine desktop technologies as potential vehicles for collaboration.

There's been some talk recently, about the promise of [using GitHub for data](http://ben.balter.com/2013/09/16/treat-data-as-code/), with the excitement for the platform's disruptive potential being counterbalanced by criticism that there are use cases for which it's not ideal. That's going to be true for any technology, and like any technology, you don't solve for scale on day one. You start small, you prove the concept, you iterate.

Think about how we approach open data today: desktop-centric paradigms simply grafted on the Web. Any technologist knows that posting a Word document or PDF online is a poor user experience. They're format's built within the constraints of the desktop age. Today, when building for a world in which everyone has a computer in their pocket at all times, the rules have changed, and although they've changed radically, the playbook is still well established:

### No developer wants a 500MB endpoint

Take GitHub's GeoJSON support, as an example. Any geospatial file larger than 10MB [simply won't render](https://help.github.com/articles/mapping-geojson-files-on-github#troubleshooting). That's not that 10MB is too big to render, or that the server can't handle it, it's that when a single text-bassed file is that big, the developer experience begins to suffer. I can't immagine a single scenario in which I'd want an upstream data provider to hand me a single, giant file in response to my API query, when all I really need is a single record. There are a few reasons for this, like increasing the risk of corruption on repeated saves (shout out to Microsoft Word), prohibitively slow mobile downloads, or making it super-memory-intensive to read into an editor, but the most persuasive is that I simply don't need all that data. Granularity is a great thing, and it's an underlying assumption of how the internet is built: everything gets its own URL.

#### Rethink things for the internet

When I go to [the New York Times website](http://nytimes.com), it's not as if my browser downloads today's paper in its entirety. The creators of the website could have done that. They could have said *look, readers get the paper as one unit when they go to their local newsstand, so lets just do that, it's worked for the past hundred years.* But they didn't. They understood that readers can only read one article at a time, and as a result, I'm presented with a lightweight index, and the ability to grab any article I want on a subsequent request. Fast, efficient, internety.

#### Repository as RESTful API

Think through the experience of the person consuming your data. If there's a large geospatial dataset posted to GitHub that contains every fire hydrant, and I'm trying to find the fire hydrant nearest my building, I don't want to have to download every fire hydrant in the city just to find the one that I want. Break up the data into the most logical granular chunk, treat the file structure of your GitHub repository as a static, but RESTful API, and in this example, let me dynamically query by ZIP code, or some other subset of the data. We default to complexity, but it doesn't have to be that complex. That goes against the grain of the internet.

Start with the URL a developer sees and work backwards from there. Document this structure in your repo's readme, and all of a sudden you've unlocked an entire world of possibilities, without the need to maintain a purpose-built server just to do it. I know if I go to `/[username]/fire-hydrants/[city]/[ZIP]/hydrants.geojson` I can get just the data I want, and it's now slim enough that I can build a mobile or web app off of that. It doesn't need to be over engineered. Just absorb the complexity of your dataset for the developer.

### Dumb core, smart edge

Is GitHub a geospatial platform? An open data platform? An open government platform? It doesn't need to be. When it comes to data, there's nothing so unique about one particular format that makes the process of storing and accessing it distinct from any other data type, at least, not when it comes to the context of the internet. Yes, maybe on the desktop a map or a spreadsheet behaves differently than a document or PDF because each are processed through their own, purpose-built tools, but the internet prefers to push logic to the edge, rather than centralize it into a single point of complexity and failure.

Successfully architected solutions do two things: First, they rely on existing open standards rather than reinventing the wheel. They rely on some of the internet's greatest hits, things like OAuth and REST, and store data in formats born in the internet age, formats like GeoJSON and markdown. No licenses, no SDKs, just data. Second, they're built as a dumb core with a smart edge. Upgrading a standard is a monumental task. Upgrading a tool is trivial. But more importantly, there's room at the edge for experimentation, and with readily available libraries, amazing vehicles of empowerment like [geojson.io](http://geojson.io), something that nobody knew *could* exist six months ago, suddenly start appearing over night.

At its core, GitHub performs an extremely simple task: It allows you to upload information, and then allows others to access it, all the while, silently keeping tabs on who made what change when, and it does so with total disregard for what that information is, or what format you store it in. Like Git itself, GitHub is a dumb enough tool to be incredibly flexible. Everything gets a URL, there's a [CRUD API](http://developer.github.com/changes/2013-05-06-create-update-delete-individual-files/), you've got bulk downloads, documentation, a running list of known issues, the ability to propose improvements, what more do the developers using your data need?

### The technology's the easy part

[Exposing process](http://ben.balter.com/2013/09/16/treat-data-as-code/) is just the start. [Everything described here is trivial to implement](http://ben.balter.com/2013/07/01/technologys-the-easy-part/), and could be done using a countless number of existing technologies and formats. There's another side to the data-as-code coin: open source data. Open source flips incentive structures. It puts tools and information in the hands of developers, so that for the first time, it's easier to work together towards a shared solution, rather than to go it alone.

GitHub's a social network. It allows you to bring data to where the developers are and to socialize it. It's the story of Wikipedia versus Encyclopedia Britannica. There's two ways to ensure information is "authoratative." The first way is to lock it down as tightly as possible. Only those who are blessed by the maintainer may even propose an improvement. The second way, the way the internet has proven, is to throw open the flood gates of collaboration. How do you know the data's accurate? Because if it weren't, thousands of people would have the ability to say so right beside it, because someone with first-hand knowledge corrected it, and you now have the audit trail to prove it.

### Solve the problem once, solve it across the internet

You could just as easily replace the word "map" or "geodata" used as examples here, with any other datatype, and it would remain just as true. That's the beauty of the way the internet approaches technical challenges. Solve the problem once, solve it everywhere. To fundamentally change the way the government and civic hackers approach data sharing, to start to do what the software world has been doing for longer than I've been on the internet, we should be building communities around our open data, not Rube Goldberg machines, and optimize the experience for data consumers, not data publishers.
