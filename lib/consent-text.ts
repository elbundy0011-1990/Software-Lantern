// Single source for the consent wording shown on the enquiry form, the
// result-screen CTA blocks (components/nis2-scope-checker.tsx) — so the
// same wording is never paraphrased differently in two places. Update here only; every
// caller reads from this file.

export const CONSENT_SENTENCE =
  "Software Lantern will use your answers to review your enquiry and may contact you about it by email.";

export const CONSENT_CHECKBOX_LABEL =
  "I understand Software Lantern will use my answers to review my enquiry and may contact me about it.";

// Approved wording for the questionnaire-pack request form
// (components/questionnaire-pack-form.tsx), verbatim — distinct from
// the main enquiry consent above because the purpose is narrower (send
// the file, not review an enquiry).
export const PACK_CONSENT_SENTENCE =
  "Software Lantern will use your details to send you the file and may contact you about it by email. See our privacy policy.";

export const PACK_CONSENT_CHECKBOX_LABEL =
  "I understand Software Lantern will use my details to send me the file and may contact me about it.";

// Approved wording for emailing someone a result they generated themselves
// on the site (the ROI calculator, the remote-access-check country
// report) — distinct from PACK_CONSENT above (which sends a fixed file)
// and from CONSENT above (which reviews a submitted enquiry): this purpose
// is "send the thing you just calculated/answered back to you by email."
export const RESULTS_CONSENT_SENTENCE =
  "Software Lantern will use your details to email you your results and may contact you about them by email. See our privacy policy.";

export const RESULTS_CONSENT_CHECKBOX_LABEL =
  "I understand Software Lantern will use my details to email me my results and may contact me about them.";

// Which wording a submission agreed to, and a version id for it. The id is a
// short hash of the exact sentence and checkbox label, so it changes on its
// own whenever the wording does; nothing to remember to bump. Recorded with
// every ot_enquiries row (answers.consent) by app/api/ot-enquiries/route.ts.
export type ConsentKind = "enquiry" | "file" | "results";

export const CONSENT_WORDING: Record<ConsentKind, { sentence: string; checkbox: string }> = {
  enquiry: { sentence: CONSENT_SENTENCE, checkbox: CONSENT_CHECKBOX_LABEL },
  file: { sentence: PACK_CONSENT_SENTENCE, checkbox: PACK_CONSENT_CHECKBOX_LABEL },
  results: { sentence: RESULTS_CONSENT_SENTENCE, checkbox: RESULTS_CONSENT_CHECKBOX_LABEL },
};

export function consentVersion(kind: ConsentKind): string {
  const { sentence, checkbox } = CONSENT_WORDING[kind];
  // FNV-1a, 32 bit: stable, dependency-free, and fine for telling wordings apart.
  let hash = 0x811c9dc5;
  for (const ch of `${sentence}\n${checkbox}`) {
    hash ^= ch.codePointAt(0)!;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `${kind}-${hash.toString(16).padStart(8, "0")}`;
}
