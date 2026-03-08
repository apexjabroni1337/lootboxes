export default function Loading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Hero skeleton */}
      <section className="border-b border-gray-100 bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 py-10">
        <div className="container-main">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-blue-200" />
            <div className="h-8 w-52 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-72 max-w-full bg-gray-200 rounded mt-2" />
        </div>
      </section>

      {/* Search skeleton */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container-main py-6">
          <div className="h-12 bg-gray-100 rounded-lg max-w-xl" />
        </div>
      </section>

      {/* Wear bar skeleton */}
      <section className="py-6">
        <div className="container-main">
          <div className="h-10 bg-gray-100 rounded-lg mb-6" />
          {/* Results skeleton */}
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gray-200 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                    <div className="h-3 w-32 bg-gray-100 rounded mt-2" />
                  </div>
                  <div className="h-8 w-24 bg-blue-100 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
