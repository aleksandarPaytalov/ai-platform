import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export interface LoadingOverlayProps {
  /**
   * Whether the overlay is visible
   */
  isVisible: boolean;
  /**
   * Loading message to display
   */
  message?: string;
  /**
   * Submessage or additional details
   */
  submessage?: string;
  /**
   * Overlay opacity (0-100)
   */
  opacity?: number;
  /**
   * Backdrop blur effect
   */
  blur?: boolean;
  /**
   * Whether overlay covers full screen or just parent container
   */
  fullScreen?: boolean;
  /**
   * Whether to show a cancel button
   */
  showCancel?: boolean;
  /**
   * Cancel button handler
   */
  onCancel?: () => void;
  /**
   * Cancel button text
   */
  cancelText?: string;
  /**
   * Spinner size
   */
  spinnerSize?: 'small' | 'medium' | 'large' | 'xl';
  /**
   * Spinner color
   */
  spinnerColor?: 'primary' | 'secondary' | 'white' | 'gray';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Z-index value for the overlay
   */
  zIndex?: number;
}

/**
 * LoadingOverlay - Full-screen or container overlay for loading states
 * 
 * Provides modal-like loading experience that blocks user interaction
 * during critical operations. Similar to progress dialogs in desktop
 * applications with optional cancellation support.
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  submessage,
  opacity = 80,
  blur = true,
  fullScreen = false,
  showCancel = false,
  onCancel,
  cancelText = 'Cancel',
  spinnerSize = 'large',
  spinnerColor = 'primary',
  className = '',
  zIndex = 50,
}) => {
  // Don't render if not visible
  if (!isVisible) return null;

  // Handle cancel action
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && showCancel && onCancel) {
      handleCancel();
    }
  };

  // Backdrop classes
  const backdropClasses = `
    ${fullScreen ? 'fixed inset-0' : 'absolute inset-0'}
    bg-white
    ${blur ? 'backdrop-blur-sm' : ''}
    flex items-center justify-center
    transition-opacity duration-300
    ${className}
  `;

  // Calculate opacity style
  const opacityStyle = {
    backgroundColor: `rgba(255, 255, 255, ${opacity / 100})`,
    zIndex,
  };

  return (
    <div
      className={backdropClasses}
      style={opacityStyle}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-message"
      aria-describedby={submessage ? "loading-submessage" : undefined}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Loading Content */}
      <div className="flex flex-col items-center justify-center space-y-4 p-8 max-w-sm w-full mx-4">
        {/* Spinner */}
        <LoadingSpinner
          size={spinnerSize}
          color={spinnerColor}
          showText={false}
        />

        {/* Loading Message */}
        {message && (
          <div className="text-center space-y-2">
            <h3 
              id="loading-message"
              className="text-lg font-medium text-gray-900"
            >
              {message}
            </h3>
            
            {submessage && (
              <p 
                id="loading-submessage"
                className="text-sm text-gray-600"
              >
                {submessage}
              </p>
            )}
          </div>
        )}

        {/* Cancel Button */}
        {showCancel && onCancel && (
          <button
            onClick={handleCancel}
            className="
              px-4 py-2 
              text-sm font-medium 
              text-gray-700 
              bg-white 
              border border-gray-300 
              rounded-md 
              hover:bg-gray-50 
              focus:outline-none 
              focus:ring-2 
              focus:ring-blue-500 
              focus:ring-offset-2
              transition-colors
            "
            type="button"
          >
            {cancelText}
          </button>
        )}
      </div>

      {/* Accessibility: Screen reader announcement */}
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {message}
        {submessage && ` ${submessage}`}
      </div>
    </div>
  );
};

export default LoadingOverlay;