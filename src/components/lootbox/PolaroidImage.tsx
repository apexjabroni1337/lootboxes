"use client";

import Image from "next/image";
import { useState } from "react";

interface PolaroidImageProps {
  src: string;
  alt?: string;
  rotation?: number;
  className?: string;
}

const ROTATIONS = [-3, 2, -1.5, 3, -2, 1.5];

/**
 * A single Polaroid-style image with white border and slight rotation.
 * No caption — clean image only. Hides itself if the image fails to load.
 */
export default function PolaroidImage({
  src,
  alt = "In-game screenshot",
  rotation = 0,
  className = "",
}: PolaroidImageProps) {
  const [broken, setBroken] = useState(false);

  if (broken) return null;

  return (
    <figure
      className={`inline-block bg-white p-2 pb-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-shadow duration-300 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 280px"
          unoptimized
          onError={() => setBroken(true)}
        />
      </div>
    </figure>
  );
}

interface PolaroidScatteredProps {
  screenshots: string[];
  gameTitle: string;
}

/**
 * Renders up to 4 Polaroid-style images scattered between page sections.
 * Images that fail to load are automatically hidden.
 */
export function PolaroidScatteredGroup({
  screenshots,
  gameTitle,
}: PolaroidScatteredProps) {
  if (!screenshots.length) return null;

  const images = screenshots.slice(0, 4);

  return (
    <div className="flex flex-wrap justify-center gap-4 py-6 -mx-2">
      {images.map((url, i) => (
        <PolaroidImage
          key={url}
          src={url}
          alt={`${gameTitle} gameplay`}
          rotation={ROTATIONS[i % ROTATIONS.length]}
          className="w-[240px] md:w-[260px]"
        />
      ))}
    </div>
  );
}

/**
 * Renders a single Polaroid in a float container for inline placement.
 * Hidden on mobile for clean layout. Hides entirely if image fails to load.
 */
export function PolaroidFloat({
  src,
  alt = "In-game screenshot",
  side = "right",
  rotation,
}: {
  src: string;
  alt?: string;
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
        alt={alt}
        rotation={rot}
        className="w-[200px] lg:w-[220px]"
      />
    </div>
  );
}
