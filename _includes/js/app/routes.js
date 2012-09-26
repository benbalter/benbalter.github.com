var AppRouter = Backbone.Router.extend({ 
		
	routes: {
		
		'/:year/:month/:day/:slug/': 'renderPost',		
		'/:query/': 'renderPage'
		
	},
	
	renderPage: function( id ) {
		
		view = new pageView();
		view.render( id );
		
	},
	
	renderPost: function ( year, month, day, slug ) {
		
		view = new postView();		
		view.render( year + "/" + month + "/" + day + "/" + slug );
		
	}
	
});
	