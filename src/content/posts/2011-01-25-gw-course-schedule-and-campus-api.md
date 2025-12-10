---
title: GW Course Schedule and Campus API
description: George Washington University recently released an iPhone app that allows students to look up the course schedule and each course's open/closed status as well as browse an interactive map of the campus. Below you can find the details on GW's course schedule and campus map API endpoints, as well as an API wrapper to interact with it written in PHP.
archived: true
---

George Washington University recently released an [iPhone app](https://gwtoday.gwu.edu/app-gw) that allows students to look up the course schedule and each course's open/closed status as well as browse an interactive map of the campus. Naturally, upon installing the app, the first thing to do is to try and ferret out the underlying XML API that powers it, a simple enough task given [the right tools](http://blog.jerodsanto.net/2009/06/sniff-your-iphones-network-traffic/).

Below you can find the details on GW's course schedule and campus map API endpoints, as well as an API wrapper to interact with it written in PHP. Feel free to grab the code below, or fork and contribute in the [GitHub repository](https://github.com/benbalter/GW-API). Cool data that deserves to be shared with the world, no doubt.

Creative ideas on how best to leverage the information welcome in the comments below.

*Please Note: I am not a GW employee, nor is use of the API explicitly authorized by the University. The code below is provided "as is" solely for educational purposes. If for any reason you would like this page removed, please [contact me](https://ben.balter.com/contact/) immediately and I will do so.*

---

## Course Schedule

### Departments

- Endpoint: `http://my.gwu.edu/mod/pws/scheduleXML.cfm`
- Parameters: `termCode=[YYYY][01=spring, 02=summer, 03=fall]`
- Returns:

  ```xml
  <?xml version="1.0" encoding="iso-8859-1" ?>
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
  ```

### Courses

- Endpoint: `http://my.gwu.edu/mod/pws/scheduleXML.cfm`
- Parameters:
  1. `termCode=[YYYY][01=spring, 02=summer, 03=fall]`
  2. `deptCode=[Dept. Code]`
- Returns:

  ```xml
  <?xml version="1.0" encoding="iso-8859-1" ?>
  <courses>
    <course>
      <coursedepartment><![CDATA[ACCY]]></coursedepartment>
      <coursenumber><![CDATA[6101]]></coursenumber>
      <coursecrn><![CDATA[55164]]></coursecrn>
      <coursetitle><![CDATA[FinAcctingI:BasicFinStatements]]></coursetitle>
      <courseinstructor><![CDATA[ Singleton, L]]></courseinstructor>
      <courselocation><![CDATA[DUQUES 258]]></courselocation>
      <coursedays><![CDATA[MW 06:10PM - 09:05PM]]></coursedays>
      <coursetime><![CDATA[]]></coursetime>
      <coursestatus><![CDATA[OPEN]]></coursestatus>
      <coursesection><![CDATA[81]]></coursesection>
      <coursecredit><![CDATA[1.50  ]]></coursecredit>
    </course>
  </courses>
  ```

## Campus Map

### Categories

- Endpoint: `http://citl.gwu.edu/iphonedev/maps/categories.xml`
- Returns:

  ```xml
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
  ```

For more details, check out the [GitHub repository](https://github.com/benbalter/GW-API).
