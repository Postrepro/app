# Postre Foundation Implementation Plan

> **For agentic workers:** Implement this plan task by task in this session. Work is divided into reviewable milestones; do not create a second Supabase project.

**Goal:** Initialize the user's existing GitHub repository, connect its existing Supabase project and Vercel account, and deliver the first deployable PWA foundation with verified signup and a seven-day trial.

**Architecture:** One Next.js App Router application deployed on Vercel. Reuse Supabase organization `Postre Pro` and its existing `Postre` project for Auth and Postgres; use server-side Supabase SSR clients and row-level security. Initialize the existing, empty `Postrepro/app` GitHub repository and connect it to a Vercel project after team access is authorized.

**Tech Stack:** Next.js App Router, TypeScript, Supabase Auth/Postgres/SSR, Vercel, npm lockfile, Figtree, CSS glass design tokens, PWA manifest/service worker.

**Spec:** `docs/superpowers/specs/2026-11-12-postre-design.md`

## Global Constraints

- Reuse Supabase project `Postre` in organization `Postre Pro`; inspect existing schema, migrations, Auth and Storage before changing anything.
- Use the existing public GitHub repository `Postrepro/app`; do not change its visibility without user approval and never commit secrets. Do not create duplicate Vercel or Supabase projects if matching projects already exist.
- Do not modify production DNS or assign `postre.pro` until its current ownership and assignment are inspected.
- Google OAuth is the primary baker sign-in; the Google provider must be configured before claiming sign-in is live.
- Required registration fields: first name, last name, cédula, email and phone. RIF, address and delivery information are conditional/optional.
- Do not request or store a photo of cédula.
- A seven-day trial starts only after successful completion of registration; no payment gateway or payment API.
- The POS PIN has exactly four digits and is per user within a business; it cannot replace a signed-in, previously authorized session.
- Use Figtree, cream/chocolate, glass surfaces, mobile-first spacing and no font customization.
- All user-facing interface text, validation, onboarding and messages must be written in Spanish; technical identifiers and source comments may follow code conventions.
- Keep the storefront URL form `/{slug}-pos`, workspace `/{slug}`, public landing `/`, and admin route `/admin`; reserve system route names and reject slug collisions.
- Do not add or run automated tests in this phase. Review behavior in the deployed preview and present it for the user's approval.

## Review Focus

- Google OAuth credentials may be absent: the UI must report setup status honestly and never imply the account was verified without a successful provider callback. Manual preview check belongs to Task 4.
- A user must not obtain another business or admin access by changing a slug or `business_id`. Manual access check belongs to Task 3.
- Incomplete profiles must not start the seven-day trial or reach business operations. Manual signup check belongs to Task 4.
- Public signup must never assign the Postre platform-admin role. Manual route/role check belongs to Task 3.
- A four-digit PIN must not function as account login and must not be stored as plaintext. Manual PIN setup check belongs to Task 4.

---

## Task 1: Authorize and inspect connected services

**Files:** None; read-only service inspection followed by explicit team-consent flow.

**Interfaces:**

- Existing Supabase organization: `Postre Pro`.
- Existing Supabase project: `Postre`, region `us-west-2`.
- GitHub repo: `Postrepro/app`, empty, public, with admin/push permission for the connected account.
- Vercel team: `postre1`, team ID `team_plYRil3ueYmu38p8m8V1weAQ`; consent is required before the connection can inspect or create team resources.

- [ ] Initiate Vercel team-access consent for the connected `Postre` Vercel account. Show the single-use Vercel consent URL to the user and wait for approval; do not retry team-scoped operations until approval completes.
- [ ] After approval, list Vercel projects and domains for the authorized team. Record an existing matching project if present; otherwise plan creation of one project named `postre`.
- [ ] Inspect the contents and default branch of `Postrepro/app` one last time before initializing the local checkout; do not create another repository.
- [ ] Inspect Supabase migrations, tables, RLS policies, Auth providers, Storage buckets and project advisors before schema changes. Preserve existing data and record findings in `docs/superpowers/implementation-notes.md`.
- [ ] Present a short resource inventory to the user before any resource creation: account/team, repo, Vercel project, Supabase project and domain status.

**Deliverable:** A verified resource inventory and user-approved Vercel team access. This task creates no duplicate backend and makes no production DNS change.

## Task 2: Create the repository and application shell

**Files:**

- Initialize existing repository `Postrepro/app`; preserve its current public visibility unless the user explicitly approves changing it.
- Create: `package.json`, lockfile, `tsconfig.json`, `next.config.ts`, `.gitignore`, `.env.example`, `README.md`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/manifest.ts`, `src/app/page.tsx`, `src/app/admin/page.tsx`, `src/app/[tenant]/page.tsx`, `src/components/app-shell/`, `src/lib/config/public-env.ts`, `public/brand/logo.png`, `public/icons/icon-512.png`, `public/favicon.png`.

**Interfaces:**

- `src/app/[tenant]/page.tsx` recognizes `<slug>-pos` as a public-store placeholder and other valid slugs as an authenticated-workspace placeholder; shared parsing lives in `src/lib/routing/tenant-path.ts` with `parseTenantPath(pathname: string): { kind: "workspace" | "store"; slug: string } | null`.
- `src/lib/config/public-env.ts` validates only public client configuration; secrets must not use `NEXT_PUBLIC_` names.

- [ ] Clone/initialize `Postrepro/app` and confirm it is empty before scaffolding; keep the design and plan documents in the repo under `docs/`.
- [ ] Scaffold the latest stable Next.js App Router TypeScript application using npm; commit the exact resolved dependencies in the lockfile.
- [ ] Add the Figtree font, cream/chocolate/glass CSS tokens, responsive app shell, Lucide icon package and brand assets supplied by the user.
- [ ] Add the manifest and installable PWA shell; cache static shell assets only, not private business data.
- [ ] Implement and manually inspect tenant-path parsing for `/admin`, `/{slug}` and `/{slug}-pos`; reserve `admin`, auth paths and malformed/colliding slugs.
- [ ] Push the initial commit to `Postrepro/app` and confirm the source tree is present.

**Deliverable:** The user's existing `Postrepro/app` repository contains the responsive Postre PWA shell and route placeholders, visible as a local/remote change for user review.

## Task 3: Connect Vercel and protect route boundaries

**Files:**

- Create or reuse Vercel project `postre` under authorized team `postre1`.
- Modify: `vercel.json` only if needed; `src/lib/auth/guards.ts`, `src/lib/routing/tenant-path.ts`, `src/app/admin/page.tsx`, `src/app/[tenant]/page.tsx`.

**Interfaces:**

- `requirePlatformAdmin()` resolves the authenticated user and verifies a trusted server-managed platform role.
- `requireBusinessMember(slug: string)` resolves membership from Supabase and returns the authorized business or redirects to sign-in/unauthorized.
- Never derive authorization from editable user metadata or route parameters alone.

- [ ] Connect the private GitHub repository to the Vercel project; enable preview deployments for branches and pull requests.
- [ ] Configure environment variables by environment using Supabase's publishable URL/key only for browser clients; keep secrets server-only and never print them in logs.
- [ ] Add route guards for `/admin` and private `/{slug}`; leave `/{slug}-pos` public and serve only published catalog data in later phases.
- [ ] Keep `postre.pro` unassigned until project/domain inspection shows the domain can be connected safely; first produce a preview URL.
- [ ] Review the Vercel preview deployment status and route behavior in desktop and mobile layouts.

**Deliverable:** A Vercel preview deployment linked to GitHub. Production domain is not changed in this task.

## Task 4: Supabase Auth and registration/trial foundation

**Files:**

- Create migration with `supabase migration new identity_and_trial`; edit the timestamped file generated by the CLI.
- Create: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/session.ts`, `src/app/auth/callback/route.ts`, `src/app/registro/page.tsx`, `src/features/registration/schema.ts`, `src/features/registration/actions.ts`, `src/features/registration/registration-form.tsx`, `src/features/pos-pin/pin-form.tsx`.
- Modify: `src/app/page.tsx`, `src/app/[tenant]/page.tsx`, `.env.example`, `README.md`.

**Interfaces:**

- `RegistrationInput`: `firstName`, `lastName`, `cedula`, `email`, `phone`, conditional `isRegisteredCompany`, `rif`, `hasPhysicalAddress`, `businessAddress`, `deliveryMode`, `deliveryPhone`.
- `completeRegistration(input: RegistrationInput): Promise<{ businessSlug: string; trialEndsAt: string }>` validates authenticated Google email, inserts profile/business/owner membership and starts a seven-day trial exactly once.
- `setPosPin(pin: string): Promise<void>` accepts exactly four digits, hashes before persistence and enforces uniqueness within the business. The PIN only unlocks a previously authorized POS session.

- [ ] Before creating this migration, inspect current tables and migration history; match existing naming conventions and add only missing structures for profiles, businesses, memberships and trial subscription state.
- [ ] Add RLS to every exposed table. Policies must constrain rows to the verified owner/member and prevent users from assigning themselves the platform-admin role.
- [ ] Create the Google OAuth sign-in route and callback with server-side Supabase SSR session handling. If Google provider credentials are absent, keep the implementation staged and clearly show that configuration is required; do not claim OAuth works until verified.
- [ ] Build registration form with mandatory fields and conditional RIF/address/delivery fields; do not include cédula-photo upload.
- [ ] Complete business registration and trial creation atomically or through a guarded server-side transaction that cannot restart an existing trial.
- [ ] Add account password setup and per-user four-digit PIN setup; never store PIN plaintext or use the PIN as remote account authentication.
- [ ] Manually review successful signup, incomplete signup, repeated signup/trial attempt, other-business slug access and `/admin` access by a non-admin.

**Deliverable:** A verified bakery owner can authenticate with Google, complete registration, create one workspace, set a POS PIN and receive a seven-day trial. Extra-user invitations and payment review remain in later phases.

## Task 5: Preview review and phase-one handoff

**Files:**

- Modify: `README.md`, `docs/superpowers/implementation-notes.md`.

- [ ] Confirm the preview URL, successful deployment build, enabled/disabled integrations, and any provider credentials still needed without exposing secret values.
- [ ] Walk through the landing page, registration, protected workspace, route parsing and PWA install prompt at phone and desktop widths.
- [ ] Compare the visible brand, Figtree, colors, glass, icon-only navigation and compact mobile layout with the approved design references.
- [ ] Show the preview and a concise change list to the user; stop for approval before moving to subscription payments/admin workflows.
- [ ] Record user feedback and revise this milestone before planning the next phase if requested.

**Deliverable:** A user-reviewable preview for the first milestone and a clear list of remaining setup requirements, without enabling production billing or changing DNS.

## Later phase plans

Do not implement these in this plan. Each receives its own implementation plan after the foundation is reviewed:

1. Manual subscription proof, admin approvals, renewal and access pausing.
2. Onboarding tour, examples sandbox and baker theme/settings editor.
3. Rates feed, purchase batches, FIFO recipe costing, production, portions and waste.
4. Storefront checkout, custom-order quotes, delivery, payment proofs, tracking and customer records.
5. POS sales, offline queue/sync, receipts and conflict resolution.
6. Reports, notifications and invoice OCR provider integration.

