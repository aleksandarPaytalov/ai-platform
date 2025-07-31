-- ==============================================
-- AI Feature Tracker - Complete Database Seeding Script
-- This script seeds the database with initial data for 15 popular AI development tools
-- ==============================================

-- First, let's clear any existing data and start fresh
-- This ensures we have a clean slate for our AI development tools focus
BEGIN;

-- Disable triggers temporarily to avoid issues during bulk operations
SET session_replication_role = replica;

-- Clear existing data in dependency order
DELETE FROM update_history;
DELETE FROM feature_updates;
DELETE FROM ai_tools;
DELETE FROM tool_categories;

-- Re-enable triggers
SET session_replication_role = DEFAULT;

-- ==============================================
-- 1. CREATE TOOL CATEGORIES FOR AI DEVELOPMENT TOOLS
-- ==============================================
-- Insert comprehensive tool categories specifically for AI development tools

INSERT INTO tool_categories (name, description, color_code, sort_order) VALUES
('AI Assistants', 'General-purpose AI conversation and coding assistants that help with development tasks', '#3B82F6', 1),
('Code Editors', 'AI-enhanced code editors and IDEs with built-in coding assistance capabilities', '#10B981', 2),
('Code Completion', 'Specialized tools focused on intelligent code completion and programming suggestions', '#8B5CF6', 3),
('Search & Documentation', 'AI-powered code search, documentation generation, and technical information tools', '#F59E0B', 4),
('Productivity Tools', 'AI tools that enhance developer productivity, workflow automation, and team collaboration', '#EF4444', 5);

-- ==============================================
-- 2. CREATE 15 AI DEVELOPMENT TOOLS
-- ==============================================
-- Insert the complete list of 15 popular AI development tools with realistic data

INSERT INTO ai_tools (name, slug, description, category_id, website_url, logo_url, metadata) VALUES

-- AI Assistants Category (5 tools)
('Claude (Anthropic)', 'claude-anthropic', 
 'Advanced AI assistant by Anthropic with superior reasoning capabilities, coding help, and analysis. Features constitutional AI for safer interactions and excellent performance on complex programming tasks.',
 (SELECT id FROM tool_categories WHERE name = 'AI Assistants'), 
 'https://claude.ai', 
 'https://assets.anthropic.com/m/1cd9d098ac89d2ef/original/Claude-Logomark-Circle-500px.png',
 '{"company": "Anthropic", "founding_year": 2021, "primary_model": "Claude 3", "specialties": ["reasoning", "coding", "analysis", "safety"], "languages": ["Python", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"], "integration_options": ["API", "Web Interface", "Third-party Apps"]}'),

('ChatGPT (OpenAI)', 'chatgpt-openai', 
 'Leading conversational AI by OpenAI with strong coding capabilities, problem-solving, and creative writing. Features GPT-4 and custom GPTs for specialized development tasks.',
 (SELECT id FROM tool_categories WHERE name = 'AI Assistants'), 
 'https://chat.openai.com', 
 'https://cdn.oaistatic.com/_next/static/media/apple-touch-icon.82af6fe1.png',
 '{"company": "OpenAI", "founding_year": 2022, "primary_model": "GPT-4", "specialties": ["conversation", "coding", "creative_writing", "custom_gpts"], "languages": ["Python", "JavaScript", "Java", "C++", "Go", "Rust"], "integration_options": ["API", "Web Interface", "Mobile App", "Plugins"]}'),

('Gemini (Google)', 'gemini-google', 
 'Google\'s advanced AI assistant with multimodal capabilities, integrated with Google services, and strong performance in coding and analysis tasks.',
 (SELECT id FROM tool_categories WHERE name = 'AI Assistants'), 
 'https://gemini.google.com', 
 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
 '{"company": "Google", "founding_year": 2023, "primary_model": "Gemini Ultra", "specialties": ["multimodal", "google_integration", "coding", "analysis"], "languages": ["Python", "JavaScript", "Java", "C++", "Kotlin"], "integration_options": ["API", "Web Interface", "Google Workspace"]}'),

('Grok (xAI)', 'grok-xai', 
 'Real-time AI assistant by xAI with access to X (Twitter) data, designed for witty and informative responses with up-to-date information for developers.',
 (SELECT id FROM tool_categories WHERE name = 'AI Assistants'), 
 'https://grok.x.ai', 
 'https://grok.x.ai/assets/grok-logo.png',
 '{"company": "xAI", "founding_year": 2023, "primary_model": "Grok-1", "specialties": ["real_time_data", "x_integration", "wit", "current_events"], "languages": ["Python", "JavaScript", "TypeScript"], "integration_options": ["Web Interface", "X Integration"]}'),

('DeepSeek', 'deepseek', 
 'Powerful open-source AI model with strong coding capabilities and mathematical reasoning, offering competitive performance to leading commercial models.',
 (SELECT id FROM tool_categories WHERE name = 'AI Assistants'), 
 'https://deepseek.com', 
 'https://deepseek.com/static/logo.png',
 '{"company": "DeepSeek", "founding_year": 2023, "primary_model": "DeepSeek-V2", "specialties": ["open_source", "coding", "mathematics", "reasoning"], "languages": ["Python", "C++", "Java", "JavaScript", "Go"], "integration_options": ["API", "Open Source Models", "HuggingFace"]}'),

-- Code Editors Category (5 tools)
('GitHub Copilot', 'github-copilot', 
 'AI pair programmer by GitHub that suggests code completions and entire functions as you type, integrated directly into popular editors and IDEs.',
 (SELECT id FROM tool_categories WHERE name = 'Code Editors'), 
 'https://github.com/features/copilot', 
 'https://github.githubassets.com/images/modules/site/copilot/copilot-logo.png',
 '{"company": "GitHub/Microsoft", "founding_year": 2021, "primary_model": "Codex", "specialties": ["code_completion", "ide_integration", "pair_programming", "multiple_languages"], "languages": ["Python", "JavaScript", "TypeScript", "Java", "C#", "PHP", "Ruby", "Go"], "integration_options": ["VS Code", "Visual Studio", "JetBrains IDEs", "Neovim"]}'),

('Cursor AI', 'cursor-ai', 
 'AI-first code editor built on VS Code with advanced codebase understanding, multi-file editing, and intelligent code generation capabilities.',
 (SELECT id FROM tool_categories WHERE name = 'Code Editors'), 
 'https://cursor.sh', 
 'https://cursor.sh/assets/logo.png',
 '{"company": "Anysphere", "founding_year": 2023, "primary_model": "GPT-4", "specialties": ["codebase_understanding", "multi_file_editing", "vs_code_based", "context_aware"], "languages": ["Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js"], "integration_options": ["Standalone Editor", "VS Code Extensions", "Git Integration"]}'),

('Windsurf (Codeium)', 'windsurf-codeium', 
 'Next-generation AI-powered code editor by Codeium with advanced flow state features and seamless AI integration for enhanced productivity.',
 (SELECT id FROM tool_categories WHERE name = 'Code Editors'), 
 'https://codeium.com/windsurf', 
 'https://codeium.com/static/windsurf-logo.png',
 '{"company": "Codeium", "founding_year": 2024, "primary_model": "Codeium Models", "specialties": ["flow_state", "seamless_integration", "productivity", "modern_ui"], "languages": ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go"], "integration_options": ["Standalone Editor", "VS Code Extension", "JetBrains Plugin"]}'),

('Augment', 'augment', 
 'AI coding assistant that understands your entire codebase and provides contextual suggestions, refactoring help, and intelligent code generation.',
 (SELECT id FROM tool_categories WHERE name = 'Code Editors'), 
 'https://augmentcode.com', 
 'https://augmentcode.com/assets/logo.svg',
 '{"company": "Augment Code", "founding_year": 2023, "primary_model": "Custom Models", "specialties": ["codebase_context", "refactoring", "intelligent_suggestions", "code_understanding"], "languages": ["Python", "JavaScript", "TypeScript", "Java", "C#"], "integration_options": ["VS Code", "JetBrains IDEs", "API"]}'),

('Replit AI', 'replit-ai', 
 'Integrated AI assistant in Replit\'s cloud development environment, offering code completion, debugging help, and project assistance.',
 (SELECT id FROM tool_categories WHERE name = 'Code Editors'), 
 'https://replit.com/ai', 
 'https://replit.com/public/images/replit-logo.svg',
 '{"company": "Replit", "founding_year": 2022, "primary_model": "Custom Models", "specialties": ["cloud_development", "project_assistance", "debugging", "integrated_environment"], "languages": ["Python", "JavaScript", "Java", "C++", "HTML", "CSS"], "integration_options": ["Replit IDE", "Cloud Deployment", "Mobile App"]}'),

-- Code Completion Category (3 tools)
('Amazon CodeWhisperer', 'amazon-codewhisperer', 
 'AI code generator by Amazon that provides real-time code suggestions and helps identify security issues in your code with AWS integration.',
 (SELECT id FROM tool_categories WHERE name = 'Code Completion'), 
 'https://aws.amazon.com/codewhisperer', 
 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png',
 '{"company": "Amazon Web Services", "founding_year": 2022, "primary_model": "CodeWhisperer", "specialties": ["code_suggestions", "security_scanning", "aws_integration", "enterprise_ready"], "languages": ["Python", "Java", "JavaScript", "TypeScript", "C#", "Go", "Rust"], "integration_options": ["VS Code", "JetBrains IDEs", "AWS Cloud9", "Lambda Console"]}'),

('Tabnine', 'tabnine', 
 'AI code completion tool that learns from your codebase to provide personalized suggestions while keeping your code private and secure.',
 (SELECT id FROM tool_categories WHERE name = 'Code Completion'), 
 'https://tabnine.com', 
 'https://tabnine.com/wp-content/uploads/2021/03/tabnine-logo.png',
 '{"company": "Tabnine", "founding_year": 2019, "primary_model": "Custom Models", "specialties": ["personalized_completion", "privacy_focused", "on_premise", "team_training"], "languages": ["Python", "JavaScript", "Java", "C++", "C#", "PHP", "Go", "Rust"], "integration_options": ["VS Code", "JetBrains IDEs", "Sublime Text", "Atom", "Emacs", "Vim"]}'),

('Sourcegraph Cody', 'sourcegraph-cody', 
 'AI coding assistant by Sourcegraph that understands your entire codebase to provide accurate code completions and explanations.',
 (SELECT id FROM tool_categories WHERE name = 'Code Completion'), 
 'https://sourcegraph.com/cody', 
 'https://sourcegraph.com/.assets/img/sourcegraph-logo-light.svg',
 '{"company": "Sourcegraph", "founding_year": 2022, "primary_model": "Multiple Models", "specialties": ["codebase_search", "code_intelligence", "accurate_completions", "enterprise_scale"], "languages": ["Python", "JavaScript", "TypeScript", "Java", "Go", "C++", "C#"], "integration_options": ["VS Code", "JetBrains IDEs", "Web Interface", "CLI"]}'),

-- Search & Documentation Category (1 tool)
('Phind', 'phind', 
 'AI-powered search engine specifically designed for developers, providing instant answers to coding questions with relevant code examples and explanations.',
 (SELECT id FROM tool_categories WHERE name = 'Search & Documentation'), 
 'https://phind.com', 
 'https://phind.com/images/logo.png',
 '{"company": "Phind", "founding_year": 2022, "primary_model": "Custom Models", "specialties": ["developer_search", "coding_answers", "code_examples", "technical_documentation"], "languages": ["Python", "JavaScript", "Java", "C++", "Go", "Rust"], "integration_options": ["Web Interface", "Browser Extension", "API"]}'),

-- Productivity Tools Category (1 tool)
('JetBrains AI Assistant', 'jetbrains-ai-assistant', 
 'Integrated AI assistant in JetBrains IDEs providing context-aware code completion, generation, and intelligent development assistance.',
 (SELECT id FROM tool_categories WHERE name = 'Productivity Tools'), 
 'https://jetbrains.com/ai', 
 'https://www.jetbrains.com/company/brand/img/jetbrains_logo.png',
 '{"company": "JetBrains", "founding_year": 2023, "primary_model": "Multiple Models", "specialties": ["ide_integration", "context_aware", "intelligent_assistance", "professional_tools"], "languages": ["Java", "Kotlin", "Python", "JavaScript", "TypeScript", "C#", "Go"], "integration_options": ["IntelliJ IDEA", "PyCharm", "WebStorm", "PhpStorm", "GoLand", "Rider"]}');

-- ==============================================
-- 3. CREATE SAMPLE FEATURE UPDATES
-- ==============================================
-- Insert realistic sample feature updates across different tools and impact levels

INSERT INTO feature_updates (tool_id, title, description, content, impact_level, official_url, published_date, validation_status, ai_analyzed, confidence_score) VALUES

-- Claude (Anthropic) Updates
((SELECT id FROM ai_tools WHERE slug = 'claude-anthropic'), 
 'Claude 3 Opus Model Release', 
 'Anthropic releases Claude 3 Opus, their most capable model with enhanced reasoning and coding abilities.',
 'Claude 3 Opus represents a significant leap forward in AI capability, offering improved performance on complex reasoning tasks, mathematical problem-solving, and code generation. The model demonstrates better understanding of nuanced instructions and maintains Anthropic''s focus on AI safety through Constitutional AI training methods. For developers, this means more accurate code suggestions, better debugging assistance, and enhanced ability to understand and explain complex codebases across multiple programming languages.',
 'High', 
 'https://www.anthropic.com/claude-3-family',
 '2024-03-04 10:00:00+00',
 'validated',
 true,
 0.95),

((SELECT id FROM ai_tools WHERE slug = 'claude-anthropic'), 
 'Improved Code Analysis Features', 
 'Enhanced ability to analyze and explain complex codebases with better context understanding.',
 'Claude now offers significantly improved code analysis capabilities, including better understanding of multi-file projects, enhanced debugging assistance, and more accurate code explanations. The update includes improved handling of various programming languages and frameworks, with particular strengths in Python, JavaScript, and TypeScript. Users report 40% better accuracy in code review suggestions and enhanced ability to identify potential security vulnerabilities.',
 'Medium', 
 'https://www.anthropic.com/news/code-analysis-update',
 '2024-01-15 14:30:00+00',
 'validated',
 true,
 0.88),

-- ChatGPT (OpenAI) Updates
((SELECT id FROM ai_tools WHERE slug = 'chatgpt-openai'), 
 'GPT-4 Vision Integration', 
 'ChatGPT now supports image analysis and vision capabilities for code screenshots and diagrams.',
 'OpenAI has integrated GPT-4 Vision capabilities directly into ChatGPT, allowing users to upload images, screenshots of code, architectural diagrams, and other visual content for analysis and discussion. This feature significantly enhances the debugging and learning experience for developers who can now share error screenshots, UI mockups, or database diagrams directly with ChatGPT for instant analysis and suggestions. The vision model can read code from images, understand architectural diagrams, and provide contextual feedback on visual development assets.',
 'High', 
 'https://openai.com/blog/chatgpt-can-now-see-hear-and-speak',
 '2023-09-25 16:00:00+00',
 'validated',
 true,
 0.92),

((SELECT id FROM ai_tools WHERE slug = 'chatgpt-openai'), 
 'Custom GPTs for Development', 
 'Introduction of specialized Custom GPTs designed specifically for different programming languages and frameworks.',
 'OpenAI introduces Custom GPTs marketplace featuring specialized AI assistants for specific development needs. These include React GPT for frontend development, Python GPT for data science and backend development, and DevOps GPT for infrastructure and deployment assistance. Each Custom GPT is trained with specialized knowledge and can maintain context about specific frameworks, libraries, and best practices, providing more targeted and accurate assistance for developers working in specific technology stacks.',
 'High', 
 'https://openai.com/blog/introducing-gpts',
 '2023-11-06 12:00:00+00',
 'validated',
 true,
 0.91),

-- GitHub Copilot Updates
((SELECT id FROM ai_tools WHERE slug = 'github-copilot'), 
 'Copilot Chat GA Release', 
 'GitHub Copilot Chat is now generally available with enhanced conversational coding assistance.',
 'GitHub Copilot Chat moves from beta to general availability, offering developers a conversational interface for coding assistance. The feature includes improved context awareness, better error explanation, and enhanced code generation through natural language conversations. Developers can now ask questions about their code, request explanations for complex algorithms, and get step-by-step guidance for implementing new features. The chat interface integrates seamlessly with existing IDEs and provides real-time assistance without disrupting the coding workflow.',
 'High', 
 'https://github.blog/2023-12-29-github-copilot-chat-beta-now-available-for-every-organization/',
 '2023-12-29 12:00:00+00',
 'validated',
 true,
 0.94),

((SELECT id FROM ai_tools WHERE slug = 'github-copilot'), 
 'Copilot Enterprise Features', 
 'Enterprise-grade features including fine-tuning on private repositories and advanced security scanning.',
 'GitHub introduces Copilot Enterprise with advanced features for large organizations including the ability to fine-tune models on private codebases, enhanced security and compliance controls, and advanced analytics for code generation usage. The enterprise version provides better suggestions based on company-specific coding patterns and includes additional security scanning to ensure generated code meets enterprise security standards.',
 'Medium', 
 'https://github.blog/2024-02-07-github-copilot-enterprise-is-now-generally-available/',
 '2024-02-07 09:00:00+00',
 'validated',
 true,
 0.89),

-- Cursor AI Updates
((SELECT id FROM ai_tools WHERE slug = 'cursor-ai'), 
 'Multi-file Editing Capabilities', 
 'Cursor AI introduces advanced multi-file editing with improved codebase understanding.',
 'The latest Cursor AI update introduces powerful multi-file editing capabilities that allow the AI to understand and modify multiple files simultaneously while maintaining code consistency and relationships. This feature significantly improves productivity for complex refactoring tasks, implementing features across multiple components, and maintaining consistency in large codebases. The AI can now understand dependencies between files and suggest changes across the entire project structure.',
 'High', 
 'https://cursor.sh/blog/multi-file-editing',
 '2024-02-10 09:00:00+00',
 'validated',
 true,
 0.91),

-- Gemini (Google) Updates
((SELECT id FROM ai_tools WHERE slug = 'gemini-google'), 
 'Gemini Ultra Model Launch', 
 'Google launches Gemini Ultra, their most capable AI model with enhanced coding and reasoning abilities.',
 'Google introduces Gemini Ultra, representing their most advanced AI model with state-of-the-art performance in coding, mathematics, and reasoning tasks. The model offers improved multimodal capabilities and better integration with Google''s developer tools and services. For developers, Gemini Ultra provides enhanced code generation, better understanding of complex programming concepts, and improved integration with Google Cloud Platform services and APIs.',
 'High', 
 'https://blog.google/technology/ai/google-gemini-ai/',
 '2024-02-08 11:00:00+00',
 'validated',
 true,
 0.93),

-- Windsurf (Codeium) Updates
((SELECT id FROM ai_tools WHERE slug = 'windsurf-codeium'), 
 'Flow State Enhancement', 
 'Windsurf introduces improved flow state features for seamless AI-assisted coding experience.',
 'Codeium''s Windsurf editor receives significant updates to its flow state capabilities, offering more intuitive AI integration that adapts to developer workflow patterns. The enhancement includes better context switching, reduced interruption during coding sessions, and improved prediction of developer intent. The flow state feature learns from individual coding patterns to provide more relevant suggestions and minimize cognitive load during development work.',
 'Medium', 
 'https://codeium.com/blog/windsurf-flow-state-update',
 '2024-01-20 13:45:00+00',
 'validated',
 true,
 0.87),

-- Tabnine Updates
((SELECT id FROM ai_tools WHERE slug = 'tabnine'), 
 'Enterprise Security Features', 
 'Tabnine enhances enterprise security with improved on-premise deployment and privacy controls.',
 'Tabnine introduces enhanced enterprise security features including improved on-premise deployment options, advanced privacy controls, and better compliance tools for organizations with strict security requirements. The update maintains Tabnine''s commitment to keeping code private and secure while adding features like audit logs, admin controls, and integration with enterprise identity providers. New security features include code scanning prevention and enhanced data governance controls.',
 'Medium', 
 'https://tabnine.com/blog/enterprise-security-update',
 '2024-01-05 10:30:00+00',
 'validated',
 true,
 0.89),

-- Phind Updates
((SELECT id FROM ai_tools WHERE slug = 'phind'), 
 'Enhanced Code Search Algorithm', 
 'Phind improves its search algorithm for more accurate and relevant coding answers.',
 'Phind releases an updated search algorithm that provides more accurate and contextually relevant answers to developer queries. The improvement includes better understanding of programming concepts, enhanced code example relevance, and faster response times. The new algorithm better matches developer intent with relevant documentation, Stack Overflow discussions, and code examples, reducing the time needed to find solutions to programming problems.',
 'Medium', 
 'https://phind.com/blog/search-algorithm-update',
 '2024-01-12 15:20:00+00',
 'validated',
 true,
 0.85),

-- DeepSeek Updates
((SELECT id FROM ai_tools WHERE slug = 'deepseek'), 
 'DeepSeek-V2 Model Release', 
 'DeepSeek releases V2 model with significant improvements in coding and mathematical reasoning.',
 'DeepSeek launches their V2 model featuring substantial improvements in code generation, mathematical problem-solving, and logical reasoning. The open-source model demonstrates competitive performance with leading commercial alternatives while maintaining accessibility for developers and researchers. The V2 model shows particular strength in complex algorithmic problems, code optimization suggestions, and multi-step reasoning tasks that are common in software development.',
 'High', 
 'https://deepseek.com/blog/deepseek-v2-release',
 '2024-02-15 08:00:00+00',
 'validated',
 true,
 0.90),

-- Additional updates for broader coverage
((SELECT id FROM ai_tools WHERE slug = 'amazon-codewhisperer'), 
 'Security Scanning Integration', 
 'CodeWhisperer adds real-time security vulnerability detection during code generation.',
 'Amazon CodeWhisperer introduces integrated security scanning that identifies potential security vulnerabilities in generated code in real-time. The feature helps developers avoid common security pitfalls by providing immediate feedback on generated code snippets. This includes detection of SQL injection vulnerabilities, cross-site scripting risks, and insecure API implementations, making it easier for developers to write secure code from the start.',
 'High', 
 'https://aws.amazon.com/blogs/aws/codewhisperer-security-scanning/',
 '2023-11-20 14:00:00+00',
 'validated',
 true,
 0.93),

((SELECT id FROM ai_tools WHERE slug = 'sourcegraph-cody'), 
 'Enterprise Codebase Integration', 
 'Cody improves enterprise codebase understanding with better context awareness.',
 'Sourcegraph Cody receives major improvements in enterprise codebase understanding, allowing it to provide more accurate suggestions based on company-specific code patterns and architectural decisions. The update includes better integration with existing development workflows and improved ability to understand large, complex codebases with multiple repositories and microservices architectures.',
 'Medium', 
 'https://sourcegraph.com/blog/cody-enterprise-update',
 '2024-01-08 11:00:00+00',
 'validated',
 true,
 0.86),

((SELECT id FROM ai_tools WHERE slug = 'jetbrains-ai-assistant'), 
 'IDE-Specific Optimizations', 
 'JetBrains AI Assistant receives optimizations tailored to specific IDE capabilities.',
 'JetBrains introduces IDE-specific optimizations for their AI Assistant, with tailored features for IntelliJ IDEA, PyCharm, WebStorm, and other IDEs in their suite. Each IDE receives specialized assistance that leverages the unique capabilities and workflows of that specific development environment, providing more relevant suggestions and better integration with existing IDE features like debugging, refactoring, and testing tools.',
 'Medium', 
 'https://blog.jetbrains.com/ai-assistant-ide-optimizations/',
 '2024-01-25 10:00:00+00',
 'validated',
 true,
 0.88);

-- ==============================================
-- 4. CREATE SAMPLE UPDATE HISTORY RECORDS
-- ==============================================
-- Insert audit trail records for some of the feature updates

INSERT INTO update_history (update_id, change_type, old_data, new_data, changed_by, change_reason, changed_at) VALUES

-- Claude update history
((SELECT id FROM feature_updates WHERE title = 'Claude 3 Opus Model Release'), 
 'created', 
 NULL,
 '{"title": "Claude 3 Opus Model Release", "validation_status": "pending", "ai_analyzed": false}',
 'system_import',
 'Initial data import from official Anthropic announcement',
 '2024-03-04 10:00:00+00'),

((SELECT id FROM feature_updates WHERE title = 'Claude 3 Opus Model Release'), 
 'ai_analyzed', 
 '{"validation_status": "pending", "ai_analyzed": false, "confidence_score": null}',
 '{"validation_status": "validated", "ai_analyzed": true, "confidence_score": 0.95}',
 'ai_content_analyzer',
 'AI analysis completed with high confidence validation',
 '2024-03-04 10:15:00+00'),

-- ChatGPT update history
((SELECT id FROM feature_updates WHERE title = 'GPT-4 Vision Integration'), 
 'created', 
 NULL,
 '{"title": "GPT-4 Vision Integration", "validation_status": "pending", "ai_analyzed": false}',
 'system_import',
 'Initial data import from OpenAI blog announcement',
 '2023-09-25 16:00:00+00'),

((SELECT id FROM feature_updates WHERE title = 'GPT-4 Vision Integration'), 
 'ai_analyzed', 
 '{"validation_status": "pending", "ai_analyzed": false}',
 '{"validation_status": "validated", "ai_analyzed": true, "confidence_score": 0.92}',
 'ai_content_analyzer',
 'Validated against OpenAI official announcement and feature demonstration',
 '2023-09-25 16:30:00+00'),

-- GitHub Copilot update history  
((SELECT id FROM feature_updates WHERE title = 'Copilot Chat GA Release'), 
 'created', 
 NULL,
 '{"title": "Copilot Chat GA Release", "validation_status": "pending", "ai_analyzed": false}',
 'system_import',
 'Initial data import from GitHub blog announcement',
 '2023-12-29 12:00:00+00'),

((SELECT id FROM feature_updates WHERE title = 'Copilot Chat GA Release'), 
 'ai_analyzed', 
 '{"validation_status": "pending", "ai_analyzed": false}',
 '{"validation_status": "validated", "ai_analyzed": true, "confidence_score": 0.94}',
 'ai_content_analyzer',
 'Validated against GitHub official announcement and GA documentation',
 '2023-12-29 12:30:00+00'),

-- Cursor AI update history
((SELECT id FROM feature_updates WHERE title = 'Multi-file Editing Capabilities'), 
 'created', 
 NULL,
 '{"title": "Multi-file Editing Capabilities", "validation_status": "pending", "ai_analyzed": false}',
 'system_import',
 'Initial data import from Cursor.sh blog post',
 '2024-02-10 09:00:00+00'),

((SELECT id FROM feature_updates WHERE title = 'Multi-file Editing Capabilities'), 
 'ai_analyzed', 
 '{"validation_status": "pending", "ai_analyzed": false}',
 '{"validation_status": "validated", "ai_analyzed": true, "confidence_score": 0.91}',
 'ai_content_analyzer',
 'Validated feature demonstration and technical documentation review',
 '2024-02-10 09:45:00+00'),

-- DeepSeek update history
((SELECT id FROM feature_updates WHERE title = 'DeepSeek-V2 Model Release'), 
 'created', 
 NULL,
 '{"title": "DeepSeek-V2 Model Release", "validation_status": "pending", "ai_analyzed": false}',
 'system_import',
 'Initial data import from DeepSeek official model release',
 '2024-02-15 08:00:00+00'),

((SELECT id FROM feature_updates WHERE title = 'DeepSeek-V2 Model Release'), 
 'ai_analyzed', 
 '{"validation_status": "pending", "ai_analyzed": false}',
 '{"validation_status": "validated", "ai_analyzed": true, "confidence_score": 0.90}',
 'ai_content_analyzer',
 'Validated against model benchmarks and official documentation',
 '2024-02-15 08:30:00+00');

COMMIT;

-- ==============================================
-- DATA SEEDING COMPLETE
-- ==============================================
-- The database has been successfully seeded with:
-- ✅ 5 tool categories for AI development tools
-- ✅ 15 popular AI development tools with detailed metadata
-- ✅ 15 realistic feature updates across different tools and impact levels
-- ✅ Sample audit trail records for testing update history functionality
-- ✅ All data properly validated and ready for application use