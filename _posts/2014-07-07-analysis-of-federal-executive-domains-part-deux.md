---
title: Analysis of Federal Executive .govs (Part Deux)
comments: true
description: A quick analysis of the technology and capabilities that power each federal domain such as non-www, SSL, and IPv6 support, or what server/cms they use
---

In September 2011, in response to the Office of Management and Budget releasing [a list of all federal executive domains](https://github.com/GSA/data/blob/gh-pages/dotgov-domains/current-federal.csv), I built a small tool called [Site Inspector](https://github.com/benbalter/Site-Inspector) and created [a quick analysis of the technology and capabilities that power each federal domain](https://ben.balter.com/2011/09/07/analysis-of-federal-executive-domains/).

Nearly three years later, I [resurrected that tool](https://github.com/benbalter/site-inspector-ruby), albeit a bit smarter, and, using [the latest list](https://explore.data.gov/Federal-Government-Finances-and-Employment/Federal-Executive-Agency-Internet-Domains-as-of-06/ku4m-7ynp?), thought I'd take a look at how things have changed in the time since. Efforts like the Digital Strategy and Open Data Policy have surely moved the needle, right? RIGHT?!

The Highlights:

* Approximately a quarter reduction in number of .govs (`1640 - 1229 = 441`)
* 1000 of those domains are live ([about 83%](http://dotgov-browser.herokuapp.com/domains?live=true){: data-proofer-ignore="true" }, up from 73%)
* Of those live domains, [about 83%](http://dotgov-browser.herokuapp.com/domains?non_www=true){: data-proofer-ignore="true" } are reachable without the `www.` prefix, a negligible increase
* [Only 64 sites](http://dotgov-browser.herokuapp.com/domains?ipv6=true){: data-proofer-ignore="true" } return an `AAAA` record, the first step towards IPv6 compliance (up from 10)
* [250 sites](http://dotgov-browser.herokuapp.com/domains?ssl=true){: data-proofer-ignore="true" }, approximately one in four, support SSL (HTTPS), but only [one in ten](http://dotgov-browser.herokuapp.com/domains?enforce_https=true){: data-proofer-ignore="true" } enforce it
* 87% of sites use no detectable content management system, about a 5% decrease
* Of those with a CMS, Drupal is still by far the most popular ([100+ sites](http://dotgov-browser.herokuapp.com/domains?cms=drupal){: data-proofer-ignore="true" }), with [WordPress powering 14 sites](http://dotgov-browser.herokuapp.com/domains?cms=wordpress){: data-proofer-ignore="true" } and [Joomla powering 7](http://dotgov-browser.herokuapp.com/domains?cms=joomla){: data-proofer-ignore="true" }
* [One in four sites](http://dotgov-browser.herokuapp.com/domains?analytics=google_analytics){: data-proofer-ignore="true" } use Google Analytics (almost a three-fold increase), with a handful of sites using Facebook insights
* Roughly a third of service advertise that they are powered by open source server software (e.g. [Apache](http://dotgov-browser.herokuapp.com/domains?server=Apache){: data-proofer-ignore="true" }, [Nginx](http://dotgov-browser.herokuapp.com/domains?server=nginx){: data-proofer-ignore="true" }), slightly more than those that are powered by closed source server software (for example, Microsoft, Oracle, Sun)
* [74 sites](http://dotgov-browser.herokuapp.com/domains?server=Microsoft-IIS%2F6.0){: data-proofer-ignore="true" } are still running IIS 6.0, a ten+ year old server
* HHS is the biggest perpetrator of domain sprawl with [110 domains](http://dotgov-browser.herokuapp.com/domains?agency=Department%20of%20Health%20And%20Human%20Services){: data-proofer-ignore="true" }, followed by GSA ([105](http://dotgov-browser.herokuapp.com/domains?agency=General%20Services%20Administration){: data-proofer-ignore="true" }), Treasury ([92](http://dotgov-browser.herokuapp.com/domains?agency=Department%20of%20the%20Treasury){: data-proofer-ignore="true" }), and Interior ([89](http://dotgov-browser.herokuapp.com/domains?agency=Department%20of%20the%20Interior){: data-proofer-ignore="true" })
* [142](http://dotgov-browser.herokuapp.com/domains?slash_developer=true){: data-proofer-ignore="true" } domains have a `/developer` page, [171](http://dotgov-browser.herokuapp.com/domains?slash_data=true){: data-proofer-ignore="true" } domains have a `/data` page, [146](http://dotgov-browser.herokuapp.com/domains?data_dot_json=true){: data-proofer-ignore="true" } domains have a `/data.json` page, roughly 15%
* [16 domains](http://dotgov-browser.herokuapp.com/domains?redirect=www.whitehouse.gov){: data-proofer-ignore="true" } redirect to whitehouse.gov, [10](http://dotgov-browser.herokuapp.com/domains?redirect=justice.gov){: data-proofer-ignore="true" } to justice.gov, [9](http://dotgov-browser.herokuapp.com/domains?redirect=consumerfinance.gov){: data-proofer-ignore="true" } to consumerfinance.gov and [8](http://dotgov-browser.herokuapp.com/domains?redirect=www.usa.gov){: data-proofer-ignore="true" } to usa.gov

Math's never been my strong point, so I highly encourage you to check my work. You can browse the full results at [dotgov-browser.herokuapp.com](http://dotgov-browser.herokuapp.com/){: data-proofer-ignore="true" } or check an individual site (.gov or otherwise) at [gov-inspector.herokuapp.com](https://site-inspector.herokuapp.com).

*Please note: This data is to be treated as preliminary and is provided "as is" with no guarantee as to its validity. The source code for all tools used, including the resulting data, is available [on GitHub](https://github.com/benbalter/site-inspector-ruby). If you find an error, I encourage you to [open an issue](https://github.com/benbalter/site-inspector-ruby/issues/new) or [submit a pull request](https://guides.github.com/introduction/flow/).*
