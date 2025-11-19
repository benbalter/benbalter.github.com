---
comments: true
title: Bet on the little guy
description: On the Internet, simple, open format reign supreme over their heavyweight, proprietary counterparts
---

When one tells the story of the internet, a David and Goliath motif emerges. Every time a technical challenged is faced, a new standard is needed, or a new design pattern takes center stage, two camps eventually emerge:

* One camp, generally constituting more "enterprise" users, needs super serious tools for super serious business. This could be big business or big data. Doesn't matter. If the new file format can't scale to a million records on day one, well then, to them, it's not a format.

* The other camp, the hackers, are the little guys. They prefer to start small — to take existing, proven methods, things that are already baked into the patchwork that is the internet — and co-opt them to rise to this new cause.

We saw this in the early days of the internet when every new service would pick its own port and protocol, rather than using HTTP, which we eventually realized was the only sane way to go. We see this more recently with XML giving way to JSON as the internet's lingua franca, with SOAP's craziness yielding to REST's simplicity. The list goes on. Complex, heavyweight approaches that may be elegant on paper gain traction early on as proprietary or custom-built solutions, but eventually a dumber standard emerges as the true winner. To name a few:

<!-- more -->

* Everything → HTTP
* XML → JSON
* SOAP → REST
* SAML → OAuth
* Adobe PDF, Microsoft Word → Markdown
* ESRI Shapefile, Google KML → GeoJSON, TopoJSON

The internet is fundamentally a different animal from the desktop, both culturally and technically. Interoperability reigns supreme. Sure, many complex formats were first-out-the-gate to tackle a problem, and they did it well. Today however, with the abundance of smarter tools, we don't need that complexity at the core. Microsoft Word is great for making paper, but things like Markdown and HTML are quickly becoming the `.doc`s of the web. What lessons can we learn from the "winning" solutions?

* Open > Closed, Simple > Complex, Pragmatic > Perfect
* Dumb formats, smart tools
* Easier to upgrade a tool than a standard, experimentation is key
* No APIs to learn, no SDKs to install, no licenses to buy

Complexity only serves to raise the barrier to communicate and goes against the very purpose of the internet: connecting things. Look to the formats that don't have the 40 page PDF'd white papers. The ones that weren't "opened." The ones that don't need SDKs or APIs just to function. If you can't open it in a text editor, don't trust it.

Bet on the little guys. On the internet, they have a tendency to win.
