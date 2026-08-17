import "server-only";

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = "Software Lantern <notifications@softwarelantern.com>";
const REPLY_TO = "info@softwarelantern.com";

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

// Calls Resend's REST API directly via fetch rather than the `resend` npm
// package: it's a single POST endpoint, and the project already leans
// dependency-light for anything this bounded. Never throws — a Resend
// outage or misconfiguration must never break the lead-submission flow or
// an admin status change, so failures are logged and swallowed here, once,
// rather than requiring every call site to remember to catch.
export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(`RESEND_API_KEY is not set; skipped email to ${to} ("${subject}")`);
    return;
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [to],
        reply_to: REPLY_TO,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`Resend send to ${to} failed (${res.status}): ${body}`);
    }
  } catch (err) {
    console.error(`Resend send to ${to} threw`, err);
  }
}
