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

export default function NewsFeed() {
  const [items, setItems] = useState([]);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/news', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load news.');
      }
      setItems(data.items || []);
      setFetchedAt(data.fetchedAt || null);
    } catch (err) {
      setError(err.message || 'Failed to load news.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="section" style={{ paddingTop: '2.5rem' }}>
      <div className="section-header realtime-header">
        <div>
          <h2>AI news</h2>
          <p>
            Live headlines fetched from the internet (Hacker News) via{' '}
            <code className="token-code">/api/news</code> — separate from Postgres records.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={load}
          disabled={loading}
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {fetchedAt ? (
        <p className="news-meta">Last fetched {formatTime(fetchedAt)}</p>
      ) : null}

      {error ? (
        <div className="auth-error" role="alert" style={{ marginBottom: '1.25rem' }}>
          {error}
        </div>
      ) : null}

      {loading && items.length === 0 ? (
        <p className="muted-row">Loading AI stories…</p>
      ) : (
        <div className="news-grid">
          {items.map((item) => (
            <article key={item.id} className="card news-card">
              <p className="eyebrow" style={{ marginBottom: '0.75rem', fontSize: '0.65rem' }}>
                {item.source} · {item.points} pts · {item.comments} comments
              </p>
              <h3>
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.title}
                </a>
              </h3>
              <p>
                by {item.author}
                {item.createdAt ? ` · ${formatTime(item.createdAt)}` : ''}
              </p>
            </article>
          ))}
          {!loading && items.length === 0 && !error ? (
            <p className="muted-row">No stories returned.</p>
          ) : null}
        </div>
      )}
    </section>
  );
}
