#!/bin/sh

set -e

# Wait for the database to be ready
echo "Waiting for database to be ready..."
sleep 5

# Get database directory from DATABASE_URL
if [ "$NODE_ENV" = "production" ]; then
  DB_DIR="/app/data"
  DB_FILE="/app/data/production.db"
else
  DB_DIR="./data"
  DB_FILE="./data/dev.db"
fi

# Create database directory if it doesn't exist
echo "Ensuring database directory exists at $DB_DIR..."
mkdir -p $DB_DIR
chmod 755 $DB_DIR

# Check if the database file exists
if [ ! -f "$DB_FILE" ]; then
  echo "Database file not found at $DB_FILE. Creating new database..."
  touch "$DB_FILE"
  chmod 644 "$DB_FILE"
fi

# Run migrations
echo "Running database migrations..."
if [ "$NODE_ENV" = "production" ]; then
  node dist/src/shared/database/migration-runner.js
else
  npx ts-node -r tsconfig-paths/register src/shared/database/migration-runner.ts
fi

# Check migration exit status
MIGRATION_EXIT_CODE=$?
if [ $MIGRATION_EXIT_CODE -ne 0 ]; then
  echo "Migration failed with exit code $MIGRATION_EXIT_CODE"
  exit $MIGRATION_EXIT_CODE
fi

# Start the application
echo "Starting application..."
exec "$@"