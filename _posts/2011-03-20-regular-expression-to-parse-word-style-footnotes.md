---
id: 1142
author: Benjamin J. Balter
date: 2011-03-20 12:24:25
date_gmt: 2011-03-20 16:24:25
title: "Regular Expression to Parse Word-style Footnotes into WordPress's Simple Footnotes Format"
excerpt: "Regular Expression to automatically parse Microsoft Word's footnote format into a more web-friendly format for WordPress's Simple Footnotes plugin."
status: publish
comment_status: open
ping_status: open
password:
name: >
  regular-expression-to-parse-word-style-footnotes
to_ping:
pinged: |
  http://andrewnacin.com/2010/07/24/simple-footnotes-0-3/
  http://www.bloggingteacher.com/writing-posts-with-the-wordpress-visual-editor-the-kitchen-sink
modified: 2012-02-05 11:52:21
modified_gmt: 2012-02-05 16:52:21
content_filtered:
parent: 0
guid: http://ben.balter.com/?p=1142
menu_order: 0
type: post
mime_type:
comment_count: 29
ancestors: [ ]
filter: raw
layout: post
category:
  - Technology
post_tag:
  - code
  - footnotes
  - hack
  - open source
  - plugin
  - wordpress
post_format: [ ]
---
I needed a quick-and-easy way to parse Microsoft Word’s footnote format into a more web-friendly format for a recent project. After a bit of regular expression hacking, I was able to build a WordPress plugin to automatically convert content pasted from Word into a format readable by [Andrew Nacin’s][1] popular [Simple Footnotes][2] plugin.  
<!--more-->

  
The process is surprisingly simple given [WordPress’s extensive filter API][3]. First, to grab the footnotes from Word’s `ftnref` format:

<pre class="brush: php; title: ; notranslate" title="">//grab all the Word-style footnotes into an array
$pattern = '#&lt;a href\=&quot;\#_ftnref([0-9]+)&quot;&gt;\[([0-9]+)\]&lt;/a&gt; (.*)#';
preg_match_all( $pattern, $content, $footnotes, PREG_SET_ORDER);
</pre>

This creates an array (`$footnotes`) with the both the footnote number and the text of the footnote. We then need a way to replace the in-text reference with the parsed footnotes so that Simple Footnotes can understand them. I did this by creating two arrays, a find array and a replace array with each Word-style footnote reference and its Simple Footnote formatted counterpart:

<pre class="brush: php; title: ; notranslate" title="">//build find and replace arrays
foreach ($footnotes as $footnote) {
    $find[] = '#&lt;a href\=&quot;\#_ftn'.$footnote[1].'&quot;&gt;\['.$footnote[1].'\]&lt;/a&gt;#';
    $replace[] = '[ref]' . str_replace( array(&quot;\r\n&quot;, &quot;\r&quot;, &quot;\n&quot;), &quot;&quot;, $footnote[3]) . '[/ref]';
}
</pre>

Finally, so that the entire replacement can be done in a single pass, push a final find/replace pair into the end of the array, to remove the original footnotes:

<pre class="brush: php; title: ; notranslate" title="">//remove all the original footnotes when done
$find[] = '#&lt;div&gt;\s*&lt;a href\=&quot;\#_ftnref([0-9]+)&quot;&gt;\[([0-9]+)\]&lt;/a&gt; (.*)\s*&lt;/div&gt;\s+#';
$replace[] = '';
</pre>

Because PHP’s `preg_replace` function can handle arrays, all we have to do is run a single function:

<pre class="brush: php; title: ; notranslate" title="">$content = preg_replace( $find, $replace, $content );
</pre>

Putting it all together, including a filter hook to call our function and a `meta_value` flag to prevent parsing on subsequent saves, the result is:

<pre class="brush: php; title: ; notranslate" title="">/*
Plugin Name: Convert Footnotes
Plugin URI: http://ben.balter.com/2011/03/20/regular-expression-to-parse-word-style-footnotes/
Description: Converts Word Footnotes to Simple Footnotes format. Requires Simple Footnotes installed, available at: http://wordpress.org/extend/plugins/simple-footnotes/
Version: 0.1
Author: Benjamin J. Balter
Author URI: http://ben.balter.com/
Revised by Marc Chehab: http://www.marcchehab.org/
*/

/**
 * Function which uses regular expression to parse Microsoft Word footnotes
 * into WordPress's Simple Footnotes format
 *
 * @link http://ben.balter.com/2011/03/20/regular-expression-to-parse-word-style-footnotes/
 * @param string $content post content from filter hook
 * @returns string post content with parsed footnotes
 */

function bb_parse_footnotes( $content ) {

	global $post;
	if ( !isset( $post ) )
		return;

	//if we have already parsed, kick
	if ( get_post_meta($post-&gt;ID, 'parsed_footnotes') )
		return $content;

	$content = stripslashes( $content );

	//grab all the Word-style footnotes into an array
	$pattern = '/\&lt;a( title\=\&quot;\&quot;)? href\=\&quot;[^\&quot;]*\#_ftnref([0-9]+)\&quot;\&gt;\[([0-9]+)\]\&lt;\/a\&gt;(.*)/';
	preg_match_all( $pattern, $content, $footnotes, PREG_SET_ORDER);

	//build find and replace arrays
	foreach ($footnotes as $footnote) {
		$find[] = '/\&lt;a( title\=\&quot;\&quot;)? href\=\&quot;[^\&quot;]*\#_ftn'.$footnote[2].'\&quot;\&gt;(\&lt;strong\&gt;)?\['.$footnote[2].'\](\&lt;\/strong\&gt;)?\&lt;\/a\&gt;/';
		$replace[] = ' <a class="simple-footnote" title="&#039; . str_replace( array(&quot;\r\n&quot;, &quot;\r&quot;, &quot;\n&quot;), &quot;&quot;, $footnote[4]) . &#039;" id="return-note-2020-1" href="#note-2020-1"><sup>1</sup></a>';
	}

	//remove all the original footnotes when done
	$find[] = '/\&lt;div\&gt;\s*(\&lt;p\&gt;)?\&lt;a( title\=\&quot;\&quot;)? href\=\&quot;[^\&quot;]*\#_ftnref([0-9]+)\&quot;\&gt;\[([0-9]+)\]\&lt;\/a\&gt;(.*)\s*\&lt;\/div\&gt;\s+/s';
	$replace[] = '';

	//make the switch
	$content = preg_replace( $find, $replace, $content );

	//add meta so we know it has been parsed
	add_post_meta($post-&gt;ID, 'parsed_footnotes', true, true);

	return addslashes($content);
}


add_filter( 'content_save_pre', 'bb_parse_footnotes' );
</pre>

To use, you can [download the plugin file][4] and activate (be sure you already have [Simple Footnotes][2] installed). Copy the content from Word, and Paste into the “*Paste from Word*” box (may need to toggle the “[*Kitchen Sink*][5]“.

Thoughts? Improvements? The above code solved a rather stubborn workflow problem in a project I was working on, and hopefully it can do the same for you. Feel free to use/improve the above code. <a class="simple-footnote" title="Licensed under GPLv2" id="return-note-2020-2" href="#note-2020-2"><sup>2</sup></a> You can even [Fork the plugin over on Github][6].

<div class="simple-footnotes">
  <p class="notes">
    Notes:
  </p>
  
  <ol>
    <li id="note-2020-1">
      ' . str_replace( array(&quot;\r\n&quot;, &quot;\r&quot;, &quot;\n&quot;), &quot;&quot;, $footnote[4]) . ' <a href="#return-note-2020-1">↩</a>
    </li>
    <li id="note-2020-2">
      Licensed under <a href="http://wordpress.org/about/gpl/">GPLv2</a> <a href="#return-note-2020-2">↩</a>
    </li>
  </ol>
</div>

 [1]: http://andrewnacin.com
 [2]: http://andrewnacin.com/2010/07/24/simple-footnotes-0-3/
 [3]: http://codex.wordpress.org/Plugin_API/Filter_Reference
 [4]: https://github.com/benbalter/Convert-Microsoft-Word-Footnotes-to-WordPress-Simple-Footnotes
 [5]: http://www.bloggingteacher.com/writing-posts-with-the-wordpress-visual-editor-the-kitchen-sink
 [6]: http://ben.balter.com/2011/03/20/regular-expression-to-parse-word-style-footnotes/