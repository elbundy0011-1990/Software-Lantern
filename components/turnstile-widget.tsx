"use client";

import Script from "next/script";
import { forwardRef, useId, useImperativeHandle, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: { sitekey: string; callback: (token: string) => void; "expired-callback"?: () => void },
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

export interface TurnstileWidgetHandle {
  // Cloudflare tokens are single-use — a failed submit has already burned
  // the current token, so a retry needs a freshly solved one, not just the
  // old one resent. Call this after any failed submission, before the user
  // can retry.
  reset: () => void;
}

export const TurnstileWidget = forwardRef<TurnstileWidgetHandle, { onToken: (token: string) => void }>(
  function TurnstileWidget({ onToken }, ref) {
    const id = useId().replace(/:/g, "");
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    const widgetIdRef = useRef<string | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
      },
    }));

    if (!siteKey) return null;

    return (
      <>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          onLoad={() => {
            widgetIdRef.current =
              window.turnstile?.render(`#turnstile-${id}`, {
                sitekey: siteKey,
                callback: onToken,
                "expired-callback": () => onToken(""),
              }) ?? null;
          }}
        />
        <div id={`turnstile-${id}`} className="mb-4" />
      </>
    );
  },
);
