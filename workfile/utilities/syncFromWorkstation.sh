#!/usr/bin/env bash
rsync -varzhP --exclude '/var/www/html/atw/api/config/conn.class.php' --delete -e "ssh -p 7070" beppe@naporezza.asuscomm.com:/var/www/html/atw/ /var/www/html/atw/
