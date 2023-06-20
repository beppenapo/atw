#!/usr/bin/env bash
rsync -varzhP --exclude '/var/www/html/atw/api/config/conn.class.php' --delete /var/www/html/atw/ beppe@91.121.82.80:/var/www/arc-team.com/atw/
