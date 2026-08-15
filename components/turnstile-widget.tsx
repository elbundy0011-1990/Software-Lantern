"use client";

import Script from "next/script";
import { useId } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: { sitekey: string; callback: (token: string) => void; "expired-callback"?: () => void },
      ) => string;
    };
  }
}

export function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const id = useId().replace(/:/g, "");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.turnstile?.render(`#turnstile-${id}`, {
            sitekey: siteKey,
            callback: onToken,
            "expired-callback": () => onToken(""),
          });
        }}
      />
      <div id={`turnstile-${id}`} className="mb-4" />
    </>
  );
}
