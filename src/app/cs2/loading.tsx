export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 animate-pulse">
      {/* Hero skeleton */}
      <section className="relative overflow-hidden border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-900 via-gray-800 to-yellow-900 py-16 sm:py-24">
        <div className="container-main">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-yellow-50 dark:bg-yellow-950/300/20" />
            <div className="h-8 w-48 bg-gray-700 rounded-full" />
          </div>
          <div className="h-12 w-64 bg-gray-700 rounded mt-4" />
          <div className="h-6 w-40 bg-yellow-700/30 rounded mt-2" />
          <div className="h-4 w-96 max-w-full bg-gray-700 rounded mt-6" />
          <div className="h-4 w-80 max-w-full bg-gray-700 rounded mt-2" />
        </div>
      </section>

      {/* Why section skeleton */}
      <section className="py-12 border-b border-gray-100 dark:border-gray-800">
        <div className="container-main">
          <div className="h-6 w-64 bg-gray-200 rounded mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded mt-2" />
                <div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-800 rounded mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools grid skeleton */}
      <section className="py-12">
        <div className="container-main">
          <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-72 bg-gray-100 dark:bg-gray-800 rounded mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="h-12 w-12 rounded-xl bg-gray-200 mb-4" />
                <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded mt-2" />
                <div className="h-3 w-4/5 bg-gray-100 dark:bg-gray-800 rounded mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplaces skeleton */}
      <section className="py-12 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="container-main">
          <div className="h-6 w-52 bg-gray-200 rounded mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-5 text-center">
                <div className="mx-auto h-10 w-10 rounded-full bg-gray-200 mb-3" />
                <div className="h-4 w-20 bg-gray-200 rounded mx-auto" />
                <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded mx-auto mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
