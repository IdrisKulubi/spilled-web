# Spilled Web App Migration Plan (from Landing → Full App)

Goal: Bring spilled-web to feature parity with the Spilled mobile app (Expo) using the same database/auth and similar UI/UX. This document is a step-by-step, checkable migration guide you can follow and track as work progresses.

Tech alignment with mobile
- DB: Neon Postgres via Drizzle ORM (same schema as mobile)
- Auth: better-auth with drizzle adapter (web uses Next.js route handlers)
- Storage: Cloudflare R2 for images (presigned upload flow)
- Runtime: Next.js App Router (current web project), TypeScript, Tailwind + shadcn/ui (already present)

Deliverables by phases
1) Foundation and environment
2) Database and server-side setup (Drizzle + schema)
3) Auth (better-auth) and session plumbing
4) API layer (route handlers) and server actions
5) Shared domain logic (repositories/actions) parity
6) Web UI: pages, layouts, and components mirroring mobile
7) Media upload and verification flows
8) Admin UX parity
9) Testing, accessibility, and deployment

Folder layout (target for spilled-web)
- src/
  - app/
    - (app)/              ← protected app area
      - layout.tsx
      - page.tsx          ← HomeHub (tabs)
      - add-post/page.tsx
      - story/[id]/page.tsx
      - verify/page.tsx
      - profile/page.tsx
      - admin/page.tsx (optional behind admin check)
    - api/
      - auth/[...all]/route.ts           ← better-auth route handler
      - upload/presign/route.ts          ← R2 presign
      - stories/route.ts                 ← list/create
      - stories/[id]/route.ts            ← get/update/delete
      - stories/[id]/comments/route.ts   ← list/create comments
      - reactions/route.ts               ← react/unreact
      - guys/search/route.ts             ← search
  - server/
    - db/
      - connection.ts
      - schema.ts
    - repositories/  (ported from mobile, adapted to Node/Next)
    - services/
      - r2Service.ts
    - actions/       (thin wrappers over repositories for server actions)
  - lib/
    - auth.ts        ← better-auth server config (web)
    - auth-client.ts ← better-auth client
    - constants.ts   ← keep existing
    - types.ts       ← keep existing; add shared domain types as needed
  - contexts/
    - AuthContext.tsx (web version)
  - components/
    - app/ (new app UI components mirrored from mobile)
      - StoryCard.tsx
      - ProfileDropdown.tsx
      - CommentsModal.tsx
      - VerificationStatusBadge.tsx
      - HomeHubTabs.tsx (Search/Share/Explore)

Phase 1 — Foundation and environment
[ ] Ensure Node 18+ and pnpm/npm install
[ ] Add environment variables in spilled-web/.env.local (copy from mobile and rename where needed)

Required env (examples)
- DATABASE_URL=postgres://...              (maps mobile EXPO_PUBLIC_DATABASE_URL)
- BETTER_AUTH_SECRET=your-strong-secret    (new, for web sessions)
- BETTER_AUTH_URL=http://localhost:3000    (or production URL)
- GOOGLE_CLIENT_ID=...
- GOOGLE_CLIENT_SECRET=...
- R2_ACCOUNT_ID=...
- R2_ACCESS_KEY_ID=...
- R2_SECRET_ACCESS_KEY=...
- R2_BUCKET=...
- R2_PUBLIC_BASE_URL=https://your-cdn-domain

Notes
- For local dev, set BETTER_AUTH_URL to http://localhost:3000.
- Keep mobile env untouched; web will read its own .env.local.

Phase 2 — Database and server-side setup (Drizzle + schema)
[ ] Install server deps: drizzle-orm, @neondatabase/serverless
[ ] Create src/server/db/connection.ts using Neon + drizzle (copy from Spilled/src/database/connection.ts but read DATABASE_URL)
[ ] Copy schema: Spilled/src/database/schema.ts → spilled-web/src/server/db/schema.ts (no changes except import paths)
[ ] (Optional) Wire drizzle-kit for migrations if you want to run schema migrations from web too

connection.ts template
- import { drizzle } from "drizzle-orm/neon-http"
- import { neon } from "@neondatabase/serverless"
- const sql = neon(process.env.DATABASE_URL!)
- export const db = drizzle(sql)

Phase 3 — Auth (better-auth)
[ ] Install better-auth
[ ] Create src/lib/auth.ts (web):
    - Use better-auth with drizzleAdapter(db)
    - Remove expo plugin; keep email/password + Google
    - Mirror mobile’s additional user fields (nickname, phone, verified, verificationStatus, idImageUrl, idType, etc.)
[ ] Create route handler at src/app/api/auth/[...all]/route.ts using better-auth helper for Next
[ ] Create src/lib/auth-client.ts for client-side helpers
[ ] Create contexts/AuthContext.tsx (web) similar to mobile but using Next router (no Expo APIs)
[ ] Add provider at app/layout.tsx to wrap (app) routes

References from mobile to consult
- Spilled/src/lib/auth.ts (server)
- Spilled/src/lib/auth-client.ts
- Spilled/src/contexts/AuthContext.tsx

Phase 4 — API layer (route handlers) and server actions
[ ] Create route handlers to mirror mobile actions:
    - GET /api/stories?limit&offset → fetchStoriesFeed
    - POST /api/stories → addPost (text, tags, imageUrl, anonymous, nickname)
    - GET /api/stories/:id → detail
    - PATCH /api/stories/:id → edit
    - DELETE /api/stories/:id → delete
    - POST /api/stories/:id/reactions → react/unreact
    - GET/POST /api/stories/:id/comments → list/create
    - GET /api/guys/search?term=... → searchGuys
    - POST /api/upload/presign → return R2 presigned PUT URL + public URL
    - POST /api/verification/upload → store id image + status pending
    - GET /api/verification/status → return status
[ ] For each endpoint, adapt logic from mobile repositories/actions to Next route handlers (Node environment; no React Native APIs)

References from mobile
- src/actions/* (fetchStoriesFeed.ts, addPost.ts, storyActions.ts, fetchGuyProfile.ts, sendMessage.ts)
- src/repositories/* (StoryRepository, CommentRepository, GuyRepository, UserRepository)
- src/services/r2Service.ts (Cloudflare R2 abstraction)

Phase 5 — Shared domain logic (repositories/actions)
[ ] Copy repositories from mobile → spilled-web/src/server/repositories and update imports to use web db/schema
[ ] Keep method signatures the same so UI maps easily
[ ] Add error handling utilities as in mobile (repositories/utils/*)
[ ] Expose thin server actions that call repositories (optional; or call via fetch to route handlers)

Phase 6 — Web UI parity
Routing & Layout
[ ] Create app/(app)/layout.tsx to gate authenticated area (read session; redirect to / if not signed in, or use middleware)
[ ] Implement HomeHub with tabs (Search/Share/Explore) to mirror mobile’s HomeHubScreen.tsx + HomeHubSections/

Pages/Components to implement (port the following)
- HomeHub: from Spilled/src/screens/HomeHubScreen.tsx
- Sections:
  - SearchSection: Spilled/src/components/HomeHubSections/SearchSection.tsx
  - ShareStorySection: Spilled/src/components/HomeHubSections/ShareStorySection.tsx
  - ExploreSection: Spilled/src/components/HomeHubSections/ExploreSection.tsx
- StoryCard: Spilled/src/components/StoryCard.tsx (map to shadcn Card + actions)
- CommentsModal: Spilled/src/components/CommentsBottomSheet.tsx + AddCommentModal.tsx (merge into modal + sheet for web)
- ProfileDropdown: Spilled/src/components/ProfileDropdown.tsx
- Verification screens:
  - VerificationScreen.tsx → /verify/page.tsx
  - VerificationPendingScreen.tsx → pending state view
  - ProfileCreationScreen.tsx → /profile/onboarding
- Admin:
  - UserApprovalModal.tsx and EditStoryModal.tsx adapted to web (if needed)

UI mapping hints
- Replace React Native View/Text with div/p/Text
- Use shadcn/ui components (Button, Card, Dialog/Sheet, Tabs, Toast)
- Icons: lucide-react (already present)
- Animations: prefer CSS/tailwind transitions or framer-motion

Phase 7 — Media upload & verification
[ ] Create R2 presign endpoint /api/upload/presign that returns { uploadUrl, publicUrl }
[ ] In web UI, use fetch to get presign → PUT file to uploadUrl → save publicUrl with the story/verification
[ ] Port mobile’s image utils: Spilled/src/utils/imageUpload.ts and storyImageUtils.ts (only browser-safe parts)
[ ] Large files: ensure 5–10 MB limits; accept JPEG/PNG/HEIC where possible; do client-side compression if needed

Phase 8 — Admin tasks (optional/prioritized)
[ ] Admin-only page /(app)/admin
[ ] List users with verification_status === 'pending' and approve/reject
[ ] Moderate stories and comments (edit/delete)
[ ] Reuse mobile adminActions.ts logic



Concrete copy/move checklist
- Copy to spilled-web/src/server/db/
  [ ] Spilled/src/database/connection.ts → connection.ts (env: DATABASE_URL)
  [ ] Spilled/src/database/schema.ts → schema.ts
- Copy to spilled-web/src/lib/
  [ ] Spilled/src/lib/auth.ts → auth.ts (replace expo plugin with Next setup)
  [ ] Spilled/src/lib/auth-client.ts → auth-client.ts (browser/Next usage)
- Copy to spilled-web/src/contexts/
  [ ] Spilled/src/contexts/AuthContext.tsx → AuthContext.tsx (remove RN specifics)
- Copy to spilled-web/src/server/repositories/
  [ ] StoryRepository.ts, CommentRepository.ts, GuyRepository.ts, UserRepository.ts, MessageRepository.ts (+ utils)
- Copy to spilled-web/src/server/services/
  [ ] r2Service.ts (update to use Node fetch/AWS S3 compatible sdk if needed)
- Copy to spilled-web/src/shared/utils/
  [ ] imageUpload.ts (browser-safe), storyImageUtils.ts (strip RN parts)
- Build route handlers that call repositories

Routing parity map (mobile → web)
- HomeHubScreen.tsx → /(app)/page.tsx (Tabs)
- SearchSection.tsx → component in HomeHubTabs.tsx
- ShareStorySection.tsx → /(app)/add-post/page.tsx
- ExploreSection.tsx → part of HomeHubTabs.tsx
- StoryDetailScreen.tsx → /(app)/story/[id]/page.tsx
- SignInScreen/SignUpScreen → use public pages or dialogs (keep /api/auth flows)
- ProfileCreationScreen → /(app)/profile/onboarding
- VerificationScreen/VerificationPendingScreen → /(app)/verify

Auth flow acceptance checklist
[ ] Guest sees landing page only; clicking CTAs prompts sign-in
[ ] After sign-in (email/pw or Google), user lands on HomeHub
[ ] If DB profile missing → onboarding page creates it
[ ] If not verified → /verify flow; after uploading ID image, status pending
[ ] If verified → full access to search/share/explore

Stories flow acceptance checklist
[ ] User can create a story with text/tags/image, anonymous toggle
[ ] Feed shows latest stories with reaction counts
[ ] Story detail shows comments; user can add comment
[ ] Search finds guys across name/phone/socials and shows story counts

Environment mapping (mobile → web)
- EXPO_PUBLIC_DATABASE_URL → DATABASE_URL
- EXPO_PUBLIC_GOOGLE_CLIENT_ID → GOOGLE_CLIENT_ID
- EXPO_PUBLIC_GOOGLE_CLIENT_SECRET → GOOGLE_CLIENT_SECRET
- R2_* (same)
- ADMIN_EMAIL → NEXT_PUBLIC_ADMIN_EMAIL (if needed client-side)

Open questions / decisions
- Do we keep Better Auth for both apps? (recommended for parity)
- Do we expose server actions or REST-only? (Either works; REST keeps mobile/web parity easier)
- Image transformations (cdn) — handle in R2 or on client?

Timeboxed rollout suggestion
- Week 1: Phases 1–3 (foundation, DB, auth)
- Week 2: Phases 4–5 (APIs + repositories)
- Week 3: Phase 6 (HomeHub + tabs + StoryCard + comments)
- Week 4: Phase 7–8 (upload + verification + admin) + Phase 9 (tests + deploy)

Commands reference (example)
- Install: npm i better-auth drizzle-orm @neondatabase/serverless zod
- Dev: npm run dev
- Lint/format: npm run lint && npm run format

Tips
- Port logic first (repositories + APIs), then UI
- Keep types identical between mobile and web to minimize integration bugs
- Start with read-only features (feed/search), then write flows (posts/comments)

Status tracking
- Use the checkboxes above to track
- Add notes inline as you progress

