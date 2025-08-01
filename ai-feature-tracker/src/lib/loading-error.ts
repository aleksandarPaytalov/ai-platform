/**
 * Loading & Error State Management Utilities
 * 
 * Comprehensive utilities for managing loading states, error handling,
 * and retry logic throughout the AI Feature Tracker application.
 * Similar to error handling patterns in enterprise C#/.NET applications.
 */

// ========================================
// Type Definitions
// ========================================

/**
 * Loading state enumeration
 */
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Error categories for better handling
 */
export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  SERVER = 'server',
  CLIENT = 'client',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown',
}

/**
 * Comprehensive error information structure
 */
export interface ErrorInfo {
  id: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: string;
  context?: string;
  stack?: string;
  statusCode?: number;
  statusText?: string;
  url?: string;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
  additionalData?: Record<string, any>;
}

/**
 * Loading state with data and error information
 */
export interface AsyncState<T = any> {
  loading: boolean;
  data: T | null;
  error: ErrorInfo | null;
  lastUpdated: string | null;
}

/**
 * Retry configuration options
 */
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  exponentialBackoff: boolean;
  maxDelay: number;
  retryCondition?: (error: ErrorInfo, attempt: number) => boolean;
}

/**
 * Loading timeout configuration
 */
export interface TimeoutConfig {
  duration: number;
  message?: string;
  onTimeout?: () => void;
}

// ========================================
// Error Classification & Processing
// ========================================

/**
 * Classify error based on various error types and HTTP status codes
 */
export function classifyError(error: unknown, statusCode?: number, url?: string): ErrorCategory {
  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return ErrorCategory.NETWORK;
  }

  // HTTP status code classification
  if (statusCode) {
    if (statusCode === 401) return ErrorCategory.AUTHENTICATION;
    if (statusCode === 403) return ErrorCategory.AUTHORIZATION;
    if (statusCode >= 400 && statusCode < 500) return ErrorCategory.CLIENT;
    if (statusCode >= 500) return ErrorCategory.SERVER;
    if (statusCode === 408 || statusCode === 504) return ErrorCategory.TIMEOUT;
  }

  // Error message classification
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('timeout') || message.includes('aborted')) {
      return ErrorCategory.TIMEOUT;
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return ErrorCategory.NETWORK;
    }
    
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorCategory.VALIDATION;
    }
    
    if (message.includes('unauthorized') || message.includes('forbidden')) {
      return ErrorCategory.AUTHENTICATION;
    }
  }

  return ErrorCategory.UNKNOWN;
}

/**
 * Determine error severity based on category and context
 */
export function determineErrorSeverity(
  category: ErrorCategory,
  statusCode?: number,
  context?: string
): ErrorSeverity {
  // Critical errors that break core functionality
  if (category === ErrorCategory.SERVER && statusCode && statusCode >= 500) {
    return ErrorSeverity.CRITICAL;
  }

  // High severity errors
  if (category === ErrorCategory.AUTHENTICATION || category === ErrorCategory.AUTHORIZATION) {
    return ErrorSeverity.HIGH;
  }

  // Medium severity errors
  if (category === ErrorCategory.NETWORK || category === ErrorCategory.TIMEOUT) {
    return ErrorSeverity.MEDIUM;
  }

  // Low severity errors
  if (category === ErrorCategory.VALIDATION || category === ErrorCategory.CLIENT) {
    return ErrorSeverity.LOW;
  }

  return ErrorSeverity.MEDIUM;
}

/**
 * Create standardized error information object
 */
export function createErrorInfo(
  error: unknown,
  context?: string,
  additionalData?: Record<string, any>
): ErrorInfo {
  const id = generateErrorId();
  const timestamp = new Date().toISOString();
  
  let message = 'An unexpected error occurred';
  let stack: string | undefined;
  let statusCode: number | undefined;
  let statusText: string | undefined;
  let url: string | undefined;

  // Extract information from different error types
  if (error instanceof Error) {
    message = error.message;
    stack = error.stack;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object') {
    // Handle fetch response errors
    const errorObj = error as any;
    message = errorObj.message || errorObj.statusText || message;
    statusCode = errorObj.status || errorObj.statusCode;
    statusText = errorObj.statusText;
    url = errorObj.url;
  }

  const category = classifyError(error, statusCode, url);
  const severity = determineErrorSeverity(category, statusCode, context);

  return {
    id,
    message,
    category,
    severity,
    timestamp,
    context,
    stack,
    statusCode,
    statusText,
    url,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    additionalData,
  };
}

/**
 * Generate unique error ID
 */
function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ========================================
// Retry Logic
// ========================================

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  exponentialBackoff: true,
  maxDelay: 10000,
  retryCondition: (error, attempt) => {
    // Retry network errors and temporary server errors
    return (
      error.category === ErrorCategory.NETWORK ||
      error.category === ErrorCategory.TIMEOUT ||
      (error.category === ErrorCategory.SERVER && error.statusCode && error.statusCode >= 500)
    );
  },
};

/**
 * Calculate delay for retry attempt with exponential backoff
 */
export function calculateRetryDelay(
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  if (!config.exponentialBackoff) {
    return config.baseDelay;
  }

  const delay = config.baseDelay * Math.pow(2, attempt - 1);
  return Math.min(delay, config.maxDelay);
}

/**
 * Determine if error should be retried
 */
export function shouldRetryError(
  error: ErrorInfo,
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): boolean {
  if (attempt >= config.maxAttempts) {
    return false;
  }

  if (config.retryCondition) {
    return config.retryCondition(error, attempt);
  }

  // Default retry logic
  return (
    error.category === ErrorCategory.NETWORK ||
    error.category === ErrorCategory.TIMEOUT ||
    (error.category === ErrorCategory.SERVER && error.statusCode && error.statusCode >= 500)
  );
}

/**
 * Execute function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  context?: string
): Promise<T> {
  let lastError: ErrorInfo;
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = createErrorInfo(error, context, { attempt });
      
      if (!shouldRetryError(lastError, attempt, config)) {
        throw lastError;
      }

      if (attempt < config.maxAttempts) {
        const delay = calculateRetryDelay(attempt, config);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

// ========================================
// Loading State Management
// ========================================

/**
 * Create initial async state
 */
export function createAsyncState<T = any>(initialData: T | null = null): AsyncState<T> {
  return {
    loading: false,
    data: initialData,
    error: null,
    lastUpdated: null,
  };
}

/**
 * Create loading state
 */
export function createLoadingState<T = any>(previousData: T | null = null): AsyncState<T> {
  return {
    loading: true,
    data: previousData,
    error: null,
    lastUpdated: null,
  };
}

/**
 * Create success state
 */
export function createSuccessState<T = any>(data: T): AsyncState<T> {
  return {
    loading: false,
    data,
    error: null,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Create error state
 */
export function createErrorState<T = any>(
  error: ErrorInfo,
  previousData: T | null = null
): AsyncState<T> {
  return {
    loading: false,
    data: previousData,
    error,
    lastUpdated: null,
  };
}

// ========================================
// Loading Timeout Management
// ========================================

/**
 * Create timeout manager for loading operations
 */
export function createLoadingTimeout(
  config: TimeoutConfig,
  onTimeout?: () => void
): { clearTimeout: () => void } {
  const timeoutId = window.setTimeout(() => {
    if (config.onTimeout) {
      config.onTimeout();
    }
    if (onTimeout) {
      onTimeout();
    }
  }, config.duration);

  return {
    clearTimeout: () => window.clearTimeout(timeoutId),
  };
}

// ========================================
// Error Logging & Reporting
// ========================================

/**
 * Log error to console with structured format
 */
export function logError(error: ErrorInfo): void {
  const logLevel = getLogLevel(error.severity);
  const logMessage = `[${error.severity.toUpperCase()}] ${error.category}: ${error.message}`;
  
  console[logLevel](logMessage, {
    id: error.id,
    timestamp: error.timestamp,
    context: error.context,
    stack: error.stack,
    statusCode: error.statusCode,
    url: error.url,
    additionalData: error.additionalData,
  });
}

/**
 * Get appropriate console log level for error severity
 */
function getLogLevel(severity: ErrorSeverity): 'log' | 'warn' | 'error' {
  switch (severity) {
    case ErrorSeverity.LOW:
      return 'log';
    case ErrorSeverity.MEDIUM:
      return 'warn';
    case ErrorSeverity.HIGH:
    case ErrorSeverity.CRITICAL:
      return 'error';
    default:
      return 'error';
  }
}

/**
 * Serialize error for external reporting
 */
export function serializeError(error: ErrorInfo): string {
  try {
    return JSON.stringify(error, null, 2);
  } catch (serializationError) {
    // Fallback for non-serializable errors
    return `Error ID: ${error.id}\nMessage: ${error.message}\nCategory: ${error.category}\nSeverity: ${error.severity}\nTimestamp: ${error.timestamp}`;
  }
}

/**
 * Report error to external service (placeholder for real implementation)
 */
export async function reportError(error: ErrorInfo): Promise<boolean> {
  try {
    // In a real application, this would send to your error reporting service
    // Example: Sentry, Bugsnag, custom endpoint, etc.
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error reporting (development mode):', serializeError(error));
      return true;
    }

    // Placeholder for production error reporting
    // const response = await fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: serializeError(error),
    // });
    // 
    // return response.ok;

    return true;
  } catch (reportingError) {
    console.error('Failed to report error:', reportingError);
    return false;
  }
}

// ========================================
// Error Boundary Helpers
// ========================================

/**
 * Higher-order component helper for error boundaries
 */
export function withErrorBoundary<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  errorBoundaryProps?: {
    fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  }
) {
  const WrappedComponent = (props: T) => {
    // This would typically be implemented with a higher-order component pattern
    // For now, return the component as-is since we have the ErrorBoundary component
    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// ========================================
// Development vs Production Differences
// ========================================

/**
 * Get error message appropriate for environment
 */
export function getDisplayErrorMessage(error: ErrorInfo): string {
  if (process.env.NODE_ENV === 'development') {
    return error.message;
  }

  // Production-friendly messages
  switch (error.category) {
    case ErrorCategory.NETWORK:
      return 'Unable to connect. Please check your internet connection and try again.';
    case ErrorCategory.SERVER:
      return 'Server error. We\'ve been notified and are working to fix this.';
    case ErrorCategory.AUTHENTICATION:
      return 'Please sign in to continue.';
    case ErrorCategory.AUTHORIZATION:
      return 'You don\'t have permission to access this resource.';
    case ErrorCategory.VALIDATION:
      return 'Please check your input and try again.';
    case ErrorCategory.TIMEOUT:
      return 'Request timed out. Please try again.';
    default:
      return 'Something went wrong. Please try again or contact support.';
  }
}

/**
 * Determine if error details should be shown
 */
export function shouldShowErrorDetails(error: ErrorInfo): boolean {
  return process.env.NODE_ENV === 'development' || error.severity === ErrorSeverity.LOW;
}

// ========================================
// Utility Functions
// ========================================

/**
 * Check if two error states are equivalent
 */
export function areErrorsEqual(error1: ErrorInfo | null, error2: ErrorInfo | null): boolean {
  if (!error1 && !error2) return true;
  if (!error1 || !error2) return false;
  
  return (
    error1.message === error2.message &&
    error1.category === error2.category &&
    error1.statusCode === error2.statusCode
  );
}

/**
 * Check if error is stale (older than specified duration)
 */
export function isErrorStale(error: ErrorInfo, maxAge: number = 30000): boolean {
  const errorTime = new Date(error.timestamp).getTime();
  const now = Date.now();
  return now - errorTime > maxAge;
}

/**
 * Create user-friendly error summary
 */
export function createErrorSummary(errors: ErrorInfo[]): string {
  if (errors.length === 0) return 'No errors';
  if (errors.length === 1) return getDisplayErrorMessage(errors[0]);
  
  const categories = new Set(errors.map(e => e.category));
  return `Multiple errors occurred (${categories.size} types, ${errors.length} total)`;
}

// Re-export React for HOC usage
import React from 'react';