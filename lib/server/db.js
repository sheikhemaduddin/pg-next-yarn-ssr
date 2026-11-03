import { Pool } from 'pg';

let pool = null;

export function isDbConfigured() {
  return Boolean(
    process.env.DATABASE_URL ||
      (process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE)
  );
}

export function getPool() {
  if (!isDbConfigured()) {
    throw new Error(
      'PostgreSQL is not configured. Set PGHOST, PGPORT, PGUSER, PGPASSWORD, and PGDATABASE (or DATABASE_URL).'
    );
  }

  if (!pool) {
    pool = process.env.DATABASE_URL
      ? new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
        })
      : new Pool({
          host: process.env.PGHOST || 'localhost',
          port: Number(process.env.PGPORT || 5432),
          user: process.env.PGUSER,
          password: process.env.PGPASSWORD,
          database: process.env.PGDATABASE,
          ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
        });
  }

  return pool;
}

export async function query(text, params) {
  return getPool().query(text, params);
}
