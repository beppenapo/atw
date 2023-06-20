#!/usr/bin/env bash
rsync -varzhP --exclude '/var/www/html/atw/api/config/db.ini' --delete /var/www/html/atw/ beppe@91.121.82.80:/var/www/atw/
