"use client";

import Image from "next/image";

interface PolaroidImageProps {
  src: string;
  caption: string;
  rotation?: number;
  className?: string;
}

const ROTATIONS = [-3, 2, -1.5, 3, -2, 1.5];

/**
 * A single Polaroid-style image with white border, slight rotation, and caption.
 * Used to inject in-game screenshots throughout analysis pages.
 */
export default function PolaroidImage({
  src,
  caption,
  rotation = 0,
  className = "",
}: PolaroidImageProps) {
  return (
    <figure
      className={`inline-block bg-white p-2 shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-shadow duration-300 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src={src}
          alt={caption}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 280px"
          unoptimized
        />
      </div>
      <figcaption className="mt-1.5 text-[11px] text-center text-gray-500 italic font-medium leading-tight px-1">
        {caption}
      </figcaption>
    </figure>
  );
}

interface PolaroidScatteredProps {
  screenshots: string[];
  gameTitle: string;
}

/**
 * Renders 3-6 Polaroid-style images scattered between page sections.
 * Images are positioned with alternating rotations in a scattered layout.
 *
 * Designed to be placed in the page flow between analysis sections,
 * not absolutely positioned (mobile-friendly).
 */
export function PolaroidScatteredGroup({
  screenshots,
  gameTitle,
}: PolaroidScatteredProps) {
  if (!screenshots.length) return null;

  // Pick up to 4 screenshots for the scattered layout
  const images = screenshots.slice(0, 4);

  const captions = [
    `In-game screenshot — ${gameTitle}`,
    `Gameplay — ${gameTitle}`,
    `${gameTitle} — world & environments`,
    `${gameTitle} — combat & mechanics`,
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 py-6 -mx-2">
      {images.map((url, i) => (
        <PolaroidImage
          key={i}
          src={url}
          caption={captions[i % captions.length]}
          rotation={ROTATIONS[i % ROTATIONS.length]}
          className="w-[240px] md:w-[260px]"
        />
      ))}
    </div>
  );
}

/**
 * Renders a single Polaroid in a float container for inline placement.
 * Can be floated left or right within text content.
 */
export function PolaroidFloat({
  src,
  caption,
  side = "right",
  rotation,
}: {
  src: string;
  caption: string;
  side?: "left" | "right";
  rotation?: number;
}) {
  const rot = rotation ?? (side === "right" ? 2 : -2);
  return (
    <div
      className={`${
        side === "right"
          ? "float-right ml-6 mb-4"
          : "float-left mr-6 mb-4"
      } hidden md:block`}
    >
      <PolaroidImage
        src={src}
        caption={caption}
        rotation={rot}
        className="w-[200px] lg:w-[220px]"
      />
    </div>
  );
}
