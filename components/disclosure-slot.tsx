// Visible disclosure placeholder, per the brief's constraint 3: no vendor
// name, logo, or product claim appears anywhere on this site until that
// vendor's approval is confirmed, and this resource positions itself as
// independent in the meantime. The actual disclosure text is "to be
// supplied later" by the site owner — this is deliberately generic until
// then, and deliberately visible rather than buried, so it's obvious this
// placeholder is still a placeholder.
export function DisclosureSlot() {
  return (
    <div className="rounded-xl bg-[#fef3c7] border border-[#92400e]/[0.25] px-5 py-4 text-[13px] text-[#78350f] max-w-[640px] mx-auto">
      <strong>Independence disclosure:</strong> this is an independent resource. It does not name or
      endorse any specific vendor, and does not run algorithmic matching or scoring. [Disclosure
      text about any commercial relationships to be added here before this goes live.]
    </div>
  );
}
