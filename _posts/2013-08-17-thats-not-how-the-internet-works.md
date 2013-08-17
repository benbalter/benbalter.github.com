---
layout: post
comments: true
excerpt: "The internet forces us to reimagine desktop technologies as vehicles for collaboration. Geodata is just one of them, and GitHub is the answer."
title: That's not how the internet works
---

The internet has [a particular way of doing things](http://ben.balter.com/2013/07/02/a-brief-history-of-the-internet/). It's an ethos driven by a desire for resilience, for interoperability, for speed and efficiency — for preferring pragmatism over perfection. There's an unspoken set of rules born out of the [hacker ethic](http://ben.balter.com/2013/02/16/what-is-a-hacker/#the-hacker-ethic). It's about elegant solutions, not over engineered ones, and it's what makes the internet what it is.

There's been [a lot of discussion](https://twitter.com/michalmigurski/status/368120365085511680) recently about [GitHub's recent foray into the geospatial world](https://github.com/blog/1528-there-s-a-map-for-that). Sadly, a lot of it's focused on the wrong thing. You can't take an outdated, desktop-centric paradigm and just put it on the internet. Everyone knows that posting Word documents and PDFs online is a bad user experience. They're format's built within the constraints of the desktop age. Geospatial platforms are the same animal. Today, when building for a world where everyone has a computer in their pocket at all times, the rules have changed, and although they've changed radically, the playbook is well established:

## No developer wants a 500MB endpoint

Any geospatial file larger than larger than 10MB [simply won't render](https://help.github.com/articles/mapping-geojson-files-on-github#troubleshooting) on GitHub. It's not that 10MB is "too big to render", it's that if a single text-bassed file is that big, you're clearly Doing It Wrong&trade;. As a developer, I can't immagine a single scenario in which I'd want an upstream data provider to hand me a single, giant file in response to my API query. There are a few reasons for this, like increasing the risk of corruption on repeated saves (shout out to Microsoft Word), slow downloads, or making it super-memory-intensive to read into an editor, but the most persuasive is that I simply don't need all that data. Granularity is a great thing, and it's an underlying assumption of how the internet is built.

### Rethink things for the internet

When I go to [the New York Times website](http:/nytimes.com), it's not as if my browser download's today's paper in its entirety. The creators of the website could have done that. They could have said look, readers get the paper as one unit when they go to their local newsstand, so lets just do that, it's worked for the past hundred years. But they didn't. They understood that readers can only read one article at a time, and as a result, I'm presented with a lightweight index, and the ability to grab any article I want on a subsequent request. Fast, efficient, internety.

### Repository as RESTful API

Think through the experience of the person consuming your data. If there's a large geospatial dataset posted to GitHub that contains every fire hydrant, and I'm trying to find the fire hydrant nearest my building, I don't want to have to download every fire hydrant in the city just to find the one that I want. Break up the data into the most logical granular chunk, treat the file structure of your GitHub repository as a static, but RESTful API, and in this example, let me dynamically query by zip code, or some other subset of the data.

Start with the URL a developer sees and work backwards from there. Document this structure in your repo's read me, and all of a sudden you've unlocked an entire world of possibilities, without the need to maintain a purpose-built server just to do it. I know if I go to `/[username]/fire-hydrants/[city]/[zip]/hydrants.geojson` I can get just the data I want, and it's now slim enough that I can build a mobile or web app off of that. It doesn't need to be over engineered. Just absorb the complexity of your dataset for me.

## Dumb core, smart edge

Is GitHub a geospatial platform? No. It doesn't need to be. You don't need one. I hate to break it to you, geodata, but you're not a special snowflake. There's nothing unique about geodata that makes the process of storing and accessing it distinct from any other data type, at least, not when it comes to the context of the internet. Yes, maybe on the desktop a map behaves differently than a document because both are processed through their own, purpose-built tools, but the internet prefers to push logic to the edge, rather than centralize it into a single point of complexity and failure.

Successfully architected solutions do two things: First, they rely on existing open standards rather than reinventing the wheel. They rely on some of the internet's greatest hits, things like oauth and REST, and store data in formats born in the internet age, formats like GeoJSON. No licenses, no SDKs, just data. Second, they're built as a dumb core with a smart edge. Upgrading a standard is a monumental task. Upgrading a tool is trivial. But more importantly, there's room at the edge for experimentation, and with readily available libraries, amazing tool of empowerment like [geojson.io](http://geojson.io), something that nobody knew *could* exist six months ago, suddenly start appearing over night.

At it's core, GitHub performs an extremely simple task: It allows you to upload information, and then allows others to access it, and it does so with total disregard for what that information is, or what format you store it in. Like Git itself, GitHub is a dumb enough tool to be incredibly flexible. Everything gets a URL, there's a [CRUD API](http://developer.github.com/changes/2013-05-06-create-update-delete-individual-files/), you've got bulk downloads in Git or Zip, what more do the developers using your data actually need?

## Giving data the respect that it deserves

GitHub's more than a glorified FTP server, much, much more in fact. Geeks love their code. They treat it with great respect, because they know if so much as a single character is off, the entire project may come crashing to a halt. Tooling is everything. That's why GitHub exists.

It's about time we started giving data the respect it deserves. To treat data like developers treat code. Developers started by experimenting with opaque zip files for distribution decades ago and have since moved well past it. That's where version control comes in. Tracking things like when the data changed or who made what change when are well established practices and vital to building communities around shared challenges. It's more than SEO. It's working examples. It's killer documentation. It's issue tracking. It's the whole package.

## The technology's the easy part

Exposing process is just the start. Everything described here is trivial to implement, and could be done using a countless number of technologies and formats. There's a second side to the data-as-code coin: open source data. GitHub flips incentive structures. It puts technology in the hands of developers, whereby for the first time, it's now easier to work together than to work alone.

GitHub's a social network. It allows you to bring data to where the developers are and to socialize it. We're rehashing the story of Wikipedia versus Encyclopedia Britannica here. There's two ways to ensure information is "authoratative". The first way is to lock it down as tightly as possible. Only those who are blessed by the maintainer may even propose an improvement. The second way, the way the internet has proven, is to throw open the flood gates of collaboration. How do you know the data's accurate? Because if it weren't, thousands of people would have the ability to say so right beside it. Because someone with first hand knowledge corrected it, and I have the audit trail to prove it.

### It's the culture that's going to kill this

We should be building communities around our open data, not Rube Goldberg machines, to fundamentally change the way the government and civic hackers approach data sharing, to start to do what the software world has been doing for longer than I've been alive. Let's democratize mapping — technology's finally made it possible. I don't need expensive desktop software to generate a map, all I need is a web browser. The challenge now lies  solely in culture. It's about moving beyond the desktop. It's about shedding assumptions about complexity. It's about untraining how we've been trained to approach already-solved problems.

## Solve the problem once, solve it across the internet

You could replace the word "geodata" here, with any other datatype, and it would remain just as true. That's the beauty of the way the internet approaches technical challenges. Solve the problem once, solve it everywhere. In this case, the internet got together, and in its collective wisdom decided the fundamentals of information sharing. It's our job to implement them, not reinvent them. Is Github ["the most important step forward in spatial data infrastructure this year"](http://mapbrief.com/2013/08/15/one-mans-public-comment-more-data-less-infrastructure/
), no. The internet is.
