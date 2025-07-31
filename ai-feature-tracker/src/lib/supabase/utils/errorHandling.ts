import { PostgrestError } from '@supabase/supabase-js';

/**
 * Enhanced database error type for better error handling
 * Similar to creating custom exception types in C# for better error categorization
 */
export type DatabaseError = {
  code: string;
  message: string;
  userMessage: string;
  severity: 'low' | 'medium' | 'high';
  category: 'validation' | 'permission' | 'network' | 'system' | 'data';
  retryable: boolean;
  timestamp: Date;
};

/**
 * Handle database errors with user-friendly messages
 * Similar to implementing global exception handling in C# Web API
 * Maps PostgreSQL error codes to meaningful user messages
 */
export function handleDatabaseError(error: PostgrestError, _context?: string): DatabaseError {
  const timestamp = new Date();
  
  // Map common PostgreSQL error codes to user-friendly messages
  const errorMappings: Record<string, Partial<DatabaseError>> = {
    '23505': { // Unique violation
      userMessage: 'This item already exists. Please use a different name or identifier.',
      severity: 'medium',
      category: 'validation',
      retryable: false,
    },
    '23503': { // Foreign key violation
      userMessage: 'Cannot complete this action because this item is referenced by other data.',
      severity: 'medium',
      category: 'validation',
      retryable: false,
    },
    '23502': { // Not null violation
      userMessage: 'Required information is missing. Please fill in all required fields.',
      severity: 'medium',
      category: 'validation',
      retryable: false,
    },
    '42501': { // Insufficient privilege (RLS)
      userMessage: 'You do not have permission to perform this action.',
      severity: 'high',
      category: 'permission',
      retryable: false,
    },
    '42P01': { // Undefined table
      userMessage: 'Database table not found. Please contact support.',
      severity: 'high',
      category: 'system',
      retryable: false,
    },
    '08006': { // Connection failure
      userMessage: 'Unable to connect to database. Please try again in a moment.',
      severity: 'high',
      category: 'network',
      retryable: true,
    },
    '08000': { // Connection exception
      userMessage: 'Database connection error. Please check your internet connection and try again.',
      severity: 'high',
      category: 'network',
      retryable: true,
    },
    '53300': { // Too many connections
      userMessage: 'Service is currently busy. Please try again in a few moments.',
      severity: 'high',
      category: 'system',
      retryable: true,
    },
    '57014': { // Query cancelled
      userMessage: 'Operation was cancelled. Please try again.',
      severity: 'medium',
      category: 'system',
      retryable: true,
    },
    '22001': { // String data right truncation
      userMessage: 'Input data is too long. Please use shorter text.',
      severity: 'low',
      category: 'validation',
      retryable: false,
    },
    '22003': { // Numeric value out of range
      userMessage: 'Number value is out of acceptable range.',
      severity: 'low',
      category: 'validation',
      retryable: false,
    },
    '25P02': { // Transaction rolled back
      userMessage: 'Operation failed and was rolled back. Please try again.',
      severity: 'medium',
      category: 'system',
      retryable: true,
    },
  };

  const mapping = errorMappings[error.code] || {};
  
  return {
    code: error.code,
    message: error.message,
    userMessage: mapping.userMessage || 'An unexpected error occurred. Please try again or contact support if the problem persists.',
    severity: mapping.severity || 'medium',
    category: mapping.category || 'system',
    retryable: mapping.retryable !== undefined ? mapping.retryable : true,
    timestamp,
  };
}

/**
 * Enhanced error logging with context and categorization
 * Similar to structured logging in C# with Serilog or NLog
 */
export function logDatabaseError(error: PostgrestError, context?: string, userId?: string) {
  const dbError = handleDatabaseError(error, context);
  
  const logEntry = {
    timestamp: dbError.timestamp.toISOString(),
    level: dbError.severity === 'high' ? 'ERROR' : dbError.severity === 'medium' ? 'WARN' : 'INFO',
    category: dbError.category,
    code: dbError.code,
    message: dbError.message,
    userMessage: dbError.userMessage,
    context: context || 'Unknown',
    userId: userId || 'Anonymous',
    retryable: dbError.retryable,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
    url: typeof window !== 'undefined' ? window.location.href : 'Server',
  };

  // Console logging with appropriate level
  switch (dbError.severity) {
    case 'high':
      console.error('Database Error (High Severity):', logEntry);
      break;
    case 'medium':
      console.warn('Database Error (Medium Severity):', logEntry);
      break;
    case 'low':
      console.info('Database Error (Low Severity):', logEntry);
      break;
  }

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error, { extra: logEntry });
  }

  return logEntry;
}

/**
 * Retry utility for transient database errors
 * Similar to implementing retry policies in C# with Polly library
 * Includes exponential backoff and jitter for better distributed system behavior
 */
export async function retryDatabaseOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 10000,
  jitter: boolean = true
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry certain error types
      if (error instanceof Error && isNonRetryableError(error)) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff and optional jitter
      let delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      
      if (jitter) {
        // Add random jitter (±25%) to prevent thundering herd
        const jitterRange = delay * 0.25;
        delay += (Math.random() * 2 - 1) * jitterRange;
      }

      console.warn(`Database operation failed (attempt ${attempt}/${maxRetries}). Retrying in ${Math.round(delay)}ms...`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        attempt,
        delay: Math.round(delay)
      });

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Determine if an error should not be retried
 * Similar to configuring retry policies in C# to avoid retrying permanent failures
 */
function isNonRetryableError(error: Error): boolean {
  // Don't retry authentication, permission, validation, or permanent errors
  const nonRetryableCodes = [
    '42501', // Insufficient privilege
    '23505', // Unique violation
    '23503', // Foreign key violation
    '23502', // Not null violation
    '22001', // String data right truncation
    '22003', // Numeric value out of range
    '42P01', // Undefined table
    '42703', // Undefined column
    '42883', // Undefined function
  ];

  return nonRetryableCodes.some(code => error.message.includes(code));
}

/**
 * Network error handler for connection issues
 * Similar to handling network exceptions in C# HttpClient operations
 */
export function handleNetworkError(error: Error, _context?: string): DatabaseError {
  return {
    code: 'NETWORK_ERROR',
    message: error.message,
    userMessage: 'Unable to connect to the server. Please check your internet connection and try again.',
    severity: 'high',
    category: 'network',
    retryable: true,
    timestamp: new Date(),
  };
}

/**
 * Validation error handler for client-side validation
 * Similar to handling model validation errors in C# MVC/Web API
 */
export function handleValidationError(field: string, _value: any, rule: string): DatabaseError {
  const validationMessages: Record<string, string> = {
    required: `${field} is required`,
    minLength: `${field} is too short`,
    maxLength: `${field} is too long`,
    email: `${field} must be a valid email address`,
    url: `${field} must be a valid URL`,
    pattern: `${field} format is invalid`,
    min: `${field} value is too small`,
    max: `${field} value is too large`,
  };

  return {
    code: 'VALIDATION_ERROR',
    message: `Validation failed for ${field}: ${rule}`,
    userMessage: validationMessages[rule] || `${field} is invalid`,
    severity: 'low',
    category: 'validation',
    retryable: false,
    timestamp: new Date(),
  };
}

/**
 * Batch error handler for multiple operations
 * Similar to handling batch operation failures in C# Entity Framework
 */
export function handleBatchErrors(errors: Array<{ operation: string; error: Error }>): {
  successCount: number;
  errorCount: number;
  errors: DatabaseError[];
  summary: string;
} {
  const processedErrors = errors.map(({ operation, error }) => {
    if (error.message.includes('PGRST')) {
      // PostgreSQL error
      return handleDatabaseError(error as PostgrestError, operation);
    } else {
      // Network or other error
      return handleNetworkError(error, operation);
    }
  });

  const totalOperations = errors.length;
  const errorCount = processedErrors.length;
  const successCount = Math.max(0, totalOperations - errorCount);

  const summary = `Batch operation completed: ${successCount} successful, ${errorCount} failed`;

  return {
    successCount,
    errorCount,
    errors: processedErrors,
    summary,
  };
}

/**
 * Generic error boundary handler for React components
 * Similar to global exception handling in C# applications
 */
export function createErrorBoundaryHandler(componentName: string) {
  return (error: Error, errorInfo: { componentStack: string }) => {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      component: componentName,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      componentStack: errorInfo.componentStack,
      userAgent: window.navigator.userAgent,
      url: window.location.href,
    };

    console.error(`React Error Boundary (${componentName}):`, errorDetails);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service
      // Example: Sentry.captureException(error, { extra: errorDetails });
    }

    return errorDetails;
  };
}

/**
 * Performance monitoring for database operations
 * Similar to implementing performance counters in C# applications
 */
export function createPerformanceMonitor(operationName: string) {
  const startTime = performance.now();
  
  return {
    finish: (success: boolean = true, recordCount?: number) => {
      const duration = performance.now() - startTime;
      
      const metrics = {
        operation: operationName,
        duration: Math.round(duration * 100) / 100, // Round to 2 decimal places
        success,
        recordCount,
        timestamp: new Date().toISOString(),
      };

      // Log slow operations (> 1 second)
      if (duration > 1000) {
        console.warn(`Slow database operation detected:`, metrics);
      } else if (duration > 100) {
        console.info(`Database operation completed:`, metrics);
      }

      // In production, send to performance monitoring service
      if (process.env.NODE_ENV === 'production') {
        // TODO: Send to performance monitoring service
        // Example: ApplicationInsights.trackDependency('Database', operationName, duration, success);
      }

      return metrics;
    }
  };
}

/**
 * Circuit breaker pattern for database operations
 * Similar to implementing circuit breaker pattern in C# for resilience
 */
class DatabaseCircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private failureThreshold = 5,
    private recoveryTimeout = 60000 // 1 minute
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime < this.recoveryTimeout) {
        throw new Error('Circuit breaker is OPEN - service temporarily unavailable');
      } else {
        this.state = 'HALF_OPEN';
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      console.error(`Circuit breaker opened after ${this.failures} failures`);
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
    };
  }
}

// Export a default circuit breaker instance
export const databaseCircuitBreaker = new DatabaseCircuitBreaker();

/**
 * Error recovery suggestions based on error type
 * Similar to providing user guidance in C# application exception handling
 */
export function getErrorRecoveryActions(error: DatabaseError): string[] {
  const actions: string[] = [];

  switch (error.category) {
    case 'network':
      actions.push('Check your internet connection');
      actions.push('Try refreshing the page');
      if (error.retryable) {
        actions.push('Wait a moment and try again');
      }
      break;

    case 'permission':
      actions.push('Contact your administrator for access');
      actions.push('Try logging out and back in');
      break;

    case 'validation':
      actions.push('Check that all required fields are filled');
      actions.push('Verify that your input follows the correct format');
      actions.push('Try using different values');
      break;

    case 'system':
      actions.push('Try again in a few moments');
      actions.push('Contact support if the problem persists');
      if (error.retryable) {
        actions.push('The system will automatically retry');
      }
      break;

    case 'data':
      actions.push('Check your input data');
      actions.push('Try with different values');
      actions.push('Contact support if you believe this is an error');
      break;
  }

  return actions;
}