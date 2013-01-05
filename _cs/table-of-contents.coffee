jQuery(document).ready ($) ->
  $(".post-2011-11-29-towards-a-more-agile-government .maruku_toc").hide()
  $("#toggleTOC").click (event) ->
    event.preventDefault()
    $(".maruku_toc").slideToggle()
    if $(this).text() is "Show Table of Contents"
      $(this).text "Hide Table of Contents"
    else
      $(this).text "Show Table of Contents"
    false

