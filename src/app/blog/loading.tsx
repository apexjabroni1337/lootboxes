import { Skeleton, ArticleCardSkeleton } from "@/components/ui/Skeleton";

export default function BlogLoading() {
  return (
    <div className="py-8">
      <div className="container-main">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="mt-2 h-4 w-80" />

        {/* Featured post skeleton */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
          <Skeleton className="h-56 w-full" />
          <div className="space-y-3 p-6">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
