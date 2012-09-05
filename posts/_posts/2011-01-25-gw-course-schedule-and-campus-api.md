---
author: Benjamin J. Balter
title: GW Course Schedule and Campus API
excerpt: "George Washington University recently released an iPhone app that allows students to look up the course schedule and each course's open/closed status as well as browse an interactive map of the campus. Below you can find the details on GW's course schedule and campus map API endpoints, as well as an API wrapper to interact with it written in PHP."
layout: post
category:
  - Technology
tags:
  - api
  - code
  - gw
  - hack
  - open source
post_format: [ ]
---
![][1]George Washington University recently released an [iPhone app][2] that allows students to look up the course schedule and each course's open/closed status as well as browse an interactive map of the campus. Naturally, upon installing the app, the first thing to do is to try and ferret out the underlying XML API that powers it, a simple enough task given [the right tools][3].

Below you can find the details on GW's course schedule and campus map API endpoints, as well as an API wrapper to interact with it written in PHP. Feel free to grab the code below, or fork and contribute in the [GitHub repo][4]. Cool data that deserves to be shared with the world, no doubt.



Creative ideas on how best to leverage the information welcome in the [comments below][5].

*Please Note: I am not a GW employee, nor is use of the API explicitly authorized by the University. The code below is provided "as is" solely for educational purposes. If for any reason you would like this page removed, please [contact me][6] immediately and I will do so.*

* * *

## Course Schedule

1.  Departments 
    1.  Endpoint 
        1.  `http://my.gwu.edu/mod/pws/scheduleXML.cfm`
    2.  Parameters 
        1.  `termCode=[YYYY][01=spring, 02=summer, 03=fall]`
    3.  Returns
    
        &lt;?xml version=&quot;1.0&quot; encoding=&quot;iso-8859-1&quot; ?&gt;
        &lt;departments&gt;
            &lt;department&gt;
                &lt;departmentcode&gt;&lt;![CDATA[ACCY]]&gt;&lt;/departmentcode&gt;
                &lt;departmentname&gt;&lt;![CDATA[Accountancy]]&gt;&lt;/departmentname&gt;
            &lt;/department&gt;
            &lt;department&gt;
                &lt;departmentcode&gt;&lt;![CDATA[AH]]&gt;&lt;/departmentcode&gt;
                &lt;departmentname&gt;&lt;![CDATA[Art/Art History]]&gt;&lt;/departmentname&gt;
            &lt;/department&gt;
        &lt;/departments&gt;
        

2.  Courses 
    1.  Endpoint 
        1.  `http://my.gwu.edu/mod/pws/scheduleXML.cfm`
    2.  Parameters 
        1.  `termCode=[YYYY][01=spring, 02=summer, 03=fall]`
        2.  `deptCode=[Dept. Code]`
    3.  Returns
    
        &lt;?xml version=&quot;1.0&quot; encoding=&quot;iso-8859-1&quot; ?&gt;
        	&lt;courses&gt;
        		&lt;course&gt;
        		    &lt;coursedepartment&gt;&lt;![CDATA[ACCY]]&gt;&lt;/coursedepartment&gt;
        		    &lt;coursenumber&gt;&lt;![CDATA[6101]]&gt;&lt;/coursenumber&gt;
        		    &lt;coursecrn&gt;&lt;![CDATA[55164]]&gt;&lt;/coursecrn&gt;
        		    &lt;coursetitle&gt;&lt;![CDATA[FinAcctingI:BasicFinStatements]]&gt;&lt;/coursetitle&gt;
        		    &lt;courseinstructor&gt;&lt;![CDATA[ Singleton, L]]&gt;&lt;/courseinstructor&gt;
        		    &lt;courselocation&gt;&lt;![CDATA[&lt;A HREF=&quot;http://www.gwu.edu/~map/building.cfm?BLDG=DUQUES&quot; target=&quot;_blank&quot; &gt;DUQUES&lt;/a&gt; 258]]&gt;&lt;/courselocation&gt;
        		    &lt;coursedays&gt;&lt;![CDATA[MW 06:10PM - 09:05PM]]&gt;&lt;/coursedays&gt;
        		    &lt;coursetime&gt;&lt;![CDATA[]]&gt;&lt;/coursetime&gt;
        		    &lt;coursestatus&gt;&lt;![CDATA[OPEN]]&gt;&lt;/coursestatus&gt;
        		    &lt;coursesection&gt;&lt;![CDATA[81]]&gt;&lt;/coursesection&gt;
        		    &lt;coursecredit&gt;&lt;![CDATA[1.50  ]]&gt;&lt;/coursecredit&gt;
        		&lt;/course&gt;
        		&lt;course&gt;
        		    &lt;coursedepartment&gt;&lt;![CDATA[ACCY]]&gt;&lt;/coursedepartment&gt;
        		    &lt;coursenumber&gt;&lt;![CDATA[6102]]&gt;&lt;/coursenumber&gt;
        		    &lt;coursecrn&gt;&lt;![CDATA[55165]]&gt;&lt;/coursecrn&gt;
        		    &lt;coursetitle&gt;&lt;![CDATA[Fin Accting II: FinAcc Choices]]&gt;&lt;/coursetitle&gt;
        		    &lt;courseinstructor&gt;&lt;![CDATA[ Tarpley, R]]&gt;&lt;/courseinstructor&gt;
        		    &lt;courselocation&gt;&lt;![CDATA[&lt;A HREF=&quot;http://www.gwu.edu/~map/building.cfm?BLDG=DUQUES&quot; target=&quot;_blank&quot; &gt;DUQUES&lt;/a&gt; 258]]&gt;&lt;/courselocation&gt;
        		    &lt;coursedays&gt;&lt;![CDATA[MW 06:10PM - 09:05PM]]&gt;&lt;/coursedays&gt;
        		    &lt;coursetime&gt;&lt;![CDATA[]]&gt;&lt;/coursetime&gt;
        		    &lt;coursestatus&gt;&lt;![CDATA[OPEN]]&gt;&lt;/coursestatus&gt;
        		    &lt;coursesection&gt;&lt;![CDATA[80]]&gt;&lt;/coursesection&gt;
        		    &lt;coursecredit&gt;&lt;![CDATA[1.50  ]]&gt;&lt;/coursecredit&gt;
        		&lt;/course&gt;
        	&lt;/courses&gt;
        

## Campus Map

1.  Categories 
    1.  Endpoint 
        1.  ` http://citl.gwu.edu/iphonedev/maps/categories.xml `
    2.  Returns
    
        &lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; standalone=&quot;yes&quot;?&gt;
        &lt;categories xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;&gt;
        	&lt;category&gt;
        		&lt;categoryId&gt;1&lt;/categoryId&gt;
        		&lt;shortname&gt;academic&lt;/shortname&gt;
        		&lt;categoryName&gt;Academic&lt;/categoryName&gt;
        		&lt;state&gt;Yes&lt;/state&gt;
        	&lt;/category&gt;
        	&lt;category&gt;
        		&lt;categoryId&gt;2&lt;/categoryId&gt;
        		&lt;shortname&gt;administrative&lt;/shortname&gt;
        		&lt;categoryName&gt;Administrative&lt;/categoryName&gt;
        		&lt;state&gt;Yes&lt;/state&gt;
        	&lt;/category&gt;
        &lt;/categories&gt;
        

2.  Buildings 
    1.  Endpoint 
        1.  `http://citl.gwu.edu/iphonedev/maps/[shortname].xml`
    2.  Returns
    
        &lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; standalone=&quot;yes&quot;?&gt;
        &lt;buildings xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;&gt;
        	&lt;building&gt;
        		&lt;buildingNumber&gt;153&lt;/buildingNumber&gt;
        		&lt;campus&gt;Foggy Bottom&lt;/campus&gt;
        		&lt;UsageClassification&gt;Academic&lt;/UsageClassification&gt;
        		&lt;buildingName&gt;1776 G St&lt;/buildingName&gt;
        		&lt;address&gt;1776 G St&lt;/address&gt;
        		&lt;geoLocation&gt;38.897984,-77.04146&lt;/geoLocation&gt;
        		&lt;shortname&gt;NA&lt;/shortname&gt;
        		&lt;picturelink&gt;http://www.gwu.edu/~newsctr/mobile/images/maps/1776-G-ST_UP_WLA_2010-6618.jpg&lt;/picturelink&gt;
        	&lt;/building&gt;
        	&lt;building&gt;
        		&lt;buildingNumber&gt;136&lt;/buildingNumber&gt;
        		&lt;campus&gt;Foggy Bottom&lt;/campus&gt;
        		&lt;UsageClassification&gt;Academic&lt;/UsageClassification&gt;
        		&lt;buildingName&gt;1957 E St&lt;/buildingName&gt;
        		&lt;address&gt;1957 E St&lt;/address&gt;
        		&lt;geoLocation&gt;38.896193,-77.044294&lt;/geoLocation&gt;
        		&lt;shortname&gt;1957E&lt;/shortname&gt;
        		&lt;picturelink&gt;http://www.gwu.edu/~newsctr/mobile/images/maps/Elliot_School_UP_WLA_2010-3102.jpg&lt;/picturelink&gt;
        	&lt;/building&gt;
        &lt;/buildings&gt;
        

## API Wrapper

1.  Source 
        class gw_api {
        
        	public function __construct() {
        
        		//configuration settings
        		$this-&gt;user_agent = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7';
        		$this-&gt;maps_base = 'http://citl.gwu.edu/iphonedev/maps/';
        		$this-&gt;schedule_base = 'http://my.gwu.edu/mod/pws/scheduleXML.cfm';
        	}
        
        	public function get_url($url) {
        
        		//prefer the WP HTTP API to allow for caching and user agent spoofing, fall back if necessary
        		if ( function_exists( 'wp_remote_get') )
        			$data = wp_remote_retrieve_body( wp_remote_get($url, array('user-agent' =&gt; $this-&gt;user_agent) ) );
        		else
        			$data = file_get_contents($url);
        
        		//parse the XML into a PHP object
        		$xml = simplexml_load_string($data, 'SimpleXMLElement', LIBXML_NOCDATA);
        
        		return $xml;
        	}
        
        	public function get_map($category = 'categories') {
        		return $this-&gt;get_url($this-&gt;maps_base . $category . '.xml');
        	}
        
        	public function get_schedule($year = '', $term ='', $dept = ''){
        
        		//if no year was given, assume the current year
        		if ($year == '')
        			$year = date('Y');
        
        		//if no term is given, calculate the current term
        		if ($term == '')
        			$term = $this-&gt;get_term();
        
        		//form URL and call
        		return $this-&gt;get_url($this-&gt;schedule_base . '?termCode=' . $year . $term . '&amp;deptCode=' . $dept);
        	}
        
        	public function get_term() {
        
        		//get the current month as 01-12
        		$m = date('M');
        
        		//if it is jan. - april, we're in the spring
        		if ($m &lt; 5)
        			return '01';
        
        		//if it's May - August, we're in the summer
        		else if ($m &lt; 9) {
        			return '02';
        		}
        
        		//otherwise, it's fall
        		else return '03';
        	}
        
        }
        

2.  Usage 
    1.  Initialize 
            $gwapi = new gw_api;
    
    2.  List Departments 
            $departments = $gwapi-&gt;get_schedule();
            foreach ($departments as $department)
            	echo $department-&gt;departmentname . '&lt;br /&gt;';
            
    
    3.  Get Course Schedule for Fall 2011 
            $courses = $gwapi-&gt;get_schedule('2011','03','ACCY');
    
    4.  Get Course Schedule for current term 
            $courses = $gwapi-&gt;get_schedule(null,null,'ACCY');
    
    5.  Get map categories 
            $categories = $gwapi-&gt;get_map();
    
    6.  Get Buildings 
            $buildings = $gwapi-&gt;get_maps('academic');

[Photo: [atomicbartbeans][7]]

 [1]: http://ben.balter.com/wp-content/uploads/2011/01/1430289931_beb7ff6428_b-300x225.jpg "Course Schedule"
 [2]: http://acadtech.gwu.edu/pages/gwmobile
 [3]: http://blog.jerodsanto.net/2009/06/sniff-your-iphones-network-traffic/
 [4]: https://github.com/benbalter/GW-API
 [5]: #comments
 [6]: http://ben.balter.com/contact/
 [7]: http://www.flickr.com/photos/atomicbartbeans/1430289931/