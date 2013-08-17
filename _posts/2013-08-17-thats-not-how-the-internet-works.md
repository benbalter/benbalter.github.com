---
layout: post
comments: true
excerpt: ""
title: That's not how the internet works
---

The internet has [a particular way of doing things](http://ben.balter.com/2013/07/02/a-brief-history-of-the-internet/). It's an ethos driven by a desire for resilience, for interoperability, for speed — in a word, it's about efficiency. The ethos is born out of the [hacker ethic](http://ben.balter.com/2013/02/16/what-is-a-hacker/#the-hacker-ethic). It's about elegant solutions, not over engineered ones, and it's what makes the internet what it is.

There's been [a lot of discussion](https://twitter.com/michalmigurski/status/368120365085511680) recently about [GitHub's recent foray into the geospatial world](https://github.com/blog/1528-there-s-a-map-for-that). Sadly, a lot of it's focused on the wrong thing. You can't take an outdated, desktop-centric paradigm and just put it on the internet. Everyone knows that posting Word documents and PDFs online is a bad user experience. They're format's built within the constraints of the desktop age. Geospatial platforms are the same animal. Today, when building for a world where everyone has a computer in their pocket at all times, the rules have changed, and they've changed radically.

## No developer wants a 500MB endpoint

Any geospatial file larger than larger than 10MB [simply won't render](https://help.github.com/articles/mapping-geojson-files-on-github#troubleshooting) on GitHub. It's not that 10MB is "too big to render", it's that if a single text-bassed file is that big, you're clearly Doing It Wrong&trade;. As a developer, I can't immagine a single scenario in which I'd want an upstream data provider to hand me a single, giant file. There are a few reasons for this, like increasing the risk of corruption (shout out to Microsoft Word) on repeated save, slow downloads, or making it super-memory-intensive to read into an editor, but the most persuasive is that I simply don't need all that data. Granularity is a great thing, and it's an underlying assumption of how the internet is built.

### Rethink things for the internet

When I go to [the New York Times website](http:/nytimes.com), it's not as if my browser download's today's paper in its entirety. The creators of the website could have done that. They could have said look, readers get the paper as one unit when they go to their local newsstand, so lets just do that, it's worked for the past hundreed years. But they didn't. They understood that readers can only read one article at a time, and as a result, I'm presented with a lightweight index, and the ability to grab any article I want on a subsequent request. Fast, efficient, internety.

### Repository as RESTful API

Think through the experience of the person consuming your data. If there's a large geospatial dataset posted to GitHub that contains every fire hydrant, and I'm trying to find the fire hydrant nearest my building, I don't want to have to download every fire hydrant in the city just to find the one that I want. Break up the data into the most logical granular chunk, treat the file structure of your GitHub repository as a static, but RESTful API, and in this example, let me dynamically query by zip code, or some other subset of the data.

Start with the URL a developer sees and work backwards from there. Document this structure in your repo's read me, and all of a sudden you've unlocked an entire world of possibilities, without the need to maintain a purpose-built server just to do it. I know if I go to `/[username]/fire-hydrants/[city]/[zip]/hydrants.geojson` I can get just the data I want, and it's now slim enough that I can build a mobile or web app off of that. It doesn't need to be over engineered. Just absorb the complexity of your dataset for me.

## Dumb core, smart edge

Is GitHub a geospatial platform? No. It doesn't need to be. You don't need one. I hate to break it to you, geodata, but you're not a special snowflake. There's nothing unique about geodata that makes the process of storing and accessing it distinct from any other data type, at least, not when it comes to the context of the internet. Yes, maybe on the desktop a map behaves differently than a document because both are processed through their own, purpose-built tools, but the internet prefers to push logic to the edge, rather than centralize it.



## The technology's the easy part

http://mapbrief.com/2013/08/15/one-mans-public-comment-more-data-less-infrastructure/
