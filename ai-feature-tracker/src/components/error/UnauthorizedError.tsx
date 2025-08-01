import React from 'react';
import { ErrorCard } from '../ui/error';

export interface UnauthorizedErrorProps {
  /**
   * Type of authorization error
   */
  type?: 'authentication' | 'authorization' | 'session' | 'permission' | 'subscription';
  /**
   * Custom error message
   */
  message?: string;
  /**
   * Custom title
   */
  title?: string;
  /**
   * Required permission or role
   */
  requiredPermission?: string;
  /**
   * Current user role/permission
   */
  currentPermission?: string;
  /**
   * Whether to show login functionality
   */
  showLogin?: boolean;
  /**
   * Login callback
   */
  onLogin?: () => void;
  /**
   * Whether to show upgrade/subscription options
   */
  showUpgrade?: boolean;
  /**
   * Upgrade callback
   */
  onUpgrade?: () => void;
  /**
   * Whether to show contact support option
   */
  showSupport?: boolean;
  /**
   * Support contact callback
   */
  onSupport?: () => void;
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Redirect URL after successful authentication
   */
  redirectUrl?: string;
}

/**
 * UnauthorizedError - Specific error handling for authentication and authorization
 * 
 * Provides contextual messaging and recovery options for auth-related errors.
 * Includes login prompts, permission explanations, and upgrade paths.
 * Similar to access denied dialogs in desktop applications with clear next steps.
 */
export const UnauthorizedError: React.FC<UnauthorizedErrorProps> = ({
  type = 'authentication',
  message,
  title,
  requiredPermission,
  currentPermission,
  showLogin = true,
  onLogin,
  showUpgrade = false,
  onUpgrade,
  showSupport = true,
  onSupport,
  size = 'medium',
  className = '',
  redirectUrl,
}) => {
  /**
   * Generate appropriate error message based on auth error type
   */
  const getErrorMessage = (): string => {
    if (message) return message;

    switch (type) {
      case 'authentication':
        return 'You need to sign in to access this feature. Please log in with your account to continue.';
      
      case 'session':
        return 'Your session has expired for security reasons. Please sign in again to continue.';
      
      case 'permission':
        return `You don't have permission to access this feature. ${
          requiredPermission 
            ? `This action requires "${requiredPermission}" permission.`
            : 'Please contact an administrator if you believe this is an error.'
        }`;
      
      case 'authorization':
        return 'Access to this resource is restricted. You may need additional permissions or a different role.';
      
      case 'subscription':
        return 'This feature requires a premium subscription. Upgrade your account to access all features.';
      
      default:
        return 'Access denied. You don\'t have permission to view this content.';
    }
  };

  /**
   * Generate error title based on auth error type
   */
  const getErrorTitle = (): string => {
    if (title) return title;

    switch (type) {
      case 'authentication':
        return 'Sign In Required';
      case 'session':
        return 'Session Expired';
      case 'permission':
        return 'Insufficient Permissions';
      case 'authorization':
        return 'Access Denied';
      case 'subscription':
        return 'Premium Feature';
      default:
        return 'Unauthorized';
    }
  };

  /**
   * Generate detailed explanation and help text
   */
  const getDetailedExplanation = (): string => {
    const details: string[] = [];

    // Permission details
    if (requiredPermission) {
      details.push(`Required permission: ${requiredPermission}`);
    }

    if (currentPermission) {
      details.push(`Your current role: ${currentPermission}`);
    }

    // Context-specific help
    switch (type) {
      case 'authentication':
        details.push('');
        details.push('What you can do:');
        details.push('• Sign in with your existing account');
        details.push('• Create a new account if you don\'t have one');
        details.push('• Use "Forgot Password" if you can\'t remember your login');
        break;

      case 'session':
        details.push('');
        details.push('Why this happened:');
        details.push('• Your session expired for security');
        details.push('• You may have been inactive for too long');
        details.push('• Your account may have been accessed elsewhere');
        break;

      case 'permission':
        details.push('');
        details.push('To get access:');
        details.push('• Contact your administrator');
        details.push('• Request the required permission');
        details.push('• Check if you\'re using the correct account');
        break;

      case 'subscription':
        details.push('');
        details.push('Premium features include:');
        details.push('• Advanced AI tool analytics');
        details.push('• Custom feature tracking');
        details.push('• Priority support');
        details.push('• Export capabilities');
        break;

      default:
        details.push('');
        details.push('If you believe this is an error:');
        details.push('• Check that you\'re signed in to the correct account');
        details.push('• Contact support for assistance');
        details.push('• Try refreshing the page');
    }

    return details.join('\n');
  };

  /**
   * Handle login with optional redirect
   */
  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      // Default login handling
      const loginUrl = '/login';
      const fullUrl = redirectUrl 
        ? `${loginUrl}?redirect=${encodeURIComponent(redirectUrl)}`
        : loginUrl;
      
      window.location.href = fullUrl;
    }
  };

  /**
   * Handle upgrade action
   */
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Default upgrade handling
      window.location.href = '/pricing';
    }
  };

  /**
   * Handle support contact
   */
  const handleSupport = () => {
    if (onSupport) {
      onSupport();
    } else {
      // Default support contact
      const subject = encodeURIComponent(`Access Issue: ${getErrorTitle()}`);
      const body = encodeURIComponent(`
I'm having trouble accessing a feature:

Error Type: ${type}
Required Permission: ${requiredPermission || 'N/A'}
Current Permission: ${currentPermission || 'N/A'}
Page: ${window.location.href}

Please help me resolve this access issue.
      `);
      
      window.open(`mailto:support@ai-feature-tracker.com?subject=${subject}&body=${body}`);
    }
  };

  /**
   * Get appropriate actions based on error type
   */
  const getActions = () => {
    const actions = [];

    // Login action
    if (showLogin && (type === 'authentication' || type === 'session')) {
      actions.push({
        label: type === 'session' ? 'Sign In Again' : 'Sign In',
        onClick: handleLogin,
        variant: 'primary' as const,
      });
    }

    // Upgrade action
    if (showUpgrade && type === 'subscription') {
      actions.push({
        label: 'Upgrade Account',
        onClick: handleUpgrade,
        variant: 'primary' as const,
      });
    }

    // Support action
    if (showSupport) {
      actions.push({
        label: 'Contact Support',
        onClick: handleSupport,
        variant: type === 'permission' || type === 'authorization' ? 'primary' : 'outline',
      });
    }

    return actions;
  };

  return (
    <ErrorCard
      title={getErrorTitle()}
      message={getErrorMessage()}
      details={getDetailedExplanation()}
      errorType="auth"
      showRetry={false}
      size={size}
      className={className}
      actions={getActions()}
      background="colored"
    />
  );
};

export default UnauthorizedError;