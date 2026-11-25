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
