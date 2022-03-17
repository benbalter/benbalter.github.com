---
title: What to read before starting (or interviewing) at GitHub
description: If you're starting (or preparing for an interview) at GitHub, here are a few of my favorite posts to help you understand how GitHub works, its culture and communication patterns, and what it's like to be a GitHubber.
posts:
  - /2014/11/06/rules-of-communicating-at-github/
  - /2016/09/13/seven-habits-of-highly-effective-githubbers/
  - /2016/10/31/eight-things-i-wish-i-knew-my-first-week-at-github/
  - /2015/11/12/why-urls/
  - /2022/02/16/leaders-show-their-work/
  - /2017/05/23/seven-ways-to-consistently-ship-great-features/
  - /2015/11/18/tools-to-empower-open-collaboration/
  - /2020/08/14/tools-of-the-trade/
  - /2020/08/25/how-i-manage-github-notifications/
  - /2015/12/08/types-of-pull-requests/
roles:
  -  /2016/06/06/twelve-things-a-product-manager-does/
  -  /2021/03/26/nine-things-a-technical-program-manager-does/
  -  /2022/03/09/seven-things-a-corporate-chief-of-staff-does/
---

Over the years I've written a number of posts about GitHub's culture and communication patterns. If you're joining (or preparing for an interview at) GitHub, here are some of my favorite posts that might help you understand how GitHub works and what it's like to be a GitHubber:

{% for url in page.posts %}
{%- assign post=site.posts | where:"url",url | first -%}
* **[{{ post.title }}]({{ post.url | absolute_url }})** ({{ post.date | date: "%Y" }}) — {{ post.description | markdownify | strip_html }}
{% endfor %}

And if you're a Product Manager, Technical Program Manager, or Chief of Staff:

{% for url in page.roles %}
{%- assign post=site.posts | where:"url",url | first -%}
* **[{{ post.title }}]({{ post.url | absolute_url }})** ({{ post.date | date: "%Y" }}) — {{ post.description | markdownify | strip_html }}
{% endfor %}

Of course, these opinions are [my own](https://ben.balter.com/fine-print/), and please take the publication date in mind when reading. GitHub (and I) have changed a lot since 2013, and as organizations grow and mature, cultures and communication patterns naturally evolve. If you have any questions, feel free to reach out on Slack, Twitter, or the comments below.
