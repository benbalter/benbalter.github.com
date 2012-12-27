---
title: "Introducing JekyllBot"
excerpt: "Automatically generate a JSON content API for Jekyll-based posts and pages. Uses Heroku, works with GitHub pages."
author: "Benjamin J. Balter"
layout: post
comments: true
categories: 
  - Technology
tags: 
  - Jekyll
  - Bot
  - JSON
  - API
  - Open Source
  - GitHub
  - GitHub Pages
  - Heroku
published: true
---

After [making the move to Jekyll](http://ben.balter.com/2012/10/01/welcome-to-the-post-cms-world/), one thing I lost was the ability to generate machine-readable representations of content. That may sound trivial, but it's actually not considering [the RESTful direction we're heading](http://ben.balter.com/2012/12/15/why-wordpress-next-version-should-just-give-it-a-rest-already/), and is crucial if you want to manipulate content on the front-end (e.g., [Backbone](http://backbonejs.org/) ). The idea being, for any post or page, if you simply replace the final `/` with `.json`, you should get an API.

I had previously written [a short Jekyll plugin to generate JSON representations of posts](https://github.com/benbalter/benbalter.github.com/blob/master/_plugins/generate-json.rb), but GitHub Pages (where this site is hosted), doesn't allow plugins for security reasons. Enter [JekyllBot](https://github.com/benbalter/jekyllbot). JekyllBot lives on a (free) Heroku instance, and following any push to GitHub, [silently generates JSON files](https://github.com/benbalter/benbalter.github.com/commit/c9eabc198479277a819ffa2cc95e26880ef3506c) for each post, pushing the changes back to GitHub. No need to do a thing. This allows you to continue to use web-based editors like [Prose](http://edit.benbalter.com/), and alleviates the need to ever touch the command line.

How does it work? I added my Heroku instance as a post-receive hook in the repository's settings page, and have JekyllBot running within [Sinatra](http://www.sinatrarb.com/) to listen for the payload. After a push, it simply runs Jekyll (with the plugin), commits to git, and pushes the repo back to GitHub if there are any changes. The secret lies in the JSON generating plugin, which places the resulting files in the source directory (rather than `_site`), allowing the files to be tracked by git, and thus silently passed through as static files by GitHub's Pages servers when the site is built.

With a little customization, there's no reason this process couldn't work with most Jekyll plugins (e.g., sitemaps, tag archives), allowing GitHub pages to support much more robust Jekyll implementations from within their existing security restrictions. Feel free to give [JekyllBot](https://github.com/benbalter/jekyllbot) a try on your own site, or simply add `.json` to the the URL above to see it in action.