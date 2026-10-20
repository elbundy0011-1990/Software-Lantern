import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { GuideStructuredData } from "@/components/guide-structured-data";

const TITLE = "Remote Access Approaches for Machines, Compared";
const DESCRIPTION =
  "Six ways to connect remotely to a machine: how each works, where it fits, the trade-offs, and what to ask, with public guidance cited throughout.";
const H1 = "Remote access approaches for machines, compared";
const LAST_UPDATED_ISO = "2026-10-20";
const LAST_UPDATED_DISPLAY = "October 20, 2026";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/guides/remote-access-approaches",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const NIST_ZERO_TRUST_URL = "https://nvlpubs.nist.gov/nistpubs/specialpublications/NIST.SP.800-207.pdf";
const NIST_OT_SECURITY_URL = "https://csrc.nist.gov/pubs/sp/800/82/r3/final";
const CISA_EXPOSURE_URL = "https://www.cisa.gov/resources-tools/resources/exposure-reduction";

const h2 = "font-sans font-semibold text-[24px] leading-[1.2] tracking-[-0.02em] mt-12 mb-4 text-[#1a1d22]";
const h3 = "font-sans font-semibold text-[18px] mt-6 mb-2 text-[#1a1d22]";
const p = "text-[16px] leading-[1.7] text-[#3f4b52] mb-4";
const link = "font-semibold underline text-[#9a3412]";

interface Approach {
  id: string;
  name: string;
  how: React.ReactNode;
  fit: React.ReactNode;
  tradeoffs: React.ReactNode;
  ask: React.ReactNode;
}

export default function RemoteAccessApproachesGuidePage() {
  const approaches: Approach[] = [
    {
      id: "vpn",
      name: "VPN into the customer network",
      how: (
        <>
          A virtual private network creates an encrypted tunnel from the service engineer&apos;s
          device onto the customer&apos;s own network, broadly as though it were plugged in on
          site.
        </>
      ),
      fit: (
        <>
          Fits a customer who already runs VPN infrastructure and wants to extend their existing
          network boundary to a remote vendor rather than set up something separate.
        </>
      ),
      tradeoffs: (
        <>
          Once connected, what the session can reach depends entirely on how the customer has
          segmented their own network, which can be considerably more than the one machine being
          serviced. Its security also depends on how well the customer maintains the VPN
          infrastructure itself, not just on the connection being encrypted.
        </>
      ),
      ask: (
        <>
          What does this connection actually reach once established? Is access scoped per visit,
          or left available continuously? Does connecting require more than a password?{" "}
          <a href={CISA_EXPOSURE_URL} target="_blank" rel="noopener noreferrer" className={link}>
            CISA&apos;s guidance
          </a>{" "}
          recommends routing necessary remote access through a secure gateway or centrally
          managed access solution, rather than connecting directly to a controller, HMI or RTU.
        </>
      ),
    },
    {
      id: "remote-support",
      name: "Remote support tools",
      how: (
        <>
          Screen-sharing or remote-desktop style software lets a technician view and control a
          specific device or interface for a session, usually started from the device being
          supported rather than from a standing network connection.
        </>
      ),
      fit: (
        <>
          Fits occasional, software or interface-level troubleshooting where the issue is visible
          on a screen rather than something that needs deep network-level access.
        </>
      ),
      tradeoffs: (
        <>
          Session-based tools are often easier to bound, since a session has a clear start and
          end, but they vary widely in whether the session is logged, whether it requires the
          customer to approve each connection, and whether the underlying traffic is still routed
          over the open internet.
        </>
      ),
      ask: (
        <>
          Is each session customer-initiated, or can a connection be made unprompted? Is the
          session logged, and for how long is that log kept? Does the tool require explicit
          approval for each connection, or once granted does it stay open?
        </>
      ),
    },
    {
      id: "jump-host",
      name: "Jump hosts",
      how: (
        <>
          Also called a bastion host, a jump host is a single hardened system placed between the
          outside connection and the OT network. Anyone connecting remotely reaches the jump host
          first, and only from there can reach specific systems behind it.
        </>
      ),
      fit: (
        <>
          Fits a customer with several vendors or systems needing occasional access, who wants one
          controlled, logged point of entry rather than many separate direct connections.
        </>
      ),
      tradeoffs: (
        <>
          Centralizing access and logging in one place is the main strength, but it also makes
          that single host the one thing standing between the outside and the OT network, so it
          has to be kept current and tightly configured itself.
        </>
      ),
      ask: (
        <>
          Is access to the jump host itself behind multi-factor authentication? Are sessions
          through it logged and reviewed? Who else uses the same jump host to reach the same
          systems?
        </>
      ),
    },
    {
      id: "zero-trust",
      name: "Cloud zero-trust access",
      how: (
        <>
          Rather than extending a network perimeter the way a VPN does, this approach verifies the
          identity of the specific user and device for each individual connection to a specific
          resource, without treating any network location as automatically trusted. {" "}
          <a href={NIST_ZERO_TRUST_URL} target="_blank" rel="noopener noreferrer" className={link}>
            NIST SP 800-207
          </a>{" "}
          describes this general model, &ldquo;Zero Trust Architecture,&rdquo; in detail.
        </>
      ),
      fit: (
        <>
          Fits a customer managing access for several vendors who wants one managed service
          brokering tightly scoped access to each specific machine or task, rather than operating
          separate VPN tunnels or jump hosts per vendor.
        </>
      ),
      tradeoffs: (
        <>
          Scoping access this precisely usually depends on a cloud-hosted broker sitting outside
          the customer&apos;s own network, which some customers are comfortable with and others are
          not, depending on their own policies about where access-control decisions happen.
        </>
      ),
      ask: (
        <>
          Where does the access-control decision actually happen, and who operates that service?
          Can access be scoped to exactly one machine, or does a connection still reach more of the
          network once established?
        </>
      ),
    },
    {
      id: "ot-gateway",
      name: "OT gateway-based access",
      how: (
        <>
          A dedicated gateway device sits at the edge of the OT network, terminating the remote
          connection there rather than letting it continue onto the OT network itself, often as
          part of a segmented architecture of the kind{" "}
          <a href={NIST_OT_SECURITY_URL} target="_blank" rel="noopener noreferrer" className={link}>
            NIST SP 800-82 Revision 3
          </a>{" "}
          describes for operational technology environments generally.
        </>
      ),
      fit: (
        <>
          Fits a machine builder or integrator who wants a purpose-built device dedicated to this
          one job, installed at the machine itself, rather than relying on the customer&apos;s
          general-purpose network infrastructure.
        </>
      ),
      tradeoffs: (
        <>
          Having a device the machine builder specifically controls can give clearer certainty
          about scope, but it also adds a device the customer has to accept installing, and that
          the builder has to keep patched and maintained over the machine&apos;s life.
        </>
      ),
      ask: (
        <>
          What exactly can this gateway reach once connected, just this one machine, or more of
          the surrounding network? Who is responsible for patching and maintaining the gateway
          device itself, for how long?
        </>
      ),
    },
    {
      id: "hardware-enforced",
      name: "Hardware-enforced access",
      how: (
        <>
          Access is gated by a physical control rather than a purely software one, such as a
          switch or key that must be deliberately engaged on-site before a remote connection can
          reach the machine at all, sometimes paired with a one-directional gateway for a
          monitoring-only path, a pattern{" "}
          <a href={NIST_OT_SECURITY_URL} target="_blank" rel="noopener noreferrer" className={link}>
            NIST SP 800-82 Revision 3
          </a>{" "}
          also describes.
        </>
      ),
      fit: (
        <>
          Fits the highest-sensitivity machines or processes, where the customer wants a physical,
          not just logical, guarantee that remote access cannot reach the equipment unless someone
          on site has deliberately allowed it.
        </>
      ),
      tradeoffs: (
        <>
          A physical control is harder to bypass through a purely software compromise, which is
          its main strength, but it also means remote access depends on someone being physically
          present to enable it, which can add to{" "}
          <Link href="/roi-calculator" className={link}>the cost of delay</Link> during an
          urgent incident.
        </>
      ),
      ask: (
        <>
          Who on site is responsible for engaging the physical control, and what happens if
          they&apos;re not available when access is needed? Does monitoring continue even while
          the two-way connection is disabled?
        </>
      ),
    },
  ];

  return (
    <main data-screen-label="Remote access approaches guide">
      <GuideStructuredData
        headline={H1}
        path="/guides/remote-access-approaches"
        datePublished={LAST_UPDATED_ISO}
        dateModified={LAST_UPDATED_ISO}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: H1, path: "/guides/remote-access-approaches" },
        ]}
      />
      <section>
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-3 text-[#1a1d22]">
            {H1}
          </h1>
          <p className="text-[13px] leading-[1.7] text-[#3f4b52] mb-6">Last updated: {LAST_UPDATED_DISPLAY}</p>

          <p className={p}>
            There are several common approaches to connecting remotely to a machine, each with a
            different shape of trade-off. None of them is universally the right answer; which one
            fits depends on what the connection needs to reach, how often it&apos;s used, and what
            the customer&apos;s own network already looks like.
          </p>

          {approaches.map((a) => (
            <div key={a.id}>
              <h2 className={h2}>{a.name}</h2>
              <h3 className={h3}>How it works</h3>
              <p className={p}>{a.how}</p>
              <h3 className={h3}>Where it fits</h3>
              <p className={p}>{a.fit}</p>
              <h3 className={h3}>Trade-offs</h3>
              <p className={p}>{a.tradeoffs}</p>
              <h3 className={h3}>What to ask</h3>
              <p className={p}>{a.ask}</p>
            </div>
          ))}

          <h2 className={h2}>Related guides</h2>
          <p className={p}>
            <Link href="/guides/iec-62443-remote-access" className={link}>
              IEC 62443 and remote access for machine builders
            </Link>{" "}
            and{" "}
            <Link href="/remote-access-check" className={link}>
              the remote access situation check
            </Link>
            , which walks through how you connect today without naming or favoring any of the
            approaches above.
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
