import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";

// 2026-10-19 audit finding: this page was missing the noindex gate every
// other OT page has, so it was indexable even while the rest of the site
// was in preview. Fixed for consistency with lib/site-config.ts's single
// flag controlling all OT-page indexability.
export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How this site collects, uses, and protects personal data, for both the OT cybersecurity resource and the legacy EUDR/PLM/Battery Passport marketplace.",
  path: "/privacy",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const h2 = "font-sans font-semibold text-[26px] leading-[1.2] tracking-[-0.02em] mt-16 mb-4 text-[#1a1d22]";
const p = "text-[16px] leading-[1.7] text-[#3f4b52] mb-4";
const link = "text-[#9a3412] font-semibold";
const ul = "list-disc pl-6 mb-4 grid gap-1.5 text-[16px] leading-[1.7] text-[#3f4b52]";

export default function PrivacyPolicyPage() {
  return (
    <main data-screen-label="Privacy Policy">
      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-20">
          <h1 className="font-sans font-semibold text-[clamp(32px,4.4vw,44px)] leading-[1.1] tracking-[-0.03em] mb-3 text-[#1a1d22]">
            Privacy Policy
          </h1>
          <p className="text-[15px] text-[#3f4b52] mb-14">Last updated: 19 October 2026</p>

          <h2 className={`${h2} mt-0`}>1. Who we are</h2>
          <p className={p}>
            This site (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) is operated by
            Johannes Cornelis de Boer, an individual based in Copenhagen, Denmark. This site is not
            currently a registered company; the data controller for the purposes of this policy is
            Johannes Cornelis de Boer personally.
          </p>
          <p className={p}>
            This site currently operates two separate services under the same controller: an OT
            cybersecurity enquiry resource, described in Sections 2 to 9 below, and a legacy
            software-matchmaking marketplace for EUDR, Fashion PLM, and Battery Passport software,
            kept live for existing partners and in-progress submissions and described separately in
            Section 10.
          </p>
          <p className={p}>
            Contact:{" "}
            <a href="mailto:info@softwarelantern.com" className={link}>info@softwarelantern.com</a>
          </p>
          <p className={p}>
            If this site becomes operated by a registered legal entity in the future, this policy
            will be updated to reflect the new controller.
          </p>

          <h2 id="ot-service" className={h2}>2. What this site does</h2>
          <p className={p}>
            This is a content and enquiry resource about industrial cybersecurity: secure remote
            access to machines and OT systems, and the NIS2/Cyberbeveiligingswet, Cyber Resilience
            Act, and Machinery Regulation obligations that affect machine builders, factory and
            plant operators, and system integrators in the Netherlands, Belgium, and Luxembourg. If
            you submit an enquiry, we review it personally. We do not share your details with any
            other company unless we ask you about that specific company first and you agree. See
            Section 10 for the separate, differently-run marketplace this site also operates.
          </p>

          <h2 className={h2}>3. What personal data we collect</h2>
          <p className={p}><strong>a) If you submit an OT cybersecurity enquiry:</strong></p>
          <ul className={ul}>
            <li>Name, work email address, company name, and phone number if provided</li>
            <li>Role, country (Netherlands, Belgium, Luxembourg, or other), and sector</li>
            <li>
              Whether you identify as a machine builder, operator, or system integrator, your
              current remote-access approach if provided, your timeline, any free-text details, and
              your answers to the scope checker if you used it
            </li>
          </ul>
          <p className={p}><strong>b) If you submit a legacy marketplace requirements form (buyer):</strong></p>
          <ul className={ul}>
            <li>Name, company name, work email address, phone number</li>
            <li>Details of your software requirement (current vendor, budget range, timeline, and answers to the requirements questionnaire)</li>
          </ul>
          <p className={p}><strong>c) If you have a legacy marketplace partner account:</strong></p>
          <ul className={ul}>
            <li>Company name, contact email address</li>
            <li>Account authentication data (via our authentication provider, Supabase)</li>
            <li>Payment-related data when you unlock a lead (processed by Stripe; we do not store your card details ourselves)</li>
          </ul>
          <p className={p}><strong>d) Automatically collected data:</strong></p>
          <ul className={ul}>
            <li>Basic technical data needed to operate the site and prevent abuse</li>
            <li>Bot-verification signals via Cloudflare Turnstile when you submit a form</li>
          </ul>
          <p className={p}>We do not knowingly collect any personal data beyond what is described above.</p>

          <h2 className={h2}>4. Why we collect it and our legal basis (GDPR)</h2>
          <div className="overflow-x-auto mb-4 -mx-1">
            <table className="w-full text-left border-collapse text-[15px]">
              <thead>
                <tr className="border-b border-[#3f4b52]/[0.2]">
                  <th className="py-2.5 px-1 font-semibold text-[#1a1d22]">Purpose</th>
                  <th className="py-2.5 px-1 font-semibold text-[#1a1d22]">Data used</th>
                  <th className="py-2.5 px-1 font-semibold text-[#1a1d22]">Legal basis</th>
                </tr>
              </thead>
              <tbody className="text-[#3f4b52]">
                <tr className="border-b border-[#3f4b52]/[0.15] align-top">
                  <td className="py-2.5 px-1">
                    Reviewing your OT cybersecurity enquiry and, only if you separately agree,
                    sharing it with a specific named company
                  </td>
                  <td className="py-2.5 px-1">Enquiry form data</td>
                  <td className="py-2.5 px-1">Consent (given when you submit the form, and again before any specific sharing)</td>
                </tr>
                <tr className="border-b border-[#3f4b52]/[0.15] align-top">
                  <td className="py-2.5 px-1">
                    Reviewing and, where appropriate, publishing your legacy marketplace software
                    requirement to relevant partners
                  </td>
                  <td className="py-2.5 px-1">Requirements form data</td>
                  <td className="py-2.5 px-1">Consent / performance of a service you requested</td>
                </tr>
                <tr className="border-b border-[#3f4b52]/[0.15] align-top">
                  <td className="py-2.5 px-1">Operating your legacy marketplace partner account and processing lead unlocks</td>
                  <td className="py-2.5 px-1">Partner account and payment data</td>
                  <td className="py-2.5 px-1">Performance of a contract (partner terms)</td>
                </tr>
                <tr className="border-b border-[#3f4b52]/[0.15] align-top">
                  <td className="py-2.5 px-1">Preventing spam and fraudulent submissions</td>
                  <td className="py-2.5 px-1">Bot-verification signals</td>
                  <td className="py-2.5 px-1">Legitimate interest (keeping the service usable and trustworthy)</td>
                </tr>
                <tr className="align-top">
                  <td className="py-2.5 px-1">Communicating with you about your submission or account</td>
                  <td className="py-2.5 px-1">Contact details</td>
                  <td className="py-2.5 px-1">Legitimate interest / performance of a service you requested</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={p}>
            You may withdraw consent at any time by contacting{" "}
            <a href="mailto:info@softwarelantern.com" className={link}>info@softwarelantern.com</a>;
            this does not affect the lawfulness of anything already done based on consent given
            earlier.
          </p>

          <h2 className={h2}>5. Who we share data with</h2>
          <p className={p}>We do not sell personal data. We share it only as follows:</p>
          <ul className={ul}>
            <li>
              <strong>OT cybersecurity enquiries:</strong> we do not share your details with any
              other company automatically. If, after reviewing your enquiry, we think a specific
              company might be relevant, we will ask you about that company by name and only share
              your details if you agree, every time, for every company. Nothing is shared by
              default.
            </li>
            <li>
              <strong>Legacy marketplace only. Software providers (partners):</strong> if you
              submit a marketplace buyer requirements form, an anonymized summary (your requirement,
              budget range, timeline, industry) may be shown to relevant partners. Your name,
              company name, email, and phone number are only revealed to a partner after they choose
              to unlock your specific submission, a paid action on their part.
            </li>
          </ul>
          <p className={p}><strong>Service providers who process data on our behalf</strong>, under their own data processing terms:</p>
          <ul className={ul}>
            <li><strong>Supabase</strong> (database hosting and authentication)</li>
            <li><strong>Stripe</strong> (payment processing for legacy marketplace lead unlocks)</li>
            <li><strong>Vercel</strong> (website hosting)</li>
            <li><strong>Cloudflare</strong> (domain, DNS, bot-verification/Turnstile, and email routing)</li>
            <li><strong>Resend</strong> (sending internal notification emails to us about new submissions)</li>
          </ul>
          <p className={p}><strong>Legal requirements:</strong> we may disclose data if required by law, court order, or to protect the rights, property, or safety of this site&apos;s operator, our users, or others.</p>
          <p className={p}>
            Some of these providers are based in or process data in the United States. Where this
            occurs, we rely on their published data processing agreements and Standard Contractual
            Clauses (or equivalent safeguards) to ensure your data remains protected in line with
            GDPR requirements.
          </p>

          <h2 className={h2}>6. How long we keep your data</h2>
          <ul className={ul}>
            <li><strong>OT cybersecurity enquiries:</strong> kept for as long as needed to review and, if applicable, act on your enquiry, and for a reasonable period afterward for record-keeping, unless you ask us to delete it sooner.</li>
            <li><strong>Legacy marketplace buyer submissions:</strong> kept for as long as needed to complete the matchmaking process, and for a reasonable period afterward, unless you ask us to delete it sooner.</li>
            <li><strong>Legacy marketplace partner account data:</strong> kept for as long as the account is active, plus a reasonable period afterward for accounting and legal purposes.</li>
            <li><strong>Payment records:</strong> retained as required by Stripe and applicable tax/accounting law.</li>
          </ul>
          <p className={p}>
            If you&apos;d like your data deleted sooner, contact{" "}
            <a href="mailto:info@softwarelantern.com" className={link}>info@softwarelantern.com</a>{" "}
            and we will action this unless we have a legal obligation to retain it.
          </p>

          <h2 className={h2}>7. Your rights</h2>
          <p className={p}>If you are in the EU/EEA (or another jurisdiction with similar protections), you have the right to:</p>
          <ul className={ul}>
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Restrict or object to certain processing</li>
            <li>Request a copy of your data in a portable format</li>
            <li>Withdraw consent at any time (where processing is based on consent)</li>
            <li>
              Lodge a complaint with a supervisory authority. In Denmark, this is the{" "}
              <strong>Datatilsynet</strong> (Danish Data Protection Agency),{" "}
              <a href="https://www.datatilsynet.dk" target="_blank" rel="noopener noreferrer" className={link}>
                datatilsynet.dk
              </a>
            </li>
          </ul>
          <p className={p}>
            To exercise any of these rights, contact{" "}
            <a href="mailto:info@softwarelantern.com" className={link}>info@softwarelantern.com</a>.
          </p>

          <h2 className={h2}>8. Is this free to use?</h2>
          <p className={p}>
            Submitting an OT cybersecurity enquiry is free, with no payment or obligation at any
            point. Submitting a software requirement as a legacy marketplace buyer is also free;
            that marketplace generates revenue from software providers (partners) who pay to unlock
            qualified buyer contact details.
          </p>

          <h2 className={h2}>9. Cookies and similar technologies</h2>
          <p className={p}>We use only the minimum technical cookies/local mechanisms needed to operate the site, including:</p>
          <ul className={ul}>
            <li>Authentication session cookies (via Supabase) if you have a legacy marketplace partner account</li>
            <li>Bot-verification tokens (via Cloudflare Turnstile) when submitting a form</li>
          </ul>
          <p className={p}>We do not currently use advertising or third-party tracking cookies.</p>

          <h2 className={h2}>10. The legacy software-matchmaking marketplace</h2>
          <p className={p}>
            Before this site became an OT cybersecurity resource, it operated as a matchmaking
            marketplace connecting buyers of EUDR, Fashion PLM, and Battery Passport software with
            software providers. That marketplace&apos;s pages are no longer linked from this
            site&apos;s navigation but remain reachable, unindexed, so that anyone with an existing
            link, including the providers who registered as partners, can still use them. We
            continue to: store and act on already-submitted buyer requirement forms; operate partner
            accounts, including reviewing pending applications; process lead-unlock payments via
            Stripe for partners who already have accounts; and honor every right described in
            Sections 6 to 7 above for anyone whose data was collected through this marketplace. We
            will update this section if and when that data is fully wound down.
          </p>

          <h2 className={h2}>11. Children&apos;s privacy</h2>
          <p className={p}>
            This site is business-to-business and is not directed at, or intended for use by,
            children. We do not knowingly collect personal data from anyone under 16.
          </p>

          <h2 className={h2}>12. Changes to this policy</h2>
          <p className={p}>
            We may update this policy from time to time, for example as the services or our data
            processing partners change. The &ldquo;Last updated&rdquo; date at the top will reflect
            the most recent revision. Material changes will be reflected here; we encourage you to
            review this page periodically.
          </p>

          <h2 className={h2}>13. Contact us</h2>
          <p className={p}>For any questions about this policy or how your data is handled, contact:</p>
          <p className={`${p} mb-1`}><strong>Johannes Cornelis de Boer</strong></p>
          <p className={`${p} mb-1`}>Copenhagen, Denmark</p>
          <p className={p}>
            <a href="mailto:info@softwarelantern.com" className={link}>info@softwarelantern.com</a>
          </p>

          <hr className="border-[#3f4b52]/[0.2] my-10" />
          <p className="text-[14px] leading-[1.7] text-[#3f4b52] italic">
            This policy describes this site&apos;s actual data practices as of the date above, for
            both services it currently operates. It is provided as a good-faith, accurate
            description, but has not been reviewed by a lawyer. A professional legal review is
            recommended before treating this as final, especially given the two different services
            and data flows described above.
          </p>
        </div>
      </section>
    </main>
  );
}
