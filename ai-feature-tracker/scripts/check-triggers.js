// Check trigger status and fix if needed
const { Client } = require('pg');

async function checkTriggers() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
    });

    try {
        await client.connect();

        // Check if function exists
        const functionCheck = await client.query(`
            SELECT routine_name 
            FROM information_schema.routines 
            WHERE routine_schema = 'public' 
            AND routine_name = 'update_updated_at_column';
        `);
        console.log('Function exists:', functionCheck.rows.length > 0);

        // Check triggers
        const triggerCheck = await client.query(`
            SELECT trigger_name, event_object_table, action_statement
            FROM information_schema.triggers 
            WHERE trigger_schema = 'public'
            AND trigger_name LIKE '%updated_at%';
        `);
        console.log('Triggers found:', triggerCheck.rows);

        // Test trigger manually
        console.log('\nTesting trigger manually...');
        await client.query('BEGIN;');
        
        await client.query(`
            INSERT INTO tool_categories (name) VALUES ('Test Trigger Function');
        `);

        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        
        const beforeUpdate = await client.query(`
            SELECT created_at, updated_at FROM tool_categories WHERE name = 'Test Trigger Function';
        `);
        console.log('Before update:', beforeUpdate.rows[0]);

        await client.query(`
            UPDATE tool_categories SET description = 'Updated' WHERE name = 'Test Trigger Function';
        `);

        const afterUpdate = await client.query(`
            SELECT created_at, updated_at FROM tool_categories WHERE name = 'Test Trigger Function';
        `);
        console.log('After update:', afterUpdate.rows[0]);

        const updatedAtChanged = new Date(beforeUpdate.rows[0].updated_at).getTime() < new Date(afterUpdate.rows[0].updated_at).getTime();
        console.log('updated_at changed:', updatedAtChanged);

        await client.query('ROLLBACK;');

    } catch (error) {
        console.error('Error:', error.message);
        await client.query('ROLLBACK;');
    } finally {
        await client.end();
    }
}

checkTriggers().catch(console.error);