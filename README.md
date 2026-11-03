# Nova — PostgreSQL data app

Next.js SSR app centered on Postgres. JWT auth and Socket.IO were removed.

## Scripts

```bash
npm run dev
npm run build
npm run start
```

## Environment

Copy `.env.example` → `.env.local`:

| Variable | Purpose |
|----------|---------|
| `PGUSER` / `PGPASSWORD` / `PGHOST` / `PGPORT` / `PGDATABASE` | Postgres |
| `PORT` | HTTP port (default `3000`) |

## Routes

- `/` — Postgres data (list / create / seed)
- `/news` — AI headlines via `/api/news`
- `/about` — How it works

## Postgres APIs

- `GET /api/pg/status`
- `GET|POST /api/pg/records`
- `POST /api/pg/seed`

Table: `nova_pg_records`
