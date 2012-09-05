define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/page.html',
  'models/page'
], function($, _, Backbone, pageTemplate, Page ){
  var pageView = Backbone.View.extend({
    el: $('.posts'),
    render: function( page ){
      var page = new Page({id:page});
      page.fetch( { success: function(page) { 
      	var compiledTemplate = _.template( pageTemplate, { page: page } );
      	this.el.html( compiledTemplate );
      } } );
    }
  });
 return new pageView;
});