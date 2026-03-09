import Link from "next/link";
import { Calendar, Clock, Rocket } from "lucide-react";
import GameAvatar from "@/components/ui/GameAvatar";
import GenreFilter from "@/components/games/GenreFilter";
import { createServerClient } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

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

function GameCard({ game }: { game: any }) {
  const img = game.screenshot_image || game.cover_image;
  const genres = game.genres || [];

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg hover:-translate-y-0.5 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
        {img ? (
          <img
            src={img}
            alt={game.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <GameAvatar gameName={game.title} size="sm" aspectRatio="video" />
        )}
        {game.metacritic && (
          <div className="absolute top-2 right-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {game.metacritic}/100
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 line-clamp-1 dark:text-gray-100">
          {game.title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          {game.release_date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(game.release_date)}
            </span>
          )}
        </div>
        {genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {genres.slice(0, 3).map((g: string) => (
              <span
                key={g}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
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

  const allGames = [...newReleases, ...comingSoon];
  const initialGenre = params.genre || null;

  return (
    <div className="pb-12">
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8 sm:py-10 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
        <div className="container-main">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-brand-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              New Releases & Coming Soon
            </h1>
          </div>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Track the latest games and upcoming titles. Compare prices from day one.
          </p>
        </div>
      </section>

      <div className="container-main mt-8">
        {/* Genre filter */}
        <div className="mb-6">
          <GenreFilter
            games={allGames}
            initialGenre={initialGenre}
            renderGames={(filtered) => {
              const newReleaseIds = new Set(newReleases.map((g: any) => g.id));
              const filteredNew = filtered.filter((g: any) => newReleaseIds.has(g.id));
              const filteredComing = filtered.filter((g: any) => !newReleaseIds.has(g.id));

              return (
                <>
                  {/* New Releases */}
                  {filteredNew.length > 0 && (
                    <section className="mt-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          New Releases
                        </h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Last 90 days
                        </span>
                      </div>
                      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {filteredNew.map((game: any) => (
                          <GameCard key={game.id} game={game} />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Coming Soon */}
                  {filteredComing.length > 0 && (
                    <section className="mt-12">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Coming Soon
                        </h2>
                        <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-3.5 w-3.5" />
                          Upcoming titles
                        </span>
                      </div>
                      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {filteredComing.map((game: any) => (
                          <GameCard key={game.id} game={game} />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Empty state */}
                  {filteredNew.length === 0 && filteredComing.length === 0 && (
                    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
                      <Rocket className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                        No releases found
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Try removing the genre filter or check back soon!
                      </p>
                      <Link href="/deals" className="btn-primary mt-6 inline-flex">
                        Browse Deals Instead
                      </Link>
                    </div>
                  )}
                </>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
