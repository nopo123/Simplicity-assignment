# Announcements — Fullstack assignment

Fullstack application for managing city announcements: a sortable table, a create/edit form with
validation, fulltext search, category filtering, and an in-app websocket notification.

- **Backend** — NestJS + TypeORM + PostgreSQL. REST API on `/v1`, Swagger, migrations, seed, tests.
  Full API reference in [backend/README.md](backend/README.md).
- **Frontend** — React + Vite + MUI. Announcements table and the announcement form.
  Implementation notes in [frontend/README.md](frontend/README.md).

## Quick start

Everything, including the database, migrations and demo data:

```bash
cp .env.example .env
docker compose up -d
```

| | URL |
|---|---|
| Frontend | http://localhost:3001 |
| Backend | http://localhost:3000 |
| Swagger UI | http://localhost:3000/swagger |

The backend container runs the migrations and the seed in its entrypoint before starting, so the API
comes up with the nine categories and ten demo announcements already in place. The seed is
idempotent — a second `docker compose up -d` logs `Seed skipped` instead of duplicating rows.

Nothing has to be installed on the host. To watch the startup:

```bash
docker compose logs -f backend
```

To start over with an empty database (this deletes the volume):

```bash
docker compose down -v && docker compose up -d
```

## Ports

Every host port is a variable in the root `.env`, because 5432 and 3000 are commonly already taken.
Container-internal ports never change — only the host side of the binding does.

| Variable | Default | Service |
|---|---|---|
| `FRONTEND_PORT` | `3001` | nginx serving the built frontend |
| `BACKEND_PORT` | `3000` | the API |
| `DATABASE_PORT` | `5432` | `postgres_db`, the application database |
| `DATABASE_PORT_TEST` | `5433` | `test_db`, used only by the e2e tests |

If you change `BACKEND_PORT`, change `VITE_BACKEND_HOST` to match **and rebuild the frontend**:

```bash
docker compose build frontend && docker compose up -d frontend
```

Vite inlines environment variables at build time, so the API URL is baked into the JavaScript bundle
rather than read when the page loads. Changing it in `.env` without rebuilding leaves the old URL in
the bundle, and the browser reports the resulting failure as a CORS error even though CORS is not
involved.

## Local development

Start only the databases and run both apps from the host, with hot reload:

```bash
docker compose -f docker-compose.dev.yml up -d
```

```bash
cd backend  && npm ci && npm run migration:run && npm run seed && npm run start:dev
cd frontend && npm ci && npm run dev
```

The backend reads `backend/.env` in this mode, not the root `.env` — `DATABASE_HOST` has to be
`localhost` there, whereas the container uses the service name `postgres_db`.

## Testing the API

- **Swagger UI** — http://localhost:3000/swagger, fire requests straight from the browser
- **Postman** — import [docs/postman/Announcements.postman_collection.json](docs/postman/Announcements.postman_collection.json).
  The requests run top to bottom as a flow and hand ids to each other through collection variables.
- **Automated tests** — `cd backend && npm test`. Needs `test_db` running; see
  [backend/README.md](backend/README.md#automated-tests).

## Assignment coverage

| Requirement | Where |
|---|---|
| Table sorted by *Last update* | `GET /v1/announcements` defaults to `sortBy=LAST_UPDATE&sortOrder=DESC` |
| Edit form on a subpage | `/announcements/:id`, prefilled from the detail endpoint |
| Create a new announcement | `/announcements/new`, the same form without an id |
| Category multiselect | `MultiAutocomplete`, options from `GET /v1/categories` |
| Date input validated as `MM/DD/YYYY HH:mm` | one shared algorithm, mirrored on both sides — see [backend/README.md](backend/README.md#post-v1announcements) |
| Alert on invalid input | inline message under each field; snackbars are reserved for requests |
| Filtering by categories | `?categoryIds=1,6` |
| Text search over title and body | `?search=storm`, case-insensitive, wildcards escaped |
| Documentation | this file plus the two sub-READMEs and the Postman collection |
| Websocket notification (bonus) | `announcementCreated` on the `announcements` namespace |

## Repository layout

```
.
├── backend/                 NestJS API
├── frontend/                Vite single-page app
├── docs/postman/            Postman collection
├── docker-compose.yml       full stack, builds both images
├── docker-compose.dev.yml   databases only, for local development
└── .env.example             ports and credentials for both compose files
```

Git history is kept as a sequence of small scoped commits so the order of work stays visible.
