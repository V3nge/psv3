#!/bin/bash

# Function to start the server
start_server() {
  echo "Starting server..."
  node ./server.js &
  SERVER_PID=$!
  echo "Server started with PID $SERVER_PID"
}

# Function to stop the server
stop_server() {
  if [ -n "$SERVER_PID" ]; then
    echo "Stopping server with PID $SERVER_PID..."
    kill $SERVER_PID
    wait $SERVER_PID 2>/dev/null
    echo "Server stopped."
  fi
}

# Start the server initially
start_server

# Store the current remote commit hash
LAST_COMMIT=$(git ls-remote origin -h refs/heads/$(git rev-parse --abbrev-ref HEAD) | awk '{ print $1 }')

while true; do
  sleep 5 # Check every 5 seconds

  # Fetch the latest changes
  git fetch

  # Get the latest commit hash from the remote
  NEW_COMMIT=$(git ls-remote origin -h refs/heads/$(git rev-parse --abbrev-ref HEAD) | awk '{ print $1 }')

  # Compare hashes to detect changes
  if [ "$NEW_COMMIT" != "$LAST_COMMIT" ]; then
    echo "Detected changes in the Git repository."
    stop_server

    echo "Pulling latest changes..."
    git pull
    echo "Changes pulled."

    # Update the stored commit hash
    LAST_COMMIT=$NEW_COMMIT

    start_server
  fi
done
