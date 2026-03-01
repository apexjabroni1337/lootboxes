"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import SearchDialog from "@/components/search/SearchDialog";

const NAV_ITEMS = [
  { label: "Hot Deals", href: "/deals" },
  { label: "Games", href: "/games" },
  { label: "Analytics", href: "/analytics" },
  { label: "Drop Rates", href: "/drop-rates" },
];

const TRENDING_SEARCHES = [
  "Elden Ring",
  "Baldur's Gate 3",
  "Cyberpunk",
  "Hogwarts",
  "Red Dead",
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Cmd+K / Ctrl+K shortcut to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="container-main">
          {/* Main header row */}
          <div className="flex h-16 items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex flex-shrink-0 items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
                <span className="text-lg font-bold text-white">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Loot<span className="text-brand-600">boxes</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Prominent search bar (desktop) */}
            <div className="hidden flex-1 justify-center md:flex">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex w-full max-w-md items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-400 transition-all hover:border-brand-300 hover:bg-white hover:shadow-sm"
              >
                <Search className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <span className="flex-1 text-left">Search games, deals, or analytics...</span>
                <kbd className="hidden rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 lg:inline">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Mobile search trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Newsletter CTA */}
              <Link href="/newsletter" className="btn-primary hidden md:flex">
                Get Deal Alerts
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Trending searches bar (desktop only) */}
          <div className="hidden border-t border-gray-100 md:block">
            <div className="flex items-center gap-2 py-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Trending:
              </span>
              {TRENDING_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="rounded-full bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500 transition-colors hover:bg-brand-50 hover:text-brand-600"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Nav */}
          {mobileOpen && (
            <div className="border-t border-gray-100 py-4 lg:hidden">
              <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/newsletter"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary mt-2 text-center"
                >
                  Get Deal Alerts
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search dialog overlay */}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
