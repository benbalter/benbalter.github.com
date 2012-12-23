---
title: "We've been trained to make paper"
excerpt: "If the internet is the primary medium by which content is consumed, shouldn't that be the primary medium for which content is prepared?"
author: "Benjamin J. Balter"
layout: post
comments: true
category: Technology
tags: 
  - collaboration
  - Word
  - workflow
  - git
  - GitHub
  - markdown
published: true

---

We've been trained wrong. We've been trained that content creation starts by firing up a desktop word processor — a piece of software, mind you, that still does its best to generate a digital representation of a physical piece of paper — margins, page breaks, and all. Yet this quintessential workplace-place training simply fails to remain relevant in a world where we carry a computer in our pockets at all times. Our training now tells us to create content for the least-likely way it's consumed: on paper. We're stuck in an anachronistic workflow.

It's not uncommon for example, for a team to need to write or edit a document together. Take the typical collaborative publishing process, which generally goes something like this:

1. Draft content in Microsoft Word
2. Save to shared folder or e-mail around for comments and changes
3. Manually (and opaquely) reconsile changes one-by-one
4. Repeat steps 2-3 until satisfied with the document
5. **Convert to web-friendly format**
6. Publish

See what we did there? We're still writing content for print, and then only once we're completely done, begin to prepare it for web. That's broken. That's like building an entire car, and then at the last minute, deciding it should actually, in fact, be a plane. If the internet is the primary medium by which content is consumed, shouldn't that be the primary medium for which content is written?

### Using the wrong tools

Microsoft Word was designed with one purpose in mind: to make paper. Think about it. It's essential elements arose in the early 80's. There's print-centric buttons like left and right align front and center, but new-fangled internety things like hyperlinks or rich media are buried deep inside these labyrinthian sub-menus. Sure, it's industry standard, but it's an industry-standard workflow that arose before the age of the web (and hasn't really changed since).

Yet the majority of the documents we create today rarely, if ever embody physical space.  They don't care about the things Microsoft Word cares about — margin width, page breaks, or other properties that assume four sharp corners — and more importantly, they don't handle mobile responsiveness, machine-readability, or other web-specific features.

### Merely a snapshot

And then there's the problem of collaborating. I can't count the number of times I've been e-mailed a document entitled `foo-document_2012_10_15_clean_fixed_revised_final2` or told that it's "on the share drive" or asked "are you out yet?". Without expensive software, that document's just a snapshot in time. There's no context. *What updates does this version have that weren't in the last? Wait is this even the most recent version? Who made the last three revisions? What happened with that change I submitted - did you accept it? Why not? Can we discuss? Can two people edit it at the same time? Not to mention — I have a crazy idea — can I go off and experiment in a parallel version?*

Geeks solved this problem a long time ago. It's called version control. We built it in the 70's. We start with content, you edit it, I edit it, and we get better content. It's really that simple, and better yet, it's free. It handles curating the master copy, keeps track of each and every change (down to the character mind you), and even provides a transparent forum to discuss those changes in the context in which they occur. [Take a look for yourself](https://github.com/benbalter/benbalter.github.com/commits/master/posts/_posts/2012-10-19-we-ve-been-trained-to-make-paper.md).

### Jailbreaking content

So why doesn't everyone use this "version control"? Because we're trained wrong. We've got to break free of these proprietary, print-only formats. We've got to stop shuttling changes back-and-forth via e-mail or with obscure file names. We've got to unprogram ourselves for an age of print.

And here's why: *.doc files are like tiny micro-jails for our content.* Proprietary document formats tend to commingle the text we provide with the commands the software needs to recreate it, and it stores all this in a complicated and inaccessible binary format. That's what makes it proprietary. We put text in — one of the most basic things computers understand — and we get this big mess back that can only be opened by that software. Imagine if the most common way to get water was to buy a can of Coke and run in through a Brita filter. It doesn't need to be so complicated. 

### Break the habit

Let's just concentrate on what matters: the content. When you separate design from content, things get a lot cleaner and a lot easier to work with. From now on, instead of clicking the little blue "W" out of habit, ask "does this really need to be a piece of paper?" If not, all of a sudden you can now use the best collaboration tools that mankind has made to date, rather than publishing tools that were made for a bygone generation.

And it's not that hard. You can just click "edit" below (as an example), or the next project that comes across your plate, give git a try:

1. [Learn](https://gist.github.com/3914310) Markdown - it takes 30 seconds. Honestly.
2. [Signup](https://github.com/signup/free) for a GitHub account - it's free!
3. Install [GitHub for Mac](http://mac.github.com/) (or [GitHub for Windows](http://windows.github.com/)) and [Mou](http://mouapp.com/)
4. Create a repository and go to work

Granted some of the tools can be a bit rough around the edges at times, they are getting  better, and like lots of other open-source technologies before it, as we move from  paper-first to a web-only distribution, the time is ripe for a more evolved, text-centric, distributed workflow to become mainstream. *Stop making paper, start collaborating.*