#!/bin/sh
# Wait until MongoDB is ready
until nc -z mongo 27017; do
  echo "Waiting for MongoDB..."
  sleep 2
done

exec "$@"
