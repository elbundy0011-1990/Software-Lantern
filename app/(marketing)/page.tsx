import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { LeafIcon, ShirtIcon, BatteryIcon, MagnifyingGlassIcon, TargetIcon, HandshakeIcon, TagIcon } from "@/components/icons";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const heroCategories = [
  { label: "EUDR Software", href: "/eudr" },
  { label: "Product Lifecycle Management (PLM)", href: "/plm" },
  { label: "Digital Battery Passport (DBP)", href: "/battery-passport" },
];

export default function HomePage() {
  return (
    <main data-screen-label="Homepage">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#1a2b54_0%,#3730a3_50%,#4f46e5_100%)]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(120% 90% at 25% 0%, #000 10%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(120% 90% at 25% 0%, #000 10%, transparent 78%)",
          }}
        />
        <div className="absolute -top-[180px] -right-[160px] w-[720px] h-[620px] pointer-events-none bg-[radial-gradient(closest-side,rgba(16,185,129,0.28),rgba(79,70,229,0))]" />
        <div className="relative max-w-[1160px] mx-auto px-5 sm:px-8 pt-[104px] pb-24 grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-[72px] items-center">
          <div>
            <h1 className="font-sans font-semibold text-[clamp(38px,6.6vw,66px)] leading-[1.04] tracking-[-0.035em] mb-6 text-white text-pretty">
              Tell us what software you need
            </h1>
            <p className="text-[21px] leading-[1.5] text-white/[0.88] mb-[18px] max-w-[30ch]">
              We&apos;ll connect you with 3 providers that believe they have a solution that fits your needs.
            </p>
            <p className="text-[17px] text-white/[0.66] mb-9 max-w-[42ch]">
              Compare your options, talk to the providers, and choose the one that&apos;s right for your business.
            </p>
            <div className="flex flex-wrap items-center gap-[14px]">
              <Link
                href="/finder"
                className="bg-white text-[#1a2b54] rounded-full px-6 sm:px-8 py-[17px] font-semibold text-[19px] shadow-[0_10px_26px_rgba(10,20,48,0.30)] hover:bg-[#eef1f8]"
              >
                Find my software →
              </Link>
              <Link
                href="/#how-it-works"
                className="border border-white/[0.35] rounded-full px-[26px] py-4 font-semibold text-[17px] text-white whitespace-nowrap hover:bg-white/[0.14]"
              >
                See how it works
              </Link>
            </div>
            <p className="mt-[26px] text-[14px] font-semibold text-white/[0.72] tracking-[0.01em]">
              Free for buyers · No obligation · Compare 3 providers
            </p>
          </div>

          <div className="bg-white border border-[#0d1117]/[0.09] rounded-[20px] p-[30px] pb-[26px] shadow-[0_24px_60px_rgba(13,17,23,0.10),0_2px_6px_rgba(13,17,23,0.04)]">
            <h2 className="font-sans font-semibold text-[27px] leading-[1.14] mb-2">What are you looking for?</h2>
            <p className="mb-[22px] text-[16px] text-[#5c6573]">
              Pick a category and answer a few quick questions to get your requirements in front of
              providers.
            </p>
            <p className="mb-3 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
              Browse our categories
            </p>
            <div className="grid gap-2">
              {heroCategories.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="flex items-center justify-between gap-4 w-full text-left bg-white border border-[#0d1117]/[0.09] rounded-full px-5 py-[13px] min-h-[56px] font-sans text-[15px] font-bold leading-[1.25] text-[#0d1117] transition-colors duration-150 hover:bg-[#4f46e5]/[0.10] hover:border-[#4f46e5]"
                >
                  {cat.label}
                  <span className="text-[#4338ca]">→</span>
                </Link>
              ))}
            </div>
            <p className="mt-[22px] pt-[18px] border-t border-[#0d1117]/[0.07] text-[14px] font-semibold text-[#5c6573]">
              Up to 3 responding providers · No obligation · No spam
            </p>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-[#0d1117]/[0.07] bg-white">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-[26px] grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            "Free for buyers, always",
            "Providers respond, not a directory",
            "Providers respond by email within 24 hours",
          ].map((t) => (
            <div key={t} className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0 block" />
              <p className="text-[15px] font-semibold text-[#3d4653]">{t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-[#0d1117]/[0.07] bg-[#f6f7fb]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-[92px]">
          <p className="mb-[14px] text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">How it works</p>
          <h2 className="font-sans font-semibold text-[clamp(31px,4.4vw,46px)] leading-[1.08] tracking-[-0.03em] mb-4 max-w-[22ch]">
            Four steps, and the research is done
          </h2>
          <p className="mb-14 text-[18px] text-[#5c6573] max-w-[52ch]">
            You never have to work through dozens of vendors unless you want to.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              ["01", "Tell us what you need", "A few quick questions about your company, requirements and goals."],
              ["02", "We publish your brief", "Your brief is published to providers in the category. Up to 3 who believe they're a fit will respond."],
              ["03", "Compare your options", "Speak with the providers and see how each solution fits your requirements."],
              ["04", "Choose the right one", "You decide which provider is best for your business. No obligation either way."],
            ].map(([num, title, body]) => (
              <div key={num} className="bg-white border border-[#0d1117]/[0.08] rounded-2xl px-6 pt-[26px] pb-7">
                <p className="mb-4 font-sans font-semibold text-[15px] text-[#4338ca]">{num}</p>
                <h3 className="font-sans font-semibold text-[22px] leading-[1.15] mb-[10px]">{title}</h3>
                <p className="text-[16px] text-[#5c6573]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="border-t border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-[92px]">
          <p className="mb-[14px] text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
            Software categories
          </p>
          <h2 className="font-sans font-semibold text-[clamp(31px,4.4vw,46px)] leading-[1.08] tracking-[-0.03em] mb-14 max-w-[26ch]">
            We go deep on a few categories, not shallow on hundreds
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl px-[30px] pt-8 pb-[30px] flex flex-col">
              <span className="w-11 h-11 rounded-full bg-[#4f46e5]/[0.10] flex items-center justify-center mb-6 text-[#4f46e5]">
                <LeafIcon />
              </span>
              <h3 className="font-sans font-semibold text-[27px] leading-[1.12] mb-3">EUDR Software</h3>
              <p className="mb-[26px] text-[16px] text-[#5c6573]">
                Software for EU Deforestation Regulation compliance: supplier geolocation, due diligence
                statements, risk assessment and traceability.
              </p>
              <Link
                href="/eudr"
                className="mt-auto self-stretch text-center border border-[#0d1117]/[0.14] rounded-full px-5 py-[13px] font-sans font-semibold text-[15px] text-[#0d1117] hover:bg-[#4f46e5]/[0.08] hover:border-[#4f46e5]"
              >
                Find EUDR software →
              </Link>
            </div>
            <div className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl px-[30px] pt-8 pb-[30px] flex flex-col">
              <span className="w-11 h-11 rounded-full bg-[#10b981]/[0.10] flex items-center justify-center mb-6 text-[#047857]">
                <ShirtIcon />
              </span>
              <h3 className="font-sans font-semibold text-[27px] leading-[1.12] mb-3">Fashion PLM Software</h3>
              <p className="mb-[26px] text-[16px] text-[#5c6573]">
                PLM for fashion brands, apparel manufacturers, footwear and accessories companies managing
                growing collections and supplier networks.
              </p>
              <Link
                href="/plm"
                className="mt-auto self-stretch text-center border border-[#0d1117]/[0.14] rounded-full px-5 py-[13px] font-sans font-semibold text-[15px] text-[#0d1117] hover:bg-[#4f46e5]/[0.08] hover:border-[#4f46e5]"
              >
                Find PLM software →
              </Link>
            </div>
            <div className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl px-[30px] pt-8 pb-[30px] flex flex-col">
              <span className="w-11 h-11 rounded-full bg-[#10b981]/[0.18] flex items-center justify-center mb-6 text-[#047857]">
                <BatteryIcon />
              </span>
              <h3 className="font-sans font-semibold text-[27px] leading-[1.12] mb-3">
                Digital Battery Passport Software
              </h3>
              <p className="mb-[26px] text-[16px] text-[#5c6573]">
                DBP software for battery makers, OEMs and recyclers: material traceability, carbon footprint
                data, compliance reporting and the QR-linked passport itself.
              </p>
              <Link
                href="/battery-passport"
                className="mt-auto self-stretch text-center border border-[#0d1117]/[0.14] rounded-full px-5 py-[13px] font-sans font-semibold text-[15px] text-[#0d1117] hover:bg-[#4f46e5]/[0.08] hover:border-[#4f46e5]"
              >
                Find DBP software →
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center gap-[18px] flex-wrap mt-10 bg-[#eef1f8] rounded-full px-[30px] py-5">
            <span className="font-sans font-semibold text-[19px]">Your needs</span>
            <span className="text-[#4338ca] text-[19px]">→</span>
            <span className="font-sans font-semibold text-[19px]">We publish</span>
            <span className="text-[#4338ca] text-[19px]">→</span>
            <span className="font-sans font-semibold text-[19px] bg-[#4f46e5] text-white rounded-full px-[18px] py-[7px]">
              3 providers
            </span>
            <span className="text-[#4338ca] text-[19px]">→</span>
            <span className="font-sans font-semibold text-[19px]">You choose</span>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="border-t border-[#0d1117]/[0.07] bg-[#eef1f8]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-[92px]">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-16">
            <div>
              <h2 className="font-sans font-semibold text-[clamp(31px,4.4vw,46px)] leading-[1.08] tracking-[-0.03em] mb-4">
                Why use Software Lantern?
              </h2>
              <p className="text-[18px] text-[#3d4653] max-w-[34ch]">
                There are hundreds of specialist platforms in each of our categories. You need three that
                actually fit.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
              {[
                [<MagnifyingGlassIcon key="i" />, "Less research", "Your brief reaches providers directly, so you don't have to evaluate dozens yourself."],
                [<TargetIcon key="i" />, "Better fit", "Your requirements, industry and company size are all part of the brief providers see, so only relevant ones respond."],
                [<HandshakeIcon key="i" />, "Your choice", "You compare the options and decide who you want to talk to, or nobody at all."],
                [<TagIcon key="i" />, "Free for buyers", "There is no cost to use Software Lantern. Providers are the commercial side."],
              ].map(([icon, title, body]) => (
                <div key={title as string}>
                  <span className="w-10 h-10 rounded-full bg-[#4f46e5]/[0.10] flex items-center justify-center mb-3 text-[#4f46e5]">
                    {icon}
                  </span>
                  <h3 className="font-sans font-semibold text-[22px] mb-2">{title}</h3>
                  <p className="text-[16px] text-[#3d4653]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust logos */}
      <section className="border-t border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-14">
          <p className="mb-6 text-[13px] font-bold tracking-[0.04em] text-[#79818f]">
            Buyers who have used our matching service
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-24 bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl flex items-center justify-center px-6">
              <Image src="/logo-phd.png" alt="PHD" width={160} height={42} className="h-[42px] w-auto object-contain" />
            </div>
            <div className="h-24 bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl flex items-center justify-center px-6">
              <Image src="/logo-meraas.png" alt="Meraas" width={307} height={92} className="h-[42px] w-auto object-contain" />
            </div>
            <div className="h-24 bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl flex items-center justify-center px-6">
              <Image src="/logo-kawasaki.png" alt="Kawasaki" width={164} height={28} className="h-[42px] w-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-t border-[#0d1117]/[0.07] bg-[#f6f7fb]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-[76px]">
          <blockquote className="text-center">
            <p className="mb-7 font-sans font-semibold text-[clamp(26px,3.4vw,38px)] leading-[1.16] tracking-[-0.028em] max-w-[20em] mx-auto text-pretty">
              &ldquo;Without Software Lantern we would still be looking for the right software. Your
              matchmaking service has simplified our searching process&rdquo;
            </p>
            <footer className="flex items-center justify-center gap-[14px]">
              <span className="w-11 h-11 shrink-0 rounded-full bg-[#10b981]/[0.10] grid place-items-center font-sans font-semibold text-[15px] text-[#047857]">
                BG
              </span>
              <span className="text-[16px] text-[#3d4653] whitespace-nowrap">
                <strong className="font-bold text-[#0d1117]">Benoit Gorand</strong>, Marketing Manager at
                Kawasaki
              </span>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* For providers CTA */}
      <section id="for-providers" className="border-t border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 pt-20 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 items-center bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-7 sm:p-11">
            <div>
              <h2 className="font-sans font-semibold text-[clamp(26px,3.4vw,34px)] leading-[1.12] mb-3">
                Are you a software provider?
              </h2>
              <p className="text-[17px] text-[#5c6573] max-w-[52ch]">
                Get introduced to companies actively looking for a solution like yours, with their
                requirements already written down.
              </p>
            </div>
            <Link
              href="/providers"
              className="justify-self-start lg:justify-self-end border border-[#4f46e5]/[0.4] text-[#4338ca] rounded-full px-7 py-[15px] font-sans font-semibold text-[16px] whitespace-nowrap hover:bg-[#4f46e5]/[0.08]"
            >
              Become a provider →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
