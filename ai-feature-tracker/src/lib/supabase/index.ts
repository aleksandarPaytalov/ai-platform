/**
 * AI Feature Tracker - Supabase Integration Layer
 * 
 * This module provides a complete TypeScript integration layer for Supabase,
 * similar to how you'd structure data access in C# with Entity Framework.
 * 
 * The architecture follows enterprise patterns:
 * - Client configurations for different use cases (public, admin, real-time)
 * - Service layer with comprehensive CRUD operations
 * - React hooks for component-level data access
 * - Error handling with user-friendly messages
 * - Health monitoring and connection management
 */

// Database types (similar to C# entity models)
export * from '@/types/database.types';

// Client configurations (similar to DbContext in Entity Framework)
export {
  supabase,
  supabaseAdmin,
  supabaseRealtime,
  checkSupabaseConnection,
  testDatabaseConnectivity,
} from './client';

// Service layer (similar to repository pattern in C#)
export { toolsService } from './services/toolsService';
export { categoriesService } from './services/categoriesService';
export { updatesService } from './services/updatesService';

// React hooks for data fetching (similar to using services in React components)
export {
  useTools,
  useToolsWithLatestUpdates,
  useToolBySlug,
  useToolById,
  useToolsByCategory,
  useToolsWithCategories,
  useToolSearch,
  useToolCountByCategory,
} from './hooks/useTools';

export {
  useCategories,
  useCategoryById,
  useCategoriesWithToolCount,
  useCategoryStatistics,
  useCategoryNameAvailability,
  useNextCategorySortOrder,
} from './hooks/useCategories';

export {
  useLatestUpdates,
  useUpdatesByTool,
  useUpdatesByImpact,
  useUpdateSearch,
  useUpdateById,
  useUpdatesPaginated,
  useUpdatesByDateRange,
  useUpdateStatistics,
  useTrendingTools,
  useUpdatesByValidationStatus,
  usePendingUpdates,
} from './hooks/useUpdates';

// Error handling utilities (similar to global exception handling in C#)
export {
  handleDatabaseError,
  logDatabaseError,
  retryDatabaseOperation,
  handleNetworkError,
  handleValidationError,
  handleBatchErrors,
  createErrorBoundaryHandler,
  createPerformanceMonitor,
  databaseCircuitBreaker,
  getErrorRecoveryActions,
  type DatabaseError,
} from './utils/errorHandling';

// Health monitoring utilities (similar to health checks in ASP.NET Core)
export {
  checkDatabaseHealth,
  useConnectionHealth,
  isHealthyConnection,
  getHealthStatusMessage,
  runDiagnostics,
  DatabaseLatencyMonitor,
  latencyMonitor,
  attemptConnectionRecovery,
  type ConnectionHealth,
} from './utils/healthCheck';