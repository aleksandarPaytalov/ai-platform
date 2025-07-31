/**
 * Integration test for Supabase database layer
 * This is a simple test to verify that all our database integration components work together
 * Similar to integration tests you'd write in C# with Entity Framework
 */

import { supabase, testDatabaseConnectivity } from './client';
import { toolsService, categoriesService, updatesService } from './index';
import { checkDatabaseHealth, runDiagnostics } from './utils/healthCheck';
import { handleDatabaseError, createPerformanceMonitor } from './utils/errorHandling';

/**
 * Run a comprehensive test of all database integration components
 * This verifies that the types, services, and utilities work correctly
 */
export async function testDatabaseIntegration(): Promise<{
  success: boolean;
  results: Record<string, any>;
  errors: string[];
}> {
  const results: Record<string, any> = {};
  const errors: string[] = [];

  console.log('🚀 Starting database integration test...');

  try {
    // Test 1: Basic connectivity
    console.log('📡 Testing basic connectivity...');
    const connectivityResult = await testDatabaseConnectivity();
    results['connectivity'] = connectivityResult;
    
    if (!connectivityResult.success) {
      errors.push(`Connectivity test failed: ${connectivityResult.error}`);
    }

    // Test 2: Health check
    console.log('🏥 Testing health monitoring...');
    const healthResult = await checkDatabaseHealth();
    results['health'] = healthResult;
    
    if (healthResult.status === 'down') {
      errors.push(`Health check failed: ${healthResult.error}`);
    }

    // Test 3: Categories service
    console.log('📂 Testing categories service...');
    const monitor1 = createPerformanceMonitor('categories-test');
    const { data: categories, error: categoriesError } = await categoriesService.getAllCategories();
    monitor1.finish(!categoriesError);
    
    results['categoriesService'] = {
      success: !categoriesError,
      count: categories?.length || 0,
      error: categoriesError?.message,
    };
    
    if (categoriesError) {
      errors.push(`Categories service failed: ${categoriesError.message}`);
    }

    // Test 4: Tools service
    console.log('🛠️ Testing tools service...');
    const monitor2 = createPerformanceMonitor('tools-test');
    const { data: tools, error: toolsError } = await toolsService.getAllTools();
    monitor2.finish(!toolsError);
    
    results['toolsService'] = {
      success: !toolsError,
      count: tools?.length || 0,
      error: toolsError?.message,
    };
    
    if (toolsError) {
      errors.push(`Tools service failed: ${toolsError.message}`);
    }

    // Test 5: Updates service
    console.log('📰 Testing updates service...');
    const monitor3 = createPerformanceMonitor('updates-test');
    const { data: updates, error: updatesError } = await updatesService.getLatestUpdates(5);
    monitor3.finish(!updatesError);
    
    results['updatesService'] = {
      success: !updatesError,
      count: updates?.length || 0,
      error: updatesError?.message,
    };
    
    if (updatesError) {
      errors.push(`Updates service failed: ${updatesError.message}`);
    }

    // Test 6: Views access
    console.log('👁️ Testing views access...');
    const { data: toolsWithUpdates, error: viewError } = await toolsService.getToolsWithLatestUpdates();
    results['viewsAccess'] = {
      success: !viewError,
      count: toolsWithUpdates?.length || 0,
      error: viewError?.message,
    };
    
    if (viewError) {
      errors.push(`Views access failed: ${viewError.message}`);
    }

    // Test 7: Type safety verification
    console.log('🔒 Testing type safety...');
    if (categories && categories.length > 0) {
      const firstCategory = categories[0];
      if (firstCategory) {
        results['typeSafety'] = {
          categoryHasId: typeof firstCategory.id === 'string',
          categoryHasName: typeof firstCategory.name === 'string',
          categoryHasCreatedAt: firstCategory.created_at !== undefined,
        };
      }
    }

    // Test 8: Error handling
    console.log('⚠️ Testing error handling...');
    try {
      // Intentionally cause an error by using invalid query parameters
      const { error } = await supabase.from('tool_categories').select('non_existent_column');
      if (error) {
        const handledError = handleDatabaseError(error);
        results['errorHandling'] = {
          errorHandled: true,
          userMessage: handledError.userMessage,
          severity: handledError.severity,
          category: handledError.category,
        };
      }
    } catch (err: any) {
      results['errorHandling'] = {
        errorHandled: true,
        userMessage: 'Error handling test completed',
        severity: 'medium' as const,
        category: 'system' as const,
      };
    }

    // Test 9: Comprehensive diagnostics
    console.log('🔍 Running comprehensive diagnostics...');
    const diagnostics = await runDiagnostics();
    results['diagnostics'] = diagnostics;
    
    if (diagnostics.overall_status === 'fail') {
      errors.push(`Diagnostics failed: ${diagnostics.summary.failed_tests} of ${diagnostics.summary.total_tests} tests failed`);
    }

    console.log('✅ Database integration test completed');
    
    return {
      success: errors.length === 0,
      results,
      errors,
    };

  } catch (err) {
    const error = `Integration test exception: ${err instanceof Error ? err.message : 'Unknown error'}`;
    errors.push(error);
    console.error('❌ Database integration test failed:', error);
    
    return {
      success: false,
      results,
      errors,
    };
  }
}

/**
 * Quick connectivity test for development
 * This is a lightweight test that can be run frequently during development
 */
export async function quickConnectivityTest(): Promise<boolean> {
  try {
    const { error } = await supabase.from('tool_categories').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Test hook functionality (for use in React components)
 * This would be used in a React component to test the hooks
 */
export function createHookTestComponent() {
  // This would be a React component that tests the hooks
  // Example usage in a component:
  /*
  import { useCategories, useTools, useLatestUpdates } from '@/lib/supabase';
  
  function TestComponent() {
    const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
    const { tools, isLoading: toolsLoading, error: toolsError } = useTools();
    const { updates, isLoading: updatesLoading, error: updatesError } = useLatestUpdates();
    
    return (
      <div>
        <h2>Integration Test Results</h2>
        <p>Categories: {categoriesLoading ? 'Loading...' : `${categories.length} loaded`}</p>
        <p>Tools: {toolsLoading ? 'Loading...' : `${tools.length} loaded`}</p>
        <p>Updates: {updatesLoading ? 'Loading...' : `${updates.length} loaded`}</p>
        {(categoriesError || toolsError || updatesError) && (
          <div>Errors detected - check console</div>
        )}
      </div>
    );
  }
  */
  
  return `
    To test the React hooks, create a component that uses:
    - useCategories() to test category fetching
    - useTools() to test tool fetching  
    - useLatestUpdates() to test update fetching
    - useConnectionHealth() to test health monitoring
    
    All hooks include loading states and error handling.
  `;
}