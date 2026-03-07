"use client";

import { useState } from "react";
import { TrendingUp, CheckCircle, Loader2 } from "lucide-react";

/**
 * CS2-specific newsletter signup CTA.
 * Calls the existing /api/newsletter endpoint.
 */
export default function CS2NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || email.length < 5 || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("You're in! Watch your inbox for CS2 market reports.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 text-center">
        <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
        <p className="font-semibold text-emerald-900">{message}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900">Get Weekly CS2 Market Reports</h3>
          </div>
          <p className="text-sm text-gray-600">
            Price drops, trend alerts, and investment opportunities — delivered to your inbox every week.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 sm:w-96">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
          </button>
        </form>
      </div>
      {status === "error" && (
        <p className="mt-3 text-sm text-red-500">{message}</p>
      )}
    </div>
  );
}
