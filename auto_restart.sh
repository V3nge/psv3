#!/bin/bash

# This is bash is to make sure the server is
# never down and that when the repository is
# changed that it will update accordingly.

# Initial pull to make sure everything is up-to-date
git stash
git pull

# NOTE: You will need to restart auto_restart.sh when changing auto_restart.sh

# Keep up-to-date
# The idea is that if nobody were to touch the server ever again
# then nobody would need to do any upgrading manually
keep_to_date() {
  bun upgrade

  # TO BE CLEAR, THIS INSTALLS AND UPDATES ALL REQUIRED PACKAGES
  # AND DOES NOT INSTALL ANOTHER INSTANCE OF BUN!
  bun install
}

start_server() {
  # Start the server and capture the PID
  keep_to_date
  "$(which bun)" run ./src/server.js &
  SERVER_PID=$!
  echo "Server started with PID $SERVER_PID"
}

stop_server() {
  if [ -n "$SERVER_PID" ] && ps -p $SERVER_PID > /dev/null; then
    echo "Stopping server with PID $SERVER_PID..."
    kill $SERVER_PID
    wait $SERVER_PID 2>/dev/null
    echo "Server stopped."
  fi
}

kill_processes_using_port_8080() {
  # Kill any processes using port 8080 (e.g., using UV)
  lsof -ti:8080 | xargs kill -9
}

# Start the server initially
start_server

LAST_COMMIT=$(git ls-remote origin -h refs/heads/$(git rev-parse --abbrev-ref HEAD) | awk '{ print $1 }')

while true; do
  # Poll Git every 5 seconds for changes
  sleep 5

  # Check if there have been any updates to the Git repository
  git fetch

  NEW_COMMIT=$(git ls-remote origin -h refs/heads/$(git rev-parse --abbrev-ref HEAD) | awk '{ print $1 }')

  # Restart server if either Git commit changes or the server is not running
  if [ "$NEW_COMMIT" != "$LAST_COMMIT" ] || ! ps -p $SERVER_PID > /dev/null; then
    echo "Detected changes in the Git repository or server is not running."

    stop_server

    # Pull the latest changes
    git stash # Make sure git doesn't GIT mad!!!!
    git pull

    LAST_COMMIT=$NEW_COMMIT

    # Ensure no lingering processes on port 8080
    kill_processes_using_port_8080

    # Restart the server
    start_server
  fi
done
