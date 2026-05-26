# AURA Jewelry — Full Stack E-commerce Application

Welcome to AURA, a premium luxury jewelry e-commerce storefront. This repository contains the complete codebase, comprising a **Next.js (TypeScript)** frontend SPA and a **Laravel (PHP)** REST API backend database layer.

---

## Technical Stack Overview

* **Frontend**: Next.js 16 (App Router, Tailwind CSS v4, Framer Motion, Lucide icons, Stripe elements, Sonner toasts)
* **Backend**: Laravel 13, Laravel Sanctum, Stripe SDK, SQLite/MySQL support
* **Containers**: Docker Compose (MySQL 8, Redis 7)

---

## 1. Local Database Setup (Docker)

Ensure Docker Desktop is running on your host machine.

```bash
# From the project root, start MySQL and Redis containers
docker compose up -d
```

This spins up:
* **MySQL** database container exposed on port `3306`
* **Redis** caching container exposed on port `6379`

> **Note**: If you run into directory initialization errors, reset the volumes via `docker compose down -v` and run `docker compose up -d` again.

---

## 2. Backend (Laravel) Setup

From the project root, navigate to the `backend` folder:

```bash
cd backend
```

1. **Install Composer Packages**:
   Bypass platform dependencies (if your local machine lacks curl or mbstring PHP extensions):
   ```bash
   composer install --ignore-platform-reqs
   ```

2. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Ensure the following values are configured in your `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=jewelry_db
   DB_USERNAME=jewelry_user
   DB_PASSWORD=secretpassword

   STRIPE_SECRET_KEY=sk_test_51OzK3VE1gK1iZgM5qC6Vp4iU3534b8c9d0e1f2a3
   ```

3. **Generate Application Encryption Key**:
   ```bash
   php artisan key:generate
   ```

4. **Run Database Migrations & Seeders**:
   This configures table schemas and populates default products, categories, and the administrator profile:
   ```bash
   php artisan migrate:fresh --seed
   ```

5. **Start Dev Server**:
   ```bash
   php artisan serve
   ```
   The backend will boot and serve the API on **`http://127.0.0.1:8000`**.

---

## 3. Frontend (Next.js) Setup

From the project root, navigate to the `frontend` folder:

```bash
cd ../frontend
```

1. **Install Node Packages**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   ```bash
   cp .env.example .env.local
   ```
   Ensure the variables are pointing to your local server:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51OzK3VE1gK1iZgM5qC6Vp4iU3534b8c9d0e1f2a3
   ```

3. **Start Next Dev Server**:
   ```bash
   npm run dev
   ```
   The storefront web application will run at **`http://localhost:3000`**.

---

## 4. Default Credentials (Seeded)

For swift testing and auditing, the database is seeded with:

### Admin User (Full Access to `/admin` Portal)
* **Email Address**: `admin@aura.com`
* **Password**: `password`

### Client User (Standard Portal Access)
* Create any new user via the `/signup` storefront page.
* Newly registered accounts will receive **100 welcome Aura Points** automatically.
