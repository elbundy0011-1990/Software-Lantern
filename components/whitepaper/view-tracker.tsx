"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

// Fires once per page load. No personal data: no name, email, or answer value,
// just that the report's open web page was viewed. The page itself is a server
// component (so metadata/JSON-LD render server-side); this is the one small
// client island needed to fire a named analytics event on mount.
export function ReportViewTracker() {
  useEffect(() => {
    track("report_viewed", {});
  }, []);
  return null;
}
