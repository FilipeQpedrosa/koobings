#!/bin/sh

set -e

MAX_RETRIES=5
RETRY_INTERVAL=5

echo "Starting database migration process..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
for i in $(seq 1 $MAX_RETRIES); do
    if npx prisma db push --skip-generate; then
        echo "Database is ready!"
        break
    fi

    if [ $i -eq $MAX_RETRIES ]; then
        echo "Failed to connect to database after $MAX_RETRIES attempts"
        exit 1
    fi

    echo "Database not ready, waiting $RETRY_INTERVAL seconds... (Attempt $i/$MAX_RETRIES)"
    sleep $RETRY_INTERVAL
done

# Run migrations
echo "Running database migrations..."
if npx prisma migrate deploy; then
    echo "Migrations completed successfully!"
    
    # Generate Prisma Client
    echo "Generating Prisma Client..."
    npx prisma generate
    
    echo "Migration process completed successfully!"
    exit 0
else
    echo "Migration failed!"
    exit 1
fi 