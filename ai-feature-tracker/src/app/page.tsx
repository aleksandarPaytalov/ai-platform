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
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          AI Feature Tracker Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          Track feature updates, capabilities, and changes across popular AI development tools. 
          Stay informed about the latest AI technology developments.
        </p>
      </header>

      {/* Main Dashboard Content */}
      <main>
        {/* Tools Overview Section */}
        <section className="mb-12" aria-labelledby="tools-overview">
          <h2 id="tools-overview" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            AI Tools Overview
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-600 dark:text-gray-400">
              Tools grid will be implemented here - displaying 15+ AI development tools with real-time feature tracking.
            </p>
          </div>
        </section>

        {/* Recent Updates Section */}
        <section className="mb-12" aria-labelledby="recent-updates">
          <h2 id="recent-updates" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Recent Feature Updates
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Total Tools Tracked</h3>
              <p className="text-gray-600 dark:text-gray-400">Statistics will be implemented here</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Recent Updates</h3>
              <p className="text-gray-600 dark:text-gray-400">Update count will be implemented here</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Categories</h3>
              <p className="text-gray-600 dark:text-gray-400">Category overview will be implemented here</p>
            </div>
          </div>
        </section>
      </main>


    </div>
  );
}
