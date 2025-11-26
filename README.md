# Bazaar API (Nest.js Edition)

Bazaar API is a modern, modular backend built using **Nest.js**,
**Prisma**, and **PostgreSQL**.\
It powers a functional online marketplace with authentication, product
listings, carts, orders, and reviews.\
This backend is designed to be scalable, cleanly organized, and
portfolio-ready.

------------------------------------------------------------------------

## Tech Stack

-   **Nest.js** -- backend framework
-   **Prisma ORM** -- type-safe database client
-   **PostgreSQL** -- relational database
-   **Node.js + TypeScript**
-   **JWT Authentication**
-   **Docker (optional for local DB)**

------------------------------------------------------------------------

## Core Features

### **Authentication / Users**

-   Register / Login
-   JWT-based auth
-   Password hashing
-   Role-based access
    -   buyer\
    -   seller\
    -   admin

### **Products**

-   Sellers can create, update, delete products
-   Public product browsing
-   Product details endpoint
-   Image URL support (S3-ready)

### **Cart**

-   One cart per user
-   Add / remove / update items
-   Clear cart
-   Server-side persistence

### **Orders**

-   Buyers can create orders
-   Order item records
-   Total calculation
-   Buyer order history

### **Reviews**

-   Buyers can review products they purchased
-   Rating + optional comment
-   Review listing per product

------------------------------------------------------------------------

## Project Goals

-   Learn and demonstrate Nest.js architecture
-   Provide a complete backend for the Bazaar Angular client
-   Showcase Prisma relational modeling
-   Implement robust authentication and guards
-   Build real marketplace-domain functionality

------------------------------------------------------------------------

## Architecture Overview

### **Modules**

-   `auth`
-   `users`
-   `products`
-   `cart`
-   `orders`
-   `reviews`
-   `prisma`

### **Core Concepts**

-   Controllers for routing\
-   Services for business logic\
-   DTOs with validation\
-   Guards for authentication\
-   Prisma client for DB access

------------------------------------------------------------------------

## Database Schema Overview

### **Models**

-   `User`
-   `Product`
-   `Order`
-   `OrderItem`
-   `Cart`
-   `CartItem`
-   `Review`

### **Relationships**

-   A user has one cart\
-   A user can have many orders\
-   A seller (user) has many products\
-   A product has many reviews\
-   A cart has many cart items\
-   An order has many order items

------------------------------------------------------------------------

## Getting Started

### **Prerequisites**

-   Node.js\
-   PostgreSQL or Docker\
-   npm

### **1. Clone the repo**

    git clone https://github.com/your-username/bazaar-api.git
    cd bazaar-api

### **2. Install dependencies**

    npm install

### **3. Configure environment variables**

Create a `.env` file:

    DATABASE_URL="postgresql://postgres:password@localhost:5432/bazaar"
    JWT_SECRET="your-secret"
    PORT=3000

### **4. Start PostgreSQL (Docker optional)**

    docker run --name bazaar-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=bazaar -p 5432:5432 -d postgres

### **5. Run Prisma migrations**

    npx prisma migrate dev

### **6. Start development server**

    npm run start:dev

------------------------------------------------------------------------

## Environment Variables

  Variable         Description
  ---------------- ------------------------------
  `DATABASE_URL`   PostgreSQL connection string
  `JWT_SECRET`     Secret key for JWT signing
  `PORT`           API port
  `NODE_ENV`       environment mode

------------------------------------------------------------------------

## Available Scripts

    npm run start          # production
    npm run start:dev      # development
    npm run build          # build project
    npx prisma studio      # database browser
    npx prisma migrate dev # run migrations

------------------------------------------------------------------------

## API Routes Summary

### **Auth**

-   `POST /auth/register`
-   `POST /auth/login`

### **Users**

-   `GET /users/me`

### **Products**

-   `GET /products`
-   `GET /products/:id`
-   `POST /products` (seller only)
-   `PATCH /products/:id`
-   `DELETE /products/:id`

### **Cart**

-   `GET /cart`
-   `POST /cart/add`
-   `PATCH /cart/item/:id`
-   `DELETE /cart/item/:id`
-   `DELETE /cart/clear`

### **Orders**

-   `POST /orders`
-   `GET /orders/mine`

### **Reviews**

-   `POST /reviews`
-   `PATCH /reviews/:id`
-   `DELETE /reviews/:id`
-   `GET /reviews/product/:productId`

------------------------------------------------------------------------

## Testing (Placeholder)

-   Jest unit tests
-   E2E tests with Supertest *(optional future work)*

------------------------------------------------------------------------

## Deployment Notes

-   Use `docker-compose` to bundle API + DB
-   Set production `DATABASE_URL` and `JWT_SECRET`
-   Run migrations before deploy
-   Use a connection pooler (e.g., PG Bouncer)

------------------------------------------------------------------------

## Roadmap

-   Product categories
-   Search + filtering
-   Image uploads via S3
-   Admin moderation tools
-   Rate limiting
-   Email verification

------------------------------------------------------------------------

## License

MIT License
