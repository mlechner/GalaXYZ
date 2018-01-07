# Set up

This demo has been developed for Linux systems. Windows implementation is possible but not supported

to implement the demo webpage a PostGIS enabled postgres database must be installed, along with pgrouting.

the config.json file in /www must be edited to correctly reference your database

For the webpage to function correctly, the following needs to be installed:
* apache2
* php7.0
* libapache2-mod-php7.0
* php7.0-XML
* php pgsql

'''sh
sudo apt-get update
'''

'''sh
sudo apt-get install apache2 php7.0 libapache2-mod-php7.0 php7.0-xml php-zip php7.0-pgsql
'''

Once the repository has been cloned, a folder called 'upload' must be created within the /www/php directory. Read and write permission must be given to this folder to allow php to uplaod and read uploaded files. This can be done with the following command:

'''sh
sudo chmod 777 -R /path/to/upload
'''
