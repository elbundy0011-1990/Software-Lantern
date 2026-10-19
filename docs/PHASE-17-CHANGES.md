# Phase 17 — Placeholder Cleanup, Final Consent Text, Logo

## 1. Placeholders

Searched the whole repo for `[Product name]`, `[Owner name]`, `[Disclosure text`. Found:

- 13 `siteName: "[Product name]"` metadata values across every `app/(ot)/**` page, plus 2 literal
  `[Product name]` occurrences in `app/(ot)/layout.tsx` (header link, footer heading). All 15
  replaced with `"Software Lantern"`.
- `[Owner name]` — none found; already resolved in an earlier pass.
- `[Disclosure text` — one occurrence, inside `components/disclosure-slot.tsx`'s own placeholder
  copy. Left as-is (see §4); the component isn't rendered anywhere right now, so this text isn't
  live, but it's still there verbatim for whenever the real text is ready and the component is
  reinstated.

## 2. Personal name scoped to the privacy policy only

`Johannes Cornelis de Boer` previously appeared in `app/(ot)/who-runs-this/page.tsx` and
`components/ot-enquiry-form.tsx` (the `OWNER_NAME` constant driving the consent text). Both now say
`Software Lantern` instead. The privacy page (`app/(ot)/privacy/page.tsx`) already scoped the name
correctly to only its §1 "Who we are" (controller statement) and §13 "Contact us" sections, each
already adjacent to `info@softwarelantern.com` — no change was needed there, confirmed by direct
read. `docs/OT-CYBER-PLAN.md` Part C below has the before/after for the two files that did change.

## 3. Final consent text

`components/ot-enquiry-form.tsx` now renders the exact wording given, as a `<ConsentText />`
fragment shared between the pre-submit copy and the post-submit success message, with "privacy
policy" as a real `<Link>` to `/privacy#ot-service` (a new anchor added to the privacy page's §2
heading, which is where the OT-service-specific sections start). The amber "pending your final
approval" badge is removed.

## 4. Disclosure box no longer rendered

`components/disclosure-slot.tsx` is unmodified and still exported. It is no longer imported or
rendered from `app/(ot)/layout.tsx` (previously in the footer) or `app/(ot)/page.tsx` (previously
its own homepage section). Reinstating it anywhere is a one-line import plus one JSX line.

## 5. Work email and consent, required

Client (`components/ot-enquiry-form.tsx`): the email input is marked `required`/`aria-required`
with a visible "(required)" label and a standing helper line, the consent checkbox is marked
`required`/`aria-required`, and `submit()` now explicitly checks for a present work email (not just
format) and for consent before ever calling the API, each with its own clear error message.

Server (`app/api/ot-enquiries/route.ts`): already rejected an empty/invalid email (regex check) and
a free-email-provider domain, and already rejected a missing `consentReviewGiven` — confirmed by
direct re-read, no change needed; both were already correctly enforced before any DB write.

## 6. Logo

Found the existing mark: `components/logo.tsx` (renders `public/logo-wordmark-full.png`), plus
`public/lantern-icon.png`, `public/lantern-icon-reverse.png` — all raster PNGs, no vector source in
the repo. None of these files were modified; they keep serving the legacy marketplace pages
(`components/site-header.tsx`/`site-footer.tsx`) in their original navy palette unchanged.

For the OT site, the mark was rebuilt as SVG path data (`lib/lantern-paths.ts`) by hand from the
raster original's silhouette (ring handle, hood, body, flame cutout, twin feet), recolored to the
OT palette (`#9a3412` rust on `#f6f5f1` warm paper). This is a faithful redraw, not a pixel trace —
flagged as such in the source file's own comment. Used in:

- `components/ot-logo.tsx` — the header/footer lockup (`app/(ot)/layout.tsx`), icon + "Software
  Lantern" wordmark in the new type.
- `app/(ot)/icon.tsx` / `app/(ot)/apple-icon.tsx` — route-segment favicon overrides (Next.js's
  nested metadata-file convention), rendered via `next/og`'s `ImageResponse`, same approach already
  used by the existing root `app/opengraph-image.tsx`. These apply only to `/` and everything under
  it; the root `app/icon.png`/`app/apple-icon.png` are untouched and keep serving the legacy pages.
- `app/(ot)/opengraph-image.tsx` — new social-share image, same route-segment-override pattern, new
  palette throughout. Root `app/opengraph-image.tsx` untouched.

Verified by direct render (saved and inspected both generated PNGs): the apple-icon renders the
lantern cleanly at 180x180, and the OG image shows the rust mark, "Software Lantern" wordmark, and
the new headline on warm paper, confirmed in a local dev-server fetch, not just by reading the code.

## Verification

- `npx tsc --noEmit`, `npm run lint`, `npm run build`: all clean, 55 routes, including the new
  route-segment-scoped `icon`/`apple-icon`/`opengraph-image` alongside the untouched root ones.
- Static scan: zero remaining `[Product name]`/`[Owner name]` placeholders; `Johannes Cornelis de
  Boer` appears only in the privacy page; zero em-dashes in rendered OT-site copy (checked
  excluding code comments); disclosure box confirmed absent from rendered homepage HTML.
- Dev-server smoke test: homepage, checker, who-runs-this, privacy, and enquiry pages all return
  200; the consent paragraph's privacy-policy link resolves to `/privacy#ot-service`; the header
  renders "Software Lantern" via the new logo component.
