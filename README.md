# cctv-platform

CCTV shop website and operations platform. The site's job is to turn a worried
visitor into a booked site survey — a trust/lead engine first, an online store second.

## Stack

- **web** — React 19 + TypeScript + Vite + Tailwind CSS v4 (marketing site, customer portal, admin)
- **api** — NestJS + Prisma ORM
- **db** — PostgreSQL 18 via `embedded-postgres` for local development; Neon PostgreSQL for deployment
- **shared** — Zod schemas, DTO types, enums shared by web and api
- **config** — shared eslint / typescript / tailwind presets

## Layout

```
apps/web          React app
apps/api          NestJS API (+ Prisma schema)
packages/shared   shared types & validation
packages/config   shared tooling presets
scripts/          local dev tooling (embedded DB, dev orchestrator)
bruno             API test collections
```

## Getting started (local-first)

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Start the local database and app servers.
pnpm dev

# First-time setup only: run these in a second terminal while `pnpm dev` is running.
pnpm --filter @cctv/api prisma:generate
pnpm --filter @cctv/api prisma:migrate
pnpm --filter @cctv/api prisma:seed

```

`pnpm dev` starts an embedded PostgreSQL 18 on `localhost:5432` (data in
`.local/pgdata`, git-ignored), then runs the api and web in watch mode. Press
Ctrl-C to stop everything; the database shuts down too (data still persists).

The sample AegisVision frontend uses the API for catalog inventory, survey
requests, and the staff lead pipeline. Staff access requires an `ADMIN` or
`SALES` account; the local seed creates the initial admin user.

- Web: http://localhost:5173 (proxies `/api` → the API)
- API: http://localhost:3000/api

## Database

The repository is linked to the `CCTV-website` Neon project in `aws-ap-southeast-1`
(Singapore). Its `production` branch uses the `neondb` database, with connection
pooling enabled. Connection settings are kept out of Git; `.neon` is
git-ignored. CI applies Prisma migrations on pushes to `main` after the Neon
GitHub secrets are configured. Until then, that migration step reports a notice
and skips; local development continues to use the embedded PostgreSQL database.

| Command | Description |
|---|---|
| `pnpm db:up` | start the local Postgres (foreground) |
| `pnpm db:down` | stop it |
| `pnpm db:reset` | stop, wipe `.local/pgdata`, start fresh |
| `pnpm db:status` | show port/data-dir/connection info |
| `pnpm --filter @cctv/api prisma:migrate` | run `prisma migrate dev` against the running DB |
| `pnpm --filter @cctv/api prisma:seed` | seed the DB |
| `pnpm --filter @cctv/api prisma:studio` | open Prisma Studio |

The local connection string is
`postgresql://postgres:postgres@localhost:5432/cctv`. To develop against Neon
instead, put the pooled URL in `DATABASE_URL` and the direct URL in
`DIRECT_URL` inside `apps/api/.env`. Avoid replacing these local development
values with production credentials. For CI, configure repository secrets
`DATABASE_URL` (Neon pooled connection string for the application) and
`DIRECT_URL` (Neon direct, non-pooled connection string for Prisma migrations).
Add deployment environment variables in Vercel only after the Vercel project
and its environments are confirmed.

## Common scripts

| Command | Description |
|---|---|
| `pnpm dev` | local Postgres + all apps in watch mode |
| `pnpm dev:apps` | apps only (assumes a DB is already up) |
| `pnpm build` | build all packages/apps |
| `pnpm lint` | lint everything |
| `pnpm typecheck` | type-check everything |
| `pnpm test` | run unit tests |

## Plan

The full build plan lives in [`.opencode/plan`](./.opencode/plan).
# CCTV-website-React-Nest
