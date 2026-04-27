# Zynkly – Cleaning Request Platform

Full-stack cleaning request platform (React + Node.js + MongoDB). Users sign in with Gmail, verify via OTP, view services (no prices), add to cart, and place orders. Admin can view requests and update status. Nodemailer for OTP/confirmation emails; WhatsApp Cloud API for admin notifications.

## Project structure

- **backend/** – Node.js + Express, MongoDB, Passport (Google OAuth), Nodemailer, WhatsApp utils
- **frontend/** – React, React Router, Axios

## Setup

### Backend

1. Copy env sample and set variables:
   ```bash
   cd backend
   cp env.sample .env
   ```
   Edit `.env`:
   - `MONGO_URI` – MongoDB connection string
   - `SESSION_SECRET` – random string for sessions
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` – from [Google Cloud Console](https://console.cloud.google.com/) (OAuth 2.0 credentials). Authorized redirect URI: `http://localhost:5000/api/auth/google/callback` (or your backend URL + `/api/auth/google/callback`)
   - `FRONTEND_URL` – e.g. `http://localhost:3000`
   - `BACKEND_URL` – e.g. `http://localhost:5000`
   - `EMAIL_USER`, `EMAIL_PASS` – Gmail (use App Password if 2FA is on)
   - `WHATSAPP_CLOUD_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ADMIN_NUMBER` – for WhatsApp Cloud API (optional)

2. Install and run:
   ```bash
   npm install
   npm run dev
   ```
   Server runs at `http://localhost:5000`.

3. Seed services (and optionally set admin):
   ```bash
   node scripts/seed.js
   ```
   To make a user admin: log in once with that Gmail, set `ADMIN_EMAIL=that@gmail.com` in `.env`, then run `node scripts/seed.js` again.

### Frontend

1. Create `.env` in `frontend/` (optional):
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

2. Install and run:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   App runs at `http://localhost:3000`.

## Features

- **Auth:** Gmail login (Passport Google OAuth), OTP verification (Nodemailer), session-based auth
- **User:** View services (no prices), cart, place order (Name, Room Number, PG Name, Mobile), confirmation email, WhatsApp notification to admin number
- **Admin:** Login (same Gmail; user must have `isAdmin: true`), view all orders and customers, update order status (Pending / Accepted / Completed / Cancelled)

## API overview

- `GET/POST /api/auth/*` – Google auth, verify OTP, resend OTP, logout, me
- `GET/POST/PUT/DELETE /api/services` – list services; create/update/delete (admin)
- `GET/POST/DELETE /api/cart/*` – get cart, add, remove, clear (authenticated)
- `POST /api/orders` – place order; `GET /api/orders/my-orders` – user orders; `GET /api/orders/all`, `GET /api/orders/:id`, `PUT /api/orders/:id/status` – admin
- `GET /api/admin/users`, `GET /api/admin/users/:id` – admin only
