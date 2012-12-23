---
author: Benjamin J. Balter
title: The Demise of the Personal Dashboard
excerpt: >
  When building consumer applications,
  favor simplicity over complex
  personalized dashboards which bombard
  customers with information.
layout: post
categories:
  - Technology
tags:
  - .govs
  - analytics
  - dashboard
  - enterprise
  - gov 2.0
  - government
  - KPIs
  - start ups
  - ui
  - ui/ux
  - ux
  - wordpress
post_format: [ ]
---
[![Dashboard all the things](http://ben.balter.com/wp-content/uploads/2012/07/dashboard-all-the-things-300x225.jpeg){.alignright}][1]

I was recently asked how I would architect a personalized dashboard experience for visitors to a large, customer-facing website. My response? *I wouldn't.*

A dashboard in a car or airplane makes sense. It's not as if I could click "speedometer" while driving or press the "altimeter" button while flying. I simply need everything at all times. But virtual interfaces don't have that same limitation. In fact they don't have any limitations. A dashboard can have as much information as the most ambitious engineer can dream — and that's exactly the problem.

Put it in context: Google [recently announced the retirement of iGoogle][2], it's own personalized dashboard, and I second their nomination to induct dashboards into the #doingitwrong hall of fame, joining the likes of internet portals, splash pages, and well, basically anything involving ActiveX or Flash.

Dashboard were a fun user interface experiment. They really were, especially compared to the static pages they evolved from. That was the whole point of Web 2.0, wasn't it? Personalization? I mean, it was really cool to drag and drop widgets, and build a virtual command center to monitor my little corner of the internet, and that was fine when there wasn't much internet out there to monitor. But the web collectively hit a tipping point a few years back. From push notifications to always-on e-mail, in more ways than we imagine, we now bombard ourselves with more information that we can physically process at any given moment. [Quite literally][3].

Think about it this way: when customers come to a website, they're not looking to solve 10 problems. They're looking to solve one. They don't want all the potentially relevant information thrown at them all at once; they just want what they need. And they want computers to make that determination for them. But hey, this isn't the first time those who predict our user experience needs have erred on the side of [moar is better][4].

So that's it? That's the end of simultaneous streams? [Far from it][5]. This once-disruptive technology now has a long journey down the Technology S Curve as it becomes the go-to solution for all the business intelligence and project analyst types that stumble across it, in other words, the late adopters.

Don't get me wrong. I'm sure guilty of building [a dashboard][6] or [two][7] in my day. I'm not saying that they've never had a place. What I'm saying is that today, not even the most complex dashboard could give you an accurate snapshot of its genus's future. If not dashes, then what? Beyond turning everything into a ubiquitous search box (*a la* [gov.uk][8]), I'm far from for a UI/UX expert, but I tend to think that startups generally have a pretty good sense of what's next. They have to. If they don't get it right the first time around, they tend not to have a second try. So what do we see?

* **Activity -** Social apps like Facebook, Twitter, Foursquare, even GitHub are all built around the concept of activity. Whether its a news feed, recent checkins, or even commit activity, the question I come with is "what's going on?" and it gets answered as in depth as I care to scroll through, not as in depth as an engineer arbitrarily decided I needed a few years back. It's linear. It's [inverted pyramid][9]. It's customized by whom or what I follow, not by what I add or (re)arrange.

* **Minimal** – Productivity apps like Gmail, Google Reader, even dropbox don't summarize for me how many e-mails, unread posts, or free MB I have as soon as I log in, and with the exception of a few labs features here or there, don't even give me the option to have anything more than a bare-bones inbox, unread feed, or directory listing. In fact, GMail and Google Reader were recently criticized for [going a bit too far][10] in this direction. But the lesson is the same: just give me my stuff and get out of the way.

* **Immediate** - Transactional apps, like Uber or Square focus on action, not the past (or even the present). When I open the Uber or square apps, I'm immediately presented with the ability to request a vehicle or swipe a card, not my top tasks, not an arbitrary array of options or metrics, not with recent news about the product or popular add-ons. The app simply stands at attention, awaiting orders. I actually had to dig a bit to find my transaction history and related business analytics, and I'd argue that's a really good thing.

Think about the last time you've used a drag-and-drop dashboard: If you're like me, it's going to be either Google Analytics or WordPress, and if that's the case, it's simply known as *the screen you see after you log in, but before you can do what you need to do*. It's wasted pixels. It's cruft from a bygone era when clicks were expensive and developers were left wondering "how can we fit more on a page".

Options are a crutch. It's the natural tendency of any engineer to over engineer a system, and that tendency is even stronger in a risk-averse, top-down culture [like government][11]. But your job — as an engineer, as a product manager, as user — is to push back, to fight that urge, to make [decisions, not options][12]. Not convinced? That feature you can't [bring yourself to cut][13]? Expose it through your API and see how many users complain.

It's no longer a question of "is this possible technologically?". It's no longer a matter of "can you expose me to that information 24/7?". Ever since the advent of [Zombo com][14], the only limit is our imagination. We've figured out the hard stuff. It's not centralization and personalization. It's decentralization and interoperability. Simplicity is the new black.

 [1]: http://ben.balter.com/wp-content/uploads/2012/07/dashboard-all-the-things.jpeg
 [2]: http://googleblog.blogspot.com/2012/07/spring-cleaning-in-summer.html
 [3]: http://www.apple.com/iphone/features/retina-display.html
 [4]: http://www.pocket-lint.com/images/dynamic/NEWS-32125-b3a8b509bc5e3a074f7f240f57d71aa9.jpg
 [5]: http://www.informationweek.com/news/software/productivity_apps/240003296
 [6]: http://my.fcc.gov/
 [7]: http://codex.wordpress.org/Dashboard_Screen
 [8]: http://gov.uk
 [9]: http://en.wikipedia.org/wiki/Inverted_pyramid
 [10]: http://jonoscript.wordpress.com/2012/04/26/gmail-designer-arrogance-and-the-cult-of-minimalism/
 [11]: http://www.google.com/?q=dashboard+site:.gov
 [12]: http://wordpress.org/about/philosophy/
 [13]: https://github.com/blog/1091-spring-cleaning
 [14]: http://html5zombo.com/