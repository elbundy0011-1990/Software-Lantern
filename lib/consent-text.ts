// Single source for the consent wording shown on the enquiry form, the
// result-screen CTA blocks (components/nis2-scope-checker.tsx), and the
// confirmation email (lib/email-templates.ts) — so the same promise is
// never paraphrased differently in two places. Update here only; every
// caller reads from this file.

export const CONSENT_SENTENCE =
  "Software Lantern will use your answers to review your enquiry and may contact you about it by email. Your details won't be shared with any other company unless we first ask you about that specific company and you agree.";

export const CONSENT_CHECKBOX_LABEL =
  "I understand Software Lantern will use my answers to review my enquiry and may contact me about it, and that my details won't be shared with any other company unless I'm first asked about that specific company and I agree.";

// Approved wording for the questionnaire-pack request form
// (components/questionnaire-pack-form.tsx), verbatim — distinct from
// the main enquiry consent above because the purpose is narrower (send
// the file, not review an enquiry).
export const PACK_CONSENT_SENTENCE =
  "Software Lantern will use your details to send you the file and may contact you about it by email. Your details won't be shared with any other company without asking you first. See our privacy policy.";

export const PACK_CONSENT_CHECKBOX_LABEL =
  "I understand Software Lantern will use my details to send me the file and may contact me about it, and that my details won't be shared with any other company without asking me first.";
