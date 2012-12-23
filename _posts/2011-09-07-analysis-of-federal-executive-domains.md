---
author: Benjamin J. Balter
title: Analysis of Federal Executive .Govs
excerpt:
layout: post
categories:
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
The White House's Office of Management and Budget recently released a[ list of all domains][1] owned and operated by federal executive agencies. Leveraging a previous tool I had built called [Site Inspector][2] which provides information about a domain and its technical capabilities, I imported the list into the content management system WordPress, and created a plugin called [Domain Inventory ][3]to scan each domain and curate the results. A summary of my preliminary results appears below, as well as a link to the browsable dataset.

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

*   Only 73% of domains are [live and in use][4]
*   *Of live domains* 80% are accessible [without typing the www. prefix][5].
*   Only 10 sites fully support the federally mandated [IPv6 standard][6].
*   87 domains use the [Akamai][7] content distribution network.
*   12 are believed to be in the cloud, including 10 in [Amazon][8], and 2 in [Rackspace][9].
*   103 use some form of analytics, with [Google Analytics][10] being the most popular, found on 86 domains.
*   Drupal is[ by far the most popular CMS][11], powering nearly twice as many domains as all other CMSs combined.
*   [WordPress][12] is the second most popular primary CMS (17), followed by Microsoft [SharePoint][13] (13).
*   93% of *live* domains use [no detectable CMS][14], or use a custom-built solution.

Slightly more than half of live servers are powered by

[commercial software.][15]

**The full, browsable dataset:[ http://dotgov.benbalter.com][16]**

*Please note: This data is to be treated as preliminary and is provided "as is" with no guarantee as to its validity. The source code for all tools used, including the resulting data, is available in [GitHub][3]. If you find a systemic error, I encourage you to fork the code and I will try my best to recrawl the list to improve the data's accuracy.*

**Update (10/4)**: Updated the above statistics (and underlying data) based on an updated domain list published on data.gov and recrawled using the same tools. The above numbers now use the number of *live* sites (rather than total number of domains) as the denominator for percentages, and excludes approximately 300 domains which simply redirects to other .govs.

 [1]: http://explore.data.gov/Federal-Government-Finances-and-Employment/Federal-Executive-Branch-Internet-Domains/k9h8-e98h
 [2]: https://github.com/benbalter/Site-Inspector
 [3]: https://github.com/benbalter/Domain-Inventory
 [4]: http://dotgov.benbalter.com/status/live/
 [5]: http://dotgov.benbalter.com/nonwww/yes/
 [6]: http://dotgov.benbalter.com/ipv6/yes/
 [7]: http://dotgov.benbalter.com/cdn/akamai/
 [8]: http://dotgov.benbalter.com/cloud/amazon/
 [9]: http://dotgov.benbalter.com/cloud/rackspace/
 [10]: http://dotgov.benbalter.com/analytics/google-analytics/
 [11]: http://dotgov.benbalter.com/cms/drupal/
 [12]: http://dotgov.benbalter.com/cms/wordpress/
 [13]: http://dotgov.benbalter.com/cms/sharepoint/
 [14]: http://dotgov.benbalter.com/cms/none/
 [15]: http://dotgov.benbalter.com/server_software/commercial/
 [16]: http://dotgov.benbalter.com