import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import {
  SwatchIcon,
  ChecklistIcon,
  DocumentIcon,
  PeopleIcon,
  ChatIcon,
  TagIcon,
  CalendarIcon,
  FlagIcon,
  PlugIcon,
  CubeIcon,
  LayersIcon,
  BuildingIcon,
} from "@/components/icons";

function IconCard({
  icon,
  title,
  children,
  accent = "#4f46e5",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div>
      <span
        className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
        style={{ background: `${accent}1a`, color: accent }}
      >
        {icon}
      </span>
      <h3 className="font-sans font-semibold text-[19px] mb-[7px]">{title}</h3>
      <p className="text-[15px] leading-[1.6] text-[#5c6573]">{children}</p>
    </div>
  );
}

export const metadata: Metadata = pageMetadata({
  title: "Fashion PLM Software | Compare Providers & Get Matched",
  description:
    "Looking for fashion PLM software? Tell us about your brand, products and requirements, and we'll connect you with up to 3 fashion PLM providers that believe they can help.",
  path: "/plm",
  ogDescription:
    "Tell us about your brand, products and requirements, and we'll connect you with up to 3 fashion PLM providers that believe they can help.",
});

const plmHref = `/finder?category=${encodeURIComponent("Product Lifecycle Management (PLM)")}`;

export default function PlmPage() {
  return (
    <main data-screen-label="PLM category page">
      <section className="relative overflow-hidden border-b border-[#0d1117]/[0.07]">
        <div className="absolute -top-[200px] -right-[140px] w-[700px] h-[560px] pointer-events-none bg-[radial-gradient(closest-side,rgba(16,185,129,0.10),rgba(255,255,255,0))]" />
        <div className="relative max-w-[1160px] mx-auto px-5 sm:px-8 pt-10 pb-[88px]">
          <p className="mb-10 text-[14px] text-[#79818f]">
            <Link href="/" className="text-[#4f46e5] font-semibold">
              Home
            </Link>{" "}
            <span className="text-[#c2c8d1]">/</span> Software categories{" "}
            <span className="text-[#c2c8d1]">/</span> Fashion PLM software
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-[72px] items-start">
            <div>
              <h1 className="font-sans font-semibold text-[clamp(34px,5.6vw,58px)] leading-[1.06] tracking-[-0.035em] mb-[22px] text-pretty">
                Looking for fashion PLM software?
              </h1>
              <p className="text-[20px] leading-[1.5] text-[#3d4653] mb-4 max-w-[42ch]">
                Fashion PLM is a crowded market, and the right platform depends on your product
                development workflow, collection complexity, sourcing model and supplier network.
                Comparing every option yourself can take weeks.
              </p>
              <p className="text-[17px] text-[#5c6573] mb-[34px] max-w-[48ch]">
                Tell us about your brand and requirements, and we&apos;ll publish your brief to fashion PLM
                providers in the category. Up to 3 who believe they&apos;re a fit will respond. Not a
                ranked list, and not a guess at which one is objectively best.
              </p>
              <Link
                href={plmHref}
                className="inline-block bg-[#4f46e5] text-white rounded-full px-6 sm:px-8 py-[17px] font-sans font-semibold text-[19px] shadow-[0_6px_18px_rgba(79,70,229,0.28)] hover:bg-[#4338ca]"
              >
                Find my PLM →
              </Link>
              <p className="mt-6 text-[14px] font-semibold text-[#5c6573]">
                Free for buyers · No obligation · Providers respond by email within 24 hours
              </p>
            </div>
            <div
              className="border border-[#0d1117]/[0.08] rounded-2xl p-[30px] pb-[26px]"
              style={{
                backgroundImage:
                  "linear-gradient(160deg, rgba(246,247,251,0.55) 0%, rgba(238,241,248,0.42) 100%), url('/plm-industry-bg.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <p className="mb-[18px] text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
                By industry
              </p>
              <div className="grid">
                {[
                  "Fashion & apparel PLM",
                  "Footwear PLM",
                  "Accessories PLM",
                  "Fashion retail PLM",
                ].map((label, i, arr) => (
                  <Link
                    key={label}
                    href={plmHref}
                    className={`flex justify-between items-center py-[13px] px-3 -mx-3 rounded-lg font-semibold text-[#0d1117] transition-colors duration-150 hover:bg-white/[0.6] hover:text-[#4338ca] focus-visible:bg-white/[0.6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] ${
                      i < arr.length - 1 ? "border-b border-[#0d1117]/[0.07]" : ""
                    }`}
                  >
                    {label} <span className="text-[#4338ca]">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-21">
          <div className="max-w-[860px]">
            <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-4">
              What is fashion PLM software?
            </h2>
            <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-3">
              Fashion PLM (Product Lifecycle Management) software is the system fashion and apparel
              companies use to manage a product from first sketch to shipped order: tech packs, bills of
              materials, sampling, supplier collaboration, costing, and collection calendars, all in one
              place instead of spreadsheets and email. It differs meaningfully from generic PLM used in
              industries like automotive or industrial manufacturing. Fashion-specific platforms are
              built around seasons, colourways, sizing, and fast-moving supplier networks rather than
              long, fixed product cycles.
            </p>
            <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-3">
              Which platform fits best depends on your collection complexity, SKU count, and sourcing
              model: a small direct-to-consumer brand usually needs a lighter tool than a multi-brand
              group coordinating dozens of supplier relationships across several product categories.
            </p>
            <p className="text-[17px] leading-[1.6] text-[#3d4653]">
              If your sourcing involves EUDR-relevant materials (leather, rubber, or other regulated
              commodities), you may also want{" "}
              <Link href="/eudr" className="text-[#4f46e5] font-semibold">
                EUDR compliance software
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-21">
          <div className="max-w-[860px] mb-14">
            <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-4">
              How to choose fashion PLM software
            </h2>
            <p className="text-[17px] leading-[1.6] text-[#3d4653]">
              No single vendor can neutrally tell you how it compares to its competitors. Here&apos;s what
              we&apos;d suggest evaluating yourself, and why each factor matters, whether or not you use
              Software Lantern to do it.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-9">
            <IconCard icon={<SwatchIcon />} title="Materials & trim library">
              Fashion products are defined as much by fabric and trim choices as by silhouette. Check
              whether the platform tracks material, colour, and trim history across multiple seasons, and
              whether you can see who approved a given material and when.
            </IconCard>
            <IconCard icon={<ChecklistIcon />} title="Bill of materials (BOM) management" accent="#047857">
              A BOM that has to be rebuilt from scratch each season, instead of copied and adjusted for a
              new colourway or size run, costs real time every cycle. Ask how many steps it takes to
              create a new colourway&apos;s BOM from an existing style.
            </IconCard>
            <IconCard icon={<DocumentIcon />} title="Tech pack generation & versioning">
              Outdated tech packs reaching a factory are a common cause of costly production mistakes. A
              platform should keep a live, versioned tech pack that factories see the same copy of, not a
              static file that goes stale the moment a spec changes.
            </IconCard>
            <IconCard icon={<PeopleIcon />} title="Supplier & factory collaboration" accent="#047857">
              Whether suppliers and factories can log in and comment, upload, and respond directly, or
              everything routes back through your team, changes how much of your team&apos;s time goes
              into relaying messages instead of managing exceptions.
            </IconCard>
            <IconCard icon={<ChatIcon />} title="Sampling & approval tracking">
              Sampling is usually the most iterative, back-and-forth part of development. A platform
              should keep the full comment and approval history for a sample across multiple revision
              rounds, not just the latest version.
            </IconCard>
            <IconCard icon={<TagIcon />} title="Costing & margin visibility" accent="#047857">
              Costing that&apos;s disconnected from the BOM means margin surprises show up after decisions
              are already made. Check whether a material substitution automatically recalculates the
              costed BOM or requires manual re-entry.
            </IconCard>
            <IconCard icon={<CalendarIcon />} title="Season & collection planning">
              Most fashion brands work on more than one season or collection at once, including carryover
              styles. A tool that only handles one cleanly forces workarounds.
            </IconCard>
            <IconCard icon={<FlagIcon />} title="Critical path & milestone tracking" accent="#047857">
              Missed calendar deadlines are one of the most expensive failure modes in fashion production,
              since they can push delivery past a selling window. Check how a missed milestone is actually
              flagged and who gets notified.
            </IconCard>
            <IconCard icon={<PlugIcon />} title="ERP / order management integration">
              Without a real integration, your team ends up re-entering the same style and material data
              in two systems. Ask for the specific data fields that sync, not just the names of the ERP
              systems a provider claims to support.
            </IconCard>
            <IconCard icon={<CubeIcon />} title="3D design tool integration" accent="#047857">
              3D-to-PLM workflows can meaningfully cut physical sampling, but only if the integration is
              genuinely two-way. Confirm whether changes made in the 3D tool sync back into the PLM record
              automatically or need to be re-entered.
            </IconCard>
            <IconCard icon={<LayersIcon />} title="Multi-brand / multi-label scalability">
              If you run more than one brand or label, check whether each can have its own workflow,
              approval chain, and branding, or whether everything is forced through one shared setup. A
              platform that only really works well for a single brand often becomes a bottleneck once
              you&apos;re managing more than one.
            </IconCard>
            <IconCard icon={<BuildingIcon />} title="Company size fit" accent="#047857">
              A platform built for a multi-brand enterprise is usually more complexity, and more cost,
              than a small or growing brand needs yet. Conversely, a tool sized for a single small brand
              can become a bottleneck for a business coordinating several labels at once.
            </IconCard>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f7fb] border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-21">
          <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-11 max-w-[24ch]">
            What your brief will cover
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
            {[
              [<DocumentIcon key="i" />, "Product development", "Line planning, seasonal calendars, tech packs and revisions."],
              [<SwatchIcon key="i" />, "BOM & materials", "Bills of materials, libraries, colourways and component data."],
              [<PeopleIcon key="i" />, "Supplier collaboration", "Sampling rounds, comments and approvals with factories."],
              [<TagIcon key="i" />, "Costing & compliance", "Target costing, margins, sustainability and audit trails."],
            ].map(([icon, title, body]) => (
              <div key={title as string} className="bg-white border border-[#0d1117]/[0.08] rounded-2xl p-6">
                <span className="w-9 h-9 rounded-full bg-[#4f46e5]/[0.10] flex items-center justify-center mb-3 text-[#4f46e5]">
                  {icon}
                </span>
                <h3 className="font-sans font-semibold text-[20px] mb-2">{title}</h3>
                <p className="text-[15px] text-[#5c6573]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-21 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-16 items-start">
          <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em]">
            Questions buyers ask us
          </h2>
          <div className="grid gap-[26px]">
            {[
              [
                "How do you choose the three providers?",
                "We publish your brief to providers in the category. Any provider can review it and choose to respond. The providers you hear from are the ones that believe they can meet your requirements, not a ranking we've made.",
              ],
              [
                "How do I choose a fashion PLM system?",
                "Start with your product development workflow and where it breaks down today: tech packs, BOM, supplier collaboration, costing, or all of the above. That's exactly what our questions cover, so your brief reaches providers with enough detail for them to judge their own fit to your workflow and company size, not a generic top-10 list.",
              ],
              [
                "What's the difference between general PLM and fashion PLM?",
                "General PLM, used in industries like automotive and industrial manufacturing, is usually built around long, fixed product cycles. Fashion PLM is built around seasons, colourways, sizing, and fast-moving supplier networks, which is why a generic PLM platform is rarely the right fit for a fashion or apparel business.",
              ],
              [
                "Is it really free?",
                "Yes. Buyers never pay. Software providers pay to be introduced to buyers who are actively looking.",
              ],
              [
                "How long does it take?",
                "The questions take about three minutes. Provider replies arrive by email within 24 hours.",
              ],
              [
                "Do I have to speak to all of them?",
                "No. You choose which providers to talk to, if any. There's no obligation and no sales pressure from us.",
              ],
            ].map(([q, a]) => (
              <div key={q}>
                <h3 className="font-sans font-semibold text-[21px] mb-[7px]">{q}</h3>
                <p className="text-[16px] text-[#3d4653]">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 pt-19 pb-25">
          <div className="bg-[#eef1f8] rounded-2xl p-7 sm:p-14 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <h2 className="font-sans font-semibold text-[clamp(27px,3.6vw,38px)] leading-[1.1] mb-3">
                Tell us what your PLM needs to do
              </h2>
              <p className="text-[17px] text-[#3d4653] max-w-[46ch]">
                Six questions. Three providers that believe they fit. You decide from there.
              </p>
            </div>
            <Link
              href={plmHref}
              className="justify-self-start lg:justify-self-end bg-[#4f46e5] text-white rounded-full px-6 sm:px-8 py-[17px] font-sans font-semibold text-[18px] whitespace-nowrap hover:bg-[#4338ca]"
            >
              Find my PLM →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
