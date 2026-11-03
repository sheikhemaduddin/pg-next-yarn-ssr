// Next.js custom server entry (Cloudways Entry File = server.js).
try {
  require('dotenv').config({ path: '.env.local' });
  require('dotenv').config();
} catch {
  // dotenv optional when the platform injects env vars
}

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = Number(process.env.PORT) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res, parse(req.url, true));
  }).listen(port, hostname, () => {
    console.log(`[nova] ready on http://${hostname}:${port} (dev=${dev})`);
  });
});
