# Opportunities Browser

Read-only Vite + React UI for AI and Web3 opportunities stored in Supabase (`public.opportunities`).

The app lists live rows from the database. It does not ship sample data.

## Stack

- Vite 8 + React 19 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- `@supabase/supabase-js` (anon / publishable key only)

## Setup

```bash
cp .env.example .env
```

Fill in:

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | Project URL from Supabase **Project Settings → API** |
| `VITE_SUPABASE_ANON_KEY` | The **anon** or **publishable** key from the same page |

Never put the `service_role` key in this app, Vercel env, or git. The UI only runs `SELECT` against `public.opportunities`.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## What it does

- Loads `public.opportunities` sorted by **deadline ascending (nulls last)**, then **last_seen_at descending**
- Filters: category, status, opportunity type, deadline from/to, title/org search
- Card grid plus a detail drawer
- **Apply** opens the opportunity `url` in a new tab

## Deploy on Vercel

1. Import this repo.
2. Framework preset: Vite (output `dist`).
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as project environment variables.
4. `vercel.json` rewrites all routes to `index.html` for SPA fallback.

Anon `SELECT` is allowed by the `Anyone can read opportunities` RLS policy. Writes stay locked down.
