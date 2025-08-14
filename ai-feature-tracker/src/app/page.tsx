import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'AI Feature Tracker dashboard - monitor and track feature updates across 15+ popular AI development tools in real-time.',
  openGraph: {
    title: 'AI Feature Tracker Dashboard',
    description: 'Monitor and track feature updates across 15+ popular AI development tools in real-time.',
    url: '/',
  },
  twitter: {
    title: 'AI Feature Tracker Dashboard',
    description: 'Monitor and track feature updates across 15+ popular AI development tools in real-time.',
  },
  alternates: {
    canonical: '/',
  },
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Page Header */}
      <header className="mb-10 sm:mb-12">
        <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2.5 py-1 text-xs font-medium ring-1 ring-inset ring-blue-200/60 dark:ring-blue-800/60 mb-3">
          AI Tools & Features
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
          AI Feature Tracker Dashboard
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          Track feature updates, capabilities, and changes across popular AI development tools. 
          Stay informed about the latest AI technology developments.
        </p>
      </header>

      {/* Main Dashboard Content */}
      <main>
        {/* Tools Overview Section */}
        <section className="mb-12" aria-labelledby="tools-overview">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 id="tools-overview" className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              AI Tools Overview
            </h2>
            <a
              href="/tools"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              View all
            </a>
          </div>
          <div className="group bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-2xl shadow border border-gray-200/80 dark:border-gray-700/80 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500">
            <p className="text-gray-600 dark:text-gray-400">
              Tools grid will be implemented here - displaying 15+ AI development tools with real-time feature tracking.
            </p>
          </div>
        </section>

        {/* Recent Updates Section */}
        <section className="mb-12" aria-labelledby="recent-updates">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 id="recent-updates" className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Recent Feature Updates
            </h2>
            <a
              href="/updates"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              View all
            </a>
          </div>
          <div className="group bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-2xl shadow border border-gray-200/80 dark:border-gray-700/80 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500">
            <p className="text-gray-600 dark:text-gray-400">
              Recent updates timeline will be implemented here - showing latest changes across all tracked tools.
            </p>
          </div>
        </section>

        {/* Statistics Section */}
        <section aria-labelledby="dashboard-stats">
          <h2 id="dashboard-stats" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Dashboard Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="group bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-2xl shadow border border-gray-200/80 dark:border-gray-700/80 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Total Tools Tracked</h3>
              <p className="text-gray-600 dark:text-gray-400">Statistics will be implemented here</p>
            </div>
            <div className="group bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-2xl shadow border border-gray-200/80 dark:border-gray-700/80 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Recent Updates</h3>
              <p className="text-gray-600 dark:text-gray-400">Update count will be implemented here</p>
            </div>
            <div className="group bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-2xl shadow border border-gray-200/80 dark:border-gray-700/80 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Categories</h3>
              <p className="text-gray-600 dark:text-gray-400">Category overview will be implemented here</p>
            </div>
          </div>
        </section>
      </main>


    </div>
  );
}
