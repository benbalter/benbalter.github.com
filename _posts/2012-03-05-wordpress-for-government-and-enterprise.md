---
author: Benjamin J. Balter
title: 'WordPress for Government - A Problem of Perception'
excerpt: 'Among potential government & enterprise users, WordPress has a perception problem especially when compared to Drupal & other "serious" CMSs.'
layout: post
categories:
  - Technology
tags:
  - .govs
  - contracting
  - drupal
  - enterprise
  - federal
  - gov 2.0
  - government
  - IT
  - open government
  - open source
  - procurement
  - sharepoint
  - wordpress
---
[![WordPress for Government](http://ben.balter.com/wp-content/uploads/2012/03/wordpress-in-government-ben-balter-150x150.png){.alignleft}][1]

Over the past several years WordPress's market share has enjoyed explosive growth across virtually every industry. Today, it powers [nearly a quarter of new sites][2], and is the CMS of choice for[ more than two thirds of the top-million sites][3] on the web making it the world's most popular publishing platform by a long shot. Yet one group of seemingly ideal users has been slow to take the former blogging platform seriously: .Govs.

Drupal powers twice as many federal .Govs [as every other CMS combined][4]. That's more than six Drupal sites for every one WordPress .Gov alone, not to mention the Joomlas, MovableTypes, and SharePoints of the world. The build-it-yourself software powers the White House, the House of Representatives, half a dozen agencies, and countless data-driven microsites like Recovery.gov and the IT Spending Dashboard, and its public sector use is [equally if not more impressive abroad][5].

### A Problem of Perception

<div style="float:right; width: 300px; margin-left: 20px; text-align: left;" markdown="1" class="well">
#### Typical Enterprise Misconceptions

*   WordPress is a blogging platform
*   WordPress doesn't scale well
*   Most plugins are written by hobbyists, not professionals
*   WordPress is less secure
*   WordPress can't handle complex data types or user roles
*   There's no enterprise support
*   There aren't many WordPress developers
*   No "serious" people use WordPress
*   The WordPress codebase is immature
</div>

WordPress's disproportionately low government adoption is arguably the result of a handful of factors. For one, custom post types, the feature that formally graduated WordPress from a mere blogging platform into a full-fledged content management system, has only been around since June of last year. Yet, even among new sites,[^1] the ratio remains somewhat stagnant, if not shrinking, leaving one to believe that the technology has lapped its own already stellar perception.

When you stack the two side by side (or against any other CMS for that matter), WordPress is objectively the prudent choice. On paper, you'd be hard-pressed to make the case for anything else. But, it's not a technical problem. It's a human one. It seems that WordPress's greatest asset – ease of use that has resulted in widespread adoption by a largely non-technical user base – is threatening to become its greatest liability.

Among those empowered to make purchasing decisions, there seems to be a sense that WordPress is what you use on the weekends to post pictures of your lunch while Drupal is what you use for "serious" business, and with good reason. For better or for worse, Drupal has positioned itself as not just a CMS, but rather *the* enterprise solution — an inseparable fifth layer of the increasingly ubiquitous enterprise LAMPD stack.

<table class="table">
    <thead>
        <tr>
            <th></th>
            <th>Drupal</th>
            <th>WordPress</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>API Hooks</td>
            <td markdown="1">[267][7]</td>
            <td markdown="1">[1,506][8] (5x)</td>
        </tr>
        <tr>
            <td>Active Sites</td>
            <td markdown="1">[533,136][9]</td>
            <td markdown="1">[65,052,049][10] (125x)</td>        
        </tr>
        <tr>
            <td>Plugins / Modules</td>
            <td markdown="1">[8,536][11]</td>
            <td markdown="1">[16,076][12] (2x)</td>        
        </tr>
        <tr>
            <td>Themes</td>
            <td markdown="1">[893][13]</td>
            <td markdown="1">[1,426][14] (1.5x)</td>        
        </tr>
        <tr>
            <td>Community[^2]</td>
            <td markdown="1">1.5 Million</td>
            <td markdown="1">20 Million (13x)</td>        
        </tr>
    </tbody>
</table>

### **Beyond Cowboy Coders**

Not surprisingly, the two communities are a reflection of their underlying software's position in the broader market. CodePoet.com, for example, a directory of WordPress consultants curated by Automattic, lists [a mere thirteen firms in North America that seek jobs over $250,000 ][16](often a small price tag for government or corporate sites), while its Drupal counterpart lists roughly 80 firms that specifically target [government][17], [enterprise][18], and [NGO clients][19] daily.

I am not suggesting that freelance developers should bring an end to what makes WordPress WordPress and change out of their shorts and sandals this instant or that they become intimately familiar with the nuances of federal procurement law, nor am I suggesting that small shops seek to bite off more than they can realistically chew anytime soon. I am suggestion, however, that there are small, tangible steps that the community can take to make headway into the government and enterprise space and gradually entrench WordPress as a viable alternative to otherwise subpar software harming innocent public servants.

### 1. `_Deprecate( ‘`Outdated Language`' )`

The results of the recent WordPress survey suggest that the majority of sites use WordPress *as a CMS*. That's like saying the majority of drivers use their Cadillac *as an automobile*. WordPress *is *a CMS. Yet, no one seems to be saying that. WordPress.org calls the software a "blog tool", the WordPress Features codex page [describes the site that the software creates as a "weblog" no less than 28 times][20], [^3] and the first search result for "WordPress CMS," [describes "what aspects of the WordPress… need to be changed in order to turn WordPress into a CMS."][22]

Especially in the buttoned-up context of corporate and government installs, "blog" can be a dirty word. Yet, to get the title of any site, the command we all still run is `get_bloginfo()`. Inside `&lt;?php` tags and out, the technology we have created has far outpaced the metaphor we use to describe it.

### 2. Make New Friends

In a typical procurement, be it a federal agency, mid-sized corporation, or local municipality, the CMS does not come first. In fact, many stakeholders wouldn't know the site's underlying technology if it weren't for the logo on the login screen. A firm with a strong reputation in the industry is sought, and based largely on their recommendation, the technology – be it proprietary, open-source, or purpose-built – is chosen by evaluating each across a handful of metrics.

We all know the decision points. Performance and scaling, handing of complex data types, managing user roles, etc. All challenges that WordPress doesn't even flinch at, yet the perception among the uninitiated is still widely that between open-source alternatives, WordPress is the least-accomplished in the bunch. Whether its reaching out and inviting nearby firms to your next meetup, giving a WordPress talk at a non-WordPress conference, or just being an exemplar in your local development community, we need to show the tie-wearing few in the conference room that you don't have to be boring, overly complex, or unnecessarily expensive to get the job done right.

### 3. But Wait, There's More…

WordPress consultants are great at selling themselves, but rarely does anyone ever sell WordPress. Ask my why an agency or municipality should adopt Sharepoint, and I have page after page of [focus-group tested material tailored to my industry][23]. Ask my why anyone should use WordPress, and [I'm pretty much left to fend for myself][24]. Somewhat counterintuitive in a world of free software, migrating to WordPress comes with significant costs that firms need to take into account, both real and imagined, costs that the technology's ambassadors must actively overcome. Beyond actual development and training costs, there are perceived risks of an immature codebase, insecure plugins, and a general inability to do the job.

One of WordPress's greatest strengths is its tight-nit cadre of dedicated enthusiasts.  Yet it can often be hard for those on the inside to see things as those outside do. Think about those who have not yet tasted just how sweet the punch is. The name WordPress most often makes its way into a CIO's inbox, for example, only when there's been a security breach, not when there's been a feature release. Where other platforms have stagnated, WordPress's "can-do" attitude has forged onward introducing even more one-of-a-kind features, yet all too often they go unnoticed or underappreciated where it matters. Both collectively and individually, for WordPress to gain the respect of "the man," we must seek to broadcast its excellence. Now is not the time for humility.

### 4. Build Serious Features for Serious Users

[WordPress's core philosophy][25] has always been to "code for the majority" and with the amount of customization required out-of-the-box to do just about anything, arguably Drupal's philosophy has been "code for yourself." While Automattic does a great job with [the CNN's and TechCrunch's of the world][26], there's a huge opportunity here for developers to fill a void by giving rise to a new generation of core features, plugins, and themes with "serious" implementations in mind. Rather than another social media plugin, what's the next big thing? Large-scale data? Geolocation? APIs and interoperability?

NASA's space-race supercharching of the aerospace industry brought consumers everything from Super Soakers to sun glasses, and that same reach for the stars philosophy can put yet-unimagined power in the browsers of everyday WordPress users. Distraction free writing and an *even* more intuitive administrative interface are killer features to be sure, but they are the icing on an already beautiful cake and do little to gain parity with more traditional CMSs let alone take on the CMS space in the "WordPress Way." A good example of this may be [WP Document Revisions][27], a document management and workflow management tool built almost solely using core functionality. By leveraging WordPress's core competencies, the venerable CMS can not only gain a seat at the adult's table, but exponentially improve the experience for its primary user base as well

### Frenemies

It's important to note, though, it's not a zero-sum game. Drupal doesn't compete with WordPress like McDonalds does with Burger King or Coke with Pepsi. Government support for open-source software is a good thing, regardless of what form it takes. True, an infusion of publicly funded effort into the WordPress code base would invariably advance the software just as government funded research advances hard sciences, but, in the end, everybody wins here.

WordPress and government just make sense. As public institutions both large and small face growing budget concerns and begin to shift many of their services to the web, a platform like WordPress built with engagement, collaboration, and dialogue is the ideal fit, not to mention, incredibly persuasive when compared to expensive, propriety, or purpose-built alternatives.

### **We All Have a Stake**

Whether WordPress is your primary source of income, a hobby, or just the thing that powers your personal site, we all have a stake in WordPress's future. It is paramount that the community stays true to its scrappy roots. After all, there's no sense selling the couch to buy a new TV. Yet, in order to be taken seriously by the public sector as a platform for more than simply sharing photos of kitten and chronicling teenage angst, we must first take ourselves seriously, and take baby steps to bring government adoption in line with the WordPress community's otherwise unparalleled and well-deserved success.

[^1]: **Update (3/7):** As many have pointed out, a lot of the misinformation may also be traced back to somewhat of a *decision lag*. Custom post types, custom taxonomies, and WordPress multisite — three key features that although minor from a technical standpoint, really served as the fundamental shift to transition the platform from *blog+* to *full-fledged CMS* — came about only three major versions ago (WordPress 3.0). While eighteen months may be an eternity for the vast majority of the technology sector (the iPad 1 had just barely launched eighteen months ago for comparison), in the Government space, [procurement regulations dictate that such lag times are all but the norm][31]. As a result, in an already risk-averse contracting environment, we may actually be seeing numbers that more accurately reflect say, WordPress 2.9's reception in the Government sector — a snapshot of when an agency chose a CMS at the onset of a multi-year procurement — rather than those that accurately reflect its technical capabilities today.
[^2]: Jen Lampton, "Why WordPress is Better than Drupal, Developers Take Note" (July, 2010)
[^3]: **Update (3/8):** The features page is part of a community edited Wiki (the WordPress Codex) and since originally posted, I've gone through and reworked much of the blog-specific language. [View the original][34].

 [1]: http://ben.balter.com/wp-content/uploads/2012/03/wordpress-in-government-ben-balter.png
 [2]: http://techcrunch.com/2011/08/19/wordpress-now-powers-22-percent-of-new-active-websites-in-the-us/
 [3]: http://trends.builtwith.com/cms
 [4]: http://dotgov.benbalter.com
 [5]: http://groups.drupal.org/node/19885
 [6]: #note-2020-1 "Update (3/7): As many have pointed out, a lot of the misinformation may also be traced back to somewhat of a decision lag. Custom post types, custom taxonomies, and WordPress multisite — three key features that although minor from a technical standpoint, really served as the fundamental shift to transition the platform from blog+ to full-fledged CMS — came about only three major versions ago (WordPress 3.0). While eighteen months may be an eternity for the vast majority of the technology sector (the iPad 1 had just barely launched eighteen months ago for comparison), in the Government space, procurement regulations dictate that such lag times are all but the norm. As a result, in an already risk-averse contracting environment, we may actually be seeing numbers that more accurately reflect say, WordPress 2.9′s reception in the Government sector — a snapshot of when an agency chose a CMS at the onset of a multi-year procurement — rather than those that accurately reflect its technical capabilities today."
 [7]: http://api.drupal.org/api/drupal/includes--module.inc/group/hooks/8
 [8]: http://adambrown.info/p/wp_hooks/version/3.2
 [9]: http://drupal.org/project/usage
 [10]: http://en.wordpress.com/stats/
 [11]: http://drupal.org/project/modules
 [12]: http://wordpress.org/extend/plugins/
 [13]: http://drupal.org/project/themes
 [14]: http://wordpress.org/extend/themes/
 [15]: #note-2020-2 "Jen Lampton, "Why WordPress is Better than Drupal, Developers Take Note" (July, 2010)"
 [16]: http://codepoet.com/browse/regions/north-america/platforms/wordpress/project-size/250000-250000/
 [17]: http://drupal.org/marketplace-preview/all/Government
 [18]: http://drupal.org/marketplace-preview/all/Corporate
 [19]: http://drupal.org/marketplace-preview/all/Non-Governmental-Organizations
 [20]: http://codex.wordpress.org/WordPress_Features
 [21]: #note-2020-3 "Update (3/8): The features page is part of a community edited Wiki (the WordPress Codex) and since originally posted, I've gone through and reworked much of the blog-specific language. View the original."
 [22]: http://codex.wordpress.org/User:Lastnode/Wordpress_CMS
 [23]: http://sharepoint.microsoft.com/en-us/product/benefits/Pages/default.aspx
 [24]: http://ben.balter.com/2011/09/01/why-wordpress/
 [25]: http://wordpress.org/about/philosophy/
 [26]: http://en.wordpress.com/notable-users/
 [27]: http://ben.balter.com/2011/08/29/wp-document-revisions-document-management-version-control-wordpress/ "WP Document Revisions — Document Management & Version Control for WordPress"
 [28]: http://ben.balter.com/wp-content/uploads/2012/03/q-cover-issue01-300x387.jpeg
 [29]: http://wpcandy.com/announces/quarterly-issue-one-ships
 [30]: http://wpcandy.com/quarterly
 [31]: http://ben.balter.com/2011/11/29/towards-a-more-agile-government/
 
 
 [34]: http://codex.wordpress.org/index.php?title=WordPress_Features&oldid=113531