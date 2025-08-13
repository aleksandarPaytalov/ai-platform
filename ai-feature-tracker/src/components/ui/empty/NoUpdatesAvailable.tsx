import React from 'react';
import { EmptyState } from './EmptyState';

export interface NoUpdatesAvailableProps {
  /**
   * Time period for which no updates are available
   */
  timePeriod?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  /**
   * Custom time period description
   */
  customPeriod?: string;
  /**
   * Type of updates being checked
   */
  updateType?: 'features' | 'tools' | 'platform' | 'all';
  /**
   * Custom message override
   */
  message?: string;
  /**
   * Whether to show subscription/notification options
   */
  showSubscription?: boolean;
  /**
   * Subscription callback
   */
  onSubscribe?: () => void;
  /**
   * Whether to show refresh option
   */
  showRefresh?: boolean;
  /**
   * Refresh callback
   */
  onRefresh?: () => void;
  /**
   * Whether to show browse all updates option
   */
  showBrowseAll?: boolean;
  /**
   * Browse all updates callback
   */
  onBrowseAll?: () => void;
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Last update timestamp
   */
  lastUpdate?: string;
  /**
   * Whether to show upcoming features
   */
  showUpcoming?: boolean;
  /**
   * Upcoming features callback
   */
  onViewUpcoming?: () => void;
}

/**
 * NoUpdatesAvailable - Specific empty state for when no new updates exist
 * 
 * Provides appropriate messaging and actions when there are no new features
 * or updates available. Includes subscription options and alternative content.
 */
export const NoUpdatesAvailable: React.FC<NoUpdatesAvailableProps> = ({
  timePeriod = 'week',
  customPeriod,
  updateType = 'all',
  message: _message,
  showSubscription = true,
  onSubscribe,
  showRefresh = true,
  onRefresh,
  showBrowseAll = true,
  onBrowseAll,
  size = 'medium',
  className = '',
  lastUpdate,
  showUpcoming = true,
  onViewUpcoming,
}) => {
  /**
   * Get time period description
   */
  const getTimePeriodText = (): string => {
    if (customPeriod) return customPeriod;
    
    switch (timePeriod) {
      case 'today':
        return 'today';
      case 'week':
        return 'this week';
      case 'month':
        return 'this month';
      case 'quarter':
        return 'this quarter';
      case 'year':
        return 'this year';
      default:
        return 'recently';
    }
  };

  /**
   * Get update type description
   */
  const getUpdateTypeText = (): string => {
    switch (updateType) {
      case 'features':
        return 'feature updates';
      case 'tools':
        return 'new AI tools';
      case 'platform':
        return 'platform updates';
      default:
        return 'updates';
    }
  };

  // Message rendered via description/title; keep logic minimal

  /**
   * Get description with helpful context
   */
  const getDescription = (): string => {
    const suggestions = [];

    if (lastUpdate) {
      suggestions.push(`Last update was ${lastUpdate}`);
    }

    switch (updateType) {
      case 'features':
        suggestions.push('We\'re constantly working on new features and improvements');
        break;
      case 'tools':
        suggestions.push('New AI tools are added regularly as they become available');
        break;
      case 'platform':
        suggestions.push('Platform updates are released as needed for stability and performance');
        break;
      default:
        suggestions.push('Updates are published regularly as new content becomes available');
    }

    if (showSubscription) {
      suggestions.push('Subscribe to notifications to stay informed of new updates');
    }

    return suggestions.join('. ') + '.';
  };

  /**
   * Get primary action
   */
  const getPrimaryAction = () => {
    if (showSubscription && onSubscribe) {
      return {
        label: 'Get Notified',
        onClick: onSubscribe,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm-8-3a9 9 0 1118 0v3a2 2 0 01-2 2h-1M9 14a9 9 0 118 0v3a2 2 0 002 2h1M9 14v1a2 2 0 002 2h1a2 2 0 002-2v-1" />
          </svg>
        ),
      };
    }

    if (showRefresh && onRefresh) {
      return {
        label: 'Check Again',
        onClick: onRefresh,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ),
      };
    }

    return undefined;
  };

  /**
   * Get secondary action
   */
  const getSecondaryAction = () => {
    if (showBrowseAll && onBrowseAll) {
      return {
        label: 'Browse All Updates',
        onClick: onBrowseAll,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        ),
      };
    }

    if (showRefresh && onRefresh && onSubscribe) {
      return {
        label: 'Check Again',
        onClick: onRefresh,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ),
      };
    }

    return undefined;
  };

  /**
   * Custom icon for updates
   */
  const updatesIcon = (
    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <EmptyState
        title="All Caught Up!"
        description={getDescription()}
        icon={updatesIcon}
        {...(getPrimaryAction() ? { primaryAction: getPrimaryAction()! } : {})}
        {...(getSecondaryAction() ? { secondaryAction: getSecondaryAction()! } : {})}
        size={size}
        background="subtle"
      />

      {/* Upcoming Features */}
      {showUpcoming && onViewUpcoming && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-sm font-medium text-gray-900">Coming Soon</h4>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            While there are no new updates {getTimePeriodText()}, we have exciting features in development.
          </p>
          
          <button
            onClick={onViewUpcoming}
            className="
              text-sm 
              text-blue-600 
              hover:text-blue-800 
              font-medium
              focus:outline-none
              focus:underline
            "
            type="button"
          >
            View Upcoming Features →
          </button>
        </div>
      )}

      {/* Subscription Options */}
      {showSubscription && onSubscribe && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm-8-3a9 9 0 1118 0v3a2 2 0 01-2 2h-1M9 14a9 9 0 118 0v3a2 2 0 002 2h1M9 14v1a2 2 0 002 2h1a2 2 0 002-2v-1" />
              </svg>
            </div>
            <h4 className="text-sm font-medium text-gray-900">Stay Updated</h4>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            Get notified instantly when new {getUpdateTypeText()} are available.
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={onSubscribe}
              className="
                px-3 py-1.5 
                text-sm 
                font-medium 
                text-white 
                bg-blue-600 
                rounded-md 
                hover:bg-blue-700
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-500 
                focus:ring-offset-2
                transition-colors
              "
              type="button"
            >
              Subscribe to Updates
            </button>
          </div>
        </div>
      )}

      {/* Last Update Info */}
      {lastUpdate && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Last update: {lastUpdate}
          </p>
        </div>
      )}
    </div>
  );
};

export default NoUpdatesAvailable;