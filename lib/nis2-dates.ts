// Single source of truth for NIS2/Cyberbeveiligingswet dates shown on the
// OT-cyber checker and article. Verified against primary sources where
// this session's tools could reach them; see docs/OT-CYBER-PLAN.md §1 for
// the full research record and what still needs a direct read of
// EUR-Lex/CCB's own text before this goes live.

export const NIS2_DATES = {
  // Primary source, read directly: Staatsblad 2026, 189 ("Besluit van 8
  // juli 2026, houdende regels ter uitvoering van de Cyberbeveiligingswet
  // en tot vaststelling van het tijdstip van inwerkingtreding van de
  // Cyberbeveiligingswet (Cyberbeveiligingsbesluit)"), Article 35: "De
  // Cyberbeveiligingswet en dit besluit treden in werking met ingang van
  // 15 augustus 2026." The Cyberbeveiligingswet itself is Staatsblad 2026,
  // 187 ("Wet van 8 juli 2026, houdende regels ter implementatie van
  // Richtlijn (EU) 2022/2555 ..."), signed 8 July 2026, published 10 July
  // 2026. https://zoek.officielebekendmakingen.nl/stb-2026-187.html and
  // https://zoek.officielebekendmakingen.nl/stb-2026-189.html
  netherlands: {
    lawName: "Cyberbeveiligingswet (Cbw)",
    citation: "Staatsblad 2026, 187 (wet) and Staatsblad 2026, 189 (Cyberbeveiligingsbesluit, Art. 35)",
    inForceDate: "2026-08-15",
    inForceDisplay: "15 August 2026",
  },
  // [VERIFY] — secondary-sourced only in this pass. Primary source is the
  // Belgian Official Gazette (Moniteur belge / Belgisch Staatsblad)
  // publication of the Law of 26 April 2024, available via the official
  // eJustice portal (ELI
  // https://www.ejustice.just.fgov.be/eli/loi/2024/04/26/2024202344/justel)
  // and the Royal Decree of 9 June 2024. ccb.belgium.be's own pages
  // returned HTTP 403 to this session's fetch tool twice; CCB's own news
  // post confirming publication (17 May 2024) and in-force date (18
  // October 2024) is corroborated by multiple independent compliance-
  // advisory sources that agree with each other, but a direct read of the
  // eJustice text is still owed before this goes live.
  belgium: {
    lawName: "Law of 26 April 2024 + Royal Decree of 9 June 2024",
    citation:
      "Moniteur belge, published 17 May 2024 (eJustice ELI 2024202344) [VERIFY, direct eJustice read still owed]",
    inForceDate: "2024-10-18",
    inForceDisplay: "18 October 2024",
    registrationDeadlineDisplay: "18 March 2025 [VERIFY]",
    complianceEvidenceDeadlineDisplay: "18 April 2026 [VERIFY]",
    certificationDeadlineDisplay: "18 April 2027 [VERIFY]",
  },
  // [VERIFY] — secondary-sourced only (Deloitte Luxembourg, Elvinger Hoss,
  // PwC Luxembourg, Luxgap, dataguidance.com, all mutually agreeing).
  // Primary source would be Luxembourg's own Journal Officiel du
  // Grand-Duché de Luxembourg, not yet directly read.
  luxembourg: {
    lawName: "Loi du 5 mai 2026 concernant des mesures destinées à assurer un niveau élevé de cybersécurité",
    citation: "Legilux, Memorial A n. 225 de 2026 [VERIFY, direct read still owed]",
    inForceDate: "2026-05-10",
    inForceDisplay: "10 May 2026",
    registrationDeadlineDisplay: "10 July 2026 [VERIFY]",
    authority: "Institut Luxembourgeois de Régulation (ILR)",
  },
} as const;

export type Nis2Country = "NL" | "BE" | "LU" | "other" | "not_sure";

// Official government self-evaluation tools. Ours is deliberately narrower
// and different in kind: machine-builder-specific, Benelux-framed, and the
// only one of the three that walks through the Article 21(2)(d)
// supply-chain/commercial-pressure branch for businesses that are outside
// NIS2's own scope. Link out to these, don't duplicate or shadow them.
// No Luxembourg-specific self-evaluation tool was found in this pass — the
// checker says so plainly rather than inventing one or silently omitting it.
export const OFFICIAL_SCOPE_TOOLS = {
  NL: {
    name: "NIS2 Zelfevaluatie (Rijksoverheid / RDI)",
    url: "https://regelhulpenvoorbedrijven.nl/NIS-2-NL/",
  },
  BE: {
    name: "NIS2 scope test (Centre for Cybersecurity Belgium)",
    url: "https://atwork.safeonweb.be/nis2",
  },
} as const;
