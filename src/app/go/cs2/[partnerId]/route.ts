import { NextRequest, NextResponse } from "next/server";
import { getPartner } from "@/lib/affiliates";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /go/cs2/:partnerId
 *
 * CS2 skin marketplace affiliate redirect with click tracking.
 * 1. Looks up partner in affiliates config
 * 2. Logs click to Supabase (fire-and-forget)
 * 3. Redirects to affiliate URL if active, else base URL
 *
 * Query param ?from=<page> tracks which page originated the click.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { partnerId: string } }
) {
  const { partnerId } = params;
  const partner = getPartner(partnerId);

  if (!partner) {
    return NextResponse.redirect(new URL("/cs2/compare", request.url));
  }

  // Log click (fire-and-forget — don't block the redirect)
  try {
    const supabase = createServerClient();
    const referrer = request.headers.get("referer") || null;
    const userAgent = request.headers.get("user-agent") || null;
    const from = request.nextUrl.searchParams.get("from") || null;

    supabase
      .from("clicks")
      .insert({
        deal_id: `cs2-${partnerId}`,
        referrer: from ? `cs2:${from}` : referrer,
        user_agent: userAgent,
      })
      .then(() => {});
  } catch {
    // Don't let tracking errors block the redirect
  }

  const targetUrl = partner.active ? partner.affiliateUrl : partner.baseUrl;

  return NextResponse.redirect(targetUrl, { status: 302 });
}
