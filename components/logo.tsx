const LanternMark = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
    <path
      d="M12 2v2.4M8.5 4.4h7l1.3 4.2c.5 1.6.4 3.3-.3 4.8L14.6 18h-5.2l-1.9-4.6c-.7-1.5-.8-3.2-.3-4.8l1.3-4.2Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M9.4 18h5.2l.7 2.4a1 1 0 0 1-1 1.6h-4.6a1 1 0 0 1-1-1.6l.7-2.4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M9 9h6M8.4 12h7.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export function Logo({ height = 34, dark = false }: { height?: number; dark?: boolean }) {
  const color = dark ? "#ffffff" : "#0d1117";
  const accent = "#4f46e5";
  return (
    <span
      className="inline-flex items-center gap-2 select-none"
      style={{ height }}
    >
      <LanternMark className="shrink-0" style={{ width: height * 0.72, height: height * 0.72, color: accent } as React.CSSProperties} />
      <span
        style={{
          fontSize: height * 0.5,
          lineHeight: 1,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color,
        }}
      >
        Software<span style={{ color: accent }}>Lantern</span>
      </span>
    </span>
  );
}
