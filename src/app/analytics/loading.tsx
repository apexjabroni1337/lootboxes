import { Skeleton, ArticleCardSkeleton } from "@/components/ui/Skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="py-8">
      <div className="container-main">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="mt-2 h-4 w-96" />

        <div className="mt-6 flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
