# Bootstrap
window.Application =
  Models: {}
  Collections: {}
  Views: {}
  router: {}
  url: '{{ site.url }}'
  name: '{{ site.name }}'
  disqus:
    name: '{{ site.disqus.shortname }}'
    api_key: '{{ site.disqus.api_key }}'
    count: '{{ site.disqus.count }}'
  twitter:
    count: '{{ site.twitter.count }}'
    username: '{{ site.twitter.username }}'

# Models

class Application.Models.Post extends Backbone.Model
  url: ->
    Application.url + "/" + @id + '.json'
    
  defaults:
    author: "Benjamin J. Balter"
    title: ""
    url: ""
    content: ""
    tags: []
    category: ""
    date: ""
    
class Application.Models.Page extends Backbone.Model 
  url: ->
    Application.url + "/" + @id + '.json'
    
class Application.Models.Thread extends Backbone.Model
  url: ->
    url = 'https://disqus.com/api/3.0/threads/details.json?'
    url += 'thread=' + @id
    url += '&api_key=' + Application.disqus.api_key
    url += '&callback=?'
    url
    
  parse: (data) ->
    data.response
    
class Application.Models.Comment extends Backbone.Model
  
  initialize: ->
    @set 'thread', new Application.Models.Thread id: @get('thread')
    @get('thread').fetch success: =>
      @collection.trigger 'change'

class Application.Models.Tweet extends Backbone.Model
    
# Collections

class Application.Collections.Comments extends Backbone.Collection
  model: Application.Models.Comment
  url: ->
    url = 'https://disqus.com/api/3.0/posts/list.json?'
    url += 'forum=' + Application.disqus.name 
    url += '&limit=' + Application.disqus.count
    url += '&api_key=' + Application.disqus.api_key
    url += '&callback=?'
    url
    
  parse: (data) ->
    data.response
    
class Application.Collections.Tweets extends Backbone.Collection
  model: Application.Models.Tweet
  url: ->
    url = "https://api.twitter.com/1/statuses/user_timeline.json?include_rts=true"
    url += "&screen_name=" + Application.twitter.username
    url += "&count=" + Application.twitter.count
    url += "&callback=?"
    url 
        
class Application.Collections.Posts extends Backbone.Collection 
  model: Application.Models.Post
  
  url: ->
    Application.url + "/" + 'posts.json'
    
  comparator: "date"

class Application.Collections.Pages extends Backbone.Collection 
  model: Application.Models.Page
  url: ->
    Application.url + "/" + 'pages.json'

# Views

class Application.Views.Post extends Backbone.View
  el: "#main"
  tagName: "article"
  class: "post"
  template: $('#post_template').html()
  
  render: =>
    compiled = _.template @template
    @$el.append compiled @model.toJSON()
  
    if @model.get 'comments'
      @loadDisqus()
    
  loadDisqus: ->
    window.disqus_shortname = Application.disqus.name
    window.disqus_identifier = @model.get 'id'
    window.disqus_url = Application.url + '/' + @model.get 'id'
    window.disqus_title = @model.get('title') + " » " + Application.name
          
    if DISQUS?
      DISQUS.reset reload: true, config: ->
        @.page.identifier = disqus_identifier
        @.page.url = disqus_url
        @.page.title = disqus_title  
    else
      dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
      
class Application.Views.PostExcerpt extends Backbone.View
  el: ".posts"
  tagName: "article"
  class: "post"
  template: $('#post_excerpt_template').html()
  
  initialize: ->
    @model.on 'change', @render
  
  render: =>
    compiled = _.template @template
    model = @getExcerpted()
    @$el.append compiled model.toJSON()
    
  getExcerpted: ->
    model = @model.clone()
    model.set 'content', @model.get('content').split("<!-- more -->")[0]
    model
    
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
    
    document.title = @model.get('title') + " » " + Application.name
    
    post.render()

class Application.Views.Index extends Backbone.View
  el: "#content"
  template: $("#index_layout").html()
    
  render: ->
    @$el.html @template
    @collection.slice(0,10).forEach (post) ->
      post.fetch()
      view = new Application.Views.PostExcerpt( model: post )
    comments = new Application.Collections.Comments
    view = new Application.Views.CommentView collection: comments
    comments.fetch()
    tweets = new Application.Collections.Tweets
    view = new Application.Views.TweetView collection: tweets
    tweets.fetch()

class Application.Views.CommentView extends Backbone.View
  el: "#recentcomments"
  template: $("#recent_comments_template").html()
  
  initialize: =>
    @collection.on 'change', @render
    
  render: =>
    compiled = _.template @template
    @$el.html compiled({ comments: @collection.toJSON() })

class Application.Views.TweetView extends Backbone.View
  el: "#tweets"
  template: $("#recent_tweets_template").html()
  
  initialize: =>
    @collection.on 'all', @render
  
  render: =>
    compiled = _.template @template
    @$el.html compiled tweets: @collection.toJSON()
      
# Router

class router extends Backbone.Router
  routes:
    ":year/:month/:day/:slug/": "post"
    ":slug/": "page"
    "": "index"
    
  post: (year, month, day, slug) ->
    post = new Application.Models.Post id: year+"/"+month+"/"+day+"/"+slug
    Application.posts.add post 
    view = new Application.Views.Single model: post
    post.fetch error: @redirect

  page: (id) ->
    page = new Application.Models.Page id: id
    Application.pages.add page
    view = new Application.Views.Single model: page
    page.fetch error: @redirect
    
  index: ->
    view = new Application.Views.Index({ collection: Application.posts })    
    Application.posts.fetch success: ->
      view.render()
   
  redirect: ->
    document.location = Application.url + Backbone.history.fragment

# Init

Application.posts = new Application.Collections.Posts     
Application.pages = new Application.Collections.Pages     

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
