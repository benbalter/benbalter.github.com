---
comments: true
description: It's time we start treating data with the same love and respect that geeks treat their code.
---

It’s time we start treating our data with the same love and respect that geeks treat their code. It’s time that we begin treating data as open source, not simply as something to be published.

### Putting process on a pedestal

Geeks learned some two-decades ago that precision and transparency are everything. If so much as a single character is off, entire programs come crashing to a halt. It’s essential that developers can instantly discern exactly who made what change when. As a result, every change, whether proposed or realized is tracked and indexed with the highest level of granularity imaginable, and all this information is constantly exposed along side the software itself. It’s what makes open source open source.

Having access to a program’s underlying source code and the ability to see its revision history is only half the story though. At its core, open source is about building communities around shared challenges. Being able to track changes at that level of granularity and with that fidelity of decision pedigree empowers contributors to propose and discuss changes with great efficiency, accuracy, and precision. It makes software a team sport. All of a sudden line-by-line code reviews, issues, and pull requests arise to address challenges both large and small. Simply put, do it right, and technology makes it easier to work together than to go it on your own.

### Where open source was two decades ago

Things weren’t always this way, however. Originally source code was shared by passing around physical media, then email, and eventually zip or other compressed files posted to public servers. Questions and proposed improvements were transacted via email, and were available only to the the project author. Questions were repeated, efforts were duplicated, and learning wasn’t shared. It didn’t leverage the power of the crowd. Sound familiar?

I’d argue that open data today is exactly where open source was some two decades ago, and I’d love to see if we couldn’t fast forward the community a bit. Imagine if every time the government posted a dataset, rather than posting the data as a zip file or to a proprietary data portal, the agency treated the data as open source. All of a sudden data sets get a running log of known issues, and not just those known to the agency. Consumers of the data can submit proposed changed to do everything from normalizing columns to correcting errors to making the data itself more useable. Most importantly, as that data evolves over time, there’s a running log of exactly what’s changed, a critical feature in the regulatory context (e.g., what licenses were issued in the past week?).

### Open sourcing data

We’re not talking about reinventing the wheel here. We’re talking about taking a proven practice in one industry, and introducing it to a related one. And from an agency perspective, it’s not a radical change either. Instead of FTPing static files to an agency server or updating a custom front-end, simply commit the file like the open source community would code. Heck, with GitHub for Windows/Mac, it’s a matter of drag, drop, sync. No command line or neck beard necessary.

All of a sudden we’re doing a few things: First, we’re empowering subject matter experts to be publishers. There’s no longer a Rube Goldberg machine necessary to publish data. Second, we’re starting a conversation between data publishers and data consumers. That’s where the issues and pull requests come into play. Finally, we’re exposing process, ensuring that open data becomes not simply “published data”, but can truly be open, dedicated community and all.

### A package manager for government data

So why aren’t we there yet? For one, good old fashioned FUD. It’s hard enough to get data outside the firewall, let alone, to expose process along side it. For another, it’s a matter of tooling. Things like [GeoJSON](https://help.github.com/articles/mapping-geojson-files-on-github) and [CSV](https://help.github.com/articles/rendering-csv-and-tsv-data) rendering go a long way to give open sourcing data a strong value proposition, but as long as it’s easier to do the wrong thing, that’s going to be the default. We need a [prose.io](http://prose.io) for more data types; we need more [geojson.io](http://geojson.io)'s. Finally, it’s a matter of culture and education. The technology’s already there. That’s not the problem. But most data-publishers, researches, and subject-matter experts have never heard of version control or exposing process. It’s not in their blood. It’s simply not how things are done.

Imagine if [the next iteration of Data.gov](http://next.data.gov) used [CKAN to manage the metadata catalog](http://www.data.gov/blog/ckan-horizon-datagov-20), but rather than simply pointing to opaque and static zip files, Excel files, PDFs, and other binary formats, instead took a play from the [rubygems.org](http://rubygems.org) playbook, and provided a significant value add for data stored on GitHub (while still remaining fully backward compatible to any federated datastore). Imagine if when searching for a dataset on data.gov you not only had links to view collaboratively written documentation, browse outstanding issues, or submit proposed changes, but also had immediate access to an entire community of subject matter experts and like-minded data consumers, with whom you could interact directly. All of a sudden, the agency is no longer the single point of failure. We’re democratizing data.

The vision needs a few high-visibility wins, and more importantly, needs advocates and evangelists to take those wins back to those empowered to affect change. But there’s nothing radical here, and definitely nothing that hasn’t already been done for longer than I’ve been interneting. How long will it be before you fork your first government dataset? Only time will tell, but one thing’s for sure: the data deserves it.
