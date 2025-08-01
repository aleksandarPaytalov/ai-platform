import React from 'react';
import { ErrorCard } from '../ui/error';

export interface NotFoundErrorProps {
  /**
   * Type of resource that was not found
   */
  resourceType?: 'page' | 'tool' | 'feature' | 'user' | 'file' | 'data' | 'api' | 'custom';
  /**
   * Name or identifier of the missing resource
   */
  resourceName?: string;
  /**
   * Custom error message
   */
  message?: string;
  /**
   * Custom title
   */
  title?: string;
  /**
   * Whether to show navigation suggestions
   */
  showSuggestions?: boolean;
  /**
   * Whether to show search functionality
   */
  showSearch?: boolean;
  /**
   * Search callback function
   */
  onSearch?: (query: string) => void;
  /**
   * Navigation callback to go back
   */
  onGoBack?: () => void;
  /**
   * Navigation callback to go home
   */
  onGoHome?: () => void;
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Related items or suggestions to show
   */
  suggestions?: Array<{
    title: string;
    description?: string;
    href?: string;
    onClick?: () => void;
  }>;
}

/**
 * NotFoundError - Specific error handling for 404 and missing resources
 * 
 * Provides helpful navigation and search options when content is not found.
 * Includes contextual suggestions and recovery actions based on the type
 * of missing resource. Similar to 404 pages in web applications with
 * enhanced user guidance.
 */
export const NotFoundError: React.FC<NotFoundErrorProps> = ({
  resourceType = 'page',
  resourceName,
  message,
  title,
  showSuggestions = true,
  showSearch = false,
  onSearch,
  onGoBack,
  onGoHome,
  size = 'medium',
  className = '',
  suggestions = [],
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  /**
   * Generate appropriate error message based on resource type
   */
  const getErrorMessage = (): string => {
    if (message) return message;

    const resourceDisplayName = resourceName ? `"${resourceName}"` : '';
    
    switch (resourceType) {
      case 'page':
        return `The page you're looking for ${resourceDisplayName} doesn't exist or has been moved.`;
      
      case 'tool':
        return `The AI tool ${resourceDisplayName} could not be found. It may have been removed or the link is incorrect.`;
      
      case 'feature':
        return `The feature ${resourceDisplayName} is not available or has been discontinued.`;
      
      case 'user':
        return `The user ${resourceDisplayName} could not be found or doesn't exist.`;
      
      case 'file':
        return `The file ${resourceDisplayName} could not be found or has been deleted.`;
      
      case 'data':
        return `The requested data ${resourceDisplayName} is not available or has been removed.`;
      
      case 'api':
        return `The API endpoint ${resourceDisplayName} is not available or has been deprecated.`;
      
      case 'custom':
      default:
        return `The requested resource ${resourceDisplayName} could not be found.`;
    }
  };

  /**
   * Generate error title based on resource type
   */
  const getErrorTitle = (): string => {
    if (title) return title;

    switch (resourceType) {
      case 'page':
        return 'Page Not Found';
      case 'tool':
        return 'AI Tool Not Found';
      case 'feature':
        return 'Feature Not Available';
      case 'user':
        return 'User Not Found';
      case 'file':
        return 'File Not Found';
      case 'data':
        return 'Data Not Found';
      case 'api':
        return 'API Endpoint Not Found';
      default:
        return 'Not Found';
    }
  };

  /**
   * Generate helpful suggestions based on resource type
   */
  const getDefaultSuggestions = () => {
    if (!showSuggestions) return '';

    const tips: string[] = [];

    switch (resourceType) {
      case 'page':
        tips.push(
          '• Check the URL for typos',
          '• Use the navigation menu to find the page',
          '• Try searching for the content you need'
        );
        break;
      
      case 'tool':
        tips.push(
          '• Browse our AI tools directory',
          '• Search for similar tools',
          '• Check if the tool has been updated or renamed'
        );
        break;
      
      case 'feature':
        tips.push(
          '• Check our feature updates page',
          '• Look for similar functionality',
          '• Contact support for more information'
        );
        break;
      
      default:
        tips.push(
          '• Check your spelling and try again',
          '• Use the search function',
          '• Navigate back to the previous page'
        );
    }

    return tips.join('\n');
  };

  /**
   * Handle search submission
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  /**
   * Get action buttons based on available callbacks
   */
  const getActions = () => {
    const actions = [];

    if (onGoBack) {
      actions.push({
        label: '← Go Back',
        onClick: onGoBack,
        variant: 'outline' as const,
      });
    }

    if (onGoHome) {
      actions.push({
        label: '🏠 Go Home',
        onClick: onGoHome,
        variant: 'primary' as const,
      });
    }

    return actions;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <ErrorCard
        title={getErrorTitle()}
        message={getErrorMessage()}
        details={getDefaultSuggestions()}
        errorType="notFound"
        showRetry={false}
        size={size}
        actions={getActions()}
        background="colored"
      />

      {/* Search Interface */}
      {showSearch && onSearch && (
        <div className="bg-white border border-purple-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Can't find what you're looking for? Try searching:
          </h4>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search for ${resourceType}s...`}
              className="
                flex-1 
                px-3 py-2 
                border border-gray-300 
                rounded-md 
                focus:outline-none 
                focus:ring-2 
                focus:ring-purple-500 
                focus:border-purple-500
              "
            />
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="
                px-4 py-2 
                bg-purple-600 
                text-white 
                rounded-md 
                hover:bg-purple-700 
                disabled:bg-gray-300 
                disabled:cursor-not-allowed
                focus:outline-none 
                focus:ring-2 
                focus:ring-purple-500 
                focus:ring-offset-2
                transition-colors
              "
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Related Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-white border border-purple-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            You might be looking for:
          </h4>
          
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="border-b border-gray-100 last:border-b-0 pb-2 last:pb-0">
                {suggestion.href ? (
                  <a
                    href={suggestion.href}
                    className="block text-purple-600 hover:text-purple-800 font-medium text-sm"
                  >
                    {suggestion.title}
                  </a>
                ) : suggestion.onClick ? (
                  <button
                    onClick={suggestion.onClick}
                    className="text-left text-purple-600 hover:text-purple-800 font-medium text-sm"
                  >
                    {suggestion.title}
                  </button>
                ) : (
                  <span className="text-gray-900 font-medium text-sm">
                    {suggestion.title}
                  </span>
                )}
                
                {suggestion.description && (
                  <p className="text-gray-600 text-xs mt-1">
                    {suggestion.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotFoundError;