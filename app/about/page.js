'use client';

import AppShell from '../components/AppShell';

export default function AboutPage() {
  return (
    <AppShell>
      <div className="container">
        <header className="page-header">
          <h1>About Nova</h1>
          <p>
            A lean Next.js SSR demo focused on PostgreSQL. Auth and Socket.IO were removed so the
            app centers on durable data and a simple news feed.
          </p>
        </header>

        <div className="prose">
          <h2>Data model</h2>
          <p>
            Table <code>nova_pg_records</code> stores title, category, summary, source, and
            timestamps. The API auto-migrates and seeds demo rows when the table is empty.
          </p>
          <h2>Environment</h2>
          <p>
            Connection uses <code>PGUSER</code>, <code>PGPASSWORD</code>, <code>PGHOST</code>,{' '}
            <code>PGPORT</code>, and <code>PGDATABASE</code> — the same keys Cloudways Velocity
            exposes for the Postgres addon.
          </p>
          <h2>Entry point</h2>
          <p>
            Cloudways Entry File remains <code>server.js</code>. Set the five <code>PG*</code> vars
            and deploy.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
