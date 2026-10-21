# Software Lantern: Audience & Positioning

**Status:** Source of truth for who the site is written for and how it positions itself.
**Scope:** softwarelantern.com, the OT remote-access resource (`app/(ot)/**`): homepage, audience
pages, guides, the regional report, tools (checker, remote access situation check, ROI calculator),
file requests, the enquiry form, and CTAs.
**Not for:** regulatory claims. Every date, article, or obligation on a public page comes from
`lib/compliance-ledger.ts` under the rules in `/docs/CLAIMS.md`.

This document only restates positioning the live site already uses. It adds no market statistics,
segment sizes, or buyer research; anything like that needs a source before it goes here.

---

## 1. What the site is

Practical guidance on secure remote access to machines under three EU rules, NIS2, the Cyber
Resilience Act, and the Machinery Regulation, explained plainly and cited.

## 2. Audiences

Three audiences, each with its own page (`/machine-builders`, `/factory-operators`,
`/system-integrators`), using the homepage's own framing:

| Audience | Who | Why the rules matter to them |
|---|---|---|
| Machine builder | Designs, builds, or sells machinery or equipment | The product has its own rules (CRA, Machinery Regulation), and NIS2 may apply to the organization too |
| Factory or plant operator | Runs production | The organization's own remote access and its suppliers' remote access both matter (NIS2) |
| System integrator | Installs or services equipment for others | Can sit on both sides of these rules |

A machine builder can face all three rules at once, for the same machine, for different reasons.

## 3. Geography

The Netherlands, Belgium, and Luxembourg. The regional report covers Belgium and the Netherlands.

## 4. Positioning principles

- **Explain, cite, don't sell.** Each regulation is explained in terms of what it regulates: NIS2 the
  organization, the CRA the product, the Machinery Regulation safety, including cyberattacks that
  could create a physical hazard.
- **No product mandate.** None of these rules name or require any specific product category. Copy
  must never imply that NIS2, the CRA, or the Machinery Regulation requires buying a product.
- **No vendor or competitor names** in guidance copy.
- **Avoid the words "independent", "neutral", and "unbiased"** as self-descriptions.
- **No em-dashes** in rendered copy.
- **Low-friction first step.** The primary CTA is the checker ("About 2 minutes. No email needed.");
  email is asked for only when the visitor requests something (a file, a copy, a report) or sends
  an enquiry.

## 5. Data and consent

Work email addresses only. Consent wording lives in `lib/consent-text.ts` and must match the privacy
policy (`app/(ot)/privacy/page.tsx`). Enquiries are reviewed by Software Lantern; there is no
automated sharing or publishing of enquiry data.
