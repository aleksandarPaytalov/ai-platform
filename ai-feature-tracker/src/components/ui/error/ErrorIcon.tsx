import React from 'react';

export type ErrorIconType = 
  | 'error' 
  | 'warning' 
  | 'info' 
  | 'success' 
  | 'network' 
  | 'server' 
  | 'auth' 
  | 'validation' 
  | 'notFound' 
  | 'generic';

export interface ErrorIconProps {
  /**
   * Type of error icon to display
   */
  type: ErrorIconType;
  /**
   * Size variant for the icon
   */
  size?: 'small' | 'medium' | 'large' | 'xl';
  /**
   * Color variant (auto-selected based on type if not specified)
   */
  color?: 'red' | 'yellow' | 'blue' | 'green' | 'gray' | 'orange' | 'purple';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to add animation
   */
  animated?: boolean;
  /**
   * Accessibility label
   */
  ariaLabel?: string;
}

/**
 * ErrorIcon - Semantic icons for different error types
 * 
 * Provides contextual icons that help users quickly identify the type
 * and severity of errors. Similar to system icons in desktop applications
 * for conveying error states visually.
 */
export const ErrorIcon: React.FC<ErrorIconProps> = ({
  type,
  size = 'medium',
  color,
  className = '',
  animated = false,
  ariaLabel,
}) => {
  // Size configurations
  const sizeConfig = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  // Auto-select color based on type if not specified
  const getDefaultColor = (errorType: ErrorIconType): string => {
    switch (errorType) {
      case 'error':
      case 'server':
      case 'validation':
        return 'red';
      case 'warning':
        return 'yellow';
      case 'info':
      case 'network':
        return 'blue';
      case 'success':
        return 'green';
      case 'auth':
        return 'orange';
      case 'notFound':
        return 'purple';
      case 'generic':
      default:
        return 'gray';
    }
  };

  // Color configurations
  const colorConfig = {
    red: 'text-red-500',
    yellow: 'text-yellow-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    gray: 'text-gray-500',
    orange: 'text-orange-500',
    purple: 'text-purple-500',
  };

  const iconColor = color || (getDefaultColor(type) as keyof typeof colorConfig);
  const animationClass = animated ? 'animate-pulse' : '';

  /**
   * Get the appropriate SVG icon based on error type
   */
  const getIcon = () => {
    const baseClasses = `${sizeConfig[size]} ${colorConfig[iconColor]} ${animationClass} ${className}`;
    const baseProps = {
      className: baseClasses,
      fill: 'currentColor',
      viewBox: '0 0 24 24',
      'aria-label': ariaLabel || `${type} icon`,
      role: 'img',
    };

    switch (type) {
      case 'error':
        return (
          <svg {...baseProps}>
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
        );

      case 'warning':
        return (
          <svg {...baseProps}>
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
        );

      case 'info':
        return (
          <svg {...baseProps}>
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
        );

      case 'success':
        return (
          <svg {...baseProps}>
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        );

      case 'network':
        return (
          <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );

      case 'server':
        return (
          <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        );

      case 'auth':
        return (
          <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );

      case 'validation':
        return (
          <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );

      case 'notFound':
        return (
          <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );

      case 'generic':
      default:
        return (
          <svg {...baseProps} fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return getIcon();
};

export default ErrorIcon;