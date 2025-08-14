// Verify Local Schema Implementation
// Simple Node.js script to test our database schema

const { Client } = require('pg');

try {
    const dotenv = require('dotenv');
    dotenv.config();
    dotenv.config({ path: '.env.local', override: true });
} catch {}

async function verifySchema() {
    const client = new Client({
        connectionString: process.env.DEV_DATABASE_URL
    });

    try {
        await client.connect();
        console.log('✅ Connected to local Supabase database');

        // Test 1: Check tables exist
        console.log('\n📋 Checking table creation...');
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('tool_categories', 'ai_tools', 'feature_updates', 'update_history')
            ORDER BY table_name;
        `);
        
        console.log('Tables found:', tablesResult.rows.map(r => r.table_name));
        
        if (tablesResult.rows.length === 4) {
            console.log('✅ All 4 core tables created successfully');
        } else {
            console.log('❌ Missing tables');
            return;
        }

        // Test 2: Check seed data
        console.log('\n🌱 Checking seed data...');
        const categoryResult = await client.query('SELECT COUNT(*) as count FROM tool_categories;');
        const categoryCount = parseInt(categoryResult.rows[0].count);
        
        if (categoryCount === 8) {
            console.log('✅ All 8 seed categories inserted successfully');
        } else {
            console.log(`❌ Expected 8 categories, found ${categoryCount}`);
        }

        // Test 3: Check views exist
        console.log('\n👁️ Checking views...');
        const viewsResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'VIEW'
            AND table_name IN ('tools_with_latest_updates', 'recent_feature_updates');
        `);
        
        if (viewsResult.rows.length === 2) {
            console.log('✅ Both database views created successfully');
        } else {
            console.log('❌ Missing database views');
        }

        // Test 4: Check indexes
        console.log('\n📊 Checking indexes...');
        const indexResult = await client.query(`
            SELECT COUNT(*) as count
            FROM pg_indexes 
            WHERE schemaname = 'public' 
            AND tablename IN ('tool_categories', 'ai_tools', 'feature_updates', 'update_history');
        `);
        
        const indexCount = parseInt(indexResult.rows[0].count);
        console.log(`Found ${indexCount} indexes on our tables`);
        
        if (indexCount >= 10) {
            console.log('✅ Performance indexes created successfully');
        } else {
            console.log('⚠️ Some indexes may be missing');
        }

        // Test 5: Test constraint validation
        console.log('\n🔒 Testing constraints...');
        try {
            await client.query(`
                INSERT INTO ai_tools (name, slug) 
                VALUES ('Test Tool', 'invalid slug with spaces');
            `);
            console.log('❌ Slug constraint not working');
        } catch (error) {
            if (error.message.includes('valid_slug')) {
                console.log('✅ Slug validation constraint working');
            } else {
                console.log('⚠️ Unexpected constraint error:', error.message);
            }
        }

        console.log('\n🎉 Schema verification complete!');
        console.log('\n🌐 Access Supabase Studio at: http://127.0.0.1:54323');
        console.log('📊 Database URL:', process.env.DEV_DATABASE_URL || '(set DEV_DATABASE_URL)');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

// Run if called directly
if (require.main === module) {
    verifySchema().catch(console.error);
}

module.exports = { verifySchema };