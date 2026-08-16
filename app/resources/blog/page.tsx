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

          <div className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-10 text-center">
            <p className="text-[16px] font-semibold text-[#0d1117] mb-2">Nothing published yet</p>
            <p className="text-[15px] text-[#5c6573] mb-6 max-w-[46ch] mx-auto">
              We&apos;re working on our first posts. In the meantime, our{" "}
              <Link href="/resources/regulations" className="text-[#4f46e5] font-semibold">
                regulation explainers
              </Link>{" "}
              cover what EUDR and the EU Battery Regulation actually require.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
