'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

interface ToolDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ToolDetailError({ error, reset }: ToolDetailErrorProps) {
  const params = useParams();
  const slug = params?.['slug'] as string;

  useEffect(() => {
    // Log error to console and potential error reporting service
    console.error('Tool detail error occurred:', error, { slug });
    
    // In production, you would send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Track error with tool context
      // errorReportingService.captureException(error, {
      //   tags: { section: 'tool-detail' },
      //   extra: { slug, digest: error.digest }
      // });
    }
  }, [error, slug]);

  const isNotFoundError = error.message.includes('404') || error.message.includes('not found');
  const isDataLoadError = error.message.includes('fetch') || error.message.includes('database');
  const isValidationError = error.message.includes('validation') || error.message.includes('invalid');

  // Convert slug to display name
  const toolName = slug 
    ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Unknown Tool';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
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
            {toolName} (Error)
          </li>
        </ol>
      </nav>

      <div className="max-w-2xl mx-auto text-center">
        {/* Error Icon */}
        <div className="mx-auto h-16 w-16 text-red-500 mb-6" aria-hidden="true">
          {isNotFoundError ? (
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          ) : (
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          )}
        </div>

        {/* Error Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {isNotFoundError ? `${toolName} Not Found` : 
           isDataLoadError ? `Unable to Load ${toolName}` : 
           isValidationError ? 'Invalid Tool Request' :
           `Error Loading ${toolName}`}
        </h1>

        {/* Error Description */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {isNotFoundError ? 
            `The AI tool "${toolName}" could not be found. It may have been moved or is no longer being tracked.` :
           isDataLoadError ?
            `We're having trouble loading the details for ${toolName}. This might be due to a temporary server issue.` :
           isValidationError ?
            'The tool request contains invalid parameters. Please check the URL and try again.' :
            `An error occurred while loading ${toolName}. This is likely a temporary issue.`}
        </p>

        {/* Tool Slug Information */}
        {slug && (
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Requested tool slug: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">{slug}</code>
            </p>
          </div>
        )}

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-8 text-left max-w-md mx-auto">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              Error Details (Development)
            </summary>
            <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-red-600 dark:text-red-400 overflow-auto max-h-32">
              <div><strong>Message:</strong> {error.message}</div>
              <div><strong>Slug:</strong> {slug || 'undefined'}</div>
              {error.digest && <div><strong>Digest:</strong> {error.digest}</div>}
              {error.stack && (
                <div className="mt-2">
                  <strong>Stack:</strong>
                  <pre className="whitespace-pre-wrap text-xs">{error.stack}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {!isNotFoundError && (
            <button
              onClick={reset}
              className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Try Loading Again
            </button>
          )}
          
          <div className="flex justify-center space-x-4">
            <a
              href="/tools"
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Browse All Tools
            </a>
            
            <a
              href="/"
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Back to Dashboard
            </a>
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            What you can do:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Search Tools</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Use the search function to find similar AI tools
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Browse Categories</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Explore tools by category or functionality
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Check Back Later</h3>
              <p className="text-gray-600 dark:text-gray-400">
                This tool might be temporarily unavailable
              </p>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you believe this tool should exist, please{' '}
            <a 
              href="mailto:support@ai-feature-tracker.com" 
              className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:underline"
            >
              contact support
            </a>
            {error.digest && (
              <>
                {' '}and include error ID: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">{error.digest}</code>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}