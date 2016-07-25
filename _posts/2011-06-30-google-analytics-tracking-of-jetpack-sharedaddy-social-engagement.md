---
title: 'Google Analytics Tracking of JetPack (Sharedaddy) Social Engagement

'
description: Google recently added social engagement tracking to its analytics suite. With a little bit of leg work, Google Analytics can track not only +1s, but also Facebook and Twitter shares via a simple _gaq.push call.
---

Google recently added [social engagement tracking](http://mashable.com/2011/06/30/google-analytics-social-plugin/) to its analytics suite. With a little bit of leg work, Google Analytics can track not only +1s, but also Facebook and Twitter shares via a simple `_gaq.push` call.

If your site uses WordPress's JetPack plugin with Sharedaddy, and you already have [Google Analytics](http://yoast.com/wordpress/google-analytics/) up and running, you can use jQuery to attach the virtual event to the share button.

To add Google Analytics to Sharedaddy's Twitter share button:

<div>```javascript
$('a.share-twitter').click( function() {
_gaq.push( ['_trackSocial', 'twitter', 'share',
$(this).attr('href').substr(0, $(this).attr('href').indexOf('?'))]);
});```</div>

…and for Facebook:

<div>```javascript
$('a.share-facebook').click( function() {
_gaq.push( ['_trackSocial', 'faceboook', 'share',
$(this).attr('href').substr(0, $(this).attr('href').indexOf('?'))]);
});```</div>

The above code simply listens for the share button to be clicked, and if so, passes the target URL back to Google, along with the service's name. Putting it all together into a plugin with a hook to <del>`wp_head`</del> `wp_footer` you get:

<script src="https://gist.github.com/1058469.js"> </script>

The code should work out of the box with the standard share buttons (seen below), but can easily be adapted with a few minor modifications to apply to like and other iterations of the social media icons.

More details on the tracking code can be found over in the [Google Analytics Social Engagement Documentation](http://code.google.com/apis/analytics/docs/tracking/gaTrackingSocial.html). Improve the code to work with your site? Feel free to [fork the gist](https://gist.github.com/1058469) and contribute it back.

**Update:** Dedicated reader All-around rabble-rouser [Andrew Nacin](http://andrewnacin.com) points out that by default, jQuery is queued up into the footer. Updated the above code to hook into `wp_footer` with a priority of 20 (higher than jQuery's 10 hook).

**Update:** Special thanks to @Ramoonus for [didn't queue up jQuery](https://gist.github.com/1058469/db96b6836f279811205bddbf8be67bec6ca2159c).
