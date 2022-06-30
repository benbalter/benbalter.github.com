---
title: Helpful 404s for Jekyll (and GitHub Pages)
description: How to implement 404 (not found) pages for Jekyll and GitHub pages that automatically suggest similar URLs to the one requested based on your site's sitemap.xml.
---

While the internet has long had a soft spot for [clever `404` pages](https://www.pagecloud.com/blog/best-404-pages), it's rare to see one that's actually *helpful*, especially for static sites like Jekyll or GitHub Pages that make dynamic searches more difficult. Great 404 pages should help visitors find what they're looking.

Here's how I updated the `404` (not found) pages on my own site to resolve typos and suggest other pages potentially relevant to the visitor's intended URL, in case you'd like to implement the same or similar functionality on your own site:

## How my 404 page suggests alternate URLs

If you were to click an invalid link or typo a URL on my site, the following would occur:

1. You'd see a `404` (not found) page[^1]
2. Your browser would retrieve and parse my site's [`sitemap.xml`](/sitemap.xml)[^2]
3. Your browser would find the valid path that has the shortest [edit distance](https://en.wikipedia.org/wiki/Levenshtein_distance) from the path you requested
4. Your browser would update the `404` page with a link to the suggested path

## What it looks like

Let's say you tried to navigate to a path that doesn't exist like [`/2022/06/30/unhelpful-404s-for-jekyll`](/2022/06/30/unhelpful-404s-for-jekyll){: data-proofer-ignore="true" data-turbo="false" }. Along with a list of recent posts, the experience, would look something like this:

<div class="alert alert-primary lead text-center" role="alert">
  The page you are trying to view does not exist. <br />
  <strong>Perhaps you're looking for <a href="/2022/06/30/helpful-404s-for-jekyll-and-github-pages/">/2022/06/30/helpful-404s-for-jekyll-and-github-pages/</a>?</strong>
</div>

## How it works

This functionality is driven by a deceptively small amount of JavaScript ([really TypeScript](https://github.com/benbalter/retlab/blob/main/js/script.ts)):

```typescript
import { closest } from 'fastest-levenshtein';

const div = document.getElementById('four-oh-four-suggestion');
if (div) {
  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.status === 200) {
      const xml = xhr.responseXML;
      const urls = Array.from(xml.querySelectorAll('urlset > url > loc')).map((el) => el.textContent);
      const url = new URL(closest(window.location.href, urls));
      div.innerHTML = `<a href="${url.href}">${url.pathname}</a>`;
    } else {
      div.innerHTML = '<a href="/">/</a>';
    }
  };

  xhr.open('GET', `${window.location.protocol}//${window.location.host}/sitemap.xml`);
  xhr.send();
}
```

### The v0.1

Could it be written better? Absolutely (but it works!). For now, I'm using [`fastest-levenshtein`](https://github.com/ka-weihe/fastest-levenshtein) to find the closest path to the one requested, and the lower level `XMLHttpRequest` and `querySelectorAll` to retrieve and parse the XML sitemap.

Along with better error handling, this could also be implemented with the more modern `fetch` API to retrieve the sitemap and something like [`fast-xml-parser`](https://github.com/NaturalIntelligence/fast-xml-parser) to more properly parse the XML, but my modern JavaScript knowledge is limited.[^3] If you'd like to take a pass at a better implementation, [pull requests are always welcome](https://github.com/benbalter/retlab/edit/main/js/script.ts).

## Conclusion

When I click on a broken link, the site that I land on should point me in the right direction. After all typo'd or updated URLs are not uncommon, and the site I'm visiting knows more about the site's content and structure than I ever will. While it's still true that [everything should have a URL](/2015/11/12/why-urls/), sometimes those URLs change or get lost in translation. Although you might hope a visitor would never see one, great 404 pages go that extra step and help visitors find what they're looking for. If you're interested in implementing the same functionality on your own site, the code above is part of the [`retlab` Jekyll theme](https://github.com/benbalter/retlab), and is licensed under [The MIT License](https://github.com/benbalter/retlab/blob/main/LICENSE.txt).

[^1]: When a visitor tries to access a URL that does not exist, GitHub Pages [will serve the `404.html` file in the site's root directory](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site), if one exists.
[^2]: Generated automatically by [the Jekyll Sitemap plugin](https://github.com/jekyll/jekyll-sitemap). The same implementation would work with any other static site (or static site generator), so long as your site has a comprehensive `sitemap.xml`.
[^3]: I'm proud to say that no `jQuery` was harmed in the making of this functionality.
