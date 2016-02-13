---
title: How to convert Shapefiles to GeoJSON maps for use on GitHub (and why you should)
description: An automated process for converting ESRI Shapefiles to .geoJSON map files so that they can be more easily used with GitHub.com
author: Ben Balter
layout: post
comments: true
category: Technology
tags:
  - github
  - geojson
  - json
  - gis
  - shapefiles
  - maps
  - mapping
---

With [GitHub natively supporting mapping](https://github.com/blog/1541-geojson-rendering-improvements) and embeds, I recently wanted to put some of the free, publicly available government data published on [data.dc.gov](http://data.dc.gov) to use. They have all sorts of great information, from [bus routes](https://github.com/benbalter/dc-maps/blob/master/maps/dc-circulator-routes.geojson) to [polling places](https://github.com/benbalter/dc-maps/blob/master/maps/polling-place.geojson), to [the location of every liquor license](https://github.com/benbalter/dc-maps/blob/master/maps/liquor-license-locations.geojson) in DC. The only problem was that the data was stored in a proprietary and complex format known as [a Shapefile](https://en.wikipedia.org/wiki/Shapefile) which arose in an age when the desktop ruled supreme and requires a [costly software subscriptionn](http://www.esri.com/software/arcgis/arcgis-for-home) for many common uses.

Luckily, a strangely named piece of open source software known as [ogr2ogr](http://www.gdal.org/ogr2ogr.html) can convert the data into the more modern, more open [GeoJSON format](http://en.wikipedia.org/wiki/GeoJSON) that GitHub supports, and the resulting map can be automatically rendered, not to mention more easily diffed.


## If you've got a Mac, it only takes a few seconds:

<!-- more -->

1. If you don't already have it, install homebrew by opening up terminal and running: `$ ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"`
2. Install [gdal](http://www.gdal.org/) with the command: `$ brew install gdal`
3. Grab a Shapefile (distributed as a .zip file) from the [DC Data Catalog](http://data.dc.gov) or your favorite data source and unzip it someplace convenient
4. `cd` into the directory with your shiny new unzipped Shapefile
5. Run (replacing `[name]` with the name of your downloaded Shapefile): `$ ogr2ogr -f GeoJSON -t_srs crs:84 [name].geojson [name].shp`
6. Grab the resulting GeoJSON file and commit it to GitHub
7. Navigate to the GeoJSON file on GitHub.com to browse your map

In addition to converting the Shapefile over to GeoJSON, the other step in there, `-t_srs crs:84`, ensures that by the time the data hits GitHub, it's encoded with the right [projection](http://maps.unomaha.edu/Peterson/gis/notes/MapProjCoord.html) so it can be mapped properly. Need to convert multiple Shapefiles in bulk? Just use [this bulk Shapefile to geoJSON conversion script](https://gist.github.com/benbalter/5858851). Windows users? [You're covered too](http://blog.thematicmapping.org/2013/06/converting-shapefiles-to-topojson.html).

*Note:* The same process should work for KML files as well, replacing `[name].shp` with `[name].kml`.


## So why's this important?

For one, you're liberating public geodata that would otherwise be inaccessible to the average citizen and making it available in a dumb-simple point, click, zoom interface that anyone can use. For another, by putting the information on GitHub in an open, text-based format, civic hackers and subject-matter experts can begin treating that data like open source code — forking, merging, diffing, tracking changes over time — and all of a sudden we've opened up not just the data, but the entire collaborative ecosystem that now surrounds it.


## The result

<script src="https://embed.github.com/view/geojson/benbalter/dc-maps/master/maps/embassies.geojson">&nbsp;</script>
