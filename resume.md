---
title: Resume
description: Ben Balter is an attorney, an open source developer, and a Technical Program Manager at GitHub, the world's largest software development network.
layout: page
permalink: /resume/
redirect_from: /cv/
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
  - authority: International Information System Security Certification Consortium (ISC)²
    name: Certified Information Systems Security Professional (CISSP)
    url: https://www.credly.com/badges/1a8b31f1-3727-4acf-a6a8-8d67af9ecb23
  - authority: International Information System Security Certification Consortium (ISC)²
    name: Systems Security Certified Practitioner (SSCP)
    url: https://www.credly.com/badges/7eb85996-c7fc-4c68-95df-fcd33ec445ba/
  - authority: Wine & Spirit Education Trust (WSET)
    name: Level 3 (Advanced) Award in Wines
  - authority: Regulatory Council of Jerez-Xérès Sherry Denomination of Origin
    name: Certified Sherry Wine Specialist (CSWS) - Intermediate
  - authority: Professional Association of Diving Instructors (PADI)
    name: Open water diver
---

## Experience

{% assign positions=site.resume_positions | sort: "start_date" %}
{% for position in positions reversed %}

{% unless position.employer == previous_employer %}

### {{ position.employer }}

{% endunless %}

<div class="row">
  <div class="col">
    <h5>{{ position.title }}</h5>
  </div>
  <div class="col-md-4 text-end">
    {{ position.start_date | date: '%B %Y' }} &mdash; {% if position.end_date %}{{ position.end_date | date: '%B %Y' }}{% else %}Present{% endif %}
  </div>
</div>

{{ position.output }}

{% assign previous_employer=position.employer %}
{% endfor %}

## Education

{% for degree in page.degrees %}

##### {{ degree.school }}

<div class="row">
  <div class="col">
    {{ degree.degree }}
  </div>
  <div class="col-md-4 text-end">
    {{ degree.date | date: "%B %Y" }}
  </div>
</div>

{% endfor %}

## Certifications

{% for certification in page.certifications %}

##### {{ certification.authority }}

{% if certification.url %} <a href="{{ certification.url }}">{{ certification.name }}</a>
{% else %}
{{ certification.name }}
{% endif %}
{% endfor %}
