import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";

// 2026-10-19 audit finding: this page was missing the noindex gate every
// other OT page has, so it was indexable even while the rest of the site
// was in preview. Fixed for consistency with lib/site-config.ts's single
// flag controlling all OT-page indexability.
export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How this site collects, uses, and protects personal data when you use its tools, request a file, or send an enquiry.",
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
          <p className="text-[15px] text-[#3f4b52] mb-14">Last updated: 21 October 2026</p>

          <h2 className={`${h2} mt-0`}>1. Who we are</h2>
          <p className={p}>
            This site (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) is operated by
            Software Lantern, Copenhagen, Denmark,{" "}
            <a href="mailto:info@softwarelantern.com" className={link}>info@softwarelantern.com</a>,
            which is the data controller for the purposes of this policy. Software Lantern is not
            currently a registered company.
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
            other company unless we ask you about that specific company first and you agree.
          </p>

          <h2 className={h2}>3. What personal data we collect</h2>
          <p className={p}><strong>a) If you submit an OT cybersecurity enquiry:</strong></p>
          <ul className={ul}>
            <li>Name, work email address, and company name</li>
            <li>Role, and what your remote access to machines looks like today, if you tell us</li>
            <li>
              Your answers to the scope checker if you used it: country (Netherlands, Belgium,
              Luxembourg, or other), whether you identify as a machine builder, operator, or system
              integrator, company size, and remote-access status
            </li>
            <li>
              Your answers to the remote access situation check if you used it: how you connect to
              machines today, who decides when access is on, whether accounts are named or shared,
              whether sessions are logged, whether multi-factor authentication is used, what a
              connection can reach, how often customers ask about this, and, if you choose to
              answer it, the optional eighth question of what prompted the review (for example, a
              customer questionnaire, an internal initiative, an incident, replacing or upgrading
              your remote access, or just learning)
            </li>
            <li>
              If you request the country report: your country, role, sector, number of sites or
              machines, who approves access, whether sessions are logged and for how long, your
              incident process, how many customer questionnaires you receive per year, and your
              timeline to act
            </li>
            <li>
              If you use the ROI calculator and choose to email yourself the result: the euro
              figures and estimates you entered into the calculator
            </li>
            <li>
              If you use the scope checker or the remote access situation check and choose
              &ldquo;email me a copy&rdquo; of your brief or review sheet, instead of (or as well
              as) sending a full enquiry: name, work email address, company name, and the same
              checker or remote-access answers listed above
            </li>
          </ul>
          <p className={p}><strong>b) If you request the customer security questionnaire pack, the vendor comparison checklist, or the regional report (Belgium and the Netherlands) PDF:</strong></p>
          <ul className={ul}>
            <li>Name, work email address, and company name</li>
            <li>For the regional report only: your role and project timing, both optional, if you tell us</li>
          </ul>
          <p className={p}><strong>c) Automatically collected data:</strong></p>
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
                    Sending you the questionnaire pack, vendor comparison checklist, or regional
                    report PDF you requested, and, only if you separately agree, sharing your
                    enquiry with a specific named company
                  </td>
                  <td className="py-2.5 px-1">Name, work email, company name, and, for the regional report, your role and timing if given</td>
                  <td className="py-2.5 px-1">Consent (given when you submit the form)</td>
                </tr>
                <tr className="border-b border-[#3f4b52]/[0.15] align-top">
                  <td className="py-2.5 px-1">
                    Emailing you the ROI calculation or country report you generated, and, only if
                    you separately agree, sharing your enquiry with a specific named company
                  </td>
                  <td className="py-2.5 px-1">Name, work email, company name, and the figures or answers you entered</td>
                  <td className="py-2.5 px-1">Consent (given when you submit the form)</td>
                </tr>
                <tr className="border-b border-[#3f4b52]/[0.15] align-top">
                  <td className="py-2.5 px-1">
                    Emailing you a copy of the scope-checker brief or remote-access review sheet
                    you generated
                  </td>
                  <td className="py-2.5 px-1">Name, work email, company name, and the checker or remote-access answers you entered</td>
                  <td className="py-2.5 px-1">Consent (given when you submit the form)</td>
                </tr>
                <tr className="border-b border-[#3f4b52]/[0.15] align-top">
                  <td className="py-2.5 px-1">Preventing spam and fraudulent submissions</td>
                  <td className="py-2.5 px-1">Bot-verification signals</td>
                  <td className="py-2.5 px-1">Legitimate interest (keeping the service usable and trustworthy)</td>
                </tr>
                <tr className="align-top">
                  <td className="py-2.5 px-1">Communicating with you about your submission</td>
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
          </ul>
          <p className={p}><strong>Service providers who process data on our behalf</strong>, under their own data processing terms:</p>
          <ul className={ul}>
            <li><strong>Supabase</strong> (database hosting)</li>
            <li><strong>Vercel</strong> (website hosting)</li>
            <li>
              <strong>Vercel Web Analytics</strong> (usage analytics): measures page views and a
              small number of named events (for example, that the scope checker or remote access
              situation check was started, viewed its result, downloaded or copied it, requested
              an emailed copy, or clicked through to talk it through; that an enquiry was started
              or sent; or that the regional report page was viewed or its PDF requested), without
              cookies. These events carry only the name of the step and
              a broad result category, never your name, email, or typed answers, with one
              exception: if you answer the remote access situation check&apos;s optional eighth
              question (what prompted the review), that category alone (for example,
              &ldquo;incident&rdquo;) is included, never any of the other seven answers. It never
              receives anything you type into a form, such as your name, email, or free-text
              answers.
            </li>
            <li><strong>Cloudflare</strong> (domain, DNS, bot-verification/Turnstile, and email routing)</li>
            <li><strong>Resend</strong> (sending notification emails to us about new submissions, and sending you the results or copies you ask us to email you)</li>
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
            point.
          </p>

          <h2 className={h2}>9. Cookies and similar technologies</h2>
          <p className={p}>We use only the minimum technical cookies/local mechanisms needed to operate the site, including:</p>
          <ul className={ul}>
            <li>Bot-verification tokens (via Cloudflare Turnstile) when submitting a form</li>
            <li>
              Your scope-checker and remote-access situation check answers, each held separately
              in your browser&apos;s session storage so they can be shown back to you on the
              enquiry form, and so the free brief or review sheet can be rebuilt if you leave and
              come back in the same browser session. This never leaves your browser as a cookie,
              URL parameter, or analytics event, and clears itself when you close the tab. It only
              leaves your browser if you choose to send an enquiry, request &ldquo;email me a
              copy,&rdquo; or request the country report, as described above
            </li>
          </ul>
          <p className={p}>
            Vercel Web Analytics (see Section 5) does not use cookies; it identifies visits using a
            hash generated from each request instead, discarded after 24 hours.
          </p>
          <p className={p}>We do not currently use advertising or third-party tracking cookies.</p>

          <h2 className={h2}>10. Children&apos;s privacy</h2>
          <p className={p}>
            This site is business-to-business and is not directed at, or intended for use by,
            children. We do not knowingly collect personal data from anyone under 16.
          </p>

          <h2 className={h2}>11. Changes to this policy</h2>
          <p className={p}>
            We may update this policy from time to time, for example as the services or the
            service providers we use change. The &ldquo;Last updated&rdquo; date at the top will
            reflect the most recent revision. Material changes will be reflected here; we encourage you to
            review this page periodically.
          </p>

          <h2 className={h2}>12. Contact us</h2>
          <p className={p}>For any questions about this policy or how your data is handled, contact:</p>
          <p className={`${p} mb-1`}><strong>Software Lantern</strong></p>
          <p className={`${p} mb-1`}>Copenhagen, Denmark</p>
          <p className={p}>
            <a href="mailto:info@softwarelantern.com" className={link}>info@softwarelantern.com</a>
          </p>

          <hr className="border-[#3f4b52]/[0.2] my-10" />
          <p className="text-[14px] leading-[1.7] text-[#3f4b52] italic">
            This policy describes this site&apos;s actual data practices as of the date above. It is
            provided as a good-faith, accurate description, but has not been reviewed by a lawyer. A
            professional legal review is recommended before treating this as final.
          </p>
        </div>
      </section>
    </main>
  );
}
