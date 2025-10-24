#!/bin/sh
set -e

echo "Running database migrations..."
tsx node_modules/knex/bin/cli.js migrate:latest

echo "Seeding database..."
tsx node_modules/knex/bin/cli.js seed:run

echo "Starting API server..."
npm start
