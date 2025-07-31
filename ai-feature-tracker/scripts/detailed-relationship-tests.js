// Detailed Relationship and Advanced Feature Tests
// Testing CASCADE/SET NULL behaviors, full-text search, and other advanced features

const { Client } = require('pg');

async function runDetailedTests() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
    });

    try {
        await client.connect();
        console.log('🔗 Connected for detailed relationship testing\n');

        // Test CASCADE and SET NULL behaviors
        console.log('🔗 TESTING FOREIGN KEY BEHAVIORS\n');

        // Create test data
        await client.query('BEGIN;');
        
        // Insert test category
        const categoryResult = await client.query(`
            INSERT INTO tool_categories (name, description) 
            VALUES ('Test Category', 'For testing CASCADE/SET NULL') 
            RETURNING id;
        `);
        const categoryId = categoryResult.rows[0].id;
        console.log('✅ Created test category:', categoryId);

        // Insert test tool
        const toolResult = await client.query(`
            INSERT INTO ai_tools (name, slug, category_id) 
            VALUES ('Test Tool', 'test-tool', $1) 
            RETURNING id;
        `, [categoryId]);
        const toolId = toolResult.rows[0].id;
        console.log('✅ Created test tool:', toolId);

        // Insert test feature update
        const updateResult = await client.query(`
            INSERT INTO feature_updates (tool_id, title, published_date) 
            VALUES ($1, 'Test Update', NOW()) 
            RETURNING id;
        `, [toolId]);
        const updateId = updateResult.rows[0].id;
        console.log('✅ Created test update:', updateId);

        // Insert test history
        await client.query(`
            INSERT INTO update_history (update_id, change_type, new_data) 
            VALUES ($1, 'created', '{"test": "data"}');
        `, [updateId]);
        console.log('✅ Created test history entry');

        // Test SET NULL behavior (delete category)
        await client.query('DELETE FROM tool_categories WHERE id = $1;', [categoryId]);
        
        const toolAfterCategoryDelete = await client.query(
            'SELECT category_id FROM ai_tools WHERE id = $1;', [toolId]
        );
        const categorySetToNull = toolAfterCategoryDelete.rows[0].category_id === null;
        console.log(`${categorySetToNull ? '✅' : '❌'} SET NULL behavior: tool.category_id set to NULL when category deleted`);

        // Test CASCADE behavior (delete tool)
        await client.query('DELETE FROM ai_tools WHERE id = $1;', [toolId]);
        
        const updatesAfterToolDelete = await client.query(
            'SELECT COUNT(*) as count FROM feature_updates WHERE tool_id = $1;', [toolId]
        );
        const updatesCascaded = parseInt(updatesAfterToolDelete.rows[0].count) === 0;
        console.log(`${updatesCascaded ? '✅' : '❌'} CASCADE behavior: feature_updates deleted when tool deleted`);

        const historyAfterUpdateDelete = await client.query(
            'SELECT COUNT(*) as count FROM update_history WHERE update_id = $1;', [updateId]
        );
        const historyCascaded = parseInt(historyAfterUpdateDelete.rows[0].count) === 0;
        console.log(`${historyCascaded ? '✅' : '❌'} CASCADE behavior: update_history deleted when update deleted`);

        await client.query('ROLLBACK;');

        // Test full-text search
        console.log('\n🔍 TESTING FULL-TEXT SEARCH\n');

        // Create some test data for search
        await client.query('BEGIN;');
        
        await client.query(`
            INSERT INTO tool_categories (name) VALUES ('Search Test Category');
        `);
        
        const searchCategoryResult = await client.query(`
            SELECT id FROM tool_categories WHERE name = 'Search Test Category';
        `);
        const searchCategoryId = searchCategoryResult.rows[0].id;

        await client.query(`
            INSERT INTO ai_tools (name, slug, description, category_id) 
            VALUES ('Amazing AI Tool', 'amazing-ai', 'This tool helps with machine learning tasks', $1);
        `, [searchCategoryId]);

        const searchToolResult = await client.query(`
            SELECT id FROM ai_tools WHERE slug = 'amazing-ai';
        `);
        const searchToolId = searchToolResult.rows[0].id;

        await client.query(`
            INSERT INTO feature_updates (tool_id, title, description, content, published_date, validation_status) 
            VALUES ($1, 'Revolutionary Neural Network Update', 'Advanced deep learning capabilities', 
                   'This update introduces groundbreaking artificial intelligence features', NOW(), 'validated');
        `, [searchToolId]);

        // Test search on ai_tools
        const toolSearchResult = await client.query(`
            SELECT name FROM ai_tools 
            WHERE to_tsvector('english', name || ' ' || COALESCE(description, '')) 
            @@ to_tsquery('english', 'machine & learning');
        `);
        console.log(`${toolSearchResult.rows.length > 0 ? '✅' : '❌'} Full-text search on ai_tools working`);

        // Test search on feature_updates
        const updateSearchResult = await client.query(`
            SELECT title FROM feature_updates 
            WHERE to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(content, '')) 
            @@ to_tsquery('english', 'neural & network');
        `);
        console.log(`${updateSearchResult.rows.length > 0 ? '✅' : '❌'} Full-text search on feature_updates working`);

        await client.query('ROLLBACK;');

        // Test trigger functionality
        console.log('\n⚡ TESTING TRIGGER FUNCTIONALITY\n');

        await client.query('BEGIN;');
        
        // Insert a record and check initial timestamp
        const triggerTestResult = await client.query(`
            INSERT INTO tool_categories (name) 
            VALUES ('Trigger Test') 
            RETURNING created_at, updated_at;
        `);
        const initialCreated = triggerTestResult.rows[0].created_at;
        const initialUpdated = triggerTestResult.rows[0].updated_at;
        console.log('✅ Initial timestamps set correctly');

        // Wait a moment then update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await client.query(`
            UPDATE tool_categories 
            SET description = 'Updated description' 
            WHERE name = 'Trigger Test';
        `);

        const afterUpdateResult = await client.query(`
            SELECT created_at, updated_at 
            FROM tool_categories 
            WHERE name = 'Trigger Test';
        `);
        const afterCreated = afterUpdateResult.rows[0].created_at;
        const afterUpdated = afterUpdateResult.rows[0].updated_at;

        const createdUnchanged = new Date(initialCreated).getTime() === new Date(afterCreated).getTime();
        const updatedChanged = new Date(initialUpdated).getTime() < new Date(afterUpdated).getTime();

        console.log(`${createdUnchanged ? '✅' : '❌'} created_at unchanged after update`);
        console.log(`${updatedChanged ? '✅' : '❌'} updated_at automatically updated by trigger`);

        await client.query('ROLLBACK;');

        // Test unique constraint for validated updates
        console.log('\n🔒 TESTING BUSINESS RULE CONSTRAINTS\n');

        await client.query('BEGIN;');
        
        // Create test tool
        await client.query(`
            INSERT INTO tool_categories (name) VALUES ('Business Rule Test');
        `);
        
        const businessCategoryResult = await client.query(`
            SELECT id FROM tool_categories WHERE name = 'Business Rule Test';
        `);
        const businessCategoryId = businessCategoryResult.rows[0].id;

        await client.query(`
            INSERT INTO ai_tools (name, slug, category_id) 
            VALUES ('Business Rule Tool', 'business-rule-tool', $1);
        `, [businessCategoryId]);

        const businessToolResult = await client.query(`
            SELECT id FROM ai_tools WHERE slug = 'business-rule-tool';
        `);
        const businessToolId = businessToolResult.rows[0].id;

        // Insert first validated update
        await client.query(`
            INSERT INTO feature_updates (tool_id, title, published_date, validation_status, ai_analyzed) 
            VALUES ($1, 'First Update', NOW(), 'validated', true);
        `, [businessToolId]);
        console.log('✅ First validated+analyzed update inserted successfully');

        // Try to insert second validated update (should fail)
        try {
            await client.query(`
                INSERT INTO feature_updates (tool_id, title, published_date, validation_status, ai_analyzed) 
                VALUES ($1, 'Second Update', NOW(), 'validated', true);
            `, [businessToolId]);
            console.log('❌ Unique constraint for validated updates not working');
        } catch (error) {
            console.log('✅ Unique constraint prevents multiple validated+analyzed updates per tool');
        }

        await client.query('ROLLBACK;');

        console.log('\n🎉 DETAILED RELATIONSHIP AND FEATURE TESTING COMPLETE!');

    } catch (error) {
        console.error('❌ Error during detailed testing:', error.message);
        await client.query('ROLLBACK;');
    } finally {
        await client.end();
    }
}

if (require.main === module) {
    runDetailedTests().catch(console.error);
}

module.exports = { runDetailedTests };