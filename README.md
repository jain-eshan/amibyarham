# AMI by Arham

**Made-to-order, handcrafted lab-grown diamond jewellery.**
A family business — Arham Diamonds, 40 years in Old Delhi — brought online for the first time.

Live site: [www.arhamdiamonds.in](https://www.arhamdiamonds.in)

---

## Repo structure

```
amibyarham/
├── apps/
│   └── web/              Next.js 16 + Tailwind v4 — the main website
├── packages/
│   └── scripts/          Operational scripts (embedding backfill, ingestion pipeline)
├── services/
│   └── clip-worker/      Python CLIP embedding microservice (Docker)
├── supabase/
│   ├── config.toml       Supabase CLI project config
│   └── migrations/       Database migrations
├── docs/                 Product docs, design system, architecture
├── vercel.json           Vercel monorepo build config
└── package.json          npm workspaces root
```

## Quick start

```bash
# Install all workspaces from the repo root
npm install

# Start the website
npm run dev

# Run scripts
npm run backfill --workspace=packages/scripts
npm run ingest --workspace=packages/scripts -- danish --dry-run

# Start CLIP worker
cd services/clip-worker && docker compose up
```

## Environment variables

Copy `.env.example` to `.env.local` at the repo root and fill in your values:

| Variable | Required by | Purpose |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | web | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | web | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | web, scripts | Bypasses RLS for server-side ops |
| `GMAIL_USER` | web | Gmail address for contact notifications |
| `GMAIL_APP_PASSWORD` | web | Gmail app password for SMTP |
| `CLIP_WORKER_URL` | scripts | CLIP microservice URL |
| `PINTEREST_APP_ID` | scripts | Pinterest API credentials |
| `PINTEREST_APP_SECRET` | scripts | Pinterest API credentials |
| `PINTEREST_REFRESH_TOKEN` | scripts | Pinterest API credentials |

## Tech stack

| Layer | Tool |
|-------|------|
| Frontend | Next.js 16, React 19, Tailwind v4, Framer Motion |
| Database | Supabase (Postgres) |
| File storage | Supabase Storage |
| Email | Nodemailer (Gmail SMTP) |
| Hosting | Vercel |
| Embeddings | CLIP (Python microservice) |

## Deploying

The site deploys from the `main` branch via Vercel. The monorepo is configured
via `vercel.json` — Vercel builds `apps/web` automatically.

Make sure all `NEXT_PUBLIC_*` env vars are set in your Vercel project settings.
