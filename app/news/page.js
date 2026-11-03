'use client';

import AppShell from '../components/AppShell';
import NewsFeed from '../components/NewsFeed';

export default function NewsPage() {
  return (
    <AppShell>
      <div className="container" style={{ paddingBottom: '3rem' }}>
        <NewsFeed />
      </div>
    </AppShell>
  );
}
