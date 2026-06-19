# ADRDE Agra Internal Dashboard Portal

Enterprise-style internal workflow portal for ADRDE Agra — React frontend with Node.js/Express/MongoDB backend, JWT auth, Socket.IO notifications, and role-based access.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, Recharts, Socket.IO Client |
| Backend | Node.js, Express, MongoDB Atlas, JWT, bcrypt, Multer, Socket.IO |
| Deploy | Vercel (frontend), Render (backend), MongoDB Atlas |

## Features

- Registration, login, forgot/reset password (mock email when SMTP not configured)
- JWT sessions with role-based access (Admin, Para Head, Scientist, Technical Officer, Staff, Contractual Worker, Intern)
- Meeting workflow: Draft → Under Review → Pending Approval → Approved → Published
- Documents, letters, inventory, agendas, reports, internal inbox/messaging
- Realtime notifications via Socket.IO
- Global search across modules
- ADRDE LAN Portal shortcut tiles (admin-configurable)
- Admin settings: users, shortcuts, roles

## Default Admin (seeded on backend start)

- **Name:** Abhijeet Kumar
- **Email:** dhirendrakumar8594@gmail.com
- **Password:** `Admin@123` (change after first login)

## Local Setup

### 1. MongoDB Atlas

Create a free cluster and copy the connection string.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGODB_URI, JWT_SECRET, CLIENT_URL=http://localhost:5173
npm install
npm run dev
```

API runs at `http://localhost:5000`

### 3. Frontend

```bash
cd ..
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`

## Environment Variables

### Frontend (`.env`)

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Backend (`backend/.env`)

See `backend/.env.example`

## Deployment

### Vercel (Frontend)

1. Import GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment: `VITE_API_BASE_URL=https://your-render-app.onrender.com/api`
5. Environment: `VITE_SOCKET_URL=https://your-render-app.onrender.com`

### Render (Backend)

1. New Web Service → connect repo
2. Root directory: `backend`
3. Build: `npm install`
4. Start: `npm start`
5. Add env vars from `backend/.env.example`
6. Set `CLIENT_URL` to your Vercel URL

### MongoDB Atlas

- Allow network access for Render IP or `0.0.0.0/0` (dev)
- Use connection string in `MONGODB_URI`

## Project Structure

```
src/                 # React frontend
backend/
  controllers/
  models/
  routes/
  middleware/
  uploads/
  utils/
  server.js
```

## API Overview

- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `POST /api/auth/forgot-password` — Reset link (mock in dev)
- `GET /api/meetings` — Meetings CRUD + workflow actions
- `GET /api/documents` — Document upload/download/archive
- `GET /api/notifications` — Notifications
- `GET /api/messages` — Internal mail
- `GET /api/search` — Global search
- `GET /api/shortcuts` — LAN portal modules

## Notes

- UI theme and navbar layout are preserved from the existing ADRDE dashboard design.
- Uploads stored in `backend/uploads/` until cloud storage is integrated.
- Email service uses mock preview mode when SMTP is not configured.
