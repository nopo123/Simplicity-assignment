# Announcements — Fullstack assignment

Simple fullstack application for managing city announcements.

- **Backend** — NestJS + TypeORM + PostgreSQL, REST API with search, category filtering and a websocket notification
- **Frontend** — React + Vite + MUI, announcements table and an edit/create form

Detailed API documentation lives in [backend/README.md](backend/README.md).

## Quick start

```bash
cp .env.example .env
docker compose up -d
```

Frontend runs on http://localhost:3001, backend on http://localhost:3000, Swagger on http://localhost:3000/swagger.

Migrations and seed data run automatically on backend startup.

If port 5432 or 5433 is already taken on your machine, change `DATABASE_PORT` /
`DATABASE_PORT_TEST` in `.env` — both compose files read those variables.

## Local development

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts only the two databases. Then run the backend and the frontend yourself:

```bash
cd backend  && npm ci && npm run migration:run && npm run seed && npm run start:dev
cd frontend && npm ci && npm run dev
```

See [backend/README.md](backend/README.md) for the endpoint reference, the websocket contract and
how to run the tests.
