-- AI Feature Tracker Database Schema
-- This migration creates the complete database schema for tracking AI tool features and updates

-- ==============================================
-- 1. CREATE TOOL CATEGORIES TABLE
-- ==============================================
-- This table stores categories for organizing AI tools (e.g., "Code Generation", "Image AI", etc.)

CREATE TABLE tool_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color_code VARCHAR(7) DEFAULT '#3B82F6', -- Hex color for UI display
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment documentation for the table
COMMENT ON TABLE tool_categories IS 'Categories for organizing AI tools in the dashboard';
COMMENT ON COLUMN tool_categories.id IS 'Unique identifier for the category';
COMMENT ON COLUMN tool_categories.name IS 'Display name of the category (unique)';
COMMENT ON COLUMN tool_categories.description IS 'Optional description of what tools belong in this category';
COMMENT ON COLUMN tool_categories.color_code IS 'Hex color code for UI theming (#RRGGBB format)';
COMMENT ON COLUMN tool_categories.sort_order IS 'Numeric order for category display (lower = first)';
COMMENT ON COLUMN tool_categories.created_at IS 'Timestamp when category was created';
COMMENT ON COLUMN tool_categories.updated_at IS 'Timestamp when category was last modified';

-- ==============================================
-- 2. CREATE AI TOOLS TABLE
-- ==============================================
-- This table stores information about each AI tool being tracked

CREATE TABLE ai_tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE, -- URL-friendly identifier
    description TEXT,
    category_id UUID REFERENCES tool_categories(id) ON DELETE SET NULL,
    website_url VARCHAR(500),
    logo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}', -- Store flexible additional data
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Validation constraints
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$'), -- Only lowercase, numbers, hyphens
    CONSTRAINT valid_website_url CHECK (website_url IS NULL OR website_url ~ '^https?://'),
    CONSTRAINT valid_logo_url CHECK (logo_url IS NULL OR logo_url ~ '^https?://')
);

-- Add comment documentation for the table
COMMENT ON TABLE ai_tools IS 'AI development tools being tracked for feature updates';
COMMENT ON COLUMN ai_tools.id IS 'Unique identifier for the AI tool';
COMMENT ON COLUMN ai_tools.name IS 'Display name of the AI tool';
COMMENT ON COLUMN ai_tools.slug IS 'URL-friendly identifier (lowercase, hyphens only)';
COMMENT ON COLUMN ai_tools.description IS 'Brief description of what the tool does';
COMMENT ON COLUMN ai_tools.category_id IS 'Reference to tool_categories table (NULL if uncategorized)';
COMMENT ON COLUMN ai_tools.website_url IS 'Official website URL for the tool';
COMMENT ON COLUMN ai_tools.logo_url IS 'URL to the tool logo image';
COMMENT ON COLUMN ai_tools.is_active IS 'Whether this tool is actively being tracked';
COMMENT ON COLUMN ai_tools.metadata IS 'Flexible JSON storage for additional tool properties';
COMMENT ON COLUMN ai_tools.created_at IS 'Timestamp when tool was added to tracker';
COMMENT ON COLUMN ai_tools.updated_at IS 'Timestamp when tool information was last updated';

-- ==============================================
-- 3. CREATE FEATURE UPDATES TABLE
-- ==============================================
-- This table stores feature announcements and updates for each AI tool

CREATE TABLE feature_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id UUID NOT NULL REFERENCES ai_tools(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    content TEXT, -- Full feature description/announcement
    impact_level VARCHAR(20) DEFAULT 'Medium' CHECK (impact_level IN ('High', 'Medium', 'Low')),
    official_url VARCHAR(500), -- Link to official announcement
    screenshot_urls TEXT[] DEFAULT '{}', -- Array of screenshot URLs
    published_date TIMESTAMPTZ NOT NULL,
    ai_analyzed BOOLEAN DEFAULT false,
    validation_status VARCHAR(20) DEFAULT 'pending' CHECK (validation_status IN ('validated', 'pending', 'requires_review', 'rejected')),
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1), -- AI confidence 0-1
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Validation constraints
    CONSTRAINT valid_official_url CHECK (official_url IS NULL OR official_url ~ '^https?://'),
    CONSTRAINT future_published_date CHECK (published_date <= NOW() + INTERVAL '1 day') -- Allow slight future dates for timezone issues
);

-- Add comment documentation for the table
COMMENT ON TABLE feature_updates IS 'Feature announcements and updates for AI tools';
COMMENT ON COLUMN feature_updates.id IS 'Unique identifier for the feature update';
COMMENT ON COLUMN feature_updates.tool_id IS 'Reference to the AI tool this update belongs to';
COMMENT ON COLUMN feature_updates.title IS 'Title/headline of the feature update';
COMMENT ON COLUMN feature_updates.description IS 'Brief summary of the feature update';
COMMENT ON COLUMN feature_updates.content IS 'Full content/details of the feature announcement';
COMMENT ON COLUMN feature_updates.impact_level IS 'Assessed impact level: High, Medium, or Low';
COMMENT ON COLUMN feature_updates.official_url IS 'URL to the official announcement or documentation';
COMMENT ON COLUMN feature_updates.screenshot_urls IS 'Array of URLs to screenshots showing the feature';
COMMENT ON COLUMN feature_updates.published_date IS 'When the feature was officially announced/released';
COMMENT ON COLUMN feature_updates.ai_analyzed IS 'Whether this update has been processed by AI analysis';
COMMENT ON COLUMN feature_updates.validation_status IS 'Manual validation status of the update';
COMMENT ON COLUMN feature_updates.confidence_score IS 'AI confidence score (0.0 to 1.0) for update accuracy';
COMMENT ON COLUMN feature_updates.created_at IS 'Timestamp when update was added to system';
COMMENT ON COLUMN feature_updates.updated_at IS 'Timestamp when update was last modified';

-- ==============================================
-- 4. CREATE UPDATE HISTORY TABLE
-- ==============================================
-- This table provides audit trail for all changes to feature updates

CREATE TABLE update_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    update_id UUID NOT NULL REFERENCES feature_updates(id) ON DELETE CASCADE,
    change_type VARCHAR(50) NOT NULL CHECK (change_type IN ('created', 'updated', 'deleted', 'ai_analyzed', 'validated', 'rejected')),
    old_data JSONB, -- Previous state of the record
    new_data JSONB, -- New state of the record
    changed_by VARCHAR(100), -- System user or AI process identifier
    change_reason TEXT, -- Optional reason for change
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Complex validation constraint for data consistency
    CONSTRAINT valid_change_data CHECK (
        (change_type = 'created' AND old_data IS NULL AND new_data IS NOT NULL) OR
        (change_type = 'deleted' AND old_data IS NOT NULL AND new_data IS NULL) OR
        (change_type IN ('updated', 'ai_analyzed', 'validated', 'rejected') AND old_data IS NOT NULL AND new_data IS NOT NULL)
    )
);

-- Add comment documentation for the table
COMMENT ON TABLE update_history IS 'Audit trail for all changes to feature updates';
COMMENT ON COLUMN update_history.id IS 'Unique identifier for the history entry';
COMMENT ON COLUMN update_history.update_id IS 'Reference to the feature update that was changed';
COMMENT ON COLUMN update_history.change_type IS 'Type of change: created, updated, deleted, ai_analyzed, validated, rejected';
COMMENT ON COLUMN update_history.old_data IS 'JSON snapshot of the record before the change (NULL for creates)';
COMMENT ON COLUMN update_history.new_data IS 'JSON snapshot of the record after the change (NULL for deletes)';
COMMENT ON COLUMN update_history.changed_by IS 'Identifier of who/what made the change (user ID, system, AI, etc.)';
COMMENT ON COLUMN update_history.change_reason IS 'Optional explanation for why the change was made';
COMMENT ON COLUMN update_history.changed_at IS 'Timestamp when the change occurred';

-- ==============================================
-- 5. CREATE TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ==============================================
-- This function updates the updated_at column automatically when records are modified

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables that have updated_at columns
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

-- ==============================================
-- 6. CREATE BUSINESS RULE CONSTRAINTS
-- ==============================================
-- Ensure only one validated update per tool (business rule enforcement)

CREATE UNIQUE INDEX idx_one_latest_update_per_tool 
    ON feature_updates(tool_id) 
    WHERE validation_status = 'validated' AND ai_analyzed = true;

-- ==============================================
-- 7. CREATE PERFORMANCE OPTIMIZATION INDEXES
-- ==============================================
-- Indexes for common query patterns and performance optimization

-- Tool queries
CREATE INDEX idx_ai_tools_active 
    ON ai_tools(is_active) 
    WHERE is_active = true;

CREATE INDEX idx_ai_tools_category 
    ON ai_tools(category_id) 
    WHERE category_id IS NOT NULL;

CREATE INDEX idx_ai_tools_slug 
    ON ai_tools(slug); -- Already unique, but explicit for performance

-- Feature update queries
CREATE INDEX idx_feature_updates_tool_published 
    ON feature_updates(tool_id, published_date DESC);

CREATE INDEX idx_feature_updates_validation_status 
    ON feature_updates(validation_status);

CREATE INDEX idx_feature_updates_published_date 
    ON feature_updates(published_date DESC);

CREATE INDEX idx_feature_updates_impact_level 
    ON feature_updates(impact_level);

CREATE INDEX idx_feature_updates_ai_analyzed 
    ON feature_updates(ai_analyzed) 
    WHERE ai_analyzed = false;

-- Full-text search optimization
CREATE INDEX idx_feature_updates_search 
    ON feature_updates 
    USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(content, '')));

CREATE INDEX idx_ai_tools_search 
    ON ai_tools 
    USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- History queries
CREATE INDEX idx_update_history_update_id_date 
    ON update_history(update_id, changed_at DESC);

CREATE INDEX idx_update_history_change_type 
    ON update_history(change_type);

-- Category sorting
CREATE INDEX idx_tool_categories_sort 
    ON tool_categories(sort_order, name);

-- ==============================================
-- 8. CREATE DATABASE VIEWS FOR COMMON QUERIES
-- ==============================================
-- Views to simplify common application queries

-- View for tools with their latest validated updates
CREATE VIEW tools_with_latest_updates AS
SELECT 
    t.*,
    tc.name as category_name,
    tc.color_code as category_color,
    fu.id as latest_update_id,
    fu.title as latest_update_title,
    fu.published_date as latest_update_date,
    fu.impact_level as latest_update_impact
FROM ai_tools t
LEFT JOIN tool_categories tc ON t.category_id = tc.id
LEFT JOIN LATERAL (
    SELECT id, title, published_date, impact_level
    FROM feature_updates 
    WHERE tool_id = t.id 
    AND validation_status = 'validated'
    ORDER BY published_date DESC 
    LIMIT 1
) fu ON true
WHERE t.is_active = true;

-- View for recent feature updates across all tools
CREATE VIEW recent_feature_updates AS
SELECT 
    fu.*,
    t.name as tool_name,
    t.slug as tool_slug,
    t.logo_url as tool_logo,
    tc.name as category_name,
    tc.color_code as category_color
FROM feature_updates fu
JOIN ai_tools t ON fu.tool_id = t.id
LEFT JOIN tool_categories tc ON t.category_id = tc.id
WHERE fu.validation_status = 'validated'
AND t.is_active = true
ORDER BY fu.published_date DESC;

-- Comment on views
COMMENT ON VIEW tools_with_latest_updates IS 'Tools with their most recent validated feature update';
COMMENT ON VIEW recent_feature_updates IS 'Recent validated feature updates across all active tools';

-- ==============================================
-- 9. INSERT INITIAL SEED DATA
-- ==============================================
-- Insert some initial categories for the application

INSERT INTO tool_categories (name, description, color_code, sort_order) VALUES
    ('Code Generation', 'AI tools that generate, complete, or assist with writing code', '#10B981', 1),
    ('Image & Video AI', 'AI tools for creating, editing, and processing visual content', '#8B5CF6', 2),
    ('Text & Writing', 'AI tools for content creation, editing, and text processing', '#F59E0B', 3),
    ('Data & Analytics', 'AI tools for data analysis, processing, and insights generation', '#3B82F6', 4),
    ('Audio & Voice', 'AI tools for speech, music, and audio processing', '#EF4444', 5),
    ('Research & Knowledge', 'AI tools for research, information retrieval, and knowledge management', '#06B6D4', 6),
    ('Productivity', 'AI tools that enhance workflow and productivity', '#84CC16', 7),
    ('Development Tools', 'AI-powered development environments and debugging tools', '#F97316', 8);

-- ==============================================
-- SCHEMA IMPLEMENTATION COMPLETE
-- ==============================================
-- The AI Feature Tracker database schema is now fully implemented with:
-- ✅ 4 core tables: tool_categories, ai_tools, feature_updates, update_history
-- ✅ Complete foreign key relationships and constraints
-- ✅ Automatic timestamp management via triggers
-- ✅ Performance-optimized indexes for query patterns
-- ✅ Full-text search capabilities
-- ✅ Database views for common queries
-- ✅ Initial seed data for categories
-- ✅ Comprehensive data validation and business rules
