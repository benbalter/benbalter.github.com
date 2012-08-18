jQuery(document).ready( function($) {

	//Google Analytics virtual event tracking	

	//Mailto tracking code
	$('a[href^="mailto\:"]').click(function() {
	_gaq.push(['_trackEvent','Email', 'Click', $(this).attr('href') ]);
	});
	
	//Download Tracking Code
	$('a[href$="zip"],a[href$="pdf"],a[href$="doc"],a[href$="docx"],a[href$="xls"],a[href$="xlsx"],a[href$="ppt"],a[href$="pptx"],a[href$="txt"],a[href$="csv"]').click(function() {
	var u = $(this).attr('href'); _gaq.push(['_trackEvent','Download', u.match(/[^.]+$/), u ]);
	});
	
	//External link tracking code for old site
	$('a[href^="http"]').click(function(){
	if (this.hostname != location.hostname )
	_gaq.push(['_trackEvent', 'External Link', 'Click', $(this).attr('href') ]);
	});
	
});