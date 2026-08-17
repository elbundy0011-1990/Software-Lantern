import Link from "next/link";
import type { Metadata } from "next";
import { DocumentIcon, ScaleIcon, HandshakeIcon, ShieldIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Become a Provider | Software Lantern",
  description:
    "Talk to buyers who have already written down what they need. Apply as a Software Lantern provider.",
  path: "/providers",
});

export default function ProvidersPage() {
  return (
    <main data-screen-label="Become a provider">
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
        <div className="relative max-w-[1160px] mx-auto px-5 sm:px-8 pt-[88px] pb-21 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
          <div>
            <p className="mb-[18px] text-[12px] font-bold tracking-[0.09em] uppercase text-white/[0.62]">
              For software providers
            </p>
            <h1 className="font-sans font-semibold text-[clamp(34px,5.4vw,56px)] leading-[1.05] tracking-[-0.035em] mb-[22px] text-white text-pretty">
              Talk to buyers who have already written down what they need
            </h1>
            <p className="mb-4 text-[20px] leading-[1.5] text-white/[0.88] max-w-[34ch]">
              Every lead in your portal is a live brief in EUDR, PLM or Digital Battery Passport software,
              submitted by a buyer looking right now.
            </p>
            <p className="mb-[34px] text-[17px] text-white/[0.66] max-w-[46ch]">
              No subscription. No retainer. You see the requirement first, and pay only for the leads you
              want.
            </p>
            <div className="flex flex-wrap gap-[14px]">
              <Link
                href="/portal/signup"
                className="bg-white text-[#1a2b54] rounded-full px-6 sm:px-8 py-[17px] font-sans font-semibold text-[18px] shadow-[0_10px_26px_rgba(10,20,48,0.30)] hover:bg-[#eef1f8]"
              >
                Apply as a provider →
              </Link>
              <a
                href="mailto:jdb@softwarelantern.com?subject=Software%20Lantern%20provider%20enquiry"
                className="border border-white/[0.35] rounded-full px-[26px] py-4 font-sans font-semibold text-[17px] text-white whitespace-nowrap"
              >
                Talk to us first
              </a>
            </div>
            <p className="mt-[26px] text-[14px] font-semibold text-white/[0.72]">
              Pay per lead · Max 3 providers per brief · Money back if no demo
            </p>
          </div>

          <div className="bg-white rounded-[20px] p-[30px] shadow-[0_24px_60px_rgba(10,20,48,0.30)]">
            <p className="mb-[6px] text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
              Our promise
            </p>
            <h2 className="font-sans font-semibold text-[25px] leading-[1.18] tracking-[-0.028em] mb-3">
              No demo, no charge
            </h2>
            <p className="mb-[18px] text-[16px] leading-[1.55] text-[#3d4653]">
              If you buy a lead and never get the chance to demo your platform to that buyer, we refund it
              in full. You are paying for a conversation, so if the conversation never happens you should
              not pay for it.
            </p>
            <div className="grid gap-[10px]">
              {[
                "Tell us within 30 days that the buyer never took a meeting.",
                "Show us you made contact. Two attempts is enough.",
                "We refund the lead, or credit it against your next one. Your call.",
              ].map((text, i) => (
                <div
                  key={text}
                  className="flex gap-3 items-start bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl px-4 py-[14px]"
                >
                  <span className="w-[22px] h-[22px] shrink-0 rounded-full bg-[#10b981]/[0.14] grid place-items-center text-[12px] font-bold text-[#047857]">
                    {i + 1}
                  </span>
                  <p className="text-[15px] leading-[1.5] text-[#3d4653]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#0d1117]/[0.07] bg-white">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-21">
          <p className="mb-[14px] text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
            How it works for providers
          </p>
          <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-4 max-w-[24ch]">
            Four steps from application to demo
          </h2>
          <p className="mb-13 text-[18px] text-[#5c6573] max-w-[54ch]">
            You stay in control at every step. Nothing is bought on your behalf and nothing is sent to
            buyers without your say.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              ["01", "Apply and get verified", "Tell us which categories you serve, which industries you are strong in and who you are not right for."],
              ["02", "See matching briefs", "Requirements, industry, user count and timeline appear in your portal. The buyer's identity stays hidden."],
              ["03", "Unlock the ones you want", "Buy a lead and the company, contact, work email and phone unlock immediately. Skip the rest at no cost."],
              ["04", "Reach out and demo", "You contact the buyer directly. No demo, no charge: we refund any lead that never reached a meeting."],
            ].map(([num, title, body]) => (
              <div key={num} className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl px-6 pt-[26px] pb-7">
                <p className="mb-4 font-sans font-semibold text-[15px] text-[#4f46e5]">{num}</p>
                <h3 className="font-sans font-semibold text-[21px] leading-[1.18] mb-[10px]">{title}</h3>
                <p className="text-[16px] text-[#5c6573]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#0d1117]/[0.07] bg-[#f6f7fb]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-21 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-16">
          <div>
            <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-4">
              Why providers work with us
            </h2>
            <p className="text-[18px] text-[#3d4653] max-w-[34ch]">
              We are deliberately narrow. Three regulated, specialist categories, and buyers who arrive
              with a real requirement.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
            {[
              [<DocumentIcon key="i" />, "Briefs, not clicks", "Every lead answered a category questionnaire, so you know the industry, scope, user count and timeline before you spend anything."],
              [<ScaleIcon key="i" />, "Never more than three", "We cap each brief at 3 providers. You compete with at most two others, and you can see how many have bought before you commit."],
              [<HandshakeIcon key="i" />, "You choose the fit", "Nothing is pushed at you. If a requirement is not right for your platform, leave it and pay nothing."],
              [<ShieldIcon key="i" />, "Regulation-driven demand", "EUDR, the EU Battery Regulation and ESPR are forcing buying decisions. These buyers have deadlines, not wishlists."],
            ].map(([icon, title, body]) => (
              <div key={title as string}>
                <span className="w-10 h-10 rounded-full bg-[#4f46e5]/[0.10] flex items-center justify-center mb-3 text-[#4f46e5]">
                  {icon}
                </span>
                <h3 className="font-sans font-semibold text-[21px] mb-2">{title}</h3>
                <p className="text-[16px] text-[#3d4653]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-21 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-16 items-start">
          <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em]">
            Provider questions
          </h2>
          <div className="grid gap-[26px]">
            {[
              [
                "What exactly does the money back guarantee cover?",
                "If you buy a lead and never get the opportunity to demo your platform to that buyer, you get your money back. Tell us within 30 days, show us you made at least two attempts to reach them, and we refund the lead in full or credit it against your next one.",
              ],
              [
                "What does a lead cost?",
                "It depends on the category and the size of the buyer. The price is shown on every brief before you unlock it, and there is no subscription on top.",
              ],
              [
                "How many leads should we expect?",
                "That depends on your categories and how narrow your fit is. We would rather send you five briefs you can genuinely serve than fifty you cannot.",
              ],
              [
                "Do you rank or endorse providers?",
                "No. We tell buyers these are providers that believe they can meet their requirements. Buying more leads does not buy you a better position.",
              ],
              [
                "Can we add a category later?",
                <>
                  Yes. Add or drop categories whenever your product does. Email{" "}
                  <a href="mailto:jdb@softwarelantern.com" className="text-[#4f46e5]">
                    jdb@softwarelantern.com
                  </a>{" "}
                  and we will update your profile.
                </>,
              ],
            ].map(([q, a], i) => (
              <div key={i}>
                <h3 className="font-sans font-semibold text-[20px] mb-[7px]">{q}</h3>
                <p className="text-[16px] text-[#3d4653]">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 pt-19 pb-25">
          <div className="bg-[#eef1f8] rounded-[20px] p-7 sm:p-14 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <h2 className="font-sans font-semibold text-[clamp(27px,3.6vw,38px)] leading-[1.1] mb-3">
                Ready to see who is looking?
              </h2>
              <p className="text-[17px] text-[#3d4653] max-w-[46ch]">
                Apply once, browse live briefs, and pay only for the buyers you want to meet. No demo, no
                charge.
              </p>
            </div>
            <Link
              href="/portal/signup"
              className="justify-self-start lg:justify-self-end bg-[#4f46e5] text-white rounded-full px-6 sm:px-8 py-[17px] font-sans font-semibold text-[18px] whitespace-nowrap shadow-[0_6px_18px_rgba(79,70,229,0.24)] hover:bg-[#4338ca]"
            >
              Apply as a provider →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
