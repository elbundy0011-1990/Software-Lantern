# Phase 11 — Transactional Email Notifications + Per-Lead Partner Exclusions

## 1. Email notifications via Resend

Two triggers, both server-side, both calling Resend's REST API directly via `fetch` (`lib/resend.ts`),
no `resend` npm package. Templates are plain inline-style HTML (`lib/email-templates.ts`), not
react-email: two templates, each a heading, a couple of text rows, and one CTA button, didn't clear the
bar for a new rendering dependency, consistent with how the icon library decision was made earlier in
this project (hand-roll first, only add a package once the accumulated need justifies it).

**Sender**: confirmed against the user's own Resend dashboard check, `softwarelantern.com` is verified
at the root (not a subdomain), so `notifications@softwarelantern.com` is a valid from address. Used
uniformly for both triggers, reply-to `info@softwarelantern.com`.

**Trigger 1, new lead submitted** (`app/api/leads/route.ts`): after the insert succeeds, scheduled via
Next's `after()` (stable in this Next.js version, confirmed against `node_modules/next/dist/docs`) so a
slow or down Resend never adds latency to, or fails, a submission that already succeeded. Sent to
`ADMIN_EMAIL` with full detail (company, contact name/email, category, requirement summary, current
vendor and timeline if present) and a direct link to `/admin/leads/[id]`.

**Trigger 2, lead published** (`app/admin/(protected)/actions.ts`, `setLeadStatus()`): fires only on a
genuine `new`/`discarded` → `published` transition, detected by reading the row's current status before
the update, not on every subsequent edit to an already-published lead. Also scheduled via `after()`, for
the same non-blocking reason, and because partner count (and therefore total send time) varies.

Partner matching mirrors `portal-dashboard.tsx`'s `defaultFilter` soft-default exactly: a partner
matches if their `categories[]` includes this lead's category, or `categories[]` is empty. The
short-code mapping this depends on (`"EUDR Software"` → `"EUDR"`, etc.) was previously defined only
inline in `portal-dashboard.tsx`; extracted to `categoryShortCode()` in `lib/finder-config.ts` and now
imported by both the portal filter and the notification query, so the two can't drift apart on what
"this partner covers this category" means.

**Privacy**: Trigger 2's content is deliberately narrower than everything `get_partner_leads()` exposes
pre-unlock. Only category and a general requirement summary are included, never `current_vendor`,
`budget_range`, `timeline`, or the raw answers, even though those are technically pre-unlock-visible in
the portal today. `current_vendor` specifically is the field motivating the exclusion feature below, so
it was deliberately left out of the broader "safe" set. Sent individually per partner
(`Promise.allSettled`, one failure doesn't block the rest), never CC/BCC. CTA links to `/portal`
directly, not `/portal/login`: `requirePartner()` already redirects unauthenticated visitors to
`/portal/login` on its own, so linking to `/portal` reproduces the standard auth-redirect behavior
without hardcoding two separate links.

## 2. Per-lead partner exclusions

**Schema** (`supabase/schema.sql`): `lead_exclusions(id, lead_id, partner_id, created_at)`, unique on
`(lead_id, partner_id)`. RLS enabled with zero policies for any role, plus an explicit
`revoke all ... from anon, authenticated`. With no grant at all, PostgREST excludes the table from the
schema it serves to `authenticated` entirely, so a partner's client can't distinguish "this table has
zero rows for me" from "this table isn't part of the API surface" the way a 403 would. Only
`service_role` (admin actions) and `get_partner_leads()` (`security definer`, bypasses the caller's own
grants) ever touch it.

**Unlock carve-out** (explicit follow-up requirement after the initial plan): `get_partner_leads()`'s
new exclusion filter is `and (ex.id is null or u.id is not null)` — an exclusion only ever prevents
seeing or unlocking a lead the partner hasn't already paid for. A partner who already has an `unlocks`
row for a lead keeps access regardless of any `lead_exclusions` entry added afterward. The filter is
folded into the same WHERE clause as the existing category/status logic, so an excluded (and
not-yet-unlocked) lead is structurally identical to one outside the partner's category, no separate
flag, no visible gap.

**Fuzzy match** (`lib/fuzzy-match.ts`): hand-rolled, no dependency, same reasoning as the email-template
decision. Normalizes case/punctuation/common legal suffixes (Ltd, Inc, GmbH, etc.), checks exact match,
substring containment, and a Levenshtein-based similarity ratio, returns the single best match above a
0.6 threshold or `null`. This is a suggestion only, never automatic: the admin always sees an explicit
confirm step.

**Admin UI**:
- `app/admin/(protected)/leads/[id]/exclusions-panel.tsx`: a standalone checklist of all partners,
  existing exclusions pre-checked, add/remove via two new `requireAdmin`-gated server actions
  (`addLeadExclusion`, `removeLeadExclusion`). Works at any time, before or after publish.
- `app/admin/(protected)/publish-confirm.tsx`: a shared client hook (`usePublishConfirm`), used by
  **both** publish entry points, not duplicated logic in each. Computes the fuzzy match against
  `lead.current_vendor` and the loaded partner list; if a plausible, not-yet-excluded match exists,
  intercepts the publish click with a confirm dialog ("This lead's current vendor looks like it might
  be **[Partner X]**. Exclude them from seeing this lead before publishing?") offering "Exclude and
  publish," "Publish without excluding," or "Cancel." No path bypasses this: `setLeadStatus(id,
  "published")` is called directly from exactly two places in the whole codebase before this phase (the
  leads list's `StatusButtons` and the detail page's `LeadEditForm` status switcher); both now call
  `requestPublish()` from this shared hook instead, and both received the same `partners` +
  `excludedPartnerIds` props needed to compute the match (fetched in `app/admin/(protected)/page.tsx`
  and `app/admin/(protected)/leads/[id]/page.tsx` respectively).

**Notification-timing race condition** (flagged before building, resolved without new infrastructure):
if an admin publishes, the Trigger 2 email fires, and *then* an exclusion is added, the affected partner
already received an email. No delay/holding mechanism was built for this. Reasoning: Trigger 2's email
deliberately never deep-links to a specific lead (its CTA goes to `/portal` generally), so even in this
race, the partner has no way to correlate "an email arrived" with "this specific lead is now missing
from my list", since there's no lead ID or lead-specific link in the email to begin with, and other
legitimately-visible leads in that category may exist for comparison. The generic shape of the
notification is itself the mitigation. The publish-time confirm dialog above is the primary safeguard,
designed to catch the common case (exclusion needed) before the email fires at all, not as a fix-up
after.

## Verification

`tsc --noEmit` clean, `eslint --max-warnings=0` clean, full production build (all existing routes still
render/build with their previous static/dynamic classification unchanged; `/admin`, `/admin/leads/[id]`,
and `/api/leads` remain dynamic, as they already were). No competitor names, no em-dashes, no pricing
figures introduced in any new user-facing copy (both email templates, the exclusions panel, and the
publish-confirm dialog were checked directly).

`RESEND_API_KEY` added to `.env.example`; not yet supplied to `.env.local` as of this writing, pending
the user pasting a freshly-rotated sending-scoped key via the terminal (a first attempt at pasting it
arrived in chat instead of the terminal mid-build and was flagged as compromised on the spot; not used,
not stored, not referenced again).
