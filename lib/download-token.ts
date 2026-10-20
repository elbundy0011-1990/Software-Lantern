import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Short-lived, stateless download tokens for the questionnaire pack
// (app/api/ot-enquiries/questionnaire-pack/route.ts). No database row,
// no new table: the token is just a signed, expiring claim that the
// holder recently completed the pack-request form, verified by
// recomputing the HMAC. Reuses TURNSTILE_SECRET_KEY as the signing
// key — already server-only, never sent to the client, and a distinct
// enough purpose (signing, not bot verification) that reusing it here
// doesn't weaken either use.

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

function secret(): string {
  const s = process.env.TURNSTILE_SECRET_KEY;
  if (!s) throw new Error("TURNSTILE_SECRET_KEY is required to sign download tokens");
  return s;
}

export function issueDownloadToken(): string {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyDownloadToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp?: number };
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}
