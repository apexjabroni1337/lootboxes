import { cn } from "@/lib/utils";

const GRADIENT_PAIRS = [
  { from: "#7c3aed", to: "#a78bfa" }, // Purple
  { from: "#0891b2", to: "#22d3ee" }, // Cyan
  { from: "#db2777", to: "#f472b6" }, // Pink
  { from: "#d97706", to: "#fbbf24" }, // Amber
  { from: "#059669", to: "#6ee7b7" }, // Emerald
  { from: "#2563eb", to: "#60a5fa" }, // Blue
  { from: "#dc2626", to: "#f87171" }, // Red
  { from: "#0d9488", to: "#5eead4" }, // Teal
  { from: "#7c2d12", to: "#ea580c" }, // Burnt Orange
  { from: "#4f46e5", to: "#818cf8" }, // Indigo
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function getGradient(name: string) {
  const idx = hashString(name) % GRADIENT_PAIRS.length;
  return GRADIENT_PAIRS[idx];
}

function getInitials(name: string): string {
  const words = name.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

interface GameAvatarProps {
  gameName: string;
  /** When provided, renders an <img> instead of the gradient/initials fallback */
  src?: string | null;
  size?: "sm" | "md" | "lg";
  aspectRatio?: "square" | "video" | "portrait";
  className?: string;
}

const sizeClasses = {
  sm: "text-lg font-bold",
  md: "text-3xl font-extrabold",
  lg: "text-5xl font-extrabold",
};

const aspectClasses = {
  square: "aspect-square",
  video: "aspect-[16/9]",
  portrait: "aspect-[3/4]",
};

export default function GameAvatar({
  gameName,
  src,
  size = "md",
  aspectRatio = "video",
  className,
}: GameAvatarProps) {
  // If a real image URL is provided, render it with the gradient fallback behind
  if (src) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-lg",
          aspectClasses[aspectRatio],
          className
        )}
      >
        <img
          src={src}
          alt={gameName}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  const { from, to } = getGradient(gameName);
  const initials = getInitials(gameName);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-lg",
        aspectClasses[aspectRatio],
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
      }}
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)",
        }}
      />
      <span
        className={cn(
          "relative select-none text-white/90 drop-shadow-sm",
          sizeClasses[size]
        )}
      >
        {initials}
      </span>
    </div>
  );
}
