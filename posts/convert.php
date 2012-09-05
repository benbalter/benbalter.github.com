<?php

 
 
foreach ( glob( '*.md' ) as $file ) {
	
	$content = file_get_contents( $file, false );
	
	//quotes
	$content = str_replace( '“', '"', $content );
	$content = str_replace( '”', '"', $content );
	$content = str_replace( '’', "'", $content );
	$content = str_replace( ' ', ' ', $content );
	
	//find real footnotes
	preg_match_all( '#\n([0-9]+)\.[ ]+([^↩]+?)\[↩\]#u', $content, $matches );

	//find fake FNs
	preg_match_all( '#\[([0-9]+)\]:[ ]+\#note-[0-9]+-[0-9]+[ \"]*(.*)\"\n#u', $content, $refs );
		
	//1 - #
	//2 - content
	
	//in body footnote 
	foreach ( $matches[1] as $ID => $fn )
		$content = str_replace( "[$fn][{$refs[1][$ID]}]", "[^$fn]", $content );
	
	//1. => [^1] (post-body reference)
	foreach( $matches[1] as $ID => $match ) {

		$from = $matches[0][$ID];
		$to = "\n[^" . $matches[1][$ID] . ']: ' . $matches[2][$ID];
		$content = str_replace( $from, $to, $content );
				
		}

	//remove Return links
	$content = preg_replace( '#\[↩\]\[[0-9]+\]#u', '', $content );
	$content = preg_replace( '#\[[0-9]+\]: \#return-note-[0-9]+-[0-9]+#u', '', $content );

	str_replace( 'Notes: ', '', $content );
	
	$content = trim( $content );
		
	file_put_contents( $file, $content );
	
}