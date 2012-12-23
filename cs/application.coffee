window.Application =
  Models: {}
  Collections: {}
  Views: {}
  router: {}
  url: '{{ site.url }}'
  name: '{{ site.name }}'
  disqus_name: '{{ site.disqus.shortname }}'
  
class Application.Models.Post extends Backbone.Model
  
  url: ->
    Application.url + "/" + @id + '.json'
    
class Application.Models.Page extends Backbone.Model
  
  url: ->
    Application.url + "/" + @id + '.json'


class Application.Collections.Posts extends Backbone.Collection 
  model: Application.Models.Post

class Application.Views.Post extends Backbone.View
  el: "#main"
  tagName: "article"
  class: "post"
  template: $('#post_template').html()
  
  render: =>
    compiled = _.template @template
    @$el.html compiled @model.toJSON()
    @loadDisqus()
    
  loadDisqus: ->
    window.disqus_shortname = Application.disqus_name
    window.disqus_identifier = @model.get 'id'
    window.disqus_url = Application.url + '/' + @model.get 'id'
    window.disqus_title = @model.get('title') + " &raquo; " + Application.name
          
    if DISQUS?
      DISQUS.reset reload: true, config: ->
        @.page.identifier = disqus_identifier
        @.page.url = disqus_url
        @.page.title = disqus_title  
    else
      dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    
class Application.Views.Page extends Backbone.View
  el: "#main"
  tagName: "article"
  class: "page"
  template: $('#page_template').html()
  
  render: =>
    compiled = _.template @template
    @$el.html compiled @model.toJSON()
    if DISQUS?
      DISQUS.reset()

class Application.Views.Single extends Backbone.View
  el: "#content"
  template: $("#single_layout").html()
 
  initialize: ->
    @model.on 'change', @render
        
  render: =>
    compiled = _.template @template
    @$el.html compiled @model.toJSON()

    if @model.get('layout') is "post"
      post = new Application.Views.Post( model: @model )
    else if @model.get('layout') is "page"
      post = new Application.Views.Page( model: @model )
    
    document.title = @model.get('title') + " &raquo; " + Application.name
    
    post.render()
      
class router extends Backbone.Router
  routes:
    ":year/:month/:day/:slug/": "post"
    ":slug/": "page"
    
  post: (year, month, day, slug) ->
    post = new Application.Models.Post id: year+"/"+month+"/"+day+"/"+slug
    view = new Application.Views.Single model: post
    post.fetch error: @redirect

  page: (id) ->
    page = new Application.Models.Page id: id
    view = new Application.Views.Single model: page
    page.fetch error: @redirect
    
  redirect: ->
    document.location = Application.url + Backbone.history.fragment
    
Application.router = new router()
Backbone.history.start pushState: true, silent: true

jQuery(document).ready ->

	$('a[href^="{{ site.url }}/"]').live 'click', (e) ->
    e.preventDefault()
    Application.router.navigate $(@).attr('href').replace( '{{ site.url }}/', '' ), true
	  false
	  
 	window.resume_resize = ->
	  $('.resume .bar').height( $('.content').height() - 25)
		  
	$(window).resize( resume_resize )
	resume_resize()
