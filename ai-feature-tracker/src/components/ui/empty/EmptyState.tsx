import React from 'react';

export interface EmptyStateProps {
  /**
   * Main heading text
   */
  title: string;
  /**
   * Description or subtitle
   */
  description?: string;
  /**
   * Icon to display (SVG element or icon name)
   */
  icon?: React.ReactNode | 'default' | 'search' | 'folder' | 'data' | 'tools' | 'features';
  /**
   * Primary action button
   */
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  /**
   * Secondary action button
   */
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Layout orientation
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * Whether to show illustration
   */
  showIllustration?: boolean;
  /**
   * Custom illustration element
   */
  illustration?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Background variant
   */
  background?: 'transparent' | 'subtle' | 'card';
}

/**
 * EmptyState - Generic empty state component for no-data scenarios
 * 
 * Provides user-friendly messaging and calls-to-action when content is empty.
 * Similar to empty state screens in mobile apps or desktop applications
 * with actionable guidance for users.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'default',
  primaryAction,
  secondaryAction,
  size = 'medium',
  orientation = 'vertical',
  showIllustration = true,
  illustration,
  className = '',
  background = 'transparent',
}) => {
  // Size configurations
  const sizeConfig = {
    small: {
      container: 'p-6',
      spacing: 'space-y-3',
      iconSize: 'w-12 h-12',
      titleSize: 'text-lg',
      descriptionSize: 'text-sm',
      buttonSize: 'px-4 py-2 text-sm',
    },
    medium: {
      container: 'p-8',
      spacing: 'space-y-4',
      iconSize: 'w-16 h-16',
      titleSize: 'text-xl',
      descriptionSize: 'text-base',
      buttonSize: 'px-6 py-3 text-base',
    },
    large: {
      container: 'p-12',
      spacing: 'space-y-6',
      iconSize: 'w-20 h-20',
      titleSize: 'text-2xl',
      descriptionSize: 'text-lg',
      buttonSize: 'px-8 py-4 text-lg',
    },
  };

  // Background configurations
  const backgroundConfig = {
    transparent: '',
    subtle: 'bg-gray-50',
    card: 'bg-white border border-gray-200 rounded-lg shadow-sm',
  };

  const config = sizeConfig[size];
  const layoutClasses = orientation === 'horizontal' 
    ? 'flex items-center gap-6' 
    : 'flex flex-col items-center text-center';

  /**
   * Get default icon based on icon type
   */
  const getDefaultIcon = () => {
    if (typeof icon !== 'string') return icon;

    const iconClasses = `${config.iconSize} text-gray-400`;

    switch (icon) {
      case 'search':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );

      case 'folder':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        );

      case 'data':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );

      case 'tools':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );

      case 'features':
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );

      case 'default':
      default:
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  /**
   * Render action button
   */
  const renderActionButton = (action: { label: string; onClick: () => void; icon?: React.ReactNode }, isPrimary = true) => (
    <button
      onClick={action.onClick}
      className={`
        ${config.buttonSize}
        ${isPrimary 
          ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500'
        }
        font-medium
        rounded-md
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        transition-colors
        inline-flex
        items-center
        gap-2
      `}
      type="button"
    >
      {action.icon}
      {action.label}
    </button>
  );

  return (
    <div 
      className={`
        ${backgroundConfig[background]}
        ${config.container}
        ${config.spacing}
        ${layoutClasses}
        ${className}
      `}
      role="status"
      aria-live="polite"
    >
      {/* Icon/Illustration Section */}
      {orientation === 'vertical' && (showIllustration || icon) && (
        <div className="flex-shrink-0">
          {illustration || getDefaultIcon()}
        </div>
      )}

      {/* Content Section */}
      <div className={`
        ${orientation === 'horizontal' ? 'flex-1' : 'max-w-md'}
        ${orientation === 'vertical' ? 'text-center' : 'text-left'}
      `}>
        {/* Icon for horizontal layout */}
        {orientation === 'horizontal' && (showIllustration || icon) && (
          <div className="flex-shrink-0 mb-2">
            {illustration || getDefaultIcon()}
          </div>
        )}

        {/* Title */}
        <h3 className={`${config.titleSize} font-semibold text-gray-900 mb-2`}>
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className={`${config.descriptionSize} text-gray-600 mb-4`}>
            {description}
          </p>
        )}

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <div className={`
            flex gap-3
            ${orientation === 'vertical' ? 'justify-center' : 'justify-start'}
            ${size === 'small' ? 'flex-col sm:flex-row' : ''}
          `}>
            {primaryAction && renderActionButton(primaryAction, true)}
            {secondaryAction && renderActionButton(secondaryAction, false)}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;