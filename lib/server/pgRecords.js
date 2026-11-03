import { query } from './db';

const SEED_RECORDS = [
  {
    title: 'Transformer architectures in production',
    category: 'AI Research',
    summary: 'How attention models moved from papers into large-scale product systems.',
  },
  {
    title: 'Vector databases for RAG',
    category: 'Infrastructure',
    summary: 'Indexing embeddings so apps can retrieve relevant context at query time.',
  },
  {
    title: 'Eval harnesses for LLM apps',
    category: 'Quality',
    summary: 'Offline and online evaluation patterns that catch regressions before users do.',
  },
  {
    title: 'Prompt caching strategies',
    category: 'Performance',
    summary: 'Reduce latency and cost by reusing stable system and tool prompts.',
  },
  {
    title: 'Safety filters for generative UIs',
    category: 'Safety',
    summary: 'Layered moderation, allow-lists, and human review for risky outputs.',
  },
  {
    title: 'Fine-tuning vs retrieval',
    category: 'AI Research',
    summary: 'When to bake knowledge into weights versus fetching it from a store.',
  },
  {
    title: 'Streaming token UX',
    category: 'Product',
    summary: 'Progressive rendering patterns that make long generations feel responsive.',
  },
  {
    title: 'Multi-tenant AI quotas',
    category: 'Infrastructure',
    summary: 'Rate limits and budget envelopes per workspace in shared GPU fleets.',
  },
  {
    title: 'Synthetic data pipelines',
    category: 'Data',
    summary: 'Generating labeled examples to bootstrap classifiers and evaluators.',
  },
  {
    title: 'Agent tool calling contracts',
    category: 'Product',
    summary: 'Strict JSON schemas so agents can safely call internal APIs.',
  },
  {
    title: 'Observability for LLM traces',
    category: 'Quality',
    summary: 'Tracing prompts, tools, and latency across a single user request.',
  },
  {
    title: 'Edge inference tradeoffs',
    category: 'Performance',
    summary: 'Running smaller models on-device versus round-tripping to the cloud.',
  },
];

export async function ensureSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS nova_pg_records (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      summary TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'seed',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS nova_pg_records_created_at_idx
    ON nova_pg_records (created_at DESC)
  `);
}

export async function listRecords({ limit = 50 } = {}) {
  await ensureSchema();
  const result = await query(
    `
      SELECT id, title, category, summary, source, created_at
      FROM nova_pg_records
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit]
  );
  return result.rows.map(mapRow);
}

export async function createRecord({ title, category, summary, source = 'user' }) {
  await ensureSchema();
  const result = await query(
    `
      INSERT INTO nova_pg_records (title, category, summary, source)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, category, summary, source, created_at
    `,
    [title, category, summary || '', source]
  );
  return mapRow(result.rows[0]);
}

export async function seedRecords() {
  await ensureSchema();
  const countResult = await query('SELECT COUNT(*)::int AS count FROM nova_pg_records');
  const existing = countResult.rows[0].count;

  if (existing > 0) {
    return { inserted: 0, total: existing, seeded: false };
  }

  for (const item of SEED_RECORDS) {
    await createRecord({ ...item, source: 'seed' });
  }

  return { inserted: SEED_RECORDS.length, total: SEED_RECORDS.length, seeded: true };
}

export async function getStatus() {
  await ensureSchema();
  const result = await query('SELECT COUNT(*)::int AS count FROM nova_pg_records');
  return {
    connected: true,
    table: 'nova_pg_records',
    count: result.rows[0].count,
    host: process.env.PGHOST || 'DATABASE_URL',
    database: process.env.PGDATABASE || null,
  };
}

function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    summary: row.summary,
    source: row.source,
    createdAt: row.created_at,
  };
}
