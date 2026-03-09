# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Psiflow** is a full-stack web application for managing a psychology clinic. It handles patient records, appointment scheduling, billing/invoicing, therapist/staff management, and a patient-facing portal.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Auth | Clerk (handles staff and patient roles) |
| UI | shadcn/ui + Tailwind CSS |
| Deployment | Vercel |
| Package manager | pnpm |

## Commands

```bash
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Production build
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit

# Database
pnpm db:migrate   # Run Prisma migrations (dev)
pnpm db:push      # Push schema changes without migration (prototyping)
pnpm db:studio    # Open Prisma Studio
pnpm db:seed      # Seed database

# Testing
pnpm test                # Run all Vitest unit tests
pnpm test [file]         # Run a single test file
pnpm test:e2e            # Run Playwright visual regression tests
pnpm test:e2e:update     # Regenerate visual baseline screenshots
```

## Architecture

### Directory Structure

```
src/
  app/                  # Next.js App Router
    (auth)/             # Clerk auth pages (sign-in, sign-up)
    (clinic)/           # Staff-facing routes (protected)
      dashboard/
      patients/
      appointments/
      billing/
      staff/
    (portal)/           # Patient-facing portal (protected, different role)
    api/                # API route handlers
  components/
    ui/                 # shadcn/ui primitives (auto-generated, do not edit manually)
    [feature]/          # Feature-specific components
  lib/
    db.ts               # Prisma client singleton
    auth.ts             # Clerk auth helpers and role checks
  types/                # Shared TypeScript types
prisma/
  schema.prisma         # Database schema
  migrations/           # Migration history
  seed.ts               # Database seed script
```

### Auth & Roles

Clerk manages authentication. Two distinct user types exist:
- **Staff** (psychologists, admin, billing) — access the clinic dashboard at `/(clinic)`
- **Patients** — access only their own portal at `/(portal)`

Roles are stored as Clerk `publicMetadata.role`. Always check roles server-side using `auth()` from `@clerk/nextjs/server`. Never trust client-side role claims for access control.

### Data Access Pattern

- **Server Components** fetch data directly via Prisma — no API round-trip needed
- **Client Components** that need data use Server Actions or fetch from `/api` routes
- All database access goes through `src/lib/db.ts` (Prisma singleton)
- Never instantiate `PrismaClient` directly in components

### Key Domain Models (Prisma)

Core entities: `Patient`, `Clinician`, `Appointment`, `Invoice`, `Payment`, `Session` (therapy session notes). Relationships: a `Patient` has many `Appointments`; each `Appointment` links to a `Clinician`; `Invoice` is tied to one or more `Appointments`.

### API Routes

Use Next.js Route Handlers (`app/api/.../route.ts`) only when a browser client needs to call an endpoint directly (e.g., webhooks, file uploads, Clerk webhooks). Prefer Server Actions for form submissions and mutations from Client Components.

## Git Flow

### Branch Structure

| Branch | Purpose |
|---|---|
| `main` | Production-ready code. Never commit directly. |
| `develop` | Integration branch. All features merge here first. |
| `feature/*` | New features — branch from `develop` |
| `fix/*` | Bug fixes — branch from `develop` |
| `hotfix/*` | Urgent production fixes — branch from `main`, PR into both `main` and `develop` |

### Workflow for New Changes

1. **Branch off `develop`**
   ```bash
   git checkout develop && git pull origin develop
   git checkout -b feature/my-feature
   ```

2. **Work and commit** on your feature branch

3. **Open a PR → `develop`** — CI (lint, typecheck, tests) must pass before merging

4. **Open a PR → `main`** from `develop` when ready to release — CI must pass

### Rules

- Direct pushes to `main` and `develop` are blocked
- All PRs require CI to pass before merge
- Hotfixes branch from `main`, then get back-merged into `develop`

### CI Pipeline

GitHub Actions runs on every PR to `main` or `develop`:
- `pnpm lint` — ESLint
- `pnpm typecheck` — TypeScript type checking
- `pnpm test` — Vitest unit tests
- `pnpm test:e2e` — Playwright visual regression + auth acceptance tests

### Before Opening a PR — Required Local Checks

The pre-push hook enforces this automatically, but always verify manually before submitting:

```bash
pnpm lint --quiet && pnpm typecheck && pnpm test  # fast checks
pnpm test:e2e                                      # e2e — requires dev server running
```

**Never open a PR without running the acceptance tests locally first.** The pre-push hook does this automatically:
- `e2e/auth.spec.ts` — auth redirect acceptance tests (runs locally, platform-independent)
- `e2e/visual.spec.ts` — visual regression tests (**CI-only** — baselines are Linux-generated; running them locally on macOS will produce false failures)

If you add new visual snapshot tests, do **not** commit macOS baselines. CI will auto-create the correct Linux baselines on the first run via `--update-snapshots=missing`.

## Development Notes

- shadcn/ui components are added via `pnpm dlx shadcn@latest add <component>` — do not write them from scratch
- **Prisma 7** splits config: the database URL lives in `prisma.config.ts` (for migrations) and a `PrismaPg` adapter is passed in `src/lib/db.ts` (for the client). Do NOT add `url` to `schema.prisma`. Generated client is at `src/generated/prisma`.
- Prisma schema changes always require a migration (`pnpm db:migrate`) in dev; never use `db:push` in production
- Environment variables: `.env` for local dev; configure the same vars in Vercel for production. Required vars: `DATABASE_URL`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Clerk webhook secret (`CLERK_WEBHOOK_SECRET`) is needed to sync Clerk users to the local `Patient`/`Clinician` tables
