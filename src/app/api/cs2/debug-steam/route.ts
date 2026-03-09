import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * DEBUG ENDPOINT — hit /api/cs2/debug-steam to see raw SteamWebAPI response.
 * Remove this file after debugging.
 */
export async function GET() {
  const key = process.env.STEAMWEBAPI_KEY;
  if (!key) {
    return NextResponse.json({ error: "STEAMWEBAPI_KEY not set" });
  }

  try {
    const url = `https://www.steamwebapi.com/steam/api/items?key=${key}&game=cs2&currency=USD&format=json&limit=2`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const status = res.status;
    const text = await res.text();

    // Try to parse as JSON
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // not valid JSON
    }

    // If array, get first item keys
    let firstItemKeys: string[] = [];
    let firstItem: unknown = null;
    if (Array.isArray(parsed) && parsed.length > 0) {
      firstItemKeys = Object.keys(parsed[0]);
      firstItem = parsed[0];
    } else if (parsed && typeof parsed === "object") {
      const obj = parsed as Record<string, unknown>;
      // Check if it has a data/items array inside
      const possibleArrays = Object.entries(obj).filter(([, v]) => Array.isArray(v));
      if (possibleArrays.length > 0) {
        const [arrKey, arr] = possibleArrays[0];
        const typedArr = arr as unknown[];
        if (typedArr.length > 0) {
          firstItemKeys = Object.keys(typedArr[0] as Record<string, unknown>);
          firstItem = typedArr[0];
        }
        return NextResponse.json({
          status,
          responseType: "object with array",
          topLevelKeys: Object.keys(obj),
          arrayKey: arrKey,
          arrayLength: typedArr.length,
          firstItemKeys,
          firstItem,
          secondItem: typedArr.length > 1 ? typedArr[1] : null,
        });
      }
      return NextResponse.json({
        status,
        responseType: "object",
        topLevelKeys: Object.keys(obj),
        raw: text.slice(0, 3000),
      });
    }

    return NextResponse.json({
      status,
      responseType: Array.isArray(parsed) ? "array" : typeof parsed,
      arrayLength: Array.isArray(parsed) ? parsed.length : undefined,
      firstItemKeys,
      firstItem,
      secondItem: Array.isArray(parsed) && parsed.length > 1 ? parsed[1] : null,
      rawPreview: !parsed ? text.slice(0, 3000) : undefined,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Fetch failed",
      message: String(error),
    });
  }
}
