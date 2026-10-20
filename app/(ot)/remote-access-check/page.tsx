import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { RemoteAccessCheckInteractive } from "@/components/remote-access-check-interactive";

export const metadata: Metadata = pageMetadata({
  title: "Remote Access Situation Check",
  description:
    "Seven questions about how you connect to machines today. No score, no compliance verdict, just a list of what's worth being ready to describe.",
  path: "/remote-access-check",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

export default function RemoteAccessCheckPage() {
  return (
    <main data-screen-label="Remote access situation check page">
      <RemoteAccessCheckInteractive />
    </main>
  );
}
