# AMI by Arham — Web App

Next.js 16 website for [arhamdiamonds.in](https://www.arhamdiamonds.in).

## Stack

- Next.js 16 (App Router), React 19, TypeScript (strict)
- Supabase (Postgres + Storage) via `@supabase/supabase-js`
- Tailwind v4, Framer Motion, react-hook-form, zod

## Local development

```bash
# From the repo root:
cp .env.example .env.local   # fill in your values
npm install
npm run dev
```

## Supabase

Migrations live in `../../supabase/migrations/`. Apply them via the Supabase
dashboard SQL editor or `supabase db push`.

Types in `src/types/database.ts` mirror the `supabase gen types` shape.
