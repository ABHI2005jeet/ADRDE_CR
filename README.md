# ADRDE Agra Dashboard Portal

A professional React + Tailwind CSS prototype for the ADRDE Agra internal monitoring and workflow management portal. The app uses mock JSON-style data only and includes backend placeholder folders for future API integration.

## Features

- Dummy login with Employee ID, password, and role selection
- Role-aware navigation, actions, and mock role switching from profile
- Horizontal government-style top navigation with dropdown menus
- Dashboard metrics, charts, notifications, calendar, timeline, and activity feed
- Working mock flows: meeting create, document upload, letters, inventory, search/filters
- Agenda search, filters, and approval workflow
- Letters (incoming, outgoing, draft) and inventory modules
- User management, roles, and permissions views
- Downloadable PDF-style meeting report generator
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
  config/
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

Use any non-empty Employee ID and password, then pick a role:

| Role | Capabilities (prototype) |
|------|--------------------------|
| **Para Head** | Approve agendas/letters, manage users, reports, inventory |
| **Scientist** | Create/edit meetings, upload documents, manage users |
| **Technical Engineer** | Create meetings, documents, inventory, letters |
| **Staff** | View meetings, documents, letters, reports, tasks |
| **Intern** | View meetings, documents, submit suggestions |
| **Contractual Worker** | Inventory management, view meetings |

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
