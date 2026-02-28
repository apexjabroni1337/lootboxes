import { Skeleton, TableRowSkeleton } from "@/components/ui/Skeleton";

export default function DealsLoading() {
  return (
    <div className="py-8">
      <div className="container-main">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-80" />

        {/* Filter bar skeleton */}
        <div className="mt-6 flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>

        {/* Table skeleton */}
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full">
            <tbody className="divide-y divide-gray-50">
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={6} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
