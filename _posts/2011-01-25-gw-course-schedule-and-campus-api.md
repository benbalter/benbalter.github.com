---
author: Benjamin J. Balter
title: GW Course Schedule and Campus API
excerpt: "George Washington University recently released an iPhone app that allows students to look up the course schedule and each course's open/closed status as well as browse an interactive map of the campus. Below you can find the details on GW's course schedule and campus map API endpoints, as well as an API wrapper to interact with it written in PHP."
layout: post
categories:
  - Technology
tags:
  - api
  - code
  - gw
  - hack
  - open source
post_format: [ ]
---
![Course Schedule][1]{.alignright}George Washington University recently released an [iPhone app][2] that allows students to look up the course schedule and each course's open/closed status as well as browse an interactive map of the campus. Naturally, upon installing the app, the first thing to do is to try and ferret out the underlying XML API that powers it, a simple enough task given [the right tools][3].

Below you can find the details on GW's course schedule and campus map API endpoints, as well as an API wrapper to interact with it written in PHP. Feel free to grab the code below, or fork and contribute in the [GitHub repo][4]. Cool data that deserves to be shared with the world, no doubt.

Creative ideas on how best to leverage the information welcome in the [comments below][5].

*Please Note: I am not a GW employee, nor is use of the API explicitly authorized by the University. The code below is provided "as is" solely for educational purposes. If for any reason you would like this page removed, please [contact me][6] immediately and I will do so.*

* * *

### Course Schedule

1.  Departments 
  1.  Endpoint: `http://my.gwu.edu/mod/pws/scheduleXML.cfm`
  2.  Parameters: `termCode=[YYYY][01=spring, 02=summer, 03=fall]`
  3.  Returns
    
      {% highlight xml %}<?xml version="1.0" encoding="iso-8859-1" ?>
<departments>
    <department>
        <departmentcode><![CDATA[ACCY]]></departmentcode>
        <departmentname><![CDATA[Accountancy]]></departmentname>
    </department>
    <department>
        <departmentcode><![CDATA[AH]]></departmentcode>
        <departmentname><![CDATA[Art/Art History]]></departmentname>
    </department>
</departments>
        {% endhighlight %}

2.  Courses 
    1.  Endpoint: `http://my.gwu.edu/mod/pws/scheduleXML.cfm`
    2.  Parameters: 
        1.  `termCode=[YYYY][01=spring, 02=summer, 03=fall]`
        2.  `deptCode=[Dept. Code]`
    3.  Returns:

{% highlight xml %}<?xml version="1.0" encoding="iso-8859-1" ?>
<courses>
    <course>
        <coursedepartment><![CDATA[ACCY]]></coursedepartment>
        <coursenumber><![CDATA[6101]]></coursenumber>
        <coursecrn><![CDATA[55164]]></coursecrn>
        <coursetitle><![CDATA[FinAcctingI:BasicFinStatements]]></coursetitle>
        <courseinstructor><![CDATA[ Singleton, L]]></courseinstructor>
        <courselocation><![CDATA[<A HREF="http://www.gwu.edu/~map/building.cfm?BLDG=DUQUES" target="_blank" >DUQUES</a> 258]]></courselocation>
        <coursedays><![CDATA[MW 06:10PM - 09:05PM]]></coursedays>
        <coursetime><![CDATA[]]></coursetime>
        <coursestatus><![CDATA[OPEN]]></coursestatus>
        <coursesection><![CDATA[81]]></coursesection>
        <coursecredit><![CDATA[1.50  ]]></coursecredit>
    </course>
    <course>
        <coursedepartment><![CDATA[ACCY]]></coursedepartment>
        <coursenumber><![CDATA[6102]]></coursenumber>
        <coursecrn><![CDATA[55165]]></coursecrn>
        <coursetitle><![CDATA[Fin Accting II: FinAcc Choices]]></coursetitle>
        <courseinstructor><![CDATA[ Tarpley, R]]></courseinstructor>
        <courselocation><![CDATA[<A HREF="http://www.gwu.edu/~map/building.cfm?BLDG=DUQUES" target="_blank" >DUQUES</a> 258]]></courselocation>
        <coursedays><![CDATA[MW 06:10PM - 09:05PM]]></coursedays>
        <coursetime><![CDATA[]]></coursetime>
        <coursestatus><![CDATA[OPEN]]></coursestatus>
        <coursesection><![CDATA[80]]></coursesection>
        <coursecredit><![CDATA[1.50  ]]></coursecredit>
    </course>
</courses>
        {% endhighlight %}
        

### Campus Map

1. Categories 
  1. Endpoint:  `http://citl.gwu.edu/iphonedev/maps/categories.xml`
  2. Return:
    
{% highlight xml %}    
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<categories xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <category>
        <categoryId>1</categoryId>
        <shortname>academic</shortname>
        <categoryName>Academic</categoryName>
        <state>Yes</state>
    </category>
    <category>
        <categoryId>2</categoryId>
        <shortname>administrative</shortname>
        <categoryName>Administrative</categoryName>
        <state>Yes</state>
    </category>
</categories>
{% endhighlight %}
        

2.  Buildings 
    1.  Endpoint: `http://citl.gwu.edu/iphonedev/maps/[shortname].xml`
    2.  Return:
    
{% highlight xml %}<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<buildings xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <building>
        <buildingNumber>153</buildingNumber>
        <campus>Foggy Bottom</campus>
        <UsageClassification>Academic</UsageClassification>
        <buildingName>1776 G St</buildingName>
        <address>1776 G St</address>
        <geoLocation>38.897984,-77.04146</geoLocation>
        <shortname>NA</shortname>
        <picturelink>http://www.gwu.edu/~newsctr/mobile/images/maps/1776-G-ST_UP_WLA_2010-6618.jpg</picturelink>
    </building>
    <building>
        <buildingNumber>136</buildingNumber>
        <campus>Foggy Bottom</campus>
        <UsageClassification>Academic</UsageClassification>
        <buildingName>1957 E St</buildingName>
        <address>1957 E St</address>
        <geoLocation>38.896193,-77.044294</geoLocation>
        <shortname>1957E</shortname>
        <picturelink>http://www.gwu.edu/~newsctr/mobile/images/maps/Elliot_School_UP_WLA_2010-3102.jpg</picturelink>
    </building>
</buildings>
{% endhighlight %}
        

### API Wrapper

1.  Source 

<script src="http://gist-it.appspot.com/github/benbalter/GW-API/raw/master/gw-api.php">     </script>
        
2.  Usage 

#### Initialize:
{% highlight php %}<?php $gwapi = new gw_api; ?>{% endhighlight %}
      
#### List Departments 
{% highlight php %}<?php $departments = $gwapi->get_schedule();
  foreach ($departments as $department)
  echo $department->departmentname . '<br />';?>{% endhighlight %}    
     
#### Get Course Schedule for Fall 2011
{% highlight php %}<?php $courses = $gwapi->get_schedule('2011','03','ACCY');?>{% endhighlight %}

#### Get Course Schedule for current term 
{% highlight php %}<?php $courses = $gwapi->get_schedule(null,null,'ACCY'); ?>{% endhighlight %}

#### Get map categories 
{% highlight php %}<?php $categories = $gwapi->get_map(); ?>{% endhighlight %}

#### Get Buildings 
{% highlight php %}<?php $buildings = $gwapi->get_maps('academic'); ?>{% endhighlight %}

\[Photo: [atomicbartbeans][7]\]

 [1]: http://ben.balter.com/wp-content/uploads/2011/01/1430289931_beb7ff6428_b-300x225.jpg "Course Schedule"
 [2]: http://acadtech.gwu.edu/pages/gwmobile
 [3]: http://blog.jerodsanto.net/2009/06/sniff-your-iphones-network-traffic/
 [4]: https://github.com/benbalter/GW-API
 [5]: #comments
 [6]: http://ben.balter.com/contact/
 [7]: http://www.flickr.com/photos/atomicbartbeans/1430289931/