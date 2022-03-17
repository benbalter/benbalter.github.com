---
title: Press
description: Select media clips of Ben Balter in the press talking about open source, open data, and government innovation.
layout: page
permalink: /press/
id: /press
---

*I regularly speak with the press about open source, open data, and innovation within government. Below are some highlights:*

<ul class="list-unstyled">
  {% assign clips = site.data.clips | sort: "date" | reverse %}
  {% for clip in clips %}
    <li class="mb-3">
      <a href="{{ clip.url }}" class="title" {% if clip.ignore_check %}data-proofer-ignore="true"{% endif %}>{{ clip.title }}</a><br />
      <span class="small">{{ clip.publication }} | <em>{{ clip.date | date: '%B %d, %Y' }}</em></span>
    </li>
  {% endfor %}
</ul>
