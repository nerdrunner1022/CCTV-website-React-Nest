# cctv-platform

CCTV shop website and operations platform. The site's job is to turn a worried
visitor into a booked site survey — a trust/lead engine first, an online store second.

## Stack

- **web** — React 19 + TypeScript + Vite + Tailwind CSS v4 (marketing site, customer portal, admin)
- **api** — NestJS + Prisma ORM
- **db** — PostgreSQL on Neon
- **shared** — Zod schemas, DTO types, enums shared by web and api
- **config** — shared eslint / typescript / tailwind presets

## Layout

```
apps/web          React app
apps/api          NestJS API (+ Prisma schema)
packages/shared   shared types & validation
packages/config   shared tooling presets
bruno             API test collections
```

## Getting started

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# generate the prisma client
pnpm --filter @cctv/api prisma:generate

pnpm dev          # run web + api together
```

- Web: http://localhost:5173
- API: http://localhost:3000/api

## Common scripts

| Command | Description |
|---|---|
| `pnpm dev` | run all apps in watch mode |
| `pnpm build` | build all packages/apps |
| `pnpm lint` | lint everything |
| `pnpm typecheck` | type-check everything |
| `pnpm test` | run unit tests |

## Plan

The full build plan lives in [`.opencode/plan`](./.opencode/plan).
