import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ToolPageProps {
  params: {
    slug: string;
  };
}

// Validate slug format - should be lowercase letters, numbers, and hyphens only
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

// Generate metadata for tool pages
export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = params;
  
  if (!isValidSlug(slug)) {
    return {
      title: 'Tool Not Found',
      description: 'The requested AI tool could not be found.',
    };
  }

  // Convert slug to display name for metadata
  const toolName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${toolName} - AI Tool Features`,
    description: `Track feature updates, capabilities, and changes for ${toolName}. Stay informed about the latest developments in this AI development tool.`,
    openGraph: {
      title: `${toolName} - AI Tool Features | AI Feature Tracker`,
      description: `Track feature updates, capabilities, and changes for ${toolName}. Stay informed about the latest developments in this AI development tool.`,
      url: `/tools/${slug}`,
    },
    twitter: {
      title: `${toolName} - AI Tool Features`,
      description: `Track feature updates, capabilities, and changes for ${toolName}.`,
    },
    alternates: {
      canonical: `/tools/${slug}`,
    },
  };
}

export default function ToolDetailPage({ params }: ToolPageProps) {
  const { slug } = params;
  
  // Validate slug format
  if (!isValidSlug(slug)) {
    notFound();
  }

  // Convert slug to display name
  const toolName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <li>
            <a 
              href="/" 
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Dashboard
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <a 
              href="/tools" 
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Tools
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li aria-current="page" className="text-gray-900 dark:text-gray-100 font-medium">
            {toolName}
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {toolName}
        </h1>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Tool Slug: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">{slug}</code></span>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl">
          Comprehensive feature tracking and updates for {toolName}. Monitor capabilities, 
          new features, and changes to stay informed about this AI development tool.
        </p>
      </header>

      {/* Main Tool Content */}
      <main>
        {/* Tool Overview Section */}
        <section className="mb-12" aria-labelledby="tool-overview">
          <h2 id="tool-overview" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Tool Overview
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tool details will be implemented here - including description, key features, 
              pricing information, and current status.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Key Information</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Category: AI Development Tool</li>
                  <li>• Status: Active Tracking</li>
                  <li>• Last Updated: Placeholder</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Quick Stats</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Total Updates: Placeholder</li>
                  <li>• Recent Changes: Placeholder</li>
                  <li>• Feature Count: Placeholder</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Updates Section */}
        <section className="mb-12" aria-labelledby="feature-updates">
          <h2 id="feature-updates" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Recent Feature Updates
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-600 dark:text-gray-400">
              Feature update timeline will be implemented here - showing chronological 
              updates, new capabilities, and changes for {toolName}.
            </p>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="mb-12" aria-labelledby="capabilities">
          <h2 id="capabilities" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Current Capabilities
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive capabilities list will be implemented here - organized by category 
              with detailed descriptions and availability status.
            </p>
          </div>
        </section>

        {/* Comparison Section */}
        <section aria-labelledby="tool-comparison">
          <h2 id="tool-comparison" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Compare with Similar Tools
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-600 dark:text-gray-400">
              Tool comparison interface will be implemented here - allowing users to compare 
              {toolName} with other AI development tools in the same category.
            </p>
          </div>
        </section>
      </main>


    </div>
  );
}