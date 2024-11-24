#!/bin/bash
 
PATH=/bin:/usr/bin

# if the app name _IS_ found in process list, exit
ps xc|fgrep "start_server.sh" >/dev/null && exit 0

# if the app isn't found, open it
echo Starting server
/var/www/html/start_server.sh &

exit 0
