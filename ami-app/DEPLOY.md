# Deploying ami-app to Vercel

The Next.js app lives in `ami-app/` (not the repo root), so Vercel needs to be told to use it as the project root.

## One-time setup (Vercel Dashboard)

1. Go to https://vercel.com/new and import this GitHub repo.
2. **Root Directory**: set to `ami-app`.
3. **Framework Preset**: Next.js (auto-detected).
4. **Build Command**: `next build` (default).
5. **Install Command**: `npm install` (default).
6. **Output Directory**: leave blank (Next.js default).

## Environment variables

Add these in **Project Settings → Environment Variables** for `Production`, `Preview`, and `Development`:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bkigritfxabsvpgzgajs.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (the anon JWT from Supabase → Settings → API) |

> The `anon` key is safe to expose to the browser — Supabase Row Level Security policies are what protect your data. Never put the `service_role` key in Vercel envs that the client can read.

## Local development

A `.env.local` file in `ami-app/` (gitignored) holds the same values for local dev. Run:

```bash
cd ami-app
npm install
npm run dev
```

## CLI alternative

If you prefer linking from the terminal instead of the dashboard:

```bash
cd ami-app
npx vercel link        # link this directory to a Vercel project
npx vercel env pull    # pulls env vars into .env.local
npx vercel             # deploy preview
npx vercel --prod      # deploy production
```
