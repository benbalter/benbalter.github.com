---
published: true
title: "Welcome to the Post-CMS World"
excerpt: "Jekyll (and other static-sites) lead to simple, flexible, and reliable websites that allow for a renewed focus on what actually matters: the content."
author: Benjamin J. Balter
layout: post
comments: true
category: Technology
tags: WordPress Jekyll GitHub benchmarking benchmarks

---

You may notice things are bit snappier around here these days, having [recently converted](https://github.com/benbalter/wordpress-to-jekyll-exporter) the site from WordPress, to [Jekyll](https://github.com/mojombo/jekyll).[^4]

Jekyll is a blog-aware static site generator — heavily integrated with the social code sharing service GitHub — the move to which, was primarily motivated by a desire to embrace the brave new, [post-CMS world](http://developmentseed.org/blog/2012/07/27/build-cms-free-websites/) we now find ourselves in. While WordPress is great, [130 outages over the past six months (totalling more than a day's worth of downtime)](http://cl.ly/image/1M420a152e1z), left a bit to be desired in terms of hosting. 

Although powered by the open-source CMS WordPress, the old site (shared hosting provided by Bluehost) for performance sake, would actually just served flat HTML and Javscript files from disk (generated on a regular basis by an industry-standard plugin known as  [W3 Total Cache](http://wordpress.org/extend/plugins/w3-total-cache/)), but fired up WordPress on every request (on top of the already slugish Apache). 

Don't get me wrong. WordPress can be [configured to fly](http://wordpress.org/extend/plugins/batcache/) given the right setup, and that's exactly what I set out to do. I got the best of the best. I spun up a shiny new AWS box, got Nginx with microcache up and running, APC for opcode, page, and object cache, and even put everything behind Varnish.

But as much as it pains the developer in me, just like fixies, PBR, and Javascript, static sites are back in style. Reduce the complexity, push it to the edge, and let the visitor's browser call APIs directly to generate any dynamic content you may need. Same functionality, same experience, no headache.

The pitch is straightforward. It leads to simple, flexible, and reliable websites that allow for a renewed focus on what actually matters: the content. Dave Cole over at [Development Seed](http://developmentseed.org/) (also powered by Jekyll) [put it best](http://developmentseed.org/blog/2012/07/27/build-cms-free-websites/):

> In the past, building websites with features like consistent templates and lists of aggregated content meant setting up complex content management systems. These CMSs consisted of templating logic, application code, and content databases so they could assemble webpages each time they were requested by site visitors. They were complicated systems that depend on many separate applications working together, like a web server to route page requests to a PHP application that uses pre-defined page layout templates to format content that’s stored in a MySQL database. Serving a page request required at least three separate applications all working together — any one failing would bring down the system...

> From open source frameworks like Drupal, Wordpress, and Expression Engine to multi-million dollar proprietary applications that the government and big corporations procure from companies that also build tanks and battle ships, these systems produce the same exact output: HTML, CSS, and JavaScript files that web browsers know how to format into the webpages we see. Additional features like RSS or JSON API feeds are just new templates for the same content, and backend workflow modules like those for embedded media and handling email notifications are really separate systems that introduce complexity when integrated with the publishing system.

And then there's cost. Putting aside the value of time for a moment, shared hosting's going to run you in the ballpark of $7 a month; AWS starts at $14, plus the cost of bandwidth and storage; and Jekyll, if hosted by GitHub? Free.[^3]

I stood up the three options side-by-side, and ran them through the riggors of a performance testing tool humerously called [Siege](http://www.joedog.org/siege-home/), the results of which can be found below.

I'm still unpacking some of the boxes of bytes, so if you notice something that doesn't seem right, feel free to [open an issue](https://github.com/benbalter/benbalter.github.com/issues), or better yet, like what you see, feel free to [fork and contribute](https://github.com/benbalter/benbalter.github.com). Embracing somewhat of a crawl, walk, run, or fail-fast philosohpy, next up is [outputting the pages as JSON](https://github.com/benbalter/benbalter.github.com/blob/js/_plugins/generate-json.rb) and relying on Backbone to do the heavy lifting.

Is it the [first shots](http://presidential-innovation-fellows.github.com/mygov/) [of a static-site](http://presidential-innovation-fellows.github.com/rfpez-blog/) [revolution](http://presidential-innovation-fellows.github.com/bluebutton/)? Time will tell. 

The CMS is dead. Long live the CMS.

<!-- more -->

***

## The Results

**WARNING: Geek Content!**

### Homepage

Command: `siege -c 20 -t 30S -b ben.balter.com`

The first test was to benchmark the homepage, the most heavily trafficed page on the site. Given 30 seconds of continuous traffic from 20 concurrent users, Bluehost was able to serve a meager 40 users. AWS managed an impressive 2000 users during that same time period (a 50x performance improvement), and did so twice as fast. Enter Jekyll with more than 2600 users (65x increase), responding on average to each in less than a quarter of a second.

#### Shared Hosting (Bluehost)

	Transactions:		          40 hits
	Availability:		      100.00 %
	Elapsed time:		       29.54 secs
	Data transferred:	        0.68 MB
	Response time:		        0.57 secs
	Transaction rate:	        1.35 trans/sec
	Throughput:		        0.02 MB/sec
	Concurrency:		        0.78
	Successful transactions:          40
	Failed transactions:	           0
	Longest transaction:	        0.71
	Shortest transaction:	        0.47

#### Varnish + Microcache + Page Cache + Object Cache (AWS)

	Transactions:		        1954 hits
	Availability:		      100.00 %
	Elapsed time:		       29.39 secs
	Data transferred:	       13.63 MB
	Response time:		        0.30 secs
	Transaction rate:	       66.49 trans/sec
	Throughput:		        0.46 MB/sec
	Concurrency:		       19.80
	Successful transactions:        1954
	Failed transactions:	           0
	Longest transaction:	        0.92
	Shortest transaction:	        0.06

#### Github Pages

	Transactions:		        2629 hits
	Availability:		      100.00 %
	Elapsed time:		       29.42 secs
	Data transferred:	        2.71 MB
	Response time:		        0.22 secs
	Transaction rate:	       89.36 trans/sec
	Throughput:		        0.09 MB/sec
	Concurrency:		       19.86
	Successful transactions:        2629
	Failed transactions:	           0
	Longest transaction:	        1.38
	Shortest transaction:	        0.06
	
### 404s

Command: `siege -c 20 -t 30S -b ben.balter.com/aaaaaaa/`

The true challenge comes in not from serving a static front page (which is presumably cached by WordPress after the first request), but in what happens when it has to reach into the database to retrieve content, for example, when processing a page that doesn't exist.[^1] Bluehost squeezed out a single response each second, AWS just over 50, and Jekyll didn't flinch at 80.

#### Shared Hosting (Bluehost)

	Transactions:		          30 hits
	Availability:		       21.43 %
	Elapsed time:		       29.58 secs
	Data transferred:	        0.19 MB
	Response time:		       14.93 secs
	Transaction rate:	        1.01 trans/sec
	Throughput:		        0.01 MB/sec
	Concurrency:		       15.14
	Successful transactions:           0
	Failed transactions:	         110
	Longest transaction:	       22.88
	Shortest transaction:	        0.00

#### Varnish + Microcache + Page Cache + Object Cache (AWS)

	Transactions:		        1567 hits
	Availability:		      100.00 %
	Elapsed time:		       29.13 secs
	Data transferred:	       14.71 MB
	Response time:		        0.37 secs
	Transaction rate:	       53.79 trans/sec
	Throughput:		        0.50 MB/sec
	Concurrency:		       19.83
	Successful transactions:           0
	Failed transactions:	           0
	Longest transaction:	        1.13
	Shortest transaction:	        0.00

#### Github Pages

	Transactions:		        2373 hits
	Availability:		      100.00 %
	Elapsed time:		       29.82 secs
	Data transferred:	       10.48 MB
	Response time:		        0.25 secs
	Transaction rate:	       79.58 trans/sec
	Throughput:		        0.35 MB/sec
	Concurrency:		       19.92
	Successful transactions:           0
	Failed transactions:	           0
	Longest transaction:	        1.42
	Shortest transaction:	        0.00
    
### Uptime

The other concern was uptime. With the AWS route you may get the performance, but with all that complexity, it's increasingly more like that something would go wrong, harder to diagnose and resolve, and unlike shared or managed hosting, if your site goes down at 3:00 am, the only person to call is yourself. (no thanks.)

With Jekyll, because the files are simply sitting on the server, absent a catastrophic failure, when things go wrong with Jekyll, it simply keeps serving the old content.[^2]
    
## Conclusion 

It's cheaper, it's faster, it's simpler, it's worry free, and in my opinion, it's the future. Welcome to the post-CMS world.

[^1]: Requesting a page that doesn't exist will require WordPress to run multiple database queries to attempt to find the page, a request that would most likely not be cached in the event that the 404 was sent in error.

[^2]: GitHub's build queue has been backing up every once in a while as of late, but if a change isn't instantanous, I'm okay with that.

[^3]: That's free as in speech **and** free as in beer.

[^4]: Not to be confused with [The Jackal](http://www.youtube.com/watch?v=Q7H_L5cYkg8).

## Testing Pull Request Workflow
