---
title: Other recommended reading
description: Here are some of the books that have had a significant influence on my career, management style, and professional development that I often recommend to others interested in [IT management and leadership](#it-management-and-leadership), [career and corporate life](#career-and-corporate-life), [open source](#open-source), [startups and innovation](#startups-and-innovation), [information security](#information-security), [product management](#product-management), [marketing](#marketing), [technology policy](#technology-policy), [government and organizing](#government-and-organizing), and [everything else](#everything-else).
layout: page
permalink: /other-recommended-reading/
redirect_from: 
  - /books/
  - /books-for-geeks/
  - /recommended-reading/
service_version: 20070822
books_per_row: 3
---

{% comment %}
  Looking to edit the list of books? See https://git.io/vKfSv.
{% endcomment %}

<div class="lead mb-2">
  {{ page.description | markdownify | smartify | replace:"a href=",'a class="link-secondary" href=' }}
</div>

{% for group in site.data.books %}

<h3 id="{{ group[0] | slugify }}" class="book-group">{{ group[0] }}</h3>

  {% for book in group[1] %}
    {% assign column_number = forloop.index0 | modulo:page.books_per_row %}

    {% if column_number == 0 %}
      <div class="row pt-2">
    {% endif %}

    <div class="col-md-{{ 12 | divided_by:page.books_per_row }} text-center">
      <a href="https://www.amazon.com/gp/product/{{ book.asin }}/?tag={{ site.amazon.affiliates_tag }}">
        <div class="mb-2">
          <img
            src="http://images.amazon.com/images/P/{{ book.asin }}.01.MZZZZZZZ.jpg"
            alt="{{ book.title | mardownify | strip_html }}"
          />
        </div>

        <div class="title font-weight-bold min-y-5">
          {{ book.title | mardownify }}
        </div>
      </a>

      <div class="small text-justify">
        {{ book.tldr | markdownify }}
      </div>
    </div>

    {% if column_number == 2 or forloop.rindex == 1 %}
      </div>
    {% endif %}
  {% endfor %}
{% endfor %}
