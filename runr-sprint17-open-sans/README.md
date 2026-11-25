# RUNR Admin Portal — Sprint 17 prototype

A responsive React/Vite prototype based on the Sprint 17 design brief and the supplied visual reference. It uses the reference's pale-blue canvas, white rounded workspace, navy navigation rail, blue primary actions, soft card shadows and compact information panels. The interface is intentionally tailored to RUNR's administrator and user-management workflows rather than a generic analytics template.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production bundle:

```bash
npm run build
npm run preview
```

## Demo access

- Email: `admin@runr.app`
- Password: `RunrDemo!`
- Demo 2FA code: `000000`

The sign-in screen also includes visible states for invalid credentials, a suspended account, a simulated network error, social-provider placeholders and non-administrator access denied.

## What's included

- User directory with search across name, email, phone and user ID; role/status filters; pagination; account status badges; and a mobile card layout.
- User detail drawer with profile, role, account status, verification, recent activity, permission-aware actions and recovery entry point.
- Change-role dialog populated from the mock roles response, reason field, delayed-effect note and rider-onboarding warning.
- Change-status dialog with activate/deactivate/suspend options, reason field and success/error-ready state structure.
- Account recovery confirmation using only explicitly verified contact channels in the mock records; masked destination, no-contact state, sent state and a preview rate-limit state. It never exposes or sets a user's password.
- Administrator profile, 2FA setup/disable flows, active-session presentation, sign-out-all confirmation and session-expired re-login state.
- A reusable `src/components/UserPicker.jsx`. The create-new-user option is hidden unless `allowCreate` is explicitly true.
- Responsive bottom-sheet dialogs on narrow screens, touch-friendly controls and a narrow-screen user-card layout.
- Overview and access/permission screens to make the shell usable as a complete admin-portal prototype.

## API boundary from the Sprint 17 brief

`src/services/api.js` is the integration seam. It intentionally contains no guessed URL paths or request schemas.

**Listed as existing in the brief's M7 checklist:** login, refresh, logout, logout-all, `me`, 2FA and role change. Wire these to the exact confirmed Swagger operations.

**Listed as proposed in the brief's M7 checklist and mocked here:** users list, user detail, status change, activity, verify, permissions and roles. Replace the local methods with the confirmed endpoints only after Backend confirms the Swagger contract. The role selector consumes the role service response; its sample choices live in `src/data/mockData.js` as mock response data, not as UI constants.

The orders and payments destinations are shown as unavailable in this Sprint 17 prototype because the supplied brief does not include their endpoint or navigation contract.

## Important prototype limitations

- All account records, counts, activity, roles, permissions and session examples are sample preview data. They are not RUNR production data.
- Authentication and session methods are simulated. There is no real token storage, refresh-token rotation, server-side authorisation or secure session revocation in this prototype.
- The 2FA QR-like artwork and setup key are illustrative only. The demo code `000000` must never be used in production. Generate real provisioning data and validate codes through the confirmed 2FA backend.
- Recovery sending, rate limiting, verification, role changes and status changes are local mock operations. The masked-contact logic demonstrates the intended UX; production eligibility must come from the verified-contact fields returned by the API.
- Status descriptions are draft UI copy and should be confirmed with Product/Backend before release.
- No physical iOS/Android device QA has been performed. The responsive CSS and manual test checklist below are included for implementation QA.

## Suggested Sprint 17 QA pass

1. Sign in with the demo account; test wrong credentials, suspended account, network error, social-provider placeholder and access-denied state.
2. Complete 2FA with `000000`; test invalid and valid code, setup copy-key, enable and disable confirmation.
3. Search users by each supported field; filter by role and status; move between pages; verify the empty state.
4. Open a user detail; verify role/status/verification/activity; try role and status changes with and without a reason; check the rider warning and delayed-effect note.
5. Start recovery for a user with verified contact, a user with no verified contact, and the rate-limit preview state.
6. Open profile; inspect active sessions; simulate session expiry and sign-out-all.
7. Test at phone width, tablet portrait/landscape, iOS Safari and Android Chrome. Confirm the keyboard does not cover critical form controls and bottom-sheet actions remain reachable.
8. Compare the built UI with the final Figma file, map every visible field to Swagger, and clearly flag any proposed endpoint still mocked.

## Part F — Orders and parcel management
React JSX module `src/Orders.jsx` and `src/orders.css`, integrated into the original sidebar. Run `npm install` then `npm run dev`. Orders, dispatch and audit share in-memory demo state. Quotes, rider eligibility, status transitions and cancellation override are illustrative only. No live payments, notifications, tracking URL, permissions enforcement or backend connections. New customer registration is blocked pending confirmation. Backend must confirm F4/F9 contracts, server-side authorization, atomic assignment, refunds, and audit persistence. Browser and production build not verified.

### D11 permission-state update
Open Access & permissions and click Toggle restricted permissions (demo), then open an account in Users. Restricted actions remain visible with lock icons and hover/focus/tap explanations. The demo toggle is not a real permission editor. Dialogs catch HTTP 403 errors without navigating away; the local action guards are not a substitute for backend authorization. Login denial is shown within the sign-in form. Browser testing and design approval remain pending.

## Event-triggered permission correction
The dashboard starts without permission warnings. Access & permissions → Toggle restricted permissions (demo) switches to a limited account (verification remains granted). Open a user or parcel and activate a locked action with mouse, touch or keyboard to see a dismissible notification; the protected action does not execute. Hover/focus explains the restriction. Confirmation handlers recheck permissions; user API 403 errors remain inline in their dialogs. Order actions are local simulations. No action-denial demo is shown on login. Permission names are mock contracts, not confirmed Swagger fields. Server-side authorization is still required.

## Part F audit update
All ten F1 workflows are represented in the demo. Added explicit order-ID search hint, pickup/destination filtering, varied booking dates, recipient phone, progress checkpoints and seeded history, explicit rider eligibility checks, searchable customer selection, parcel weight and a calculated illustrative quote. Existing event-triggered permissions retained. New customer registration, actual quotes, notifications, tracking URLs, authoritative transitions, refunds and concurrency-safe assignment require confirmed backend contracts. Demo records reset on reload. No live API or browser testing performed.

# Master Sprint 17 update (November 25, 2026)

This version extends the audited React project, not the vanilla HTML version. The master PRD Parts C–K and P take precedence. The photographed wireframe defines Overview's three summary cards and five attention rows. Counts come from the small demo dataset, not the example values in the wireframe. The exact Figma font was not supplied, so the existing DM Sans/Manrope typography was retained; the master PRD brand colors #041b42, #0055cf, #ffb900 are applied in the expanded shell.

## Module walkthrough

- Overview is the initial route; summary cards and exception rows navigate to filtered queues. The bell uses unread demo notification count.
- Users & roles: existing user management/recovery/permission dialogs; related orders and payments navigate to customer search. Authentication, profile and session screens retained.
- Parcel orders/manual dispatch: prior audited workflows retained; shared order state feeds overview; customer picker uses user records; available riders use driver approval, online status and active approved vehicle. The demo prevents assigning a rider already on a nonterminal order. Existing status transitions and cancellation override are illustrative and require backend confirmation. Tracking code copy is available, not a public tracking URL.
- Riders & vehicles: applications, vehicle review, renewals and suspended drivers tabs; approve/reject/suspend/reinstate, reasons and audit records. Onboarding approval also approves submitted vehicles and activates the first if necessary. New vehicle approval does not activate a vehicle. Documents are metadata placeholders, not real Media Service files.
- Documents: renewal comparison placeholders and submitted document listing. The zoom interaction enlarges the placeholder; live document rendering remains to be integrated.
- Payments: sender/receiver portions, provider evidence simulation, re-check, reconcile only after confirmed paid evidence, resend request without collecting credentials. Payment requests and provider checks are simulated; no browser calls to internal payment or webhook endpoints. Existing/demo data only. Reconciliation is a local operation; server-side idempotency and split-payment rules require implementation.
- Carriers: list, create/edit, city-pair rates, optional first office in same flow, deactivation blocked by active dependencies. Offices: carrier/city filters, create/edit, existing-user staff/manager assignment and removal, deactivation safeguards. No real partner portal permissions or booking-by-city service updates.
- Notifications: mark one/all read, unread count, link to related queue. Static demo alerts, not a live notification stream.
- Audit: read-only unified local activity log for successful order, user and new module actions. Before/after detail and search; filter by date/result, search by actor/module/action/target. This is not a durable or exhaustive server-side audit trail; failed events require server logging.
- Access & permissions: demo toggles affect expanded action rights. Restricted actions display event-triggered toast or dialog error; no dedicated error page for an individual action. Backend must enforce permissions independently.

## Engineering handoff and open decisions

`src/data/modules.js` contains the navigation, demo fixtures, new list columns and approval action registry. `src/Operations.jsx` contains reusable lists, details, filters, saved filter and confirmation forms for new modules. Existing Users and Orders keep their custom layouts. A complete API-driven registry and per-environment feature flags remain future integration work. Carrier trips/manifests and settlements are not implemented because scope is explicitly unconfirmed (I7 / O2; L4 prioritises core screens). New account registration in booking is also unconfirmed, so the shared picker only chooses an existing customer. Real tracking links, system quotes, payment requests, live rider availability, role-scoped partner access, production auth/refresh/2FA, provider reconciliation, server-side paging/filtering, durable storage, notification delivery and complete action logs require confirmed Swagger and a staging API. Do not use this prototype with production customer data.

## Validation for this archive

All JSX/JS source files were syntax-transpiled with TypeScript (no diagnostics). npm installation was attempted offline and online; the registry was not cached and DNS resolution failed. A Vite build and actual interactive browser testing were therefore not completed. Root package.json and the archive contents are verified. Run `npm install`, `npm run dev` and `npm run build` on a machine with npm registry access. The previous demo login credentials are unchanged. The prototype intentionally opens the overview as a signed-in demo; use the profile or simulate session expiry to test login. Figma approval and staging QA are pending.

## Original visual style restoration
The master modules and workflows remain in the project. The overview now reuses the original page heading, white metric cards, table card, compact status/action rows, and white right-hand admin rail. The original presentation palette (#092f78, #2e91e8) is restored throughout the workspace at the user's request; the master PRD brand palette is retained as separate `--brand-*` tokens for future brand sign-off. All five attention queues and the three summary cards remain data-driven and linked to the corresponding screens. The right rail shows demo notifications and dispatch context, not a fabricated live feed. CSS for new modules is aligned with the initial type, spacing and radius system; order table selectors are scoped to avoid changing Users. Mobile navigation remains horizontally scrollable. No changes to permission checks or backend/mock contracts are intended.

Restyle validation: all 9 JS/JSX files passed TypeScript syntax transpilation, and all 4 CSS files passed PostCSS parsing. Fresh offline and online npm installation attempts failed (missing cache and registry DNS EAI_AGAIN), so the restyled UI has not undergone a Vite build or interactive browser QA. Extract the archive before running npm; package.json is at its root.

## Latest Part F checklist update
Open Sans replaces DM Sans and Manrope throughout the CSS (Google Fonts, system fallback). Original layout retained. Mobile filters now open in a bottom panel; search remains visible when closed. Order cancellation override is explicitly named, status reasons reject whitespace, rider conflict messages distinguish booking and rider availability. Tracking lookup is a local demo; public URL and sharing remain blocked pending a confirmed URL. Existing API operations are still simulated, not connected. New customer registration, server-side allowed transitions, real quotes, concurrency, notifications, payment/refund effects, Figma/Swagger handoff and device QA remain pending. No design approval is implied.
