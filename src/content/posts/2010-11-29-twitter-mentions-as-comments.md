---
title: Twitter Mentions as Comments WordPress Plugin
description: A WordPress plugin that scours Twitter for mentions of your blog posts and inserts them as comments using WordPress's built-in system.
tldr: "Twitter Mentions as Comments does exactly what it promises: it scours Twitter for people talking about your blog posts and silently inserts their Tweets alongside your existing comments. Because it uses WordPress's built-in commenting system, those Tweets get the same notifications and moderation as any other comment."
archived: true
---

Twitter Mentions as Comments does exactly what it promises to do – scours Twitter for people talking about your blog posts and silently inserts their Tweets alongside your existing comments. The plugin leverages the power of WordPress's built-in commenting system – notification, comment moderation, author white/black listing – making Twitter an extension of your blog.

## Features

- Searches for Tweets linking to your blog posts, regardless of the URL shortener used (using Twitter's Search API)
- Pushes Tweets into WordPress's existing comment workflow – notifications, comment moderation, and author allowlists/blocklists work just like any other comment
- Fetches user's real name and profile picture and links directly to the original Tweet
- Checks automatically – no need to do a thing
- Option to automatically exclude ReTweets
- Option to store tweets as trackbacks
- Option to specify which posts to check (for example, 10 most recent posts, all posts, front page only)
- Smart Caching of Tweets and user data – retrieves only what it needs to save on API calls and server load

## Planned Features

- Dynamic resizing of Twitter profile images to fit WordPress theme
- Prioritization of newer posts
- OAuth Authentication to raise API limit (currently unlimited Tweets, but limited to 150 *new* comment authors per hour)
- Smarter API throttling

The plugin is available in the [WordPress plugin repository](http://wordpress.org/extend/plugins/twitter-mentions-as-comments/).

**Looking to filter out a particular user or keyword?** Because Tweets go through the normal comment filter, you can block them the same way you would block any other comment.

**Update (7/8): Comments have been closed in favor of [expanded support and discussion options](https://github.com/benbalter/Twitter-Mentions-as-Comments/wiki/Where-to-get-Support-or-Report-an-Issue). Additional documentation about the project can now be found in the [Project Wiki](https://github.com/benbalter/Twitter-Mentions-as-Comments/wiki). If you are interested in joining the project at any level of technical expertise, please see [How to Contribute](https://github.com/benbalter/Twitter-Mentions-as-Comments/wiki/How-to-Contribute).**
