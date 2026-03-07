import { NextRequest, NextResponse } from "next/server";
import { getPartner } from "@/lib/affiliates";

/**
 * GET /go/cs2/:partnerId
 *
 * CS2 skin marketplace affiliate redirect.
 * Looks up the partner, redirects to affiliate URL if active, else base URL.
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

  const targetUrl = partner.active ? partner.affiliateUrl : partner.baseUrl;

  return NextResponse.redirect(targetUrl, { status: 302 });
}
