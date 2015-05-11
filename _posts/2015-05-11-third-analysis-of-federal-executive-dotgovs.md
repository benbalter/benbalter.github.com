---
title: ""
excerpt: ""
---

In [2011](http://ben.balter.com/2011/09/07/analysis-of-federal-executive-domains/) and then again in [2014](http://ben.balter.com/2014/07/07/analysis-of-federal-executive-domains-part-deux/) I used
[a small tool](https://github.com/benbalter/site-inspector) that I wrote to crawl every site on the [publicly available list of Federal Executive .gov domains](https://github.com/GSA/data/tree/gh-pages/dotgov-domains) to get a better sense of the state of Federal IT, at least when it comes to agencies' public-facing web presence.

This weekend, I decided to resurrect that effort, with the recently updated list of .gov domains, and with a more finely tuned versions of the [open source Site Inspector tool](https://github.com/benbalter/site-inspector), thanks to some contributions from [Eric Mill](https://konklone.com/). You can always compare them to the original [2011](http://ben.balter.com/2011/09/07/analysis-of-federal-executive-domains/) or [2014](http://ben.balter.com/2014/07/07/analysis-of-federal-executive-domains-part-deux/) crawls, or [browse the entire dataset for yourself(https://dotgov-browser.herokuapp.com), but here are some higlights of the most recent crawl:

* 10% **increase** in the number of .govs (1229 to 1356)
* 1177 of those domains [are live](https://dotgov-browser.herokuapp.com/domains?up=true) (about 86%, up from 83% last year, and 73% originally)
* Of those live domains [only 75% are reachable without the `www.` prefix](https://dotgov-browser.herokuapp.com/domains?root=true&up=true)
* [722 sites](https://dotgov-browser.herokuapp.com/domains?ipv6=true) return an `AAAA` record, the first step towards IPv6 compliance (up from 64 last year, and 10 before that, more than a 10x increase)
* [344 sites](https://dotgov-browser.herokuapp.com/domains?https=true) are reachable via HTTPS (stagnant at 1 in 4 from last year), and like last year, [only 1 in 10](https://dotgov-browser.herokuapp.com/domains?canonically_https=true&https=true) enforce it.
* ___ sites have no decreeable CMS, with Drupal leading the pack with [123 sites](https://dotgov-browser.herokuapp.com/domains?content_management_system=drupal), WordPress with [29 sites](https://dotgov-browser.herokuapp.com/domains?content_management_system=wordpress) (double from last year), and Joomla powering [8](https://dotgov-browser.herokuapp.com/domains?content_management_system=joomla) (up one from last year)
* [61 sites](https://dotgov-browser.herokuapp.com/domains?server=Microsoft-IIS%2F6.0) are still somehow running IIS 6.0 (down from 74 last year), a 10+ year old server
* HHS is still the biggest perpetrator of domain sprawl with [117 domains](https://dotgov-browser.herokuapp.com/domains?agency=department-of-health-and-human-services) (up from 110 last year), followed by GSA ([104](https://dotgov-browser.herokuapp.com/domains?agency=general-services-administration), down from 105), Treasury ([95](https://dotgov-browser.herokuapp.com/domains?agency=department-of-the-treasury), up from 92), and Interior ([86](https://dotgov-browser.herokuapp.com/domains?agency=department-of-the-interior), down from 89)
* [67](https://dotgov-browser.herokuapp.com/domains?slash_developer=true&proper_404s=true) domains have a `/developer` page, [99](https://dotgov-browser.herokuapp.com/domains?slash_data=true&proper_404s=true) have a `/data` page, and [74](https://dotgov-browser.herokuapp.com/domains?data_dot_json=true&proper_404s=true) have a `/data.json` file, all significantly down from past years, due to more accurate means of calculation, which brings us to
* [255](https://dotgov-browser.herokuapp.com/domains?proper_404s=false), or just shy of 20% of domains, don't properly return "page not found" or 404 errors, meaning if you programmatically request `/data.json`, the server will tell you that it's found the requested file, but really respond with a human-readable "page not found" error, making machine readability especially challenging
