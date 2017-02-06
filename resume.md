---
author: Benjamin J. Balter
title: Resume
description: Ben Balter is an attorney, an open source developer, and a Product Manager at GitHub, the world's largest software development network.
layout: page
permalink: /resume/
seo:
  type: person
degrees:
  - school: The George Washington University Law School
    degree: Juris Doctorate
    date: 2013-05-01
  - school: The George Washington University School of Business
    degree: Master of Business Administration — Strategic Management and Public Policy
    date: 2013-05-01
  - school: The George Washington University
    degree: Bachelor of Arts, Political Science
    date: 2009-05-01
certifications:
  - authority: Bar Association of the District of Columbia
    name: Member, license 1021576
  - authority: WSET — Wine & Spirit Education Trust
    name: Level 3 Award in Wines and Spirits (QCF)
---

### Experience

{% assign positions=site.resume_positions | sort: "start_date" %}
{% for position in positions reversed %}

{% unless position.employer == previous_employer %}

#### {{ position.employer }}

{% endunless %}

##### {{ position.title }}

<div class="date">
  {{ position.start_date | date: '%B %Y' }} &mdash; {% if position.end_date %}{{ position.end_date | date: '%B %Y' }}{% else %}Present{% endif %}
</div>

{{ position.output }}

{% assign previous_employer=position.employer %}
{% endfor %}

### Education

{% for degree in page.degrees %}

#### {{ degree.school }}

<div class="date">{{ degree.date | date: "%B %Y" }}</div>
{{ degree.degree }}
{% endfor %}

### Certifications

{% for certification in page.certifications %}

#### {{ certification.authority }}

{{ certification.name }}
{% endfor %}
