import React from 'react';
import { EmptyState } from './EmptyState';

export interface ComingSoonProps {
  /**
   * Feature or content name
   */
  featureName?: string;
  /**
   * Expected release timeframe
   */
  timeline?: 'soon' | 'weeks' | 'months' | 'quarter' | 'year' | 'custom';
  /**
   * Custom timeline description
   */
  customTimeline?: string;
  /**
   * Feature description
   */
  description?: string;
  /**
   * Whether to show email notification signup
   */
  showNotification?: boolean;
  /**
   * Email notification signup callback
   */
  onNotifyMe?: (email: string) => void;
  /**
   * Whether to show progress indicator
   */
  showProgress?: boolean;
  /**
   * Progress percentage (0-100)
   */
  progress?: number;
  /**
   * Whether to show feature preview/mockup
   */
  showPreview?: boolean;
  /**
   * Preview image or component
   */
  preview?: React.ReactNode;
  /**
   * List of planned features/capabilities
   */
  plannedFeatures?: string[];
  /**
   * Alternative action while waiting
   */
  alternativeAction?: {
    label: string;
    onClick: () => void;
    description?: string;
  };
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show social sharing
   */
  showSharing?: boolean;
  /**
   * Sharing callback
   */
  onShare?: (platform: 'twitter' | 'linkedin' | 'facebook' | 'email') => void;
}

/**
 * ComingSoon - Specialized empty state for upcoming features
 * 
 * Provides engaging messaging for features that are planned but not yet
 * implemented. Includes progress tracking, notification signup, and
 * alternative actions to keep users engaged.
 */
export const ComingSoon: React.FC<ComingSoonProps> = ({
  featureName = 'This Feature',
  timeline = 'soon',
  customTimeline,
  description,
  showNotification = true,
  onNotifyMe,
  showProgress = false,
  progress = 0,
  showPreview = false,
  preview,
  plannedFeatures = [],
  alternativeAction,
  size = 'medium',
  className = '',
  showSharing = false,
  onShare,
}) => {
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  /**
   * Get timeline description
   */
  const getTimelineText = (): string => {
    if (customTimeline) return customTimeline;
    
    switch (timeline) {
      case 'soon':
        return 'coming soon';
      case 'weeks':
        return 'in the next few weeks';
      case 'months':
        return 'in the coming months';
      case 'quarter':
        return 'this quarter';
      case 'year':
        return 'this year';
      default:
        return 'coming soon';
    }
  };

  /**
   * Generate main message
   */
  const getMainMessage = (): string => {
    return `${featureName} is ${getTimelineText()}.`;
  };

  /**
   * Get description with development context
   */
  const getDescription = (): string => {
    if (description) return description;

    const baseDescription = `We're working hard to bring you ${featureName.toLowerCase()}. `;
    
    if (showProgress && progress > 0) {
      return baseDescription + `Development is ${progress}% complete. `;
    }
    
    return baseDescription + 'Stay tuned for updates on our progress.';
  };

  /**
   * Handle email notification signup
   */
  const handleNotifySignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && onNotifyMe) {
      onNotifyMe(email.trim());
      setIsSubscribed(true);
      setEmail('');
    }
  };

  /**
   * Handle social sharing
   */
  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook' | 'email') => {
    if (onShare) {
      onShare(platform);
    } else {
      // Default sharing behavior
      const text = `Excited about ${featureName} coming to AI Feature Tracker!`;
      const url = window.location.href;
      
      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
          break;
        case 'email':
          window.open(`mailto:?subject=${encodeURIComponent(featureName + ' - Coming Soon')}&body=${encodeURIComponent(text + '\n\n' + url)}`);
          break;
      }
    }
  };

  /**
   * Get primary action
   */
  const getPrimaryAction = () => {
    if (alternativeAction) {
      return {
        label: alternativeAction.label,
        onClick: alternativeAction.onClick,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        ),
      };
    }

    return undefined;
  };

  /**
   * Custom coming soon icon
   */
  const comingSoonIcon = (
    <div className="relative">
      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      
      {/* Progress ring overlay */}
      {showProgress && progress > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-500"
            />
          </svg>
        </div>
      )}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <EmptyState
        title={getMainMessage()}
        description={getDescription()}
        icon={comingSoonIcon}
        {...(getPrimaryAction() ? { primaryAction: getPrimaryAction()! } : {})}
        size={size}
        background="subtle"
      />

      {/* Progress Indicator */}
      {showProgress && progress > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900">Development Progress</h4>
            <span className="text-sm font-medium text-blue-600">{progress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            We're making great progress! {featureName} is {progress}% complete.
          </p>
        </div>
      )}

      {/* Preview */}
      {showPreview && preview && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Preview</h4>
          <div className="relative">
            {preview}
            <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center rounded">
              <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full shadow">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Planned Features */}
      {plannedFeatures.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">What to Expect</h4>
          
          <ul className="space-y-2">
            {plannedFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Email Notification */}
      {showNotification && onNotifyMe && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          {!isSubscribed ? (
            <>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Get Notified</h4>
              <p className="text-sm text-gray-600 mb-3">
                Be the first to know when {featureName} becomes available.
              </p>
              
              <form onSubmit={handleNotifySignup} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="
                    flex-1 
                    px-3 py-2 
                    border border-gray-300 
                    rounded-md 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-500 
                    focus:border-blue-500
                    text-sm
                  "
                />
                <button
                  type="submit"
                  className="
                    px-4 py-2 
                    bg-blue-600 
                    text-white 
                    rounded-md 
                    hover:bg-blue-700 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-500 
                    focus:ring-offset-2
                    transition-colors
                    text-sm
                    font-medium
                  "
                >
                  Notify Me
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">You're all set!</h4>
              <p className="text-sm text-gray-600">
                We'll notify you when {featureName} is ready.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Alternative Action */}
      {alternativeAction && alternativeAction.description && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">In the meantime</h4>
          <p className="text-sm text-gray-600 mb-3">{alternativeAction.description}</p>
          
          <button
            onClick={alternativeAction.onClick}
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
            {alternativeAction.label} →
          </button>
        </div>
      )}

      {/* Social Sharing */}
      {showSharing && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Spread the word</h4>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 text-gray-400 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              type="button"
              aria-label="Share on Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            
            <button
              onClick={() => handleShare('linkedin')}
              className="p-2 text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              type="button"
              aria-label="Share on LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
            
            <button
              onClick={() => handleShare('email')}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
              type="button"
              aria-label="Share via Email"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComingSoon;