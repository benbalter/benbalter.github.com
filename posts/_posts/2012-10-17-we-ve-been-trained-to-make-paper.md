---
title: "We've been trained to make paper"
description: "If the internet is the primary medium by which content is consumed, shouldn't that be the primary medium for which content is prepared?"
author: "Benjamin J. Balter"
layout: post
comments: true
category: 
tags: 
published: false

---

We've been trained wrong. We've been trained that content creation starts by firing up a desktop word processor — a piece of software that generates a digital representation of a physical piece of paper, margins, page breaks, and all — yet in a world where we all cary an entire computer in our pockets at all times, we end up just building for an edge case. We're stuck in yesterday's workflows. 

The typical collaborative publishing workflow goes something like this:

1. Draft content in Microsoft Word
2. Save to shared folder or e-mail around for comments and changes
3. Manually (and opaquely) reconsile changes one-by-one
4. Repeat steps 2-3 until satisfied with the document
5. **Convert to web-friendly format**
6. Publish

Microsoft Word was designed with one purpose: to make paper. You're taught in grade school (or high school or college or work or wherever) to format documents (conveniently displayed as metaphorical pages) for print. You just open up Word and start typing. There's left align, right align, etc. front and center, but internety things like hyperlinks or rich media are burried deep inside confusing sub-menus. It's a workflow that arose before the age of the web. 

If the internet is the primary medium by which content is consumed, shouldn't that be the primary medium for which content is prepared?


But the majority of the time the documents we publish are web-first, or never see the physical space. They don't care about page margin, page breaks, or other things that are specific to print. They also don't handle classes, IDs, or othe web-specific features.

Put another way, we're still building content for print, and then once we're done, prepareing it for web. That's broken. 

And then there's the problem of version control. I can't count the number of times I've been e-mailed a document titled `foo-document_2012_10_15_clean_fixed_revised_final` and told that it "on the share drive" or asked "are you out yet?". What happend with that change I submitted? What updates does this version have? Is this the most recent version? What were the last three changes? Not to mention, I have a crazy idea, can I make a parallel version? Can two people edit it at the same time?

Geeks solved this problem a long time ago. It's called version control. We built it in the 70's. We take content, you edit it, I edit it, we get better content. It's really that simple, and better yet, it's free.

Why doesn't everyone use this "version control"? Because you've got to break free of the proprietary formats. You've got to unprogram how you've been trained. You've got to get out of Word, or Excel, or PDF and start concentrating on pure content. Text. Markdown. YAML.

When you separate design from content, things get a lot easier. Make a change? I can see that down to the letter.

.coc files are like tiny micro-jails for content and it's time for a jail break.