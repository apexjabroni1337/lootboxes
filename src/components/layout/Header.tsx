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
  Clock,
  TrendingUp,
  ArrowDownCircle,
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
  const megaRef = useRef<HTMLDivElement>(null);
  const lootboxMegaRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lootboxTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openMega = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
    setLootboxMegaOpen(false);
  };
  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 150);
  };
  const openLootboxMega = () => {
    if (lootboxTimeout.current) clearTimeout(lootboxTimeout.current);
    setLootboxMegaOpen(true);
    setMegaOpen(false);
  };
  const closeLootboxMega = () => {
    lootboxTimeout.current = setTimeout(() => setLootboxMegaOpen(false), 150);
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
              {/* Loot Boxes mega menu trigger */}
              <div
                ref={lootboxMegaRef}
                className="relative"
                onMouseEnter={openLootboxMega}
                onMouseLeave={closeLootboxMega}
              >
                <button
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
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
                    {/* Button grid */}
                    <div className="grid grid-cols-2 gap-2 p-4">
                      <Link
                        href="/lootbox"
                        onClick={() => setLootboxMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-brand-50 px-4 py-3 transition-colors hover:bg-brand-100"
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
                        className="flex items-center gap-3 rounded-lg bg-amber-50 px-4 py-3 transition-colors hover:bg-amber-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white">
                          <Trophy className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Rankings</p>
                          <p className="text-[11px] text-gray-500">Best & worst rated</p>
                        </div>
                      </Link>
                      <Link
                        href="/deals?has_lootbox=true"
                        onClick={() => setLootboxMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3 transition-colors hover:bg-green-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white">
                          <Tag className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Lootbox Deals</p>
                          <p className="text-[11px] text-gray-500">Sales on lootbox games</p>
                        </div>
                      </Link>
                      <Link
                        href="/drop-rates"
                        onClick={() => setLootboxMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-purple-50 px-4 py-3 transition-colors hover:bg-purple-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white">
                          <Layers className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Drop Rates</p>
                          <p className="text-[11px] text-gray-500">Official drop rate data</p>
                        </div>
                      </Link>
                      <Link
                        href="/methodology"
                        onClick={() => setLootboxMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-600 text-white">
                          <Shield className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">How We Rate</p>
                          <p className="text-[11px] text-gray-500">Our scoring methodology</p>
                        </div>
                      </Link>
                      <Link
                        href="/newsletter"
                        onClick={() => setLootboxMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-red-50 px-4 py-3 transition-colors hover:bg-red-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500 text-white">
                          <Flame className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Price Alerts</p>
                          <p className="text-[11px] text-gray-500">Get deal notifications</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Game Deals dropdown */}
              <div
                ref={megaRef}
                className="relative"
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <button
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setMegaOpen(!megaOpen)}
                >
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  Game Deals
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {megaOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-[480px] rounded-xl border border-gray-200 bg-white shadow-xl">
                    {/* Banner */}
                    <div className="bg-orange-50 px-5 py-2 text-[11px] font-medium text-orange-600 border-b border-orange-100">
                      Browse deals across all games and genres
                    </div>

                    {/* Featured buttons — 2x2 grid */}
                    <div className="grid grid-cols-2 gap-2 border-b border-gray-100 p-4">
                      <Link
                        href="/games/new-releases"
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 transition-colors hover:bg-blue-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-white">
                          <Clock className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">New Releases</p>
                          <p className="text-[11px] text-gray-500">Latest game launches</p>
                        </div>
                      </Link>
                      <Link
                        href="/deals?sort=trending"
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-orange-50 px-4 py-3 transition-colors hover:bg-orange-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
                          <TrendingUp className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Trending</p>
                          <p className="text-[11px] text-gray-500">Most popular right now</p>
                        </div>
                      </Link>
                      <Link
                        href="/deals?filter=historic"
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-amber-50 px-4 py-3 transition-colors hover:bg-amber-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white">
                          <ArrowDownCircle className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Historic Lows</p>
                          <p className="text-[11px] text-gray-500">All-time lowest prices</p>
                        </div>
                      </Link>
                      <Link
                        href="/games"
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-600 text-white">
                          <Gamepad2 className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Browse All Games</p>
                          <p className="text-[11px] text-gray-500">Full game catalog</p>
                        </div>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-6 p-5">
                      {/* Genres column */}
                      <div>
                        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          By Genre
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

                      {/* Quick filters */}
                      <div>
                        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          Quick Filters
                        </h4>
                        <div className="space-y-1.5">
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

                        <div className="mt-5 rounded-lg border border-brand-100 bg-brand-50 p-3">
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
                    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
                      <Link
                        href="/deals"
                        onClick={() => setMegaOpen(false)}
                        className="text-sm font-medium text-orange-600 hover:text-orange-700"
                      >
                        View all deals →
                      </Link>
                      <Link
                        href="/newsletter"
                        onClick={() => setMegaOpen(false)}
                        className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold text-brand-600 hover:bg-brand-100"
                      >
                        Price Alerts
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/analytics"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                Analytics
              </Link>

              <Link
                href="/blog"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
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
                {/* Loot Boxes section */}
                <p className="px-3 pt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Loot Boxes
                </p>
                <Link
                  href="/lootbox"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Zap className="h-4 w-4 text-purple-500" />
                  All Analyzed Games
                </Link>
                <Link
                  href="/lootbox/rankings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Rankings
                </Link>
                <Link
                  href="/deals?has_lootbox=true"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Tag className="h-4 w-4 text-brand-500" />
                  Lootbox Game Deals
                </Link>

                {/* Game Deals section */}
                <div className="mt-2 border-t border-gray-100 pt-3">
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Game Deals
                  </p>
                </div>
                <Link
                  href="/deals"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Flame className="h-4 w-4 text-orange-500" />
                  Hot Deals
                </Link>
                <Link
                  href="/games"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Gamepad2 className="h-4 w-4 text-gray-500" />
                  Browse All Games
                </Link>

                {/* More section */}
                <div className="mt-2 border-t border-gray-100 pt-3">
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    More
                  </p>
                </div>
                <Link
                  href="/analytics"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  Analytics
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  Blog
                </Link>
                <Link
                  href="/drop-rates"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  Drop Rates
                </Link>

                {/* Mobile quick filters */}
                <div className="mt-2 border-t border-gray-100 pt-3">
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
