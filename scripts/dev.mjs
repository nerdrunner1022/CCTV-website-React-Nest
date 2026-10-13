#!/usr/bin/env node
/**
 * One-command local development orchestrator.
 *
 * Starts the embedded local PostgreSQL, then runs the workspace dev servers
 * (shared → tsc -w, api → nest watch, web → vite) in parallel. On exit it
 * shuts the database down again (data persists on disk under .local/pgdata).
 *
 * Usage: node scripts/dev.mjs
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureRunning, DB_URL } from './local-db.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { server, startedByUs } = await ensureRunning();
console.log(`[dev] database ready → ${DB_URL}`);
console.log('[dev] starting web + api + shared…');

const child = spawn('pnpm', ['-r', '--parallel', 'run', 'dev'], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: process.env,
});

async function stopDb() {
  if (startedByUs) {
    try {
      await server.stop();
    } catch (err) {
      console.warn('[dev] db stop failed:', err.message);
    }
  }
}

let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n[dev] received ${signal}, shutting down…`);
  if (child.exitCode === null && !child.killed) {
    child.kill(signal);
  }
  await stopDb();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

child.on('exit', async (code) => {
  await stopDb();
  process.exit(code ?? 0);
});