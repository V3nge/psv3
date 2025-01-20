#!/bin/bash

node src/index.js &
sleep 2
caddy --domain www.project-sentinel.xyz reverse-proxy --from :6969 --to :8080