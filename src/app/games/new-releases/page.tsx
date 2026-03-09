import Link from "next/link";
import { Calendar, Clock, Rocket } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";
import { createServerClient } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import NewReleasesClient from "./NewReleasesClient";

export const metadata = {
  title: "New Releases & Coming Soon — Latest Games",
  description:
    "Browse the latest game releases and upcoming titles. Track prices from day one across Steam, Epic, GOG, and more.",
};

export const revalidate = 300;

async function getNewReleases() {
  const supabase = createServerClient();
  const today = new Date().toISOString().slice(0, 10);

  // Games released in the last 90 days
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86_400_000)
    .toISOString()
    .slice(0, 10);

  const { data } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, screenshot_image, release_date, genres, platforms, metacritic")
    .lte("release_date", today)
    .gte("release_date", ninetyDaysAgo)
    .not("cover_image", "is", null)
    .order("release_date", { ascending: false })
    .limit(50);

  return data || [];
}

async function getComingSoon() {
  const supabase = createServerClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("games")
    .select("id, title, slug, cover_image, screenshot_image, release_date, genres, platforms")
    .gt("release_date", today)
    .not("cover_image", "is", null)
    .order("release_date", { ascending: true })
    .limit(30);

  return data || [];
}

export default async function NewReleasesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const params = await searchParams;
  const [newReleases, comingSoon] = await Promise.all([
    getNewReleases(),
    getComingSoon(),
  ]);

  return (
    <div className="pb-12">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8 sm:py-10">
        <div className="container-main">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-brand-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              New Releases &amp; Coming Soon
            </h1>
          </div>
          <p className="mt-1 text-gray-500">
            Track the latest games and upcoming titles. Compare prices from day one.
          </p>
        </div>
      </section>

      <div className="container-main mt-8">
        <NewReleasesClient
          newReleases={newReleases}
          comingSoon={comingSoon}
          initialGenre={params.genre || null}
        />
      </div>
    </div>
  );
}
