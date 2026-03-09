"use client";

import Link from "next/link";
import type { GameRowData } from "@/lib/game-normalizer";
import { ArrowRight } from "lucide-react";

interface SteamHoverPreviewProps {
  game: GameRowData;
}

export default function SteamHoverPreview({ game }: SteamHoverPreviewProps) {
  const previewImage = game.screenshot_image || game.cover_image;
  const genres = game.genres?.slice(0, 5) || [];

  return (
    <div className="w-80 rounded-lg border border-gray-200 bg-white shadow-2xl overflow-hidden">
      {/* Screenshot */}
      {previewImage && (
        <div className="aspect-video w-full overflow-hidden bg-gray-100">
          <img
            src={previewImage}
            alt={game.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-3.5">
        {/* Metacritic */}
        {game.metacritic && (
          <div className="mb-2.5 flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-500">
              Overall Reviews:
            </span>
            <span
              className={`rounded px-1.5 py-0.5 text-[11px] font-bold text-white ${
                game.metacritic >= 75
                  ? "bg-emerald-500"
                  : game.metacritic >= 50
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
            >
              {game.metacritic >= 75
                ? "Very Positive"
                : game.metacritic >= 50
                ? "Mixed"
                : "Mostly Negative"}
            </span>
          </div>
        )}

        {/* Genre tags */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {genres.map((genre) => (
              <span
                key={genre}
                className="rounded bg-[#1b2838] px-2 py-0.5 text-[10px] font-medium text-blue-200"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* View Game link */}
        <Link
          href={`/games/${game.slug}`}
          className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          View Game
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
