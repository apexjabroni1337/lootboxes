export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 animate-pulse">
      {/* Hero skeleton */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-orange-50 dark:from-orange-950/30 via-amber-50 dark:via-amber-950/20 to-yellow-50 dark:to-yellow-950/20 py-10">
        <div className="container-main">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-orange-200" />
            <div className="h-8 w-56 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-96 max-w-full bg-gray-200 rounded mt-2" />
        </div>
      </section>

      {/* Search bar skeleton */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="container-main py-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg" />
          <div className="h-10 w-36 bg-gray-100 dark:bg-gray-800 rounded-lg" />
          <div className="h-10 w-40 bg-gray-100 dark:bg-gray-800 rounded-lg" />
        </div>
      </section>

      {/* Status bar skeleton */}
      <section className="border-b border-gray-50 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-main py-3">
          <div className="h-3 w-48 bg-gray-200 rounded" />
        </div>
      </section>

      {/* Table skeleton */}
      <section className="py-6">
        <div className="container-main">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-5 py-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gray-200 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
                  </div>
                  <div className="hidden lg:flex items-center gap-8">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-6 w-14 bg-emerald-100 rounded-full" />
                    <div className="h-4 w-10 bg-gray-100 dark:bg-gray-800 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-gray-200 rounded-lg" />
                    <div className="h-8 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
