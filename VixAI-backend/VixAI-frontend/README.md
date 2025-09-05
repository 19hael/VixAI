# VixAI Frontend (React + Vite + Tailwind + Framer Motion)

Modern dashboard to manage Google Ads automations connected to the FastAPI backend.

## Tech
- React 18 + Vite + TypeScript
- TailwindCSS (dark + red theme)
- Framer Motion (page and UI animations)
- React Router (routing)
- Zustand (state)
- Axios (HTTP)
- Recharts (charts)

## Structure
- `src/pages/`: `Login`, `Register`, `Dashboard`, `GenerateAd`, `LaunchCampaign`, `Admin`
- `src/layouts/`: `AppLayout` with animated sidebar + topbar
- `src/components/`: `Card`, `Table`, `Charts`
- `src/api/`: `client.ts` (backend), `ads.ts`, `supabase.ts`
- `src/store/`: `auth.ts`

## Environment
Copy `.env.example` to `.env` and set values:

```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Backend endpoints used:
- `POST /v1/generar-anuncio`
- `POST /v1/lanzar-campana`

Ensure your FastAPI app exposes these.

## Install
From `VixAI-backend/VixAI-frontend/`:

```
npm install
```

## Run Dev
```
npm run dev
```
Open the shown URL (default http://localhost:5173).

## Auth Notes
- Demo auth stores user in Zustand only (no real backend auth yet).
- Admin route is allowed only for user with:
  - id `fc4d9a5a-c2ea-4d49-83b9-6421d13feae3`
  - email `support@vixai.lat`
- Login form will auto-assign that id when using that email.

## Supabase Reads
`Dashboard`/`Admin` read tables via Supabase REST if `VITE_SUPABASE_*` are set:
- `metrics`, `optimizations`, `important_records`, `logs`, `users`, `changes`

Row Level Security must allow `anon` select for development.

## Theming
- Dark background with red accents from Tailwind custom color `primary` in `tailwind.config.js`.

## Production
- Replace demo auth with real auth (Supabase Auth or backend JWT).
- Restrict RLS policies to service role or backend proxy.
- Configure CORS in FastAPI to allow the frontend origin.
