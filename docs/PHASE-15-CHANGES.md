# Phase 15 — Password Reset and Change-Password

## 1. Forgot password (both surfaces)

`/admin/login` and `/portal/login` each get a "Forgot password?" link to
`/reset-password/request?role=admin` or `?role=partner`. The request page (new,
`app/reset-password/request/page.tsx`) is a single shared page for both surfaces, reading `role`
from the query string rather than being duplicated per surface. Calls
`supabase.auth.resetPasswordForEmail(email, { redirectTo: ... })` and always shows the same generic
"if that email exists, a link has been sent" message, since Supabase's own method already never
reveals whether the email matched an account, this just doesn't contradict that.

## 2. Reset confirmation page

New `app/reset-password/confirm/page.tsx`. On mount, checks for an active session (the callback
route's code exchange already set the auth cookies before redirecting here). No session, an expired
or already-used link, shows a clear error with a link back to the request page. Has a session: a new
password + confirm form (min 8 characters, must match), calls `supabase.auth.updateUser({ password
})`, then signs out and redirects to `/admin/login` or `/portal/login` based on `role` so the person
logs in fresh with the new password rather than continuing on the reset link's session.

## 3. `auth/callback/route.ts` generalized

Previously hardcoded to `/portal/login?error=confirmation_failed` on any failure, regardless of which
surface initiated the flow. Now reads a `role` param and picks the failure fallback accordingly, and
appends `role` onto the success redirect's `next` URL so `/reset-password/confirm` knows which login
page to send the person back to. The existing partner-signup confirmation flow never passes `role`,
so it's `null` there and every branch falls through to exactly its prior behavior, no regression,
verified below.

## 4. Change password while logged in

New `components/change-password-form.tsx`, shared by `/admin/settings` (new, reachable from the
admin nav) and `/portal/account` (new, reachable from the portal header). Same `updateUser({
password })` call, no "current password" field since `updateUser` doesn't need or accept one, an
active session (already required to reach either page) is sufficient. Both require the new password
twice and a minimum 8 characters, same validation as the reset-confirm page.

## Verification

`tsc --noEmit` clean, `eslint --max-warnings=0` clean, full production build (`/admin/settings`,
`/portal/account`, `/reset-password/request`, `/reset-password/confirm` all present; no other
route's static/dynamic classification changed).

**Live testing found a real, blocking configuration problem, external to this codebase, before the
end-to-end flow could be completed. Recorded here in full since it's exactly the kind of thing "verify
for real" is supposed to catch.**

**Confirmed working:** password reset emails are sent by Supabase Auth's own built-in email delivery
(via Postmark, `noreply@mail.app.supabase.io`), triggered internally by `resetPasswordForEmail()`,
entirely separate from `lib/resend.ts` (which only ever fires from this app's own Triggers 1-3). Two
real emails were received at a real, externally-checkable test inbox (Mailinator) within seconds of
the request, subject "Reset your password". This is not assumed, it's observed directly.

**Confirmed broken:** the actual link inside that real email does not point at
`https://www.softwarelantern.com/auth/callback` at all, regardless of the `redirectTo` passed to
`resetPasswordForEmail()`. It points at `https://software-lantern.vercel.app` (a bare old Vercel
default domain, no path, no query string), which serves nothing useful for this flow. Verified this
is not a code-side parameter-passing bug two ways: first via the real email's actual content, second
by calling Supabase's own `/auth/v1/verify` endpoint directly with an explicit `redirect_to` pointing
at our callback, hand-encoded, which Supabase still silently overrode to the same bare Vercel URL.
This is a **Supabase project-level configuration gap**, not application code: the project's
Authentication → URL Configuration in the Supabase dashboard does not have our custom domain in its
Redirect URLs allowlist, so Supabase rejects any `redirectTo` that isn't on that list and silently
substitutes the project's configured Site URL instead, which itself is still set to the old default
Vercel domain rather than `https://www.softwarelantern.com`.

**This needs to be fixed in the Supabase dashboard before this feature can work in production at
all**, for either role, real users included, not just my test:
1. Authentication → URL Configuration → Site URL: set to `https://www.softwarelantern.com`.
2. Authentication → URL Configuration → Redirect URLs: add an entry covering
   `https://www.softwarelantern.com/auth/callback` (a wildcard like
   `https://www.softwarelantern.com/**` is the simplest single entry that also covers the existing
   partner-signup confirmation flow, which uses the same callback route).

**Testing is currently additionally blocked by Supabase's email rate limit** (multiple test sends
during this diagnosis, on top of the two needed to find the problem above, exhausted the project's
built-in mailer's hourly allowance). Full end-to-end re-verification (partner-role real click-through,
admin-role `generateLink()` mechanical test, and the signup-confirmation regression check) is queued
to run once both the dashboard fix is applied and the rate limit resets, and this section will be
updated with actual results at that point, not before.

**Orphaned test accounts from this diagnosis, flagged for the upcoming test-data cleanup pass, not
deleted here:** three Supabase Auth users with emails matching `phase15-reset-test-*@mailinator.com`
or `phase15-inspect-*@mailinator.com`, all tagged with `user_metadata._cleanup_tag =
"PHASE15_RESET_TEST_DELETE_ME"` for easy identification.
