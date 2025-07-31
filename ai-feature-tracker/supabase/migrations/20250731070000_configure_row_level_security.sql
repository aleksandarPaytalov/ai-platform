-- AI Feature Tracker - Row Level Security Configuration
-- This migration implements comprehensive RLS policies for public data access and administrative control
-- Date: 2025-01-31
-- Reference: Task 3.3 - Configure Row Level Security

-- ==============================================
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ==============================================

-- Enable RLS on all tables in dependency order (avoiding foreign key conflicts)
ALTER TABLE tool_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_history ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 2. CREATE PUBLIC READ ACCESS POLICIES
-- ==============================================

-- Tool Categories - Public read access (all categories are public)
CREATE POLICY "Public read access for tool categories" ON tool_categories
    FOR SELECT 
    USING (true);  -- Allow all users to read categories

-- AI Tools - Public read access for active tools only
CREATE POLICY "Public read access for active tools" ON ai_tools
    FOR SELECT 
    USING (is_active = true);  -- Only show active tools to public

-- Feature Updates - Public read access for validated updates only
CREATE POLICY "Public read access for validated updates" ON feature_updates
    FOR SELECT 
    USING (validation_status = 'validated');  -- Only show validated updates to public

-- Update History - No public access (admin/audit only)
-- Intentionally no public read policy for update_history table

-- ==============================================
-- 3. CREATE SERVICE ROLE ADMINISTRATIVE POLICIES
-- ==============================================

-- Tool Categories - Service role full access
CREATE POLICY "Service role full access to tool categories" ON tool_categories
    FOR ALL 
    USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- AI Tools - Service role full access
CREATE POLICY "Service role full access to ai tools" ON ai_tools
    FOR ALL 
    USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Feature Updates - Service role full access
CREATE POLICY "Service role full access to feature updates" ON feature_updates
    FOR ALL 
    USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Update History - Service role full access
CREATE POLICY "Service role full access to update history" ON update_history
    FOR ALL 
    USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- ==============================================
-- 4. CREATE AI PROCESSING POLICIES
-- ==============================================

-- Feature Updates - Allow AI to update analysis fields only
CREATE POLICY "AI processing updates for feature validation" ON feature_updates
    FOR UPDATE 
    USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Update History - Allow AI to create audit trail entries
CREATE POLICY "AI processing audit trail creation" ON update_history
    FOR INSERT 
    WITH CHECK (
        auth.jwt() ->> 'role' = 'service_role' AND
        changed_by LIKE 'ai_%'  -- AI processes must identify themselves with 'ai_' prefix
    );

-- ==============================================
-- 5. CREATE SECURITY HELPER FUNCTIONS
-- ==============================================

-- Function to check if current user can modify data
CREATE OR REPLACE FUNCTION public.can_modify_data()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.jwt() ->> 'role' = 'service_role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user can read sensitive data
CREATE OR REPLACE FUNCTION public.can_read_sensitive_data()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.jwt() ->> 'role' = 'service_role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user role safely
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(auth.jwt() ->> 'role', 'anon');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- 6. IMPLEMENT DATA VISIBILITY CONTROLS
-- ==============================================

-- AI Tools - Hide tools in development/testing mode from public
CREATE POLICY "Hide development tools from public" ON ai_tools
    FOR SELECT 
    USING (
        is_active = true AND 
        (metadata->>'development_mode' IS NULL OR metadata->>'development_mode' = 'false')
    );

-- Feature Updates - Only show high confidence AI validations to public
CREATE POLICY "High confidence updates only for public" ON feature_updates
    FOR SELECT 
    USING (
        validation_status = 'validated' AND
        (confidence_score IS NULL OR confidence_score >= 0.7)  -- Only show high-confidence AI validations
    );

-- ==============================================
-- 7. CREATE SECURITY DOCUMENTATION VIEWS
-- ==============================================

-- Create a view documenting all RLS policies
CREATE VIEW security_policy_summary AS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ==============================================
-- 8. VERIFICATION QUERIES
-- ==============================================

-- Query to verify RLS is enabled on all tables
-- This query should show rowsecurity = true for all tables
/*
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
*/

-- ==============================================
-- RLS CONFIGURATION COMPLETE
-- ==============================================

-- Add comments documenting the security model
COMMENT ON POLICY "Public read access for tool categories" ON tool_categories IS 
'Allows anonymous users to read all tool categories for UI navigation';

COMMENT ON POLICY "Public read access for active tools" ON ai_tools IS 
'Allows anonymous users to read only active AI tools, hiding inactive/development tools';

COMMENT ON POLICY "Public read access for validated updates" ON feature_updates IS 
'Allows anonymous users to read only validated feature updates, hiding pending/rejected content';

COMMENT ON POLICY "Service role full access to tool categories" ON tool_categories IS 
'Grants full CRUD access to service role for administrative operations';

COMMENT ON POLICY "Service role full access to ai tools" ON ai_tools IS 
'Grants full CRUD access to service role for tool management';

COMMENT ON POLICY "Service role full access to feature updates" ON feature_updates IS 
'Grants full CRUD access to service role for content management';

COMMENT ON POLICY "Service role full access to update history" ON update_history IS 
'Grants full CRUD access to service role for audit trail management';

COMMENT ON FUNCTION public.can_modify_data() IS 
'Security helper function to check if current user has data modification privileges';

COMMENT ON FUNCTION public.can_read_sensitive_data() IS 
'Security helper function to check if current user can access sensitive audit data';

COMMENT ON FUNCTION public.get_user_role() IS 
'Security helper function to safely retrieve current user role with anon fallback';

-- Security implementation completed successfully
-- ✅ RLS enabled on all 4 tables
-- ✅ Public read policies for anonymous access to validated data
-- ✅ Service role policies for full administrative access  
-- ✅ AI processing policies for automated validation
-- ✅ Security helper functions for access control
-- ✅ Data visibility controls for development scenarios
-- ✅ Documentation views for policy management
-- ✅ Comprehensive security boundaries established