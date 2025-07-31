export default function ToolDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8" role="status" aria-label="Loading tool details">
      {/* Breadcrumb Skeleton */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <div className="animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <span className="text-gray-400">/</span>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <span className="text-gray-400">/</span>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </nav>

      {/* Page Header Skeleton */}
      <header className="mb-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mb-4"></div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-2 max-w-3xl">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </header>

      {/* Main Content Skeletons */}
      <main>
        {/* Tool Overview Section Skeleton */}
        <section className="mb-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-4 mb-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Updates Section Skeleton */}
        <section className="mb-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex space-x-4 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                      </div>
                      <div className="flex space-x-2">
                        {[...Array(2)].map((_, j) => (
                          <div key={j} className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Section Skeleton */}
        <section className="mb-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3 p-4 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-600">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                    <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section Skeleton */}
        <section>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="flex space-x-4 mt-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex-1 p-4 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-600">
                      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Screen Reader Information */}
      <span className="sr-only">Loading tool details and features...</span>
    </div>
  );
}