import "server-only";

interface TurnstileResult {
  success: boolean;
}

// Verifies a Cloudflare Turnstile token server-side. If TURNSTILE_SECRET_KEY
// isn't configured yet, verification is skipped (so local/dev submissions
// still work before the keys are wired in) — once the env var is set this
// enforces real bot verification on every submission.
export async function verifyTurnstile(token: string | undefined, request: Request): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { success: true };
  if (!token) return { success: false };

  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || undefined;

  const formData = new URLSearchParams();
  formData.set("secret", secret);
  formData.set("response", token);
  if (ip) formData.set("remoteip", ip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return { success: !!data.success };
  } catch {
    return { success: false };
  }
}
