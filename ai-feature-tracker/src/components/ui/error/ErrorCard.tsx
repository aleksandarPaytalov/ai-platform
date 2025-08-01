import React from 'react';
import { ErrorIcon, ErrorIconType } from './ErrorIcon';
import { RetryButton } from './RetryButton';

export interface ErrorCardProps {
  /**
   * Error title/heading
   */
  title: string;
  /**
   * Error message or description
   */
  message: string;
  /**
   * Additional details or help text
   */
  details?: string;
  /**
   * Type of error for appropriate icon and styling
   */
  errorType?: ErrorIconType;
  /**
   * Whether to show retry functionality
   */
  showRetry?: boolean;
  /**
   * Retry function
   */
  onRetry?: () => void | Promise<void>;
  /**
   * Custom action buttons
   */
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  }>;
  /**
   * Size variant for the error card
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether the card is dismissible
   */
  dismissible?: boolean;
  /**
   * Dismiss callback
   */
  onDismiss?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show border
   */
  bordered?: boolean;
  /**
   * Background variant
   */
  background?: 'white' | 'gray' | 'colored';
}

/**
 * ErrorCard - Comprehensive error display component
 * 
 * Provides contained error display with title, message, details, actions,
 * and retry functionality. Similar to error dialogs in desktop applications
 * but designed for inline display within the application interface.
 */
export const ErrorCard: React.FC<ErrorCardProps> = ({
  title,
  message,
  details,
  errorType = 'error',
  showRetry = false,
  onRetry,
  actions = [],
  size = 'medium',
  dismissible = false,
  onDismiss,
  className = '',
  bordered = true,
  background = 'white',
}) => {
  // Size configurations
  const sizeConfig = {
    small: {
      padding: 'p-4',
      spacing: 'space-y-2',
      titleSize: 'text-sm',
      messageSize: 'text-sm',
      detailsSize: 'text-xs',
      iconSize: 'medium' as const,
    },
    medium: {
      padding: 'p-6',
      spacing: 'space-y-3',
      titleSize: 'text-base',
      messageSize: 'text-sm',
      detailsSize: 'text-sm',
      iconSize: 'large' as const,
    },
    large: {
      padding: 'p-8',
      spacing: 'space-y-4',
      titleSize: 'text-lg',
      messageSize: 'text-base',
      detailsSize: 'text-sm',
      iconSize: 'xl' as const,
    },
  };

  // Background configurations
  const backgroundConfig = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    colored: errorType === 'error' ? 'bg-red-50' : 
             errorType === 'warning' ? 'bg-yellow-50' :
             errorType === 'info' ? 'bg-blue-50' :
             errorType === 'success' ? 'bg-green-50' : 'bg-gray-50',
  };

  // Border configurations
  const borderConfig = {
    error: 'border-red-200',
    warning: 'border-yellow-200',
    info: 'border-blue-200',
    success: 'border-green-200',
    network: 'border-blue-200',
    server: 'border-red-200',
    auth: 'border-orange-200',
    validation: 'border-red-200',
    notFound: 'border-purple-200',
    generic: 'border-gray-200',
  };

  const config = sizeConfig[size];
  const borderColor = bordered ? borderConfig[errorType] : '';

  return (
    <div
      className={`
        ${backgroundConfig[background]}
        ${bordered ? `border ${borderColor}` : ''}
        rounded-lg
        ${config.padding}
        ${config.spacing}
        relative
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Dismiss Button */}
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="
            absolute top-4 right-4
            text-gray-400 hover:text-gray-600
            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
            rounded
          "
          type="button"
          aria-label="Dismiss error"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* Header with Icon and Title */}
      <div className="flex items-start gap-3">
        {/* Error Icon */}
        <div className="flex-shrink-0 pt-0.5">
          <ErrorIcon 
            type={errorType} 
            size={config.iconSize}
            animated={false}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className={`${config.titleSize} font-semibold text-gray-900 mb-1`}>
            {title}
          </h3>

          {/* Message */}
          <p className={`${config.messageSize} text-gray-700`}>
            {message}
          </p>

          {/* Details */}
          {details && (
            <div className="mt-2">
              <p className={`${config.detailsSize} text-gray-600`}>
                {details}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {(showRetry || actions.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {/* Retry Button */}
          {showRetry && onRetry && (
            <RetryButton
              onRetry={onRetry}
              size={size === 'large' ? 'medium' : 'small'}
              variant="primary"
            />
          )}

          {/* Custom Actions */}
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`
                px-3 py-1.5
                ${config.detailsSize}
                font-medium
                rounded-md
                focus:outline-none focus:ring-2 focus:ring-offset-2
                transition-colors
                ${action.variant === 'primary' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                  : action.variant === 'secondary'
                  ? 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500'
                  : 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 focus:ring-blue-500'
                }
              `}
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ErrorCard;