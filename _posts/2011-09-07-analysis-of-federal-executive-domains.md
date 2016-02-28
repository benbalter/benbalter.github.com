---
title: Analysis of Federal Executive .Govs
---

The White House's Office of Management and Budget recently released a [list of all domains](https://explore.data.gov/Federal-Government-Finances-and-Employment/Federal-Executive-Branch-Internet-Domains/ymya-7799/widget_preview?width=500&height=425&variation=md55-89i9) owned and operated by federal executive agencies. Leveraging a previous tool I had built called [Site Inspector](https://github.com/benbalter/Site-Inspector) which provides information about a domain and its technical capabilities, I imported the list into the content management system WordPress, and created a plugin called [Domain Inventory](https://github.com/benbalter/Domain-Inventory)to scan each domain and curate the results. A summary of my preliminary results appears below, as well as a link to the browsable dataset.

### The project tracks each Federal Executive .Gov by

* **Agency** (as provided in the data.gov list)
* **Server status** (response code, if it is reachable, etc.)
* **Non-WWW support** (is www. required to access the site)
* **IPv6 Support** (is it reachable via next generation technology)
* **CDN Provider** (do they use a content distribution network, if so what)
* **CMS** (do they use a content management system, if so what)
* **Cloud Provider** (are they hosted in the cloud, if so by whom)
* **Analytics Source** (do they track visitors, if so how)
* **Script Library** (do they use common javascript libraries)
* **HTTPs Support** (is the site browsable via the secure HTTPS protocol)

### Key Highlights of the Preliminary Results

* Only 73% of domains are live and in use
* *Of live domains* 80% are accessible without typing the www. prefix.
* Only 10 sites fully support the federally mandated IPv6 standard.
* 87 domains use the Akamai content distribution network.
* 12 are believed to be in the cloud, including 10 in Amazon, and 2 in Rackspace.
* 103 use some form of analytics, with Google Analytics being the most popular, found on 86 domains.
* Drupal is by far the most popular CMS, powering nearly twice as many domains as all other CMSs combined.
* WordPress is the second most popular primary CMS (17), followed by Microsoft SharePoint (13).
* 93% of *live* domains use no detectable CMS, or use a custom-built solution.
* Slightly more than half of live servers are powered by commercial software.

*Please note: This data is to be treated as preliminary and is provided "as is" with no guarantee as to its validity. The source code for all tools used, including the resulting data, is available on GitHub]. If you find a systemic error, I encourage you to fork the code and I will try my best to recrawl the list to improve the data's accuracy.*

**Update (10/4)**: Updated the above statistics (and underlying data) based on an updated domain list published on data.gov and recrawled using the same tools. The above numbers now use the number of *live* sites (rather than total number of domains) as the denominator for percentages, and excludes approximately 300 domains which simply redirects to other .govs.

**Update (October 2013)**: The original site is no longer available online. You may use the linked resource to recreate the results.
