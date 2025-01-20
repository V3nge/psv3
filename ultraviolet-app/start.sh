#!/bin/bash

node src/index.js &
sleep 2
caddy run