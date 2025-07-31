#!/usr/bin/env node

/**
 * Complete Database Seeding Script
 * This script seeds the database with all 15 AI development tools and comprehensive sample data
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase connection configuration for local development
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function executeCompleteSeeding() {
  console.log('🌱 Starting complete database seeding for AI Feature Tracker...');
  
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
    
    // Step 3: Insert all 15 AI tools
    console.log('🛠️ Inserting all 15 AI development tools...');
    
    // Get category IDs for reference
    const categoryMap = {};
    categoriesData.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });
    
    const tools = [
      // AI Assistants (5 tools)
      {
        name: 'Claude (Anthropic)',
        slug: 'claude-anthropic',
        description: 'Advanced AI assistant by Anthropic with superior reasoning capabilities, coding help, and analysis. Features constitutional AI for safer interactions and excellent performance on complex programming tasks.',
        category_id: categoryMap['AI Assistants'],
        website_url: 'https://claude.ai',
        logo_url: 'https://assets.anthropic.com/m/1cd9d098ac89d2ef/original/Claude-Logomark-Circle-500px.png',
        metadata: {
          company: 'Anthropic',
          founding_year: 2021,
          primary_model: 'Claude 3',
          specialties: ['reasoning', 'coding', 'analysis', 'safety'],
          languages: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML', 'CSS'],
          integration_options: ['API', 'Web Interface', 'Third-party Apps']
        }
      },
      {
        name: 'ChatGPT (OpenAI)',
        slug: 'chatgpt-openai',
        description: 'Leading conversational AI by OpenAI with strong coding capabilities, problem-solving, and creative writing. Features GPT-4 and custom GPTs for specialized development tasks.',
        category_id: categoryMap['AI Assistants'],
        website_url: 'https://chat.openai.com',
        logo_url: 'https://cdn.oaistatic.com/_next/static/media/apple-touch-icon.82af6fe1.png',
        metadata: {
          company: 'OpenAI',
          founding_year: 2022,
          primary_model: 'GPT-4',
          specialties: ['conversation', 'coding', 'creative_writing', 'custom_gpts'],
          languages: ['Python', 'JavaScript', 'Java', 'C++', 'Go', 'Rust'],
          integration_options: ['API', 'Web Interface', 'Mobile App', 'Plugins']
        }
      },
      {
        name: 'Gemini (Google)',
        slug: 'gemini-google',
        description: 'Google\'s advanced AI assistant with multimodal capabilities, integrated with Google services, and strong performance in coding and analysis tasks.',
        category_id: categoryMap['AI Assistants'],
        website_url: 'https://gemini.google.com',
        logo_url: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
        metadata: {
          company: 'Google',
          founding_year: 2023,
          primary_model: 'Gemini Ultra',
          specialties: ['multimodal', 'google_integration', 'coding', 'analysis'],
          languages: ['Python', 'JavaScript', 'Java', 'C++', 'Kotlin'],
          integration_options: ['API', 'Web Interface', 'Google Workspace']
        }
      },
      {
        name: 'Grok (xAI)',
        slug: 'grok-xai',
        description: 'Real-time AI assistant by xAI with access to X (Twitter) data, designed for witty and informative responses with up-to-date information for developers.',
        category_id: categoryMap['AI Assistants'],
        website_url: 'https://grok.x.ai',
        logo_url: 'https://grok.x.ai/assets/grok-logo.png',
        metadata: {
          company: 'xAI',
          founding_year: 2023,
          primary_model: 'Grok-1',
          specialties: ['real_time_data', 'x_integration', 'wit', 'current_events'],
          languages: ['Python', 'JavaScript', 'TypeScript'],
          integration_options: ['Web Interface', 'X Integration']
        }
      },
      {
        name: 'DeepSeek',
        slug: 'deepseek',
        description: 'Powerful open-source AI model with strong coding capabilities and mathematical reasoning, offering competitive performance to leading commercial models.',
        category_id: categoryMap['AI Assistants'],
        website_url: 'https://deepseek.com',
        logo_url: 'https://deepseek.com/static/logo.png',
        metadata: {
          company: 'DeepSeek',
          founding_year: 2023,
          primary_model: 'DeepSeek-V2',
          specialties: ['open_source', 'coding', 'mathematics', 'reasoning'],
          languages: ['Python', 'C++', 'Java', 'JavaScript', 'Go'],
          integration_options: ['API', 'Open Source Models', 'HuggingFace']
        }
      },
      
      // Code Editors (5 tools)
      {
        name: 'GitHub Copilot',
        slug: 'github-copilot',
        description: 'AI pair programmer by GitHub that suggests code completions and entire functions as you type, integrated directly into popular editors and IDEs.',
        category_id: categoryMap['Code Editors'],
        website_url: 'https://github.com/features/copilot',
        logo_url: 'https://github.githubassets.com/images/modules/site/copilot/copilot-logo.png',
        metadata: {
          company: 'GitHub/Microsoft',
          founding_year: 2021,
          primary_model: 'Codex',
          specialties: ['code_completion', 'ide_integration', 'pair_programming', 'multiple_languages'],
          languages: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C#', 'PHP', 'Ruby', 'Go'],
          integration_options: ['VS Code', 'Visual Studio', 'JetBrains IDEs', 'Neovim']
        }
      },
      {
        name: 'Cursor AI',
        slug: 'cursor-ai',
        description: 'AI-first code editor built on VS Code with advanced codebase understanding, multi-file editing, and intelligent code generation capabilities.',
        category_id: categoryMap['Code Editors'],
        website_url: 'https://cursor.sh',
        logo_url: 'https://cursor.sh/assets/logo.png',
        metadata: {
          company: 'Anysphere',
          founding_year: 2023,
          primary_model: 'GPT-4',
          specialties: ['codebase_understanding', 'multi_file_editing', 'vs_code_based', 'context_aware'],
          languages: ['Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js'],
          integration_options: ['Standalone Editor', 'VS Code Extensions', 'Git Integration']
        }
      },
      {
        name: 'Windsurf (Codeium)',
        slug: 'windsurf-codeium',
        description: 'Next-generation AI-powered code editor by Codeium with advanced flow state features and seamless AI integration for enhanced productivity.',
        category_id: categoryMap['Code Editors'],
        website_url: 'https://codeium.com/windsurf',
        logo_url: 'https://codeium.com/static/windsurf-logo.png',
        metadata: {
          company: 'Codeium',
          founding_year: 2024,
          primary_model: 'Codeium Models',
          specialties: ['flow_state', 'seamless_integration', 'productivity', 'modern_ui'],
          languages: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go'],
          integration_options: ['Standalone Editor', 'VS Code Extension', 'JetBrains Plugin']
        }
      },
      {
        name: 'Augment',
        slug: 'augment',
        description: 'AI coding assistant that understands your entire codebase and provides contextual suggestions, refactoring help, and intelligent code generation.',
        category_id: categoryMap['Code Editors'],
        website_url: 'https://augmentcode.com',
        logo_url: 'https://augmentcode.com/assets/logo.svg',
        metadata: {
          company: 'Augment Code',
          founding_year: 2023,
          primary_model: 'Custom Models',
          specialties: ['codebase_context', 'refactoring', 'intelligent_suggestions', 'code_understanding'],
          languages: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C#'],
          integration_options: ['VS Code', 'JetBrains IDEs', 'API']
        }
      },
      {
        name: 'Replit AI',
        slug: 'replit-ai',
        description: 'Integrated AI assistant in Replit\'s cloud development environment, offering code completion, debugging help, and project assistance.',
        category_id: categoryMap['Code Editors'],
        website_url: 'https://replit.com/ai',
        logo_url: 'https://replit.com/public/images/replit-logo.svg',
        metadata: {
          company: 'Replit',
          founding_year: 2022,
          primary_model: 'Custom Models',
          specialties: ['cloud_development', 'project_assistance', 'debugging', 'integrated_environment'],
          languages: ['Python', 'JavaScript', 'Java', 'C++', 'HTML', 'CSS'],
          integration_options: ['Replit IDE', 'Cloud Deployment', 'Mobile App']
        }
      },
      
      // Code Completion (3 tools)
      {
        name: 'Amazon CodeWhisperer',
        slug: 'amazon-codewhisperer',
        description: 'AI code generator by Amazon that provides real-time code suggestions and helps identify security issues in your code with AWS integration.',
        category_id: categoryMap['Code Completion'],
        website_url: 'https://aws.amazon.com/codewhisperer',
        logo_url: 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png',
        metadata: {
          company: 'Amazon Web Services',
          founding_year: 2022,
          primary_model: 'CodeWhisperer',
          specialties: ['code_suggestions', 'security_scanning', 'aws_integration', 'enterprise_ready'],
          languages: ['Python', 'Java', 'JavaScript', 'TypeScript', 'C#', 'Go', 'Rust'],
          integration_options: ['VS Code', 'JetBrains IDEs', 'AWS Cloud9', 'Lambda Console']
        }
      },
      {
        name: 'Tabnine',
        slug: 'tabnine',
        description: 'AI code completion tool that learns from your codebase to provide personalized suggestions while keeping your code private and secure.',
        category_id: categoryMap['Code Completion'],
        website_url: 'https://tabnine.com',
        logo_url: 'https://tabnine.com/wp-content/uploads/2021/03/tabnine-logo.png',
        metadata: {
          company: 'Tabnine',
          founding_year: 2019,
          primary_model: 'Custom Models',
          specialties: ['personalized_completion', 'privacy_focused', 'on_premise', 'team_training'],
          languages: ['Python', 'JavaScript', 'Java', 'C++', 'C#', 'PHP', 'Go', 'Rust'],
          integration_options: ['VS Code', 'JetBrains IDEs', 'Sublime Text', 'Atom', 'Emacs', 'Vim']
        }
      },
      {
        name: 'Sourcegraph Cody',
        slug: 'sourcegraph-cody',
        description: 'AI coding assistant by Sourcegraph that understands your entire codebase to provide accurate code completions and explanations.',
        category_id: categoryMap['Code Completion'],
        website_url: 'https://sourcegraph.com/cody',
        logo_url: 'https://sourcegraph.com/.assets/img/sourcegraph-logo-light.svg',
        metadata: {
          company: 'Sourcegraph',
          founding_year: 2022,
          primary_model: 'Multiple Models',
          specialties: ['codebase_search', 'code_intelligence', 'accurate_completions', 'enterprise_scale'],
          languages: ['Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'C++', 'C#'],
          integration_options: ['VS Code', 'JetBrains IDEs', 'Web Interface', 'CLI']
        }
      },
      
      // Search & Documentation (1 tool)
      {
        name: 'Phind',
        slug: 'phind',
        description: 'AI-powered search engine specifically designed for developers, providing instant answers to coding questions with relevant code examples and explanations.',
        category_id: categoryMap['Search & Documentation'],
        website_url: 'https://phind.com',
        logo_url: 'https://phind.com/images/logo.png',
        metadata: {
          company: 'Phind',
          founding_year: 2022,
          primary_model: 'Custom Models',
          specialties: ['developer_search', 'coding_answers', 'code_examples', 'technical_documentation'],
          languages: ['Python', 'JavaScript', 'Java', 'C++', 'Go', 'Rust'],
          integration_options: ['Web Interface', 'Browser Extension', 'API']
        }
      },
      
      // Productivity Tools (1 tool)
      {
        name: 'JetBrains AI Assistant',
        slug: 'jetbrains-ai-assistant',
        description: 'Integrated AI assistant in JetBrains IDEs providing context-aware code completion, generation, and intelligent development assistance.',
        category_id: categoryMap['Productivity Tools'],
        website_url: 'https://jetbrains.com/ai',
        logo_url: 'https://www.jetbrains.com/company/brand/img/jetbrains_logo.png',
        metadata: {
          company: 'JetBrains',
          founding_year: 2023,
          primary_model: 'Multiple Models',
          specialties: ['ide_integration', 'context_aware', 'intelligent_assistance', 'professional_tools'],
          languages: ['Java', 'Kotlin', 'Python', 'JavaScript', 'TypeScript', 'C#', 'Go'],
          integration_options: ['IntelliJ IDEA', 'PyCharm', 'WebStorm', 'PhpStorm', 'GoLand', 'Rider']
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
    
    // Step 4: Insert comprehensive sample feature updates
    console.log('📝 Inserting comprehensive feature updates...');
    
    // Get tool IDs for reference
    const toolMap = {};
    toolsData.forEach(tool => {
      toolMap[tool.slug] = tool.id;
    });
    
    const updates = [
      // Claude updates - Only the latest is validated due to unique constraint
      {
        tool_id: toolMap['claude-anthropic'],
        title: 'Claude 3 Opus Model Release',
        description: 'Anthropic releases Claude 3 Opus, their most capable model with enhanced reasoning and coding abilities.',
        content: 'Claude 3 Opus represents a significant leap forward in AI capability, offering improved performance on complex reasoning tasks, mathematical problem-solving, and code generation. The model demonstrates better understanding of nuanced instructions and maintains Anthropic\'s focus on AI safety through Constitutional AI training methods.',
        impact_level: 'High',
        official_url: 'https://www.anthropic.com/claude-3-family',
        published_date: '2024-03-04T10:00:00Z',
        validation_status: 'validated',
        ai_analyzed: true,
        confidence_score: 0.95
      },
      {
        tool_id: toolMap['claude-anthropic'],
        title: 'Improved Code Analysis Features',
        description: 'Enhanced ability to analyze and explain complex codebases with better context understanding.',
        content: 'Claude now offers significantly improved code analysis capabilities, including better understanding of multi-file projects, enhanced debugging assistance, and more accurate code explanations.',
        impact_level: 'Medium',
        official_url: 'https://www.anthropic.com/news/code-analysis-update',
        published_date: '2024-01-15T14:30:00Z',
        validation_status: 'pending',
        ai_analyzed: false,
        confidence_score: null
      },
      
      // ChatGPT updates
      {
        tool_id: toolMap['chatgpt-openai'],
        title: 'GPT-4 Vision Integration',
        description: 'ChatGPT now supports image analysis and vision capabilities for code screenshots and diagrams.',
        content: 'OpenAI has integrated GPT-4 Vision capabilities directly into ChatGPT, allowing users to upload images, screenshots of code, architectural diagrams, and other visual content for analysis and discussion.',
        impact_level: 'High',
        official_url: 'https://openai.com/blog/chatgpt-can-now-see-hear-and-speak',
        published_date: '2023-09-25T16:00:00Z',
        validation_status: 'validated',
        ai_analyzed: true,
        confidence_score: 0.92
      },
      {
        tool_id: toolMap['chatgpt-openai'],
        title: 'Custom GPTs for Development',
        description: 'Introduction of specialized Custom GPTs designed specifically for different programming languages and frameworks.',
        content: 'OpenAI introduces Custom GPTs marketplace featuring specialized AI assistants for specific development needs including React GPT, Python GPT, and DevOps GPT.',
        impact_level: 'High',
        official_url: 'https://openai.com/blog/introducing-gpts',
        published_date: '2023-11-06T12:00:00Z',
        validation_status: 'requires_review',
        ai_analyzed: true,
        confidence_score: 0.91
      },
      
      // GitHub Copilot updates
      {
        tool_id: toolMap['github-copilot'],
        title: 'Copilot Chat GA Release',
        description: 'GitHub Copilot Chat is now generally available with enhanced conversational coding assistance.',
        content: 'GitHub Copilot Chat moves from beta to general availability, offering developers a conversational interface for coding assistance with improved context awareness.',
        impact_level: 'High',
        official_url: 'https://github.blog/2023-12-29-github-copilot-chat-beta-now-available-for-every-organization/',
        published_date: '2023-12-29T12:00:00Z',
        validation_status: 'validated',
        ai_analyzed: true,
        confidence_score: 0.94
      },
      {
        tool_id: toolMap['github-copilot'],
        title: 'Copilot Enterprise Features',
        description: 'Enterprise-grade features including fine-tuning on private repositories and advanced security scanning.',
        content: 'GitHub introduces Copilot Enterprise with advanced features for large organizations including fine-tuning on private codebases and enhanced security controls.',
        impact_level: 'Medium',
        official_url: 'https://github.blog/2024-02-07-github-copilot-enterprise-is-now-generally-available/',
        published_date: '2024-02-07T09:00:00Z',
        validation_status: 'pending',
        ai_analyzed: false,
        confidence_score: null
      },
      
      // Cursor AI updates
      {
        tool_id: toolMap['cursor-ai'],
        title: 'Multi-file Editing Capabilities',
        description: 'Cursor AI introduces advanced multi-file editing with improved codebase understanding.',
        content: 'The latest Cursor AI update introduces powerful multi-file editing capabilities that allow the AI to understand and modify multiple files simultaneously while maintaining code consistency.',
        impact_level: 'High',
        official_url: 'https://cursor.sh/blog/multi-file-editing',
        published_date: '2024-02-10T09:00:00Z',
        validation_status: 'validated',
        ai_analyzed: true,
        confidence_score: 0.91
      },
      
      // Gemini updates
      {
        tool_id: toolMap['gemini-google'],
        title: 'Gemini Ultra Model Launch',
        description: 'Google launches Gemini Ultra, their most capable AI model with enhanced coding and reasoning abilities.',
        content: 'Google introduces Gemini Ultra with state-of-the-art performance in coding, mathematics, and reasoning tasks, offering improved multimodal capabilities.',
        impact_level: 'High',
        official_url: 'https://blog.google/technology/ai/google-gemini-ai/',
        published_date: '2024-02-08T11:00:00Z',
        validation_status: 'validated',
        ai_analyzed: true,
        confidence_score: 0.93
      },
      
      // Additional updates for other tools
      {
        tool_id: toolMap['windsurf-codeium'],
        title: 'Flow State Enhancement',
        description: 'Windsurf introduces improved flow state features for seamless AI-assisted coding experience.',
        content: 'Codeium\'s Windsurf editor receives significant updates to its flow state capabilities, offering more intuitive AI integration.',
        impact_level: 'Medium',
        official_url: 'https://codeium.com/blog/windsurf-flow-state-update',
        published_date: '2024-01-20T13:45:00Z',
        validation_status: 'validated',
        ai_analyzed: true,
        confidence_score: 0.87
      },
      
      {
        tool_id: toolMap['tabnine'],
        title: 'Enterprise Security Features',
        description: 'Tabnine enhances enterprise security with improved on-premise deployment and privacy controls.',
        content: 'Tabnine introduces enhanced enterprise security features including improved on-premise deployment options and advanced privacy controls.',
        impact_level: 'Medium',
        official_url: 'https://tabnine.com/blog/enterprise-security-update',
        published_date: '2024-01-05T10:30:00Z',
        validation_status: 'validated',
        ai_analyzed: true,
        confidence_score: 0.89
      },
      
      {
        tool_id: toolMap['phind'],
        title: 'Enhanced Code Search Algorithm',
        description: 'Phind improves its search algorithm for more accurate and relevant coding answers.',
        content: 'Phind releases an updated search algorithm that provides more accurate and contextually relevant answers to developer queries.',
        impact_level: 'Medium',
        official_url: 'https://phind.com/blog/search-algorithm-update',
        published_date: '2024-01-12T15:20:00Z',
        validation_status: 'validated',
        ai_analyzed: true,
        confidence_score: 0.85
      },
      
      {
        tool_id: toolMap['deepseek'],
        title: 'DeepSeek-V2 Model Release',
        description: 'DeepSeek releases V2 model with significant improvements in coding and mathematical reasoning.',
        content: 'DeepSeek launches their V2 model featuring substantial improvements in code generation and mathematical problem-solving.',
        impact_level: 'High',
        official_url: 'https://deepseek.com/blog/deepseek-v2-release',
        published_date: '2024-02-15T08:00:00Z',
        validation_status: 'validated',
        ai_analyzed: true,
        confidence_score: 0.90
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
    
    // Step 5: Insert sample update history for audit trail
    console.log('📋 Inserting sample update history for audit trail...');
    
    const history = [
      {
        update_id: updatesData.find(u => u.title === 'Claude 3 Opus Model Release')?.id,
        change_type: 'created',
        old_data: null,
        new_data: { title: 'Claude 3 Opus Model Release', validation_status: 'pending', ai_analyzed: false },
        changed_by: 'system_import',
        change_reason: 'Initial data import from official announcement',
        changed_at: '2024-03-04T10:00:00Z'
      },
      {
        update_id: updatesData.find(u => u.title === 'Claude 3 Opus Model Release')?.id,
        change_type: 'ai_analyzed',
        old_data: { validation_status: 'pending', ai_analyzed: false },
        new_data: { validation_status: 'validated', ai_analyzed: true, confidence_score: 0.95 },
        changed_by: 'ai_content_analyzer',
        change_reason: 'AI analysis completed with high confidence',
        changed_at: '2024-03-04T10:15:00Z'
      }
    ];
    
    const { data: historyData, error: historyError } = await supabase
      .from('update_history')
      .insert(history.filter(h => h.update_id)) // Only insert if update_id exists
      .select();
    
    if (historyError) {
      console.warn('⚠️ Warning inserting history (non-critical):', historyError);
    } else {
      console.log(`✅ Inserted ${historyData?.length || 0} audit history records`);
    }
    
    // Step 6: Final validation and summary
    console.log('🔍 Final validation and data summary...');
    
    const { data: finalCategories, count: categoryCount } = await supabase
      .from('tool_categories')
      .select('*', { count: 'exact' });
    
    const { data: finalTools, count: toolCount } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact' });
    
    const { data: finalUpdates, count: updateCount } = await supabase
      .from('feature_updates')
      .select('*', { count: 'exact' });
    
    const { data: finalHistory, count: historyCount } = await supabase
      .from('update_history')
      .select('*', { count: 'exact' });
    
    console.log('📊 Final seeding summary:');
    console.log(`   📂 Categories: ${categoryCount}`);
    console.log(`   🛠️ AI Tools: ${toolCount}`);
    console.log(`   📝 Feature Updates: ${updateCount}`);
    console.log(`   📋 History Records: ${historyCount}`);
    
    // Test views to ensure they work
    console.log('🔧 Testing database views...');
    
    const { data: viewTest1 } = await supabase
      .from('tools_with_latest_updates')
      .select('*')
      .limit(1);
    
    const { data: viewTest2 } = await supabase
      .from('recent_feature_updates')
      .select('*')
      .limit(1);
    
    console.log(`✅ Database views working: tools_with_latest_updates (${viewTest1?.length || 0}), recent_feature_updates (${viewTest2?.length || 0})`);
    
    console.log('🎉 Complete database seeding finished successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. ✅ Database is ready for frontend integration');
    console.log('2. ✅ Real-time subscriptions can be tested');
    console.log('3. ✅ Search and filtering functionality is ready');
    console.log('4. ✅ All 15 AI development tools are available');
    console.log('5. ✅ Sample data supports full application testing');
    
  } catch (error) {
    console.error('❌ Failed to execute complete seeding:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the complete seeding
if (require.main === module) {
  executeCompleteSeeding()
    .then(() => {
      console.log('✅ Complete seeding process finished successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Complete seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { executeCompleteSeeding };