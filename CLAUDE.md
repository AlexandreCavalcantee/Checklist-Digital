# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Production build
npm run lint      # ESLint (Next.js + TypeScript config)
npm start         # Production server
```

No test framework is configured yet.

## Architecture

**Stack**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + Supabase

The app is a dark-themed enterprise dashboard for operational audit and checklist management, written in Portuguese (Brazilian).

### Data layer

Currently uses an **in-memory store** (`src/server/store.ts`) via `globalThis.__checklistStore` — Supabase is initialized in `src/lib/supabase.ts` but not yet wired to the API routes. The plan is to migrate from in-memory to Supabase.

The store auto-seeds with a sample operational-audit checklist on first access and is hot-reload compatible.

### API routes (`src/app/api/`)

All routes use the in-memory store:

| Route | Methods | Purpose |
|---|---|---|
| `/api/checklists` | GET, POST | List checklists / create from template |
| `/api/checklists/[id]` | GET | Full checklist with sections and items |
| `/api/checklists/[id]/items/[itemId]/toggle` | POST | Toggle item done status |
| `/api/dashboard` | GET | Counts by status for stats cards |
| `/api/users` | GET, POST | List / create users |
| `/api/uploads` | GET, POST | List / upload files (10 MB max, base64) |
| `/api/uploads/[id]` | GET | Download file |

### Core types (`src/lib/types.ts`)

Key discriminated unions:
- `ChecklistStatus`: `in_progress | reopened | under_analysis | rejected | completed`
- `ActionPlanStatus`: `delayed | awaiting_solution | solution_under_analysis | awaiting_conclusion | completed`
- `UserRole`: `auditor_junior | auditor_pleno | auditor_senior | supervisor | gerente`
- `UserDepartment`: `financas | operacoes | qualidade | rh | ti | outros`

### Key components

- `src/components/dashboard/DashboardShell.tsx` — main layout: sidebar, stats cards, modals
- `src/app/checklists/new/page.tsx` — rich form (date picker, assignee, priority, file upload)
- `src/components/users/AddUserModal.tsx` — user creation modal

### Styling conventions

All components use `"use client"`. Utility function `cx()` in `src/lib/cn.ts` merges class names (similar to `clsx`). Theme: `#121212` background, `#ca8a04`/`#eab308` gold accents, opacity variants for secondary text (`white/40`, `white/50`). Custom gold scrollbar (6 px) defined in `src/app/globals.css`.

Path alias `@/*` maps to `./src/*`.

## Environment variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
