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
  Crosshair,
  Dices,
  LineChart,
  Calculator,
  ExternalLink,
  BarChart3,
  Scale,
  Wallet,
  Eye,
} from "lucide-react";
import SearchDialog from "@/components/search/SearchDialog";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useWishlist } from "@/components/wishlist/WishlistProvider";


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
  const [cs2MegaOpen, setCs2MegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const lootboxMegaRef = useRef<HTMLDivElement>(null);
  const cs2MegaRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lootboxTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cs2Timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (cs2MegaRef.current && !cs2MegaRef.current.contains(e.target as Node)) {
        setCs2MegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openMega = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
    setLootboxMegaOpen(false);
    setCs2MegaOpen(false);
  };
  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 150);
  };
  const openLootboxMega = () => {
    if (lootboxTimeout.current) clearTimeout(lootboxTimeout.current);
    setLootboxMegaOpen(true);
    setMegaOpen(false);
    setCs2MegaOpen(false);
  };
  const closeLootboxMega = () => {
    lootboxTimeout.current = setTimeout(() => setLootboxMegaOpen(false), 150);
  };
  const openCs2Mega = () => {
    if (cs2Timeout.current) clearTimeout(cs2Timeout.current);
    setCs2MegaOpen(true);
    setMegaOpen(false);
    setLootboxMegaOpen(false);
  };
  const closeCs2Mega = () => {
    cs2Timeout.current = setTimeout(() => setCs2MegaOpen(false), 150);
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
                  <div className="absolute left-0 top-full z-50 mt-1 w-[600px] rounded-xl border border-gray-200 bg-white shadow-xl">
                    {/* 3-column categorized layout */}
                    <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100 p-4">
                      {/* BROWSE column */}
                      <div className="pr-4">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Browse</p>
                        <div className="space-y-1">
                          <Link href="/lootbox" onClick={() => setLootboxMegaOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors">
                            <Gamepad2 className="h-4 w-4 text-brand-500" />
                            All Games
                          </Link>
                          <Link href="/lootbox/rankings" onClick={() => setLootboxMegaOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                            <Trophy className="h-4 w-4 text-amber-500" />
                            Rankings
                          </Link>
                          <Link href="/lootbox/regulations" onClick={() => setLootboxMegaOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                            <Scale className="h-4 w-4 text-blue-500" />
                            Regulations
                          </Link>
                        </div>
                      </div>
                      {/* TOOLS column */}
                      <div className="px-4">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Tools</p>
                        <div className="space-y-1">
                          <Link href="/lootbox/odds-comparison" onClick={() => setLootboxMegaOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                            <BarChart3 className="h-4 w-4 text-purple-500" />
                            Odds Compare
                          </Link>
                          <Link href="/lootbox/value-calculator" onClick={() => setLootboxMegaOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                            <Calculator className="h-4 w-4 text-emerald-500" />
                            Value Calc
                          </Link>
                          <Link href="/lootbox/spending-guides" onClick={() => setLootboxMegaOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                            <Wallet className="h-4 w-4 text-amber-500" />
                            Spending Guides
                          </Link>
                        </div>
                      </div>
                      {/* DATA column */}
                      <div className="pl-4">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Data</p>
                        <div className="space-y-1">
                          <Link href="/drop-rates" onClick={() => setLootboxMegaOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                            <Layers className="h-4 w-4 text-purple-500" />
                            Drop Rates
                          </Link>
                          <Link href="/lootbox/transparency-report" onClick={() => setLootboxMegaOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                            <Eye className="h-4 w-4 text-indigo-500" />
                            Transparency
                          </Link>
                          <Link href="/methodology" onClick={() => setLootboxMegaOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                            <Shield className="h-4 w-4 text-gray-500" />
                            How We Rate
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* Price alert bar */}
                    <Link
                      href="/newsletter"
                      onClick={() => setLootboxMegaOpen(false)}
                      className="flex items-center justify-between border-t border-brand-100 bg-brand-50 px-5 py-2 transition-colors hover:bg-brand-100 rounded-b-xl"
                    >
                      <span className="text-xs font-semibold text-brand-700">Price Drop Alerts — Get notified when games hit their lowest price.</span>
                      <span className="text-xs font-semibold text-brand-600">Sign up free →</span>
                    </Link>
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

              {/* CS2 Skins dropdown */}
              <div
                ref={cs2MegaRef}
                className="relative"
                onMouseEnter={openCs2Mega}
                onMouseLeave={closeCs2Mega}
              >
                <button
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setCs2MegaOpen(!cs2MegaOpen)}
                >
                  <Crosshair className="h-3.5 w-3.5 text-yellow-500" />
                  CS2 Skins
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${cs2MegaOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {cs2MegaOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-[480px] rounded-xl border border-gray-200 bg-white shadow-xl">
                    {/* Banner */}
                    <div className="bg-yellow-50 px-5 py-2 text-[11px] font-medium text-yellow-700 border-b border-yellow-100">
                      The #1 CS2 skin economy resource — prices, tools & guides
                    </div>

                    {/* 2x2 grid */}
                    <div className="grid grid-cols-2 gap-2 p-4">
                      <Link
                        href="/cs2/prices"
                        onClick={() => setCs2MegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-orange-50 px-4 py-3 transition-colors hover:bg-orange-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
                          <TrendingUp className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Skin Price Tracker</p>
                          <p className="text-[11px] text-gray-500">Live prices across markets</p>
                        </div>
                      </Link>
                      <Link
                        href="/cs2/simulator"
                        onClick={() => setCs2MegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-purple-50 px-4 py-3 transition-colors hover:bg-purple-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white">
                          <Dices className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Case Simulator</p>
                          <p className="text-[11px] text-gray-500">Open cases with real odds</p>
                        </div>
                      </Link>
                      <Link
                        href="/cs2/investing"
                        onClick={() => setCs2MegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-emerald-50 px-4 py-3 transition-colors hover:bg-emerald-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                          <LineChart className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Investment Guide</p>
                          <p className="text-[11px] text-gray-500">ROI data & skin trends</p>
                        </div>
                      </Link>
                      <Link
                        href="/cs2/float-checker"
                        onClick={() => setCs2MegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 transition-colors hover:bg-blue-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-white">
                          <Search className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Float Checker</p>
                          <p className="text-[11px] text-gray-500">Wear values & patterns</p>
                        </div>
                      </Link>
                      <Link
                        href="/cs2/trade-up"
                        onClick={() => setCs2MegaOpen(false)}
                        className="col-span-2 flex items-center gap-3 rounded-lg bg-amber-50 px-4 py-3 transition-colors hover:bg-amber-100"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white">
                          <Calculator className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Trade-Up Calculator</p>
                          <p className="text-[11px] text-gray-500">Calculate expected value of trade-up contracts</p>
                        </div>
                      </Link>
                    </div>

                    {/* Affiliate CTA bar */}
                    <Link
                      href="/cs2/compare"
                      onClick={() => setCs2MegaOpen(false)}
                      className="flex items-center justify-between border-t border-yellow-100 bg-yellow-50 px-5 py-2 transition-colors hover:bg-yellow-100 rounded-b-xl"
                    >
                      <span className="text-xs font-semibold text-yellow-800">Compare prices across 5+ skin marketplaces</span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-yellow-700">
                        Compare now <ExternalLink className="h-3 w-3" />
                      </span>
                    </Link>
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


                    {/* Price alert bar */}
                    <Link
                      href="/newsletter"
                      onClick={() => setMegaOpen(false)}
                      className="flex items-center justify-between border-t border-brand-100 bg-brand-50 px-5 py-2 transition-colors hover:bg-brand-100 rounded-b-xl"
                    >
                      <span className="text-xs font-semibold text-brand-700">Price Drop Alerts — Get notified when games hit their lowest price.</span>
                      <span className="text-xs font-semibold text-brand-600">Sign up free →</span>
                    </Link>
                  </div>
                )}
              </div>
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
                {/* Loot Boxes — Browse */}
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
                  href="/lootbox/regulations"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Scale className="h-4 w-4 text-blue-500" />
                  Regulations Tracker
                </Link>
                <Link
                  href="/lootbox/odds-comparison"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  Odds Comparison
                </Link>
                <Link
                  href="/lootbox/value-calculator"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Calculator className="h-4 w-4 text-emerald-500" />
                  Value Calculator
                </Link>
                <Link
                  href="/lootbox/spending-guides"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Wallet className="h-4 w-4 text-amber-500" />
                  Spending Guides
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

                {/* CS2 Skins section */}
                <div className="mt-2 border-t border-gray-100 pt-3">
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    CS2 Skins
                  </p>
                </div>
                <Link
                  href="/cs2/prices"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  Skin Price Tracker
                </Link>
                <Link
                  href="/cs2/simulator"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Dices className="h-4 w-4 text-purple-500" />
                  Case Simulator
                </Link>
                <Link
                  href="/cs2/compare"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Crosshair className="h-4 w-4 text-yellow-500" />
                  Compare Marketplaces
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
