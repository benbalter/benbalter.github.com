---
title: How I Learned to Stop Worrying and Love the Code
description: 'I am gave a brief lightning talk at April''s WordPress DC Meetup on
  the basics of HTML and PHP ("coding for dummies"). The goal: learn how to avoid
  breaking your website if you edit it. Below are the slides and recording.'
date: '2011-04-12'
archived: true
---

I am gave a brief [lightning talk at April's WordPress DC Meetup](http://www.meetup.com/wordpressdc/events/16887732/) on the basics of HTML and PHP ("coding for dummies"). The goal: learn how to avoid breaking your site if you edit it. Below are the [slides](http://www.slideshare.net/benbalter/how-i-learned-to-stop-worrying-and-love-the-code).

## The Cliff's Notes are

* The process

  * The server executes PHP and outputs HTML, CSS, JavaScript, and so on![Screenshot of the presentation showing the relationship between server, browser, and user](https://ben.balter.com/wp-content/uploads/2011/04/infographic-300x138.png "infographic"){: .float-end .ms-3 }
  * The user's browser takes that output and renders a visual representation of the page

* Client-side Languages

  * HTML – Static (unchanging) content; provides structure
  * CSS – Provides style and form
  * JavaScript – Provides interactivity

* PHP – Wrapped with "`php`" and "`?>`"

  * Variable - Text, a number, true/false, or a group of variable; identified by "`$`"
  * `If` Statement – performs an action *if* a statement is true
  * `While` Loop – performs an action *while* a statement is true
  * `For` / `Foreach` – combines elements of `while` and `if`
  * Functions – predefined set of actions; always followed by "`( )`"
  * Don't forget semicolons

## Links to Resources Mentioned

* HTML

  * [Google: HTML, CSS, & JavaScript from the Ground Up](https://www.youtube.com/playlist?list=PL697D36B35F92E9E4)
  * [HTML Dog](http://htmldog.com)
  * [W3 Learning Wiki](http://www.w3.org/wiki/HTML/Training)
  * [W3 Element Wiki](http://www.w3.org/wiki/HTML/Elements)

* Text Editor

  * [Notepad++](http://notepad-plus-plus.org/) (Windows)
  * ~~TextWrangler~~ [Atom](https://atom.io)
  * [Coda](http://www.panic.com/coda/) (Mac)

* FTP Client (to connect to server)

  * [WinSCP](http://winscp.net/eng/index.php), Notepad++ (Windows)
  * [CyberDuck](http://cyberduck.ch/), Coda (Mac)

* WordPress

  * [Define( WP_DEBUG, true);](http://codex.wordpress.org/Editing_wp-config.php#Debug) in wp-config.php
  * [Debug bar](http://wordpress.org/extend/plugins/debug-bar/) plugin
  * [WordPress Codex](http://codex.wordpress.org/)

*Thanks to all who came out or tuned into the live stream. Comments? Questions? I'd love to hear your thoughts below or feel free to [contact me](https://ben.balter.com/contact/).*
