'use client';

import { useCallback, useEffect, useState } from 'react';

function formatTime(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function PostgresPanel() {
  const [status, setStatus] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Product');
  const [summary, setSummary] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statusRes, recordsRes] = await Promise.all([
        fetch('/api/pg/status', { cache: 'no-store' }),
        fetch('/api/pg/records', { cache: 'no-store' }),
      ]);

      const statusData = await statusRes.json();
      setStatus(statusData);

      if (!recordsRes.ok) {
        const recordsData = await recordsRes.json();
        throw new Error(recordsData.error || statusData.error || 'Failed to load PG data.');
      }

      const recordsData = await recordsRes.json();
      setItems(recordsData.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load PostgreSQL data.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/pg/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, summary }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save.');
      setTitle('');
      setSummary('');
      await load();
    } catch (err) {
      setError(err.message || 'Failed to save record.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSeed() {
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/pg/seed', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Seed failed.');
      await load();
    } catch (err) {
      setError(err.message || 'Seed failed.');
    } finally {
      setSaving(false);
    }
  }

  const connected = Boolean(status?.connected);

  return (
    <section className="section" style={{ paddingTop: '2.5rem' }}>
      <div className="section-header realtime-header">
        <div>
          <h2>PostgreSQL data</h2>
          <p>
            Dedicated section backed by Postgres (<code className="token-code">nova_pg_records</code>
            ). Uses Cloudways-style <code className="token-code">PG*</code> env vars.
          </p>
        </div>
        <div className={`socket-badge${connected ? ' is-online' : ' is-offline'}`}>
          <span className="socket-dot" aria-hidden="true" />
          {connected ? 'DB connected' : 'DB offline'}
        </div>
      </div>

      {status?.connected ? (
        <p className="news-meta">
          {status.count} rows in {status.table}
          {status.host ? ` · host ${status.host}` : ''}
          {status.database ? ` · db ${status.database}` : ''}
        </p>
      ) : null}

      {error ? (
        <div className="auth-error" role="alert" style={{ marginBottom: '1.25rem' }}>
          {error}
        </div>
      ) : null}

      <div className="pg-layout">
        <article className="card realtime-card">
          <h3>Add record</h3>
          <form className="auth-form" onSubmit={handleCreate}>
            <label className="field">
              <span>Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New Postgres-backed item"
                required
                disabled={!connected || saving}
              />
            </label>
            <label className="field">
              <span>Category</span>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="AI Research"
                disabled={!connected || saving}
              />
            </label>
            <label className="field">
              <span>Summary</span>
              <input
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Short description stored in PG"
                disabled={!connected || saving}
              />
            </label>
            <div className="hero-actions" style={{ justifyContent: 'flex-start' }}>
              <button type="submit" className="btn btn-primary" disabled={!connected || saving}>
                {saving ? 'Saving…' : 'Save to Postgres'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={load}
                disabled={loading || saving}
              >
                Refresh
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSeed}
                disabled={!connected || saving}
              >
                Seed demo rows
              </button>
            </div>
          </form>
        </article>

        <div className="news-grid">
          {loading && items.length === 0 ? (
            <p className="muted-row">Loading Postgres rows…</p>
          ) : null}
          {items.map((item) => (
            <article key={item.id} className="card news-card">
              <p className="eyebrow" style={{ marginBottom: '0.75rem', fontSize: '0.65rem' }}>
                {item.category} · {item.source} · #{item.id}
              </p>
              <h3>{item.title}</h3>
              <p>{item.summary || 'No summary'}</p>
              <p style={{ marginTop: '0.75rem' }}>{formatTime(item.createdAt)}</p>
            </article>
          ))}
          {!loading && items.length === 0 && !error ? (
            <p className="muted-row">No rows yet. Seed demo data or add a record.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
