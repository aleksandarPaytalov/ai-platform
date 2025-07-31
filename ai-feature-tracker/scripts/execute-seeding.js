#!/usr/bin/env node

/**
 * Database Seeding Execution Script
 * This script executes the database seeding for the AI Feature Tracker
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase connection configuration for local development
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function executeSeedingSQL() {
  console.log('🌱 Starting database seeding...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'seed-database.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('📖 SQL file loaded successfully');
    
    // Split the SQL into individual statements
    // Remove comments and empty lines, then split by semicolon
    const statements = sqlContent
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
      .join('\n')
      .split(';')
      .filter(statement => statement.trim().length > 0)
      .map(statement => statement.trim() + ';');
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute statements in sequence
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip transaction control statements and comments
      if (statement.includes('BEGIN;') || 
          statement.includes('COMMIT;') || 
          statement.includes('SET session_replication_role') ||
          statement.trim().startsWith('--')) {
        continue;
      }
      
      try {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error.message);
          // Continue with next statement for non-critical errors
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`❌ Exception in statement ${i + 1}:`, err.message);
      }
    }
    
    console.log('🎉 Database seeding completed!');
    
  } catch (error) {
    console.error('❌ Failed to execute seeding:', error.message);
    process.exit(1);
  }
}

// Alternative approach: Execute via RPC function
async function executeSeedingRPC() {
  console.log('🌱 Starting database seeding via direct SQL execution...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Step 1: Clear existing data
    console.log('🧹 Clearing existing data...');
    
    await supabase.from('update_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('feature_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('ai_tools').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('tool_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log('✅ Existing data cleared');
    
    // Step 2: Insert tool categories
    console.log('📂 Inserting tool categories...');
    
    const categories = [
      {
        name: 'AI Assistants',
        description: 'General-purpose AI conversation and coding assistants that help with development tasks',
        color_code: '#3B82F6',
        sort_order: 1
      },
      {
        name: 'Code Editors',
        description: 'AI-enhanced code editors and IDEs with built-in coding assistance capabilities',
        color_code: '#10B981',
        sort_order: 2
      },
      {
        name: 'Code Completion',
        description: 'Specialized tools focused on intelligent code completion and programming suggestions',
        color_code: '#8B5CF6',
        sort_order: 3
      },
      {
        name: 'Search & Documentation',
        description: 'AI-powered code search, documentation generation, and technical information tools',
        color_code: '#F59E0B',
        sort_order: 4
      },
      {
        name: 'Productivity Tools',
        description: 'AI tools that enhance developer productivity, workflow automation, and team collaboration',
        color_code: '#EF4444',
        sort_order: 5
      }
    ];
    
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('tool_categories')
      .insert(categories)
      .select();
    
    if (categoriesError) {
      console.error('❌ Error inserting categories:', categoriesError);
      return;
    }
    
    console.log(`✅ Inserted ${categoriesData.length} categories`);
    
    // Step 3: Insert AI tools
    console.log('🛠️ Inserting AI tools...');
    
    // Get category IDs for reference
    const categoryMap = {};
    categoriesData.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });
    
    const tools = [
      {
        name: 'Claude (Anthropic)',
        slug: 'claude-anthropic',
        description: 'Advanced AI assistant by Anthropic with superior reasoning capabilities, coding help, and analysis. Features constitutional AI for safer interactions.',
        category_id: categoryMap['AI Assistants'],
        website_url: 'https://claude.ai',
        logo_url: 'https://assets.anthropic.com/m/1cd9d098ac89d2ef/original/Claude-Logomark-Circle-500px.png',
        metadata: {
          company: 'Anthropic',
          founding_year: 2021,
          primary_model: 'Claude 3',
          specialties: ['reasoning', 'coding', 'analysis', 'safety']
        }
      },
      {
        name: 'ChatGPT (OpenAI)',
        slug: 'chatgpt-openai',
        description: 'Leading conversational AI by OpenAI with strong coding capabilities, problem-solving, and creative writing. Features GPT-4 and custom GPTs.',
        category_id: categoryMap['AI Assistants'],
        website_url: 'https://chat.openai.com',
        logo_url: 'https://cdn.oaistatic.com/_next/static/media/apple-touch-icon.82af6fe1.png',
        metadata: {
          company: 'OpenAI',
          founding_year: 2022,
          primary_model: 'GPT-4',
          specialties: ['conversation', 'coding', 'creative_writing', 'custom_gpts']
        }
      },
      {
        name: 'GitHub Copilot',
        slug: 'github-copilot',
        description: 'AI pair programmer by GitHub that suggests code completions and entire functions as you type, integrated directly into popular editors.',
        category_id: categoryMap['Code Editors'],
        website_url: 'https://github.com/features/copilot',
        logo_url: 'https://github.githubassets.com/images/modules/site/copilot/copilot-logo.png',
        metadata: {
          company: 'GitHub/Microsoft',
          founding_year: 2021,
          primary_model: 'Codex',
          specialties: ['code_completion', 'ide_integration', 'pair_programming']
        }
      },
      {
        name: 'Cursor AI',
        slug: 'cursor-ai',
        description: 'AI-first code editor built on VS Code with advanced codebase understanding, multi-file editing, and intelligent code generation.',
        category_id: categoryMap['Code Editors'],
        website_url: 'https://cursor.sh',
        logo_url: 'https://cursor.sh/assets/logo.png',
        metadata: {
          company: 'Anysphere',
          founding_year: 2023,
          primary_model: 'GPT-4',
          specialties: ['codebase_understanding', 'multi_file_editing', 'vs_code_based']
        }
      },
      {
        name: 'Phind',
        slug: 'phind',
        description: 'AI-powered search engine specifically designed for developers, providing instant answers to coding questions with relevant code examples.',
        category_id: categoryMap['Search & Documentation'],
        website_url: 'https://phind.com',
        logo_url: 'https://phind.com/images/logo.png',
        metadata: {
          company: 'Phind',
          founding_year: 2022,
          primary_model: 'Custom Models',
          specialties: ['developer_search', 'coding_answers', 'code_examples']
        }
      }
    ];
    
    const { data: toolsData, error: toolsError } = await supabase
      .from('ai_tools')
      .insert(tools)
      .select();
    
    if (toolsError) {
      console.error('❌ Error inserting tools:', toolsError);
      return;
    }
    
    console.log(`✅ Inserted ${toolsData.length} AI tools`);
    
    // Step 4: Insert sample feature updates
    console.log('📝 Inserting sample feature updates...');
    
    // Get tool IDs for reference
    const toolMap = {};
    toolsData.forEach(tool => {
      toolMap[tool.slug] = tool.id;
    });
    
    const updates = [
      {
        tool_id: toolMap['claude-anthropic'],
        title: 'Claude 3 Opus Model Release',
        description: 'Anthropic releases Claude 3 Opus, their most capable model with enhanced reasoning and coding abilities.',
        content: 'Claude 3 Opus represents a significant leap forward in AI capability, offering improved performance on complex reasoning tasks, mathematical problem-solving, and code generation.',
        impact_level: 'High',
        official_url: 'https://www.anthropic.com/claude-3-family',
        published_date: '2024-03-04T10:00:00Z',
        validation_status: 'validated',
        ai_analyzed: true,
        confidence_score: 0.95
      },
      {
        tool_id: toolMap['chatgpt-openai'],
        title: 'GPT-4 Vision Integration',
        description: 'ChatGPT now supports image analysis and vision capabilities for code screenshots and diagrams.',
        content: 'OpenAI has integrated GPT-4 Vision capabilities directly into ChatGPT, allowing users to upload images, screenshots of code, and architectural diagrams for analysis.',
        impact_level: 'High',
        official_url: 'https://openai.com/blog/chatgpt-can-now-see-hear-and-speak',
        published_date: '2023-09-25T16:00:00Z',
        validation_status: 'validated',
        ai_analyzed: true,
        confidence_score: 0.92
      },
      {
        tool_id: toolMap['github-copilot'],
        title: 'Copilot Chat GA Release',
        description: 'GitHub Copilot Chat is now generally available with enhanced conversational coding assistance.',
        content: 'GitHub Copilot Chat moves from beta to general availability, offering developers a conversational interface for coding assistance.',
        impact_level: 'High',
        official_url: 'https://github.blog/2023-12-29-github-copilot-chat-beta-now-available-for-every-organization/',
        published_date: '2023-12-29T12:00:00Z',
        validation_status: 'validated',
        ai_analyzed: true,
        confidence_score: 0.94
      }
    ];
    
    const { data: updatesData, error: updatesError } = await supabase
      .from('feature_updates')
      .insert(updates)
      .select();
    
    if (updatesError) {
      console.error('❌ Error inserting updates:', updatesError);
      return;
    }
    
    console.log(`✅ Inserted ${updatesData.length} feature updates`);
    
    // Step 5: Validate data
    console.log('🔍 Validating seeded data...');
    
    const { data: categoryCount } = await supabase
      .from('tool_categories')
      .select('id', { count: 'exact' });
    
    const { data: toolCount } = await supabase
      .from('ai_tools')
      .select('id', { count: 'exact' });
    
    const { data: updateCount } = await supabase
      .from('feature_updates')
      .select('id', { count: 'exact' });
    
    console.log('📊 Final data summary:');
    console.log(`   Categories: ${categoryCount?.length || 0}`);
    console.log(`   Tools: ${toolCount?.length || 0}`);
    console.log(`   Updates: ${updateCount?.length || 0}`);
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Failed to execute seeding:', error.message);
    process.exit(1);
  }
}

// Run the seeding
if (require.main === module) {
  executeSeedingRPC()
    .then(() => {
      console.log('✅ Seeding process finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { executeSeedingRPC };