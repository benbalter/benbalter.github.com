---
title: "Why WordPress's next version should just give it a REST already"
excerpt: "To position itself in the context of next-generation CMSs, WordPress should conform to emerging internet conventions and expose all content via a RESTful API"
author: Benjamin J. Balter
layout: post
published: true
comments: true
category: Technology
tags: WordPress REST API
---

The internet has a particular way of solving difficult technical challenges. We try a bunch of diverse approaches out, keep only the most elegant, and quickly forget the rest ever happened. That's why the Web is the Internet's preeminent service (as apposed to say [Gopher](http://en.wikipedia.org/wiki/Gopher_%28protocol%29)), clicking the logo in the top left corner of almost any site goes to that site's homepage, and typing a URL in your browser retrieves that particular page. These aren't just design conventions in the sense that a lot of people like them, but rather represent the purposeful result of trial and error.

Over the past few years, as sites become more mature and even more inter-connected, the internet has been coalescing around one such pattern (known as [REST](http://en.wikipedia.org/wiki/Representational_state_transfer)). The idea is simple: a URL should uniquely identify the underlying data it represents. If I have a URL, I shouldn't need anything else to view or otherwise manipulate the information behind it.

WordPress, for the most part, does this well. Each post is given a unique permalink (e.g., `2012-12-15-why-wordpress...`) that always points to that post. The problem is, however, in WordPress's sense, it points to the *display* of that content, not the content itself. When editing, for example, that same content may be represented as `/wp-admin/post.php?p=1234`, clearly a different URL, and if you'd like to programmatically access the underlying data (say to build a mobile app, or some sort of external widget), you're pretty much SOL in terms of WordPress's core vision.

Why does such a nuance matter? Take a look at the direction the net's heading. We're separating content (say, the post itself), from the presentation layer that holds it hostage (say the theme's template), so that we can use it in many, many different ways without starting from scratch. This goes on behind the scenes in many ways you may not even notice, and that's the point. By enabling programatic access of the underlying data, that same post can be read via a mobile app, a feed reader, posted to a social network, or even embedded within another site altogether. 

Websites are quickly becoming the curators of information, not simply the presenters of it. It's a return to content management in its purest form. It's exposing content as a service, and it's coming whether we want it or not.

WordPress came about as many of these now-standard design conventions were still emerging, and understandably, it doesn't exactly embrace them head on. Yet next generation content management systems — not weighed down by history — have an advantage here, and as folks look to build the next generation of websites, they're obviously going to be looking to where we're going, not where we've been. 

If WordPress wants to stay relevant as a content management platform, the future isn't traditional post-and-forget blogging, but rather a concerted effort to once again make content king. We obviously can't flip a switch and get there overnight, but a crawl, walk, run over the next version or so can better align the veritable CMS with the reality of what's in our collective pipeline:

### Crawl

At the very least, lets expose all WordPress content in a machine readable format. This once and for all breaks the content-presentation link. We do this with RSS somewhat, but it's time to put non-HTML formats on equal footing with HTML in core's eyes.

1. Create a new format ("feed" in WordPress parlance) called JSON, and add the necessary rewrite rules such that I can simply add `.json` to any post and retrieve the underlying information in a machine readable format. This should contain not only the content of the post and information that would normally be accessible via HTML, but all the fields of the posts table (e.g., date published, date updated, etc.), all the post's metadata (custom, post-specific information), and all the associated term objects (tags, categories, etc.). Sure we'll need to add a filter or two in their to ensure information folks want private stays private, but from a technical standpoint, we're talking a handful of lines of code here.

2. Extend that format to indexes (archives in WordPress terms). Again, just as above, every list of posts (by date, by associated term, search results) should have the capability to exose the list in that same machine-readable format. This allows for the programatic discovery of information. A little bit harder than #1, but again, nothing crazy here. Pretty basic stuff.

### Walk

Access to content is half the equation. Allow programatic management of WordPress content as well. Conceptually, this is nothing radical. WordPress allows remote management of content through the [XML-RPC](http://en.wikipedia.org/wiki/XML-RPC) protocol, a blog-specific format that was designed some 15 years ago. We're just talking about an upgrade.

1. Use the existing `admin-ajax` infrastructure to consistently expose administrative functions in a programtic ways. For example, POSTing to `admin-ajax.php?action=create` should allow me to create a new post, just as `admin-ajax.php?action=update&p=123` or `?action=delete&p=1234` should do the same. Again, the basic plumbing's already there, it's just a matter of abstracting it out and aligning with modern conventions.

2. Pick a few high-priority pieces of backend functionality to prototype, such as listing posts or editing an existing post, and rather than reloading the entire administrative interface every time I click something, dogfood the services exposed in #1 to update the content dynamically. Put another way, turn the WordPress backend into a full-fledged client-side content administration application, rather than merely part of a blog. Again, nothign radical here. Gmail does this with mail, Twitter does this with Tweets. It's time for WordPress to start doing this with posts.

### Run

We may not get there tomorrow, but I know that with a bit of nuance, WordPress can align itself as the platform of the future and tackle the next generation of web-based applications in the "WordPress way". It's simply a matter of positioning.

1. Transparently map the already-exposed permalink endpoints (e.g., `2012/12/15/post.json`) to their backend counterparts. This may require a bit of rewriting of the WordPress routings system (to understand [HTTP verbs](http://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods) other than simply GET). At this point, WordPress would expose a fully RESTful API for any content it knows about, but could do so with the traditional WordPress finess.

2. Add [Backbone](http://backbonejs.org/) to the default theme (it's already used on the backend), and begin to dogfood content on the front end as well as the backend so that clicking a post or page simply retrieves the content, rather than reloading the entire website. There's an opportunity to really rethink templating here. Perhaps `wp_get_ajax_template` or something converts a WordPress template to an underscore template. Perhaps WordPress compiles everything into JST for me.

As community members sit down to sketch out what the next version of WordPress looks like, I sincerely hope they can at least think about implementing some of the front-end functionality early on, and maybe even make a prototypical wp-admin 2.0 somewhat of a priority.

Technology has this tricky way of bringing about organizational change. Making something so dumb-simple really is an empowering force. WordPress did it once as it first set out to democratize publishing, and it's time to do it again for the next generation of non-blogging websites and applications.

**Update (12/20):** *Not quite REST, but as [@scribu](https://twitter.com/scribu) points out in the comments below, [#14618](https://core.trac.wordpress.org/ticket/14618) proposed an RPC-like JSON API some two years ago. Looks like the ticket ended up in somewhat over a holy war over standards (XML v. JSON anyone?), but the arguments in favor still stand nonetheless.*