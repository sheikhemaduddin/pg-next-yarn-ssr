# next-custom · yarn · PostgreSQL data app

| Field | Value |
|-------|-------|
| Framework Preset | Next.js |
| Package Manager | yarn |
| Build Command | `yarn install && yarn build` |
| Output Directory | `.next` |
| Entry File | `server.js` |
| Start Command | `yarn start` |
| Node | >=18.18.0 |

## Environment variables

Set in Velocity → **Environment Variables**:

| Key | Purpose |
|-----|---------|
| `PGUSER` | Postgres user |
| `PGPASSWORD` | Postgres password |
| `PGHOST` | Usually `localhost` on Cloudways |
| `PGPORT` | Usually `5432` |
| `PGDATABASE` | Database name |

Optional: `HOSTNAME`, `PGSSL=true`, `DATABASE_URL`

No JWT / Socket.IO env vars required.

## App surfaces

- `/` — PostgreSQL records panel
- `/news` — AI news from Hacker News
- `/about` — architecture notes

APIs: `/api/pg/status`, `/api/pg/records`, `/api/pg/seed`, `/api/news`
