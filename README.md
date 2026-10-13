# cctv-platform

CCTV shop website and operations platform. The site's job is to turn a worried
visitor into a booked site survey — a trust/lead engine first, an online store second.

## Stack

- **web** — React 19 + TypeScript + Vite + Tailwind CSS v4 (marketing site, customer portal, admin)
- **api** — NestJS + Prisma ORM
- **db** — PostgreSQL 18 via `embedded-postgres` (runs locally, no Docker/root needed); swap to Neon for deployed environments
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

# generate the prisma client
pnpm --filter @cctv/api prisma:generate

pnpm dev          # starts local Postgres + shared + api + web, together
```

`pnpm dev` starts an embedded PostgreSQL 18 on `localhost:5432` (data in
`.local/pgdata`, git-ignored), then runs the api and web in watch mode. Press
Ctrl-C to stop everything; the database shuts down too (data still persists).

> First run only: create the schema and seed it —
> see "Database" below.

- Web: http://localhost:5173 (proxies `/api` → the API)
- API: http://localhost:3000/api

## Database

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
`DIRECT_URL` inside `apps/api/.env`.

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
