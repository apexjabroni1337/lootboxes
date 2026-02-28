import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * GET /api/newsletter/unsubscribe?email=...
 * One-click unsubscribe link for email footers.
 */
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { error } = await supabase
    .from("subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("email", email.toLowerCase().trim());

  if (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  // Redirect to a friendly page
  return NextResponse.redirect(
    new URL("/newsletter/unsubscribed", request.url)
  );
}
