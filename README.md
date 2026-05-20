# Smart Leads Dashboard

A production-grade, secure, and highly optimized MERN stack application built to manage sales leads efficiently. The application features a fully responsive, modern dashboard with interactive analytics, role-based access control, CSV exports, dark mode support, and full Docker orchestration.

---

## Key Features

1. **Robust Authentication**: Secure registration and login utilizing bcrypt password hashing and state-of-the-art JWT authentication stored in secure `HttpOnly` cookies.
2. **Role-Based Access Control (RBAC)**:
   - **Admin**: Full CRUD capabilities over leads, including the ability to delete records.
   - **Sales Rep**: Create, read, and update leads, but restricted from deleting any records.
3. **Interactive Analytics**: Dynamic dashboard widgets rendering:
   - Lead acquisition trend over time (Area Chart).
   - Leads distribution by current status (Donut Pie Chart).
   - Lead acquisition channels performance (Bar Chart).
   - High-level KPIs (Conversion rates, total leads, active contacts).
4. **Advanced Lead Grid**:
   - Debounced search filtering (by name/email).
   - Faceted dropdown filters (by status, source).
   - Column sorting.
   - Syncs all search and filter configurations directly with the URL search parameters for seamless shareability.
5. **CSV Export Service**: Export filtered lead cohorts instantly to standard CSV sheets.
6. **Premium Design System**: Fully responsive UI built with TailwindCSS v3 and custom Inter typography. Features a dark mode toggle stored in localStorage, glassmorphic panels, and entrance animations via Framer Motion.
7. **Performance Optimization**: Code splitting with `React.lazy` and `Suspense` loaders to optimize bundle footprints.

---

## Project Structure

```
giglead/
├── docker-compose.yml       # Orchestrates MongoDB, Node API, and React client
├── .env.example             # Template for local environment variables
├── .env.development         # Environment configuration for development containers
├── backend/
│   ├── Dockerfile           # Multi-stage production build for Node/Express
│   ├── tsconfig.json        # TypeScript server configuration
│   ├── package.json         # Node server package manifest
│   └── src/
│       ├── app.ts           # Express Application entrypoint
│       ├── config/          # DB connection & global constants
│       ├── models/          # Mongoose database models (User, Lead)
│       ├── repositories/    # Database queries & aggregation layer
│       ├── services/        # Business logic layer (Auth, Leads, CSV, Charts)
│       ├── controllers/     # HTTP controllers parsing request variables
│       ├── routes/          # RESTful Endpoint mapping
│       ├── middleware/      # Auth security checks, zod parse runners, errors
│       └── scripts/         # DB initialization & mock data seeder script
└── frontend/
    ├── Dockerfile           # Multi-stage compile served by an Nginx server
    ├── nginx.conf           # SPA router redirect configurations
    ├── tailwind.config.js   # Custom dark mode configurations and palettes
    ├── package.json         # React SPA package manifest
    └── src/
        ├── App.tsx          # Session validation & provider setups
        ├── index.css        # Tailwind base imports & custom scrollbars
        ├── types/           # Type definitions (User, Lead, Analytics)
        ├── store/           # Zustand global state (Auth, Theme toggle)
        ├── services/        # Axios API client setup (withCredentials)
        ├── hooks/           # useDebounce filter utility hook
        ├── layouts/         # Shared grid wrapper (AuthLayout, DashboardLayout)
        ├── routes/          # Protected security routing guards
        └── pages/           # Default pages (Dashboard, Leads, Details, Profile)
```

---

## Technical Stack

- **Frontend**: React 19 (TypeScript), Vite, TailwindCSS, TanStack Query, Zustand, Recharts, React Router, Framer Motion, Lucide React, Axios, React Hook Form, Zod.
- **Backend**: Node.js, Express.js (TypeScript), MongoDB, Mongoose, JWT, Bcrypt, Dotenv, Cookie-Parser, Helmet, Cors, Zod.
- **DevOps**: Docker, Docker Compose, Nginx (Alpine).

---

## Quick Start (Docker Compose)

Spin up the entire architecture (Database, API, and Client) with a single command.

### 1. Copy Environment Settings
Ensure you have the required variables configured:
```bash
cp .env.example .env.development
```

### 2. Startup Containers
Run Docker Compose in build mode:
```bash
docker-compose up --build
```
This builds:
- MongoDB listening on `27017`
- Express API server listening on `5000`
- Nginx frontend SPA server listening on `5173`

The dashboard will be available at **[http://localhost:5173](http://localhost:5173)**.

---

## Local Development (Without Docker)

If you prefer to run services individually on your system:

### 1. MongoDB Setup
Ensure a local MongoDB server instance is active at `mongodb://localhost:27017/`.

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Set environment variables. Copy `.env.example` in the root to `backend/.env`:
   ```bash
   cp ../.env.example .env
   ```
   *(Ensure `MONGODB_URI` points to your local MongoDB instance, e.g., `mongodb://localhost:27017/smart_leads`)*
4. Run the seed script to populate mock users and leads:
   ```bash
   npm run seed
   ```
   **Mock Accounts generated:**
   - **Admin Rep**: `admin@smartleads.com` / `Password123`
   - **Sales Rep**: `sales@smartleads.com` / `Password123`
5. Spin up the backend server in development mode:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a second terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Boot up the Vite hot-reloading dev server:
   ```bash
   npm run dev
   ```
4. Access the web app at **[http://localhost:5173](http://localhost:5173)**.

---

## User Access & Permissions Matrix

| Resource Action | Admin Role | Sales Rep Role |
| :--- | :---: | :---: |
| Authenticate / Register | ✅ | ✅ |
| View Analytics | ✅ | ✅ |
| View Leads / Detailed profiles | ✅ | ✅ |
| Create Leads | ✅ | ✅ |
| Edit Leads | ✅ | ✅ |
| Export Lead Lists to CSV | ✅ | ✅ |
| Update Personal Account Profile | ✅ | ✅ |
| Delete Lead Records | ✅ | ❌ *(Disabled)* |

---

## Verification & Manual Testing Steps

1. **Authentication Flow**: Verify session persistence across reloads by logging in, refreshing the browser, and checking that the app remains in logged-in state (handled via secure JWT verification on mount).
2. **Dashboard Visuals**: Verify area graphs rendering month-over-month leads, donut charts showing status segmentation, and channel bar charts.
3. **Leads Filtering**: Enter searches in the query box; confirm the URL updates parameters. Toggle filters and sorting to observe reactive network queries.
4. **RBAC Rules**: Log in as `sales@smartleads.com`. Navigate to the leads list and lead details. Confirm that "Delete Lead" actions are hidden or disabled. Log back in as `admin@smartleads.com` and verify delete options are restored.
5. **CSV Download**: Click the "Export CSV" button and ensure download prompts occur with matching records.
