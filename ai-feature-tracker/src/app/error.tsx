'use client';

import { useEffect } from 'react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error to console and potential error reporting service
    console.error('Global error occurred:', error);
    
    // In production, you would send this to an error reporting service
    // Example: Sentry, LogRocket, or custom error tracking
    if (process.env.NODE_ENV === 'production') {
      // Track error with additional context
      // errorReportingService.captureException(error, {
      //   tags: { section: 'global' },
      //   extra: { digest: error.digest }
      // });
    }
  }, [error]);

  const isNetworkError = error.message.includes('fetch') || error.message.includes('network');
  const isServerError = error.message.includes('500') || error.digest;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mx-auto h-16 w-16 text-red-500 mb-6" aria-hidden="true">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {isNetworkError ? 'Connection Problem' : 
           isServerError ? 'Server Error' : 
           'Something Went Wrong'}
        </h1>

        {/* Error Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {isNetworkError ? 
            'Unable to connect to our servers. Please check your internet connection and try again.' :
           isServerError ?
            'Our servers are experiencing issues. We\'re working to fix this as quickly as possible.' :
            'An unexpected error occurred while loading the AI Feature Tracker. Please try again.'}
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              Error Details (Development)
            </summary>
            <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-red-600 dark:text-red-400 overflow-auto max-h-32">
              <div><strong>Message:</strong> {error.message}</div>
              {error.digest && <div><strong>Digest:</strong> {error.digest}</div>}
              {error.stack && (
                <div className="mt-2">
                  <strong>Stack:</strong>
                  <pre className="whitespace-pre-wrap">{error.stack}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Try Again
          </button>
          
          <div className="flex space-x-3">
            <a
              href="/"
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors text-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Go Home
            </a>
            
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Reload Page
            </button>
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If this problem persists, please{' '}
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