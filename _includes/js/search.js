/* 
Client-side site search
Heavily adapted, but inspired by:
	- http://forrst.com/posts/Static_site_e_g_Jekyll_search_with_JQuery-zL9, and
	- http://developmentseed.org/blog/2011/09/09/jekyll-github-pages/
*/

jQuery(document).ready( function($) {

	/* Main filtering logic */
	function findEntries(q) {
	
	  var matches = [];
	  var rq = new RegExp(q, 'im');
	  $.each( entries.posts, function(k, post ){
	  	if ( rq.test( post.title ) || rq.test( post.url ) || rq.test( post.description ) || rq.test( post.content ) || rq.test( post.tags ) || rq.test( post.category ) ) {
	  	      matches.push({ 'title': post.title, 'url':post.url, 'date': post.date });
		  	}
	  	});
	  	
	  $('body').addClass('search');
	  var content = $('#content');
	  content.append( '<h3>Search Results</h3>' );
	
	  if ( matches.length > 0 ) {
		  	 
		  content.append( '<ul class="search-results">' );

		  //matches found
		  $.each( matches, function( key, match ){
			  
			  content.append( '<li><a href="' + match.url + '">' + match.title + '</a></li>' );
			  
		  });
		  
		  content.append( '</ul>' );
		  
	  } else {
		  
		  //no matches
		 content.append( '<div class="no-search-results">No matches found</div>' );
		  
	  }
	  
	  content.append( '<a href="#" id="back">Back</a>' );
	
	}
	
	/* Search form submit */
	$('#search_form').live( 'submit', function(e) {
	  e.preventDefault();
	  var query = $('#query').val();                        
	  window.location.hash = 'q='+escape(query.replace(/\s/g, '+'));
	  return false;
	});
	
	/* Process hashchange */
	$(window).bind('hashchange', function(e) {
	
	  // called when the part of the URL after the hash (#) changes         
	  var query = window.location.hash;  // e.g. "#search=text"
	  
	  //if the hash contains search
	  if (/[#?]{1}q=(.*)/.test(query)) {
	  
	  	//strip search from the hash
	    query = window.location.hash.replace('+', ' ').replace('#q=', '');
	    
	    // in case the user browsed to the search
	    $('#query').val(query);  
	    
	    if (query) {
	    
	      if (typeof oldhtml == 'undefined') { // save state!
	         oldhtml = $('#content').html(); 
	      }
	      
	      $('#content').html('<div id="loader"></div>');
	      $('#query').blur().attr('disabled', true);
	
	      if ( typeof entries == 'undefined' ) {
	      
	        // lazily load and parse the posts JSON feed
	        $.getJSON( '{{ site.url }}/posts.json', function(data) {
	        	entries = data;
	        	findEntries( query );
	        });
	        
	      } else { 
	        // search the pre-loaded data
	        findEntries( query );
	      }
	      
	      // disable the search bar until current search is complete
	      $('#query').blur().attr('disabled', false);
	    }

	    _gaq.push(['_trackEvent', 'Search', 'Search', query ]);
	    
	  } else {
	  
	    // revert to original page, hide search results
	    if ( typeof oldhtml == 'undefined' ) { 
	      oldhtml = $('#content').html(); 
	    }
	    
	    $('body').removeClass('search');
	    $('#content').html(oldhtml);
	    $('#query').blur().attr('disabled', false).val('');
	    
   	    _gaq.push(['_trackEvent', 'Search', 'Back', query ]);
	    
	  }
	  
	});
	
	// called in case user browses "into" a search
	$(window).trigger( 'hashchange' );
	
});