import React, { Component, ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export interface ErrorBoundaryProps {
  /**
   * Child components to wrap with error boundary
   */
  children: ReactNode;
  /**
   * Custom fallback UI to render when error occurs
   */
  fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode;
  /**
   * Callback function called when an error occurs
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /**
   * Whether to show detailed error information in development
   */
  showErrorDetails?: boolean;
  /**
   * Custom error message for production
   */
  fallbackMessage?: string;
  /**
   * Additional CSS classes for the error container
   */
  className?: string;
}

/**
 * ErrorBoundary - React error boundary for catching JavaScript errors
 * 
 * Provides comprehensive error handling similar to try-catch blocks in C#,
 * but for React component trees. Catches errors during rendering, lifecycle
 * methods, and constructors of child components. Includes retry functionality
 * and detailed error reporting for development.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state to trigger fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In a real application, you might want to log to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  /**
   * Retry function to reset error state
   */
  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined 
    });
  };

  /**
   * Default fallback UI
   */
  renderDefaultFallback() {
    const { 
      fallbackMessage = 'Something went wrong. Please try again.',
      showErrorDetails = process.env.NODE_ENV === 'development',
      className = ''
    } = this.props;
    
    const { error, errorInfo } = this.state;

    return (
      <div 
        className={`
          min-h-[200px] 
          flex flex-col items-center justify-center 
          p-6 
          bg-red-50 
          border border-red-200 
          rounded-lg 
          text-center
          ${className}
        `}
        role="alert"
        aria-live="assertive"
      >
        {/* Error Icon */}
        <div className="w-12 h-12 mb-4 text-red-500">
          <svg 
            fill="currentColor" 
            viewBox="0 0 24 24" 
            className="w-full h-full"
          >
            <path 
              fillRule="evenodd" 
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>

        {/* Error Message */}
        <h2 className="text-lg font-semibold text-red-800 mb-2">
          Oops! Something went wrong
        </h2>
        
        <p className="text-red-700 mb-4 max-w-md">
          {fallbackMessage}
        </p>

        {/* Retry Button */}
        <button
          onClick={this.handleRetry}
          className="
            px-4 py-2 
            bg-red-600 
            text-white 
            rounded-md 
            hover:bg-red-700 
            focus:outline-none 
            focus:ring-2 
            focus:ring-red-500 
            focus:ring-offset-2
            transition-colors
          "
          type="button"
        >
          Try Again
        </button>

        {/* Development Error Details */}
        {showErrorDetails && error && (
          <details className="mt-6 w-full max-w-2xl">
            <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
              Show Error Details (Development Only)
            </summary>
            
            <div className="mt-4 p-4 bg-red-100 rounded-md text-left text-xs font-mono">
              <div className="mb-2">
                <strong>Error:</strong> {error.message}
              </div>
              
              {error.stack && (
                <div className="mb-2">
                  <strong>Stack Trace:</strong>
                  <pre className="mt-1 whitespace-pre-wrap text-red-800">
                    {error.stack}
                  </pre>
                </div>
              )}
              
              {errorInfo && errorInfo.componentStack && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre className="mt-1 whitespace-pre-wrap text-red-800">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(
          this.state.error, 
          this.state.errorInfo, 
          this.handleRetry
        );
      }

      // Default fallback UI
      return this.renderDefaultFallback();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;