// Single source for the consent wording shown on the enquiry form, the
// result-screen CTA blocks (components/nis2-scope-checker.tsx), and the
// confirmation email (lib/email-templates.ts) — so the same promise is
// never paraphrased differently in two places. Update here only; every
// caller reads from this file.

export const CONSENT_SENTENCE =
  "Software Lantern will use your answers to review your enquiry and may contact you about it by email. Your details won't be shared with any other company unless we first ask you about that specific company and you agree.";

export const CONSENT_CHECKBOX_LABEL =
  "I understand Software Lantern will use my answers to review my enquiry and may contact me about it, and that my details won't be shared with any other company unless I'm first asked about that specific company and I agree.";
