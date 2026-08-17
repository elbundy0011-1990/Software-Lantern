import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy | Software Lantern",
  description:
    "How Software Lantern collects, uses, and protects personal data for buyers and software providers.",
  path: "/privacy",
});

const h2 = "font-sans font-semibold text-[26px] leading-[1.2] tracking-[-0.02em] mt-16 mb-4";
const p = "text-[16px] leading-[1.7] text-[#3d4653] mb-4";
const link = "text-[#4f46e5] font-semibold";
const ul = "list-disc pl-6 mb-4 grid gap-1.5 text-[16px] leading-[1.7] text-[#3d4653]";

export default function PrivacyPolicyPage() {
  return (
    <main data-screen-label="Privacy Policy">
      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-20">
          <h1 className="font-sans font-semibold text-[clamp(32px,4.4vw,44px)] leading-[1.1] tracking-[-0.03em] mb-3">
            Privacy Policy
          </h1>
          <p className="text-[15px] text-[#79818f] mb-14">Last updated: 16 August 2026</p>

          <h2 className={`${h2} mt-0`}>1. Who we are</h2>
          <p className={p}>
            Software Lantern (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) is operated by
            Johannes Cornelis de Boer, an individual based in Copenhagen, Denmark, trading as Software
            Lantern. Software Lantern is not currently a registered company; the data controller for the
            purposes of this policy is Johannes Cornelis de Boer personally.
          </p>
          <p className={p}>
            Contact:{" "}
            <a href="mailto:info@softwarelantern.com" className={link}>
              info@softwarelantern.com
            </a>
          </p>
          <p className={p}>
            If Software Lantern becomes a registered legal entity in the future, this policy will be
            updated to reflect the new controller.
          </p>

          <h2 className={h2}>2. What Software Lantern does</h2>
          <p className={p}>
            Software Lantern is a matchmaking service. Companies looking for specialized B2B software
            (&ldquo;buyers&rdquo;) tell us what they need via a short requirements form. We may then share
            an anonymized version of that requirement with relevant software providers
            (&ldquo;partners&rdquo;), who can choose to unlock the buyer&apos;s full contact details in
            exchange for payment.
          </p>

          <h2 className={h2}>3. What personal data we collect</h2>
          <p className={p}>
            <strong>a) If you submit a requirements form (buyer):</strong>
          </p>
          <ul className={ul}>
            <li>Name</li>
            <li>Company name</li>
            <li>Work email address</li>
            <li>Phone number</li>
            <li>
              Details of your software requirement (current vendor, budget range, timeline, and answers
              to the requirements questionnaire)
            </li>
          </ul>
          <p className={p}>
            <strong>b) If you sign up as a partner:</strong>
          </p>
          <ul className={ul}>
            <li>Company name</li>
            <li>Contact email address</li>
            <li>Account authentication data (via our authentication provider, Supabase)</li>
            <li>
              Payment-related data when you unlock a lead (processed by Stripe, see Section 5; we do
              not store your card details ourselves)
            </li>
          </ul>
          <p className={p}>
            <strong>c) Automatically collected data:</strong>
          </p>
          <ul className={ul}>
            <li>Basic technical data needed to operate the site and prevent abuse</li>
            <li>Bot-verification signals via Cloudflare Turnstile when you submit a form</li>
          </ul>
          <p className={p}>We do not knowingly collect any personal data beyond what is described above.</p>

          <h2 className={h2}>4. Why we collect it and our legal basis (GDPR)</h2>
          <div className="overflow-x-auto mb-4 -mx-1">
            <table className="w-full text-left border-collapse text-[15px]">
              <thead>
                <tr className="border-b border-[#0d1117]/[0.12]">
                  <th className="py-2.5 px-1 font-semibold text-[#0d1117]">Purpose</th>
                  <th className="py-2.5 px-1 font-semibold text-[#0d1117]">Data used</th>
                  <th className="py-2.5 px-1 font-semibold text-[#0d1117]">Legal basis</th>
                </tr>
              </thead>
              <tbody className="text-[#3d4653]">
                <tr className="border-b border-[#0d1117]/[0.07] align-top">
                  <td className="py-2.5 px-1">
                    Reviewing and, where appropriate, publishing your software requirement to relevant
                    partners
                  </td>
                  <td className="py-2.5 px-1">Requirements form data</td>
                  <td className="py-2.5 px-1">
                    Consent (given when you submit the form) / performance of a service you requested
                  </td>
                </tr>
                <tr className="border-b border-[#0d1117]/[0.07] align-top">
                  <td className="py-2.5 px-1">
                    Operating your partner account and processing lead unlocks
                  </td>
                  <td className="py-2.5 px-1">Partner account and payment data</td>
                  <td className="py-2.5 px-1">Performance of a contract (our partner terms)</td>
                </tr>
                <tr className="border-b border-[#0d1117]/[0.07] align-top">
                  <td className="py-2.5 px-1">Preventing spam and fraudulent submissions</td>
                  <td className="py-2.5 px-1">Bot-verification signals</td>
                  <td className="py-2.5 px-1">
                    Legitimate interest (keeping the service usable and trustworthy)
                  </td>
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
            <a href="mailto:info@softwarelantern.com" className={link}>
              info@softwarelantern.com
            </a>
            ; this does not affect the lawfulness of anything already done based on consent given earlier.
          </p>

          <h2 className={h2}>5. Who we share data with</h2>
          <p className={p}>We do not sell personal data. We share it only as follows:</p>
          <ul className={ul}>
            <li>
              <strong>Software providers (partners):</strong> if you submit a buyer requirements form, an
              anonymized summary (your requirement, budget range, timeline, industry) may be shown to
              relevant partners. Your name, company name, email, and phone number are only revealed to a
              partner after they choose to unlock your specific submission, which is a paid action on
              their part.
            </li>
          </ul>
          <p className={p}>
            <strong>Service providers who process data on our behalf</strong>, under their own data
            processing terms:
          </p>
          <ul className={ul}>
            <li>
              <strong>Supabase</strong> (database hosting and authentication): data may be processed
              outside the EU/EEA depending on project region; Supabase provides GDPR-compliant data
              processing terms and Standard Contractual Clauses where applicable.
            </li>
            <li>
              <strong>Stripe</strong> (payment processing for partner lead unlocks): Stripe acts as an
              independent controller/processor for payment data; see Stripe&apos;s own privacy policy for
              details.
            </li>
            <li>
              <strong>Vercel</strong> (website hosting)
            </li>
            <li>
              <strong>Cloudflare</strong> (domain, DNS, bot-verification/Turnstile, and email routing)
            </li>
          </ul>
          <p className={p}>
            <strong>Legal requirements:</strong> we may disclose data if required by law, court order, or
            to protect the rights, property, or safety of Software Lantern, our users, or others.
          </p>
          <p className={p}>
            Some of these providers are based in or process data in the United States. Where this occurs,
            we rely on their published data processing agreements and Standard Contractual Clauses (or
            equivalent safeguards) to ensure your data remains protected in line with GDPR requirements.
          </p>

          <h2 className={h2}>6. How long we keep your data</h2>
          <ul className={ul}>
            <li>
              <strong>Buyer requirement submissions:</strong> kept for as long as needed to complete the
              matchmaking process, and for a reasonable period afterward for record-keeping, unless you
              ask us to delete it sooner.
            </li>
            <li>
              <strong>Partner account data:</strong> kept for as long as your account is active, plus a
              reasonable period afterward for accounting and legal purposes.
            </li>
            <li>
              <strong>Payment records:</strong> retained as required by Stripe and applicable tax/
              accounting law.
            </li>
          </ul>
          <p className={p}>
            If you&apos;d like your data deleted sooner, contact{" "}
            <a href="mailto:info@softwarelantern.com" className={link}>
              info@softwarelantern.com
            </a>{" "}
            and we will action this unless we have a legal obligation to retain it.
          </p>

          <h2 className={h2}>7. Your rights</h2>
          <p className={p}>
            If you are in the EU/EEA (or another jurisdiction with similar protections), you have the
            right to:
          </p>
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
              <a
                href="https://www.datatilsynet.dk"
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                datatilsynet.dk
              </a>
            </li>
          </ul>
          <p className={p}>
            To exercise any of these rights, contact{" "}
            <a href="mailto:info@softwarelantern.com" className={link}>
              info@softwarelantern.com
            </a>
            .
          </p>

          <h2 className={h2}>8. Is Software Lantern free to use?</h2>
          <p className={p}>
            Submitting a software requirement as a buyer is free. Software Lantern generates revenue from
            software providers (partners) who pay to unlock qualified buyer contact details.
          </p>

          <h2 className={h2}>9. Cookies and similar technologies</h2>
          <p className={p}>
            We use only the minimum technical cookies/local mechanisms needed to operate the site,
            including:
          </p>
          <ul className={ul}>
            <li>Authentication session cookies (via Supabase) if you have a partner account</li>
            <li>Bot-verification tokens (via Cloudflare Turnstile) when submitting a form</li>
          </ul>
          <p className={p}>We do not currently use advertising or third-party tracking cookies.</p>

          <h2 className={h2}>10. Children&apos;s privacy</h2>
          <p className={p}>
            Software Lantern is a business-to-business service and is not directed at, or intended for
            use by, children. We do not knowingly collect personal data from anyone under 16.
          </p>

          <h2 className={h2}>11. Changes to this policy</h2>
          <p className={p}>
            We may update this policy from time to time, for example as the service or our data
            processing partners change. The &ldquo;Last updated&rdquo; date at the top will reflect the
            most recent revision. Material changes will be reflected here; we encourage you to review
            this page periodically.
          </p>

          <h2 className={h2}>12. Contact us</h2>
          <p className={p}>
            For any questions about this policy or how your data is handled, contact:
          </p>
          <p className={`${p} mb-1`}>
            <strong>Johannes Cornelis de Boer (Software Lantern)</strong>
          </p>
          <p className={`${p} mb-1`}>Copenhagen, Denmark</p>
          <p className={p}>
            <a href="mailto:info@softwarelantern.com" className={link}>
              info@softwarelantern.com
            </a>
          </p>

          <hr className="border-[#0d1117]/[0.08] my-10" />

          <p className="text-[14px] leading-[1.7] text-[#79818f] italic">
            This policy describes Software Lantern&apos;s actual data practices as of the date above. It
            is provided as a good-faith, accurate description of the service, but has not been reviewed
            by a lawyer. Given Software Lantern processes personal data of EU residents and payment data
            via Stripe, a professional legal review is recommended before treating this as final,
            especially as the business grows or becomes a registered company.
          </p>
        </div>
      </section>
    </main>
  );
}
