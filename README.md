# Player Development App

## 1. Overview
Player Development App is a sport-agnostic, voice-friendly dashboard for coaches and admins to manage athletes, development plans (PDPs) and observations in real-time.  
Built on **Next.js**, **Supabase**, and **Material-UI** (MUI) it reads and writes **live data only**—no mocks, no seeds.  
Colour theme: **Black / White / Old Gold (#CFB53B)**.

---

## 2. Setup

### 2.1 Prerequisites
| Tool | Version (minimum) |
|------|-------------------|
| Node | 18 LTS |
| PNPM | 8.x (recommended) or NPM/Yarn |
| Supabase project | Existing with tables matching schema |
| Git | any recent |

### 2.2 Clone
```bash
git clone https://github.com/tahjholden/mp-player-development.git
cd mp-player-development
```

### 2.3 Install dependencies
```bash
pnpm install         # or: npm install / yarn
```

### 2.4 Environment variables
1. Copy template  
   `cp .env.example .env`
2. Fill in values from your Supabase project (Project → Settings → API):
```
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
```
> **Never** commit real keys—`.env` is git-ignored.

### 2.5 Run in development
```bash
pnpm dev            # vite dev server at http://localhost:5173
```
Hot-reload will pick up code & environment changes automatically.

---

## 3. Deployment

### 3.1 Vercel
1. Push the repo to GitHub.
2. In Vercel dashboard choose **Import Project** → select repo.
3. Set Environment Variables in **Project → Settings → Environment Variables** (same as `.env`).
4. Framework preset: **Vite** (Next.js if you switch to pages/app router build).
5. Click **Deploy**—automatic on every `main` push.

### 3.2 Netlify
```text
Build command : pnpm run build
Publish dir   : dist
```
1. Add repo in Netlify → **New site from Git**.
2. Add the two env vars under **Site settings → Build & deploy → Environment**.
3. Deploy; Netlify CLI (`netlify dev`) also works locally.

---

## 4. Features

| Area | Details |
|------|---------|
| Authentication | Supabase Auth (email/pass) – roles: **Coach** & **Admin** |
| Dashboard | Top info boxes: **Total Players**, **Observations This Week** |
| Player panel | List players, active PDP summary, quick **Add Observation** / **Edit PDP** buttons |
| Observation panel | Newest-first list, filterable |
| CRUD | Players, PDPs (single active per athlete), Observations |
| PDP logic | Creating a new PDP auto-sets previous ones `active=false` |
| Activity Log | All actions recorded silently (not rendered yet) |
| Voice dictation | All long-text inputs (Observations & PDPs) show mic icon & tooltip: “Tap the mic to dictate, or type manually.” Uses native browser speech recognition |
| Responsive | Works from 320 px mobile to widescreen desktop |
| Hard deletes | No soft-delete/caching—writes go straight to Supabase |

---

## 5. Technology Stack
* **Next.js / React 18** – UI & routing  
* **Vite** – lightning-fast dev/bundling  
* **Material-UI (MUI)** – components & theming  
* **Tailwind (utility classes)** – lightweight helpers  
* **Supabase** – Postgres, Auth, RLS  
* **Date-fns** – date formatting  
* **Web Speech API** – voice dictation (no external APIs)

---

## 6. Project Structure
```
src/
│  App.jsx              # root with Theme & Router
│  theme.js             # Old-Gold dark theme
│
├─components/
│   ├─dashboard/        # TopSection, PlayerList, etc.
│   ├─players/          # List & detail pages
│   ├─observations/     # List & detail pages
│   ├─pdps/             # Plan pages
│   ├─auth/             # Login
│   └─common/VoiceInputField.jsx
│
├─lib/
│   └─supabase.js       # client + generic services
├─styles/               # global CSS & Tailwind
└─...                   # vite config, env files, docs
```

---

## 7. Voice Dictation – How-to
1. Open any Observation or PDP form.  
2. Click the **mic icon** → indicator turns gold & “Listening…” overlay appears.  
3. Speak; your words stream into the textarea.  
4. Click again or stop talking to finish (auto-stops on pause).  
5. Edit text manually if needed—dictation is additive.  
> Supported in Chrome, Edge & Android/iOS Safari keyboards. If unsupported, the mic is disabled with tooltip guidance.

---

## 8. Troubleshooting

| Problem | Fix |
|---------|-----|
| **Blank page / 404 after deploy** | Ensure build command & publish folder match (see Section 3). |
| **Supabase 401/403 errors** | 1) Verify `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`. 2) Check RLS policies allow the role. |
| **Voice mic disabled** | Browser lacks Web Speech support. Try Chrome desktop/mobile or iOS 16+. |
| **PDP not marking previous inactive** | Confirm the `active` boolean exists in table and that current user has update permission. |
| **CORS issues in dev** | Add `http://localhost:5173` to **Supabase → Auth → URL Configuration → Allowed Origins**. |
| **Build fails on Vercel/Netlify** | Clear yarn.lock/pnpm-lock conflicts, ensure Node 18 runtime, reinstall deps. |
| **“currentPDP undefined” runtime** | Code now uses `active` flag on `pdp` table; confirm schema matches and remove any stray `current_pdp` columns. |

---

## 9. Contributing & Support
PRs welcome! Open an issue or email the maintainer.  
For Supabase questions visit **https://supabase.com/docs**.  
Good luck, and happy coaching!
