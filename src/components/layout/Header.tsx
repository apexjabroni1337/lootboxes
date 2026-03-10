"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Menu,
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
  Package,
} from "lucide-react";
import SearchDialog from "@/components/search/SearchDialog";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";


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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  const [lootboxMegaOpen, setLootboxMegaOpen] = useState(false);
  const [cs2MegaOpen, setCs2MegaOpen] = useState(false);
  const [analyticsMegaOpen, setAnalyticsMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const lootboxMegaRef = useRef<HTMLDivElement>(null);
  const cs2MegaRef = useRef<HTMLDivElement>(null);
  const analyticsMegaRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lootboxTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cs2Timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analyticsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (analyticsMegaRef.current && !analyticsMegaRef.current.contains(e.target as Node)) {
        setAnalyticsMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const closeAllMegas = () => {
    setMegaOpen(false);
    setLootboxMegaOpen(false);
    setCs2MegaOpen(false);
    setAnalyticsMegaOpen(false);
  };
  const openMega = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    closeAllMegas();
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 150);
  };
  const openLootboxMega = () => {
    if (lootboxTimeout.current) clearTimeout(lootboxTimeout.current);
    closeAllMegas();
    setLootboxMegaOpen(true);
  };
  const closeLootboxMega = () => {
    lootboxTimeout.current = setTimeout(() => setLootboxMegaOpen(false), 150);
  };
  const openCs2Mega = () => {
    if (cs2Timeout.current) clearTimeout(cs2Timeout.current);
    closeAllMegas();
    setCs2MegaOpen(true);
  };
  const closeCs2Mega = () => {
    cs2Timeout.current = setTimeout(() => setCs2MegaOpen(false), 150);
  };
  const openAnalyticsMega = () => {
    if (analyticsTimeout.current) clearTimeout(analyticsTimeout.current);
    closeAllMegas();
    setAnalyticsMegaOpen(true);
  };
  const closeAnalyticsMega = () => {
    analyticsTimeout.current = setTimeout(() => setAnalyticsMegaOpen(false), 150);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
        <div className="container-main">
          {/* Main header row */}
          <div className="flex h-16 items-center gap-3">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop Nav */}
            <nav className="hidden items-center lg:flex">
              {/* Loot Boxes mega menu trigger */}
              <div
                ref={lootboxMegaRef}
                className="relative"
                onMouseEnter={openLootboxMega}
                onMouseLeave={closeLootboxMega}
              >
                <button
                  className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  onClick={() => setLootboxMegaOpen(!lootboxMegaOpen)}
                >
                  <Zap className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
                  <span className="whitespace-nowrap">Loot Boxes</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${lootboxMegaOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {lootboxMegaOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-[480px] rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                    {/* Banner */}
                    <div className="bg-purple-50 dark:bg-purple-950/30 px-5 py-2 text-[11px] font-medium text-purple-700 border-b border-purple-100 dark:border-purple-800/30">
                      Loot box analysis, odds & tools for 100+ games
                    </div>

                    {/* 2x3 grid */}
                    <div className="grid grid-cols-2 gap-2 p-4">
                      <Link
                        href="/lootbox"
                        onClick={() => setLootboxMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-brand-50 dark:bg-brand-950/30 px-4 py-3 transition-colors hover:bg-brand-100 dark:hover:bg-brand-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
                          <Gamepad2 className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">All Games</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Browse analyzed games</p>
                        </div>
                      </Link>
                      <Link
                        href="/lootbox/rankings"
                        onClick={() => setLootboxMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 px-4 py-3 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-white">
                          <Trophy className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Rankings</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Best & worst rated</p>
                        </div>
                      </Link>
                      <Link
                        href="/lootbox/odds-comparison"
                        onClick={() => setLootboxMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 px-4 py-3 transition-colors hover:bg-purple-100 dark:hover:bg-purple-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white">
                          <BarChart3 className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Odds Compare</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Side-by-side drop rates</p>
                        </div>
                      </Link>
                      <Link
                        href="/lootbox/value-calculator"
                        onClick={() => setLootboxMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                          <Calculator className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Value Calculator</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Expected value per pull</p>
                        </div>
                      </Link>
                      <Link
                        href="/lootbox/regulations"
                        onClick={() => setLootboxMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 px-4 py-3 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                          <Scale className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Regulations</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Laws by country</p>
                        </div>
                      </Link>
                      <Link
                        href="/lootbox/spending-guides"
                        onClick={() => setLootboxMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 px-4 py-3 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-white">
                          <Wallet className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Spending Guides</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Smart spending tips</p>
                        </div>
                      </Link>
                    </div>

                    {/* CTA bar */}
                    <Link
                      href="/newsletter"
                      onClick={() => setLootboxMegaOpen(false)}
                      className="flex items-center justify-between border-t border-purple-100 dark:border-purple-800/30 bg-purple-50 dark:bg-purple-950/30 px-5 py-2 transition-colors hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-b-xl"
                    >
                      <span className="text-xs font-semibold text-purple-700">Get alerts when new games are analyzed</span>
                      <span className="text-xs font-semibold text-purple-600">Sign up free →</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Analytics mega menu trigger */}
              <div
                ref={analyticsMegaRef}
                className="relative"
                onMouseEnter={openAnalyticsMega}
                onMouseLeave={closeAnalyticsMega}
              >
                <button
                  className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  onClick={() => setAnalyticsMegaOpen(!analyticsMegaOpen)}
                >
                  <LineChart className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
                  <span className="whitespace-nowrap">Analytics</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${analyticsMegaOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {analyticsMegaOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-[480px] rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                    {/* Banner */}
                    <div className="bg-indigo-50 dark:bg-indigo-950/30 px-5 py-2 text-[11px] font-medium text-indigo-700 border-b border-indigo-100 dark:border-indigo-800/30">
                      Data-driven insights into gaming monetization
                    </div>

                    {/* 2x2 grid */}
                    <div className="grid grid-cols-2 gap-2 p-4">
                      <Link
                        href="/analytics"
                        onClick={() => setAnalyticsMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 px-4 py-3 transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                          <LineChart className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Overview</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Industry trends & stats</p>
                        </div>
                      </Link>
                      <Link
                        href="/drop-rates"
                        onClick={() => setAnalyticsMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 px-4 py-3 transition-colors hover:bg-purple-100 dark:hover:bg-purple-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white">
                          <Layers className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Drop Rates</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Real odds across 27+ games</p>
                        </div>
                      </Link>
                      <Link
                        href="/lootbox/transparency-report"
                        onClick={() => setAnalyticsMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-sky-50 dark:bg-sky-950/30 px-4 py-3 transition-colors hover:bg-sky-100 dark:hover:bg-sky-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white">
                          <Eye className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Transparency</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Publisher disclosure grades</p>
                        </div>
                      </Link>
                      <Link
                        href="/methodology"
                        onClick={() => setAnalyticsMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-900 px-4 py-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-600 text-white">
                          <Shield className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">How We Rate</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Scoring methodology</p>
                        </div>
                      </Link>
                    </div>

                    {/* CTA bar */}
                    <Link
                      href="/drop-rates"
                      onClick={() => setAnalyticsMegaOpen(false)}
                      className="flex items-center justify-between border-t border-indigo-100 dark:border-indigo-800/30 bg-indigo-50 dark:bg-indigo-950/30 px-5 py-2 transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-b-xl"
                    >
                      <span className="text-xs font-semibold text-indigo-700">Explore real drop rates for every major game</span>
                      <span className="text-xs font-semibold text-indigo-600">View all →</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/blog"
                className="rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
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
                  className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  onClick={() => setCs2MegaOpen(!cs2MegaOpen)}
                >
                  <Crosshair className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
                  <span className="whitespace-nowrap">CS2 Skins</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${cs2MegaOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {cs2MegaOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-[480px] rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                    {/* Banner */}
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 px-5 py-2 text-[11px] font-medium text-yellow-700 border-b border-yellow-100 dark:border-yellow-800/30">
                      The #1 CS2 skin economy resource — prices, tools & guides
                    </div>

                    {/* 2x2 grid */}
                    <div className="grid grid-cols-2 gap-2 p-4">
                      <Link
                        href="/cs2/prices"
                        onClick={() => setCs2MegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 px-4 py-3 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 text-white">
                          <TrendingUp className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Skin Price Tracker</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Live prices across markets</p>
                        </div>
                      </Link>
                      <Link
                        href="/cs2/simulator"
                        onClick={() => setCs2MegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 px-4 py-3 transition-colors hover:bg-purple-100 dark:hover:bg-purple-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white">
                          <Dices className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Case Simulator</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Open cases with real odds</p>
                        </div>
                      </Link>
                      <Link
                        href="/cs2/investing"
                        onClick={() => setCs2MegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                          <LineChart className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Market Trends</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Price history & market data</p>
                        </div>
                      </Link>
                      <Link
                        href="/cs2/cases"
                        onClick={() => setCs2MegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 px-4 py-3 transition-colors hover:bg-yellow-100 dark:hover:bg-yellow-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-600 text-white">
                          <Package className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Cases & Capsules</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Every case with full contents</p>
                        </div>
                      </Link>
                      <Link
                        href="/cs2/deals"
                        onClick={() => setCs2MegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-green-50 dark:bg-green-950/30 px-4 py-3 transition-colors hover:bg-green-100 dark:hover:bg-green-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                          <Tag className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Best Deals</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Savings across all markets</p>
                        </div>
                      </Link>
                      <Link
                        href="/cs2/trade-up"
                        onClick={() => setCs2MegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 px-4 py-3 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-white">
                          <Calculator className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Trade-Up Calculator</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">EV of trade-up contracts</p>
                        </div>
                      </Link>
                      {/* Float Checker — under construction */}
                      <div
                        className="relative flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-900 px-4 py-3 opacity-50 cursor-not-allowed"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-400 text-white">
                          <Search className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">Float Checker</p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500">Wear values & patterns</p>
                        </div>
                        <span className="absolute top-1 right-2 text-[9px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 bg-gray-200 rounded px-1.5 py-0.5">Under Construction</span>
                      </div>
                    </div>

                    {/* Affiliate CTA bar */}
                    <Link
                      href="/cs2/compare"
                      onClick={() => setCs2MegaOpen(false)}
                      className="flex items-center justify-between border-t border-yellow-100 dark:border-yellow-800/30 bg-yellow-50 dark:bg-yellow-950/30 px-5 py-2 transition-colors hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded-b-xl"
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
                  className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  onClick={() => setMegaOpen(!megaOpen)}
                >
                  <Flame className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                  <span className="whitespace-nowrap">Game Deals</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {megaOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-[480px] rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                    {/* Banner */}
                    <div className="bg-orange-50 dark:bg-orange-950/30 px-5 py-2 text-[11px] font-medium text-orange-600 border-b border-orange-100 dark:border-orange-800/30">
                      Browse deals across all games and genres
                    </div>

                    {/* Featured buttons — 2x2 grid */}
                    <div className="grid grid-cols-2 gap-2 border-b border-gray-100 dark:border-gray-800 p-4">
                      <Link
                        href="/games/new-releases"
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 px-4 py-3 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                          <Clock className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">New Releases</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Latest game launches</p>
                        </div>
                      </Link>
                      <Link
                        href="/deals/trending"
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 px-4 py-3 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 text-white">
                          <TrendingUp className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Trending</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Most popular right now</p>
                        </div>
                      </Link>
                      <Link
                        href="/deals?filter=historic"
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 px-4 py-3 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/40"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-white">
                          <ArrowDownCircle className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Historic Lows</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">All-time lowest prices</p>
                        </div>
                      </Link>
                      <Link
                        href="/games"
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-900 px-4 py-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-600 text-white">
                          <Gamepad2 className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Browse All Games</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Full game catalog</p>
                        </div>
                      </Link>
                    </div>


                    {/* Price alert bar */}
                    <Link
                      href="/newsletter"
                      onClick={() => setMegaOpen(false)}
                      className="flex items-center justify-between border-t border-brand-100 dark:border-brand-800/30 bg-brand-50 dark:bg-brand-950/30 px-5 py-2 transition-colors hover:bg-brand-100 dark:hover:bg-brand-900/40 rounded-b-xl"
                    >
                      <span className="text-xs font-semibold text-brand-700">Price Drop Alerts — Get notified when games hit their lowest price.</span>
                      <span className="text-xs font-semibold text-brand-600">Sign up free →</span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Prominent search bar (desktop) */}
            <div className="hidden flex-1 justify-center lg:flex min-w-0">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex w-full max-w-xs items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400 dark:text-gray-500 transition-all hover:border-brand-300 hover:bg-white hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500 dark:hover:bg-gray-800"
              >
                <Search className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                <span className="flex-1 text-left truncate">Search games, deals...</span>
              </button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Mobile search trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 md:hidden dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Dark mode toggle */}
              <ThemeToggle />

              {/* Newsletter CTA */}
              <Link href="/newsletter" className="btn-primary hidden lg:flex whitespace-nowrap text-sm px-3 py-2">
                Deal Alerts
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800"
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
              <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
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
                <p className="px-3 pt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Loot Boxes
                </p>
                <Link
                  href="/lootbox"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <Zap className="h-4 w-4 text-purple-500" />
                  All Analyzed Games
                </Link>
                <Link
                  href="/lootbox/rankings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Rankings
                </Link>
                <Link
                  href="/lootbox/regulations"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <Scale className="h-4 w-4 text-blue-500" />
                  Regulations Tracker
                </Link>
                <Link
                  href="/lootbox/odds-comparison"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  Odds Comparison
                </Link>
                <Link
                  href="/lootbox/value-calculator"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <Calculator className="h-4 w-4 text-emerald-500" />
                  Value Calculator
                </Link>
                <Link
                  href="/lootbox/spending-guides"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <Wallet className="h-4 w-4 text-amber-500" />
                  Spending Guides
                </Link>

                {/* Game Deals section */}
                <div className="mt-2 border-t border-gray-100 dark:border-gray-800 pt-3">
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Game Deals
                  </p>
                </div>
                <Link
                  href="/deals"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <Flame className="h-4 w-4 text-orange-500" />
                  Hot Deals
                </Link>
                <Link
                  href="/games"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <Gamepad2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Browse All Games
                </Link>

                {/* CS2 Skins section */}
                <div className="mt-2 border-t border-gray-100 dark:border-gray-800 pt-3">
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    CS2 Skins
                  </p>
                </div>
                <Link
                  href="/cs2/prices"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  Skin Price Tracker
                </Link>
                <Link
                  href="/cs2/simulator"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <Dices className="h-4 w-4 text-purple-500" />
                  Case Simulator
                </Link>
                <Link
                  href="/cs2/deals"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <Tag className="h-4 w-4 text-emerald-500" />
                  Best Deals
                </Link>
                <Link
                  href="/cs2/cases"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <Package className="h-4 w-4 text-yellow-600" />
                  Cases & Capsules
                </Link>
                <Link
                  href="/cs2/compare"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <Crosshair className="h-4 w-4 text-yellow-500" />
                  Compare Marketplaces
                </Link>

                {/* Analytics section */}
                <div className="mt-2 border-t border-gray-100 dark:border-gray-800 pt-3">
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Analytics
                  </p>
                </div>
                <Link
                  href="/analytics"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <LineChart className="h-4 w-4 text-indigo-500" />
                  Overview
                </Link>
                <Link
                  href="/drop-rates"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <Layers className="h-4 w-4 text-purple-500" />
                  Drop Rates
                </Link>
                <Link
                  href="/lootbox/transparency-report"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <Eye className="h-4 w-4 text-indigo-500" />
                  Transparency
                </Link>
                <Link
                  href="/methodology"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  <Shield className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  How We Rate
                </Link>

                {/* More section */}
                <div className="mt-2 border-t border-gray-100 dark:border-gray-800 pt-3">
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    More
                  </p>
                </div>
                <Link
                  href="/blog"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:text-white"
                >
                  Blog
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
