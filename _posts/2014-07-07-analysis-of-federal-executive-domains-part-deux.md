---
title: Analysis of Federal Executive .Govs (Part Deux)
layout: post
comments: true
excerpt: "A quick analysis of the technology and capabilities that power each federal domain such as non-www, SSL, and IPv6 support, or what server/cms they use"
---

In September 2011, in response to the Office of Management and Budget releasing [a list of all federal executive domains](https://explore.data.gov/Federal-Government-Finances-and-Employment/Federal-Executive-Branch-Internet-Domains/ymya-7799/widget_preview?width=500&height=425&variation=md55-89i9), I built a small tool called [Site Inspector](https://github.com/benbalter/Site-Inspector) and created [a quick analysis of the technology and capabilities that power each federal domain](http://ben.balter.com/2011/09/07/analysis-of-federal-executive-domains/).

Nearly three years later, I [resurrected that tool](https://github.com/benbalter/site-inspector-ruby), albiet a bit smarter, and, using [the latest list](https://explore.data.gov/Federal-Government-Finances-and-Employment/Federal-Executive-Agency-Internet-Domains-as-of-06/ku4m-7ynp?), thought I'd take a look at how things have changed in the time since. Efforts like the Digital Strategy and Open Data Policy have surely moved the needle, right? RIGHT?!

The Highlights:

* Approximately a 1/4 reduction in number of .govs (`1640 - 1229 = 441`)
* 1000 of those domains are live ([about 83%](http://dotgov-browser.herokuapp.com/domains?live=true), up from 73%)
* Of those live domains, [about 83%](http://dotgov-browser.herokuapp.com/domains?non_www=true) are reachable without the `www.` prefix, a negligible increase
* [Only 64 sites](http://dotgov-browser.herokuapp.com/domains?ipv6=true) return an `AAAA` record, the first step towards IPv6 compliance (up from 10)
* [250 sites](http://dotgov-browser.herokuapp.com/domains?ssl=true), approximately one in four, support SSL (HTTPS), but only [one in ten](http://dotgov-browser.herokuapp.com/domains?enforce_https=true) enforce it
* 87% of sites use no detectable content management system, about a 5% decrease
* Of those with a CMS, Drupal is still by far the most popular ([100+ sites]((http://dotgov-browser.herokuapp.com/domains?cms=drupal))), with [WordPress powering 14 sites](http://dotgov-browser.herokuapp.com/domains?cms=wordpress)  and [Joomla powering 7](http://dotgov-browser.herokuapp.com/domains?cms=joomla)
* [One in four sites](http://dotgov-browser.herokuapp.com/domains?analytics=google_analytics) use Google Analytics (almost a three-fold increase), with a handful of sites using Facebook insights
* Roughly a third of service advertise that they are powered by open source server software (e.g. [Apache](http://dotgov-browser.herokuapp.com/domains?server=Apache), [Nginx](http://dotgov-browser.herokuapp.com/domains?server=nginx)), slightly more than those that are powered by closed source server software (e.g., Microsoft, Oracle, Sun)
* [74 sites](http://dotgov-browser.herokuapp.com/domains?server=Microsoft-IIS%2F6.0) are still running IIS 6.0, a ten+ year old server
* HHS is the biggest perpetrator of domain sprawl with [110 domains](http://dotgov-browser.herokuapp.com/domains?agency=Department%20of%20Health%20And%20Human%20Services), followed by GSA ([105](http://dotgov-browser.herokuapp.com/domains?agency=General%20Services%20Administration)), Treasury ([92](http://dotgov-browser.herokuapp.com/domains?agency=Department%20of%20the%20Treasury)), and Interior ([89](http://dotgov-browser.herokuapp.com/domains?agency=Department%20of%20the%20Interior))
* [142](http://dotgov-browser.herokuapp.com/domains?slash_developer=true) domains have a `/developer` page, [171](http://dotgov-browser.herokuapp.com/domains?slash_data=true) domains have a `/data` page,  [146](http://dotgov-browser.herokuapp.com/domains?data_dot_json=true) domains have a `/data.json` page, roughly 15%

Math's never been my strong point, so I highly encourage you to check my work. You can browse the full results at [dotgov-browser.herokuapp.com](http://dotgov-browser.herokuapp.com/) or check an individual site (.gov or otherwise) at [gov-inspector.herokuapp.com](https://gov-inspector.herokuapp.com). There's even [a full CSV of the results](https://github.com/benbalter/dotgov-browser/blob/master/data/domains.csv).

*Please note: This data is to be treated as preliminary and is provided “as is” with no guarantee as to its validity. The source code for all tools used, including the resulting data, is available [on GitHub](https://github.com/benbalter/site-inspector-ruby). If you find an error, I encourage you to [open an issue](https://github.com/benbalter/site-inspector-ruby/issues/new) or [submit a pull request](https://guides.github.com/introduction/flow/).*
