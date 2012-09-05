// Filename: router.js
define([
  'jQuery',
  'Underscore',
  'Backbone',
  'views/page'
], function( $, _, Backbone, pageView ){
	
	  var AppRouter = Backbone.Router.extend({ 
		
		routes: {
			
			"/posts/:query": "post",
			"/:query": 'page'
			
		},
		
		page: function( query, page ) {
			pageView.render( query );
		}
	
	});
	
  var initialize = function(){
    var app_router = new AppRouter;
    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});


