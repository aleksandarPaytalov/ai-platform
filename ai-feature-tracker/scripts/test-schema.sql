-- AI Feature Tracker Schema Verification Tests
-- This script tests all aspects of the database schema implementation

-- ==============================================
-- 1. VERIFY TABLE CREATION
-- ==============================================

-- List all tables we created
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('tool_categories', 'ai_tools', 'feature_updates', 'update_history')
ORDER BY table_name;

-- ==============================================
-- 2. VERIFY CONSTRAINTS AND RELATIONSHIPS
-- ==============================================

-- Check foreign key constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
AND tc.table_name IN ('ai_tools', 'feature_updates', 'update_history');

-- ==============================================
-- 3. VERIFY INDEXES
-- ==============================================

-- List all indexes on our tables
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('tool_categories', 'ai_tools', 'feature_updates', 'update_history')
ORDER BY tablename, indexname;

-- ==============================================
-- 4. VERIFY VIEWS
-- ==============================================

-- Check that our views were created
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'VIEW'
AND table_name IN ('tools_with_latest_updates', 'recent_feature_updates');

-- ==============================================
-- 5. VERIFY TRIGGERS
-- ==============================================

-- Check that triggers were created
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND event_object_table IN ('tool_categories', 'ai_tools', 'feature_updates');

-- ==============================================
-- 6. TEST DATA OPERATIONS
-- ==============================================

-- Test 1: Verify seed data was inserted
SELECT COUNT(*) as category_count FROM tool_categories;
SELECT name, color_code, sort_order FROM tool_categories ORDER BY sort_order;

-- Test 2: Insert a test AI tool
INSERT INTO ai_tools (name, slug, description, category_id, website_url, is_active)
SELECT 
    'Test AI Tool',
    'test-ai-tool',
    'A test AI tool for schema verification',
    id,
    'https://example.com',
    true
FROM tool_categories 
WHERE name = 'Code Generation'
LIMIT 1;

-- Verify the tool was inserted
SELECT id, name, slug, category_id, created_at, updated_at 
FROM ai_tools 
WHERE slug = 'test-ai-tool';

-- Test 3: Insert a feature update
INSERT INTO feature_updates (
    tool_id, 
    title, 
    description, 
    content,
    impact_level,
    published_date,
    validation_status
)
SELECT 
    id,
    'Test Feature Update',
    'A test feature update for schema verification',
    'This is detailed content about the test feature update.',
    'Medium',
    NOW() - INTERVAL '1 day',
    'validated'
FROM ai_tools 
WHERE slug = 'test-ai-tool'
LIMIT 1;

-- Verify the update was inserted
SELECT id, title, impact_level, published_date, validation_status
FROM feature_updates 
WHERE title = 'Test Feature Update';

-- Test 4: Test the views work correctly
SELECT * FROM tools_with_latest_updates WHERE tool_name = 'Test AI Tool';
SELECT * FROM recent_feature_updates WHERE tool_name = 'Test AI Tool';

-- Test 5: Test updated_at trigger
UPDATE ai_tools 
SET description = 'Updated description for trigger test'
WHERE slug = 'test-ai-tool';

-- Verify updated_at was changed
SELECT name, description, created_at, updated_at 
FROM ai_tools 
WHERE slug = 'test-ai-tool';

-- ==============================================
-- 7. TEST CONSTRAINT VALIDATIONS
-- ==============================================

-- Test slug validation (should fail)
-- INSERT INTO ai_tools (name, slug) VALUES ('Invalid Tool', 'Invalid Slug With Spaces');

-- Test URL validation (should fail)  
-- INSERT INTO ai_tools (name, slug, website_url) VALUES ('Invalid URL Tool', 'invalid-url-tool', 'not-a-url');

-- Test impact level validation (should fail)
-- INSERT INTO feature_updates (tool_id, title, published_date, impact_level) 
-- SELECT id, 'Invalid Impact', NOW(), 'Invalid' FROM ai_tools LIMIT 1;

-- ==============================================
-- 8. CLEANUP TEST DATA
-- ==============================================

-- Clean up test data
DELETE FROM feature_updates WHERE title = 'Test Feature Update';
DELETE FROM ai_tools WHERE slug = 'test-ai-tool';

-- Verify cleanup
SELECT COUNT(*) as remaining_test_tools FROM ai_tools WHERE slug = 'test-ai-tool';
SELECT COUNT(*) as remaining_test_updates FROM feature_updates WHERE title = 'Test Feature Update';

-- ==============================================
-- SCHEMA VERIFICATION COMPLETE
-- ==============================================
-- All tests should pass, confirming the schema is properly implemented