import { cn } from "@/lib/utils";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gray-200",
        className
      )}
    />
  );
}

export function DealCardSkeleton() {
  return (
    <div className="card">
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function GameCardSkeleton() {
  return (
    <div className="card flex gap-4">
      <Skeleton className="h-24 w-16 flex-shrink-0 rounded-lg" />
      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="card">
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-1/3 pt-1" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
