---
title: Press
excerpt: "Select media clips of Ben Balter in the press talking about open source, open data, and government innovation."
layout: page
permalink: /press/
id: /press
---

*I regularly speak with the press about open source, open data, and innovation within government. Below are some highlights:*

<ul id="clips">
{% for clip in site.data.clips | sort: "date" | reverse %}
  <li>
    <a href="{{ clip.url }}" class="title" {% if clip.ignore_check %}data-proofer-ignore="true"{% endif %}>{{ clip.title }}</a><br />
    <small><span class="publication">{{ clip.publication }}</span> — <em>{{ clip.date | date: '%B %d, %Y' }}</em></small>
  </li>
{% endfor %}
</ul>
