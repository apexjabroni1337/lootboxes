/**
 * Manual cover image overrides for games that IGDB and Steam APIs
 * consistently fail to find.
 *
 * This serves as the 3rd and final fallback tier in the image
 * enrichment pipeline:
 *
 *   1. IGDB (Twitch) — best quality, covers most PC/console games
 *   2. Steam Store API — fallback for Steam-available titles
 *   3. Manual Overrides (this file) — for mobile-only, region-specific,
 *      or niche titles that neither API can reliably match
 *
 * To add a new override:
 *   1. Find a high-quality portrait cover image (ideally 264×374 or similar 3:4 ratio)
 *   2. Add the game's slug as the key
 *   3. Provide `cover` URL and optionally `screenshot` URL
 *
 * The UI also has a final graceful fallback: the GameAvatar component
 * renders a deterministic gradient + initials when no image is available.
 */

export const MANUAL_COVERS: Record<
  string,
  { cover: string; screenshot?: string }
> = {
  // ─── Mobile-only titles that IGDB sometimes misses ───
  // (Currently empty — IGDB found all 41 games as of March 2026)
  // Add entries here as needed, e.g.:
  //
  // "some-mobile-game": {
  //   cover: "https://example.com/cover-264x374.jpg",
  //   screenshot: "https://example.com/screenshot-889x500.jpg",
  // },
};
