---
author: Benjamin J. Balter
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
layout: post
categories:
  - Technology
tags:
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

If your site uses WordPress's JetPack plugin with Sharedaddy, and you already have [Google Analytics][2] up and running, you can use jQuery to attach the virtual event to the share button.

To add Google Analytics to Sharedaddy's Twitter share button:

<div>{% highlight javascript %}
$('a.share-twitter').click( function() {
_gaq.push( ['_trackSocial', 'twitter', 'share',
$(this).attr('href').substr(0, $(this).attr('href').indexOf('?'))]);
});{% endhighlight %}</div>

…and for Facebook:

<div>{% highlight javascript %}
$('a.share-facebook').click( function() {
_gaq.push( ['_trackSocial', 'faceboook', 'share',
$(this).attr('href').substr(0, $(this).attr('href').indexOf('?'))]);
});{% endhighlight %}</div>

The above code simply listens for the share button to be clicked, and if so, passes the target URL back to Google, along with the service's name. Putting it all together into a plugin with a hook to <del>`wp_head`</del> `wp_footer` you get:

<script src="https://gist.github.com/1058469.js"> </script>

The code should work out of the box with the standard share buttons (seen below), but can easily be adapted with a few minor modifications to apply to like and other iterations of the social media icons.

More details on the tracking code can be found over in the [Google Analytics Social Engagement Documentation][3]. Improve the code to work with your site? Feel free to [fork the gist][4] and contribute it back.

**Update:** Dedicated reader All-around rabble-rouser [Andrew Nacin][5] points out that by default, jQuery is queued up into the footer. Updated the above code to hook into `wp_footer` with a priority of 20 (higher than jQuery's 10 hook).

**Update:** Special thanks to [@Ramoonus][6] for [didn't queue up jQuery][7].

 [1]: http://mashable.com/2011/06/30/google-analytics-social-plugin/
 [2]: http://yoast.com/wordpress/google-analytics/
 [3]: http://code.google.com/apis/analytics/docs/tracking/gaTrackingSocial.html
 [4]: https://gist.github.com/1058469
 [5]: http://andrewnacin.com
 [6]: http://twitter.com/Ramoonus
 [7]: https://gist.github.com/1058469/db96b6836f279811205bddbf8be67bec6ca2159c