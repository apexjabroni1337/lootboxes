import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * POST /api/newsletter — Subscribe to the weekly deal digest.
 *
 * Flow:
 * 1. Validate email
 * 2. Insert into subscribers table (Supabase)
 * 3. Send confirmation email via Resend (TODO: wire up)
 * 4. Return success
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@") || email.length < 5) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabase = createServerClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, confirmed, unsubscribed_at")
      .eq("email", normalizedEmail)
      .single();

    if (existing && !existing.unsubscribed_at) {
      return NextResponse.json({
        ok: true,
        message: "You're already subscribed!",
        already: true,
      });
    }

    if (existing && existing.unsubscribed_at) {
      // Re-subscribe
      await supabase
        .from("subscribers")
        .update({ unsubscribed_at: null, confirmed: false })
        .eq("id", existing.id);
    } else {
      // New subscriber
      const { error } = await supabase
        .from("subscribers")
        .insert({ email: normalizedEmail });

      if (error) {
        console.error("Subscriber insert error:", error);
        return NextResponse.json(
          { error: "Something went wrong. Please try again." },
          { status: 500 }
        );
      }
    }

    // TODO: Send confirmation email via Resend
    // Once we wire up Resend:
    // await resend.emails.send({
    //   from: "deals@lootboxes.com",
    //   to: normalizedEmail,
    //   subject: "Confirm your subscription to Lootboxes Weekly",
    //   html: confirmationTemplate(normalizedEmail),
    // });

    return NextResponse.json({
      ok: true,
      message: "Thanks for subscribing! Check your email to confirm.",
    });
  } catch (err: any) {
    console.error("Newsletter API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
