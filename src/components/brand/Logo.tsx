/**
 * LootBoxes.com brand logo — reusable across Header, Footer, OG images, etc.
 *
 * The icon is a stylised treasure-chest / loot-box with a radiant sparkle,
 * rendered as a single inline SVG so it works everywhere without external files.
 */

import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Icon only                                                          */
/* ------------------------------------------------------------------ */

interface IconProps {
  size?: number;          // px – defaults to 36
  className?: string;
}

export function LootBoxIcon({ size = 36, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background rounded square */}
      <rect width="48" height="48" rx="12" fill="#0074c5" />

      {/* Box body */}
      <rect x="10" y="22" width="28" height="16" rx="3" fill="white" opacity="0.95" />

      {/* Box lid */}
      <rect x="8" y="17" width="32" height="8" rx="3" fill="white" />

      {/* Lid clasp / band */}
      <rect x="20" y="17" width="8" height="21" rx="1.5" fill="#0074c5" opacity="0.25" />

      {/* Keyhole / latch circle */}
      <circle cx="24" cy="30" r="2.5" fill="#0074c5" />

      {/* Sparkle top-right */}
      <path
        d="M36 8 L37.2 11.5 L41 12 L37.2 12.5 L36 16 L34.8 12.5 L31 12 L34.8 11.5 Z"
        fill="#FFD700"
      />

      {/* Sparkle small top-left */}
      <path
        d="M14 6 L14.8 8.2 L17 8.5 L14.8 8.8 L14 11 L13.2 8.8 L11 8.5 L13.2 8.2 Z"
        fill="#FFD700"
        opacity="0.7"
      />

      {/* Tiny sparkle */}
      <circle cx="28" cy="9" r="1" fill="#FFD700" opacity="0.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Full logo  (icon + wordmark)                                       */
/* ------------------------------------------------------------------ */

interface LogoProps {
  size?: "sm" | "md" | "lg";
  linked?: boolean;
  className?: string;
}

const SIZES = {
  sm: { icon: 32, text: "text-lg" },
  md: { icon: 36, text: "text-xl" },
  lg: { icon: 44, text: "text-2xl" },
} as const;

export default function Logo({ size = "md", linked = true, className }: LogoProps) {
  const s = SIZES[size];

  const inner = (
    <span className={`flex items-center gap-2 ${className ?? ""}`}>
      <LootBoxIcon size={s.icon} />
      <span className={`${s.text} font-extrabold tracking-tight text-gray-900`}>
        Loot<span className="text-[#0074c5]">Boxes</span>
        <span className="text-gray-400 font-semibold">.com</span>
      </span>
    </span>
  );

  if (!linked) return inner;

  return (
    <Link href="/" className="flex flex-shrink-0 items-center">
      {inner}
    </Link>
  );
}
