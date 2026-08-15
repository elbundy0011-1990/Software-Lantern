# Software Lantern — SEO/GEO/Conversion Implementation Plan (Phase 3)

Synthesizes `/docs/SEO-AUDIT.md` (Phase 1) and `/docs/KEYWORD-MAP.md` (Phase 2) into a prioritized action plan. EUDR is planned as **one page** (`/eudr`) with a substantial, distinctly-voiced SME section rather than two separate pages — see the standalone reasoning already given and agreed for this call; not re-litigated here.

**Approved scope for Phase 4 (per direction to proceed):** P0 + P1 below. P2 items are noted but not built this round except where explicitly marked as a safe, page-count-neutral fix. P3 is documented for later, not built now.

---

## P0 — Critical

| # | Page | Issue | Recommended change | Target keyword | Search intent | Expected benefit | Conversion impact | Complexity |
|---|---|---|---|---|---|---|---|---|
| P0.1 | New: `/eudr` | No EUDR landing page exists at all — audit's headline finding | Build a full category page mirroring `/plm`'s structure/depth: hero, trust bar, "what we'll match you on," industry sections (enterprise), a distinct SME section, FAQ/GEO block, CTA. Own `metadata` export. | EUDR compliance software / EUDR software / EUDR software providers (+ industry variants) | Direct buying | Fills the single largest gap identified; only path to ranking for any EUDR commercial term | High — currently zero persuasive context before the wizard; this fixes it | Medium — new page, but follows an existing proven template |
| P0.2 | New: `/battery-passport` | No Battery Passport landing page exists at all | Same treatment as P0.1, battery-specific content, explicit Battery-Passport-vs-DPP clarification | Battery passport software / digital battery passport software / battery passport software providers | Direct buying | Fills the second confirmed gap | High — same reasoning as P0.1 | Medium |
| P0.3 | `/plm` | Targets "PLM software" (wrong, broad audience) instead of "Fashion PLM software" | Retarget title, meta description, H1, and body copy to lead with "Fashion PLM" / "Apparel PLM" framing. Preserve existing structure/sections — copy-level change, not a rebuild. | Fashion PLM software / apparel PLM software / fashion PLM providers | Direct buying | Corrects intent-scope mismatch identified in audit §3/§6-7 | Medium — page already converts, this improves who it attracts | Low |
| P0.4 | Root layout | No `metadataBase`, no Open Graph, no Twitter Card metadata anywhere | Add `metadataBase`, default `openGraph`/`twitter` objects to root `Metadata` export; per-page overrides on P0.1–P0.3 | — (technical, not keyword-targeted) | — | Correct URL resolution for all metadata added below; social/GEO share correctness | Low direct, but blocks correct behavior of everything else | Low |
| P0.5 | New: `app/sitemap.ts`, `app/robots.ts` | No sitemap, no robots file | Native Next.js `MetadataRoute.Sitemap` / `MetadataRoute.Robots` conventions; sitemap lists only real indexable pages (home, `/plm`, `/eudr`, `/battery-passport`, `/providers`); robots disallows `/admin`, `/portal`, `/api`, references sitemap | — (technical) | — | Baseline crawlability signal; formalizes the noindex work already shipped | Low | Low |

---

## P1 — High

| # | Page | Issue | Recommended change | Target keyword | Search intent | Expected benefit | Conversion impact | Complexity |
|---|---|---|---|---|---|---|---|---|
| P1.1 | `/finder` (all states) | Inherits generic homepage metadata regardless of `?category=` | Add `generateMetadata` reading the `category` search param; canonicalize `/finder?category=X` back to the matching category page (`/eudr`, `/plm`, `/battery-passport`) to avoid cannibalization while still letting the wizard itself rank if directly linked | (inherits category page's terms via canonical) | Direct buying / transactional | Removes the cannibalization risk flagged in audit §13 | Medium | Low–Medium |
| P1.2 | Header/footer/homepage links | EUDR & Battery Passport links point directly into `/finder?category=X`, skipping the new pages | Repoint all EUDR/Battery Passport entry points (nav dropdown, footer, homepage category tiles) to `/eudr` and `/battery-passport`; those pages' own CTAs continue into `/finder?category=X` | — (internal linking) | — | Ensures the new pages actually receive link equity and traffic instead of being bypassed | High — restores the persuasive-context step before the form (audit §10 conversion finding) | Low |
| P1.3 | Site-wide | No structured data anywhere | Add `Organization` + `WebSite` JSON-LD (no existing pattern in the codebase to follow, so this establishes one — a small shared component) | — | — | GEO/entity clarity; baseline schema hygiene | Low direct | Low |
| P1.4 | `/eudr`, `/plm`, `/battery-passport` | No GEO-oriented definitional/Q&A content | Add a concise, human-readable answer block per page covering the brief's target AI questions for that category (what is X, how do I choose X, who needs X); EUDR's block explicitly covers the SME framing question; Battery Passport's block explicitly distinguishes DPP vs. Battery Passport | (supports Tier 3 terms without dedicating separate pages to them) | Informational feeding commercial | Directly targets the brief's named GEO objective | Low direct, supports overall trust | Low–Medium (writing-heavy, not technical) |

---

## P2 — Medium (documented, not built this round unless noted)

| # | Page | Issue | Recommended change | Note |
|---|---|---|---|---|
| P2.1 | Footer | "About," "Resources," "Privacy" all dead-end to `/` | **Building real About/Privacy pages is out of scope for this round** — it's additional pages beyond what's been approved, and needs its own flag/justification per the brief's constraint. Safe interim fix: remove the "About" and "Resources" links (they point nowhere real) rather than leave misleading internal links; leave "Privacy" as a known gap to flag separately, since a real privacy policy is a genuine pre-launch requirement, not just an SEO nice-to-have. **This copy-only cleanup is small enough to bundle into Phase 4 without expanding page count.** |
| P2.2 | `/eudr`, `/plm`, `/battery-passport` | No cross-category internal links despite real overlap (ICP §10) | Add 1–2 contextual links where genuinely relevant (e.g. EUDR page mentions leather/cattle sourcing → links to `/plm`) once all three pages exist | Deferred — do after P0 pages exist, not in the same pass, to keep each page's initial build simple to review |
| P2.3 | Site-wide | Generic Next.js favicon | Replace with a real Software Lantern brand asset | Deferred — needs a brand asset produced, not purely a code change |

## P3 — Future (documented only)

- Comparison/alternatives-style content (lower-confidence search pattern per Phase 2 research).
- Standalone informational pages beyond the in-page GEO blocks in P1.4.
- A dedicated EUDR SME sub-page, if real post-launch data justifies splitting it out of `/eudr`.

---

## Build Order for Phase 4

1. P0.4 (root layout metadata foundation) — do first, everything else's metadata depends on it.
2. P0.1, P0.2 (new category pages).
3. P0.3 (`/plm` retarget).
4. P1.2 (repoint internal links to the new pages) — done alongside P0.1/P0.2 so the pages aren't orphaned even briefly.
5. P0.5 (sitemap/robots) — do after the pages above exist so the sitemap is accurate on first write.
6. P1.1 (finder metadata/canonical).
7. P1.3 (Organization/WebSite schema).
8. P1.4 (GEO answer blocks) — folded into P0.1/P0.2/P0.3's content rather than a separate pass.
9. P2.1 (footer link cleanup) — small, bundled in.

Proceeding to Phase 4 with this scope now.
