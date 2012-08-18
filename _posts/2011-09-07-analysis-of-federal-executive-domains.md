---
id: 1825
author: 1
date: 2011-09-07 11:54:01
date_gmt: 2011-09-07 15:54:01
title: Analysis of Federal Executive .Govs
excerpt:
status: publish
comment_status: open
ping_status: open
password:
name: analysis-of-federal-executive-domains
to_ping:
pinged:
modified: 2011-10-04 20:36:46
modified_gmt: 2011-10-05 00:36:46
content_filtered:
parent: 0
guid: http://ben.balter.com/?p=1825
menu_order: 0
type: post
mime_type:
comment_count: 45
ancestors: [ ]
filter: raw
category:
  - Technology
post_tag:
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
The White House’s Office of Management and Budget recently released a[ list of all domains][1] owned and operated by federal executive agencies. Leveraging a previous tool I had built called [Site Inspector][2] which provides information about a domain and its technical capabilities, I imported the list into the content management system WordPress, and created a plugin called [Domain Inventory ][3]to scan each domain and curate the results. A summary of my preliminary results appears below, as well as a link to the browsable dataset.

<!--more-->

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

<div>
  <p>
    <strong>Key Highlights of the Preliminary Results:</strong>
  </p>
  
  <ul>
    <ul>
      <ul>
        <li>
          Only 73% of domains are <a href="http://dotgov.benbalter.com/status/live/">live and in use</a>
        </li>
        <li>
          <em>Of live domains</em> 80% are accessible <a href="http://dotgov.benbalter.com/nonwww/yes/">without typing the www. prefix</a>.
        </li>
        <li>
          Only 10 sites fully support the federally mandated <a href="http://dotgov.benbalter.com/ipv6/yes/">IPv6 standard</a>.
        </li>
        <li>
          87 domains use the <a href="http://dotgov.benbalter.com/cdn/akamai/">Akamai</a> content distribution network.
        </li>
        <li>
          12 are believed to be in the cloud, including 10 in <a href="http://dotgov.benbalter.com/cloud/amazon/">Amazon</a>, and 2 in <a href="http://dotgov.benbalter.com/cloud/rackspace/">Rackspace</a>.
        </li>
        <li>
          103 use some form of analytics, with <a href="http://dotgov.benbalter.com/analytics/google-analytics/">Google Analytics</a> being the most popular, found on 86 domains.
        </li>
        <li>
          Drupal is<a href="http://dotgov.benbalter.com/cms/drupal/"> by far the most popular CMS</a>, powering nearly twice as many domains as all other CMSs combined.
        </li>
        <li>
          <a href="http://dotgov.benbalter.com/cms/wordpress/">WordPress</a> is the second most popular primary CMS (17), followed by Microsoft <a href="http://dotgov.benbalter.com/cms/sharepoint/">SharePoint</a> (13).
        </li>
        <li>
          93% of <em>live</em> domains use <a href="http://dotgov.benbalter.com/cms/none/">no detectable CMS</a>, or use a custom-built solution.
        </li>
      </ul>
    </ul>
  </ul>
  
  <p>
    Slightly more than half of live servers are powered by
  </p>
  
  <p>
    <a href="http://dotgov.benbalter.com/server_software/commercial/">commercial software.</a>
  </p>
</div>

<div style="border: 2px solid #ccc; background: #eee; padding: 10px; text-align: center; margin-bottom: 20px;">
  <strong>The full, browsable dataset:<a href="http://dotgov.benbalter.com"> http://dotgov.benbalter.com</a></strong>
</div>

*Please note: This data is to be treated as preliminary and is provided “as is” with no guarantee as to its validity. The source code for all tools used, including the resulting data, is available in [GitHub][3]. If you find a systemic error, I encourage you to fork the code and I will try my best to recrawl the list to improve the data’s accuracy.*

**Update (10/4)**: Updated the above statistics (and underlying data) based on an updated domain list published on data.gov and recrawled using the same tools. The above numbers now use the number of *live* sites (rather than total number of domains) as the denominator for percentages, and excludes approximately 300 domains which simply redirects to other .govs.

 [1]: http://explore.data.gov/Federal-Government-Finances-and-Employment/Federal-Executive-Branch-Internet-Domains/k9h8-e98h
 [2]: https://github.com/benbalter/Site-Inspector
 [3]: https://github.com/benbalter/Domain-Inventory