---
title: "Explain like I'm five: Jekyll collections"
excerpt: "Collections extends Jekyll's post and pages publishing functionality, and brings Jekyll's zen-like simplicity to all sorts of other types of content that aren't dated, but have a relationship with one another."
---

Collections are Jekyll's most powerful and simultaneously least understood feature. If you're not familiar with [Jekyll](http://jekyllrb.com/), Jekyll is a static site generator. Think of it like a content mangament system (CMS), [without all the complexity](http://developmentseed.org/blog/2012/07/27/build-cms-free-websites/) and headache. No need to build a giant content-strangling Rube Goldberg machine to "manage" content, if all you're doing at the end of the day is putting out HTML, Javascript, and CSS, the building blocks of the internet. As a result, Jekyll gets out of your way and [allows you to concentrate on what truly matters](http://ben.balter.com/2012/10/01/welcome-to-the-post-cms-world/): your content.

### Posts and pages

Most Jekyll sites are organized around two types of content, posts and pages.

* **[Posts](http://jekyllrb.com/docs/posts/)** are organized reverse chronologically. You might use them for blog posts on a personal blog, or articles on a news site. You can recognize a post by its filename. Posts live in the `_posts` folder, and are always named in the form of `YYYY-MM-DD-post-title.md`. Because posts are dated, they're traditionally not updated regularly once published.

* **[Pages](http://jekyllrb.com/docs/pages/)** are documents that don't have a relationship with one another. They can live anywhere within the site's source directory and don't have a set naming pattern. If you have a personal blog, you might have an `index.html` page ([the site's main page which is used to list posts](http://ben.balter.com/)), or [an about me page](http://ben.balter.com/about/), to name two examples. Because pages aren't date specific, pages are often updated over time to maintain accuracy.

The problem is, not everything you might want to publish using a Jekyll falls cleanly into the those two categories of content. That's where Jekyll's [collections](http://jekyllrb.com/docs/collections/) come in.

### Everything that's not a post or a page can be represented as a collection

Collections extends Jekyll's post- and page-publishing functionality, and brings Jekyll's zen-like simplicity to all sorts of other types of content that aren't dated, but have a set relationship with one another (hence the name, "collection"). If you're familiar with traditional CMS's, you can think of collections like [WordPress custom post types](http://codex.wordpress.org/Post_Types) or [Drupal custom content types](https://www.drupal.org/node/306792).

What then, might you use collections for? Let's say you're making a website for a bakery and want to list the different cupcakes varieties you sell. You might use a collection called "cupcakes". You'd create a `_cupcakes` folder, and would add `chocolate.md` or `vanilla.md` to it. And just like posts or pages, your list of cupcakes would be accessible as `site.cupcakes`. 

You wouldn't want to use posts here, because cupcakes aren't chronological, and likely wouldn't want to just use a page here, because it's a notably different animal than a document that lists your location and hours. Each cupcake in the cupcakes collection is related to one-another in the sense that they're all cupcakes.

## Collections in practice

But what if one day you decided to expand your offerings and sell cookies in addition to cupcakes. Simply introduce a "cookies" collection, adding `chocolate-chip.md` and `peanut-butter.md` to a `_cookies` directory, exposing the cookies as `site.cookies`. You'll notice the collections concept start to show its value here. Pages wouldn't make sense here, because you'd want to be able to list cupcakes and cookies separately, and besides for both being baked goods, the one cookie doesn't really share a relationship with a cupcake, at least not in the same sense that cookies share with one another.

For a more concrete example, take a look at [the source](https://github.com/github/choosealicense.com) for [choosealicense.com](http://choosealicense.com) a site which helps explain open source licenses like the MIT or GPL license. There are pages like "about" and "terms of service", but the actual licenses live in [a licenses collection](https://github.com/github/choosealicense.com/tree/gh-pages/_licenses) and are displayed via [a licensed page](https://github.com/github/choosealicense.com/blob/gh-pages/licenses.html).

### Using collections

The examples above were a slight simplification. There's one other step. Before you can use a collection, you need to tell Jekyll about it. Goin back to our bakery example above, I might have a `_config.yml` file that looks something like this:

```yml
collections:
  - cupcakes
  - cookies
```

The tells Jekyll to look in the `_cupcakes` and `_cookies` folders for documents, and to read them into the appropriate collection, including [YAML front matter](http://jekyllrb.com/docs/frontmatter/), just as it would posts (but again, without the date, because collection documents aren't date specific).

By default, collections are read in (and exposed as `site.[collection]`), but not included in the final site, at least not individually like you might expect posts or pages to. If you wanted a page for each type of cupcake, you'd have to modify the `_config.yml` a bit:

```yml
collections:
  cupcakes:
    output: true
    permalink: /cupcakes/:path/
```

That way, `_cupcakes/chocolate.md` is outputted as `cupcakes/chocolate/index.html` when the site is built and would be accessable as `example.com/cupcakes/chocolate/.


 As I noted in [the original pitch](https://github.com/jekyll/jekyll/issues/1941),
