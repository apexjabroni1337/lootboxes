export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 animate-pulse">
      {/* Hero skeleton */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-purple-50 dark:from-purple-950/30 via-indigo-50 to-violet-50 py-10">
        <div className="container-main">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-purple-200" />
            <div className="h-8 w-64 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-80 max-w-full bg-gray-200 rounded mt-2" />
        </div>
      </section>

      {/* Case selector skeleton */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="container-main py-6">
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 w-32 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
            ))}
          </div>
        </div>
      </section>

      {/* Main content skeleton */}
      <section className="py-8">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Open button area */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="h-32 w-32 rounded-2xl bg-gray-200 mx-auto mb-6" />
              <div className="h-12 w-48 bg-purple-200 rounded-xl mx-auto" />
            </div>

            {/* Stats area */}
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                      <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded mb-1" />
                      <div className="h-6 w-24 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="h-5 w-28 bg-gray-200 rounded mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
