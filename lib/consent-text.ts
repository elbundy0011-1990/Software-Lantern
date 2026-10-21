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
