---
layout: none
---
window.github_results_index = {
{% for page in site.pages %}
  {{ page.path | jsonify }}: {
    url: {{ page.url | jsonify }},
    title: {{ page.title | jsonify }}
  },
{% endfor %}
{% for post in site.posts %}
  {{ post.path | jsonify }}: {
    url: {{ post.url | jsonify }},
    title: {{ post.title | jsonify }}
  }{% unless forloop.last %}, {% endunless %}
{% endfor %}
}
