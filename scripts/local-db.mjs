#!/usr/bin/env node
/**
 * Local development PostgreSQL — embedded, no Docker, no root.
 *
 * Usage:
 *   node scripts/local-db.mjs up        # start (foreground); data persists on disk
 *   node scripts/local-db.mjs down      # stop the server
 *   node scripts/local-db.mjs reset     # stop, wipe data, re-init, start fresh
 *   node scripts/local-db.mjs status    # is a server running?
 *
 * Backed by the `embedded-postgres` npm package (bundles PostgreSQL 18
 * binaries via @embedded-postgres/<platform>). On `up`, the script stays in
 * the foreground and shuts the server down when it exits (Ctrl-C / SIGTERM).
 *
 * Overridable via env: LOCAL_DB_DIR, LOCAL_DB_PORT, LOCAL_DB_USER,
 * LOCAL_DB_PASSWORD, LOCAL_DB_NAME.
 */
import EmbeddedPostgres from 'embedded-postgres';
import net from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
export const CONFIG = {
  dataDir: process.env.LOCAL_DB_DIR ?? path.join(repoRoot, '.local', 'pgdata'),
  port: Number(process.env.LOCAL_DB_PORT ?? 5432),
  user: process.env.LOCAL_DB_USER ?? 'postgres',
  password: process.env.LOCAL_DB_PASSWORD ?? 'postgres',
  database: process.env.LOCAL_DB_NAME ?? 'cctv',
};

export const DB_URL = CONFIG.password
  ? `postgresql://${CONFIG.user}:${CONFIG.password}@localhost:${CONFIG.port}/${CONFIG.database}`
  : `postgresql://${CONFIG.user}@localhost:${CONFIG.port}/${CONFIG.database}`;

const dataDirInitialised = () =>
  fs.existsSync(path.join(CONFIG.dataDir, 'PG_VERSION'));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' });
    socket.setTimeout(1000);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function waitForPort(port, { open, timeoutMs = 15000 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if ((await isPortOpen(port)) === open) return true;
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

function makeServer() {
  return new EmbeddedPostgres({
    databaseDir: CONFIG.dataDir,
    port: CONFIG.port,
    user: CONFIG.user,
    password: CONFIG.password,
    authMethod: 'scram-sha-256',
    persistent: true,
  });
}

/** Ensure a server is up on the configured port and the app database exists. */
export async function ensureRunning() {
  const alreadyRunning = await isPortOpen(CONFIG.port);
  const server = makeServer();

  if (!dataDirInitialised()) {
    fs.mkdirSync(path.dirname(CONFIG.dataDir), { recursive: true });
    console.log(`[db] initdb → ${CONFIG.dataDir}`);
    await server.initialise();
  }

  if (!alreadyRunning) {
    console.log(`[db] starting PostgreSQL on 127.0.0.1:${CONFIG.port}`);
    await server.start();
    await waitForPort(CONFIG.port, { open: true });
  } else {
    console.log(`[db] Postgres already listening on :${CONFIG.port}`);
  }

  await ensureDatabase(server);
  return { server, startedByUs: !alreadyRunning };
}

async function ensureDatabase(server) {
  const client = server.getPgClient(); // connects to the default `postgres` db
  await client.connect();
  try {
    const exists = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [CONFIG.database],
    );
    if (exists.rowCount === 0) {
      await client.query(`CREATE DATABASE "${CONFIG.database}"`);
      console.log(`[db] created database "${CONFIG.database}"`);
    }
  } finally {
    await client.end();
  }
}

/** Stop a server that was started by a *different* process (by postmaster.pid). */
async function down() {
  const pidFile = path.join(CONFIG.dataDir, 'postmaster.pid');
  if (!fs.existsSync(pidFile)) {
    console.log('[db] not running (no postmaster.pid)');
    return;
  }
  const [pid] = fs.readFileSync(pidFile, 'utf8').split('\n');
  try {
    process.kill(Number(pid), 'SIGTERM');
    console.log(`[db] sent SIGTERM to postmaster (pid ${pid})`);
  } catch {
    console.log('[db] no live postmaster process; nothing to stop');
  }
  const stopped = await waitForPort(CONFIG.port, { open: false, timeoutMs: 20000 });
  if (!stopped) console.warn('[db] port still open after SIGTERM');
  else console.log(`[db] stopped (:${CONFIG.port} closed)`);
}

async function status() {
  const open = await isPortOpen(CONFIG.port);
  const initialised = dataDirInitialised();
  console.log(`port ${CONFIG.port}: ${open ? 'OPEN' : 'closed'}`);
  console.log(`data dir ${CONFIG.dataDir}: ${initialised ? 'initialised' : 'empty'}`);
  console.log(`connection: ${DB_URL}`);
}

async function up() {
  const { server, startedByUs } = await ensureRunning();
  console.log(`[db] ready → ${DB_URL}`);
  console.log('[db] press Ctrl-C to stop');

  // Stay alive (and keep the embedded server up) until interrupted.
  await new Promise((resolve) => {
    let done = false;
    const cleanup = async () => {
      if (done) return;
      done = true;
      if (startedByUs) {
        try {
          await server.stop();
          console.log('[db] stopped cleanly');
        } catch (err) {
          console.warn('[db] stop failed:', err.message);
        }
      }
      resolve();
    };
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  });
}

// ---------------------------------------------------------------------------
// CLI (only when run directly: `node scripts/local-db.mjs <command>`)
// ---------------------------------------------------------------------------
const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const [command] = process.argv.slice(2);

  switch (command) {
    case 'up':
      await up();
      break;
    case 'down':
      await down();
      break;
    case 'reset':
      await down();
      fs.rmSync(CONFIG.dataDir, { recursive: true, force: true });
      console.log('[db] wiped data directory');
      await up();
      break;
    case 'status':
      await status();
      break;
    default:
      console.error('usage: node scripts/local-db.mjs <up|down|reset|status>');
      process.exit(1);
  }
}