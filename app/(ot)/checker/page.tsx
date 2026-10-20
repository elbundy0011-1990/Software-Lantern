import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { OtCyberInteractive } from "@/components/ot-cyber-interactive";

export const metadata: Metadata = pageMetadata({
  title: "NIS2, CRA & Machinery Regulation Scope Checker",
  description:
    "Check whether NIS2, the Cyber Resilience Act, or the Machinery Regulation apply to you as a machine builder, operator, or integrator in the Benelux.",
  path: "/checker",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

export default function CheckerPage() {
  return (
    <main data-screen-label="Scope checker page">
      <OtCyberInteractive />
    </main>
  );
}
