import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  const { dealId } = params;

  try {
    const supabase = createServerClient();

    // Get the deal's affiliate URL
    const { data: deal, error } = await supabase
      .from("deals")
      .select("affiliate_url, store_url")
      .eq("id", dealId)
      .single();

    if (error || !deal) {
      // Fallback to homepage if deal not found
      return NextResponse.redirect(new URL("/deals", request.url));
    }

    // Log the click (fire and forget — don't wait for it)
    const referrer = request.headers.get("referer") || null;
    const userAgent = request.headers.get("user-agent") || null;

    supabase
      .from("clicks")
      .insert({
        deal_id: dealId,
        referrer,
        user_agent: userAgent,
      })
      .then(() => {});

    // Redirect to the affiliate URL, or the store URL as fallback
    const destination = deal.affiliate_url || deal.store_url;

    return NextResponse.redirect(destination, { status: 302 });
  } catch {
    return NextResponse.redirect(new URL("/deals", request.url));
  }
}
