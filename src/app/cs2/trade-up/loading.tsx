export default function Loading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Hero skeleton */}
      <section className="border-b border-gray-100 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 py-10">
        <div className="container-main">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-amber-200" />
            <div className="h-8 w-56 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-80 max-w-full bg-gray-200 rounded mt-2" />
        </div>
      </section>

      {/* Calculator skeleton */}
      <section className="py-8">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input skins */}
            <div className="lg:col-span-2 rounded-xl border border-gray-200 p-6">
              <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
              <div className="h-12 bg-gray-100 rounded-lg mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50"
                  />
                ))}
              </div>
            </div>

            {/* Results panel */}
            <div className="rounded-xl border border-gray-200 p-6">
              <div className="h-5 w-36 bg-gray-200 rounded mb-6" />
              <div className="space-y-4">
                <div className="h-20 bg-gray-100 rounded-xl" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-8 w-full bg-gray-100 rounded-lg" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-8 w-full bg-gray-100 rounded-lg" />
                <div className="h-12 bg-amber-100 rounded-xl mt-4" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
