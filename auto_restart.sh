#!/bin/bash

start_server() {
  echo "Starting server..."
  node ./server.js &
  SERVER_PID=$!
  echo "Server started with PID $SERVER_PID"
}

stop_server() {
  if [ -n "$SERVER_PID" ]; then
    echo "Stopping server with PID $SERVER_PID..."
    kill $SERVER_PID
    wait $SERVER_PID 2>/dev/null
    echo "Server stopped."
  fi
}

start_server

LAST_COMMIT=$(git ls-remote origin -h refs/heads/$(git rev-parse --abbrev-ref HEAD) | awk '{ print $1 }')

while true; do
  sleep 10

  git fetch

  NEW_COMMIT=$(git ls-remote origin -h refs/heads/$(git rev-parse --abbrev-ref HEAD) | awk '{ print $1 }')

  if [ "$NEW_COMMIT" != "$LAST_COMMIT" ]; then
    echo "Detected changes in the Git repository."
    stop_server

    echo "Pulling latest changes..."
    git pull
    echo "Changes pulled."

    LAST_COMMIT=$NEW_COMMIT

    start_server
  fi
done
