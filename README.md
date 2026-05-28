# User Management Web

Admin dashboard for **user-management-api**. Manage users, categories, products, and activity logs with role-based access control.

Built with **Vue 3**, **Vite**, **Ant Design Vue**, **Pinia**, and **Chart.js**.

## Features

- JWT login with API key authentication
- Role and permission-based navigation
- **Dashboard** — overview stats
- **Users** — CRUD (admin)
- **Categories** — CRUD with search
- **Products** — CRUD with search
- **Activity logs** — paginated table, user filter, search, pie/bar charts from stats API
- **404 page** — Ant Design `Result` for unknown routes

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- [pnpm](https://pnpm.io/) `>=9`
- **user-management-api** running locally (default `http://localhost:8080`)

The API must allow your frontend origin in `CORS_ALLOWED_ORIGINS` (e.g. `http://localhost:3000`).

## Quick start

```bash
# Install dependencies
pnpm install

# Copy environment file and fill in values from the API .env
cp .env.example .env

# Start dev server (http://localhost:3000)
pnpm dev
```

Sign in with an admin account that has the required permissions (see `.env.example` for optional login pre-fill values).

## Scripts

| Command        | Description                    |
| -------------- | ------------------------------ |
| `pnpm dev`     | Dev server on port 3000        |
| `pnpm build`   | Production build to `dist/`    |
| `pnpm preview` | Preview production build       |

## Environment variables

Create a `.env` file from `.env.example`:

| Variable                     | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| `VITE_API_BASE_URL`          | API base URL (e.g. `http://localhost:8080`)      |
| `VITE_API_KEY`                 | API key (must match the backend)                 |
| `VITE_API_KEY_HEADER`          | Custom API key header name from the backend      |
| `VITE_DEFAULT_ADMIN_EMAIL`     | Optional — pre-fills login email in dev          |
| `VITE_DEFAULT_ADMIN_PASSWORD`  | Optional — pre-fills login password in dev       |

Only variables prefixed with `VITE_` are exposed to the client. Never commit `.env`.

## Project structure

```
src/
├── api/client.js           # Axios instance, API key + JWT interceptors
├── layout/MainLayout.vue   # Sidebar shell
├── components/charts/      # Chart.js wrappers
├── modules/
│   ├── auth/               # Login, store, JWT persistence
│   ├── dashboard/
│   ├── users/
│   ├── categories/
│   ├── products/
│   ├── logs/               # Activity logs + charts
│   └── errors/             # 404 page
├── router/index.js         # Aggregates module routes
└── utils/                  # API helpers, permissions, log analytics
```

Each feature module follows the same pattern:

- `service.js` — API calls
- `route.js` — Vue Router routes
- `pages/*.vue` — UI
- `pages/use*.js` — composable page logic

## Permissions

Routes are guarded by permissions returned from the login/me API:

| Permission           | Access                          |
| -------------------- | ------------------------------- |
| `users.manage`       | Users CRUD                      |
| `categories.view`    | View categories                 |
| `categories.manage`  | Create/update/delete categories |
| `products.view`      | View products                   |
| `products.manage`    | Create/update/delete products   |
| `logs.view`          | Activity logs and charts        |

## API integration

- All requests include the configured API key header and `Authorization: Bearer <token>` when logged in.
- List endpoints support `?search=` and return `{ success, data: [...], meta: { total, page, per_page, total_pages } }`.
- Activity log charts use:
  - `GET /api/v1/admin/logs/stats/events?days=30`
  - `GET /api/v1/admin/logs/stats/daily?days=7`

During development, Vite proxies `/api` to `http://localhost:8080` as a fallback when using a relative API base URL.

## Production build

```bash
pnpm build
```

Serve the `dist/` folder with any static host. Set `VITE_*` env vars at **build time** so they are baked into the bundle.
