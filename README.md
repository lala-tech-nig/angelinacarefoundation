# Angelina Care Foundation - Full Stack Website

A modern, professional website and admin dashboard for Angelina Care Foundation NGO.

## 🏗️ Architecture
- **Frontend**: Next.js (Client folder)
- **Backend**: Node.js / Express / MongoDB (Server folder)

## 🚀 Quick Start

### 1. Setup Environment
**Server (`/server/.env`):**
- Add your MongoDB URI.
- Add Cloudinary credentials (required for image uploads).
- Add Email credentials (for contact form notifications).

**Client (`/client/.env.local`):**
- Ensure `NEXT_PUBLIC_API_URL` points to your backend (default: `http://localhost:5000/api`).

### 2. Install Dependencies
```bash
# In /server
npm install --legacy-peer-deps

# In /client
npm install
```

### 3. Run Development Servers
```bash
# Terminal 1 (Server)
cd server
npm run dev

# Terminal 2 (Client)
cd client
npm run dev
```

## 🔐 Admin Access
- **URL**: `http://localhost:3000/admin/login`
- **Default Email**: `angelinacarefoundation@gmail.com`
- **Default Password**: `Admin@123456`

## ✨ Features
- Cinematic Hero Carousel with animations.
- Dynamic Programs & Impact statistics.
- Gallery and News management.
- Team member profiles.
- Integrated Paystack donation button.
- Responsive contact form with email notifications.
- Complete Admin Dashboard to control all content.
