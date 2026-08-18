# Sikh ID dashboard

Next.js front-end for the Sikh ID member dashboard — the UI that matches
your original screenshot, plus the full "Complete Your Profile" wizard
wired to the `vps-backend` API.

## Pages

- `/dashboard` — welcome banner with live completion %, ecosystem grid
  (the 8 live + 3 upcoming Sikh Group platforms), profile summary,
  "X things left to complete" card, quick actions.
- `/dashboard/profile` — the 7-step progressive wizard (About You →
  Professional → Interests → Group Preferences → Communication →
  Community → Confirmation). Resumes at the first incomplete section
  automatically. Each step saves via the matching backend endpoint and the
  progress bar updates from the real `profile_completion` value returned
  by the API — never a locally-guessed number.
- `/login` — standalone login for testing directly against the API. In
  production, users normally arrive already authenticated: the WordPress
  plugin's SSO flow appends `?access_token=...&refresh_token=...` to the
  dashboard URL after login, which `useAuthFromUrl()` picks up and stores.

## Setup

```bash
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_BASE_URL to your VPS API
npm install
npm run dev                        # http://localhost:3000
```

## Deploying alongside the backend

Build and run as a standard Next.js app behind Nginx on `id.thesikhgroup.com`:

```bash
npm run build
pm2 start npm --name sikh-id-dashboard -- start
```

Add a third PM2 process entry to `vps-backend/ecosystem.config.js` if you'd
rather manage all three (API, workers, dashboard) from one file — or keep
this as its own PM2 app, which is simpler if you ever want to deploy the
dashboard on a different box (e.g. Vercel) while the API stays on the VPS.

## Design notes

- Colors and layout follow your existing Sikh ID mockup exactly: navy
  `#0d1b3d` sidebar/banner, saffron `#f5821f` accent, white cards on a
  light gray page background.
- The wizard intentionally shows "X% complete" and a segmented progress
  bar rather than raw step numbers — same "make 100% feel achievable"
  principle from your original spec.
- No icon library dependency — sidebar icons are hand-drawn inline SVG so
  the app has zero extra runtime dependencies beyond Next/React.
