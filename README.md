# Software Lantern

B2B software-matching marketplace: buyers describe what they need through a
category-branching wizard (EUDR / PLM / Digital Battery Passport software);
Software Lantern staff review and publish the resulting leads; software
providers ("partners") browse published leads, see anonymized details, and
unlock full contact info by paying through Stripe.

## Stack

- Next.js (App Router, TypeScript), styled with Tailwind arbitrary-value
  utilities matching the original design comp 1:1.
- Supabase: Postgres + Auth + Row Level Security.
- Stripe Checkout for lead unlocks.
- Cloudflare Turnstile + a hidden honeypot field on the public enquiry form.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

### Environment variables (`.env.local`, gitignored)

| Var | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API (publishable/anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API (secret/service_role key — **server only**) |
| `ADMIN_EMAIL` | The email of the one Supabase Auth user allowed into `/admin` |
| `STRIPE_SECRET_KEY` | Stripe dashboard → Developers → API keys (use a test key while developing) |
| `STRIPE_WEBHOOK_SECRET` | Created when you register the webhook endpoint (see below) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare dashboard → Turnstile → your widget |
| `TURNSTILE_SECRET_KEY` | Same Turnstile widget |

### Database

Run `supabase/schema.sql` once in the Supabase SQL Editor. It creates:

- `leads`, `partners`, `unlocks` tables with RLS enabled.
- A `get_partner_leads()` function — the only way partners read leads;
  anonymizes company/contact fields for leads they haven't unlocked yet.
- A `create_partner()` function, called on first portal visit after signup.
- A trigger that increments `leads.unlock_count` on every new `unlocks` row
  and hard-stops at `max_unlocks`.

### Admin account

Create a Supabase Auth user (Authentication → Users → Add user) with the
same email as `ADMIN_EMAIL`, then sign in at `/admin/login`. Admin actions
run through the service-role key server-side — RLS doesn't apply to them,
the email check in `lib/admin-auth.ts` is what gates access.

### Stripe webhook

For local testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`. In production,
register `https://<your-domain>/api/stripe/webhook` in the Stripe dashboard
listening for `checkout.session.completed`.

### Turnstile

Create a widget at the Cloudflare dashboard for your domain (and
`localhost` for dev), and drop the site key / secret key into the env vars
above. Until those are set, the enquiry form's Turnstile check is skipped
(useful for local dev) — the honeypot field still runs either way.

## Project structure

```
app/(marketing)/     Public site: home, /plm, /finder (wizard), /providers
app/admin/           Admin login + protected dashboard (review/edit/publish leads)
app/portal/          Partner signup/login + protected dashboard (browse/unlock leads)
app/api/leads/       Public lead submission (honeypot + Turnstile + insert)
app/api/stripe/      Checkout session creation + webhook handler
lib/finder-config.ts Wizard question sets, validation, EUDR/PLM/DBP branching
lib/supabase/        Browser / server / service-role Supabase clients
supabase/schema.sql  Tables, RLS policies, RPC functions
```
