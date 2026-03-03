import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
          <span className="text-4xl">🎮</span>
        </div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
        <p className="mt-3 text-gray-500">
          This page doesn&apos;t exist — kind of like that legendary drop you&apos;ve
          been waiting for.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="btn-primary flex items-center gap-2">
            <Home className="h-4 w-4" /> Go Home
          </Link>
          <Link href="/deals" className="btn-secondary flex items-center gap-2">
            <Search className="h-4 w-4" /> Browse Deals
          </Link>
        </div>
      </div>
    </div>
  );
}
