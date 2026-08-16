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

export function MapPinIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.4" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

export function SendIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.5 3.5 3 10.8l6.5 2.7L12.5 20 20.5 3.5Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 13.5 20.5 3.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function FolderIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.5 6.5a1 1 0 0 1 1-1h5l2 2.2h8a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V6.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PeopleIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8" r="3" stroke={color} strokeWidth="1.8" />
      <path d="M2.5 19.5c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16.5" cy="9" r="2.4" stroke={color} strokeWidth="1.8" />
      <path d="M14.8 14.3c.9-.5 1.9-.8 2.9-.8 2.6 0 4.8 1.8 4.8 4.6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PlugIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3.5V8M15 3.5V8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6.5 8h11v4a5.5 5.5 0 0 1-11 0V8Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 17v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function TagIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.5 3.5h7.2a1 1 0 0 1 .7.3l9 9a1 1 0 0 1 0 1.4l-6.2 6.2a1 1 0 0 1-1.4 0l-9-9a1 1 0 0 1-.3-.7v-7.2Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="1.6" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

export function SwatchIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="16" rx="2" stroke={color} strokeWidth="1.8" />
      <rect x="13" y="4" width="7" height="16" rx="2" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

export function ChatIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5.5h16a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9l-4.5 4V16H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FlagIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 21V4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 4.5h12l-3 4 3 4H6" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function CubeIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.5 20 8v8l-8 4.5-8-4.5V8l8-4.5Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 8l8 4.5 8-4.5" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 12.5V21" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

export function LayersIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.5 20.5 8 12 12.5 3.5 8 12 3.5Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3.5 12l8.5 4.5L20.5 12" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3.5 16l8.5 4.5 8.5-4.5" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function ShirtIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 3.5 12 5.5 16 3.5 20.5 7l-3 3-2-1.3V20.5h-7V8.7L6.5 10l-3-3L8 3.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BatteryIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="16" height="10" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M21 10v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 10v4M11 10v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function TargetIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1.2" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

export function HandshakeIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 10.5 6 7.7a1.8 1.8 0 0 1 2.2 0L10 9.2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21.5 10.5 18 7.7a1.8 1.8 0 0 0-2.2 0L14 9.2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M8.5 9.5 6 12a1.6 1.6 0 0 0 2.3 2.2L10 12.5l1.3 1.3a1.6 1.6 0 0 0 2.3 0l.1-.1a1.6 1.6 0 0 0 2.3 0L18 11.9l-2.5-2.4"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ScaleIcon({ color = "currentColor", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.5V20.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 20.5h12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 6.5h16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 6.5 1.5 11.5a2.5 2.5 0 0 0 5 0L4 6.5Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M20 6.5l-2.5 5a2.5 2.5 0 0 0 5 0L20 6.5Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
