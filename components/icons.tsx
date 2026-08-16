// Simple, generic inline line icons shared across EUDR content pages, same
// stroke style as the icon already established in eudr-deadline-countdown.tsx
// (24x24 viewBox, ~1.8 stroke width, color passed as a prop) — not modeled on
// any specific external site's icon set, just plain geometric shapes.

type IconProps = { color?: string; size?: number };

export function LeafIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 19c8-1 13-6 14-14C11 6 6 11 5 19Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M5 19 13 11" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function DocumentIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 3.5h8l3 3v14a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M14.5 3.5V7h3" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5 19 6.5v5.2c0 5-3 8.2-7 9.3-4-1.1-7-4.3-7-9.3V6.5L12 3.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MagnifyingGlassIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="1.8" />
      <path d="M20 20l-4.8-4.8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CalendarIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke={color} strokeWidth="1.8" />
      <path d="M3.5 9.5H20.5" stroke={color} strokeWidth="1.8" />
      <path d="M8 3V6.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 3V6.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ExchangeIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8h13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 4.5 17.5 8 14 11.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 16H7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 12.5 6.5 16 10 19.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChecklistIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="3.5" width="15" height="17" rx="1.5" stroke={color} strokeWidth="1.8" />
      <path d="M8 8.5l1.3 1.3L11.5 7.3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 8.5H16.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 14.5l1.3 1.3 2.2-2.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 14.5H16.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function BuildingIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="7" width="11" height="14" stroke={color} strokeWidth="1.8" />
      <rect x="15" y="3" width="5" height="18" stroke={color} strokeWidth="1.8" />
      <path d="M7 10.5h2M7 14h2M7 17.5h2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17 6.5h1M17 10h1M17 13.5h1M17 17h1" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function BoxIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8.2 12 4l8 4.2v7.6L12 20l-8-4.2V8.2Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M4 8.2 12 12l8-3.8" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 12v8" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}
