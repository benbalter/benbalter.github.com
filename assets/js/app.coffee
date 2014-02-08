$ ->
  $(".post h2, .post h3, .post h4, .post h5, .post h6").each (i, el) ->
    $el = $(el)
    id = $el.attr('id')
    icon = '<i class="fa fa-link"></i>'
    $el.prepend $("<a />").addClass("header-link").attr("href", "##{id}").html(icon) if id
