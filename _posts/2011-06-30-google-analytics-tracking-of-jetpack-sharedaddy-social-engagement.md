---
id: 1507
author: 1
date: 2011-06-30 14:46:53
date_gmt: 2011-06-30 18:46:53
title: >
  Google Analytics Tracking of JetPack
  (Sharedaddy) Social Engagement
excerpt: >
  Google recently added social engagement
  tracking to its analytics suite. With a
  little bit of leg work, Google Analytics
  can track not only +1s, but also
  Facebook and Twitter shares via a simple
  _gaq.push call.
status: publish
comment_status: open
ping_status: open
password:
name: >
  google-analytics-tracking-of-jetpack-sharedaddy-social-engagement
to_ping:
pinged: |
  
  http://yoast.com/wordpress/google-analytics/
modified: 2011-09-02 14:11:10
modified_gmt: 2011-09-02 18:11:10
content_filtered:
parent: 0
guid: http://ben.balter.com/?p=1507
menu_order: 0
type: post
mime_type:
comment_count: 11
ancestors: [ ]
filter: raw
category:
  - Technology
post_tag:
  - analytics
  - facebook
  - google
  - open source
  - plugin
  - social media
  - twitter
  - wordpress
post_format: [ ]
---
Google recently added [social engagement tracking][1] to its analytics suite. With a little bit of leg work, Google Analytics can track not only +1s, but also Facebook and Twitter shares via a simple `_gaq.push` call.

If your site uses WordPress’s JetPack plugin with Sharedaddy, and you already have [Google Analytics][2] up and running, you can use jQuery to attach the virtual event to the share button.

<!--more-->

To add Google Analytics to Sharedaddy’s Twitter share button:

<pre class="brush: jscript; title: ; notranslate" title="">$('a.share-twitter').click( function() {
_gaq.push( ['_trackSocial', 'twitter', 'share',
$(this).attr('href').substr(0, $(this).attr('href').indexOf('?'))]);
});
</pre>

…and for Facebook:

<pre class="brush: jscript; title: ; notranslate" title="">$('a.share-facebook').click( function() {
_gaq.push( ['_trackSocial', 'faceboook', 'share',
$(this).attr('href').substr(0, $(this).attr('href').indexOf('?'))]);
});
</pre>

The above code simply listens for the share button to be clicked, and if so, passes the target URL back to Google, along with the service’s name. Putting it all together into a plugin with a hook to `<del>wp_head</del> wp_footer` you get:

<pre class="brush: php; title: ; notranslate" title="">&lt;?php
/**
 * Plugin Name: Jetpack (Sharedaddy) Google Analytics Tracking
 * Description: Allows tracking of Facebook and Twitter shares in Google Analytics Social Tracking
 * Author: Benjamin J. Balter
 * Author URI:  http://ben.balter.com
 * Version: 0.1
 */

 /**
  * Outputs javascript to document footer
  */
function bb_ga_social_footer() { ?&gt;

&lt;script&gt;
	jQuery(document).ready(function($) {

		//twitter
		$('a.share-twitter').click(function(){
		_gaq.push( ['_trackSocial', 'twitter', 'share',
		$(this).attr('href').substr(0, 	$(this).attr('href').indexOf('?'))]);
		});

		//facebook
		$('a.share-facebook').click( function() {
		_gaq.push( ['_trackSocial', 'faceboook', 'share',
		$(this).attr('href').substr(0, $(this).attr('href').indexOf('?'))]);
		});

	});
&lt;/script&gt;

&lt;?php }

//add our hook with higher-than-default priority
add_action('wp_footer', 'bb_ga_social_footer', 20)

/**
 * Require WP to load jQuery if not already loaded
 * h/t @Ramoonus
 */
function bb_ga_social_enqueue() {
	wp_enqueue_script(&quot;jquery&quot;);
}

//add hook to enqueue jQuery on load
add_action('init', 'bb_ga_social_enqueue');
?&gt;
</pre>

The code should work out of the box with the standard share buttons (seen below), but can easily be adapted with a few minor modifications to apply to like and other iterations of the social media icons.

More details on the tracking code can be found over in the [Google Analytics Social Engagement Documentation][3]. Improve the code to work with your site? Feel free to [fork the gist][4] and contribute it back.

**Update:** <del>Dedicated reader</del> All-around rabble-rouser [Andrew Nacin][5] points out that by default, jQuery is queued up into the footer. Updated the above code to hook into `wp_footer` with a priority of 20 (higher than jQuery’s 10 hook).

**Update:**Special thanks to [@Ramoonus][6] for [didn’t queue up jQuery][7].

 [1]: http://mashable.com/2011/06/30/google-analytics-social-plugin/
 [2]: http://yoast.com/wordpress/google-analytics/
 [3]: http://code.google.com/apis/analytics/docs/tracking/gaTrackingSocial.html
 [4]: https://gist.github.com/1058469
 [5]: http://andrewnacin.com
 [6]: http://twitter.com/Ramoonus
 [7]: https://gist.github.com/1058469/db96b6836f279811205bddbf8be67bec6ca2159c