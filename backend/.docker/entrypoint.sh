#!/bin/sh
set -e

echo "Running migrations..."
npm run migration:run:prod

echo "Seeding..."
npm run seed:prod

echo "Starting backend..."
exec npm run start:prod
