# Receipt Generator API

A fast, lightweight RESTful API built with **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL**. Designed for receipt and sales tracking with automated financial calculations (subtotals, totals, and profits) and a role-based authentication model.

---

## 📌 Project Overview & Constraints

* **User Capacity:** Strictly designed to accommodate a maximum of **6 users total** (including the Superadmin, Admins, and Staff). 
* **Access Control:** Public self-registration is disabled. **Only Admins and Superadmins** can create accounts for new staff members.
* **Automated Credential Distribution:** When an admin creates a staff account, a secure temporary password is automatically generated and emailed directly to the staff member's email address.

## 🚀 Features

* **Authentication & Authorization**: Stateless JWT authentication with long-lived (7-day) sessions. Role-based access control (`SUPER_ADMIN`, `ADMIN`, `STAFF`).
* **Receipt Management**: Full CRUD capabilities for receipts with automatic currency (`NGN`, `USD`, `EURO`, `POUNDS`) and status handling (`paid`, `in-transit`, `delivered`, `refunded`).
* **Item Tracking & Automated Math**: Dynamic item insertion, updates, and deletion. Automated background recalculation of receipt subtotals, totals, and overall profit.
* **Database Resiliency**: Foreign key protections using `SetNull` on receipt creators to ensure zero data loss when users are deleted, and `Cascade` deletion on items when a receipt is removed.

---

## 🛠️ Tech Stack

* **Runtime**: Node.js (ES Modules)
* **Framework**: Express.js
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`

---

## 🗄️ Database Schema Overview

* **User**: `id` (Int), `email`, `name`, `password`, `role` (SUPER_ADMIN, ADMIN, STAFF), `active` (Boolean).
* **Receipt**: `id` (Int), `createdById` (Int?), `createdByName` (String), `customerName`, `customerEmail`, `customerPhone`, `paidDate`, `receivedDate`, `trackingId`, `status`, `currency`, `shippingFee`, `subtotal`, `total`, `totalProfit`, `notes`.
* **Item**: `id` (Int), `receiptId` (Int), `itemName`, `costPrice`, `sellingPrice`, `totalAmount`, `profit`.

---

## 📦 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18+ recommended)
* [PostgreSQL](https://www.postgresql.org/) database running locally or hosted online.

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/thinkingtek/receipt-generator-api.git
cd receipt-generator-api
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/receipt_db?schema=public"
JWT_SECRET="your_super_secret_jwt_key_here"
NODE_ENV="development"
```

### 3. Database Migration & Setup

Sync your Prisma schema with your PostgreSQL database:

```bash
# Push schema directly to database (for fast development)
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

To reset the database during development at any point:
```bash
npx prisma migrate reset
```

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

## 📡 API Endpoints Summary

### Authentication Routes (`/api/auth`)
* `POST /api/auth/login` - Authenticate user & receive 7-day JWT.

### Receipt Routes (`/api/receipts`)
* `GET /api/v1/receipts` - Retrieve all receipts (includes attached items).
* `POST /api/v1/create-receipts` - Create a new receipt header.
* `PUT /api/v1/receipts/:id/update-receipt` - Update receipt details or shipping fee.
* `DELETE /api/v1/receipts/:id/details` - Delete a receipt (cascades to items).

### Item Routes (`/api/receipts`)
* `POST /api/v1/receipts/:receiptId/items` - Add item to receipt & trigger auto-recalculation.
* `PUT /api/v1/receipts/items/:itemId` - Update item pricing/quantity & recalculate receipt totals.
* `DELETE /api/v1/receipts/items/:itemId` - Remove item from receipt & recalculate receipt totals.

---

## 🔐 Authorization Headers

Protected routes require a Bearer token in the request header:

```text
Authorization: Bearer <your_jwt_token>
```