// NIS2/Cyberbeveiligingswet country metadata that isn't itself a
// regulatory date or claim (so it's exempt from scripts/check-claims.mjs's
// date check): the competent authority name, and the official
// self-evaluation tools to link out to. Every actual date and citation
// lives in lib/compliance-ledger.ts — see docs/CLAIMS.md.

export type Nis2Country = "NL" | "BE" | "LU" | "other" | "not_sure";

export const LUXEMBOURG_AUTHORITY = "Institut Luxembourgeois de Régulation (ILR)";

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
