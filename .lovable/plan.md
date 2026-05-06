# WindFlower Frontend + Admin Dashboard

A TanStack Start app that turns your `windflower-backend` (Express + Prisma + JWT, port 4000) into a living website: a cinematic public landing page rendered from `/api/landing`, plus a full-CRUD admin console at `/admin`.

## Backend wiring

- **API base**: `http://localhost:4000` via `VITE_API_BASE_URL` (defaults to localhost). All fetches go through a tiny `src/lib/api.ts` wrapper that handles JSON, JWT bearer header, multipart uploads, and unwraps `/uploads/*` paths to absolute URLs.
- **Auth**: `POST /api/auth/login` → JWT stored in `localStorage` (`wf_token`). `GET /api/auth/me` validates on app load. `AuthProvider` exposes `useAuth()`; `<RequireAdmin>` redirects to `/admin/login` if missing.
- **No backend changes** required. Everything reads/writes the existing endpoints documented in your README.

## Public site (cinematic, all dynamic from `/api/landing`)

Routes (each is a real TanStack route with its own `head()` meta):

- `/` — Hero + About + Technology + Why + Applications + Achievements + Contact (single scroll, sections come from API by `key`/`type`)
- `/about`, `/technology`, `/applications`, `/achievements`, `/contact` — dedicated pages reusing the same section data for SEO and deep-linking
- Navigation pulled from `NavigationItem`, socials from `SocialLink`, site title/tagline from `SiteSetting`

### The "wow" layer

- **Three.js 3D hero**: a custom procedural WindFlower model (tall slender stem + spherical cluster of petal blades built from instanced `ConeGeometry` arranged on a Fibonacci sphere). Slowly rotates; the petal sphere counter-rotates and gently breathes; mouse parallax tilts the camera. Soft warm core light glows from inside the bulb (matches your reference image). Falls back to the static product PNG if WebGL isn't available.
- **Smooth scroll** with Lenis + scroll-driven reveals (IntersectionObserver, no heavy lib): `fade-up`, `fade-in`, `scale-in`, `slide-x` variants applied per-section.
- **Parallax shapes**: floating blurred orbs in the hero respond to scroll Y and cursor.
- **Magnetic CTAs** + custom blended cursor (desktop only).
- **Animated metallic gradient text** (CSS `background-position` keyframe), star sparkles, conic glow rings.
- **Count-up stats** (METRICS section) when scrolled into view.
- **Achievement carousel** with 3D tilt cards (CSS `rotateX/Y` from pointer position).
- **Section transitions**: each section pinned-feel via sticky backdrop blur; nav switches active link via IntersectionObserver.
- **Contact form** posts to `POST /api/contact` with optimistic toast + confetti on success.

### Design tokens

Black base (`#000`), metallic silver gradients, blue accent `oklch(0.7 0.18 240)`, fonts **Audiowide** (brand) + **Rajdhani** (body) loaded via Google Fonts, mirroring your HTML. All defined as CSS variables in `src/styles.css`.

## Admin dashboard (`/admin/*`)

Layout: shadcn `Sidebar` + topbar with logout. Uses TanStack Query for caching + optimistic updates. Toasts via `sonner`.

Pages (full CRUD on every resource):

| Route | Backend |
|---|---|
| `/admin/login` | `POST /api/auth/login` |
| `/admin` (dashboard) | counts from each list endpoint, recent contacts |
| `/admin/media` | `GET/POST /api/admin/media` (drag-drop upload, grid, copy URL, delete) |
| `/admin/navigation` | `/api/admin/navigation` (sortable list, visibility toggle) |
| `/admin/sections` | `/api/admin/sections` (key, type enum, title/subtitle/body, image picker, JSON config editor) |
| `/admin/sections/:id/items` | `/api/admin/items?sectionId=` (cards/features/metrics editor) |
| `/admin/achievements` | `/api/admin/achievements` (with image upload via multipart) |
| `/admin/socials` | `/api/admin/socials` |
| `/admin/settings` | `/api/admin/settings` (key/value JSON) |
| `/admin/contacts` | `/api/admin/contacts` (inbox: NEW/READ/ARCHIVED filter, status PATCH) |
| `/admin/users` | `/api/admin/users` (admins, role select, active toggle) |

Reusable building blocks:
- `ResourceTable` — list + sort + delete
- `ResourceForm` — Zod-validated, generates fields from a schema descriptor (text, textarea, number, switch, select, json, image)
- `ImagePicker` — opens media library OR uploads new (returns `imageId` + preview)
- `JsonEditor` — `<textarea>` with parse validation for `config` fields

## File layout

```text
src/
  lib/
    api.ts                  fetch wrapper + asset URL helper
    auth.tsx                AuthProvider, useAuth, RequireAdmin
    queries.ts              queryOptions for landing, lists
  components/
    site/Header.tsx Footer.tsx Section.tsx Reveal.tsx MagneticButton.tsx Cursor.tsx
    site/WindFlower3D.tsx   Three.js hero scene
    site/sections/         Hero, About, Technology, Why, Applications, Achievements, Contact
    admin/AppSidebar.tsx Topbar.tsx ResourceTable.tsx ResourceForm.tsx ImagePicker.tsx
  routes/
    __root.tsx              QueryClientProvider, AuthProvider, fonts, Toaster
    index.tsx about.tsx technology.tsx applications.tsx achievements.tsx contact.tsx
    admin.tsx               layout (sidebar) + RequireAdmin
    admin.index.tsx admin.login.tsx admin.media.tsx admin.navigation.tsx
    admin.sections.tsx admin.sections.$id.items.tsx admin.achievements.tsx
    admin.socials.tsx admin.settings.tsx admin.contacts.tsx admin.users.tsx
  styles.css                tokens, keyframes, metallic/glass utilities
```

## Dependencies to add

`three`, `@react-three/fiber`, `@react-three/drei`, `@tanstack/react-query`, `lenis`, `zod`, `react-hook-form`, `@hookform/resolvers` (sonner, lucide, shadcn already present).

## Notes

- Backend must be running locally on `:4000` with CORS allowing the Lovable preview origin. If you see CORS errors, add the preview URL to your Express `cors()` allowlist — I'll flag this on first failed request.
- Logo + product PNGs from your repo's `assets/` will be re-hosted via your backend's `/api/admin/media` upload, or dropped into `public/` as fallbacks for first paint.
- Site is fully dynamic, but ships with sane defaults so it never looks empty before content is seeded.

Approve and I'll build it.
