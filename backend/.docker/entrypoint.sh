#!/bin/sh

# Set the port in Nginx config
echo "Configuring Nginx port to $PORT..."
sed -i "s/PORT_NUMBER/${PORT:-8080}/g" /etc/nginx/http.d/default.conf

# Wait for database if needed (optional, Laravel handles db errors cleanly)
echo "Caching Laravel configurations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
echo "Running migrations..."
php artisan migrate --force

# Seed database only if it's empty
echo "Checking if database needs seeding..."
php artisan tinker --execute="if (\App\Models\User::count() === 0) { \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]); echo 'Seeded successfully.'; } else { echo 'Database already seeded.'; }"

# Start PHP-FPM in the background
echo "Starting PHP-FPM..."
php-fpm -D

# Start Nginx in the foreground
echo "Starting Nginx..."
nginx -g "daemon off;"
