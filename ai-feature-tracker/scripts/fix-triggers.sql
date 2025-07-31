-- Fix and test the updated_at triggers
-- Check current trigger function implementation

-- First, let's see the current function definition
SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'update_updated_at_column';

-- Test the function directly
SELECT update_updated_at_column();

-- Drop and recreate the trigger function with better implementation
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate all triggers
DROP TRIGGER IF EXISTS update_tool_categories_updated_at ON tool_categories;
DROP TRIGGER IF EXISTS update_ai_tools_updated_at ON ai_tools;
DROP TRIGGER IF EXISTS update_feature_updates_updated_at ON feature_updates;

CREATE TRIGGER update_tool_categories_updated_at 
    BEFORE UPDATE ON tool_categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_tools_updated_at 
    BEFORE UPDATE ON ai_tools 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_updates_updated_at 
    BEFORE UPDATE ON feature_updates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Test the trigger
INSERT INTO tool_categories (name) VALUES ('Trigger Test Final');
SELECT created_at, updated_at FROM tool_categories WHERE name = 'Trigger Test Final';

-- Wait and update
SELECT pg_sleep(1);
UPDATE tool_categories SET description = 'Updated by trigger' WHERE name = 'Trigger Test Final';
SELECT created_at, updated_at FROM tool_categories WHERE name = 'Trigger Test Final';

-- Clean up
DELETE FROM tool_categories WHERE name = 'Trigger Test Final';