import React from 'react';

export type ErrorType = 'error' | 'warning' | 'info' | 'success';

export interface ErrorMessageProps {
  /**
   * The error message to display
   */
  message: string;
  /**
   * Additional description or details
   */
  description?: string;
  /**
   * Type of error message
   */
  type?: ErrorType;
  /**
   * Whether the message can be dismissed
   */
  dismissible?: boolean;
  /**
   * Callback when message is dismissed
   */
  onDismiss?: () => void;
  /**
   * Whether to show an icon
   */
  showIcon?: boolean;
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Automatically dismiss after specified milliseconds
   */
  autoDismiss?: number;
  /**
   * Custom action button
   */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * ErrorMessage - User-friendly error message component
 * 
 * Displays contextual error messages with different severity levels.
 * Similar to validation messages in forms or status notifications
 * in desktop applications. Supports auto-dismiss and custom actions.
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  description,
  type = 'error',
  dismissible = false,
  onDismiss,
  showIcon = true,
  size = 'medium',
  className = '',
  autoDismiss,
  action,
}) => {
  // Auto-dismiss effect
  React.useEffect(() => {
    if (autoDismiss && onDismiss) {
      const timer = setTimeout(onDismiss, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onDismiss]);

  // Type configurations
  const typeConfig = {
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-500',
      descriptionColor: 'text-red-700',
      actionBg: 'bg-red-600 hover:bg-red-700',
      actionText: 'text-white',
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500',
      descriptionColor: 'text-yellow-700',
      actionBg: 'bg-yellow-600 hover:bg-yellow-700',
      actionText: 'text-white',
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500',
      descriptionColor: 'text-blue-700',
      actionBg: 'bg-blue-600 hover:bg-blue-700',
      actionText: 'text-white',
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-500',
      descriptionColor: 'text-green-700',
      actionBg: 'bg-green-600 hover:bg-green-700',
      actionText: 'text-white',
    },
  };

  // Size configurations
  const sizeConfig = {
    small: {
      padding: 'p-3',
      spacing: 'gap-2',
      iconSize: 'w-4 h-4',
      textSize: 'text-sm',
      descriptionSize: 'text-xs',
    },
    medium: {
      padding: 'p-4',
      spacing: 'gap-3',
      iconSize: 'w-5 h-5',
      textSize: 'text-sm',
      descriptionSize: 'text-sm',
    },
    large: {
      padding: 'p-6',
      spacing: 'gap-4',
      iconSize: 'w-6 h-6',
      textSize: 'text-base',
      descriptionSize: 'text-sm',
    },
  };

  const config = typeConfig[type];
  const sizeConf = sizeConfig[size];

  /**
   * Get icon based on error type
   */
  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <svg fill="currentColor" viewBox="0 0 24 24" className={sizeConf.iconSize}>
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
        );
      
      case 'warning':
        return (
          <svg fill="currentColor" viewBox="0 0 24 24" className={sizeConf.iconSize}>
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
        );
      
      case 'info':
        return (
          <svg fill="currentColor" viewBox="0 0 24 24" className={sizeConf.iconSize}>
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
        );
      
      case 'success':
        return (
          <svg fill="currentColor" viewBox="0 0 24 24" className={sizeConf.iconSize}>
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        ${config.bgColor}
        ${config.borderColor}
        border
        rounded-lg
        ${sizeConf.padding}
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className={`flex ${sizeConf.spacing}`}>
        {/* Icon */}
        {showIcon && (
          <div className={`${config.iconColor} flex-shrink-0`}>
            {getIcon()}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Main Message */}
          <p className={`${config.textColor} ${sizeConf.textSize} font-medium`}>
            {message}
          </p>

          {/* Description */}
          {description && (
            <p className={`${config.descriptionColor} ${sizeConf.descriptionSize} mt-1`}>
              {description}
            </p>
          )}

          {/* Action Button */}
          {action && (
            <div className="mt-3">
              <button
                onClick={action.onClick}
                className={`
                  ${config.actionBg}
                  ${config.actionText}
                  px-3 py-1.5
                  ${sizeConf.descriptionSize}
                  font-medium
                  rounded-md
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-offset-transparent
                  transition-colors
                `}
                type="button"
              >
                {action.label}
              </button>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={`
              ${config.iconColor}
              hover:opacity-75
              flex-shrink-0
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-offset-transparent
              rounded
            `}
            type="button"
            aria-label="Dismiss"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className={sizeConf.iconSize}>
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;