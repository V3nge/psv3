#!/bin/bash

node src/index.js &
sleep 2
caddy reverse-proxy --from :8080 --to :6969
