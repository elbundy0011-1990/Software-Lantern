import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Software Lantern",
  description:
    "Guides and updates on EUDR, Fashion PLM, Battery Passport software, and the categories Software Lantern covers.",
  alternates: {
    canonical: "/resources/blog",
  },
};

export default function BlogHubPage() {
  return (
    <main data-screen-label="Blog hub">
      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 pt-16 pb-20">
          <p className="mb-8 text-[14px] text-[#79818f]">
            <Link href="/" className="text-[#4f46e5] font-semibold">
              Home
            </Link>{" "}
            <span className="text-[#c2c8d1]">/</span> Resources{" "}
            <span className="text-[#c2c8d1]">/</span> Blog
          </p>

          <h1 className="font-sans font-semibold text-[clamp(32px,4.4vw,44px)] leading-[1.1] tracking-[-0.03em] mb-4">
            Blog
          </h1>
          <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-10 max-w-[60ch]">
            Guides and updates on EUDR, Fashion PLM, Battery Passport software, and the categories
            we cover.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href="/resources/blog/eudr-software-questions-to-ask-providers"
              className="block bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-7 hover:border-[#4f46e5]/[0.4] transition-colors duration-150"
            >
              <p className="mb-3 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
                EUDR
              </p>
              <h2 className="font-sans font-semibold text-[21px] leading-[1.25] mb-2">
                How to Evaluate EUDR Software: A Buyer&apos;s Checklist and Questions to Ask
                Providers
              </h2>
              <p className="text-[15px] text-[#5c6573] leading-[1.5]">
                A sequential guide organized by buyer role and size, plus a script of questions to
                bring to a provider call.
              </p>
              <span className="mt-4 inline-block text-[14px] font-semibold text-[#4338ca]">
                Read the guide →
              </span>
            </Link>
            <Link
              href="/resources/blog/fashion-plm-software-questions-to-ask-providers"
              className="block bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-7 hover:border-[#4f46e5]/[0.4] transition-colors duration-150"
            >
              <p className="mb-3 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
                Fashion PLM
              </p>
              <h2 className="font-sans font-semibold text-[21px] leading-[1.25] mb-2">
                How to Evaluate Fashion PLM Software: A Buyer&apos;s Checklist and Questions to Ask
                Providers
              </h2>
              <p className="text-[15px] text-[#5c6573] leading-[1.5]">
                A sequential guide organized by brand structure and collection complexity, plus a
                script of questions to bring to a provider call.
              </p>
              <span className="mt-4 inline-block text-[14px] font-semibold text-[#4338ca]">
                Read the guide →
              </span>
            </Link>
            <Link
              href="/resources/blog/battery-passport-software-questions-to-ask-providers"
              className="block bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-7 hover:border-[#4f46e5]/[0.4] transition-colors duration-150"
            >
              <p className="mb-3 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
                Battery Passport
              </p>
              <h2 className="font-sans font-semibold text-[21px] leading-[1.25] mb-2">
                How to Evaluate Battery Passport Software: A Buyer&apos;s Checklist and Questions to
                Ask Providers
              </h2>
              <p className="text-[15px] text-[#5c6573] leading-[1.5]">
                A sequential guide organized by where you sit in the value chain, plus a script of
                questions to bring to a provider call.
              </p>
              <span className="mt-4 inline-block text-[14px] font-semibold text-[#4338ca]">
                Read the guide →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
