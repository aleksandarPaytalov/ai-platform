import { useState, useEffect, useCallback } from 'react';
import { supabase, checkSupabaseConnection, testDatabaseConnectivity } from '@/lib/supabase/client';
import { createPerformanceMonitor } from './errorHandling';

/**
 * Connection health status type
 * Similar to health check models in C# ASP.NET Core health checks
 */
export type ConnectionHealth = {
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  timestamp: Date;
  error?: string;
  details?: Record<string, any>;
  checks: {
    database: boolean;
    tables: boolean;
    views: boolean;
    realtime: boolean;
  };
};

/**
 * Comprehensive database health check
 * Similar to implementing health check endpoints in C# Web API
 * Tests multiple aspects of database connectivity and functionality
 */
export async function checkDatabaseHealth(): Promise<ConnectionHealth> {
  const monitor = createPerformanceMonitor('health-check');
  const startTime = Date.now();
  
  const checks = {
    database: false,
    tables: false,
    views: false,
    realtime: false,
  };

  try {
    // Test 1: Basic connection
    const connectionResult = await checkSupabaseConnection();
    checks.database = connectionResult.connected;
    
    if (!connectionResult.connected) {
      const latency = Date.now() - startTime;
      monitor.finish(false);
      
      return {
        status: 'down',
        latency,
        timestamp: new Date(),
        error: (connectionResult.error as any)?.message || 'Connection failed',
        checks,
      };
    }

    // Test 2: Table access
    try {
      const { error: categoriesError } = await supabase
        .from('tool_categories')
        .select('id')
        .limit(1);

      if (!categoriesError) {
        checks.tables = true;
      }
    } catch (err) {
      console.warn('Health check: Table access failed', err);
    }

    // Test 3: View access
    try {
      const { error: viewError } = await supabase
        .from('tools_with_latest_updates')
        .select('id')
        .limit(1);

      if (!viewError) {
        checks.views = true;
      }
    } catch (err) {
      console.warn('Health check: View access failed', err);
    }

    // Test 4: Real-time capability
    try {
      // Test if we can subscribe to real-time updates
      const channel = supabase
        .channel('health-check')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'tool_categories' }, 
          () => {}
        );
      
      // Subscribe and immediately unsubscribe
      await channel.subscribe();
      checks.realtime = true;
      await supabase.removeChannel(channel);
    } catch (err) {
      console.warn('Health check: Real-time access failed', err);
    }

    const latency = Date.now() - startTime;
    monitor.finish(true);

    // Determine overall status
    let status: 'healthy' | 'degraded' | 'down';
    if (checks.database && checks.tables && checks.views) {
      status = latency < 1000 ? 'healthy' : 'degraded';
    } else if (checks.database) {
      status = 'degraded';
    } else {
      status = 'down';
    }

    return {
      status,
      latency,
      timestamp: new Date(),
      checks,
      details: {
        latency_ms: latency,
        checks_passed: Object.values(checks).filter(Boolean).length,
        total_checks: Object.keys(checks).length,
      }
    };
  } catch (err) {
    const latency = Date.now() - startTime;
    monitor.finish(false);
    
    return {
      status: 'down',
      latency,
      timestamp: new Date(),
      error: err instanceof Error ? err.message : 'Unknown error',
      checks,
    };
  }
}

/**
 * React hook for monitoring connection health
 * Similar to implementing background health monitoring in C# services
 * Provides real-time connection status for UI components
 */
export function useConnectionHealth(intervalMs: number = 30000, enabled: boolean = true) {
  const [health, setHealth] = useState<ConnectionHealth | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    if (isChecking) return; // Prevent concurrent checks
    
    setIsChecking(true);
    try {
      const healthStatus = await checkDatabaseHealth();
      setHealth(healthStatus);
      
      // Log health status changes
      if (health && health.status !== healthStatus.status) {
        console.info(`Database health status changed: ${health.status} → ${healthStatus.status}`, {
          previous: health,
          current: healthStatus,
        });
      }
    } catch (err) {
      console.error('Health check failed:', err);
    } finally {
      setIsChecking(false);
    }
  }, [health, isChecking]);

  useEffect(() => {
    if (!enabled) return;

    let intervalId: NodeJS.Timeout;

    // Initial check
    checkHealth();

    // Set up interval
    intervalId = setInterval(checkHealth, intervalMs); // eslint-disable-line prefer-const

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalMs, enabled, checkHealth]);

  const forceCheck = useCallback(() => {
    checkHealth();
  }, [checkHealth]);

  return { 
    health, 
    isChecking, 
    forceCheck,
    isHealthy: health?.status === 'healthy',
    isDegraded: health?.status === 'degraded',
    isDown: health?.status === 'down',
  };
}

/**
 * Utility for graceful degradation based on connection health
 * Similar to implementing fallback mechanisms in C# applications
 */
export function isHealthyConnection(health: ConnectionHealth | null): boolean {
  return health?.status === 'healthy' || health?.status === 'degraded';
}

/**
 * Get appropriate user message based on health status
 * Similar to providing user-friendly status messages in C# applications
 */
export function getHealthStatusMessage(health: ConnectionHealth | null): string {
  if (!health) {
    return 'Checking connection status...';
  }

  switch (health.status) {
    case 'healthy':
      return 'All systems operational';
    case 'degraded':
      return 'Service is available but may be slower than usual';
    case 'down':
      return 'Service is currently unavailable. Please try again later.';
    default:
      return 'Unknown connection status';
  }
}

/**
 * Advanced connectivity test with detailed diagnostics
 * Similar to network diagnostics tools in enterprise applications
 */
export async function runDiagnostics(): Promise<{
  overall_status: 'pass' | 'fail';
  tests: Array<{
    name: string;
    status: 'pass' | 'fail';
    duration_ms: number;
    error?: string;
    details?: Record<string, any>;
  }>;
  summary: {
    total_tests: number;
    passed_tests: number;
    failed_tests: number;
    total_duration_ms: number;
  };
}> {
  const tests: Array<{
    name: string;
    status: 'pass' | 'fail';
    duration_ms: number;
    error?: string;
    details?: Record<string, any>;
  }> = [];

  const overallStartTime = Date.now();

  // Test 1: Basic connectivity
  const connectivityStart = Date.now();
  try {
    const connectivityResult = await testDatabaseConnectivity();
    tests.push({
      name: 'Database Connectivity',
      status: connectivityResult.success ? 'pass' : 'fail',
      duration_ms: Date.now() - connectivityStart,
      ...(!connectivityResult.success && { error: connectivityResult.error }),
      details: connectivityResult,
    });
  } catch (err) {
    tests.push({
      name: 'Database Connectivity',
      status: 'fail',
      duration_ms: Date.now() - connectivityStart,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }

  // Test 2: Schema validation
  const schemaStart = Date.now();
  try {
    // Test each table individually to validate schema
    const expectedTables = ['tool_categories', 'ai_tools', 'feature_updates', 'update_history'];
    const foundTables: string[] = [];
    
    for (const tableName of expectedTables) {
      try {
        await supabase.from(tableName as any).select('*').limit(0);
        foundTables.push(tableName);
      } catch {
        // Table doesn't exist or has access issues
      }
    }
    
    const missingTables = expectedTables.filter(t => !foundTables.includes(t));

    tests.push({
      name: 'Schema Validation',
      status: missingTables.length === 0 ? 'pass' : 'fail',
      duration_ms: Date.now() - schemaStart,
      ...(missingTables.length > 0 && { error: `Missing tables: ${missingTables.join(', ')}` }),
      details: {
        expected_tables: expectedTables,
        found_tables: foundTables,
        missing_tables: missingTables,
      },
    });
  } catch (err) {
    tests.push({
      name: 'Schema Validation',
      status: 'fail',
      duration_ms: Date.now() - schemaStart,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }

  // Test 3: Data integrity
  const dataStart = Date.now();
  try {
    const { data: categoryCount, error: catError } = await supabase
      .from('tool_categories')
      .select('id', { count: 'exact' });

    const { data: toolCount, error: toolError } = await supabase
      .from('ai_tools')
      .select('id', { count: 'exact' });

    const { data: updateCount, error: updateError } = await supabase
      .from('feature_updates')
      .select('id', { count: 'exact' });

    const hasError = catError || toolError || updateError;
    
    tests.push({
      name: 'Data Integrity',
      status: hasError ? 'fail' : 'pass',
      duration_ms: Date.now() - dataStart,
      ...(hasError && { error: 'Query errors detected' }),
      details: {
        categories_count: categoryCount?.length || 0,
        tools_count: toolCount?.length || 0,
        updates_count: updateCount?.length || 0,
        errors: {
          categories: catError?.message,
          tools: toolError?.message,
          updates: updateError?.message,
        },
      },
    });
  } catch (err) {
    tests.push({
      name: 'Data Integrity',
      status: 'fail',
      duration_ms: Date.now() - dataStart,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }

  // Test 4: Performance benchmark
  const perfStart = Date.now();
  try {
    const { data: perfData, error: perfError } = await supabase
      .from('tools_with_latest_updates')
      .select('*')
      .limit(10);

    const queryDuration = Date.now() - perfStart;
    const isSlowQuery = queryDuration > 2000; // 2 seconds threshold

    tests.push({
      name: 'Performance Benchmark',
      status: !perfError && !isSlowQuery ? 'pass' : 'fail',
      duration_ms: queryDuration,
      ...((perfError || isSlowQuery) && { 
        error: perfError ? perfError.message : 'Query exceeded performance threshold' 
      }),
      details: {
        query_duration_ms: queryDuration,
        threshold_ms: 2000,
        records_retrieved: perfData?.length || 0,
        performance_rating: queryDuration < 500 ? 'excellent' : queryDuration < 1000 ? 'good' : queryDuration < 2000 ? 'acceptable' : 'poor',
      },
    });
  } catch (err) {
    tests.push({
      name: 'Performance Benchmark',
      status: 'fail',
      duration_ms: Date.now() - perfStart,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }

  const totalDuration = Date.now() - overallStartTime;
  const passedTests = tests.filter(t => t.status === 'pass').length;
  const failedTests = tests.length - passedTests;

  return {
    overall_status: failedTests === 0 ? 'pass' : 'fail',
    tests,
    summary: {
      total_tests: tests.length,
      passed_tests: passedTests,
      failed_tests: failedTests,
      total_duration_ms: totalDuration,
    },
  };
}

/**
 * Database latency monitor
 * Similar to implementing performance monitoring in C# applications
 */
export class DatabaseLatencyMonitor {
  private measurements: number[] = [];
  private readonly maxMeasurements = 100;

  async measureLatency(): Promise<number> {
    const start = Date.now();
    
    try {
      await supabase.from('tool_categories').select('id').limit(1);
      const latency = Date.now() - start;
      
      this.addMeasurement(latency);
      return latency;
    } catch (err) {
      const latency = Date.now() - start;
      this.addMeasurement(latency);
      throw err;
    }
  }

  private addMeasurement(latency: number) {
    this.measurements.push(latency);
    if (this.measurements.length > this.maxMeasurements) {
      this.measurements.shift(); // Remove oldest measurement
    }
  }

  getStatistics() {
    if (this.measurements.length === 0) {
      return null;
    }

    const sorted = [...this.measurements].sort((a, b) => a - b);
    const sum = this.measurements.reduce((a, b) => a + b, 0);

    return {
      count: this.measurements.length,
      average: Math.round(sum / this.measurements.length * 100) / 100,
      median: sorted[Math.floor(sorted.length / 2)],
      min: Math.min(...this.measurements),
      max: Math.max(...this.measurements),
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  reset() {
    this.measurements = [];
  }
}

// Export a default latency monitor instance
export const latencyMonitor = new DatabaseLatencyMonitor();

/**
 * Connection recovery utilities
 * Similar to implementing connection resilience in C# applications
 */
export async function attemptConnectionRecovery(): Promise<{
  success: boolean;
  attempts: number;
  finalStatus: ConnectionHealth;
  timeline: Array<{ attempt: number; status: string; timestamp: Date }>;
}> {
  const maxAttempts = 5;
  const timeline: Array<{ attempt: number; status: string; timestamp: Date }> = [];
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const timestamp = new Date();
    
    try {
      const health = await checkDatabaseHealth();
      timeline.push({
        attempt,
        status: `Health check: ${health.status}`,
        timestamp,
      });

      if (health.status === 'healthy' || health.status === 'degraded') {
        return {
          success: true,
          attempts: attempt,
          finalStatus: health,
          timeline,
        };
      }

      // Wait before next attempt (exponential backoff)
      if (attempt < maxAttempts) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        timeline.push({
          attempt,
          status: `Waiting ${delay}ms before retry`,
          timestamp: new Date(),
        });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (err) {
      timeline.push({
        attempt,
        status: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp,
      });
    }
  }

  // Final attempt to get status
  const finalHealth = await checkDatabaseHealth().catch(() => ({
    status: 'down' as const,
    latency: 0,
    timestamp: new Date(),
    error: 'Recovery failed',
    checks: { database: false, tables: false, views: false, realtime: false },
  }));

  return {
    success: false,
    attempts: maxAttempts,
    finalStatus: finalHealth,
    timeline,
  };
}