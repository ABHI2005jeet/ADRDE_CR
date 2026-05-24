# ADRDE Agra - MAC Meeting Agenda Dashboard

A professional React + Tailwind CSS prototype for an internal ADRDE meeting agenda management module. The app currently uses mock JSON-style data only and includes backend placeholder folders for future API integration.

## Features

- Dummy login with role selection
- Role-aware navigation and actions
- Dashboard metrics, charts, notifications, and activity feed
- Meeting creation, editing, and deletion using mock state
- Agenda search, filters, and approval workflow
- Monthly calendar with meeting-date highlights
- Visual meeting workflow timeline
- Mock document upload center
- Downloadable PDF-style meeting report generator
- Profile and role access pages
- Light and dark mode
- Responsive layout

## Tech Stack

- React
- Tailwind CSS
- Vite
- Mock local data, no backend/database

## Project Structure

```text
src/
  assets/
  components/
  context/
  hooks/
  mockData/
  pages/
  services/
  utils/
backend_placeholder/
  api/
  controllers/
  models/
```

## Demo Login

Use any non-empty username and password, then pick a role:

| Role | Capabilities (prototype) |
|------|------------------------|
| **Admin** | Create/edit/delete meetings, manage users, upload documents |
| **Para Head** | Approve agendas, view and download reports |
| **Staff** | View meetings, manage assigned tasks, documents |
| **Employee** | View meetings, submit suggestions |

## Run Locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Build

```bash
npm run build
```

The Vite config uses a relative base path, so the static build is friendly to Vercel and GitHub Pages style hosting.
