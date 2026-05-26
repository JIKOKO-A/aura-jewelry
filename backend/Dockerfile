FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    bash \
    sed \
    git \
    unzip \
    zip

# Install PHP extensions using the official extension installer
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions && \
    install-php-extensions pdo_mysql bcmath zip opcache gd mbstring xml curl

# Copy Composer from the official image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy all project files
COPY . .

# Install production dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Configure Nginx default site
COPY .docker/nginx.conf /etc/nginx/http.d/default.conf

# Setup writable permissions for Laravel storage and cache directories
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Make the entrypoint script executable
RUN chmod +x /var/www/html/.docker/entrypoint.sh

# Expose port (Railway will override this, but good to declare)
EXPOSE 8080

# Execute startup entrypoint
ENTRYPOINT ["/var/www/html/.docker/entrypoint.sh"]
