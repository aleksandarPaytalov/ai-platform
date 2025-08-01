import React from 'react';
import { ErrorCard } from '../ui/error';

export interface ServerErrorProps {
  /**
   * HTTP status code
   */
  statusCode?: number;
  /**
   * HTTP status text
   */
  statusText?: string;
  /**
   * Custom error message
   */
  message?: string;
  /**
   * Custom title
   */
  title?: string;
  /**
   * Server error details
   */
  details?: {
    errorId?: string;
    timestamp?: string;
    endpoint?: string;
    method?: string;
  };
  /**
   * Whether to show retry functionality
   */
  showRetry?: boolean;
  /**
   * Retry function
   */
  onRetry?: () => void | Promise<void>;
  /**
   * Whether to show technical details
   */
  showTechnicalDetails?: boolean;
  /**
   * Whether to show report option
   */
  showReport?: boolean;
  /**
   * Report error callback
   */
  onReport?: () => void;
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ServerError - Specific error handling for server-side errors (5xx)
 * 
 * Provides appropriate messaging and recovery options for server errors.
 * Includes error reporting functionality and technical details for debugging.
 * Similar to server error pages with enhanced user guidance and support options.
 */
export const ServerError: React.FC<ServerErrorProps> = ({
  statusCode = 500,
  statusText,
  message,
  title,
  details,
  showRetry = true,
  onRetry,
  showTechnicalDetails = false,
  showReport = true,
  onReport,
  size = 'medium',
  className = '',
}) => {
  /**
   * Generate appropriate error message based on status code
   */
  const getErrorMessage = (): string => {
    if (message) return message;

    switch (statusCode) {
      case 500:
        return 'Our server encountered an unexpected error. We\'ve been notified and are working to fix it.';
      
      case 501:
        return 'This feature is not yet implemented. Please check back later or try an alternative approach.';
      
      case 502:
        return 'We\'re having trouble connecting to our services. Please try again in a few moments.';
      
      case 503:
        return 'Our service is temporarily unavailable for maintenance. We\'ll be back online shortly.';
      
      case 504:
        return 'The server is taking longer than expected to respond. Please try again.';
      
      case 505:
        return 'The server doesn\'t support the HTTP version used in the request.';
      
      case 507:
        return 'Our server is running low on storage space. We\'re working to resolve this issue.';
      
      case 508:
        return 'The server detected an infinite loop while processing your request.';
      
      case 510:
        return 'Additional extensions are required to fulfill this request.';
      
      case 511:
        return 'Network authentication is required to access this resource.';
      
      default:
        return 'Something went wrong on our end. We\'ve been notified and are investigating the issue.';
    }
  };

  /**
   * Generate error title based on status code
   */
  const getErrorTitle = (): string => {
    if (title) return title;

    switch (statusCode) {
      case 500:
        return 'Internal Server Error';
      case 501:
        return 'Not Implemented';
      case 502:
        return 'Bad Gateway';
      case 503:
        return 'Service Unavailable';
      case 504:
        return 'Gateway Timeout';
      case 505:
        return 'HTTP Version Not Supported';
      case 507:
        return 'Insufficient Storage';
      case 508:
        return 'Loop Detected';
      case 510:
        return 'Not Extended';
      case 511:
        return 'Network Authentication Required';
      default:
        return `Server Error (${statusCode})`;
    }
  };

  /**
   * Generate technical details for debugging
   */
  const getTechnicalDetails = (): string => {
    if (!showTechnicalDetails) return '';

    const technicalInfo: string[] = [];

    // Basic error info
    technicalInfo.push(`Status: ${statusCode}${statusText ? ` ${statusText}` : ''}`);

    if (details?.errorId) {
      technicalInfo.push(`Error ID: ${details.errorId}`);
    }

    if (details?.timestamp) {
      technicalInfo.push(`Timestamp: ${details.timestamp}`);
    }

    if (details?.endpoint) {
      technicalInfo.push(`Endpoint: ${details.method || 'GET'} ${details.endpoint}`);
    }

    // Add general information
    technicalInfo.push('');
    technicalInfo.push('What you can do:');
    technicalInfo.push('• Wait a few minutes and try again');
    technicalInfo.push('• Refresh the page');
    technicalInfo.push('• Check our status page for ongoing issues');
    
    if (showReport) {
      technicalInfo.push('• Report this error if it persists');
    }

    return technicalInfo.join('\n');
  };

  /**
   * Determine if the error suggests temporary issues
   */
  const isTemporaryError = (): boolean => {
    return [502, 503, 504, 507].includes(statusCode);
  };

  /**
   * Get appropriate actions based on error type
   */
  const getActions = () => {
    const actions = [];

    // Report action
    if (showReport) {
      actions.push({
        label: onReport ? 'Report Issue' : 'Contact Support',
        onClick: onReport || (() => {
          // Default report action - could integrate with support system
          const subject = encodeURIComponent(`Server Error: ${statusCode} - ${getErrorTitle()}`);
          const body = encodeURIComponent(`
Error Details:
- Status Code: ${statusCode}
- Error ID: ${details?.errorId || 'N/A'}
- Timestamp: ${details?.timestamp || new Date().toISOString()}
- Page: ${window.location.href}

Please describe what you were trying to do when this error occurred:
[Your description here]
          `);
          
          window.open(`mailto:support@ai-feature-tracker.com?subject=${subject}&body=${body}`);
        }),
        variant: 'outline' as const,
      });
    }

    // Status page link for service issues
    if (isTemporaryError()) {
      actions.push({
        label: 'Check Status',
        onClick: () => {
          // This would link to your status page
          window.open('https://status.ai-feature-tracker.com', '_blank');
        },
        variant: 'secondary' as const,
      });
    }

    return actions;
  };

  /**
   * Enhanced retry with exponential backoff for temporary errors
   */
  const handleRetry = async () => {
    if (!onRetry) return;

    // For temporary errors, add a small delay
    if (isTemporaryError()) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    await onRetry();
  };

  return (
    <ErrorCard
      title={getErrorTitle()}
      message={getErrorMessage()}
      details={getTechnicalDetails()}
      errorType="server"
      showRetry={showRetry && isTemporaryError()}
      onRetry={handleRetry}
      size={size}
      className={className}
      actions={getActions()}
      background="colored"
    />
  );
};

export default ServerError;