---
title: Analysis of federal .gov domains, pre-Biden edition
description: Analysis of what technologies power federal .gov websites - 2021 edition.
---

[In 2011](https://ben.balter.com/2011/09/07/analysis-of-federal-executive-domains/), the White House’s Office of Management and Budget released a list of all domains owned and operated by federal executive agencies. At the time, I used a tool I wrote called [Site Inspector](https://github.com/benbalter/Site-Inspector) to sniff out information about each government domain's technology and capabilities. I also conducted subsequent scans in [2014](https://ben.balter.com/2014/07/07/analysis-of-federal-executive-domains-part-deux/) and [2015](https://ben.balter.com/2015/05/11/third-analysis-of-federal-executive-dotgovs/). Now, nearly ten years (!) after that first crawl, I conducted a fourth analysis of federal .gov domains to serve as a snapshot of the state of government technology ahead of the incoming Biden administration.

You can [browse the full results, download the raw data, or see details for an individual domain within the report itself](https://ben.balter.com/2021-analysis-of-federal-dotgov-domains/), but here are the highlights:

### Highlights

* **Overall** - There are 1121 federally-managed .gov domains. That’s about 250 fewer than there were five years ago after a targeted push to reduce domain sprawl. Of those domains, 926 (82.6%) are live. That’s about the same percentage as we saw in 2014 and 2015, and has gone up about 10% over the past 10 years.
* **Redirects** - 264 (28.51%) domains simply redirect to another domain.
* **www** - Of those live domains, 845 (91.25%) are reachable without the www. prefix. That’s about 40 fewer than in 2015, but about a 16% increase.
* **Security** - Security has seen the biggest wins since 2015. 883 (95.36%) domains support[ HTTPS](https://en.wikipedia.org/wiki/HTTPS), a 2.5x increase since the last analysis, and an incredible jump from the one in four we last saw. Even more surprisingly 849 (91.68%) *enforce* HTTPS, up from one in 10 last time. 770 (68.69%) support[ HSTS](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security), with 497 (44.34%) .govs on the HSTS preload list. Additionally, 844 (75.29%) domains returned a[ DNSSEC](https://en.wikipedia.org/wiki/Domain_Name_System_Security_Extensions) record.
* **IPV6** - 669 (72.25%) domains returned a AAAA record, indicating they supported[ IPv6](https://en.wikipedia.org/wiki/IPv6) traffic. That represents about 50 fewer than 2015, but a 20% increase overall.
* **CMS** - Of those live, non-redirected domains, 305 (32.94%) had a detectable CMS (up from 13% in 2015). Of them, 251 (82.3%) relied on an open source[ content management system](https://en.wikipedia.org/wiki/Content_management_system) (CMS). 202 (30.51%) domains use the Drupal CMS, up from 10% in 2015. Usage of WordPress doubled in percentage going from 29 to 37 (4.0%) sites since 2015. Joomla usage went from 8 to 5 (0.54%) domains.
* **Open source** - 541 (58.42%) of live domains used some form of detectable open source software (operating system, server, or framework), meaning overall, federal domains relied on 2.8 open source projects on average, with those relying on at least one open source project relying on just shy of 5 open source projects on average.
* **Analytics** - 479 (72.36%) unique domains use Google Analytics. Up from about one in four in 2014 and just 86 ten years ago.
* **Host** - It’s not always possible to detect the hosting provider, but at least 109 (11.77%) live domains use AWS (up from just 10 in 2011), 5 (0.54%) uses Azure, and 1 (0.11%) uses GitHub Pages.
* **Email** - In terms of detectable third-party email providers, 105 (9.37%) use Office 365 and 34 (3.03%) use GSuite.
* **Common files** - 501 (75.68%) domains return proper 404s, making it possible to check for the existence of certain files. Of them, 11 (2.2%) have a vulnerability disclosure policy and 46 (9.18%) have a data.json file.
* **CDN** - At least 41 (6.19%) domains use the Akamai[ content distribution network](https://en.wikipedia.org/wiki/Content_delivery_network) (CDN) and 74 (11.18%) use Amazon Cloudfront.

Be sure to read the [fine print](https://ben.balter.com/2021-analysis-of-federal-dotgov-domains/fine-print/). As I've said in years past, math’s never been my strong point, so I highly encourage you to check my work. If you find a mistake, please [submit a pull request](https://github.com/benbalter/2021-analysis-of-federal-dotgov-domains). Also to note, this is a personal passion project, and does not represent the views of my employer.
