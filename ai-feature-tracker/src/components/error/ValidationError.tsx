import React from 'react';
import { ErrorMessage } from '../ui/error';

export interface ValidationErrorField {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationErrorProps {
  /**
   * Array of field-specific validation errors
   */
  errors: ValidationErrorField[];
  /**
   * General validation message
   */
  message?: string;
  /**
   * Title for the validation error section
   */
  title?: string;
  /**
   * Whether to show field names
   */
  showFieldNames?: boolean;
  /**
   * Whether to group errors by field
   */
  groupByField?: boolean;
  /**
   * Whether to show error counts
   */
  showErrorCount?: boolean;
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Maximum number of errors to display
   */
  maxErrors?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Callback when user wants to fix errors
   */
  onFix?: (field: string) => void;
  /**
   * Whether errors can be dismissed individually
   */
  dismissible?: boolean;
  /**
   * Callback when error is dismissed
   */
  onDismiss?: (field: string) => void;
}

/**
 * ValidationError - Comprehensive form and data validation error display
 * 
 * Provides detailed validation error reporting with field-specific messaging
 * and recovery actions. Similar to validation summary controls in desktop
 * applications with enhanced user guidance for form completion.
 */
export const ValidationError: React.FC<ValidationErrorProps> = ({
  errors,
  message,
  title = 'Validation Errors',
  showFieldNames = true,
  groupByField = false,
  showErrorCount = true,
  size = 'medium',
  maxErrors,
  className = '',
  onFix,
  dismissible = false,
  onDismiss,
}) => {
  // Filter and limit errors if needed
  const displayErrors = maxErrors ? errors.slice(0, maxErrors) : errors;
  const hasMoreErrors = maxErrors && errors.length > maxErrors;

  /**
   * Group errors by field if requested
   */
  const getGroupedErrors = () => {
    if (!groupByField) return { ungrouped: displayErrors };

    return displayErrors.reduce((groups, error) => {
      const field = error.field;
      if (!groups[field]) {
        groups[field] = [];
      }
      groups[field].push(error);
      return groups;
    }, {} as Record<string, ValidationErrorField[]>);
  };

  /**
   * Format field name for display
   */
  const formatFieldName = (field: string): string => {
    return field
      .split(/[_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  /**
   * Get general error message
   */
  const getGeneralMessage = (): string => {
    if (message) return message;

    const errorCount = errors.length;
    if (errorCount === 1) {
      return 'Please fix the following issue before continuing:';
    }
    return `Please fix the following ${errorCount} issues before continuing:`;
  };

  /**
   * Render individual error item
   */
  const renderErrorItem = (error: ValidationErrorField, index: number) => {
    const fieldDisplay = showFieldNames ? formatFieldName(error.field) : null;

    return (
      <div key={`${error.field}-${index}`} className="flex items-start gap-2">
        {/* Error bullet */}
        <div className="flex-shrink-0 mt-1">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
        </div>

        {/* Error content */}
        <div className="flex-1 min-w-0">
          <span className="text-red-800 text-sm">
            {fieldDisplay && (
              <span className="font-medium">{fieldDisplay}: </span>
            )}
            {error.message}
          </span>

          {/* Value preview if available */}
          {error.value !== undefined && error.value !== null && error.value !== '' && (
            <div className="mt-1 text-xs text-red-600 font-mono bg-red-50 px-2 py-1 rounded">
              Current value: "{String(error.value)}"
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-1">
          {onFix && (
            <button
              onClick={() => onFix(error.field)}
              className="
                text-xs 
                text-red-600 
                hover:text-red-800 
                font-medium
                focus:outline-none
                focus:underline
              "
              type="button"
            >
              Fix
            </button>
          )}

          {dismissible && onDismiss && (
            <button
              onClick={() => onDismiss(error.field)}
              className="
                text-red-400 
                hover:text-red-600
                focus:outline-none
                focus:ring-1
                focus:ring-red-500
                rounded
              "
              type="button"
              aria-label={`Dismiss error for ${error.field}`}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  };

  /**
   * Render grouped errors
   */
  const renderGroupedErrors = () => {
    const groupedErrors = getGroupedErrors();

    if (groupedErrors['ungrouped']) {
      return (
        <div className="space-y-2">
          {groupedErrors['ungrouped'].map((error, index) => 
            renderErrorItem(error, index)
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {Object.entries(groupedErrors).map(([field, fieldErrors]) => (
          <div key={field} className="space-y-2">
            <h4 className="text-sm font-semibold text-red-900">
              {formatFieldName(field)}
            </h4>
            <div className="pl-4 space-y-2">
              {fieldErrors.map((error, index) => 
                renderErrorItem(error, index)
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Don't render if no errors
  if (errors.length === 0) return null;

  return (
    <div className={className}>
      <ErrorMessage
        type="error"
        message={showErrorCount ? `${title} (${errors.length})` : title}
        description={getGeneralMessage()}
        size={size}
        showIcon={true}
        dismissible={false}
      />

      {/* Error List */}
      <div className="mt-3 bg-red-50 border border-red-200 rounded-md p-4">
        {renderGroupedErrors()}

        {/* Show more errors indicator */}
        {hasMoreErrors && (
          <div className="mt-3 pt-3 border-t border-red-200">
            <p className="text-sm text-red-600">
              ... and {errors.length - maxErrors!} more error{errors.length - maxErrors! !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* General help text */}
        <div className="mt-4 pt-3 border-t border-red-200">
          <p className="text-xs text-red-600">
            💡 Tip: Fix the errors above and try again. Fields marked with * are required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValidationError;