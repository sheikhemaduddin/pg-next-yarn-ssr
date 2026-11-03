'use client';

import AppShell from './components/AppShell';
import FeatureCard from './components/FeatureCard';
import PostgresPanel from './components/PostgresPanel';

const features = [
  {
    icon: '🗄️',
    title: 'Postgres-backed records',
    description: 'Create and list rows in nova_pg_records using Cloudways-style PG* env vars.',
  },
  {
    icon: '🌱',
    title: 'Auto schema + seed',
    description: 'First request creates the table and seeds demo AI/product notes if empty.',
  },
  {
    icon: '📰',
    title: 'Live AI news',
    description: 'Separate feed pulls Hacker News headlines over HTTP — no auth required.',
  },
  {
    icon: '☁️',
    title: 'Cloudways ready',
    description: 'Set PGUSER, PGPASSWORD, PGHOST, PGPORT, and PGDATABASE in Velocity env vars.',
  },
];

export default function HomePage() {
  return (
    <AppShell>
      <section className="hero container">
        <p className="eyebrow">PostgreSQL · SSR · No auth</p>
        <h1>
          Your data.<br />
          <span>Straight from Postgres.</span>
        </h1>
        <p>
          Nova is rebuilt around a dedicated PostgreSQL section — browse seeded records, add your
          own, and pull AI news from the internet. JWT login is gone.
        </p>
        <div className="stats-row">
          <div className="stat">
            <div className="stat-value">PG</div>
            <div className="stat-label">Primary store</div>
          </div>
          <div className="stat">
            <div className="stat-value">12+</div>
            <div className="stat-label">Seed rows</div>
          </div>
          <div className="stat">
            <div className="stat-value">0</div>
            <div className="stat-label">Login walls</div>
          </div>
        </div>
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <h2>What this app is for</h2>
          <p>Everything below talks to Postgres or public HTTP APIs — no JWT session.</p>
        </div>
        <div className="grid">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <div className="container">
        <PostgresPanel />
      </div>
    </AppShell>
  );
}
