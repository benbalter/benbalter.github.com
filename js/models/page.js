

define([
  'Underscore',
  'Backbone'
], function(_, Backbone) {
 var Page = Backbone.Model.extend({
	
	defaults : {
	  id: null,
	  url: null,
      title: null,
      description: null,
      layout: "page",
      comments: false,
      published: false	
	},

	url: function() {
	
		return this.id ? 'pages/' + this.id + '/': '/pages.json';
	
	}
	
});
  return Page;

});