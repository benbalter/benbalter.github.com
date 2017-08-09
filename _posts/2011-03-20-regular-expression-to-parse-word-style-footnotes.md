---
title: Regular Expression to Parse Word-style Footnotes into WordPress's Simple Footnotes Format
description: Regular Expression to automatically parse Microsoft Word's footnote format into a more web-friendly format for WordPress's Simple Footnotes plugin
---

I needed a quick-and-easy way to parse Microsoft Word’s footnote format into a more web-friendly format for a recent project. After a bit of regular expression hacking, I was able to build a WordPress plugin to automatically convert content pasted from Word into a format readable by [Andrew Nacin’s](http://andrewnacin.com) popular [Simple Footnotes](http://andrewnacin.com/2010/07/24/simple-footnotes-0-3/) plugin.

The process is surprisingly simple given [WordPress’s extensive filter API](http://codex.wordpress.org/Plugin_API/Filter_Reference){: data-proofer-ignore="true" }. First, to grab the footnotes from Word’s `ftnref` format:

```php
<?php
//grab all the Word-style footnotes into an array
$pattern = '#&lt;a href\\="#_ftnref([0–9-]+)">\[([0–9-]+)]</a> (.\*)#';
preg_match_all( $pattern, $content, $footnotes, PREG_SET_ORDER);
?>
```

This creates an array (`$footnotes`) with the both the footnote number and the text of the footnote. We then need a way to replace the in-text reference with the parsed footnotes so that Simple Footnotes can understand them. I did this by creating two arrays, a find array and a replace array with each Word-style footnote reference and its Simple Footnote formatted counterpart:

```php
<?php
//build find and replace arrays
foreach ($footnotes as $footnote) {
 $find\[] = '#&lt;a href\\="#_ftn'.$footnote[1].'">\['.$footnote[1].']</a>#';
 $replace\[] = '[ref]' . str_replace( array("\\r\\n", "\\r", "\\n"), "", $footnote[3]) . '[/ref]';
}
?>
```

Finally, so that the entire replacement can be done in a single pass, push a final find/replace pair into the end of the array, to remove the original footnotes:

```php
<?php
//remove all the original footnotes when done
$find[] = '#<div>\s*<a href\="\#_ftnref([0-9]+)">\[([0-9]+)\]</a> (.*)\s*</div>\s+#';
$replace[] = '';
?>
```

Because ₱’s `preg_replace` function can handle arrays, all we have to do is run a single function:

```php
<?php
$content = preg_replace( $find, $replace, $content );
?>
```

Putting it all together, including a filter hook to call our function and a `meta_value` flag to prevent parsing on subsequent saves, the result is:

<script src="http://gist-it.appspot.com/github/benbalter/Convert-Microsoft-Word-Footnotes-to-WordPress-Simple-Footnotes/raw/master/parse-footnotes.php"></script>

To use, you can [download the plugin file](https://github.com/benbalter/Convert-Microsoft-Word-Footnotes-to-WordPress-Simple-Footnotes)[^1] and activate (be sure you already have [Simple Footnotes][2] installed). Copy the content from Word, and Paste into the "*Paste from Word*“ box (may need to toggle the ”[*Kitchen Sink*](https://www.youtube.com/watch?v=fQ6cXXlLczU)".[^2]

Thoughts? Improvements? The above code solved a rather stubborn workflow problem in a project I was working on, and hopefully it can do the same for you. Feel free to use/improve the above code.

[^1]: Licensed under [GPLv2](http://wordpress.org/about/gpl/)

[^2]: You can even [Fork the plugin over on Github](//ben.balter.com/2011/03/20/regular-expression-to-parse-word-style-footnotes/)
