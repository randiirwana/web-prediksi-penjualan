#!/bin/bash
set -e

echo "🚀 Starting Flask application with Gunicorn..."
echo "📱 Port: ${PORT:-8080}"
echo "🌍 Host: 0.0.0.0"

# Start the application
exec gunicorn \
    --workers 2 \
    --threads 4 \
    --timeout 120 \
    --bind 0.0.0.0:${PORT:-8080} \
    --access-logfile - \
    --error-logfile - \
    app:app
