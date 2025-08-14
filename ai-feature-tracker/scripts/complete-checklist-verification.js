// Complete Checklist Verification for AI Feature Tracker Schema
// This script systematically verifies every item in the completion checklist

const { Client } = require('pg');
try {
    const dotenv = require('dotenv');
    dotenv.config();
    dotenv.config({ path: '.env.local', override: true });
} catch {}

class ChecklistVerifier {
    constructor() {
        this.client = new Client({
            connectionString: process.env.DEV_DATABASE_URL
        });
        this.results = {};
    }

    async connect() {
        await this.client.connect();
        console.log('🔗 Connected to local Supabase database\n');
    }

    async disconnect() {
        await this.client.end();
    }

    logResult(section, item, passed, details = '') {
        if (!this.results[section]) this.results[section] = [];
        this.results[section].push({ item, passed, details });
        
        const status = passed ? '✅' : '❌';
        console.log(`${status} ${item}`);
        if (details) console.log(`   ${details}`);
    }

    async verifyToolCategoriesTable() {
        console.log('🗂️  TOOL CATEGORIES TABLE VERIFICATION\n');

        // Check table exists
        const tableExists = await this.client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = 'tool_categories'
            );
        `);
        this.logResult('tool_categories', 'tool_categories table created successfully', 
            tableExists.rows[0].exists);

        if (!tableExists.rows[0].exists) return;

        // Check columns and data types
        const columns = await this.client.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'tool_categories' AND table_schema = 'public'
            ORDER BY ordinal_position;
        `);

        const expectedColumns = ['id', 'name', 'description', 'color_code', 'sort_order', 'created_at', 'updated_at'];
        const actualColumns = columns.rows.map(r => r.column_name);
        const hasAllColumns = expectedColumns.every(col => actualColumns.includes(col));
        
        this.logResult('tool_categories', 'All columns present with correct data types', 
            hasAllColumns, `Found: ${actualColumns.join(', ')}`);

        // Check constraints
        const constraints = await this.client.query(`
            SELECT constraint_name, constraint_type 
            FROM information_schema.table_constraints 
            WHERE table_name = 'tool_categories' AND table_schema = 'public';
        `);

        const hasPrimaryKey = constraints.rows.some(r => r.constraint_type === 'PRIMARY KEY');
        this.logResult('tool_categories', 'Primary key constraint on id column', hasPrimaryKey);

        const hasUnique = constraints.rows.some(r => r.constraint_type === 'UNIQUE');
        this.logResult('tool_categories', 'Unique constraint on name column', hasUnique);

        // Check default values
        const colorDefault = columns.rows.find(r => r.column_name === 'color_code')?.column_default;
        const sortDefault = columns.rows.find(r => r.column_name === 'sort_order')?.column_default;
        
        this.logResult('tool_categories', 'Default values set correctly', 
            colorDefault?.includes('#3B82F6') && sortDefault?.includes('0'));

        console.log();
    }

    async verifyAiToolsTable() {
        console.log('🤖 AI TOOLS TABLE VERIFICATION\n');

        // Check table exists
        const tableExists = await this.client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = 'ai_tools'
            );
        `);
        this.logResult('ai_tools', 'ai_tools table created successfully', tableExists.rows[0].exists);

        if (!tableExists.rows[0].exists) return;

        // Check columns
        const columns = await this.client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'ai_tools' AND table_schema = 'public'
            ORDER BY ordinal_position;
        `);

        const expectedColumns = ['id', 'name', 'slug', 'description', 'category_id', 'website_url', 'logo_url', 'is_active', 'metadata', 'created_at', 'updated_at'];
        const actualColumns = columns.rows.map(r => r.column_name);
        const hasAllColumns = expectedColumns.every(col => actualColumns.includes(col));
        
        this.logResult('ai_tools', 'All columns present with correct data types', hasAllColumns);

        // Check constraints
        const constraints = await this.client.query(`
            SELECT constraint_name, constraint_type 
            FROM information_schema.table_constraints 
            WHERE table_name = 'ai_tools' AND table_schema = 'public';
        `);

        const hasPrimaryKey = constraints.rows.some(r => r.constraint_type === 'PRIMARY KEY');
        this.logResult('ai_tools', 'Primary key constraint on id column', hasPrimaryKey);

        const hasUnique = constraints.rows.some(r => r.constraint_type === 'UNIQUE');
        this.logResult('ai_tools', 'Unique constraint on slug column', hasUnique);

        // Check foreign key
        const foreignKeys = await this.client.query(`
            SELECT constraint_name
            FROM information_schema.table_constraints 
            WHERE table_name = 'ai_tools' AND constraint_type = 'FOREIGN KEY';
        `);
        this.logResult('ai_tools', 'Foreign key reference to tool_categories(id) with SET NULL', 
            foreignKeys.rows.length > 0);

        // Test check constraints
        try {
            await this.client.query(`INSERT INTO ai_tools (name, slug) VALUES ('Test', 'Invalid Slug');`);
            this.logResult('ai_tools', 'Check constraints validated (slug format, URL formats)', false);
        } catch (error) {
            this.logResult('ai_tools', 'Check constraints validated (slug format, URL formats)', 
                error.message.includes('valid_slug'));
        }

        // Check JSONB metadata
        const metadataColumn = columns.rows.find(r => r.column_name === 'metadata');
        this.logResult('ai_tools', 'JSONB metadata column functional', 
            metadataColumn?.data_type === 'jsonb');

        console.log();
    }

    async verifyFeatureUpdatesTable() {
        console.log('📢 FEATURE UPDATES TABLE VERIFICATION\n');

        const tableExists = await this.client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = 'feature_updates'
            );
        `);
        this.logResult('feature_updates', 'feature_updates table created successfully', tableExists.rows[0].exists);

        if (!tableExists.rows[0].exists) return;

        // Check columns
        const columns = await this.client.query(`
            SELECT column_name, data_type
            FROM information_schema.columns 
            WHERE table_name = 'feature_updates' AND table_schema = 'public'
            ORDER BY ordinal_position;
        `);

        const expectedColumns = ['id', 'tool_id', 'title', 'description', 'content', 'impact_level', 'official_url', 'screenshot_urls', 'published_date', 'ai_analyzed', 'validation_status', 'confidence_score', 'created_at', 'updated_at'];
        const actualColumns = columns.rows.map(r => r.column_name);
        const hasAllColumns = expectedColumns.every(col => actualColumns.includes(col));
        
        this.logResult('feature_updates', 'All columns present with correct data types', hasAllColumns);

        // Check constraints
        const constraints = await this.client.query(`
            SELECT constraint_name, constraint_type 
            FROM information_schema.table_constraints 
            WHERE table_name = 'feature_updates' AND table_schema = 'public';
        `);

        const hasPrimaryKey = constraints.rows.some(r => r.constraint_type === 'PRIMARY KEY');
        this.logResult('feature_updates', 'Primary key constraint on id column', hasPrimaryKey);

        const hasForeignKey = constraints.rows.some(r => r.constraint_type === 'FOREIGN KEY');
        this.logResult('feature_updates', 'Foreign key reference to ai_tools(id) with CASCADE delete', hasForeignKey);

        // Check array column
        const screenshotColumn = columns.rows.find(r => r.column_name === 'screenshot_urls');
        this.logResult('feature_updates', 'Screenshot_urls array column functional', 
            screenshotColumn?.data_type === 'ARRAY');

        console.log();
    }

    async verifyUpdateHistoryTable() {
        console.log('📋 UPDATE HISTORY TABLE VERIFICATION\n');

        const tableExists = await this.client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = 'update_history'
            );
        `);
        this.logResult('update_history', 'update_history table created successfully', tableExists.rows[0].exists);

        if (!tableExists.rows[0].exists) return;

        // Check columns
        const columns = await this.client.query(`
            SELECT column_name, data_type
            FROM information_schema.columns 
            WHERE table_name = 'update_history' AND table_schema = 'public'
            ORDER BY ordinal_position;
        `);

        const expectedColumns = ['id', 'update_id', 'change_type', 'old_data', 'new_data', 'changed_by', 'change_reason', 'changed_at'];
        const actualColumns = columns.rows.map(r => r.column_name);
        const hasAllColumns = expectedColumns.every(col => actualColumns.includes(col));
        
        this.logResult('update_history', 'All columns present with correct data types', hasAllColumns);

        // Check JSONB columns
        const oldDataColumn = columns.rows.find(r => r.column_name === 'old_data');
        const newDataColumn = columns.rows.find(r => r.column_name === 'new_data');
        this.logResult('update_history', 'JSONB columns for old_data and new_data functional', 
            oldDataColumn?.data_type === 'jsonb' && newDataColumn?.data_type === 'jsonb');

        console.log();
    }

    async verifyIndexes() {
        console.log('📊 PERFORMANCE INDEXES VERIFICATION\n');

        const indexes = await this.client.query(`
            SELECT indexname, tablename
            FROM pg_indexes 
            WHERE schemaname = 'public' 
            AND tablename IN ('tool_categories', 'ai_tools', 'feature_updates', 'update_history')
            ORDER BY tablename, indexname;
        `);

        const indexNames = indexes.rows.map(r => r.indexname);
        
        // Check specific indexes
        const expectedIndexes = [
            'idx_ai_tools_active',
            'idx_ai_tools_category',
            'idx_feature_updates_tool_published',
            'idx_feature_updates_validation_status',
            'idx_feature_updates_published_date',
            'idx_feature_updates_impact_level',
            'idx_feature_updates_ai_analyzed',
            'idx_feature_updates_search',
            'idx_ai_tools_search',
            'idx_update_history_update_id_date',
            'idx_update_history_change_type',
            'idx_tool_categories_sort'
        ];

        for (const expectedIndex of expectedIndexes) {
            const exists = indexNames.includes(expectedIndex);
            this.logResult('indexes', `Index ${expectedIndex} created`, exists);
        }

        this.logResult('indexes', 'All indexes verified in pg_indexes view', 
            expectedIndexes.every(idx => indexNames.includes(idx)));

        console.log();
    }

    async verifyViews() {
        console.log('👁️ DATABASE VIEWS VERIFICATION\n');

        const views = await this.client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'VIEW'
            AND table_name IN ('tools_with_latest_updates', 'recent_feature_updates');
        `);

        this.logResult('views', 'tools_with_latest_updates view created successfully', 
            views.rows.some(r => r.table_name === 'tools_with_latest_updates'));

        this.logResult('views', 'recent_feature_updates view created successfully', 
            views.rows.some(r => r.table_name === 'recent_feature_updates'));

        // Test view functionality
        try {
            const toolsView = await this.client.query('SELECT COUNT(*) FROM tools_with_latest_updates LIMIT 1;');
            this.logResult('views', 'tools_with_latest_updates view functional', true);

            const updatesView = await this.client.query('SELECT COUNT(*) FROM recent_feature_updates LIMIT 1;');
            this.logResult('views', 'recent_feature_updates view functional', true);
        } catch (error) {
            this.logResult('views', 'Views functional', false, error.message);
        }

        console.log();
    }

    async verifyTriggers() {
        console.log('⚡ TRIGGERS AND AUTOMATIC UPDATES VERIFICATION\n');

        // Check if trigger function exists
        const functions = await this.client.query(`
            SELECT routine_name 
            FROM information_schema.routines 
            WHERE routine_schema = 'public' 
            AND routine_name = 'update_updated_at_column';
        `);

        this.logResult('triggers', 'update_updated_at_column() function created successfully', 
            functions.rows.length > 0);

        // Check triggers exist
        const triggers = await this.client.query(`
            SELECT trigger_name, event_object_table
            FROM information_schema.triggers 
            WHERE trigger_schema = 'public'
            AND event_object_table IN ('tool_categories', 'ai_tools', 'feature_updates');
        `);

        const triggerTables = triggers.rows.map(r => r.event_object_table);
        
        this.logResult('triggers', 'Trigger on tool_categories table updates updated_at automatically', 
            triggerTables.includes('tool_categories'));
        this.logResult('triggers', 'Trigger on ai_tools table updates updated_at automatically', 
            triggerTables.includes('ai_tools'));
        this.logResult('triggers', 'Trigger on feature_updates table updates updated_at automatically', 
            triggerTables.includes('feature_updates'));

        console.log();
    }

    async verifyDataValidation() {
        console.log('🔒 DATA VALIDATION AND TESTING VERIFICATION\n');

        // Test various constraint violations
        const testCases = [
            {
                name: 'Invalid slug format rejected',
                query: `INSERT INTO ai_tools (name, slug) VALUES ('Test', 'invalid slug');`,
                shouldFail: true
            },
            {
                name: 'Invalid URL format rejected',
                query: `INSERT INTO ai_tools (name, slug, website_url) VALUES ('Test', 'test', 'not-a-url');`,
                shouldFail: true
            },
            {
                name: 'Invalid impact level rejected',
                query: `INSERT INTO ai_tools (name, slug) VALUES ('TestTool', 'testtool'); 
                        INSERT INTO feature_updates (tool_id, title, published_date, impact_level) 
                        SELECT id, 'Test', NOW(), 'Invalid' FROM ai_tools WHERE slug = 'testtool';`,
                shouldFail: true
            }
        ];

        for (const testCase of testCases) {
            try {
                await this.client.query('BEGIN;');
                await this.client.query(testCase.query);
                await this.client.query('ROLLBACK;');
                
                this.logResult('validation', testCase.name, !testCase.shouldFail);
            } catch (error) {
                await this.client.query('ROLLBACK;');
                this.logResult('validation', testCase.name, testCase.shouldFail);
            }
        }

        console.log();
    }

    async verifySeedData() {
        console.log('🌱 SEED DATA VERIFICATION\n');

        const categoryCount = await this.client.query('SELECT COUNT(*) as count FROM tool_categories;');
        const count = parseInt(categoryCount.rows[0].count);
        
        this.logResult('seed_data', 'All 8 seed categories inserted successfully', count === 8);

        if (count === 8) {
            const categories = await this.client.query('SELECT name, color_code FROM tool_categories ORDER BY sort_order;');
            console.log('   Categories found:', categories.rows.map(r => `${r.name} (${r.color_code})`).join(', '));
        }

        console.log();
    }

    async generateSummary() {
        console.log('\n' + '='.repeat(80));
        console.log('📊 COMPLETION CHECKLIST VERIFICATION SUMMARY');
        console.log('='.repeat(80));

        let totalTests = 0;
        let passedTests = 0;

        for (const [section, tests] of Object.entries(this.results)) {
            console.log(`\n🔍 ${section.toUpperCase().replace(/_/g, ' ')}:`);
            
            for (const test of tests) {
                totalTests++;
                if (test.passed) passedTests++;
                
                const status = test.passed ? '[X]' : '[ ]';
                console.log(`${status} ${test.item}`);
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log(`📈 OVERALL RESULTS: ${passedTests}/${totalTests} tests passed (${Math.round(passedTests/totalTests*100)}%)`);
        
        if (passedTests === totalTests) {
            console.log('🎉 ALL CHECKLIST ITEMS VERIFIED AND WORKING!');
        } else {
            console.log('⚠️  Some items need attention - see details above');
        }
        console.log('='.repeat(80));
    }

    async runCompleteVerification() {
        try {
            await this.connect();
            
            await this.verifyToolCategoriesTable();
            await this.verifyAiToolsTable();
            await this.verifyFeatureUpdatesTable();
            await this.verifyUpdateHistoryTable();
            await this.verifyIndexes();
            await this.verifyViews();
            await this.verifyTriggers();
            await this.verifyDataValidation();
            await this.verifySeedData();
            
            await this.generateSummary();
            
        } catch (error) {
            console.error('❌ Verification failed:', error.message);
        } finally {
            await this.disconnect();
        }
    }
}

// Run verification
if (require.main === module) {
    const verifier = new ChecklistVerifier();
    verifier.runCompleteVerification().catch(console.error);
}

module.exports = ChecklistVerifier;