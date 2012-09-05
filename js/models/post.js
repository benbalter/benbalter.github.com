var Post = Backbone.Model.extend({
	
	defaults : {
	  id: null,
	  url: null,
      title: null,
      description: null,
      author: null,
      layout: "post",
      comments: true,
      category: [],
      tags: [],
      published: false	
	},

	url: function() {
	
		return this.id ? 'posts/' + this.id + '/': '/posts';
	
	}
	
});