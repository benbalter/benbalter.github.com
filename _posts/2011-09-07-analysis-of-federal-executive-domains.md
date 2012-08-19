---
author: Benjamin J. Balter
title: Analysis of Federal Executive .Govs
excerpt:
layout: post
category:
  - Technology
tags:
  - .govs
  - cloud computing
  - code
  - drupal
  - fcc
  - federal
  - gov 2.0
  - government
  - open government
  - open source
  - procurement
  - wordpress
post_format: [ ]
---
The White House’s Office of Management and Budget recently released a[ list of all domains](http://explore.data.gov/Federal-Government-Finances-and-Employment/Federal-Executive-Branch-Internet-Domains/k9h8-e98h) owned and operated by federal executive agencies. Leveraging a previous tool I had built called [Site Inspector](https://github.com/benbalter/Site-Inspector) which provides information about a domain and its technical capabilities, I imported the list into the content management system WordPress, and created a plugin called [Domain Inventory ](https://github.com/benbalter/Domain-Inventory)to scan each domain and curate the results. A summary of my preliminary results appears below, as well as a link to the browsable dataset.

**The project tracks each Federal Executive .Gov by:**

*   **Agency **(as provided in the data.gov list)
*   **Server status** (response code, if it is reachable, etc.)
*   **Non-WWW support** (is www. required to access the site)
*   **IPv6 Support** (is it reachable via next generation technology)
*   **CDN Provider** (do they use a content distribution network, if so what)
*   **CMS** (do they use a content management system, if so what)
*   **Cloud Provider** (are they hosted in the cloud, if so by whom)
*   **Analytics Source** (do they track visitors, if so how)
*   **Script Library** (do they use common javascript libraries)
*   **HTTPs Support** (is the site browsable via the secure HTTPS protocol)

**Key Highlights of the Preliminary Results:**

*   Only 73% of domains are [live and in use](http://dotgov.benbalter.com/status/live/)
*   *Of live domains* 80% are accessible [without typing the www. prefix](http://dotgov.benbalter.com/nonwww/yes/).
*   Only 10 sites fully support the federally mandated [IPv6 standard](http://dotgov.benbalter.com/ipv6/yes/).
*   87 domains use the [Akamai](http://dotgov.benbalter.com/cdn/akamai/) content distribution network.
*   12 are believed to be in the cloud, including 10 in [Amazon](http://dotgov.benbalter.com/cloud/amazon/), and 2 in [Rackspace](http://dotgov.benbalter.com/cloud/rackspace/).
*   103 use some form of analytics, with [Google Analytics](http://dotgov.benbalter.com/analytics/google-analytics/) being the most popular, found on 86 domains.
*   Drupal is[ by far the most popular CMS](http://dotgov.benbalter.com/cms/drupal/), powering nearly twice as many domains as all other CMSs combined.
*   [WordPress](http://dotgov.benbalter.com/cms/wordpress/) is the second most popular primary CMS (17), followed by Microsoft [SharePoint](http://dotgov.benbalter.com/cms/sharepoint/) (13).
*   93% of *live* domains use [no detectable CMS](http://dotgov.benbalter.com/cms/none/), or use a custom-built solution.

Slightly more than half of live servers are powered by

[commercial software.](http://dotgov.benbalter.com/server_software/commercial/)

**The full, browsable dataset:[ http://dotgov.benbalter.com](http://dotgov.benbalter.com)**

*Please note: This data is to be treated as preliminary and is provided “as is” with no guarantee as to its validity. The source code for all tools used, including the resulting data, is available in [GitHub](). If you find a systemic error, I encourage you to fork the code and I will try my best to recrawl the list to improve the data’s accuracy.*

**Update (10/4)**: Updated the above statistics (and underlying data) based on an updated domain list published on data.gov and recrawled using the same tools. The above numbers now use the number of *live* sites (rather than total number of domains) as the denominator for percentages, and excludes approximately 300 domains which simply redirects to other .govs.