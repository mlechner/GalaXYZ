# Nogo Routing Demo

## Overview

This repository contains a web demo for the nogo routing wrapper functions developed for the pgRouting library.  It consists of a PHP website that uses the Leaflet and Leaflet.draw libararies.  It is intended to be connected to a PostgreSQL database which has been extended with the PostGIS and pgRouting libraries.  For more information about these libraries, please visit their websites at https://postgis.net/ and http://pgrouting.org/.  You will also need to have data in your database that is suitable for use with pgRouting.  Such data can be generated using [osm2pgrouting](https://github.com/pgRouting/osm2pgrouting), or you can restore the data from a backup that is also included in this repository, in the `/db` folder.

Setup is possible on Windows systems, but only an Ubuntu Linux guide is available at this time.

## Database setup

This guide is assuming that you wish to simply use the sample data that is available in this repository.

Set up your PostgreSQL database by following the guide provided by the [PostgreSQL wiki](https://wiki.postgresql.org/wiki/First_steps).

Install pgAdminIII or pgAdmin4 from the [pgAdmin website](https://www.pgadmin.org/).  This step is not necessary but reccommended for beginners, as it provides a visual interface in which to perform the remaining steps.

Create a database, either in pgAdmin or manually from the command line.

Set up the required extensions by executing the following queries on this new database:

`CREATE EXTENSION postgis`

`CREATE EXTENSION pgrouting`

If the extension creation for pgrouting fails, you may need to install the extension on your computer first, so that PostgreSQL can extend a database with it.  See the [pgrouting](http://pgrouting.org/) website for more information.

After all that is done, download [the repository for the nogo queries themselves](https://github.com/HsKA-OSGIS/GalaXYZ-NogoPgRouting), and execute the one called `/nogo_queriesdefine_nogo_trspviaVertices.sql`.  This will enable the query used in the website to do routing along multiple points.

## Getting data into the database

In pgAdmin, right-click on the database and select "Restore", and select the `nogo_dijkstra.backup` file in the `/db` folder.  That's it!

Alternatively from command line (-O is needed, because dump has user-Information included):

`pg_restore -d <db_name> -O ./db/nogo_dijkstra.backup`

Note: if you want to use a different region, you can generate a network dataset for any region directly from [OpenStreetMap](https://www.openstreetmap.org/) data using the [osm2pgrouting](https://github.com/pgRouting/osm2pgrouting) utility.  Just be advised that the website uses queries hardcoded for an network edges table called `ways`.  So either use that for your network edges table name, or go into the website code and change it there.

## Setting up website

the `config.json` file in `/www` must be edited to correctly reference your database. For using the Geocoder create an account for HERE and get valid access keys ([HERE Geocoder API](https://developer.here.com/documentation/geocoder/topics/introduction.html), 90 day free trial possible (January 18)).


For the webpage to function correctly, the following needs to be installed:
* apache2
* php7.0
* libapache2-mod-php7.0
* php7.0-XML
* php-zip
* php pgsql

```sh
sudo apt-get update
```

```sh
sudo apt-get install apache2 php7.0 libapache2-mod-php7.0 php7.0-xml php-zip php7.0-pgsql
```

## Enabling shapefile upload (optional)

Once the repository has been cloned, a folder called 'upload' can be created within the `/www/php` directory to enable uploading of shapefles as nogo areas. Read and write permission must be given to this folder to allow php to uplaod and read uploaded files. This can be done with the following command:

```sh
sudo chmod 777 -R /path/to/upload
```

The website can then be deployed to your server.  On Ubuntu systems, you can use the folder `/var/www/html` as a server, just put the contents of the `/www` folder in a folder with a specific name (ex. `GalaXYZ`), and you can then access it in a web browser by going to the url `http://localhost/GalaXYZ/`

## Credits

Credit must be given to the pgRouting team, who have designed such a great open source routing library, and provided help and insight during development.

These functions were developed as part of the class "Open Source GIS" at Hochschule Karlsruhe, with [Dr. Marco Lechner](https://www.researchgate.net/profile/Marco_Lechner) as instructor.

The group consisted of:

* [Isaac Boates](https://www.linkedin.com/in/isaac-boates-338547100/)
* [Rob Coppinger](https://www.linkedin.com/in/rob-coppinger-456b17103/)
* [Anja Fürst](https://www.linkedin.com/in/anja-f%C3%BCrst-136899144/)
* [Olumide Igbiloba](https://www.linkedin.com/in/olumide-igbiloba/)
