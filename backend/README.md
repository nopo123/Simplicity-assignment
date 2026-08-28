# Announcements — Backend

NestJS + TypeORM + PostgreSQL REST API for managing city announcements.

- URL versioning is enabled, so every route is prefixed with `/v1`
- Swagger UI on http://localhost:3000/swagger; when `APP_ENV=dev` the boot also writes
  `swagger-spec.yaml` next to the sources, for importing the API into other tooling. It is a
  generated artifact and stays gitignored — the Swagger UI, not the file, is the reference
- No authentication — every endpoint is public, which keeps the assignment focused on the announcements domain
- CORS is open for the same reason: there are no cookies and no credentials to protect, so the API needs no origin allow list and no port-specific configuration

## Running the project

### Option A — everything in Docker

From the repository root:

```bash
cp .env.example .env
docker compose up -d
```

Migrations and the seed run automatically in the backend container entrypoint, so the API comes up
with the nine categories and ten demo announcements already in place. The seed is idempotent — a
second `docker compose up -d` logs `Seed skipped` instead of duplicating rows.

### Option B — database in Docker, backend locally

From the repository root:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Then in `backend/`:

```bash
cp .env.example .env
npm ci
npm run migration:run
npm run seed
npm run start:dev
```

The API listens on http://localhost:3000.

## Environment variables

There are two files and they are not interchangeable:

| File | Read by | Purpose |
|---|---|---|
| root `.env` | `docker compose` | host port bindings and the credentials handed to both Postgres containers |
| `backend/.env` | the Nest process | used when the backend runs on the host (Option B) and by `npm test` |

In Option A the compose file passes the environment to the container directly, so `backend/.env` is
not consulted at all. That is why `DATABASE_HOST` differs between them: `postgres_db` (the compose
service name) inside the Docker network, `localhost` when the process runs on the host.

| Variable | Example | Meaning |
|---|---|---|
| `APP_ENV` | `dev` | `dev` also writes `swagger-spec.yaml` on boot, and enables SQL logging together with `DATABASE_ENABLE_LOGGING` |
| `PORT` | `3000` | Port the Nest process listens on. In the container this stays 3000; the host-side port is the root `.env` variable `BACKEND_PORT` |
| `DATABASE_HOST` | `localhost` | `postgres_db` inside the Docker network |
| `DATABASE_PORT` | `5432` | Port of the application database |
| `DATABASE_PORT_TEST` | `5433` | Port of `test_db`, used only by the e2e tests |
| `DATABASE_NAME` | `announcements` | |
| `DATABASE_NAME_TEST` | `announcements_test` | Created by the `test_db` container on first start |
| `DATABASE_USER` | `admin` | |
| `DATABASE_PASSWORD` | `admin` | |
| `DATABASE_ENABLE_LOGGING` | `true` | Logs every SQL statement. The compose file forces it off for the container, so `docker compose logs backend` stays readable |
| `DATABASE_MIGRATION_NAME` | `migration` | Name of the migrations bookkeeping table |

If a port is already taken on your machine, change it in the root `.env` — all four host ports are
variables there. See [the ports table](../README.md#ports), including the rebuild that a changed
`BACKEND_PORT` requires on the frontend.

## Data model

```
category                          announcement                    announcement_category
──────────                        ────────────                    ─────────────────────
id             serial PK          id              serial PK       announcementId  FK CASCADE
code           varchar(64) UQ     title           varchar(255)    categoryId      FK CASCADE
labels         jsonb {en,sk}      body            text            PK(announcementId, categoryId)
orderingNumber int                publicationDate timestamptz
created        timestamptz        created         timestamptz
updated        timestamptz        updated         timestamptz
```

The many-to-many relation is **unidirectional** — `AnnouncementEntity` owns it through `@JoinTable`,
and `CategoryEntity` carries no inverse property. Categories are fixed reference data created by a
migration, so there is no write endpoint for them.

`updated` is the *Last update* column of the announcements table and the default sort key of the
list endpoint. An update that changes only the categories still moves it forward: the service puts a
fresh `updated` on the entity it saves, which is what makes the scalar `UPDATE` fire at all — a
junction-table-only change would otherwise produce no `UPDATE` on the announcement row and leave the
timestamp behind.

## Endpoints

| Method | Route | Success | Description |
|---|---|---|---|
| `GET` | `/v1/announcements` | 200 | One page of announcements plus the total number of matches |
| `GET` | `/v1/announcements/:id` | 200 | One announcement with its categories |
| `POST` | `/v1/announcements` | 201 | Create, then broadcast over the websocket |
| `PATCH` | `/v1/announcements/:id` | 200 | Partial update; `categoryIds` replaces the whole set |
| `DELETE` | `/v1/announcements/:id` | 204 | Delete the announcement and its category links |
| `GET` | `/v1/categories` | 200 | All categories, ordered for selectors |
| `GET` | `/v1/health` | 200 | Liveness probe including a database round trip |

### `GET /v1/announcements`

| Query param | Type | Default | Meaning |
|---|---|---|---|
| `search` | string, max 255 | — | Case-insensitive match against `title` **or** `body`. `%` and `_` in the term are escaped, so they match literally |
| `categoryIds` | number list | — | Keeps announcements carrying at least one of these categories. Accepts `?categoryIds=1&categoryIds=8` or `?categoryIds=1,8` |
| `sortBy` | `LAST_UPDATE` · `PUBLICATION_DATE` · `TITLE` | `LAST_UPDATE` | |
| `sortOrder` | `ASC` · `DESC` | `DESC` | |
| `page` | int ≥ 1 | `1` | |
| `limit` | int 1–100 | `10` | |

A filtered announcement still returns its **full** category list, not only the categories that
matched the filter.

```bash
curl "http://localhost:3000/v1/announcements?search=water&categoryIds=1,6&page=1&limit=10"
```

```json
{
  "items": [
    {
      "id": 1,
      "title": "Water supply interruption in the city centre",
      "body": "Water will be shut off on Main Street between 8:00 and 14:00",
      "publicationDate": "08/11/2026 04:38",
      "categories": [
        { "id": 1, "code": "CITY", "labels": { "en": "City", "sk": "Mesto" }, "orderingNumber": 1 }
      ],
      "created": "2026-08-28T09:00:00.000Z",
      "updated": "2026-08-28T09:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### `POST /v1/announcements`

`publicationDate` is `MM/DD/YYYY HH:mm` on the wire, interpreted as UTC, and comes back in the same
format. That is deliberate: the frontend validates exactly the string it sends, so the two sides
cannot disagree about what a valid date is. `created` and `updated` stay ISO 8601 — they are server
timestamps, not a value a user typed.

```bash
curl -X POST http://localhost:3000/v1/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Storm warning for the weekend",
    "body": "A strong storm front is expected on Saturday evening",
    "publicationDate": "08/28/2026 08:55",
    "categoryIds": [1, 6]
  }'
```

Every field is required and at least one existing category id must be supplied. Unknown properties
are rejected.

The publication date is validated part by part rather than as a whole, so the response says which
part is wrong. The rules live in
[`src/common/utils/publication-date.util.ts`](src/common/utils/publication-date.util.ts) and the
frontend keeps a mirror of that file in `frontend/src/utils/date/publicationDateValidation.ts` — same
checks, same order, same outcome. `test/common/publication-date-test.validation.unit.spec.ts` pins
every case, including a test that the regex still accepts a value produced by the format constant so
the two cannot drift apart.

| Input | Reported as |
|---|---|
| `` (empty) | `publicationDate should not be empty` |
| `8/28/2026 08:55`, `2026-08-28T08:55:00Z`, `08-28-2026 08:55` | `publicationDate must use the format MM/DD/YYYY HH:mm` |
| `13/31/2001 21:11` | `publicationDate month must be between 01 and 12` |
| `01/32/2026 10:00` | `publicationDate day must be between 01 and 31` |
| `02/29/2001 10:00` | `publicationDate day does not exist in that month, it has 28 days` |
| `04/31/2026 10:00` | `publicationDate day does not exist in that month, it has 30 days` |
| `01/15/2026 24:00` | `publicationDate hours must be between 00 and 23` |
| `01/15/2026 10:60` | `publicationDate minutes must be between 00 and 59` |

When several parts are wrong the leftmost one is reported, so a value is fixed reading left to
right. Errors come back in a single shape:

```json
{
  "statusCode": 400,
  "message": "Unknown category ids: 999999",
  "timestamp": "2026-08-28T10:15:30.000Z"
}
```

## Websocket notification

After a successful `POST /v1/announcements` the service emits an internal event, and the gateway
broadcasts the created announcement to every client connected to the `announcements` namespace. The
service does not know about the gateway, so the HTTP path stays independent of the transport.

- Namespace: `ws://localhost:3000/announcements`
- Message: `announcementCreated`
- Payload: the same object `POST` returned

```js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/announcements', { transports: ['websocket'] });
socket.on('announcementCreated', (announcement) => console.log(announcement.title));
```

## Testing the API

**Swagger** — http://localhost:3000/swagger lists every endpoint with request and response schemas
and lets you fire requests directly.

**Postman** — import [`docs/postman/Announcements.postman_collection.json`](../docs/postman/Announcements.postman_collection.json).
The collection has a `baseUrl` variable (default `http://localhost:3000`) and stores the id of the
created announcement into `announcementId`, so the requests can be run top to bottom as a flow:
create → list → search → filter → get → patch → delete.

## Automated tests

Two Jest projects. The e2e project needs the `test_db` service running — either compose file starts
it. It runs the migrations itself and truncates the announcement tables between tests.

It cannot reach the application database: [`test/jest.setup.js`](test/jest.setup.js) rewrites
`DATABASE_PORT` and `DATABASE_NAME` to the `_TEST` values as a Jest `setupFiles` entry, which runs
before `AppModule` is imported and therefore before the TypeORM config reads the environment. So the
tests connect to `test_db` even though they boot the real `AppModule`, and `npm test` cannot wipe the
data you were working with.

```bash
npm run test:unit
npm run test:e2e
npm test
```

Coverage:

- `test/announcement/announcement.e2e-spec.ts` — create validation, sorting, search in title and
  body, literal wildcard handling, single and multi category filtering, combined search plus
  filter, pagination totals, detail, partial update, category replacement, the last-update bump on
  a categories-only change, and delete
- `test/announcement/announcement-websocket.e2e-spec.ts` — a subscribed client receives
  `announcementCreated`, and a rejected create broadcasts nothing
- `test/category/category.e2e-spec.ts` — the seeded set, its ordering, and the response shape
- `test/common/publication-date-test.validation.unit.spec.ts` — every publication date scenario:
  valid values, missing value, twelve malformed shapes, month, day, day-per-month including leap
  years, hours, minutes, and the order in which several simultaneous problems are reported
- `test/announcement/search-term-test.escape.unit.spec.ts` — wildcard escaping
- `test/announcement/mapper-test.announcement.unit.spec.ts` — entity to DTO mapping

## Migrations

```bash
npm run migration:run
npm run migration:revert
npm run migration:show
npm run migration:generate --name=my-migration
```

`synchronize` is off, so the schema only ever changes through a migration. In the production image
the compiled variants run instead, which is what the Docker entrypoint calls:

```bash
npm run migration:run:prod
npm run seed:prod
```
