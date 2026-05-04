# Deploy Ready Checklist

Production URL: `https://becs.agency.com`

## Local Build

- Passed: `npm run build`
- Output directory: `dist`
- Static frontend only; no backend or database code is included.

## Route Test

- Passed: `npm run check:routes`
- Verified routes:
  - `#/`
  - `#/intake`
  - `#/sales`
  - `#/onboarding`
  - `#/projects`
  - `#/tasks`
  - `#/admin`
  - `#/communications`
  - `#/approvals`
  - `#/triggers`
  - `#/automation`
  - `#/calendar`

## Required Environment Variables

Set these in local `.env.local` and in the deployment provider:

```text
VITE_BECS_API_URL=https://<your-render-backend>.onrender.com
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Notes:

- `VITE_BECS_API_URL` switches the app from demo mode to live API mode and must point to the Render backend base URL.
- `VITE_SUPABASE_ANON_KEY` must only be a public anon key.
- Do not place service-role keys, database passwords, or private API secrets in Vite frontend env vars.

## Deployment Target Recommendation

Recommended first target: Vercel or Netlify static hosting.

Use:

```text
Install command: npm install
Build command: npm run build
Publish directory: dist
Node version: 20 or newer
```

Render Static Site is also acceptable if BECS infrastructure is already organized around Render.

## Remaining Backend/API Tasks

- Confirm the deployed BECS OS API responds at `/api/command-center`.
- Confirm intake submissions are accepted at `/api/events`.
- Confirm CORS allows the production frontend domain: `https://becs.agency.com`.
- Confirm CORS allows the Vercel deployment URL.
- Confirm CORS allows local development: `http://localhost:5173`.
- Confirm the public Supabase anon key, if required, is scoped appropriately through Supabase policies.
- Confirm live dashboard response fields match the frontend types in `src/lib/types.ts`.
- Confirm production monitoring/log review for Supabase Edge Function failures.
