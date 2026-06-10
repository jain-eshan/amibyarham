# AMI by Arham — `ami-app`

Fresh-from-scratch build per the PRD/TRD docs. The legacy build in `../ami-next/`
is left intact; point Vercel's Root Directory at `ami-app/` when this app is
ready to ship.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript (strict)
- Supabase (Postgres + Storage) via `@supabase/supabase-js`
- Tailwind, Framer Motion, react-hook-form, zod, @use-gesture/react —
  installed in Phase 2.

## Local setup

```bash
cp .env.local.example .env.local       # fill in Supabase URL + anon key
npm install
npm run dev
```

## Supabase

Schema and storage buckets live in `../supabase/migrations/`. Apply them via
the Supabase dashboard SQL editor or `supabase db push` (in that order):

1. `0001_initial_schema.sql` — tables, enums, indexes, RLS policies
2. `0002_storage_buckets.sql` — `inspiration-images` + `user-uploads` buckets

Types in `src/types/database.ts` mirror the generated `supabase gen types`
shape and can be swapped for a generated file later.
