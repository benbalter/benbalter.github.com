# Google Analytics virtual event tracking
jQuery(document).ready ($) ->

  # Mailto tracking code
  $("a[href^=\"mailto:\"]").click ->
    _gaq.push ["_trackEvent", "Email", "Click", $(this).attr("href")]


  # Download Tracking Code
  $("a[href$=\"zip\"],a[href$=\"pdf\"],a[href$=\"doc\"],a[href$=\"docx\"],a[href$=\"xls\"],a[href$=\"xlsx\"],a[href$=\"ppt\"],a[href$=\"pptx\"],a[href$=\"txt\"],a[href$=\"csv\"]").click ->
    u = $(this).attr("href")
    _gaq.push ["_trackEvent", "Download", u.match(/[^.]+$/), u]


  # External link tracking code for old site
  $("a[href^=\"http\"]").click ->
    _gaq.push ["_trackEvent", "External Link", "Click", $(this).attr("href")]  unless @hostname is location.hostname

