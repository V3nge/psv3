#!/bin/bash
 
PATH=/bin:/usr/bin

cd /var/www/html
node server.js >> server.log
exit 0

