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
pnpm test         # Run all tests
pnpm test [file]  # Run a single test file
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

## Development Notes

- shadcn/ui components are added via `pnpm dlx shadcn@latest add <component>` — do not write them from scratch
- **Prisma 7** splits config: the database URL lives in `prisma.config.ts` (for migrations) and a `PrismaPg` adapter is passed in `src/lib/db.ts` (for the client). Do NOT add `url` to `schema.prisma`. Generated client is at `src/generated/prisma`.
- Prisma schema changes always require a migration (`pnpm db:migrate`) in dev; never use `db:push` in production
- Environment variables: `.env` for local dev; configure the same vars in Vercel for production. Required vars: `DATABASE_URL`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Clerk webhook secret (`CLERK_WEBHOOK_SECRET`) is needed to sync Clerk users to the local `Patient`/`Clinician` tables
