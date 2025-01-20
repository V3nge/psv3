#!/bin/bash

node src/index.js &
sleep 2
caddy reverse-proxy --domain www.project-sentinel.xyz --from :6969 --to :8080