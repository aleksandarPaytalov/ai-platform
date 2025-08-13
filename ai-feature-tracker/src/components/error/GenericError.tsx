import React from 'react';
import { ErrorCard } from '../ui/error';

export interface GenericErrorProps {
  /**
   * Error object or message
   */
  error?: Error | string;
  /**
   * Custom error message override
   */
  message?: string;
  /**
   * Custom title override
   */
  title?: string;
  /**
   * Error context or operation that failed
   */
  context?: string;
  /**
   * Whether to show technical details
   */
  showDetails?: boolean;
  /**
   * Whether to show retry functionality
   */
  showRetry?: boolean;
  /**
   * Retry function
   */
  onRetry?: () => void | Promise<void>;
  /**
   * Whether to show error reporting
   */
  showReport?: boolean;
  /**
   * Error reporting callback
   */
  onReport?: (errorInfo: object) => void;
  /**
   * Fallback actions to show
   */
  fallbackActions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  }>;
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Error severity level
   */
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * GenericError - Catch-all error component for unexpected errors
 * 
 * Provides general error handling with graceful degradation and recovery options.
 * Includes error reporting and technical details for debugging.
 * Similar to generic exception handlers in desktop applications with user-friendly messaging.
 */
export const GenericError: React.FC<GenericErrorProps> = ({
  error,
  message,
  title,
  context,
  showDetails = false,
  showRetry = true,
  onRetry,
  showReport = true,
  onReport,
  fallbackActions = [],
  size = 'medium',
  className = '',
  severity = 'medium',
}) => {
  /**
   * Extract error message from various error types
   */
  const getErrorMessage = (): string => {
    if (message) return message;

    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof Error) {
      // Provide user-friendly versions of common error messages
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        return 'A network error occurred. Please check your connection and try again.';
      }
      
      if (errorMessage.includes('timeout')) {
        return 'The operation took too long to complete. Please try again.';
      }
      
      if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
        return 'You don\'t have permission to perform this action.';
      }
      
      if (errorMessage.includes('not found')) {
        return 'The requested resource could not be found.';
      }
      
      // Return original message if it's user-friendly
      if (error.message && error.message.length < 100 && !error.message.includes('TypeError')) {
        return error.message;
      }
    }

    // Default generic message based on context
    if (context) {
      return `An error occurred while ${context}. Please try again or contact support if the problem persists.`;
    }

    return 'An unexpected error occurred. Please try again or contact support if the problem continues.';
  };

  /**
   * Generate error title based on severity and context
   */
  const getErrorTitle = (): string => {
    if (title) return title;

    switch (severity) {
      case 'low':
        return 'Minor Issue';
      case 'medium':
        return 'Something Went Wrong';
      case 'high':
        return 'Error Occurred';
      case 'critical':
        return 'Critical Error';
      default:
        return 'Unexpected Error';
    }
  };

  /**
   * Generate technical details for debugging
   */
  const getTechnicalDetails = (): string => {
    if (!showDetails) return '';

    const details: string[] = [];

    // Error information
    if (error instanceof Error) {
      details.push(`Error Type: ${error.constructor.name}`);
      details.push(`Message: ${error.message}`);
      
      if (error.stack) {
        details.push('Stack Trace:');
        details.push(error.stack);
      }
    } else if (typeof error === 'string') {
      details.push(`Error: ${error}`);
    }

    // Context information
    if (context) {
      details.push(`Context: ${context}`);
    }

    // Browser/environment info
    details.push('');
    details.push('Environment:');
    details.push(`User Agent: ${navigator.userAgent}`);
    details.push(`URL: ${window.location.href}`);
    details.push(`Timestamp: ${new Date().toISOString()}`);

    // Recovery suggestions
    details.push('');
    details.push('Recovery suggestions:');
    details.push('• Refresh the page');
    details.push('• Clear browser cache');
    details.push('• Try in an incognito/private window');
    details.push('• Check browser console for additional errors');

    return details.join('\n');
  };

  /**
   * Prepare error information for reporting
   */
  const getErrorInfo = () => {
    const errorInfo = {
      message: error instanceof Error ? error.message : String(error || 'Unknown error'),
      stack: error instanceof Error ? error.stack : undefined,
      context,
      severity,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    return errorInfo;
  };

  /**
   * Handle error reporting
   */
  const handleReport = () => {
    const errorInfo = getErrorInfo();

    if (onReport) {
      onReport(errorInfo);
    } else {
      // Default error reporting via email
      const subject = encodeURIComponent(`Error Report: ${getErrorTitle()}`);
      const body = encodeURIComponent(`
Error Report:

${JSON.stringify(errorInfo, null, 2)}

Additional details:
[Please describe what you were doing when this error occurred]
      `);
      
      window.open(`mailto:support@ai-feature-tracker.com?subject=${subject}&body=${body}`);
    }
  };

  /**
   * Get severity-appropriate icon type
   */
  const getIconType = () => {
    switch (severity) {
      case 'low':
        return 'warning';
      case 'medium':
        return 'error';
      case 'high':
        return 'error';
      case 'critical':
        return 'error';
      default:
        return 'error';
    }
  };

  /**
   * Get actions based on available options
   */
  const getActions = () => {
    const actions = [...fallbackActions];

    // Report action
    if (showReport) {
      actions.push({
        label: 'Report Error',
        onClick: handleReport,
        variant: 'outline' as const,
      });
    }

    // Reload page action for critical errors
    if (severity === 'critical') {
      actions.push({
        label: 'Reload Page',
        onClick: () => window.location.reload(),
        variant: 'secondary' as const,
      });
    }

    return actions;
  };

  return (
    <ErrorCard
      title={getErrorTitle()}
      message={getErrorMessage()}
      details={getTechnicalDetails()}
      errorType={getIconType() as any}
      showRetry={showRetry}
      {...(onRetry ? { onRetry } : {})}
      size={size}
      className={className}
      actions={getActions()}
      background="colored"
    />
  );
};

export default GenericError;