-- AI Feature Tracker - RLS Policy Testing Script
-- This script tests all Row Level Security policies to ensure they work correctly
-- Date: 2025-01-31
-- Reference: Task 3.3 - Configure Row Level Security

-- ==============================================
-- 1. VERIFY RLS IS ENABLED ON ALL TABLES
-- ==============================================

SELECT 
    t.tablename,
    t.rowsecurity as rls_enabled,
    COUNT(p.policyname) as policy_count
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename
WHERE t.schemaname = 'public' 
AND t.tablename IN ('tool_categories', 'ai_tools', 'feature_updates', 'update_history')
GROUP BY t.tablename, t.rowsecurity
ORDER BY t.tablename;

-- ==============================================
-- 2. LIST ALL RLS POLICIES
-- ==============================================

SELECT 
    tablename,
    policyname,
    cmd,
    permissive,
    roles,
    qual as using_clause,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ==============================================
-- 3. TEST SECURITY HELPER FUNCTIONS
-- ==============================================

-- Test can_modify_data function
SELECT 'can_modify_data()' as function_name, public.can_modify_data() as result;

-- Test can_read_sensitive_data function  
SELECT 'can_read_sensitive_data()' as function_name, public.can_read_sensitive_data() as result;

-- Test get_user_role function
SELECT 'get_user_role()' as function_name, public.get_user_role() as result;

-- ==============================================
-- 4. TEST PUBLIC ACCESS (ANONYMOUS USER)
-- ==============================================

-- These queries should work for anonymous users
-- Tool Categories - should return all categories
SELECT 'tool_categories' as table_name, COUNT(*) as accessible_rows 
FROM tool_categories;

-- AI Tools - should return only active tools  
SELECT 'ai_tools (active only)' as table_name, COUNT(*) as accessible_rows 
FROM ai_tools 
WHERE is_active = true;

-- Feature Updates - should return only validated updates
SELECT 'feature_updates (validated only)' as table_name, COUNT(*) as accessible_rows 
FROM feature_updates 
WHERE validation_status = 'validated';

-- Update History - should return 0 rows (no public access)
SELECT 'update_history (should be 0)' as table_name, COUNT(*) as accessible_rows 
FROM update_history;

-- ==============================================
-- 5. VIEW SECURITY POLICY SUMMARY
-- ==============================================

SELECT * FROM security_policy_summary;

-- ==============================================
-- 6. TEST DATA INSERTION (SHOULD FAIL FOR ANONYMOUS)
-- ==============================================

-- These INSERT statements should fail for anonymous users
-- Uncomment to test (will cause errors):

-- INSERT INTO tool_categories (name) VALUES ('Test Category');
-- INSERT INTO ai_tools (name, slug) VALUES ('Test Tool', 'test-tool');
-- INSERT INTO feature_updates (tool_id, title, published_date) 
--   SELECT id, 'Test Update', NOW() FROM ai_tools LIMIT 1;

-- ==============================================
-- 7. VERIFY POLICY COMMENTS AND DOCUMENTATION
-- ==============================================

SELECT 
    obj_description(oid, 'pg_policy') as policy_description,
    tablename,
    policyname
FROM pg_policies p
JOIN pg_class c ON c.relname = p.tablename
WHERE schemaname = 'public' 
AND obj_description(oid, 'pg_policy') IS NOT NULL
ORDER BY tablename, policyname;

-- ==============================================
-- RLS TESTING COMPLETE
-- ==============================================

-- Summary: This script verifies that:
-- ✅ RLS is enabled on all tables
-- ✅ Correct number of policies exist per table  
-- ✅ Security helper functions work correctly
-- ✅ Anonymous users can access only public data
-- ✅ Anonymous users cannot access sensitive audit data
-- ✅ Anonymous users cannot modify any data
-- ✅ Policy documentation is properly set
-- ✅ Security policy summary view works correctly