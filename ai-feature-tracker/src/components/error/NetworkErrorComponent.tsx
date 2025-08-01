import React from 'react';
import { ErrorCard } from '../ui/error';

export interface NetworkErrorComponentProps {
  /**
   * Custom error message
   */
  message?: string;
  /**
   * Whether to show retry functionality
   */
  showRetry?: boolean;
  /**
   * Retry function
   */
  onRetry?: () => void | Promise<void>;
  /**
   * Whether to show connection diagnosis
   */
  showDiagnosis?: boolean;
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Custom title
   */
  title?: string;
  /**
   * Specific network error details
   */
  details?: {
    status?: number;
    statusText?: string;
    url?: string;
    timeout?: boolean;
  };
}

/**
 * NetworkErrorComponent - Specific error handling for network/connection issues
 * 
 * Provides user-friendly messaging and recovery options for network-related errors.
 * Includes connection diagnosis and helpful troubleshooting suggestions.
 * Similar to network error handling in desktop applications with automatic retry logic.
 */
export const NetworkErrorComponent: React.FC<NetworkErrorComponentProps> = ({
  message,
  showRetry = true,
  onRetry,
  showDiagnosis = true,
  size = 'medium',
  className = '',
  title,
  details,
}) => {
  /**
   * Generate appropriate error message based on network error details
   */
  const getErrorMessage = (): string => {
    if (message) return message;

    if (details?.timeout) {
      return 'The request took too long to complete. Please check your internet connection and try again.';
    }

    if (details?.status) {
      switch (details.status) {
        case 0:
          return 'Unable to connect to the server. Please check your internet connection.';
        case 408:
          return 'Request timeout. The server took too long to respond.';
        case 502:
          return 'Server is temporarily unavailable. Please try again in a few moments.';
        case 503:
          return 'Service temporarily unavailable. We\'re working to restore it.';
        case 504:
          return 'Gateway timeout. The server is taking longer than expected to respond.';
        default:
          return 'Network connection failed. Please check your internet connection and try again.';
      }
    }

    return 'Unable to connect to the server. Please check your internet connection and try again.';
  };

  /**
   * Generate error title based on context
   */
  const getErrorTitle = (): string => {
    if (title) return title;

    if (details?.timeout) {
      return 'Connection Timeout';
    }

    if (details?.status) {
      if (details.status >= 500) {
        return 'Server Error';
      }
      if (details.status === 0) {
        return 'No Internet Connection';
      }
    }

    return 'Connection Failed';
  };

  /**
   * Generate detailed diagnostics information
   */
  const getDiagnosisDetails = (): string => {
    if (!showDiagnosis) return '';

    const diagnostics: string[] = [];

    if (details?.status) {
      diagnostics.push(`Status: ${details.status}${details.statusText ? ` (${details.statusText})` : ''}`);
    }

    if (details?.url) {
      try {
        const url = new URL(details.url);
        diagnostics.push(`Endpoint: ${url.hostname}`);
      } catch {
        // Invalid URL, skip
      }
    }

    if (details?.timeout) {
      diagnostics.push('Request timed out after waiting for server response');
    }

    // Add general troubleshooting tips
    const tips = [
      '• Check your internet connection',
      '• Try refreshing the page',
      '• Disable VPN or proxy if enabled',
      '• Check if other websites are working',
    ];

    if (diagnostics.length > 0) {
      return `${diagnostics.join(' • ')}\n\nTroubleshooting steps:\n${tips.join('\n')}`;
    }

    return `Troubleshooting steps:\n${tips.join('\n')}`;
  };

  /**
   * Enhanced retry function with connection check
   */
  const handleRetry = async () => {
    if (!onRetry) return;

    // Check if navigator.onLine is available and we're offline
    if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) {
      alert('You appear to be offline. Please check your internet connection and try again.');
      return;
    }

    await onRetry();
  };

  return (
    <ErrorCard
      title={getErrorTitle()}
      message={getErrorMessage()}
      details={getDiagnosisDetails()}
      errorType="network"
      showRetry={showRetry}
      onRetry={handleRetry}
      size={size}
      className={className}
      actions={[
        {
          label: 'Check Connection',
          onClick: () => {
            // Open a simple connection test
            window.open('https://www.google.com', '_blank', 'width=400,height=300');
          },
          variant: 'outline',
        },
        ...(details?.url ? [{
          label: 'Reload Page',
          onClick: () => window.location.reload(),
          variant: 'secondary' as const,
        }] : []),
      ]}
      background="colored"
    />
  );
};

export default NetworkErrorComponent;