"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Menu,
  Heart,
  X,
  ChevronDown,
  Flame,
  TrendingDown,
  Tag,
  Gamepad2,
  Swords,
  Globe,
  Crosshair,
  Car,
  Puzzle,
  Users,
  Trophy,
  Zap,
  Box,
  Sparkles,
  Layers,
  ShoppingBag,
  Shield,
} from "lucide-react";
import SearchDialog from "@/components/search/SearchDialog";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

const GENRES = [
  { label: "Action", href: "/deals?genre=action", icon: Swords },
  { label: "RPG", href: "/deals?genre=rpg", icon: Gamepad2 },
  { label: "FPS", href: "/deals?genre=fps", icon: Crosshair },
  { label: "Open World", href: "/deals?genre=open-world", icon: Globe },
  { label: "Racing", href: "/deals?genre=racing", icon: Car },
  { label: "Strategy", href: "/deals?genre=strategy", icon: Puzzle },
  { label: "Multiplayer", href: "/deals?genre=multiplayer", icon: Users },
  { label: "Sports", href: "/deals?genre=sports", icon: Trophy },
];

const QUICK_LINKS = [
  { label: "Under $10", href: "/deals?max=10", color: "bg-success-50 text-success-700" },
  { label: "Under $20", href: "/deals?max=20", color: "bg-brand-50 text-brand-700" },
  { label: "Historic Lows", href: "/deals?filter=historic", color: "bg-amber-50 text-amber-700" },
  { label: "50%+ Off", href: "/deals?min_discount=50", color: "bg-red-50 text-red-700" },
];

const LOOTBOX_TYPES = [
  { label: "Gacha", href: "/lootbox?type=gacha", icon: Sparkles },
  { label: "Loot Box", href: "/lootbox?type=loot_box", icon: Box },
  { label: "Card Pack", href: "/lootbox?type=card_pack", icon: Layers },
  { label: "Cosmetic Shop", href: "/lootbox?type=cosmetic_shop", icon: ShoppingBag },
  { label: "Battle Pass", href: "/lootbox?type=battle_pass", icon: Shield },
];

const LOOTBOX_POPULAR = [
  { label: "Genshin Impact", href: "/lootbox/genshin-impact" },
  { label: "Counter-Strike 2", href: "/lootbox/counter-strike-2" },
  { label: "EA FC 25", href: "/lootbox/ea-fc-25" },
  { label: "Fortnite", href: "/lootbox/fortnite" },
  { label: "Apex Legends", href: "/lootbox/apex-legends" },
  { label: "Valorant", href: "/lootbox/valorant" },
];

const TRENDING_SEARCHES = [
  "Genshin Impact",
  "Fortnite",
  "Diablo Immortal",
  "Valorant",
  "EA FC 25",
];

export default function Header() {
  const { count: wishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  const [lootboxMegaOpen, setLootboxMegaOpen] = useState(false);
  const [lootboxDealsOpen, setLootboxDealsOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const lootboxMegaRef = useRef<HTMLDivElement>(null);
  const lootboxDealsRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lootboxTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lootboxDealsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Close mega menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
      if (lootboxMegaRef.current && !lootboxMegaRef.current.contains(e.target as Node)) {
        setLootboxMegaOpen(false);
      }
      if (lootboxDealsRef.current && !lootboxDealsRef.current.contains(e.target as Node)) {
        setLootboxDealsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openMega = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
    setLootboxMegaOpen(false);
    setLootboxDealsOpen(false);
  };
  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 150);
  };
  const openLootboxMega = () => {
    if (lootboxTimeout.current) clearTimeout(lootboxTimeout.current);
    setLootboxMegaOpen(true);
    setMegaOpen(false);
    setLootboxDealsOpen(false);
  };
  const closeLootboxMega = () => {
    lootboxTimeout.current = setTimeout(() => setLootboxMegaOpen(false), 150);
  };
  const openLootboxDeals = () => {
    if (lootboxDealsTimeout.current) clearTimeout(lootboxDealsTimeout.current);
    setLootboxDealsOpen(true);
    setMegaOpen(false);
    setLootboxMegaOpen(false);
  };
  const closeLootboxDeals = () => {
    lootboxDealsTimeout.current = setTimeout(() => setLootboxDealsOpen(false), 150);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
        <div className="container-main">
          {/* Main header row */}
          <div className="flex h-16 items-center gap-4">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {/* Loot Box mega menu trigger */}
              <div
                ref={lootboxMegaRef}
                className="relative"
                onMouseEnter={openLootboxMega}
                onMouseLeave={closeLootboxMega}
              >
                <button
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                  onClick={() => setLootboxMegaOpen(!lootboxMegaOpen)}
                >
                  <Zap className="h-3.5 w-3.5 text-purple-500" />
                  Loot Boxes
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${lootboxMegaOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {lootboxMegaOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-[480px] rounded-xl border border-gray-200 bg-white shadow-xl">
                    {/* Featured links at top */}
                    <div className="flex gap-2 border-b border-gray-100 p-4">
                      <Link
                        href="/lootbox"
                        onClick={() => setLootboxMegaOpen(false)}
                        className="flex flex-1 items-center gap-3 rounded-lg bg-brand-50 px-4 py-3 transition-colors hover:bg-brand-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
                          <Gamepad2 className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">All Analyzed Games</p>
                          <p className="text-[11px] text-gray-500">Browse 300+ games</p>
                        </div>
                      </Link>
                      <Link
                        href="/lootbox/rankings"
                        onClick={() => setLootboxMegaOpen(false)}
                        className="flex flex-1 items-center gap-3 rounded-lg bg-amber-50 px-4 py-3 transition-colors hover:bg-amber-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white">
                          <Trophy className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Rankings</p>
                          <p className="text-[11px] text-gray-500">Best & worst rated</p>
                        </div>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-6 p-5">
                      {/* By System Type */}
                      <div>
                        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          By System Type
                        </h4>
                        <div className="space-y-0.5">
                          {LOOTBOX_TYPES.map((t) => (
                            <Link
                              key={t.label}
                              href={t.href}
                              onClick={() => setLootboxMegaOpen(false)}
                              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                            >
                              <t.icon className="h-4 w-4 text-gray-400" />
                              {t.label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Popular Games */}
                      <div>
                        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Popular Games
                        </h4>
                        <div className="space-y-0.5">
                          {LOOTBOX_POPULAR.map((g) => (
                            <Link
                              key={g.label}
                              href={g.href}
                              onClick={() => setLootboxMegaOpen(false)}
                              className="block rounded-lg px-2.5 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                            >
                              {g.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="flex items-center gap-2 border-t border-gray-100 px-5 py-3">
                      <Link
                        href="/methodology"
                        onClick={() => setLootboxMegaOpen(false)}
                        className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-200"
                      >
                        How We Rate
                      </Link>
                      <Link
                        href="/drop-rates"
                        onClick={() => setLootboxMegaOpen(false)}
                        className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-200"
                      >
                        Drop Rate Database
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/analytics"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Analytics
              </Link>

              {/* Lootbox Deals mega menu trigger */}
              <div
                ref={lootboxDealsRef}
                className="relative"
                onMouseEnter={openLootboxDeals}
                onMouseLeave={closeLootboxDeals}
              >
                <button
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setLootboxDealsOpen(!lootboxDealsOpen)}
                >
                  <Box className="h-3.5 w-3.5 text-purple-500" />
                  Lootbox Deals
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${lootboxDealsOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {lootboxDealsOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-[560px] rounded-xl border border-gray-200 bg-white shadow-xl">
                    {/* Banner */}
                    <div className="bg-purple-50 px-5 py-2 text-[11px] font-medium text-purple-600 border-b border-purple-100">
                      Showing deals exclusively for games with loot box systems
                    </div>

                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Genres column */}
                        <div>
                          <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Browse by Genre
                          </h4>
                          <div className="space-y-0.5">
                            {GENRES.map((g) => {
                              const lbHref = g.href.includes("?") ? g.href + "&has_lootbox=true" : g.href + "?has_lootbox=true";
                              return (
                                <Link
                                  key={g.label}
                                  href={lbHref}
                                  onClick={() => setLootboxDealsOpen(false)}
                                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                                >
                                  <g.icon className="h-4 w-4 text-gray-400" />
                                  {g.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>

                        {/* Quick links */}
                        <div>
                          <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Quick Filters
                          </h4>
                          <div className="space-y-2">
                            {QUICK_LINKS.map((q) => {
                              const lbHref = q.href.includes("?") ? q.href + "&has_lootbox=true" : q.href + "?has_lootbox=true";
                              return (
                                <Link
                                  key={q.label}
                                  href={lbHref}
                                  onClick={() => setLootboxDealsOpen(false)}
                                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:opacity-80 ${q.color}`}
                                >
                                  {q.label}
                                </Link>
                              );
                            })}
                          </div>

                          <div className="mt-5 rounded-lg border border-purple-100 bg-purple-50 p-3">
                            <p className="text-xs font-semibold text-purple-700">
                              Lootbox Price Alerts
                            </p>
                            <p className="mt-0.5 text-[11px] text-purple-600">
                              Get notified when loot box games hit their lowest price.
                            </p>
                            <Link
                              href="/newsletter"
                              onClick={() => setLootboxDealsOpen(false)}
                              className="mt-2 inline-block text-xs font-semibold text-purple-700 hover:text-purple-800"
                            >
                              Sign up free →
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Bottom bar */}
                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                        <Link
                          href="/games?has_lootbox=true"
                          onClick={() => setLootboxDealsOpen(false)}
                          className="text-sm font-medium text-purple-600 hover:text-purple-700"
                        >
                          Browse all lootbox game deals →
                        </Link>
                        <div className="flex gap-2">
                          <Link
                            href="/games/new-releases?has_lootbox=true"
                            onClick={() => setLootboxDealsOpen(false)}
                            className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-200"
                          >
                            New Releases
                          </Link>
                          <Link
                            href="/deals?sort=trending&has_lootbox=true"
                            onClick={() => setLootboxDealsOpen(false)}
                            className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-200"
                          >
                            Trending
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hot Deals mega menu trigger */}
              <div
                ref={megaRef}
                className="relative"
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <button
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                  onClick={() => setMegaOpen(!megaOpen)}
                >
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  Game Deals
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Mega menu dropdown */}
                {megaOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-[560px] rounded-xl border border-gray-200 bg-white shadow-xl">
                    {/* Banner */}
                    <div className="bg-orange-50 px-5 py-2 text-[11px] font-medium text-orange-600 border-b border-orange-100">
                      Showing deals across all games and genres
                    </div>

                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Genres column */}
                        <div>
                          <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Browse by Genre
                          </h4>
                          <div className="space-y-0.5">
                            {GENRES.map((g) => (
                              <Link
                                key={g.label}
                                href={g.href}
                                onClick={() => setMegaOpen(false)}
                                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                              >
                                <g.icon className="h-4 w-4 text-gray-400" />
                                {g.label}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Quick links + featured */}
                        <div>
                          <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Quick Filters
                          </h4>
                          <div className="space-y-2">
                            {QUICK_LINKS.map((q) => (
                              <Link
                                key={q.label}
                                href={q.href}
                                onClick={() => setMegaOpen(false)}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:opacity-80 ${q.color}`}
                              >
                                {q.label}
                              </Link>
                            ))}
                          </div>

                          <div className="mt-5 rounded-lg border border-brand-100 bg-brand-50 p-3 dark:border-brand-900 dark:bg-brand-950">
                            <p className="text-xs font-semibold text-brand-700">
                              Price Drop Alerts
                            </p>
                            <p className="mt-0.5 text-[11px] text-brand-600">
                              Get notified when games hit their lowest price.
                            </p>
                            <Link
                              href="/newsletter"
                              onClick={() => setMegaOpen(false)}
                              className="mt-2 inline-block text-xs font-semibold text-brand-700 hover:text-brand-800"
                            >
                              Sign up free →
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Bottom bar */}
                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                        <Link
                          href="/games"
                          onClick={() => setMegaOpen(false)}
                          className="text-sm font-medium text-orange-600 hover:text-orange-700"
                        >
                          Browse all game deals →
                        </Link>
                        <div className="flex gap-2">
                          <Link
                            href="/games/new-releases"
                            onClick={() => setMegaOpen(false)}
                            className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-200"
                          >
                            New Releases
                          </Link>
                          <Link
                            href="/deals?sort=trending"
                            onClick={() => setMegaOpen(false)}
                            className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-200"
                          >
                            Trending
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/blog"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Blog
              </Link>
            </nav>

            {/* Prominent search bar (desktop) */}
            <div className="hidden flex-1 justify-center md:flex">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex w-full max-w-md items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-400 transition-all hover:border-brand-300 hover:bg-white hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500 dark:hover:bg-gray-800"
              >
                <Search className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <span className="flex-1 text-left">Search games, deals, or analytics...</span>
              </button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Mobile search trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Dark mode toggle */}
              <ThemeToggle />

              {/* Newsletter CTA */}
              <Link href="/newsletter" className="btn-primary hidden md:flex">
                Get Deal Alerts
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
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
          <div className="hidden border-t border-gray-100 md:block dark:border-gray-800">
            <div className="flex items-center gap-2 py-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                Trending:
              </span>
              {TRENDING_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="rounded-full bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Nav */}
          {mobileOpen && (
            <div className="border-t border-gray-100 py-4 lg:hidden dark:border-gray-800">
              <nav className="flex flex-col gap-1">
                <Link
                  href="/lootbox"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <Zap className="h-4 w-4 text-purple-500" />
                  Loot Box Database
                </Link>
                <Link
                  href="/deals"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <Flame className="h-4 w-4 text-orange-500" />
                  Game Deals
                </Link>
                <Link
                  href="/analytics"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  Analytics
                </Link>
                <Link
                  href="/drop-rates"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  Drop Rates
                </Link>

                {/* Mobile quick filters */}
                <div className="mt-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Quick Filters
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 px-3">
                    {QUICK_LINKS.map((q) => (
                      <Link
                        key={q.label}
                        href={q.href}
                        onClick={() => setMobileOpen(false)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium ${q.color}`}
                      >
                        {q.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="/newsletter"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary mt-3 text-center"
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
