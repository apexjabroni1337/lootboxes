"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";

interface PriceAlertFormProps {
  gameTitle: string;
  gameSlug: string;
  currentBestPrice?: number;
}

export default function PriceAlertForm({
  gameTitle,
  gameSlug,
  currentBestPrice,
}: PriceAlertFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // In production, this would call an API endpoint
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-success-200 bg-success-50 p-5">
        <div className="flex items-center gap-2 text-success-700">
          <Check className="h-5 w-5" />
          <span className="font-semibold">Price alert set!</span>
        </div>
        <p className="mt-1 text-sm text-success-600">
          We&apos;ll email you at <strong>{email}</strong> when{" "}
          <strong>{gameTitle}</strong> drops in price.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-brand-600" />
        <h3 className="text-sm font-semibold text-gray-900">
          Get Price Drop Alerts
        </h3>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        We&apos;ll notify you when {gameTitle} hits a new low price.
        {currentBestPrice !== undefined && (
          <> Current best: <strong>${currentBestPrice.toFixed(2)}</strong></>
        )}
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="input flex-1"
        />
        <button type="submit" className="btn-primary flex-shrink-0">
          Set Alert
        </button>
      </form>
    </div>
  );
}
