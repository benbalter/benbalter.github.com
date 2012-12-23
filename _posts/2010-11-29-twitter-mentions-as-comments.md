---
author: Benjamin J. Balter
title: >
  Twitter Mentions as Comments WordPress
  Plugin
excerpt: 'Twiter Mentions as Comments does exactly what it promises to do -- scours Twitter for people talking about your blog posts and silently inserts their Tweets alongside your existing comments. '
layout: post
categories:
  - Technology
tags:
  - comments
  - open source
  - plugin
  - twitter
  - wordpress
post_format: [ ]
---
Twitter Mentions as Comments does exactly what it promises to do – scours Twitter for people talking about your blog posts and silently inserts their Tweets alongside your existing comments. The plugin leverages the power of WordPress's built-in commenting system – notification, comment moderation, author white/black listing – making Twitter an extension of your blog.

**Features**

*   Searches for Tweets linking to your blog posts, regardless of the URL shortener used (using Twitter's Search API)
*   Pushes Tweets into WordPress's existing comment workflow – notifications, comment moderation, and author whitelists/blacklists work just like any other comment
*   Fetches user's real name and profile picture and links directly to the original Tweet
*   Checks automatically – no need to do a thing
*   Option to automatically exclude ReTweets
*   Option to store tweets as trackbacks/B
*   Option to specify which posts to check (e.g., 10 most recent posts, all posts, front page only)
*   Smart Caching of Tweets and user data – retrieves only what it needs to save on API calls and server load

**Planned Features**

*   Dynamic resizing of Twitter profile images to fit WordPress theme
*   Prioritization of newer posts
*   Oauth Authentication to raise API limit (currently unlimited Tweets, but limited to 150 *new* comment authors per hour)
*   Smarter API throttling

The plugin is available in the [WordPress plugin repository][1], and you can see it in action [below][2] or on the [WP Resume plugin page][3].

**Looking to filter out a particular user or keyword? ** Because Tweets go through the normal comment filter, you can just [blacklist them as described below][4].

*Enjoy using Twitter Mentions as Comments? Feel free to [make a small donation][5] to support the software's continued development.*

**Update (7/8): Comments have been closed in favor of [expanded support and discussion options][6]. Additional documentation about the project can now be found in the [Project Wiki][7]. If you are interested in joining the project at any level of technical expertise, please see [How to Contribute][8].**

 [1]: http://wordpress.org/extend/plugins/twitter-mentions-as-comments/
 [2]: #comments
 [3]: http://ben.balter.com/2010/09/12/wordpress-resume-plugin/#comment-168
 [4]: http://ben.balter.com/2010/11/29/twitter-mentions-as-comments/#comment-246
 [5]: http://ben.balter.com/donate/ "Donate"
 [6]: https://github.com/benbalter/Twitter-Mentions-as-Comments/wiki/Where-to-get-Support-or-Report-an-Issue
 [7]: https://github.com/benbalter/Twitter-Mentions-as-Comments/wiki
 [8]: https://github.com/benbalter/Twitter-Mentions-as-Comments/wiki/How-to-Contribute