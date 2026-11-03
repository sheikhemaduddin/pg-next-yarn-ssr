'use client';

import Navbar from './Navbar';

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main>{children}</main>
      <footer className="footer">
        <div className="container footer-inner">
          <span>Nova · PostgreSQL + Next.js</span>
          <span>Data via PGHOST / PGUSER / PGDATABASE</span>
        </div>
      </footer>
    </div>
  );
}
