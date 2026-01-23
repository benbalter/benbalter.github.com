---
applyTo: ["_layouts/**/*.html", "_includes/**/*.html"]
---

# Jekyll Templates Instructions

When working with Jekyll layouts and includes, follow these guidelines:

## Liquid Templates

* Use `{% include_cached %}` for frequently included partials to improve build performance
* Use descriptive variable names that match the project style
* Leverage site variables from `_config.yml` via `site.*` properties
* Use Liquid filters appropriately: `markdownify`, `strip_html`, `truncate`, `date`, etc.

## Template Structure

### Layouts (`_layouts/`)

* Layouts define page templates and inherit from other layouts
* Use `{{ content }}` to include page content
* Keep layouts focused on structure, not content
* Extract reusable components to includes

### Includes (`_includes/`)

* Includes are reusable HTML/Liquid snippets
* Accept parameters via `include.param_name`
* Keep includes small and focused on a single purpose
* Use `include_cached` for includes without dynamic parameters

## HTML Best Practices

* Ensure proper HTML structure and semantic markup
* Include accessibility attributes (alt text, ARIA labels, etc.)
* Use Bootstrap classes appropriately (site uses Bootstrap)
* Maintain responsive design (mobile-first approach)
* Keep selectors specific but not overly complex

## Common Liquid Patterns

```liquid
{% comment %} Iterate over posts {% endcomment %}
{% for post in site.posts limit: 5 %}
  <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}

{% comment %} Conditional content {% endcomment %}
{% if page.comments %}
  {% include comments.html %}
{% endif %}

{% comment %} Date formatting {% endcomment %}
{{ page.date | date: "%B %-d, %Y" }}

{% comment %} Markdownify content {% endcomment %}
{{ page.description | markdownify }}
```

## Testing

* Run `rake build` to ensure templates compile successfully
* Run `rake test` to validate HTML output with html-proofer
* Check for accessibility issues
* Verify responsive design works across viewports

## Performance

* Use `include_cached` for static includes
* Minimize Liquid logic in templates
* Cache expensive operations when possible
* Keep HTML output clean and minimal
