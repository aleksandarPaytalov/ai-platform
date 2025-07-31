export default function ToolsLoading() {
  return (
    <div className="container mx-auto px-4 py-8" role="status" aria-label="Loading tools section">
      {/* Page Header Skeleton */}
      <header className="mb-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-2xl"></div>
        </div>
      </header>

      {/* Search and Filters Skeleton */}
      <section className="mb-8">
        <div className="animate-pulse">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="w-full sm:w-48">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid Skeleton */}
      <main>
        <section className="mb-8">
          <div className="animate-pulse">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="space-y-4">
                    {/* Tool Icon and Title */}
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      ))}
                    </div>
                    
                    {/* Status and Update Info */}
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pagination Skeleton */}
        <section className="flex justify-center">
          <div className="animate-pulse flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </section>
      </main>

      {/* Screen Reader Information */}
      <span className="sr-only">Loading AI tools directory...</span>
    </div>
  );
}