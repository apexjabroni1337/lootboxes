import { Skeleton, GameCardSkeleton } from "@/components/ui/Skeleton";

export default function GamesLoading() {
  return (
    <div className="py-8">
      <div className="container-main">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="mt-2 h-4 w-72" />

        <div className="mt-4 flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-16 rounded-full" />
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
