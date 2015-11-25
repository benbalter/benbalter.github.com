---
title: "If you liked it then you should have put a URL on it"
description: "The next time you begin a new project, adopt a high-fidelity, electronic medium that allows you to capture and expose process in the form of a URL."
---

If there's one thing that made the internet what it is, it's the URL. It's what makes sharing funny cat videos possible. It's the bookmark to access your bank account balance. It's the Wikipedia link you send your buddy to end a heated argument. Why then, are our most online important interactions — collaborating with coworkers, accessing government services, or consuming open data — all too often, tragically URL-less?

### The humble URL

There's a lot packed into that seemingly innocuous string at the top of your browser. At its most basic level, a URL is a promise that so long as they have that magical sequence of characters, anyone in the world can see exactly what you see. In technical terms, a URL or [Uniform Resource Locator](https://en.wikipedia.org/wiki/Uniform_resource_locator) is the means by which to access a resource. That resource can be anything from a product on Amazon.com to an individual Tweet on Twitter to a page in the Congressional Record. A URL is also, by definition, also a URI ([uniform resource identifier](https://en.wikipedia.org/wiki/Uniform_resource_identifier)), meaning no two things ever have the same URL. Put another way, if you have something's URL, you also have a unique way to identify it, today and in perpetuity. It gives your content a permanent home on the internet, our primary means of communication.

### Exposing process

But URLs are more than just the phone numbers or license plates for the internet. When used correctly, [they expose process](http://tomayko.com/writings/adopt-an-open-source-process-constraints). Whereas in many organizations, asking why something is the way it is involves several trips up and down the hall to "ask Bob, I think he might have been around then" (with Bob somehow always being out of the office), at GitHub, as in most of open source, every decision has its own URL.

That URL exposes not just what decision was made, but why it was made, who made it, what information was available at the time, and what arguments were made both for and against it. And as new members onboard, they have immediate (and non-blocking) access to that URL, and all the context it contains. Better still, as the same or related issues arise, that institutional knowledge can be passed around with a single hyperlink.

We rarely use email for exactly that reason. It's not available to those not originally CC'd, it's not easily referenced, and most importantly, it's easily lost. What was the subject again? Was it sent to this distribution list or the other? Did I go over my quota? The medium doesn't matter (issues, forums, chat with transcripts) so long as it's possible to move backward from a given deliverable and understand how things came to be.

### Where things go wrong

If the fabric of the internet is so necessarily sewn with URLs, why then, do websites, especially government websites, so often violate this sacred cyber-norm?

#### URLs don't require additional instructions

If you asked me to send you GitHub's [SAM.gov](http://sam.gov) registration, the portal that centralizes common information about all businesses that sell to the federal government, I'd be forced to send you the following:

1. Go to [`sam.gov`](http://sam.gov)
2. Click `Search Records`
3. Type in the word "GitHub"
4. Click `Search`
5. Click `View Details`

Sadly, that's the most direct way anyone can get to that public information. Take a look at your URL and you'll see things like `navigationalstate`, `interactionstate`, each followed by an obscure string of letters and numbers. This tells you that the URL is only part of the puzzle, and that the server decides what to display based primarily on your previous interactions. The server, not the URL, is the master of what you see.

Regardless of the medium, one thing remains true: URLs don't require additional instructions. If the steps to retrieve a particular piece of content on the internet involves verbs — sub-instructions like "click", "scroll", or "search" — that content has not been afforded the respect a proper URL provides. "Take this URL" should be the only instruction you need. In technical terms, the internet is [stateless](https://en.wikipedia.org/wiki/Stateless_protocol).

#### The internet is not an afterthought

The second way URL-less information is created is when the internet is relegated to an afterthought. Spoiler alert: the internet is here to stay. Whatever you're doing, whether it's running a city council meeting or starting a small business, if you don't take the internet into account when creating your workflows, it's going to be an uphill battle to get things online.

Despite a fundamental shift in the way people interact with technology (hint: the iPad is just five years old), many workflows haven't embraced this reality. If the first step in content creation is to fire up a desktop word processor that has margins and page breaks, you're already heading down an analog trajectory. And to then go back and adapt the content for the web is going to be a subpar experience for information publishers and consumers alike.

Just as internal communication should prefer high-fidelity, electronic mediums in order capture and expose process, so too should external communication be treated with the same respect. A painter imagines the final masterpiece before ever touching brush to canvas. Whether exposed internally or with the public, great workflows start with the URL, in its ideal, non-PDF form, and work backwards to content creation.  

### Great URLs

Having a digital-first workflow and a standards compliant website is a great first step, but to truly put content on a pedestal, great URLs take digital publication three steps further:

  * **They're semantic** - URLs may be consumed by machines, but they are primarily built for humans. As such, [they should describe the thing they represent in human-readable, not just machine-readable terms](https://en.wikipedia.org/wiki/Semantic_URL). We've all looked to the top of our screen when browsing, only to discover `domain.com/index.php?page_id=23784` or a similar obscure database ID. Great URLs make it immediately clear what they represent. Just by seeing `ben.balter.com/2014/10/02/expose-process-through-urls` you immediately know (A) that this is an article, (B) who the author of that article is (C) when it was published, and (D) what it's about.

  * **They're format agnostic** - When you visit a web page in your browser, even if the URL doesn't explicitly end in `.html`, the server assumes that's what you're asking for and serves the requested content accordingly. But what if you want a different format, such as JSON or XML? Great URLs honor the idea that a URL should uniquely identify (and locate) a resource (not a specific presentation) and let you simply swap out the extension to get another format. If I'm looking at [a hoodie in GitHub's shop](https://github.myshopify.com/products/invertocat-hoodie), and want that data in JSON, I simply [add `.json` to the URL](https://github.myshopify.com/products/invertocat-hoodie.json), to get that same content in JSON. This is part of the secret sauce that makes [RESTful interfaces](https://en.wikipedia.org/wiki/Representational_state_transfer) possible.

  * **They link deep** - In any given page, there's a lot going on. Maybe it's a long blog post or simply a heated discussion thread. "Scroll two third down and you'll see it" is never an acceptable way to share content. Great URLs identify not only which page, but where on that page. Hover over the heading above and you'll have the opportunity to link directly to it (the URL updating with an [in-page anchor hash](https://en.wikipedia.org/wiki/Fragment_identifier)).

### Knowledge work as craft

Whether you're an attorney, a civil servant, or a web developer, in today's digital world, if you don't make sprockets for a living, there's a good chance that you're a knowledge worker. Your deliverable at the end of each day, doesn't actually exist beyond magnetic patterns on a hard disk. Through meetings, discussions, and drafting, you create organizational knowledge in one form or another.

Just as blacksmiths know the value of an anvil, and bakers the value of yeast, so too must knowledge workers embrace the tools of their craft. A composer would never stand for his or her concerto being played on a kazoo. Why then, is content all-too-often created haphazardly, with its presentation and preservation being subject to the whims of organizational habit?

The next time you begin a new project, adopt a high-fidelity, electronic medium that allows you to capture and expose process as a URL, today, and forever. Your content, your fellow knowledge workers, and the information's consumers deserve it.
