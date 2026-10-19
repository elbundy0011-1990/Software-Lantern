// Visible disclosure, present on every OT page per the 2026-10-19 build
// instruction: no vendor name, logo, or product claim appears anywhere on
// this site until that vendor's approval is confirmed, and this resource
// does not run algorithmic matching or scoring. The actual disclosure
// text about any commercial relationships is "to be supplied later" by
// the site owner — this is deliberately generic until then, and
// deliberately visible rather than buried, so it's obvious this
// placeholder is still a placeholder. Never use "independent," "neutral,"
// or "unbiased" here or anywhere else on the site.
export function DisclosureSlot() {
  return (
    <div className="rounded border border-[#9a3412]/[0.3] bg-[#fef3c7] px-5 py-4 text-[13px] text-[#78350f] max-w-[640px] mx-auto">
      <strong>Disclosure:</strong> this site does not name or endorse any specific vendor, and does
      not run algorithmic matching or scoring. [Disclosure text about any commercial relationships
      to be added here before this goes live.]
    </div>
  );
}
