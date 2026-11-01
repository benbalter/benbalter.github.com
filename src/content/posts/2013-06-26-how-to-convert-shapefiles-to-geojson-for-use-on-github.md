---
title: Convert Shapefiles to GeoJSON for GitHub Maps
description: How to convert ESRI Shapefiles to GeoJSON so GitHub renders them as interactive maps, and why open formats matter for public data.
tldr: "With GDAL installed, one ogr2ogr command turns a proprietary Shapefile into GeoJSON, which GitHub renders as an interactive map. Once public geodata lives on GitHub in an open, text-based format, anyone can fork, diff, and improve it like code."
---

With [GitHub natively supporting mapping](https://github.com/blog/1541-geojson-rendering-improvements) and embeds, I recently wanted to put some of the free, publicly available government data published on [data.dc.gov](http://data.dc.gov) to use. They have all sorts of great information, from [bus routes](https://github.com/benbalter/dc-maps/blob/master/maps/dc-circulator-routes.geojson) to [polling places](https://github.com/benbalter/dc-maps/blob/master/maps/polling-place.geojson), to [the location of every liquor license](https://github.com/benbalter/dc-maps/blob/master/maps/liquor-license-locations.geojson) in DC. The only problem was that the data was stored in a proprietary and complex format known as [a Shapefile](https://en.wikipedia.org/wiki/Shapefile). The format arose when the desktop ruled supreme, and many common uses require a [costly software subscription](http://www.esri.com/software/arcgis/arcgis-for-home).

Luckily, a strangely named piece of open source software known as [ogr2ogr](http://www.gdal.org/ogr2ogr.html) can convert the data into the more modern, more open [GeoJSON format](https://en.wikipedia.org/wiki/GeoJSON) that GitHub supports, and the resulting map can be automatically rendered, not to mention more easily diffed.

## If you've got a Mac, it only takes a few seconds

1. If you don't already have it, [install Homebrew](https://brew.sh)
2. Install [gdal](http://www.gdal.org/) with the command: `$ brew install gdal`
3. Grab a Shapefile (distributed as a .zip file) from the [DC Data Catalog](http://data.dc.gov) or your favorite data source and unzip it someplace convenient
4. `cd` into the directory with your shiny new unzipped Shapefile
5. Run (replacing `[name]` with the name of your downloaded Shapefile): `$ ogr2ogr -f GeoJSON -t_srs crs:84 [name].geojson [name].shp`
6. Grab the resulting GeoJSON file and commit it to GitHub
7. Navigate to the GeoJSON file on GitHub.com to browse your map

In addition to converting the Shapefile over to GeoJSON, the other step in there, `-t_srs crs:84`, ensures that by the time the data hits GitHub, it's encoded with the right [projection](http://maps.unomaha.edu/Peterson/gis/notes/MapProjCoord.html) so it can be mapped properly. Need to convert multiple Shapefiles in bulk? Just use [this bulk Shapefile to GeoJSON conversion script](https://gist.github.com/benbalter/5858851). Windows users? [You're covered too](http://blog.thematicmapping.org/2013/06/converting-shapefiles-to-topojson.html).

:::note
The same process should work for KML files as well, replacing `[name].shp` with `[name].kml`.
:::

## Why this is important

For one, you're liberating public geodata that would otherwise be inaccessible to the average citizen and making it available in a simple point, click, zoom interface that anyone can use. For another, once you put the information on GitHub in an open, text-based format, civic hackers and subject-matter experts can begin treating that data like open source code (forking, merging, diffing, tracking changes over time), and all of a sudden we've opened up not just the data, but the entire collaborative ecosystem that now surrounds it.

## See the finished map on GitHub

View the [DC Embassies map on GitHub](https://github.com/benbalter/dc-maps/blob/master/maps/embassies.geojson).
