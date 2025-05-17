#!/bin/sh
set -e

# Wait for database to be ready
echo "Waiting for database to be ready..."
npx prisma migrate deploy || exit 1

# Start the application
echo "Starting the application..."
exec node server.js 