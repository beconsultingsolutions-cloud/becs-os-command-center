# Deployment Guide

BECS OS Command Center is a static React/Vite frontend. It can be deployed to Netlify, Vercel, Render Static Sites, or any static host that serves the generated `dist/` directory.

## Required Build Settings

Use these settings for all static hosts:

```text
Install command: npm install
Build command: npm run build
Publish/output directory: dist
Node version: 20 or newer
```

The app uses hash routing, so no special rewrite rules are required for client routes.

## Environment Variables

Set these in the deployment provider before building:

```text
VITE_BECS_API_URL=https://eorkllalnzottuhejdrl.supabase.co/functions/v1/becs-os-api-v3
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Only use a public Supabase anon key in `VITE_SUPABASE_ANON_KEY`. Never put a service-role key, database password, OpenAI key, or other private secret in a Vite frontend variable.

## Netlify

1. Create a new site from the repository.
2. Set build command to `npm run build`.
3. Set publish directory to `dist`.
4. Add the `VITE_*` environment variables in Site configuration.
5. Deploy.

Optional `netlify.toml` is not required because the app uses hash routes.

## Vercel

1. Import the repository.
2. Vercel should detect Vite automatically.
3. Confirm build command is `npm run build`.
4. Confirm output directory is `dist`.
5. Add the `VITE_*` environment variables in Project Settings.
6. Deploy.

No serverless functions are required for this frontend-only deployment.

## Render Static Site

1. Create a new Static Site.
2. Set build command to `npm install && npm run build`.
3. Set publish directory to `dist`.
4. Add the `VITE_*` environment variables.
5. Deploy.

## Post-Deploy Check

After deployment, open the site and confirm:

- The command center route `#/` renders.
- The health check shows `API mode: Live` when `VITE_BECS_API_URL` is set.
- The health check shows `API URL configured: Yes`.
- The last dashboard fetch status is either `Live fetch succeeded` or a clear backend/API error.
- Intake submission reaches the configured `/api/events` endpoint.

## Recommendation

Use Netlify or Vercel for the quickest static deployment. Render Static Site is also fine if BECS infrastructure already uses Render.
