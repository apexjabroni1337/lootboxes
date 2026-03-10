"use client";

import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

interface NewsletterFormProps {
  /** "inline" = single row (header/footer), "stacked" = full form (newsletter page) */
  variant?: "inline" | "stacked";
  className?: string;
}

export default function NewsletterForm({
  variant = "inline",
  className = "",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

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
        setMessage(data.message || "You're subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className={`flex items-center gap-2 rounded-lg bg-success-50 px-4 py-3 text-sm text-success-700 ${className}`}>
        <CheckCircle className="h-5 w-5 flex-shrink-0" />
        <span>{message}</span>
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <form onSubmit={handleSubmit} className={className}>
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="you@email.com"
              className="input w-full py-3 pl-11 text-base"
              disabled={status === "loading"}
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary w-full py-3 text-base disabled:opacity-60"
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Subscribing...
              </span>
            ) : (
              "Subscribe — It's Free"
            )}
          </button>
        </div>
        {status === "error" && (
          <p className="mt-2 text-sm text-danger-600">{message}</p>
        )}
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          No spam. Unsubscribe anytime. We respect your inbox.
        </p>
      </form>
    );
  }

  // Inline variant (single row)
  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        placeholder="you@email.com"
        className="input flex-1 text-sm"
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary whitespace-nowrap text-sm disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Subscribe"
        )}
      </button>
      {status === "error" && (
        <p className="absolute mt-11 text-xs text-danger-600">{message}</p>
      )}
    </form>
  );
}
