---
author: Benjamin J. Balter
title: "Regular Expression to Parse Word-style Footnotes into WordPress's Simple Footnotes Format"
excerpt: "Regular Expression to automatically parse Microsoft Word's footnote format into a more web-friendly format for WordPress's Simple Footnotes plugin"
layout: post
categories:
  - Technology
tags:
  - code
  - footnotes
  - hack
  - open source
  - plugin
  - wordpress
post_format: [ ]
---
I needed a quick-and-easy way to parse Microsoft Word's footnote format into a more web-friendly format for a recent project. After a bit of regular expression hacking, I was able to build a WordPress plugin to automatically convert content pasted from Word into a format readable by [Andrew Nacin's][1] popular [Simple Footnotes][2] plugin.  
  
The process is surprisingly simple given [WordPress's extensive filter API][3]. First, to grab the footnotes from Word's `ftnref` format:

<div>{% highlight php %}<?php

//grab all the Word-style footnotes into an array
$pattern = '#<a href\="\#_ftnref([0-9]+)">\[([0-9]+)\]</a> (.*)#';
preg_match_all( $pattern, $content, $footnotes, PREG_SET_ORDER);

?>{% endhighlight %}</div>

This creates an array (`$footnotes`) with the both the footnote number and the text of the footnote. We then need a way to replace the in-text reference with the parsed footnotes so that Simple Footnotes can understand them. I did this by creating two arrays, a find array and a replace array with each Word-style footnote reference and its Simple Footnote formatted counterpart:

<div>{% highlight php %}<?php

//build find and replace arrays
foreach ($footnotes as $footnote) {
  $find[] = '#<a href\="\#_ftn'.$footnote[1].'">\['.$footnote[1].'\]</a>#';
  $replace[] = '[ref]' . str_replace( array("\r\n", "\r", "\n"), "",   $footnote[3]) . '[/ref]';
}   

?>{% endhighlight %}</div>

Finally, so that the entire replacement can be done in a single pass, push a final find/replace pair into the end of the array, to remove the original footnotes:

<div>{% highlight php %}<?php

    //remove all the original footnotes when done
    $find[] = '#<div>\s*<a href\="\#_ftnref([0-9]+)">\[([0-9]+)\]</a> (.*)\s*</div>\s+#';
    $replace[] = '';

?>{% endhighlight %}</div>

Because PHP's `preg_replace` function can handle arrays, all we have to do is run a single function:

<div>{% highlight php %}<?php

$content = preg_replace( $find, $replace, $content );

?>{% endhighlight %}</div>
    
Putting it all together, including a filter hook to call our function and a `meta_value` flag to prevent parsing on subsequent saves, the result is:

<script src="http://gist-it.appspot.com/github/benbalter/Convert-Microsoft-Word-Footnotes-to-WordPress-Simple-Footnotes/raw/master/parse-footnotes.php">     </script>

To use, you can [download the plugin file][5][^1] and activate (be sure you already have [Simple Footnotes][2] installed). Copy the content from Word, and Paste into the "*Paste from Word*" box (may need to toggle the "[*Kitchen Sink*][6]".[^2]

Thoughts? Improvements? The above code solved a rather stubborn workflow problem in a project I was working on, and hopefully it can do the same for you. Feel free to use/improve the above code.

[^1]: Licensed under [GPLv2][10]
[^2]: You can even [Fork the plugin over on Github][8]

 [1]: http://andrewnacin.com
 [2]: http://andrewnacin.com/2010/07/24/simple-footnotes-0-3/
 [3]: http://codex.wordpress.org/Plugin_API/Filter_Reference
 [4]: #note-2020-1 "' . str_replace( array("\r\n", "\r", "\n"), "", $footnote[4]) . '"
 [5]: https://github.com/benbalter/Convert-Microsoft-Word-Footnotes-to-WordPress-Simple-Footnotes
 [6]: http://www.bloggingteacher.com/writing-posts-with-the-wordpress-visual-editor-the-kitchen-sink
 [7]: #note-2020-2 "Licensed under GPLv2"
 [8]: http://ben.balter.com/2011/03/20/regular-expression-to-parse-word-style-footnotes/
 
 [10]: http://wordpress.org/about/gpl/