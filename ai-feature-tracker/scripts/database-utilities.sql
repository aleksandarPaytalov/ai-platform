-- ==============================================
-- AI Feature Tracker - Database Utility Functions
-- This script contains utility functions for data management and validation
-- ==============================================

-- ==============================================
-- 1. DATA MANAGEMENT UTILITIES
-- ==============================================

-- Function to reset all data (for development/testing)
CREATE OR REPLACE FUNCTION reset_all_data()
RETURNS void AS $$
BEGIN
    -- Only allow in development environment for safety
    IF current_setting('app.environment', true) = 'production' THEN
        RAISE EXCEPTION 'Cannot reset data in production environment. This operation is only allowed in development.';
    END IF;
    
    -- Disable triggers temporarily to avoid issues
    SET session_replication_role = replica;
    
    -- Clear all data in dependency order (children first, then parents)
    DELETE FROM update_history;
    DELETE FROM feature_updates;
    DELETE FROM ai_tools;
    DELETE FROM tool_categories;
    
    -- Re-enable triggers
    SET session_replication_role = DEFAULT;
    
    RAISE NOTICE 'All data has been reset successfully. Ready for fresh data insertion.';
END;
$$ LANGUAGE plpgsql;

-- Add helpful comment
COMMENT ON FUNCTION reset_all_data() IS 'Safely resets all data in development environment only. Includes safety check to prevent production data loss.';

-- ==============================================
-- 2. DATA STATISTICS AND MONITORING
-- ==============================================

-- Function to get comprehensive data statistics
CREATE OR REPLACE FUNCTION get_data_statistics()
RETURNS TABLE(
    table_name text,
    record_count bigint,
    last_updated timestamptz
) AS $$
BEGIN
    RETURN QUERY
    SELECT 'tool_categories'::text, COUNT(*), MAX(updated_at) FROM tool_categories
    UNION ALL
    SELECT 'ai_tools'::text, COUNT(*), MAX(updated_at) FROM ai_tools
    UNION ALL
    SELECT 'feature_updates'::text, COUNT(*), MAX(updated_at) FROM feature_updates
    UNION ALL
    SELECT 'update_history'::text, COUNT(*), MAX(changed_at) FROM update_history
    ORDER BY table_name;
END;
$$ LANGUAGE plpgsql;

-- Add helpful comment
COMMENT ON FUNCTION get_data_statistics() IS 'Returns record counts and last update times for all main tables';

-- Function to get detailed data overview by category
CREATE OR REPLACE FUNCTION get_detailed_data_overview()
RETURNS TABLE(
    category_name text,
    category_color text,
    tools_count bigint,
    active_tools_count bigint,
    total_updates_count bigint,
    validated_updates_count bigint,
    latest_update_date timestamptz,
    avg_confidence_score decimal
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tc.name::text,
        tc.color_code::text,
        COUNT(DISTINCT t.id) as tools_count,
        COUNT(DISTINCT CASE WHEN t.is_active THEN t.id END) as active_tools_count,
        COUNT(DISTINCT fu.id) as total_updates_count,
        COUNT(DISTINCT CASE WHEN fu.validation_status = 'validated' THEN fu.id END) as validated_updates_count,
        MAX(fu.published_date) as latest_update_date,
        AVG(fu.confidence_score) as avg_confidence_score
    FROM tool_categories tc
    LEFT JOIN ai_tools t ON tc.id = t.category_id
    LEFT JOIN feature_updates fu ON t.id = fu.tool_id
    GROUP BY tc.id, tc.name, tc.color_code, tc.sort_order
    ORDER BY tc.sort_order;
END;
$$ LANGUAGE plpgsql;

-- Add helpful comment
COMMENT ON FUNCTION get_detailed_data_overview() IS 'Returns comprehensive statistics grouped by tool category';

-- ==============================================
-- 3. DATA VALIDATION AND CONSISTENCY CHECKS
-- ==============================================

-- Function to validate data consistency across all tables
CREATE OR REPLACE FUNCTION validate_data_consistency()
RETURNS TABLE(
    check_name text,
    status text,
    details text,
    severity text
) AS $$
BEGIN
    -- Check 1: Tools without categories
    RETURN QUERY
    SELECT 
        'Tools without categories'::text,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::text,
        'Found ' || COUNT(*) || ' tools without valid category assignments'::text,
        CASE WHEN COUNT(*) = 0 THEN 'INFO' ELSE 'ERROR' END::text
    FROM ai_tools 
    WHERE category_id IS NULL AND is_active = true;
    
    -- Check 2: Updates with invalid tool references
    RETURN QUERY
    SELECT 
        'Updates with invalid tools'::text,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::text,
        'Found ' || COUNT(*) || ' updates referencing non-existent tools'::text,
        CASE WHEN COUNT(*) = 0 THEN 'INFO' ELSE 'CRITICAL' END::text
    FROM feature_updates fu
    LEFT JOIN ai_tools t ON fu.tool_id = t.id
    WHERE t.id IS NULL;
    
    -- Check 3: History records with invalid update references
    RETURN QUERY
    SELECT 
        'History with invalid updates'::text,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::text,
        'Found ' || COUNT(*) || ' history records referencing non-existent updates'::text,
        CASE WHEN COUNT(*) = 0 THEN 'INFO' ELSE 'ERROR' END::text
    FROM update_history uh
    LEFT JOIN feature_updates fu ON uh.update_id = fu.id
    WHERE fu.id IS NULL;
    
    -- Check 4: Duplicate tool slugs
    RETURN QUERY
    SELECT 
        'Duplicate tool slugs'::text,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::text,
        'Found ' || COUNT(*) || ' duplicate slugs: ' || string_agg(slug, ', ')::text,
        CASE WHEN COUNT(*) = 0 THEN 'INFO' ELSE 'CRITICAL' END::text
    FROM (
        SELECT slug
        FROM ai_tools
        GROUP BY slug
        HAVING COUNT(*) > 1
    ) duplicates;
    
    -- Check 5: Invalid confidence scores
    RETURN QUERY
    SELECT 
        'Invalid confidence scores'::text,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::text,
        'Found ' || COUNT(*) || ' updates with confidence scores outside valid range (0.0-1.0)'::text,
        CASE WHEN COUNT(*) = 0 THEN 'INFO' ELSE 'WARNING' END::text
    FROM feature_updates
    WHERE confidence_score IS NOT NULL AND (confidence_score < 0 OR confidence_score > 1);
    
    -- Check 6: Future published dates (beyond reasonable threshold)
    RETURN QUERY
    SELECT 
        'Unrealistic future dates'::text,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::text,
        'Found ' || COUNT(*) || ' updates with published dates more than 1 day in the future'::text,
        CASE WHEN COUNT(*) = 0 THEN 'INFO' ELSE 'WARNING' END::text
    FROM feature_updates
    WHERE published_date > NOW() + INTERVAL '1 day';
    
    -- Check 7: Missing required URLs
    RETURN QUERY
    SELECT 
        'Tools missing website URLs'::text,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::text,
        'Found ' || COUNT(*) || ' active tools without website URLs'::text,
        CASE WHEN COUNT(*) = 0 THEN 'INFO' ELSE 'WARNING' END::text
    FROM ai_tools
    WHERE is_active = true AND (website_url IS NULL OR website_url = '');
    
    -- Check 8: Validated updates without AI analysis
    RETURN QUERY
    SELECT 
        'Validated updates not AI analyzed'::text,
        CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END::text,
        'Found ' || COUNT(*) || ' validated updates that were not AI analyzed'::text,
        CASE WHEN COUNT(*) = 0 THEN 'INFO' ELSE 'WARNING' END::text
    FROM feature_updates
    WHERE validation_status = 'validated' AND ai_analyzed = false;
END;
$$ LANGUAGE plpgsql;

-- Add helpful comment
COMMENT ON FUNCTION validate_data_consistency() IS 'Performs comprehensive data validation checks with severity levels';

-- ==============================================
-- 4. SEARCH AND QUERY UTILITIES
-- ==============================================

-- Function to search tools and updates by text
CREATE OR REPLACE FUNCTION search_content(search_term text)
RETURNS TABLE(
    result_type text,
    tool_name text,
    tool_slug text,
    title text,
    description text,
    relevance_score real
) AS $$
BEGIN
    RETURN QUERY
    -- Search in tools
    SELECT 
        'tool'::text as result_type,
        t.name::text as tool_name,
        t.slug::text as tool_slug,
        t.name::text as title,
        COALESCE(t.description, '')::text as description,
        ts_rank(to_tsvector('english', t.name || ' ' || COALESCE(t.description, '')), plainto_tsquery('english', search_term)) as relevance_score
    FROM ai_tools t
    WHERE to_tsvector('english', t.name || ' ' || COALESCE(t.description, '')) @@ plainto_tsquery('english', search_term)
    AND t.is_active = true
    
    UNION ALL
    
    -- Search in feature updates
    SELECT 
        'update'::text as result_type,
        t.name::text as tool_name,
        t.slug::text as tool_slug,
        fu.title::text as title,
        COALESCE(fu.description, '')::text as description,
        ts_rank(to_tsvector('english', fu.title || ' ' || COALESCE(fu.description, '') || ' ' || COALESCE(fu.content, '')), plainto_tsquery('english', search_term)) as relevance_score
    FROM feature_updates fu
    JOIN ai_tools t ON fu.tool_id = t.id
    WHERE to_tsvector('english', fu.title || ' ' || COALESCE(fu.description, '') || ' ' || COALESCE(fu.content, '')) @@ plainto_tsquery('english', search_term)
    AND fu.validation_status = 'validated'
    AND t.is_active = true
    
    ORDER BY relevance_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Add helpful comment
COMMENT ON FUNCTION search_content(text) IS 'Full-text search across tools and feature updates with relevance scoring';

-- ==============================================
-- 5. MIGRATION AND DEPLOYMENT UTILITIES
-- ==============================================

-- Create migration tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS data_migrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    migration_name VARCHAR(200) NOT NULL UNIQUE,
    executed_at TIMESTAMPTZ DEFAULT NOW(),
    executed_by VARCHAR(100) DEFAULT current_user,
    success BOOLEAN DEFAULT true,
    details TEXT,
    rollback_available BOOLEAN DEFAULT false
);

-- Add helpful comment
COMMENT ON TABLE data_migrations IS 'Tracks data migration executions for deployment management';

-- Function to record migration execution
CREATE OR REPLACE FUNCTION record_migration(
    p_migration_name VARCHAR(200),
    p_details TEXT DEFAULT NULL,
    p_success BOOLEAN DEFAULT true,
    p_rollback_available BOOLEAN DEFAULT false
)
RETURNS UUID AS $$
DECLARE
    migration_id UUID;
BEGIN
    INSERT INTO data_migrations (migration_name, details, success, rollback_available)
    VALUES (p_migration_name, p_details, p_success, p_rollback_available)
    RETURNING id INTO migration_id;
    
    RETURN migration_id;
END;
$$ LANGUAGE plpgsql;

-- Add helpful comment
COMMENT ON FUNCTION record_migration(VARCHAR, TEXT, BOOLEAN, BOOLEAN) IS 'Records migration execution with status tracking';

-- Function to check if migration has been executed
CREATE OR REPLACE FUNCTION migration_executed(p_migration_name VARCHAR(200))
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM data_migrations 
        WHERE migration_name = p_migration_name 
        AND success = true
    );
END;
$$ LANGUAGE plpgsql;

-- Add helpful comment
COMMENT ON FUNCTION migration_executed(VARCHAR) IS 'Checks if a specific migration has been successfully executed';

-- ==============================================
-- 6. DEVELOPMENT ENVIRONMENT MANAGEMENT
-- ==============================================

-- Function to refresh sample data (for development)
CREATE OR REPLACE FUNCTION refresh_sample_data()
RETURNS TEXT AS $$
BEGIN
    -- Only allow in development environment
    IF current_setting('app.environment', true) = 'production' THEN
        RAISE EXCEPTION 'Cannot refresh sample data in production environment';
    END IF;
    
    -- Reset and prepare for new data
    PERFORM reset_all_data();
    
    -- Record the refresh action
    PERFORM record_migration(
        'sample_data_refresh_' || to_char(NOW(), 'YYYY_MM_DD_HH24_MI_SS'),
        'Development sample data refresh executed',
        true,
        false
    );
    
    RETURN 'Sample data reset completed. Ready for fresh seed data insertion.';
END;
$$ LANGUAGE plpgsql;

-- Add helpful comment
COMMENT ON FUNCTION refresh_sample_data() IS 'Refreshes sample data in development environment with safety checks';

-- Set development environment variable (for safety)
-- This should be overridden in production
DO $$
BEGIN
    -- Only set if not already configured
    IF current_setting('app.environment', true) IS NULL THEN
        ALTER DATABASE postgres SET app.environment = 'development';
    END IF;
END $$;

-- ==============================================
-- 7. PERFORMANCE AND MAINTENANCE UTILITIES
-- ==============================================

-- Function to analyze table sizes and performance
CREATE OR REPLACE FUNCTION analyze_database_performance()
RETURNS TABLE(
    table_name text,
    row_count bigint,
    table_size text,
    index_size text,
    total_size text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_name::text,
        t.row_count,
        pg_size_pretty(t.table_size) as table_size,
        pg_size_pretty(t.index_size) as index_size,
        pg_size_pretty(t.total_size) as total_size
    FROM (
        SELECT 
            schemaname||'.'||tablename as table_name,
            n_tup_ins - n_tup_del as row_count,
            pg_relation_size(schemaname||'.'||tablename) as table_size,
            pg_indexes_size(schemaname||'.'||tablename) as index_size,
            pg_total_relation_size(schemaname||'.'||tablename) as total_size
        FROM pg_stat_user_tables 
        WHERE schemaname = 'public'
        AND tablename IN ('tool_categories', 'ai_tools', 'feature_updates', 'update_history')
    ) t
    ORDER BY t.total_size DESC;
END;
$$ LANGUAGE plpgsql;

-- Add helpful comment
COMMENT ON FUNCTION analyze_database_performance() IS 'Analyzes table sizes and performance metrics for main tables';

-- Function to update database statistics
CREATE OR REPLACE FUNCTION update_statistics()
RETURNS TEXT AS $$
BEGIN
    -- Update statistics for all main tables
    ANALYZE tool_categories;
    ANALYZE ai_tools;
    ANALYZE feature_updates;
    ANALYZE update_history;
    
    RETURN 'Database statistics updated for all main tables';
END;
$$ LANGUAGE plpgsql;

-- Add helpful comment
COMMENT ON FUNCTION update_statistics() IS 'Updates PostgreSQL statistics for query optimization';

-- ==============================================
-- UTILITY FUNCTIONS COMPLETE
-- ==============================================
-- Available utility functions:
-- ✅ reset_all_data() - Safely reset all data (dev only)
-- ✅ get_data_statistics() - Get table record counts and timestamps
-- ✅ get_detailed_data_overview() - Detailed statistics by category
-- ✅ validate_data_consistency() - Comprehensive data validation
-- ✅ search_content(text) - Full-text search with relevance
-- ✅ record_migration() - Track migration executions
-- ✅ migration_executed() - Check migration status
-- ✅ refresh_sample_data() - Development data refresh
-- ✅ analyze_database_performance() - Performance analysis
-- ✅ update_statistics() - Update query optimization stats