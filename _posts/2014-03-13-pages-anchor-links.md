---
title: Header hover anchor links on GitHub Pages using Jekyll
description: Encourage deep-linking of content by providing anchor links when a user hovers over a heading in your Jekyll posts and pages
---

If you've ever read a markdown file on GitHub, you may have noticed that hovering over a heading produces a visible, clickable anchor link. This is incredibly useful if you want to link someone to a particular heading or section, rather than the page as a whole, a practice known as "deep linking" of content.

When you send someone one of the resulting anchor URLs, which includes the name of the linked heading, upon clicking the link, the user will automatically scroll to the desired part of the page, and thus be directed to the exact content you want them to see.

As long as you're using Jekyll and authoring your content in Markdown, you can actually achieve this feature on GitHub Pages much easier than you might expect:

**Edit (5/10/2015):** @bryanbraun has created the awesome AnchorJS library. I'd suggest you [just use that](https://github.com/bryanbraun/anchorjs#installation), instead of creating your own implementation.

### Font Awesome and jQuery

First, you'll want [jQuery](http://jquery.com/) and [Font Awesome](http://fortawesome.github.io/Font-Awesome/) included in your site template, if they aren't already.

jQuery, a JavaScript library, helps you select all the headers programmatically, and Font Awesome, an icon library, provides the link icon that the user sees.

There are a handful of ways to do this, but the easiest is to add the following in your template's `<head>` section:

```html
<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
```

### The CSS

We need to tell the browser how to position the link icon, and to only display it when the visitor hovers over your heading. You'll want to add the following to your site's CSS file:

```css
.header-link {
  position: absolute;
  left: -0.5em;
  opacity: 0;

  \-webkit-transition: opacity 0.2s ease-in-out 0.1s;
  \-moz-transition: opacity 0.2s ease-in-out 0.1s;
  \-ms-transition: opacity 0.2s ease-in-out 0.1s;
}

h2:hover .header-link,
h3:hover .header-link,
h4:hover .header-link,
h5:hover .header-link,
h6:hover .header-link {
  opacity: 1;
}
```

### The JavaScript

Last, to tie everything together, you'll also need a bit of JavaScript magic client side, by adding the following to your site's footer:

```html
<script>
$(function() {
  return $("h2, h3, h4, h5, h6").each(function(i, el) {
    var $el, icon, id;
    $el = $(el);
    id = $el.attr('id');
    icon = '<i class="fa fa-link"></i>';
    if (id) {
      return $el.prepend($("<a />").addClass("header-link").attr("href", "#" + id).html(icon));
    }
  });
});
</script>
```

And that's it! You can see the result on this page if you hover over any heading. Click the link to update your URL bar, and you'll have a shareable, deep-linked URL.

Happy deep linking!
