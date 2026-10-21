import FREE_EMAIL_DOMAINS from "free-email-domains";

// Sourced from the `free-email-domains` package (actively maintained,
// ~13k domains) rather than a hand-rolled list. This is a heuristic, not
// perfect: it can't tell a company using Google Workspace on its own custom
// domain (passes, correctly) from someone using a personal gmail.com address
// (blocked), and it can't catch a free provider that isn't in the list. The
// client forms and /api/ot-enquiries import this same constant, so the check
// can't be bypassed by posting straight to the API.
export { FREE_EMAIL_DOMAINS };
