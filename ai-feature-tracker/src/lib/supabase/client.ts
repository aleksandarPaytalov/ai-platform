import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
}

/**
 * Client-side Supabase client (public access)
 * This is similar to a DbContext in Entity Framework - your main database interface for public operations
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // No user sessions for public platform
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'x-application-name': 'ai-feature-tracker',
    },
  },
});

/**
 * Server-side admin client (service role access)
 * This provides elevated privileges similar to running database operations as admin in SQL Server
 */
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey || '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        'x-application-name': 'ai-feature-tracker-admin',
      },
    },
  }
);

/**
 * Real-time client configuration for live data updates
 * Similar to SignalR connections in ASP.NET for real-time features
 */
export const supabaseRealtime = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Rate limiting for real-time events
    },
  },
  global: {
    headers: {
      'x-application-name': 'ai-feature-tracker-realtime',
    },
  },
});

/**
 * Connection health check utility
 * Similar to database connection health checks in enterprise applications
 */
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('tool_categories').select('count').limit(1);
    return { connected: !error, error };
  } catch (err) {
    return { connected: false, error: err };
  }
};

/**
 * Test database connectivity with detailed diagnostics
 * Useful for application startup health checks
 */
export const testDatabaseConnectivity = async () => {
  try {
    console.log('Testing database connectivity...');
    
    // Test basic connection
    const connectionTest = await checkSupabaseConnection();
    if (!connectionTest.connected) {
      return {
        success: false,
        error: 'Basic connection failed',
        details: connectionTest.error
      };
    }

    // Test table access
    const { data: categories, error: categoriesError } = await supabase
      .from('tool_categories')
      .select('id, name')
      .limit(1);

    if (categoriesError) {
      return {
        success: false,
        error: 'Table access failed',
        details: categoriesError
      };
    }

    // Test views access
    const { error: viewError } = await supabase
      .from('tools_with_latest_updates')
      .select('id, name')
      .limit(1);

    if (viewError) {
      return {
        success: false,
        error: 'View access failed',
        details: viewError
      };
    }

    return {
      success: true,
      message: 'Database connectivity test passed',
      categoriesCount: categories?.length || 0,
      viewAccessible: true
    };
  } catch (err) {
    return {
      success: false,
      error: 'Connectivity test exception',
      details: err
    };
  }
};