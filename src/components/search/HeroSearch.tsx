"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length >= 2) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl">
      <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white dark:bg-gray-950/95 p-2 shadow-lg backdrop-blur-sm">
        <Search className="ml-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search games, deals, or analytics..."
          className="flex-1 border-0 bg-transparent text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400"
        />
        <button type="submit" className="btn-primary">
          Search
        </button>
      </div>
    </form>
  );
}
