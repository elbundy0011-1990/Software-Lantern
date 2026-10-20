import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { GuideStructuredData } from "@/components/guide-structured-data";

const TITLE = "What to Compare Before a Vendor Demo";
const DESCRIPTION =
  "Fourteen things worth comparing before a remote-access vendor demo, from access scoping to pricing clarity, with a free comparison checklist.";
const H1 = "What to compare before a vendor demo";
const LAST_UPDATED_ISO = "2026-10-20";
const LAST_UPDATED_DISPLAY = "October 20, 2026";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/guides/what-to-compare-before-a-vendor-demo",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const h2 = "font-sans font-semibold text-[22px] leading-[1.2] tracking-[-0.02em] mt-10 mb-2 text-[#1a1d22]";
const p = "text-[16px] leading-[1.7] text-[#3f4b52] mb-4";
const link = "font-semibold underline text-[#9a3412]";

const TOPICS: { name: string; body: string }[] = [
  {
    name: "Access model",
    body: "What a single connection can actually reach once it's made, and how access is granted and revoked.",
  },
  {
    name: "Identity and MFA",
    body: "Whether connecting requires more than a password, and whether accounts are named to a person or shared between people.",
  },
  {
    name: "Session control",
    body: "Who can start and stop a session, including whether the customer can end one themselves, and whether an idle session closes on its own.",
  },
  {
    name: "Logging and evidence",
    body: "What a session log actually captures, how long it's kept, and whether the customer can export their own copy.",
  },
  {
    name: "Deployment options",
    body: "Whether it runs entirely on the customer's own network, requires a cloud component, or both, and what has to be installed on the machine itself.",
  },
  {
    name: "Supported protocols and devices",
    body: "Which industrial protocols and controller types are actually supported today, including whatever older equipment is already in the fleet.",
  },
  {
    name: "Low-bandwidth and offline sites",
    body: "How it behaves on a poor or intermittent connection, since many industrial sites don't have office-grade connectivity.",
  },
  {
    name: "Multi-customer management",
    body: "How access across different customers is kept separate, and whether it can all be managed from one place.",
  },
  {
    name: "Customer control over access",
    body: "Whether the customer can see who currently has access, and pause or revoke it themselves without contacting the vendor first.",
  },
  {
    name: "Onboarding effort",
    body: "What the customer actually has to do to get this running at a new site, and roughly how long that takes.",
  },
  {
    name: "Integrations with identity and monitoring tools",
    body: "Whether it connects to an existing identity provider and whether session data can feed into monitoring tools already in use.",
  },
  {
    name: "Support and regions",
    body: "What support hours are available, in what time zones, and in which countries data is stored and processed.",
  },
  {
    name: "Pricing model clarity",
    body: "Whether pricing is based on users, sites, or connections, stated plainly, and whether costs beyond the headline price exist.",
  },
  {
    name: "Data portability",
    body: "Whether logs and configuration can be exported if the relationship ends, or stay locked into the vendor's own system.",
  },
];

export default function VendorDemoChecklistGuidePage() {
  return (
    <main data-screen-label="What to compare before a vendor demo guide">
      <GuideStructuredData
        headline={H1}
        path="/guides/what-to-compare-before-a-vendor-demo"
        datePublished={LAST_UPDATED_ISO}
        dateModified={LAST_UPDATED_ISO}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: H1, path: "/guides/what-to-compare-before-a-vendor-demo" },
        ]}
      />
      <section>
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-3 text-[#1a1d22]">
            {H1}
          </h1>
          <p className="text-[13px] leading-[1.7] text-[#3f4b52] mb-6">Last updated: {LAST_UPDATED_DISPLAY}</p>

          <p className={p}>
            A demo tends to show what a remote-access product does well. These fourteen areas are
            what&apos;s worth asking about directly, so the comparison covers what a demo doesn&apos;t
            always surface on its own. This page doesn&apos;t name or recommend any specific
            product.
          </p>

          {TOPICS.map((t) => (
            <div key={t.name}>
              <h2 className={h2}>{t.name}</h2>
              <p className={p}>{t.body}</p>
            </div>
          ))}

          <div className="mt-10 rounded border border-[#3f4b52]/[0.2] bg-[#f6f5f1] p-6 text-center">
            <p className="font-semibold text-[17px] mb-2 text-[#1a1d22]">
              Get the full comparison checklist
            </p>
            <p className="text-[14px] text-[#3f4b52] mb-4 max-w-[480px] mx-auto">
              A spreadsheet covering all 25 criteria across the areas above: why each one matters,
              what to ask, a blank column for your own requirement, and three blank columns for
              each vendor&apos;s answer.
            </p>
            <Link
              href="/vendor-checklist"
              className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-white inline-block"
              style={{ background: "#9a3412" }}
            >
              Get the checklist
            </Link>
          </div>

          <h2 className={h2}>Related guides</h2>
          <p className={p}>
            <Link href="/guides/remote-access-approaches" className={link}>
              Remote access approaches for machines, compared
            </Link>{" "}
            and{" "}
            <Link href="/guides/customer-security-questionnaire" className={link}>
              Preparing to answer a customer&apos;s security questionnaire
            </Link>
            .
          </p>

          <div className="mt-10 text-center">
            <Link href="/checker" className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-white inline-block" style={{ background: "#9a3412" }}>
              Check your situation →
            </Link>
            <p className="mt-3 text-[14px] text-[#3f4b52]">
              It takes about 2 minutes and covers NIS2, the Cyber Resilience Act, and the Machinery
              Regulation for machine builders, factory operators, and system integrators in the
              Netherlands, Belgium, and Luxembourg.
            </p>
          </div>

          <hr className="border-[#3f4b52]/[0.2] my-10" />
          <p className="text-[13px] leading-[1.7] text-[#3f4b52] italic">
            This is a general guide, not legal or security advice, and does not name or recommend
            any specific product. Confirm what fits your own situation with a qualified advisor.
          </p>
        </div>
      </section>
    </main>
  );
}
