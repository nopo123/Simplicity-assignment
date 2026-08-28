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
